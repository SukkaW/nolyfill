declare const _default: import("@nolyfill/shared").DefineEsShim<{
    (searchValue: string | RegExp, replaceValue: string): string;
    (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
}, import("@nolyfill/shared").UncurryThis<{
    (searchValue: string | RegExp, replaceValue: string): string;
    (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
}>>;
export default _default;
