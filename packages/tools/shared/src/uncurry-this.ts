import type { AnyFunction } from './types';

export type UncurryThis<T extends AnyFunction> = (self: T extends (this: infer S, ...args: any[]) => any ? S : unknown, ...args: Parameters<T>) => ReturnType<T>;

export const uncurryThis = <T extends AnyFunction>(fn: T): UncurryThis<T> => (self, ...args) => fn.call(self, ...args);
