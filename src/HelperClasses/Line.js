import { Point } from "./Point.js";

class Line{
    constructor(points){
        this.points = [];
        points.forEach(p => {
            const point = new Point(p.x, p.y, p.z);
            this.points.push(point);
        });
    }
}

export { Line }