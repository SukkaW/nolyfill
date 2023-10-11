import { uncurryThis } from '@nolyfill/shared';

export default uncurryThis(Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Int8Array.prototype), 'buffer')!.get!);
