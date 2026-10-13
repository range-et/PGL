/**
 * Billboarded thick-line material (screen-space width).
 * Adapted from the MeshLine approach: vertex shader expands the ribbon
 * in clip space so lines have consistent pixel width and always face the camera.
 */

import * as THREE from "three";

const MESHLINE_VERTEX = `
attribute vec3 positionPrev;
attribute vec3 positionNext;
attribute float side;

uniform vec2 resolution;
uniform float lineWidth;

void main() {
  vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vec4 clipPrev = projectionMatrix * modelViewMatrix * vec4(positionPrev, 1.0);
  vec4 clipNext = projectionMatrix * modelViewMatrix * vec4(positionNext, 1.0);

  // Work in screen pixels so the width is the same along x and y on non-square canvases
  vec2 halfRes = resolution * 0.5;
  vec2 screenPrev = clipPrev.xy / clipPrev.w * halfRes;
  vec2 screenNext = clipNext.xy / clipNext.w * halfRes;

  vec2 dir = screenNext - screenPrev;
  float len = length(dir);
  dir = len > 0.0 ? dir / len : vec2(1.0, 0.0);
  vec2 perp = vec2(-dir.y, dir.x);

  vec2 offsetNdc = perp * side * (lineWidth * 0.5) / halfRes;
  clipPos.xy += offsetNdc * clipPos.w;

  gl_Position = clipPos;
}
`;

const MESHLINE_FRAGMENT = `
uniform vec3 color;

void main() {
  gl_FragColor = vec4(color, 1.0);
}
`;

export interface MeshLineMaterialOptions {
  color?: number;
  lineWidth?: number;
  resolution?: THREE.Vector2;
}

/**
 * Material for billboarded thick lines. Width is in pixels (screen space).
 * The resolution uniform must hold the canvas size in CSS pixels (createThickEdgesGroup updates it before each render).
 */
export function createMeshLineMaterial(options: MeshLineMaterialOptions = {}): THREE.ShaderMaterial {
  const color = options.color ?? 0xffffff;
  const lineWidth = options.lineWidth ?? 2;
  const resolution = options.resolution ?? new THREE.Vector2(800, 700);

  const threeColor = new THREE.Color(color);
  return new THREE.ShaderMaterial({
    uniforms: {
      resolution: { value: resolution },
      lineWidth: { value: lineWidth },
      color: { value: new THREE.Vector3(threeColor.r, threeColor.g, threeColor.b) },
    },
    vertexShader: MESHLINE_VERTEX,
    fragmentShader: MESHLINE_FRAGMENT,
    transparent: false,
    depthTest: true,
    side: THREE.DoubleSide,
  });
}
