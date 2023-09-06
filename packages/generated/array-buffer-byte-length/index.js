'use strict';
const { uncurryThis } = require('@nolyfill/shared');
const isArrayBuffer = require('@nolyfill/is-array-buffer');
const bL = uncurryThis(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get);
module.exports = (ab) => {
  if (!isArrayBuffer(ab)) return NaN;
  return bL(ab);
};
