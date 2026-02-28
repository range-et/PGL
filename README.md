## Introduction

The Plebeian Graph Library (PGL) is a library designed to facilitate the visualization of large-scale network data (Network X line plotting in Javascript/Typescript). Leveraging the power of WebGL, PGL offers an efficient and interactive solution for visualizing network data in web browsers (Tested on Firefox, Edge and Chrome). Whether dealing with local datasets or data retrieved from APIs, PGL provides a versatile platform for conducting extensive network simulations, physical modeling, and immersive visualizations. With a rich set of features including graph condensation based on selected criteria, randomized edge pruning in highly connected graphs, and support for diverse visualization techniques like network diffusions and Kamada Kawai layouts, and edge bundling, PGL empowers users to gain valuable insights from complex network structures.

## Notes on terminology

It can be a bit confusing especially when working with Nodes/Edges/Vertices/Lines in this library (Also in general in working with graphs). Hence the terminology that I've followed here is as following:

- Nodes (The library and the class is called \_Node so as to not confuse with NodeJS ) and Edges make up a graph.
- Vertices and Lines make up the 3d visualization side of a graph.
- Nodes are the abstract idea, vertices are what's visualized
- Edges are the abstract idea , lines are what's visualized. 

Lastly, there are a few helper classes like points and lines. Points are essentially vectors and are used for displacement and also for describing a place in relation to the global coordinate system. Line are an array of points that get translated into lines using one of the visualization methods. Points can have different visualizations like boxes, billboarded planes and cylinders etc.


## Documentation

