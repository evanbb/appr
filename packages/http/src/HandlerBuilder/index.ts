import {
  type Request,
  type Response,
  type RouteParameters,
} from 'express-serve-static-core';

const HANDLER_METADATA_SYMBOL: unique symbol = Symbol();
const HTTP_METHOD_SYMBOL: unique symbol = Symbol();
const HANDLER_ROUTE_SYMBOL: unique symbol = Symbol();

type MetadataMiddleware<
  Route extends string = '',
  Dto = never
> = (() => any) & { [HANDLER_METADATA_SYMBOL]: boolean };

function AddSomeMeta<Route extends string = '', Dto = never>(
  ...prams: any[]
): MetadataMiddleware<Route, Dto> {
  const returnValue = (...additionalStuff: any[]) => {};
  Object.assign(returnValue, {
    [HANDLER_METADATA_SYMBOL]: true,
  });
  return returnValue as MetadataMiddleware<Route, Dto>;
}

type Factoryy = (...p: any[]) => any;
declare const Factoryy: Factoryy;
declare const ProducesResponseType: Factoryy;
declare const Route: Factoryy;

declare const Post: <T>(...p: any[]) => any;
declare const Put: <T>(...p: any[]) => any;
declare const Get: (...p: any[]) => any;
declare const Delete: (...p: any[]) => any;

declare const Handler: (...p: any[]) => any;

declare const producesResponseType: Factoryy;
declare const route: Factoryy;

declare const post: <T>(...p: any[]) => any;
declare const put: <T>(...p: any[]) => any;
declare const get: (...p: any[]) => any;
declare const httpPost: <T>(...p: any[]) => any;
declare const httpPut: <T>(...p: any[]) => any;
declare const httpGet: (...p: any[]) => any;
declare const httpDelete: (...p: any[]) => any;
declare const method: (...p: any[]) => any;
declare const methods: any;
declare const Methods: any;

declare const handler: (...p: any[]) => any;

const f = Post()(ProducesResponseType())(ProducesResponseType())(
  ProducesResponseType()
)(ProducesResponseType())(Route())((request: any, response: any) => {});
const c: any = {
  createTodo: Post<{ foo: 'bar' }>()(ProducesResponseType())(
    ProducesResponseType()
  )(ProducesResponseType())(ProducesResponseType())(Route())(
    (request: any, response: any) => {}
  ),
  deleteTodo: Delete()(ProducesResponseType())(ProducesResponseType())(
    ProducesResponseType()
  )(ProducesResponseType())(Route())((request: any, response: any) => {}),
};

const d: any = {
  createTodo: Post<{ foo: 'bar' }>()
    .ProducesResponseType()
    .ProducesResponseType()
    .ProducesResponseType()
    .ProducesResponseType()
    .Route()((request: any, response: any) => {}),
  deleteTodo: Delete()
    .ProducesResponseType()
    .ProducesResponseType()
    .ProducesResponseType()
    .ProducesResponseType()
    .Route('/foo/:bar')((request: any, response: any) => {}),
};

const e: any = {
  createTodo: Route(
    Post<CreateTodoRequest>('/todos'),
    ProducesResponseType(),
    ProducesResponseType(),
    (request: any, response: any) => {}
  ),
  deleteTodo: Delete(
    ProducesResponseType(),
    ProducesResponseType(),
    ProducesResponseType(),
    ProducesResponseType(),
    Route('/foo/:bar'),
    (request: any, response: any) => {}
  ),
  getTodo: Get(
    '/todos',
    ProducesResponseType(),
    ProducesResponseType(),
    ProducesResponseType(),
    (request: any, response: any) => {}
  ),
  getTodos: handler(
    get(),
    route('/todos'),
    producesResponseType(),
    producesResponseType(),
    producesResponseType(),
    (request: any, response: any) => {}
  ),
  getSomeTodos: handler(
    method(Methods.Get),
    route('/todos'),
    producesResponseType(),
    producesResponseType(),
    producesResponseType(),
    (request: any, response: any) => {}
  ),
  /**
   * @handler() // would be optional?
   * @producesResponseType(201)
   * @get(route)
   */
  getMoreTodos: get('/todos', (request: any, response: any) => {}),

  undecorated: (request: any, response: any) => {},
};

export interface Handler<Route extends string, Dto> {
  (
    request: Request<RouteParameters<Route>, any, Dto>,
    response: Response
  ): void | Promise<void>;
}

export interface ControllerBuilderHttpMethods {
  Post<Dto>(): ControllerBuilderMetadata<Dto>;
  Put<Dto>(): ControllerBuilderMetadata<Dto>;
  Get(): ControllerBuilderMetadata<never>;
  Delete(): ControllerBuilderMetadata<never>;
}

export interface ControllerBuilderMetadata<Dto = never> {
  ProducesResponseType(statusCode: number): ControllerBuilderMetadata<Dto>;
  Route<Route extends string>(
    route: Route
  ): ControllerBuilderRouteHandler<Route, Dto>;
}

export interface ControllerBuilderRouteHandler<
  Route extends string = '',
  Dto = never
> {
  (handler: Handler<Route, Dto>): ControllerBuilderHttpMethods &
    ControllerBuilderFinalizer;
}

export interface ControllerBuilderFinalizer {
  Build(): RouteMetadata[];
}

export interface RouteMetadata {
  method: string;
  route: string;
  handler: Handler<any, any>;
  validResponseCodes: number[];
}

interface CreateTodoRequest {
  title: string;
}

type Ctroller = any extends infer T
  ? {
      [K in keyof T]: any; //RequestHandler;
    }
  : never;

const foo: Ctroller = {
  bar: Post<{ req: { title: string } }>()((req: any, res: any) => {
    req.body.title;
  }),
};

const xc: Ctroller = {
  ...ProducesResponseType()(Get('/foo-bar'))(
    (request: any, response: any) => {}
  ),
  ...ProducesResponseType()(Get('/foo-bar'))(
    (request: any, response: any) => {}
  ),
  ...ProducesResponseType()(Get('/foo-bar'))(
    (request: any, response: any) => {}
  ),
  ...ProducesResponseType()(Get('/foo-bar'))(
    (request: any, response: any) => {}
  ),
};

const xc2: Ctroller = {
  doFoo: ProducesResponseType()(Get('/foo-bar'))(
    (request: any, response: any) => {}
  ),
  chargeFoo: ProducesResponseType()(Get('/foo-bar'))(
    (request: any, response: any) => {}
  ),
  deleteFoo: ProducesResponseType()(Get('/foo-bar'))(
    (request: any, response: any) => {}
  ),
  getFoo: ProducesResponseType()(Get('/foo-bar'))(
    (request: any, response: any) => {}
  ),
};
