/**
 * Billboarded thick-line material (screen-space width).
 * Adapted from the MeshLine approach: vertex shader expands the ribbon
 * in clip space so lines have consistent pixel width and always face the camera.
 */
import * as THREE from "three";
export interface MeshLineMaterialOptions {
    color?: number;
    lineWidth?: number;
    resolution?: THREE.Vector2;
}
/**
 * Material for billboarded thick lines. Width is in pixels (screen space).
 * Requires resolution uniform (canvas size) for correct scaling.
 */
export declare function createMeshLineMaterial(options?: MeshLineMaterialOptions): THREE.ShaderMaterial;
