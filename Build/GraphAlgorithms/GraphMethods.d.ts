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
 * Estimates the diameter of the graph with a double BFS sweep (BFS from a random node, then
 * BFS from the farthest node found). The result is exact for trees and a lower bound in
 * general; on disconnected graphs it only covers the component of the random start node.
 *
 * @param Graph
 * @returns an object with start, end - the two endpoints found - and distance, their hop distance
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
