import * as THREE from "three";
import Point from "../HelperClasses/Point";
import Line from "../HelperClasses/Line";
import { hexToRgb } from "../HelperClasses/ColorHelper";
import { createThickEdgesGroup } from "./ThickLine";
import { vertexShader } from "../Shaders/vertexShader.glsl";
import { fragmentShader } from "../Shaders/fragmentShader.glsl";
import GraphMethods from "../GraphAlgorithms/GraphMethods";
import Graph from "../Core/Graph";
import _Node from "../Core/_Node";

// Draw the graph out as a bunch of vertices
// As like tiny squares
/**
 *
 * Draw the veritces of the graph out as a point cloud
 *
 * @param Graph - the graph that has to be drawn out
 * @param bounds - A global scaling parameter defaults to 1 but change to scale up a garph
 * @param size - The size of all the nodes - either input an array the same length of the number of nodes decribing how big each node is, or a global node value as a number or defaults to 1
 * @param color - the color of the node defaults to white
 * @param alpha - the alpha value of the node defaults to 1 (opaque)
 * @returns a three JS group that contains all the vertices as a point cloud or a three js points object that can be added to the scene
 */
function DrawTHREEGraphVertices(
  Graph: Graph,
  bounds: number = 1,
  size: number | number[] = 1,
  color: number = 0xffffff,
  alpha: number = 1
) {
  const positionAttribute: number[] = [];
  // get the corresponding points list
  const pmap = Graph.get_position_map();
  // declare the sizes and colors
  let sizes: number[];
  let colors: number[];
  if (typeof size == "number") {
    sizes = Array(Graph.nodes.size).fill(size);
  } else {
    sizes = size;
  }
  colors = Array(Graph.nodes.size).fill(color);
  const labels = [];
  const colorVal = new THREE.Color();
  colorVal.setRGB(255, 255, 255); // white as the default
  // process the data set
  let i = 0;
  let nodeData: Point;
  for (let node of Graph.nodes.keys()) {
    nodeData = pmap.get(node)!;
    positionAttribute.push(
      nodeData.x * bounds,
      nodeData.y * bounds,
      nodeData.z * bounds
    );

    colorVal.toArray(colors, i * 3);
    labels.push(node);
    i += 1;
  }

  const geometry = new THREE.BufferGeometry();
  // geometry attribute
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positionAttribute, 3)
  );
  // color attribute
  geometry.setAttribute(
    "customColor",
    new THREE.Float32BufferAttribute(colors, 3)
  );
  // size attribute
  geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
  // label attribute
  geometry.setAttribute("label", new THREE.Int32BufferAttribute(labels, 1));
  geometry.name = "nodes";

  // example material
  const PointMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(0xffffff) }, // this is a base color dont mess with this
      pointTexture: {
        value: new THREE.TextureLoader().load("./Textures/Square.png"),
      },
      alphaTest: { value: alpha },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });

  const vertices = new THREE.Group();
  vertices.add(new THREE.Points(geometry, PointMaterial));
  return vertices;
}

// then make a thing which draws out all the edges (THICK)
/**
 *
 * Draws out all the edges (Thick edges of a graph)
 *
 * @param Graph - The graph whose edges have to be drawn
 * @param bounds - the global scale for all the edges to be drawn defaults to 1
 * @param color - color of the edges defaults to white
 * @param thickness - thickness of the edges (defaults to 0.4; screen-space pixels ≈ thickness × 100 for values &lt; 1)
 * @returns a Three Js group of edges that can be added to the scene
 */
function DrawTHREEGraphEdgesThick(
  Graph: Graph,
  bounds: number = 1,
  color = 0xffffff,
  thickness: number = 0.4
) {
  // add the interpolation function
  const lineMap = Graph.get_edge_map();
  return DrawThickEdgesFromEdgeMap(lineMap, bounds, color, thickness);
}

// draw a thing to draw out all the edges from the edge map stuff
/**
 *
 * Draw thick edges from an edge map
 *
 * @param EdgeMap - The edge map associated with the graph
 * @param bounds - The global scale of the graph - defaults to 1
 * @param color - The color of the edges - defaults to white
 * @param thickness - thickness of the edges (defaults to 0.4; pixels ≈ thickness × 100 for values &lt; 1)
 * @returns
 */
function DrawThickEdgesFromEdgeMap(
  EdgeMap: Map<number, Line>,
  bounds: number,
  color: number = 0xffffff,
  thickness: number = 0.4
) {
  return createThickEdgesGroup(EdgeMap, bounds, color, thickness);
}

// make a thing that draws out all the lines (Thin)
/**
 *
 * Draw thin lines for all the edges given a graph
 *
 * @param Graph - The graph that has to be drawn
 * @param bounds - The global scale factor for the the edges - defaults to 1
 * @param color - color of the lines - defaults to white
 * @returns
 */
