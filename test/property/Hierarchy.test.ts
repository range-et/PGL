import { expect, it } from 'vitest';
import fc from 'fast-check';
import Graph from '../../Src/Core/Graph';
import _Node from '../../Src/Core/_Node';
import Edge from '../../Src/Core/Edge';
import Point from '../../Src/HelperClasses/Point';
import Hierarchy, { createKDDistanceStrategy } from '../../Src/Hierarchy';

it('clustering matches transitive distance connectivity, preserves centroids and aggregates edge counts', async () => {
  await fc.assert(fc.asyncProperty(fc.array(fc.tuple(
    fc.integer({ min: -5, max: 5 }), fc.integer({ min: -5, max: 5 }), fc.integer({ min: -5, max: 5 }),
  ), { maxLength: 12 }), fc.integer({ min: 0, max: 8 }), async (coordinates, radius) => {
    const graph = await Graph.create(new Map(coordinates.map(([x, y, z], i) => [i, new _Node({ pos: new Point(x, y, z) })])),
      new Map(coordinates.slice(1).map((_, i) => [i, new Edge(i, i + 1)])));
    const result = createKDDistanceStrategy().cluster(graph, { distanceThreshold: radius });
    const connected = coordinates.map(a => coordinates.map(b => Math.hypot(...a.map((v, i) => v - b[i])) <= radius));
    for (let k = 0; k < coordinates.length; k++) for (let i = 0; i < coordinates.length; i++) for (let j = 0; j < coordinates.length; j++) {
      connected[i][j] ||= connected[i][k] && connected[k][j];
    }
    coordinates.forEach((_, i) => coordinates.forEach((_, j) => {
      expect(result.nodeToCluster.get(i) === result.nodeToCluster.get(j)).toBe(connected[i][j]);
    }));
    for (const cid of result.clusterIds) {
      const members = coordinates.filter((_, i) => result.nodeToCluster.get(i) === cid);
      const p = result.clusterCentroids.get(cid)!;
      [p.x, p.y, p.z].forEach((v, axis) => expect(v).toBeCloseTo(members.reduce((sum, m) => sum + m[axis], 0) / members.length));
    }
    const simple = await Hierarchy.clusterByDistance(graph, { distanceThreshold: radius });
    const expected = new Map<string, number>();
    for (const edge of graph.edges.values()) {
      const a = result.nodeToCluster.get(edge.start)!;
      const b = result.nodeToCluster.get(edge.end)!;
      if (a !== b) { const key = [a, b].sort().join(','); expected.set(key, (expected.get(key) ?? 0) + 1); }
    }
    expect(new Map([...simple.edges.values()].map(e => [[e.start, e.end].sort().join(','), e.data.count]))).toEqual(expected);
    expect([...simple.nodes.keys()]).toEqual(result.clusterIds);
  }));
});
