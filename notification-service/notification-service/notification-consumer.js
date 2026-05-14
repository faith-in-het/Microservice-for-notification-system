import { kafka } from "./kafka.js";

// This is a placeholder for the actual notification service client
const sendToNotificationService = async (notification) => {
  console.log("---- Sending to Notification Service ----");
  console.log(notification);
  // In a real application, you would have an API call here
  // to your external notification service.
  // e.g., await axios.post('http://notification-service.com/send', notification);
  console.log("------------------------------------");
  return Promise.resolve();
};

const consumer = kafka.consumer({ groupId: "notification-sender-group" });

export const startNotificationConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topic: "notifications",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const notification = JSON.parse(message.value.toString());

      console.log("Notification to send:", notification);
      await sendToNotificationService(notification);
    },
  });
};
