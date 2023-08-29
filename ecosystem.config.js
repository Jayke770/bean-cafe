module.exports = {
  apps: [
    {
      name: "Bean Cafe",
      cron_restart: "0 0 * * *",
      script: ".next/standalone/server.js",
      exec_mode: "cluster",
      instances: "max",
    },
  ],
};
