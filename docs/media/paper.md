---
title: "The plebeian Graph Library: A WebGL based network visualisation and diagnostics package"
tags:
  - JavaScript
  - Visualisation
  - Graphs
  - Networks
authors:
  - name: Indrajeet Haldar
    orcid: 0000-0001-8395-6056
    affiliation: "1"
affiliations:
  - name: Graduate School of Design, Harvard University, USA
    index: 1
date: 8 September 2023
bibliography: paper.bib
---

# Summary

Given a large network (greater than one million nodes), visualising and diagnosing network data has often proven challenging [@nowogrodzki2015eleven]. Although there is a wide range of statistical tools to draw inferences, the esoteric nature of the statistical analysis of networks limits the communication of the findings to researchers familiar with these research methods [@tobi2018research].   Statistical analyses may not always capture the nuanced patterns and correlations within complex datasets, a limitation that visual inspection can overcome [@Vaishnavi2016A]. The Plebeian Graph Library (PGL) is a library that solves for the visualisation of large networks and their diagnostic study. PGL enables a deeper, more intuitive understanding of intricate processes such as network diffusion by allowing for direct, interactive exploration of data bridging the gap between raw data and actionable insights.

# Introduction

PGL is a JavaScript library, written in Typescript [@bierman2014understanding], designed to facilitate the visualisation and diagnostic analysis of large-scale network data in browsers using WebGL, using a backend provided by ThreeJS [@danchilla2012three]. Whether dealing with local datasets or data retrieved from online sources (APIs), PGL provides a versatile platform for conducting extensive network simulations, physical modelling, and visualisations whilst offering a range of diagnostic tools for organising network data using standard search algorithms [@mattson2013standards] such as network diffusions, breadth-first search, depth-first search, and Dijkstra's search algorithm. With a rich set of diagnostic features, including network condensation, weighted edge pruning in highly connected graphs, and support for visualisation techniques like Kamada Kawai layouts [@kamada1989algorithm], hierarchical plots, hive plots, and edge bundling [@bourqui2016multilayer], PGL empowers researchers to gain valuable insights from complex network structures. Additionally, PGL contains the canonical example of the Zackary's Karate Club (ZKC) dataset [@zachary1977information] and Erdosh Reyni Random Graph model [@li2021brief] as a generator to study and compare network structures.

An illustrative case for the package is to diagnose large-scale network diffusion. Visualising a clustered network in 3D, where, for example, the network nodes are displaced vertically according to their recursive importance, i.e., eigenvector centralities [@lacobucci2017eigenvector]. A diffusion simulation is then run, and insights and diagnostics of diffusion sequences are gathered. For example, we can observe graphically whether diffusion first occurs between high eigenvector centrality nodes across clusters or instead appears in the groups before spreading to other clusters. This enables the visual study of the strength of weak ties behaviour [@granovetter1973strength]. Exploratory research, analysis, communication, and documentation of these network behaviours, as mentioned above, would have been complex using a traditional visualisation library where the emphasis lies on validation instead of exploratory study and diagnostics.

# Statement of need

PGL addresses several critical needs in large-scale graph data visualization. Existing software solutions for visualizing large datasets, such as Gephi [@bastian2009gephi], are limited to local machine installations, restricting accessibility and compatibility across various devices. Additionally, browser-based software libraries like Vis.JS [@visjs] and D3 [@D3], which rely on Scalable Vector Graphics (SVG), often lack the scalability to analyze complex network structures. This reliance on SVG imposes performance limitations and restricts visualizations to two dimensions.

In contrast, PGL offers a robust browser-based solution leveraging WebGL through the ThreeJS Library. This enables it to surpass traditional two-dimensional representations' limitations. PGL is primarily designed for client-side rendering, taking full advantage of the capabilities of WebGL to deliver dynamic and interactive visualizations directly within the browser. While it focuses on client-side rendering, the underlying graph algorithms of PGL can also be utilized in server-side processes, providing flexibility in application architecture.

A performance benchmark conducted against D3, an industry-standard visualization library, showcases PGL's capabilities. In this test involving rendering a graph of approximately 5,000 nodes and 200,000 edges, D3-based SVG graphs only achieved a frame rate of 1.5 frames per second, bottoming at a frame every two seconds with a maximum of 12 frames per second. In contrast, PGL maintained a minimum of 52 frames per second and averaging 58 frames per second under similar conditions. This benchmark, performed on both Firefox and Chrome browsers (with negligible differences in performance) on a computer with an Nvidia RTX 2080 GPU, highlights PGL's superior performance and efficiency in rendering complex network visualizations.

Furthermore, PGL's three-dimensional rendering approach allows for a more comprehensive range of data stratification methods and facilitates more immersive and interactive visualizations. The ability to navigate information-dense networks in three dimensions significantly reduces visual noise and enhances clarity in diagnosing large-scale networks. Since its inception, PGL has been instrumental in my academic research, especially in the exploration of large-scale social networks. This is documented in my thesis, "On the Mathematics of Memetics" [@haldar2022mathematics], where it served as a crucial tool for generating primary inferences.

# Usage

Existing network libraries like NetworkX [@hagberg2008exploring] strongly influenced the semantics of the graph library and borrowed some of the semantic ideas from ThreeJS. The overall structure is to define a Graph Object made of nodes and edges. Then, modify this graph based on some properties and update the relevant settings. Lastly, visualise the nodes as point clouds, boxes or cylinders, and draw out the edges (bundled or not). The following is a short example of the canonical ZKC dataset visualised in the library, simulated with Edge bundling.

First, initialize a node project and install the library using:

```bash
npm i plebeiangraphlibrary
```

Then

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

# Documentation

Package documentation is available on GitHub. Guides for general usage and detailed descriptors of all the functions are also included. Further documentation is available at [https://www.plebeiangraphlibrary.com/](https://www.plebeiangraphlibrary.com/). Examples are available at [https://www.plebeiangraphlibrary.com/examples.html](https://www.plebeiangraphlibrary.com/examples.html). The example described above is documented at [https://github.com/range-et/pgl_example](https://github.com/range-et/pgl_example).

# Acknowledgements

The Geometry Lab, under the Laboratory for Design Technologies at the Graduate School of Design at Harvard University, funded this project.

# References
