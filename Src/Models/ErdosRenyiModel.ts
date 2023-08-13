// This essentially generates a erdos reyni graph
// Super useful for juszt getting a random graph and studying
// graph structure. Read more https://en.wikipedia.org/wiki/Erd%C5%91s%E2%80%93R%C3%A9nyi_model

import Edge from "../Core/Edge";
import Graph from "../Core/Graph";
import _Node from "../Core/_Node";

/**
 * The G ( n , p ) G(n,p) model, a graph is constructed by connecting labeled nodes randomly. Each edge is included in the graph with probability p p, independently from every other edge.
 * https://en.wikipedia.org/wiki/Erd%C5%91s%E2%80%93R%C3%A9nyi_model
 * @param n Number of nodes
 * @param p Probability of two edges to eb connected
 * @returns A Erdos Reyni graph
 */
async function GenerateErdosReyni_n_p(n: number, p: number) {
  // first create a list of nodes
  const nodes = new Map();
  const edges = new Map();
  let node; // define once use many times basically
  for (let i = 0; i < n; i++) {
    node = new _Node({});
    // set this node
    nodes.set(i, node);
  }
  // now that all the nodes have been created
  // now loop all the node combinations and then
  // create the edge
  let interimP;
  let edge;
  let index = 0;
  for (let i = 0; i < n; i++) {
    for (let ii = 0; ii < n; ii++) {
      // im skipping self loops so just make sure there is
      // an if statement for the settings
      if (i != ii) {
        interimP = Math.random();
        if (p > interimP) {
          // then create and edge and add that edge to the list of edges
          edge = new Edge(i, ii, {});
          edges.set(index, edge);
          index += 1;
        }
      }
    }
  }
  // now create the actual graph
  const G = new Graph(nodes, edges);
  // lastly return the graph
  return G;
}

export default { GenerateErdosReyni_n_p };
