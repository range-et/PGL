var $h9nKb$three = require("three");
var $h9nKb$threeexamplesjsmlinesLine2js = require("three/examples/jsm/lines/Line2.js");
var $h9nKb$threeexamplesjsmlinesLineMaterial = require("three/examples/jsm/lines/LineMaterial");
var $h9nKb$threeexamplesjsmlinesLineGeometry = require("three/examples/jsm/lines/LineGeometry");
var $h9nKb$threeexamplesjsmcontrolsOrbitControls = require("three/examples/jsm/controls/OrbitControls");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
var $parcel$global =
typeof globalThis !== 'undefined'
  ? globalThis
  : typeof self !== 'undefined'
  ? self
  : typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
  ? global
  : {};
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequired21f"];
if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequired21f"] = parcelRequire;
}
parcelRequire.register("jYcHE", function(module, exports) {

$parcel$export(module.exports, "default", () => $36d87c0da0370973$export$2e2bcd8739ae039);

var $6Xdhg = parcelRequire("6Xdhg");

var $fd3jp = parcelRequire("fd3jp");

var $fw40F = parcelRequire("fw40F");

var $3WMe9 = parcelRequire("3WMe9");

var $cWcXJ = parcelRequire("cWcXJ");
// draw kamada kawai
async function SimulateKamadaKawai(G, iterations, simulationBound = 200, cohesionValue = 1) {
    const adjList = G.get_adjacency();
    // pos map
    const PosMapX = new Map();
    const PosMapY = new Map();
    let rx, ry;
    for (const node of adjList.keys()){
        rx = Math.random() * simulationBound;
        ry = Math.random() * simulationBound;
        PosMapX.set(node, rx);
        PosMapY.set(node, ry);
    }
    // start simulation
    for(let i = 0; i < iterations; i++){
        // calculate the clustering force
        // these two keep track of the node being simulated's
        // position - redeclaring is sorta unncessary
        let nodeX;
        let nodeY;
        // also keep track of all the x_s and y_s
        let x_s;
        let y_s;
        // also the same thing for the clustering force
        let y_r;
        let x_r;
        // same thing for the cohesion values that get recalculated
        let new_c_xpos_dispacement;
        let new_c_ypos_dispacement;
        for (const node of adjList.keys()){
            // this chunk is for the attraction force
            // get the node pos
            const neighbours = adjList.get(node);
            // remember always declare this nodes details
            nodeX = PosMapX.get(node);
            nodeY = PosMapY.get(node);
            // get the set of x's
            x_s = [];
            // get the set of y's
            y_s = [];
            // now iterate through the pos list and append
            neighbours.forEach((n_s)=>{
                const n_pos_x = PosMapX.get(n_s);
                const n_pos_y = PosMapY.get(n_s);
                x_s.push(n_pos_x);
                y_s.push(n_pos_y);
            });
            // now average out the values
            const new_c_xpos = (0, $6Xdhg.default).calculateAverage(x_s);
            const new_c_ypos = (0, $6Xdhg.default).calculateAverage(y_s);
            // this chunk is for the repelling force
            y_r = [];
            x_r = [];
            let diffx;
            let diffy;
            let othernodeX;
            let othernodeY;
            // then find the element
            for (const otherNode of G.nodes.keys())// get the position of all the other nodes
            if (otherNode != node) {
                // calculate inverse distance
                othernodeX = PosMapX.get(otherNode);
                othernodeY = PosMapY.get(otherNode);
                diffx = othernodeX - nodeX;
                diffy = othernodeY - nodeY;
                // get the inverse square value
                // add that to the *_r arrays
                x_r.push(diffx);
                y_r.push(diffy);
            }
            // this is the repulsion value
            const A_mult = 2;
            const new_x_r_pos = A_mult * 1 / ((0, $6Xdhg.default).calculateAverage(x_r) * (0, $6Xdhg.default).calculateAverage(x_r));
            const new_y_r_pos = A_mult * 1 / ((0, $6Xdhg.default).calculateAverage(y_r) * (0, $6Xdhg.default).calculateAverage(y_r));
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
    let PosMap = new Map();
    for (const p of PosMapX.keys())PosMap.set(p, new (0, $fw40F.Point)(PosMapX.get(p), 0, PosMapY.get(p)));
    // get / set positions
    // move the points
    // Since this simulation might have moved the whole graph off screen
    // get the average pos
    const sim_x = [];
    const sim_y = [];
    const sim_z = [];
    let interimPoint;
    for (const p1 of PosMap.keys()){
        interimPoint = PosMap.get(p1);
        sim_x.push(interimPoint.x);
        sim_y.push(interimPoint.y);
        sim_z.push(interimPoint.z);
    }
    const x_displacement = (0, $6Xdhg.default).calculateAverage(sim_x);
    const y_displacement = (0, $6Xdhg.default).calculateAverage(sim_y);
    const z_displacement = (0, $6Xdhg.default).calculateAverage(sim_z);
    const dispacementVector = new (0, $fw40F.Point)(-x_displacement, -y_displacement, -z_displacement);
    PosMap = MovePmap(PosMap, dispacementVector);
    return PosMap;
}
// instanciate a random set of positions
function InstanciateRandomPositions(G) {
    const adjList = G.get_adjacency();
    const PosMapX = new Map();
    const PosMapY = new Map();
    for (const node of adjList.keys()){
        PosMapX.set(node, Math.random() * 200);
        PosMapY.set(node, Math.random() * 200);
    }
    let PosMap = new Map();
    for (const p of PosMapX.keys())PosMap.set(p, new (0, $fw40F.Point)(PosMapX.get(p), 0, PosMapY.get(p)));
    G.apply_position_map(PosMap);
    const lmap = DrawEdgeLines(G, 1);
    return {
        pmap: PosMap,
        emap: lmap
    };
}
// draw the edge representations and then store them in the edge classes
function DrawEdgeLines(G, divDistance) {
    // this is the return map
    const lineMap = new Map();
    let edge;
    let start;
    let end;
    for (const key of G.edges.keys()){
        edge = G.edges.get(key);
        // get the start pos
        start = G.nodes.get(edge.start).data.pos;
        end = G.nodes.get(edge.end).data.pos;
        const Line1 = (0, $fd3jp.default).line_from_start_end_distance(start, end, divDistance);
        lineMap.set(key, Line1);
    }
    return lineMap;
}
// now draw out the edge bundling thing
async function DrawEdgeBundling(LineMap, iterations, distance) {
    const returnArray = LineMap;
    // variables that are getting reused
    let line;
    let otherLine;
    let x_s;
    let y_s;
    let z_s;
    let pnt;
    let otherpoint;
    let d;
    let x_d;
    let y_d;
    let z_d;
    let avgx;
    let avgy;
    let avgz;
    // run it for whatever number of iterations
    for(let i = 0; i < iterations; i++)// then iterate through every line
    for (let key of returnArray.keys()){
        // then get the line that we are working with
        line = returnArray.get(key);
        // then for each point in the line we have to move it closer to the other points
        for(let ii = 1; ii < line.points.length - 1; ii++){
            // then get the point that we need to work with
            x_s = [];
            y_s = [];
            z_s = [];
            pnt = line.points[ii];
            // then run the point accumulation algoritm
            for (let otherKey of returnArray.keys())if (otherKey != key) {
                // then get the other line
                otherLine = returnArray.get(otherKey);
                for(let iii = 1; iii < otherLine.points.length - 1; iii++){
                    otherpoint = otherLine.points[iii];
                    d = (0, $6Xdhg.default).calculateSquaredDistance(pnt, otherpoint);
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
            // now create a new displacement amount
            avgx = pnt.x + 0.8 * ((0, $6Xdhg.default).calculateAverage(x_s) || 0);
            avgy = pnt.y + 0.8 * ((0, $6Xdhg.default).calculateAverage(y_s) || 0);
            avgz = pnt.z + 0.8 * ((0, $6Xdhg.default).calculateAverage(z_s) || 0);
            const newPoint = new (0, $fw40F.Point)(avgx, avgy, avgz);
            line.points[ii] = newPoint;
        }
    }
    // now return that new map
    return returnArray;
}
// displace the th edges
// sorta like and arc in the middle of the thing
function DisplaceEdgeInY(LineMap, displacement) {
    for (const key of LineMap.keys()){
        const line = LineMap.get(key);
        // now for all the points in this
        let pnt, ydisval;
        for(let i = 0; i < line.points.length; i++){
            pnt = line.points[i];
            ydisval = displacement * Math.sin(Math.PI * i / (line.points.length - 1));
            pnt.y = pnt.y + ydisval;
        }
    }
}
// displace the graph by some measure
function DisplaceVertices(nodeMap, parameter, displacement) {
    let max = 0;
    let value, ydisplacement;
    // go through the thing and set the min max values
    for (let node of nodeMap.values()){
        value = eval("node.data." + parameter);
        if (value >= max) max = value;
    }
    // go through the nodes again and set the values
    for (const node1 of nodeMap.values()){
        value = eval("node.data." + parameter);
        ydisplacement = value / max * displacement;
        // now filter the values so that we know that the values are between a max and a min
        ydisplacement = Math.max(0, ydisplacement); // this sets the lower bound to be something
        ydisplacement = Math.min(displacement, ydisplacement); // this sets the upper bound of the thing
        node1.data.pos.y = ydisplacement;
    }
}
// draw the circular vertical packing crypto like drawing
async function HivePlot(G, selectedNode, step, startP) {
    const adj = G.get_adjacency();
    const DijkstraDepth = await (0, $cWcXJ.default).Dijkstra(G, selectedNode);
    // calculate the number of steps that I am searching through
    const steps = Math.max(...[
        ...DijkstraDepth.values()
    ]);
    // step map
    const stepMap = new Map();
    // now create a stepped ring of stuff
    for(let i = 0; i <= steps; i++){
        const ntier = [];
        for (const nkey of DijkstraDepth.keys())if (i == DijkstraDepth.get(nkey)) ntier.push(nkey);
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
    for (const node of adj.keys()){
        const yval = DijkstraDepth.get(node) * step;
        const depthArr = stepMap.get(DijkstraDepth.get(node));
        const angle = 2 * Math.PI * (depthArr.indexOf(node) / depthArr.length);
        const xval = Math.sin(angle) * yval;
        const zval = Math.cos(angle) * yval;
        // construct a new point
        const pnt = new (0, $fw40F.Point)(xval + xoff, -yval + yoff, zval + zoff);
        Pmap.set(node, pnt);
    }
    // simulate the lines
    G.apply_position_map(Pmap);
    const lmap = DrawEdgeLines(G, 1);
    const newLmap = await DrawEdgeBundling(lmap, 12, 5);
    return {
        pmap: Pmap,
        emap: newLmap
    };
}
// move graph
function MoveGraph(G, dispacement) {
    const Gmap = G.get_map();
    const NewPmap = MovePmap(Gmap.pmap, dispacement);
    const NewEmap = MoveEmap(Gmap.emap, dispacement);
    G.apply_drawing_maps({
        pmap: NewPmap,
        emap: NewEmap
    });
}
// move pmap
function MovePmap(Pmap, displacement) {
    const newPmap = new Map();
    for (let node of Pmap.keys()){
        const p = Pmap.get(node);
        p.translate(displacement);
        newPmap.set(node, p);
    }
    return newPmap;
}
// move the edges
function MoveEmap(Emap, dispacement) {
    const newEmap = new Map();
    // variables - instead of redeclaring
    let interimPoints;
    let interimLine;
    let newLine;
    for (let lineNumber of Emap.keys()){
        // reset the interim points
        interimPoints = [];
        // get the line
        interimLine = Emap.get(lineNumber);
        // move all the points
        for (let pnt of interimLine.points){
            pnt.translate(dispacement);
            // add this to the new stack of lines
            interimPoints.push(pnt);
        }
        // create a new line
        newLine = new (0, $3WMe9.Line)(interimPoints);
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
*/ // commenting out because appears to be redundant
// update edge lines after moving points or something
// this redraws the lines based on distance
function UpdateEdgeLinesDist(G, divDistance) {
    let edge;
    let start;
    let end;
    let line;
    for (const key of G.edges.keys()){
        edge = G.edges.get(key);
        // get the start pos
        start = G.nodes.get(edge.start).data.pos;
        end = G.nodes.get(edge.end).data.pos;
        line = (0, $fd3jp.default).line_from_start_end_distance(start, end, divDistance);
        edge.data.ldata = line;
    }
}
// function Update EdgeLines based on the number of divisions
// redraw the line based on divisions
function UpdateEdgeLinesDivs(G, Divs) {
    let edge;
    let start;
    let end;
    let line;
    for (const key of G.edges.keys()){
        edge = G.edges.get(key);
        // get the start pos
        start = G.nodes.get(edge.start).data.pos;
        end = G.nodes.get(edge.end).data.pos;
        line = (0, $fd3jp.default).line_from_start_end_divisions(start, end, Divs);
        edge.data.ldata = line;
    }
}
var $36d87c0da0370973$export$2e2bcd8739ae039 = {
    SimulateKamadaKawai: SimulateKamadaKawai,
    DrawEdgeLines: DrawEdgeLines,
    DrawEdgeBundling: DrawEdgeBundling,
    HivePlot: HivePlot,
    DisplaceEdgeInY: DisplaceEdgeInY,
    MoveGraph: MoveGraph,
    InstanciateRandomPositions: InstanciateRandomPositions,
    DisplaceVertices: DisplaceVertices,
    UpdateEdgeLinesDist: // these two are special functions
    UpdateEdgeLinesDist,
    UpdateEdgeLinesDivs: UpdateEdgeLinesDivs
};

});
parcelRequire.register("6Xdhg", function(module, exports) {

$parcel$export(module.exports, "default", () => $6492b9164e95c481$export$2e2bcd8739ae039);
// Calculate average
function $6492b9164e95c481$var$calculateAverage(arr) {
    let runningSum = 0;
    for(let i = 0; i < arr.length; i++)runningSum = runningSum + arr[i];
    const avg = runningSum / arr.length;
    return avg;
}
// calculate distance between two points
function $6492b9164e95c481$var$calculateDistance(p1, p2) {
    const d = Math.pow(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2), 0.5);
    return d;
}
// calculate squared distance sometimes we dont really need
// the actual root but just a rough idea
function $6492b9164e95c481$var$calculateSquaredDistance(p1, p2) {
    const d = Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2);
    return d;
}
// get a random subset of something from a array of things
// must provide the number of things we want from that array
function $6492b9164e95c481$var$getRandomSubset(arr, n) {
    var result = new Array(n), len = arr.length, taken = new Array(len);
    if (n > len) throw new RangeError("getRandom: more elements taken than available");
    while(n--){
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}
var $6492b9164e95c481$export$2e2bcd8739ae039 = {
    calculateAverage: $6492b9164e95c481$var$calculateAverage,
    calculateDistance: $6492b9164e95c481$var$calculateDistance,
    calculateSquaredDistance: $6492b9164e95c481$var$calculateSquaredDistance,
    getRandomSubset: $6492b9164e95c481$var$getRandomSubset
};

});

parcelRequire.register("fd3jp", function(module, exports) {

$parcel$export(module.exports, "default", () => $ef6d2250c1a51156$export$2e2bcd8739ae039);

var $fw40F = parcelRequire("fw40F");

var $3WMe9 = parcelRequire("3WMe9");

var $6Xdhg = parcelRequire("6Xdhg");
function $ef6d2250c1a51156$var$line_from_start_end_divisions(start, end, divisions) {
    // create a start and end time
    const Start = new (0, $fw40F.Point)(start.x, start.y, start.z);
    const End = new (0, $fw40F.Point)(end.x, end.y, end.z);
    // interpolated points
    const points = [];
    // divisions
    for(let i = 0; i <= divisions; i++){
        const interVar = i / divisions;
        const newx = interVar * Start.x + (1 - interVar) * End.x;
        const newy = interVar * Start.y + (1 - interVar) * End.y;
        const newz = interVar * Start.z + (1 - interVar) * End.z;
        const newPoint = new (0, $fw40F.Point)(newx, newy, newz);
        points.push(newPoint);
    }
    // create a new line
    const SubdividedLine = new (0, $3WMe9.Line)(points);
    return SubdividedLine;
}
function $ef6d2250c1a51156$var$line_from_start_end_distance(start, end, distance) {
    const dist = (0, $6Xdhg.default).calculateDistance(start, end);
    const divs = Math.round(dist / distance) + 2;
    const subdivline = $ef6d2250c1a51156$var$line_from_start_end_divisions(start, end, divs);
    return subdivline;
}
function $ef6d2250c1a51156$var$centroid(points) {
    let rx = 0;
    let ry = 0;
    let rz = 0;
    points.forEach((element)=>{
        rx += element.x;
        ry += element.y;
        rz += element.z;
    });
    rx = rx / points.length;
    ry = ry / points.length;
    rz = rz / points.length;
    const centroid1 = new (0, $fw40F.Point)(rx, ry, rz);
    return centroid1;
}
var $ef6d2250c1a51156$export$2e2bcd8739ae039 = {
    line_from_start_end_divisions: $ef6d2250c1a51156$var$line_from_start_end_divisions,
    line_from_start_end_distance: $ef6d2250c1a51156$var$line_from_start_end_distance,
    centroid: $ef6d2250c1a51156$var$centroid
};

});
parcelRequire.register("fw40F", function(module, exports) {

$parcel$export(module.exports, "Point", () => $6f087314b9046b23$export$baf26146a414f24a);
class $6f087314b9046b23$export$baf26146a414f24a {
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    // Points are somewhat the same thing as a vector 
    // So im using the same type instead of redeclaring the 
    // Type
    translate(Point1) {
        this.x = this.x + Point1.x;
        this.y = this.y + Point1.y;
        this.z = this.z + Point1.z;
    }
}

});

parcelRequire.register("3WMe9", function(module, exports) {

$parcel$export(module.exports, "Line", () => $d5f5a45608dd8afe$export$17d680238e50603e);

var $fw40F = parcelRequire("fw40F");
class $d5f5a45608dd8afe$export$17d680238e50603e {
    constructor(points){
        this.points = [];
        points.forEach((p)=>{
            const point = new (0, $fw40F.Point)(p.x, p.y, p.z);
            this.points.push(point);
        });
    }
}

});


parcelRequire.register("cWcXJ", function(module, exports) {

$parcel$export(module.exports, "default", () => $52c5dbc8ff16eb90$export$2e2bcd8739ae039);

var $9TL8g = parcelRequire("9TL8g");
// do a BFS Search Starting from some point
// searches the whole graph and returns a map of which node
// was searched from where
// to speed this up all the nodes are actually numbers
async function $52c5dbc8ff16eb90$var$BFSSearch(G, node) {
    const adj = G.get_adjacency();
    const exploredFromMap = new Map();
    const explored = [];
    const stack = [];
    // queue the first node
    stack.push(node);
    exploredFromMap.set(node, -1);
    // search through the whole graph
    while(stack.length > 0){
        const currentNode = stack.pop();
        // add this current node to the explored list
        explored.push(currentNode);
        const neighbours = adj.get(currentNode);
        for(let i = 0; i < neighbours.length; i++){
            const neighbour = neighbours[i];
            if (!explored.includes(neighbour)) {
                stack.push(neighbour);
                exploredFromMap.set(neighbour, currentNode);
            }
        }
    }
    // then return the explored from map
    return exploredFromMap;
}
// do a dijkstra Search Distance map
async function $52c5dbc8ff16eb90$var$Dijkstra(G, Node) {
    const adj = G.get_adjacency();
    const Dmap = new Map();
    // get the explored from map
    const exploredFromMap = await $52c5dbc8ff16eb90$var$BFSSearch(G, Node);
    // then for each element in the map go through
    // contact trace where that element came from
    for (const n of adj.keys()){
        let i = 0;
        let exploredFrom = exploredFromMap.get(n);
        while(exploredFrom != -1){
            exploredFrom = exploredFromMap.get(exploredFrom);
            i += 1;
        }
        Dmap.set(n, i);
    }
    // now return this map
    return Dmap;
}
// This file contains basic things like
// Graph searches and stuff
// this only returns one of the diameters that is the longest 
// not all of them
async function $52c5dbc8ff16eb90$var$GraphDiameter(graph) {
    // find the diameter of the graph
    // start Dijkstra from some random node
    let seed = Math.floor(Math.random() * graph.nodes.size);
    let Dstart = await $52c5dbc8ff16eb90$var$Dijkstra(graph, seed);
    // iterate through all the values and then get
    // the value that is the highest amongst the others
    let currentDistance = -1;
    for (const n of Dstart.keys()){
        const dval = Dstart.get(n);
        if (dval > currentDistance) {
            seed = n;
            currentDistance = dval;
        }
    }
    // then search from there to the furthest point again
    const newStart = seed;
    Dstart = await $52c5dbc8ff16eb90$var$Dijkstra(graph, seed);
    // repeat the thing
    currentDistance = -1;
    for (const n1 of Dstart.keys()){
        const dval = Dstart.get(n1);
        if (dval > currentDistance) {
            seed = n1;
            currentDistance = dval;
        }
    }
    const returnObj = {
        start: newStart,
        end: seed,
        distance: currentDistance
    };
    return returnObj;
}
// Select a subrgaph
// you must specify a list of nodes that you passed in
async function $52c5dbc8ff16eb90$var$SelectSubgraph(graph, nodeList) {
    const prunedNodes = new Map();
    const prunedEdges = new Map();
    // set the prunded vertices list
    nodeList.forEach((element)=>{
        // get the element from the graph and set that
        // data element in the  prunded vertices map
        const ndata = graph.nodes.get(element);
        prunedNodes.set(element, ndata);
    });
    // set the pruned edges list
    let i = 0;
    for (const edge of graph.edges.keys()){
        const edgeData = graph.edges.get(edge);
        if (nodeList.includes(edgeData.start) && nodeList.includes(edgeData.end)) {
            prunedEdges.set(i, edgeData);
            i += 1;
        }
    }
    // construct a new graph that represents the new graph
    const newGraph = await (0, $9TL8g.Graph).create(prunedNodes, prunedEdges);
    return newGraph;
}
var // this is where the exports happen
$52c5dbc8ff16eb90$export$2e2bcd8739ae039 = {
    GraphDiameter: $52c5dbc8ff16eb90$var$GraphDiameter,
    Dijkstra: $52c5dbc8ff16eb90$var$Dijkstra,
    BFSSearch: $52c5dbc8ff16eb90$var$BFSSearch,
    SelectSubgraph: $52c5dbc8ff16eb90$var$SelectSubgraph
};

});
parcelRequire.register("9TL8g", function(module, exports) {

$parcel$export(module.exports, "Graph", () => $3f08e238ca59e412$export$614db49f3febe941);

var $i8obY = parcelRequire("i8obY");
class $3f08e238ca59e412$export$614db49f3febe941 {
    constructor(nodes, edges){
        this.nodes = nodes;
        this.edges = edges;
    // execute Internal methods
    // this.printData();
    }
    // test function
    printData() {
        const message = "This is a graph with " + this.nodes.size + " nodes and " + this.edges.size + " edges";
        console.log(message);
    }
    // initialize
    async initialize() {
        await this.constructAdjacencyList();
    }
    // new create method
    static async create(nodes, edges) {
        const g = new $3f08e238ca59e412$export$614db49f3febe941(nodes, edges);
        await g.initialize();
        return g;
    }
    // construct the adjacency list represntation
    async constructAdjacencyList() {
        // I'm constructing a Graph here so some of the stuff doesnt matter
        this.edges.forEach((edge)=>{
            // get the start point
            const start = edge.start;
            const end = edge.end;
            // set the node property
            if (this.nodes.get(start)) {
                const relevantSNode = this.nodes.get(start);
                relevantSNode.neighbours.push(end);
            } else if (this.nodes.get(end)) {
                const relevantENode = this.nodes.get(end);
                relevantENode.neighbours.push(start);
            }
        });
        // then for each node then get the unique neighbours
        for (const key of this.nodes.keys()){
            const neighs = this.nodes.get(key).neighbours;
            const new_neigh = [
                ...new Set(neighs)
            ];
            const selfIndex = new_neigh.indexOf(key);
            if (selfIndex > -1) new_neigh.splice(selfIndex, 1); // 2nd parameter means remove one item only
            this.nodes.get(key).neighbours = new_neigh;
        }
    }
    // add a node
    add_node(nodeID, data) {
        this.nodes.set(nodeID, data);
    }
    // add an edge
    add_edge(start, end, data) {
        const newEdge = new (0, $i8obY.Edge)(start, end, data);
        // this is a new edge that we add to the edges
        this.edges.set(this.edges.size, newEdge);
        // also add this to the node neighbours
        const relevantNode = this.nodes.get(start);
        relevantNode.neighbours.push(end);
    }
    // get an adjacency list reprentation of the graph
    // this onlu has the indices and not the actual data
    // associated with the node to speed things up
    get_adjacency() {
        const SparseMap = new Map();
        // iterate through the node list
        for (const key of this.nodes.keys())SparseMap.set(key, this.nodes.get(key).neighbours);
        return SparseMap;
    }
    // set position based on an array of positions
    // this could be anything (we use kamada kawai )
    apply_position_map(data) {
        for (let n of data.keys())this.nodes.get(n).data = {
            ...this.nodes.get(n).data,
            pos: data.get(n)
        };
    }
    // create new edge pos representation
    // same approach for applying the key data
    apply_edge_pos_maps(data) {
        for (let key of data.keys())this.edges.get(key).data = {
            ...this.edges.get(key).data,
            ldata: data.get(key)
        };
    }
    // get the edge reps
    // this returns all the edge map readings
    get_edge_map() {
        const lines = new Map();
        for (const key of this.edges.keys()){
            const edge = this.edges.get(key).data.ldata;
            lines.set(key, edge);
        }
        return lines;
    }
    // graph apply pos and edge map
    apply_drawing_maps(layout) {
        if (layout.pmap) this.apply_position_map(layout.pmap);
        if (layout.emap) this.apply_edge_pos_maps(layout.emap);
    }
    // get the positon map of the graph
    get_map() {
        return {
            pmap: this.get_position_map(),
            emap: this.get_edge_map()
        };
    }
    get_position_map() {
        const pmap = new Map();
        for (const node of this.nodes.keys())pmap.set(node, this.nodes.get(node).data.pos);
        return pmap;
    }
}

});
parcelRequire.register("i8obY", function(module, exports) {

$parcel$export(module.exports, "Edge", () => $a077862b0141e79e$export$b9d9805c9b77a56d);
class $a077862b0141e79e$export$b9d9805c9b77a56d {
    constructor(start, end, data){
        this.start = start;
        this.end = end;
        this.data = {
            ...data
        };
    }
}

});




parcelRequire.register("eqUI8", function(module, exports) {

$parcel$export(module.exports, "default", () => $f6fe6fbbee6445e9$export$2e2bcd8739ae039);


var $1jyjM = parcelRequire("1jyjM");




var $bWT2q = parcelRequire("bWT2q");

var $8lQGS = parcelRequire("8lQGS");

var $cWcXJ = parcelRequire("cWcXJ");
parcelRequire("9TL8g");
// Draw the graph out as a bunch of vertices
// As like tiny squares
function DrawTHREEGraphVertices(Graph1, bounds, size = 1, color = 0xffffff, alpha = 1) {
    const positionAttribute = [];
    // get the corresponding points list
    const pmap = Graph1.get_position_map();
    // declare the sizes and colors
    let sizes;
    let colors;
    if (typeof size == "number") sizes = Array(Graph1.nodes.size).fill(size);
    else sizes = size;
    colors = Array(Graph1.nodes.size).fill(color);
    const labels = [];
    const colorVal = new $h9nKb$three.Color();
    colorVal.setRGB(255, 255, 255); // white as the default
    // process the data set
    let i = 0;
    let nodeData;
    for (let node of Graph1.nodes.keys()){
        nodeData = pmap.get(node);
        positionAttribute.push(nodeData.x * bounds, nodeData.y * bounds, nodeData.z * bounds);
        colorVal.toArray(colors, i * 3);
        labels.push(node);
        i += 1;
    }
    const geometry = new $h9nKb$three.BufferGeometry();
    // geometry attribute
    geometry.setAttribute("position", new $h9nKb$three.Float32BufferAttribute(positionAttribute, 3));
    // color attribute
    geometry.setAttribute("customColor", new $h9nKb$three.Float32BufferAttribute(colors, 3));
    // size attribute
    geometry.setAttribute("size", new $h9nKb$three.Float32BufferAttribute(sizes, 1));
    // label attribute
    geometry.setAttribute("label", new $h9nKb$three.Int32BufferAttribute(labels, 1));
    geometry.name = "nodes";
    // example material
    const PointMaterial = new $h9nKb$three.ShaderMaterial({
        uniforms: {
            color: {
                value: new $h9nKb$three.Color(0xffffff)
            },
            pointTexture: {
                value: new $h9nKb$three.TextureLoader().load("./Textures/Square.png")
            },
            alphaTest: {
                value: alpha
            }
        },
        vertexShader: (0, $bWT2q.vertexShader),
        fragmentShader: (0, $8lQGS.fragmentShader)
    });
    const vertices = new $h9nKb$three.Group();
    vertices.add(new $h9nKb$three.Points(geometry, PointMaterial));
    return vertices;
}
// then make a thing which draws out all the edges (THICK)
function DrawTHREEGraphEdgesThick(G, bounds, thickness = 0.2, color = 0xffffff) {
    // add the interpolation function
    const lineMap = G.get_edge_map();
    return DrawThickEdgesFromEdgeMap(lineMap, bounds, thickness, color);
}
// draw a thing to draw out all the edges from the edge map stuff
function DrawThickEdgesFromEdgeMap(emap, bounds, thickness = 0.2, color = 0xffffff) {
    // this is the line thing
    const mat = new (0, $h9nKb$threeexamplesjsmlinesLineMaterial.LineMaterial)({
        color: color,
        linewidth: thickness,
        vertexColors: true,
        //resolution:  // to be set by renderer, eventually
        dashed: false,
        alphaToCoverage: true
    });
    const meshes = new $h9nKb$three.Group();
    for (let lval of emap.values()){
        const mcolor = new $h9nKb$three.Color();
        // convert the color that we shall be using
        mcolor.setHex(color);
        const pnts = [];
        const cols = [];
        lval.points.forEach((pnt)=>{
            pnts.push(pnt.x * bounds - bounds / 2, pnt.y * bounds - bounds / 2, pnt.z * bounds - bounds / 2);
            cols.push(mcolor.r, mcolor.g, mcolor.b);
        });
        const geo = new (0, $h9nKb$threeexamplesjsmlinesLineGeometry.LineGeometry)();
        geo.setPositions(pnts);
        geo.setColors(cols);
        const line = new (0, $h9nKb$threeexamplesjsmlinesLine2js.Line2)(geo, mat);
        line.computeLineDistances();
        line.scale.set(1, 1, 1);
        meshes.add(line);
    }
    return meshes;
}
// make a thing that draws out all the lines (Thin)
function DrawTHREEGraphEdgesThin(G, bounds, color = 0xffffff) {
    // first get the edge map positions
    const emap = G.get_edge_map();
    return DrawThinEdgesFromEdgeMap(emap, bounds, color);
}
// function to draw edges from edge map
function DrawThinEdgesFromEdgeMap(emap, bounds, color = 0xffffff) {
    const material = new $h9nKb$three.LineBasicMaterial({
        color: color
    });
    const lines = new $h9nKb$three.Group();
    let points;
    for (const edge of emap.values()){
        points = [];
        // get the edge data
        const ldata = edge.points;
        ldata.forEach((element)=>{
            points.push(new $h9nKb$three.Vector3(element.x * bounds, element.y * bounds, element.z * bounds));
        });
        // then make the line thing
        const geometry = new $h9nKb$three.BufferGeometry().setFromPoints(points);
        const line = new $h9nKb$three.Line(geometry, material);
        lines.add(line);
    }
    return lines;
}
// draw the cube box graph here
function AddBoxBasedImaging(nodeMap, bounds, color = 0xffffff, size = 10) {
    // precompute all the sizes
    let sizes;
    if (typeof size == "number") sizes = Array(nodeMap.size).fill(size);
    else sizes = size;
    // returns a group
    const group = new $h9nKb$three.Group();
    const material = new $h9nKb$three.MeshBasicMaterial({
        color: color
    });
    let nodeData;
    let geometry;
    let nodeMesh;
    for(let i = 0; i < nodeMap.size; i++){
        nodeData = nodeMap.get(i);
        geometry = new $h9nKb$three.BoxGeometry(sizes[i]);
        geometry.name = i.toString();
        nodeMesh = new $h9nKb$three.Mesh(geometry, material);
        nodeMesh.position.set(nodeData.x * bounds, nodeData.y * bounds, nodeData.z * bounds);
        group.add(nodeMesh);
    }
    return group;
}
// Draw BoxBased imaging from a graph
function DrawTHREEBoxBasedVertices(graph, bounds, color = 0xffffff, size = 10) {
    const pmap = graph.get_position_map();
    const Bgroup = AddBoxBasedImaging(pmap, bounds, color, size);
    return Bgroup;
}
// draw cylinders where required
function AddCylinderBasedImaging(nodeMap, divisonLength, color = 0xffffff, size = 10) {
    // precompute all the sizes
    let sizes;
    if (typeof size == "number") sizes.Array(nodeMap.size).fill(size);
    else sizes = size;
    // returns a group
    const group = new $h9nKb$three.Group();
    const material = new $h9nKb$three.MeshBasicMaterial({
        color: color
    });
    let radius, circumfurence, segments;
    let nodeData;
    for(let i = 0; i < nodeMap.size; i++){
        nodeData = nodeMap.get(i);
        radius = sizes[i];
        circumfurence = 2 * radius * Math.PI;
        segments = Math.ceil(circumfurence / divisonLength);
        const geometry = new $h9nKb$three.CylinderGeometry(radius, radius, 10, segments);
        geometry.name = i.toString();
        const nodeMesh = new $h9nKb$three.Mesh(geometry, material);
        nodeMesh.position.set(nodeData.x, nodeData.y, nodeData.z);
        group.add(nodeMesh);
    }
    return group;
}
// draw the sparse graph as groups
// this seperates all the points based on some or the other group
async function AddInModularityBasedPointGroups(Graph2, propertyName) {
    // returns an array of groups
    const groups = new Map();
    let ndata;
    let modularity;
    for (let node of Graph2.nodes.keys()){
        ndata = Graph2.nodes.get(node);
        modularity = eval(`ndata.data.${propertyName}}`);
        if (groups.has(modularity)) groups.get(modularity).push(node);
        else groups.set(modularity, [
            node
        ]);
    }
    // then counstruct a bunch of subraphs
    const meshGraphVertices = new Map();
    const meshGraphEdges = new Map();
    let subgraphGroup;
    let subgraph;
    let pointRep;
    let edges;
    for (let modularityGroup of groups.keys()){
        subgraphGroup = groups.get(modularityGroup);
        // returns an array
        subgraph = await (0, $cWcXJ.default).SelectSubgraph(Graph2, subgraphGroup);
        // then make the vertex thing
        pointRep = DrawTHREEGraphVertices(subgraph, 1);
        meshGraphVertices.set(modularityGroup, pointRep);
        // make the edges
        edges = DrawSimplifiedEdges(subgraph, 0.03);
        meshGraphEdges.set(modularityGroup, edges);
    }
    const ROBJ = {
        nodeGroups: meshGraphVertices,
        EdgeGroups: meshGraphEdges
    };
    return ROBJ;
}
function DrawSimplifiedEdges(G, amount, color = 0xffffff) {
    const lineGroup = new $h9nKb$three.Group();
    const material = new $h9nKb$three.LineBasicMaterial({
        color: color
    });
    let start;
    let end;
    let points;
    for (let edge of G.edges.values())if (Math.random() <= amount) {
        start = G.nodes.get(edge.start).data.pos;
        end = G.nodes.get(edge.end).data.pos;
        points = [];
        points.push(new $h9nKb$three.Vector3(start.x, start.y, start.z));
        points.push(new $h9nKb$three.Vector3(end.x, end.y, end.z));
        const geometry = new $h9nKb$three.BufferGeometry().setFromPoints(points);
        const line = new $h9nKb$three.Line(geometry, material);
        lineGroup.add(line);
    }
    return lineGroup;
}
function ChangeTheVertexColours(vertices, indexArray, color) {
    let Attrib = vertices.geometry.attributes;
    let k = 0;
    const newCol = (0, $1jyjM.hexToRgb)(color);
    indexArray.forEach((node)=>{
        k = node * 3; // @ts-ignore
        Attrib.customColor.array[k] = newCol.r; // @ts-ignore
        Attrib.customColor.array[k + 1] = newCol.g; // @ts-ignore
        Attrib.customColor.array[k + 2] = newCol.b;
    });
    Attrib.customColor.needsUpdate = true;
}
function ResetVertexColors(vertices) {
    let Attrib = vertices.geometry.attributes;
    let k = 0;
    for(let i = 0; i < Attrib.customColor.count; i++){
        k = i * 3; // @ts-ignore
        Attrib.customColor.array[k] = 255; // @ts-ignore
        Attrib.customColor.array[k + 1] = 255; // @ts-ignore
        Attrib.customColor.array[k + 2] = 255;
    }
    Attrib.customColor.needsUpdate = true;
}
var $f6fe6fbbee6445e9$export$2e2bcd8739ae039 = {
    DrawTHREEGraphVertices: DrawTHREEGraphVertices,
    DrawTHREEGraphEdgesThick: DrawTHREEGraphEdgesThick,
    DrawTHREEGraphEdgesThin: DrawTHREEGraphEdgesThin,
    AddBoxBasedImaging: AddBoxBasedImaging,
    AddInModularityBasedPointGroups: AddInModularityBasedPointGroups,
    DrawThinEdgesFromEdgeMap: DrawThinEdgesFromEdgeMap,
    DrawThickEdgesFromEdgeMap: DrawThickEdgesFromEdgeMap,
    AddCylinderBasedImaging: AddCylinderBasedImaging,
    DrawSimplifiedEdges: DrawSimplifiedEdges,
    ChangeTheVertexColours: ChangeTheVertexColours,
    ResetVertexColors: ResetVertexColors,
    DrawTHREEBoxBasedVertices: DrawTHREEBoxBasedVertices
};

});
parcelRequire.register("1jyjM", function(module, exports) {

$parcel$export(module.exports, "hexToRgb", () => $a40c0a72ef2952b0$export$5a544e13ad4e1fa5);
///////////////
// color convert by Tim Down
// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function $a40c0a72ef2952b0$var$componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function $a40c0a72ef2952b0$export$34d09c4a771c46ef(r, g, b) {
    return "#" + $a40c0a72ef2952b0$var$componentToHex(r) + $a40c0a72ef2952b0$var$componentToHex(g) + $a40c0a72ef2952b0$var$componentToHex(b);
}
function $a40c0a72ef2952b0$export$5a544e13ad4e1fa5(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.toString().replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

});

parcelRequire.register("bWT2q", function(module, exports) {

$parcel$export(module.exports, "vertexShader", () => $a7829b923b8d65d1$export$84657c60382b0f83);
const $a7829b923b8d65d1$export$84657c60382b0f83 = `
attribute float size;
attribute vec3 customColor;

varying vec3 vColor;

void main() {
    vColor = customColor;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = size * ( 300.0 / -mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
}
`;

});

parcelRequire.register("8lQGS", function(module, exports) {

$parcel$export(module.exports, "fragmentShader", () => $99612fb76518d7f6$export$4391ef72fa03c19);
const $99612fb76518d7f6$export$4391ef72fa03c19 = `
uniform vec3 color;
uniform sampler2D pointTexture;
uniform float alphaTest;

varying vec3 vColor;

void main() {
    gl_FragColor = vec4( color * vColor, 1.0 );
    gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
    if ( gl_FragColor.a < alphaTest ) discard;
}
`;

});



$parcel$export(module.exports, "Graph", () => (parcelRequire("9TL8g")).Graph);
$parcel$export(module.exports, "GraphMethods", () => (parcelRequire("cWcXJ")).default);
$parcel$export(module.exports, "SampleData", () => $23157da2f76f8491$export$2e2bcd8739ae039);
$parcel$export(module.exports, "Constructors", () => $713effe557802f7b$export$2e2bcd8739ae039);
$parcel$export(module.exports, "Drawing", () => (parcelRequire("jYcHE")).default);
$parcel$export(module.exports, "Geometry", () => (parcelRequire("fd3jp")).default);
$parcel$export(module.exports, "Utilities", () => (parcelRequire("6Xdhg")).default);
$parcel$export(module.exports, "threeDWrapper", () => (parcelRequire("eqUI8")).default);
$parcel$export(module.exports, "GraphDrawer", () => $5b0769bb04ea8018$export$2e2bcd8739ae039);

var $9TL8g = parcelRequire("9TL8g");

var $cWcXJ = parcelRequire("cWcXJ");
const $86fe052ff5a9729f$export$b6cdfb6bd6195507 = {
    nodes: [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33, 
    ],
    edges: [
        [
            0,
            1
        ],
        [
            0,
            2
        ],
        [
            0,
            3
        ],
        [
            0,
            4
        ],
        [
            0,
            5
        ],
        [
            0,
            6
        ],
        [
            0,
            7
        ],
        [
            0,
            8
        ],
        [
            0,
            10
        ],
        [
            0,
            11
        ],
        [
            0,
            12
        ],
        [
            0,
            13
        ],
        [
            0,
            17
        ],
        [
            0,
            19
        ],
        [
            0,
            21
        ],
        [
            0,
            31
        ],
        [
            1,
            2
        ],
        [
            1,
            3
        ],
        [
            1,
            7
        ],
        [
            1,
            13
        ],
        [
            1,
            17
        ],
        [
            1,
            19
        ],
        [
            1,
            21
        ],
        [
            1,
            30
        ],
        [
            2,
            3
        ],
        [
            2,
            7
        ],
        [
            2,
            8
        ],
        [
            2,
            9
        ],
        [
            2,
            13
        ],
        [
            2,
            27
        ],
        [
            2,
            28
        ],
        [
            2,
            32
        ],
        [
            3,
            7
        ],
        [
            3,
            12
        ],
        [
            3,
            13
        ],
        [
            4,
            6
        ],
        [
            4,
            10
        ],
        [
            5,
            6
        ],
        [
            5,
            10
        ],
        [
            5,
            16
        ],
        [
            6,
            16
        ],
        [
            8,
            30
        ],
        [
            8,
            32
        ],
        [
            8,
            33
        ],
        [
            9,
            33
        ],
        [
            13,
            33
        ],
        [
            14,
            32
        ],
        [
            14,
            33
        ],
        [
            15,
            32
        ],
        [
            15,
            33
        ],
        [
            18,
            32
        ],
        [
            18,
            33
        ],
        [
            19,
            33
        ],
        [
            20,
            32
        ],
        [
            20,
            33
        ],
        [
            22,
            32
        ],
        [
            22,
            33
        ],
        [
            23,
            25
        ],
        [
            23,
            27
        ],
        [
            23,
            29
        ],
        [
            23,
            32
        ],
        [
            23,
            33
        ],
        [
            24,
            25
        ],
        [
            24,
            27
        ],
        [
            24,
            31
        ],
        [
            25,
            31
        ],
        [
            26,
            29
        ],
        [
            26,
            33
        ],
        [
            27,
            33
        ],
        [
            28,
            31
        ],
        [
            28,
            33
        ],
        [
            29,
            32
        ],
        [
            29,
            33
        ],
        [
            30,
            32
        ],
        [
            30,
            33
        ],
        [
            31,
            32
        ],
        [
            31,
            33
        ],
        [
            32,
            33
        ], 
    ]
};


const $5bb64a4bf797bbb0$export$aa88f89bcd11f8a9 = {
    nodes: [
        {
            id: 0,
            px: 0.09083423378081436,
            py: 1.164162667707135,
            member: 0
        },
        {
            id: 1,
            px: -0.5395391223661004,
            py: 0.8787097882002372,
            member: 0
        },
        {
            id: 2,
            px: 0.25483951690897244,
            py: -0.011894166387290125,
            member: 0
        },
        {
            id: 3,
            px: 0.5292273814873625,
            py: 0.8137715604013231,
            member: 0
        },
        {
            id: 4,
            px: 0.6759740200024705,
            py: 2.010590015934319,
            member: 3
        },
        {
            id: 5,
            px: 0.6648725961138767,
            py: 2.3765595730406712,
            member: 3
        },
        {
            id: 6,
            px: -0.015476857282255526,
            py: 2.421851366492045,
            member: 3
        },
        {
            id: 7,
            px: 0.9923183157183725,
            py: 0.7358251458599251,
            member: 0
        },
        {
            id: 8,
            px: -0.6148021363450372,
            py: -0.03465499210385469,
            member: 1
        },
        {
            id: 9,
            px: 0.24714516178546894,
            py: -1.012380550604274,
            member: 0
        },
        {
            id: 10,
            px: 1.3293288757439443,
            py: 1.8641805845025743,
            member: 3
        },
        {
            id: 11,
            px: -0.6571791278403557,
            py: 2.2163816367270526,
            member: 0
        },
        {
            id: 12,
            px: 1.5181044222926994,
            py: 1.3282665066698078,
            member: 0
        },
        {
            id: 13,
            px: -0.2979203330003603,
            py: 0.18438685313887027,
            member: 0
        },
        {
            id: 14,
            px: -1.7502345807734376,
            py: -1.0935551887354324,
            member: 1
        },
        {
            id: 15,
            px: -1.630224787934251,
            py: -1.5015879850995024,
            member: 1
        },
        {
            id: 16,
            px: 0.5585243394360673,
            py: 3.5,
            member: 3
        },
        {
            id: 17,
            px: -0.9776584881745712,
            py: 1.799718659872538,
            member: 0
        },
        {
            id: 18,
            px: -1.385649185975611,
            py: -1.870388302312794,
            member: 1
        },
        {
            id: 19,
            px: -0.9638464461397331,
            py: 0.24226946279518707,
            member: 0
        },
        {
            id: 20,
            px: -1.0268125129631975,
            py: -2.1543990524894148,
            member: 1
        },
        {
            id: 21,
            px: -1.3061680833745626,
            py: 1.527228276383933,
            member: 0
        },
        {
            id: 22,
            px: -0.5552461198316926,
            py: -2.2498070887997685,
            member: 1
        },
        {
            id: 23,
            px: 0.8262268914348979,
            py: -1.804253160744954,
            member: 2
        },
        {
            id: 24,
            px: 1.9952840970427212,
            py: -1.0382885070400036,
            member: 2
        },
        {
            id: 25,
            px: 1.9207660053211613,
            py: -0.5823795272244723,
            member: 2
        },
        {
            id: 26,
            px: -0.1664715343791652,
            py: -2.6527209168204373,
            member: 1
        },
        {
            id: 27,
            px: 0.9961959436268844,
            py: -1.0143754028553023,
            member: 2
        },
        {
            id: 28,
            px: 0.6488880579857091,
            py: -1.024671500275854,
            member: 2
        },
        {
            id: 29,
            px: 0.2398196340697841,
            py: -2.171491081802323,
            member: 1
        },
        {
            id: 30,
            px: -1.3348117368940753,
            py: -0.31290471156377053,
            member: 1
        },
        {
            id: 31,
            px: 0.6901260074375327,
            py: -0.2526601933356052,
            member: 2
        },
        {
            id: 32,
            px: -0.6030949145287146,
            py: -1.0927507849665647,
            member: 1
        },
        {
            id: 33,
            px: -0.3533395323856202,
            py: -1.1887389845640028,
            member: 1
        }, 
    ],
    edges: [
        [
            0,
            1
        ],
        [
            0,
            2
        ],
        [
            0,
            3
        ],
        [
            0,
            4
        ],
        [
            0,
            5
        ],
        [
            0,
            6
        ],
        [
            0,
            7
        ],
        [
            0,
            8
        ],
        [
            0,
            10
        ],
        [
            0,
            11
        ],
        [
            0,
            12
        ],
        [
            0,
            13
        ],
        [
            0,
            17
        ],
        [
            0,
            19
        ],
        [
            0,
            21
        ],
        [
            0,
            31
        ],
        [
            1,
            2
        ],
        [
            1,
            3
        ],
        [
            1,
            7
        ],
        [
            1,
            13
        ],
        [
            1,
            17
        ],
        [
            1,
            19
        ],
        [
            1,
            21
        ],
        [
            1,
            30
        ],
        [
            2,
            3
        ],
        [
            2,
            7
        ],
        [
            2,
            8
        ],
        [
            2,
            9
        ],
        [
            2,
            13
        ],
        [
            2,
            27
        ],
        [
            2,
            28
        ],
        [
            2,
            32
        ],
        [
            3,
            7
        ],
        [
            3,
            12
        ],
        [
            3,
            13
        ],
        [
            4,
            6
        ],
        [
            4,
            10
        ],
        [
            5,
            6
        ],
        [
            5,
            10
        ],
        [
            5,
            16
        ],
        [
            6,
            16
        ],
        [
            8,
            30
        ],
        [
            8,
            32
        ],
        [
            8,
            33
        ],
        [
            9,
            33
        ],
        [
            13,
            33
        ],
        [
            14,
            32
        ],
        [
            14,
            33
        ],
        [
            15,
            32
        ],
        [
            15,
            33
        ],
        [
            18,
            32
        ],
        [
            18,
            33
        ],
        [
            19,
            33
        ],
        [
            20,
            32
        ],
        [
            20,
            33
        ],
        [
            22,
            32
        ],
        [
            22,
            33
        ],
        [
            23,
            25
        ],
        [
            23,
            27
        ],
        [
            23,
            29
        ],
        [
            23,
            32
        ],
        [
            23,
            33
        ],
        [
            24,
            25
        ],
        [
            24,
            27
        ],
        [
            24,
            31
        ],
        [
            25,
            31
        ],
        [
            26,
            29
        ],
        [
            26,
            33
        ],
        [
            27,
            33
        ],
        [
            28,
            31
        ],
        [
            28,
            33
        ],
        [
            29,
            32
        ],
        [
            29,
            33
        ],
        [
            30,
            32
        ],
        [
            30,
            33
        ],
        [
            31,
            32
        ],
        [
            31,
            33
        ],
        [
            32,
            33
        ], 
    ]
};



var $9TL8g = parcelRequire("9TL8g");
class $2ba0ecfda52ea401$export$1e3a09c15b213958 {
    constructor(data){
        // this data is an arbitrary thing with which I can create any object
        this.data = {
            ...data
        };
        // the neighbours bit is explicity set from the code outside
        this.neighbours = [];
    }
}



var $i8obY = parcelRequire("i8obY");
// construct a graph based on an edge list etc
async function $713effe557802f7b$var$ConstructGraphNodeEdgesList(nodes, edges) {
    // make a node OBJ
    const nodeOBJ = new Map();
    for(let i = 0; i < nodes.length; i++){
        const n = new (0, $2ba0ecfda52ea401$export$1e3a09c15b213958)(nodes[i].data);
        nodeOBJ.set(nodes[i], n);
    }
    // make an edge object
    const edgeOBJ = new Map();
    for(let i1 = 0; i1 < edges.length; i1++){
        const e = new (0, $i8obY.Edge)(edges[i1][0], edges[i1][1], edges[i1].data);
        edgeOBJ.set(i1, e);
    }
    // make a graph object
    const G = await (0, $9TL8g.Graph).create(nodeOBJ, edgeOBJ);
    return G;
}
var $713effe557802f7b$export$2e2bcd8739ae039 = {
    ConstructGraphNodeEdgesList: $713effe557802f7b$var$ConstructGraphNodeEdgesList
};



var $9TL8g = parcelRequire("9TL8g");

var $fw40F = parcelRequire("fw40F");


var $i8obY = parcelRequire("i8obY");

var $jYcHE = parcelRequire("jYcHE");
async function $23157da2f76f8491$var$LoadZKC() {
    // load up the dataset representation
    const data = (0, $86fe052ff5a9729f$export$b6cdfb6bd6195507);
    const G = await (0, $713effe557802f7b$export$2e2bcd8739ae039).ConstructGraphNodeEdgesList(data.nodes, data.edges);
    return G;
}
async function $23157da2f76f8491$var$LoadZKCSimulated() {
    // make a map
    const data = (0, $5bb64a4bf797bbb0$export$aa88f89bcd11f8a9);
    const nodes = new Map();
    const edges = new Map();
    // set the node map
    data.nodes.forEach((node)=>{
        const id = node.id;
        const pos = new (0, $fw40F.Point)(node.px * 50, 0, node.py * 50);
        const modularity = node.member;
        const n = new (0, $2ba0ecfda52ea401$export$1e3a09c15b213958)({
            pos: pos,
            size: 10,
            info: "Node Info",
            modularity: modularity
        });
        nodes.set(id, n);
    });
    // set the edge map
    for(let i = 0; i < data.edges.length; i++){
        const edge = data.edges[i];
        const start = edge[0];
        const end = edge[1];
        const e = new (0, $i8obY.Edge)(start, end, {});
        edges.set(i, e);
    }
    // make a graph object
    const G = await (0, $9TL8g.Graph).create(nodes, edges);
    const lmap = (0, $jYcHE.default).DrawEdgeLines(G, 10);
    G.apply_edge_pos_maps(lmap);
    return G;
}
var // exports
$23157da2f76f8491$export$2e2bcd8739ae039 = {
    LoadZKC: $23157da2f76f8491$var$LoadZKC,
    LoadZKCSimulated: $23157da2f76f8491$var$LoadZKCSimulated
};




var $jYcHE = parcelRequire("jYcHE");

var $fd3jp = parcelRequire("fd3jp");

var $6Xdhg = parcelRequire("6Xdhg");

var $eqUI8 = parcelRequire("eqUI8");



var $eqUI8 = parcelRequire("eqUI8");
// this is the 3d graph drawing class with three js
class $5b0769bb04ea8018$var$GraphDrawer3d {
    constructor(GraphDrawerOptions3d, graphs){
        this.canvas = GraphDrawerOptions3d.canvas;
        this.width = GraphDrawerOptions3d.width;
        this.height = GraphDrawerOptions3d.height;
        // these maps are optional
        // ive kepth them in as a way of managing all the
        // geometry in the scene
        this.geometryMap = new Map();
        this.materialMap = new Map();
        this.meshMap = new Map();
        this.controls;
        this.renderer;
        this.camera;
        this.scene;
        // bounds is a global parameter that we change (think about this as scale)
        this.bounds = GraphDrawerOptions3d.bounds;
        // graph map is the hash map that holds all the
        // graphs that we are working with together
        this.graphs = new Map();
        // add the default graph to the graph map
        for(let i = 0; i < graphs.length; i++){
            const g = graphs[i];
            this.graphs.set(i, g);
        }
    }
    async init() {
        const t1 = performance.now();
        this.camera = new $h9nKb$three.PerspectiveCamera();
        // start up a new scene
        this.scene = new $h9nKb$three.Scene();
        // set up a renderer
        this.renderer = new $h9nKb$three.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xff00ff, 0);
        // add in a light
        this.scene.add(new $h9nKb$three.AmbientLight(0xffffff));
        // add a spotlight
        const DirectionalLight = new $h9nKb$three.DirectionalLight(0xffffff, 1);
        DirectionalLight.position.set(0, 10, 0);
        this.scene.add(DirectionalLight);
        // set up the control system
        this.controls = new (0, $h9nKb$threeexamplesjsmcontrolsOrbitControls.OrbitControls)(this.camera, this.renderer.domElement);
        this.camera.position.set(0, 100, 100);
        this.controls.autoRotate = true;
        this.controls.maxPolarAngle = Math.PI * 0.5;
        this.controls.maxDistance = 1000;
        this.controls.minDistance = 10;
        this.controls.update();
        // add in the graph that we wanted this.graphs.get('ProvidedGraph')
        for (const graph of this.graphs.keys()){
            const GeoGraph = (0, $eqUI8.default).DrawTHREEBoxBasedVertices(this.graphs.get(graph), this.bounds);
            this.scene.add(GeoGraph);
            const ThickEdges = (0, $eqUI8.default).DrawTHREEGraphEdgesThick(this.graphs.get(graph), this.bounds);
            this.scene.add(ThickEdges);
        }
        // edges
        // finally print out that the initialization has finished
        const t2 = performance.now();
        console.log("initialization has finished");
        console.log(`Time to initialize ${t2 - t1} milliseconds`);
    }
    // this stuff renders out one specific instances
    rendercall() {
        // this is the render draw call
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
    }
}
var $5b0769bb04ea8018$export$2e2bcd8739ae039 = {
    GraphDrawer3d: $5b0769bb04ea8018$var$GraphDrawer3d
};




//# sourceMappingURL=pgl.js.map
