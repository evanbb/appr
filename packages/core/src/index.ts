export type KnownKeysOf<T> = keyof {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

export type Bag<Stuff> = any extends infer Q
  ? {
      [K in keyof Q]: K extends string
        ? Q[K] extends Stuff
          ? Stuff
          : never
        : never;
    } extends infer P
    ? P extends Q
      ? P
      : never
    : never
  : never;
