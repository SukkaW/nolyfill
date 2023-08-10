'use strict';

const { uncurryThis } = require('@nolyfill/shared');
const bL = uncurryThis(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get);

module.exports = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  try {
    bL(obj);
    return true;
  } catch (_) {
    return false;
  }
};
