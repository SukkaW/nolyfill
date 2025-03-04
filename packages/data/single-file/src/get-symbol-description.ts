import { uncurryThis } from '@nolyfill/shared';

export default uncurryThis<(this: symbol) => string | undefined>(Object.getOwnPropertyDescriptor(Symbol.prototype, 'description')!.get!);
