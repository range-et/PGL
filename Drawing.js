import {
  calculateAverage,
  calculateSquaredDistance,
} from "./HelperClasses/Utilities.js";
import { line_from_start_end_distance, line_from_start_end_divisions } from "./HelperClasses/GeometryHelpers.js";
import { Point } from "./HelperClasses/Point.js";
import { Dijkstra } from "./GraphMethods.js";

// draw kamada kawai
async function SimulateKamadaKawai(G, iterations) {
  const adjList = G.get_adjacency();
  // pos map
  const PosMapX = new Map();
  const PosMapY = new Map();
  let rx, ry;
  for (const node of adjList.keys()) {
    rx = Math.random() * 200;
    ry = Math.random() * 200;
    PosMapX.set(node, rx);
    PosMapY.set(node, ry);
  }
  // start simulation
  for (let i = 0; i < iterations; i++) {
    // calculate the clustering force
    for (const node of adjList.keys()) {
      // this chunk is for the attraction force
      // get the node pos
      const neighbours = adjList.get(node);
      // get the set of x's
      const x_s = [];
      // get the set of y's
      const y_s = [];
      // now iterate through the pos list and append
      neighbours.forEach((n_s) => {
        const n_pos_x = PosMapX.get(n_s);
        const n_pos_y = PosMapY.get(n_s);
        x_s.push(n_pos_x);
        y_s.push(n_pos_y);
      });
      // now average out the values
      const new_c_xpos = calculateAverage(x_s);
      const new_c_ypos = calculateAverage(y_s);

      // this chunk is for the repelling force
      const x_r = [];
      const y_r = [];
      // then find the element
      for (const otherNode of G.nodes.keys()) {
        // get the position of all the other nodes
        if (otherNode != node) {
          // calculate inverse distance
          const distDiffX = PosMapX.get(otherNode) - PosMapX.get(node);
          const distDiffY = PosMapY.get(otherNode) - PosMapY.get(node);
          // get the inverse square value
          // add that to the *_r arrays
          x_r.push(distDiffX);
          y_r.push(distDiffY);
        }
      }
      // this is the repulsion value
      const A_mult = 2;
      const new_x_r_pos = (A_mult * 1) / (calculateAverage(x_r)*calculateAverage(x_r));
      const new_y_r_pos = (A_mult * 1) / (calculateAverage(y_r)*calculateAverage(y_r));

      // calculate the dispacement amount in c/y pos
      // this is the cohesion value
      const C_mult = 1;
      const new_c_xpos_dispacement = C_mult * (new_c_xpos - PosMapX.get(node));
      const new_c_ypos_dispacement = C_mult * (new_c_ypos - PosMapY.get(node));

      // then add the x and y components of the two vectors
      const new_xpos = new_x_r_pos + new_c_xpos_dispacement + PosMapX.get(node);
      const new_ypos = new_y_r_pos + new_c_ypos_dispacement + PosMapY.get(node);

      // now set these positions
      PosMapX.set(node, new_xpos);
      PosMapY.set(node, new_ypos);
    }
    console.log(PosMapX);
    console.log(PosMapY);
  }
  // return the position
  let PosMap = new Map();
  for (const p of PosMapX.keys()) {
    PosMap.set(p, new Point(PosMapX.get(p), 0, PosMapY.get(p)));
  }
  // get / set positions
  // move the points
  // get the average pos
  const sim_x = [];
  const sim_y = [];
  const sim_z = [];
  let interimPoint;
  for (const p of PosMap.keys()) {
    interimPoint = PosMap.get(p);
    sim_x.push(interimPoint.x);
    sim_y.push(interimPoint.y);
    sim_z.push(interimPoint.z);
  }

  const x_displacement = calculateAverage(sim_x);
  const y_displacement = calculateAverage(sim_y);
  const z_displacement = calculateAverage(sim_z);
  const dispacementVector = new Point(
    -x_displacement,
    -y_displacement,
    -z_displacement
  );

  PosMap = movePmap(PosMap, dispacementVector);

  G.apply_position_map(PosMap);
  const lmap = DrawEdgeLines(G, 1);
  const newLmap = await DrawEdgeBundling(lmap, 12, 5);
  return { pmap: PosMap, emap: newLmap.emap };
}

