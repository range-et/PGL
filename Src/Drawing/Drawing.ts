import Utilities from "../HelperClasses/Utilities";
import GeometryHelpers from "../HelperClasses/GeometryHelpers";
import { Point } from "../HelperClasses/Point";
import { Line } from "../HelperClasses/Line";
import { Edge } from "../Core/Edge";
import GraphMethods from "../GraphAlgorithms/GraphMethods";
import { Graph } from "../Core/Graph";
import { _Node } from "../Core/_Node";

// draw kamada kawai
async function SimulateKamadaKawai(
  G: Graph,
  iterations: number,
  simulationBound: number = 200,
  cohesionValue: number = 1
) {
  const adjList = G.get_adjacency();
  // pos map
  const PosMapX: Map<number, number> = new Map();
  const PosMapY: Map<number, number> = new Map();
  let rx, ry;
  for (const node of adjList.keys()) {
    rx = Math.random() * simulationBound;
    ry = Math.random() * simulationBound;
    PosMapX.set(node, rx);
    PosMapY.set(node, ry);
  }
  // start simulation
  for (let i = 0; i < iterations; i++) {
    // calculate the clustering force
    // these two keep track of the node being simulated's
    // position - redeclaring is sorta unncessary
    let nodeX: number;
    let nodeY: number;
    // also keep track of all the x_s and y_s
    let x_s: number[];
    let y_s: number[];
    // also the same thing for the clustering force
    let y_r: number[];
    let x_r: number[];
    // same thing for the cohesion values that get recalculated
    let new_c_xpos_dispacement: number;
    let new_c_ypos_dispacement: number;

    for (const node of adjList.keys()) {
      // this chunk is for the attraction force
      // get the node pos
      const neighbours = adjList.get(node)!;
      // remember always declare this nodes details
      nodeX = PosMapX.get(node)!;
      nodeY = PosMapY.get(node)!;
      // get the set of x's
      x_s = [];
      // get the set of y's
      y_s = [];
      // now iterate through the pos list and append
      neighbours.forEach((n_s) => {
        const n_pos_x = PosMapX.get(n_s)!;
        const n_pos_y = PosMapY.get(n_s)!;
        x_s.push(n_pos_x);
        y_s.push(n_pos_y);
      });
      // now average out the values
      const new_c_xpos = Utilities.calculateAverage(x_s);
      const new_c_ypos = Utilities.calculateAverage(y_s);

      // this chunk is for the repelling force
      y_r = [];
      x_r = [];
      let diffx: number;
      let diffy: number;
      let othernodeX: number;
      let othernodeY: number;

      // then find the element
      for (const otherNode of G.nodes.keys()) {
        // get the position of all the other nodes
        if (otherNode != node) {
          // calculate inverse distance
          othernodeX = PosMapX.get(otherNode)!;
          othernodeY = PosMapY.get(otherNode)!;
          diffx = othernodeX - nodeX;
          diffy = othernodeY - nodeY;
          // get the inverse square value
          // add that to the *_r arrays
          x_r.push(diffx);
          y_r.push(diffy);
        }
      }
      // this is the repulsion value
      const A_mult = 2;
      const new_x_r_pos =
        (A_mult * 1) /
        (Utilities.calculateAverage(x_r) * Utilities.calculateAverage(x_r));
      const new_y_r_pos =
        (A_mult * 1) /
        (Utilities.calculateAverage(y_r) * Utilities.calculateAverage(y_r));

      // calculate the dispacement amount in c/y pos
      // this is the cohesion value
      const new_c_xpos_dispacement = cohesionValue * (new_c_xpos - nodeX);
      const new_c_ypos_dispacement = cohesionValue * (new_c_ypos - nodeY);

      // then add the x and y components of the two vectors
      const new_xpos = new_x_r_pos + new_c_xpos_dispacement + nodeX;
      const new_ypos = new_y_r_pos + new_c_ypos_dispacement + nodeY;

      // now set these positions
      PosMapX.set(node, new_xpos);
      PosMapY.set(node, new_ypos);
    }
  }
  // return the position
  // keep in mind three JS works with Y upwards and not Z
  // in my head I work the other way round so Im swapping the Z and Y values here
  let PosMap: Map<number, Point> = new Map();
  for (const p of PosMapX.keys()) {
    PosMap.set(p, new Point(PosMapX.get(p)!, 0, PosMapY.get(p)!));
  }
  // get / set positions
  // move the points
  // Since this simulation might have moved the whole graph off screen
  // get the average pos
  const sim_x = [];
  const sim_y = [];
  const sim_z = [];
  let interimPoint;
  for (const p of PosMap.keys()) {
    interimPoint = PosMap.get(p)!;
    sim_x.push(interimPoint.x);
    sim_y.push(interimPoint.y);
    sim_z.push(interimPoint.z);
  }

  const x_displacement = Utilities.calculateAverage(sim_x);
  const y_displacement = Utilities.calculateAverage(sim_y);
  const z_displacement = Utilities.calculateAverage(sim_z);
  const dispacementVector = new Point(
    -x_displacement,
    -y_displacement,
    -z_displacement
  );

  PosMap = MovePmap(PosMap, dispacementVector);
  return PosMap;
}

