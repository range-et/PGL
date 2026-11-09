import { expect, it, vi, afterEach } from 'vitest';
import * as THREE from 'three';
import { GraphDrawer3d } from '../../Src/Drawing/GraphDrawer';
import Graph from '../../Src/Core/Graph';

vi.mock('three', async importOriginal => {
  const actual = await importOriginal<typeof import('three')>();
  return { ...actual, WebGLRenderer: class {
    domElement = new EventTarget();
    setSize = vi.fn(); setClearColor = vi.fn(); render = vi.fn();
  } };
});
vi.mock('three/examples/jsm/controls/OrbitControls', () => ({
  OrbitControls: class { update = vi.fn(); },
}));
afterEach(() => vi.restoreAllMocks());

it('initializes the scene/camera/renderer, renders and tears down interaction listeners', async () => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  const drawer = new GraphDrawer3d({ canvas: {} as HTMLCanvasElement, width: 600, height: 400 });
  expect(drawer.graphs.size).toBe(0);
  expect(drawer.geometryMap.size).toBe(0);
  expect(drawer.materialMap.size).toBe(0);
  expect(drawer.meshMap.size).toBe(0);
  await drawer.init();
  expect(drawer.renderer.setSize).toHaveBeenCalledWith(600, 400);
  expect(drawer.renderer.setClearColor).toHaveBeenCalledWith(0xff00ff, 0);
  expect(drawer.camera.aspect).toBe(1.5);
  expect(drawer.camera.position.toArray()).toEqual([0, 100, 100]);
  expect(drawer.controls.autoRotate).toBe(true);
  expect(drawer.controls.maxPolarAngle).toBe(Math.PI / 2);
  expect(drawer.controls.maxDistance).toBe(10000);
  expect(drawer.controls.minDistance).toBe(10);
  expect(drawer.scene.children.map(c => c.type)).toEqual(['AmbientLight', 'DirectionalLight']);
  expect(drawer.scene.children[1].position.toArray()).toEqual([0, 10, 0]);
  const group = new THREE.Group();
  drawer.addVisElement(group);
  expect(drawer.scene.children).toContain(group);
  drawer.rendercall();
  expect(drawer.renderer.render).toHaveBeenCalledWith(drawer.scene, drawer.camera);
  expect(drawer.controls.update).toHaveBeenCalledTimes(2);
  drawer.enableInteraction({ graph: new Graph(new Map(), new Map()) });
  const previous = drawer.interactionLayer!;
  const dispose = vi.spyOn(previous, 'dispose');
  drawer.enableInteraction({ graph: new Graph(new Map(), new Map()) });
  expect(dispose).toHaveBeenCalledOnce();
  const remove = vi.spyOn(drawer.renderer.domElement, 'removeEventListener');
  drawer.disableInteraction();
  expect(remove).toHaveBeenCalled();
  expect(drawer.interactionLayer).toBeUndefined();
  expect(() => drawer.disableInteraction()).not.toThrow();
});
