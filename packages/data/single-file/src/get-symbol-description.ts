import { uncurryThis } from '@nolyfill/shared';
export default uncurryThis(Object.getOwnPropertyDescriptor(Symbol.prototype, 'description')!.get!);
