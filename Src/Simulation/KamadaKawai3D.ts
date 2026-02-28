import Graph from "../Core/Graph";
import Point from "../HelperClasses/Point";
import * as glMatrix from "gl-matrix";
import {
  buildOctree,
  computeRepulsionForce,
  type OctreePoint,
} from "./Octree";

const { vec3 } = glMatrix;

export interface KamadaKawai3DOptions {
  /** Bounds for initial random positions (default 1000) */
  simulationBound?: number;
  /** Attraction to neighbors (default 1) */
  cohesionValue?: number;
  /** Repulsion strength (default 1) */
  repulsionValue?: number;
  /** Center pull strength (default 0.1) */
  centerPull?: number;
  /** Iterations per step(dt) call (default 1) */
  iterationsPerStep?: number;
  /** Use octree (Barnes-Hut) for repulsion when n >= octreeThreshold (default true) */
  useOctree?: boolean;
  /** Min nodes to use octree (default 64). Below this, exact O(n²) is used. */
  octreeThreshold?: number;
  /** Barnes-Hut theta: smaller = more accurate, larger = faster (default 0.8) */
  octreeTheta?: number;
}

const DEFAULT_OPTIONS: Required<KamadaKawai3DOptions> = {
  simulationBound: 1000,
  cohesionValue: 1,
  repulsionValue: 1,
  centerPull: 0.1,
  iterationsPerStep: 1,
  useOctree: true,
  octreeThreshold: 64,
  octreeTheta: 0.8,
};

export interface KamadaKawai3DSimulation {
  step(deltaTime: number): void;
  getPositions(): Float32Array;
  getPositionMap(): Map<number, Point>;
}

/**
 * Creates a 3D Kamada-Kawai-style simulation (neighbor attraction + repulsion + center pull).
 * Use step(dt) in your animation loop and getPositions() to update the drawer.
 */
export function createKamadaKawai3D(
  graph: Graph,
  options: KamadaKawai3DOptions = {}
): KamadaKawai3DSimulation {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const nodeIds = graph.get_node_ids_order();
  const n = nodeIds.length;
  const adj = graph.get_adjacency();
  const idToIndex = new Map<number, number>();
  nodeIds.forEach((id, i) => idToIndex.set(id, i));

  const positions = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    positions[i * 3] = Math.random() * opts.simulationBound;
    positions[i * 3 + 1] = Math.random() * opts.simulationBound;
    positions[i * 3 + 2] = Math.random() * opts.simulationBound;
  }

  const scratch = {
    force: vec3.create(),
    diff: vec3.create(),
    neighborAvg: vec3.create(),
    posI: vec3.create(),
    posJ: vec3.create(),
  };

  const useOctree =
    opts.useOctree && n >= opts.octreeThreshold;
  const octreePoints: OctreePoint[] = useOctree
    ? Array.from({ length: n }, (_, i) => ({
        x: 0,
        y: 0,
        z: 0,
        index: i,
      }))
    : [];

  function step(_deltaTime: number): void {
    const iters = Math.max(1, opts.iterationsPerStep);
    for (let iter = 0; iter < iters; iter++) {
      let octree: ReturnType<typeof buildOctree> | null = null;
      if (useOctree) {
        let minX = Infinity, minY = Infinity, minZ = Infinity;
        let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
        for (let i = 0; i < n; i++) {
          const x = positions[i * 3];
          const y = positions[i * 3 + 1];
          const z = positions[i * 3 + 2];
          octreePoints[i].x = x;
          octreePoints[i].y = y;
          octreePoints[i].z = z;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          if (z < minZ) minZ = z;
          if (z > maxZ) maxZ = z;
        }
        const pad = 1e-6;
        const size = Math.max(maxX - minX, maxY - minY, maxZ - minZ, pad) / 2 + pad;
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        const cz = (minZ + maxZ) / 2;
        octree = buildOctree(
          octreePoints,
          cx - size,
          cy - size,
          cz - size,
          size
        );
      }

      for (let i = 0; i < n; i++) {
        vec3.set(
          scratch.posI,
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2]
        );
        vec3.set(scratch.force, 0, 0, 0);

        const neighbours = adj.get(nodeIds[i]) ?? [];
        if (neighbours.length > 0) {
          scratch.neighborAvg[0] = 0;
          scratch.neighborAvg[1] = 0;
          scratch.neighborAvg[2] = 0;
          for (const nbId of neighbours) {
            const j = idToIndex.get(nbId);
            if (j === undefined) continue;
            scratch.neighborAvg[0] += positions[j * 3];
            scratch.neighborAvg[1] += positions[j * 3 + 1];
            scratch.neighborAvg[2] += positions[j * 3 + 2];
          }
          scratch.neighborAvg[0] /= neighbours.length;
          scratch.neighborAvg[1] /= neighbours.length;
          scratch.neighborAvg[2] /= neighbours.length;
          vec3.subtract(scratch.diff, scratch.neighborAvg, scratch.posI);
          vec3.scale(scratch.diff, scratch.diff, opts.cohesionValue);
          vec3.add(scratch.force, scratch.force, scratch.diff);
        }

        if (useOctree && octree) {
          const rep = { fx: 0, fy: 0, fz: 0 };
          computeRepulsionForce(
            octree,
            scratch.posI[0],
            scratch.posI[1],
            scratch.posI[2],
            i,
            opts.repulsionValue,
            opts.octreeTheta,
            rep
          );
          scratch.force[0] += rep.fx;
          scratch.force[1] += rep.fy;
          scratch.force[2] += rep.fz;
        } else {
          for (let j = 0; j < n; j++) {
            if (j === i) continue;
            vec3.set(
              scratch.posJ,
              positions[j * 3],
              positions[j * 3 + 1],
              positions[j * 3 + 2]
            );
            vec3.subtract(scratch.diff, scratch.posJ, scratch.posI);
            const lenSq = vec3.squaredLength(scratch.diff);
            if (lenSq < 1e-10) continue;
            vec3.scale(scratch.diff, scratch.diff, opts.repulsionValue / lenSq);
            vec3.subtract(scratch.force, scratch.force, scratch.diff);
          }
        }

        scratch.force[0] -= opts.centerPull * scratch.posI[0];
        scratch.force[1] -= opts.centerPull * scratch.posI[1];
        scratch.force[2] -= opts.centerPull * scratch.posI[2];

        positions[i * 3] += scratch.force[0];
        positions[i * 3 + 1] += scratch.force[1];
        positions[i * 3 + 2] += scratch.force[2];
      }
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
