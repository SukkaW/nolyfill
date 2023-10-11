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
var _shared = require("@nolyfill/shared");
var _polyfill = /*#__PURE__*/ _interop_require_default(require("@nolyfill/es-aggregate-error/polyfill"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var implementation = Promise.any || function any(iterable) {
    var AggregateError = (0, _polyfill.default)();
    var $reject = Promise.reject.bind(this);
    var $resolve = Promise.resolve.bind(this);
    var $all = Promise.all.bind(this);
    try {
        return $all(Array.from(iterable).map(function(item) {
            return $resolve(item).then(function(x) {
                return $reject(x);
            }, function(x) {
                return x;
            });
        })).then(function(errors) {
            throw new AggregateError(errors, "Every promise rejected");
        }, function(x) {
            return x;
        });
    } catch (e) {
        return $reject(e);
    }
};
var _default = (0, _shared.defineEsShim)(implementation, true, implementation.bind(Promise));

Object.assign(exports.default, exports);
module.exports = exports.default;
