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
var empty = [];
// @ts-expect-error -- JS is awesome
empty[Symbol.isConcatSpreadable] = true;
var concat = function() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    for(var i = 0, l = args.length; i < l; i += 1){
        var arg = args[i];
        if (arg && typeof arg === "object" && typeof arg[Symbol.isConcatSpreadable] === "boolean") {
            var arr = Array.isArray(arg) ? Array.prototype.slice.call(arg) : [
                arg
            ];
            // @ts-expect-error -- JS is awesome
            arr[Symbol.isConcatSpreadable] = true;
            args[i] = arr;
        }
    }
    return Array.prototype.concat.apply(empty, args);
};
var _default = concat;

if ((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') {
  Object.assign(exports.default, exports);
}
module.exports = exports.default;
