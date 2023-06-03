interface Point {
  x: number;
  y: number;
  z: number;
}

class Point {
  constructor(x:number, y:number, z:number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  // Points are somewhat the same thing as a vector 
  // So im using the same type instead of redeclaring the 
  // Type
  translate(Point:Point) {
    this.x = this.x + Point.x;
    this.y = this.y + Point.y;
    this.z = this.z + Point.z;
  }
}

export { Point };
