'use strict';
const { TypedArrayPrototype, uncurryThis } = require('@nolyfill/shared');
const typedArrayByteOffSet = uncurryThis(Object.getOwnPropertyDescriptor(TypedArrayPrototype, 'byteOffset').get);
module.exports = (value) => {
  try {
    return typedArrayByteOffSet(value);
  } catch (e) {
    return false;
  }
};
