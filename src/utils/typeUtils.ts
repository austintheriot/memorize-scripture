export type ValueOf<T> = T[keyof T];

export type FlattenArray<T> = T extends (infer R)[] ? R : never;

export type EmptyObject = Record<string, never>;