// instanciate a random set of positions
function InstanciateRandomPositions(G: Graph) {
  const adjList = G.get_adjacency();
  const PosMapX = new Map();
  const PosMapY = new Map();
  for (const node of adjList.keys()) {
    PosMapX.set(node, Math.random() * 200);
    PosMapY.set(node, Math.random() * 200);
  }
  let PosMap = new Map();
  for (const p of PosMapX.keys()) {
    PosMap.set(p, new Point(PosMapX.get(p), 0, PosMapY.get(p)));
  }
  G.apply_position_map(PosMap);
  const lmap = DrawEdgeLines(G, 1);
  return { pmap: PosMap, emap: lmap };
}

// draw the edge representations and then store them in the edge classes
function DrawEdgeLines(G: Graph, divDistance: number) {
  // this is the return map
  const lineMap: Map<number, Line> = new Map();
  let edge: Edge;
  let start: Point;
  let end: Point;
  for (const key of G.edges.keys()) {
    edge = G.edges.get(key)!;
    // get the start pos
    start = G.nodes.get(edge.start)!.data.pos;
    end = G.nodes.get(edge.end)!.data.pos;
    const Line = GeometryHelpers.line_from_start_end_distance(
      start,
      end,
      divDistance
    );
    lineMap.set(key, Line);
  }
  return lineMap;
}

// now draw out the edge bundling thing
async function DrawEdgeBundling(
  LineMap: Map<number, Line>,
  iterations: number,
  distance: number
) {
  const returnArray = LineMap;
  // variables that are getting reused
  let line: Line;
  let otherLine: Line;
  let x_s: number[];
  let y_s: number[];
  let z_s: number[];
  let pnt: Point;
  let otherpoint: Point;
  let d: number;
  let x_d: number;
  let y_d: number;
  let z_d: number;
  let avgx: number;
  let avgy: number;
  let avgz: number;
  // run it for whatever number of iterations
  for (let i = 0; i < iterations; i++) {
    // then iterate through every line
    for (let key of returnArray.keys()) {
      // then get the line that we are working with
      line = returnArray.get(key)!;
      // then for each point in the line we have to move it closer to the other points
      for (let ii = 1; ii < line.points.length - 1; ii++) {
        // then get the point that we need to work with
        x_s = [];
        y_s = [];
        z_s = [];
        pnt = line.points[ii];
        // then run the point accumulation algoritm
        for (let otherKey of returnArray.keys()) {
          if (otherKey != key) {
            // then get the other line
            otherLine = returnArray.get(otherKey)!;
            for (let iii = 1; iii < otherLine.points.length - 1; iii++) {
              otherpoint = otherLine.points[iii];
              d = Utilities.calculateSquaredDistance(pnt, otherpoint);
              if (d <= Math.pow(distance, 2)) {
                x_d = otherpoint.x - pnt.x;
                y_d = otherpoint.y - pnt.y;
                z_d = otherpoint.z - pnt.z;
                x_s.push(x_d);
                y_s.push(y_d);
                z_s.push(z_d);
              }
            }
          }
        }
        // now create a new displacement amount
        avgx = pnt.x + 0.8 * (Utilities.calculateAverage(x_s) || 0);
        avgy = pnt.y + 0.8 * (Utilities.calculateAverage(y_s) || 0);
        avgz = pnt.z + 0.8 * (Utilities.calculateAverage(z_s) || 0);
        const newPoint = new Point(avgx, avgy, avgz);
        line.points[ii] = newPoint;
      }
    }
  }
  // now return that new map
  return returnArray;
}

// displace the th edges
// sorta like and arc in the middle of the thing
function DisplaceEdgeInY(LineMap: Map<number, Line>, displacement: number) {
  for (const key of LineMap.keys()) {
    const line = LineMap.get(key)!;
    // now for all the points in this
    let pnt, ydisval;
    for (let i = 0; i < line.points.length; i++) {
      pnt = line.points[i];
      ydisval =
        displacement * Math.sin((Math.PI * i) / (line.points.length - 1));
      pnt.y = pnt.y + ydisval;
    }
  }
}

// displace the graph by some measure
function DisplaceVertices(
  nodeMap: Map<number, _Node>,
  parameter: string,
  displacement: number
) {
  let max: number = 0;
  let value: number, ydisplacement: number;
  // go through the thing and set the min max values
  for (let node of nodeMap.values()) {
    value = eval("node.data." + parameter);
    if (value >= max) {
      max = value;
    }
  }
  // go through the nodes again and set the values
  for (const node of nodeMap.values()) {
    value = eval("node.data." + parameter);
    ydisplacement = (value / max) * displacement;
    // now filter the values so that we know that the values are between a max and a min
    ydisplacement = Math.max(0, ydisplacement); // this sets the lower bound to be something
    ydisplacement = Math.min(displacement, ydisplacement); // this sets the upper bound of the thing
    node.data.pos.y = ydisplacement;
  }
}

