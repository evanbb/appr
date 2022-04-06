import { EventEmitter } from 'ws';
import { Todo } from '../domain/Todo';
import { CreateTodo } from './commands';
export * from './commands';

export interface TodoRepository {
  get(): Todo[];
  find(id: string): Todo | null;
  add(todo: Todo): void;
  delete(id: string): void;
  update(todo: Todo): void;
}

export default function application(domain: any) {}

export class Application {
  readonly #repo: TodoRepository;
  readonly #changeEmitter: EventEmitter = new EventEmitter();

  constructor(repo: TodoRepository) {
    this.#repo = repo;
  }

  createTodo(createTodo: CreateTodo) {
    const todo = Todo.createNew(createTodo.title);

    this.#repo.add(todo);

    this.#changeEmitter.emit('update', this.#repo.get());
  }

  getAllTodos() {
    return this.#repo.get();
  }

  onUpdate(callback: (allTodos: Todo[]) => void) {
    this.#changeEmitter.on('update', callback);
  }
}
