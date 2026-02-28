/**
 * Plebeian Graph Library (PGL) — NetworkX-style graph visualization in JavaScript/TypeScript.
 *
 * @packageDocumentation
 *
 * ## Quick start
 *
 * ```ts
 * import * as PGL from "plebeiangraphlibrary";
 * const graph = await PGL.SampleData.LoadZKCSimulated();
 * const graph3d = new PGL.GraphDrawer.GraphDrawer3d({ graph, width: 800, height: 700, canvas });
 * await graph3d.init();
 * graph3d.addVisElement(PGL.ThreeWrapper.DrawTHREEBoxBasedVertices(graph, 1, 0xffffff, 5));
 * graph3d.addVisElement(PGL.ThreeWrapper.DrawTHREEGraphEdgesThick(graph, 1, 0xffafcc, 0.02));
 * ```
 *
 * ## Core exports
 * - {@link Graph} — main graph class (nodes + edges)
 * - {@link createKamadaKawai3D} / {@link createStressSGD3D} — layout simulations
 * - `SampleData`, `Drawing`, `ThreeWrapper`, `GraphDrawer` — data loaders and visualization
 */
export { Graph, _Node, Edge } from './Core';
export { GraphMethods } from './GraphAlgorithms';
export { SampleData } from './SampleData';
export { default as Constructors } from './HelperClasses/GraphConstructors';
export { default as Drawing } from './Drawing/Drawing';
export { default as Geometry } from './HelperClasses/GeometryHelpers';
export { default as Utilities } from './HelperClasses/Utilities';
export { default as ThreeWrapper } from './Drawing/ThreeJSDrawer';
export { default as GraphDrawer } from './Drawing/GraphDrawer';
export { Models } from './Models';
export { default as Hierarchy } from './Hierarchy';
export { default as Point } from './HelperClasses/Point';
export { default as Line } from './HelperClasses/Line';
export type { PointLike } from './HelperClasses/Point';
export { matrixVectorMultiply, normalizeVector } from './MatrixHelpers';
export * as glMatrix from 'gl-matrix';
export { createKamadaKawai3D, createStressSGD3D } from './Simulation';
export type { KamadaKawai3DOptions, StressSGD3DOptions, KamadaKawai3DSimulation, StressSGD3DSimulation, } from './Simulation';
export type { LoadGraphFromObjResult } from './SampleData';
export type { NodePickDetails, EdgePickDetails, InteractionOptions, } from './Drawing/InteractionLayer';
