import { default as Point } from '../HelperClasses/Point';
import { default as Line } from '../HelperClasses/Line';
import { default as Graph } from '../Core/Graph';
import * as THREE from "three";
/**
 * Draw the vertices of the graph as a point cloud. **Static geometry** — use for one-shot layout.
 * For time-based simulation use DrawTHREEGraphVerticesMutable and updatePositions() each frame.
 *
 * @param Graph - the graph that has to be drawn out
 * @param bounds - A global scaling parameter defaults to 1 but change to scale up a graph
 * @param size - The size of all the nodes - either an array the same length as nodes or a single number
 * @param color - the color of the node defaults to white
 * @param alpha - the alpha value of the node defaults to 1 (opaque)
 * @returns a THREE.Group containing the point cloud
 */
declare function DrawTHREEGraphVertices(Graph: Graph, bounds?: number, size?: number | number[], color?: number, alpha?: number): THREE.Group<THREE.Object3DEventMap>;
/**
 * Result of DrawTHREEGraphVerticesMutable. Use `updatePositions()` each frame with simulation positions.
 */
export interface MutableVerticesResult {
    /** THREE.Group to add to the scene */
    group: THREE.Group;
    /** Update vertex positions from Float32Array (node order) or Map&lt;nodeId, Point&gt; */
    updatePositions(positions: Float32Array | Map<number, Point>): void;
}
/**
 * **Mutable** point cloud: positions can be updated each frame. Use for time-based simulation.
 * Call updatePositions(simulation.getPositions()) (or a Map) in your animation loop.
 * Node order matches get_node_ids_order().
 */
declare function DrawTHREEGraphVerticesMutable(Graph: Graph, bounds?: number, size?: number | number[], color?: number, alpha?: number): MutableVerticesResult;
/**
 * Draws all edges as thick lines. **Static geometry** — use for one-shot layout.
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
 * Draw thin lines for all edges. **Static geometry** — use for one-shot layout.
 * For time-based simulation use DrawTHREEGraphEdgesThinMutable and updateEdges() each frame.
 *
 * @param Graph - The graph that has to be drawn
 * @param bounds - The global scale factor for the edges - defaults to 1
 * @param color - color of the lines - defaults to white
 * @returns a THREE.Group of lines
 */
declare function DrawTHREEGraphEdgesThin(Graph: Graph, bounds?: number, color?: number): THREE.Group<THREE.Object3DEventMap>;
/**
 * Result of DrawTHREEGraphEdgesThinMutable. Call `updateEdges()` after applying new positions to the graph.
 */
export interface MutableEdgesResult {
    /** THREE.Group containing the line segments */
    group: THREE.Group;
    /** Rebuild edge geometry from the graph's current position and edge maps */
    updateEdges(): void;
}
/**
 * **Mutable** thin edges: geometry is refreshed from the graph each frame. Use for time-based simulation.
 * After updating the graph's position map and edge map, call updateEdges() in your animation loop.
 */
declare function DrawTHREEGraphEdgesThinMutable(Graph: Graph, bounds?: number, color?: number): MutableEdgesResult;
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
 * Add boxes for all nodes using one InstancedMesh (efficient for 1000s of boxes).
 *
 * @param nodeMap - a map of all the nodes
 * @param bounds - global scale of the edges to be drawn, defaults to 1
 * @param color - default color of the edges, defaults to white
 * @param size - size of the nodes defaults to 10
 * @returns a group containing one InstancedMesh for all boxes
 */
declare function AddBoxBasedImaging(nodeMap: Map<number, Point>, bounds?: number, color?: number, size?: number | number[]): THREE.Group<THREE.Object3DEventMap>;
/**
 * Result of DrawTHREEBoxBasedVerticesMutable. Use `updatePositions()` each frame for simulation.
 */
export interface MutableBoxVerticesResult {
    /** THREE.Group containing the instanced box mesh */
    group: THREE.Group;
    /** Update box positions from Float32Array or Map&lt;nodeId, Point&gt; */
    updatePositions(positions: Float32Array | Map<number, Point>): void;
}
/**
 * Box-based vertices as one InstancedMesh with updatable positions (e.g. for simulation).
 * Node order matches get_node_ids_order() when called with a graph's position map.
 */
declare function DrawTHREEBoxBasedVerticesMutable(Graph: Graph, bounds?: number, color?: number, size?: number | number[]): MutableBoxVerticesResult;
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
declare const _default: {
    DrawTHREEGraphVertices: typeof DrawTHREEGraphVertices;
    DrawTHREEGraphVerticesMutable: typeof DrawTHREEGraphVerticesMutable;
    DrawTHREEGraphEdgesThick: typeof DrawTHREEGraphEdgesThick;
    DrawTHREEGraphEdgesThin: typeof DrawTHREEGraphEdgesThin;
    DrawTHREEGraphEdgesThinMutable: typeof DrawTHREEGraphEdgesThinMutable;
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
    DrawTHREEBoxBasedVerticesMutable: typeof DrawTHREEBoxBasedVerticesMutable;
};
export default _default;
