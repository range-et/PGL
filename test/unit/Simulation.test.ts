import { describe, it, expect } from "vitest";
import Graph from "../../Src/Core/Graph";
import _Node from "../../Src/Core/_Node";
import Edge from "../../Src/Core/Edge";
import Point from "../../Src/HelperClasses/Point";
import { createKamadaKawai3D, createStressSGD3D } from "../../Src/Simulation";
import { buildOctree, computeRepulsionForce } from "../../Src/Simulation/Octree";
import { createRng } from "../../Src/Simulation/StressSGD3D";

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

describe("Octree", () => {
  it("builds with coincident points and counts both in the repulsion", () => {
    const tree = buildOctree(
      [
        { x: 1, y: 1, z: 1, index: 0 },
        { x: 1, y: 1, z: 1, index: 1 },
        { x: -3, y: 0, z: 0, index: 2 },
      ],
      -4, -4, -4, 4
    );
    const out = { fx: 0, fy: 0, fz: 0 };
    // Query at (3,3,3) with point 2 excluded; theta=0 forces descent to the leaves.
    computeRepulsionForce(tree, 3, 3, 3, 2, 1, 0, out);
    // Each point at (1,1,1) pushes by -diff/|diff|^2 = 2/12 per axis.
    expect(out.fx).toBeCloseTo(2 * (2 / 12));
    expect(out.fz).toBeCloseTo(2 * (2 / 12));
  });

  it("Kamada-Kawai with the octree survives nodes stacked on one position", async () => {
    const graph = makeGraph(100, []);
    await graph.initialize();
    const sim = createKamadaKawai3D(graph, { simulationBound: 0, centerPull: 0 });
    expect(() => sim.step(0)).not.toThrow();
  });
});

describe("StressSGD3D random generator", () => {
  it("stays in [0, 1) and does not cycle within 200k draws", () => {
    const rng = createRng(12345);
    const seen = new Set<number>();
    let outOfRange = 0;
    for (let i = 0; i < 200_000; i++) {
      const v = rng();
      if (!(v >= 0 && v < 1)) outOfRange++;
      seen.add(v);
    }
    expect(outOfRange).toBe(0);
    expect(seen.size).toBe(200_000);
  });
});

describe("createStressSGD3D after the schedule ends", () => {
  it("leaves positions unchanged even with centerPull and initialPreservation", async () => {
    const graph = makeGraph(4, [[0, 1], [1, 2], [2, 3]]);
    await graph.initialize();
    const initialPositions = new Float32Array([0, 0, 0, 5, 0, 0, 5, 5, 0, 0, 5, 0]);
    const sim = await createStressSGD3D(graph, {
      seed: 3,
      tMax: 5,
      epochsPerStep: 5,
      centerPull: 0.1,
      initialPositions,
      initialPreservation: 0.2,
    });
    sim.step(0);
    const settled = Array.from(sim.getPositions());
    sim.step(0);
    sim.step(0);
    expect(Array.from(sim.getPositions())).toEqual(settled);
  });
});

describe("createStressSGD3D layout quality", () => {
  it("lays out each component so distances match hop counts", async () => {
    // path 0-1-2-3 plus a separate edge 4-5
    const graph = makeGraph(6, [[0, 1], [1, 2], [2, 3], [4, 5]]);
    await graph.initialize();
    const sim = await createStressSGD3D(graph, { seed: 11, epochsPerStep: 80 });
    sim.step(0);
    const p = sim.getPositions();
    const dist = (a: number, b: number) => Math.hypot(p[a * 3] - p[b * 3], p[a * 3 + 1] - p[b * 3 + 1]);
    expect(Math.abs(dist(0, 3) - 3)).toBeLessThan(0.1);
    expect(Math.abs(dist(0, 2) - 2)).toBeLessThan(0.1);
    expect(Math.abs(dist(4, 5) - 1)).toBeLessThan(0.1);
  });
});
