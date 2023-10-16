import { defineEsShim } from '@nolyfill/shared';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- polyfill
const implementation = Array.prototype.findLast
  || function findLast<T>(this: T[], callback: (value: T, index: number, array: T[]) => unknown, thisArg: any) {
    for (let i = this.length - 1; i >= 0; i--) {
      const value = this[i];
      if (callback.call(thisArg, value, i, this)) return value;
    }
    return undefined;
  };

export default defineEsShim(implementation);
