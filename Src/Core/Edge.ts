interface Edge {
  start: number;
  end: number;
  data: any;
}

class Edge {
  /**
   * 
   * Construct an edge
   * 
   * @param start Start index of the edge based on the array of nodes
   * @param end End index of the edge based on the array of nodes
   * @param data Data associated, note that ldata is reserved for how to draw the lines associated with the edge
   */
  constructor(start:number, end:number, data:any) {
    this.start = start;
    this.end = end;
    this.data = { ...data };
  }
}

export { Edge };
