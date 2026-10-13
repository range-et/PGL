import { describe, it, expect } from "vitest";
import Graph from "../../Src/Core/Graph";
import _Node from "../../Src/Core/_Node";
import Edge from "../../Src/Core/Edge";
import Point from "../../Src/HelperClasses/Point";
import Drawing from "../../Src/Drawing/Drawing";
import { GraphDrawer3d } from "../../Src/Drawing/GraphDrawer";

async function makeGraph(positions: [number, number, number][], edges: [number, number][]) {
  const nodes = new Map<number, _Node>();
  positions.forEach(([x, y, z], i) => nodes.set(i, new _Node({ pos: new Point(x, y, z) })));
  const edgeMap = new Map<number, Edge>();
  edges.forEach(([s, e], i) => edgeMap.set(i, new Edge(s, e, {})));
  return Graph.create(nodes, edgeMap);
}

describe("Drawing", () => {
  it("edge lines run from the start node to the end node", async () => {
    const G = await makeGraph([[0, 0, 0], [10, 0, 0]], [[0, 1]]);
    const line = Drawing.DrawEdgeLinesDivisions(G, 2).get(0)!;
    expect(line.points.map((p) => p.x)).toEqual([0, 5, 10]);
  });

  it("bundled and Y-displaced edges can still be moved with MoveGraph", async () => {
    const G = await makeGraph([[0, 0, 0], [10, 0, 0], [0, 0, 1], [10, 0, 1]], [[0, 1], [2, 3]]);
    const bundled = await Drawing.DrawEdgeBundling(Drawing.DrawEdgeLinesDivisions(G, 4), 1, 5);
    G.apply_edge_pos_maps(Drawing.DisplaceEdgeInY(bundled, 3));
    const before = G.get_edge_map().get(0)!.points[0].x;
    Drawing.MoveGraph(G, new Point(1, 0, 0));
    expect(G.get_edge_map().get(0)!.points[0].x).toBe(before + 1);
  });

  it("HivePlot places nodes that are unreachable from the selected node on an outer tier", async () => {
    const G = await makeGraph([[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 1], [2, 3]]);
    const { pmap } = await Drawing.HivePlot(G, 0, 10, new Point(0, 0, 0));
    expect(pmap.size).toBe(4);
    expect(pmap.get(1).y).toBe(-10);
    expect(pmap.get(2).y).toBe(-20);
    expect(pmap.get(3).y).toBe(-20);
  });
});

describe("GraphDrawer3d", () => {
  it("accepts the documented { graph, canvas, width, height } options", async () => {
    const graph = await makeGraph([[0, 0, 0]], []);
    const drawer = new GraphDrawer3d({ graph, canvas: {} as HTMLCanvasElement, width: 800, height: 700 });
    expect(drawer.graphs.get(0)).toBe(graph);
    expect(drawer.width).toBe(800);
  });
});
