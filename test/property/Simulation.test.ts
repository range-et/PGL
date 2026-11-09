import { expect, it } from 'vitest';
import fc from 'fast-check';
import Graph from '../../Src/Core/Graph';
import _Node from '../../Src/Core/_Node';
import Edge from '../../Src/Core/Edge';
import { createStressSGD3D } from '../../Src/Simulation';

it('seeded layouts are repeatable, finite, and preserve node/position correspondence', async () => {
  await fc.assert(fc.asyncProperty(
    fc.integer({ min: 0, max: 10 }), fc.integer({ min: 1, max: 100000 }), fc.boolean(),
    async (n, seed, connected) => {
      const graph = await Graph.create(
        new Map(Array.from({ length: n }, (_, i) => [i * 3 + 2, new _Node({})])),
        new Map(Array.from({ length: connected ? Math.max(0, n - 1) : 0 }, (_, i) =>
          [i, new Edge(i * 3 + 2, (i + 1) * 3 + 2, {})])),
      );
      const options = { seed, tMax: 5, epochsPerStep: 5 };
      const first = await createStressSGD3D(graph, options);
      const second = await createStressSGD3D(graph, options);
      first.step(0);
      second.step(0);
      const positions = Array.from(first.getPositions());
      expect(positions).toEqual(Array.from(second.getPositions()));
      expect(positions).toHaveLength(n * 3);
      expect(positions.every(Number.isFinite)).toBe(true);
      const map = first.getPositionMap();
      expect([...map.keys()]).toEqual([...graph.nodes.keys()]);
      [...map.values()].forEach((p, i) => {
        expect([p.x, p.y, p.z]).toEqual(positions.slice(i * 3, i * 3 + 3));
      });
    },
  ));
});
