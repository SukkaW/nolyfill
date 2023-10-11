import { defineProperties } from './define-properties';

export interface EsShimProp<T> {
  implementation: T,
  getPolyfill(): T,
  shim(): T
}

export const makeEsShim = (shim: any, implementation: any) => defineProperties(shim, {
  implementation,
  getPolyfill: () => implementation,
  shim: () => implementation
});
