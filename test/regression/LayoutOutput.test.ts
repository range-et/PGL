import { expect, it, vi, afterEach } from 'vitest';
import Graph from '../../Src/Core/Graph';
import _Node from '../../Src/Core/_Node';
import Edge from '../../Src/Core/Edge';
import Point from '../../Src/HelperClasses/Point';
import Drawing from '../../Src/Drawing/Drawing';
import { createKamadaKawai3D, createStressSGD3D } from '../../Src/Simulation';
import { createRng } from '../../Src/Simulation/StressSGD3D';

afterEach(() => vi.restoreAllMocks());
async function graph() {
  return Graph.create(new Map([2, 7, 11].map((id, i) => [id, new _Node({ pos: new Point(i + 1, i * 2, 3 - i), score: i })])),
    new Map([[3, new Edge(2, 7)], [5, new Edge(7, 11)]]));
}
const rounded = (values: Iterable<number>) => [...values].map(v => Number(v.toFixed(5)));

it('seeded simulations preserve reviewed numerical output across supported modes', async () => {
  const results: Record<string, number[]> = {};
  for (const dimensions of [2, 3] as const) for (const useSchedule of [false, true]) {
    const sim = await createStressSGD3D(await graph(), {
      seed: 17, dimensions, useSchedule, tMax: 4, epochsPerStep: 2,
      centerPull: 0.1, scaleBound: 3, initialPreservation: 0.2,
      initialPositions: new Float32Array([1, 2, 3, 4, 6, 8, 9, 8, 5]),
    });
    sim.step(0); sim.step(0);
    results[`stress-${dimensions}-${useSchedule}`] = rounded(sim.getPositions());
  }
  for (const useOctree of [false, true]) {
    vi.spyOn(Math, 'random').mockImplementation(createRng(19));
    const sim = createKamadaKawai3D(await graph(), { useOctree, octreeThreshold: 1, octreeTheta: 0, simulationBound: 10, iterationsPerStep: 2 });
    sim.step(0);
    results[`kamada-${useOctree}`] = rounded(sim.getPositions());
    expect([...sim.getPositionMap().keys()]).toEqual([2, 7, 11]);
    vi.restoreAllMocks();
  }
  expect(results).toMatchSnapshot();
});

it('legacy layout, displacement and edge updates preserve reviewed geometry', async () => {
  vi.spyOn(Math, 'random').mockImplementation(createRng(23));
  const g = await graph();
  const simulated = await Drawing.SimulateKamadaKawai(g, 2, 10, 0.3, 0.2);
  expect([...simulated].map(([id, p]) => [id, ...rounded([p.x, p.y, p.z])])).toMatchSnapshot('legacy-layout');
  Drawing.DisplaceVertices(g, 'score', 10);
  expect([...g.get_position_map()].map(([id, p]) => [id, p.x, p.y, p.z])).toEqual([[2, 1, 0, 3], [7, 2, 5, 2], [11, 3, 10, 1]]);
  Drawing.UpdateEdgeLinesDist(g, 4);
  const edges = Drawing.DisplaceEdgeInY(g.get_edge_map(), 3);
  const bundled = await Drawing.DrawEdgeBundling(edges, 2, 8);
  expect([...bundled].map(([id, line]) => [id, line.points.map(p => rounded([p.x, p.y, p.z]))])).toMatchSnapshot('bundled-lines');
});
