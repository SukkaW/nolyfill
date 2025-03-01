declare const _default: import("@nolyfill/shared").DefineEsShim<{
    <S extends any>(predicate: (value: any, index: number, obj: any[]) => value is S, thisArg?: any): S;
    (predicate: (value: any, index: number, obj: any[]) => unknown, thisArg?: any): any;
}, import("@nolyfill/shared").UncurryThis<{
    <S extends any>(predicate: (value: any, index: number, obj: any[]) => value is S, thisArg?: any): S;
    (predicate: (value: any, index: number, obj: any[]) => unknown, thisArg?: any): any;
}>>;
export default _default;
