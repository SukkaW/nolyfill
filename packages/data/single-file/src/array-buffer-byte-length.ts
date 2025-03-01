import { uncurryThis } from '@nolyfill/shared';
import isArrayBuffer from '@nolyfill/is-array-buffer';

const bL = uncurryThis(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength')!.get!);
const is = (ab: unknown) => {
  if (!isArrayBuffer(ab)) return Number.NaN;
  return bL(ab);
};

export default is;
