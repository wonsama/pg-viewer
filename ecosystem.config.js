module.exports = {
  apps: [
    {
      name: "pg-viewer",
      script: "./bin/www",
      // log_date_format: "YYYY-MM-DD HH:mm:ss",
      // cron_restart: "0 0 * * *", // 해당 SYSTEM TIME 기준 매 00:00 시 재기동 되도록 설정
    },
  ],
};
