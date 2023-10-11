"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _shared = require("@nolyfill/shared");
const implementation = Promise.allSettled || function allSettled(iterable) {
    const $reject = Promise.reject.bind(this);
    const $resolve = Promise.resolve.bind(this);
    const $all = Promise.all.bind(this);
    return $all(Array.from(iterable).map((item)=>{
        const p = $resolve(item);
        try {
            return p.then((value)=>({
                    status: 'fulfilled',
                    value
                }), (reason)=>({
                    status: 'rejected',
                    reason
                }));
        } catch (e) {
            return $reject(e);
        }
    }));
};
const _default = (0, _shared.defineEsShim)(implementation, true, implementation.bind(Promise));

Object.assign(exports.default, exports);
module.exports = exports.default;
