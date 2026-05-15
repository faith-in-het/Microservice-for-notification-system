import { kafka } from "./kafka.js";
import {
  handleFanficPublish,
  handleEpisodePublish,
  handleEpisodeComment,
  handleUserFollow,
} from "./handlers.js";
import { addJob, removeJob } from "./buffer.js";

const consumer = kafka.consumer({ groupId: "notification-group" });

export const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "fanfic-events", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { type, ...data } = JSON.parse(message.value.toString());
      console.log(`Event Received: ${type}`, data);

      switch (type) {
        case "FANFIC_PUBLISH":
          // This is handled instantly as per requirements
          await handleFanficPublish(data);
          break;
        case "EPISODE_PUBLISH":
          // Add to buffer instead of handling instantly
          addJob(data.episodeId, type, data);
          break;
        case "EPISODE_COMMENT":
          // Add to buffer instead of handling instantly
          addJob(data.commentId, type, data);
          break;
        case "USER_FOLLOW":
          // This is handled instantly
          await handleUserFollow(data);
          break;
        case "EPISODE_DELETE":
          // Remove from buffer to cancel notification
          removeJob(data.episodeId);
          break;
        case "COMMENT_DELETE":
          // Remove from buffer to cancel notification
          removeJob(data.commentId);
          break;
        default:
          console.log("Unknown message type:", type);
      }
    },
  });
};
