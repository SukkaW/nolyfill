import { defineEsShim } from '@nolyfill/shared';

const implementation = Array.prototype.toSorted
  || function toSorted<T>(this: T[], compareFn: (a: T, b: T) => number) {
    const o = Object(this);
    const l = Number(o.length);
    const a: T[] = new Array(l);
    for (let i = 0; i < l; i++) {
      a[i] = o[i];
    }
    Array.prototype.sort.call(a, compareFn);
    return a;
  };

export default defineEsShim(implementation);
