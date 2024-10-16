import { defineEsShim } from '@nolyfill/shared';

export default defineEsShim<Function, (this: Function) => string>(function functionPrototypeName() { return this.name; });
