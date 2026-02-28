import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Graph from "../Core/Graph";

// interface for the graph drawing class
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
class GraphDrawer3d {
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
  }) {
    this.canvas = GraphDrawerOptions3d.canvas;
    this.width = GraphDrawerOptions3d.width;
    this.height = GraphDrawerOptions3d.height;
    // these maps are optional
    // ive kepth them in as a way of managing all the
    // geometry in the scene
    this.geometryMap = new Map();
    this.materialMap = new Map();
    this.meshMap = new Map();
    this.controls;
    this.renderer;
    this.camera;
    this.scene;
    // graph map is the hash map that holds all the
    // graphs that we are working with together
    this.graphs = new Map();
  }

  /**
   * This essentially initializes the drawing element based on the settings
   * Remember to do this since if if its not done the scene will not render
   */
  async init() {
    const t1 = performance.now();

    this.camera = new THREE.PerspectiveCamera();

    // start up a new scene
    this.scene = new THREE.Scene();

    // set up a renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xff00ff, 0);

    // add in a light
    this.scene.add(new THREE.AmbientLight(0xffffff));
    // add a spotlight
    const DirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
    DirectionalLight.position.set(0, 10, 0);
    this.scene.add(DirectionalLight);

    // set up the control system
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(0, 100, 100);
    this.controls.autoRotate = true;
    this.controls.maxPolarAngle = Math.PI * 0.5;
    this.controls.maxDistance = 10000;
    this.controls.minDistance = 10;
    this.controls.update();

    // finally print out that the initialization has finished
    const t2 = performance.now();
    console.log("initialization has finished");
    console.log(`Time to initialize ${t2 - t1} milliseconds`);
  }

  //add graph
  // this adds a graph to the current visualizer
  /**
   * 
   * This is the main way to add elements to the viewer window that gets initialized
   * 
   * @param element A geometry element (THREE.Group, Line, or Points) to add to the scene
   */
  addVisElement(element: THREE.Group | THREE.Line | THREE.Points) {
    this.scene.add(element);
  }

  // this stuff renders out one specific instances
  /**
   * This is the render call that is called every frame to update the rendering of the canvas
   * Remember to do this since this is a common are for bugs to occur
   */
  rendercall() {
    // this is the render draw call
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
  }
}

export { GraphDrawer3d };
export default {
  GraphDrawer3d,
};
