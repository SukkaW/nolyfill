import { makeEsShim } from './make-es-shim';
import { uncurryThis } from './uncurry-this';
import type { UncurryThis } from './uncurry-this';

interface DefineEsShim<T, I> {
  implementation: T,
  polyfill(): T,
  shim(): T,
  auto(): void,
  index(): I
}

export function defineEsShim<T, F extends (this: T, ...args: any[]) => any>(impl: F, isStaticMethod?: false, main?: null): DefineEsShim<F, UncurryThis<T, F>>;
export function defineEsShim<T, F extends (this: T, ...args: any[]) => any>(impl: F, isStaticMethod: true, main?: null): DefineEsShim<F, F>;
export function defineEsShim<T, F extends (this: T, ...args: any[]) => any, M>(impl: F, isStaticMethod: boolean, main: M): DefineEsShim<F, M>;
export function defineEsShim<T, F extends (this: T, ...args: any[]) => any, M>(impl: F, isStaticMethod = false, main: M | null = null) {
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
      const bound = main || (isStaticMethod ? impl : uncurryThis<T, F>(impl));
      makeEsShim(bound, impl);
      return bound;
    }
  };
}
