import Point from "./Point";

interface Line {
  points: Point[];
}

class Line {
  /**
   * Constructs a line from an array of points
   * @param points an array of points
   */
  constructor(points: Point[]) {
    this.points = [];
    points.forEach((p) => {
      const point = new Point(p.x, p.y, p.z);
      this.points.push(point);
    });
  }
}

export default Line;
