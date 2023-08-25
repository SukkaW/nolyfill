declare module '@nolyfill/promise.any/implementation' {
  function _any<T extends readonly unknown[] | []>(values: T): Promise<Awaited<T[number]>>;
  function _any<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>>;
  export default _any;
}
