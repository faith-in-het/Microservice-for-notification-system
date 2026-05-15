import cron from "node-cron";
import { generateAndSendDigests } from "./controllers/digest.js";
import { processJobs } from "./controllers/buffer.js";
import { handleEpisodePublish, handleEpisodeComment } from "./controllers/handlers.js";

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

// How often the scheduler should run to check for mature jobs (in milliseconds)
const SCHEDULER_INTERVAL = 10 * 1000; // 10 seconds

/**
 * The callback function that the buffer will use to process a mature job.
 * It routes the job to the correct handler based on its type.
 * @param {string} type - The type of the job.
 * @param {object} data - The job's data payload.
 */
const processNotificationJob = (type, data) => {
  switch (type) {
    case "EPISODE_PUBLISH":
      handleEpisodePublish(data);
      break;
    case "EPISODE_COMMENT":
      handleEpisodeComment(data);
      break;
    default:
      console.log(`[Scheduler] Unknown job type for processing: ${type}`);
  }
};

/**
 * Starts the scheduler to periodically process jobs from the buffer.
 */
export const startBufferScheduler = () => {
  console.log(`[Scheduler] Buffer processor started. Will run every ${SCHEDULER_INTERVAL / 1000} seconds.`);
  setInterval(() => {
    processJobs(processNotificationJob);
  }, SCHEDULER_INTERVAL);
};
