// #region junk
import { Application, CreateTodo } from 'this/application';
import {
  type Request,
  type Response,
  type RouteParameters,
} from 'express-serve-static-core';

//#region utils

interface Handler<Route extends string, Dto> {
  (
    request: Request<RouteParameters<Route>, any, Dto>,
    response: Response
  ): void | Promise<void>;
}

interface ControllerBuilderMethods {
  Post<Dto>(): ControllerBuilderMetadata<Dto>;
  Put<Dto>(): ControllerBuilderMetadata<Dto>;
  Get(): ControllerBuilderMetadata<never>;
  Delete(): ControllerBuilderMetadata<never>;
}

interface ControllerBuilderMetadata<Dto = never> {
  ProducesResponseType(statusCode: number): ControllerBuilderMetadata<Dto>;
  Route<Route extends string>(
    route: Route
  ): ControllerBuilderRouteHandler<Route, Dto>;
}

interface ControllerBuilderRouteHandler<
  Route extends string = '',
  Dto = never
> {
  Handler(handler: Handler<Route, Dto>): ControllerBuilderMethods;
}

interface RouteMetadata {
  method: string;
  route: string;
  handler: Handler<any, any>;
  validResponseCodes: number[];
}

//#endregion

class ControllerBuilder<Route extends string = '', Dto = never>
  implements
    ControllerBuilderMetadata<Dto>,
    ControllerBuilderRouteHandler<Route, Dto>
{
  #routes: RouteMetadata[] = [];
  #current: Partial<RouteMetadata> = {};

  #initializeCurrent() {
    this.#current = {
      validResponseCodes: [],
    };
  }

  /**
   * Sets the handler method to 'POST' and types `request.body` as `typeof Dto`
   * @returns @this
   */
  Post<Dto>(): ControllerBuilderMetadata<Dto> {
    this.#current.method = 'POST';
    return this as unknown as ControllerBuilderMetadata<Dto>;
  }

  /**
   * Sets the handler method to 'PUT' and types `request.body` as `typeof Dto`
   * @returns @this
   */
  Put<Dto>(): ControllerBuilderMetadata<Dto> {
    this.#current.method = 'PUT';
    return this as unknown as ControllerBuilderMetadata<Dto>;
  }

  /**
   * Sets the handler method to 'GET' and types `request.body` as `never`
   * @returns @this
   */
  Get(): ControllerBuilderMetadata<never> {
    this.#current.method = 'GET';
    return this as unknown as ControllerBuilderMetadata<never>;
  }

  /**
   * Sets the handler method to 'DELETE' and types `request.body` as `never`
   * @returns @this
   */
  Delete(): ControllerBuilderMetadata<never> {
    this.#current.method = 'DELETE';
    return this as unknown as ControllerBuilderMetadata<never>;
  }

  /**
   * Adds @param statusCode as a valid response this endpoint may return
   * @returns @this
   */
  ProducesResponseType(statusCode: number): ControllerBuilderMetadata<Dto> {
    this.#current.validResponseCodes!.push(statusCode);
    return this as unknown as ControllerBuilderMetadata<Dto>;
  }

  /**
   * Sets the @param route this handler will match
   * @returns @this
   */
  Route<Route extends string>(
    route: Route
  ): ControllerBuilderRouteHandler<Route, Dto> {
    this.#current.route = route;
    return this as unknown as ControllerBuilderRouteHandler<Route, Dto>;
  }

  /**
   * Sets the @param handler this endpoint will invoke if the route matches
   * @returns @this
   */
  Handler(handler: Handler<Route, Dto>): ControllerBuilderMethods {
    this.#current.handler = handler;
    this.#routes.push(this.#current as RouteMetadata);
    this.#initializeCurrent();
    return this as unknown as ControllerBuilderMethods;
  }

  /**
   * Returns the constructed routes, clearing out the internal collection so the builder can be reused
   * @returns @type RouteMetadata
   */
  Build() {
    const result = this.#routes;
    this.#routes = [];
    return result;
  }
}

interface ControllerFactory {
  (...prams: any[]): (
    builder: ControllerBuilderMethods
  ) => ControllerBuilderMethods;
}

const factory: ControllerFactory = (application: Application) => (builder) =>
  builder
    .Post<CreateTodo>()
    .Route('/todos/:id')
    .Handler(function CreateTodo(request, response) {
      const createTodo = request.body;
      application.createTodo({ ...createTodo, key: '', type: 'CreateTodo' });
      response.sendStatus(202);
    })
    .Get()
    .Route('/todos')
    .Handler(function GetAllTodos(request, response) {
      response.send(application.getAllTodos());
    });

export default factory;
