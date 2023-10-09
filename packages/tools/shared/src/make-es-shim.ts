import { defineProperties } from './define-properties';

export const makeEsShim = (shim: any, implementation: any) => defineProperties(shim, {
  implementation,
  getPolyfill: () => implementation,
  shim: () => implementation
});
