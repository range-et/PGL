import { Point } from "./Point";

interface Line {
  points: Point[];
}

class Line {
  constructor(points: Point[]) {
    this.points = [];
    points.forEach((p) => {
      const point = new Point(p.x, p.y, p.z);
      this.points.push(point);
    });
  }
}

export { Line };
