import { Line } from "../HelperClasses/Line";
import { Point } from "../HelperClasses/Point";
import { _Node } from "./_Node";
import { Edge } from "./Edge";

interface Graph {
  nodes: Map<number, _Node>;
  edges: Map<number, Edge>;
}

class Graph {
  constructor(nodes, edges) {
    this.nodes = nodes;
    this.edges = edges;
    // execute Internal methods
    // this.printData();
  }

  // test function
  printData() {
    const message =
      "This is a graph with " +
      this.nodes.size +
      " nodes and " +
      this.edges.size +
      " edges";
    console.log(message);
  }

  // initialize
  async initialize() {
    await this.constructAdjacencyList();
  }

  // new create method
  static async create(nodes, edges) {
    const g = new Graph(nodes, edges);
    await g.initialize();
    return g;
  }

  // construct the adjacency list represntation
  async constructAdjacencyList() {
    // I'm constructing a Graph here so some of the stuff doesnt matter
    this.edges.forEach((edge) => {
      // get the start point
      const start = edge.start;
      const end = edge.end;
      // set the node property
      if (this.nodes.get(start)) {
        const relevantSNode = this.nodes.get(start);
        relevantSNode!.neighbours.push(end);
      } else if (this.nodes.get(end)) {
        const relevantENode = this.nodes.get(end);
        relevantENode!.neighbours.push(start);
      }
    });
    // then for each node then get the unique neighbours
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
  add_node(nodeID, data) {
    this.nodes[nodeID] = data;
  }

  // add an edge
  add_edge(start, end, data) {
    const newEdge = new Edge(start, end, data);
    // this is a new edge that we add to the edges
    this.edges.set(this.edges.size, newEdge);
    // also add this to the node neighbours
    const relevantNode = this.nodes.get(start);
    relevantNode!.neighbours.push(end);
  }

  // get an adjacency list reprentation of the graph
  // this onlu has the indices and not the actual data 
  // associated with the node to speed things up
  get_adjacency() {
    const SparseMap:Map<number,number[]> = new Map();
    // iterate through the node list
    for (const key of this.nodes.keys()) {
      SparseMap.set(key, this.nodes.get(key)!.neighbours);
    }
    return SparseMap;
  }

  // set position based on an array of positions
  // this could be anything (we use kamada kawai )
  apply_position_map(data) {
    for (const n of data.keys()) {
      this.nodes.get(n)!.data = { ...this.nodes.get(n)!.data, pos: data.get(n) };
    }
  }

  // create new edge pos representation
  // same approach for applying the key data 
  apply_edge_pos_maps(data) {
    for (const key of data.keys()) {
      this.edges.get(key)!.data = {
        ...this.edges.get(key)!.data,
        ldata: data.get(key),
      };
    }
  }

  // get the edge reps
  // this returns all the edge map readings 
  get_edge_lines() {
    const lines:Map<number,Line> = new Map();
    for (const key of this.edges.keys()) {
      const edge = this.edges.get(key)!.data.ldata;
      lines.set(key, edge);
    }
    return lines;
  }

  // graph apply pos and edge map
  apply_drawing_maps(layout) {
    if (layout.pmap) {
      this.apply_position_map(layout.pmap);
    }
    if (layout.emap) {
      this.apply_edge_pos_maps(layout.emap);
    }
  }

  // get the positon map of the graph
  get_position_map() {
    const pmap: Map<number,Point> = new Map();
    const emap: Map<number,Line> = new Map();
    for (const node of this.nodes.keys()) {
      pmap.set(node, this.nodes.get(node)!.data.pos);
    }
    for (const edge of this.edges.keys()) {
      emap.set(edge, this.edges.get(edge)!.data.ldata);
    }
    return {
      pmap: pmap,
      emap: emap
    };
  }
}

// Export the graph Library
export { Graph };
