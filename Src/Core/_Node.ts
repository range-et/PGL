// note this file is always reffered to as
// _Node to not confuse with node (js) and
// Vertices which are another 3d object that
// can be changed in three js
interface _Node {
  data: any;
  neighbours: number[];
}

/**
 * Node class: each node has an ID (index) and arbitrary data.
 * The data typically includes "pos" (Point) for visualization.
 */
class _Node {
  /**
   * 
   * @param data - Data associated with the node; include "pos" (Point) for graph visuals
   */
  constructor(data:any) {
    // this data is an arbitrary thing with which I can create any object
    this.data = { ...data };
    // the neighbours bit is explicity set from the code outside
    this.neighbours = [];
  }
}

export default _Node;
