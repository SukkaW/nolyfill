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
const set = (object, value, options = {})=>{
    if (options.force || !Object.hasOwn(object, Symbol.toStringTag)) {
        Object.defineProperty(object, Symbol.toStringTag, {
            configurable: true,
            enumerable: false,
            value,
            writable: false
        });
    }
};
const _default = set;

if ((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') {
  Object.assign(exports.default, exports);
}
module.exports = exports.default;
