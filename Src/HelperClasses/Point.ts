interface Point {
  x: number;
  y: number;
  z: number;
}

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
   * @param Point This is the displacement vactor, used as a point but the same idea holds
   */
  translate(Point:Point) {
    this.x = this.x + Point.x;
    this.y = this.y + Point.y;
    this.z = this.z + Point.z;
  }
}

export default Point;
