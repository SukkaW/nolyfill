import { uncurryThis } from '@nolyfill/shared';
export default uncurryThis<(this: Symbol) => string | undefined>(Object.getOwnPropertyDescriptor(Symbol.prototype, 'description')!.get!);
