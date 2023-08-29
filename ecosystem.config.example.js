module.exports = {
  apps: [
    {
      name: "Bean Cafe",
      cron_restart: "0 0 * * *",
      script: ".next/standalone/server.js",
      exec_mode: "cluster",
      instances: "max",
      env_production: {
        NEXTAUTH_SECRET: "b40c3dd816b8e2d2d0820902b4ea1235",
        NEXTAUTH_URL: "http://www.beancafe.store",
        GOOGLE_CLIENT_ID: "",
        GOOGLE_CLIENT_SECRET: "",
        MONGODB_URI: "mongodb://127.0.0.1:27017/bean-cafe",
        PORT: 80,
      },
    },
  ],
};
