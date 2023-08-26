'use strict';
const { makeEsShim } = require('@nolyfill/shared');
const impl = Promise.allSettled || function allSettled(iterable) {
  const $reject = Promise.reject.bind(this);
  const $resolve = Promise.resolve.bind(this);
  const $all = Promise.all.bind(this);
  return $all(Array.from(iterable).map((item) => {
    const p = $resolve(item);
    try {
      return p.then(
        (value) => ({ status: 'fulfilled', value }),
        (reason) => ({ status: 'rejected', reason })
      );
    } catch (e) {
      return $reject(e);
    }
  }));
};
const bound = impl.bind(Promise);
makeEsShim(bound, impl);
module.exports = bound;
