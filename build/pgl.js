var $k4wjR$three = require("three");
var $k4wjR$threeexamplesjsmcontrolsOrbitControls = require("three/examples/jsm/controls/OrbitControls");

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
parcelRequire.register("fNjyM", function(module, exports) {

$parcel$export(module.exports, "SimulateKamadaKawai", () => SimulateKamadaKawai);
$parcel$export(module.exports, "DrawEdgeLines", () => DrawEdgeLines);
$parcel$export(module.exports, "DrawEdgeBundling", () => DrawEdgeBundling);
$parcel$export(module.exports, "InstanciateRandomPositions", () => InstanciateRandomPositions);
$parcel$export(module.exports, "UpdateEdgeLinesDist", () => UpdateEdgeLinesDist);
$parcel$export(module.exports, "UpdateEdgeLinesDivs", () => UpdateEdgeLinesDivs);
$parcel$export(module.exports, "DisplaceEdgeInY", () => DisplaceEdgeInY);
$parcel$export(module.exports, "DisplaceVertices", () => DisplaceVertices);
$parcel$export(module.exports, "HivePlot", () => HivePlot);
$parcel$export(module.exports, "MoveGraph", () => MoveGraph);

var $HE0Gb = parcelRequire("HE0Gb");

var $eRsEH = parcelRequire("eRsEH");

var $34IZ1 = parcelRequire("34IZ1");

var $hXaBA = parcelRequire("hXaBA");
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
    for(let i = 0; i < iterations; i++){
        // calculate the clustering force
        for (const node of adjList.keys()){
            // this chunk is for the attraction force
            // get the node pos
            const neighbours = adjList.get(node);
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
            const new_c_xpos = (0, $HE0Gb.calculateAverage)(x_s);
            const new_c_ypos = (0, $HE0Gb.calculateAverage)(y_s);
            // this chunk is for the repelling force
            const x_r = [];
            const y_r = [];
            // then find the element
            for (const otherNode of G.nodes.keys())// get the position of all the other nodes
            if (otherNode != node) {
                // calculate inverse distance
                const distDiffX = PosMapX.get(otherNode) - PosMapX.get(node);
                const distDiffY = PosMapY.get(otherNode) - PosMapY.get(node);
                // get the inverse square value
                // add that to the *_r arrays
                x_r.push(distDiffX);
                y_r.push(distDiffY);
            }
            // this is the repulsion value
            const A_mult = 2;
            const new_x_r_pos = A_mult * 1 / ((0, $HE0Gb.calculateAverage)(x_r) * (0, $HE0Gb.calculateAverage)(x_r));
            const new_y_r_pos = A_mult * 1 / ((0, $HE0Gb.calculateAverage)(y_r) * (0, $HE0Gb.calculateAverage)(y_r));
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
    for (const p of PosMapX.keys())PosMap.set(p, new (0, $34IZ1.Point)(PosMapX.get(p), 0, PosMapY.get(p)));
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
    const x_displacement = (0, $HE0Gb.calculateAverage)(sim_x);
    const y_displacement = (0, $HE0Gb.calculateAverage)(sim_y);
    const z_displacement = (0, $HE0Gb.calculateAverage)(sim_z);
    const dispacementVector = new (0, $34IZ1.Point)(-x_displacement, -y_displacement, -z_displacement);
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
    for (const p of PosMapX.keys())PosMap.set(p, new (0, $34IZ1.Point)(PosMapX.get(p), 0, PosMapY.get(p)));
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
        const Line = (0, $eRsEH.line_from_start_end_distance)(start, end, divDistance);
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
        line = (0, $eRsEH.line_from_start_end_distance)(start, end, divDistance);
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
        line = (0, $eRsEH.line_from_start_end_divisions)(start, end, Divs);
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
                    const d = (0, $HE0Gb.calculateSquaredDistance)(pnt, otherpoint);
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
            const avgx = pnt.x + 0.8 * ((0, $HE0Gb.calculateAverage)(x_s) || 0);
            const avgy = pnt.y + 0.8 * ((0, $HE0Gb.calculateAverage)(y_s) || 0);
            const avgz = pnt.z + 0.8 * ((0, $HE0Gb.calculateAverage)(z_s) || 0);
            const newPoint = new (0, $34IZ1.Point)(avgx, avgy, avgz);
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
    const DijkstraDepth = await (0, $hXaBA.Dijkstra)(G, selectedNode);
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
        const pnt = new (0, $34IZ1.Point)(xval + xoff, -yval + yoff, zval + zoff);
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

});
parcelRequire.register("HE0Gb", function(module, exports) {

$parcel$export(module.exports, "calculateAverage", () => $08330d69497c99d2$export$a79d55e851f5cb17);
$parcel$export(module.exports, "calculateDistance", () => $08330d69497c99d2$export$65ed38a8a8f60c04);
$parcel$export(module.exports, "calculateSquaredDistance", () => $08330d69497c99d2$export$46ae17e5a80ed386);
$parcel$export(module.exports, "getRandomSubset", () => $08330d69497c99d2$export$cede5c017bc8f6ac);
// Calculate average
function $08330d69497c99d2$export$a79d55e851f5cb17(arr) {
    let runningSum = 0;
    for(let i = 0; i < arr.length; i++)runningSum = runningSum + arr[i];
    const avg = runningSum / arr.length;
    return avg;
}
// calculate distance between two points
function $08330d69497c99d2$export$65ed38a8a8f60c04(p1, p2) {
    const d = Math.pow(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2), 0.5);
    return d;
}
function $08330d69497c99d2$export$46ae17e5a80ed386(p1, p2) {
    const d = Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2);
    return d;
}
function $08330d69497c99d2$export$cede5c017bc8f6ac(arr, n) {
    var result = new Array(n), len = arr.length, taken = new Array(len);
    if (n > len) throw new RangeError("getRandom: more elements taken than available");
    while(n--){
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

});

parcelRequire.register("eRsEH", function(module, exports) {

$parcel$export(module.exports, "line_from_start_end_divisions", () => $ad1c3e49b498722f$export$d17d3d69df58ff1);
$parcel$export(module.exports, "line_from_start_end_distance", () => $ad1c3e49b498722f$export$3ed87fe6baf100f6);
$parcel$export(module.exports, "centroid", () => $ad1c3e49b498722f$export$e2a20c553f6c85ce);
$parcel$export(module.exports, "Point", () => (parcelRequire("34IZ1")).Point);
$parcel$export(module.exports, "Line", () => (parcelRequire("lC6oV")).Line);
$parcel$export(module.exports, "calculateDistance", () => (parcelRequire("HE0Gb")).calculateDistance);

var $34IZ1 = parcelRequire("34IZ1");

var $lC6oV = parcelRequire("lC6oV");

var $HE0Gb = parcelRequire("HE0Gb");
function $ad1c3e49b498722f$export$d17d3d69df58ff1(start, end, divisions) {
    // create a start and end time 
    const Start = new (0, $34IZ1.Point)(start.x, start.y, start.z);
    const End = new (0, $34IZ1.Point)(end.x, end.y, end.z);
    // interpolated points
    const points = [];
    // divisions 
    for(let i = 0; i <= divisions; i++){
        const interVar = i / divisions;
        const newx = interVar * Start.x + (1 - interVar) * End.x;
        const newy = interVar * Start.y + (1 - interVar) * End.y;
        const newz = interVar * Start.z + (1 - interVar) * End.z;
        const newPoint = new (0, $34IZ1.Point)(newx, newy, newz);
        points.push(newPoint);
    }
    // create a new point 
    const SubdividedLine = new (0, $lC6oV.Line)(points);
    return SubdividedLine;
}
function $ad1c3e49b498722f$export$3ed87fe6baf100f6(start, end, distance) {
    const dist = (0, $HE0Gb.calculateDistance)(start, end);
    const divs = Math.round(dist / distance) + 2;
    const subdivline = $ad1c3e49b498722f$export$d17d3d69df58ff1(start, end, divs);
    return subdivline;
}
function $ad1c3e49b498722f$export$e2a20c553f6c85ce(points) {
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
    const centroid1 = new (0, $34IZ1.Point)(rx, ry, rz);
    return centroid1;
}

});
parcelRequire.register("34IZ1", function(module, exports) {

$parcel$export(module.exports, "Point", () => $23d4a38f1f6bf3f4$export$baf26146a414f24a);
class $23d4a38f1f6bf3f4$export$baf26146a414f24a {
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

parcelRequire.register("lC6oV", function(module, exports) {

$parcel$export(module.exports, "Line", () => $fbc21cab5a503b45$export$17d680238e50603e);

var $34IZ1 = parcelRequire("34IZ1");
class $fbc21cab5a503b45$export$17d680238e50603e {
    constructor(points){
        this.points = [];
        points.forEach((p)=>{
            const point = new (0, $34IZ1.Point)(p.x, p.y, p.z);
            this.points.push(point);
        });
    }
}

});


parcelRequire.register("hXaBA", function(module, exports) {

$parcel$export(module.exports, "BFSSearch", () => $d1202c4ffa33639d$export$9512e8ca8b081e8f);
$parcel$export(module.exports, "Dijkstra", () => $d1202c4ffa33639d$export$be200438c84dec06);
$parcel$export(module.exports, "GraphDiameter", () => $d1202c4ffa33639d$export$9f5accb7363d2ecf);
$parcel$export(module.exports, "SelectSubgraph", () => $d1202c4ffa33639d$export$45dbfc9b37871a67);

var $8VQ9T = parcelRequire("8VQ9T");
// do a BFS Search Starting from some point
// searches the whole graph and returns a map of which node
// was searched from where
async function $d1202c4ffa33639d$export$9512e8ca8b081e8f(G, node) {
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
async function $d1202c4ffa33639d$export$be200438c84dec06(G, Node) {
    const adj = G.get_adjacency();
    const Dmap = new Map();
    // get the explored from map
    const exploredFromMap = await $d1202c4ffa33639d$export$9512e8ca8b081e8f(G, Node);
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
async function $d1202c4ffa33639d$export$9f5accb7363d2ecf(graph) {
    // find the diameter of the graph
    // start Dijkstra from some random node
    let seed = Math.floor(Math.random() * graph.nodes.size);
    let Dstart = await $d1202c4ffa33639d$export$be200438c84dec06(graph, seed);
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
    Dstart = await $d1202c4ffa33639d$export$be200438c84dec06(graph, seed);
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
async function $d1202c4ffa33639d$export$45dbfc9b37871a67(graph, nodeList) {
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
    const newGraph = await (0, $8VQ9T.Graph).create(prunedVertices, prunedEdges);
    return newGraph;
}

});
parcelRequire.register("8VQ9T", function(module, exports) {

$parcel$export(module.exports, "Graph", () => $680c1b39dbe84506$export$614db49f3febe941);
class $680c1b39dbe84506$export$614db49f3febe941 {
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
        const g = new $680c1b39dbe84506$export$614db49f3febe941(nodes, edges);
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




$parcel$export(module.exports, "Graph", () => (parcelRequire("8VQ9T")).Graph);
$parcel$export(module.exports, "GraphMethods", () => (parcelRequire("hXaBA")));
$parcel$export(module.exports, "SampleData", () => $3e6bd66d0db7cfce$exports);
$parcel$export(module.exports, "Constructors", () => $3edfcfdbc5da64cf$exports);
$parcel$export(module.exports, "Drawing", () => (parcelRequire("fNjyM")));
$parcel$export(module.exports, "Geometry", () => (parcelRequire("eRsEH")));
$parcel$export(module.exports, "Utilities", () => (parcelRequire("HE0Gb")));
$parcel$export(module.exports, "threeDWrapper", () => $2524c53ea30c4d70$exports);
$parcel$export(module.exports, "GraphDrawer", () => $b77c23b76e124574$exports);

var $hXaBA = parcelRequire("hXaBA");
var $3e6bd66d0db7cfce$exports = {};

$parcel$export($3e6bd66d0db7cfce$exports, "LoadZKC", () => $3e6bd66d0db7cfce$export$25541fba70f1c06e);
$parcel$export($3e6bd66d0db7cfce$exports, "LoadZKCSimulated", () => $3e6bd66d0db7cfce$export$c517c27d9806916);
const $7ce7a17ac2c2174b$export$b6cdfb6bd6195507 = {
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


const $2cedfec5a13aa4f3$export$aa88f89bcd11f8a9 = {
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


var $3edfcfdbc5da64cf$exports = {};

$parcel$export($3edfcfdbc5da64cf$exports, "ConstructGraphNodeEdgesList", () => $3edfcfdbc5da64cf$export$5b2c597b1682b5a9);

var $8VQ9T = parcelRequire("8VQ9T");
class $12b603f73ed8a462$export$3e8a3cc8713efbec {
    constructor(data){
        // this data is an arbitrary thing with which I can create any object
        this.data = {
            ...data
        };
        // the neighbours bit is explicity set from the code outside
        this.neighbours = [];
    }
}


class $17d3fc4938bc4879$export$b9d9805c9b77a56d {
    constructor(start, end, data){
        this.start = start;
        this.end = end;
        this.data = {
            ...data
        };
    }
}


// construct a graph based on an edge list etc
async function $3edfcfdbc5da64cf$export$5b2c597b1682b5a9(nodes, edges) {
    // make a node OBJ
    const nodeOBJ = new Map();
    for(let i = 0; i < nodes.length; i++){
        const n = new (0, $12b603f73ed8a462$export$3e8a3cc8713efbec)(nodes[i].data);
        nodeOBJ.set(nodes[i], n);
    }
    // make an edge object
    const edgeOBJ = new Map();
    for(let i1 = 0; i1 < edges.length; i1++){
        const e = new (0, $17d3fc4938bc4879$export$b9d9805c9b77a56d)(edges[i1][0], edges[i1][1], edges[i1].data);
        edgeOBJ.set(i1, e);
    }
    // make a graph object
    const G = await (0, $8VQ9T.Graph).create(nodeOBJ, edgeOBJ);
    return G;
}



var $8VQ9T = parcelRequire("8VQ9T");

var $34IZ1 = parcelRequire("34IZ1");



var $fNjyM = parcelRequire("fNjyM");
async function $3e6bd66d0db7cfce$export$25541fba70f1c06e() {
    // load up the dataset representation
    const data = (0, $7ce7a17ac2c2174b$export$b6cdfb6bd6195507);
    const G = await (0, $3edfcfdbc5da64cf$export$5b2c597b1682b5a9)(data.nodes, data.edges);
    return G;
}
async function $3e6bd66d0db7cfce$export$c517c27d9806916() {
    // make a map
    const data = (0, $2cedfec5a13aa4f3$export$aa88f89bcd11f8a9);
    const nodes = new Map();
    const edges = new Map();
    // set the node map
    data.nodes.forEach((node)=>{
        const id = node.id;
        const pos = new (0, $34IZ1.Point)(node.px * 50, 0, node.py * 50);
        const modularity = node.member;
        const n = new (0, $12b603f73ed8a462$export$3e8a3cc8713efbec)({
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
        const e = new (0, $17d3fc4938bc4879$export$b9d9805c9b77a56d)(start, end, {});
        edges.set(i, e);
    }
    // make a graph object
    const G = await (0, $8VQ9T.Graph).create(nodes, edges);
    const lmap = (0, $fNjyM.DrawEdgeLines)(G, 10);
    G.apply_edge_pos_maps(lmap);
    return G;
}




var $fNjyM = parcelRequire("fNjyM");

var $eRsEH = parcelRequire("eRsEH");

var $HE0Gb = parcelRequire("HE0Gb");
var $2524c53ea30c4d70$exports = {};

$parcel$export($2524c53ea30c4d70$exports, "DrawTHREEGraphVertices", () => $2524c53ea30c4d70$export$3722d609e92d59e4);
$parcel$export($2524c53ea30c4d70$exports, "DrawTHREEGraphEdgesThick", () => $2524c53ea30c4d70$export$a96a15c14ab3f9b1);
$parcel$export($2524c53ea30c4d70$exports, "DrawThickEdgesFromEdgeMap", () => $2524c53ea30c4d70$export$71197654c552d4f7);
$parcel$export($2524c53ea30c4d70$exports, "DrawTHREEGraphEdgesThin", () => $2524c53ea30c4d70$export$bcbc82e0d2fddfa9);
$parcel$export($2524c53ea30c4d70$exports, "DrawThinEdgesFromEdgeMap", () => $2524c53ea30c4d70$export$bbd7eb6d0a9b1b8a);
$parcel$export($2524c53ea30c4d70$exports, "AddBoxBasedImaging", () => $2524c53ea30c4d70$export$545f74f6baebd19e);
$parcel$export($2524c53ea30c4d70$exports, "DrawTHREEBoxBasedVertices", () => $2524c53ea30c4d70$export$ccbc3593ea66381b);
$parcel$export($2524c53ea30c4d70$exports, "AddCylinderBasedImaging", () => $2524c53ea30c4d70$export$175a7c7b986803c2);
$parcel$export($2524c53ea30c4d70$exports, "AddInModularityBasedPointGroups", () => $2524c53ea30c4d70$export$4375efd5a56da8c8);
$parcel$export($2524c53ea30c4d70$exports, "DrawSimplifiedEdges", () => $2524c53ea30c4d70$export$df50b176b062f988);
$parcel$export($2524c53ea30c4d70$exports, "ChangeTheVertexColours", () => $2524c53ea30c4d70$export$ddabfdc3a667d816);
$parcel$export($2524c53ea30c4d70$exports, "ResetVertexColors", () => $2524c53ea30c4d70$export$f12354bb68150715);


class $96a3c9e287d16994$export$a6bbb4bb79a67a67 extends $k4wjR$three.BufferGeometry {
    constructor(){
        super();
        this.isMeshLine = true;
        this.type = "MeshLine";
        this.positions = [];
        this.previous = [];
        this.next = [];
        this.side = [];
        this.width = [];
        this.indices_array = [];
        this.uvs = [];
        this.counters = [];
        this._points = [];
        this._geom = null;
        this.widthCallback = null;
        // Used to raycast
        this.matrixWorld = new $k4wjR$three.Matrix4();
        Object.defineProperties(this, {
            // this is now a bufferGeometry
            // add getter to support previous api
            geometry: {
                enumerable: true,
                get: function() {
                    return this;
                }
            },
            geom: {
                enumerable: true,
                get: function() {
                    return this._geom;
                },
                set: function(value) {
                    this.setGeometry(value, this.widthCallback);
                }
            },
            // for declaritive architectures
            // to return the same value that sets the points
            // eg. this.points = points
            // console.log(this.points) -> points
            points: {
                enumerable: true,
                get: function() {
                    return this._points;
                },
                set: function(value) {
                    this.setPoints(value, this.widthCallback);
                }
            }
        });
    }
}
$96a3c9e287d16994$export$a6bbb4bb79a67a67.prototype.setMatrixWorld = function(matrixWorld) {
    this.matrixWorld = matrixWorld;
};
// setting via a geometry is rather superfluous
// as you're creating a unecessary geometry just to throw away
// but exists to support previous api
$96a3c9e287d16994$export$a6bbb4bb79a67a67.prototype.setGeometry = function(g, c) {
    // as the input geometry are mutated we store them
    // for later retreival when necessary (declaritive architectures)
    this._geometry = g;
    this.setPoints(g.getAttribute("position").array, c);
};
$96a3c9e287d16994$export$a6bbb4bb79a67a67.prototype.setPoints = function(points, wcb) {
    if (!(points instanceof Float32Array) && !(points instanceof Array)) {
        console.error("ERROR: The BufferArray of points is not instancied correctly.");
        return;
    }
    // as the points are mutated we store them
    // for later retreival when necessary (declaritive architectures)
    this._points = points;
    this.widthCallback = wcb;
    this.positions = [];
    this.counters = [];
    if (points.length && points[0] instanceof $k4wjR$three.Vector3) // could transform Vector3 array into the array used below
    // but this approach will only loop through the array once
    // and is more performant
    for(var j = 0; j < points.length; j++){
        var p = points[j];
        var c = j / points.length;
        this.positions.push(p.x, p.y, p.z);
        this.positions.push(p.x, p.y, p.z);
        this.counters.push(c);
        this.counters.push(c);
    }
    else for(var j = 0; j < points.length; j += 3){
        var c = j / points.length;
        this.positions.push(points[j], points[j + 1], points[j + 2]);
        this.positions.push(points[j], points[j + 1], points[j + 2]);
        this.counters.push(c);
        this.counters.push(c);
    }
    this.process();
};
function $96a3c9e287d16994$export$fd9812c8150ba238(raycaster, intersects) {
    var inverseMatrix = new $k4wjR$three.Matrix4();
    var ray = new $k4wjR$three.Ray();
    var sphere = new $k4wjR$three.Sphere();
    var interRay = new $k4wjR$three.Vector3();
    var geometry = this.geometry;
    // Checking boundingSphere distance to ray
    if (!geometry.boundingSphere) geometry.computeBoundingSphere();
    sphere.copy(geometry.boundingSphere);
    sphere.applyMatrix4(this.matrixWorld);
    if (raycaster.ray.intersectSphere(sphere, interRay) === false) return;
    inverseMatrix.copy(this.matrixWorld).invert();
    ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);
    var vStart = new $k4wjR$three.Vector3();
    var vEnd = new $k4wjR$three.Vector3();
    var interSegment = new $k4wjR$three.Vector3();
    var step = this instanceof $k4wjR$three.LineSegments ? 2 : 1;
    var index = geometry.index;
    var attributes = geometry.attributes;
    if (index !== null) {
        var indices = index.array;
        var positions = attributes.position.array;
        var widths = attributes.width.array;
        for(var i = 0, l = indices.length - 1; i < l; i += step){
            var a = indices[i];
            var b = indices[i + 1];
            vStart.fromArray(positions, a * 3);
            vEnd.fromArray(positions, b * 3);
            var width = widths[Math.floor(i / 3)] !== undefined ? widths[Math.floor(i / 3)] : 1;
            var precision = raycaster.params.Line.threshold + this.material.lineWidth * width / 2;
            var precisionSq = precision * precision;
            var distSq = ray.distanceSqToSegment(vStart, vEnd, interRay, interSegment);
            if (distSq > precisionSq) continue;
            interRay.applyMatrix4(this.matrixWorld); //Move back to world space for distance calculation
            var distance = raycaster.ray.origin.distanceTo(interRay);
            if (distance < raycaster.near || distance > raycaster.far) continue;
            intersects.push({
                distance: distance,
                // What do we want? intersection point on the ray or on the segment??
                // point: raycaster.ray.at( distance ),
                point: interSegment.clone().applyMatrix4(this.matrixWorld),
                index: i,
                face: null,
                faceIndex: null,
                object: this
            });
            // make event only fire once
            i = l;
        }
    }
}
$96a3c9e287d16994$export$a6bbb4bb79a67a67.prototype.raycast = $96a3c9e287d16994$export$fd9812c8150ba238;
$96a3c9e287d16994$export$a6bbb4bb79a67a67.prototype.compareV3 = function(a, b) {
    var aa = a * 6;
    var ab = b * 6;
    return this.positions[aa] === this.positions[ab] && this.positions[aa + 1] === this.positions[ab + 1] && this.positions[aa + 2] === this.positions[ab + 2];
};
$96a3c9e287d16994$export$a6bbb4bb79a67a67.prototype.copyV3 = function(a) {
    var aa = a * 6;
    return [
        this.positions[aa],
        this.positions[aa + 1],
        this.positions[aa + 2]
    ];
};
$96a3c9e287d16994$export$a6bbb4bb79a67a67.prototype.process = function() {
    var l = this.positions.length / 6;
    this.previous = [];
    this.next = [];
    this.side = [];
    this.width = [];
    this.indices_array = [];
    this.uvs = [];
    var w;
    var v;
    // initial previous points
    if (this.compareV3(0, l - 1)) v = this.copyV3(l - 2);
    else v = this.copyV3(0);
    this.previous.push(v[0], v[1], v[2]);
    this.previous.push(v[0], v[1], v[2]);
    for(var j = 0; j < l; j++){
        // sides
        this.side.push(1);
        this.side.push(-1);
        // widths
        if (this.widthCallback) w = this.widthCallback(j / (l - 1));
        else w = 1;
        this.width.push(w);
        this.width.push(w);
        // uvs
        this.uvs.push(j / (l - 1), 0);
        this.uvs.push(j / (l - 1), 1);
        if (j < l - 1) {
            // points previous to poisitions
            v = this.copyV3(j);
            this.previous.push(v[0], v[1], v[2]);
            this.previous.push(v[0], v[1], v[2]);
            // indices
            var n = j * 2;
            this.indices_array.push(n, n + 1, n + 2);
            this.indices_array.push(n + 2, n + 1, n + 3);
        }
        if (j > 0) {
            // points after poisitions
            v = this.copyV3(j);
            this.next.push(v[0], v[1], v[2]);
            this.next.push(v[0], v[1], v[2]);
        }
    }
    // last next point
    if (this.compareV3(l - 1, 0)) v = this.copyV3(1);
    else v = this.copyV3(l - 1);
    this.next.push(v[0], v[1], v[2]);
    this.next.push(v[0], v[1], v[2]);
    // redefining the attribute seems to prevent range errors
    // if the user sets a differing number of vertices
    if (!this._attributes || this._attributes.position.count !== this.positions.length) this._attributes = {
        position: new $k4wjR$three.BufferAttribute(new Float32Array(this.positions), 3),
        previous: new $k4wjR$three.BufferAttribute(new Float32Array(this.previous), 3),
        next: new $k4wjR$three.BufferAttribute(new Float32Array(this.next), 3),
        side: new $k4wjR$three.BufferAttribute(new Float32Array(this.side), 1),
        width: new $k4wjR$three.BufferAttribute(new Float32Array(this.width), 1),
        uv: new $k4wjR$three.BufferAttribute(new Float32Array(this.uvs), 2),
        index: new $k4wjR$three.BufferAttribute(new Uint16Array(this.indices_array), 1),
        counters: new $k4wjR$three.BufferAttribute(new Float32Array(this.counters), 1)
    };
    else {
        this._attributes.position.copyArray(new Float32Array(this.positions));
        this._attributes.position.needsUpdate = true;
        this._attributes.previous.copyArray(new Float32Array(this.previous));
        this._attributes.previous.needsUpdate = true;
        this._attributes.next.copyArray(new Float32Array(this.next));
        this._attributes.next.needsUpdate = true;
        this._attributes.side.copyArray(new Float32Array(this.side));
        this._attributes.side.needsUpdate = true;
        this._attributes.width.copyArray(new Float32Array(this.width));
        this._attributes.width.needsUpdate = true;
        this._attributes.uv.copyArray(new Float32Array(this.uvs));
        this._attributes.uv.needsUpdate = true;
        this._attributes.index.copyArray(new Uint16Array(this.indices_array));
        this._attributes.index.needsUpdate = true;
    }
    this.setAttribute("position", this._attributes.position);
    this.setAttribute("previous", this._attributes.previous);
    this.setAttribute("next", this._attributes.next);
    this.setAttribute("side", this._attributes.side);
    this.setAttribute("width", this._attributes.width);
    this.setAttribute("uv", this._attributes.uv);
    this.setAttribute("counters", this._attributes.counters);
    this.setIndex(this._attributes.index);
    this.computeBoundingSphere();
    this.computeBoundingBox();
};
function $96a3c9e287d16994$var$memcpy(src, srcOffset, dst, dstOffset, length) {
    var i;
    src = src.subarray || src.slice ? src : src.buffer;
    dst = dst.subarray || dst.slice ? dst : dst.buffer;
    src = srcOffset ? src.subarray ? src.subarray(srcOffset, length && srcOffset + length) : src.slice(srcOffset, length && srcOffset + length) : src;
    if (dst.set) dst.set(src, dstOffset);
    else for(i = 0; i < src.length; i++)dst[i + dstOffset] = src[i];
    return dst;
}
/**
 * Fast method to advance the line by one position.  The oldest position is removed.
 * @param position
 */ $96a3c9e287d16994$export$a6bbb4bb79a67a67.prototype.advance = function(position) {
    var positions = this._attributes.position.array;
    var previous = this._attributes.previous.array;
    var next = this._attributes.next.array;
    var l = positions.length;
    // PREVIOUS
    $96a3c9e287d16994$var$memcpy(positions, 0, previous, 0, l);
    // POSITIONS
    $96a3c9e287d16994$var$memcpy(positions, 6, positions, 0, l - 6);
    positions[l - 6] = position.x;
    positions[l - 5] = position.y;
    positions[l - 4] = position.z;
    positions[l - 3] = position.x;
    positions[l - 2] = position.y;
    positions[l - 1] = position.z;
    // NEXT
    $96a3c9e287d16994$var$memcpy(positions, 6, next, 0, l - 6);
    next[l - 6] = position.x;
    next[l - 5] = position.y;
    next[l - 4] = position.z;
    next[l - 3] = position.x;
    next[l - 2] = position.y;
    next[l - 1] = position.z;
    this._attributes.position.needsUpdate = true;
    this._attributes.previous.needsUpdate = true;
    this._attributes.next.needsUpdate = true;
};
$k4wjR$three.ShaderChunk["meshline_vert"] = [
    "",
    $k4wjR$three.ShaderChunk.logdepthbuf_pars_vertex,
    $k4wjR$three.ShaderChunk.fog_pars_vertex,
    "",
    "attribute vec3 previous;",
    "attribute vec3 next;",
    "attribute float side;",
    "attribute float width;",
    "attribute float counters;",
    "",
    "uniform vec2 resolution;",
    "uniform float lineWidth;",
    "uniform vec3 color;",
    "uniform float opacity;",
    "uniform float sizeAttenuation;",
    "",
    "varying vec2 vUV;",
    "varying vec4 vColor;",
    "varying float vCounters;",
    "",
    "vec2 fix( vec4 i, float aspect ) {",
    "",
    "    vec2 res = i.xy / i.w;",
    "    res.x *= aspect;",
    "	 vCounters = counters;",
    "    return res;",
    "",
    "}",
    "",
    "void main() {",
    "",
    "    float aspect = resolution.x / resolution.y;",
    "",
    "    vColor = vec4( color, opacity );",
    "    vUV = uv;",
    "",
    "    mat4 m = projectionMatrix * modelViewMatrix;",
    "    vec4 finalPosition = m * vec4( position, 1.0 );",
    "    vec4 prevPos = m * vec4( previous, 1.0 );",
    "    vec4 nextPos = m * vec4( next, 1.0 );",
    "",
    "    vec2 currentP = fix( finalPosition, aspect );",
    "    vec2 prevP = fix( prevPos, aspect );",
    "    vec2 nextP = fix( nextPos, aspect );",
    "",
    "    float w = lineWidth * width;",
    "",
    "    vec2 dir;",
    "    if( nextP == currentP ) dir = normalize( currentP - prevP );",
    "    else if( prevP == currentP ) dir = normalize( nextP - currentP );",
    "    else {",
    "        vec2 dir1 = normalize( currentP - prevP );",
    "        vec2 dir2 = normalize( nextP - currentP );",
    "        dir = normalize( dir1 + dir2 );",
    "",
    "        vec2 perp = vec2( -dir1.y, dir1.x );",
    "        vec2 miter = vec2( -dir.y, dir.x );",
    "        //w = clamp( w / dot( miter, perp ), 0., 4. * lineWidth * width );",
    "",
    "    }",
    "",
    "    //vec2 normal = ( cross( vec3( dir, 0. ), vec3( 0., 0., 1. ) ) ).xy;",
    "    vec4 normal = vec4( -dir.y, dir.x, 0., 1. );",
    "    normal.xy *= .5 * w;",
    "    normal *= projectionMatrix;",
    "    if( sizeAttenuation == 0. ) {",
    "        normal.xy *= finalPosition.w;",
    "        normal.xy /= ( vec4( resolution, 0., 1. ) * projectionMatrix ).xy;",
    "    }",
    "",
    "    finalPosition.xy += normal.xy * side;",
    "",
    "    gl_Position = finalPosition;",
    "",
    $k4wjR$three.ShaderChunk.logdepthbuf_vertex,
    $k4wjR$three.ShaderChunk.fog_vertex && "    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
    $k4wjR$three.ShaderChunk.fog_vertex,
    "}", 
].join("\n");
$k4wjR$three.ShaderChunk["meshline_frag"] = [
    "",
    $k4wjR$three.ShaderChunk.fog_pars_fragment,
    $k4wjR$three.ShaderChunk.logdepthbuf_pars_fragment,
    "",
    "uniform sampler2D map;",
    "uniform sampler2D alphaMap;",
    "uniform float useMap;",
    "uniform float useAlphaMap;",
    "uniform float useDash;",
    "uniform float dashArray;",
    "uniform float dashOffset;",
    "uniform float dashRatio;",
    "uniform float visibility;",
    "uniform float alphaTest;",
    "uniform vec2 repeat;",
    "",
    "varying vec2 vUV;",
    "varying vec4 vColor;",
    "varying float vCounters;",
    "",
    "void main() {",
    "",
    $k4wjR$three.ShaderChunk.logdepthbuf_fragment,
    "",
    "    vec4 c = vColor;",
    "    if( useMap == 1. ) c *= texture2D( map, vUV * repeat );",
    "    if( useAlphaMap == 1. ) c.a *= texture2D( alphaMap, vUV * repeat ).a;",
    "    if( c.a < alphaTest ) discard;",
    "    if( useDash == 1. ){",
    "        c.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));",
    "    }",
    "    gl_FragColor = c;",
    "    gl_FragColor.a *= step(vCounters, visibility);",
    "",
    $k4wjR$three.ShaderChunk.fog_fragment,
    "}", 
].join("\n");
class $96a3c9e287d16994$export$d8abe26b06d5f5e4 extends $k4wjR$three.ShaderMaterial {
    constructor(parameters){
        super({
            uniforms: Object.assign({}, $k4wjR$three.UniformsLib.fog, {
                lineWidth: {
                    value: 1
                },
                map: {
                    value: null
                },
                useMap: {
                    value: 0
                },
                alphaMap: {
                    value: null
                },
                useAlphaMap: {
                    value: 0
                },
                color: {
                    value: new $k4wjR$three.Color(0xffffff)
                },
                opacity: {
                    value: 1
                },
                resolution: {
                    value: new $k4wjR$three.Vector2(1, 1)
                },
                sizeAttenuation: {
                    value: 1
                },
                dashArray: {
                    value: 0
                },
                dashOffset: {
                    value: 0
                },
                dashRatio: {
                    value: 0.5
                },
                useDash: {
                    value: 0
                },
                visibility: {
                    value: 1
                },
                alphaTest: {
                    value: 0
                },
                repeat: {
                    value: new $k4wjR$three.Vector2(1, 1)
                }
            }),
            vertexShader: $k4wjR$three.ShaderChunk.meshline_vert,
            fragmentShader: $k4wjR$three.ShaderChunk.meshline_frag
        });
        this.isMeshLineMaterial = true;
        this.type = "MeshLineMaterial";
        Object.defineProperties(this, {
            lineWidth: {
                enumerable: true,
                get: function() {
                    return this.uniforms.lineWidth.value;
                },
                set: function(value) {
                    this.uniforms.lineWidth.value = value;
                }
            },
            map: {
                enumerable: true,
                get: function() {
                    return this.uniforms.map.value;
                },
                set: function(value) {
                    this.uniforms.map.value = value;
                }
            },
            useMap: {
                enumerable: true,
                get: function() {
                    return this.uniforms.useMap.value;
                },
                set: function(value) {
                    this.uniforms.useMap.value = value;
                }
            },
            alphaMap: {
                enumerable: true,
                get: function() {
                    return this.uniforms.alphaMap.value;
                },
                set: function(value) {
                    this.uniforms.alphaMap.value = value;
                }
            },
            useAlphaMap: {
                enumerable: true,
                get: function() {
                    return this.uniforms.useAlphaMap.value;
                },
                set: function(value) {
                    this.uniforms.useAlphaMap.value = value;
                }
            },
            color: {
                enumerable: true,
                get: function() {
                    return this.uniforms.color.value;
                },
                set: function(value) {
                    this.uniforms.color.value = value;
                }
            },
            opacity: {
                enumerable: true,
                get: function() {
                    return this.uniforms.opacity.value;
                },
                set: function(value) {
                    this.uniforms.opacity.value = value;
                }
            },
            resolution: {
                enumerable: true,
                get: function() {
                    return this.uniforms.resolution.value;
                },
                set: function(value) {
                    this.uniforms.resolution.value.copy(value);
                }
            },
            sizeAttenuation: {
                enumerable: true,
                get: function() {
                    return this.uniforms.sizeAttenuation.value;
                },
                set: function(value) {
                    this.uniforms.sizeAttenuation.value = value;
                }
            },
            dashArray: {
                enumerable: true,
                get: function() {
                    return this.uniforms.dashArray.value;
                },
                set: function(value) {
                    this.uniforms.dashArray.value = value;
                    this.useDash = value !== 0 ? 1 : 0;
                }
            },
            dashOffset: {
                enumerable: true,
                get: function() {
                    return this.uniforms.dashOffset.value;
                },
                set: function(value) {
                    this.uniforms.dashOffset.value = value;
                }
            },
            dashRatio: {
                enumerable: true,
                get: function() {
                    return this.uniforms.dashRatio.value;
                },
                set: function(value) {
                    this.uniforms.dashRatio.value = value;
                }
            },
            useDash: {
                enumerable: true,
                get: function() {
                    return this.uniforms.useDash.value;
                },
                set: function(value) {
                    this.uniforms.useDash.value = value;
                }
            },
            visibility: {
                enumerable: true,
                get: function() {
                    return this.uniforms.visibility.value;
                },
                set: function(value) {
                    this.uniforms.visibility.value = value;
                }
            },
            alphaTest: {
                enumerable: true,
                get: function() {
                    return this.uniforms.alphaTest.value;
                },
                set: function(value) {
                    this.uniforms.alphaTest.value = value;
                }
            },
            repeat: {
                enumerable: true,
                get: function() {
                    return this.uniforms.repeat.value;
                },
                set: function(value) {
                    this.uniforms.repeat.value.copy(value);
                }
            }
        });
        this.setValues(parameters);
    }
}
$96a3c9e287d16994$export$d8abe26b06d5f5e4.prototype.copy = function(source) {
    $k4wjR$three.ShaderMaterial.prototype.copy.call(this, source);
    this.lineWidth = source.lineWidth;
    this.map = source.map;
    this.useMap = source.useMap;
    this.alphaMap = source.alphaMap;
    this.useAlphaMap = source.useAlphaMap;
    this.color.copy(source.color);
    this.opacity = source.opacity;
    this.resolution.copy(source.resolution);
    this.sizeAttenuation = source.sizeAttenuation;
    this.dashArray.copy(source.dashArray);
    this.dashOffset.copy(source.dashOffset);
    this.dashRatio.copy(source.dashRatio);
    this.useDash = source.useDash;
    this.visibility = source.visibility;
    this.alphaTest = source.alphaTest;
    this.repeat.copy(source.repeat);
    return this;
};


const $90b70d02975a8a5e$export$84657c60382b0f83 = `
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


const $d2c95c9eb070c9da$export$4391ef72fa03c19 = `
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



var $hXaBA = parcelRequire("hXaBA");
// Draw the graph out as a bunch of vertices
function $2524c53ea30c4d70$export$3722d609e92d59e4(Graph, bounds) {
    const positionAttribute = [];
    const sizes = [];
    const colors = [];
    const labels = [];
    const color = new $k4wjR$three.Color();
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
    const geometry = new $k4wjR$three.BufferGeometry();
    // geometry attribute
    geometry.setAttribute("position", new $k4wjR$three.Float32BufferAttribute(positionAttribute, 3));
    // color attribute
    geometry.setAttribute("customColor", new $k4wjR$three.Float32BufferAttribute(colors, 3));
    // size attribute
    geometry.setAttribute("size", new $k4wjR$three.Float32BufferAttribute(sizes, 1));
    // label attribute
    geometry.setAttribute("label", new $k4wjR$three.Int32BufferAttribute(labels, 1));
    geometry.name = "THIS IS THE VERTEX GROUP";
    // example material
    const PointMaterial = new $k4wjR$three.ShaderMaterial({
        uniforms: {
            color: {
                value: new $k4wjR$three.Color(0xffffff)
            },
            pointTexture: {
                value: new $k4wjR$three.TextureLoader().load("./Textures/Square.png")
            },
            alphaTest: {
                value: 0.9
            }
        },
        vertexShader: (0, $90b70d02975a8a5e$export$84657c60382b0f83),
        fragmentShader: (0, $d2c95c9eb070c9da$export$4391ef72fa03c19)
    });
    const vertices = new $k4wjR$three.Points(geometry, PointMaterial);
    return vertices;
}
// then make a thing which draws out all the edges (THICK)
function $2524c53ea30c4d70$export$a96a15c14ab3f9b1(G, bounds) {
    return $2524c53ea30c4d70$export$71197654c552d4f7(G.edges, bounds);
}
// draw a thing to draw out all the edges from the edge map stuff
function $2524c53ea30c4d70$export$71197654c552d4f7(emap, bounds) {
    // this is the line thing
    const mat = new (0, $96a3c9e287d16994$export$d8abe26b06d5f5e4)({
        transparent: true,
        lineWidth: 5,
        opacity: 0.8,
        color: new $k4wjR$three.Color(0xcaf0f8)
    });
    const meshes = new $k4wjR$three.Group();
    for (const edge of emap.values()){
        const lval = edge.data.ldata;
        const pnts = [];
        lval.points.forEach((pnt)=>{
            pnts.push(new $k4wjR$three.Vector3(pnt.x * bounds - bounds / 2, pnt.y * bounds - bounds / 2, pnt.z * bounds - bounds / 2));
        });
        const geo = new $k4wjR$three.BufferGeometry().setFromPoints(pnts);
        const line = new (0, $96a3c9e287d16994$export$a6bbb4bb79a67a67)();
        line.setGeometry(geo);
        const lineMesh = new $k4wjR$three.Mesh(line, mat);
        meshes.add(lineMesh);
    }
    return meshes;
}
// make a thing that draws out all the lines (Thin)
function $2524c53ea30c4d70$export$bcbc82e0d2fddfa9(G, bounds) {
    return $2524c53ea30c4d70$export$bbd7eb6d0a9b1b8a(G.edges, bounds);
}
// function to draw edges from edge map
function $2524c53ea30c4d70$export$bbd7eb6d0a9b1b8a(emap, bounds) {
    const material = new $k4wjR$three.LineBasicMaterial({
        color: 0x90e0ef
    });
    const lines = new $k4wjR$three.Group();
    for (const edge of emap.values()){
        const points = [];
        // get the edge data
        const ldata = edge.data.ldata.points;
        ldata.forEach((element)=>{
            points.push(new $k4wjR$three.Vector3(element.x * bounds, element.y * bounds, element.z * bounds));
        });
        // then make the line thing
        const geometry = new $k4wjR$three.BufferGeometry().setFromPoints(points);
        const line = new $k4wjR$three.Line(geometry, material);
        lines.add(line);
    }
    return lines;
}
// draw the cube box graph here
function $2524c53ea30c4d70$export$545f74f6baebd19e(vertexMap, bounds) {
    // returns a group
    const group = new $k4wjR$three.Group();
    const material = new $k4wjR$three.MeshBasicMaterial({
        color: 0x0466c8
    });
    for (const node of vertexMap.keys()){
        const nodeData = vertexMap.get(node);
        const geometry = new $k4wjR$three.BoxGeometry(nodeData.data.size, nodeData.data.size, nodeData.data.size);
        geometry.name = node;
        const nodeMesh = new $k4wjR$three.Mesh(geometry, material);
        nodeMesh.position.set(nodeData.data.pos.x * bounds, nodeData.data.pos.y * bounds, nodeData.data.pos.z * bounds);
        group.add(nodeMesh);
    }
    return group;
}
// Draw BoxBased imaging from a graph
function $2524c53ea30c4d70$export$ccbc3593ea66381b(graph, bounds) {
    const Bgroup = $2524c53ea30c4d70$export$545f74f6baebd19e(graph.nodes, bounds);
    return Bgroup;
}
// draw cylinders where required
function $2524c53ea30c4d70$export$175a7c7b986803c2(vertexMap, divisonLength) {
    // returns a group
    const group = new $k4wjR$three.Group();
    const material = new $k4wjR$three.MeshBasicMaterial({
        color: 0xffffff
    });
    let radius, circumfurence, segments;
    for (const node of vertexMap.keys()){
        const nodeData = vertexMap.get(node);
        radius = nodeData.data.size;
        circumfurence = 2 * radius * Math.PI;
        segments = Math.ceil(circumfurence / divisonLength);
        const geometry = new $k4wjR$three.CylinderGeometry(radius, radius, 10, segments);
        geometry.name = node;
        const nodeMesh = new $k4wjR$three.Mesh(geometry, material);
        nodeMesh.position.set(nodeData.data.pos.x, nodeData.data.pos.y, nodeData.data.pos.z);
        group.add(nodeMesh);
    }
    return group;
}
// draw the sparse graph as groups
async function $2524c53ea30c4d70$export$4375efd5a56da8c8(Graph, modularityList) {
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
        const subgraph = await $hXaBA.SelectSubgraph(Graph, subgraphGroup);
        // then make the vertex thing
        const meshRep = $2524c53ea30c4d70$export$3722d609e92d59e4(subgraph, 1);
        meshGraphVertices.set(modularityGroup, meshRep);
        // make the edges
        const edges = $2524c53ea30c4d70$export$df50b176b062f988(subgraph, 0.03);
        meshGraphEdges.set(modularityGroup, edges);
    }
    // now for all the vertices in the "other" Nodes map add in the
    // rest of the stuff for us to play around with
    const OtherNodes = await $hXaBA.SelectSubgraph(Graph, otherNodes);
    const LeafVertices = $2524c53ea30c4d70$export$3722d609e92d59e4(OtherNodes, 1);
    const ROBJ = {
        vertices: meshGraphVertices,
        edges: meshGraphEdges,
        leafs: LeafVertices
    };
    return ROBJ;
}
function $2524c53ea30c4d70$export$df50b176b062f988(G, amount) {
    const lineGroup = new $k4wjR$three.Group();
    const material = new $k4wjR$three.LineBasicMaterial({
        color: 0x90e0ef
    });
    for (const edge of G.edges.values())if (Math.random() <= amount) {
        const start = G.nodes.get(edge.start).data.pos;
        const end = G.nodes.get(edge.end).data.pos;
        const points = [];
        points.push(new $k4wjR$three.Vector3(start.x, start.y, start.z));
        points.push(new $k4wjR$three.Vector3(end.x, end.y, end.z));
        const geometry = new $k4wjR$three.BufferGeometry().setFromPoints(points);
        const line = new $k4wjR$three.Line(geometry, material);
        lineGroup.add(line);
    }
    return lineGroup;
}
function $2524c53ea30c4d70$export$ddabfdc3a667d816(vertices, indexArray, color) {
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
function $2524c53ea30c4d70$export$f12354bb68150715(vertices) {
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


var $b77c23b76e124574$exports = {};

$parcel$export($b77c23b76e124574$exports, "GraphDrawer3d", () => $b77c23b76e124574$export$4aefcc8a99cfbd66);



// this is the 3d graph drawing class with three js
class $b77c23b76e124574$export$4aefcc8a99cfbd66 {
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
        this.camera = new $k4wjR$three.PerspectiveCamera();
        // start up a new scene
        this.scene = new $k4wjR$three.Scene();
        // set up a renderer
        this.renderer = new $k4wjR$three.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xff00ff, 0);
        // add in a light
        this.scene.add(new $k4wjR$three.AmbientLight(0xffffff));
        // add a spotlight 
        const DirectionalLight = new $k4wjR$three.DirectionalLight(0xffffff, 1);
        DirectionalLight.position.set(0, 10, 0);
        this.scene.add(DirectionalLight);
        // set up the control system
        this.controls = new (0, $k4wjR$threeexamplesjsmcontrolsOrbitControls.OrbitControls)(this.camera, this.renderer.domElement);
        this.camera.position.set(0, 100, 100);
        this.controls.autoRotate = true;
        this.controls.maxPolarAngle = Math.PI * 0.5;
        this.camera.enableDamping = true;
        this.controls.maxDistance = 1000;
        this.controls.minDistance = 10;
        this.controls.update();
        // add in the graph that we wanted this.graphs.get('ProvidedGraph')
        for (const graph of this.graphs.keys()){
            const GeoGraph = $2524c53ea30c4d70$export$ccbc3593ea66381b(this.graphs.get(graph), this.bound);
            this.scene.add(GeoGraph);
            const ThickEdges = $2524c53ea30c4d70$export$a96a15c14ab3f9b1(this.graphs.get(graph), this.bound);
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



var $8VQ9T = parcelRequire("8VQ9T");


//# sourceMappingURL=pgl.js.map
