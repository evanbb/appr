import { Consumer, Producer } from 'kafkajs';
import { type TodoRepository } from 'this/application';
import { type Todo } from 'this/domain';
import Kafka, { COMMANDS_PROCESSOR_INPUT_TOPIC } from '../Kafka';

export default class TodoRepositoryImpl implements TodoRepository {
  readonly #todos: Map<string, Todo> = new Map();
  readonly #producer: Producer;
  readonly #consumer: Consumer;

  constructor() {
    this.#producer = Kafka.producer;
    this.#consumer = Kafka.consumer;

    this.#producer.connect();
    this.#consumer.connect();
  }

  add(todo: Todo): void {
    this.#todos.set(todo.id, todo);
    this.#producer.send({
      topic: COMMANDS_PROCESSOR_INPUT_TOPIC,
      messages: [
        {
          key: todo.id,
          value: JSON.stringify(todo),
        },
      ],
    });
  }

  delete(id: string): void {
    this.#todos.delete(id);
  }

  find(id: string): Todo | null {
    return this.#todos.has(id) ? (this.#todos.get(id) as Todo) : null;
  }

  get(): Todo[] {
    return Array.from(this.#todos.values());
  }

  update(todo: Todo): void {
    const currentTodo = this.#todos.get(todo.id);

    if (!currentTodo) {
      return;
    }

    this.#todos.set(todo.id, todo);
    
    this.#producer.send({
      topic: COMMANDS_PROCESSOR_INPUT_TOPIC,
      messages: [
        {
          key: todo.id,
          value: JSON.stringify(todo),
        },
      ],
    });
  }


}
