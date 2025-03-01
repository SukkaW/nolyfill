"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("@nolyfill/shared");
exports.default = (0, shared_1.uncurryThis)(Object.getOwnPropertyDescriptor(Symbol.prototype, 'description').get);

((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') && (Object.assign(exports.default,exports), module.exports = exports.default);
