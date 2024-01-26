'use strict';

import type { CustomPromisify } from 'util';

import { defineEsShim } from '@nolyfill/shared';
import safeConcat from '@nolyfill/safe-array-concat';

const kCustomPromisifiedSymbol = Symbol.for('nodejs.util.promisify.custom');
const kCustomPromisifyArgsSymbol = Symbol('customPromisifyArgs');

// eslint-disable-next-line @typescript-eslint/ban-types -- overload signature
function promisify<TCustom extends Function>(fn: CustomPromisify<TCustom>): TCustom;

function promisify<TResult>(
  fn: (callback: (err: any, result: TResult) => void) => void,
): () => Promise<TResult>;
function promisify(fn: (callback: (err?: any) => void) => void): () => Promise<void>;

function promisify<T1, TResult>(
  fn: (arg1: T1, callback: (err: any, result: TResult) => void) => void,
): (arg1: T1) => Promise<TResult>;
function promisify<T1>(fn: (arg1: T1, callback: (err?: any) => void) => void): (arg1: T1) => Promise<void>;

function promisify<T1, T2, TResult>(
  fn: (arg1: T1, arg2: T2, callback: (err: any, result: TResult) => void) => void,
): (arg1: T1, arg2: T2) => Promise<TResult>;
function promisify<T1, T2>(
  fn: (arg1: T1, arg2: T2, callback: (err?: any) => void) => void,
): (arg1: T1, arg2: T2) => Promise<void>;

function promisify<T1, T2, T3, TResult>(
  fn: (arg1: T1, arg2: T2, arg3: T3, callback: (err: any, result: TResult) => void) => void,
): (arg1: T1, arg2: T2, arg3: T3) => Promise<TResult>;
function promisify<T1, T2, T3>(
  fn: (arg1: T1, arg2: T2, arg3: T3, callback: (err?: any) => void) => void,
): (arg1: T1, arg2: T2, arg3: T3) => Promise<void>;

function promisify<T1, T2, T3, T4, TResult>(
  fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, callback: (err: any, result: TResult) => void) => void,
): (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => Promise<TResult>;
function promisify<T1, T2, T3, T4>(
  fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, callback: (err?: any) => void) => void,
): (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => Promise<void>;

function promisify<T1, T2, T3, T4, T5, TResult>(
  fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, callback: (err: any, result: TResult) => void) => void,
): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5) => Promise<TResult>;
function promisify<T1, T2, T3, T4, T5>(
  fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, callback: (err?: any) => void) => void,
): (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5) => Promise<void>;

// eslint-disable-next-line @typescript-eslint/ban-types -- overload signature
function promisify(orig: Function): Function {
  if (typeof orig !== 'function') {
    const error = new TypeError('The "original" argument must be of type function') as NodeJS.ErrnoException;
    error.code = 'ERR_INVALID_ARG_TYPE';
    error.toString = function value() {
      return `${this.name}[${this.code}]: ${this.message}`;
    };
    throw error;
  }

  if (kCustomPromisifiedSymbol in orig && orig[kCustomPromisifiedSymbol]) {
    const customFunction = orig[kCustomPromisifiedSymbol];
    if (typeof customFunction !== 'function') {
      const customError = TypeError('The [util.promisify.custom] property must be of type function.') as NodeJS.ErrnoException;
      customError.code = 'ERR_INVALID_ARG_TYPE';
      customError.toString = function value() {
        return `${this.name}[${this.code}]: ${this.message}`;
      };
      throw customError;
    }
    Object.defineProperty(customFunction, kCustomPromisifiedSymbol, {
      configurable: true,
      enumerable: false,
      value: customFunction,
      writable: false
    });
    return customFunction;
  }

  // Names to create an object from in case the callback receives multiple
  // arguments, e.g. ['stdout', 'stderr'] for child_process.exec.
  const argumentNames = kCustomPromisifyArgsSymbol in orig && (orig[kCustomPromisifyArgsSymbol] as ArrayLike<unknown> | undefined);

  const promisified = function fn(this: any, ...args: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias -- wrap fn
    const self = this;
    return new Promise((resolve, reject) => {
      orig.apply(self, safeConcat(args, (err: any) => {
        const values = args.length > 1 ? args.slice(1) : [];
        if (err) {
          reject(err);
        } else if (argumentNames && typeof argumentNames !== 'undefined' && values.length > 1) {
          const obj: Record<string, unknown> = {};
          Array.prototype.forEach.call(argumentNames, (name: string, index: number) => {
            obj[name] = values[index];
          });
          resolve(obj);
        } else {
          resolve(values[0]);
        }
      }));
    });
  };

  Object.setPrototypeOf(promisified, Object.getPrototypeOf(orig));

  Object.defineProperty(promisified, kCustomPromisifiedSymbol, {
    configurable: true,
    enumerable: false,
    value: promisified,
    writable: false
  });
  const descriptors = Object.getOwnPropertyDescriptors(orig);
  Array.prototype.forEach.call(descriptors, (k, v) => {
    try {
      Object.defineProperty(promisified, k, v);
    } catch {
      // handle nonconfigurable function properties
    }
  });
  return promisified;
}

promisify.custom = kCustomPromisifiedSymbol;

export default defineEsShim(promisify, true);
/**
 * @deprecated
 * Not exposed by native `util.promisify` or supported by browserify's `util.promisify`.
 *
 * Use `util.promisify.custom` instead.
 */
export const customPromisifyArgs = kCustomPromisifyArgsSymbol;
