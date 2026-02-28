import { describe, it, expect } from "vitest";
import Graph from "../../Src/Core/Graph";
import _Node from "../../Src/Core/_Node";
import Edge from "../../Src/Core/Edge";
import Point from "../../Src/HelperClasses/Point";
import { createKamadaKawai3D, createStressSGD3D } from "../../Src/Simulation";

function makeGraph(
  numNodes: number,
  edges: [number, number][]
): Graph {
  const nodes = new Map<number, _Node>();
  for (let i = 0; i < numNodes; i++) {
    nodes.set(i, new _Node({ pos: new Point(i, 0, 0) }));
  }
  const edgeMap = new Map<number, Edge>();
  edges.forEach(([s, e], idx) => edgeMap.set(idx, new Edge(s, e, {})));
  const graph = new Graph(nodes, edgeMap);
  return graph;
}

describe("createKamadaKawai3D", () => {
  it("step() produces finite positions", async () => {
    const graph = makeGraph(5, [[0, 1], [1, 2], [2, 3], [3, 4]]);
    await graph.initialize();
    const sim = createKamadaKawai3D(graph, { iterationsPerStep: 2 });
    sim.step(0.016);
    const pos = sim.getPositions();
    for (let i = 0; i < pos.length; i++) {
      expect(Number.isFinite(pos[i])).toBe(true);
    }
  });
  it("getPositionMap returns Map with same node count", async () => {
    const graph = makeGraph(3, [[0, 1], [1, 2]]);
    await graph.initialize();
    const sim = createKamadaKawai3D(graph);
    sim.step(0.1);
    const pmap = sim.getPositionMap();
    expect(pmap.size).toBe(3);
  });
});

describe("createStressSGD3D", () => {
  it("step() produces finite positions", async () => {
    const graph = makeGraph(5, [[0, 1], [1, 2], [2, 3], [3, 4]]);
    await graph.initialize();
    const sim = await createStressSGD3D(graph, { epochsPerStep: 10 });
    sim.step(0.016);
    const pos = sim.getPositions();
    for (let i = 0; i < pos.length; i++) {
      expect(Number.isFinite(pos[i])).toBe(true);
    }
  });
  it("getPositionMap returns Map with same node count", async () => {
    const graph = makeGraph(3, [[0, 1], [1, 2]]);
    await graph.initialize();
    const sim = await createStressSGD3D(graph);
    sim.step(0.1);
    const pmap = sim.getPositionMap();
    expect(pmap.size).toBe(3);
  });
});
