import Graph from "../Core/Graph";
import Point from "../HelperClasses/Point";

export interface StressSGD3DOptions {
  /** Layout in 2D (x,y only; z=0) or 3D. Default 2. Matches s_gd2 reference. */
  dimensions?: 2 | 3;
  /** Scale for initial random positions in [0,1] (default 1). Reference uses [0,1]; multiply for visibility. */
  simulationBound?: number;
  /** Number of epochs per step(dt) (default 1). Each epoch processes all pairs once in random order. */
  epochsPerStep?: number;
  /** Pull each node toward origin (default 0). Not in reference. */
  centerPull?: number;
  /** After each step, re-center and clamp scale (default 0 = disable). Not in reference; add for visualization. */
  scaleBound?: number;
  /** Use s_gd2 schedule (default true). */
  useSchedule?: boolean;
  /** Fixed eta when useSchedule is false (default 0.08). */
  learningRate?: number;
  /** Schedule: number of epochs for eta decay (default 80). Reference t_max. */
  tMax?: number;
  /** Schedule: eta_min = eps/w_max (default 0.01). Reference eps. */
  eps?: number;
  /** Optional initial positions (n*3 floats). Use e.g. mesh positions for 3D. */
  initialPositions?: Float32Array;
  /** Blend toward initial positions each step (0–1). Use ~0.1–0.2 for meshes to preserve 3D shape. Default 0. */
  initialPreservation?: number;
  /** Random seed for reproducibility (default: random). */
  seed?: number;
}

const DEFAULT_OPTIONS: Omit<Required<StressSGD3DOptions>, "initialPositions" | "seed"> = {
  dimensions: 2,
  simulationBound: 1,
  epochsPerStep: 1,
  centerPull: 0,
  scaleBound: 0,
  useSchedule: true,
  learningRate: 0.08,
  tMax: 80,
  eps: 0.01,
  initialPreservation: 0,
};

export interface StressSGD3DSimulation {
  step(deltaTime: number): void;
  getPositions(): Float32Array;
  getPositionMap(): Map<number, Point>;
}

/** Stress terms in typed arrays (12 bytes per pair instead of an object per pair). */
interface StressPairs {
  i: Uint32Array;
  j: Uint32Array;
  /** hop distance between i and j */
  d: Float32Array;
}

/** Fisher-Yates shuffle of the pair arrays (matches reference fisheryates_shuffle). */
function fisherYatesShuffle(pairs: StressPairs, rng: () => number): void {
  const { i: I, j: J, d: D } = pairs;
  for (let a = D.length - 1; a >= 1; a--) {
    const b = Math.floor(rng() * (a + 1));
    let t = I[a]; I[a] = I[b]; I[b] = t;
    t = J[a]; J[a] = J[b]; J[b] = t;
    const td = D[a]; D[a] = D[b]; D[b] = td;
  }
}

/**
 * Simple LCG (mod 2^31) for reproducible random numbers in [0, 1).
 * Math.imul keeps the multiply exact; a plain `*` loses low bits above 2^53 and the
 * sequence then repeats after ~10k values.
 * @internal exported for tests
 */
export function createRng(seed: number): () => number {
  let s = seed & 0x7fffffff;
  return () => {
    s = (Math.imul(s, 1103515245) + 12345) & 0x7fffffff;
    return s / 0x80000000;
  };
}

/**
 * All-pairs hop distances by one BFS per node over an index-based adjacency list,
 * kept as (i, j, d) terms for each connected pair i < j. Matches reference bfs().
 */
