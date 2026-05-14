import { kafka } from "./kafka.js";

const producer = kafka.producer();

export const sendNotification = async (notification) => {
  await producer.connect();
  await producer.send({
    topic: "notifications",
    messages: [
      {
        value: JSON.stringify(notification),
      },
    ],
  });
  await producer.disconnect();
};
