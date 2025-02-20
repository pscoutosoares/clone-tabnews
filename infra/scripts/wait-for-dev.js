const { spawn } = require("node:child_process");

spawn("next dev", { stdio: "inherit", shell: true });

function gracefulShutdown() {
  spawn("npm run services:stop", {
    detached: true,
    shell: true,
    windowsHide: true,
  });
  process.exit();
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
