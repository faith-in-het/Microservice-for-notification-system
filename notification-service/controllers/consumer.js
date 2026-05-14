import { kafka } from "./kafka.js";
import {
  handleFanficPublish,
  handleEpisodePublish,
  handleEpisodeComment,
  handleUserFollow,
} from "./handlers.js";

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
          await handleFanficPublish(data);
          break;
        case "EPISODE_PUBLISH":
          await handleEpisodePublish(data);
          break;
        case "EPISODE_COMMENT":
          await handleEpisodeComment(data);
          break;
        case "USER_FOLLOW":
          await handleUserFollow(data);
          break;
        default:
          console.log("Unknown message type:", type);
      }
    },
  });
};
