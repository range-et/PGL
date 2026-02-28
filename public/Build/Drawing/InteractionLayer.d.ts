import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { default as Graph } from '../Core/Graph';
import { default as Point, PointLike } from '../HelperClasses/Point';
/**
 * Opt-in interaction layer for PGL: node and edge picking via Three.js Raycaster.
 * Callbacks receive graph details (node data, neighbours, edge endpoints).
 * 100% opt-in — no interaction unless enableInteraction() is called.
 */
import * as THREE from "three";
/** Details passed to node click/hover callbacks */
export interface NodePickDetails {
    nodeId: number;
    data: unknown;
    neighbours: number[];
    position?: Point;
}
/** Details passed to edge click/hover callbacks */
export interface EdgePickDetails {
    edgeId: number;
    start: number;
    end: number;
    data: unknown;
}
/**
 * Options for GraphDrawer3d.enableInteraction.
 * Requires `graph`; all callbacks are optional.
 */
export interface InteractionOptions {
    /** Graph used to look up node/edge details for callbacks. */
    graph: Graph;
    /** Fired when a node is clicked. */
    onNodeClick?: (details: NodePickDetails) => void;
    /** Fired when an edge is clicked. */
    onEdgeClick?: (details: EdgePickDetails) => void;
    /** Fired when pointer enters/leaves a node. Receives `null` when leaving. */
    onNodeHover?: (details: NodePickDetails | null) => void;
    /** Fired when pointer enters/leaves an edge. Receives `null` when leaving. */
    onEdgeHover?: (details: EdgePickDetails | null) => void;
    /** Default true. Set false to disable hover callbacks. */
    hoverEnabled?: boolean;
    /** Enable drag-to-reposition for nodes (use with box/instanced vertices). Disables OrbitControls during drag. */
    enableNodeDrag?: boolean;
    /** Called each pointer move while dragging. Update graph position and call updatePositions()/updateEdges() for mutable geometry. */
    onNodeDrag?: (nodeId: number, newPosition: PointLike) => void;
    /** OrbitControls to disable during drag (prevents camera orbit while moving nodes). Auto-passed by GraphDrawer if omitted. */
    controls?: OrbitControls;
}
export declare class InteractionLayer {
    private scene;
    private camera;
    private domElement;
    private graph;
    private options;
    private raycaster;
    private mouse;
    private hoverEnabled;
    private lastHoverNodeId;
    private lastHoverEdgeId;
    private dragNodeId;
    private wasDragging;
    private controls;
    private boundOnClick;
    private boundOnPointerMove;
    private boundOnPointerDown;
    private boundOnPointerUp;
    constructor(scene: THREE.Scene, camera: THREE.Camera, domElement: HTMLElement, graph: Graph, options: InteractionOptions);
    dispose(): void;
    private getMouseNDC;
    private pick;
    private onClick;
    private onPointerDown;
    private onPointerUp;
    private getDragPosition;
    private onPointerMove;
    private fireHoverCallbacks;
}
