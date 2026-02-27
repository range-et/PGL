import { default as Point } from '../HelperClasses/Point';
export interface PointWithId {
    point: Point;
    nodeId: number;
}
/**
 * Find all point IDs within `radius` of each point in `items`.
 * Returns Map<nodeId, nodeIds[] within radius (including self)>.
 */
export declare function pointsWithinRadius(items: PointWithId[], radius: number): Map<number, number[]>;
