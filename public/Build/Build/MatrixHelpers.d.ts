/**
 * Helpers for matrix/vector math in the browser. Work with Float32Arrays
 * returned by get_adjacency_matrix() and simulation positions.
 */
/**
 * Matrix-vector multiply: out = A * x (row-major n×n matrix A).
 */
export declare function matrixVectorMultiply(A: Float32Array, n: number, x: Float32Array, out: Float32Array): void;
/**
 * Normalize vector x in-place by its 2-norm. If norm is 0, leaves x unchanged.
 */
export declare function normalizeVector(x: Float32Array): void;
