export type IsEqual<Result> = (prev: Result, next: Result) => boolean;

export function isEqualDefault<Result>(prev: Result, next: Result) {
  return prev === next;
}
