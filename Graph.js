import { Edge } from "./Edges.js";

class Graph {
  constructor(nodes, edges) {
    this.nodes = nodes;
    this.edges = edges;
    // execute Internal methods
    // first construct the adjacency list representation
    this.constructAdjacencyList();
    this.printData();
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

  // construct the adjacency list represntation
  constructAdjacencyList() {
    // I'm constructing a Graph here so some of the stuff doesnt matter
    this.edges.forEach((edge) => {
      // get the start point
      const start = edge.start;
      const end = edge.end;
      // set the node property
      const relevantSNode = this.nodes.get(start);
      relevantSNode.neighbours.push(end);
      // set the other way around (since this is a regular graph)
      const relevantENode = this.nodes.get(end);
      relevantENode.neighbours.push(start);
    });
    // then for each node then get the unique neighbours
    for (const key of this.nodes.keys()) {
      const neighs = this.nodes.get(key).neighbours;
      const new_neigh = [...new Set(neighs)];
      const selfIndex = new_neigh.indexOf(key);
      if (selfIndex > -1) {
        new_neigh.splice(selfIndex, 1); // 2nd parameter means remove one item only
      }
      this.nodes.get(key).neighbours = new_neigh;
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
    relevantNode.neighbours.push(end);
  }

  // get a sparse reprentation of the graph
  get_adjacency() {
    const SparseMap = new Map();
    // iterate through the node list
    for (const key of this.nodes.keys()) {
      SparseMap.set(key, this.nodes.get(key).neighbours);
    }
    return SparseMap;
  }

  // set position based on simulated array
  apply_position_map(data) {
    for (const n of data.keys()) {
      this.nodes.get(n).data = { ...this.nodes.get(n).data, pos: data.get(n) };
    }
  }

  // create new edge pos representation
  apply_edge_pos_maps(data) {
    for (const key of data.keys()) {
      this.edges.get(key).data = {
        ...this.edges.get(key).data,
        ldata: data.get(key),
      };
    }
  }

  // get the edge reps
  get_edge_lines() {
    const lines = new Map();
    for (const key of this.edges.keys()) {
      const edge = this.edges.get(key).data.ldata;
      lines.set(key, edge);
    }
    return lines;
  }

  // graph apply pos and edge map
  apply_drawing_maps(layout) {
    console.log(layout);
    if (layout.pmap) {
      this.apply_position_map(layout.pmap);
    }
    if (layout.emap) {
      this.apply_edge_pos_maps(layout.emap);
    }
  }
}

// Export the graph Library
export { Graph };
