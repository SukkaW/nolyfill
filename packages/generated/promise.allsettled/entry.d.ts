declare const _default: import("@nolyfill/shared").DefineEsShim<{
    <T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: PromiseSettledResult<Awaited<T[P]>>; }>;
    <T>(values: Iterable<T | PromiseLike<T>>): Promise<PromiseSettledResult<Awaited<T>>[]>;
}, any>;
export default _default;
