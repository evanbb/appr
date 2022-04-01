import EventEmitter from "node:events";
import TodoRepositoryImpl from "./infrastructure/TodoRepository";
import Application from "./application";
import Presentation from "./presentation";

const changeEmitter = new EventEmitter();

const repo = new TodoRepositoryImpl();
const todoApp = new Application(repo);
new Presentation(todoApp).start();
