export * from './commands';
import { CreateTodo } from './commands';
import { Todo } from 'this/domain';
import { EventEmitter } from 'ws';

export interface TodoRepository {
  get(): Todo[];
  find(id: string): Todo | null;
  add(todo: Todo): void;
  delete(id: string): void;
  update(todo: Todo): void;
}

export interface ApplicationDependencies {}

type ApplicationFactory = {} extends ApplicationDependencies
  ? (domain: any, dependencies?: ApplicationDependencies) => void
  : (domain: any, dependencies: ApplicationDependencies) => void;

const application: ApplicationFactory = function application(
  domain: any,
  dependencies?: ApplicationDependencies
) {};

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

export default application;
