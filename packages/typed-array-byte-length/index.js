'use strict';

const { TypedArrayPrototype, uncurryThis } = require('@nolyfill/shared');
const typedArrayByteLength = uncurryThis(Object.getOwnPropertyDescriptor(TypedArrayPrototype, 'byteLength').get);

module.exports = (value) => {
  try {
    return typedArrayByteLength(value);
  } catch (e) {
    return false;
  }
};
