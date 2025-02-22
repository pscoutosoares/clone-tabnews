const { spawn } = require("node:child_process");
const WINDOWS_PLATFORM_NAME = "win32";
spawn("next dev", { stdio: "inherit", shell: true });

function gracefulShutdown() {
  console.log("\nTentando desligar de forma graciosa...");
  const subprocess = spawn("npm run services:stop", {
    detached: process.platform == WINDOWS_PLATFORM_NAME,
    shell: true,
    windowsHide: true,
    stdio: "ignore",
  });
  subprocess.unref();
  process.exit();
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
