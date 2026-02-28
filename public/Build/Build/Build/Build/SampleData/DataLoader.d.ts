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
 * @returns the ZKC dataset with the positons simulated before hand
 */
declare function LoadZKCSimulated(): Promise<Graph>;
declare const _default: {
    LoadZKC: typeof LoadZKC;
    LoadZKCSimulated: typeof LoadZKCSimulated;
    LoadGraphFromEdgeListText: typeof LoadGraphFromEdgeListText;
};
export default _default;
