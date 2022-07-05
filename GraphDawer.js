import * as THREE from "./node_modules/three/build/three.module.js";
import * as PGLWrapper from "./ThreeJSDrawer.js";

// this is the 3d graph drawing class with three js
class GraphDrawer3d {
  constructor(GraphDrawerOptions3d) {
    this.camera;
    this.scene;
    this.geometryMap = new Map();
    this.materialMap = new Map();
    this.meshMap = new Map();
    this.renderer;
    this.width = GraphDrawerOptions3d.width;
    this.height = GraphDrawerOptions3d.height;
    this.container = GraphDrawerOptions3d.container;
    // bounds is a global parameter that we change (think about this as scale)
    this.bound = 1;
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
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x00000, 0);
    this.container.appendChild(this.renderer.domElement);

    // set up the camera stuff
    this.camera.position.set(0, 0, 0);

    // add in a light
    this.scene.add(new THREE.AmbientLight(0xffffff));

    // add in a cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    console.log(this.scene);
    

    // finally print out that the initialization has finished
    const t2 = performance.now();
    console.log("initialization has finished");
    console.log(`Time to initialize ${t2 - t1} milliseconds`);
  }

  // this stuff renders out one specific instances
  rendercall() {
    // this is the render draw call on the raycast
  }
}


export {
    GraphDrawer3d,

}