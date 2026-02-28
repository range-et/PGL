/**
 * Minimal 3D point shape. Use for typing position objects (e.g. from custom layout).
 * The Point class implements this interface.
 */
export type PointLike = { x: number; y: number; z: number };

/**
 * Node data shape. `pos` is used for layout/visualization. Extend with custom fields as needed.
 */
export type NodeData = { pos?: PointLike } & Record<string, unknown>;

interface Point extends PointLike {}

class Point {
  /**
   * Constructs a point based on the x y z values
   * @param x x value 
   * @param y y value
   * @param z z value 
   */
  constructor(x:number, y:number, z:number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  // Points are somewhat the same thing as a vector 
  // So im using the same type instead of redeclaring the 
  // Type
  /**
   * Displaces a point - note this method moves the existing point
   * @param Point - Displacement vector (used as a point)
   */
  translate(Point:Point) {
    this.x = this.x + Point.x;
    this.y = this.y + Point.y;
    this.z = this.z + Point.z;
  }
}

export default Point;
