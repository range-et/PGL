import { expect, it } from 'vitest';
import fc from 'fast-check';
import { buildOctree, computeRepulsionForce } from '../../Src/Simulation/Octree';

it('zero-theta octree forces agree with direct summation, including coincident points', () => {
  fc.assert(fc.property(fc.array(fc.tuple(
    fc.integer({ min: -8, max: 8 }), fc.integer({ min: -8, max: 8 }), fc.integer({ min: -8, max: 8 }),
  ), { maxLength: 15 }), coordinates => {
    const points = coordinates.map(([x, y, z], index) => ({ x, y, z, index }));
    const tree = buildOctree(points, -10, -10, -10, 10);
    for (const p of points) {
      const expected = { fx: 0, fy: 0, fz: 0 };
      for (const q of points) {
        const dx = p.x - q.x, dy = p.y - q.y, dz = p.z - q.z;
        const distanceSq = dx * dx + dy * dy + dz * dz;
        if (q.index !== p.index && distanceSq > 0) {
          expected.fx += 2 * dx / distanceSq;
          expected.fy += 2 * dy / distanceSq;
          expected.fz += 2 * dz / distanceSq;
        }
      }
      const actual = { fx: 0, fy: 0, fz: 0 };
      computeRepulsionForce(tree, p.x, p.y, p.z, p.index, 2, 0, actual);
      for (const axis of ['fx', 'fy', 'fz'] as const) expect(actual[axis]).toBeCloseTo(expected[axis], 8);
    }
  }));
});
it('does not discard child forces when the query equals an internal center of mass', () => {
  const tree = buildOctree([-2, -1, 3].map((x, index) => ({ x, y: 0, z: 0, index })), -4, -4, -4, 4);
  const out = { fx: 0, fy: 0, fz: 0 };
  computeRepulsionForce(tree, 0, 0, 0, -1, 1, 0, out);
  expect(out.fx).toBeCloseTo(0.5 + 1 - 1 / 3);
});
