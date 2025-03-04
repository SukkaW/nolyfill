import { uncurryThis, TypedArrayPrototype } from '@nolyfill/shared';
import type { TypedArray } from '@nolyfill/shared';

const typedArrayByteOffSet = uncurryThis<(this: TypedArray) => number>(Object.getOwnPropertyDescriptor(TypedArrayPrototype, 'byteOffset')!.get!);
function g(value: TypedArray): number;
function g(value: unknown): false;
function g(value: unknown) {
  try {
    return typedArrayByteOffSet(value as TypedArray);
  } catch {
    return false;
  }
};

export default g;
