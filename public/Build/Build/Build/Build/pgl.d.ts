import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
interface Point {
    x: number;
    y: number;
    z: number;
}
declare class Point {
    /**
     * Constructs a point based on the x y z values
     * @param x x value
     * @param y y value
     * @param z z value
     */
    constructor(x: number, y: number, z: number);
    /**
     * Displaces a point - note this method moves the existing point
     * @param Point - Displacement vector (used as a point)
     */
    translate(Point: Point): void;
}
interface Line {
    points: Point[];
}
declare class Line {
    /**
     * Constructs a line from an array of points
     * @param points an array of points
     */
    constructor(points: Point[]);
}
interface _Node {
    data: any;
    neighbours: number[];
}
/**
 * Node class: each node has an ID (index) and arbitrary data.
 * The data typically includes "pos" (Point) for visualization.
 */
declare class _Node {
    /**
     *
     * @param data - Data associated with the node; include "pos" (Point) for graph visuals
     */
    constructor(data: any);
}
interface Edge {
    start: number;
    end: number;
    data: any;
}
/**
 * Edge class: connects two nodes by start/end IDs; can hold optional data (e.g. "ldata" for line geometry).
 */
declare class Edge {
    /**
     *
     * Construct an edge
     *
     * @param start Start index of the edge based on the array of nodes
     * @param end End index of the edge based on the array of nodes
     * @param data - Optional data; "ldata" is reserved for line geometry used when drawing the edge
     */
    constructor(start: number, end: number, data: any);
}
export interface Graph {
    nodes: Map<number, _Node>;
    edges: Map<number, Edge>;
}
/**
 * The main graph object: contains nodes and edges that get modified with different
 * operations (layout, clustering, etc.).
 */
export class Graph {
    /**
     *
     * Construct a graph object (no initializing)
     *
     * @param nodes - Map of all the nodes associated with the graph
     * @param edges - Map of all the edges associated with the graph
     */
    constructor(nodes: Map<number, _Node>, edges: Map<number, Edge>);
    /**
     * Prints out a snapshot of data associated with this graph like how many nodes and how many edges
     */
    printData(): void;
    /**
     * Initializes the graph and constructs the node adjacency list.
     */
    initialize(): Promise<void>;
    /**
     *
     * This is the official create method to make a graph based on a set of nodes and edges
     * It also auto-initializes the graph and sets all the adjacency lists in memory.
     *
     * @param nodes - map of nodes
     * @param edges - map of edges
     * @returns
     */
    static create(nodes: Map<number, _Node>, edges: Map<number, Edge>): Promise<Graph>;
    /**
     * Constructs the adjacency associated with the graph
     */
    constructAdjacencyList(): Promise<void>;
    /**
     * Add a node to the graph.
     * @param nodeID - The node ID
     * @param data - Data associated with the node
     */
    add_node(nodeID: number, data: _Node): void;
    /**
     * Add an edge to the graph
     * @param start - Starting index of the edge
     * @param end - The end index of the edge
     * @param data - data associated with the edge
     */
    add_edge(start: number, end: number, data: any): void;
    /**
     *
     * @returns The adjacency lists associated with the graph
     */
    get_adjacency(): Map<number, number[]>;
    /**
     * Apply a position map based on some data
     * @param data - the position map that has to be applied to the graph
     */
    apply_position_map(data: Map<number, Point>): void;
    /**
     * Apply an line map to a graph
     * @param data Line data that has to be applied to the graph
     */
    apply_edge_pos_maps(data: Map<number, Line>): void;
    /**
     * get the current edge map
     * @returns The current set of edges associated with the graph
     */
    get_edge_map(): Map<number, Line>;
    /**
     * Applies all the maps to the graph
     * @param layout - Applies an object of maps associated with with a graph is made up of {pmap:(the position map), emap:{the edge map}}
     */
    apply_drawing_maps(layout: {
        pmap: Map<number, Point>;
        emap: Map<number, Line>;
    }): void;
    /**
     * Gets the position map and the edge map respectively
     * @returns The position map and the edge map as pmap and emap
     */
    get_map(): {
        pmap: Map<number, Point>;
        emap: Map<number, Line>;
    };
    /**
     * Get the position of the nodes in the graph.
     * @returns The position map (node ID to Point)
     */
    get_position_map(): Map<number, Point>;
}
/**
 *
 * Performs a BFS search on a graph - Async because it takes a while on large graphs
 *
 * @param Graph - The graph which has to be searched using the BFS algorithm
 * @param node - The node form which to start
 * @returns - A map of which node was explored from which other node
 */
