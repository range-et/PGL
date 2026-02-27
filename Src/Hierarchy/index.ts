/**
 * Hierarchical node combining: cluster nodes (e.g. by distance) and build a simplified graph.
 * Inspired by FlowmapBlue-style location clustering; uses KD-tree distance-based grouping by default.
 */

import Graph from "../Core/Graph";
import type { ClusterResult, ClusterStrategy, ClusterByDistanceOptions } from "./types";
import { createKDDistanceStrategy } from "./KDDistanceStrategy";
import { buildSimplifiedGraph } from "./buildSimplifiedGraph";

/**
 * Cluster the graph by distance (KD-tree based) and return a simplified graph.
 * Nodes within `distanceThreshold` are merged; super-nodes are placed at cluster centroids.
 *
 * @param graph - The graph to cluster
 * @param options - { distanceThreshold: number }
 * @returns A new graph with one node per cluster and aggregated edges between clusters
 */
async function clusterByDistance(
  graph: Graph,
  options: ClusterByDistanceOptions
): Promise<Graph> {
  const strategy = createKDDistanceStrategy();
  const result = strategy.cluster(graph, options);
  return buildSimplifiedGraph(graph, result);
}

/**
 * Cluster the graph using a custom strategy and return a simplified graph.
 *
 * @param graph - The graph to cluster
 * @param strategy - A ClusterStrategy implementation
 * @param options - Strategy-specific options
 * @returns A new graph with one node per cluster and aggregated edges
 */
async function clusterByStrategy(
  graph: Graph,
  strategy: ClusterStrategy,
  options: Record<string, unknown>
): Promise<Graph> {
  const result = strategy.cluster(graph, options);
  return buildSimplifiedGraph(graph, result);
}

export type { ClusterResult, ClusterStrategy, ClusterByDistanceOptions };
export { createKDDistanceStrategy, buildSimplifiedGraph };

export default {
  clusterByDistance,
  clusterByStrategy,
};
