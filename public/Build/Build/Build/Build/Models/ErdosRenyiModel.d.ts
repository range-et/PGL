import { default as Graph } from '../Core/Graph';
/**
 * The G ( n , p ) G(n,p) model, a graph is constructed by connecting labeled nodes randomly. Each edge is included in the graph with probability p p, independently from every other edge.
 * https://en.wikipedia.org/wiki/Erd%C5%91s%E2%80%93R%C3%A9nyi_model
 * @param n Number of nodes
 * @param p Probability of two edges to eb connected
 * @returns A Erdos Reyni graph
 */
declare function GenerateErdosReyni_n_p(n: number, p: number): Promise<Graph>;
declare const _default: {
    GenerateErdosReyni_n_p: typeof GenerateErdosReyni_n_p;
};
export default _default;
