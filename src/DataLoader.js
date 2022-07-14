// load up the ZKC dataset
import { zkc } from "./SampleData/ZKC.js";
import { zkc_simulated } from "./SampleData/ZKC_simulated.js";
import { ConstructGraphNodeEdgesList } from "./GraphConstructors.js";
import { Graph } from "./Graph.js";
import { Point } from "./HelperClasses/Point.js";
import { Vertex } from "./Vertex.js";
import { Edge } from "./Edges.js";
import { DrawEdgeLines } from "./Drawing.js";

async function LoadZKC() {
  // load up the dataset representation
  const data = zkc;
  const G = await ConstructGraphNodeEdgesList(data.nodes, data.edges);
  return G;
}

async function LoadZKCSimulated() {
  // make a map
  const data = zkc_simulated;
  const nodes = new Map();
  const edges = new Map();
  // set the node map
  data.nodes.forEach((node) => {
    const id = node.id;
    const pos = new Point(node.px*50, 0, node.py*50);
    const modularity = node.member;
    const n = new Vertex({ pos: pos, size:10, info:"Node Info", modularity:modularity });
    nodes.set(id, n);
  });
  // set the edge map
  for (let i = 0; i < data.edges.length; i++) {
    const edge = data.edges[i];
    const start = edge[0];
    const end = edge[1];
    const e = new Edge(start, end, {});
    edges.set(i, e);
  }
  // make a graph object
  const G = await Graph.create(nodes, edges);
  const lmap = DrawEdgeLines(G, 10);
  G.apply_edge_pos_maps(lmap);
  return G;
}

// exports
export { LoadZKC, LoadZKCSimulated };
