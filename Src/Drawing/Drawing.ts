import Utilities from "../HelperClasses/Utilities";
import GeometryHelpers from "../HelperClasses/GeometryHelpers";
import Point from "../HelperClasses/Point";
import Line from "../HelperClasses/Line";
import Edge from "../Core/Edge";
import GraphMethods from "../GraphAlgorithms/GraphMethods";
import Graph from "../Core/Graph";
import _Node from "../Core/_Node";

/**
 * Simulates Kamada kawai for a network in 2d. 3d is not supported yet
 * Note: This is an async function as it take time for some of the large graphs
 *
 * @param Graph - The first input number
 * @param iterations - The second input number
 *  @param simulationBound - The bounds of simulation (Mostly a global number to scale the graph up or down)
 *  @param cohesionValue - How sticky the nodes are i.r. how much they cluster together
 * @returns And node map of all the nodes and their simulated positions - Please note: position maps have to to be applied to the graph!
 *
 */
async function SimulateKamadaKawai(
  Graph: Graph,
  iterations: number,
  simulationBound: number = 100,
  cohesionValue: number = 1,
  repulsionValue: number = 1
) {
  const adjList = Graph.get_adjacency();
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
    let new_x_r_pos: number;
    let new_y_r_pos: number;
    let new_c_xpos: number;
    let new_c_ypos: number;
    let new_g_xpos_displacement: number;
    let new_g_ypos_displacement: number;

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
      new_c_xpos = Utilities.calculateAverage(x_s);
      new_c_ypos = Utilities.calculateAverage(y_s);

      // this chunk is for the repelling force
      y_r = [];
      x_r = [];
      let diffx: number;
      let diffy: number;
      let othernodeX: number;
      let othernodeY: number;

      // then find the element
      for (const otherNode of Graph.nodes.keys()) {
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
      new_x_r_pos =
        (repulsionValue * 1) /
        (Utilities.calculateAverage(x_r) * Utilities.calculateAverage(x_r));
      new_y_r_pos =
        (repulsionValue * 1) /
        (Utilities.calculateAverage(y_r) * Utilities.calculateAverage(y_r));

      // calculate the dispacement amount in c/y pos
      // this is the cohesion value
      new_c_xpos_dispacement = cohesionValue * (new_c_xpos - nodeX);
      new_c_ypos_dispacement = cohesionValue * (new_c_ypos - nodeY);

      // Also move all the points towards the center a little bit
      // so that the graph doesent explode out
      new_g_xpos_displacement = cohesionValue * (0 - nodeX);
      new_g_ypos_displacement = cohesionValue * (0 - nodeY);

      // then add the x and y components of the two vectors
      const new_xpos =
        new_x_r_pos + new_g_xpos_displacement + new_c_xpos_dispacement + nodeX;
      const new_ypos =
        new_y_r_pos + new_g_ypos_displacement + new_c_ypos_dispacement + nodeY;

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

/**
 *
 * Randomly sets all the positions for a graph
 * Not really very useful but I've used it in some cases and have kept it around
 *
 *  @param Graph - The graph who's nodes you would want to reposition
 *
 * @return A position map of all the nodes and its corresponding positions
 */
function InstanciateRandomPositions(Graph: Graph) {
  const adjList = Graph.get_adjacency();
  const PosMapX: Map<number, number> = new Map();
  const PosMapY: Map<number, number> = new Map();
  for (const node of adjList.keys()) {
    PosMapX.set(node, Math.random() * 200);
    PosMapY.set(node, Math.random() * 200);
  }
  const PosMap: Map<number, Point> = new Map();
  for (const p of PosMapX.keys()) {
    PosMap.set(p, new Point(PosMapX.get(p)!, 0, PosMapY.get(p)!));
  }
  return PosMap;
}

/**
 *
 * Constructs the edges as lines, Note: these are just a representation of the lines
 * they then have to be visulized using one of the Three JS Drawer functions like
 * draw a thick line or a thin line. This draws out the edges divided by some number of
 * divisions that you specify
 *
 * @param Graph - The graph whos edges are getting drawn
 * @param divDistance - How many divisions (distance) to make along the edge
 * @returns A line map - which holds a map of all the edge indices and the corresponding line representations
 */
function DrawEdgeLines(Graph: Graph, divDistance: number) {
  // this is the return map
  const lineMap: Map<number, Line> = new Map();
  let edge: Edge;
  let start: Point;
  let end: Point;
  for (const key of Graph.edges.keys()) {
    edge = Graph.edges.get(key)!;
    // get the start pos
    start = Graph.nodes.get(edge.start)!.data.pos;
    end = Graph.nodes.get(edge.end)!.data.pos;
    const Line = GeometryHelpers.line_from_start_end_distance(
      start,
      end,
      divDistance
    );
    lineMap.set(key, Line);
  }
  return lineMap;
}

/**
 *
 * Constructs the edges as lines, Note: these are just a representation of the lines
 * they then have to be visulized using one of the Three JS Drawer functions like
 * draw a thick line or a thin line - this draws them based on the number of divisions
 * you would like them to have
 * @param Graph - The graph whos edges are getting drawn
 * @param numberOfDivs - How many divisions to make along the edge
 * @returns A line map - which holds a map of all the edge indices and the corresponding line representations
 */
function DrawEdgeLinesDivisions(Graph: Graph, numberOfDivs: number) {
  // this is the return map
  const lineMap: Map<number, Line> = new Map();
  let edge: Edge;
  let start: Point;
  let end: Point;
  for (const key of Graph.edges.keys()) {
    edge = Graph.edges.get(key)!;
    // get the start pos
    start = Graph.nodes.get(edge.start)!.data.pos;
    end = Graph.nodes.get(edge.end)!.data.pos;
    const Line = GeometryHelpers.line_from_start_end_divisions(
      start,
      end,
      numberOfDivs
    );
    lineMap.set(key, Line);
  }
  return lineMap;
}

/**
 *
 * Edge bundling - this isnt as fast as the current KDE based methods - but it provides a basic  method of
 * Visualizing large edge flows. Note: This is an aysnc function as it takes a while for the edge bundling to happen
 *
 * @param LineMap - The map of edges as a line map
 * @param iterations - The number of iterations to run edge bundling
 * @param distance - A shorthand for how close together the vertices need to be before they get influnced by each other
 * @returns A line map with all the updated positions of the line (Where they are bundled together) Again - this needs to be applied to the graph!
 */
async function DrawEdgeBundling(
  LineMap: Map<number, Line>,
  iterations: number,
  distance: number
) {
  // first create a deep copy of the map
  const returnArray = new Map<number, Line>();
  for (let key of LineMap.keys()) {
    returnArray.set(key, structuredClone(LineMap.get(key)!));
  }
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

/**
 *
 * Displace the edges vertically, almost akin to the Deck.gl arcs
 * The displacement is done in a sin curve with the ends still touching the nodes
 * Note: This is an inplace modification of the edges
 *
 * @param LineMap - The map of edges as a line map
 * @param displacement - the amount of vertical displacement
 */
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

/**
 *
 * Displace the vertices vertically based on some prameter (For example degree or modularity)
 *
 * @param Graph - the graph whos nodes have to be displaced
 * @param parameter - the prameter based on which you want to modify the
 * @param displacement - the maximum amunt of displacement, all the other values are rescaled linerly
 */
function DisplaceVertices(
  Graph: Graph,
  parameter: string,
  displacement: number
) {
  let max: number = 0;
  let value: number, ydisplacement: number;
  // go through the thing and set the min max values
  for (let node of Graph.nodes.values()) {
    value = eval("node.data." + parameter);
    if (value >= max) {
      max = value;
    }
  }
  // go through the nodes again and set the values
  for (const node of Graph.nodes.values()) {
    value = eval("node.data." + parameter);
    ydisplacement = (value / max) * displacement;
    // now filter the values so that we know that the values are between a max and a min
    ydisplacement = Math.max(0, ydisplacement); // this sets the lower bound to be something
    ydisplacement = Math.min(displacement, ydisplacement); // this sets the upper bound of the thing
    node.data.pos.y = ydisplacement;
  }
}

/**
 *
 * Generates a hive plot for a graph, this includes the option to displace the graph vertically based on degrees and how far away each node is
 *
 * @param Graph - The graph
 * @param selectedNode - the node around which the hive plot is generated
 * @param step - If the hive should step up or down if yes then by what increments
 * @param startPosition - Starting position
 * @returns
 */
async function HivePlot(
  Graph: Graph,
  selectedNode: number,
  step: number,
  startPosition: Point
) {
  const adj = Graph.get_adjacency();
  const DijkstraDepth = await GraphMethods.Dijkstra(Graph, selectedNode);
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
  const xoff = startPosition.x || 0;
  const yoff = startPosition.y || 0;
  const zoff = startPosition.z || 0;
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
  Graph.apply_position_map(Pmap);
  const lmap = DrawEdgeLines(Graph, 1);
  const newLmap = await DrawEdgeBundling(lmap, 12, 5);
  return { pmap: Pmap, emap: newLmap };
}

/**
 * Move a graph somewhere (like the physical location) - This is an inplace movement and overwrites existing values
 *
 * @param Graph - The graph that has to be moved
 * @param dispacement - This is a point and I end up using Point and Vector interchangably. So here the xyz values from the point are used to displace the nodes
 */
function MoveGraph(Graph: Graph, dispacement: Point) {
  const Gmap = Graph.get_map();
  const NewPmap = MovePmap(Gmap.pmap, dispacement);
  const NewEmap = MoveEmap(Gmap.emap, dispacement);
  Graph.apply_drawing_maps({ pmap: NewPmap, emap: NewEmap });
}

/**
 *
 * Move the nodes somewhere (Or the nodemap corresponding to the graph) - This is not an overwrite rather returns a new position map for the nodes to moved
 *
 * @param NodeM
 * ap - The Current position map of the graph
 * @param displacement - The Displacement vector
 * @returns - A new position map
 */
function MovePmap(NodeMap: Map<number, Point>, displacement: Point) {
  const newPmap: Map<number, Point> = new Map();
  for (let node of NodeMap.keys()) {
    const p = NodeMap.get(node)!;
    p.translate(displacement);
    newPmap.set(node, p);
  }
  return newPmap;
}

/**
 *
 * Move the edges somewhere (the edgemap corresponding to the graph) - This is not an overwrite and returns a new edge map for the edges to be moved too
 *
 * @param LineMap - The current line map, this is made up of lines
 * @param dispacement - The displacement vector
 * @returns - The new line map
 */
function MoveEmap(LineMap: Map<number, Line>, dispacement: Point) {
  const newEmap: Map<number, Line> = new Map();
  // variables - instead of redeclaring
  let interimPoints: Point[];
  let interimLine: Line;
  let newLine: Line;
  for (let lineNumber of LineMap.keys()) {
    // reset the interim points
    interimPoints = [];
    // get the line
    interimLine = LineMap.get(lineNumber)!;
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
/**
 *
 *  Draw new lines from edges, and draw them based on the distance of divisions (i.e. divide the line up every 10 units) Note: This is an in place update that takes place on the graph - it overwrites the existing data.
 *
 * @param Graph - The grapht who's edges have to be updated
 * @param divDistance - The distance by which the divisions are made
 */
function UpdateEdgeLinesDist(Graph: Graph, divDistance: number) {
  let edge: Edge;
  let start: Point;
  let end: Point;
  let line: Line;
  for (const key of Graph.edges.keys()) {
    edge = Graph.edges.get(key)!;
    // get the start pos
    start = Graph.nodes.get(edge.start)!.data.pos;
    end = Graph.nodes.get(edge.end)!.data.pos;
    line = GeometryHelpers.line_from_start_end_distance(
      start,
      end,
      divDistance
    );
    edge.data.ldata = line;
  }
}

/**
 * 
 * Draw new lines from edges, and draw them based on divisions (i.e. divide the line into 10 units) Note: This is an in place update that takes place on the graph - it overwrites the existing data.

 * @param Graph - The grapht who's edges have to be updated
 * @param Divs - The number of divisions to be made
 */
function UpdateEdgeLinesDivs(Graph: Graph, Divs: number) {
  let edge: Edge;
  let start: Point;
  let end: Point;
  let line: Line;
  for (const key of Graph.edges.keys()) {
    edge = Graph.edges.get(key)!;
    // get the start pos
    start = Graph.nodes.get(edge.start)!.data.pos;
    end = Graph.nodes.get(edge.end)!.data.pos;
    line = GeometryHelpers.line_from_start_end_divisions(start, end, Divs);
    edge.data.ldata = line;
  }
}

export default {
  SimulateKamadaKawai,
  DrawEdgeLines,
  DrawEdgeLinesDivisions,
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
