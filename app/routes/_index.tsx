import {
  Autocomplete,
  Chip,
  TextField,
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

export default function Index() {
  const { rows: players, dates } = useLoaderData<typeof loader>();
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [selectedFactions, setSelectedFactions] = useState<Faction[]>([]);

  return (
    <div
      style={{ fontFamily: "Roboto, system-ui, sans-serif", lineHeight: "1.8" }}
    >
      <Typography variant="h3" gutterBottom>
        Welcome to Celestus Leaderboard
      </Typography>
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
    </div>
  );
}
