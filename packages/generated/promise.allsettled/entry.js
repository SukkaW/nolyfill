"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("@nolyfill/shared");
const implementation = Promise.allSettled || function allSettled(iterable) {
    const $reject = Promise.reject.bind(this);
    const $resolve = Promise.resolve.bind(this);
    const $all = Promise.all.bind(this);
    return $all(Array.from(iterable).map((item) => {
        const p = $resolve(item);
        // eslint-disable-next-line sukka/no-try-promise -- this is only catch when something goes horibbly wrong
        try {
            return p.then((value) => ({ status: 'fulfilled', value })).catch((error) => ({ status: 'rejected', reason: error }));
        }
        catch (e) {
            return $reject(e);
        }
    }));
};
exports.default = (0, shared_1.defineEsShim)(implementation, true, implementation.bind(Promise));

Object.assign(exports.default, exports); module.exports = exports.default;
