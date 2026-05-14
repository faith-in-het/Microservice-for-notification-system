import { createTopic } from "./kafka.js";
import { startNotificationConsumer } from "./notification-consumer.js";
import { connectDB } from "./db/db.js";
import { startConsumer } from "./controllers/consumer.js";
//this will just tell nodejs to run this file and it will start 
// the server and the cron job for sending digests
import "./scheduler.js";


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
