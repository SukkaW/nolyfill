import { defineEsShim } from '@nolyfill/shared';

export default defineEsShim(ArrayBuffer.prototype.slice)
