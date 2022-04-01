import express from "express";
import { type RouteParameters } from "express-serve-static-core";
import cors from "cors";
import value from "@appr/domain";
import bodyParser from "body-parser";
import EventEmitter from "node:events";
import ws from "ws";

const changeEmitter = new EventEmitter();

function generateId() {
  return Date.now().toString();
}

interface CreateTodo {
  title: string;
}

interface Todo {
  title: string;
  id: string;
}

const app = express();

app.use(cors());
app.use(bodyParser.json());

const todos: Todo[] = [];

app.get("/:id", (req, res) => {
  res.send({
    value,
    something: "that is incredibly special",
    body: req.params.id,
  });
});

app.post<"/todos", RouteParameters<"/todos">, any, CreateTodo>(
  "/todos",
  (req, res) => {
    const todo = req.body;
    changeEmitter.emit("add", todo);
    res.sendStatus(202);
  }
);

const server = app.listen(8000, () => {
  console.error("Listening on port 8000");
});

const sockets = new ws.WebSocketServer({ server, path: "/notifications" });

sockets.on("connection", (socket) => {
  socket.send(JSON.stringify(todos));
});

changeEmitter.on("add", (createTodo: CreateTodo) => {
  const todo = {
    ...createTodo,
    id: generateId(),
  };

  todos.push(todo);

  sockets.clients.forEach((client) => {
    client.send(JSON.stringify(todos));
  });
});