function DrawTHREEGraphEdgesThin(
  Graph: Graph,
  bounds: number = 1,
  color: number = 0xffffff
) {
  // first get the edge map positions
  const emap = Graph.get_edge_map();
  return DrawThinEdgesFromEdgeMap(emap, bounds, color);
}

// function to draw edges from edge map
/**
 *
 * Draw Line map as lines given the edge map assocaited with the graph
 *
 * @param LineMap - The edge map that has to be drawn out
 * @param bounds - Global scale for the edges to be drawn defaults to 1
 * @param color - Color of the edges defaults to 1
 * @returns
 */
function DrawThinEdgesFromEdgeMap(
  LineMap: Map<number, Line>,
  bounds: number = 1,
  color: number = 0xffffff
) {
  const material = new THREE.LineBasicMaterial({
    color: color,
  });
  const lines = new THREE.Group();
  let points: THREE.Vector3[];
  for (const edge of LineMap.values()) {
    points = [];
    // get the edge data
    const ldata = edge.points;
    ldata.forEach((element) => {
      points.push(
        new THREE.Vector3(
          element.x * bounds,
          element.y * bounds,
          element.z * bounds
        )
      );
    });
    // then make the line thing
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    lines.add(line);
  }
  return lines;
}

// draw the cube box graph here
/**
 *
 * Adde boxes where all the boxes are
 *
 * @param nodeMap - a map of all the nodes
 * @param bounds - global scale of the edges to be drawn, defaults to 1
 * @param color - default color of the edges, defaults to white
 * @param size - size of the nodes defaults to 10
 * @returns a group of vertices that contains all of the boxes associated with each one of the vertices
 */
function AddBoxBasedImaging(
  nodeMap: Map<number, Point>,
  bounds: number = 1,
  color: number = 0xffffff,
  size: number | number[] = 10
) {
  // precompute all the sizes
  let sizes: any;
  if (typeof size == "number") {
    sizes = Array(nodeMap.size).fill(size);
  } else {
    sizes = size;
  }
  // returns a group (iterate map entries so any node ID set works)
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({ color: color });
  let i = 0;
  for (const [id, nodeData] of nodeMap) {
    const s = typeof sizes === "number" ? sizes : sizes[i];
    const geometry = new THREE.BoxGeometry(s, s, s);
    geometry.name = String(id);
    const nodeMesh = new THREE.Mesh(geometry, material);
    nodeMesh.position.set(
      nodeData.x * bounds,
      nodeData.y * bounds,
      nodeData.z * bounds
    );
    group.add(nodeMesh);
    i += 1;
  }
  return group;
}

// Draw BoxBased imaging from a graph
/**
 *
 * Draw box based verices given a graph
 *
 * @param Graph - The graph that needs its vertices drawn
 * @param bounds - A global scale for the graph, defaults to one
 * @param color - Default color of the boxes defaults to white
 * @param size - Default size of the nodes defaults to 10
 * @returns
 */
function DrawTHREEBoxBasedVertices(
  Graph: Graph,
  bounds: number = 1,
  color: number = 0xffffff,
  size: number | number[] = 10
) {
  const pmap = Graph.get_position_map();
  const Bgroup = AddBoxBasedImaging(pmap, bounds, color, size);
  return Bgroup;
}

// draw cylinders where required
/**
 *
 * Draw cylinders where all the vertices are based on a node map
 *
 * @param nodeMap - the node map assiciate with the graph that has to be drawn out
 * @param divisonLength - the length of the divisions that are there in each one of the cylinder (this is a circumfurence amount), defaults to 16
 * @param color - the default color of the cylinder, defaults to white
 * @param size - the default size of the cylinder, defaults to 10
 * @returns
 */
function AddCylinderBasedImaging(
  nodeMap: Map<number, Point>,
  divisonLength: number = 16,
  color: number = 0xffffff,
  size: number | number[] = 10
) {
  // precompute all the sizes
  let sizes: number | number[];
  if (typeof size == "number") {
    sizes = Array(nodeMap.size).fill(size) as number[];
  } else {
    sizes = size;
  }
  // returns a group (iterate map entries so any node ID set works)
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({ color: color });
  let i = 0;
  for (const [id, nodeData] of nodeMap) {
    const radius = typeof sizes === "number" ? sizes : sizes[i];
    const circumfurence = 2 * radius * Math.PI;
    const segments = Math.ceil(circumfurence / divisonLength);
    const geometry = new THREE.CylinderGeometry(radius, radius, 10, segments);
    geometry.name = String(id);
    const nodeMesh = new THREE.Mesh(geometry, material);
    nodeMesh.position.set(nodeData.x, nodeData.y, nodeData.z);
    group.add(nodeMesh);
    i += 1;
  }
  return group;
}

// draw the sparse graph as groups
// this seperates all the points based on some or the other group
/**
 *
 * Split up a graph and return an boject containing a bunch of node groups and edge groups based on some parameterS
 *
 * @param Graph - the graph that you want to split up
 * @param propertyName - the property that you want to split them on
 * @returns - an object that hasa set of node vertices and a set of edge lines based on the splitting factor
 */
