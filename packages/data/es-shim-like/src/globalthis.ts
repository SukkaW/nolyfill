import { defineEsShim } from '@nolyfill/shared';
export default defineEsShim(globalThis, true, () => globalThis)
