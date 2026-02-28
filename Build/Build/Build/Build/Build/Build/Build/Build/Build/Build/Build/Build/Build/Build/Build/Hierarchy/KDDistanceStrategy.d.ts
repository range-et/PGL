import { default as Graph } from '../Core/Graph';
import { ClusterResult, ClusterByDistanceOptions } from './types';
/**
 * Cluster strategy that groups nodes by Euclidean distance using a KD-tree.
 */
export declare function createKDDistanceStrategy(): {
    cluster: (graph: Graph, options: ClusterByDistanceOptions) => ClusterResult;
};
