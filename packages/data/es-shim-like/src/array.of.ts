import { defineEsShim } from '@nolyfill/shared';

export default defineEsShim(Array.of, true);
