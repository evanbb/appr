// #region junk
import { Application, CreateTodo } from 'this/application';
import {
  type Request,
  type Response,
  type RouteParameters,
} from 'express-serve-static-core';

//#region utils

const noop = () => {};

interface Configurator {
  (data: any): any;
}

function middleware(first: Configurator): typeof middleware {
  const output = function (next: Configurator) {
    return middleware((input) => {
      first(input);
      next(input);
    });
  };

  output.toString = function () {
    const seed = {};
    first(seed);
    return JSON.stringify(seed);
  };

  return output;
}

function Get(): any {
  return middleware((data) => {
    data.methods = data.methods ? [...data.methods, 'GET'] : ['GET'];
    return data;
  });
}

function Post<Dto = never>(): any {
  return middleware(noop);
}

function Route(route: string): any {
  return middleware((data) => {
    data.route = route;
  });
}

function ProducesResponseType(statusCode: number): any {
  return middleware((data) => {
    data.producesResponseType = data.producesResponseType
      ? [...data.producesResponseType, statusCode]
      : [statusCode];
  });
}

type Handler<T extends string> = (
  request: Request<RouteParameters<T>>,
  response: Response
) => void | Promise<void>;

type ControllerMethodsOnly<T> = {
  [K in keyof T]: K extends string ? Handler<K> : never;
};

type Controller = any extends infer T
  ? ControllerMethodsOnly<T> extends T
    ? ControllerMethodsOnly<T>
    : never
  : never;

//#endregion

function TodoControllerFactory(application: Application): Controller {
  return {
    async [Post<CreateTodo>()
      .ProducesResponseType(201)
      .ProducesResponseType(400)
      .Route('/todos')](request, response) {
      const createTodo = request.body;
      application.createTodo({
        type: 'CreateTodo',
        ...createTodo,
        key: '',
      });
      response.sendStatus(202);
    },

    async [Get()](request, response) {
      response.send(application.getAllTodos());
    },

    async [Get()(ProducesResponseType(200))(ProducesResponseType(400))(
      ProducesResponseType(404)
    )(Route('/todos/:id'))](request, response) {
      response.send(application.getAllTodos());
    },

    async [Post()](request, response) {},
  };
}

export default TodoControllerFactory;

// TODO: make prettier config for this stuff
