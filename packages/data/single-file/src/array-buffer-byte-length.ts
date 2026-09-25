import { uncurryThis } from '@nolyfill/shared';
import isArrayBuffer from '@nolyfill/is-array-buffer';

const bL = uncurryThis<(this: ArrayBuffer) => number>(
  Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength')!.get!
);
export default function byteLength(ab: unknown) {
  if (!isArrayBuffer(ab)) return Number.NaN;
  return bL(ab);
}
