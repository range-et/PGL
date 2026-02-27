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

  vec2 ndcCurr = clipPos.xy / clipPos.w;
  vec2 ndcPrev = clipPrev.xy / clipPrev.w;
  vec2 ndcNext = clipNext.xy / clipNext.w;

  vec2 dir = normalize(ndcNext - ndcPrev);
  vec2 perp = vec2(-dir.y, dir.x);

  float w = clipPos.w;
  float pixelScale = min(resolution.x, resolution.y);
  float ndcPerPixel = 2.0 / pixelScale;
  vec2 offsetNdc = perp * side * (lineWidth * 0.5 * ndcPerPixel);
  clipPos.xy += offsetNdc * w;

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
 * Requires resolution uniform (canvas size) for correct scaling.
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
