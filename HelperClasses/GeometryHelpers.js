import {Point} from "./Point.js";
import {Line} from "./Line.js";
import {calculateDistance} from "./Utilities.js";

function line_from_start_end_divisions(start, end, divisions){
    // create a start and end time 
    const Start = new Point(start.x, start.y, start.z);
    const End = new Point(end.x, end.y, end.z);
    // interpolated points
    const points = [];
    // divisions 
    for (let i = 0; i <= divisions;i++) {
        const interVar = i/divisions;
        const newx = interVar*Start.x + (1-interVar)*End.x;
        const newy = interVar*Start.y + (1-interVar)*End.y;
        const newz = interVar*Start.z + (1-interVar)*End.z;
        const newPoint = new Point(newx, newy, newz);
        points.push(newPoint);
    }
    // create a new point 
    const SubdividedLine = new Line(points);
    return SubdividedLine;
}

function line_from_start_end_distance(start, end, distance){
    const dist = calculateDistance(start, end);
    const divs = Math.round(dist / distance)+2;
    const subdivline = line_from_start_end_divisions(start, end, divs);
    return subdivline;
}

function centroid(points){
    let rx = 0;
    let ry = 0;
    let rz = 0;
    points.forEach(element => {
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

export { line_from_start_end_divisions, line_from_start_end_distance, Point, Line, calculateDistance, centroid}