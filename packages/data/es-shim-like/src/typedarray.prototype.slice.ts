import { defineEsShim, TypedArrayPrototype } from '@nolyfill/shared';

export default defineEsShim(TypedArrayPrototype.slice);
