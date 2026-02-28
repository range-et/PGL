import { default as Graph } from '../Core/Graph';
import { default as Point } from '../HelperClasses/Point';
export interface StressSGD3DOptions {
    /** Bounds for initial random positions (default 100) */
    simulationBound?: number;
    /** SGD learning rate (default 0.15) */
    learningRate?: number;
    /** Number of random pair updates per step(dt) (default 50) */
    iterationsPerStep?: number;
}
export interface StressSGD3DSimulation {
    step(deltaTime: number): void;
    getPositions(): Float32Array;
    getPositionMap(): Map<number, Point>;
}
/**
 * Creates a 3D stress-minimization simulation via stochastic gradient descent
 * (Graph Drawing by SGD, arXiv:1710.04626). Uses graph-theoretic distances and
 * minimizes stress E = sum w_ij (d_ij - ||p_i - p_j||)^2. Use step(dt) in your
 * animation loop and getPositions() / getPositionMap() to update the drawer.
 */
export declare function createStressSGD3D(graph: Graph, options?: StressSGD3DOptions): Promise<StressSGD3DSimulation>;
