import { expect, it, vi, afterEach } from 'vitest';
import * as THREE from 'three';
import Graph from '../../Src/Core/Graph';
import _Node from '../../Src/Core/_Node';
import Edge from '../../Src/Core/Edge';
import Point from '../../Src/HelperClasses/Point';
import Line from '../../Src/HelperClasses/Line';
import GraphMethods from '../../Src/GraphAlgorithms/GraphMethods';
import Drawing from '../../Src/Drawing/Drawing';
import Three from '../../Src/Drawing/ThreeJSDrawer';
import { buildMeshLineGeometry } from '../../Src/Drawing/MeshLineGeometry';
import { createMeshLineMaterial } from '../../Src/Drawing/MeshLineMaterial';
import { createThickEdgesGroup } from '../../Src/Drawing/ThickLine';
import Hierarchy from '../../Src/Hierarchy';
import Data from '../../Src/SampleData/DataLoader';
import { createKamadaKawai3D, createStressSGD3D } from '../../Src/Simulation';
import { buildOctree, computeRepulsionForce } from '../../Src/Simulation/Octree';

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

it('graph APIs handle sparse/out-of-order edge IDs, dangling endpoints and optional drawing maps', async () => {
  const g = await Graph.create(new Map([[1, new _Node()]]), new Map([[9, new Edge(1, 99)], [3, new Edge(98, 1)]]));
  expect([...g.get_adjacency_matrix().matrix]).toEqual([0]);
  expect(g.remove_edge(9)).toBe(true);
  expect(g.remove_edge(3)).toBe(true);
  g.add_node(2, new _Node({ pos: new Point(1, 2, 3) }));
  expect(g.nodes.get(2)!.data.pos).toEqual(new Point(1, 2, 3));
  g.apply_drawing_maps({});
  const log = vi.spyOn(console, 'log').mockImplementation(() => {});
  g.printData();
  expect(log).toHaveBeenCalledWith('This is a graph with 2 nodes and 0 edges');
  expect(await GraphMethods.BFSSearch(g, 99)).toEqual(new Map([[99, -1]]));
  vi.spyOn(Math, 'random').mockReturnValue(0);
  expect(await GraphMethods.GraphDiameter(g)).toEqual({ start: 1, end: 1, distance: 0 });
});

it('drawing tolerates zero/string/negative node parameters and plots fully connected tiers', async () => {
  const g = await Graph.create(new Map([[0, new _Node({ pos: new Point(1, 2, 3), score: '4' })], [1, new _Node({ pos: new Point(4, 5, 6), score: -1 })], [2, new _Node({ pos: new Point(7, 8, 9) })]]), new Map([[0, new Edge(0, 1)], [1, new Edge(1, 2)]]));
  Drawing.DisplaceVertices(g, 'score', 10);
  expect([...g.get_position_map().values()].map(p => p.y)).toEqual([10, 0, 0]);
  Drawing.DisplaceVertices(g, 'missing', 10);
  expect([...g.get_position_map().values()].map(p => p.y)).toEqual([0, 0, 0]);
  const layout = await Drawing.HivePlot(g, 0, 1, new Point(2, 3, 4));
  expect(layout.pmap.get(0)).toEqual(new Point(2, 3, 4));
  expect(Drawing.DrawEdgeLinesDivisions(g, 1).size).toBe(2);
});

it('mesh lines handle large indices, empty paths, legacy widths and material defaults', () => {
  const points = Array.from({ length: 32769 }, (_, i) => new THREE.Vector3(i, 0, 0));
  const geometry = buildMeshLineGeometry([points]);
  expect(geometry.index!.array).toBeInstanceOf(Uint32Array);
  expect(geometry.index!.array[geometry.index!.array.length - 1]).toBe(65537);
  const defaults = createMeshLineMaterial();
  expect(defaults.uniforms.lineWidth.value).toBe(2);
  expect(defaults.uniforms.color.value.toArray()).toEqual([1, 1, 1]);
  const resolution = new THREE.Vector2(100, 200);
  expect(createMeshLineMaterial({ resolution }).uniforms.resolution.value).toBe(resolution);
  expect(createThickEdgesGroup(new Map([[0, new Line([])]]), 1, 0).children).toHaveLength(0);
  const edges = new Map([[0, new Line([new Point(0, 0, 0), new Point(1, 2, 3)])]]);
  const mesh = createThickEdgesGroup(edges, 1, 0, 0.03).children[0] as THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;
  expect(mesh.material.uniforms.lineWidth.value).toBe(3);
  expect(createThickEdgesGroup(edges, 1, 0).children).toHaveLength(1);
});

