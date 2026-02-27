import { describe, it, expect } from "vitest";
import Graph from "../../Src/Core/Graph";
import _Node from "../../Src/Core/_Node";
import Edge from "../../Src/Core/Edge";
import Point from "../../Src/HelperClasses/Point";

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

describe("Graph", () => {
  describe("apply_position_map and get_position_map", () => {
    it("round-trip preserves positions", async () => {
      const { graph } = makeGraph(3, [[0, 1], [1, 2]]);
      await graph.initialize();
      const pmap = new Map<number, Point>();
      pmap.set(0, new Point(1, 2, 3));
      pmap.set(1, new Point(4, 5, 6));
      pmap.set(2, new Point(7, 8, 9));
      graph.apply_position_map(pmap);
      const out = graph.get_position_map();
      expect(out.size).toBe(3);
      expect(out.get(0)?.x).toBe(1);
      expect(out.get(0)?.y).toBe(2);
      expect(out.get(0)?.z).toBe(3);
      expect(out.get(1)?.x).toBe(4);
      expect(out.get(2)?.z).toBe(9);
    });
  });

  describe("get_node_ids_order", () => {
    it("returns node IDs in deterministic order", async () => {
      const { graph } = makeGraph(4, [[0, 1], [2, 3]]);
      await graph.initialize();
      const order = graph.get_node_ids_order();
      expect(order).toEqual([0, 1, 2, 3]);
    });
  });

  describe("get_adjacency_matrix", () => {
    it("returns n×n matrix and nodeIds", async () => {
      const { graph } = makeGraph(3, [[0, 1], [1, 2]]);
      await graph.initialize();
      const { matrix, nodeIds } = graph.get_adjacency_matrix();
      expect(nodeIds).toEqual([0, 1, 2]);
      expect(matrix.length).toBe(9);
      // 0-1, 1-2: undirected so (0,1),(1,0),(1,2),(2,1) = 1
      expect(matrix[0 * 3 + 1]).toBe(1);
      expect(matrix[1 * 3 + 0]).toBe(1);
      expect(matrix[1 * 3 + 2]).toBe(1);
      expect(matrix[2 * 3 + 1]).toBe(1);
      expect(matrix[0 * 3 + 0]).toBe(0);
      expect(matrix[0 * 3 + 2]).toBe(0);
    });
  });
});
