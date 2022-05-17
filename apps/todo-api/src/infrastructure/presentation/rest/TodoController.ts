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

function Get(): typeof middleware & string & number {
  return middleware((data) => {
    data.method = 'GET';
  }) as typeof middleware & string & number;
}

function Post<Dto = never>(): typeof middleware & string & number {
  return middleware(noop) as typeof middleware & string & number;
}

function Route(route: string): typeof middleware & string & number {
  const rs = middleware((data) => {
    data.route = route;
  }) as typeof middleware & string & number;

  return rs;
}

function ProducesResponseType(
  statusCode: number
): typeof middleware & string & number {
  return middleware((data) => {
    data.producesResponseType = data.producesResponseType
      ? [...data.producesResponseType, statusCode]
      : [statusCode];
  }) as typeof middleware & string & number;
}

type Handler<T extends string> = (
  request: Request<RouteParameters<T>, any, any>,
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

    async [[Get()][Route('/')]](request, response) {
      response.send(application.getAllTodos());
    },

    async [`{
    ${Get()}
    ${ProducesResponseType(200)}
    ${ProducesResponseType(404)}
    ${Route('/todos/foo')}
    }`](request, response) {},

    async [Get()(ProducesResponseType(200))(ProducesResponseType(400))(
      ProducesResponseType(404)
    )(Route('/todos/:id'))](request, response) {
      response.send(application.getAllTodos());
    },
  };
}

export default TodoControllerFactory;

// TODO: make prettier config for this stuff
