'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = stableStringify;
const defaultReplacer = function (_key, value) { return value; };
function stableStringify(obj, opts) {
    const space = opts && 'space' in opts && opts.space
        ? (typeof opts.space === 'number'
            ? ' '.repeat(opts.space)
            : opts.space)
        : '';
    const cycles = opts && 'cycles' in opts && typeof opts.cycles === 'boolean'
        ? opts.cycles
        : false;
    const replacer = opts && 'replacer' in opts && opts.replacer
        ? opts.replacer
        : defaultReplacer;
    const cmpOpt = typeof opts === 'function' ? opts : opts === null || opts === void 0 ? void 0 : opts.cmp;
    const cmp = cmpOpt
        ? ((node) => {
            const get = cmpOpt.length > 2 && function get(k) { return node[k]; };
            const thirdArg = get ? { get } : undefined;
            return (a, b) => {
                const aobj = { key: a, value: node[a] };
                const bobj = { key: b, value: node[b] };
                return cmpOpt(aobj, bobj, thirdArg);
            };
        })
        : undefined;
    // Cycle
    const seen = new Set();
    function stringify(parent, key, node, level) {
        const indent = space ? `\n${space.repeat(level)}` : '';
        const colonSeparator = space ? ': ' : ':';
        if ((node === null || node === void 0 ? void 0 : node.toJSON) && typeof node.toJSON === 'function') {
            node = node.toJSON();
        }
        node = replacer.call(parent, key, node);
        if (node === undefined) {
            // @ts-expect-error -- fuck undefined
            return;
        }
        if (typeof node !== 'object' || node === null) {
            return JSON.stringify(node);
        }
        if (Array.isArray(node)) {
            const out = [];
            for (let i = 0; i < node.length; i++) {
                // @ts-expect-error -- fuck js
                const item = stringify(node, i, node[i], level + 1) || JSON.stringify(null);
                out.push(indent + space + item);
            }
            return `[${out.join(',')}${indent}]`;
        }
        if (seen.has(node)) {
            if (cycles) {
                return JSON.stringify('__cycle__');
            }
            throw new TypeError('Converting circular structure to JSON');
        }
        else {
            seen.add(node);
        }
        const keys = Object.keys(node).sort(cmp === null || cmp === void 0 ? void 0 : cmp(node));
        const out = [];
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = stringify(node, key, node[key], level + 1);
            if (!value) {
                continue;
            }
            const keyValue = JSON.stringify(key)
                + colonSeparator
                + value;
            out.push(indent + space + keyValue);
        }
        seen.delete(node);
        return `{${out.join(',')}${indent}}`;
    }
    return stringify({ '': obj }, '', obj, 0);
}

((typeof exports.default === 'object' && exports.default !== null) || typeof exports.default === 'function') && (Object.assign(exports.default,exports), module.exports = exports.default);
