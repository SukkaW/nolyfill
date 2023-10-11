import { defineEsShim } from '@nolyfill/shared';

const implementation = Promise.allSettled || function allSettled<T>(this: typeof Promise, iterable: Iterable<T | PromiseLike<T>>): Promise<Array<PromiseSettledResult<Awaited<T>>>> {
  const $reject = Promise.reject.bind(this);
  const $resolve = Promise.resolve.bind(this);
  const $all = Promise.all.bind(this);
  return $all(Array.from(iterable).map((item) => {
    const p: Promise<Awaited<T>> = $resolve(item);
    try {
      return p.then(
        (value): PromiseFulfilledResult<Awaited<T>> => ({ status: 'fulfilled', value }),
        (reason): PromiseRejectedResult => ({ status: 'rejected', reason })
      );
    } catch (e) {
      return $reject(e);
    }
  }));
};

export default defineEsShim(implementation, true, implementation.bind(Promise));
