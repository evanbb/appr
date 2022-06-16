import {
  type Request,
  type Response,
  type RouteParameters,
} from 'express-serve-static-core';

export interface Handler<Route extends string, Dto> {
  (
    request: Request<RouteParameters<Route>, any, Dto>,
    response: Response
  ): void | Promise<void>;
}

export interface HandlerBuilderMetadata {
  ProducesResponseType(
    statusCode: number
  ): HandlerBuilderMetadata & HandlerBuilderHttpMethods;

  // allow for more metadata attribute thingies to be added
  [extras: string]: (
    ...prams: any[]
  ) => HandlerBuilderMetadata & HandlerBuilderHttpMethods;
}

export interface HandlerBuilderHttpMethods {
  Post<Dto>(): HandlerBuilderRouteHandler<Dto>;
  Put<Dto>(): HandlerBuilderRouteHandler<Dto>;
  Get(): HandlerBuilderRouteHandler<never>;
  Delete(): HandlerBuilderRouteHandler<never>;
}

export interface HandlerBuilderRouteHandler<Dto = never> {
  <Route extends string = ''>(route: Route): HandlerBuilderHandler<Route, Dto>;
}

export interface HandlerBuilderHandler<Route extends string = '', Dto = never> {
  (handler: Handler<Route, Dto>): ControllerMethodDeclarator<Route, Dto>;
}

export interface ControllerMethodDeclarator<Route extends string, Dto> {
  method: string;
  route: string;
  handler: Handler<Route, Dto>;
  metadata: HandlerMetadata;
}

interface HandlerMetadata {
  validResponseCodes?: number[];
}

interface CreateDto {
  //
  title: string;
}

const ProducesResponseType: HandlerBuilderMetadata['ProducesResponseType'] =
  function ProducesResponseType(statusCode: number) {
    return {
      Delete: null as any,
      Get: null as any,
      Put: null as any,
      Post: null as any,
      ProducesResponseType: null as any,
    };
  };
const Post: HandlerBuilderHttpMethods['Post'] = function Post<Dto>() {
  return <Route extends string>(route: Route) => {
    return (handler: Handler<Route, Dto>) => {
      return {
        handler,
        metadata: {
          //
        },
        method: 'POST',
        route,
      };
    };
  };
};

const Get: HandlerBuilderHttpMethods['Get'] = function Get() {
  return <Route extends string>(route: Route) => {
    return (handler: Handler<Route, never>) => {
      return {
        handler,
        metadata: {
          //
        },
        method: 'GET',
        route,
      };
    };
  };
};

Post<CreateDto>()('/todos/:id')(async (request, response) => {
  //
  request.body.title;
  request.params.id;
});

Get()('/todos/:id')(async (request, response) => {});
