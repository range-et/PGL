import { default as Graph } from '../Core/Graph';
import { ClusterResult, ClusterStrategy, ClusterByDistanceOptions } from './types';
import { createKDDistanceStrategy } from './KDDistanceStrategy';
import { buildSimplifiedGraph } from './buildSimplifiedGraph';
/**
 * Cluster the graph by distance (KD-tree based) and return a simplified graph.
 * Nodes within `distanceThreshold` are merged; super-nodes are placed at cluster centroids.
 *
 * @param graph - The graph to cluster
 * @param options - { distanceThreshold: number }
 * @returns A new graph with one node per cluster and aggregated edges between clusters
 */
declare function clusterByDistance(graph: Graph, options: ClusterByDistanceOptions): Promise<Graph>;
/**
 * Cluster the graph using a custom strategy and return a simplified graph.
 *
 * @param graph - The graph to cluster
 * @param strategy - A ClusterStrategy implementation
 * @param options - Strategy-specific options
 * @returns A new graph with one node per cluster and aggregated edges
 */
declare function clusterByStrategy(graph: Graph, strategy: ClusterStrategy, options: Record<string, unknown>): Promise<Graph>;
export type { ClusterResult, ClusterStrategy, ClusterByDistanceOptions };
export { createKDDistanceStrategy, buildSimplifiedGraph };
declare const _default: {
    clusterByDistance: typeof clusterByDistance;
    clusterByStrategy: typeof clusterByStrategy;
};
export default _default;
