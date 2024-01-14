import type { MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Chart, ChartConfiguration, ChartData, ChartDataset } from "chart.js";
import { DateTime } from "luxon";
import { useEffect, useMemo, useRef } from "react";
import { getDates, getRowsValues } from "~/data";
import "chart.js/auto";
import "chartjs-adapter-luxon";
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
  const { rows } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Celestus Leaderboard</h1>
      <ChartContainer />
      {rows.map((row) => (
        <div key={row.name}>
          {`${row.name} [${row.alliance}] (${row.faction})`} -
          {row.rdValues.map((value, index) => (
            <p key={index}>{formatDisplay(value)}</p>
          ))}
        </div>
      ))}
    </div>
  );
}

const ChartContainer = () => {
  const { rows, dates } = useLoaderData<typeof loader>();
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  const datasets = useMemo(() => {
    return rows.map((row) => ({
      // label: row.name,
      // data: row.rdValues.map((value) => formatDisplay(value)),
      label: row.name,
      data: row.rdValues.map((value, index) => {
        return {
          x: DateTime.fromFormat(dates[index], "dd/MM/yyyy").toMillis(),
          y: formatDisplay(value),
        };
      }),
    })) as ChartDataset[];
  }, [dates, rows]);

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

    // const data = [
    //   { year: 2010, count: 10 },
    //   { year: 2011, count: 20 },
    //   { year: 2012, count: 15 },
    //   { year: 2013, count: 25 },
    //   { year: 2014, count: 22 },
    //   { year: 2015, count: 30 },
    //   { year: 2016, count: 28 },
    // ];

    // const config: ChartConfiguration = {
    //   type: "bar",
    //   data: {
    //     labels: data.map((row) => row.year),
    //     datasets: [
    //       {
    //         label: "Acquisitions by year",
    //         data: data.map((row) => row.count),
    //       },
    //     ],
    //   },
    // };

    // const chart = new Chart(chartCanvasRef.current, config);
    const chart = new Chart(chartCanvasRef.current, chartConfig);

    chartRef.current = chart;

    return () => {
      chart.destroy();
    };
  }, [datasets, dates, rows]);

  return (
    <div className={style.chartWrapper}>
      <canvas height={300} className={style.chartCanvas} ref={chartCanvasRef} />
    </div>
  );
};
