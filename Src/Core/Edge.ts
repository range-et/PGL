interface Edge {
  start: number;
  end: number;
  data: any;
}

class Edge {
  constructor(start, end, data) {
    this.start = start;
    this.end = end;
    this.data = { ...data };
  }
}

export { Edge };
