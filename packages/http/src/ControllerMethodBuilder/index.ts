import { type Bag, type KnownKeysOf } from '@appr/core';
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

export interface ControllerMethodDescriptor<Route extends string, Dto> {
  method: Uppercase<KnownKeysOf<HttpMethodSetterRegistry>>;
  route: string;
  handler: Handler<Route, Dto>;
  metadata: HandlerMetadata;
}

export interface HandlerMetadata {
  validResponseCodes?: Set<number>;
}

export interface HandlerSetter<Route extends string, Dto> {
  (handler: Handler<Route, Dto>): ControllerMethodDescriptor<Route, Dto>;
}

export interface RouteSetter<Dto> {
  <Route extends string>(route: Route): HandlerSetter<Route, Dto>;
}

export interface HttpMethodSetterRegistry {
  Get(): RouteSetter<never>;
  Head(): RouteSetter<never>;
  Post<Dto>(): RouteSetter<Dto>;
  Delete(): RouteSetter<never>;
  Put<Dto>(): RouteSetter<Dto>;
  Connect(): RouteSetter<never>;
  Options(): RouteSetter<never>;
  Trace(): RouteSetter<never>;
  Patch<Dto>(): RouteSetter<Dto>;
}

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

function handlerSetterFactory<Route extends string, Dto>(
  route: Route,
  method: Uppercase<KnownKeysOf<HttpMethodSetterRegistry>>
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
  method: Uppercase<KnownKeysOf<HttpMethodSetterRegistry>>
) {
  return function <Route extends string>(route: Route) {
    return handlerSetterFactory<Route, Dto>(route, method);
  };
}

interface DeclaratorMiddleware<Route extends string, Dto> {
  (
    metadata: ControllerMethodDescriptor<Route, Dto>,
    next: (metadata: ControllerMethodDescriptor<Route, Dto>) => void
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

export function registerHttpMethod<
  Key extends KnownKeysOf<HttpMethodSetterRegistry>
>(key: Key): HttpMethodSetterRegistry[Key] {
  const method = key.toUpperCase() as Uppercase<Key>;
  const impl = () => routeSetterFactory<never>(method);
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

export function registerMetadataSetter<
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

export const Get = registerHttpMethod('Get');
export const Head = registerHttpMethod('Head');
export const Post = registerHttpMethod('Post');
export const Put = registerHttpMethod('Put');
export const Delete = registerHttpMethod('Delete');
export const Connect = registerHttpMethod('Connect');
export const Options = registerHttpMethod('Options');
export const Trace = registerHttpMethod('Trace');
export const Patch = registerHttpMethod('Patch');

export type Controller = Bag<ControllerMethodDescriptor<string, any>>;

export interface ControllerFactory {
  (...prams: any[]): Controller;
}
