declare const _default: import("@nolyfill/shared").DefineEsShim<{
    <T extends readonly unknown[] | []>(values: T): Promise<Awaited<T[number]>>;
    <T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>>;
}, {
    <T extends readonly unknown[] | []>(values: T): Promise<Awaited<T[number]>>;
    <T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>>;
}>;
export default _default;
