interface Edge {
    start: number;
    end: number;
    data: any;
}
/**
 * Edge class: connects two nodes by start/end IDs; can hold optional data (e.g. "ldata" for line geometry).
 */
declare class Edge {
    /**
     *
     * Construct an edge
     *
     * @param start Start index of the edge based on the array of nodes
     * @param end End index of the edge based on the array of nodes
     * @param data - Optional data; "ldata" is reserved for line geometry used when drawing the edge
     */
    constructor(start: number, end: number, data: any);
}
export default Edge;
