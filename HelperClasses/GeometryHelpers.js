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

export { line_from_start_end_divisions, line_from_start_end_distance }