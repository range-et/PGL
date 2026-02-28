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
 * Draw the vertices of the graph as a point cloud. **Static geometry** — use for one-shot layout.
 * For time-based simulation use DrawTHREEGraphVerticesMutable and updatePositions() each frame.
 *
 * @param Graph - the graph that has to be drawn out
 * @param bounds - A global scaling parameter defaults to 1 but change to scale up a graph
 * @param size - The size of all the nodes - either an array the same length as nodes or a single number
 * @param color - the color of the node defaults to white
 * @param alpha - the alpha value of the node defaults to 1 (opaque)
 * @returns a THREE.Group containing the point cloud
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

export interface MutableVerticesResult {
  group: THREE.Group;
  updatePositions(positions: Float32Array | Map<number, Point>): void;
}

/**
 * **Mutable** point cloud: positions can be updated each frame. Use for time-based simulation.
 * Call updatePositions(simulation.getPositions()) (or a Map) in your animation loop.
 * Node order matches get_node_ids_order().
 */
function DrawTHREEGraphVerticesMutable(
  Graph: Graph,
  bounds: number = 1,
  size: number | number[] = 1,
  color: number = 0xffffff,
  alpha: number = 1
): MutableVerticesResult {
  const nodeIds = Graph.get_node_ids_order();
  const n = nodeIds.length;
  const pmap = Graph.get_position_map();
  const positionAttribute: number[] = [];
  let sizes: number[];
  const colors = Array(n).fill(color);
  const labels = nodeIds.slice();
  const colorVal = new THREE.Color();
  colorVal.setRGB(255, 255, 255);
  for (let i = 0; i < n; i++) {
    const nodeData = pmap.get(nodeIds[i])!;
    positionAttribute.push(
      nodeData.x * bounds,
      nodeData.y * bounds,
      nodeData.z * bounds
    );
    colorVal.toArray(colors, i * 3);
  }
  if (typeof size === "number") {
    sizes = Array(n).fill(size);
  } else {
    sizes = size;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positionAttribute, 3)
  );
  geometry.setAttribute(
    "customColor",
    new THREE.Float32BufferAttribute(colors, 3)
  );
  geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
  geometry.setAttribute("label", new THREE.Int32BufferAttribute(labels, 1));
  geometry.name = "nodes";

  const PointMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(0xffffff) },
      pointTexture: {
        value: new THREE.TextureLoader().load("./Textures/Square.png"),
      },
      alphaTest: { value: alpha },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });

  const group = new THREE.Group();
  group.add(new THREE.Points(geometry, PointMaterial));
  const positionAttr = geometry.getAttribute("position") as THREE.BufferAttribute;

  function updatePositions(positions: Float32Array | Map<number, Point>): void {
    const arr = positionAttr.array as Float32Array;
    if (positions instanceof Float32Array) {
      for (let i = 0; i < n * 3; i++) {
        arr[i] = positions[i] * bounds;
      }
    } else {
      for (let i = 0; i < n; i++) {
        const p = positions.get(nodeIds[i])!;
        arr[i * 3] = p.x * bounds;
        arr[i * 3 + 1] = p.y * bounds;
        arr[i * 3 + 2] = p.z * bounds;
      }
    }
    positionAttr.needsUpdate = true;
  }

  return { group, updatePositions };
}

// then make a thing which draws out all the edges (THICK)
/**
 * Draws all edges as thick lines. **Static geometry** — use for one-shot layout.
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
 * Draw thin lines for all edges. **Static geometry** — use for one-shot layout.
 * For time-based simulation use DrawTHREEGraphEdgesThinMutable and updateEdges() each frame.
 *
 * @param Graph - The graph that has to be drawn
 * @param bounds - The global scale factor for the edges - defaults to 1
 * @param color - color of the lines - defaults to white
 * @returns a THREE.Group of lines
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

export interface MutableEdgesResult {
  group: THREE.Group;
  updateEdges(): void;
}

/**
 * **Mutable** thin edges: geometry is refreshed from the graph each frame. Use for time-based simulation.
 * After updating the graph's position map and edge map, call updateEdges() in your animation loop.
 */
function DrawTHREEGraphEdgesThinMutable(
  Graph: Graph,
  bounds: number = 1,
  color: number = 0xffffff
): MutableEdgesResult {
  const material = new THREE.LineBasicMaterial({ color });
  const group = new THREE.Group();

  function updateEdges(): void {
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if (child instanceof THREE.Line && child.geometry) {
        child.geometry.dispose();
      }
    }
    const emap = Graph.get_edge_map();
    for (const edge of emap.values()) {
      const points: THREE.Vector3[] = [];
      edge.points.forEach((element) => {
        points.push(
          new THREE.Vector3(
            element.x * bounds,
            element.y * bounds,
            element.z * bounds
          )
        );
      });
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      group.add(line);
    }
  }

  updateEdges();
  return { group, updateEdges };
}

