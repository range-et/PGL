import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { default as Graph } from '../Core/Graph';
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
declare const _default: {
    GraphDrawer3d: typeof GraphDrawer3d;
};
export default _default;
