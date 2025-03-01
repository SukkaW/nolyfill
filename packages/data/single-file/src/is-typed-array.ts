import type { TypedArray } from '@nolyfill/shared';
import whichTypedArray from '@nolyfill/which-typed-array';

export default function isTypedArray(value: unknown): value is TypedArray {
  return !!whichTypedArray(value);
}
