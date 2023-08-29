module.exports = {
  apps: [
    {
      name: "Bean Cafe",
      cron_restart: "0 0 * * *",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 80",
      exec_mode: "cluster",
      instances: "max",
    },
  ],
};
