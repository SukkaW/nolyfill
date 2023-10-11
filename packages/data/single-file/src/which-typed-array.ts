import { uncurryThis } from '@nolyfill/shared';

const availableTypedArray = [
  'BigInt64Array', 'BigUint64Array',
  'Float32Array', 'Float64Array',
  'Int16Array', 'Int32Array', 'Int8Array',
  'Uint16Array', 'Uint32Array', 'Uint8Array', 'Uint8ClampedArray'
] as const;

type AvaliableTypedArray = typeof availableTypedArray[number];

const cacheEntries = Object.entries(
  availableTypedArray.reduce<Record<`$${AvaliableTypedArray}`, any>>(
    (acc, typedArray) => {
      const proto = Object.getPrototypeOf(new globalThis[typedArray]());
      acc[`$${typedArray}`] = uncurryThis(
        (
          Object.getOwnPropertyDescriptor(proto, Symbol.toStringTag)
          || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(proto), Symbol.toStringTag)
        )!.get!
      );
      return acc;
    },
    Object.create(null)
  )
) as [`$${string}`, any][];

const tryTypedArrays = (value: unknown): false | AvaliableTypedArray => {
  let found: false | AvaliableTypedArray = false;
  cacheEntries.forEach(([typedArray, getter]) => {
    if (!found) {
      try {
        if (`$${getter(value)}` === typedArray) {
          found = typedArray.slice(1) as AvaliableTypedArray;
        }
      } catch (e) { /**/ }
    }
  });
  return found;
};

const t = (value: unknown) => {
  if (!value || typeof value !== 'object') { return false; }
  return tryTypedArrays(value);
};

export default t;
