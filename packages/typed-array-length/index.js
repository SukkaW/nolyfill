'use strict';

const { TypedArrayPrototype, uncurryThis } = require('@nolyfill/shared');

const typedArrayLength = uncurryThis(Object.getOwnPropertyDescriptor(TypedArrayPrototype, 'length').get);

module.exports = (value) => {
  try {
    return typedArrayLength(value);
  } catch (e) {
    return false;
  }
};
