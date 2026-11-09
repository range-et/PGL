import { expect, it, vi, afterEach } from 'vitest';
import * as THREE from 'three';
import Graph from '../../Src/Core/Graph';
import _Node from '../../Src/Core/_Node';
import Edge from '../../Src/Core/Edge';
import Point from '../../Src/HelperClasses/Point';
import { InteractionLayer, type InteractionOptions } from '../../Src/Drawing/InteractionLayer';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

afterEach(() => vi.restoreAllMocks());
function harness(extra: Partial<InteractionOptions> = {}) {
  const graph = new Graph(new Map([[7, new _Node({ pos: new Point(0, 0, 0) })]]), new Map([[9, new Edge(7, 8)]]));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  camera.position.z = 100; camera.updateMatrixWorld();
  const dom = Object.assign(new EventTarget(), {
    offsetWidth: 100, offsetHeight: 100,
    getBoundingClientRect: () => ({ left: 10, top: 20, width: 100, height: 100 }),
  });
  const listeners = vi.spyOn(dom, 'addEventListener');
  const options = { graph, onNodeClick: vi.fn(), onEdgeClick: vi.fn(), onNodeHover: vi.fn(), onEdgeHover: vi.fn(), ...extra };
  const hit = vi.spyOn(THREE.Raycaster.prototype, 'intersectObject').mockReturnValue([]);
  const layer = new InteractionLayer(scene, camera, dom as unknown as HTMLElement, graph, options);
  const event = (type: string, button = 0) => dom.dispatchEvent(Object.assign(new Event(type), { button, offsetX: 50, offsetY: 50 }));
  return { graph, options, hit, layer, event, listeners, dom };
}
function intersection(object: THREE.Object3D, distance = 1, index?: number, instanceId?: number): THREE.Intersection {
  return { object, distance, index, instanceId, point: new THREE.Vector3() };
}
function nodeHit(id = 7, distance = 1) {
  const geometry = new THREE.BufferGeometry().setAttribute('label', new THREE.Int32BufferAttribute([id], 1));
  return intersection(new THREE.Points(geometry), distance, 0);
}
function edgeHit(id = 9, distance = 2) {
  const object = new THREE.Object3D(); object.userData.edgeId = id;
  return intersection(object, distance);
}

it('picks the nearest node/edge, delivers detached neighbour details and resolves stale geometry safely', () => {
  const h = harness();
  h.graph.nodes.get(7)!.neighbours = [8];
  h.hit.mockReturnValue([nodeHit(), edgeHit()]); h.event('click');
  expect(h.options.onNodeClick).toHaveBeenCalledWith({ nodeId: 7, data: h.graph.nodes.get(7)!.data, neighbours: [8], position: new Point(0, 0, 0) });
  expect(h.options.onEdgeClick).not.toHaveBeenCalled();
  vi.mocked(h.options.onNodeClick!).mock.calls[0][0].neighbours.push(99);
  expect(h.graph.nodes.get(7)!.neighbours).toEqual([8]);
  h.hit.mockReturnValue([nodeHit(7, 3), edgeHit(9, 1)]); h.event('click');
  expect(h.options.onEdgeClick).toHaveBeenCalledWith({ edgeId: 9, start: 7, end: 8, data: {} });
  h.hit.mockReturnValue([nodeHit(99)]); h.event('click');
  expect(h.options.onNodeClick).toHaveBeenLastCalledWith({ nodeId: 99, data: {}, neighbours: [], position: undefined });
  h.graph.edges.get(9)!.data = undefined;
  h.hit.mockReturnValue([edgeHit()]); h.event('click');
  expect(h.options.onEdgeClick).toHaveBeenLastCalledWith({ edgeId: 9, start: 7, end: 8, data: {} });
  h.hit.mockReturnValue([edgeHit(999)]); h.event('click');
  expect(h.options.onEdgeClick).toHaveBeenCalledTimes(2);
  h.layer.dispose();
});

