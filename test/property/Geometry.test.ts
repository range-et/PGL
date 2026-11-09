import { expect, it } from 'vitest';
import fc from 'fast-check';
import Point from '../../Src/HelperClasses/Point';
import Line from '../../Src/HelperClasses/Line';
import Geometry from '../../Src/HelperClasses/GeometryHelpers';
import Utilities from '../../Src/HelperClasses/Utilities';
import { rgbToHex, hexToRgb } from '../../Src/HelperClasses/ColorHelper';
import { matrixVectorMultiply, normalizeVector } from '../../Src/MatrixHelpers';

const number = fc.integer({ min: -100, max: 100 });
const point = fc.tuple(number, number, number).map(([x, y, z]) => new Point(x, y, z));

it('geometry preserves endpoints, uniform spacing, centroid and translation', () => {
  fc.assert(fc.property(point, point, fc.integer({ min: 1, max: 12 }), (a, b, divisions) => {
    const line = Geometry.line_from_start_end_divisions(a, b, divisions);
    expect(line.points).toHaveLength(divisions + 1);
    expect(line.points[0]).toEqual(a);
    expect(line.points[divisions]).toEqual(b);
    const length = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
    expect(Utilities.calculateDistance(a, b)).toBeCloseTo(length);
    expect(Utilities.calculateSquaredDistance(a, b)).toBeCloseTo(length * length);
    for (let i = 1; i <= divisions; i++) {
      expect(Utilities.calculateDistance(line.points[i - 1], line.points[i])).toBeCloseTo(length / divisions);
    }
    const centroid = Geometry.centroid(line.points);
    for (const axis of ['x', 'y', 'z'] as const) expect(centroid[axis]).toBeCloseTo((a[axis] + b[axis]) / 2);
    const copy = new Line([a, b]);
    copy.points[0].translate(b);
    expect(copy.points[0]).toEqual(new Point(a.x + b.x, a.y + b.y, a.z + b.z));
    expect(copy.points[1]).toEqual(b);
    expect(copy.points[0]).not.toBe(a);
  }));
});

it('RGB hex conversions round-trip all byte channels', () => {
  fc.assert(fc.property(fc.tuple(...Array.from({ length: 3 }, () => fc.integer({ min: 0, max: 255 }))), ([r, g, b]) => {
    const hex = rgbToHex(r, g, b);
    expect(hex).toMatch(/^#[0-9a-f]{6}$/);
    expect(hexToRgb(hex)).toEqual({ r, g, b });
    expect(hexToRgb(hex.slice(1).toUpperCase())).toEqual({ r, g, b });
  }));
});

it('matrix products match dot products and normalization preserves direction', () => {
  fc.assert(fc.property(fc.integer({ min: 0, max: 6 }).chain(n => fc.record({
    n: fc.constant(n), a: fc.array(number, { minLength: n * n, maxLength: n * n }),
    x: fc.array(number, { minLength: n, maxLength: n }),
  })), ({ n, a, x }) => {
    const out = new Float32Array(n).fill(123);
    matrixVectorMultiply(new Float32Array(a), n, new Float32Array(x), out);
    expect([...out]).toEqual(x.map((_, i) => x.reduce((sum, v, j) => sum + a[i * n + j] * v, 0)));
    const normalized = new Float32Array(x);
    normalizeVector(normalized);
    const norm = Math.hypot(...x);
    x.forEach((v, i) => expect(normalized[i]).toBeCloseTo(norm === 0 ? v : v / norm, 6));
  }));
});
