import express from 'express';
import ws from 'ws';
import cors from 'cors';
import bodyParser from 'body-parser';
import TodoControllerFactory, {
  ControllerBuilder,
} from './rest/TodoController';
import { Application } from 'this/application';

export default function presentation() {}

export class Presentation {
  #todoApp: Application;
  #expressApp: import('express').Application;

  constructor(todoApp: Application) {
    this.#todoApp = todoApp;

    const expressApp = (this.#expressApp = express());

    expressApp.use(cors());
    expressApp.use(bodyParser.json());

    const routeMetas = TodoControllerFactory(todoApp)(
      new ControllerBuilder()
    ).Build();

    for (const routeMeta of routeMetas) {
      const { handler, method, route } = routeMeta;
      (expressApp as any)[method.toLowerCase()](route, handler);
    }
  }
  start() {
    const server = this.#expressApp.listen(8000, () => {
      console.error('Listening on port 8000');
    });
    const sockets = new ws.WebSocketServer({ server, path: '/notifications' });
    sockets.on('connection', (socket) => {
      socket.send(JSON.stringify(this.#todoApp.getAllTodos()));
    });
    this.#todoApp.onUpdate((todos) => {
      sockets.clients.forEach((client) => {
        client.send(JSON.stringify(todos));
      });
    });
  }
}
