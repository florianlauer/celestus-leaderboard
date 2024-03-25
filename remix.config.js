/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
  serverDependenciesToBundle: [
    // "@mui/material",
    // "@mui/icons-material",
    // "@mui/icons-material/Menu"
    /^@mui.*/,
    /^@babel\/runtime.*/,
    // /^react\/jsx-runtime*/,
  ],
};
