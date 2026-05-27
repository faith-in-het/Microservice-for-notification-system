import { kafka } from "./kafka.js";

export const producer = kafka.producer({
  allowAutoTopicCreation: false,
  transactionTimeout: 30000,
  idempotent: true,
});

export const sendNotification = async (notification) => {
  await producer.connect();
  try {
    await producer.send({
      topic: "notifications",
      messages: [
        {
          value: JSON.stringify(notification),
        },
      ],
    });
  } finally {
    await producer.disconnect();
  }
};

export const sendNotificationBatch = async (notifications) => {
  await producer.connect();
  try {
    const messages = notifications.map((notification) => ({
      value: JSON.stringify(notification),
    }));

    await producer.send({
      topic: "notifications",
      messages,
    });
  } finally {
    await producer.disconnect();
  }
};
