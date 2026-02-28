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

  describe("remove_node", () => {
    it("removes node and all incident edges", () => {
      const { graph } = makeGraph(4, [[0, 1], [1, 2], [2, 3], [0, 2]]);
      graph.initialize();
      expect(graph.nodes.size).toBe(4);
      expect(graph.edges.size).toBe(4);
      const removed = graph.remove_node(1);
      expect(removed).toBe(true);
      expect(graph.nodes.size).toBe(3);
      expect(graph.nodes.has(1)).toBe(false);
      // Edges 0-1 and 1-2 should be gone (2 edges removed)
      expect(graph.edges.size).toBe(2);
      for (const edge of graph.edges.values()) {
        expect(edge.start).not.toBe(1);
        expect(edge.end).not.toBe(1);
      }
      expect(graph.nodes.get(0)!.neighbours).not.toContain(1);
      expect(graph.nodes.get(2)!.neighbours).not.toContain(1);
    });
    it("returns false when node does not exist", () => {
      const { graph } = makeGraph(2, [[0, 1]]);
      graph.initialize();
      expect(graph.remove_node(999)).toBe(false);
      expect(graph.nodes.size).toBe(2);
    });
  });

  describe("remove_edge", () => {
    it("removes edge and updates adjacency", () => {
      const nodes = new Map<number, _Node>();
      nodes.set(0, new _Node({ pos: new Point(0, 0, 0) }));
      nodes.set(1, new _Node({ pos: new Point(1, 0, 0) }));
      const graph = new Graph(nodes, new Map());
      graph.initialize();
      graph.add_edge(0, 1, {});
      expect(graph.edges.size).toBe(1);
      expect(graph.nodes.get(0)!.neighbours).toContain(1);
      const removed = graph.remove_edge(0);
      expect(removed).toBe(true);
      expect(graph.edges.size).toBe(0);
      expect(graph.nodes.get(0)!.neighbours).not.toContain(1);
      expect(graph.nodes.get(1)!.neighbours).not.toContain(0);
    });
    it("returns false when edge does not exist", () => {
      const { graph } = makeGraph(2, [[0, 1]]);
      graph.initialize();
      expect(graph.remove_edge(999)).toBe(false);
    });
  });

  describe("add_edge", () => {
    it("assigns unique edge IDs using internal counter", () => {
      const nodes = new Map<number, _Node>();
      nodes.set(0, new _Node({ pos: new Point(0, 0, 0) }));
      nodes.set(1, new _Node({ pos: new Point(1, 0, 0) }));
      const graph = new Graph(nodes, new Map());
      graph.initialize();
      graph.add_edge(0, 1, {});
      graph.add_edge(0, 1, {});
      expect(graph.edges.size).toBe(2);
      expect(graph.edges.has(0)).toBe(true);
      expect(graph.edges.has(1)).toBe(true);
    });
  });

  describe("get_position_map", () => {
    it("skips nodes without data.pos", () => {
      const nodes = new Map<number, _Node>();
      nodes.set(0, new _Node({ pos: new Point(1, 2, 3) }));
      nodes.set(1, new _Node({})); // no pos
      nodes.set(2, new _Node({ pos: new Point(7, 8, 9) }));
      const graph = new Graph(nodes, new Map());
      graph.initialize();
      const pmap = graph.get_position_map();
      expect(pmap.size).toBe(2);
      expect(pmap.get(0)?.x).toBe(1);
      expect(pmap.get(2)?.z).toBe(9);
      expect(pmap.has(1)).toBe(false);
    });
  });
});
