import { Application } from 'this/application';

export default class TodoController {
  #todoApp: Application;

  constructor(
    expressApp: import('express').Application,
    todoApplication: Application
  ) {
    this.#todoApp = todoApplication;
    expressApp.post('/todos', this.createTodo);
    expressApp.get('/todos', this.getTodos);
  }

  createTodo = (req: any, res: any) => {
    const createTodo = req.body as { title: string };
    this.#todoApp.createTodo({ type: 'CreateTodo', ...createTodo, key: '' });
    res.sendStatus(202);
  };

  getTodos = (req: any, res: any) => {
    res.send(this.#todoApp.getAllTodos());
  };
}
