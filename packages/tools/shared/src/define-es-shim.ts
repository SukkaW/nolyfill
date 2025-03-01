import { makeEsShim } from './make-es-shim';
import type { AnyFunction } from './types';
import { type UncurryThis, uncurryThis } from './uncurry-this';

export interface DefineEsShim<T, I> {
  implementation: T,
  polyfill(): T,
  shim(): T,
  auto(): void,
  index(): I
}

export function defineEsShim<T extends AnyFunction>(impl: T, isStaticMethod?: false, main?: null): DefineEsShim<T, UncurryThis<T>>;
export function defineEsShim<T>(impl: T, isStaticMethod?: false, main?: null): DefineEsShim<T, T>;
export function defineEsShim<T>(impl: T, isStaticMethod: true, main?: null): DefineEsShim<T, T>;
export function defineEsShim<T, I>(impl: T, isStaticMethod: boolean, main: I): DefineEsShim<T, I>;
export function defineEsShim<T extends AnyFunction, M>(impl: T, isStaticMethod = false, main: M | null = null) {
  return {
    /** implementation.js */
    implementation: impl,
    /** polyfill.js */
    polyfill() {
      return impl;
    },
    /** shim.js */
    shim() {
      return impl;
    },
    /** auto.js */
    auto() {
      /** noop */
    },
    index() {
      const bound = main || (isStaticMethod ? impl : uncurryThis(impl));
      makeEsShim(bound, impl);
      return bound;
    }
  };
}
