import { describe, it, expect } from "vitest";
import Utilities from "../../Src/HelperClasses/Utilities";
import Point from "../../Src/HelperClasses/Point";

describe("Utilities", () => {
  describe("calculateAverage", () => {
    it("returns average of numbers", () => {
      expect(Utilities.calculateAverage([1, 2, 3, 4, 5])).toBe(3);
      expect(Utilities.calculateAverage([10, 20])).toBe(15);
    });
    it("returns 0 for empty array (NaN case)", () => {
      expect(Utilities.calculateAverage([])).toBe(0);
    });
    it("returns the only element for single-element array", () => {
      expect(Utilities.calculateAverage([7])).toBe(7);
    });
  });

  describe("calculateDistance", () => {
    it("returns distance between two points", () => {
      const a = new Point(0, 0, 0);
      const b = new Point(3, 4, 0);
      expect(Utilities.calculateDistance(a, b)).toBe(5);
    });
    it("returns 0 for same point", () => {
      const a = new Point(1, 2, 3);
      expect(Utilities.calculateDistance(a, a)).toBe(0);
    });
  });

  describe("calculateSquaredDistance", () => {
    it("returns squared distance (no sqrt)", () => {
      const a = new Point(0, 0, 0);
      const b = new Point(3, 4, 0);
      expect(Utilities.calculateSquaredDistance(a, b)).toBe(25);
    });
    it("returns 0 for same point", () => {
      const a = new Point(1, 1, 1);
      expect(Utilities.calculateSquaredDistance(a, a)).toBe(0);
    });
  });
});
