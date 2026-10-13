import { describe, it, expect } from "vitest";
import { SampleData } from "../../Src/SampleData";
import Drawing from "../../Src/Drawing/Drawing";
import Point from "../../Src/HelperClasses/Point";

describe("SampleData loaders", () => {
  it("LoadGraphFromEdgeListText gives every node its own position", async () => {
    const G = await SampleData.LoadGraphFromEdgeListText("0 1\n1 2\n");
    Drawing.MoveGraph(G, new Point(1, 0, 0));
    expect([...G.get_position_map().values()].map((p) => p.x)).toEqual([1, 1, 1]);
  });

  it("LoadGraphFromObjText gives every node its own position", async () => {
    const { graph } = await SampleData.LoadGraphFromObjText("v 0 0 0\nv 1 0 0\nv 0 1 0\nf 1 2 3\n");
    graph.nodes.get(0)!.data.pos.y = 5;
    expect(graph.nodes.get(1)!.data.pos.y).toBe(0);
  });

  it("LoadDwt1005 gives every node its own position", async () => {
    const G = await SampleData.LoadDwt1005();
    const positions = new Set([...G.nodes.values()].map((n) => n.data.pos));
    expect(positions.size).toBe(G.nodes.size);
  });
});
