import { Autocomplete, Chip, TextField, Typography } from "@mui/material";
import type { MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Chart, ChartConfiguration, ChartData, ChartDataset } from "chart.js";
import "chart.js/auto";
import "chartjs-adapter-luxon";
import { DateTime } from "luxon";
import { useEffect, useMemo, useRef, useState } from "react";
import { getDates, getRowsValues } from "~/data";
import { Player, colorsByFaction, getPlayerDisplayName } from "~/models/player";
import { theme } from "~/root";
import style from "../mainStyle.module.css";

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

const formatDisplay = (value: number) => {
  return Number((value / 1000000000000).toFixed(2));
};
export default function Index() {
  const { rows: players } = useLoaderData<typeof loader>();
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  console.log(selectedPlayers);

  return (
    <div
      style={{ fontFamily: "Roboto, system-ui, sans-serif", lineHeight: "1.8" }}
    >
      <Typography variant="h3" gutterBottom>
        Welcome to Celestus Leaderboard
      </Typography>
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
      <ChartContainer selectedPlayers={selectedPlayers} />
    </div>
  );
}

type ChartContainerProps = {
  selectedPlayers: Player[];
};

const ChartContainer = ({ selectedPlayers }: ChartContainerProps) => {
  const { rows: players, dates } = useLoaderData<typeof loader>();
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  const displayedPlayers = useMemo(() => {
    if (selectedPlayers.length === 0) return players;
    return players.filter((player) => {
      return selectedPlayers.some((selectedPlayer) => {
        return selectedPlayer.name === player.name;
      });
    });
  }, [players, selectedPlayers]);

  const datasets = useMemo(() => {
    return displayedPlayers.map((row) => ({
      label: row.name,
      data: row.rdValues.map((value, index) => {
        return {
          x: DateTime.fromFormat(dates[index], "dd/MM/yyyy").toMillis(),
          y: formatDisplay(value),
        };
      }),
      borderColor: theme.palette[row.faction].main,
    })) as ChartDataset[];
  }, [dates, displayedPlayers]);

  useEffect(() => {
    if (chartCanvasRef.current == null) return;

    const res = dates.map((date) => {
      return DateTime.fromFormat(date, "dd/MM/yyyy").toJSDate();
    });

    const chartData: ChartData = {
      labels: res,
      datasets: datasets,
    };

    const chartConfig: ChartConfiguration = {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: "RD (P)",
            },
          },
          x: {
            type: "time",
            time: {
              unit: "day",
              displayFormats: {
                day: "dd/MM/yyyy",
              },
            },
            title: {
              display: true,
              text: "Date",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
            fullSize: true,
            position: "bottom",
          },
          title: {
            display: true,
            text: "Évolution des RD des joueurs",
          },
        },
      },
    };

    const chart = new Chart(chartCanvasRef.current, chartConfig);

    chartRef.current = chart;

    return () => {
      chart.destroy();
    };
  }, [datasets, dates, displayedPlayers]);

  return (
    <div className={style.chartWrapper}>
      <canvas height={300} className={style.chartCanvas} ref={chartCanvasRef} />
    </div>
  );
};
