import { makeEsShim } from './make-es-shim';
import { uncurryThis } from './uncurry-this';

export const defineEsShim = (impl: any, isStaticMethod = false, main: any = null) => {
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
      return;
    },
    index() {
      const bound = main || (isStaticMethod ? impl : uncurryThis(impl));
      makeEsShim(bound, impl);
      return bound;
    }
  }
}
