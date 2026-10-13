import { describe, it, expect, vi, beforeAll } from "vitest";
import * as THREE from "three";
import Graph from "../../Src/Core/Graph";
import _Node from "../../Src/Core/_Node";
import Edge from "../../Src/Core/Edge";
import Drawing from "../../Src/Drawing/Drawing";
import Point from "../../Src/HelperClasses/Point";
import ThreeWrapper from "../../Src/Drawing/ThreeJSDrawer";
import { InteractionLayer } from "../../Src/Drawing/InteractionLayer";

// TextureLoader needs document.createElementNS; a bare event target is enough in Node.
beforeAll(() => {
  vi.stubGlobal("document", { createElementNS: () => new EventTarget() });
});

async function makeGraph(n: number) {
  const nodes = new Map<number, _Node>();
  for (let i = 0; i < n; i++) nodes.set(i, new _Node({ pos: new Point(i * 50, 0, 0) }));
  return Graph.create(nodes, new Map());
}

function pointsOf(group: THREE.Group) {
  return group.children[0] as THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>;
}

describe("point-cloud vertices", () => {
  it("DrawTHREEGraphVertices uses the color and alpha arguments", async () => {
    const G = await makeGraph(2);
    const pts = pointsOf(ThreeWrapper.DrawTHREEGraphVertices(G, 1, 1, 0xff0000, 0.5));
    expect(Array.from(pts.geometry.getAttribute("customColor").array)).toEqual([1, 0, 0, 1, 0, 0]);
    expect(pts.material.uniforms.alpha.value).toBe(0.5);
    expect(pts.material.transparent).toBe(true);
  });

  it("DrawTHREEGraphVerticesMutable uses the color argument and is opaque by default", async () => {
    const G = await makeGraph(2);
    const pts = pointsOf(ThreeWrapper.DrawTHREEGraphVerticesMutable(G, 1, 1, 0x0000ff).group);
    expect(Array.from(pts.geometry.getAttribute("customColor").array)).toEqual([0, 0, 1, 0, 0, 1]);
    expect(pts.material.transparent).toBe(false);
  });
});

describe("InteractionLayer", () => {
  it("drags nodes when hover is disabled", async () => {
    const G = await makeGraph(1);
    const scene = new THREE.Scene();
    scene.add(ThreeWrapper.DrawTHREEBoxBasedVertices(G, 1, 0xffffff, 10));
    scene.updateMatrixWorld();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.set(0, 0, 100);
    camera.updateMatrixWorld();

    const dom = Object.assign(new EventTarget(), { offsetWidth: 100, offsetHeight: 100 });
    const onNodeDrag = vi.fn();
    new InteractionLayer(scene, camera, dom as unknown as HTMLElement, G, {
      graph: G,
      hoverEnabled: false,
      enableNodeDrag: true,
      onNodeDrag,
    });
    const pointer = (type: string, x: number, y: number) =>
      dom.dispatchEvent(Object.assign(new Event(type), { button: 0, offsetX: x, offsetY: y }));

    pointer("pointerdown", 50, 50); // centre of the canvas: on the node at the origin
    pointer("pointermove", 75, 50);
    expect(onNodeDrag).toHaveBeenCalledTimes(1);
    const [nodeId, pos] = onNodeDrag.mock.calls[0];
    expect(nodeId).toBe(0);
    expect(pos.x).toBeGreaterThan(0);
  });
});

describe("edge drawing", () => {
  // Two horizontal edges, ids 7 (y = 10) and 9 (y = -10), each a 3-point polyline.
  async function twoEdgeGraph() {
    const nodes = new Map<number, _Node>();
    [[-20, 10], [20, 10], [-20, -10], [20, -10]].forEach(([x, y], i) =>
      nodes.set(i, new _Node({ pos: new Point(x, y, 0) }))
    );
    const G = await Graph.create(nodes, new Map([[7, new Edge(0, 1)], [9, new Edge(2, 3)]]));
    G.apply_edge_pos_maps(Drawing.DrawEdgeLinesDivisions(G, 2));
    return G;
  }

  function clickAt(group: THREE.Group, G: Graph, world: THREE.Vector3) {
    const scene = new THREE.Scene();
    scene.add(group);
    scene.updateMatrixWorld();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.set(0, 0, 100);
    camera.updateMatrixWorld();
    const dom = Object.assign(new EventTarget(), { offsetWidth: 100, offsetHeight: 100 });
    const onEdgeClick = vi.fn();
    const layer = new InteractionLayer(scene, camera, dom as unknown as HTMLElement, G, { graph: G, onEdgeClick });
    const ndc = world.clone().project(camera);
    const event = Object.assign(new Event("click"), { offsetX: (ndc.x + 1) * 50, offsetY: (1 - ndc.y) * 50 });
    dom.dispatchEvent(event);
    layer.dispose();
    scene.remove(group);
    return onEdgeClick.mock.calls.map((c) => c[0].edgeId);
  }

  it("thin edges are one LineSegments and clicks resolve the right edge", async () => {
    const G = await twoEdgeGraph();
    const group = ThreeWrapper.DrawTHREEGraphEdgesThin(G, 1, 0xffffff);
    expect(group.children).toHaveLength(1);
    expect(group.children[0]).toBeInstanceOf(THREE.LineSegments);
    expect(clickAt(group, G, new THREE.Vector3(15, -10, 0))).toEqual([9]);
    expect(clickAt(group, G, new THREE.Vector3(-15, 10, 0))).toEqual([7]);
  });

  it("thick edges are one mesh and clicks resolve the right edge", async () => {
    const G = await twoEdgeGraph();
    const group = ThreeWrapper.DrawTHREEGraphEdgesThick(G, 1, 0xffffff, 4);
    expect(group.children).toHaveLength(1);
    expect(clickAt(group, G, new THREE.Vector3(15, -10, 0))).toEqual([9]);
    expect(clickAt(group, G, new THREE.Vector3(-15, 10, 0))).toEqual([7]);
  });

  it("thick edges take their pixel scale from the renderer size", async () => {
    const G = await twoEdgeGraph();
    const mesh = ThreeWrapper.DrawTHREEGraphEdgesThick(G, 1, 0xffffff, 4).children[0] as THREE.Mesh<
      THREE.BufferGeometry,
      THREE.ShaderMaterial
    >;
    const renderer = { getSize: (v: THREE.Vector2) => v.set(1200, 500) } as unknown as THREE.WebGLRenderer;
    mesh.onBeforeRender(renderer, new THREE.Scene(), new THREE.Camera(), mesh.geometry, mesh.material, new THREE.Group());
    expect(mesh.material.uniforms.resolution.value.toArray()).toEqual([1200, 500]);
  });

  it("mutable thin edges follow moved nodes and added edges", async () => {
    const G = await twoEdgeGraph();
    const { group, updateEdges } = ThreeWrapper.DrawTHREEGraphEdgesThinMutable(G, 1, 0xffffff);
    expect(group.children).toHaveLength(1);

    // move edge 9 down to y = -30
    G.nodes.get(2)!.data.pos.y = -30;
    G.nodes.get(3)!.data.pos.y = -30;
    Drawing.UpdateEdgeLinesDivs(G, 2);
    updateEdges();
    expect(clickAt(group, G, new THREE.Vector3(15, -30, 0))).toEqual([9]);

    // add an edge crossing the middle vertically
    G.add_edge(0, 2, {});
    Drawing.UpdateEdgeLinesDivs(G, 2);
    updateEdges();
    const lines = group.children[0] as THREE.LineSegments;
    expect(lines.geometry.getAttribute("position").count).toBe(3 * 2 * 2);
  });
});
