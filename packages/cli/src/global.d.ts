declare module 'core-js-pure/features/promise/any' {
  function _any<T extends readonly unknown[] | []>(values: T): Promise<Awaited<T[number]>>;
  function _any<T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>>;
  export default _any;
}
