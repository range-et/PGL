var $htxhw$three = require("three");
var $htxhw$threeexamplesjsmlinesLineMaterialjs = require("three/examples/jsm/lines/LineMaterial.js");
var $htxhw$threeexamplesjsmlinesLineGeometryjs = require("three/examples/jsm/lines/LineGeometry.js");
var $htxhw$threeexamplesjsmlinesLine2js = require("three/examples/jsm/lines/Line2.js");
var $htxhw$threeexamplesjsmcontrolsOrbitControls = require("three/examples/jsm/controls/OrbitControls");

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
parcelRequire.register("is5Zp", function(module, exports) {

$parcel$export(module.exports, "default", () => $d6ef7cea57f62fcb$export$2e2bcd8739ae039);

var $fDRV6 = parcelRequire("fDRV6");

var $i1Hf9 = parcelRequire("i1Hf9");

var $99CHB = parcelRequire("99CHB");

var $jDJ15 = parcelRequire("jDJ15");
// draw kamada kawai
async function SimulateKamadaKawai(G, iterations) {
    const adjList = G.get_adjacency();
    // pos map
    const PosMapX = new Map();
    const PosMapY = new Map();
    let rx, ry;
    for (const node of adjList.keys()){
        rx = Math.random() * 200;
        ry = Math.random() * 200;
        PosMapX.set(node, rx);
        PosMapY.set(node, ry);
    }
    // start simulation
    for(let i = 0; i < iterations; i++)// calculate the clustering force
    for (const node1 of adjList.keys()){
        // this chunk is for the attraction force
        // get the node pos
        const neighbours = adjList.get(node1);
        // get the set of x's
        const x_s = [];
        // get the set of y's
        const y_s = [];
        // now iterate through the pos list and append
        neighbours.forEach((n_s)=>{
            const n_pos_x = PosMapX.get(n_s);
            const n_pos_y = PosMapY.get(n_s);
            x_s.push(n_pos_x);
            y_s.push(n_pos_y);
        });
        // now average out the values
        const new_c_xpos = (0, $fDRV6.default).calculateAverage(x_s);
        const new_c_ypos = (0, $fDRV6.default).calculateAverage(y_s);
        // this chunk is for the repelling force
        const x_r = [];
        const y_r = [];
        // then find the element
        for (const otherNode of G.nodes.keys())// get the position of all the other nodes
        if (otherNode != node1) {
            // calculate inverse distance
            const distDiffX = PosMapX.get(otherNode) - PosMapX.get(node1);
            const distDiffY = PosMapY.get(otherNode) - PosMapY.get(node1);
            // get the inverse square value
            // add that to the *_r arrays
            x_r.push(distDiffX);
            y_r.push(distDiffY);
        }
        // this is the repulsion value
        const A_mult = 2;
        const new_x_r_pos = A_mult * 1 / ((0, $fDRV6.default).calculateAverage(x_r) * (0, $fDRV6.default).calculateAverage(x_r));
        const new_y_r_pos = A_mult * 1 / ((0, $fDRV6.default).calculateAverage(y_r) * (0, $fDRV6.default).calculateAverage(y_r));
        // calculate the dispacement amount in c/y pos
        // this is the cohesion value
        const C_mult = 1;
        const new_c_xpos_dispacement = C_mult * (new_c_xpos - PosMapX.get(node1));
        const new_c_ypos_dispacement = C_mult * (new_c_ypos - PosMapY.get(node1));
        // then add the x and y components of the two vectors
        const new_xpos = new_x_r_pos + new_c_xpos_dispacement + PosMapX.get(node1);
        const new_ypos = new_y_r_pos + new_c_ypos_dispacement + PosMapY.get(node1);
        // now set these positions
        PosMapX.set(node1, new_xpos);
        PosMapY.set(node1, new_ypos);
    }
    // return the position
    let PosMap = new Map();
    for (const p of PosMapX.keys())PosMap.set(p, new (0, $99CHB.Point)(PosMapX.get(p), 0, PosMapY.get(p)));
    // get / set positions
    // move the points
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
    const x_displacement = calculateAverage(sim_x);
    const y_displacement = calculateAverage(sim_y);
    const z_displacement = calculateAverage(sim_z);
    const dispacementVector = new (0, $99CHB.Point)(-x_displacement, -y_displacement, -z_displacement);
    PosMap = movePmap(PosMap, dispacementVector);
    G.apply_position_map(PosMap);
    const lmap = DrawEdgeLines(G, 1);
    const newLmap = await DrawEdgeBundling(lmap, 12, 5);
    return {
        pmap: PosMap,
        emap: newLmap.emap
    };
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
    for (const p of PosMapX.keys())PosMap.set(p, new (0, $99CHB.Point)(PosMapX.get(p), 0, PosMapY.get(p)));
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
    for (const key of G.edges.keys()){
        const edge = G.edges.get(key);
        // get the start pos
        const start = G.nodes.get(edge.start).data.pos;
        const end = G.nodes.get(edge.end).data.pos;
        const Line = (0, $i1Hf9.default).line_from_start_end_distance(start, end, divDistance);
        lineMap.set(key, Line);
    }
    return lineMap;
}
// update edge lines after moving points or something 
function UpdateEdgeLinesDist(G, divDistance) {
    let edge, start, end, line;
    for (const key of G.edges.keys()){
        edge = G.edges.get(key);
        // get the start pos
        start = G.nodes.get(edge.start).data.pos;
        end = G.nodes.get(edge.end).data.pos;
        line = (0, $i1Hf9.default).line_from_start_end_distance(start, end, divDistance);
        edge.data.ldata = line;
    }
}
// function Update EdgeLines based on the number of divisions 
function UpdateEdgeLinesDivs(G, Divs) {
    let edge, start, end, line;
    for (const key of G.edges.keys()){
        edge = G.edges.get(key);
        // get the start pos
        start = G.nodes.get(edge.start).data.pos;
        end = G.nodes.get(edge.end).data.pos;
        line = (0, $i1Hf9.default).line_from_start_end_divisions(start, end, Divs);
        edge.data.ldata = line;
    }
}
// now draw out the edge bundling thing
async function DrawEdgeBundling(LineMap, iterations, distance) {
    const returnArray = LineMap;
    // run it for whatever number of iterations
    for(let i = 0; i < iterations; i++)// then iterate through every line
    for (const key of returnArray.keys()){
        // then get the line that we are working with
        const line = returnArray.get(key).data.ldata;
        // then for each point in the line we have to move it closer to the other points
        for(let ii = 1; ii < line.points.length - 1; ii++){
            // then get the point that we need to work with
            const x_s = [];
            const y_s = [];
            const z_s = [];
            const pnt = line.points[ii];
            // then run the point accumulation algoritm
            for (const otherKey of returnArray.keys())if (otherKey != key) {
                // then get the other line
                const otherLine = returnArray.get(otherKey).data.ldata;
                for(let iii = 1; iii < otherLine.points.length - 1; iii++){
                    const otherpoint = otherLine.points[iii];
                    const d = (0, $fDRV6.default).calculateSquaredDistance(pnt, otherpoint);
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
            // now create a new displacement amount
            const avgx = pnt.x + 0.8 * ((0, $fDRV6.default).calculateAverage(x_s) || 0);
            const avgy = pnt.y + 0.8 * ((0, $fDRV6.default).calculateAverage(y_s) || 0);
            const avgz = pnt.z + 0.8 * ((0, $fDRV6.default).calculateAverage(z_s) || 0);
            const newPoint = new (0, $99CHB.Point)(avgx, avgy, avgz);
            line.points[ii] = newPoint;
        }
    }
    // now return that array
    return {
        emap: returnArray
    };
}
// displace the th edges
function DisplaceEdgeInY(LineMap, displacement) {
    for (const key of LineMap.keys()){
        const line = LineMap.get(key);
        // now for all the points in this
        let pnt, ydisval;
        for(let i = 0; i < line.data.ldata.points.length; i++){
            pnt = line.data.ldata.points[i];
            ydisval = displacement * Math.sin(Math.PI * i / (line.data.ldata.points.length - 1));
            pnt.y = pnt.y + ydisval;
        }
    }
}
// displace the graph by some measure 
function DisplaceVertices(nodeMap, parameter, displacement) {
    let max = 0;
    let value, ydisplacement;
    // go through the thing and set the min max values 
    for (const node of nodeMap.values()){
        value = eval("node.data." + parameter);
        if (value >= max) max = value;
    }
    // go through the nodes again and set the values 
    for (const node2 of nodeMap.values()){
        value = eval("node.data." + parameter);
        ydisplacement = value / max * displacement;
        // now filter the values so that we know that the values are between a max and a min
        ydisplacement = Math.max(0, ydisplacement); // this sets the lower bound to be something 
        ydisplacement = Math.min(displacement, ydisplacement); // this sets the upper bound of the thing
        node2.data.pos.y = ydisplacement;
    }
}
// draw the circular vertical packing crypto like drawing
async function HivePlot(G, selectedNode, step, startP) {
    const adj = G.get_adjacency();
    const DijkstraDepth = await (0, $jDJ15.default).Dijkstra(G, selectedNode);
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
        const pnt = new (0, $99CHB.Point)(xval + xoff, -yval + yoff, zval + zoff);
        Pmap.set(node, pnt);
    }
    // simulate the lines
    G.apply_position_map(Pmap);
    const lmap = DrawEdgeLines(G, 1);
    const newLmap = await DrawEdgeBundling(lmap, 12, 5);
    return {
        pmap: Pmap,
        emap: newLmap.emap
    };
}
// move graph
function MoveGraph(G, dispacement) {
    const Pmap = G.get_position_map();
    const NewPmap = MovePmap(Pmap, dispacement);
    G.apply_position_map(NewPmap);
}
// move pmap
function MovePmap(Pmap, displacement) {
    const newPmap = new Map();
    for (const node of Pmap.keys()){
        const p = Pmap.get(node);
        p.translate(displacement);
        newPmap.set(node, p);
    }
    return newPmap;
}
var $d6ef7cea57f62fcb$export$2e2bcd8739ae039 = {
    SimulateKamadaKawai: SimulateKamadaKawai,
    DrawEdgeLines: DrawEdgeLines,
    DrawEdgeBundling: DrawEdgeBundling,
    HivePlot: HivePlot,
    DisplaceEdgeInY: DisplaceEdgeInY,
    MoveGraph: MoveGraph,
    InstanciateRandomPositions: InstanciateRandomPositions,
    DisplaceVertices: DisplaceVertices,
    UpdateEdgeLinesDist: UpdateEdgeLinesDist,
    UpdateEdgeLinesDivs: UpdateEdgeLinesDivs
};

});
parcelRequire.register("fDRV6", function(module, exports) {

$parcel$export(module.exports, "default", () => $b63452e7c6daf3f1$export$2e2bcd8739ae039);
// Calculate average
function $b63452e7c6daf3f1$var$calculateAverage(arr) {
    let runningSum = 0;
    for(let i = 0; i < arr.length; i++)runningSum = runningSum + arr[i];
    const avg = runningSum / arr.length;
    return avg;
}
// calculate distance between two points
function $b63452e7c6daf3f1$var$calculateDistance(p1, p2) {
    const d = Math.pow(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2), 0.5);
    return d;
}
function $b63452e7c6daf3f1$var$calculateSquaredDistance(p1, p2) {
    const d = Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2);
    return d;
}
function $b63452e7c6daf3f1$var$getRandomSubset(arr, n) {
    var result = new Array(n), len = arr.length, taken = new Array(len);
    if (n > len) throw new RangeError("getRandom: more elements taken than available");
    while(n--){
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}
var $b63452e7c6daf3f1$export$2e2bcd8739ae039 = {
    calculateAverage: $b63452e7c6daf3f1$var$calculateAverage,
    calculateDistance: $b63452e7c6daf3f1$var$calculateDistance,
    calculateSquaredDistance: $b63452e7c6daf3f1$var$calculateSquaredDistance,
    getRandomSubset: $b63452e7c6daf3f1$var$getRandomSubset
};

});

