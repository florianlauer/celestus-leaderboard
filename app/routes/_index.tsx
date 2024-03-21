import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
  capitalize,
} from "@mui/material";
import type { MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import "chart.js/auto";
import "chartjs-adapter-luxon";
import { useState } from "react";
import { ClientOnly } from "remix-utils/client-only";
import { GlobalRdChart } from "~/components/GlobalRdChart.client";
import { getDates, getRowsValues } from "~/data";
import {
  Faction,
  Player,
  colorsByFaction,
  factions,
  getPlayerDisplayName,
} from "~/models/player";
import { Menu as MenuIcon } from "@mui/icons-material";

export const meta: MetaFunction = () => {
  return [
    { title: "Celestus Leaderboard" },
    { name: "description", content: "Celestus leaderboard" },
  ];
};

export const loader = async () => {
  const rows = await getRowsValues();
  const dates = await getDates();
  return json({ rows, dates });
};

const drawerWidth = 240;
const navItems = ["Home", "About", "Contact"];

export default function Index() {
  const { rows: players, dates } = useLoaderData<typeof loader>();
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [selectedFactions, setSelectedFactions] = useState<Faction[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // const container =
  //   window !== undefined ? () => window.document.body : undefined;

  return (
    <div
      style={{ fontFamily: "Roboto, system-ui, sans-serif", lineHeight: "1.8" }}
    >
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            MUI
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: "#fff" }}>
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          // container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        <Autocomplete
          multiple
          options={factions}
          getOptionLabel={(faction) => capitalize(faction)}
          isOptionEqualToValue={(faction, value) => faction === value}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Factions"
              placeholder="Chercher une faction"
            />
          )}
          renderTags={(value: readonly Faction[], getTagProps) =>
            value.map((faction: Faction, index: number) => (
              <Chip
                color={colorsByFaction[faction]}
                label={capitalize(faction)}
                {...getTagProps({ index })}
                key={faction}
              />
            ))
          }
          onChange={(_, selectedOptions) => {
            setSelectedFactions(selectedOptions);
          }}
        />
        <Autocomplete
          multiple
          options={players}
          getOptionLabel={(player) => getPlayerDisplayName(player)}
          isOptionEqualToValue={(player, value) => player.name === value.name}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Joueurs"
              placeholder="Chercher un joueur"
            />
          )}
          renderTags={(value: readonly Player[], getTagProps) =>
            value.map((option: Player, index: number) => (
              <Chip
                color={colorsByFaction[option.faction]}
                label={getPlayerDisplayName(option)}
                {...getTagProps({ index })}
                key={option.name}
              />
            ))
          }
          onChange={(_, selectedOptions) => {
            setSelectedPlayers(selectedOptions);
          }}
        />
        <ClientOnly>
          {() => (
            <GlobalRdChart
              allPlayers={players}
              dates={dates}
              selectedPlayers={selectedPlayers}
              selectedFactions={selectedFactions}
            />
          )}
        </ClientOnly>
      </Box>
    </div>
  );
}