// instanciate a random set of positions 
function InstanciateRandomPositions(G){
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
function DrawEdgeLines(G, divDistance) {
  // this is the return map
  const lineMap = new Map();
  for (const key of G.edges.keys()) {
    const edge = G.edges.get(key);
    // get the start pos
    const start = G.nodes.get(edge.start).data.pos;
    const end = G.nodes.get(edge.end).data.pos;
    const Line = line_from_start_end_distance(start, end, divDistance);
    lineMap.set(key, Line);
  }
  return lineMap;
}

// update edge lines after moving points or something 
function UpdateEdgeLinesDist(G, divDistance){
  let edge, start, end, line;
  for (const key of G.edges.keys()) {
    edge = G.edges.get(key);
    // get the start pos
    start = G.nodes.get(edge.start).data.pos;
    end = G.nodes.get(edge.end).data.pos;
    line = line_from_start_end_distance(start, end, divDistance);
    edge.data.ldata = line;
  }
}

// function Update EdgeLines based on the number of divisions 
function UpdateEdgeLinesDivs(G, Divs){
  let edge, start, end, line;
  for (const key of G.edges.keys()) {
    edge = G.edges.get(key);
    // get the start pos
    start = G.nodes.get(edge.start).data.pos;
    end = G.nodes.get(edge.end).data.pos;
    line = line_from_start_end_divisions(start, end, Divs);
    edge.data.ldata = line;
  }
}

// now draw out the edge bundling thing
async function DrawEdgeBundling(LineMap, iterations, distance) {
  const returnArray = LineMap;
  // run it for whatever number of iterations
  for (let i = 0; i < iterations; i++) {
    // then iterate through every line
    for (const key of returnArray.keys()) {
      // then get the line that we are working with
      const line = returnArray.get(key).data.ldata;
      // then for each point in the line we have to move it closer to the other points
      for (let ii = 1; ii < line.points.length - 1; ii++) {
        // then get the point that we need to work with
        const x_s = [];
        const y_s = [];
        const z_s = [];
        const pnt = line.points[ii];
        // then run the point accumulation algoritm
        for (const otherKey of returnArray.keys()) {
          if (otherKey != key) {
            // then get the other line
            const otherLine = returnArray.get(otherKey).data.ldata;
            for (let iii = 1; iii < otherLine.points.length - 1; iii++) {
              const otherpoint = otherLine.points[iii];
              const d = calculateSquaredDistance(pnt, otherpoint);
              if (d <= Math.pow(distance, 2)) {
                const x_d = otherpoint.x - pnt.x;
                const y_d = otherpoint.y - pnt.y;
                const z_d = otherpoint.z - pnt.z;
                x_s.push(x_d);
                y_s.push(y_d);
                z_s.push(z_d);
              }
            }
          }
        }
        // now create a new displacement amount
        const avgx = pnt.x + 0.8 * (calculateAverage(x_s) || 0);
        const avgy = pnt.y + 0.8 * (calculateAverage(y_s) || 0);
        const avgz = pnt.z + 0.8 * (calculateAverage(z_s) || 0);
        const newPoint = new Point(avgx, avgy, avgz);
        line.points[ii] = newPoint;
      }
    }
  }
  // now return that array
  return { emap: returnArray };
}

// displace the th edges
function DisplaceEdgeInY(LineMap, displacement) {
  for (const key of LineMap.keys()) {
    const line = LineMap.get(key);
    // now for all the points in this
    let pnt, ydisval; 
    for (let i = 0; i < line.data.ldata.points.length; i++) {
      pnt = line.data.ldata.points[i];
      ydisval = displacement*Math.sin((Math.PI * i)/(line.data.ldata.points.length-1));
      pnt.y = pnt.y + ydisval;
    }
  }
}

// displace the graph by some measure 
function DisplaceVertices(nodeMap, parameter, displacement){
  let max = 0;
  let value, ydisplacement;
  // go through the thing and set the min max values 
  for(const node of nodeMap.values()){
    value = eval("node.data."+parameter);
    if(value >= max){
      max = value;
    }
  }
  // go through the nodes again and set the values 
  for(const node of nodeMap.values()){
    value = eval("node.data."+parameter);
    ydisplacement = ((value/max)*displacement);
    // now filter the values so that we know that the values are between a max and a min
    ydisplacement = Math.max(0, ydisplacement); // this sets the lower bound to be something 
    ydisplacement = Math.min(displacement, ydisplacement); // this sets the upper bound of the thing
    node.data.pos.y = ydisplacement;
  }
}

// draw the circular vertical packing crypto like drawing
async function HivePlot(G, selectedNode, step, startP) {
  const adj = G.get_adjacency();
  const DijkstraDepth = await Dijkstra(G, selectedNode);
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
    const yval = DijkstraDepth.get(node) * step;
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
  return { pmap: Pmap, emap: newLmap.emap };
}

// move graph
function MoveGraph(G, dispacement) {
  const Pmap  = G.get_position_map();
  const NewPmap = MovePmap(Pmap, dispacement);
  G.apply_position_map(NewPmap);
}

// move pmap
function MovePmap(Pmap, displacement) {
  const newPmap = new Map();
  for (const node of Pmap.keys()) {
    const p = Pmap.get(node);
    p.translate(displacement);
    newPmap.set(node, p);
  }
  return newPmap;
}

export {
  SimulateKamadaKawai,
  DrawEdgeLines,
  DrawEdgeBundling,
  HivePlot,
  DisplaceEdgeInY,
  MoveGraph,
  InstanciateRandomPositions,
  DisplaceVertices,
  UpdateEdgeLinesDist,
  UpdateEdgeLinesDivs,
};
