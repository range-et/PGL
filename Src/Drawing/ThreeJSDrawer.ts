import * as THREE from "three";
import { Point } from "../HelperClasses/Point";
import { Line } from "../HelperClasses/Line";
import {hexToRgb} from "../HelperClasses/ColorHelper"
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { vertexShader } from "../Shaders/vertexShader.glsl";
import { fragmentShader } from "../Shaders/fragmentShader.glsl";
import GraphMethods from "../GraphAlgorithms/GraphMethods";
import { Graph } from "../Core/Graph";
import { _Node } from "../Core/_Node";

// Draw the graph out as a bunch of vertices
// As like tiny squares
function DrawTHREEGraphVertices(
  Graph: Graph,
  bounds: number,
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
function DrawTHREEGraphEdgesThick(
  G: Graph,
  bounds: number,
  color = 0xffffff,
  thickness: number = 0.2,
) {
  // add the interpolation function
  const lineMap = G.get_edge_map();
  return DrawThickEdgesFromEdgeMap(lineMap, bounds, color, thickness);
}

// draw a thing to draw out all the edges from the edge map stuff
function DrawThickEdgesFromEdgeMap(
  emap: Map<number, Line>,
  bounds: number,
  color: number = 0xffffff,
  thickness: number = 0.2
) {
  // this is the line thing
  const mat = new LineMaterial({
    color: color,
    linewidth: thickness, // in world units with size attenuation, pixels otherwise
    vertexColors: true,

    //resolution:  // to be set by renderer, eventually
    dashed: false,
    alphaToCoverage: true,
  });

  const meshes = new THREE.Group();
  for (let lval of emap.values()) {
    const mcolor = new THREE.Color();
    // convert the color that we shall be using
    mcolor.setHex(color);
    const pnts: number[] = [];
    const cols: number[] = [];

    lval.points.forEach((pnt) => {
      pnts.push(
        pnt.x * bounds - bounds / 2,
        pnt.y * bounds - bounds / 2,
        pnt.z * bounds - bounds / 2
      );
      cols.push(mcolor.r, mcolor.g, mcolor.b);
    });

    const geo = new LineGeometry();
    geo.setPositions(pnts);
    geo.setColors(cols);
    const line = new Line2(geo, mat);
    line.computeLineDistances();
    line.scale.set(1, 1, 1);
    meshes.add(line);
  }
  return meshes;
}

// make a thing that draws out all the lines (Thin)
function DrawTHREEGraphEdgesThin(
  G: Graph,
  bounds: number,
  color: number = 0xffffff
) {
  // first get the edge map positions
  const emap = G.get_edge_map();
  return DrawThinEdgesFromEdgeMap(emap, bounds, color);
}

// function to draw edges from edge map
function DrawThinEdgesFromEdgeMap(
  emap: Map<number, Line>,
  bounds: number,
  color: number = 0xffffff
) {
  const material = new THREE.LineBasicMaterial({
    color: color,
  });
  const lines = new THREE.Group();
  let points: THREE.Vector3[];
  for (const edge of emap.values()) {
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
function AddBoxBasedImaging(
  nodeMap: Map<number, Point>,
  bounds: number,
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
  // returns a group
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({ color: color });
  let nodeData;
  let geometry: THREE.BoxGeometry;
  let nodeMesh: THREE.Mesh;
  for (let i = 0; i < nodeMap.size; i++) {
    nodeData = nodeMap.get(i)!;
    geometry = new THREE.BoxGeometry(sizes[i],sizes[i],sizes[i]);
    geometry.name = i.toString();
    nodeMesh = new THREE.Mesh(geometry, material);
    nodeMesh.position.set(
      nodeData.x * bounds,
      nodeData.y * bounds,
      nodeData.z * bounds
    );
    group.add(nodeMesh);
  }
  return group;
}

// Draw BoxBased imaging from a graph
function DrawTHREEBoxBasedVertices(
  graph: Graph,
  bounds: number,
  color: number = 0xffffff,
  size: number | number[] = 10
) {
  const pmap = graph.get_position_map();
  const Bgroup = AddBoxBasedImaging(pmap, bounds, color, size);
  return Bgroup;
}

// draw cylinders where required
function AddCylinderBasedImaging(
  nodeMap: Map<number, Point>,
  divisonLength: number,
  color: number = 0xffffff,
  size: number | number[] = 10
) {
  // precompute all the sizes
  let sizes: any;
  if (typeof size == "number") {
    sizes.Array(nodeMap.size).fill(size);
  } else {
    sizes = size;
  }
  // returns a group
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({ color: color });
  let radius, circumfurence, segments;
  let nodeData: Point;
  for (let i = 0; i < nodeMap.size; i++) {
    nodeData = nodeMap.get(i)!;
    radius = sizes[i];
    circumfurence = 2 * radius * Math.PI;
    segments = Math.ceil(circumfurence / divisonLength);
    const geometry = new THREE.CylinderGeometry(radius, radius, 10, segments);
    geometry.name = i.toString();
    const nodeMesh = new THREE.Mesh(geometry, material);
    nodeMesh.position.set(nodeData.x, nodeData.y, nodeData.z);
    group.add(nodeMesh);
  }
  return group;
}

// draw the sparse graph as groups
// this seperates all the points based on some or the other group
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
    modularity = eval(`ndata.data.${propertyName}}`);
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

function DrawSimplifiedEdges(
  G: Graph,
  amount: number,
  color: number = 0xffffff
) {
  const lineGroup = new THREE.Group();
  const material = new THREE.LineBasicMaterial({ color: color });
  let start: Point;
  let end: Point;
  let points: THREE.Vector3[];
  for (let edge of G.edges.values()) {
    if (Math.random() <= amount) {
      start = G.nodes.get(edge.start)!.data.pos;
      end = G.nodes.get(edge.end)!.data.pos;
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

function ChangeTheVertexColours(vertices:THREE.Points, indexArray:number[], color:number) {
  let Attrib = vertices.geometry.attributes;
  let k = 0;
  const newCol = hexToRgb(color)!;
  indexArray.forEach((node) => {
    k = node * 3; // @ts-ignore
    Attrib.customColor.array[k] = newCol.r; // @ts-ignore
    Attrib.customColor.array[k + 1] = newCol.g; // @ts-ignore
    Attrib.customColor.array[k + 2] = newCol.b;
  });
  Attrib.customColor.needsUpdate = true;
}

function ResetVertexColors(vertices:THREE.Points) {
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
