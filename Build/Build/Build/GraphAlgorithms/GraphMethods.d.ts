import { default as Graph } from '../Core/Graph';
/**
 *
 * Performs a BFS search on a graph - Async because it takes a while on large graphs
 *
 * @param Graph - The graph which has to be searched using the BFS algorithm
 * @param node - The node form which to start
 * @returns - A map of which node was explored from which other node
 */
declare function BFSSearch(Graph: Graph, node: number): Promise<Map<number, number>>;
/**
 *
 * Performs a dijkstra search on a graph
 *
 * @param Graph - The graph on which to perform the Dijkstra search
 * @param Node - The node from which to start
 * @returns - Map from which each one of the nodes was searched from
 */
declare function Dijkstra(Graph: Graph, Node: number): Promise<Map<number, number>>;
/**
 *
 * Finds the diameter of the graph
 *
 * @param Graph
 * @returns returns an object with a start, end - the two points of a graph and the diameter of the graph
 */
declare function GraphDiameter(Graph: Graph): Promise<{
    start: number;
    end: number;
    distance: number;
}>;
/**
 *
 * Select a subgraph
 *
 * @param graph - The main graph to select from
 * @param nodeList - The selection of nodes that we want to select from this graph
 * @returns A graph object that contains this subgraph
 */
declare function SelectSubgraph(graph: Graph, nodeList: number[]): Promise<Graph>;
declare const _default: {
    GraphDiameter: typeof GraphDiameter;
    Dijkstra: typeof Dijkstra;
    BFSSearch: typeof BFSSearch;
    SelectSubgraph: typeof SelectSubgraph;
};
export default _default;
