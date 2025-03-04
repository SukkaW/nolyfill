"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function defineProperty(object, name, value, predicate) {
    if (name in object) {
        if (predicate === true) {
            if (object[name] === value) {
                return;
            }
        }
        else if (typeof predicate !== 'function'
            || !predicate()) {
            return;
        }
    }
    Object.defineProperty(object, name, {
        configurable: true,
        enumerable: false,
        value,
        writable: true
    });
}
function defineProperties(object, map, predicates) {
    const props = Array.prototype.concat.call(Object.keys(map), Object.getOwnPropertySymbols(map));
    for (let i = 0, l = props.length; i < l; i++) {
        const k = props[i];
        defineProperty(object, k, map[k], predicates === null || predicates === void 0 ? void 0 : predicates[k]);
    }
}
exports.default = defineProperties;

((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') && (Object.assign(exports.default,exports), module.exports = exports.default);
