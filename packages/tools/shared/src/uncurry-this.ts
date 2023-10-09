type UncurryThis<T, F extends (this: T, ...args: unknown[]) => unknown> = (self: T, ...args: Parameters<F>) => ReturnType<F>;

export const uncurryThis = <T, F extends (this: T, ...args: any[]) => any>(fn: F): UncurryThis<T, F> => (thisp, ...args) => fn.call(thisp, ...args);
