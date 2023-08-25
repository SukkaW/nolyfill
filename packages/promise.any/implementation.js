'use strict';
module.exports = Promise.any || function any(iterable) {
  const AggregateError = require('@nolyfill/es-aggregate-error/polyfill')();
  const $reject = Promise.reject.bind(this);
  const $resolve = Promise.resolve.bind(this);
  const $all = Promise.all.bind(this);

  try {
    return $all(
      Array.from(iterable)
        .map((item) => $resolve(item).then(x => $reject(x), x => x))
    ).then(
      (errors) => {
        throw new AggregateError(errors, 'Every promise rejected');
      },
      x => x
    );
  } catch (e) {
    return $reject(e);
  }
};;
