import { expect, it, vi, afterEach } from 'vitest';
import Utilities from '../../Src/HelperClasses/Utilities';
import Geometry from '../../Src/HelperClasses/GeometryHelpers';
import Point from '../../Src/HelperClasses/Point';
import { hexToRgb } from '../../Src/HelperClasses/ColorHelper';
import Constructors from '../../Src/HelperClasses/GraphConstructors';
import Models from '../../Src/Models/ErdosRenyiModel';
import GraphMethods from '../../Src/GraphAlgorithms/GraphMethods';

afterEach(() => vi.restoreAllMocks());

it('samples without replacement, handles limits, and leaves input unchanged', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.5);
  const values = [1, 2, 3, 4, 5];
  expect(Utilities.getRandomSubset(values, 0)).toEqual([]);
  expect(Utilities.getRandomSubset(values, 3)).toEqual([2, 5, 3]);
  expect(Utilities.getRandomSubset(values, 5).sort()).toEqual(values);
  expect(values).toEqual([1, 2, 3, 4, 5]);
  expect(() => Utilities.getRandomSubset(values, 6)).toThrow(RangeError);
  const map = new Map([[1, 'a'], [2, 'b']]);
  expect(Utilities.getRandomSubset_map(map, 0)).toEqual(new Map());
  expect(Utilities.getRandomSubset_map(map, 1)).toEqual(map);
  expect(Utilities.getRandomSubset_map(map, 0.5)).toEqual(new Map());
});

it('parses shorthand, mixed case and invalid colors', () => {
  expect(hexToRgb('#aF3')).toEqual({ r: 170, g: 255, b: 51 });
  expect(hexToRgb('123')).toEqual({ r: 17, g: 34, b: 51 });
  for (const value of ['#xyz', '#12345', 'x123456', '1234567', '']) expect(hexToRgb(value)).toBeNull();
});

it('distance-based lines have the documented subdivision density', () => {
  const line = Geometry.line_from_start_end_distance(new Point(1, 2, 3), new Point(7, 10, 3), 3);
  expect(line.points).toHaveLength(6);
  expect(line.points[0]).toEqual(new Point(1, 2, 3));
  expect(line.points[5]).toEqual(new Point(7, 10, 3));
});

it('constructs node/edge lists and measures exact tree diameters', async () => {
  vi.spyOn(Math, 'random').mockReturnValue(0);
  const graph = await Constructors.ConstructGraphNodeEdgesList([10, 20, 30, 40], [[10, 20], [20, 30], [20, 40]]);
  expect([...graph.nodes.keys()]).toEqual([10, 20, 30, 40]);
  expect([...graph.edges.values()].map(e => [e.start, e.end])).toEqual([[10, 20], [20, 30], [20, 40]]);
  expect(graph.nodes.get(20)!.neighbours).toEqual([10, 30, 40]);
  expect(await GraphMethods.GraphDiameter(graph)).toEqual({ start: 30, end: 10, distance: 2 });
  const empty = await Constructors.ConstructGraphNodeEdgesList([], []);
  expect(await GraphMethods.GraphDiameter(empty)).toEqual({ start: 0, end: 0, distance: 0 });
  const singleton = await Constructors.ConstructGraphNodeEdgesList([7], []);
  expect(await GraphMethods.GraphDiameter(singleton)).toEqual({ start: 7, end: 7, distance: 0 });
});

it('Erdos-Renyi respects zero/full probability and strict probability boundaries', async () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.5);
  expect((await Models.GenerateErdosReyni_n_p(4, 0.5)).edges.size).toBe(0);
  const complete = await Models.GenerateErdosReyni_n_p(4, 1);
  expect([...complete.nodes.keys()]).toEqual([0, 1, 2, 3]);
  expect([...complete.edges.values()].map(e => [e.start, e.end])).toEqual([[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]]);
  expect((await Models.GenerateErdosReyni_n_p(0, 1)).nodes.size).toBe(0);
});
