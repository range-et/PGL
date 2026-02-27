/**
 * Minimal 3D KD-tree for range queries (points within distance).
 * Used by the distance-based cluster strategy.
 */

import type Point from "../HelperClasses/Point";

export interface PointWithId {
  point: Point;
  nodeId: number;
}

function sqDist(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz;
}

function selectAxis(depth: number): "x" | "y" | "z" {
  const axes: Array<"x" | "y" | "z"> = ["x", "y", "z"];
  return axes[depth % 3];
}

/**
 * Build a KD-tree from points with node IDs.
 * Returns a tree structure used for range queries.
 */
function buildKDT(
  items: PointWithId[],
  depth: number
): { left?: ReturnType<typeof buildKDT>; right?: ReturnType<typeof buildKDT>; item: PointWithId } | null {
  if (items.length === 0) return null;
  if (items.length === 1) return { item: items[0] };

  const axis = selectAxis(depth);
  const sorted = [...items].sort((a, b) => a.point[axis] - b.point[axis]);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted[mid];

  const left = mid > 0 ? buildKDT(sorted.slice(0, mid), depth + 1) : null;
  const right =
    mid + 1 < sorted.length ? buildKDT(sorted.slice(mid + 1), depth + 1) : null;

  return { left: left ?? undefined, right: right ?? undefined, item: median };
}

/**
 * Query all points within squared distance dSq of the given point.
 * Returns array of node IDs.
 */
function rangeQuery(
  node: ReturnType<typeof buildKDT>,
  center: Point,
  dSq: number,
  depth: number,
  out: number[]
): void {
  if (node === null) return;

  const axis = selectAxis(depth);
  const dist = sqDist(center, node.item.point);
  if (dist <= dSq) out.push(node.item.nodeId);

  const planeDist = center[axis] - node.item.point[axis];
  const planeDistSq = planeDist * planeDist;

  if (planeDist <= 0) {
    if (node.left) rangeQuery(node.left, center, dSq, depth + 1, out);
    if (node.right && planeDistSq <= dSq) rangeQuery(node.right, center, dSq, depth + 1, out);
  } else {
    if (node.right) rangeQuery(node.right, center, dSq, depth + 1, out);
    if (node.left && planeDistSq <= dSq) rangeQuery(node.left, center, dSq, depth + 1, out);
  }
}

/**
 * Find all point IDs within `radius` of each point in `items`.
 * Returns Map<nodeId, nodeIds[] within radius (including self)>.
 */
export function pointsWithinRadius(
  items: PointWithId[],
  radius: number
): Map<number, number[]> {
  const tree = buildKDT(items, 0);
  const radiusSq = radius * radius;
  const result = new Map<number, number[]>();

  for (const { point, nodeId } of items) {
    const out: number[] = [];
    if (tree) rangeQuery(tree, point, radiusSq, 0, out);
    result.set(nodeId, out);
  }

  return result;
}
