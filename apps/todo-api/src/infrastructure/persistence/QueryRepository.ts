import { Consumer, EachMessagePayload } from 'kafkajs';
import { TodoQueryRepository } from 'this/application';
import { Todo } from 'this/domain';
import { COMMANDS_PROCESSOR_OUTPUT_TOPIC } from '../Kafka';
import EventEmitter from 'node:events';

export class TodoQueryRepositoryImpl implements TodoQueryRepository {
  readonly #todos: Map<string, Todo> = new Map();
  readonly #consumer: Consumer;
  readonly #emitter: EventEmitter = new EventEmitter();

  constructor(consumer: Consumer) {
    this.#consumer = consumer;

    this.#consumer.subscribe({
      topic: COMMANDS_PROCESSOR_OUTPUT_TOPIC,
    });

    this.#consumer.connect();

    this.#consumer.run({
      eachMessage: this.#onReceive,
    });
  }

  #onReceive = async (message: EachMessagePayload) => {
    const key = String(message.message.key);
    const value = JSON.parse(String(message.message.value)) as Todo;
    this.#todos.set(key, value);
    this.#emitter.emit('update', this.getAll());
  };

  onUpdate(callback: (todos: Readonly<Todo>[]) => void): void {
    this.#emitter.on('update', callback);
  }

  getAll(): Readonly<Todo>[] {
    return Array.from(this.#todos.values());
  }
}
