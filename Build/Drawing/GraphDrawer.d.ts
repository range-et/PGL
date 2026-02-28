import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { default as Graph } from '../Core/Graph';
import { InteractionLayer, InteractionOptions } from './InteractionLayer';
import * as THREE from "three";
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
    interactionLayer?: InteractionLayer;
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
     * @param GraphDrawerOptions3d - These options are constructed into a single object and passed in
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
     * @param element A geometry element (THREE.Group, Line, or Points) to add to the scene
     */
    addVisElement(element: THREE.Group | THREE.Line | THREE.Points): void;
    /**
     * This is the render call that is called every frame to update the rendering of the canvas
     * Remember to do this since this is a common are for bugs to occur
     */
    rendercall(): void;
    /**
     * Enable opt-in interaction: node and edge picking via click/hover, and optional drag-to-reposition.
     * Callbacks receive graph details (node data, neighbours, edge endpoints).
     *
     * @param options - Interaction options. Must include `graph`. Optional:
     *   - `onNodeClick`, `onEdgeClick` — click callbacks
     *   - `onNodeHover`, `onEdgeHover` — hover callbacks (receive `null` when leaving)
     *   - `hoverEnabled` — default true; set false to disable hover
     *   - `enableNodeDrag` — enable drag-to-reposition (use with mutable vertices/edges)
     *   - `onNodeDrag(nodeId, newPosition)` — called each pointer move while dragging
     *   - `controls` — OrbitControls to disable during drag (auto-passed if omitted)
     */
    enableInteraction(options: InteractionOptions): void;
    /**
     * Disable interaction and remove event listeners.
     */
    disableInteraction(): void;
}
export { GraphDrawer3d };
declare const _default: {
    GraphDrawer3d: typeof GraphDrawer3d;
};
export default _default;
