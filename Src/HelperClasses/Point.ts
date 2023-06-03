interface Point {
  x: number;
  y: number;
  z: number;
}

class Point {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  translate(Point) {
    this.x = this.x + Point.x;
    this.y = this.y + Point.y;
    this.z = this.z + Point.z;
  }
}

export { Point };
