import { Graph } from "../Core/Graph";
import { _Node } from "../Core/_Node";
import { Edge } from "../Core/Edge";

// construct a graph based on an edge list etc
/**
 * construct a graph based on an edge list and node list
 * @param nodes nodes as a list
 * @param edges edges as a list 
 * @returns A graph that was construct from the list of nodes and edges
 */
async function ConstructGraphNodeEdgesList(nodes:any[], edges:any[]) {
  // make a node OBJ
  const nodeOBJ = new Map();
  for (let i = 0; i < nodes.length; i++) {
    const n = new _Node(nodes[i].data);
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

export default { ConstructGraphNodeEdgesList };
