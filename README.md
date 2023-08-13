## Introduction

The Plebian Graph Library (PGL) is a library designed to facilitate the visualization of large-scale network data (Network X line plotting in Javascript/Typescript). Leveraging the power of WebGL, PGL offers an efficient and interactive solution for visualizing network data in web browsers. Whether dealing with local datasets or data retrieved from APIs, PGL provides a versatile platform for conducting extensive network simulations, physical modeling, and immersive visualizations. With a rich set of features including graph condensation based on selected criteria, randomized edge pruning in highly connected graphs, and support for diverse visualization techniques like network diffusions and Kamada Kawai layouts, and edge bundling, PGL empowers users to gain valuable insights from complex network structures.

## Notes on terminology
It can be a bit cunfusing especially when working with Nodes/Edges/Vetices/Lines in this library (Also in general in working with graphs). Hence the terminology that I've followed here is as following:
- Nodes (The libray and the class is called _Node so as to not confuse with NodeJS ) and Edges make up a graph.
- Vertices and Lines make up the 3d visualisation side of a graph. 
- Nodes are the abstract idea, vertices are what's visualized 
- Edges are the abstract idea , lines are what's visualized
Lastly there are a few helper classes like points and lines. Points are essentially vectors and are used for displacement and also for describing a place in relation to the global coordinate system. Line are an array of points that get translated into lines using one of the visualization methods. Points can have different visualisations like boxes, billboarded planes and cylinders etc.

## Semantics of the Package

Existing network visualisation libraries like NetworkX dictated the semantics of the graph library and borrowed some of the semantic ideas from three JS. The process is to define a Graph Object made of nodes and edges. Then modify this graph based on some set of properties. Then update the relevant settings. And lastly, to visualise the nodes, either as point clouds, boxes or cylinders, and to draw out the edges (bundled or not) lines.
Here is an illustrated walkthrough of a simple set-up given a predefined set of “nodes” and “edges”.

## Documentation
The documentation for the package is available at https://www.plebiangraphlibrary.com/ 

## General setup of the package 
Apart from the graph class all the methods are stored in variables. These variables (For example SampleData) would have a function attached to it that retuns a value, or in some cases you can pass in values to do stuff (like displaceing the graph etc). I mostly did this for the sake of speed to develop - at some point shall be wrapping them up as classes.

## An example of rendering a basic graph
The general idea of drawing a basic graph is outlined above. To recap all the basic steps:
- Get a graph (either generate it or get onse using the sample data)
- Create a graph drawing window (this is essentially a three js canvas)
- Then add the elements like the nodes of the graphs using one of the many drawing options 

```javascript
// import the library
import * as PGL from "../Build/pgl_module.js";

// construct a simple ZKC graph
const zkcSimulated = await PGL.SampleData.LoadZKCSimulated();
// console log this to see how this data is stored
console.log(zkcSimulated);

// set the width and height
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
};
// then create the visualization window
// with those settings
const graph3d = new PGL.GraphDrawer.GraphDrawer3d(graphDrawerOptions);
// initialize this object before adding things to it
await graph3d.init();

// Create the 3d elements for the graph
// first describe a global scaling factor
const bounds = 1;
// first create all the node elements
const nodeVisualElements = PGL.ThreeWrapper.DrawTHREEBoxBasedVertices(
  zkcSimulated,
  bounds,
  0xffffff,
  5
);
// add the node elements to the scene
graph3d.addVisElement(nodeVisualElements);
// then create the edge elements
const edgeVisualElements = PGL.ThreeWrapper.DrawTHREEGraphEdgesThick(
  zkcSimulated,
  bounds,
  0xffafcc,
  0.02
);
graph3d.addVisElement(edgeVisualElements);

// then there are two last steps for a 3d graph
// this is done so that other 3d objects can be added in later
// since the base library is three.js all standard three js things are possible
// now moving on to the two steps :
// make an animation function
function animate() {
  requestAnimationFrame(animate);
  graph3d.rendercall();
}

// append the graph renderer to the container
// and then drawing render calls
animate();
```

## Usage / Installation

// package to yet be distributed to npm but expect it shortly
in the meantime - just download the build folder and point it to the module file and start using it, put it in as a module and start using it!
ideally at some point:

```
npm install pgl
```

## More examples 
More examples are available at https://www.plebiangraphlibrary.com/examples Check them out as a demonstration of some of the features of the library.


## Integrations

The Plebian Graph Library (PGL) is built on top of the ThreeJS library, seamlessly integrating its rich functionalities into a comprehensive and powerful toolset for large-scale graph data visualization. By leveraging the foundation provided by ThreeJS, PGL inherits a wide range of features, including advanced shading techniques, texture mapping capabilities, and much more. These powerful rendering capabilities enable PGL to create visually stunning and immersive graph visualizations, adding depth and realism to the representation of complex network structures. With its symbiotic relationship with ThreeJS, PGL empowers users to go beyond traditional graph visualizations, unlocking a world of possibilities for exploration and analysis.


## Acknowledgements
This libray was sponsored by the Geometry Lab under the Laborotory for Design Technologies at the Graduate School of Design, Harvard University. Many thanks to Andrew Witt for guiding this project. This project was developed by : Indrajeet Haldar (https://www.indrajeethaldar.com/) 
