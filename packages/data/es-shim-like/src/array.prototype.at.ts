import { defineEsShim } from '@nolyfill/shared';

const implementation = Array.prototype.at || function at<T>(this: T[], n: number) {
  n = Math.trunc(n) || 0;
  if (n < 0) n += this.length;
  if (n < 0 || n >= this.length) return undefined;
  return this[n];
};

export default defineEsShim(implementation);
