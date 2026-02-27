import { default as Point } from '../HelperClasses/Point';
import { default as Line } from '../HelperClasses/Line';
import { default as Graph } from '../Core/Graph';
/**
 * Simulates Kamada kawai for a network in 2d. 3d is not supported yet
 * Note: This is an async function as it take time for some of the large graphs
 *
 * @param Graph - The first input number
 * @param iterations - The second input number
 *  @param simulationBound - The bounds of simulation (Mostly a global number to scale the graph up or down)
 *  @param cohesionValue - How sticky the nodes are i.r. how much they cluster together
 * @returns And node map of all the nodes and their simulated positions - Please note: position maps have to to be applied to the graph!
 *
 */
declare function SimulateKamadaKawai(Graph: Graph, iterations: number, simulationBound?: number, cohesionValue?: number, repulsionValue?: number): Promise<Map<number, Point>>;
/**
 *
 * Randomly sets all the positions for a graph
 * Not really very useful but I've used it in some cases and have kept it around
 *
 *  @param Graph - The graph who's nodes you would want to reposition
 *
 * @return A position map of all the nodes and its corresponding positions
 */
declare function InstanciateRandomPositions(Graph: Graph): Map<number, Point>;
/**
 *
 * Constructs the edges as lines, Note: these are just a representation of the lines
 * they then have to be visulized using one of the Three JS Drawer functions like
 * draw a thick line or a thin line. This draws out the edges divided by some number of
 * divisions that you specify
 *
 * @param Graph - The graph whos edges are getting drawn
 * @param divDistance - How many divisions (distance) to make along the edge
 * @returns A line map - which holds a map of all the edge indices and the corresponding line representations
 */
declare function DrawEdgeLines(Graph: Graph, divDistance: number): Map<number, Line>;
/**
 *
 * Constructs the edges as lines, Note: these are just a representation of the lines
 * they then have to be visulized using one of the Three JS Drawer functions like
 * draw a thick line or a thin line - this draws them based on the number of divisions
 * you would like them to have
 * @param Graph - The graph whos edges are getting drawn
 * @param numberOfDivs - How many divisions to make along the edge
 * @returns A line map - which holds a map of all the edge indices and the corresponding line representations
 */
declare function DrawEdgeLinesDivisions(Graph: Graph, numberOfDivs: number): Map<number, Line>;
/**
 *
 * Edge bundling - this isnt as fast as the current KDE based methods - but it provides a basic  method of
 * Visualizing large edge flows. Note: This is an aysnc function as it takes a while for the edge bundling to happen
 *
 * @param LineMap - The map of edges as a line map
 * @param iterations - The number of iterations to run edge bundling
 * @param distance - A shorthand for how close together the vertices need to be before they get influnced by each other
 * @returns A line map with all the updated positions of the line (Where they are bundled together) Again - this needs to be applied to the graph!
 */
declare function DrawEdgeBundling(LineMap: Map<number, Line>, iterations: number, distance: number): Promise<Map<number, Line>>;
/**
 *
 * Displace the edges vertically, almost akin to the Deck.gl arcs
 * The displacement is done in a sin curve with the ends still touching the nodes
 * Note: This is an inplace modification of the edges
 *
 * @param LineMap - The map of edges as a line map
 * @param displacement - the amount of vertical displacement
 */
declare function DisplaceEdgeInY(LineMap: Map<number, Line>, displacement: number): Map<number, Line>;
/**
 *
 * Displace the vertices vertically based on some prameter (For example degree or modularity)
 *
 * @param Graph - the graph whos nodes have to be displaced
 * @param parameter - the prameter based on which you want to modify the
 * @param displacement - the maximum amunt of displacement, all the other values are rescaled linerly
 */
declare function DisplaceVertices(Graph: Graph, parameter: string, displacement: number): void;
/**
 *
 * Generates a hive plot for a graph, this includes the option to displace the graph vertically based on degrees and how far away each node is
 *
 * @param Graph - The graph
 * @param selectedNode - the node around which the hive plot is generated
 * @param step - If the hive should step up or down if yes then by what increments
 * @param startPosition - Starting position
 * @returns
 */
declare function HivePlot(Graph: Graph, selectedNode: number, step: number, startPosition: Point): Promise<{
    pmap: Map<any, any>;
    emap: Map<number, Line>;
}>;
/**
 * Move a graph somewhere (like the physical location) - This is an inplace movement and overwrites existing values
 *
 * @param Graph - The graph that has to be moved
 * @param dispacement - This is a point and I end up using Point and Vector interchangably. So here the xyz values from the point are used to displace the nodes
 */
declare function MoveGraph(Graph: Graph, dispacement: Point): void;
/**
 *
 *  Draw new lines from edges, and draw them based on the distance of divisions (i.e. divide the line up every 10 units) Note: This is an in place update that takes place on the graph - it overwrites the existing data.
 *
 * @param Graph - The grapht who's edges have to be updated
 * @param divDistance - The distance by which the divisions are made
 */
declare function UpdateEdgeLinesDist(Graph: Graph, divDistance: number): void;
/**
 *
 * Draw new lines from edges, and draw them based on divisions (i.e. divide the line into 10 units) Note: This is an in place update that takes place on the graph - it overwrites the existing data.

 * @param Graph - The grapht who's edges have to be updated
 * @param Divs - The number of divisions to be made
 */
declare function UpdateEdgeLinesDivs(Graph: Graph, Divs: number): void;
declare const _default: {
    SimulateKamadaKawai: typeof SimulateKamadaKawai;
    DrawEdgeLines: typeof DrawEdgeLines;
    DrawEdgeLinesDivisions: typeof DrawEdgeLinesDivisions;
    DrawEdgeBundling: typeof DrawEdgeBundling;
    HivePlot: typeof HivePlot;
    DisplaceEdgeInY: typeof DisplaceEdgeInY;
    MoveGraph: typeof MoveGraph;
    InstanciateRandomPositions: typeof InstanciateRandomPositions;
    DisplaceVertices: typeof DisplaceVertices;
    UpdateEdgeLinesDist: typeof UpdateEdgeLinesDist;
    UpdateEdgeLinesDivs: typeof UpdateEdgeLinesDivs;
};
export default _default;
