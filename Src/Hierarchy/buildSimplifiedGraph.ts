/**
 * Build a simplified Graph from a clustering result and the original graph.
 * Super-nodes are placed at cluster centroids; edges between clusters are aggregated.
 */

import Graph from "../Core/Graph";
import _Node from "../Core/_Node";
import Edge from "../Core/Edge";
import type { ClusterResult } from "./types";

/**
 * Build a new graph where each cluster is one node (at its centroid) and edges
 * between clusters are merged (one edge per cluster pair; optional weight/count in data).
 */
export async function buildSimplifiedGraph(
  originalGraph: Graph,
  clusterResult: ClusterResult
): Promise<Graph> {
  const { nodeToCluster, clusterCentroids, clusterIds } = clusterResult;
  const nodes = new Map<number, _Node>();
  const edges = new Map<number, Edge>();

  for (const cid of clusterIds) {
    const pos = clusterCentroids.get(cid)!;
    const n = new _Node({ pos });
    nodes.set(cid, n);
  }

  const edgeCount = new Map<string, number>();
  const key = (a: number, b: number) => (a <= b ? `${a},${b}` : `${b},${a}`);

  for (const [, edge] of originalGraph.edges) {
    const ca = nodeToCluster.get(edge.start);
    const cb = nodeToCluster.get(edge.end);
    if (ca === undefined || cb === undefined) continue;
    if (ca === cb) continue;
    const k = key(ca, cb);
    edgeCount.set(k, (edgeCount.get(k) ?? 0) + 1);
  }

  let eid = 0;
  for (const [k, count] of edgeCount) {
    const [a, b] = k.split(",").map(Number);
    edges.set(eid++, new Edge(a, b, { count }));
  }

  const simplified = new Graph(nodes, edges);
  await simplified.initialize();
  return simplified;
}
