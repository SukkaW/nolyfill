declare const _default: import("@nolyfill/shared").DefineEsShim<{
    (separator: string | RegExp, limit?: number): string[];
    (splitter: {
        [Symbol.split](string: string, limit?: number): string[];
    }, limit?: number): string[];
}, import("@nolyfill/shared").UncurryThis<{
    (separator: string | RegExp, limit?: number): string[];
    (splitter: {
        [Symbol.split](string: string, limit?: number): string[];
    }, limit?: number): string[];
}>>;
export default _default;
