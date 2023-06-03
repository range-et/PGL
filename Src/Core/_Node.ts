// note this file is always reffered to as
// _Node to not confuse with node (js) and
// Vertices which are another 3d object that
// can be changed in three js
interface _Node {
  data: any;
  neighbours: number[];
}

class _Node {
  constructor(data) {
    // this data is an arbitrary thing with which I can create any object
    this.data = { ...data };
    // the neighbours bit is explicity set from the code outside
    this.neighbours = [];
  }
}

export { _Node };
