'use strict';

module.exports = function setFunctionLength(fn, length, loose = false) {
  if (typeof fn !== 'function') {
    throw new TypeError('`fn` is not a function');
  }
  if (typeof length !== 'number' || length < 0 || length > 0xFF_FF_FF_FF || Math.floor(length) !== length) {
    throw new TypeError('`length` must be a positive 32-bit integer');
  }

  let functionLengthIsConfigurable = true;
  let functionLengthIsWritable = true;

  if ('length' in fn) {
    const desc = Object.getOwnPropertyDescriptor(fn, 'length');
    if (desc) {
      functionLengthIsConfigurable = !!desc.configurable;
      functionLengthIsWritable = !!desc.writable;
    }
  }

  if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
    const desc = Object.getOwnPropertyDescriptor(fn, 'length');

    Object.defineProperty(fn, 'length', {
      configurable: desc ? desc.configurable : true,
      enumerable: false,
      value: length,
      writable: false
    });
  }
  return fn;
};
