import * as THREE from "three";
import {
  MeshLine,
  MeshLineMaterial,
  MeshLineRaycast,
} from "./MeshLine.js";
import { vertexShader } from "./Shaders/vertexShader.glsl.js";
import { fragmentShader } from "./Shaders/fragmentShader.glsl.js";
import * as GraphMethods from "./GraphMethods.js";

// Draw the graph out as a bunch of vertices
function DrawTHREEGraphVertices(Graph, bounds) {
  const positionAttribute = [];
  const sizes = [];
  const colors = [];
  const labels = [];
  const color = new THREE.Color();
  // process the data set
  let i = 0;
  for (const node of Graph.nodes.keys()) {
    const nodeData = Graph.nodes.get(node);
    positionAttribute.push(
      nodeData.data.pos.x * bounds,
      nodeData.data.pos.y * bounds,
      nodeData.data.pos.z * bounds
    );
    color.setRGB(255, 255, 255);
    color.toArray(colors, i * 3);
    if (nodeData.data.size != undefined){
      sizes.push(nodeData.data.size);
    } else {
      sizes.push(4)
    }
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
  geometry.name = "THIS IS THE VERTEX GROUP";

  // example material
  const PointMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(0xffffff) },
      pointTexture: {
        value: new THREE.TextureLoader().load("./Textures/Square.png"),
      },
      alphaTest: { value: 0.9 },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });

  const vertices = new THREE.Points(geometry, PointMaterial);
  return vertices;
}

// then make a thing which draws out all the edges (THICK)
function DrawTHREEGraphEdgesThick(G, bounds) {
  return DrawThickEdgesFromEdgeMap(G.edges, bounds);
}

// draw a thing to draw out all the edges from the edge map stuff
function DrawThickEdgesFromEdgeMap(emap, bounds) {
  // this is the line thing
  const mat = new MeshLineMaterial({
    transparent: true,
    lineWidth: 5,
    opacity: 0.8,
    color: new THREE.Color(0xcaf0f8),
  });
  const meshes = new THREE.Group();
  for (const edge of emap.values()) {
    const lval = edge.data.ldata;
    const pnts = [];
    lval.points.forEach((pnt) => {
      pnts.push(
        new THREE.Vector3(
          pnt.x * bounds - bounds / 2,
          pnt.y * bounds - bounds / 2,
          pnt.z * bounds - bounds / 2
        )
      );
    });
    const geo = new THREE.BufferGeometry().setFromPoints(pnts);
    const line = new MeshLine();
    line.setGeometry(geo);
    const lineMesh = new THREE.Mesh(line, mat);
    meshes.add(lineMesh);
  }
  return meshes;
}

// make a thing that draws out all the lines (Thin)
function DrawTHREEGraphEdgesThin(G, bounds) {
  return DrawThinEdgesFromEdgeMap(G.edges, bounds);
}

