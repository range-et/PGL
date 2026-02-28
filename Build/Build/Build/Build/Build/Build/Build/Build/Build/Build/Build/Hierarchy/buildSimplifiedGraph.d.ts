import { default as Graph } from '../Core/Graph';
import { ClusterResult } from './types';
/**
 * Build a new graph where each cluster is one node (at its centroid) and edges
 * between clusters are merged (one edge per cluster pair; optional weight/count in data).
 */
export declare function buildSimplifiedGraph(originalGraph: Graph, clusterResult: ClusterResult): Promise<Graph>;
