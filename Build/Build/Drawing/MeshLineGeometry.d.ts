/**
 * Ribbon geometry for billboarded thick lines (MeshLine-style).
 * Each line point becomes two vertices (left/right edge); the material
 * expands them in screen space so the line has visible thickness.
 */
import * as THREE from "three";
/**
 * Build a BufferGeometry for one polyline as a ribbon (strip of quads).
 * Attributes: position, positionPrev, positionNext, side.
 */
export declare function buildMeshLineGeometry(positions: THREE.Vector3[]): THREE.BufferGeometry;
