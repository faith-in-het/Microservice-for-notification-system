import { createTopic } from "./controllers/kafka.js";
import { startNotificationConsumer } from "./notification-consumer.js";
import { connectDB } from "./db/db.js";
import { startConsumer } from "./controllers/consumer.js";
//this will just tell nodejs to run this file and it will start
// the server and the cron job for sending digests
import "./scheduler.js";
import { startBufferScheduler } from "./scheduler.js";

const startServer = async () => {
  await connectDB();

  // This is for the producer to send notifications
  await createTopic("notifications");

  // This consumer generates notifications from the fanfic-events topic
  await startConsumer();

  // This consumer sends notifications to the (mock) notification service
  await startNotificationConsumer();

  // Starts the scheduler to process buffered notifications
  startBufferScheduler();

  console.log("Notification Service Running");
};

startServer();
