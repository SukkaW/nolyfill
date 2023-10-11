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
var implementation = Promise.allSettled || function allSettled(iterable) {
    var $reject = Promise.reject.bind(this);
    var $resolve = Promise.resolve.bind(this);
    var $all = Promise.all.bind(this);
    return $all(Array.from(iterable).map(function(item) {
        var p = $resolve(item);
        try {
            return p.then(function(value) {
                return {
                    status: "fulfilled",
                    value: value
                };
            }, function(reason) {
                return {
                    status: "rejected",
                    reason: reason
                };
            });
        } catch (e) {
            return $reject(e);
        }
    }));
};
var _default = (0, _shared.defineEsShim)(implementation, true, implementation.bind(Promise));

Object.assign(exports.default, exports);
module.exports = exports.default;
