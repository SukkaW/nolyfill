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
const isFnRegex = /^\s*(?:function)?\*/;
// Node.js has full native support for generators since Node.js 6.4.0, so we don't need eval
const GeneratorFunction = Object.getPrototypeOf(function*() {});
function isGeneratorFunction(fn) {
    if (typeof fn !== 'function') return false;
    if (isFnRegex.test(Function.prototype.toString.call(fn))) return true;
    return Object.getPrototypeOf(fn) === GeneratorFunction;
}
const _default = isGeneratorFunction;

if ((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') {
  Object.assign(exports.default, exports);
}
module.exports = exports.default;
