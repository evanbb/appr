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
  Post<Dto>(): HandlerBuilderRouteHandlerFactory<Dto>;
  Delete(): HandlerBuilderRouteHandlerFactory<never>;
  Put<Dto>(): HandlerBuilderRouteHandlerFactory<Dto>;
}

type KnownKeysOf<T> = keyof {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

export type HandlerBuilderHttpMethodFactories = {
  [K in KnownKeysOf<HandlerBuilderHttpMethodFactoryRegistry>]: HandlerBuilderHttpMethodFactoryRegistry[K];
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
  [K in KnownKeysOf<HandlerBuilderMetadataFactoryRegistry>]: HandlerBuilderMetadataFactoryRegistry[K];
};

function HandlerInternal<Route extends string = '', Dto = never>(
  route: Route,
  method: KnownKeysOf<HandlerBuilderHttpMethodFactoryRegistry>
) {
  return function HandlerInternal(handler: Handler<Route, Dto>) {
    return {
      route,
      handler,
      metadata: {},
      method,
    };
  };
}

function RouteInternal<Dto>(
  method: KnownKeysOf<HandlerBuilderHttpMethodFactoryRegistry>
) {
  return function RouteInternal<Route extends string = ''>(route: Route) {
    return HandlerInternal<Route, Dto>(route, method);
  };
}

const Get: HandlerBuilderHttpMethodFactoryRegistry['Get'] = () =>
  RouteInternal<never>('Get');

const Post: HandlerBuilderHttpMethodFactoryRegistry['Post'] = <Dto>() =>
  RouteInternal<Dto>('Post');

const Delete: HandlerBuilderHttpMethodFactoryRegistry['Delete'] = () =>
  RouteInternal<never>('Delete');

const Put: HandlerBuilderHttpMethodFactoryRegistry['Put'] = <Dto>() =>
  RouteInternal<Dto>('Put');

interface CreateDto {
  //
  title: string;
}
