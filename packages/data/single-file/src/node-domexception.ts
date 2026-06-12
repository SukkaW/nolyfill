// node-domexception re-exports Node.js' native DOMException (available since
// Node 17.0.0); its entire implementation is `module.exports = globalThis.DOMException`.
const DOMException: typeof globalThis.DOMException = globalThis.DOMException;
export default DOMException;
