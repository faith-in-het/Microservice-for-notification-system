import { kafka } from "./kafka.js";
import {
  handleFanficPublish,
  handleEpisodePublish,
  handleEpisodeComment,
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
        case "NEW_EPISODE":
          await handleEpisodePublish(data);
          break;
        case "EPISODE_COMMENT":
          await handleEpisodeComment(data);
          break;
        default:
          console.log("Unknown message type:", type);
      }
    },
  });
};
