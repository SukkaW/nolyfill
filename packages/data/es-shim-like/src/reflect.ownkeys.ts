import { defineEsShim } from '@nolyfill/shared';

export default defineEsShim(Reflect.ownKeys, true);
