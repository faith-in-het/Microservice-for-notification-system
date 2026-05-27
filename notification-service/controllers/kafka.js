import { Kafka } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

const kafka = new Kafka({
  clientId: "notification-app",
  brokers: [process.env.KAFKA_BROKER] // e.g., "localhost:9092" location of kafka broker 
});

async function createTopic(topic) {
  const admin = kafka.admin();
  console.log("Admin connecting...");
  await admin.connect();
  console.log("Admin Connection Success...");

  console.log(`Creating Topic [${topic}]`);
  await admin.createTopics({
    topics: [
      {
        topic: topic,
        numPartitions: 2,
        replicationFactor: 1,
      },
    ],
  });
  console.log(`Topic Created Success [${topic}]`);

  await admin.disconnect();
}



export const consumer = kafka.consumer({
  groupId: "notification-group" // consumer group 
});

module.exports = { kafka, createTopic };