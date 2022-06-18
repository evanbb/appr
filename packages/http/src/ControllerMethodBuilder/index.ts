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

export function routeSetterFactory<Dto>(
  method: KnownKeysOf<HttpMethodSetterRegistry>
) {
  return function <Route extends string = ''>(route: Route) {
    return handlerSetterFactory<Route, Dto>(route, method);
  };
}

export const Get: HttpMethodSetterRegistry['Get'] = () =>
  routeSetterFactory<never>('Get');

export const Post: HttpMethodSetterRegistry['Post'] = <Dto>() =>
  routeSetterFactory<Dto>('Post');

export const Delete: HttpMethodSetterRegistry['Delete'] = () =>
  routeSetterFactory<never>('Delete');

export const Put: HttpMethodSetterRegistry['Put'] = <Dto>() =>
  routeSetterFactory<Dto>('Put');

interface MetadataConfigurator {
  (metadata: HandlerMetadata): void;
}

export function metadataMiddlewareFactory(
  configurator: MetadataConfigurator
): MetadataSetters & HttpMethodSetterFactories {
  const methodSetters = getHttpMethodSetters();
  const metadataSetters = getMetadataSetters();

  return {
    ...methodSetters,
    ...metadataSetters,
  };
}

export const ProducesResponseType: MetadataSetterRegistry['ProducesResponseType'] =
  (statusCode: number) =>
    metadataMiddlewareFactory((metadata) => {
      metadata.validResponseCodes =
        metadata.validResponseCodes || new Set<number>();

      metadata.validResponseCodes.add(statusCode);
    });

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

function registerMetadataSetter<Impl>(
  key: KnownKeysOf<MetadataSetterRegistry>,
  impl: Impl
) {
  metadataSetterRegistrations.set(key, impl);
}

function getMetadataSetters() {
  return Array.from(metadataSetterRegistrations.entries()).reduce(
    (agg, curr) => ({
      ...agg,
      [curr[0]]: curr[1] as (
        ...prams: any[]
      ) => MetadataSetters & HttpMethodSetterFactories,
    }),
    {} as MetadataSetterRegistry
  );
}

interface CreateDto {
  //
  title: string;
}
