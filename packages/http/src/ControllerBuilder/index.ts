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

export interface ControllerMethodDeclarator<Route extends string, Dto> {
  method: string;
  route: string;
  handler: Handler<Route, Dto>;
  metadata: HandlerMetadata;
}

interface HandlerMetadata {
  validResponseCodes?: number[];
}

export interface HandlerBuilderHandlerFactory<
  Route extends string = '',
  Dto = never
> {
  (handler: Handler<Route, Dto>): ControllerMethodDeclarator<Route, Dto>;
}

export interface HandlerBuilderRouteHandlerFactory<Dto = never> {
  <Route extends string = ''>(route: Route): HandlerBuilderHandlerFactory<
    Route,
    Dto
  >;
}

export interface HandlerBuilderHttpMethodFactoryRegistry {
  [extras: string]: unknown;
}

export interface HandlerBuilderHttpMethodFactoryRegistry {
  Get(): HandlerBuilderRouteHandlerFactory<never>;
  // Post<Dto>(): HandlerBuilderRouteHandlerFactory<Dto>;
  // Put<Dto>(): HandlerBuilderRouteHandlerFactory<Dto>;
  // Delete(): HandlerBuilderRouteHandlerFactory<never>;
}

export type HandlerBuilderHttpMethodFactories = {
  [K in keyof HandlerBuilderHttpMethodFactoryRegistry as string extends K
    ? never
    : number extends K
    ? never
    : K]: HandlerBuilderHttpMethodFactoryRegistry[K];
};

export interface HandlerBuilderMetadataFactoryRegistry {
  // allow for more metadata attribute thingies to be added
  [extras: string]: (
    ...prams: any[]
  ) => HandlerBuilderMetadataFactories & HandlerBuilderHttpMethodFactories;
}

export interface HandlerBuilderMetadataFactoryRegistry {
  ProducesResponseType(
    statusCode: number
  ): HandlerBuilderMetadataFactories & HandlerBuilderHttpMethodFactories;
}

export type HandlerBuilderMetadataFactories = {
  [K in keyof HandlerBuilderMetadataFactoryRegistry as string extends K
    ? never
    : number extends K
    ? never
    : K]: HandlerBuilderMetadataFactoryRegistry[K];
};

interface CreateDto {
  //
  title: string;
}

const ProducesResponseTypep: HandlerBuilderMetadataFactories['ProducesResponseType'] =
  function ProducesResponseTypep(statusCode: number) {
    return {
      Delete: null as any,
      Get: null as any,
      Put: null as any,
      Post: null as any,
      ProducesResponseType: null as any,
    };
  };

const Postp: HandlerBuilderHttpMethodFactories['Post'] = function Postp<Dto>() {
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

const Getp: HandlerBuilderHttpMethodFactories['Get'] = function Getp() {
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

const Get: HandlerBuilderHttpMethodFactoryRegistry['Get'] =
  () =>
  <Route extends string>(route: Route) =>
  (handler: Handler<Route, never>) => ({
    route,
    handler,
    metadata: {},
    method: 'GET',
  });

ProducesResponseTypep(21).ProducesResponseType(33).Get()('/todos/:id')(
  async (request, response) => {
    //
    request.body.title;
    request.params.id;
  }
);

Getp()('/todos/:id')(async (request, response) => {});