The documentation for the package is available at [documentation](https://www.plebeiangraphlibrary.com/). You can also generate API docs locally with:

```bash
npm run document
```

This writes TypeDoc output to the `docs/` folder. **API overview:** the library exposes the following namespaces: `Graph`, `GraphMethods` (BFS, Dijkstra, GraphDiameter, SelectSubgraph), `SampleData` (LoadZKC, LoadZKCSimulated, LoadGraphFromEdgeListText for (sgd)²-style edge lists, LoadGraphFromObjText for OBJ meshes → graph + positions), `Constructors` (ConstructGraphNodeEdgesList), `Drawing` (SimulateKamadaKawai, DrawEdgeLines, DrawEdgeBundling, DisplaceEdgeInY, etc.), `Geometry`, `Utilities`, `ThreeWrapper`, `GraphDrawer`, `Models` (Erdos–Renyi), `Hierarchy` (clusterByDistance, clusterByStrategy for flow-map style clustering), **Simulation** (createKamadaKawai3D, createStressSGD3D — stress layout methods from (sgd)², Imperial), **MatrixHelpers** (matrixVectorMultiply, normalizeVector), and **glMatrix** (re-exported [gl-matrix](https://github.com/toji/gl-matrix) for vector/matrix math in the browser).

### Graph simulations

For time-based layout updates (e.g. in a `requestAnimationFrame` loop), use **createKamadaKawai3D(graph, options)** or **createStressSGD3D(graph, options)** (async). Both return an object with **step(deltaTime)**, **getPositions()** (Float32Array), and **getPositionMap()**. The Stress SGD layout follows the (sgd)² reference implementation from Imperial ([arXiv:1710.04626](https://arxiv.org/abs/1710.04626), [IEEE TVCG](https://www.computer.org/csdl/journal/tg/2019/09/08419285/13rRUyYBlgE), [github.com/jxz12/s_gd2](https://github.com/jxz12/s_gd2)). Use **DrawTHREEGraphVerticesMutable** so you can call **updatePositions(simulation.getPositions())** each frame without recreating geometry. For 3D layout that does not collapse to a line, pass **initialPositions** (e.g. from **LoadGraphFromObjText**) and use **dimensions: 3**. See Examples 9 (Kamada–Kawai live simulation), 11 (custom layout), 12 (Stress SGD live simulation), and 13 (Stress SGD 3D with Stanford Bunny mesh).

### Types (Point, PointLike)

The library exports **Point** (class with `x`, `y`, `z` and `translate()`) and **PointLike** (`{ x: number; y: number; z: number }`) for typing position maps and custom layout results. Use `PointLike` for plain objects; use `new PGL.Point(x, y, z)` when you need the class.

### Drawing API: static vs mutable

- **Static** (one-shot layout): `DrawTHREEGraphVertices`, `DrawTHREEGraphEdgesThin` — create geometry once from the graph.
- **Mutable** (animation loops): `DrawTHREEGraphVerticesMutable` (and `updatePositions()`), `DrawTHREEGraphEdgesThinMutable` (and `updateEdges()`) — update geometry each frame for time-based simulation.

### LOD and flow-map style

**Hierarchy** (clusterByDistance, clusterByStrategy) and Example 6 provide FlowmapBlue-style level-of-detail: cluster nodes by distance (e.g. KD-tree), merge nearby nodes into super-nodes, and simplify the graph for zoom-dependent detail. See Examples 5 (Hierarchy) and 6 (Flow map).

### Matrix math in the browser

**get_node_ids_order()** returns a stable array of node IDs. **get_adjacency_matrix()** returns `{ matrix: Float32Array (row-major n×n), nodeIds }`. Use **matrixVectorMultiply(A, n, x, out)** and **normalizeVector(x)** for power iteration or diffusion in the browser. The library re-exports **glMatrix** (vec3, mat4, etc.) so you can do full vector/matrix math without adding another dependency. Dense adjacency matrix is for small/medium graphs; for very large graphs use **get_adjacency()** (sparse). See Examples 10 and 11.

## General setup of the package

Apart from the graph class all the methods are stored in variables. These variables (For example SampleData) would have a function attached to it that returns a value, or in some cases you can pass in values to do stuff (like displacing the graph etc). I mostly did this for the sake of speed to develop - at some point shall be wrapping them up as classes.

## Semantics of the Package

Existing network visualization libraries like NetworkX dictated the semantics of the graph library and borrowed some of the semantic ideas from three JS. The process is to define a Graph Object made of nodes and edges. Then modify this graph based on some set of properties. Then update the relevant settings. And lastly, to visualize the nodes, either as point clouds, boxes or cylinders, and to draw out the edges (bundled or not) lines.
Here is an illustrated walkthrough of a simple set-up given a predefined set of “nodes” and “edges”.


## An example of rendering a basic graph

The general idea of drawing a basic graph is outlined above. To recap all the basic steps:

- Get a graph (either generate it or get one using the sample data)
- Create a graph drawing window (this is essentially a three js canvas)
- Then add the elements like the nodes of the graphs using one of the many drawing options

```javascript
// import the library
import * as PGL from "plebeiangraphlibrary";

async function createVisualization() {
  // Load up the ZKC dataset 
  const zkcSimulated = await PGL.SampleData.LoadZKCSimulated();

  // Attach the renderer to a div which is on an HTML that the script is linked too
  const canvas = document.getElementById("displayCanvas");
  // These are some basic options to set up a graph drawing object. Please refer to the documentation for more options
  const graphDrawerOptions = {
    graph: zkcSimulated,
    width: 800,
    height: 700,
    canvas: canvas,
  };

  // Initialize a graph with these settings
  const graph3d = new PGL.GraphDrawer.GraphDrawer3d(graphDrawerOptions);
  await graph3d.init();

  // Create the 3d elements for the graph
  // first describe a global scaling factor
  const bounds = 1;
  // Create all the geometry associated with node elements
  const nodeVisualElements = PGL.ThreeWrapper.DrawTHREEBoxBasedVertices(
    zkcSimulated,
    bounds,
    0xffffff,
    5
  );
  // add the node geometry to the scene
  graph3d.addVisElement(nodeVisualElements);
  // then create all the geometry associated with the edge elements
  const edgeVisualElements = PGL.ThreeWrapper.DrawTHREEGraphEdgesThick(
    zkcSimulated,
    bounds,
    0xffafcc,
    0.02
  );
  // add the edge geometry to the scene
  graph3d.addVisElement(edgeVisualElements);

  // by default the camera revolves around the graph, trigger the animation call
  function animate() {
    requestAnimationFrame(animate);
    graph3d.rendercall();
  }

  animate();
}

createVisualization();
```

## Testing

- **Unit tests:** `npm run test:unit` (Vitest; tests Utilities, Graph, Simulation, matrix helpers).
- **Visual regression:** `npm test` (Puppeteer + pixelmatch against a baseline screenshot).

## Usage / Installation

Install it from the npm repository. Note that this method needs a npm folder to be set up with a build tool like parcel to package the visualizations

```
npm i plebeiangraphlibrary
```
There is a boiler plate example of this in [repository](https://github.com/range-et/pgl_example)

Or head over to the GitHub, download the pgl_module.js [Builds](https://github.com/range-et/PGL/tree/main/Build) file and then start using it as a standalone module.

## More examples

More examples are available at [Examples](https://www.plebeiangraphlibrary.com/examples.html) Check them out as a demonstration of some of the features of the library.

## Integrations

The plebeian Graph Library (PGL) is built on top of the ThreeJS library, seamlessly integrating its rich functionalities into a comprehensive and powerful toolset for large-scale graph data visualization. By leveraging the foundation provided by ThreeJS, PGL inherits a wide range of features, including advanced shading techniques, texture mapping capabilities, and much more. These powerful rendering capabilities enable PGL to create visually stunning and immersive graph visualizations, adding depth and realism to the representation of complex network structures. With its symbiotic relationship with ThreeJS, PGL empowers users to go beyond traditional graph visualizations, unlocking a world of possibilities for exploration and analysis.

## Benchmarking 

A performance benchmark conducted against D3, an industry-standard visualization library, showcases PGL's capabilities. In this test involving approximately 5000 nodes and 200000 edges, D3-based SVG graphs only achieved a frame rate of 1.5 frames per second, bottoming at a frame every two seconds with a maximum of 12 frames per second. In contrast, PGL maintained a minimum of 52 frames per second and averaging 58 frames per second under similar conditions. This benchmark, performed on both Firefox and Chrome browsers (with negligible differences in performance) on a computer with an Nvidia RTX 2080 GPU, highlights PGL's superior performance and efficiency in rendering complex network visualizations. The benchmarking files are available under benchmarking for the D3 project and the PGL example can be accessed under Examples / 3_LargePointCloud.html

## Contributing

Contributions are welcome to the plebeian Graph Library (PGL)! Whether you're fixing a bug, adding a feature, improving documentation, or spreading the word, your contribution is valuable. Here's how you can get involved:

* Reporting Issues: If you encounter any bugs or issues, please report them in the Issues section of our GitHub repository. Provide as much detail as you can, including steps to reproduce the issue.

* Submitting Changes:
  - Fork the repository on GitHub.
  - Clone your forked repository to your local machine.
  - Create a new branch for your feature or bug fix.
  - Make your changes and test them.
  - Commit your changes and push them to your fork.
  - Submit a pull request back to the main repository. In your pull request, describe the changes and link to any relevant issues.

* Seeking Support: If you have questions or need help integrating PGL into your project, feel free to reach out on the GitHub [issues page](https://github.com/range-et/PGL/issues), I shall be more than happy to help out there.

* Improving Documentation: Good documentation is crucial for any project. If you see an area that needs improvement or have ideas for new content, don't hesitate to reach out and open an issue.

Also remember to check out the contributions file where there are more details on how to contribute to the project.

Remember to follow our Code of Conduct to ensure a welcoming and inclusive environment for everyone

## References and acknowledgements

**Stress-based layout (createStressSGD3D):** The stress-minimization-by-SGD algorithm and schedule used in PGL are taken from the **(sgd)²** reference implementation ([jxz12/s_gd2](https://github.com/jxz12/s_gd2)) from Imperial College London. The underlying method is from the paper: J. X. Zheng, S. Pawar, D. F. M. Goodman, *Graph Drawing by Stochastic Gradient Descent*, IEEE Transactions on Visualization and Computer Graphics, [arXiv:1710.04626](https://arxiv.org/abs/1710.04626). Example graph data (e.g. football.txt) in the Stress SGD demo are from the same s_gd2 repository.

**PGL:** This library was sponsored by the Geometry Lab under the Laboratory for Design Technologies at the Graduate School of Design, Harvard University. Many thanks to Andrew Witt for guiding this project. This project was developed by [Indrajeet Haldar](https://www.indrajeethaldar.com/).
