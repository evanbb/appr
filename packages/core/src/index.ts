export type KnownKeysOf<T> = keyof {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

export type EveryMemberOfTheThingIsOfThisType<TheThing, ThisType> = {
  [K in keyof TheThing]: TheThing[K] extends ThisType ? TheThing[K] : never;
} extends TheThing
  ? TheThing
  : never;
