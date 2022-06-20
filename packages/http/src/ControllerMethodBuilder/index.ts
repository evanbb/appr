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

export interface HandlerMetadata {
  validResponseCodes?: Set<number>;
}

export interface HandlerSetter<Route extends string = '', Dto = never> {
  (handler: Handler<Route, Dto>): ControllerMethodDeclarator<Route, Dto>;
}

export interface RouteSetter<Dto = never> {
  <Route extends string = ''>(route: Route): HandlerSetter<Route, Dto>;
}

export interface HttpMethodSetterRegistry {
  [extras: string]: (<Dto>() => RouteSetter<Dto>) | (() => RouteSetter<never>);
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
  [extras: string]: (...prams: any[]) => MetadataConfigurator;
}

export interface MetadataSetterRegistry {
  ProducesResponseType(statusCode: number): MetadataConfigurator;
}

export type MetadataSetters = {
  [K in KnownKeysOf<MetadataSetterRegistry>]: MetadataSetterRegistry[K];
};

export type MetadataSetterMiddleware = {
  [K in KnownKeysOf<MetadataSetterRegistry>]: (
    ...input: Parameters<MetadataSetterRegistry[K]>
  ) => MetadataSetterMiddleware & HttpMethodSetterFactories;
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

export function routeSetterFactory<Dto>(
  method: KnownKeysOf<HttpMethodSetterRegistry>
) {
  return function <Route extends string = ''>(route: Route) {
    return handlerSetterFactory<Route, Dto>(route, method);
  };
}

interface DeclaratorMiddleware<Route extends string, Dto> {
  (
    metadata: ControllerMethodDeclarator<Route, Dto>,
    next: (metadata: ControllerMethodDeclarator<Route, Dto>) => void
  ): void;
}

interface MetadataConfigurator {
  (metadata: HandlerMetadata): void;
}

export function metadataMiddlewareFactory(
  configurator: MetadataConfigurator
): MetadataSetterMiddleware & HttpMethodSetterFactories {
  const methodSetters = getHttpMethodSetters();
  const metadataSetters = getMetadataSetters();

  return {
    ...methodSetters,
    ...metadataSetters,
  };
}

const httpMethodSetterRegistrations = new Map<
  KnownKeysOf<HttpMethodSetterRegistry>,
  unknown
>();

function registerHttpMethodSetter<
  Key extends KnownKeysOf<HttpMethodSetterRegistry>
>(key: Key): HttpMethodSetterRegistry[Key] {
  const impl = () => routeSetterFactory<never>(key);
  httpMethodSetterRegistrations.set(key, impl);
  return impl as HttpMethodSetterRegistry[Key];
}

function getHttpMethodSetters() {
  return Array.from(httpMethodSetterRegistrations.entries()).reduce(
    (agg, curr) => ({
      ...agg,
      [curr[0]]: curr[1] as
        | (<Dto>() => RouteSetter<Dto>)
        | (() => RouteSetter<never>),
    }),
    {} as HttpMethodSetterRegistry
  );
}

const metadataSetterRegistrations = new Map<
  KnownKeysOf<MetadataSetterRegistry>,
  unknown
>();

function registerMetadataSetter<
  Key extends KnownKeysOf<MetadataSetterRegistry>
>(
  key: Key,
  implementation: MetadataSetterRegistry[Key]
): MetadataSetterMiddleware[Key] {
  const impl = ((...prams: Parameters<MetadataSetterRegistry[Key]>) => {
    const metadataSetter = implementation.apply(undefined, prams);
    return metadataMiddlewareFactory(metadataSetter);
  }) as MetadataSetterMiddleware[Key];
  metadataSetterRegistrations.set(key, impl);
  return impl;
}

function getMetadataSetters() {
  return Array.from(metadataSetterRegistrations.entries()).reduce(
    (agg, curr) => ({
      ...agg,
      [curr[0]]: curr[1] as (
        ...prams: any[]
      ) => MetadataSetterMiddleware & HttpMethodSetterFactories,
    }),
    {} as MetadataSetterMiddleware & HttpMethodSetterFactories
  );
}

export const Get = registerHttpMethodSetter('Get');
export const Post = registerHttpMethodSetter('Post');
export const Put = registerHttpMethodSetter('Put');
export const Delete = registerHttpMethodSetter('Delete');

export const ProducesResponseType = registerMetadataSetter(
  'ProducesResponseType',
  (statusCode: number) => (metadata: HandlerMetadata) => {
    metadata.validResponseCodes =
      metadata.validResponseCodes || new Set<number>();
    metadata.validResponseCodes.add(statusCode);
  }
);
