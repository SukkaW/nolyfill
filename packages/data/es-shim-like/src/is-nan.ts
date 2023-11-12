import { defineEsShim } from '@nolyfill/shared';

export default defineEsShim(Number.isNaN, true);
