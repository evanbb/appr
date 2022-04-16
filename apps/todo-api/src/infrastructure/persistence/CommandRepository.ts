import { Producer } from 'kafkajs';
import {
  ChangeTitle,
  CreateTodo,
  MarkWhetherDone,
  TodoCommandRepository,
} from 'this/application';
import { COMMANDS_PROCESSOR_INPUT_TOPIC } from '../Kafka';
import CommandConsumer from './CommandConsumer';

export class TodoCommandRepositoryImpl implements TodoCommandRepository {
  readonly #producer: Producer;
  readonly #consumer: CommandConsumer;

  constructor(producer: Producer, consumer: CommandConsumer) {
    this.#consumer = consumer;
    this.#producer = producer;

    this.#producer.connect();
  }

  #send = (key: string, value: any) => {
    this.#producer.send({
      topic: COMMANDS_PROCESSOR_INPUT_TOPIC,
      messages: [
        {
          key,
          value: JSON.stringify(value),
        },
      ],
    });
  };

  commit(command: ChangeTitle | MarkWhetherDone | CreateTodo): void {
    this.#send(command.key, command);
  }
}
