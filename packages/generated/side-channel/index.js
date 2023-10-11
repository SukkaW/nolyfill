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
var create = function() {
    var $wm, $m;
    var get = function(key) {
        if (key && (typeof key === "object" || typeof key === "function")) {
            if ($wm) return $wm.get(key);
        } else if ($m) {
            return $m.get(key);
        }
        return undefined;
    };
    var set = function(key, value) {
        if (key && (typeof key === "object" || typeof key === "function")) {
            if (!$wm) $wm = new WeakMap();
            $wm.set(key, value);
        } else {
            if (!$m) $m = new Map();
            $m.set(key, value);
        }
    };
    var has = function(key) {
        if (key && (typeof key === "object" || typeof key === "function")) {
            if ($wm) {
                return $wm.has(key);
            }
        } else if ($m) {
            return $m.has(key);
        }
        return false;
    };
    var assert = function(key) {
        if (!has(key)) {
            throw new TypeError("Side channel does not contain the given key");
        }
    };
    return {
        get: get,
        set: set,
        has: has,
        assert: assert
    };
};
var _default = create;

if ((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') {
  Object.assign(exports.default, exports);
}
module.exports = exports.default;
