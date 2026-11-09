import { finiteNumber, integer } from "./HelperClasses/Validation";
/**
 * Helpers for matrix/vector math in the browser. Work with Float32Arrays
 * returned by get_adjacency_matrix() and simulation positions.
 */

/**
 * Matrix-vector multiply: out = A * x (row-major n×n matrix A).
 */
export function matrixVectorMultiply(
  A: Float32Array,
  n: number,
  x: Float32Array,
  out: Float32Array
): void {
  integer(n, "n");
  if (A.length !== n * n || x.length !== n || out.length !== n) {
    throw new RangeError("matrix/vector dimensions must match n");
  }
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) sum += A[i * n + j] * x[j];
    out[i] = sum;
  }
}

/**
 * Normalize vector x in-place by its 2-norm. If norm is 0, leaves x unchanged.
 */
export function normalizeVector(x: Float32Array): void {
  for (const value of x) finiteNumber(value, "vector coordinate");
  let sum = 0;
  for (let i = 0; i < x.length; i++) sum += x[i] * x[i];
  const norm = Math.sqrt(sum);
  if (norm > 0) for (let i = 0; i < x.length; i++) x[i] /= norm;
}
