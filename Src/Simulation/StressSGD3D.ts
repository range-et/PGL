import Graph from "../Core/Graph";
import Point from "../HelperClasses/Point";
import * as glMatrix from "gl-matrix";
import GraphMethods from "../GraphAlgorithms/GraphMethods";

const { vec3 } = glMatrix;

export interface StressSGD3DOptions {
  /** Optional. Layout in 2D (x,y only; z=0) or 3D. Omit or set to 2 for a proper flat shape (like s_gd2); set to 3 for 3D (can collapse to a line). Default 2. */
  dimensions?: 2 | 3;
  /** Bounds for initial random positions (default 100) */
  simulationBound?: number;
  /** Number of random pair updates per step(dt) (default 50) */
  iterationsPerStep?: number;
  /** Pull each node toward origin (default 0). Nonzero values shrink the layout and can collapse to a point; use 0 and rely on re-centering below. */
  centerPull?: number;
  /** After each step, re-center and clamp scale to this (default 150, 0 = disable) */
  scaleBound?: number;
  /** Use s_gd2-style schedule (default true). If false, uses fixed learningRate. */
  useSchedule?: boolean;
  /** Fixed learning rate when useSchedule is false (default 0.08) */
  learningRate?: number;
  /** Schedule: number of epochs for eta decay (default 80). See s_gd2 t_max. */
  tMax?: number;
  /** Schedule: minimum eta = eps/w_max (default 0.01). See s_gd2 eps. */
  eps?: number;
  /** How much to advance the schedule per step(dt). Lower = slower convergence (default 0.25). Use 1 for original speed. */
  scheduleSpeed?: number;
  /** Optional initial positions (n*3 floats, same order as graph node ids). Use e.g. mesh positions for 3D so layout refines from a known shape instead of random (avoids collapse to line). */
  initialPositions?: Float32Array;
}

const DEFAULT_OPTIONS: Omit<Required<StressSGD3DOptions>, "initialPositions"> = {
  dimensions: 2,
  simulationBound: 100,
  iterationsPerStep: 50,
  centerPull: 0,
  scaleBound: 150,
  useSchedule: true,
  learningRate: 0.08,
  tMax: 80,
  eps: 0.01,
  scheduleSpeed: 0.25,
};

export interface StressSGD3DSimulation {
  step(deltaTime: number): void;
  getPositions(): Float32Array;
  getPositionMap(): Map<number, Point>;
}

interface StressPair {
  i: number;
  j: number;
  d: number;
  w: number;
}

/** Compute all-pairs shortest path (hop count) and build stress pair list. */
async function computeStressPairs(
  graph: Graph,
  nodeIds: number[],
  idToIndex: Map<number, number>
): Promise<StressPair[]> {
  const n = nodeIds.length;
  const distFromSource: Map<number, Map<number, number>> = new Map();
  for (let si = 0; si < n; si++) {
    const srcId = nodeIds[si];
    const dmap = await GraphMethods.Dijkstra(graph, srcId);
    distFromSource.set(srcId, dmap);
  }

  const pairs: StressPair[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dmap = distFromSource.get(nodeIds[i]);
      if (!dmap) continue;
      const d = dmap.get(nodeIds[j]);
      if (d === undefined || d <= 0) continue;
      const w = 1 / (d * d);
      pairs.push({ i, j, d, w });
    }
  }
  return pairs;
}

/**
 * Creates a 3D stress-minimization simulation via stochastic gradient descent.
 *
 * **Methods from (sgd)² (Imperial College London):** This implementation follows the reference
 * implementation s_gd2 (https://github.com/jxz12/s_gd2): same step formula (mu cap,
 * r = mu*(mag-d)/(2*mag)) and exponential eta schedule (eta_max = 1/w_min, eta_min = eps/w_max)
 * as in the paper.
 *
 * @see Paper: Zheng, J. X., Pawar, S., Goodman, D. F. M. "Graph Drawing by Stochastic Gradient
 *   Descent." IEEE Trans. Visualization and Computer Graphics. arXiv:1710.04626
 * @see Reference implementation: (sgd)² at https://github.com/jxz12/s_gd2 (Imperial College London)
 *
 * Use step(dt) in your animation loop and getPositions() / getPositionMap() to update the drawer.
 */
