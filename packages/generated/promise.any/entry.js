"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("@nolyfill/shared");
const polyfill_1 = __importDefault(require("@nolyfill/es-aggregate-error/polyfill"));
const implementation = Promise.any || function any(iterable) {
    const AggregateError = (0, polyfill_1.default)();
    const $reject = Promise.reject.bind(this);
    const $resolve = Promise.resolve.bind(this);
    const $all = Promise.all.bind(this);
    try {
        return $all(Array.from(iterable)
            .map((item) => $resolve(item).catch(error => error).then(x => $reject(x)))).catch(error => error).then((errors) => {
            throw new AggregateError(errors, 'Every promise rejected');
        });
    }
    catch (e) {
        return $reject(e);
    }
};
exports.default = (0, shared_1.defineEsShim)(implementation, true, implementation.bind(Promise));

Object.assign(exports.default, exports); module.exports = exports.default;
