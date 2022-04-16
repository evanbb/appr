import { Kafka } from 'kafkajs';

export const COMMANDS_PROCESSOR_INPUT_TOPIC = 'todos-commands';
export const COMMANDS_PROCESSOR_OUTPUT_TOPIC = 'todos-events';

// This creates a client instance that is configured to connect to the Kafka broker provided by
// the environment variable KAFKA_BOOTSTRAP_SERVER
const kafka = new Kafka({
  clientId: 'todos-api',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer({});
const commandConsumer = kafka.consumer({
  groupId: 'todos-api-commands-processor',
});
const eventConsumer = kafka.consumer({
  groupId: 'todos-api-events-processor',
});

export default {
  producer,
  commandConsumer,
  eventConsumer,
};
