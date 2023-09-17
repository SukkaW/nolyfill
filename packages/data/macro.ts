/* eslint-disable @typescript-eslint/unbound-method -- codegen */
export interface defineEsShimParameters {
  name: string,
  dependencies: Record<string, string>,
  polyfill(): void,
  auto(): void,
  implementation: any,
  index(): void
}

export const defineEsShim = ({
  polyfill,
  auto,
  implementation,
  index
}: defineEsShimParameters) => {
  return {
    auto,
    polyfill,
    implementation,
    index
  };
};

defineEsShim({
  name: 'array-includes',
  dependencies: {},
  implementation: Array.prototype.includes,
  index() {
    const { uncurryThis, makeEsShim } = require('@nolyfill/shared');
    const impl = Array.prototype.includes;
    const bound = uncurryThis(impl);
    makeEsShim(bound, impl);
    return bound;
  },
  polyfill() {
    return Array.prototype.includes;
  },
  shim() {
    return Array.prototype.includes;
  }
});
