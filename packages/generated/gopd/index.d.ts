declare const _default: <T>(o: T) => { [P in keyof T]: TypedPropertyDescriptor<T[P]>; } & {
    [x: string]: PropertyDescriptor;
};
export default _default;
