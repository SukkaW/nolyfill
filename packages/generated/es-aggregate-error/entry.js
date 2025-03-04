"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("@nolyfill/shared");
const implementation = typeof AggregateError === 'function'
    ? AggregateError
    : (() => {
        function AggregateError(errors, message) {
            const error = new Error(message);
            Object.setPrototypeOf(error, AggregateError.prototype);
            // @ts-expect-error -- manipulating to fake inheritance
            delete error.constructor;
            Object.defineProperty(error, 'errors', { value: Array.from(errors) });
            return error;
        }
        ;
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
exports.default = (0, shared_1.defineEsShim)(implementation, true);

Object.assign(exports.default, exports); module.exports = exports.default;
