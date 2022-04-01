import { TodoRepository } from "../application";
import Todo from "../domain/Todo";

export default class TodoRepositoryImpl implements TodoRepository {
  readonly #todos: Map<string, Todo> = new Map();

  add(todo: Todo): void {
    this.#todos.set(todo.id, todo);
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
  }
}
