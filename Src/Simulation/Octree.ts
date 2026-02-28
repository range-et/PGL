/**
 * 3D Octree for Barnes-Hut approximation of n-body repulsion.
 * Reduces repulsion computation from O(n²) to O(n log n).
 */

export interface OctreePoint {
  x: number;
  y: number;
  z: number;
  index: number; // node index in positions array
}

export interface OctreeCell {
  cx: number;
  cy: number;
  cz: number;
  count: number;
  size: number; // half-width of the cell (cell spans 2*size)
  children: OctreeCell[] | null;
  point: OctreePoint | null; // only for leaf with single point
}

/**
 * Build an octree from points. Each leaf holds at most one point;
 * internal nodes store center of mass and count for Barnes-Hut.
 */
export function buildOctree(
  points: OctreePoint[],
  minX: number,
  minY: number,
  minZ: number,
  size: number
): OctreeCell | null {
  if (points.length === 0) return null;
  if (points.length === 1) {
    const p = points[0];
    return {
      cx: p.x,
      cy: p.y,
      cz: p.z,
      count: 1,
      size,
      children: null,
      point: p,
    };
  }

  const midX = minX + size;
  const midY = minY + size;
  const midZ = minZ + size;
  const half = size / 2;

  const octants: OctreePoint[][] = [[], [], [], [], [], [], [], []];
  for (const p of points) {
    let oct = 0;
    if (p.x >= midX) oct |= 1;
    if (p.y >= midY) oct |= 2;
    if (p.z >= midZ) oct |= 4;
    octants[oct].push(p);
  }

  let cx = 0, cy = 0, cz = 0;
  let count = 0;
  const children: OctreeCell[] = [];

  const offsets = [
    [0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0],
    [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1],
  ];

  for (let oct = 0; oct < 8; oct++) {
    const pts = octants[oct];
    if (pts.length === 0) continue;
    const [ox, oy, oz] = offsets[oct];
    const cminX = minX + ox * size;
    const cminY = minY + oy * size;
    const cminZ = minZ + oz * size;
    const child = buildOctree(pts, cminX, cminY, cminZ, half);
    if (child) {
      children.push(child);
      cx += child.cx * child.count;
      cy += child.cy * child.count;
      cz += child.cz * child.count;
      count += child.count;
    }
  }

  if (count === 0) return null;
  return {
    cx: cx / count,
    cy: cy / count,
    cz: cz / count,
    count,
    size,
    children,
    point: null,
  };
}

/**
 * Compute repulsion force on point at (px, py, pz) with index excludeIndex,
 * using Barnes-Hut approximation. theta controls accuracy: smaller = more accurate, larger = faster.
 * Typical theta: 0.5–1.0.
 */
export function computeRepulsionForce(
  cell: OctreeCell | null,
  px: number,
  py: number,
  pz: number,
  excludeIndex: number,
  repulsionValue: number,
  theta: number,
  out: { fx: number; fy: number; fz: number }
): void {
  if (cell === null) return;

  const dx = cell.cx - px;
  const dy = cell.cy - py;
  const dz = cell.cz - pz;
  const lenSq = dx * dx + dy * dy + dz * dz;

  if (lenSq < 1e-20) return;

  const len = Math.sqrt(lenSq);

  // Leaf with single point: use exact force, skip self
  if (cell.point !== null) {
    if (cell.point.index === excludeIndex) return;
    const f = repulsionValue / lenSq;
    out.fx -= dx * f;
    out.fy -= dy * f;
    out.fz -= dz * f;
    return;
  }

  // Barnes-Hut: if cell is far enough, approximate as single point
  const ratio = cell.size / len;
  if (ratio < theta && cell.count > 0) {
    const f = (repulsionValue * cell.count) / lenSq;
    out.fx -= dx * f;
    out.fy -= dy * f;
    out.fz -= dz * f;
    return;
  }

  // Recurse into children
  if (cell.children) {
    for (const child of cell.children) {
      computeRepulsionForce(child, px, py, pz, excludeIndex, repulsionValue, theta, out);
    }
  }
}
