import { defineEsShim } from '@nolyfill/shared';

export default defineEsShim(Function.prototype.bind);
