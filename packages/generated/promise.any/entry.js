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
const _polyfill = /*#__PURE__*/ _interop_require_default(require("@nolyfill/es-aggregate-error/polyfill"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const implementation = Promise.any || function any(iterable) {
    const AggregateError = (0, _polyfill.default)();
    const $reject = Promise.reject.bind(this);
    const $resolve = Promise.resolve.bind(this);
    const $all = Promise.all.bind(this);
    try {
        return $all(Array.from(iterable).map((item)=>$resolve(item).then((x)=>$reject(x), (x)=>x))).then((errors)=>{
            throw new AggregateError(errors, 'Every promise rejected');
        }, (x)=>x);
    } catch (e) {
        return $reject(e);
    }
};
const _default = (0, _shared.defineEsShim)(implementation, true, implementation.bind(Promise));

Object.assign(exports.default, exports);
module.exports = exports.default;