/**
 * Draw a single thick line through an ordered list of node IDs (e.g. a path).
 * Uses graph positions; line width in pixels (pass thickness >= 1 for pixel width).
 *
 * @param Graph - Graph with position map
 * @param bounds - Scale factor for positions
 * @param pathNodeIds - Ordered node IDs (start to end)
 * @param color - Hex color for the path line
 * @param thickness - Line width in pixels (e.g. 5 for a thick path)
 */
function DrawThickPathFromNodeIds(
  Graph: Graph,
  bounds: number,
  pathNodeIds: number[],
  color: number = 0xffffff,
  thickness: number = 5
) {
  const pmap = Graph.get_position_map();
  const pathPoints = pathNodeIds.map((id) => pmap.get(id)).filter((p): p is Point => p != null);
  if (pathPoints.length < 2) return new THREE.Group();
  const pathLine = new Line(pathPoints);
  return createThickEdgesGroup(new Map([[0, pathLine]]), bounds, color, thickness);
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

// draw the cube box graph here (single InstancedMesh for all boxes)
const _boxInstanceMatrix = new THREE.Matrix4();
const _boxInstancePosition = new THREE.Vector3();
const _boxInstanceQuaternion = new THREE.Quaternion();
const _boxInstanceScale = new THREE.Vector3();

/**
 * Add boxes for all nodes using one InstancedMesh (efficient for 1000s of boxes).
 *
 * @param nodeMap - a map of all the nodes
 * @param bounds - global scale of the edges to be drawn, defaults to 1
 * @param color - default color of the edges, defaults to white
 * @param size - size of the nodes defaults to 10
 * @returns a group containing one InstancedMesh for all boxes
 */
function AddBoxBasedImaging(
  nodeMap: Map<number, Point>,
  bounds: number = 1,
  color: number = 0xffffff,
  size: number | number[] = 10
) {
  const n = nodeMap.size;
  const entries = Array.from(nodeMap.entries());
  const sizes: number[] =
    typeof size === "number" ? Array(n).fill(size) : size;

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color });
  const instancedMesh = new THREE.InstancedMesh(geometry, material, n);
  instancedMesh.name = "boxVertices";

  _boxInstanceQuaternion.identity();
  for (let i = 0; i < n; i++) {
    const nodeData = entries[i][1];
    const s = sizes[i];
    _boxInstancePosition.set(
      nodeData.x * bounds,
      nodeData.y * bounds,
      nodeData.z * bounds
    );
    _boxInstanceScale.set(s, s, s);
    _boxInstanceMatrix.compose(
      _boxInstancePosition,
      _boxInstanceQuaternion,
      _boxInstanceScale
    );
    instancedMesh.setMatrixAt(i, _boxInstanceMatrix);
  }
  instancedMesh.instanceMatrix.needsUpdate = true;

  const group = new THREE.Group();
  group.add(instancedMesh);
  return group;
}

export interface MutableBoxVerticesResult {
  group: THREE.Group;
  updatePositions(positions: Float32Array | Map<number, Point>): void;
}

/**
 * Box-based vertices as one InstancedMesh with updatable positions (e.g. for simulation).
 * Node order matches get_node_ids_order() when called with a graph's position map.
 */
