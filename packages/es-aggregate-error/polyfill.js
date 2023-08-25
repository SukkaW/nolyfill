'use strict';
module.exports = () => typeof AggregateError === 'function'
  ? AggregateError
  : (() => {
    function AggregateError(errors, message) {
      const error = new Error(message);
      Object.setPrototypeOf(error, AggregateError.prototype);
      delete error.constructor;
      Object.defineProperty(error, 'errors', { value: Array.from(errors) });
      return error;
    }
    Object.defineProperty(AggregateError, 'prototype', { writable: false });
    Object.defineProperties(AggregateError.prototype, {
      constructor: {
        enumerable: false,
        configurable: true,
        writable: true,
        value: AggregateError
      },
      message: {
        enumerable: false,
        configurable: true,
        writable: true,
        value: ''
      },
      name: {
        enumerable: false,
        configurable: true,
        writable: true,
        value: 'AggregateError'
      }
    });
    Object.setPrototypeOf(AggregateError.prototype, Error.prototype);
    return AggregateError;
  })();
