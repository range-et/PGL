import { default as Line } from '../HelperClasses/Line';
import { default as Point } from '../HelperClasses/Point';
import { default as _Node } from './_Node';
import { default as Edge } from './Edge';
/**
 * The main graph object: contains nodes and edges that get modified with different
 * operations (layout, clustering, etc.).
 */
declare class Graph {
    nodes: Map<number, _Node>;
    edges: Map<number, Edge>;
    /** Next edge ID for add_edge; avoids collisions when edges are removed. */
    private _nextEdgeId;
    /**
     * Construct a graph object (no initializing)
     *
     * @param nodes - Map of all the nodes associated with the graph
     * @param edges - Map of all the edges associated with the graph
     */
    constructor(nodes: Map<number, _Node>, edges: Map<number, Edge>);
    /**
     * Prints out a snapshot of data associated with this graph like how many nodes and how many edges
     */
    printData(): void;
    /**
     * Initializes the graph and constructs the node adjacency list.
     * Async to avoid blocking the main thread on large graphs.
     */
    initialize(): Promise<void>;
    /**
     * Official create method to make a graph based on a set of nodes and edges.
     * Auto-initializes the graph and sets all adjacency lists in memory.
     *
     * @param nodes - map of nodes
     * @param edges - map of edges
     * @returns initialized graph
     */
    static create(nodes: Map<number, _Node>, edges: Map<number, Edge>): Promise<Graph>;
    /**
     * Constructs the adjacency list representation for the graph.
     * Async to allow yielding on large graphs and avoid hanging the browser.
     */
    constructAdjacencyList(): Promise<void>;
    /**
     * Add a node to the graph.
     * @param nodeID - The node ID
     * @param data - Data associated with the node
     */
    add_node(nodeID: number, data: _Node): void;
    /**
     * Add an edge to the graph
     * @param start - Starting index of the edge
     * @param end - The end index of the edge
     * @param data - data associated with the edge
     */
    add_edge(start: number, end: number, data: any): void;
    /**
     *
     * @returns The adjacency lists associated with the graph
     */
    get_adjacency(): Map<number, number[]>;
    /**
     * Apply a position map based on some data
     * @param data - the position map that has to be applied to the graph
     */
    apply_position_map(data: Map<number, Point>): void;
    /**
     * Apply an line map to a graph
     * @param data Line data that has to be applied to the graph
     */
    apply_edge_pos_maps(data: Map<number, Line>): void;
    /**
     * get the current edge map
     * @returns The current set of edges associated with the graph
     */
    get_edge_map(): Map<number, Line>;
    /**
     * Applies all the maps to the graph
     * @param layout - Applies an object of maps associated with a graph: {pmap:(the position map), emap:(the edge map)}
     */
    apply_drawing_maps(layout: {
        pmap: Map<number, Point>;
        emap: Map<number, Line>;
    }): void;
    /**
     * Gets the position map and the edge map respectively
     * @returns The position map and the edge map as pmap and emap
     */
    get_map(): {
        pmap: Map<number, Point>;
        emap: Map<number, Line>;
    };
    /**
     * Get the position of the nodes in the graph.
     * Nodes without a defined `data.pos` are skipped.
     *
     * @returns The position map (node ID to Point)
     */
    get_position_map(): Map<number, Point>;
    /**
     * Returns a deterministic order of node IDs (same as iteration order of nodes).
     * Use this order for adjacency matrix rows/columns, simulation buffers, and drawer indices.
     * @returns Array of node IDs in stable order
     */
    get_node_ids_order(): number[];
    /**
     * Returns the adjacency matrix and the node ID order. Dense form is for small/medium graphs;
     * for very large graphs use get_adjacency() (sparse) instead.
     * @returns { matrix: Float32Array (row-major n×n), nodeIds: number[] }
     */
    get_adjacency_matrix(): {
        matrix: Float32Array;
        nodeIds: number[];
    };
}
export default Graph;
