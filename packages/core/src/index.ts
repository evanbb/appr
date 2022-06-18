export type KnownKeysOf<T> = keyof {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};
