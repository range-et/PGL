import { default as Point } from './Point';
import { default as Line } from './Line';
/**
 * Creates a line based on the number of divisons
 *
 * @param start the start point
 * @param end the end point
 * @param divisions the number of divisions
 * @returns the line object
 */
declare function line_from_start_end_divisions(start: Point, end: Point, divisions: number): Line;
/**
 * Divides the line into a number of divisions based on distance
 * @param start - the start point
 * @param end - the end point
 * @param distance - the distance at which this line must be divided
 * @returns A line object with the right number of points
 */
declare function line_from_start_end_distance(start: Point, end: Point, distance: number): Line;
/**
 * Calculates the centroid of an array of points
 * @param points An array of points
 * @returns the central point of the array of points
 */
declare function centroid(points: Point[]): Point;
declare const _default: {
    line_from_start_end_divisions: typeof line_from_start_end_divisions;
    line_from_start_end_distance: typeof line_from_start_end_distance;
    centroid: typeof centroid;
};
export default _default;
