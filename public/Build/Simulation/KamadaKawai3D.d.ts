import { default as Graph } from '../Core/Graph';
import { default as Point } from '../HelperClasses/Point';
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
export interface KamadaKawai3DSimulation {
    step(deltaTime: number): void;
    getPositions(): Float32Array;
    getPositionMap(): Map<number, Point>;
}
/**
 * Creates a 3D Kamada-Kawai-style simulation (neighbor attraction + repulsion + center pull).
 * Use step(dt) in your animation loop and getPositions() to update the drawer.
 */
export declare function createKamadaKawai3D(graph: Graph, options?: KamadaKawai3DOptions): KamadaKawai3DSimulation;
