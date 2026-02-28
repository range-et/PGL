import Line from "../HelperClasses/Line";
import Point from "../HelperClasses/Point";
import _Node from "./_Node";
import Edge, { type EdgeData } from "./Edge";

/**
 * The main graph object: contains nodes and edges that get modified with different
 * operations (layout, clustering, etc.).
 */
class Graph {
  nodes: Map<number, _Node>;
  edges: Map<number, Edge>;
  /** Next edge ID for add_edge; avoids collisions when edges are removed. */
  private _nextEdgeId: number;

  /**
   * Construct a graph object (no initializing)
   *
   * @param nodes - Map of all the nodes associated with the graph
   * @param edges - Map of all the edges associated with the graph
   */
  constructor(nodes: Map<number, _Node>, edges: Map<number, Edge>) {
    this.nodes = nodes;
    this.edges = edges;
    this._nextEdgeId =
      edges.size > 0 ? Math.max(...edges.keys()) + 1 : 0;
  }

  // test function
  /**
   * Prints out a snapshot of data associated with this graph like how many nodes and how many edges
   */
  printData() {
    const message =
      "This is a graph with " +
      this.nodes.size +
      " nodes and " +
      this.edges.size +
      " edges";
    console.log(message);
  }

  /**
   * Initializes the graph and constructs the node adjacency list.
   * Async to avoid blocking the main thread on large graphs.
   */
  async initialize(): Promise<void> {
    await this.constructAdjacencyList();
  }

  /**
   * Official create method to make a graph based on a set of nodes and edges.
   * Auto-initializes the graph and sets all adjacency lists in memory.
   *
   * @param nodes - map of nodes
   * @param edges - map of edges
   * @returns initialized graph
   */
  static async create(
    nodes: Map<number, _Node>,
    edges: Map<number, Edge>
  ): Promise<Graph> {
    const g = new Graph(nodes, edges);
    await g.initialize();
    return g;
  }

  /**
   * Constructs the adjacency list representation for the graph.
   * Async to allow yielding on large graphs and avoid hanging the browser.
   */
  async constructAdjacencyList(): Promise<void> {
    // First pass: build neighbours from edges
    this.edges.forEach((edge) => {
      const start = edge.start;
      const end = edge.end;
      if (this.nodes.get(start)) this.nodes.get(start)!.neighbours.push(end);
      if (this.nodes.get(end)) this.nodes.get(end)!.neighbours.push(start);
    });
    // Yield to event loop before second pass (helps large graphs avoid blocking)
    await Promise.resolve();
    // Second pass: deduplicate and remove self-loops
    for (const key of this.nodes.keys()) {
      const neighs = this.nodes.get(key)!.neighbours;
      const new_neigh = [...new Set(neighs)];
      const selfIndex = new_neigh.indexOf(key);
      if (selfIndex > -1) {
        new_neigh.splice(selfIndex, 1); // 2nd parameter means remove one item only
      }
      this.nodes.get(key)!.neighbours = new_neigh;
    }
  }

  // add a node
  /**
   * Add a node to the graph.
   * @param nodeID - The node ID
   * @param data - Data associated with the node
   */
  add_node(nodeID: number, data: _Node) {
    this.nodes.set(nodeID, data);
  }

  // add an edge
  /**
   * Add an edge to the graph
   * @param start - Starting index of the edge
   * @param end - The end index of the edge
   * @param data - data associated with the edge
   */
  add_edge(start: number, end: number, data: EdgeData = {}) {
    const newEdge = new Edge(start, end, data);
    const edgeId = this._nextEdgeId++;
    this.edges.set(edgeId, newEdge);
    // keep adjacency consistent for undirected graph (both directions)
    const startNode = this.nodes.get(start);
    const endNode = this.nodes.get(end);
    if (startNode) startNode.neighbours.push(end);
    if (endNode) endNode.neighbours.push(start);
  }

  /**
   * Remove an edge by ID. Updates adjacency lists.
   * Call {@link constructAdjacencyList} after bulk removals if you need a clean adjacency state.
   *
   * @param edgeId - The edge ID (from add_edge or edges Map key)
   * @returns true if the edge existed and was removed, false otherwise
   */
  remove_edge(edgeId: number): boolean {
    const edge = this.edges.get(edgeId);
    if (!edge) return false;
    const { start, end } = edge;
    const startNode = this.nodes.get(start);
    const endNode = this.nodes.get(end);
    if (startNode) {
      const idx = startNode.neighbours.indexOf(end);
      if (idx > -1) startNode.neighbours.splice(idx, 1);
    }
    if (endNode) {
      const idx = endNode.neighbours.indexOf(start);
      if (idx > -1) endNode.neighbours.splice(idx, 1);
    }
    this.edges.delete(edgeId);
    return true;
  }

