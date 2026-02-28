import { default as Graph } from '../Core/Graph';
import { default as Point } from '../HelperClasses/Point';
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
export interface StressSGD3DSimulation {
    step(deltaTime: number): void;
    getPositions(): Float32Array;
    getPositionMap(): Map<number, Point>;
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
export declare function createStressSGD3D(graph: Graph, options?: StressSGD3DOptions): Promise<StressSGD3DSimulation>;