parcelRequire.register("i1Hf9", function(module, exports) {

$parcel$export(module.exports, "default", () => $d1f9dd3c4c08380f$export$2e2bcd8739ae039);

var $99CHB = parcelRequire("99CHB");

var $3kDFt = parcelRequire("3kDFt");

var $fDRV6 = parcelRequire("fDRV6");
function $d1f9dd3c4c08380f$var$line_from_start_end_divisions(start, end, divisions) {
    // create a start and end time 
    const Start = new (0, $99CHB.Point)(start.x, start.y, start.z);
    const End = new (0, $99CHB.Point)(end.x, end.y, end.z);
    // interpolated points
    const points = [];
    // divisions 
    for(let i = 0; i <= divisions; i++){
        const interVar = i / divisions;
        const newx = interVar * Start.x + (1 - interVar) * End.x;
        const newy = interVar * Start.y + (1 - interVar) * End.y;
        const newz = interVar * Start.z + (1 - interVar) * End.z;
        const newPoint = new (0, $99CHB.Point)(newx, newy, newz);
        points.push(newPoint);
    }
    // create a new point 
    const SubdividedLine = new (0, $3kDFt.Line)(points);
    return SubdividedLine;
}
function $d1f9dd3c4c08380f$var$line_from_start_end_distance(start, end, distance) {
    const dist = (0, $fDRV6.default).calculateDistance(start, end);
    const divs = Math.round(dist / distance) + 2;
    const subdivline = $d1f9dd3c4c08380f$var$line_from_start_end_divisions(start, end, divs);
    return subdivline;
}
function $d1f9dd3c4c08380f$var$centroid(points) {
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
    const centroid1 = new (0, $99CHB.Point)(rx, ry, rz);
    return centroid1;
}
var $d1f9dd3c4c08380f$export$2e2bcd8739ae039 = {
    line_from_start_end_divisions: $d1f9dd3c4c08380f$var$line_from_start_end_divisions,
    line_from_start_end_distance: $d1f9dd3c4c08380f$var$line_from_start_end_distance,
    Point: $99CHB.Point,
    Line: $3kDFt.Line,
    centroid: $d1f9dd3c4c08380f$var$centroid
};

});
parcelRequire.register("99CHB", function(module, exports) {

$parcel$export(module.exports, "Point", () => $6aa2f9c9342feaef$export$baf26146a414f24a);
class $6aa2f9c9342feaef$export$baf26146a414f24a {
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    translate(Point1) {
        this.x = this.x + Point1.x;
        this.y = this.y + Point1.y;
        this.z = this.z + Point1.z;
    }
}

});

