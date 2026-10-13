/**
 * Graph algorithms: BFS, shortest paths (hop count), diameter, subgraph selection.
 *
 * @packageDocumentation
 *
 * **Note:** `Dijkstra` returns hop-count distances via BFS — it does not support weighted edges.
 * For unweighted graphs this is equivalent to shortest path.
 */
import Edge from "../Core/Edge";
import Graph from "../Core/Graph";
import _Node from "../Core/_Node";

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

  const explored = new Set<number>([node]);
  const queue: number[] = [node];
  exploredFromMap.set(node, -1);

  // head index instead of queue.shift(), which is O(n) per call
  for (let head = 0; head < queue.length; head++) {
    const currentNode = queue[head];
    const neighbours = adj.get(currentNode) ?? [];
    for (let i = 0; i < neighbours.length; i++) {
      const neighbour = neighbours[i];
      // edges may reference IDs that are not nodes in the graph; skip those
      if (!explored.has(neighbour) && adj.has(neighbour)) {
        explored.add(neighbour);
        queue.push(neighbour);
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
  const exploredFromMap = await BFSSearch(Graph, Node);
  // The map is in BFS order, so each node's parent already has its distance.
  const depth = new Map<number, number>();
  for (const [n, parent] of exploredFromMap) {
    depth.set(n, parent === -1 ? 0 : depth.get(parent)! + 1);
  }
  // Return in node order; unreachable (disconnected) nodes are left out.
  const Dmap:Map<number, number> = new Map();
  for (const n of Graph.nodes.keys()) {
    const d = depth.get(n);
    if (d !== undefined) Dmap.set(n, d);
  }
  return Dmap;
}

// This file contains basic things like
// Graph searches and stuff
// this only returns one of the diameters that is the longest 
// not all of them
/**
 *
 * Estimates the diameter of the graph with a double BFS sweep (BFS from a random node, then
 * BFS from the farthest node found). The result is exact for trees and a lower bound in
 * general; on disconnected graphs it only covers the component of the random start node.
 *
 * @param Graph
 * @returns an object with start, end - the two endpoints found - and distance, their hop distance
 */
async function GraphDiameter(Graph:Graph) {
  const nodeIds = [...Graph.nodes.keys()];
  if (nodeIds.length === 0) return { start: 0, end: 0, distance: 0 };
  if (nodeIds.length === 1) return { start: nodeIds[0], end: nodeIds[0], distance: 0 };

  const adj = Graph.get_adjacency();
  const withNeighbors = nodeIds.filter((id) => (adj.get(id)?.length ?? 0) > 0);
  const pickFrom = withNeighbors.length > 0 ? withNeighbors : nodeIds;
  let seed = pickFrom[Math.floor(Math.random() * pickFrom.length)];

  let Dstart = await Dijkstra(Graph, seed);
  let currentDistance = -1;
  for (const n of Dstart.keys()) {
    const dval = Dstart.get(n)!;
    if (dval > currentDistance) {
      seed = n;
      currentDistance = dval;
    }
  }
  const newStart = seed;
  Dstart = await Dijkstra(Graph, seed);
  currentDistance = -1;
  for (const n of Dstart.keys()) {
    const dval = Dstart.get(n)!;
    if (dval > currentDistance) {
      seed = n;
      currentDistance = dval;
    }
  }
  return { start: newStart, end: seed, distance: currentDistance };
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
  // New node/edge objects so building the subgraph's adjacency never touches the parent graph
  for (const id of nodeList) {
    const node = graph.nodes.get(id);
    if (node) prunedNodes.set(id, new _Node(node.data));
  }

  let i = 0;
  for (const edge of graph.edges.values()) {
    if (prunedNodes.has(edge.start) && prunedNodes.has(edge.end)) {
      prunedEdges.set(i, new Edge(edge.start, edge.end, edge.data));
      i += 1;
    }
  }

  // construct a new graph that represents the new graph
  const newGraph = await Graph.create(prunedNodes, prunedEdges);
  return newGraph;
}

// this is where the exports happen
export default { GraphDiameter, Dijkstra, BFSSearch, SelectSubgraph };
