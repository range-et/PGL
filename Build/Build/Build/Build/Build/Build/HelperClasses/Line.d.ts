import { default as Point } from './Point';
interface Line {
    points: Point[];
}
declare class Line {
    /**
     * Constructs a line from an array of points
     * @param points an array of points
     */
    constructor(points: Point[]);
}
export default Line;
