// In-memory buffer to hold notification jobs before they are processed.
// This allows us to handle deletions within a grace period.

// Using a Map to store jobs, with the content ID (episodeId or commentId) as the key.
const notificationBuffer = new Map();

// Grace periods in milliseconds
const EPISODE_GRACE_PERIOD = 5 * 60 * 1000; // 5 minutes
const COMMENT_GRACE_PERIOD = 60 * 1000; // 60 seconds

/**
 * Adds a new notification job to the buffer.
 * @param {string} id - The unique ID of the content (e.g., episodeId, commentId).
 * @param {string} type - The type of the event (e.g., 'EPISODE_PUBLISH', 'EPISODE_COMMENT').
 * @param {object} data - The event data payload.
 */
export const addJob = (id, type, data) => {
  const job = {
    type,
    data,
    createdAt: Date.now(),
  };
  notificationBuffer.set(id, job);
  console.log(`[Buffer] Job added for ${type} with ID: ${id}`);
};

/**
 * Removes a job from the buffer, preventing notification.
 * @param {string} id - The unique ID of the content to remove.
 */
export const removeJob = (id) => {
  if (notificationBuffer.has(id)) {
    notificationBuffer.delete(id);
    console.log(`[Buffer] Job removed for ID: ${id}. Notification cancelled.`);
  }
};

/**
 * Scans the buffer and processes jobs that are past their grace period.
 * @param {function} processCallback - The function to call with the matured job's data.
 */
export const processJobs = (processCallback) => {
  const now = Date.now();
  console.log(`[Buffer] Processing jobs. Current buffer size: ${notificationBuffer.size}`);

  for (const [id, job] of notificationBuffer.entries()) {
    const gracePeriod =
      job.type === 'EPISODE_PUBLISH'
        ? EPISODE_GRACE_PERIOD
        : COMMENT_GRACE_PERIOD;

    if (now - job.createdAt > gracePeriod) {
      console.log(`[Buffer] Job for ID ${id} has matured. Processing...`);
      // The job is past its grace period, so we process it.
      processCallback(job.type, job.data);
      // Remove the job from the buffer after processing.
      notificationBuffer.delete(id);
    }
  }
};
