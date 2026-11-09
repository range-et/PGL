import { expect, it, vi, beforeEach, afterEach } from 'vitest';
import * as THREE from 'three';
import Graph from '../../Src/Core/Graph';
import _Node from '../../Src/Core/_Node';
import Edge from '../../Src/Core/Edge';
import Point from '../../Src/HelperClasses/Point';
import Line from '../../Src/HelperClasses/Line';
import Drawing from '../../Src/Drawing/Drawing';
import Three from '../../Src/Drawing/ThreeJSDrawer';
import { buildMeshLineGeometry } from '../../Src/Drawing/MeshLineGeometry';

beforeEach(() => vi.stubGlobal('document', { createElementNS: () => new EventTarget() }));
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

async function graph() {
  return Graph.create(new Map([[7, new _Node({ pos: new Point(1, 2, 3), group: 1 })], [12, new _Node({ pos: new Point(4, 6, 8), group: 1 })]]), new Map([[9, new Edge(7, 12)]]));
}
function attr(group: THREE.Group, name: string) {
  return (group.children[0] as THREE.Points).geometry.getAttribute(name) as THREE.BufferAttribute;
}

it('graph movement accepts structural PointLike coordinates and moves every axis once', async () => {
  const g = await graph();
  g.nodes.get(7)!.data.pos = { x: 1, y: 2, z: 3 };
  g.apply_edge_pos_maps(new Map([[9, new Line([new Point(1, 2, 3), new Point(4, 5, 6)])]]));
  Drawing.MoveGraph(g, new Point(2, -1, 3));
  expect(g.get_position_map().get(7)).toEqual(new Point(3, 1, 6));
  expect(g.get_edge_map().get(9)!.points).toEqual([new Point(3, 1, 6), new Point(6, 4, 9)]);
});

it('vertical displacement preserves singleton and empty lines', () => {
  const displaced = Drawing.DisplaceEdgeInY(new Map([[0, new Line([])], [1, new Line([new Point(1, 2, 3)])]]), 10);
  expect(displaced.get(0)!.points).toEqual([]);
  expect(displaced.get(1)!.points).toEqual([new Point(1, 2, 3)]);
});

it('mutable point/box buffers preserve labels, scale, dimensions and update versions', async () => {
  const g = await graph();
  const points = Three.DrawTHREEGraphVerticesMutable(g, 2, [3, 5], 0xff0000, 0.5);
  expect([...attr(points.group, 'position').array]).toEqual([2, 4, 6, 8, 12, 16]);
  expect([...attr(points.group, 'label').array]).toEqual([7, 12]);
  expect([...attr(points.group, 'size').array]).toEqual([3, 5]);
  points.updatePositions(new Float32Array([2, 3, 4, 5, 6, 7]));
  expect([...attr(points.group, 'position').array]).toEqual([4, 6, 8, 10, 12, 14]);
  expect(attr(points.group, 'position').version).toBe(1);
  points.updatePositions(new Map([[7, new Point(-1, -2, -3)], [12, new Point(7, 8, 9)]]));
  expect([...attr(points.group, 'position').array]).toEqual([-2, -4, -6, 14, 16, 18]);
  const boxes = Three.DrawTHREEBoxBasedVerticesMutable(g, 3, 0x00ff00, [2, 4]);
  const mesh = boxes.group.children[0] as THREE.InstancedMesh;
  expect(mesh.userData.nodeIds).toEqual([7, 12]);
  const matrix = new THREE.Matrix4();
  mesh.getMatrixAt(1, matrix);
  expect(matrix.elements).toEqual([4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 4, 0, 12, 18, 24, 1]);
  boxes.updatePositions(new Float32Array([2, 3, 4, 5, 6, 7]));
  mesh.getMatrixAt(0, matrix);
  expect(matrix.elements.slice(12, 15)).toEqual([6, 9, 12]);
  boxes.updatePositions(new Map([[7, new Point(7, 8, 9)], [12, new Point(1, 2, 3)]]));
  mesh.getMatrixAt(1, matrix);
  expect(matrix.elements).toEqual([4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 4, 0, 3, 6, 9, 1]);
  expect(mesh.instanceMatrix.version).toBe(3);
});

it('color changes use sparse labels, reset all channels and support unlabeled geometry', async () => {
  const group = Three.DrawTHREEGraphVertices(await graph(), 1, 2);
  Three.ChangeTheVertexColours(group, [12, 99], 0x0000ff);
  expect([...attr(group, 'customColor').array]).toEqual([1, 1, 1, 0, 0, 1]);
  Three.ResetVertexColors(group);
  expect([...attr(group, 'customColor').array]).toEqual([1, 1, 1, 1, 1, 1]);
  const points = group.children[0] as THREE.Points;
  points.geometry.deleteAttribute('label');
  Three.ChangeTheVertexColours(points, [0, 99], 0xff0000);
  expect([...attr(group, 'customColor').array]).toEqual([1, 0, 0, 1, 1, 1]);
  expect(attr(group, 'customColor').version).toBe(3);
  expect(() => Three.ResetVertexColors(new THREE.Group())).not.toThrow();
});

it('ribbons preserve separate polylines and vertex neighbors', () => {
  const a = new THREE.Vector3(1, 2, 3), b = new THREE.Vector3(4, 5, 6);
  const c = new THREE.Vector3(7, 8, 9), d = new THREE.Vector3(10, 11, 12);
  const geometry = buildMeshLineGeometry([[], [a], [a, b], [c, d]]);
  expect([...geometry.index!.array]).toEqual([0, 1, 2, 2, 1, 3, 4, 5, 6, 6, 5, 7]);
  expect([...geometry.getAttribute('side').array]).toEqual([-1, 1, -1, 1, -1, 1, -1, 1]);
  expect([...geometry.getAttribute('positionPrev').array]).toEqual([...a, ...a, ...a, ...a, ...c, ...c, ...c, ...c]);
  expect([...geometry.getAttribute('positionNext').array]).toEqual([...b, ...b, ...b, ...b, ...d, ...d, ...d, ...d]);
});

it('cylinders, paths, sampling and modularity groups preserve node membership', async () => {
  const g = await graph();
  const cylinders = Three.AddCylinderBasedImaging(g.get_position_map(), 2, 0xff0000, [2, 3]);
  expect(cylinders.children.map(c => c.position.toArray())).toEqual([[1, 2, 3], [4, 6, 8]]);
  expect(cylinders.children.map(c => (c as THREE.Mesh<THREE.CylinderGeometry>).geometry.parameters.radialSegments)).toEqual([7, 10]);
  expect(Three.DrawThickPathFromNodeIds(g, 1, [99]).children).toHaveLength(0);
  expect(Three.DrawThickPathFromNodeIds(g, 2, [7, 12]).children).toHaveLength(1);
  vi.spyOn(Math, 'random').mockReturnValue(0.5);
  expect(Three.DrawSimplifiedEdges(g, 0).children).toHaveLength(0);
  const lines = Three.DrawSimplifiedEdges(g, 1, 0x00ff00);
  expect([...attr(lines, 'position').array]).toEqual([1, 2, 3, 4, 6, 8]);
  const groups = await Three.AddInModularityBasedPointGroups(g, 'group');
  expect([...groups.nodeGroups.keys()]).toEqual([1]);
  expect([...attr(groups.nodeGroups.get(1)!, 'label').array]).toEqual([7, 12]);
});
