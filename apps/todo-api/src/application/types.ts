import { Todo } from "this/domain";

export interface TodoRepository {
  get(): Todo[];
  find(id: string): Todo | null;
  add(todo: Todo): void;
  delete(id: string): void;
  update(todo: Todo): void;
}
