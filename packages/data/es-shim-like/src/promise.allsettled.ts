import { defineEsShim } from '@nolyfill/shared';

const implementation = Promise.allSettled || function allSettled<T>(this: typeof Promise, iterable: Iterable<T | PromiseLike<T>>): Promise<Array<PromiseSettledResult<Awaited<T>> | PromiseRejectedResult>> {
  const $reject = Promise.reject.bind(this);
  const $resolve = Promise.resolve.bind(this);
  const $all = Promise.all.bind(this);
  return $all(Array.from(iterable).map((item) => {
    const p: Promise<Awaited<T>> = $resolve(item);
    // eslint-disable-next-line sukka/no-try-promise -- this is only catch when something goes horibbly wrong
    try {
      return p.then(
        (value): PromiseFulfilledResult<Awaited<T>> => ({ status: 'fulfilled', value })
      ).catch(
        (error): PromiseRejectedResult => ({ status: 'rejected', reason: error })
      );
    } catch (e) {
      return $reject(e);
    }
  }));
};

export default defineEsShim(implementation, true, implementation.bind(Promise));
