import { ThemeProvider } from "@emotion/react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
  ThemeOptions,
  alpha,
  createTheme,
  getContrastRatio,
} from "@mui/material";
import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import style from "./mainStyle.module.css";

declare module "@mui/material/styles" {
  interface Palette {
    melrehns: Palette["primary"];
    thelios: Palette["primary"];
    zetran: Palette["primary"];
    ducaux: Palette["primary"];
    leanths: Palette["primary"];
    amaranths: Palette["primary"];
    rca: Palette["primary"];
  }

  interface PaletteOptions {
    melrehns?: PaletteOptions["primary"];
    thelios?: PaletteOptions["primary"];
    zetran?: PaletteOptions["primary"];
    ducaux?: PaletteOptions["primary"];
    leanths?: PaletteOptions["primary"];
    amaranths?: PaletteOptions["primary"];
    rca?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsColorOverrides {
    melrehns: true;
    thelios: true;
    zetran: true;
    ducaux: true;
    leanths: true;
    amaranths: true;
    rca: true;
  }
}

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#12181e",
    },
    secondary: {
      main: "#f4cd92",
    },
  },
};

export const theme = createTheme(themeOptions, {
  palette: {
    melrehns: {
      main: "#500289",
      light: alpha("#500289", 0.5),
      dark: alpha("#500289", 0.9),
      contrastText: getContrastRatio("#500289", "#fff") > 4.5 ? "#fff" : "#111",
    },
    thelios: {
      main: "#0047a4",
      light: alpha("#0047a4", 0.5),
      dark: alpha("#0047a4", 0.9),
      contrastText: getContrastRatio("#0047a4", "#fff") > 4.5 ? "#fff" : "#111",
    },
    zetran: {
      main: "#ee0000",
      light: alpha("#ee0000", 0.5),
      dark: alpha("#ee0000", 0.9),
      contrastText: getContrastRatio("#ee0000", "#fff") > 4.5 ? "#fff" : "#111",
    },
    ducaux: {
      main: "#e3ae00",
      light: alpha("#e3ae00", 0.5),
      dark: alpha("#e3ae00", 0.9),
      contrastText: getContrastRatio("#e3ae00", "#fff") > 4.5 ? "#fff" : "#111",
    },
    leanths: {
      main: "#008829",
      light: alpha("#008829", 0.5),
      dark: alpha("#008829", 0.9),
      contrastText: getContrastRatio("#008829", "#fff") > 4.5 ? "#fff" : "#111",
    },
    amaranths: {
      main: "#058ede",
      light: alpha("#058ede", 0.5),
      dark: alpha("#058ede", 0.9),
      contrastText: getContrastRatio("#058ede", "#fff") > 4.5 ? "#fff" : "#111",
    },
    rca: {
      main: "#757777",
      light: alpha("#757777", 0.5),
      dark: alpha("#757777", 0.9),
      contrastText: getContrastRatio("#757777", "#fff") > 4.5 ? "#fff" : "#111",
    },
  },
});

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body className={style.root}>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </ThemeProvider>
  );
}

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