  /**
   * Remove a node by ID and all edges incident to it. Updates adjacency lists
   * for remaining nodes.
   *
   * @param nodeId - The node ID to remove
   * @returns true if the node existed and was removed, false otherwise
   */
  remove_node(nodeId: number): boolean {
    if (!this.nodes.has(nodeId)) return false;
    // Collect edge IDs to remove (can't delete while iterating)
    const edgeIdsToRemove: number[] = [];
    for (const [edgeId, edge] of this.edges.entries()) {
      if (edge.start === nodeId || edge.end === nodeId) {
        edgeIdsToRemove.push(edgeId);
      }
    }
    // Remove each incident edge (updates adjacency)
    for (const edgeId of edgeIdsToRemove) {
      this.remove_edge(edgeId);
    }
    this.nodes.delete(nodeId);
    return true;
  }

  // get an adjacency list representation of the graph
  // this only has the indices and not the actual data
  // associated with the node to speed things up
  /**
   *
   * @returns The adjacency lists associated with the graph
   */
  get_adjacency() {
    const SparseMap: Map<number, number[]> = new Map();
    // iterate through the node list
    for (const key of this.nodes.keys()) {
      SparseMap.set(key, this.nodes.get(key)!.neighbours);
    }
    return SparseMap;
  }

  // set position based on an array of positions
  // this could be anything (we use kamada kawai )
  /**
   * Apply a position map based on some data
   * @param data - the position map that has to be applied to the graph
   */
  apply_position_map(data: Map<number, Point>) {
    for (let n of data.keys()) {
      this.nodes.get(n)!.data = {
        ...this.nodes.get(n)!.data,
        pos: data.get(n),
      };
    }
  }

  // create new edge pos representation
  // same approach for applying the key data
  /**
   * Apply an line map to a graph
   * @param data Line data that has to be applied to the graph
   */
  apply_edge_pos_maps(data: Map<number, Line>) {
    for (let key of data.keys()) {
      this.edges.get(key)!.data = {
        ...this.edges.get(key)!.data,
        ldata: data.get(key),
      };
    }
  }

  // get the edge reps
  // this returns all the edge map readings
  /**
   * get the current edge map
   * @returns The current set of edges associated with the graph
   */
  get_edge_map() {
    const lines: Map<number, Line> = new Map();
    for (const key of this.edges.keys()) {
      const ldata = this.edges.get(key)!.data.ldata;
      if (ldata != null) lines.set(key, ldata);
    }
    return lines;
  }

  // graph apply pos and edge map
  /**
   * Applies all the maps to the graph
   * @param layout - Applies an object of maps associated with a graph: {pmap:(the position map), emap:(the edge map)}
   */
  apply_drawing_maps(layout: {
    pmap: Map<number, Point>;
    emap: Map<number, Line>;
  }) {
    if (layout.pmap) {
      this.apply_position_map(layout.pmap);
    }
    if (layout.emap) {
      this.apply_edge_pos_maps(layout.emap);
    }
  }

  // get the position map of the graph
  /**
   * Gets the position map and the edge map respectively
   * @returns The position map and the edge map as pmap and emap
   */
  get_map() {
    return {
      pmap: this.get_position_map(),
      emap: this.get_edge_map(),
    };
  }

  /**
   * Get the position of the nodes in the graph.
   * Nodes without a defined `data.pos` are skipped.
   *
   * @returns The position map (node ID to PointLike)
   */
  get_position_map(): Map<number, Point> {
    const pmap = new Map<number, Point>();
    for (const nodeId of this.nodes.keys()) {
      const pos = this.nodes.get(nodeId)?.data?.pos;
      if (pos != null) {
        pmap.set(nodeId, pos);
      }
    }
    return pmap;
  }

  /**
   * Returns a deterministic order of node IDs (same as iteration order of nodes).
   * Use this order for adjacency matrix rows/columns, simulation buffers, and drawer indices.
   * @returns Array of node IDs in stable order
   */
  get_node_ids_order(): number[] {
    return Array.from(this.nodes.keys());
  }

  /**
   * Returns the adjacency matrix and the node ID order. Dense form is for small/medium graphs;
   * for very large graphs use get_adjacency() (sparse) instead.
   * @returns { matrix: Float32Array (row-major n×n), nodeIds: number[] }
   */
  get_adjacency_matrix(): { matrix: Float32Array; nodeIds: number[] } {
    const nodeIds = this.get_node_ids_order();
    const n = nodeIds.length;
    const matrix = new Float32Array(n * n);
    const adj = this.get_adjacency();
    const idToIndex = new Map<number, number>();
    nodeIds.forEach((id, i) => idToIndex.set(id, i));
    for (let i = 0; i < n; i++) {
      const nodeId = nodeIds[i];
      const neighbours = adj.get(nodeId) ?? [];
      for (const nbId of neighbours) {
        const j = idToIndex.get(nbId);
        if (j !== undefined) matrix[i * n + j] = 1;
      }
    }
    return { matrix, nodeIds };
  }
}

// Export the graph Library
export default Graph;
