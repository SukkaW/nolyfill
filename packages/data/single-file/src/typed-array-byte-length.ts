import { uncurryThis, TypedArrayPrototype } from '@nolyfill/shared';
import type { TypedArray } from '@nolyfill/shared';

const typedArrayByteLength = uncurryThis<(this: TypedArray) => number>(Object.getOwnPropertyDescriptor(TypedArrayPrototype, 'byteLength')!.get!);
function g(value: TypedArray): number;
function g(value: unknown): false;
function g(value: unknown) {
  try {
    return typedArrayByteLength(value as TypedArray);
  } catch {
    return false;
  }
};

export default g;
