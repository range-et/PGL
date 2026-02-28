/**
 * Minimal 3D point shape. Use for typing position objects (e.g. from custom layout).
 * The Point class implements this interface.
 */
export type PointLike = {
    x: number;
    y: number;
    z: number;
};
interface Point extends PointLike {
}
declare class Point {
    /**
     * Constructs a point based on the x y z values
     * @param x x value
     * @param y y value
     * @param z z value
     */
    constructor(x: number, y: number, z: number);
    /**
     * Displaces a point - note this method moves the existing point
     * @param Point - Displacement vector (used as a point)
     */
    translate(Point: Point): void;
}
export default Point;