async function AddInModularityBasedPointGroups(
  Graph: Graph,
  propertyName: string
) {
  // returns an array of groups
  const groups: Map<number, number[]> = new Map();
  let ndata: _Node;
  let modularity: number;
  for (let node of Graph.nodes.keys()) {
    ndata = Graph.nodes.get(node)!;
    modularity = eval(`ndata.data.${propertyName}`);
    if (groups.has(modularity)) {
      groups.get(modularity)!.push(node);
    } else {
      groups.set(modularity, [node]);
    }
  }
  // then counstruct a bunch of subraphs
  const meshGraphVertices: Map<number, THREE.Group> = new Map();
  const meshGraphEdges: Map<number, THREE.Group> = new Map();
  let subgraphGroup: number[];
  let subgraph: Graph;
  let pointRep: THREE.Group;
  let edges: THREE.Group;
  for (let modularityGroup of groups.keys()) {
    subgraphGroup = groups.get(modularityGroup)!;
    // returns an array
    subgraph = await GraphMethods.SelectSubgraph(Graph, subgraphGroup);
    // then make the vertex thing
    pointRep = DrawTHREEGraphVertices(subgraph, 1);
    meshGraphVertices.set(modularityGroup, pointRep);
    // make the edges
    edges = DrawSimplifiedEdges(subgraph, 0.03);
    meshGraphEdges.set(modularityGroup, edges);
  }
  const ROBJ = {
    nodeGroups: meshGraphVertices,
    EdgeGroups: meshGraphEdges,
  };
  return ROBJ;
}

/**
 *
 * Draw simplified line edges (thin based) based on some number. This number is a fraction of the total number of edges (so if you specify 0.1 it would draw 10% of the edges)
 *
 * @param Graph - The graph that has to be drawn out
 * @param amount - The fraction of edges to be drawn
 * @param color - color of these edges - defaults to 0.1
 * @returns - a group of simple lines based on all the edges supplied to it
 */
function DrawSimplifiedEdges(
  Graph: Graph,
  amount: number,
  color: number = 0xffffff
) {
  const lineGroup = new THREE.Group();
  const material = new THREE.LineBasicMaterial({ color: color });
  let start: Point;
  let end: Point;
  let points: THREE.Vector3[];
  for (let edge of Graph.edges.values()) {
    if (Math.random() <= amount) {
      start = Graph.nodes.get(edge.start)!.data.pos;
      end = Graph.nodes.get(edge.end)!.data.pos;
      points = [];
      points.push(new THREE.Vector3(start.x, start.y, start.z));
      points.push(new THREE.Vector3(end.x, end.y, end.z));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      lineGroup.add(line);
    }
  }
  return lineGroup;
}

/**
 *
 * Change all the vertex colors based on some array of properties
 *
 * @param vertices - ThreeJS Points object, be sure to pass in the points object and not the group that the points belong too
 * @param indexArray - The array of the indices of all the nodes whose values that have to be changed
 * @param color - The color that they have to be changed too
 */
function ChangeTheVertexColours(
  vertices: THREE.Points,
  indexArray: number[],
  color: number
) {
  let Attrib = vertices.geometry.attributes;
  let k = 0;
  const col = new THREE.Color( color );
  indexArray.forEach((node) => {
    k = node * 3; // @ts-ignore
    Attrib.customColor.array[k] = col.r; // @ts-ignore
    Attrib.customColor.array[k + 1] = col.g; // @ts-ignore
    Attrib.customColor.array[k + 2] = col.b;
  });
  Attrib.customColor.needsUpdate = true;
}

/**
 *
 * This resets all the colors to white
 *
 * @param vertices - ThreeJS Points object, be sure to pass in the points object and not the group that the points belong too
 */
function ResetVertexColors(vertices: THREE.Points) {
  let Attrib = vertices.geometry.attributes;
  let k = 0;
  for (let i = 0; i < Attrib.customColor.count; i++) {
    k = i * 3; // @ts-ignore
    Attrib.customColor.array[k] = 255; // @ts-ignore
    Attrib.customColor.array[k + 1] = 255; // @ts-ignore
    Attrib.customColor.array[k + 2] = 255;
  }
  Attrib.customColor.needsUpdate = true;
}

export default {
  DrawTHREEGraphVertices,
  DrawTHREEGraphEdgesThick,
  DrawTHREEGraphEdgesThin,
  AddBoxBasedImaging,
  AddInModularityBasedPointGroups,
  DrawThinEdgesFromEdgeMap,
  DrawThickEdgesFromEdgeMap,
  AddCylinderBasedImaging,
  DrawSimplifiedEdges,
  ChangeTheVertexColours,
  ResetVertexColors,
  DrawTHREEBoxBasedVertices,
};
