// #region junk
import { Application } from 'this/application';
import {
  type RequestHandler,
  type RouteParameters,
} from 'express-serve-static-core';

// type Method<Body> = (method: string, route: string) => string;

// const METHOD: Method<unknown> = function METHOD<Body>(
//   method: string,
//   route: string
// ): string {
//   return `${method} ${route}`;
// };

// function GET(route: string) {
//   return METHOD('GET', route);
// }
// function POST<Body>(route: string) {
//   return METHOD('POST', route);
// }
// function PUT<Body>(route: string) {
//   return METHOD('PUT', route);
// }
// function DELETE(route: string) {
//   return METHOD('DELETE', route);
// }

// type GenericController = Record<string, import('express').RequestHandler>;

// type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE';
// type MethodsWithBody = Extract<Methods, 'POST' | 'PUT'>;
// type MethodsWithoutBody = Exclude<Methods, MethodsWithBody>;

// type Handler<
//   Route,
//   Body = never
// > = Route extends `${infer Method} ${infer Rest}`
//   ? Method extends MethodsWithBody
//     ? RequestHandler<RouteParameters<Rest>, any, Body>
//     : Method extends MethodsWithoutBody
//     ? RequestHandler<RouteParameters<Rest>, any, never>
//     : never // unrecognized Method, something like "FOO /bar/baz"
//   : never; // malformed route, e.g. doesn't match "METHOD /route/segments";

// type PostTodoHandler = Handler<'POST /todos', PostDto>;
// const postTodoHandler: PostTodoHandler = (req, res) => {
//   req.body.value;
// };

// type GetTodoHandler = Handler<'GET /todos/:id'>;
// const getTodoHandler: GetTodoHandler = (req, res) => {
//   req.params.id;
//   req.body;
// };

// type ControllerFactory = ((...prams: any[]) => GenericController) extends (
//   ...prams: any[]
// ) => infer RequestHandlerImpl
//   ? { [K in keyof RequestHandlerImpl]: any } extends RequestHandlerImpl
//     ? (...prams: any[]) => RequestHandlerImpl
//     : never // infer implementation of each handler
//   : never; // return value doesn't extend controller

// type Controller = GenericController extends infer ControllerImpl
//   ? {
//       [K in keyof ControllerImpl]: any;
//     } extends ControllerImpl
//     ? ControllerImpl
//     : never
//   : never;

interface PostDto {
  value: string;
}

// const TodoControllerFactory: ControllerFactory = function (
//   todoApplication: Application
// ) {
//   return {
//     [GET('/todos')](_, res) {
//       res.send(todoApplication.getAllTodos());
//     },

//     [GET('/todos/:id')](_, res) {
//       res.send(todoApplication.getAllTodos());
//     },

//     [POST<PostDto>('/todos')](req, res) {
//       const createTodo = req.body as { title: string };
//       todoApplication.createTodo({
//         type: 'CreateTodo',
//         ...createTodo,
//         key: '',
//       });
//       res.sendStatus(202);
//     },
//   };
// };

// export default TodoControllerFactory;

declare type TrustMeThisWillHaveTheRightType = any;

declare const Post: <T>() => any;
declare const Get: () => any;
declare const Put: <T>() => any;
declare const Delete: () => any;
declare const ProducesResponseType: any;
declare const Route: any;
// #endregion junk

const FooController = {
  async [
    [Post<PostDto>()]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [Route('/todos')]
  ] (
    request: TrustMeThisWillHaveTheRightType,
    response: TrustMeThisWillHaveTheRightType
  ) {
    // read stuff off the request
    // do async stuff
    // write to the response
    // should we instead return an object here? it's a good practice...
  },

  async [
    [Get()]
    [ProducesResponseType(200)]
    [Route('/todos')]
  ] (
    request: TrustMeThisWillHaveTheRightType,
    response: TrustMeThisWillHaveTheRightType
  ) {
  },

  async [
    [Get()]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    [Route('/todos/:id')]
  ] (
    request: TrustMeThisWillHaveTheRightType,
    response: TrustMeThisWillHaveTheRightType
  ) {
  },

  async [
    [Put()]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    [Route('/todos/:id')]
  ] (
    request: TrustMeThisWillHaveTheRightType,
    response: TrustMeThisWillHaveTheRightType
  ) {
  },
};
