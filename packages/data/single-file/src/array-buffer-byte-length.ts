import { uncurryThis } from '@nolyfill/shared';
// @ts-expect-error -- no types
import isArrayBuffer from '@nolyfill/is-array-buffer';

const bL = uncurryThis(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength')!.get!);
const is = (ab: unknown) => {
  if (!isArrayBuffer(ab)) return NaN;
  return bL(ab);
};

export default is;
