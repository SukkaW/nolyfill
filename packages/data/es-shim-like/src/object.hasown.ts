import { defineEsShim, uncurryThis } from '@nolyfill/shared';

const implementation = Object.hasOwn || uncurryThis(Object.prototype.hasOwnProperty)
export default defineEsShim(implementation, true)
