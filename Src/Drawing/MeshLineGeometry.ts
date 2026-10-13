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
export function buildMeshLineGeometry(polylines: THREE.Vector3[][]): THREE.BufferGeometry {
  let vertexCount = 0;
  let indexCount = 0;
  for (const line of polylines) {
    if (line.length < 2) continue;
    vertexCount += line.length * 2;
    indexCount += (line.length - 1) * 6;
  }

  const posArr = new Float32Array(vertexCount * 3);
  const prevArr = new Float32Array(vertexCount * 3);
  const nextArr = new Float32Array(vertexCount * 3);
  const sideArr = new Float32Array(vertexCount);
  const indices = vertexCount > 65535 ? new Uint32Array(indexCount) : new Uint16Array(indexCount);

  let v = 0; // vertex cursor
  let k = 0; // index cursor
  for (const line of polylines) {
    const n = line.length;
    if (n < 2) continue;
    const first = v;
    for (let i = 0; i < n; i++) {
      const p = line[i];
      // prev/next stay within this polyline so separate lines are never joined
      const pPrev = i > 0 ? line[i - 1] : p;
      const pNext = i < n - 1 ? line[i + 1] : p;
      for (let side = -1; side <= 1; side += 2) {
        const o = v * 3;
        posArr[o] = p.x; posArr[o + 1] = p.y; posArr[o + 2] = p.z;
        prevArr[o] = pPrev.x; prevArr[o + 1] = pPrev.y; prevArr[o + 2] = pPrev.z;
        nextArr[o] = pNext.x; nextArr[o + 1] = pNext.y; nextArr[o + 2] = pNext.z;
        sideArr[v] = side;
        v++;
      }
    }
    // each segment is a quad: triangles (a, a+1, a+2) and (a+2, a+1, a+3)
    for (let i = 0; i < n - 1; i++) {
      const a = first + i * 2;
      indices[k++] = a; indices[k++] = a + 1; indices[k++] = a + 2;
      indices[k++] = a + 2; indices[k++] = a + 1; indices[k++] = a + 3;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
  geometry.setAttribute("positionPrev", new THREE.BufferAttribute(prevArr, 3));
  geometry.setAttribute("positionNext", new THREE.BufferAttribute(nextArr, 3));
  geometry.setAttribute("side", new THREE.BufferAttribute(sideArr, 1));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeBoundingSphere();

  return geometry;
}
