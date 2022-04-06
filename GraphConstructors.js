import { Graph } from "./Graph.js";
import { Node } from "./Node.js";
import { Edge } from "./Edges.js";

// construct a graph based on an edge list etc
async function ConstructGraphNodeEdgesList(nodes, edges) {
  // make a node OBJ
  const nodeOBJ = new Map();
  for (let i = 0; i < nodes.length; i++) {
    const n = new Node(nodes[i].data);
    nodeOBJ.set(nodes[i], n);
  }
  // make an edge object
  const edgeOBJ = new Map();
  for (let i = 0; i < edges.length; i++) {
    const e = new Edge(edges[i][0], edges[i][1], edges[i].data);
    edgeOBJ.set(i, e);
  }
  // make a graph object
  const G = await Graph.create(nodeOBJ, edgeOBJ);
  return G;
}

export { ConstructGraphNodeEdgesList, Graph, Node, Edge };
