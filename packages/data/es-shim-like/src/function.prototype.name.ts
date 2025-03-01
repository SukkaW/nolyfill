import { defineEsShim } from '@nolyfill/shared';

export default defineEsShim(function functionPrototypeName(this: Function) { return this.name; });
