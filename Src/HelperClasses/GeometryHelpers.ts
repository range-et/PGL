import { Point } from "./Point";
import { Line } from "./Line";
import Utilities from "./Utilities";

function line_from_start_end_divisions(start: Point, end: Point, divisions:number) {
  // create a start and end time
  const Start = new Point(start.x, start.y, start.z);
  const End = new Point(end.x, end.y, end.z);
  // interpolated points
  const points: Point[] = [];
  // divisions
  for (let i = 0; i <= divisions; i++) {
    const interVar = i / divisions;
    const newx = interVar * Start.x + (1 - interVar) * End.x;
    const newy = interVar * Start.y + (1 - interVar) * End.y;
    const newz = interVar * Start.z + (1 - interVar) * End.z;
    const newPoint = new Point(newx, newy, newz);
    points.push(newPoint);
  }
  // create a new line
  const SubdividedLine = new Line(points);
  return SubdividedLine;
}

function line_from_start_end_distance(start:Point, end:Point, distance:number) {
  const dist = Utilities.calculateDistance(start, end);
  const divs = Math.round(dist / distance) + 2;
  const subdivline = line_from_start_end_divisions(start, end, divs);
  return subdivline;
}

function centroid(points:Point[]) {
  let rx = 0;
  let ry = 0;
  let rz = 0;
  points.forEach((element) => {
    rx += element.x;
    ry += element.y;
    rz += element.z;
  });
  rx = rx / points.length;
  ry = ry / points.length;
  rz = rz / points.length;
  const centroid = new Point(rx, ry, rz);
  return centroid;
}

export default {
  line_from_start_end_divisions,
  line_from_start_end_distance,
  centroid,
};