function computeStressPairs(
  graph: Graph,
  nodeIds: number[],
  idToIndex: Map<number, number>
): StressPairs {
  const n = nodeIds.length;
  const adjMap = graph.get_adjacency();
  const neighbours: Uint32Array[] = nodeIds.map((id) => {
    const out: number[] = [];
    for (const nb of adjMap.get(id) ?? []) {
      const j = idToIndex.get(nb);
      if (j !== undefined) out.push(j);
    }
    return Uint32Array.from(out);
  });

  const dist = new Int32Array(n);
  const queue = new Uint32Array(n);
  const bfs = (source: number): void => {
    dist.fill(-1);
    dist[source] = 0;
    queue[0] = source;
    for (let head = 0, tail = 1; head < tail; head++) {
      const u = queue[head];
      for (const v of neighbours[u]) {
        if (dist[v] === -1) {
          dist[v] = dist[u] + 1;
          queue[tail++] = v;
        }
      }
    }
  };

  // Connected pairs = sum of c(c-1)/2 over component sizes c; lets the arrays be allocated once.
  const component = new Int32Array(n).fill(-1);
  let pairCount = 0;
  for (let s = 0; s < n; s++) {
    if (component[s] !== -1) continue;
    bfs(s);
    let size = 0;
    for (let t = 0; t < n; t++) {
      if (dist[t] >= 0) {
        component[t] = s;
        size++;
      }
    }
    pairCount += (size * (size - 1)) / 2;
  }

  const pairs: StressPairs = {
    i: new Uint32Array(pairCount),
    j: new Uint32Array(pairCount),
    d: new Float32Array(pairCount),
  };
  let k = 0;
  for (let s = 0; s < n; s++) {
    bfs(s);
    for (let t = s + 1; t < n; t++) {
      if (dist[t] > 0) {
        pairs.i[k] = s;
        pairs.j[k] = t;
        pairs.d[k] = dist[t];
        k++;
      }
    }
  }
  return pairs;
}

/**
 * Creates a stress-minimization simulation via stochastic gradient descent.
 * Faithful port of s_gd2 reference (https://github.com/jxz12/s_gd2):
 * - Epoch-based: each step does full epoch(s) with Fisher-Yates shuffle
 * - Step formula: r = mu*(mag-d)/(2*mag), i -= r*diff, j += r*diff (diff = X_i - X_j)
 * - Schedule: eta(t) = eta_max * exp(-lambda*t)
 *
 * @see Paper: Zheng, J. X., Pawar, S., Goodman, D. F. M. "Graph Drawing by Stochastic Gradient
 *   Descent." IEEE Trans. Visualization and Computer Graphics. arXiv:1710.04626
 * @see Reference: reference/s_gd2/cpp/s_gd2/layout.cpp
 */
