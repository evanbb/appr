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

export interface HandlerSetter<Route extends string = '', Dto = never> {
  (handler: Handler<Route, Dto>): ControllerMethodDeclarator<Route, Dto>;
}

export interface RouteSetter<Dto = never> {
  <Route extends string = ''>(route: Route): HandlerSetter<Route, Dto>;
}

export interface HttpMethodSetterRegistry {
  [extras: string]: unknown;
}

export interface HttpMethodSetterRegistry {
  Get(): RouteSetter<never>;
  Post<Dto>(): RouteSetter<Dto>;
  Delete(): RouteSetter<never>;
  Put<Dto>(): RouteSetter<Dto>;
}

type KnownKeysOf<T> = keyof {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

export type HttpMethodSetterFactories = {
  [K in KnownKeysOf<HttpMethodSetterRegistry>]: HttpMethodSetterRegistry[K];
};

export interface MetadataSetterRegistry {
  // allow for more metadata attribute thingies to be added
  [extras: string]: (
    ...prams: any[]
  ) => MetadataSetters & HttpMethodSetterFactories;
}

export interface MetadataSetterRegistry {
  ProducesResponseType(
    statusCode: number
  ): MetadataSetters & HttpMethodSetterFactories;
}

export type MetadataSetters = {
  [K in KnownKeysOf<MetadataSetterRegistry>]: MetadataSetterRegistry[K];
};

function handlerSetterFactory<Route extends string = '', Dto = never>(
  route: Route,
  method: KnownKeysOf<HttpMethodSetterRegistry>
) {
  return function (handler: Handler<Route, Dto>) {
    return {
      route,
      handler,
      metadata: {},
      method,
    };
  };
}

function routeSetterFactory<Dto>(
  method: KnownKeysOf<HttpMethodSetterRegistry>
) {
  return function <Route extends string = ''>(route: Route) {
    return handlerSetterFactory<Route, Dto>(route, method);
  };
}

const Get: HttpMethodSetterRegistry['Get'] = () =>
  routeSetterFactory<never>('Get');

const Post: HttpMethodSetterRegistry['Post'] = <Dto>() =>
  routeSetterFactory<Dto>('Post');

const Delete: HttpMethodSetterRegistry['Delete'] = () =>
  routeSetterFactory<never>('Delete');

const Put: HttpMethodSetterRegistry['Put'] = <Dto>() =>
  routeSetterFactory<Dto>('Put');

const httpMethodSetterRegistrations = new Map<
  KnownKeysOf<HttpMethodSetterRegistry>,
  unknown
>();

function registerHttpMethodSetter<Impl>(
  key: KnownKeysOf<HttpMethodSetterRegistry>,
  impl: Impl
) {
  httpMethodSetterRegistrations.set(key, impl);
}

function getHttpMethodSetters() {
  return Array.from(httpMethodSetterRegistrations.entries()).reduce(
    (agg, curr) => ({
      ...agg,
      [curr[0]]: curr[1],
    }),
    {} as HttpMethodSetterRegistry
  );
}

interface CreateDto {
  //
  title: string;
}
