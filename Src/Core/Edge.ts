interface Edge {
  start: number;
  end: number;
  data: any;
}

class Edge {
  constructor(start:number, end:number, data:any) {
    this.start = start;
    this.end = end;
    this.data = { ...data };
  }
}

export { Edge };
