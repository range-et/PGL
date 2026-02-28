import { default as Graph } from '../Core/Graph';
/**
 * Parse (sgd)²-style edge list text (one "i j" per line; lines starting with # or empty are skipped).
 * Node IDs can be 0-based or 1-based. Returns a graph with nodes at origin (layout will set positions).
 * Format used by the s_gd2 reference implementation from Imperial College London.
 * @see https://github.com/jxz12/s_gd2
 */
declare function LoadGraphFromEdgeListText(edgeListText: string): Promise<Graph>;
/**
 *
 * @returns the raw ZKC dataset
 */
declare function LoadZKC(): Promise<Graph>;
/**
 *
 * @returns the ZKC dataset with the positions simulated beforehand
 */
declare function LoadZKCSimulated(): Promise<Graph>;
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
declare function LoadGraphFromObjText(objText: string): Promise<LoadGraphFromObjResult>;
/**
 * Load the DWT 1005 graph from the paper (1005 nodes, adjacency-list format).
 * Same structural graph used in the 2D stress layout reference.
 * Lazy-loaded to avoid bundling the large dataset for users who don't need it.
 * @see dwt_1005.ts
 */
declare function LoadDwt1005(): Promise<Graph>;
declare const _default: {
    LoadZKC: typeof LoadZKC;
    LoadZKCSimulated: typeof LoadZKCSimulated;
    LoadGraphFromEdgeListText: typeof LoadGraphFromEdgeListText;
    LoadGraphFromObjText: typeof LoadGraphFromObjText;
    LoadDwt1005: typeof LoadDwt1005;
};
export default _default;
