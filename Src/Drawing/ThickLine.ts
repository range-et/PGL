/**
 * Internal thick-line drawing: billboarded mesh-line (ribbon with screen-space width).
 * No dependency on Three.js examples; geometry and material are maintained in-house.
 * Based on the MeshLine approach (see e.g. threejs-meshline / THREE.MeshLine).
 */

import * as THREE from "three";
import type Line from "../HelperClasses/Line";
import { buildMeshLineGeometry } from "./MeshLineGeometry";
import { createMeshLineMaterial } from "./MeshLineMaterial";

/** Default line width in pixels (screen space) */
const DEFAULT_LINE_WIDTH_PX = 2;
/** Default resolution for material (canvas size); can be updated on resize */
const DEFAULT_RESOLUTION = new THREE.Vector2(800, 700);

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
export function createThickLineMesh(
  line: Line,
  bounds: number,
  color: number,
  lineWidthPx: number = DEFAULT_LINE_WIDTH_PX,
  resolution?: THREE.Vector2
): THREE.Mesh {
  if (line.points.length < 2) {
    const geo = new THREE.BufferGeometry();
    return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color }));
  }

  const positions = line.points.map(
    (p) => new THREE.Vector3(p.x * bounds, p.y * bounds, p.z * bounds)
  );
  const geometry = buildMeshLineGeometry(positions);
  const material = createMeshLineMaterial({
    color,
    lineWidth: lineWidthPx,
    resolution: resolution ?? DEFAULT_RESOLUTION,
  });
  return new THREE.Mesh(geometry, material);
}

/**
 * Create a group of thick line meshes from an edge map.
 * Lines are billboarded and drawn with the given pixel width.
 *
 * @param edgeMap - Map of edge id to Line
 * @param bounds - Scale factor for coordinates
 * @param color - Hex color for all lines
 * @param lineWidthPx - Line width in pixels (screen space); default 2
 * @param resolution - Canvas size (optional, for correct pixel scaling)
 * @returns THREE.Group containing one mesh per edge
 */
/**
 * Convert legacy thickness (world-unit style 0.02, 0.03) to pixel width for screen-space lines.
 */
function toPixelWidth(thickness: number): number {
  if (thickness >= 1) return Math.max(1, Math.round(thickness));
  return Math.max(1, Math.round(thickness * 100));
}

export function createThickEdgesGroup(
  edgeMap: Map<number, Line>,
  bounds: number,
  color: number,
  thickness: number = DEFAULT_LINE_WIDTH_PX,
  resolution?: THREE.Vector2
): THREE.Group {
  const lineWidthPx = toPixelWidth(thickness);
  const group = new THREE.Group();
  for (const line of edgeMap.values()) {
    if (!line?.points || line.points.length < 2) continue;
    group.add(createThickLineMesh(line, bounds, color, lineWidthPx, resolution));
  }
  return group;
}
