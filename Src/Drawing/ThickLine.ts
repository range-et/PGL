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

/**
 * Convert legacy thickness (world-unit style 0.02, 0.03) to pixel width for screen-space lines.
 */
function toPixelWidth(thickness: number): number {
  if (thickness >= 1) return Math.max(1, Math.round(thickness));
  return Math.max(1, Math.round(thickness * 100));
}

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
export function createThickEdgesGroup(
  edgeMap: Map<number, Line>,
  bounds: number,
  color: number,
  thickness: number = DEFAULT_LINE_WIDTH_PX
): THREE.Group {
  const polylines: THREE.Vector3[][] = [];
  const segmentPositions: number[] = [];
  const segmentEdgeIds: number[] = [];
  for (const [edgeId, line] of edgeMap.entries()) {
    if (!line?.points || line.points.length < 2) continue;
    const pts = line.points.map((p) => new THREE.Vector3(p.x * bounds, p.y * bounds, p.z * bounds));
    polylines.push(pts);
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      segmentPositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
      segmentEdgeIds.push(edgeId);
    }
  }

  const group = new THREE.Group();
  if (polylines.length === 0) return group;

  const material = createMeshLineMaterial({ color, lineWidth: toPixelWidth(thickness) });
  const mesh = new THREE.Mesh(buildMeshLineGeometry(polylines), material);
  mesh.userData = { segmentEdgeIds };

  // The ribbon gets its width in the vertex shader, so its triangles have zero area on the CPU
  // and can never be hit. Raycast against the centre lines instead.
  const pickLines = new THREE.LineSegments(
    new THREE.BufferGeometry().setAttribute(
      "position",
      new THREE.Float32BufferAttribute(segmentPositions, 3)
    )
  );
  mesh.raycast = (raycaster, intersects) => {
    pickLines.matrixWorld.copy(mesh.matrixWorld);
    const hits: THREE.Intersection[] = [];
    pickLines.raycast(raycaster, hits);
    for (const hit of hits) intersects.push({ ...hit, object: mesh });
  };

  // Keep the pixel width correct for the actual canvas size.
  mesh.onBeforeRender = (renderer) => {
    renderer.getSize(material.uniforms.resolution.value);
  };

  group.add(mesh);
  return group;
}
