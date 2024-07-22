export interface EsShimProp<I> {
  implementation: I,
  getPolyfill(): I,
  shim(): I
}

const GET_POLYFILL = 'getPolyfill';
const SHIM = 'shim';
const IMPLEMENTATION = 'implementation';

const sharedDescriptor = {
  configurable: true,
  enumerable: false,
  writable: true
};

const ObjectDefineProperty = Object.defineProperty;

export function makeEsShim<T extends object, I>(shim: T, implementation: I): asserts shim is T & EsShimProp<I> {
  const getPolyfill = () => implementation;
  if (!(IMPLEMENTATION in shim)) {
    ObjectDefineProperty(shim, IMPLEMENTATION, {
      value: implementation,
      ...sharedDescriptor
    });
  }
  if (!(GET_POLYFILL in shim)) {
    ObjectDefineProperty(shim, GET_POLYFILL, {
      value: getPolyfill,
      ...sharedDescriptor
    });
  }
  if (!(SHIM in shim)) {
    ObjectDefineProperty(shim, SHIM, {
      value: getPolyfill,
      ...sharedDescriptor
    });
  }
}
