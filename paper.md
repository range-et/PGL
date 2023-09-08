---
title: 'The Plebian Graph Library: A WebGL based network visusalisation and diagnostics package'
tags:
  - Javascript 
  - Visualisation
  - Graphs 
  - Networks
authors:
  - name: Indrajeet Haldar
    orcid: 0000-0001-8395-6056
    equal-contrib: true
    affiliation: "1" 
affiliations:
 - name: Harvard University, USA
   index: 1
date: 8 September 2023
bibliography: paper.bib
---

# Summary

Given a large network (greater than one million nodes), visualising and diagnosing network data has often proven challenging [@nowogrodzki2015eleven]. Although there is a wide range of statistical tools to draw inferences, the esoteric nature of the statistical analysis of networks limits the communication of the findings to researchers familiar with these research methods [@tobi2018research]. Moreover, the more abstract nature of statistical solutions reduces the complexity of diagnosing network properties, especially network diffusion. It allows for limited documentation and analysis only from the perspective of mathematical models of this particular property of large-scale networks [@gao2012network]. The Plebian Graph Library (PGL) is a library that solves for the visualisation of large networks and their diagnostic study.

The Plebian Graph Library (PGL) is a javascript library (written in Typescript) designed to facilitate the visualisation and diagnostic analysis of large-scale network data in browsers using WebGL, using a backend provided by ThreeJS [@danchilla2012three]. Whether dealing with local datasets or data retrieved from APIs, PGL provides a versatile platform for conducting extensive network simulations, physical modelling, and visualisations whilst offering a range of diagnostic tools for organising network data using standard search algorithms [@mattson2013standards] such as network diffusions, Breadth-first search, Depth-first search and Dijkstra's search algorithm. With a rich set of diagnostic features, including network condensation, weighted edge pruning in highly connected graphs, and support for diverse visualisation techniques like Kamada Kawai layouts [@kamada1989algorithm], Hierarchical plots, Hive plots and Edge bundling [@bourqui2016multilayer], PGL empowers researchers to gain valuable insights from complex network structures. Additionally, PGL also has the canonical example of the ZKC dataset [@zachary1977information], and the Erdosh Reyni Random Graph model [@li2021brief] as a generator to study and compare graphs. 

An illustrative case for the package is to diagnose large-scale network diffusion. Visualising a clustered network in 3D, where, for example, the network nodes are displaced vertically according to their recursive importance, i.e. eigenvector centralities [@lacobucci2017eigenvector]. A diffusion simulation is then run, and insights and diagnostics of diffusion sequences are gathered. For example, whether diffusion first occurs between high eigenvector centrality nodes across clusters or does the spread appears in the groups before spreading to other clusters, allowing for the visual study of the strength of weak ties behaviour [@granovetter1973strength]. Exploratory research, analysis, communication and documentation of these network behaviours, as mentioned above, would have been complex in a traditional visualisation library where the emphasis lies on validation instead of exploratory study and diagnostics.

# Statement of need

The Plebian Graph Library (PGL) addresses several critical needs in large-scale graph data visualisation. Existing software solutions for visualising large datasets are limited to local machine installations, for example, Gephi [@bastian2009gephi], which restricts accessibility and compatibility across various devices. Additionally, those software libraries that are browser-based cater to smaller datasets and lack the scalability to analyse complex network structures as they rely on SVG-based graphics, for example, Vis.JS [@visjs], imposing performance limitations and two-dimensional visualisations. Moreover, from the perspective of visualisations and diagnosis, two-dimensional plots of large-scale graphs often result in visual noise and information loss.
PGL fills this gap by providing a browser-based solution that leverages WebGL and Google's Web GPU technology (using the ThreeJS Library). By utilising ThreeJS, PGL surpasses the limitations of traditional two-dimensional representations and SVG graphics, enabling a more comprehensive range of data stratification methods and facilitating more immersive and interactive visualisations. Furthermore, the capacity to navigate information-dense networks in three dimensions allows for greater number of nodes and a significant reduction in visual noise while diagnosing large-scale networks. PGL surpasses most of the traditional performance hurdles by using ThreeJS and the underlying GPU-based optimisations. Since its creation, it has enabled a primary academic study of large-scale social networks in the form of an academic thesis, On the Mathematics of Memetics [@haldar2022mathematics], where it was used to generate the primary inferences of the study.

# Usage

Existing network visualisation libraries like NetworkX [@hagberg2008exploring] dictated the semantics of the graph library and borrowed some of the semantic ideas from ThreeJS. The overall structure is to define a Graph Object made of nodes and edges. Then, modify this graph based on some properties and update the relevant settings. Lastly, visualise the nodes as point clouds, boxes or cylinders, and draw out the edges (bundled or not) lines. The following is a short example of the canonical ZKC dataset visualised in the library, simulated with Edge bundling.

``` javascript
// import the library
import * as PGL from "../Build/pgl_module.js";

// construct a simple ZKC graph
// this graph is pre initialized (Since it is simulated in this case)
const zkcSimulated = await PGL.SampleData.LoadZKCSimulated();
// console log this to see how this data is stored
zkcSimulated.printData();

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
	canvas: canvas
};
// then create the visualization window
// with those settings
const graph3d = new PGL.GraphDrawer.GraphDrawer3d(graphDrawerOptions);
// initialize this object before adding things to it
await graph3d.init();

// Create the 3d elements for the graph
// first describe a global scaling factor
const bounds = 1
// first create all the node elements
const nodeVisualElements = PGL.ThreeWrapper.DrawTHREEBoxBasedVertices(zkcSimulated, bounds, 0xffffff, 3);
// add the node elements to the scene
graph3d.addVisElement(nodeVisualElements);

const EdgeMap = zkcSimulated.get_edge_map();
const EdgeMap_copy = PGL.Drawing.DisplaceEdgeInY(EdgeMap, 20);
const newEdgeMap = await PGL.Drawing.DrawEdgeBundling(EdgeMap_copy, 50, 10);
// then create the edge elements
// these are the reuglar edges
const edgeVisualElements = PGL.ThreeWrapper.DrawThinEdgesFromEdgeMap(EdgeMap, bounds, 0x62b6cb, 0.01);
graph3d.addVisElement(edgeVisualElements);
// these are the bundled edges
const edgeVisualElements_Bundled = PGL.ThreeWrapper.DrawThickEdgesFromEdgeMap(newEdgeMap, bounds, 0x5fa8d3, 0.01);
graph3d.addVisElement(edgeVisualElements_Bundled);

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
# Documentation

Package documentation is available on GitHub for the package. Guides for general guides and detailed descriptors of all the functions are also included. Further documentation is available at https://www.plebiangraphlibrary.com/. Examples are available at https://www.plebiangraphlibrary.com/examples.html. 

# Acknowledgements

The Geometry Lab, under the Laboratory for Design Technologies at the Graduate School of Design at Harvard University, funded this project.


# References