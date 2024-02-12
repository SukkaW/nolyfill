'use strict';

interface Element {
  key: string,
  value: any
}

export type Replacer = (key: string, value: any) => any;

interface ComparatorOption {
  get?: (key: any) => any
}
export type Comparator = (a: Element, b: Element, opt?: ComparatorOption) => number;

const defaultReplacer: Replacer = function (_key: string, value: any) { return value; };

export interface Options {
  /**
     * Custom comparator for key
     */
  cmp?: Comparator,

  /**
     * Indent the output for pretty-printing.
     *
     * Supported is either a string or a number of spaces.
     */
  space?: string | number,

  /**
     * Option to replace values to simpler values
     */
  replacer?: Replacer,

  /**
     * true to allow cycles, by marking the entries as __cycle__.
     */
  cycles?: boolean
}

export default function stableStringify(obj: any, opts?: Comparator | Options): string {
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

  const cmpOpt = typeof opts === 'function' ? opts : opts?.cmp;

  const cmp = cmpOpt
    ? ((node: any) => {
      const get = cmpOpt.length > 2 && function get(k: any) { return node[k]; };
      const thirdArg: ComparatorOption | undefined = get ? { get } : undefined;

      return (a: string, b: string) => {
        const aobj: Element = { key: a, value: node[a] };
        const bobj: Element = { key: b, value: node[b] };
        return cmpOpt(aobj, bobj, thirdArg);
      };
    })
    : undefined;

  // Cycle
  const seen = new Set<any>();

  function stringify(parent: any, key: string, node: any, level: number): string {
    const indent = space ? `\n${space.repeat(level)}` : '';
    const colonSeparator = space ? ': ' : ':';

    if (node?.toJSON && typeof node.toJSON === 'function') {
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
      if (cycles) { return JSON.stringify('__cycle__'); }
      throw new TypeError('Converting circular structure to JSON');
    } else { seen.add(node); }

    const keys = Object.keys(node).sort(cmp?.(node));
    const out = [];
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = stringify(node, key, node[key], level + 1);

      if (!value) { continue; }

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
