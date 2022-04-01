import { Response } from "express-serve-static-core";
import { type Application as ExpressApplication, type Request } from "express";
import Application, { type CreateTodo } from "../../application";
import { ParsedQs } from "qs";

export default class TodoController {
  readonly #todoApp: Application;

  constructor(expressApp: ExpressApplication, todoApplication: Application) {
    this.#todoApp = todoApplication;

    expressApp.post("/todos", this.createTodo);
    expressApp.get("/todos", this.getTodos);
  }

  createTodo = (
    req: Request<{}, any, CreateTodo, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>, number>
  ) => {
    const createTodo = req.body;

    this.#todoApp.createTodo(createTodo);

    res.sendStatus(202);
  };

  getTodos = (
    req: Request<{}, any, CreateTodo, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>, number>
  ) => {
    res.send(this.#todoApp.getAllTodos());
  };
}
