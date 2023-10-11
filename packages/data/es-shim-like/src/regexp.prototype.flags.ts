import { defineEsShim } from '@nolyfill/shared';

export default defineEsShim(RegExp.prototype.flags);
