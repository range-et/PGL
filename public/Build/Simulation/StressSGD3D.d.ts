import { default as Graph } from '../Core/Graph';
import { default as Point } from '../HelperClasses/Point';
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
export interface StressSGD3DSimulation {
    step(deltaTime: number): void;
    getPositions(): Float32Array;
    getPositionMap(): Map<number, Point>;
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
export declare function createStressSGD3D(graph: Graph, options?: StressSGD3DOptions): Promise<StressSGD3DSimulation>;
