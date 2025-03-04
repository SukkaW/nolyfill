function is<T extends WeakKey>(value: unknown): value is WeakRef<T> {
  if (typeof WeakRef === 'undefined') return false;
  if (!value || typeof value !== 'object') return false;
  try {
    WeakRef.prototype.deref.call(value);
    return true;
  } catch {
    return false;
  }
}

export default is;
