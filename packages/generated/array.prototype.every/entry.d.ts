declare const _default: import("@nolyfill/shared").DefineEsShim<{
    <S extends any>(predicate: (value: any, index: number, array: any[]) => value is S, thisArg?: any): this is S[];
    (predicate: (value: any, index: number, array: any[]) => unknown, thisArg?: any): boolean;
}, import("@nolyfill/shared").UncurryThis<unknown, {
    <S extends any>(predicate: (value: any, index: number, array: any[]) => value is S, thisArg?: any): this is S[];
    (predicate: (value: any, index: number, array: any[]) => unknown, thisArg?: any): boolean;
}>>;
export default _default;
