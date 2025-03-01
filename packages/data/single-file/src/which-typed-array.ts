import { uncurryThis } from '@nolyfill/shared';

const availableTypedArray = [
  'BigInt64Array', 'BigUint64Array',
  'Float32Array', 'Float64Array',
  'Int16Array', 'Int32Array', 'Int8Array',
  'Uint16Array', 'Uint32Array', 'Uint8Array', 'Uint8ClampedArray'
] as const;

type AvailableTypedArray = typeof availableTypedArray[number];

const cacheEntries = Object.entries(
  availableTypedArray.reduce((acc, typedArray) => {
    const proto = Object.getPrototypeOf(new globalThis[typedArray]());
    acc[`$${typedArray}`] = uncurryThis(
      (
        Object.getOwnPropertyDescriptor(proto, Symbol.toStringTag)
          || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(proto), Symbol.toStringTag)
      )!.get!
    );
    return acc;
  }, Object.create(null))
) as Array<[`$${string}`, (...args: unknown[]) => string]>;

const tryTypedArrays = (value: unknown): false | AvailableTypedArray => {
  let found: false | AvailableTypedArray = false;
  cacheEntries.forEach(([typedArray, getter]) => {
    if (!found) {
      try {
        if (`$${getter(value)}` === typedArray) {
          found = typedArray.slice(1) as AvailableTypedArray;
        }
      } catch { /**/ }
    }
  });
  return found;
};

const t = (value: unknown) => {
  if (!value || typeof value !== 'object') { return false; }
  return tryTypedArrays(value);
};

export default t;