function DrawTHREEBoxBasedVerticesMutable(
  Graph: Graph,
  bounds: number = 1,
  color: number = 0xffffff,
  size: number | number[] = 10
): MutableBoxVerticesResult {
  const nodeIds = Graph.get_node_ids_order();
  const n = nodeIds.length;
  const pmap = Graph.get_position_map();
  const sizes: number[] =
    typeof size === "number" ? Array(n).fill(size) : size;

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color });
  const instancedMesh = new THREE.InstancedMesh(geometry, material, n);
  instancedMesh.name = "boxVertices";

  _boxInstanceQuaternion.identity();
  for (let i = 0; i < n; i++) {
    const nodeData = pmap.get(nodeIds[i])!;
    const s = sizes[i];
    _boxInstancePosition.set(
      nodeData.x * bounds,
      nodeData.y * bounds,
      nodeData.z * bounds
    );
    _boxInstanceScale.set(s, s, s);
    _boxInstanceMatrix.compose(
      _boxInstancePosition,
      _boxInstanceQuaternion,
      _boxInstanceScale
    );
    instancedMesh.setMatrixAt(i, _boxInstanceMatrix);
  }
  instancedMesh.instanceMatrix.needsUpdate = true;

  const group = new THREE.Group();
  group.add(instancedMesh);

  function updatePositions(positions: Float32Array | Map<number, Point>): void {
    if (positions instanceof Float32Array) {
      for (let i = 0; i < n; i++) {
        _boxInstancePosition.set(
          positions[i * 3] * bounds,
          positions[i * 3 + 1] * bounds,
          positions[i * 3 + 2] * bounds
        );
        _boxInstanceScale.set(sizes[i], sizes[i], sizes[i]);
        _boxInstanceMatrix.compose(
          _boxInstancePosition,
          _boxInstanceQuaternion,
          _boxInstanceScale
        );
        instancedMesh.setMatrixAt(i, _boxInstanceMatrix);
      }
    } else {
      for (let i = 0; i < n; i++) {
        const p = positions.get(nodeIds[i])!;
        _boxInstancePosition.set(p.x * bounds, p.y * bounds, p.z * bounds);
        _boxInstanceScale.set(sizes[i], sizes[i], sizes[i]);
        _boxInstanceMatrix.compose(
          _boxInstancePosition,
          _boxInstanceQuaternion,
          _boxInstanceScale
        );
        instancedMesh.setMatrixAt(i, _boxInstanceMatrix);
      }
    }
    instancedMesh.instanceMatrix.needsUpdate = true;
  }

  return { group, updatePositions };
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
  let modularity: number | undefined;
  for (let node of Graph.nodes.keys()) {
    ndata = Graph.nodes.get(node)!;
    const val = (ndata.data as Record<string, unknown>)[propertyName];
    modularity = typeof val === "number" ? val : (val != null ? Number(val) : undefined);
    if (modularity === undefined) continue;
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
 * Set vertex colors by node ID. Uses the geometry's "label" attribute (node ID per vertex) to map node IDs to vertex indices; if "label" is missing, indexArray is treated as vertex indices.
 *
 * @param vertices - THREE.Points with customColor (and optionally label) attribute, or a Group whose first child is that Points object
 * @param indexArray - Node IDs to color, or vertex indices if geometry has no label attribute
 * @param color - Hex color to apply
 */
function ChangeTheVertexColours(
  vertices: THREE.Points | THREE.Group,
  indexArray: number[],
  color: number
) {
  try {
    const points = (vertices instanceof THREE.Group ? vertices.children[0] : vertices) as THREE.Points | undefined;
    const geom = points?.geometry;
    if (!geom?.attributes) return;
    const customColor = geom.attributes.customColor as THREE.BufferAttribute | undefined;
    const arr = customColor?.array;
    if (!arr || arr.length === 0) return;
    const col = new THREE.Color(color);
    const labelAttr = geom.attributes.label as THREE.BufferAttribute | undefined;
    const labels = labelAttr?.array as Int32Array | undefined;

    if (labels && labels.length > 0) {
      // Map node IDs to vertex indices via label attribute
      indexArray.forEach((nodeId) => {
        for (let i = 0; i < labels.length; i++) {
          if (labels[i] === nodeId) {
            const k = i * 3;
            if (k + 2 < arr.length) {
              arr[k] = col.r;
              arr[k + 1] = col.g;
              arr[k + 2] = col.b;
            }
            break;
          }
        }
      });
    } else {
      // No label: treat indexArray as vertex indices
      indexArray.forEach((node) => {
        const k = node * 3;
        if (k + 2 < arr.length) {
          arr[k] = col.r;
          arr[k + 1] = col.g;
          arr[k + 2] = col.b;
        }
      });
    }
    if (customColor) customColor.needsUpdate = true;
  } catch {
    // Points object or customColor may be missing; skip coloring
  }
}

/**
 * Reset all vertex colors to white.
 * @param vertices - THREE.Points with customColor attribute, or a Group whose first child is that Points object
 */
function ResetVertexColors(vertices: THREE.Points | THREE.Group) {
  try {
    const points = (vertices instanceof THREE.Group ? vertices.children[0] : vertices) as THREE.Points | undefined;
    const customColor = points?.geometry?.attributes?.customColor as THREE.BufferAttribute | undefined;
    const arr = customColor?.array;
    if (!arr || arr.length === 0) return;
    const count = customColor?.count ?? Math.floor(arr.length / 3);
    for (let i = 0; i < count; i++) {
      const k = i * 3;
      arr[k] = 1;
      arr[k + 1] = 1;
      arr[k + 2] = 1;
    }
    if (customColor) customColor.needsUpdate = true;
  } catch {
    // skip if wrong object or missing attribute
  }
}

export default {
  DrawTHREEGraphVertices,
  DrawTHREEGraphVerticesMutable,
  DrawTHREEGraphEdgesThick,
  DrawTHREEGraphEdgesThin,
  DrawTHREEGraphEdgesThinMutable,
  DrawThickPathFromNodeIds,
  AddBoxBasedImaging,
  AddInModularityBasedPointGroups,
  DrawThinEdgesFromEdgeMap,
  DrawThickEdgesFromEdgeMap,
  AddCylinderBasedImaging,
  DrawSimplifiedEdges,
  ChangeTheVertexColours,
  ResetVertexColors,
  DrawTHREEBoxBasedVertices,
  DrawTHREEBoxBasedVerticesMutable,
};
