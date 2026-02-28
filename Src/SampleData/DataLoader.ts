/**
 * Sample data loaders: ZKC, ZKC simulated, (sgd)² edge lists, OBJ meshes, DWT 1005.
 *
 * @packageDocumentation
 *
 * Use `SampleData.LoadZKC`, `SampleData.LoadZKCSimulated`, `SampleData.LoadGraphFromEdgeListText`,
 * `SampleData.LoadGraphFromObjText`, `SampleData.LoadDwt1005`.
 */
// load up the ZKC dataset
import { zkc } from "./ZKC";
import { zkc_simulated } from "./ZKC_simulated";
import GraphConstructors from "../HelperClasses/GraphConstructors";
import Graph from "../Core/Graph";
import Point from "../HelperClasses/Point";
import _Node from "../Core/_Node";
import Edge from "../Core/Edge";
import Drawing from "../Drawing/Drawing";

/**
 * Parse (sgd)²-style edge list text (one "i j" per line; lines starting with # or empty are skipped).
 * Node IDs can be 0-based or 1-based. Returns a graph with nodes at origin (layout will set positions).
 * Format used by the s_gd2 reference implementation from Imperial College London.
 * @see https://github.com/jxz12/s_gd2
 */
async function LoadGraphFromEdgeListText(edgeListText: string): Promise<Graph> {
  const lines = edgeListText.split(/\r?\n/);
  const edgePairs: [number, number][] = [];
  const nodeIdsSet = new Set<number>();
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const parts = trimmed.split(/\s+/);
    if (parts.length < 2) continue;
    const i = parseInt(parts[0], 10);
    const j = parseInt(parts[1], 10);
    if (Number.isNaN(i) || Number.isNaN(j)) continue;
    edgePairs.push([i, j]);
    nodeIdsSet.add(i);
    nodeIdsSet.add(j);
  }
  const nodes = new Map<number, _Node>();
  const origin = new Point(0, 0, 0);
  for (const id of nodeIdsSet) {
    nodes.set(id, new _Node({ pos: origin }));
  }
  const edges = new Map<number, Edge>();
  edgePairs.forEach(([start, end], idx) => {
    edges.set(idx, new Edge(start, end, {}));
  });
  const G = await Graph.create(nodes, edges);
  return G;
}

/**
 * 
 * @returns the raw ZKC dataset
 */
async function LoadZKC() {
  // load up the dataset representation
  const data = zkc;
  const G = await GraphConstructors.ConstructGraphNodeEdgesList(data.nodes, data.edges);
  return G;
}

/**
 * 
 * @returns the ZKC dataset with the positions simulated beforehand
 */
async function LoadZKCSimulated() {
  // make a map
  const data = zkc_simulated;
  const nodes = new Map();
  const edges = new Map();
  // set the node map
  data.nodes.forEach((node) => {
    const id = node.id;
    const pos = new Point(node.px*50, 0, node.py*50);
    const modularity = node.member;
    const n = new _Node({ pos: pos, size:10, info:"Node Info", modularity:modularity });
    nodes.set(id, n);
  });
  // set the edge map
  for (let i = 0; i < data.edges.length; i++) {
    const edge = data.edges[i];
    const start = edge[0];
    const end = edge[1];
    const e = new Edge(start, end, {});
    edges.set(i, e);
  }
  // make a graph object
  const G = await Graph.create(nodes, edges);
  const lmap = Drawing.DrawEdgeLines(G, 20);
  G.apply_edge_pos_maps(lmap);
  return G;
}

/**
 * Result of loading a mesh from OBJ: graph (vertices = nodes, face edges = graph edges) and original 3D positions.
 * positions[i*3], positions[i*3+1], positions[i*3+2] are x,y,z for node id i (0-based).
 */
export interface LoadGraphFromObjResult {
  graph: Graph;
  /** Flat array of length n*3: x,y,z for each node in order of node id 0..n-1 */
  positions: Float32Array;
}

