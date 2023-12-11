import whichTypedArray from '@nolyfill/which-typed-array';

export default function isTypedArray(value: unknown) {
  return !!whichTypedArray(value);
}
