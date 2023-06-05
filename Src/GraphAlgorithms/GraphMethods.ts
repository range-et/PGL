import { Edge } from "../Core/Edge";
import { Graph } from "../Core/Graph";
import { _Node } from "../Core/_Node";

// do a BFS Search Starting from some point
// searches the whole graph and returns a map of which node
// was searched from where
// to speed this up all the nodes are actually numbers
/**
 * 
 * Performs a BFS search on a graph - Async because it takes a while on large graphs
 * 
 * @param Graph - The graph which has to be searched using the BFS algorithm
 * @param node - The node form which to start 
 * @returns - A map of which node was explored from which other node
 */
async function BFSSearch(Graph:Graph, node:number) {
  const adj = Graph.get_adjacency();
  const exploredFromMap:Map<number,number> = new Map();

  const explored:number[] = [];
  const stack:number[] = [];

  // queue the first node
  stack.push(node);
  exploredFromMap.set(node, -1);

  // search through the whole graph
  while (stack.length > 0) {
    const currentNode = stack.pop()!;
    // add this current node to the explored list
    explored.push(currentNode);
    const neighbours = adj.get(currentNode);
    for (let i = 0; i < neighbours!.length; i++) {
      const neighbour = neighbours![i];
      if (!explored.includes(neighbour)) {
        stack.push(neighbour);
        exploredFromMap.set(neighbour, currentNode);
      }
    }
  }
  // then return the explored from map
  return exploredFromMap;
}

// do a dijkstra Search Distance map
/**
 * 
 * Performs a dijkstra search on a graph
 * 
 * @param Graph - The graph on which to perform the Dijkstra search 
 * @param Node - The node from which to start
 * @returns - Map from which each one of the nodes was searched from
 */
async function Dijkstra(Graph:Graph, Node:number) {
  const adj = Graph.get_adjacency();
  const Dmap:Map<number, number> = new Map();
  // get the explored from map
  const exploredFromMap = await BFSSearch(Graph, Node);
  // then for each element in the map go through
  // contact trace where that element came from
  for (const n of adj.keys()) {
    let i = 0;
    let exploredFrom = exploredFromMap.get(n)!;
    while (exploredFrom != -1) {
      exploredFrom = exploredFromMap.get(exploredFrom)!;
      i += 1;
    }
    Dmap.set(n, i);
  }
  // now return this map
  return Dmap;
}

// This file contains basic things like
// Graph searches and stuff
// this only returns one of the diameters that is the longest 
// not all of them
/**
 * 
 * Finds the diameter of the graph
 * 
 * @param Graph 
 * @returns returns an object with a start, end - the two points of a graph and the diameter of the graph
 */
async function GraphDiameter(Graph:Graph) {
  // find the diameter of the graph
  // start Dijkstra from some random node
  let seed = Math.floor(Math.random() * Graph.nodes.size);
  let Dstart = await Dijkstra(Graph, seed);
  // iterate through all the values and then get
  // the value that is the highest amongst the others
  let currentDistance = -1;
  for (const n of Dstart.keys()) {
    const dval = Dstart.get(n)!;
    if (dval > currentDistance) {
      seed = n;
      currentDistance = dval;
    }
  }
  // then search from there to the furthest point again
  const newStart = seed;
  Dstart = await Dijkstra(Graph, seed);
  // repeat the thing
  currentDistance = -1;
  for (const n of Dstart.keys()) {
    const dval = Dstart.get(n)!;
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
// you must specify a list of nodes that you passed in
/**
 * 
 * Select a subgraph
 * 
 * @param graph - The main graph to select from
 * @param nodeList - The selection of nodes that we want to select from this graph
 * @returns A graph object that contains this subgraph
 */
async function SelectSubgraph(graph:Graph, nodeList:number[]) {
  const prunedNodes:Map<number,_Node> = new Map();
  const prunedEdges:Map<number, Edge> = new Map();
  // set the prunded vertices list
  nodeList.forEach((element) => {
    // get the element from the graph and set that
    // data element in the  prunded vertices map
    const ndata = graph.nodes.get(element)!;
    prunedNodes.set(element, ndata);
  });

  // set the pruned edges list
  let i = 0;
  for (const edge of graph.edges.keys()) {
    const edgeData = graph.edges.get(edge)!;
    if (nodeList.includes(edgeData.start) && nodeList.includes(edgeData.end)) {
      prunedEdges.set(i, edgeData);
      i += 1;
    }
  }

  // construct a new graph that represents the new graph
  const newGraph = await Graph.create(prunedNodes, prunedEdges);
  return newGraph;
}

// this is where the exports happen
export default { GraphDiameter, Dijkstra, BFSSearch, SelectSubgraph };
