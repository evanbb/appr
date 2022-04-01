import express, { type Application as ExpressApplication } from "express";
import ws from "ws";
import cors from "cors";
import bodyParser from "body-parser";
import TodoController from "./rest/TodoController";
import Application from "../application";
import Todo from "../domain/Todo";

export default class Presentation {
  readonly #expressApp: ExpressApplication;
  readonly #todoApp: Application;

  constructor(todoApp: Application) {
    const expressApp = (this.#expressApp = express());

    expressApp.use(cors());
    expressApp.use(bodyParser.json());

    new TodoController(expressApp, todoApp);

    this.#todoApp = todoApp
    
  }

  start() {
    const server = this.#expressApp.listen(8000, () => {
      console.error("Listening on port 8000");
    });

    const sockets = new ws.WebSocketServer({ server, path: "/notifications" });

    sockets.on("connection", (socket) => {
      socket.send(JSON.stringify(this.#todoApp.getAllTodos()));
    });

    this.#todoApp.onUpdate((todos: Todo[]) => {
      sockets.clients.forEach((client) => {
        client.send(JSON.stringify(todos));
      });
    });
  }
}
