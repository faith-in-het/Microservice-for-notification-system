import cron from "node-cron";
import { generateAndSendDigests } from "./controllers/digest.js";

// Schedule to run every day at midnight IST
// IST is UTC+5:30, so midnight IST is 18:30 UTC
cron.schedule(
  "30 18 * * *",
  () => {
    console.log("Running daily digest job...");
    generateAndSendDigests();
  },
  {
    scheduled: true,
    timezone: "UTC",
  }
);

console.log("Cron job scheduled for daily digests.");