/**
 * Parse OBJ mesh: "v x y z" lines and "f i j k" (or "f i j k l" for quads) lines.
 * Builds a graph whose nodes are mesh vertices (ids 0..n-1) and edges are unique mesh edges from faces.
 * Returns the graph and original vertex positions so they can be used as initial layout (e.g. for 3D stress).
 * OBJ vertex indices are 1-based; we use 0-based node ids.
 * @see e.g. Stanford Bunny https://graphics.stanford.edu/~mdfisher/Data/Meshes/bunny.obj
 */
async function LoadGraphFromObjText(objText: string): Promise<LoadGraphFromObjResult> {
  const lines = objText.split(/\r?\n/);
  const vertices: number[] = [];
  const edgeSet = new Set<string>();
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    if (trimmed.startsWith("v ")) {
      const parts = trimmed.slice(2).trim().split(/\s+/);
      if (parts.length >= 3) {
        const x = parseFloat(parts[0]);
        const y = parseFloat(parts[1]);
        const z = parseFloat(parts[2]);
        if (!Number.isNaN(x) && !Number.isNaN(y) && !Number.isNaN(z)) {
          vertices.push(x, y, z);
        }
      }
      continue;
    }
    if (trimmed.startsWith("f ")) {
      const parts = trimmed.slice(2).trim().split(/\s+/);
      const indices: number[] = [];
      for (const p of parts) {
        const num = parseInt(p.split("/")[0], 10);
        if (!Number.isNaN(num) && num >= 1) indices.push(num - 1);
      }
      for (let a = 0; a < indices.length; a++) {
        const i = indices[a];
        const j = indices[(a + 1) % indices.length];
        if (i === j) continue;
        const key = i < j ? `${i},${j}` : `${j},${i}`;
        edgeSet.add(key);
      }
    }
  }
  const n = vertices.length / 3;
  const nodes = new Map<number, _Node>();
  const origin = new Point(0, 0, 0);
  for (let id = 0; id < n; id++) {
    nodes.set(id, new _Node({ pos: origin }));
  }
  const edges = new Map<number, Edge>();
  let idx = 0;
  for (const key of edgeSet) {
    const [a, b] = key.split(",").map((s) => parseInt(s, 10));
    edges.set(idx++, new Edge(a, b, {}));
  }
  const G = await Graph.create(nodes, edges);
  const positions = new Float32Array(vertices);
  return { graph: G, positions };
}

/**
 * Load the DWT 1005 graph from the paper (1005 nodes, adjacency-list format).
 * Same structural graph used in the 2D stress layout reference.
 * Lazy-loaded to avoid bundling the large dataset for users who don't need it.
 * @see dwt_1005.ts
 */
async function LoadDwt1005(): Promise<Graph> {
  const { dwt_1005 } = await import("./dwt_1005");
  const adj = dwt_1005 as Record<string, number[]>;
  const nodeIdsSet = new Set<number>();
  for (const key of Object.keys(adj)) {
    const id = parseInt(key, 10);
    if (!Number.isNaN(id)) nodeIdsSet.add(id);
    for (const nb of adj[key]) nodeIdsSet.add(nb);
  }
  const edgeSet = new Set<string>();
  for (const key of Object.keys(adj)) {
    const id = parseInt(key, 10);
    if (Number.isNaN(id)) continue;
    for (const nb of adj[key]) {
      const a = Math.min(id, nb);
      const b = Math.max(id, nb);
      edgeSet.add(`${a},${b}`);
    }
  }
  const nodes = new Map<number, _Node>();
  const origin = new Point(0, 0, 0);
  // Deterministic order 1..N so simulation and drawer node order match
  const sortedIds = [...nodeIdsSet].sort((a, b) => a - b);
  for (const id of sortedIds) {
    nodes.set(id, new _Node({ pos: origin }));
  }
  const edges = new Map<number, Edge>();
  let idx = 0;
  for (const key of edgeSet) {
    const [a, b] = key.split(",").map((s) => parseInt(s, 10));
    edges.set(idx++, new Edge(a, b, {}));
  }
  const G = await Graph.create(nodes, edges);
  return G;
}

// exports
export default { LoadZKC, LoadZKCSimulated, LoadGraphFromEdgeListText, LoadGraphFromObjText, LoadDwt1005 };
