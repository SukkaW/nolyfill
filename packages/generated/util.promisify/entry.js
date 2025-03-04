'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customPromisifyArgs = void 0;
const shared_1 = require("@nolyfill/shared");
const safe_array_concat_1 = __importDefault(require("@nolyfill/safe-array-concat"));
const kCustomPromisifiedSymbol = Symbol.for('nodejs.util.promisify.custom');
const kCustomPromisifyArgsSymbol = Symbol('customPromisifyArgs');
function promisify(orig) {
    if (typeof orig !== 'function') {
        const error = new TypeError('The "original" argument must be of type function');
        error.code = 'ERR_INVALID_ARG_TYPE';
        error.toString = function value() {
            return `${this.name}[${this.code}]: ${this.message}`;
        };
        throw error;
    }
    if (kCustomPromisifiedSymbol in orig && orig[kCustomPromisifiedSymbol]) {
        const customFunction = orig[kCustomPromisifiedSymbol];
        if (typeof customFunction !== 'function') {
            const customError = new TypeError('The [util.promisify.custom] property must be of type function.');
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
    const argumentNames = kCustomPromisifyArgsSymbol in orig && orig[kCustomPromisifyArgsSymbol];
    const promisified = function fn(...args) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias -- wrap fn
        const self = this;
        return new Promise((resolve, reject) => {
            orig.apply(self, (0, safe_array_concat_1.default)(args, (err) => {
                const values = args.length > 1 ? args.slice(1) : [];
                if (err) {
                    reject(err);
                }
                else if (argumentNames && typeof argumentNames !== 'undefined' && values.length > 1) {
                    const obj = {};
                    Array.prototype.forEach.call(argumentNames, (name, index) => {
                        obj[name] = values[index];
                    });
                    resolve(obj);
                }
                else {
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
        }
        catch (_a) {
            // handle nonconfigurable function properties
        }
    });
    return promisified;
}
promisify.custom = kCustomPromisifiedSymbol;
exports.default = (0, shared_1.defineEsShim)(promisify, true);
/**
 * @deprecated
 * Not exposed by native `util.promisify` or supported by browserify's `util.promisify`.
 *
 * Use `util.promisify.custom` instead.
 */
exports.customPromisifyArgs = kCustomPromisifyArgsSymbol;

Object.assign(exports.default, exports); module.exports = exports.default;
