import { Consumer, EachMessagePayload, Producer } from 'kafkajs';
import {
  COMMANDS_PROCESSOR_INPUT_TOPIC,
  COMMANDS_PROCESSOR_OUTPUT_TOPIC,
} from '../Kafka';
import { COMMAND_TYPES } from 'this/application';
import { Todo } from 'this/domain';

export default class CommandConsumer {
  readonly #consumer: Consumer;
  readonly #producer: Producer;
  constructor(consumer: Consumer, producer: Producer) {
    this.#producer = producer;
    this.#consumer = consumer;
    this.#producer.connect();
    this.#consumer.connect();
    this.#consumer.subscribe({
      topic: COMMANDS_PROCESSOR_INPUT_TOPIC,
    });
    this.#consumer.run({
      eachMessage: this.#onReceive,
    });
  }

  #onReceive = async (message: EachMessagePayload) => {
    const key = String(message.message.key);
    const value = JSON.parse(String(message.message.value)) as COMMAND_TYPES;

    let instance: Todo;

    switch (value.type) {
      case 'ChangeTitle':
        instance = Todo.rehydrate(key, (value as any).title, value as any);
        instance.changeTitle(value.newTitle);
        break;
      case 'CreateTodo':
        instance = Todo.createNew(value.title);
        break;
      case 'MarkWhetherDone':
        instance = Todo.rehydrate(key, (value as any).title, value as any);

        value.done ? instance.markDone() : instance.markUndone();
        break;
    }

    this.#producer.send({
      topic: COMMANDS_PROCESSOR_OUTPUT_TOPIC,
      messages: [
        {
          key: instance.id,
          value: JSON.stringify(instance),
        },
      ],
    });
  }
}
