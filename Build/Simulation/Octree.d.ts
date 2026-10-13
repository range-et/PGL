/**
 * 3D Octree for Barnes-Hut approximation of n-body repulsion.
 * Reduces repulsion computation from O(n²) to O(n log n).
 */
export interface OctreePoint {
    x: number;
    y: number;
    z: number;
    index: number;
}
export interface OctreeCell {
    cx: number;
    cy: number;
    cz: number;
    count: number;
    size: number;
    children: OctreeCell[] | null;
    point: OctreePoint | null;
}
/**
 * Build an octree from points. Each leaf holds one point, except leaves at
 * MAX_DEPTH, which hold all points that could not be separated (point is null).
 * Internal nodes store center of mass and count for Barnes-Hut.
 */
export declare function buildOctree(points: OctreePoint[], minX: number, minY: number, minZ: number, size: number, depth?: number): OctreeCell | null;
/**
 * Compute repulsion force on point at (px, py, pz) with index excludeIndex,
 * using Barnes-Hut approximation. theta controls accuracy: smaller = more accurate, larger = faster.
 * Typical theta: 0.5–1.0.
 */
export declare function computeRepulsionForce(cell: OctreeCell | null, px: number, py: number, pz: number, excludeIndex: number, repulsionValue: number, theta: number, out: {
    fx: number;
    fy: number;
    fz: number;
}): void;
