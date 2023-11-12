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
const is = (value)=>{
    if (typeof WeakRef === 'undefined') return false;
    if (!value || typeof value !== 'object') return false;
    try {
        WeakRef.prototype.deref.call(value);
        return true;
    } catch (e) {
        return false;
    }
};
const _default = is;

if ((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') {
  Object.assign(exports.default, exports);
}
module.exports = exports.default;
