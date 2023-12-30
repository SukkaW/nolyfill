import { defineEsShim } from '@nolyfill/shared';

const implementation = Array.prototype.toReversed
  || function toReversed<T>(this: T[]) {
    const o = Object(this);
    const l = Number(o.length);
    const a: T[] = new Array(l);
    let k = 0;
    while (k < l) {
      a[k] = o[l - k - 1];
      k += 1;
    }
    return a;
  };

export default defineEsShim(implementation);
