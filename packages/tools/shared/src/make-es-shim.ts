const defineProperty = (object: any, name: string | number | symbol, value: any) => {
  if (name in object) {
    return;
  }
  Object.defineProperty(object, name, {
    configurable: true,
    enumerable: false,
    value,
    writable: true
  });
};

export interface EsShimProp<I> {
  implementation: I,
  getPolyfill(): I,
  shim(): I
}

export function makeEsShim<T extends object, I>(shim: T, implementation: I): asserts shim is T & EsShimProp<I> {
  const getPolyfill = () => implementation;
  defineProperty(shim, 'implementation', implementation);
  defineProperty(shim, 'getPolyfill', getPolyfill);
  defineProperty(shim, 'shim', getPolyfill);
}
