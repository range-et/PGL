import { default as Graph } from '../Core/Graph';
import { default as Point } from '../HelperClasses/Point';
/**
 * Options for distance-based clustering.
 */
export interface ClusterByDistanceOptions {
    /** Maximum distance between two nodes for them to be in the same cluster. */
    distanceThreshold: number;
}
/**
 * Result of a clustering step: maps each node ID to its cluster ID.
 */
export interface ClusterResult {
    /** Map from original node ID to cluster ID (integer). */
    nodeToCluster: Map<number, number>;
    /** Map from cluster ID to centroid position (e.g. for super-node placement). */
    clusterCentroids: Map<number, Point>;
    /** List of unique cluster IDs. */
    clusterIds: number[];
}
/**
 * Strategy interface for hierarchical node combining.
 * Implementations (e.g. KD-tree distance-based, or future class-based) produce a clustering.
 */
export interface ClusterStrategy {
    /**
     * Compute clustering of graph nodes.
     * @param graph - The graph to cluster
     * @param options - Strategy-specific options
     * @returns Assignment of each node to a cluster and cluster centroids
     */
    cluster(graph: Graph, options: Record<string, unknown>): ClusterResult;
}
