import { defineEsShim } from '@nolyfill/shared';

const implementation = (Object as any).groupBy || function groupBy<T, K extends PropertyKey>(
  items: Iterable<T>,
  callbackfn: (value: T, index: number) => K
): Record<K, T[]> {
  const o = Object.create(null);
  let k = 0;
  for (const value of items) {
    const key = callbackfn(value, k++);
    if (key in o) {
      Array.prototype.push.call(o[key], value);
    } else {
      o[key] = [value];
    }
  }
  return o;
};

export default defineEsShim(implementation, true);
