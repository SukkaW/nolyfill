export interface EsShimProp<I> {
  implementation: I,
  getPolyfill(): I,
  shim(): I
}

export function makeEsShim<T extends object, I>(shim: T, implementation: I): asserts shim is T & EsShimProp<I> {
  const getPolyfill = () => implementation;
  if (!('implementation' in shim)) {
    Object.defineProperty(shim, 'implementation', {
      configurable: true,
      enumerable: false,
      value: implementation,
      writable: true
    });
  }
  if (!('getPolyfill' in shim)) {
    Object.defineProperty(shim, 'getPolyfill', {
      configurable: true,
      enumerable: false,
      value: getPolyfill,
      writable: true
    });
  }
  if (!('shim' in shim)) {
    Object.defineProperty(shim, 'shim', {
      configurable: true,
      enumerable: false,
      value: getPolyfill,
      writable: true
    });
  }
}
