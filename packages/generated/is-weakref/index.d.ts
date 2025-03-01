declare const is: <T extends WeakKey>(value: unknown) => value is WeakRef<T>;
export default is;
