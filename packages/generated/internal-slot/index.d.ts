declare const channel: WeakMap<WeakKey, any>;
declare function check(O: WeakKey, slot: string): void;
declare function has(O: WeakKey, slot: string): boolean;
declare function get(O: WeakKey, slot: string): any;
declare function set(O: WeakKey, slot: string, V: any): void;
declare function assert(O: WeakKey, slot: string): void;
