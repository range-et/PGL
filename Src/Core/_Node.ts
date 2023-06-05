// note this file is always reffered to as
// _Node to not confuse with node (js) and
// Vertices which are another 3d object that
// can be changed in three js
interface _Node {
  data: any;
  neighbours: number[];
}

class _Node {
  /**
   * 
   * @param data Data associated with the node, be sure to be careful to pass in any "pos" data as they correspond to position of the nodes in the visuals of the graph
   */
  constructor(data:any) {
    // this data is an arbitrary thing with which I can create any object
    this.data = { ...data };
    // the neighbours bit is explicity set from the code outside
    this.neighbours = [];
  }
}

export { _Node };
