import { defineEsShim } from '@nolyfill/shared';
import createAggregateError from '@nolyfill/es-aggregate-error/polyfill';

const implementation = Promise.any || function any<T>(this: typeof Promise, iterable: ReadonlyArray<T | PromiseLike<T>> | Readonly<Iterable<T | PromiseLike<T>>>): Promise<T> {
  const AggregateError = createAggregateError();
  const $reject = Promise.reject.bind(this);
  const $resolve = Promise.resolve.bind(this);
  const $all = Promise.all.bind(this);

  try {
    return $all(
      Array.from(iterable)
        .map((item) => $resolve(item).catch(error => error).then(x => $reject(x)))
    ).catch(error => error).then(
      (errors) => {
        throw new AggregateError(errors, 'Every promise rejected');
      }
    );
  } catch (e) {
    return $reject(e);
  }
};

export default defineEsShim(implementation, true, implementation.bind(Promise));
