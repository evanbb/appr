import { ChangeTitle, CreateTodo, MarkWhetherDone } from './commands';
import { Todo } from 'this/domain';

export interface TodoCommandRepository {
  commit(command: CreateTodo | ChangeTitle | MarkWhetherDone): void;
}

export interface TodoQueryRepository {
  getAll(): Readonly<Todo>[];
  onUpdate(callback: (todos: Readonly<Todo>[]) => void): void;
}
