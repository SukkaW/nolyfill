"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("@nolyfill/shared");
const implementation = Promise.allSettled || function allSettled(iterable) {
    const $reject = Promise.reject.bind(this);
    const $resolve = Promise.resolve.bind(this);
    const $all = Promise.all.bind(this);
    return $all(Array.from(iterable).map((item) => {
        const p = $resolve(item);
        try {
            return p.then((value) => ({ status: 'fulfilled', value }), (reason) => ({ status: 'rejected', reason }));
        }
        catch (e) {
            return $reject(e);
        }
    }));
};
exports.default = (0, shared_1.defineEsShim)(implementation, true, implementation.bind(Promise));

Object.assign(exports.default, exports); module.exports = exports.default;
