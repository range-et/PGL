import { expect, it } from 'vitest';
import fc from 'fast-check';
import Point from '../../Src/HelperClasses/Point';
import { pointsWithinRadius } from '../../Src/Hierarchy/KDTree';

const coordinate = fc.integer({ min: -100, max: 100 });
const points = fc.array(fc.tuple(coordinate, coordinate, coordinate), { maxLength: 45 });

it('KD-tree agrees with exhaustive Euclidean search without changing inputs', () => {
  fc.assert(fc.property(points, fc.integer({ min: 0, max: 300 }), (coords, radius) => {
    const items = coords.map(([x, y, z], i) => ({ point: new Point(x, y, z), nodeId: i * 7 + 3 }));
    const before = structuredClone(items);
    const actual = pointsWithinRadius(items, radius);
    expect(actual.size).toBe(items.length);
    for (const { point, nodeId } of items) {
      const expected = items.filter(({ point: other }) =>
        Math.hypot(point.x - other.x, point.y - other.y, point.z - other.z) <= radius
      ).map(item => item.nodeId).sort((a, b) => a - b);
      expect(actual.get(nodeId)!.sort((a, b) => a - b)).toEqual(expected);
    }
    expect(structuredClone(items)).toEqual(before);
  }));
});

it('includes coincident points and exact radius boundaries on all axes', () => {
  const items = [[0, 0, 0], [0, 0, 0], [3, 4, 0], [-3, -4, 0], [0, 0, 5], [0, 0, -5], [6, 0, 0]]
    .map(([x, y, z], nodeId) => ({ point: new Point(x, y, z), nodeId }));
  expect(pointsWithinRadius(items, 0).get(0)!.sort()).toEqual([0, 1]);
  expect(pointsWithinRadius(items, 5).get(0)!.sort()).toEqual([0, 1, 2, 3, 4, 5]);
  expect(pointsWithinRadius([], 10)).toEqual(new Map());
});
