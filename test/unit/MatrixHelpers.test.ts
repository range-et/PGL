import { describe, it, expect } from "vitest";
import { matrixVectorMultiply, normalizeVector } from "../../Src/MatrixHelpers";

describe("MatrixHelpers", () => {
  describe("matrixVectorMultiply", () => {
    it("computes A * x = out for 2x2", () => {
      const A = new Float32Array([1, 0, 0, 1]);
      const x = new Float32Array([2, 3]);
      const out = new Float32Array(2);
      matrixVectorMultiply(A, 2, x, out);
      expect(out[0]).toBe(2);
      expect(out[1]).toBe(3);
    });
    it("computes general 2x2", () => {
      const A = new Float32Array([1, 1, 0, 2]);
      const x = new Float32Array([1, 1]);
      const out = new Float32Array(2);
      matrixVectorMultiply(A, 2, x, out);
      expect(out[0]).toBe(2);
      expect(out[1]).toBe(2);
    });
  });

  describe("normalizeVector", () => {
    it("normalizes to unit length", () => {
      const x = new Float32Array([3, 4]);
      normalizeVector(x);
      expect(Math.abs(Math.sqrt(x[0] * x[0] + x[1] * x[1]) - 1) < 1e-6).toBe(true);
    });
    it("leaves zero vector unchanged", () => {
      const x = new Float32Array([0, 0]);
      normalizeVector(x);
      expect(x[0]).toBe(0);
      expect(x[1]).toBe(0);
    });
  });
});
