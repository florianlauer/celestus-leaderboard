import {
  Chart,
  ChartConfiguration,
  ChartData,
  ChartDataset,
  registerables,
} from "chart.js";
import { DateTime } from "luxon";
import { useEffect, useMemo, useRef } from "react";
import { Faction, Player } from "~/models/player";
import { theme } from "~/root";
import style from "../mainStyle.module.css";
import zoomPlugin from "chartjs-plugin-zoom";

const formatDisplay = (value: number) => {
  return Number((value / 1000000000000).toFixed(2));
};

type GlobalRdChartProps = {
  dates: string[];
  allPlayers: Player[];
  selectedPlayers: Player[];
  selectedFactions: Faction[];
};

export const GlobalRdChart = ({
  dates,
  allPlayers,
  selectedFactions,
  selectedPlayers,
}: GlobalRdChartProps) => {
  return (
    // <ClientOnly>
    //   {() => (

    <ChartContainer
      dates={dates}
      allPlayers={allPlayers}
      selectedPlayers={selectedPlayers}
      selectedFactions={selectedFactions}
    />

    //   )}
    // </ClientOnly>
  );
};

type ChartContainerProps = {
  dates: string[];
  allPlayers: Player[];
  selectedPlayers: Player[];
  selectedFactions: Faction[];
};

const ChartContainer = ({
  dates,
  allPlayers: players,
  selectedPlayers,
  selectedFactions,
}: ChartContainerProps) => {
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  const displayedPlayers = useMemo(() => {
    if (selectedPlayers.length === 0 && selectedFactions.length === 0)
      return players;
    return players.filter((player) => {
      return (
        selectedPlayers.some((selectedPlayer) => {
          return selectedPlayer.name === player.name;
        }) ||
        selectedFactions.some((selectedFaction) => {
          return selectedFaction === player.faction;
        })
      );
    });
  }, [players, selectedFactions, selectedPlayers]);

  const datasets = useMemo(() => {
    return displayedPlayers.map((row) => {
      return {
        label: row.name,
        data: row.rdValues.map((value, index) => {
          return {
            x: DateTime.fromFormat(dates[index], "dd/MM/yyyy").toMillis(),
            y: formatDisplay(value),
          };
        }),
        borderColor: theme.palette[row.faction]?.main,
      };
    }) as ChartDataset[];
  }, [dates, displayedPlayers]);

  useEffect(() => {
    Chart.register(...(registerables ?? []), zoomPlugin);
  }, []);

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
        maintainAspectRatio: false,
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
          zoom: {
            pan: {
              enabled: true,
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: "xy",
            },
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
    <>
      {/* <MenuIcon /> */}
      <div className={style.chartWrapper}>
        <canvas className={style.chartCanvas} ref={chartCanvasRef} />
      </div>
    </>
  );
};
