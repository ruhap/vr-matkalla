import cron from "node-cron";

export const job = cron.schedule("* * * * *", () => {
  console.log("running a task every minute");
});
