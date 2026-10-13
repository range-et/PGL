import { describe, it, expect } from "vitest";
import Models from "../../Src/Models/ErdosRenyiModel";
import Graph from "../../Src/Core/Graph";
import _Node from "../../Src/Core/_Node";
import Point from "../../Src/HelperClasses/Point";
import Hierarchy from "../../Src/Hierarchy";

describe("GenerateErdosReyni_n_p", () => {
  it("returns an initialized graph with unique undirected edges at density p", async () => {
    const n = 400;
    const p = 0.05;
    const G = await Models.GenerateErdosReyni_n_p(n, p);
    const pairs = new Set<string>();
    for (const e of G.edges.values()) {
      expect(e.start).not.toBe(e.end);
      pairs.add(`${Math.min(e.start, e.end)},${Math.max(e.start, e.end)}`);
    }
    expect(pairs.size).toBe(G.edges.size);
    // Expected n(n-1)/2 * p = 3990 edges, sd ≈ 62; ordered-pair sampling gives ~7800.
    expect(G.edges.size).toBeGreaterThan(3990 * 0.85);
    expect(G.edges.size).toBeLessThan(3990 * 1.15);
    const degreeSum = [...G.nodes.values()].reduce((s, node) => s + node.neighbours.length, 0);
    expect(degreeSum).toBe(2 * G.edges.size);
  });
});

describe("Hierarchy.clusterByDistance", () => {
  it("merges a 100k-node chain of close points into one cluster", async () => {
    // Consecutive points are sqrt(3) ≈ 1.73 apart, so the chain is one cluster at threshold 1.8.
    const nodes = new Map<number, _Node>();
    for (let i = 0; i < 100_000; i++) nodes.set(i, new _Node({ pos: new Point(i, i, i) }));
    const G = new Graph(nodes, new Map());
    const simplified = await Hierarchy.clusterByDistance(G, { distanceThreshold: 1.8 });
    expect(simplified.nodes.size).toBe(1);
  });
});
