import { expect, it } from 'vitest';
import fc from 'fast-check';
import Graph from '../../Src/Core/Graph';
import _Node from '../../Src/Core/_Node';
import Edge from '../../Src/Core/Edge';
import GraphMethods from '../../Src/GraphAlgorithms/GraphMethods';

it('adjacency stays equal to the edge set through additions, deletions and rebuilds', async () => {
  await fc.assert(fc.asyncProperty(fc.array(fc.record({
    kind: fc.constantFrom('add', 'remove', 'rebuild'),
    a: fc.integer({ min: 0, max: 3 }), b: fc.integer({ min: 0, max: 3 }),
    edgeId: fc.integer({ min: 0, max: 20 }),
  }), { maxLength: 40 }), async operations => {
    const graph = await Graph.create(new Map([0, 1, 2, 3].map(id => [id, new _Node()])), new Map());
    for (const operation of operations) {
      if (operation.kind === 'add') graph.add_edge(operation.a, operation.b);
      if (operation.kind === 'remove') graph.remove_edge(operation.edgeId);
      if (operation.kind === 'rebuild') await graph.constructAdjacencyList();
      for (const [id, node] of graph.nodes) {
        const expected = new Set<number>();
        for (const edge of graph.edges.values()) {
          if (edge.start === id && edge.end !== id) expected.add(edge.end);
          if (edge.end === id && edge.start !== id) expected.add(edge.start);
        }
        expect([...node.neighbours].sort()).toEqual([...expected].sort());
      }
    }
  }));
});

it('removing one parallel edge retains adjacency until the last edge is removed', async () => {
  const graph = await Graph.create(new Map([[0, new _Node()], [1, new _Node()]]),
    new Map([[5, new Edge(0, 1)], [9, new Edge(1, 0)]]));
  graph.remove_edge(5);
  expect(graph.nodes.get(0)!.neighbours).toEqual([1]);
  graph.remove_edge(9);
  expect(graph.nodes.get(0)!.neighbours).toEqual([]);
});

it('rebuilding adjacency discards stale links after direct edge-map edits', async () => {
  const graph = await Graph.create(new Map([[0, new _Node()], [1, new _Node()]]), new Map([[0, new Edge(0, 1)]]));
  graph.edges.clear();
  await graph.constructAdjacencyList();
  expect([...graph.get_adjacency()]).toEqual([[0, []], [1, []]]);
});

it('shortest paths support negative IDs including the BFS root marker value', async () => {
  const graph = await Graph.create(new Map([-1, 5, 8].map(id => [id, new _Node()])),
    new Map([[0, new Edge(5, -1)], [1, new Edge(-1, 8)]]));
  expect(await GraphMethods.Dijkstra(graph, 5)).toEqual(new Map([[-1, 1], [5, 0], [8, 2]]));
  expect(await GraphMethods.Dijkstra(graph, -1)).toEqual(new Map([[-1, 0], [5, 1], [8, 1]]));
});
