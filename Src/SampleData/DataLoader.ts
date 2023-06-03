// load up the ZKC dataset
import { zkc } from "./ZKC";
import { zkc_simulated } from "./ZKC_simulated";
import GraphConstructors from "../HelperClasses/GraphConstructors";
import { Graph } from "../Core/Graph";
import { Point } from "../HelperClasses/Point";
import { _Node } from "../Core/_Node";
import { Edge } from "../Core/Edge";
import Drawing from "../Drawing/Drawing";

async function LoadZKC() {
  // load up the dataset representation
  const data = zkc;
  const G = await GraphConstructors.ConstructGraphNodeEdgesList(data.nodes, data.edges);
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
    const n = new _Node({ pos: pos, size:10, info:"Node Info", modularity:modularity });
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
  const lmap = Drawing.DrawEdgeLines(G, 10);
  G.apply_edge_pos_maps(lmap);
  return G;
}

// exports
export default { LoadZKC, LoadZKCSimulated };
