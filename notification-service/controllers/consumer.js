import { kafka } from "./kafka.js";
import { handleFanficPublish, handleEpisodePublish} from "../handlers.js";

const consumer = kafka.consumer({ groupId: "notification-group" });

export const startConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topic: "fanfic-events",
    fromBeginning: true,
  });

  // await consumer.run({
  //   eachMessage: async ({ message }) => {
  //     const event = JSON.parse(message.value.toString());

  //     console.log("Event Received", event);

  //     if (event.type === "FANFIC_PUBLISH") {
  //       await handleFanficPublish(event);
  //     }
  //   },
  // });

  await consumer.run({
  eachMessage: async ({ message }) => {
        const event = JSON.parse(message.value.toString());

        console.log("Event Received", event);

        // Check the event type and call the correct handler
        if (event.type === "FANFIC_PUBLISH") {
        await handleFanficPublish(event);
        } else if (event.type === "EPISODE_PUBLISH") {
        await handleEpisodePublish(event);
        }
    },
    });

};
