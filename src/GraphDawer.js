import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as PGLTHREEWrapper from "./ThreeJSDrawer.js";

// this is the 3d graph drawing class with three js
class GraphDrawer3d {
  constructor(GraphDrawerOptions3d, graphs) {
    this.canvas = GraphDrawerOptions3d.canvas;
    this.width = GraphDrawerOptions3d.width;
    this.height = GraphDrawerOptions3d.height;
    this.geometryMap = new Map();
    this.materialMap = new Map();
    this.meshMap = new Map();
    this.controls;
    this.renderer;
    this.camera;
    this.scene;
    // bounds is a global parameter that we change (think about this as scale)
    this.bound = GraphDrawerOptions3d.bounds;
    // graph map is the hash map that holds all the
    // graphs that we are working with together
    this.graphs = new Map();
    // add the default graph to the graph map
    for (let i = 0; i < graphs.length; i++) {
      const g = graphs[i];
      this.graphs.set(i, g)
    }
  }

  async init() {
    const t1 = performance.now();

    this.camera = new THREE.PerspectiveCamera();

    // start up a new scene
    this.scene = new THREE.Scene();

    // set up a renderer
    this.renderer = new THREE.WebGLRenderer({canvas:this.canvas, antialias:true});
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
    this.camera.enableDamping = true;
    this.controls.maxDistance = 1000;
    this.controls.minDistance = 10;
    this.controls.update();

    // add in the graph that we wanted this.graphs.get('ProvidedGraph')
    for (const graph of this.graphs.keys()) {
      const GeoGraph = PGLTHREEWrapper.DrawTHREEBoxBasedVertices(this.graphs.get(graph), this.bound);
      this.scene.add(GeoGraph);
      const ThickEdges = PGLTHREEWrapper.DrawTHREEGraphEdgesThick(this.graphs.get(graph), this.bound);
      this.scene.add(ThickEdges);
    }

    // edges 


    // finally print out that the initialization has finished
    const t2 = performance.now();
    console.log("initialization has finished");
    console.log(`Time to initialize ${t2 - t1} milliseconds`);
  }

  // this stuff renders out one specific instances
  rendercall() {
    // this is the render draw call
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
  }
}


export {
    GraphDrawer3d,

}