it('custom clustering skips unmapped edge endpoints and retains supplied centroids', async () => {
  const g = await Graph.create(new Map([[0, new _Node()], [1, new _Node()]]), new Map([[0, new Edge(0, 1)]]));
  const result = await Hierarchy.clusterByStrategy(g, { cluster: () => ({ nodeToCluster: new Map([[0, 4]]), clusterIds: [4], clusterCentroids: new Map([[4, new Point(1, 2, 3)]]) }) }, {});
  expect(result.nodes.get(4)!.data.pos).toEqual(new Point(1, 2, 3));
  expect(result.edges.size).toBe(0);
});

it('parsers skip short rows and invalid faces without shifting source vertex numbering', async () => {
  expect((await Data.LoadGraphFromEdgeListText('4\n# ignore\n')).nodes.size).toBe(0);
  const { graph, positions } = await Data.LoadGraphFromObjText('# mesh\nv bad 0 0\nv 1 2 3\nv 4 5 6\nv 7 8 9\nf 2 3 4\nf 1 3 4\nf 0 2 3\nf 2 2 3\nignored\n');
  expect([...positions]).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  expect(graph.nodes.size).toBe(3);
  expect(graph.edges.size).toBe(3);
});

it('simulations handle missing graph endpoints, coincident coordinates and one-epoch schedules', async () => {
  const g = await Graph.create(new Map([[0, new _Node()], [1, new _Node()]]), new Map([[0, new Edge(0, 99)], [1, new Edge(0, 1)]]));
  const kamada = createKamadaKawai3D(g, { simulationBound: 0, useOctree: false });
  kamada.step(0); expect([...kamada.getPositions()]).toEqual([0, 0, 0, 0, 0, 0]);
  const stress = await createStressSGD3D(g, { tMax: 1, dimensions: 3, initialPositions: new Float32Array(6), scaleBound: 1 });
  stress.step(0); expect([...stress.getPositions()]).toEqual([0, 0, 0, 0, 0, 0]);
  const random3d = await createStressSGD3D(g, { dimensions: 3, seed: 2 });
  expect(random3d.getPositions()[2]).not.toBe(0);
  await expect(createStressSGD3D(g, { dimensions: 4 as 3 })).rejects.toThrow(RangeError);
  expect(buildOctree([], 0, 0, 0, 1)).toBeNull();
  const out = { fx: 1, fy: 2, fz: 3 };
  computeRepulsionForce(null, 0, 0, 0, 0, 1, 1, out);
  expect(out).toEqual({ fx: 1, fy: 2, fz: 3 });
});

it('vertex representations support all size variants, string groups and absent color attributes', async () => {
  vi.stubGlobal('document', { createElementNS: () => new EventTarget() });
  const g = await Graph.create(new Map([[1, new _Node({ pos: new Point(1, 2, 3), group: '2' })], [2, new _Node({ pos: new Point(3, 4, 5) })]]), new Map());
  const points = Three.DrawTHREEGraphVertices(g, 1, [2, 3]);
  expect([...(points.children[0] as THREE.Points).geometry.getAttribute('size').array]).toEqual([2, 3]);
  expect(Three.AddBoxBasedImaging(g.get_position_map(), 1, 0xffffff, [2, 3]).children).toHaveLength(1);
  expect(Three.DrawTHREEBoxBasedVerticesMutable(g).group.children).toHaveLength(1);
  expect(Three.AddCylinderBasedImaging(g.get_position_map()).children).toHaveLength(2);
  expect([...(await Three.AddInModularityBasedPointGroups(g, 'group')).nodeGroups.keys()]).toEqual([2]);
  Three.ChangeTheVertexColours(new THREE.Group(), [1], 0);
  const empty = new THREE.Points();
  Three.ChangeTheVertexColours(empty, [1], 0);
  Three.ResetVertexColors(empty);
  const geom = (points.children[0] as THREE.Points).geometry;
  geom.setAttribute('customColor', new THREE.Float32BufferAttribute([1, 1, 1], 3));
  Three.ChangeTheVertexColours(points, [2], 0xff0000);
  expect([...geom.getAttribute('customColor').array]).toEqual([1, 1, 1]);
  Three.ResetVertexColors(points.children[0] as THREE.Points);
});

it('random position maps preserve sparse node IDs, bounds and independent points', () => {
  vi.spyOn(Math, 'random').mockReturnValueOnce(0.1).mockReturnValueOnce(0.2).mockReturnValueOnce(0.3).mockReturnValueOnce(0.4);
  const g = new Graph(new Map([[7, new _Node()], [12, new _Node()]]), new Map());
  const positions = Drawing.InstanciateRandomPositions(g);
  expect([...positions]).toEqual([[7, new Point(20, 0, 40)], [12, new Point(60, 0, 80)]]);
  expect(g.get_position_map().size).toBe(0);
});
