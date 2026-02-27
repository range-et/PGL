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
export function buildMeshLineGeometry(positions: THREE.Vector3[]): THREE.BufferGeometry {
  const n = positions.length;
  if (n < 2) {
    return new THREE.BufferGeometry();
  }

  const posArr: number[] = [];
  const prevArr: number[] = [];
  const nextArr: number[] = [];
  const sideArr: number[] = [];

  for (let i = 0; i < n; i++) {
    const p = positions[i];
    const pPrev = i > 0 ? positions[i - 1] : p;
    const pNext = i < n - 1 ? positions[i + 1] : p;

    // Left edge vertex
    posArr.push(p.x, p.y, p.z);
    prevArr.push(pPrev.x, pPrev.y, pPrev.z);
    nextArr.push(pNext.x, pNext.y, pNext.z);
    sideArr.push(-1);

    // Right edge vertex
    posArr.push(p.x, p.y, p.z);
    prevArr.push(pPrev.x, pPrev.y, pPrev.z);
    nextArr.push(pNext.x, pNext.y, pNext.z);
    sideArr.push(1);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(posArr, 3));
  geometry.setAttribute("positionPrev", new THREE.Float32BufferAttribute(prevArr, 3));
  geometry.setAttribute("positionNext", new THREE.Float32BufferAttribute(nextArr, 3));
  geometry.setAttribute("side", new THREE.Float32BufferAttribute(sideArr, 1));

  // Triangle list: each quad (segment) = two triangles (0,1,2) and (2,1,3)
  const indices: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 2, a + 1, a + 3);
  }
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();

  return geometry;
}
