import { default as Graph } from '../Core/Graph';
import { default as Point } from '../HelperClasses/Point';
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
/** Options for enableInteraction */
export interface InteractionOptions {
    graph: Graph;
    onNodeClick?: (details: NodePickDetails) => void;
    onEdgeClick?: (details: EdgePickDetails) => void;
    onNodeHover?: (details: NodePickDetails | null) => void;
    onEdgeHover?: (details: EdgePickDetails | null) => void;
    hoverEnabled?: boolean;
}
/**
 * Interaction layer: raycasting + callbacks for node/edge picking.
 * Used internally by GraphDrawer3d.enableInteraction().
 */
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
    private boundOnClick;
    private boundOnPointerMove;
    constructor(scene: THREE.Scene, camera: THREE.Camera, domElement: HTMLElement, graph: Graph, options: InteractionOptions);
    dispose(): void;
    private getMouseNDC;
    private pick;
    private onClick;
    private onPointerMove;
    private fireHoverCallbacks;
}