// draw the circular vertical packing crypto like drawing
async function HivePlot(
  G: Graph,
  selectedNode: number,
  step: number,
  startP: Point
) {
  const adj = G.get_adjacency();
  const DijkstraDepth = await GraphMethods.Dijkstra(G, selectedNode);
  // calculate the number of steps that I am searching through
  const steps = Math.max(...[...DijkstraDepth.values()]);
  // step map
  const stepMap = new Map();
  // now create a stepped ring of stuff
  for (let i = 0; i <= steps; i++) {
    const ntier = [];
    for (const nkey of DijkstraDepth.keys()) {
      if (i == DijkstraDepth.get(nkey)) {
        ntier.push(nkey);
      }
    }
    stepMap.set(i, ntier);
  }
  // the returning pos map
  const Pmap = new Map();
  // now find the relevant node Positions
  // get the start positions
  const xoff = startP.x || 0;
  const yoff = startP.y || 0;
  const zoff = startP.z || 0;
  // set the positions
  for (const node of adj.keys()) {
    const yval = DijkstraDepth.get(node)! * step;
    const depthArr = stepMap.get(DijkstraDepth.get(node));
    const angle = 2 * Math.PI * (depthArr.indexOf(node) / depthArr.length);
    const xval = Math.sin(angle) * yval;
    const zval = Math.cos(angle) * yval;
    // construct a new point
    const pnt = new Point(xval + xoff, -yval + yoff, zval + zoff);
    Pmap.set(node, pnt);
  }
  // simulate the lines
  G.apply_position_map(Pmap);
  const lmap = DrawEdgeLines(G, 1);
  const newLmap = await DrawEdgeBundling(lmap, 12, 5);
  return { pmap: Pmap, emap: newLmap };
}

// move graph
function MoveGraph(G: Graph, dispacement: Point) {
  const Gmap = G.get_map();
  const NewPmap = MovePmap(Gmap.pmap, dispacement);
  const NewEmap = MoveEmap(Gmap.emap, dispacement);
  G.apply_drawing_maps({ pmap: NewPmap, emap: NewEmap });
}

// move pmap
function MovePmap(Pmap: Map<number, Point>, displacement: Point) {
  const newPmap: Map<number, Point> = new Map();
  for (let node of Pmap.keys()) {
    const p = Pmap.get(node)!;
    p.translate(displacement);
    newPmap.set(node, p);
  }
  return newPmap;
}

// move the edges
function MoveEmap(Emap: Map<number, Line>, dispacement: Point) {
  const newEmap: Map<number, Line> = new Map();
  // variables - instead of redeclaring
  let interimPoints: Point[];
  let interimLine: Line;
  let newLine: Line;
  for (let lineNumber of Emap.keys()) {
    // reset the interim points
    interimPoints = [];
    // get the line
    interimLine = Emap.get(lineNumber)!;
    // move all the points
    for (let pnt of interimLine.points) {
      pnt.translate(dispacement);
      // add this to the new stack of lines
      interimPoints.push(pnt);
    }
    // create a new line
    newLine = new Line(interimPoints);
    // add this to the new map
    newEmap.set(lineNumber, newLine);
  }
  return newEmap;
}

// THIS IS THE BIT THATS A BIT CONFUSING
/*
Data for visualization is store in the graph under the elements data
So for example - the position data under a point in the graph is under 
- Graph.nodes.get(whatever node).data.pos 
*/
// commenting out because appears to be redundant
// update edge lines after moving points or something
// this redraws the lines based on distance
function UpdateEdgeLinesDist(G: Graph, divDistance: number) {
  let edge: Edge;
  let start: Point;
  let end: Point;
  let line: Line;
  for (const key of G.edges.keys()) {
    edge = G.edges.get(key)!;
    // get the start pos
    start = G.nodes.get(edge.start)!.data.pos;
    end = G.nodes.get(edge.end)!.data.pos;
    line = GeometryHelpers.line_from_start_end_distance(
      start,
      end,
      divDistance
    );
    edge.data.ldata = line;
  }
}

// function Update EdgeLines based on the number of divisions
// redraw the line based on divisions
function UpdateEdgeLinesDivs(G: Graph, Divs: number) {
  let edge: Edge;
  let start: Point;
  let end: Point;
  let line: Line;
  for (const key of G.edges.keys()) {
    edge = G.edges.get(key)!;
    // get the start pos
    start = G.nodes.get(edge.start)!.data.pos;
    end = G.nodes.get(edge.end)!.data.pos;
    line = GeometryHelpers.line_from_start_end_divisions(start, end, Divs);
    edge.data.ldata = line;
  }
}

export default {
  SimulateKamadaKawai,
  DrawEdgeLines,
  DrawEdgeBundling,
  HivePlot,
  DisplaceEdgeInY,
  MoveGraph,
  InstanciateRandomPositions,
  DisplaceVertices,
  // these two are special functions
  UpdateEdgeLinesDist,
  UpdateEdgeLinesDivs,
};
