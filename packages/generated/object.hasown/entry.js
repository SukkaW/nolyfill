"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("@nolyfill/shared");
const implementation = Object.hasOwn || (0, shared_1.uncurryThis)(Object.prototype.hasOwnProperty);
exports.default = (0, shared_1.defineEsShim)(implementation, true);

Object.assign(exports.default, exports); module.exports = exports.default;
