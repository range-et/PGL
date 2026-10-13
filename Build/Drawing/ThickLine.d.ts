import { default as Line } from '../HelperClasses/Line';
/**
 * Internal thick-line drawing: billboarded mesh-line (ribbon with screen-space width).
 * No dependency on Three.js examples; geometry and material are maintained in-house.
 * Based on the MeshLine approach (see e.g. threejs-meshline / THREE.MeshLine).
 */
import * as THREE from "three";
/**
 * Create thick lines for every edge in an edge map as one mesh (one draw call).
 * Lines are billboarded and drawn with the given pixel width; the width follows the
 * renderer's canvas size.
 *
 * The mesh is pickable: raycasts hit the edge centre lines (using the Raycaster's Line
 * threshold) and report `index` = 2 × segment; `userData.segmentEdgeIds[segment]` is the edge ID.
 *
 * @param edgeMap - Map of edge id to Line
 * @param bounds - Scale factor for coordinates
 * @param color - Hex color for all lines
 * @param thickness - Line width in pixels (values below 1 are treated as legacy units × 100)
 * @returns THREE.Group containing a single mesh (empty if no edge has 2+ points)
 */
export declare function createThickEdgesGroup(edgeMap: Map<number, Line>, bounds: number, color: number, thickness?: number): THREE.Group;
