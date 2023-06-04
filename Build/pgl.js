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

$parcel$export(module.exports, "default", () => $e89d79794dbc0ba9$export$2e2bcd8739ae039);

var $6Xdhg = parcelRequire("6Xdhg");

var $fd3jp = parcelRequire("fd3jp");

var $fw40F = parcelRequire("fw40F");

var $3WMe9 = parcelRequire("3WMe9");

var $cWcXJ = parcelRequire("cWcXJ");
var __awaiter = undefined && undefined.__awaiter || function(thisArg11, _arguments11, P11, generator11) {
    function adopt11(value11) {
        return value11 instanceof P11 ? value11 : new P11(function(resolve11) {
            resolve11(value11);
        });
    }
    return new (P11 || (P11 = Promise))(function(resolve11, reject11) {
        function fulfilled11(value11) {
            try {
                step11(generator11.next(value11));
            } catch (e11) {
                reject11(e11);
            }
        }
        function rejected11(value11) {
            try {
                step11(generator11["throw"](value11));
            } catch (e11) {
                reject11(e11);
            }
        }
        function step11(result11) {
            result11.done ? resolve11(result11.value) : adopt11(result11.value).then(fulfilled11, rejected11);
        }
        step11((generator11 = generator11.apply(thisArg11, _arguments11 || [])).next());
    });
};
// draw kamada kawai
function SimulateKamadaKawai(G11, iterations11, simulationBound11 = 200, cohesionValue11 = 1) {
    return __awaiter(this, void 0, void 0, function*() {
        const adjList11 = G11.get_adjacency();
        // pos map
        const PosMapX11 = new Map();
        const PosMapY11 = new Map();
        let rx11, ry11;
        for (const node11 of adjList11.keys()){
            rx11 = Math.random() * simulationBound11;
            ry11 = Math.random() * simulationBound11;
            PosMapX11.set(node11, rx11);
            PosMapY11.set(node11, ry11);
        }
        // start simulation
        for(let i11 = 0; i11 < iterations11; i11++){
            // calculate the clustering force
            // these two keep track of the node being simulated's
            // position - redeclaring is sorta unncessary
            let nodeX11;
            let nodeY11;
            // also keep track of all the x_s and y_s
            let x_s11;
            let y_s11;
            // also the same thing for the clustering force
            let y_r11;
            let x_r11;
            // same thing for the cohesion values that get recalculated
            let new_c_xpos_dispacement11;
            let new_c_ypos_dispacement11;
            for (const node11 of adjList11.keys()){
                // this chunk is for the attraction force
                // get the node pos
                const neighbours11 = adjList11.get(node11);
                // remember always declare this nodes details
                nodeX11 = PosMapX11.get(node11);
                nodeY11 = PosMapY11.get(node11);
                // get the set of x's
                x_s11 = [];
                // get the set of y's
                y_s11 = [];
                // now iterate through the pos list and append
                neighbours11.forEach((n_s11)=>{
                    const n_pos_x11 = PosMapX11.get(n_s11);
                    const n_pos_y11 = PosMapY11.get(n_s11);
                    x_s11.push(n_pos_x11);
                    y_s11.push(n_pos_y11);
                });
                // now average out the values
                const new_c_xpos11 = (0, $6Xdhg.default).calculateAverage(x_s11);
                const new_c_ypos11 = (0, $6Xdhg.default).calculateAverage(y_s11);
                // this chunk is for the repelling force
                y_r11 = [];
                x_r11 = [];
                let diffx11;
                let diffy11;
                let othernodeX11;
                let othernodeY11;
                // then find the element
                for (const otherNode11 of G11.nodes.keys())// get the position of all the other nodes
                if (otherNode11 != node11) {
                    // calculate inverse distance
                    othernodeX11 = PosMapX11.get(otherNode11);
                    othernodeY11 = PosMapY11.get(otherNode11);
                    diffx11 = othernodeX11 - nodeX11;
                    diffy11 = othernodeY11 - nodeY11;
                    // get the inverse square value
                    // add that to the *_r arrays
                    x_r11.push(diffx11);
                    y_r11.push(diffy11);
                }
                // this is the repulsion value
                const A_mult11 = 2;
                const new_x_r_pos11 = A_mult11 * 1 / ((0, $6Xdhg.default).calculateAverage(x_r11) * (0, $6Xdhg.default).calculateAverage(x_r11));
                const new_y_r_pos11 = A_mult11 * 1 / ((0, $6Xdhg.default).calculateAverage(y_r11) * (0, $6Xdhg.default).calculateAverage(y_r11));
                // calculate the dispacement amount in c/y pos
                // this is the cohesion value
                const new_c_xpos_dispacement11 = cohesionValue11 * (new_c_xpos11 - nodeX11);
                const new_c_ypos_dispacement11 = cohesionValue11 * (new_c_ypos11 - nodeY11);
                // then add the x and y components of the two vectors
                const new_xpos11 = new_x_r_pos11 + new_c_xpos_dispacement11 + nodeX11;
                const new_ypos11 = new_y_r_pos11 + new_c_ypos_dispacement11 + nodeY11;
                // now set these positions
                PosMapX11.set(node11, new_xpos11);
                PosMapY11.set(node11, new_ypos11);
            }
        }
        // return the position
        // keep in mind three JS works with Y upwards and not Z
        // in my head I work the other way round so Im swapping the Z and Y values here
        let PosMap11 = new Map();
        for (const p11 of PosMapX11.keys())PosMap11.set(p11, new (0, $fw40F.Point)(PosMapX11.get(p11), 0, PosMapY11.get(p11)));
        // get / set positions
        // move the points
        // Since this simulation might have moved the whole graph off screen
        // get the average pos
        const sim_x11 = [];
        const sim_y11 = [];
        const sim_z11 = [];
        let interimPoint11;
        for (const p11 of PosMap11.keys()){
            interimPoint11 = PosMap11.get(p11);
            sim_x11.push(interimPoint11.x);
            sim_y11.push(interimPoint11.y);
            sim_z11.push(interimPoint11.z);
        }
        const x_displacement11 = (0, $6Xdhg.default).calculateAverage(sim_x11);
        const y_displacement11 = (0, $6Xdhg.default).calculateAverage(sim_y11);
        const z_displacement11 = (0, $6Xdhg.default).calculateAverage(sim_z11);
        const dispacementVector11 = new (0, $fw40F.Point)(-x_displacement11, -y_displacement11, -z_displacement11);
        PosMap11 = MovePmap(PosMap11, dispacementVector11);
        return PosMap11;
    });
}
// instanciate a random set of positions
function InstanciateRandomPositions(G11) {
    const adjList11 = G11.get_adjacency();
    const PosMapX11 = new Map();
    const PosMapY11 = new Map();
    for (const node11 of adjList11.keys()){
        PosMapX11.set(node11, Math.random() * 200);
        PosMapY11.set(node11, Math.random() * 200);
    }
    let PosMap11 = new Map();
    for (const p11 of PosMapX11.keys())PosMap11.set(p11, new (0, $fw40F.Point)(PosMapX11.get(p11), 0, PosMapY11.get(p11)));
    G11.apply_position_map(PosMap11);
    const lmap11 = DrawEdgeLines(G11, 1);
    return {
        pmap: PosMap11,
        emap: lmap11
    };
}
// draw the edge representations and then store them in the edge classes
function DrawEdgeLines(G11, divDistance11) {
    // this is the return map
    const lineMap11 = new Map();
    let edge11;
    let start11;
    let end11;
    for (const key11 of G11.edges.keys()){
        edge11 = G11.edges.get(key11);
        // get the start pos
        start11 = G11.nodes.get(edge11.start).data.pos;
        end11 = G11.nodes.get(edge11.end).data.pos;
        const Line11 = (0, $fd3jp.default).line_from_start_end_distance(start11, end11, divDistance11);
        lineMap11.set(key11, Line11);
    }
    return lineMap11;
}
// now draw out the edge bundling thing
function DrawEdgeBundling(LineMap11, iterations11, distance11) {
    return __awaiter(this, void 0, void 0, function*() {
        const returnArray11 = LineMap11;
        // variables that are getting reused
        let line11;
        let otherLine11;
        let x_s11;
        let y_s11;
        let z_s11;
        let pnt11;
        let otherpoint11;
        let d11;
        let x_d11;
        let y_d11;
        let z_d11;
        let avgx11;
        let avgy11;
        let avgz11;
        // run it for whatever number of iterations
        for(let i11 = 0; i11 < iterations11; i11++)// then iterate through every line
        for (let key11 of returnArray11.keys()){
            // then get the line that we are working with
            line11 = returnArray11.get(key11);
            // then for each point in the line we have to move it closer to the other points
            for(let ii11 = 1; ii11 < line11.points.length - 1; ii11++){
                // then get the point that we need to work with
                x_s11 = [];
                y_s11 = [];
                z_s11 = [];
                pnt11 = line11.points[ii11];
                // then run the point accumulation algoritm
                for (let otherKey11 of returnArray11.keys())if (otherKey11 != key11) {
                    // then get the other line
                    otherLine11 = returnArray11.get(otherKey11);
                    for(let iii11 = 1; iii11 < otherLine11.points.length - 1; iii11++){
                        otherpoint11 = otherLine11.points[iii11];
                        d11 = (0, $6Xdhg.default).calculateSquaredDistance(pnt11, otherpoint11);
                        if (d11 <= Math.pow(distance11, 2)) {
                            x_d11 = otherpoint11.x - pnt11.x;
                            y_d11 = otherpoint11.y - pnt11.y;
                            z_d11 = otherpoint11.z - pnt11.z;
                            x_s11.push(x_d11);
                            y_s11.push(y_d11);
                            z_s11.push(z_d11);
                        }
                    }
                }
                // now create a new displacement amount
                avgx11 = pnt11.x + 0.8 * ((0, $6Xdhg.default).calculateAverage(x_s11) || 0);
                avgy11 = pnt11.y + 0.8 * ((0, $6Xdhg.default).calculateAverage(y_s11) || 0);
                avgz11 = pnt11.z + 0.8 * ((0, $6Xdhg.default).calculateAverage(z_s11) || 0);
                const newPoint11 = new (0, $fw40F.Point)(avgx11, avgy11, avgz11);
                line11.points[ii11] = newPoint11;
            }
        }
        // now return that new map
        return returnArray11;
    });
}
// displace the th edges
// sorta like and arc in the middle of the thing
function DisplaceEdgeInY(LineMap11, displacement11) {
    for (const key11 of LineMap11.keys()){
        const line11 = LineMap11.get(key11);
        // now for all the points in this
        let pnt11, ydisval11;
        for(let i11 = 0; i11 < line11.points.length; i11++){
            pnt11 = line11.points[i11];
            ydisval11 = displacement11 * Math.sin(Math.PI * i11 / (line11.points.length - 1));
            pnt11.y = pnt11.y + ydisval11;
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
    for (const node of nodeMap.values()){
        value = eval("node.data." + parameter);
        ydisplacement = value / max * displacement;
        // now filter the values so that we know that the values are between a max and a min
        ydisplacement = Math.max(0, ydisplacement); // this sets the lower bound to be something
        ydisplacement = Math.min(displacement, ydisplacement); // this sets the upper bound of the thing
        node.data.pos.y = ydisplacement;
    }
}
// draw the circular vertical packing crypto like drawing
function HivePlot(G11, selectedNode11, step11, startP11) {
    return __awaiter(this, void 0, void 0, function*() {
        const adj11 = G11.get_adjacency();
        const DijkstraDepth11 = yield (0, $cWcXJ.default).Dijkstra(G11, selectedNode11);
        // calculate the number of steps that I am searching through
        const steps11 = Math.max(...[
            ...DijkstraDepth11.values()
        ]);
        // step map
        const stepMap11 = new Map();
        // now create a stepped ring of stuff
        for(let i11 = 0; i11 <= steps11; i11++){
            const ntier11 = [];
            for (const nkey11 of DijkstraDepth11.keys())if (i11 == DijkstraDepth11.get(nkey11)) ntier11.push(nkey11);
            stepMap11.set(i11, ntier11);
        }
        // the returning pos map
        const Pmap11 = new Map();
        // now find the relevant node Positions
        // get the start positions
        const xoff11 = startP11.x || 0;
        const yoff11 = startP11.y || 0;
        const zoff11 = startP11.z || 0;
        // set the positions
        for (const node11 of adj11.keys()){
            const yval11 = DijkstraDepth11.get(node11) * step11;
            const depthArr11 = stepMap11.get(DijkstraDepth11.get(node11));
            const angle11 = 2 * Math.PI * (depthArr11.indexOf(node11) / depthArr11.length);
            const xval11 = Math.sin(angle11) * yval11;
            const zval11 = Math.cos(angle11) * yval11;
            // construct a new point
            const pnt11 = new (0, $fw40F.Point)(xval11 + xoff11, -yval11 + yoff11, zval11 + zoff11);
            Pmap11.set(node11, pnt11);
        }
        // simulate the lines
        G11.apply_position_map(Pmap11);
        const lmap11 = DrawEdgeLines(G11, 1);
        const newLmap11 = yield DrawEdgeBundling(lmap11, 12, 5);
        return {
            pmap: Pmap11,
            emap: newLmap11
        };
    });
}
// move graph
function MoveGraph(G11, dispacement11) {
    const Gmap11 = G11.get_map();
    const NewPmap11 = MovePmap(Gmap11.pmap, dispacement11);
    const NewEmap11 = MoveEmap(Gmap11.emap, dispacement11);
    G11.apply_drawing_maps({
        pmap: NewPmap11,
        emap: NewEmap11
    });
}
// move pmap
function MovePmap(Pmap11, displacement11) {
    const newPmap11 = new Map();
    for (let node11 of Pmap11.keys()){
        const p11 = Pmap11.get(node11);
        p11.translate(displacement11);
        newPmap11.set(node11, p11);
    }
    return newPmap11;
}
// move the edges
function MoveEmap(Emap11, dispacement11) {
    const newEmap11 = new Map();
    // variables - instead of redeclaring
    let interimPoints11;
    let interimLine11;
    let newLine11;
    for (let lineNumber11 of Emap11.keys()){
        // reset the interim points
        interimPoints11 = [];
        // get the line
        interimLine11 = Emap11.get(lineNumber11);
        // move all the points
        for (let pnt11 of interimLine11.points){
            pnt11.translate(dispacement11);
            // add this to the new stack of lines
            interimPoints11.push(pnt11);
        }
        // create a new line
        newLine11 = new (0, $3WMe9.Line)(interimPoints11);
        // add this to the new map
        newEmap11.set(lineNumber11, newLine11);
    }
    return newEmap11;
}
// THIS IS THE BIT THATS A BIT CONFUSING
/*
Data for visualization is store in the graph under the elements data
So for example - the position data under a point in the graph is under
- Graph.nodes.get(whatever node).data.pos
*/ // commenting out because appears to be redundant
// update edge lines after moving points or something
// this redraws the lines based on distance
function UpdateEdgeLinesDist(G11, divDistance11) {
    let edge11;
    let start11;
    let end11;
    let line11;
    for (const key11 of G11.edges.keys()){
        edge11 = G11.edges.get(key11);
        // get the start pos
        start11 = G11.nodes.get(edge11.start).data.pos;
        end11 = G11.nodes.get(edge11.end).data.pos;
        line11 = (0, $fd3jp.default).line_from_start_end_distance(start11, end11, divDistance11);
        edge11.data.ldata = line11;
    }
}
// function Update EdgeLines based on the number of divisions
// redraw the line based on divisions
function UpdateEdgeLinesDivs(G11, Divs11) {
    let edge11;
    let start11;
    let end11;
    let line11;
    for (const key11 of G11.edges.keys()){
        edge11 = G11.edges.get(key11);
        // get the start pos
        start11 = G11.nodes.get(edge11.start).data.pos;
        end11 = G11.nodes.get(edge11.end).data.pos;
        line11 = (0, $fd3jp.default).line_from_start_end_divisions(start11, end11, Divs11);
        edge11.data.ldata = line11;
    }
}
var $e89d79794dbc0ba9$export$2e2bcd8739ae039 = {
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

$parcel$export(module.exports, "default", () => $51028d69415a7fb7$export$2e2bcd8739ae039);
// Calculate average
function $51028d69415a7fb7$var$calculateAverage(arr) {
    let runningSum = 0;
    for(let i = 0; i < arr.length; i++)runningSum = runningSum + arr[i];
    const avg = runningSum / arr.length;
    return avg;
}
// calculate distance between two points
function $51028d69415a7fb7$var$calculateDistance(p1, p2) {
    const d = Math.pow(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2), 0.5);
    return d;
}
// calculate squared distance sometimes we dont really need
// the actual root but just a rough idea
function $51028d69415a7fb7$var$calculateSquaredDistance(p1, p2) {
    const d = Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2);
    return d;
}
// get a random subset of something from a array of things
// must provide the number of things we want from that array
function $51028d69415a7fb7$var$getRandomSubset(arr, n) {
    var result = new Array(n), len = arr.length, taken = new Array(len);
    if (n > len) throw new RangeError("getRandom: more elements taken than available");
    while(n--){
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}
var $51028d69415a7fb7$export$2e2bcd8739ae039 = {
    calculateAverage: $51028d69415a7fb7$var$calculateAverage,
    calculateDistance: $51028d69415a7fb7$var$calculateDistance,
    calculateSquaredDistance: $51028d69415a7fb7$var$calculateSquaredDistance,
    getRandomSubset: $51028d69415a7fb7$var$getRandomSubset
};

});

