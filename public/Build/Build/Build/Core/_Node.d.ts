interface _Node {
    data: any;
    neighbours: number[];
}
/**
 * Node class: each node has an ID (index) and arbitrary data.
 * The data typically includes "pos" (Point) for visualization.
 */
declare class _Node {
    /**
     *
     * @param data - Data associated with the node; include "pos" (Point) for graph visuals
     */
    constructor(data: any);
}
export default _Node;
