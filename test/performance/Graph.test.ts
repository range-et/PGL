import { describe, it, expect } from "vitest";
import Graph from "../../Src/Core/Graph";
import _Node from "../../Src/Core/_Node";
import Edge from "../../Src/Core/Edge";
import Point from "../../Src/HelperClasses/Point";
import GraphMethods from "../../Src/GraphAlgorithms/GraphMethods";

function makeGraph(
  numNodes: number,
  edges: [number, number][]
): { graph: Graph; nodes: Map<number, _Node>; edges: Map<number, Edge> } {
  const nodes = new Map<number, _Node>();
  for (let i = 0; i < numNodes; i++) {
    nodes.set(i, new _Node({ pos: new Point(i, 0, 0) }));
  }
  const edgeMap = new Map<number, Edge>();
  edges.forEach(([s, e], idx) => {
    edgeMap.set(idx, new Edge(s, e, {}));
  });
  const graph = new Graph(nodes, edgeMap);
  return { graph, nodes, edges: edgeMap };
}

describe("GraphMethods.Dijkstra", () => {
  it("returns hop distances on a long path in linear time, leaving out unreachable nodes", async () => {
    const n = 30_000;
    const { graph } = makeGraph(n, Array.from({ length: n - 2 }, (_, i) => [i, i + 1] as [number, number]));
    await graph.initialize();
    const t0 = performance.now();
    const d = await GraphMethods.Dijkstra(graph, 0);
    // linear BFS takes a few ms here; walking parent chains per node (O(n²)) takes seconds
    expect(performance.now() - t0).toBeLessThan(1000);
    expect(d.get(n - 2)).toBe(n - 2);
    expect(d.has(n - 1)).toBe(false); // last node has no edges
    expect(d.size).toBe(n - 1);
  });
});
