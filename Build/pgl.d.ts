import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
interface Point {
    x: number;
    y: number;
    z: number;
}
declare class Point {
    constructor(x: number, y: number, z: number);
    translate(Point: Point): void;
}
interface Line {
    points: Point[];
}
declare class Line {
    constructor(points: Point[]);
}
interface _Node {
    data: any;
    neighbours: number[];
}
declare class _Node {
    constructor(data: any);
}
interface Edge {
    start: number;
    end: number;
    data: any;
}
declare class Edge {
    constructor(start: number, end: number, data: any);
}
export interface Graph {
    nodes: Map<number, _Node>;
    edges: Map<number, Edge>;
}
export class Graph {
    constructor(nodes: Map<number, _Node>, edges: Map<number, Edge>);
    printData(): void;
    initialize(): Promise<void>;
    static create(nodes: Map<number, _Node>, edges: Map<number, Edge>): Promise<Graph>;
    constructAdjacencyList(): Promise<void>;
    add_node(nodeID: number, data: _Node): void;
    add_edge(start: number, end: number, data: any): void;
    get_adjacency(): Map<number, number[]>;
    apply_position_map(data: Map<number, Point>): void;
    apply_edge_pos_maps(data: Map<number, Line>): void;
    get_edge_map(): Map<number, Line>;
    apply_drawing_maps(layout: {
        pmap: Map<number, Point>;
        emap: Map<number, Line>;
    }): void;
    get_map(): {
        pmap: Map<number, Point>;
        emap: Map<number, Line>;
    };
    get_position_map(): Map<number, Point>;
}
declare function BFSSearch(G: Graph, node: number): Promise<Map<number, number>>;
declare function Dijkstra(G: Graph, Node: number): Promise<Map<number, number>>;
declare function GraphDiameter(graph: Graph): Promise<{
    start: number;
    end: number;
    distance: number;
}>;
declare function SelectSubgraph(graph: Graph, nodeList: number[]): Promise<Graph>;
export const GraphMethods: {
    GraphDiameter: typeof GraphDiameter;
    Dijkstra: typeof Dijkstra;
    BFSSearch: typeof BFSSearch;
    SelectSubgraph: typeof SelectSubgraph;
};
declare function ConstructGraphNodeEdgesList(nodes: any[], edges: any[]): Promise<Graph>;
export const Constructors: {
    ConstructGraphNodeEdgesList: typeof ConstructGraphNodeEdgesList;
};
declare function calculateAverage(arr: number[]): number;
declare function calculateDistance(p1: Point, p2: Point): number;
declare function calculateSquaredDistance(p1: Point, p2: Point): number;
declare function getRandomSubset(arr: any[], n: number): any[];
export const Utilities: {
    calculateAverage: typeof calculateAverage;
    calculateDistance: typeof calculateDistance;
    calculateSquaredDistance: typeof calculateSquaredDistance;
    getRandomSubset: typeof getRandomSubset;
};
declare function line_from_start_end_divisions(start: Point, end: Point, divisions: number): Line;
declare function line_from_start_end_distance(start: Point, end: Point, distance: number): Line;
declare function centroid(points: Point[]): Point;
export const Geometry: {
    line_from_start_end_divisions: typeof line_from_start_end_divisions;
    line_from_start_end_distance: typeof line_from_start_end_distance;
    centroid: typeof centroid;
};
declare function SimulateKamadaKawai(G: Graph, iterations: number, simulationBound?: number, cohesionValue?: number): Promise<Map<number, Point>>;
declare function InstanciateRandomPositions(G: Graph): {
    pmap: Map<any, any>;
    emap: Map<number, Line>;
};
declare function DrawEdgeLines(G: Graph, divDistance: number): Map<number, Line>;
declare function DrawEdgeBundling(LineMap: Map<number, Line>, iterations: number, distance: number): Promise<Map<number, Line>>;
declare function DisplaceEdgeInY(LineMap: Map<number, Line>, displacement: number): void;
declare function DisplaceVertices(nodeMap: Map<number, _Node>, parameter: string, displacement: number): void;
declare function HivePlot(G: Graph, selectedNode: number, step: number, startP: Point): Promise<{
    pmap: Map<any, any>;
    emap: Map<number, Line>;
}>;
declare function MoveGraph(G: Graph, dispacement: Point): void;
declare function UpdateEdgeLinesDist(G: Graph, divDistance: number): void;
declare function UpdateEdgeLinesDivs(G: Graph, Divs: number): void;
export const Drawing: {
    SimulateKamadaKawai: typeof SimulateKamadaKawai;
    DrawEdgeLines: typeof DrawEdgeLines;
    DrawEdgeBundling: typeof DrawEdgeBundling;
    HivePlot: typeof HivePlot;
    DisplaceEdgeInY: typeof DisplaceEdgeInY;
    MoveGraph: typeof MoveGraph;
    InstanciateRandomPositions: typeof InstanciateRandomPositions;
    DisplaceVertices: typeof DisplaceVertices;
    UpdateEdgeLinesDist: typeof UpdateEdgeLinesDist;
    UpdateEdgeLinesDivs: typeof UpdateEdgeLinesDivs;
};
declare function LoadZKC(): Promise<Graph>;
declare function LoadZKCSimulated(): Promise<Graph>;
export const SampleData: {
    LoadZKC: typeof LoadZKC;
    LoadZKCSimulated: typeof LoadZKCSimulated;
};
declare function DrawTHREEGraphVertices(Graph: Graph, bounds: number, size?: number | number[], color?: number, alpha?: number): THREE.Group;
declare function DrawTHREEGraphEdgesThick(G: Graph, bounds: number, thickness?: number, color?: number): THREE.Group;
declare function DrawThickEdgesFromEdgeMap(emap: Map<number, Line>, bounds: number, thickness?: number, color?: number): THREE.Group;
declare function DrawTHREEGraphEdgesThin(G: Graph, bounds: number, color?: number): THREE.Group;
declare function DrawThinEdgesFromEdgeMap(emap: Map<number, Line>, bounds: number, color?: number): THREE.Group;
declare function AddBoxBasedImaging(nodeMap: Map<number, Point>, bounds: number, color?: number, size?: number | number[]): THREE.Group;
declare function DrawTHREEBoxBasedVertices(graph: Graph, bounds: number, color?: number, size?: number | number[]): THREE.Group;
declare function AddCylinderBasedImaging(nodeMap: Map<number, Point>, divisonLength: number, color?: number, size?: number | number[]): THREE.Group;
declare function AddInModularityBasedPointGroups(Graph: Graph, propertyName: string): Promise<{
    nodeGroups: Map<number, THREE.Group>;
    EdgeGroups: Map<number, THREE.Group>;
}>;
declare function DrawSimplifiedEdges(G: Graph, amount: number, color?: number): THREE.Group;
declare function ChangeTheVertexColours(vertices: THREE.Points, indexArray: number[], color: number): void;
declare function ResetVertexColors(vertices: THREE.Points): void;
export const threeDWrapper: {
    DrawTHREEGraphVertices: typeof DrawTHREEGraphVertices;
    DrawTHREEGraphEdgesThick: typeof DrawTHREEGraphEdgesThick;
    DrawTHREEGraphEdgesThin: typeof DrawTHREEGraphEdgesThin;
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
    bounds: number;
    graphs: Map<number, Graph>;
}
declare class GraphDrawer3d {
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
        bounds: number;
    }, graphs: Graph[]);
    init(): Promise<void>;
    rendercall(): void;
}
export const GraphDrawer: {
    GraphDrawer3d: typeof GraphDrawer3d;
};

//# sourceMappingURL=pgl.d.ts.map
