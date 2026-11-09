/** Runtime checks at numeric API boundaries. Kept out of hot simulation loops. */
export function finiteNumber(value: number, name: string, min = -Infinity, max = Infinity): void {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new RangeError(`${name} must be finite and between ${min} and ${max}`);
  }
}

export function integer(value: number, name: string, min = 0): void {
  if (!Number.isSafeInteger(value) || value < min) {
    throw new RangeError(`${name} must be a safe integer >= ${min}`);
  }
}
