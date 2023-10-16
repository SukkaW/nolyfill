import { defineProperties } from './define-properties';

export interface EsShimProp<I> {
  implementation: I,
  getPolyfill(): I,
  shim(): I
}

export function makeEsShim<T extends object, I>(shim: T, implementation: I): asserts shim is T & EsShimProp<I> {
  defineProperties(shim, {
    implementation,
    getPolyfill: () => implementation,
    shim: () => implementation
  });
}
