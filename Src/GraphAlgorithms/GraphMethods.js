import { Graph } from "../Core/Graph.js";

// do a BFS Search Starting from some point
// searches the whole graph and returns a map of which node
// was searched from where
async function BFSSearch(G, node) {
  const adj = G.get_adjacency();
  const exploredFromMap = new Map();

  const explored = [];
  const stack = [];

  // queue the first node
  stack.push(node);
  exploredFromMap.set(node, -1);

  // search through the whole graph
  while (stack.length > 0) {
    const currentNode = stack.pop();
    // add this current node to the explored list
    explored.push(currentNode);
    const neighbours = adj.get(currentNode);
    for (let i = 0; i < neighbours.length; i++) {
      const neighbour = neighbours[i];
      if (!explored.includes(neighbour)) {
        stack.push(neighbour);
        exploredFromMap.set(neighbour, currentNode);
      }
    }
  }

  // then return the explored from map
  return exploredFromMap;
}

// do a dijkstra Search
async function Dijkstra(G, Node) {
  const adj = G.get_adjacency();
  const Dmap = new Map();
  // get the explored from map
  const exploredFromMap = await BFSSearch(G, Node);
  // then for each element in the map go through
  // contact trace where that element came from
  for (const n of adj.keys()) {
    let i = 0;
    let exploredFrom = exploredFromMap.get(n);
    while (exploredFrom != -1) {
      exploredFrom = exploredFromMap.get(exploredFrom);
      i += 1;
    }
    Dmap.set(n, i);
  }
  // now return this map
  return Dmap;
}

// This file contains basic things like
// Graph searches and stuff
async function GraphDiameter(graph) {
  // find the diameter of the graph
  // start Dijkstra from some random node
  let seed = Math.floor(Math.random() * graph.nodes.size);
  let Dstart = await Dijkstra(graph, seed);
  // iterate through all the values and then get
  // the value that is the highest amongst the others
  let currentDistance = -1;
  for (const n of Dstart.keys()) {
    const dval = Dstart.get(n);
    if (dval > currentDistance) {
      seed = n;
      currentDistance = dval;
    }
  }
  // then search from there to the furthest point again
  const newStart = seed;
  Dstart = await Dijkstra(graph, seed);
  // repeat the thing
  currentDistance = -1;
  for (const n of Dstart.keys()) {
    const dval = Dstart.get(n);
    if (dval > currentDistance) {
      seed = n;
      currentDistance = dval;
    }
  }
  const returnObj = {
    start: newStart,
    end: seed,
    distance: currentDistance,
  };
  return returnObj;
}

// Select a subrgaph
async function SelectSubgraph(graph, nodeList) {
  const prunedVertices = new Map();
  const prunedEdges = new Map();
  // set the prunded vertices list
  nodeList.forEach((element) => {
    // get the element from the graph and set that
    // data element in the  prunded vertices map
    const ndata = graph.nodes.get(element);
    prunedVertices.set(element, ndata);
  });

  // set the pruned edges list
  let i = 0;
  for (const edge of graph.edges.keys()) {
    const edgeData = graph.edges.get(edge);
    if (nodeList.includes(edgeData.start) && nodeList.includes(edgeData.end)) {
      prunedEdges.set(i, edgeData);
      i += 1;
    }
  }

  // construct a new graph that represents the new graph
  const newGraph = await Graph.create(prunedVertices, prunedEdges);
  return newGraph;
}

// this is where the exports happen
export default { GraphDiameter, Dijkstra, BFSSearch, SelectSubgraph };
