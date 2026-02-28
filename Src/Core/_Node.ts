/**
 * Graph node: holds arbitrary data (e.g. `pos` for layout) and neighbour IDs.
 * Named `_Node` to avoid confusion with Node.js and Three.js Vertices.
 */
interface _Node {
  data: any;
  neighbours: number[];
}

/**
 * Node class: each node has an ID (index) and arbitrary data.
 * The data typically includes "pos" (Point) for visualization.
 * @see NodeData for typed shape when creating nodes
 */
class _Node {
  /**
   * @param data - Data associated with the node; include "pos" (Point) for graph visuals
   */
  constructor(data: any = {}) {
    // this data is an arbitrary thing with which I can create any object
    this.data = { ...data };
    // the neighbours bit is explicity set from the code outside
    this.neighbours = [];
  }
}

export default _Node;