it('hover emits transitions once and clears on leaving nodes and edges', () => {
  const h = harness();
  h.hit.mockReturnValue([nodeHit()]); h.event('pointermove'); h.event('pointermove');
  expect(h.options.onNodeHover).toHaveBeenCalledTimes(1);
  h.hit.mockReturnValue([edgeHit()]); h.event('pointermove'); h.event('pointermove');
  expect(h.options.onNodeHover).toHaveBeenLastCalledWith(null);
  expect(h.options.onEdgeHover).toHaveBeenCalledTimes(1);
  h.hit.mockReturnValue([]); h.event('pointermove'); h.event('pointermove');
  expect(h.options.onEdgeHover).toHaveBeenLastCalledWith(null);
  h.hit.mockReturnValue([edgeHit(999)]); h.event('pointermove');
  expect(h.options.onEdgeHover).toHaveBeenCalledTimes(2);
  h.layer.dispose();
});

it('ignores geometry without valid labels or edge mapping and supports instanced IDs', () => {
  const h = harness();
  const geometry = new THREE.BufferGeometry().setAttribute('label', new THREE.Int32BufferAttribute([7], 1));
  const points = new THREE.Points(geometry);
  const boxes = new THREE.InstancedMesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial(), 1);
  const segment = new THREE.Object3D(); segment.userData.segmentEdgeIds = [9];
  const invalid = [intersection(new THREE.Points()), intersection(points), intersection(points, 1, 4), intersection(boxes, 1, undefined, 0), intersection(segment, 1, 4)];
  for (const hit of invalid) { h.hit.mockReturnValue([hit]); h.event('click'); }
  expect(h.options.onNodeClick).not.toHaveBeenCalled();
  expect(h.options.onEdgeClick).not.toHaveBeenCalled();
  boxes.userData.nodeIds = [7];
  h.hit.mockReturnValue([intersection(boxes, 1, undefined, 0)]); h.event('click');
  expect(h.options.onNodeClick).toHaveBeenCalledTimes(1);
  h.layer.dispose();
});

it('drag restores controls, suppresses the drag click and tolerates missing positions/ray misses', () => {
  const controls = { enabled: true } as OrbitControls;
  const onNodeDrag = vi.fn();
  const h = harness({ controls, enableNodeDrag: true, onNodeDrag });
  h.hit.mockReturnValue([nodeHit()]);
  h.event('pointerdown', 2); expect(controls.enabled).toBe(true);
  h.event('pointerup');
  h.event('pointerdown'); expect(controls.enabled).toBe(false);
  h.event('pointermove'); expect(onNodeDrag).toHaveBeenCalledOnce();
  h.event('pointerup'); expect(controls.enabled).toBe(true);
  h.event('click'); expect(h.options.onNodeClick).not.toHaveBeenCalled();
  h.event('click'); expect(h.options.onNodeClick).toHaveBeenCalledOnce();
  h.event('pointerdown');
  vi.spyOn(THREE.Ray.prototype, 'intersectPlane').mockReturnValue(null);
  h.event('pointermove'); expect(onNodeDrag).toHaveBeenCalledTimes(1);
  h.graph.nodes.get(7)!.data = {};
  h.event('pointermove'); expect(onNodeDrag).toHaveBeenCalledTimes(1);
  h.event('pointerleave');
  h.layer.dispose();
});

it('handles optional callbacks, disabled hover, and events originating from child elements', () => {
  const h = harness({ hoverEnabled: false, enableNodeDrag: true, onNodeDrag: vi.fn(), onNodeClick: undefined, onEdgeClick: undefined, onNodeHover: undefined, onEdgeHover: undefined });
  h.event('pointermove'); // not dragging; disabled hover must not raycast
  expect(h.hit).not.toHaveBeenCalled();
  h.hit.mockReturnValue([nodeHit()]); h.event('click'); h.event('pointerdown'); h.event('pointerup');
  h.hit.mockReturnValue([edgeHit()]); h.event('pointerdown'); h.event('click');
  h.layer.dispose();
  const hover = harness({ onNodeHover: undefined, onEdgeHover: undefined });
  hover.hit.mockClear();
  const callback = hover.listeners.mock.calls.find(([type]) => type === 'pointermove')![1] as EventListener;
  callback(Object.assign(new Event('pointermove'), { clientX: 60, clientY: 70 }));
  expect(hover.hit).toHaveBeenCalledOnce();
  hover.layer.dispose();
  const disabled = harness({ hoverEnabled: false });
  expect(disabled.listeners.mock.calls.map(([name]) => name)).toEqual(['click']);
  disabled.layer.dispose();
});
