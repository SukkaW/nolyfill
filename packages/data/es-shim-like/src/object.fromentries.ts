import { defineEsShim } from '@nolyfill/shared';

export default defineEsShim(Object.fromEntries, true)