// function to draw edges from edge map
function DrawThinEdgesFromEdgeMap(emap, bounds) {
  const material = new THREE.LineBasicMaterial({
    color: 0x90e0ef,
  });
  const lines = new THREE.Group();
  for (const edge of emap.values()) {
    const points = [];
    // get the edge data
    const ldata = edge.data.ldata.points;
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
function AddBoxBasedImaging(vertexMap, bounds) {
  // returns a group
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({ color: 0x0466c8 });
  for (const node of vertexMap.keys()) {
    const nodeData = vertexMap.get(node);
    const geometry = new THREE.BoxGeometry(
      nodeData.data.size,
      nodeData.data.size,
      nodeData.data.size
    );
    geometry.name = node;
    const nodeMesh = new THREE.Mesh(geometry, material);
    nodeMesh.position.set(
      nodeData.data.pos.x * bounds,
      nodeData.data.pos.y * bounds,
      nodeData.data.pos.z * bounds
    );
    group.add(nodeMesh);
  }
  return group;
}

// Draw BoxBased imaging from a graph
function DrawTHREEBoxBasedVertices(graph, bounds){
  const Bgroup = AddBoxBasedImaging(graph.nodes, bounds);
  return Bgroup;
}

// draw cylinders where required
function AddCylinderBasedImaging(vertexMap, divisonLength) {
  // returns a group
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  let radius, circumfurence, segments;
  for (const node of vertexMap.keys()) {
    const nodeData = vertexMap.get(node);
    radius = nodeData.data.size;
    circumfurence = 2 * radius * Math.PI;
    segments = Math.ceil(circumfurence / divisonLength);
    const geometry = new THREE.CylinderGeometry(radius, radius, 10, segments);
    geometry.name = node;
    const nodeMesh = new THREE.Mesh(geometry, material);
    nodeMesh.position.set(
      nodeData.data.pos.x,
      nodeData.data.pos.y,
      nodeData.data.pos.z
    );
    group.add(nodeMesh);
  }
  return group;
}

// draw the sparse graph as groups
async function AddInModularityBasedPointGroups(Graph, modularityList) {
  // returns an array of groups
  const groups = new Map();
  const otherNodes = [];
  for (const node of Graph.nodes.keys()) {
    const ndata = Graph.nodes.get(node);
    const modularity = ndata.data.modularity;
    if (modularityList.includes(modularity)) {
      if (groups.has(modularity)) {
        groups.get(modularity).push(node);
      } else {
        groups.set(modularity, [node]);
      }
    } else {
      otherNodes.push(node);
    }
  }
  // then counstruct a bunch of subraphs
  const meshGraphVertices = new Map();
  const meshGraphEdges = new Map();
  // make a seperate group of nodes that have less than 2 neighbours
  console.log("Now started the process of vertex subdivision");
  for (const modularityGroup of groups.keys()) {
    const subgraphGroup = groups.get(modularityGroup);
    // returns an array
    const subgraph = await GraphMethods.SelectSubgraph(
      Graph,
      subgraphGroup
    );
    // then make the vertex thing
    const meshRep = DrawTHREEGraphVertices(subgraph, 1);
    meshGraphVertices.set(modularityGroup, meshRep);
    // make the edges
    const edges = DrawSimplifiedEdges(subgraph, 0.03);
    meshGraphEdges.set(modularityGroup, edges);
  }
  // now for all the vertices in the "other" Nodes map add in the
  // rest of the stuff for us to play around with
  const OtherNodes = await GraphMethods.SelectSubgraph(Graph, otherNodes);
  const LeafVertices = DrawTHREEGraphVertices(OtherNodes, 1);
  const ROBJ = {
    vertices: meshGraphVertices,
    edges: meshGraphEdges,
    leafs: LeafVertices,
  };
  return ROBJ;
}

function DrawSimplifiedEdges(G, amount) {
  const lineGroup = new THREE.Group();
  const material = new THREE.LineBasicMaterial({ color: 0x90e0ef });
  for (const edge of G.edges.values()) {
    if(Math.random()<=amount){
      const start = G.nodes.get(edge.start).data.pos;
      const end = G.nodes.get(edge.end).data.pos;
      const points = [];
      points.push(new THREE.Vector3(start.x, start.y, start.z));
      points.push(new THREE.Vector3(end.x, end.y, end.z));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      lineGroup.add(line);
    }
  }
  return lineGroup;
}

function ChangeTheVertexColours(vertices, indexArray, color){
  let Attrib = vertices.geometry.attributes;
  let k = 0;
  indexArray.forEach((node) => {
    k = node * 3;
    Attrib.customColor.array[k] = color.r;
    Attrib.customColor.array[k + 1] = color.g;
    Attrib.customColor.array[k + 2] = color.b;
  })
  Attrib.customColor.needsUpdate =true;  
}

function ResetVertexColors(vertices){
  let Attrib = vertices.geometry.attributes;
  let k = 0;
  for (let i = 0; i < Attrib.customColor.count; i++) {
    k = i*3;
    Attrib.customColor.array[k] = 100;
    Attrib.customColor.array[k + 1] = 237;
    Attrib.customColor.array[k + 2] = 146;
  }
  Attrib.customColor.needsUpdate = true;
}

export {
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
  DrawTHREEBoxBasedVertices
};
