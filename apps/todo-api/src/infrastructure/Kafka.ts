import { Kafka } from 'kafkajs';

export const COMMANDS_PROCESSOR_INPUT_TOPIC = 'todos-api-commands-processor'

// This creates a client instance that is configured to connect to the Kafka broker provided by
// the environment variable KAFKA_BOOTSTRAP_SERVER
const kafka = new Kafka({
  clientId: 'todos-api',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer({});
const consumer = kafka.consumer({
  groupId: 'todos-api-commands-processor',
});

export default {
  producer,
  consumer,
};
