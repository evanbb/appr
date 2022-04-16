function generateId() {
  return Date.now().toString();
}

export class Todo {
  private constructor(
    public id: string,
    public title: string,
    public done: boolean
  ) {
    if (!id) {
      throw new Error('An identifier is required to create a new todo');
    }
  }

  static createNew(title: string): Readonly<Todo> {
    if (!title) {
      throw new Error('A title is required to create a new todo');
    }
    return new Todo(generateId(), title, false);
  }

  static rehydrate(id: string, title: string, done: boolean): Readonly<Todo> {
    return new Todo(id, title, done);
  }

  markDone() {
    if (this.done) {
      throw new Error('Todo is already done!');
    }
    this.done = true;
  }

  markUndone() {
    if (!this.done) {
      throw new Error(
        'Todo is already not done - cannot undo an undone todo derp'
      );
    }
    this.done = false;
  }

  changeTitle(newTitle: string) {
    if (!newTitle) {
      throw new Error('Must provide a newTitle');
    }
    this.title = newTitle;
  }
}
