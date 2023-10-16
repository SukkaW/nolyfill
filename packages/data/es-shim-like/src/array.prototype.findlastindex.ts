import { defineEsShim } from '@nolyfill/shared';

const implementation = Array.prototype.findLastIndex
  || function findLastIndex<T>(this: T[], callback: (value: T, index: number, array: T[]) => unknown, thisArg: T[]) {
    for (let i = this.length - 1; i >= 0; i--) {
      if (callback.call(thisArg, this[i], i, this)) return i;
    }
    return -1;
  };

export default defineEsShim(implementation);
