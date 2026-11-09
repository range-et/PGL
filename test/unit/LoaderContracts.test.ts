import { expect, it } from 'vitest';
import Data from '../../Src/SampleData/DataLoader';

it('edge-list parsing skips malformed/non-safe IDs without inventing truncated nodes', async () => {
  const graph = await Data.LoadGraphFromEdgeListText('# comment\r\n  -2\t7\r\n7 42\n1x 9\n1.5 8\n9007199254740992 3\n\n');
  expect([...graph.nodes.keys()]).toEqual([-2, 7, 42]);
  expect([...graph.edges.values()].map(e => [e.start, e.end])).toEqual([[-2, 7], [7, 42]]);
});
it('OBJ parser rejects non-finite coordinates and faces with invalid vertex references', async () => {
  const { graph, positions } = await Data.LoadGraphFromObjText(
    'v\t0 0 0\nv 1 0 0\nv 0 1 0\nv Infinity 2 3\nv nope 0 0\nf 1/1 2/2 3/3\nf 1 2 99\nf 1 2x 3\n',
  );
  expect([...positions]).toEqual([0, 0, 0, 1, 0, 0, 0, 1, 0]);
  expect([...graph.nodes.keys()]).toEqual([0, 1, 2]);
  expect([...graph.edges.values()].map(e => [e.start, e.end])).toEqual([[0, 1], [1, 2], [0, 2]]);
});
it('bundled datasets provide connected adjacency and distinct node objects', async () => {
  const graph = await Data.LoadZKC();
  expect(graph.nodes.size).toBe(34);
  expect(graph.edges.size).toBe(78);
  expect(graph.nodes.get(0)!.neighbours).toContain(1);
  const simulated = await Data.LoadZKCSimulated();
  expect(simulated.nodes.size).toBe(34);
  expect(simulated.get_position_map().size).toBe(34);
  expect(simulated.get_edge_map().size).toBe(simulated.edges.size);
  for (const line of simulated.get_edge_map().values()) {
    expect(line.points.every(p => Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.z))).toBe(true);
  }
});