export async function createStressSGD3D(
  graph: Graph,
  options: StressSGD3DOptions = {}
): Promise<StressSGD3DSimulation> {
  const opts = {
    ...DEFAULT_OPTIONS,
    ...options,
    seed: options.seed ?? Math.floor(Math.random() * 0x7fffffff),
  };
  const nodeIds = graph.get_node_ids_order();
  const n = nodeIds.length;
  const idToIndex = new Map<number, number>();
  nodeIds.forEach((id, i) => idToIndex.set(id, i));

  const pairs = computeStressPairs(graph, nodeIds, idToIndex);
  const pairCount = pairs.d.length;

  // Reference schedule: eta_max = 1/w_min, eta_min = eps/w_max, eta(t) = eta_max * exp(-lambda*t)
  // with w = 1/d^2
  let wMin = Infinity;
  let wMax = -Infinity;
  for (let k = 0; k < pairCount; k++) {
    const w = 1 / (pairs.d[k] * pairs.d[k]);
    if (w < wMin) wMin = w;
    if (w > wMax) wMax = w;
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
  const rng = createRng(opts.seed);
  const positions = new Float32Array(n * 3);

  let initialPositionsBackup: Float32Array | null = null;
  if (opts.initialPositions && opts.initialPositions.length >= n * 3) {
    positions.set(opts.initialPositions.subarray(0, n * 3));
    if (opts.initialPreservation > 0) {
      initialPositionsBackup = new Float32Array(opts.initialPositions.subarray(0, n * 3));
    }
    if (dims === 2) {
      for (let i = 0; i < n; i++) positions[i * 3 + 2] = 0;
    }
  } else {
    // Reference: X = np.random.rand(n, 2) or (n, 3) — uniform in [0,1]
    const scale = opts.simulationBound;
    for (let i = 0; i < n; i++) {
      positions[i * 3] = rng() * scale;
      positions[i * 3 + 1] = rng() * scale;
      positions[i * 3 + 2] = dims === 2 ? 0 : rng() * scale;
    }
  }

  let epochIndex = 0;
  const magEps = 1e-12;

  function step(_deltaTime: number): void {
    const epochs = Math.max(1, opts.epochsPerStep);
    const epochsBefore = epochIndex;
    for (let ep = 0; ep < epochs && epochIndex < opts.tMax; ep++) {
      const eta = opts.useSchedule ? getEta(epochIndex) : opts.learningRate;
      epochIndex++;

      // Fisher-Yates shuffle (reference: fisheryates_shuffle)
      fisherYatesShuffle(pairs, rng);

      // Process all pairs in shuffled order (reference: for each term)
      for (let k = 0; k < pairCount; k++) {
        const i = pairs.i[k];
        const j = pairs.j[k];
        const d = pairs.d[k];
        let mu = eta / (d * d);
        if (mu > 1) mu = 1;

        // diff = X_i - X_j (reference: dx = X[i*2]-X[j*2], ...)
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = dims === 3 ? positions[i * 3 + 2] - positions[j * 3 + 2] : 0;
        const mag = Math.max(Math.sqrt(dx * dx + dy * dy + dz * dz), magEps);

        const r = (mu * (mag - d)) / (2 * mag);

        // Reference: X[i] -= r*diff, X[j] += r*diff
        positions[i * 3] -= r * dx;
        positions[i * 3 + 1] -= r * dy;
        if (dims === 3) positions[i * 3 + 2] -= r * dz;
        positions[j * 3] += r * dx;
        positions[j * 3 + 1] += r * dy;
        if (dims === 3) positions[j * 3 + 2] += r * dz;
      }
    }
    // Schedule finished: the layout is final. Without this, centerPull and initialPreservation
    // kept moving positions on every later step (collapsing to the origin / reverting to the input).
    if (epochIndex === epochsBefore) return;

    // Blend toward initial positions (preserves 3D mesh shape when using initialPositions)
    if (opts.initialPreservation > 0 && initialPositionsBackup) {
      const p = opts.initialPreservation;
      for (let i = 0; i < n * 3; i++) {
        positions[i] = (1 - p) * positions[i] + p * initialPositionsBackup[i];
      }
    }

    if (opts.centerPull > 0) {
      for (let i = 0; i < n; i++) {
        positions[i * 3] -= opts.centerPull * positions[i * 3];
        positions[i * 3 + 1] -= opts.centerPull * positions[i * 3 + 1];
        if (dims === 3) positions[i * 3 + 2] -= opts.centerPull * positions[i * 3 + 2];
      }
    }

    // Optional re-center and scale clamp (not in reference; for visualization)
    if (opts.scaleBound > 0 && n > 0) {
      let cx = 0, cy = 0, cz = 0;
      for (let i = 0; i < n; i++) {
        cx += positions[i * 3];
        cy += positions[i * 3 + 1];
        cz += positions[i * 3 + 2];
      }
      cx /= n; cy /= n; cz /= n;
      let maxDist = 0;
      for (let i = 0; i < n; i++) {
        positions[i * 3] -= cx;
        positions[i * 3 + 1] -= cy;
        positions[i * 3 + 2] -= cz;
        const dist = Math.sqrt(
          positions[i * 3] ** 2 + positions[i * 3 + 1] ** 2 +
          (dims === 3 ? positions[i * 3 + 2] ** 2 : 0)
        );
        if (dist > maxDist) maxDist = dist;
      }
      // Scale to fit scaleBound (both up and down)
      if (maxDist > 0) {
        const s = opts.scaleBound / maxDist;
        for (let i = 0; i < n * 3; i++) positions[i] *= s;
      }
    }

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
