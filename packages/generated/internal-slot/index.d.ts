declare const channel: WeakMap<WeakKey, any>;
declare const check: (O: WeakKey, slot: string) => void;
declare const has: (O: WeakKey, slot: string) => boolean;
declare const get: (O: WeakKey, slot: string) => any;
declare const set: (O: WeakKey, slot: string, V: any) => void;
declare const assert: (O: WeakKey, slot: string) => void;
