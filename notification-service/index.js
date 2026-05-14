import { connectDB } from "./db.js";
import { createTopic } from "./kafka.js";
import { startConsumer } from "./consumer.js";
import { startNotificationConsumer } from "./notification-consumer.js";


const startServer = async () => {
  await connectDB();

  await createTopic();

  // This consumer generates notifications
  await startConsumer();

  // This consumer sends notifications to the (mock) notification service
  await startNotificationConsumer();

  console.log("Notification Service Running");
};

startServer();
