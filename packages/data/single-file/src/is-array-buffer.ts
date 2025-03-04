import { uncurryThis } from '@nolyfill/shared';

const bL = uncurryThis(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength')!.get!);
function is(obj: unknown): obj is ArrayBuffer {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  try {
    bL(obj);
    return true;
  } catch {
    return false;
  }
}

export default is;
