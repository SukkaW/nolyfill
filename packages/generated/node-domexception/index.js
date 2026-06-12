"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// node-domexception re-exports Node.js' native DOMException (available since
// Node 17.0.0); its entire implementation is `module.exports = globalThis.DOMException`.
const DOMException = globalThis.DOMException;
exports.default = DOMException;

((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') && (Object.assign(exports.default,exports), module.exports = exports.default);
