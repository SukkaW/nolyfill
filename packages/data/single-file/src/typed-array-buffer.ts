import { uncurryThis } from '@nolyfill/shared';

export default uncurryThis<(this: Int8Array) => number>(Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Int8Array.prototype), 'buffer')!.get!);
