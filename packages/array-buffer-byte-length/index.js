'use strict';

const { uncurryThis } = require('@nolyfill/shared');
const bL = uncurryThis(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get);
const isArrayBuffer = require('@nolyfill/is-array-buffer');

module.exports = (ab) => {
  if (!isArrayBuffer(ab)) {
    return NaN;
  }
  return bL(ab);
};
