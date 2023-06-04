import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import PGLTHREEWrapper from "./ThreeJSDrawer";
import { Graph } from "../Core/Graph";

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

// this is the 3d graph drawing class with three js
class GraphDrawer3d {
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
    this.controls.maxDistance = 1000;
    this.controls.minDistance = 10;
    this.controls.update();

    // finally print out that the initialization has finished
    const t2 = performance.now();
    console.log("initialization has finished");
    console.log(`Time to initialize ${t2 - t1} milliseconds`);
  }

  //add graph
  // this adds a graph to the current visualizer
  addVisElement(element: THREE.Group | THREE.Line | THREE.Points) {
    this.scene.add(element);
  }

  // this stuff renders out one specific instances
  rendercall() {
    // this is the render draw call
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
  }
}

export default {
  GraphDrawer3d,
};
