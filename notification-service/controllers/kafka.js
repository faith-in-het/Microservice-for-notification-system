import { Kafka } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

const kafka = new Kafka({
  clientId: "notification-app",
  brokers: [process.env.KAFKA_BROKER] // e.g., "localhost:9092" location of kafka broker 
});

async function createTopic() {
  const admin = kafka.admin();
  console.log("Admin connecting...");
  await admin.connect();
  console.log("Admin Connection Success...");

  console.log("Creating Topic [notifications]");
  await admin.createTopics({
    topics: [
      {
        topic: "notifications",
        numPartitions: 2,
        replicationFactor: 1,
      },
    ],
  });
  console.log("Topic Created Success [notifications]");

  await admin.disconnect();
}

export const producer = kafka.producer();

export const consumer = kafka.consumer({
  groupId: "notification-group" // consumer group 
});

module.exports = { kafka, createTopic };