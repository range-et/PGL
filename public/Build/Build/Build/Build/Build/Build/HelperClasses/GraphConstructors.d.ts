import { default as Graph } from '../Core/Graph';
/**
 * construct a graph based on an edge list and node list
 * @param nodes nodes as a list
 * @param edges edges as a list
 * @returns A graph that was construct from the list of nodes and edges
 */
declare function ConstructGraphNodeEdgesList(nodes: any[], edges: any[]): Promise<Graph>;
declare const _default: {
    ConstructGraphNodeEdgesList: typeof ConstructGraphNodeEdgesList;
};
export default _default;
