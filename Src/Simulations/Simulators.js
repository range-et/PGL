// make a simulation class object
// This class ideally does everything
// Which involves three primary things
// change colors and change
class Simulation {
  constructor(Graph, deltaTick) {
    this.Graph = Graph;
    this.deltaTick = deltaTick || 1;
    this.forces = new Map();
  }

  tick() {}
}

export { Simulation };
