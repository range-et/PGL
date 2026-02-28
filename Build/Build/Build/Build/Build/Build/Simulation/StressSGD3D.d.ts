import { default as Graph } from '../Core/Graph';
import { default as Point } from '../HelperClasses/Point';
export interface StressSGD3DOptions {
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
}
export interface StressSGD3DSimulation {
    step(deltaTime: number): void;
    getPositions(): Float32Array;
    getPositionMap(): Map<number, Point>;
}
/**
 * Creates a 3D stress-minimization simulation via stochastic gradient descent
 * (Graph Drawing by SGD, arXiv:1710.04626). Aligned with the reference implementation
 * (https://github.com/jxz12/s_gd2): same step formula (mu cap, r = mu*(mag-d)/(2*mag))
 * and optional exponential eta schedule (eta_max = 1/w_min, eta_min = eps/w_max).
 * Use step(dt) in your animation loop and getPositions() / getPositionMap() to update the drawer.
 */
export declare function createStressSGD3D(graph: Graph, options?: StressSGD3DOptions): Promise<StressSGD3DSimulation>;
