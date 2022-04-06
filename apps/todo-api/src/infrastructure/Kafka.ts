import { Kafka } from "kafkajs";

// This creates a client instance that is configured to connect to the Kafka broker provided by
// the environment variable KAFKA_BOOTSTRAP_SERVER
const kafka = new Kafka({
  clientId: "todos-api",
  brokers: [""],
});

const producer = kafka.producer({});
const consumer = kafka.consumer({
  groupId: "todos-api-commands-processor",
});

export default {
  producer,
  consumer,
};
