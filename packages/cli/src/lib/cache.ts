/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * This is a re-write of React.cache API. Instead of using a React DOM binding with
 * scoped cache context, the rewritten version uses a module-level global store.
 * The basic functionality is the same, caching any async functions.
 */

/* eslint-disable @typescript-eslint/ban-types -- we are doing low-level stuff */
const UNTERMINATED = 0;
const TERMINATED = 1;
const ERRORED = 2;

interface UnterminatedCacheNode<T> {
  s: 0,
  v: void,
  o: null | WeakMap<Function | Object, CacheNode<T>>,
  p: null | Map<string | number | null | void | symbol | boolean, CacheNode<T>>
}

interface TerminatedCacheNode<T> {
  s: 1,
  v: T,
  o: null | WeakMap<Function | Object, CacheNode<T>>,
  p: null | Map<string | number | null | void | symbol | boolean, CacheNode<T>>
}

interface ErroredCacheNode<T> {
  s: 2,
  v: unknown,
  o: null | WeakMap<Function | Object, CacheNode<T>>,
  p: null | Map<string | number | null | void | symbol | boolean, CacheNode<T>>
}

type CacheNode<T> =
  | TerminatedCacheNode<T>
  | UnterminatedCacheNode<T>
  | ErroredCacheNode<T>;

const fnMap = new WeakMap<Function | Object, CacheNode<any>>();

function createCacheNode<T>(): CacheNode<T> {
  return {
    s: UNTERMINATED, // status, represents whether the cached computation returned a value or threw an error
    v: undefined, // value, either the cached result or an error, depending on s
    o: null, // object cache, a WeakMap where non-primitive arguments are stored
    p: null // primitive cache, a regular Map where primitive arguments are stored.
  };
}

export function cache<A extends any[], T>(fn: (...args: A) => T): (...args: A) => T {
  return function (...args: A) {
    const fnNode = fnMap.get(fn);
    let cacheNode: CacheNode<T>;
    if (fnNode === undefined) {
      cacheNode = createCacheNode();
      fnMap.set(fn, cacheNode);
    } else {
      cacheNode = fnNode;
    }
    for (let i = 0, l = args.length; i < l; i++) {
      const arg = args[i];
      if (
        typeof arg === 'function'
        || (typeof arg === 'object' && arg !== null)
      ) {
        // Objects go into a WeakMap
        let objectCache = cacheNode.o;
        if (objectCache === null) {
          objectCache = new WeakMap();
          cacheNode.o = objectCache;
        }
        const objectNode = objectCache.get(arg);
        if (objectNode === undefined) {
          cacheNode = createCacheNode();
          objectCache.set(arg, cacheNode);
        } else {
          cacheNode = objectNode;
        }
      } else {
        // Primitives go into a regular Map
        let primitiveCache = cacheNode.p;
        if (primitiveCache === null) {
          primitiveCache = new Map();
          cacheNode.p = primitiveCache;
        }
        const primitiveNode = primitiveCache.get(arg);
        if (primitiveNode === undefined) {
          cacheNode = createCacheNode();
          primitiveCache.set(arg, cacheNode);
        } else {
          cacheNode = primitiveNode;
        }
      }
    }
    if (cacheNode.s === TERMINATED) {
      return cacheNode.v;
    }
    if (cacheNode.s === ERRORED) {
      throw cacheNode.v;
    }
    try {
      // eslint-disable-next-line prefer-spread -- We don't want to use rest arguments since we are doing low-level stuff.
      const result = fn.apply(null, args);
      const terminatedNode: TerminatedCacheNode<T> = (cacheNode as any);
      terminatedNode.s = TERMINATED;
      terminatedNode.v = result;
      return result;
    } catch (error) {
      // We store the first error that's thrown and rethrow it.
      const erroredNode: ErroredCacheNode<T> = (cacheNode as any);
      erroredNode.s = ERRORED;
      erroredNode.v = error;
      throw error;
    }
  };
}
