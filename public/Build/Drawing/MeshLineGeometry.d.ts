/**
 * Ribbon geometry for billboarded thick lines (MeshLine-style).
 * Each line point becomes two vertices (left/right edge); the material
 * expands them in screen space so the line has visible thickness.
 */
import * as THREE from "three";
/**
 * Build one BufferGeometry holding a ribbon (strip of quads) for every polyline,
 * so any number of lines can be drawn with a single draw call.
 * Attributes: position, positionPrev, positionNext, side.
 * Polylines with fewer than 2 points are skipped.
 */
export declare function buildMeshLineGeometry(polylines: THREE.Vector3[][]): THREE.BufferGeometry;
