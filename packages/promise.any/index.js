'use strict';
const { makeEsShim } = require('@nolyfill/shared');
const impl = function any(iterable) {
  const AggregateError = require('@nolyfill/es-aggregate-error/polyfill')();
  try {
    return Promise.all(
      Array.from(iterable)
        .map((item) => Promise.resolve(item).then(x => Promise.reject(x), x => x))
    ).then(
      (errors) => {
        throw new AggregateError(errors, 'Every promise rejected');
      },
      x => x
    );
  } catch (e) {
    return Promise.reject(e);
  }
};
const bound = impl;
makeEsShim(bound, impl);
module.exports = bound;
