module.exports = {
  apps: [
    {
      name: "app",
      script: "./www/app.js",
      instances: 3,
      autorestart: true,
      watch: false,
      max_memory_restart: "200M",
      env_production: {
        NODE_ENV: "production",
      },
      error_file: "/logs/err.log",
    },
  ],
};
