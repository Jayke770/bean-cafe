module.exports = {
  apps: [
    {
      name: "Bean Cafe",
      cron_restart: "0 0 * * *",
      script: ".next/standalone/server.js",
      exec_mode: "cluster",
      instances: "max",
      env_production: {
        NODE_ENV: "production",
        NEXTAUTH_SECRET: "",
        NEXTAUTH_URL: "",
        GOOGLE_CLIENT_ID: "",
        GOOGLE_CLIENT_SECRET: "",
        MONGODB_URI: "mongodb://127.0.0.1:27017/bean-cafe",
        PORT: 80,
      },
    },
  ],
};
