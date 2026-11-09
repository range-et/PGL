import { expect, it } from 'vitest';
import Graph from '../../Src/Core/Graph';
import _Node from '../../Src/Core/_Node';
import Point from '../../Src/HelperClasses/Point';
import Geometry from '../../Src/HelperClasses/GeometryHelpers';
import { pointsWithinRadius } from '../../Src/Hierarchy/KDTree';
import Models from '../../Src/Models/ErdosRenyiModel';
import { createKamadaKawai3D, createStressSGD3D } from '../../Src/Simulation';
import { matrixVectorMultiply, normalizeVector } from '../../Src/MatrixHelpers';

const origin = new Point(0, 0, 0);
const graph = new Graph(new Map([[0, new _Node()]]), new Map());

it.each([NaN, Infinity, -Infinity, -1])('rejects invalid spatial radius %s', radius => {
  expect(() => pointsWithinRadius([], radius)).toThrow(RangeError);
});
it('rejects non-finite points and invalid subdivision contracts', () => {
  expect(() => pointsWithinRadius([{ nodeId: 1, point: new Point(NaN, 0, 0) }], 1)).toThrow(RangeError);
  for (const divisions of [0, -1, 1.5, NaN]) {
    expect(() => Geometry.line_from_start_end_divisions(origin, origin, divisions)).toThrow(RangeError);
  }
  for (const distance of [0, -1, NaN]) {
    expect(() => Geometry.line_from_start_end_distance(origin, origin, distance)).toThrow(RangeError);
  }
  expect(() => Geometry.centroid([])).toThrow(RangeError);
});
it('rejects invalid random graph sizes and probabilities', async () => {
  for (const n of [-1, 1.5, NaN]) await expect(Models.GenerateErdosReyni_n_p(n, 0.5)).rejects.toThrow(RangeError);
  for (const p of [-1, 2, NaN]) await expect(Models.GenerateErdosReyni_n_p(2, p)).rejects.toThrow(RangeError);
});
it('rejects simulation options that would corrupt positions or run unbounded loops', async () => {
  expect(() => createKamadaKawai3D(graph, { simulationBound: NaN })).toThrow(RangeError);
  expect(() => createKamadaKawai3D(graph, { iterationsPerStep: Infinity })).toThrow(RangeError);
  expect(() => createKamadaKawai3D(graph, { iterationsPerStep: 1.5 })).toThrow(RangeError);
  await expect(createStressSGD3D(graph, { epochsPerStep: Infinity })).rejects.toThrow(RangeError);
  await expect(createStressSGD3D(graph, { tMax: 0 })).rejects.toThrow(RangeError);
  await expect(createStressSGD3D(graph, { initialPreservation: 2 })).rejects.toThrow(RangeError);
  await expect(createStressSGD3D(graph, { initialPositions: new Float32Array([0]) })).rejects.toThrow(RangeError);
  await expect(createStressSGD3D(graph, { initialPositions: new Float32Array([0, NaN, 0]) })).rejects.toThrow(RangeError);
});
it('rejects malformed matrix dimensions and non-finite vector values', () => {
  expect(() => matrixVectorMultiply(new Float32Array(3), 2, new Float32Array(2), new Float32Array(2))).toThrow(RangeError);
  expect(() => normalizeVector(new Float32Array([NaN]))).toThrow(RangeError);
});