parcelRequire.register("fd3jp", function(module, exports) {

$parcel$export(module.exports, "default", () => $b12aa3a1ba88a23a$export$2e2bcd8739ae039);

var $fw40F = parcelRequire("fw40F");

var $3WMe9 = parcelRequire("3WMe9");

var $6Xdhg = parcelRequire("6Xdhg");
function $b12aa3a1ba88a23a$var$line_from_start_end_divisions(start, end, divisions) {
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
function $b12aa3a1ba88a23a$var$line_from_start_end_distance(start, end, distance) {
    const dist = (0, $6Xdhg.default).calculateDistance(start, end);
    const divs = Math.round(dist / distance) + 2;
    const subdivline = $b12aa3a1ba88a23a$var$line_from_start_end_divisions(start, end, divs);
    return subdivline;
}
function $b12aa3a1ba88a23a$var$centroid(points) {
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
    const centroid = new (0, $fw40F.Point)(rx, ry, rz);
    return centroid;
}
var $b12aa3a1ba88a23a$export$2e2bcd8739ae039 = {
    line_from_start_end_divisions: $b12aa3a1ba88a23a$var$line_from_start_end_divisions,
    line_from_start_end_distance: $b12aa3a1ba88a23a$var$line_from_start_end_distance,
    centroid: $b12aa3a1ba88a23a$var$centroid
};

});
parcelRequire.register("fw40F", function(module, exports) {

$parcel$export(module.exports, "Point", () => $b4bcf46d914a9151$export$baf26146a414f24a);
class $b4bcf46d914a9151$export$baf26146a414f24a {
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    // Points are somewhat the same thing as a vector 
    // So im using the same type instead of redeclaring the 
    // Type
    translate(Point) {
        this.x = this.x + Point.x;
        this.y = this.y + Point.y;
        this.z = this.z + Point.z;
    }
}

});

parcelRequire.register("3WMe9", function(module, exports) {

$parcel$export(module.exports, "Line", () => $2dfc32cf7d94658f$export$17d680238e50603e);

var $fw40F = parcelRequire("fw40F");
class $2dfc32cf7d94658f$export$17d680238e50603e {
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

$parcel$export(module.exports, "default", () => $96b4f4dcd8ff333f$export$2e2bcd8739ae039);

var $9TL8g = parcelRequire("9TL8g");
var $96b4f4dcd8ff333f$var$__awaiter = undefined && undefined.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// do a BFS Search Starting from some point
// searches the whole graph and returns a map of which node
// was searched from where
// to speed this up all the nodes are actually numbers
function $96b4f4dcd8ff333f$var$BFSSearch(G, node) {
    return $96b4f4dcd8ff333f$var$__awaiter(this, void 0, void 0, function*() {
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
    });
}
// do a dijkstra Search Distance map
function $96b4f4dcd8ff333f$var$Dijkstra(G, Node) {
    return $96b4f4dcd8ff333f$var$__awaiter(this, void 0, void 0, function*() {
        const adj = G.get_adjacency();
        const Dmap = new Map();
        // get the explored from map
        const exploredFromMap = yield $96b4f4dcd8ff333f$var$BFSSearch(G, Node);
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
    });
}
// This file contains basic things like
// Graph searches and stuff
// this only returns one of the diameters that is the longest 
// not all of them
function $96b4f4dcd8ff333f$var$GraphDiameter(graph) {
    return $96b4f4dcd8ff333f$var$__awaiter(this, void 0, void 0, function*() {
        // find the diameter of the graph
        // start Dijkstra from some random node
        let seed = Math.floor(Math.random() * graph.nodes.size);
        let Dstart = yield $96b4f4dcd8ff333f$var$Dijkstra(graph, seed);
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
        Dstart = yield $96b4f4dcd8ff333f$var$Dijkstra(graph, seed);
        // repeat the thing
        currentDistance = -1;
        for (const n of Dstart.keys()){
            const dval = Dstart.get(n);
            if (dval > currentDistance) {
                seed = n;
                currentDistance = dval;
            }
        }
        const returnObj = {
            start: newStart,
            end: seed,
            distance: currentDistance
        };
        return returnObj;
    });
}
// Select a subrgaph
// you must specify a list of nodes that you passed in
function $96b4f4dcd8ff333f$var$SelectSubgraph(graph, nodeList) {
    return $96b4f4dcd8ff333f$var$__awaiter(this, void 0, void 0, function*() {
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
        const newGraph = yield (0, $9TL8g.Graph).create(prunedNodes, prunedEdges);
        return newGraph;
    });
}
var // this is where the exports happen
$96b4f4dcd8ff333f$export$2e2bcd8739ae039 = {
    GraphDiameter: $96b4f4dcd8ff333f$var$GraphDiameter,
    Dijkstra: $96b4f4dcd8ff333f$var$Dijkstra,
    BFSSearch: $96b4f4dcd8ff333f$var$BFSSearch,
    SelectSubgraph: $96b4f4dcd8ff333f$var$SelectSubgraph
};

});
parcelRequire.register("9TL8g", function(module, exports) {

$parcel$export(module.exports, "Graph", () => $734dcf9f6d72d709$export$614db49f3febe941);

var $i8obY = parcelRequire("i8obY");
var $734dcf9f6d72d709$var$__awaiter = undefined && undefined.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class $734dcf9f6d72d709$export$614db49f3febe941 {
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
    initialize() {
        return $734dcf9f6d72d709$var$__awaiter(this, void 0, void 0, function*() {
            yield this.constructAdjacencyList();
        });
    }
    // new create method
    static create(nodes, edges) {
        return $734dcf9f6d72d709$var$__awaiter(this, void 0, void 0, function*() {
            const g = new $734dcf9f6d72d709$export$614db49f3febe941(nodes, edges);
            yield g.initialize();
            return g;
        });
    }
    // construct the adjacency list represntation
    constructAdjacencyList() {
        return $734dcf9f6d72d709$var$__awaiter(this, void 0, void 0, function*() {
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
        });
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
        for (let n of data.keys())this.nodes.get(n).data = Object.assign(Object.assign({}, this.nodes.get(n).data), {
            pos: data.get(n)
        });
    }
    // create new edge pos representation
    // same approach for applying the key data
    apply_edge_pos_maps(data) {
        for (let key of data.keys())this.edges.get(key).data = Object.assign(Object.assign({}, this.edges.get(key).data), {
            ldata: data.get(key)
        });
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

$parcel$export(module.exports, "Edge", () => $d33bbd65b64ffa49$export$b9d9805c9b77a56d);
class $d33bbd65b64ffa49$export$b9d9805c9b77a56d {
    constructor(start, end, data){
        this.start = start;
        this.end = end;
        this.data = Object.assign({}, data);
    }
}

});




parcelRequire.register("eqUI8", function(module, exports) {

$parcel$export(module.exports, "default", () => $a81f7bf7ba151678$export$2e2bcd8739ae039);


var $1jyjM = parcelRequire("1jyjM");




var $bWT2q = parcelRequire("bWT2q");

var $8lQGS = parcelRequire("8lQGS");

var $cWcXJ = parcelRequire("cWcXJ");
var __awaiter = undefined && undefined.__awaiter || function(thisArg11, _arguments11, P11, generator11) {
    function adopt11(value11) {
        return value11 instanceof P11 ? value11 : new P11(function(resolve11) {
            resolve11(value11);
        });
    }
    return new (P11 || (P11 = Promise))(function(resolve11, reject11) {
        function fulfilled11(value11) {
            try {
                step11(generator11.next(value11));
            } catch (e11) {
                reject11(e11);
            }
        }
        function rejected11(value11) {
            try {
                step11(generator11["throw"](value11));
            } catch (e11) {
                reject11(e11);
            }
        }
        function step11(result11) {
            result11.done ? resolve11(result11.value) : adopt11(result11.value).then(fulfilled11, rejected11);
        }
        step11((generator11 = generator11.apply(thisArg11, _arguments11 || [])).next());
    });
};
// Draw the graph out as a bunch of vertices
// As like tiny squares
function DrawTHREEGraphVertices(Graph11, bounds11, size11 = 1, color11 = 0xffffff, alpha11 = 1) {
    const positionAttribute11 = [];
    // get the corresponding points list
    const pmap11 = Graph11.get_position_map();
    // declare the sizes and colors
    let sizes11;
    let colors11;
    if (typeof size11 == "number") sizes11 = Array(Graph11.nodes.size).fill(size11);
    else sizes11 = size11;
    colors11 = Array(Graph11.nodes.size).fill(color11);
    const labels11 = [];
    const colorVal11 = new $h9nKb$three.Color();
    colorVal11.setRGB(255, 255, 255); // white as the default
    // process the data set
    let i11 = 0;
    let nodeData11;
    for (let node11 of Graph11.nodes.keys()){
        nodeData11 = pmap11.get(node11);
        positionAttribute11.push(nodeData11.x * bounds11, nodeData11.y * bounds11, nodeData11.z * bounds11);
        colorVal11.toArray(colors11, i11 * 3);
        labels11.push(node11);
        i11 += 1;
    }
    const geometry11 = new $h9nKb$three.BufferGeometry();
    // geometry attribute
    geometry11.setAttribute("position", new $h9nKb$three.Float32BufferAttribute(positionAttribute11, 3));
    // color attribute
    geometry11.setAttribute("customColor", new $h9nKb$three.Float32BufferAttribute(colors11, 3));
    // size attribute
    geometry11.setAttribute("size", new $h9nKb$three.Float32BufferAttribute(sizes11, 1));
    // label attribute
    geometry11.setAttribute("label", new $h9nKb$three.Int32BufferAttribute(labels11, 1));
    geometry11.name = "nodes";
    // example material
    const PointMaterial11 = new $h9nKb$three.ShaderMaterial({
        uniforms: {
            color: {
                value: new $h9nKb$three.Color(0xffffff)
            },
            pointTexture: {
                value: new $h9nKb$three.TextureLoader().load("./Textures/Square.png")
            },
            alphaTest: {
                value: alpha11
            }
        },
        vertexShader: (0, $bWT2q.vertexShader),
        fragmentShader: (0, $8lQGS.fragmentShader)
    });
    const vertices11 = new $h9nKb$three.Group();
    vertices11.add(new $h9nKb$three.Points(geometry11, PointMaterial11));
    return vertices11;
}
// then make a thing which draws out all the edges (THICK)
function DrawTHREEGraphEdgesThick(G11, bounds11, thickness11 = 0.2, color11 = 0xffffff) {
    // add the interpolation function
    const lineMap11 = G11.get_edge_map();
    return DrawThickEdgesFromEdgeMap(lineMap11, bounds11, thickness11, color11);
}
// draw a thing to draw out all the edges from the edge map stuff
function DrawThickEdgesFromEdgeMap(emap11, bounds11, thickness11 = 0.2, color11 = 0xffffff) {
    // this is the line thing
    const mat11 = new (0, $h9nKb$threeexamplesjsmlinesLineMaterial.LineMaterial)({
        color: color11,
        linewidth: thickness11,
        vertexColors: true,
        //resolution:  // to be set by renderer, eventually
        dashed: false,
        alphaToCoverage: true
    });
    const meshes11 = new $h9nKb$three.Group();
    for (let lval11 of emap11.values()){
        const mcolor11 = new $h9nKb$three.Color();
        // convert the color that we shall be using
        mcolor11.setHex(color11);
        const pnts11 = [];
        const cols11 = [];
        lval11.points.forEach((pnt11)=>{
            pnts11.push(pnt11.x * bounds11 - bounds11 / 2, pnt11.y * bounds11 - bounds11 / 2, pnt11.z * bounds11 - bounds11 / 2);
            cols11.push(mcolor11.r, mcolor11.g, mcolor11.b);
        });
        const geo11 = new (0, $h9nKb$threeexamplesjsmlinesLineGeometry.LineGeometry)();
        geo11.setPositions(pnts11);
        geo11.setColors(cols11);
        const line11 = new (0, $h9nKb$threeexamplesjsmlinesLine2js.Line2)(geo11, mat11);
        line11.computeLineDistances();
        line11.scale.set(1, 1, 1);
        meshes11.add(line11);
    }
    return meshes11;
}
// make a thing that draws out all the lines (Thin)
function DrawTHREEGraphEdgesThin(G11, bounds11, color11 = 0xffffff) {
    // first get the edge map positions
    const emap11 = G11.get_edge_map();
    return DrawThinEdgesFromEdgeMap(emap11, bounds11, color11);
}
// function to draw edges from edge map
function DrawThinEdgesFromEdgeMap(emap11, bounds11, color11 = 0xffffff) {
    const material11 = new $h9nKb$three.LineBasicMaterial({
        color: color11
    });
    const lines11 = new $h9nKb$three.Group();
    let points11;
    for (const edge11 of emap11.values()){
        points11 = [];
        // get the edge data
        const ldata11 = edge11.points;
        ldata11.forEach((element11)=>{
            points11.push(new $h9nKb$three.Vector3(element11.x * bounds11, element11.y * bounds11, element11.z * bounds11));
        });
        // then make the line thing
        const geometry11 = new $h9nKb$three.BufferGeometry().setFromPoints(points11);
        const line11 = new $h9nKb$three.Line(geometry11, material11);
        lines11.add(line11);
    }
    return lines11;
}
// draw the cube box graph here
function AddBoxBasedImaging(nodeMap11, bounds11, color11 = 0xffffff, size11 = 10) {
    // precompute all the sizes
    let sizes11;
    if (typeof size11 == "number") sizes11 = Array(nodeMap11.size).fill(size11);
    else sizes11 = size11;
    // returns a group
    const group11 = new $h9nKb$three.Group();
    const material11 = new $h9nKb$three.MeshBasicMaterial({
        color: color11
    });
    let nodeData11;
    let geometry11;
    let nodeMesh11;
    for(let i11 = 0; i11 < nodeMap11.size; i11++){
        nodeData11 = nodeMap11.get(i11);
        geometry11 = new $h9nKb$three.BoxGeometry(sizes11[i11]);
        geometry11.name = i11.toString();
        nodeMesh11 = new $h9nKb$three.Mesh(geometry11, material11);
        nodeMesh11.position.set(nodeData11.x * bounds11, nodeData11.y * bounds11, nodeData11.z * bounds11);
        group11.add(nodeMesh11);
    }
    return group11;
}
// Draw BoxBased imaging from a graph
function DrawTHREEBoxBasedVertices(graph11, bounds11, color11 = 0xffffff, size11 = 10) {
    const pmap11 = graph11.get_position_map();
    const Bgroup11 = AddBoxBasedImaging(pmap11, bounds11, color11, size11);
    return Bgroup11;
}
// draw cylinders where required
function AddCylinderBasedImaging(nodeMap11, divisonLength11, color11 = 0xffffff, size11 = 10) {
    // precompute all the sizes
    let sizes11;
    if (typeof size11 == "number") sizes11.Array(nodeMap11.size).fill(size11);
    else sizes11 = size11;
    // returns a group
    const group11 = new $h9nKb$three.Group();
    const material11 = new $h9nKb$three.MeshBasicMaterial({
        color: color11
    });
    let radius11, circumfurence11, segments11;
    let nodeData11;
    for(let i11 = 0; i11 < nodeMap11.size; i11++){
        nodeData11 = nodeMap11.get(i11);
        radius11 = sizes11[i11];
        circumfurence11 = 2 * radius11 * Math.PI;
        segments11 = Math.ceil(circumfurence11 / divisonLength11);
        const geometry11 = new $h9nKb$three.CylinderGeometry(radius11, radius11, 10, segments11);
        geometry11.name = i11.toString();
        const nodeMesh11 = new $h9nKb$three.Mesh(geometry11, material11);
        nodeMesh11.position.set(nodeData11.x, nodeData11.y, nodeData11.z);
        group11.add(nodeMesh11);
    }
    return group11;
}
// draw the sparse graph as groups
// this seperates all the points based on some or the other group
function AddInModularityBasedPointGroups(Graph, propertyName) {
    return __awaiter(this, void 0, void 0, function*() {
        // returns an array of groups
        const groups = new Map();
        let ndata;
        let modularity;
        for (let node of Graph.nodes.keys()){
            ndata = Graph.nodes.get(node);
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
            subgraph = yield (0, $cWcXJ.default).SelectSubgraph(Graph, subgraphGroup);
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
    });
}
function DrawSimplifiedEdges(G11, amount11, color11 = 0xffffff) {
    const lineGroup11 = new $h9nKb$three.Group();
    const material11 = new $h9nKb$three.LineBasicMaterial({
        color: color11
    });
    let start11;
    let end11;
    let points11;
    for (let edge11 of G11.edges.values())if (Math.random() <= amount11) {
        start11 = G11.nodes.get(edge11.start).data.pos;
        end11 = G11.nodes.get(edge11.end).data.pos;
        points11 = [];
        points11.push(new $h9nKb$three.Vector3(start11.x, start11.y, start11.z));
        points11.push(new $h9nKb$three.Vector3(end11.x, end11.y, end11.z));
        const geometry11 = new $h9nKb$three.BufferGeometry().setFromPoints(points11);
        const line11 = new $h9nKb$three.Line(geometry11, material11);
        lineGroup11.add(line11);
    }
    return lineGroup11;
}
function ChangeTheVertexColours(vertices11, indexArray11, color11) {
    let Attrib11 = vertices11.geometry.attributes;
    let k11 = 0;
    const newCol11 = (0, $1jyjM.hexToRgb)(color11);
    indexArray11.forEach((node11)=>{
        k11 = node11 * 3; // @ts-ignore
        Attrib11.customColor.array[k11] = newCol11.r; // @ts-ignore
        Attrib11.customColor.array[k11 + 1] = newCol11.g; // @ts-ignore
        Attrib11.customColor.array[k11 + 2] = newCol11.b;
    });
    Attrib11.customColor.needsUpdate = true;
}
function ResetVertexColors(vertices11) {
    let Attrib11 = vertices11.geometry.attributes;
    let k11 = 0;
    for(let i11 = 0; i11 < Attrib11.customColor.count; i11++){
        k11 = i11 * 3; // @ts-ignore
        Attrib11.customColor.array[k11] = 255; // @ts-ignore
        Attrib11.customColor.array[k11 + 1] = 255; // @ts-ignore
        Attrib11.customColor.array[k11 + 2] = 255;
    }
    Attrib11.customColor.needsUpdate = true;
}
var $a81f7bf7ba151678$export$2e2bcd8739ae039 = {
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

$parcel$export(module.exports, "hexToRgb", () => $0f522fa43e7ceed2$export$5a544e13ad4e1fa5);
///////////////
// color convert by Tim Down
// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function $0f522fa43e7ceed2$var$componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function $0f522fa43e7ceed2$export$34d09c4a771c46ef(r, g, b) {
    return "#" + $0f522fa43e7ceed2$var$componentToHex(r) + $0f522fa43e7ceed2$var$componentToHex(g) + $0f522fa43e7ceed2$var$componentToHex(b);
}
function $0f522fa43e7ceed2$export$5a544e13ad4e1fa5(hex) {
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

$parcel$export(module.exports, "vertexShader", () => $8b2fcdeb0edc9ee9$export$84657c60382b0f83);
const $8b2fcdeb0edc9ee9$export$84657c60382b0f83 = `
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

$parcel$export(module.exports, "fragmentShader", () => $61492820ee257def$export$4391ef72fa03c19);
const $61492820ee257def$export$4391ef72fa03c19 = `
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
$parcel$export(module.exports, "SampleData", () => $c57cf0c4853fb804$exports.default);
$parcel$export(module.exports, "Constructors", () => $942e91a547b4130c$exports.default);
$parcel$export(module.exports, "Drawing", () => (parcelRequire("jYcHE")).default);
$parcel$export(module.exports, "Geometry", () => (parcelRequire("fd3jp")).default);
$parcel$export(module.exports, "Utilities", () => (parcelRequire("6Xdhg")).default);
$parcel$export(module.exports, "threeDWrapper", () => (parcelRequire("eqUI8")).default);
$parcel$export(module.exports, "GraphDrawer", () => $6abda68f7f78a6fb$exports.default);

var $9TL8g = parcelRequire("9TL8g");

var $cWcXJ = parcelRequire("cWcXJ");
var $c57cf0c4853fb804$exports = {};

$parcel$export($c57cf0c4853fb804$exports, "default", () => $c57cf0c4853fb804$export$2e2bcd8739ae039);
const $a79fcfb00e2fad28$export$b6cdfb6bd6195507 = {
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
        33
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
        ]
    ]
};


const $16cc01d9c2706f25$export$aa88f89bcd11f8a9 = {
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
        }
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
        ]
    ]
};


var $942e91a547b4130c$exports = {};

$parcel$export($942e91a547b4130c$exports, "default", () => $942e91a547b4130c$export$2e2bcd8739ae039);

var $9TL8g = parcelRequire("9TL8g");
class $d0af3be0040778ae$export$1e3a09c15b213958 {
    constructor(data){
        // this data is an arbitrary thing with which I can create any object
        this.data = Object.assign({}, data);
        // the neighbours bit is explicity set from the code outside
        this.neighbours = [];
    }
}



var $i8obY = parcelRequire("i8obY");
var $942e91a547b4130c$var$__awaiter = undefined && undefined.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// construct a graph based on an edge list etc
function $942e91a547b4130c$var$ConstructGraphNodeEdgesList(nodes, edges) {
    return $942e91a547b4130c$var$__awaiter(this, void 0, void 0, function*() {
        // make a node OBJ
        const nodeOBJ = new Map();
        for(let i = 0; i < nodes.length; i++){
            const n = new (0, $d0af3be0040778ae$export$1e3a09c15b213958)(nodes[i].data);
            nodeOBJ.set(nodes[i], n);
        }
        // make an edge object
        const edgeOBJ = new Map();
        for(let i = 0; i < edges.length; i++){
            const e = new (0, $i8obY.Edge)(edges[i][0], edges[i][1], edges[i].data);
            edgeOBJ.set(i, e);
        }
        // make a graph object
        const G = yield (0, $9TL8g.Graph).create(nodeOBJ, edgeOBJ);
        return G;
    });
}
var $942e91a547b4130c$export$2e2bcd8739ae039 = {
    ConstructGraphNodeEdgesList: $942e91a547b4130c$var$ConstructGraphNodeEdgesList
};



var $9TL8g = parcelRequire("9TL8g");

var $fw40F = parcelRequire("fw40F");


var $i8obY = parcelRequire("i8obY");

var $jYcHE = parcelRequire("jYcHE");
var $c57cf0c4853fb804$var$__awaiter = undefined && undefined.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function $c57cf0c4853fb804$var$LoadZKC() {
    return $c57cf0c4853fb804$var$__awaiter(this, void 0, void 0, function*() {
        // load up the dataset representation
        const data = (0, $a79fcfb00e2fad28$export$b6cdfb6bd6195507);
        const G = yield (0, $942e91a547b4130c$exports.default).ConstructGraphNodeEdgesList(data.nodes, data.edges);
        return G;
    });
}
function $c57cf0c4853fb804$var$LoadZKCSimulated() {
    return $c57cf0c4853fb804$var$__awaiter(this, void 0, void 0, function*() {
        // make a map
        const data = (0, $16cc01d9c2706f25$export$aa88f89bcd11f8a9);
        const nodes = new Map();
        const edges = new Map();
        // set the node map
        data.nodes.forEach((node)=>{
            const id = node.id;
            const pos = new (0, $fw40F.Point)(node.px * 50, 0, node.py * 50);
            const modularity = node.member;
            const n = new (0, $d0af3be0040778ae$export$1e3a09c15b213958)({
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
        const G = yield (0, $9TL8g.Graph).create(nodes, edges);
        const lmap = (0, $jYcHE.default).DrawEdgeLines(G, 10);
        G.apply_edge_pos_maps(lmap);
        return G;
    });
}
var // exports
$c57cf0c4853fb804$export$2e2bcd8739ae039 = {
    LoadZKC: $c57cf0c4853fb804$var$LoadZKC,
    LoadZKCSimulated: $c57cf0c4853fb804$var$LoadZKCSimulated
};




var $jYcHE = parcelRequire("jYcHE");

var $fd3jp = parcelRequire("fd3jp");

var $6Xdhg = parcelRequire("6Xdhg");

var $eqUI8 = parcelRequire("eqUI8");
var $6abda68f7f78a6fb$exports = {};

$parcel$export($6abda68f7f78a6fb$exports, "default", () => $6abda68f7f78a6fb$export$2e2bcd8739ae039);



var $eqUI8 = parcelRequire("eqUI8");
var $6abda68f7f78a6fb$var$__awaiter = undefined && undefined.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// this is the 3d graph drawing class with three js
class $6abda68f7f78a6fb$var$GraphDrawer3d {
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
    init() {
        return $6abda68f7f78a6fb$var$__awaiter(this, void 0, void 0, function*() {
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
        });
    }
    // this stuff renders out one specific instances
    rendercall() {
        // this is the render draw call
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
    }
}
var $6abda68f7f78a6fb$export$2e2bcd8739ae039 = {
    GraphDrawer3d: $6abda68f7f78a6fb$var$GraphDrawer3d
};




//# sourceMappingURL=pgl.js.map
