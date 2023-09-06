'use strict';
const { uncurryThis } = require('@nolyfill/shared');

const cacheEntries = Object.entries([
  'BigInt64Array', 'BigUint64Array',
  'Float32Array', 'Float64Array',
  'Int16Array', 'Int32Array', 'Int8Array',
  'Uint16Array', 'Uint32Array', 'Uint8Array', 'Uint8ClampedArray'
].reduce((acc, typedArray) => {
  const proto = Object.getPrototypeOf(new globalThis[typedArray]());
  acc[`$${typedArray}`] = uncurryThis((
    Object.getOwnPropertyDescriptor(proto, Symbol.toStringTag)
    || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(proto), Symbol.toStringTag)
  ).get);
  return acc;
}, Object.create(null)));

const tryTypedArrays = (value) => {
  let found = false;
  cacheEntries.forEach(([typedArray, getter]) => {
    if (!found) {
      try {
        if (`$${getter(value)}` === typedArray) {
          found = typedArray.slice(1);
        }
      } catch (e) { /**/ }
    }
  });
  return found;
};

module.exports = (value) => {
  if (!value || typeof value !== 'object') { return false; }
  return tryTypedArrays(value);
};
