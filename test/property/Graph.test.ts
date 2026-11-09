import { expect, it } from 'vitest';
import fc from 'fast-check';
import Graph from '../../Src/Core/Graph';
import _Node from '../../Src/Core/_Node';
import Edge from '../../Src/Core/Edge';
import GraphMethods from '../../Src/GraphAlgorithms/GraphMethods';

const graphInput = fc.integer({ min: 0, max: 12 }).chain(n => fc.record({
  n: fc.constant(n),
  pairs: n === 0 ? fc.constant([] as [number, number][]) : fc.array(
    fc.tuple(fc.integer({ min: 0, max: n - 1 }), fc.integer({ min: 0, max: n - 1 })), { maxLength: 40 }),
}));
const id = (i: number) => i * 11 + 5;

it('graph contracts and shortest paths agree with an independent Floyd–Warshall oracle', async () => {
  await fc.assert(fc.asyncProperty(graphInput, async ({ n, pairs }) => {
    const graph = await Graph.create(
      new Map(Array.from({ length: n }, (_, i) => [id(i), new _Node({})])),
      new Map(pairs.map(([a, b], i) => [i, new Edge(id(a), id(b), {})])),
    );
    const expected = Array.from({ length: n }, () => Array<number>(n).fill(0));
    for (const [a, b] of pairs) if (a !== b) expected[a][b] = expected[b][a] = 1;
    expect(Array.from(graph.get_adjacency_matrix().matrix)).toEqual(expected.flat());
    for (let i = 0; i < n; i++) {
      expect([...graph.nodes.get(id(i))!.neighbours].sort((a, b) => a - b))
        .toEqual(expected[i].flatMap((connected, j) => connected ? [id(j)] : []));
    }
    const distances = expected.map((row, i) => row.map((v, j) => i === j ? 0 : v ? 1 : Infinity));
    for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      distances[i][j] = Math.min(distances[i][j], distances[i][k] + distances[k][j]);
    }
    for (let i = 0; i < n; i++) {
      expect(await GraphMethods.Dijkstra(graph, id(i))).toEqual(new Map(
        distances[i].flatMap((d, j) => Number.isFinite(d) ? [[id(j), d] as [number, number]] : []),
      ));
    }
    const before = [...graph.get_adjacency()].map(([key, neighbours]) => [key, [...neighbours]]);
    const selected = Array.from({ length: n }, (_, i) => id(i)).filter((_, i) => i % 2 === 0);
    const sub = await GraphMethods.SelectSubgraph(graph, [...selected, 9999]);
    expect([...sub.nodes.keys()]).toEqual(selected);
    expect([...sub.edges.values()].map(e => [e.start, e.end])).toEqual(
      pairs.filter(([a, b]) => a % 2 === 0 && b % 2 === 0).map(([a, b]) => [id(a), id(b)]),
    );
    expect([...graph.get_adjacency()]).toEqual(before);
  }));
});
