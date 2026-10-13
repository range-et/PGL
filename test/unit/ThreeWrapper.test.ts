import { describe, it, expect, vi, beforeAll } from "vitest";
import * as THREE from "three";
import Graph from "../../Src/Core/Graph";
import _Node from "../../Src/Core/_Node";
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
