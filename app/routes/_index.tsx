import type { MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Chart, ChartConfiguration, ChartData, ChartDataset } from "chart.js";

import { DateTime } from "luxon";
import { useEffect, useMemo, useRef } from "react";
import { getRows } from "~/data";
import "chart.js/auto";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  const rows = await getRows();
  return json({ rows });
};

const formatDisplay = (value: number) => {
  return (value / 1000000000000).toFixed(2);
};
export default function Index() {
  const { rows } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Celestus Leaderboard</h1>
      <ChartContainer />
      {rows.map((row) => (
        <div key={row.name}>
          {row.name} -
          {row.rdValues.map((value, index) => (
            <p key={row.name + index}>{formatDisplay(value)}</p>
          ))}
        </div>
      ))}
    </div>
  );
}

const ChartContainer = () => {
  const { rows } = useLoaderData<typeof loader>();
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  // const datasets: ChartDataset[] = useMemo(() => {
  //   return [
  //     rows.map((row) => ({
  //       label: row.name,
  //       data: row.rdValues.map((value) => formatDisplay(value)),
  //     })),
  //   ];
  // }, [rows]);

  // console.log(datasets);

  useEffect(() => {
    if (chartCanvasRef.current == null) return;

    const existingChart = chartRef.current;
    if (existingChart) {
      console.log("here destroy");
      existingChart.destroy();
    }

    const res = rows[0].dateValues.map((date) => {
      const d = DateTime.fromFormat(date, "dd/MM/yyyy").toJSDate();
      console.log("date", d);
      return d;
    });

    const chartData: ChartData = {
      labels: res,
      datasets: [],
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
              text: "RD joueur",
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
      },
    };

    const data = [
      { year: 2010, count: 10 },
      { year: 2011, count: 20 },
      { year: 2012, count: 15 },
      { year: 2013, count: 25 },
      { year: 2014, count: 22 },
      { year: 2015, count: 30 },
      { year: 2016, count: 28 },
    ];

    const config: ChartConfiguration = {
      type: "bar",
      data: {
        labels: data.map((row) => row.year),
        datasets: [
          {
            label: "Acquisitions by year",
            data: data.map((row) => row.count),
          },
        ],
      },
    };

    const chart = new Chart(chartCanvasRef.current, config);

    chartRef.current = chart;

    return () => {
      console.log("destroy");
      chart.destroy();
    };
  }, [rows]);

  return (
    <div style={{ height: "800px" }}>
      <canvas style={{ height: "100%", width: "100%" }} ref={chartCanvasRef} />
    </div>
  );
};
