export * from './commands';
import { ChangeTitle, CreateTodo, MarkWhetherDone } from './commands';
import { Todo } from 'this/domain';
import { EventEmitter } from 'ws';
import { TodoCommandRepository, TodoQueryRepository } from './types';

export { TodoCommandRepository, TodoQueryRepository };
export interface ApplicationDependencies {}

type ApplicationFactory = {} extends ApplicationDependencies
  ? (domain: any, dependencies?: ApplicationDependencies) => void
  : (domain: any, dependencies: ApplicationDependencies) => void;

const application: ApplicationFactory = function application(
  domain: any,
  dependencies?: ApplicationDependencies
) {};

export class Application {
  readonly #commandRepo: TodoCommandRepository;
  readonly #queryRepo: TodoQueryRepository;
  readonly #changeEmitter: EventEmitter = new EventEmitter();

  constructor(
    commandRepo: TodoCommandRepository,
    queryRepo: TodoQueryRepository
  ) {
    this.#commandRepo = commandRepo;
    this.#queryRepo = queryRepo;
    this.#queryRepo.onUpdate((todos) =>
      this.#changeEmitter.emit('update', todos)
    );
  }

  getAllTodos() {
    return this.#queryRepo.getAll();
  }

  createTodo(createTodo: CreateTodo) {
    this.#commandRepo.commit(createTodo);
  }

  changeTitle(changeTitle: ChangeTitle) {
    this.#commandRepo.commit(changeTitle);
  }

  markTodoDone(command: MarkWhetherDone) {
    this.#commandRepo.commit(command);
  }

  onUpdate = (callback: (allTodos: Readonly<Todo>[]) => void) => {
    this.#changeEmitter.on('update', callback);
  };
}

export default application;
