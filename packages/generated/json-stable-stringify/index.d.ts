interface Element {
    key: string;
    value: any;
}
export type Replacer = (key: string, value: any) => any;
interface ComparatorOption {
    get?: (key: any) => any;
}
export type Comparator = (a: Element, b: Element, opt?: ComparatorOption) => number;
export interface Options {
    /**
       * Custom comparator for key
       */
    cmp?: Comparator;
    /**
       * Indent the output for pretty-printing.
       *
       * Supported is either a string or a number of spaces.
       */
    space?: string | number;
    /**
       * Option to replace values to simpler values
       */
    replacer?: Replacer;
    /**
       * true to allow cycles, by marking the entries as __cycle__.
       */
    cycles?: boolean;
}
export default function stableStringify(obj: any, opts?: Comparator | Options): string;
export {};