declare function BFSSearch(Graph: Graph, node: number): Promise<Map<number, number>>;
/**
 *
 * Performs a dijkstra search on a graph
 *
 * @param Graph - The graph on which to perform the Dijkstra search
 * @param Node - The node from which to start
 * @returns - Map from which each one of the nodes was searched from
 */
declare function Dijkstra(Graph: Graph, Node: number): Promise<Map<number, number>>;
/**
 *
 * Finds the diameter of the graph
 *
 * @param Graph
 * @returns returns an object with a start, end - the two points of a graph and the diameter of the graph
 */
declare function GraphDiameter(Graph: Graph): Promise<{
    start: number;
    end: number;
    distance: number;
}>;
/**
 *
 * Select a subgraph
 *
 * @param graph - The main graph to select from
 * @param nodeList - The selection of nodes that we want to select from this graph
 * @returns A graph object that contains this subgraph
 */
declare function SelectSubgraph(graph: Graph, nodeList: number[]): Promise<Graph>;
export const GraphMethods: {
    GraphDiameter: typeof GraphDiameter;
    Dijkstra: typeof Dijkstra;
    BFSSearch: typeof BFSSearch;
    SelectSubgraph: typeof SelectSubgraph;
};
/**
 * construct a graph based on an edge list and node list
 * @param nodes nodes as a list
 * @param edges edges as a list
 * @returns A graph that was construct from the list of nodes and edges
 */
declare function ConstructGraphNodeEdgesList(nodes: any[], edges: any[]): Promise<Graph>;
export const Constructors: {
    ConstructGraphNodeEdgesList: typeof ConstructGraphNodeEdgesList;
};
/**
 * calculate the average of an array of numberss
 * @param arr an array of number whose average has to be calculated
 * @returns the average
 */
declare function calculateAverage(arr: number[]): number;
/**
 * Calculate the distance betweeen two points
 * @param p1 the first point
 * @param p2 the second point
 * @returns the distance between the points
 */
declare function calculateDistance(p1: Point, p2: Point): number;
/**
 * Calculate the squared distance between two points
 * @param p1 the first point
 * @param p2 the second point
 * @returns the squared distance between the two points
 */
declare function calculateSquaredDistance(p1: Point, p2: Point): number;
/**
 * get a random subset of something from a array of things must provide the number of things we want from that array
 * @param arr the array from which the subset has to be made
 * @param n number of items to select
 * @returns a new array made up of a random sample from the original array
 */
declare function getRandomSubset(arr: any[], n: number): any[];
/**
 * This is a super useful method to get a random number of edges or something that you would like to draw
 * this is primarily done because there are way too many edges sometimes and and the number of edges is really
 * What slows the whole rendering process down
 * @param map - the map that youd like to reduce
 * @param n - the fraction of items that youd like to return from this map
 * @returns A reduced map with a fractio of those many entries
 */
declare function getRandomSubset_map(map: Map<number, any>, n: number): Map<any, any>;
export const Utilities: {
    calculateAverage: typeof calculateAverage;
    calculateDistance: typeof calculateDistance;
    calculateSquaredDistance: typeof calculateSquaredDistance;
    getRandomSubset: typeof getRandomSubset;
    getRandomSubset_map: typeof getRandomSubset_map;
};
/**
 * Creates a line based on the number of divisons
 *
 * @param start the start point
 * @param end the end point
 * @param divisions the number of divisions
 * @returns the line object
 */
declare function line_from_start_end_divisions(start: Point, end: Point, divisions: number): Line;
/**
 * Divides the line into a number of divisions based on distance
 * @param start - the start point
 * @param end - the end point
 * @param distance - the distance at which this line must be divided
 * @returns A line object with the right number of points
 */
declare function line_from_start_end_distance(start: Point, end: Point, distance: number): Line;
/**
 * Calculates the centroid of an array of points
 * @param points An array of points
 * @returns the central point of the array of points
 */
