# PGL
The Plebian Graph Library (PGL) is a library designed to facilitate the visualization of large-scale network data (Network X line plotting in Javascript). Leveraging the power of WebGL, PGL offers an efficient and interactive solution for visualizing network data in web browsers. Whether dealing with local datasets or data retrieved from APIs, PGL provides a versatile platform for conducting extensive network simulations, physical modeling, and immersive visualizations. With a rich set of features including graph condensation based on selected criteria, randomized edge pruning in highly connected graphs, and support for diverse visualization techniques like network diffusions and Kamada Kawai layouts, and edge bundling, PGL empowers users to gain valuable insights from complex network structures.

## Semantics of the Package 
Existing network visualisation libraries like NetworkX dictated the semantics of the graph library and borrowed some of the semantic ideas from three JS. The process is to define a Graph Object made of nodes and edges. Then modify this graph based on some set of properties. Then update the relevant settings. And lastly, to visualise the nodes, either as point clouds, boxes or cylinders, and to draw out the edges (bundled or not) lines.
Here is an illustrated walkthrough of a simple set-up given a predefined set of “nodes” and “edges”.
```
// import the library here the file is located under build
import * as PGL from "../Build/pgl_module.js";

// construct a simple ZKC graph this data thats baked into the library
const zkcSimulated = await PGL.SampleData.LoadZKCSimulated();

// set the width and height of the window displaying this
const width = 800;
const heigth = 700;
// pass in the graph and the canvas into the drawing object to draw it
// first get the canvas element
const canvas = document.getElementById("displayCanvas");
// then create a graph drawer object
// to do that first make a options object
const graphDrawerOptions = {
  graph: zkcSimulated,
  width: width,
  height: heigth,
  canvas: canvas,
  bounds: 1, // bounds is a global override to scale the graph
};
// then create that graph
const graph3d = new PGL.GraphDrawer.GraphDrawer3d(graphDrawerOptions, [zkcSimulated]);
// then there are two last steps for a 3d graph
// this is done so that other 3d objects can be added in later
// since the base library is three.js all standard three js things are possible
// now moving on to the two steps :
// make an animation function
function animate() {
  requestAnimationFrame(animate);
  graph3d.rendercall();
}

// initializing it
await graph3d.init();

// append the graph renderer to the container
// and then drawing render calls
animate();
```

## An example of rendering a basic graph

## Usage
// package to yet be distributed to npm but expect it shortly
in the meantime - just download the build, put it in as a module and start using it! 
ideally at some point:
```
npm install PGL
```

## Integrations
The Plebian Graph Library (PGL) is intricately woven into the fabric of the ThreeJS library, seamlessly integrating its rich functionalities into a comprehensive and powerful toolset for large-scale graph data visualization. By leveraging the foundation provided by ThreeJS, PGL inherits a wide range of features, including advanced shading techniques, texture mapping capabilities, and much more. These powerful rendering capabilities enable PGL to create visually stunning and immersive graph visualizations, adding depth and realism to the representation of complex network structures. With its symbiotic relationship with ThreeJS, PGL empowers users to go beyond traditional graph visualizations, unlocking a world of possibilities for exploration and analysis.

## Larger example 

## Other notes

