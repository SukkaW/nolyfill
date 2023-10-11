"use strict";
var channel = new WeakMap();
var check = function(O, slot) {
    if (!O || typeof O !== "object" && typeof O !== "function") {
        throw new TypeError("`O` is not an object");
    }
    if (typeof slot !== "string") {
        throw new TypeError("`slot` must be a string");
    }
};
var has = function(O, slot) {
    check(O, slot);
    var slots = channel.get(O);
    return !!slots && Object.hasOwn(slots, "$".concat(slot));
};
var get = function(O, slot) {
    var _slots;
    check(O, slot);
    var slots = channel.get(O);
    return (_slots = slots) === null || _slots === void 0 ? void 0 : _slots["$".concat(slot)];
};
var set = function(O, slot, V) {
    check(O, slot);
    var slots = channel.get(O);
    if (!slots) {
        slots = {};
        channel.set(O, slots);
    }
    slots["$".concat(slot)] = V;
};
var assert = function(O, slot) {
    check(O, slot);
    if (!channel.has(O)) {
        throw new TypeError("Side channel does not contain the given key");
    }
    if (!has(O, slot)) {
        throw new TypeError('"'.concat(slot, '" is not present on "O"'));
    }
};
module.exports = Object.freeze({
    has: has,
    get: get,
    set: set,
    assert: assert
});

if ((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') {
  Object.assign(exports.default, exports);
}
module.exports = exports.default;