declare function centroid(points: Point[]): Point;
export const Geometry: {
    line_from_start_end_divisions: typeof line_from_start_end_divisions;
    line_from_start_end_distance: typeof line_from_start_end_distance;
    centroid: typeof centroid;
};
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
export const Drawing: {
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
/**
 *
 * @returns the raw ZKC dataset
 */
declare function LoadZKC(): Promise<Graph>;
/**
 *
 * @returns the ZKC dataset with the positons simulated before hand
 */
declare function LoadZKCSimulated(): Promise<Graph>;
export const SampleData: {
    LoadZKC: typeof LoadZKC;
    LoadZKCSimulated: typeof LoadZKCSimulated;
};
/**
 *
 * Draw the veritces of the graph out as a point cloud
 *
 * @param Graph - the graph that has to be drawn out
 * @param bounds - A global scaling parameter defaults to 1 but change to scale up a garph
 * @param size - The size of all the nodes - either input an array the same length of the number of nodes decribing how big each node is, or a global node value as a number or defaults to 1
 * @param color - the color of the node defaults to white
 * @param alpha - the alpha value of the node defaults to 1 (opaque)
 * @returns a three JS group that contains all the vertices as a point cloud or a three js points object that can be added to the scene
 */
declare function DrawTHREEGraphVertices(Graph: Graph, bounds?: number, size?: number | number[], color?: number, alpha?: number): THREE.Group<THREE.Object3DEventMap>;
/**
 *
 * Draws out all the edges (Thick edges of a graph)
 *
 * @param Graph - The graph whose edges have to be drawn
 * @param bounds - the global scale for all the edges to be drawn defaults to 1
 * @param color - color of the edges defaults to white
 * @param thickness - thickness of the edges (defaults to 0.4; screen-space pixels ≈ thickness × 100 for values &lt; 1)
 * @returns a Three Js group of edges that can be added to the scene
 */
declare function DrawTHREEGraphEdgesThick(Graph: Graph, bounds?: number, color?: number, thickness?: number): THREE.Group<THREE.Object3DEventMap>;
/**
 *
 * Draw thick edges from an edge map
 *
 * @param EdgeMap - The edge map associated with the graph
 * @param bounds - The global scale of the graph - defaults to 1
 * @param color - The color of the edges - defaults to white
 * @param thickness - thickness of the edges (defaults to 0.4; pixels ≈ thickness × 100 for values &lt; 1)
 * @returns
 */
declare function DrawThickEdgesFromEdgeMap(EdgeMap: Map<number, Line>, bounds: number, color?: number, thickness?: number): THREE.Group<THREE.Object3DEventMap>;
/**
 *
 * Draw thin lines for all the edges given a graph
 *
 * @param Graph - The graph that has to be drawn
 * @param bounds - The global scale factor for the the edges - defaults to 1
 * @param color - color of the lines - defaults to white
 * @returns
 */
declare function DrawTHREEGraphEdgesThin(Graph: Graph, bounds?: number, color?: number): THREE.Group<THREE.Object3DEventMap>;
/**
 * Draw a single thick line through an ordered list of node IDs (e.g. a path).
 * Uses graph positions; line width in pixels (pass thickness >= 1 for pixel width).
 *
 * @param Graph - Graph with position map
 * @param bounds - Scale factor for positions
 * @param pathNodeIds - Ordered node IDs (start to end)
 * @param color - Hex color for the path line
 * @param thickness - Line width in pixels (e.g. 5 for a thick path)
 */
declare function DrawThickPathFromNodeIds(Graph: Graph, bounds: number, pathNodeIds: number[], color?: number, thickness?: number): THREE.Group<THREE.Object3DEventMap>;
/**
 *
 * Draw Line map as lines given the edge map assocaited with the graph
 *
 * @param LineMap - The edge map that has to be drawn out
 * @param bounds - Global scale for the edges to be drawn defaults to 1
 * @param color - Color of the edges defaults to 1
 * @returns
 */
declare function DrawThinEdgesFromEdgeMap(LineMap: Map<number, Line>, bounds?: number, color?: number): THREE.Group<THREE.Object3DEventMap>;
/**
 *
 * Adde boxes where all the boxes are
 *
 * @param nodeMap - a map of all the nodes
 * @param bounds - global scale of the edges to be drawn, defaults to 1
 * @param color - default color of the edges, defaults to white
 * @param size - size of the nodes defaults to 10
 * @returns a group of vertices that contains all of the boxes associated with each one of the vertices
 */
declare function AddBoxBasedImaging(nodeMap: Map<number, Point>, bounds?: number, color?: number, size?: number | number[]): THREE.Group<THREE.Object3DEventMap>;
/**
 *
 * Draw box based verices given a graph
 *
 * @param Graph - The graph that needs its vertices drawn
 * @param bounds - A global scale for the graph, defaults to one
 * @param color - Default color of the boxes defaults to white
 * @param size - Default size of the nodes defaults to 10
 * @returns
 */
declare function DrawTHREEBoxBasedVertices(Graph: Graph, bounds?: number, color?: number, size?: number | number[]): THREE.Group<THREE.Object3DEventMap>;
/**
 *
 * Draw cylinders where all the vertices are based on a node map
 *
 * @param nodeMap - the node map assiciate with the graph that has to be drawn out
 * @param divisonLength - the length of the divisions that are there in each one of the cylinder (this is a circumfurence amount), defaults to 16
 * @param color - the default color of the cylinder, defaults to white
 * @param size - the default size of the cylinder, defaults to 10
 * @returns
 */
declare function AddCylinderBasedImaging(nodeMap: Map<number, Point>, divisonLength?: number, color?: number, size?: number | number[]): THREE.Group<THREE.Object3DEventMap>;
/**
 *
 * Split up a graph and return an boject containing a bunch of node groups and edge groups based on some parameterS
 *
 * @param Graph - the graph that you want to split up
 * @param propertyName - the property that you want to split them on
 * @returns - an object that hasa set of node vertices and a set of edge lines based on the splitting factor
 */
declare function AddInModularityBasedPointGroups(Graph: Graph, propertyName: string): Promise<{
    nodeGroups: Map<number, THREE.Group<THREE.Object3DEventMap>>;
    EdgeGroups: Map<number, THREE.Group<THREE.Object3DEventMap>>;
}>;
/**
 *
 * Draw simplified line edges (thin based) based on some number. This number is a fraction of the total number of edges (so if you specify 0.1 it would draw 10% of the edges)
 *
 * @param Graph - The graph that has to be drawn out
 * @param amount - The fraction of edges to be drawn
 * @param color - color of these edges - defaults to 0.1
 * @returns - a group of simple lines based on all the edges supplied to it
 */
declare function DrawSimplifiedEdges(Graph: Graph, amount: number, color?: number): THREE.Group<THREE.Object3DEventMap>;
/**
 * Set vertex colors by node ID. Uses the geometry's "label" attribute (node ID per vertex) to map node IDs to vertex indices; if "label" is missing, indexArray is treated as vertex indices.
 *
 * @param vertices - THREE.Points with customColor (and optionally label) attribute, or a Group whose first child is that Points object
 * @param indexArray - Node IDs to color, or vertex indices if geometry has no label attribute
 * @param color - Hex color to apply
 */
declare function ChangeTheVertexColours(vertices: THREE.Points | THREE.Group, indexArray: number[], color: number): void;
/**
 * Reset all vertex colors to white.
 * @param vertices - THREE.Points with customColor attribute, or a Group whose first child is that Points object
 */
declare function ResetVertexColors(vertices: THREE.Points | THREE.Group): void;
export const ThreeWrapper: {
    DrawTHREEGraphVertices: typeof DrawTHREEGraphVertices;
    DrawTHREEGraphEdgesThick: typeof DrawTHREEGraphEdgesThick;
    DrawTHREEGraphEdgesThin: typeof DrawTHREEGraphEdgesThin;
    DrawThickPathFromNodeIds: typeof DrawThickPathFromNodeIds;
    AddBoxBasedImaging: typeof AddBoxBasedImaging;
    AddInModularityBasedPointGroups: typeof AddInModularityBasedPointGroups;
    DrawThinEdgesFromEdgeMap: typeof DrawThinEdgesFromEdgeMap;
    DrawThickEdgesFromEdgeMap: typeof DrawThickEdgesFromEdgeMap;
    AddCylinderBasedImaging: typeof AddCylinderBasedImaging;
    DrawSimplifiedEdges: typeof DrawSimplifiedEdges;
    ChangeTheVertexColours: typeof ChangeTheVertexColours;
    ResetVertexColors: typeof ResetVertexColors;
    DrawTHREEBoxBasedVertices: typeof DrawTHREEBoxBasedVertices;
};
interface GraphDrawer3d {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    geometryMap: Map<any, any>;
    materialMap: Map<any, any>;
    meshMap: Map<any, any>;
    controls: OrbitControls;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    graphs: Map<number, Graph>;
}
/**
 * This is the main graph drawer class
 */
declare class GraphDrawer3d {
    /**
     * To initialize the graph drawer there are a set of graph drawing settings that have to be set.
     * Here are the details to do the same:
     * canvas - the html canvas element that you would like to render
     * height - the the height of the initialized canvas
     * width - the width of the initialized canvas
     * geometry map - a map that keeps track of all the geometry in the scene (Optional)
     * material map - a mapt that keeps track of all the materials in the scene (Optional)
     * controls - Controls that define how one can navigate this 3d space (Self initialized)
     * renderer - Renderer element form the three JS library
     * camera -  A perspective camera from the threeJS library
     * scene - The three JS scene that gets define automatically
     *
     * @param GraphDrawerOptions3d - These above options are construdeted into a single object and passed into the Options elem
     */
    constructor(GraphDrawerOptions3d: {
        canvas: HTMLCanvasElement;
        width: number;
        height: number;
        geometryMap: Map<any, any>;
        materialMap: Map<any, any>;
        meshMap: Map<any, any>;
        controls: OrbitControls;
        renderer: THREE.WebGLRenderer;
        camera: THREE.PerspectiveCamera;
        scene: THREE.Scene;
    });
    /**
     * This essentially initializes the drawing element based on the settings
     * Remember to do this since if if its not done the scene will not render
     */
    init(): Promise<void>;
    /**
     *
     * This is the main way to add elements to the viewer window that gets initialized
     *
     * @param element A geomerty element + material element to add to the scene as a group line or point cloud
     */
    addVisElement(element: THREE.Group | THREE.Line | THREE.Points): void;
    /**
     * This is the render call that is called every frame to update the rendering of the canvas
     * Remember to do this since this is a common are for bugs to occur
     */
    rendercall(): void;
}
export const GraphDrawer: {
    GraphDrawer3d: typeof GraphDrawer3d;
};
/**
 * The G ( n , p ) G(n,p) model, a graph is constructed by connecting labeled nodes randomly. Each edge is included in the graph with probability p p, independently from every other edge.
 * https://en.wikipedia.org/wiki/Erd%C5%91s%E2%80%93R%C3%A9nyi_model
 * @param n Number of nodes
 * @param p Probability of two edges to eb connected
 * @returns A Erdos Reyni graph
 */
declare function GenerateErdosReyni_n_p(n: number, p: number): Promise<Graph>;
export const Models: {
    GenerateErdosReyni_n_p: typeof GenerateErdosReyni_n_p;
};
/**
 * Options for distance-based clustering.
 */
interface ClusterByDistanceOptions {
    /** Maximum distance between two nodes for them to be in the same cluster. */
    distanceThreshold: number;
}
/**
 * Result of a clustering step: maps each node ID to its cluster ID.
 */
interface ClusterResult {
    /** Map from original node ID to cluster ID (integer). */
    nodeToCluster: Map<number, number>;
    /** Map from cluster ID to centroid position (e.g. for super-node placement). */
    clusterCentroids: Map<number, Point>;
    /** List of unique cluster IDs. */
    clusterIds: number[];
}
/**
 * Strategy interface for hierarchical node combining.
 * Implementations (e.g. KD-tree distance-based, or future class-based) produce a clustering.
 */
interface ClusterStrategy {
    /**
     * Compute clustering of graph nodes.
     * @param graph - The graph to cluster
     * @param options - Strategy-specific options
     * @returns Assignment of each node to a cluster and cluster centroids
     */
    cluster(graph: Graph, options: Record<string, unknown>): ClusterResult;
}
/**
 * Cluster the graph by distance (KD-tree based) and return a simplified graph.
 * Nodes within `distanceThreshold` are merged; super-nodes are placed at cluster centroids.
 *
 * @param graph - The graph to cluster
 * @param options - { distanceThreshold: number }
 * @returns A new graph with one node per cluster and aggregated edges between clusters
 */
declare function clusterByDistance(graph: Graph, options: ClusterByDistanceOptions): Promise<Graph>;
/**
 * Cluster the graph using a custom strategy and return a simplified graph.
 *
 * @param graph - The graph to cluster
 * @param strategy - A ClusterStrategy implementation
 * @param options - Strategy-specific options
 * @returns A new graph with one node per cluster and aggregated edges
 */
declare function clusterByStrategy(graph: Graph, strategy: ClusterStrategy, options: Record<string, unknown>): Promise<Graph>;
export const Hierarchy: {
    clusterByDistance: typeof clusterByDistance;
    clusterByStrategy: typeof clusterByStrategy;
};

//# sourceMappingURL=pgl.d.ts.map
