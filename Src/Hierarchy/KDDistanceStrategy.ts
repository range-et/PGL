/**
 * KD-tree distance-based cluster strategy.
 * Nodes within the given distance threshold are merged into the same cluster.
 */

import Graph from "../Core/Graph";
import _Node from "../Core/_Node";
import Point from "../HelperClasses/Point";
import GeometryHelpers from "../HelperClasses/GeometryHelpers";
import type { ClusterResult } from "./types";
import type { ClusterByDistanceOptions } from "./types";
import { pointsWithinRadius } from "./KDTree";

class UnionFind {
  private parent: Map<number, number> = new Map();
  private size: Map<number, number> = new Map();

  // Iterative with path compression: recursion overflowed the stack on long chains.
  find(x: number): number {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      this.size.set(x, 1);
      return x;
    }
    let root = x;
    while (this.parent.get(root) !== root) root = this.parent.get(root)!;
    while (x !== root) {
      const next = this.parent.get(x)!;
      this.parent.set(x, root);
      x = next;
    }
    return root;
  }

  // Union by size keeps trees shallow.
  union(x: number, y: number): void {
    let px = this.find(x);
    let py = this.find(y);
    if (px === py) return;
    if (this.size.get(px)! > this.size.get(py)!) [px, py] = [py, px];
    this.parent.set(px, py);
    this.size.set(py, this.size.get(px)! + this.size.get(py)!);
  }
}

/**
 * Cluster strategy that groups nodes by Euclidean distance using a KD-tree.
 */
export function createKDDistanceStrategy(): { cluster: (graph: Graph, options: ClusterByDistanceOptions) => ClusterResult } {
  return {
    cluster(graph: Graph, options: ClusterByDistanceOptions): ClusterResult {
      const { distanceThreshold } = options;
      const pmap = graph.get_position_map();
      const items: Array<{ point: Point; nodeId: number }> = [];
      for (const [nodeId, point] of pmap) {
        items.push({ point, nodeId });
      }

      if (items.length === 0) {
        return { nodeToCluster: new Map(), clusterCentroids: new Map(), clusterIds: [] };
      }

      const withinRadius = pointsWithinRadius(items, distanceThreshold);
      const uf = new UnionFind();

      for (const [nodeId, neighbors] of withinRadius) {
        for (const other of neighbors) {
          uf.union(nodeId, other);
        }
      }

      const rootToClusterId = new Map<number, number>();
      let nextId = 0;
      const nodeToCluster = new Map<number, number>();
      const clusterToNodes = new Map<number, number[]>();

      for (const { nodeId } of items) {
        const root = uf.find(nodeId);
        if (!rootToClusterId.has(root)) {
          rootToClusterId.set(root, nextId++);
        }
        const cid = rootToClusterId.get(root)!;
        nodeToCluster.set(nodeId, cid);
        if (!clusterToNodes.has(cid)) clusterToNodes.set(cid, []);
        clusterToNodes.get(cid)!.push(nodeId);
      }

      const clusterCentroids = new Map<number, Point>();
      for (const [cid, nids] of clusterToNodes) {
        const points = nids.map((id) => pmap.get(id)!);
        clusterCentroids.set(cid, GeometryHelpers.centroid(points));
      }

      const clusterIds = [...clusterToNodes.keys()];

      return { nodeToCluster, clusterCentroids, clusterIds };
    },
  };
}
