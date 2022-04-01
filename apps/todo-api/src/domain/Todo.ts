function generateId() {
  return Date.now().toString();
}

export default class Todo {
  private constructor(
    public readonly title: string,
    public readonly id: string
  ) {
      if (!title) {
          throw new Error('A title is required to create a new todo');
      }
      if (!id) {
          throw new Error('An identifier is required to create a new todo')
      }
  }

  static createNew(title: string): Todo {
    return new Todo(title, generateId());
  }
}
