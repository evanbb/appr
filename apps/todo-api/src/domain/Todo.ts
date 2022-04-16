function generateId() {
  return Date.now().toString();
}

export class Todo {
  private constructor(
    public title: string,
    public id: string,
    public done: boolean
  ) {
    if (!title) {
      throw new Error('A title is required to create a new todo');
    }
    if (!id) {
      throw new Error('An identifier is required to create a new todo');
    }
  }

  static createNew(title: string): Readonly<Todo> {
    return new Todo(title, generateId(), false);
  }

  markDone() {
    this.done = true;
  }

  markUndone() {
    this.done = false;
  }
}
