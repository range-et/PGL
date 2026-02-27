import { default as Line } from '../HelperClasses/Line';
/**
 * Internal thick-line drawing: billboarded mesh-line (ribbon with screen-space width).
 * No dependency on Three.js examples; geometry and material are maintained in-house.
 * Based on the MeshLine approach (see e.g. threejs-meshline / THREE.MeshLine).
 */
import * as THREE from "three";
/**
 * Create a single thick line mesh from a Line (array of points).
 * Uses a ribbon geometry + shader material so the line is billboarded
 * and has consistent pixel width on screen.
 *
 * @param line - Line with .points (Point[])
 * @param bounds - Scale factor applied to point coordinates (same as thin lines)
 * @param color - Hex color
 * @param lineWidthPx - Line width in pixels (screen space)
 * @param resolution - Canvas size for correct scaling (optional)
 * @returns A Three.js Mesh that can be added to the scene
 */
export declare function createThickLineMesh(line: Line, bounds: number, color: number, lineWidthPx?: number, resolution?: THREE.Vector2): THREE.Mesh;
export declare function createThickEdgesGroup(edgeMap: Map<number, Line>, bounds: number, color: number, thickness?: number, resolution?: THREE.Vector2): THREE.Group;
