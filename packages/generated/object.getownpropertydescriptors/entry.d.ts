declare const _default: import("@nolyfill/shared").DefineEsShim<(<T>(o: T) => { [P in keyof T]: TypedPropertyDescriptor<T[P]>; } & {
    [x: string]: PropertyDescriptor;
}), <T>(o: T) => { [P in keyof T]: TypedPropertyDescriptor<T[P]>; } & {
    [x: string]: PropertyDescriptor;
}>;
export default _default;