export async function createStressSGD3D(
  graph: Graph,
  options: StressSGD3DOptions = {}
): Promise<StressSGD3DSimulation> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const nodeIds = graph.get_node_ids_order();
  const n = nodeIds.length;
  const idToIndex = new Map<number, number>();
  nodeIds.forEach((id, i) => idToIndex.set(id, i));

  const pairs = await computeStressPairs(graph, nodeIds, idToIndex);
  if (pairs.length === 0) {
    // Fallback: no pairs (e.g. disconnected or single node); still return valid simulation
  }

  // s_gd2-style schedule: eta_max = 1/w_min, eta_min = eps/w_max, eta(t) = eta_max * exp(-lambda*t)
  let wMin = Infinity;
  let wMax = -Infinity;
  for (const p of pairs) {
    if (p.w < wMin) wMin = p.w;
    if (p.w > wMax) wMax = p.w;
  }
  if (wMin <= 0 || wMax <= 0) wMin = 1;
  if (wMax <= 0) wMax = 1;
  const etaMax = 1 / wMin;
  const etaMin = opts.eps / wMax;
  const lambda =
    opts.tMax > 1 ? Math.log(etaMax / etaMin) / (opts.tMax - 1) : 0;
  const getEta = (t: number): number =>
    t >= opts.tMax ? etaMin : etaMax * Math.exp(-lambda * t);

  const dims = opts.dimensions;
  const positions = new Float32Array(n * 3);
  if (opts.initialPositions && opts.initialPositions.length >= n * 3) {
    positions.set(opts.initialPositions.subarray(0, n * 3));
    if (dims === 2) {
      for (let i = 0; i < n; i++) positions[i * 3 + 2] = 0;
    }
  } else {
    for (let i = 0; i < n; i++) {
      positions[i * 3] = (Math.random() * 2 - 1) * opts.simulationBound;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * opts.simulationBound;
      positions[i * 3 + 2] = dims === 2 ? 0 : (Math.random() * 2 - 1) * opts.simulationBound;
    }
  }

  let scheduleStepIndex = 0;
  const scratch = {
    pi: vec3.create(),
    pj: vec3.create(),
    diff: vec3.create(),
    centroid: vec3.create(),
  };
  const eps = 1e-10;

  function step(_deltaTime: number): void {
    const iters = Math.max(1, opts.iterationsPerStep);
    const eta = opts.useSchedule
      ? getEta(scheduleStepIndex)
      : opts.learningRate;
    scheduleStepIndex += opts.scheduleSpeed;

    for (let k = 0; k < iters; k++) {
      if (pairs.length === 0) break;
      const pair = pairs[Math.floor(Math.random() * pairs.length)];
      const { i, j, d, w } = pair;
      vec3.set(scratch.pi, positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      vec3.set(scratch.pj, positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
      vec3.subtract(scratch.diff, scratch.pj, scratch.pi);
      if (dims === 2) scratch.diff[2] = 0;
      const mag = Math.max(vec3.length(scratch.diff), eps);
      // s_gd2 step: mu = eta*w_ij (cap at 1), r = mu*(mag-d)/(2*mag), then i -= r*diff, j += r*diff
      let mu = eta * w;
      if (mu > 1) mu = 1;
      const r = (mu * (mag - d)) / (2 * mag);
      vec3.scale(scratch.diff, scratch.diff, r);
      positions[i * 3] -= scratch.diff[0];
      positions[i * 3 + 1] -= scratch.diff[1];
      if (dims === 3) positions[i * 3 + 2] -= scratch.diff[2];
      positions[j * 3] += scratch.diff[0];
      positions[j * 3 + 1] += scratch.diff[1];
      if (dims === 3) positions[j * 3 + 2] += scratch.diff[2];
    }

    // Optional shrink toward origin (not used by s_gd2; usually leave 0 or layout collapses)
    if (opts.centerPull > 0) {
      for (let i = 0; i < n; i++) {
        positions[i * 3] -= opts.centerPull * positions[i * 3];
        positions[i * 3 + 1] -= opts.centerPull * positions[i * 3 + 1];
        if (dims === 3) positions[i * 3 + 2] -= opts.centerPull * positions[i * 3 + 2];
      }
    }

    // Re-center (subtract centroid) and optionally clamp scale so layout doesn't drift or explode
    if (opts.scaleBound > 0 && n > 0) {
      scratch.centroid[0] = 0;
      scratch.centroid[1] = 0;
      scratch.centroid[2] = 0;
      for (let i = 0; i < n; i++) {
        scratch.centroid[0] += positions[i * 3];
        scratch.centroid[1] += positions[i * 3 + 1];
        scratch.centroid[2] += positions[i * 3 + 2];
      }
      scratch.centroid[0] /= n;
      scratch.centroid[1] /= n;
      scratch.centroid[2] /= n;
      let maxDist = 0;
      for (let i = 0; i < n; i++) {
        positions[i * 3] -= scratch.centroid[0];
        positions[i * 3 + 1] -= scratch.centroid[1];
        positions[i * 3 + 2] -= scratch.centroid[2];
        const dist = Math.sqrt(
          positions[i * 3] * positions[i * 3] +
          positions[i * 3 + 1] * positions[i * 3 + 1] +
          (dims === 3 ? positions[i * 3 + 2] * positions[i * 3 + 2] : 0)
        );
        if (dist > maxDist) maxDist = dist;
      }
      if (maxDist > opts.scaleBound) {
        const s = opts.scaleBound / maxDist;
        for (let i = 0; i < n * 3; i++) positions[i] *= s;
      }
    }

    // Keep 2D layout flat: force z=0 so it never collapses to a vertical line
    if (dims === 2) {
      for (let i = 0; i < n; i++) positions[i * 3 + 2] = 0;
    }
  }

  function getPositions(): Float32Array {
    return positions;
  }

  function getPositionMap(): Map<number, Point> {
    const map = new Map<number, Point>();
    for (let i = 0; i < n; i++) {
      map.set(
        nodeIds[i],
        new Point(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
      );
    }
    return map;
  }

  return { step, getPositions, getPositionMap };
}
