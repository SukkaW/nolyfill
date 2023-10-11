"use strict";
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

if ((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') {
  Object.assign(exports.default, exports);
}
module.exports = exports.default;
