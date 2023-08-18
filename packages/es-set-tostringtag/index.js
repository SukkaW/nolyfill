'use strict';
module.exports = (object, value, options = {}) => {
  if (options.force || !Object.prototype.hasOwnProperty.call(object, Symbol.toStringTag)) {
    Object.defineProperty(object, Symbol.toStringTag, {
      configurable: true,
      enumerable: false,
      value,
      writable: false
    });
  }
};