parcelRequire.register("3kDFt", function(module, exports) {

$parcel$export(module.exports, "Line", () => $26d2028dcd62894e$export$17d680238e50603e);

var $99CHB = parcelRequire("99CHB");
class $26d2028dcd62894e$export$17d680238e50603e {
    constructor(points){
        this.points = [];
        points.forEach((p)=>{
            const point = new (0, $99CHB.Point)(p.x, p.y, p.z);
            this.points.push(point);
        });
    }
}

});


parcelRequire.register("jDJ15", function(module, exports) {

$parcel$export(module.exports, "default", () => $e4c4942d050698b1$export$2e2bcd8739ae039);

var $iFDmY = parcelRequire("iFDmY");
// do a BFS Search Starting from some point
// searches the whole graph and returns a map of which node
// was searched from where
async function $e4c4942d050698b1$var$BFSSearch(G, node) {
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
// do a dijkstra Search
async function $e4c4942d050698b1$var$Dijkstra(G, Node) {
    const adj = G.get_adjacency();
    const Dmap = new Map();
    // get the explored from map
    const exploredFromMap = await $e4c4942d050698b1$var$BFSSearch(G, Node);
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
async function $e4c4942d050698b1$var$GraphDiameter(graph) {
    // find the diameter of the graph
    // start Dijkstra from some random node
    let seed = Math.floor(Math.random() * graph.nodes.size);
    let Dstart = await $e4c4942d050698b1$var$Dijkstra(graph, seed);
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
    Dstart = await $e4c4942d050698b1$var$Dijkstra(graph, seed);
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
async function $e4c4942d050698b1$var$SelectSubgraph(graph, nodeList) {
    const prunedVertices = new Map();
    const prunedEdges = new Map();
    // set the prunded vertices list
    nodeList.forEach((element)=>{
        // get the element from the graph and set that
        // data element in the  prunded vertices map
        const ndata = graph.nodes.get(element);
        prunedVertices.set(element, ndata);
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
    const newGraph = await (0, $iFDmY.Graph).create(prunedVertices, prunedEdges);
    return newGraph;
}
var // this is where the exports happen
$e4c4942d050698b1$export$2e2bcd8739ae039 = {
    GraphDiameter: $e4c4942d050698b1$var$GraphDiameter,
    Dijkstra: $e4c4942d050698b1$var$Dijkstra,
    BFSSearch: $e4c4942d050698b1$var$BFSSearch,
    SelectSubgraph: $e4c4942d050698b1$var$SelectSubgraph
};

});
parcelRequire.register("iFDmY", function(module, exports) {

$parcel$export(module.exports, "Graph", () => $d97a985115b478af$export$614db49f3febe941);
class $d97a985115b478af$export$614db49f3febe941 {
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
        const g = new $d97a985115b478af$export$614db49f3febe941(nodes, edges);
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
        this.nodes[nodeID] = data;
    }
    // add an edge
    add_edge(start, end, data) {
        const newEdge = new Edge(start, end, data);
        // this is a new edge that we add to the edges
        this.edges.set(this.edges.size, newEdge);
        // also add this to the node neighbours
        const relevantNode = this.nodes.get(start);
        relevantNode.neighbours.push(end);
    }
    // get a sparse reprentation of the graph
    get_adjacency() {
        const SparseMap = new Map();
        // iterate through the node list
        for (const key of this.nodes.keys())SparseMap.set(key, this.nodes.get(key).neighbours);
        return SparseMap;
    }
    // set position based on simulated array
    apply_position_map(data) {
        for (const n of data.keys())this.nodes.get(n).data = {
            ...this.nodes.get(n).data,
            pos: data.get(n)
        };
    }
    // create new edge pos representation
    apply_edge_pos_maps(data) {
        for (const key of data.keys())this.edges.get(key).data = {
            ...this.edges.get(key).data,
            ldata: data.get(key)
        };
    }
    // get the edge reps
    get_edge_lines() {
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
    get_position_map() {
        const returnObject = {
            pmap: new Map(),
            emap: new Map()
        };
        for (const node of this.nodes.keys())returnObject.pmap.set(node, this.nodes.get(node).data.pos);
        for (const edge of this.edges.keys())returnObject.emap.set(edge, this.edges.get(edge).data.ldata);
        return returnObject;
    }
}

});




$parcel$export(module.exports, "Graph", () => (parcelRequire("iFDmY")).Graph);
$parcel$export(module.exports, "GraphMethods", () => (parcelRequire("jDJ15")).default);
$parcel$export(module.exports, "SampleData", () => $c45b4e4a441b9114$export$2e2bcd8739ae039);
$parcel$export(module.exports, "Constructors", () => $1de12fba3c0269cf$export$2e2bcd8739ae039);
$parcel$export(module.exports, "Drawing", () => (parcelRequire("is5Zp")).default);
$parcel$export(module.exports, "Geometry", () => (parcelRequire("i1Hf9")).default);
$parcel$export(module.exports, "Utilities", () => (parcelRequire("fDRV6")).default);
$parcel$export(module.exports, "threeDWrapper", () => $589e8ef60d1a3840$export$2e2bcd8739ae039);
$parcel$export(module.exports, "GraphDrawer", () => $291fd03f386082c6$export$2e2bcd8739ae039);

var $iFDmY = parcelRequire("iFDmY");

var $jDJ15 = parcelRequire("jDJ15");
const $346b2f0b202e01a8$export$b6cdfb6bd6195507 = {
    "nodes": [
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
        33
    ],
    "edges": [
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
        ]
    ]
};


const $c4766e1c761bd447$export$aa88f89bcd11f8a9 = {
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



var $iFDmY = parcelRequire("iFDmY");
class $fe13961f472f5abd$export$3e8a3cc8713efbec {
    constructor(data){
        // this data is an arbitrary thing with which I can create any object
        this.data = {
            ...data
        };
        // the neighbours bit is explicity set from the code outside
        this.neighbours = [];
    }
}


class $8f322e21d4fb4fd7$export$b9d9805c9b77a56d {
    constructor(start, end, data){
        this.start = start;
        this.end = end;
        this.data = {
            ...data
        };
    }
}


// construct a graph based on an edge list etc
async function $1de12fba3c0269cf$var$ConstructGraphNodeEdgesList(nodes, edges) {
    // make a node OBJ
    const nodeOBJ = new Map();
    for(let i = 0; i < nodes.length; i++){
        const n = new (0, $fe13961f472f5abd$export$3e8a3cc8713efbec)(nodes[i].data);
        nodeOBJ.set(nodes[i], n);
    }
    // make an edge object
    const edgeOBJ = new Map();
    for(let i1 = 0; i1 < edges.length; i1++){
        const e = new (0, $8f322e21d4fb4fd7$export$b9d9805c9b77a56d)(edges[i1][0], edges[i1][1], edges[i1].data);
        edgeOBJ.set(i1, e);
    }
    // make a graph object
    const G = await (0, $iFDmY.Graph).create(nodeOBJ, edgeOBJ);
    return G;
}
var $1de12fba3c0269cf$export$2e2bcd8739ae039 = {
    ConstructGraphNodeEdgesList: $1de12fba3c0269cf$var$ConstructGraphNodeEdgesList
};



var $iFDmY = parcelRequire("iFDmY");

var $99CHB = parcelRequire("99CHB");



var $is5Zp = parcelRequire("is5Zp");
async function $c45b4e4a441b9114$var$LoadZKC() {
    // load up the dataset representation
    const data = (0, $346b2f0b202e01a8$export$b6cdfb6bd6195507);
    const G = await (0, $1de12fba3c0269cf$export$2e2bcd8739ae039).ConstructGraphNodeEdgesList(data.nodes, data.edges);
    return G;
}
async function $c45b4e4a441b9114$var$LoadZKCSimulated() {
    // make a map
    const data = (0, $c4766e1c761bd447$export$aa88f89bcd11f8a9);
    const nodes = new Map();
    const edges = new Map();
    // set the node map
    data.nodes.forEach((node)=>{
        const id = node.id;
        const pos = new (0, $99CHB.Point)(node.px * 50, 0, node.py * 50);
        const modularity = node.member;
        const n = new (0, $fe13961f472f5abd$export$3e8a3cc8713efbec)({
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
        const e = new (0, $8f322e21d4fb4fd7$export$b9d9805c9b77a56d)(start, end, {});
        edges.set(i, e);
    }
    // make a graph object
    const G = await (0, $iFDmY.Graph).create(nodes, edges);
    const lmap = (0, $is5Zp.default).DrawEdgeLines(G, 10);
    G.apply_edge_pos_maps(lmap);
    return G;
}
var // exports
$c45b4e4a441b9114$export$2e2bcd8739ae039 = {
    LoadZKC: $c45b4e4a441b9114$var$LoadZKC,
    LoadZKCSimulated: $c45b4e4a441b9114$var$LoadZKCSimulated
};




var $is5Zp = parcelRequire("is5Zp");

var $i1Hf9 = parcelRequire("i1Hf9");

var $fDRV6 = parcelRequire("fDRV6");




const $75f01f84c4c7d967$export$84657c60382b0f83 = `
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


const $a85b0528a4744ce3$export$4391ef72fa03c19 = `
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



var $jDJ15 = parcelRequire("jDJ15");
// Draw the graph out as a bunch of vertices
function $589e8ef60d1a3840$var$DrawTHREEGraphVertices(Graph, bounds) {
    const positionAttribute = [];
    const sizes = [];
    const colors = [];
    const labels = [];
    const color = new $htxhw$three.Color();
    // process the data set
    let i = 0;
    for (const node of Graph.nodes.keys()){
        const nodeData = Graph.nodes.get(node);
        positionAttribute.push(nodeData.data.pos.x * bounds, nodeData.data.pos.y * bounds, nodeData.data.pos.z * bounds);
        color.setRGB(255, 255, 255);
        color.toArray(colors, i * 3);
        if (nodeData.data.size != undefined) sizes.push(nodeData.data.size);
        else sizes.push(4);
        labels.push(node);
        i += 1;
    }
    const geometry = new $htxhw$three.BufferGeometry();
    // geometry attribute
    geometry.setAttribute("position", new $htxhw$three.Float32BufferAttribute(positionAttribute, 3));
    // color attribute
    geometry.setAttribute("customColor", new $htxhw$three.Float32BufferAttribute(colors, 3));
    // size attribute
    geometry.setAttribute("size", new $htxhw$three.Float32BufferAttribute(sizes, 1));
    // label attribute
    geometry.setAttribute("label", new $htxhw$three.Int32BufferAttribute(labels, 1));
    geometry.name = "THIS IS THE VERTEX GROUP";
    // example material
    const PointMaterial = new $htxhw$three.ShaderMaterial({
        uniforms: {
            color: {
                value: new $htxhw$three.Color(0xffffff)
            },
            pointTexture: {
                value: new $htxhw$three.TextureLoader().load("./Textures/Square.png")
            },
            alphaTest: {
                value: 0.9
            }
        },
        vertexShader: (0, $75f01f84c4c7d967$export$84657c60382b0f83),
        fragmentShader: (0, $a85b0528a4744ce3$export$4391ef72fa03c19)
    });
    const vertices = new $htxhw$three.Points(geometry, PointMaterial);
    return vertices;
}
// then make a thing which draws out all the edges (THICK)
function $589e8ef60d1a3840$var$DrawTHREEGraphEdgesThick(G, bounds) {
    return $589e8ef60d1a3840$var$DrawThickEdgesFromEdgeMap(G.edges, bounds);
}
// draw a thing to draw out all the edges from the edge map stuff
function $589e8ef60d1a3840$var$DrawThickEdgesFromEdgeMap(emap, bounds) {
    // this is the line thing
    const mat = new (0, $htxhw$threeexamplesjsmlinesLineMaterialjs.LineMaterial)({
        color: 0xffffff,
        linewidth: 0.02,
        vertexColors: true,
        //resolution:  // to be set by renderer, eventually
        dashed: false,
        alphaToCoverage: true
    });
    const meshes = new $htxhw$three.Group();
    for (const edge of emap.values()){
        const lval = edge.data.ldata;
        const color = new $htxhw$three.Color();
        color.setHSL(1.0, 1.0, 1.0);
        const pnts = [];
        const cols = [];
        lval.points.forEach((pnt)=>{
            pnts.push(pnt.x * bounds - bounds / 2, pnt.y * bounds - bounds / 2, pnt.z * bounds - bounds / 2);
            cols.push(color.r, color.g, color.b);
        });
        const geo = new (0, $htxhw$threeexamplesjsmlinesLineGeometryjs.LineGeometry)();
        geo.setPositions(pnts);
        geo.setColors(cols);
        const line = new (0, $htxhw$threeexamplesjsmlinesLine2js.Line2)(geo, mat);
        line.computeLineDistances();
        line.scale.set(1, 1, 1);
        meshes.add(line);
    }
    return meshes;
}
// make a thing that draws out all the lines (Thin)
function $589e8ef60d1a3840$var$DrawTHREEGraphEdgesThin(G, bounds) {
    return $589e8ef60d1a3840$var$DrawThinEdgesFromEdgeMap(G.edges, bounds);
}
// function to draw edges from edge map
function $589e8ef60d1a3840$var$DrawThinEdgesFromEdgeMap(emap, bounds) {
    const material = new $htxhw$three.LineBasicMaterial({
        color: 0x90e0ef
    });
    const lines = new $htxhw$three.Group();
    for (const edge of emap.values()){
        const points = [];
        // get the edge data
        const ldata = edge.data.ldata.points;
        ldata.forEach((element)=>{
            points.push(new $htxhw$three.Vector3(element.x * bounds, element.y * bounds, element.z * bounds));
        });
        // then make the line thing
        const geometry = new $htxhw$three.BufferGeometry().setFromPoints(points);
        const line = new $htxhw$three.Line(geometry, material);
        lines.add(line);
    }
    return lines;
}
// draw the cube box graph here
function $589e8ef60d1a3840$var$AddBoxBasedImaging(vertexMap, bounds) {
    // returns a group
    const group = new $htxhw$three.Group();
    const material = new $htxhw$three.MeshBasicMaterial({
        color: 0x0466c8
    });
    for (const node of vertexMap.keys()){
        const nodeData = vertexMap.get(node);
        const geometry = new $htxhw$three.BoxGeometry(nodeData.data.size, nodeData.data.size, nodeData.data.size);
        geometry.name = node;
        const nodeMesh = new $htxhw$three.Mesh(geometry, material);
        nodeMesh.position.set(nodeData.data.pos.x * bounds, nodeData.data.pos.y * bounds, nodeData.data.pos.z * bounds);
        group.add(nodeMesh);
    }
    return group;
}
// Draw BoxBased imaging from a graph
function $589e8ef60d1a3840$var$DrawTHREEBoxBasedVertices(graph, bounds) {
    const Bgroup = $589e8ef60d1a3840$var$AddBoxBasedImaging(graph.nodes, bounds);
    return Bgroup;
}
// draw cylinders where required
function $589e8ef60d1a3840$var$AddCylinderBasedImaging(vertexMap, divisonLength) {
    // returns a group
    const group = new $htxhw$three.Group();
    const material = new $htxhw$three.MeshBasicMaterial({
        color: 0xffffff
    });
    let radius, circumfurence, segments;
    for (const node of vertexMap.keys()){
        const nodeData = vertexMap.get(node);
        radius = nodeData.data.size;
        circumfurence = 2 * radius * Math.PI;
        segments = Math.ceil(circumfurence / divisonLength);
        const geometry = new $htxhw$three.CylinderGeometry(radius, radius, 10, segments);
        geometry.name = node;
        const nodeMesh = new $htxhw$three.Mesh(geometry, material);
        nodeMesh.position.set(nodeData.data.pos.x, nodeData.data.pos.y, nodeData.data.pos.z);
        group.add(nodeMesh);
    }
    return group;
}
// draw the sparse graph as groups
async function $589e8ef60d1a3840$var$AddInModularityBasedPointGroups(Graph, modularityList) {
    // returns an array of groups
    const groups = new Map();
    const otherNodes = [];
    for (const node of Graph.nodes.keys()){
        const ndata = Graph.nodes.get(node);
        const modularity = ndata.data.modularity;
        if (modularityList.includes(modularity)) {
            if (groups.has(modularity)) groups.get(modularity).push(node);
            else groups.set(modularity, [
                node
            ]);
        } else otherNodes.push(node);
    }
    // then counstruct a bunch of subraphs
    const meshGraphVertices = new Map();
    const meshGraphEdges = new Map();
    // make a seperate group of nodes that have less than 2 neighbours
    console.log("Now started the process of vertex subdivision");
    for (const modularityGroup of groups.keys()){
        const subgraphGroup = groups.get(modularityGroup);
        // returns an array
        const subgraph = await (0, $jDJ15.default).SelectSubgraph(Graph, subgraphGroup);
        // then make the vertex thing
        const meshRep = $589e8ef60d1a3840$var$DrawTHREEGraphVertices(subgraph, 1);
        meshGraphVertices.set(modularityGroup, meshRep);
        // make the edges
        const edges = $589e8ef60d1a3840$var$DrawSimplifiedEdges(subgraph, 0.03);
        meshGraphEdges.set(modularityGroup, edges);
    }
    // now for all the vertices in the "other" Nodes map add in the
    // rest of the stuff for us to play around with
    const OtherNodes = await (0, $jDJ15.default).SelectSubgraph(Graph, otherNodes);
    const LeafVertices = $589e8ef60d1a3840$var$DrawTHREEGraphVertices(OtherNodes, 1);
    const ROBJ = {
        vertices: meshGraphVertices,
        edges: meshGraphEdges,
        leafs: LeafVertices
    };
    return ROBJ;
}
function $589e8ef60d1a3840$var$DrawSimplifiedEdges(G, amount) {
    const lineGroup = new $htxhw$three.Group();
    const material = new $htxhw$three.LineBasicMaterial({
        color: 0x90e0ef
    });
    for (const edge of G.edges.values())if (Math.random() <= amount) {
        const start = G.nodes.get(edge.start).data.pos;
        const end = G.nodes.get(edge.end).data.pos;
        const points = [];
        points.push(new $htxhw$three.Vector3(start.x, start.y, start.z));
        points.push(new $htxhw$three.Vector3(end.x, end.y, end.z));
        const geometry = new $htxhw$three.BufferGeometry().setFromPoints(points);
        const line = new $htxhw$three.Line(geometry, material);
        lineGroup.add(line);
    }
    return lineGroup;
}
function $589e8ef60d1a3840$var$ChangeTheVertexColours(vertices, indexArray, color) {
    let Attrib = vertices.geometry.attributes;
    let k = 0;
    indexArray.forEach((node)=>{
        k = node * 3;
        Attrib.customColor.array[k] = color.r;
        Attrib.customColor.array[k + 1] = color.g;
        Attrib.customColor.array[k + 2] = color.b;
    });
    Attrib.customColor.needsUpdate = true;
}
function $589e8ef60d1a3840$var$ResetVertexColors(vertices) {
    let Attrib = vertices.geometry.attributes;
    let k = 0;
    for(let i = 0; i < Attrib.customColor.count; i++){
        k = i * 3;
        Attrib.customColor.array[k] = 100;
        Attrib.customColor.array[k + 1] = 237;
        Attrib.customColor.array[k + 2] = 146;
    }
    Attrib.customColor.needsUpdate = true;
}
var $589e8ef60d1a3840$export$2e2bcd8739ae039 = {
    DrawTHREEGraphVertices: $589e8ef60d1a3840$var$DrawTHREEGraphVertices,
    DrawTHREEGraphEdgesThick: $589e8ef60d1a3840$var$DrawTHREEGraphEdgesThick,
    DrawTHREEGraphEdgesThin: $589e8ef60d1a3840$var$DrawTHREEGraphEdgesThin,
    AddBoxBasedImaging: $589e8ef60d1a3840$var$AddBoxBasedImaging,
    AddInModularityBasedPointGroups: $589e8ef60d1a3840$var$AddInModularityBasedPointGroups,
    DrawThinEdgesFromEdgeMap: $589e8ef60d1a3840$var$DrawThinEdgesFromEdgeMap,
    DrawThickEdgesFromEdgeMap: $589e8ef60d1a3840$var$DrawThickEdgesFromEdgeMap,
    AddCylinderBasedImaging: $589e8ef60d1a3840$var$AddCylinderBasedImaging,
    DrawSimplifiedEdges: $589e8ef60d1a3840$var$DrawSimplifiedEdges,
    ChangeTheVertexColours: $589e8ef60d1a3840$var$ChangeTheVertexColours,
    ResetVertexColors: $589e8ef60d1a3840$var$ResetVertexColors,
    DrawTHREEBoxBasedVertices: $589e8ef60d1a3840$var$DrawTHREEBoxBasedVertices
};





// this is the 3d graph drawing class with three js
class $291fd03f386082c6$var$GraphDrawer3d {
    constructor(GraphDrawerOptions3d, graphs){
        this.canvas = GraphDrawerOptions3d.canvas;
        this.width = GraphDrawerOptions3d.width;
        this.height = GraphDrawerOptions3d.height;
        this.geometryMap = new Map();
        this.materialMap = new Map();
        this.meshMap = new Map();
        this.controls;
        this.renderer;
        this.camera;
        this.scene;
        // bounds is a global parameter that we change (think about this as scale)
        this.bound = GraphDrawerOptions3d.bounds;
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
        this.camera = new $htxhw$three.PerspectiveCamera();
        // start up a new scene
        this.scene = new $htxhw$three.Scene();
        // set up a renderer
        this.renderer = new $htxhw$three.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xff00ff, 0);
        // add in a light
        this.scene.add(new $htxhw$three.AmbientLight(0xffffff));
        // add a spotlight 
        const DirectionalLight = new $htxhw$three.DirectionalLight(0xffffff, 1);
        DirectionalLight.position.set(0, 10, 0);
        this.scene.add(DirectionalLight);
        // set up the control system
        this.controls = new (0, $htxhw$threeexamplesjsmcontrolsOrbitControls.OrbitControls)(this.camera, this.renderer.domElement);
        this.camera.position.set(0, 100, 100);
        this.controls.autoRotate = true;
        this.controls.maxPolarAngle = Math.PI * 0.5;
        this.camera.enableDamping = true;
        this.controls.maxDistance = 1000;
        this.controls.minDistance = 10;
        this.controls.update();
        // add in the graph that we wanted this.graphs.get('ProvidedGraph')
        for (const graph of this.graphs.keys()){
            const GeoGraph = (0, $589e8ef60d1a3840$export$2e2bcd8739ae039).DrawTHREEBoxBasedVertices(this.graphs.get(graph), this.bound);
            this.scene.add(GeoGraph);
            const ThickEdges = (0, $589e8ef60d1a3840$export$2e2bcd8739ae039).DrawTHREEGraphEdgesThick(this.graphs.get(graph), this.bound);
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
var $291fd03f386082c6$export$2e2bcd8739ae039 = {
    GraphDrawer3d: $291fd03f386082c6$var$GraphDrawer3d
};




//# sourceMappingURL=pgl.js.map
