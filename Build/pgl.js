var $h9nKb$three = require("three");
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

var parcelRequire = $parcel$global["parcelRequire71ec"];
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

  $parcel$global["parcelRequire71ec"] = parcelRequire;
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
 */ function SimulateKamadaKawai(Graph11, iterations11, simulationBound11 = 100, cohesionValue11 = 1, repulsionValue11 = 1) {
    return __awaiter(this, void 0, void 0, function*() {
        const adjList11 = Graph11.get_adjacency();
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
            let new_x_r_pos11;
            let new_y_r_pos11;
            let new_c_xpos11;
            let new_c_ypos11;
            let new_g_xpos_displacement11;
            let new_g_ypos_displacement11;
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
                new_c_xpos11 = (0, $6Xdhg.default).calculateAverage(x_s11);
                new_c_ypos11 = (0, $6Xdhg.default).calculateAverage(y_s11);
                // this chunk is for the repelling force
                y_r11 = [];
                x_r11 = [];
                let diffx11;
                let diffy11;
                let othernodeX11;
                let othernodeY11;
                // then find the element
                for (const otherNode11 of Graph11.nodes.keys())// get the position of all the other nodes
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
                new_x_r_pos11 = repulsionValue11 * 1 / ((0, $6Xdhg.default).calculateAverage(x_r11) * (0, $6Xdhg.default).calculateAverage(x_r11));
                new_y_r_pos11 = repulsionValue11 * 1 / ((0, $6Xdhg.default).calculateAverage(y_r11) * (0, $6Xdhg.default).calculateAverage(y_r11));
                // calculate the dispacement amount in c/y pos
                // this is the cohesion value
                new_c_xpos_dispacement11 = cohesionValue11 * (new_c_xpos11 - nodeX11);
                new_c_ypos_dispacement11 = cohesionValue11 * (new_c_ypos11 - nodeY11);
                // Also move all the points towards the center a little bit
                // so that the graph doesent explode out
                new_g_xpos_displacement11 = cohesionValue11 * (0 - nodeX11);
                new_g_ypos_displacement11 = cohesionValue11 * (0 - nodeY11);
                // then add the x and y components of the two vectors
                const new_xpos11 = new_x_r_pos11 + new_g_xpos_displacement11 + new_c_xpos_dispacement11 + nodeX11;
                const new_ypos11 = new_y_r_pos11 + new_g_ypos_displacement11 + new_c_ypos_dispacement11 + nodeY11;
                // now set these positions
                PosMapX11.set(node11, new_xpos11);
                PosMapY11.set(node11, new_ypos11);
            }
        }
        // return the position
        // keep in mind three JS works with Y upwards and not Z
        // in my head I work the other way round so Im swapping the Z and Y values here
        let PosMap11 = new Map();
        for (const p11 of PosMapX11.keys())PosMap11.set(p11, new (0, $fw40F.default)(PosMapX11.get(p11), 0, PosMapY11.get(p11)));
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
        const dispacementVector11 = new (0, $fw40F.default)(-x_displacement11, -y_displacement11, -z_displacement11);
        PosMap11 = MovePmap(PosMap11, dispacementVector11);
        return PosMap11;
    });
}
/**
 *
 * Randomly sets all the positions for a graph
 * Not really very useful but I've used it in some cases and have kept it around
 *
 *  @param Graph - The graph who's nodes you would want to reposition
 *
 * @return A position map of all the nodes and its corresponding positions
 */ function InstanciateRandomPositions(Graph11) {
    const adjList11 = Graph11.get_adjacency();
    const PosMapX11 = new Map();
    const PosMapY11 = new Map();
    for (const node11 of adjList11.keys()){
        PosMapX11.set(node11, Math.random() * 200);
        PosMapY11.set(node11, Math.random() * 200);
    }
    const PosMap11 = new Map();
    for (const p11 of PosMapX11.keys())PosMap11.set(p11, new (0, $fw40F.default)(PosMapX11.get(p11), 0, PosMapY11.get(p11)));
    return PosMap11;
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
 */ function DrawEdgeLines(Graph11, divDistance11) {
    // this is the return map
    const lineMap11 = new Map();
    let edge11;
    let start11;
    let end11;
    for (const key11 of Graph11.edges.keys()){
        edge11 = Graph11.edges.get(key11);
        // get the start pos
        start11 = Graph11.nodes.get(edge11.start).data.pos;
        end11 = Graph11.nodes.get(edge11.end).data.pos;
        const Line11 = (0, $fd3jp.default).line_from_start_end_distance(start11, end11, divDistance11);
        lineMap11.set(key11, Line11);
    }
    return lineMap11;
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
 */ function DrawEdgeLinesDivisions(Graph11, numberOfDivs11) {
    // this is the return map
    const lineMap11 = new Map();
    let edge11;
    let start11;
    let end11;
    for (const key11 of Graph11.edges.keys()){
        edge11 = Graph11.edges.get(key11);
        // get the start pos
        start11 = Graph11.nodes.get(edge11.start).data.pos;
        end11 = Graph11.nodes.get(edge11.end).data.pos;
        const Line11 = (0, $fd3jp.default).line_from_start_end_divisions(start11, end11, numberOfDivs11);
        lineMap11.set(key11, Line11);
    }
    return lineMap11;
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
 */ function DrawEdgeBundling(LineMap11, iterations11, distance11) {
    return __awaiter(this, void 0, void 0, function*() {
        // first create a deep copy of the map
        const returnArray11 = new Map();
        for (let key11 of LineMap11.keys())returnArray11.set(key11, structuredClone(LineMap11.get(key11)));
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
                const newPoint11 = new (0, $fw40F.default)(avgx11, avgy11, avgz11);
                line11.points[ii11] = newPoint11;
            }
        }
        // now return that new map
        return returnArray11;
    });
}
/**
 *
 * Displace the edges vertically, almost akin to the Deck.gl arcs
 * The displacement is done in a sin curve with the ends still touching the nodes
 * Note: This is an inplace modification of the edges
 *
 * @param LineMap - The map of edges as a line map
 * @param displacement - the amount of vertical displacement
 */ function DisplaceEdgeInY(LineMap11, displacement11) {
    const returnArray11 = new Map();
    for (let key11 of LineMap11.keys())returnArray11.set(key11, structuredClone(LineMap11.get(key11)));
    for (const key11 of returnArray11.keys()){
        const line11 = returnArray11.get(key11);
        // now for all the points in this
        let pnt11, ydisval11;
        for(let i11 = 0; i11 < line11.points.length; i11++){
            pnt11 = line11.points[i11];
            ydisval11 = displacement11 * Math.sin(Math.PI * i11 / (line11.points.length - 1));
            pnt11.y = pnt11.y + ydisval11;
        }
    }
    return returnArray11;
}
/**
 *
 * Displace the vertices vertically based on some prameter (For example degree or modularity)
 *
 * @param Graph - the graph whos nodes have to be displaced
 * @param parameter - the prameter based on which you want to modify the
 * @param displacement - the maximum amunt of displacement, all the other values are rescaled linerly
 */ function DisplaceVertices(Graph, parameter, displacement) {
    let max = 0;
    let value, ydisplacement;
    // go through the thing and set the min max values
    for (let node of Graph.nodes.values()){
        value = eval("node.data." + parameter);
        if (value >= max) max = value;
    }
    // go through the nodes again and set the values
    for (const node of Graph.nodes.values()){
        value = eval("node.data." + parameter);
        ydisplacement = value / max * displacement;
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
 */ function HivePlot(Graph11, selectedNode11, step11, startPosition11) {
    return __awaiter(this, void 0, void 0, function*() {
        const adj11 = Graph11.get_adjacency();
        const DijkstraDepth11 = yield (0, $cWcXJ.default).Dijkstra(Graph11, selectedNode11);
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
        const xoff11 = startPosition11.x || 0;
        const yoff11 = startPosition11.y || 0;
        const zoff11 = startPosition11.z || 0;
        // set the positions
        for (const node11 of adj11.keys()){
            const yval11 = DijkstraDepth11.get(node11) * step11;
            const depthArr11 = stepMap11.get(DijkstraDepth11.get(node11));
            const angle11 = 2 * Math.PI * (depthArr11.indexOf(node11) / depthArr11.length);
            const xval11 = Math.sin(angle11) * yval11;
            const zval11 = Math.cos(angle11) * yval11;
            // construct a new point
            const pnt11 = new (0, $fw40F.default)(xval11 + xoff11, -yval11 + yoff11, zval11 + zoff11);
            Pmap11.set(node11, pnt11);
        }
        // simulate the lines
        Graph11.apply_position_map(Pmap11);
        const lmap11 = DrawEdgeLines(Graph11, 1);
        const newLmap11 = yield DrawEdgeBundling(lmap11, 12, 5);
        return {
            pmap: Pmap11,
            emap: newLmap11
        };
    });
}
/**
 * Move a graph somewhere (like the physical location) - This is an inplace movement and overwrites existing values
 *
 * @param Graph - The graph that has to be moved
 * @param dispacement - This is a point and I end up using Point and Vector interchangably. So here the xyz values from the point are used to displace the nodes
 */ function MoveGraph(Graph11, dispacement11) {
    const Gmap11 = Graph11.get_map();
    const NewPmap11 = MovePmap(Gmap11.pmap, dispacement11);
    const NewEmap11 = MoveEmap(Gmap11.emap, dispacement11);
    Graph11.apply_drawing_maps({
        pmap: NewPmap11,
        emap: NewEmap11
    });
}
/**
 *
 * Move the nodes somewhere (Or the nodemap corresponding to the graph) - This is not an overwrite rather returns a new position map for the nodes to moved
 *
 * @param NodeM
 * ap - The Current position map of the graph
 * @param displacement - The Displacement vector
 * @returns - A new position map
 */ function MovePmap(NodeMap11, displacement11) {
    const newPmap11 = new Map();
    for (let node11 of NodeMap11.keys()){
        const p11 = NodeMap11.get(node11);
        p11.translate(displacement11);
        newPmap11.set(node11, p11);
    }
    return newPmap11;
}
/**
 *
 * Move the edges somewhere (the edgemap corresponding to the graph) - This is not an overwrite and returns a new edge map for the edges to be moved too
 *
 * @param LineMap - The current line map, this is made up of lines
 * @param dispacement - The displacement vector
 * @returns - The new line map
 */ function MoveEmap(LineMap11, dispacement11) {
    const newEmap11 = new Map();
    // variables - instead of redeclaring
    let interimPoints11;
    let interimLine11;
    let newLine11;
    for (let lineNumber11 of LineMap11.keys()){
        // reset the interim points
        interimPoints11 = [];
        // get the line
        interimLine11 = LineMap11.get(lineNumber11);
        // move all the points
        for (let pnt11 of interimLine11.points){
            pnt11.translate(dispacement11);
            // add this to the new stack of lines
            interimPoints11.push(pnt11);
        }
        // create a new line
        newLine11 = new (0, $3WMe9.default)(interimPoints11);
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
/**
 *
 *  Draw new lines from edges, and draw them based on the distance of divisions (i.e. divide the line up every 10 units) Note: This is an in place update that takes place on the graph - it overwrites the existing data.
 *
 * @param Graph - The grapht who's edges have to be updated
 * @param divDistance - The distance by which the divisions are made
 */ function UpdateEdgeLinesDist(Graph11, divDistance11) {
    let edge11;
    let start11;
    let end11;
    let line11;
    for (const key11 of Graph11.edges.keys()){
        edge11 = Graph11.edges.get(key11);
        // get the start pos
        start11 = Graph11.nodes.get(edge11.start).data.pos;
        end11 = Graph11.nodes.get(edge11.end).data.pos;
        line11 = (0, $fd3jp.default).line_from_start_end_distance(start11, end11, divDistance11);
        edge11.data.ldata = line11;
    }
}
/**
 *
 * Draw new lines from edges, and draw them based on divisions (i.e. divide the line into 10 units) Note: This is an in place update that takes place on the graph - it overwrites the existing data.

 * @param Graph - The grapht who's edges have to be updated
 * @param Divs - The number of divisions to be made
 */ function UpdateEdgeLinesDivs(Graph11, Divs11) {
    let edge11;
    let start11;
    let end11;
    let line11;
    for (const key11 of Graph11.edges.keys()){
        edge11 = Graph11.edges.get(key11);
        // get the start pos
        start11 = Graph11.nodes.get(edge11.start).data.pos;
        end11 = Graph11.nodes.get(edge11.end).data.pos;
        line11 = (0, $fd3jp.default).line_from_start_end_divisions(start11, end11, Divs11);
        edge11.data.ldata = line11;
    }
}
var $e89d79794dbc0ba9$export$2e2bcd8739ae039 = {
    SimulateKamadaKawai: SimulateKamadaKawai,
    DrawEdgeLines: DrawEdgeLines,
    DrawEdgeLinesDivisions: DrawEdgeLinesDivisions,
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
/**
 * calculate the average of an array of numberss
 * @param arr an array of number whose average has to be calculated
 * @returns the average
 */ function $51028d69415a7fb7$var$calculateAverage(arr) {
    let runningSum = 0;
    for(let i = 0; i < arr.length; i++)runningSum = runningSum + arr[i];
    const avg = runningSum / arr.length;
    if (Number.isNaN(avg)) return 0;
    return avg;
}
// calculate distance between two points
/**
 * Calculate the distance betweeen two points
 * @param p1 the first point
 * @param p2 the second point
 * @returns the distance between the points
 */ function $51028d69415a7fb7$var$calculateDistance(p1, p2) {
    const d = Math.pow(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2), 0.5);
    return d;
}
// calculate squared distance sometimes we dont really need
// the actual root but just a rough idea
/**
 * Calculate the squared distance between two points
 * @param p1 the first point
 * @param p2 the second point
 * @returns the squared distance between the two points
 */ function $51028d69415a7fb7$var$calculateSquaredDistance(p1, p2) {
    const d = Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2);
    return d;
}
// get a random subset of something from a array of things
// must provide the number of things we want from that array
/**
 * get a random subset of something from a array of things must provide the number of things we want from that array
 * @param arr the array from which the subset has to be made
 * @param n number of items to select
 * @returns a new array made up of a random sample from the original array
 */ function $51028d69415a7fb7$var$getRandomSubset(arr, n) {
    var result = new Array(n), len = arr.length, taken = new Array(len);
    if (n > len) throw new RangeError("getRandom: more elements taken than available");
    while(n--){
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}
/**
 * This is a super useful method to get a random number of edges or something that you would like to draw
 * this is primarily done because there are way too many edges sometimes and and the number of edges is really
 * What slows the whole rendering process down
 * @param map - the map that youd like to reduce
 * @param n - the fraction of items that youd like to return from this map
 * @returns A reduced map with a fractio of those many entries
 */ function $51028d69415a7fb7$var$getRandomSubset_map(map, n) {
    const newMap = new Map();
    let prob;
    for (const item of map.keys()){
        prob = Math.random();
        if (prob < n) newMap.set(item, map.get(item));
    }
    return newMap;
}
var $51028d69415a7fb7$export$2e2bcd8739ae039 = {
    calculateAverage: $51028d69415a7fb7$var$calculateAverage,
    calculateDistance: $51028d69415a7fb7$var$calculateDistance,
    calculateSquaredDistance: $51028d69415a7fb7$var$calculateSquaredDistance,
    getRandomSubset: $51028d69415a7fb7$var$getRandomSubset,
    getRandomSubset_map: $51028d69415a7fb7$var$getRandomSubset_map
};

});

parcelRequire.register("fd3jp", function(module, exports) {

$parcel$export(module.exports, "default", () => $b12aa3a1ba88a23a$export$2e2bcd8739ae039);

var $fw40F = parcelRequire("fw40F");

var $3WMe9 = parcelRequire("3WMe9");

var $6Xdhg = parcelRequire("6Xdhg");
/**
 * Creates a line based on the number of divisons
 *
 * @param start the start point
 * @param end the end point
 * @param divisions the number of divisions
 * @returns the line object
 */ function $b12aa3a1ba88a23a$var$line_from_start_end_divisions(start, end, divisions) {
    // create a start and end time
    const Start = new (0, $fw40F.default)(start.x, start.y, start.z);
    const End = new (0, $fw40F.default)(end.x, end.y, end.z);
    // interpolated points
    const points = [];
    // divisions
    for(let i = 0; i <= divisions; i++){
        const interVar = i / divisions;
        const newx = interVar * Start.x + (1 - interVar) * End.x;
        const newy = interVar * Start.y + (1 - interVar) * End.y;
        const newz = interVar * Start.z + (1 - interVar) * End.z;
        const newPoint = new (0, $fw40F.default)(newx, newy, newz);
        points.push(newPoint);
    }
    // create a new line
    const SubdividedLine = new (0, $3WMe9.default)(points);
    return SubdividedLine;
}
/**
 * Divides the line into a number of divisions based on distance
 * @param start - the start point
 * @param end - the end point
 * @param distance - the distance at which this line must be divided
 * @returns A line object with the right number of points
 */ function $b12aa3a1ba88a23a$var$line_from_start_end_distance(start, end, distance) {
    const dist = (0, $6Xdhg.default).calculateDistance(start, end);
    const divs = Math.round(dist / distance) + 2;
    const subdivline = $b12aa3a1ba88a23a$var$line_from_start_end_divisions(start, end, divs);
    return subdivline;
}
/**
 * Calculates the centroid of an array of points
 * @param points An array of points
 * @returns the central point of the array of points
 */ function $b12aa3a1ba88a23a$var$centroid(points) {
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
    const centroid = new (0, $fw40F.default)(rx, ry, rz);
    return centroid;
}
var $b12aa3a1ba88a23a$export$2e2bcd8739ae039 = {
    line_from_start_end_divisions: $b12aa3a1ba88a23a$var$line_from_start_end_divisions,
    line_from_start_end_distance: $b12aa3a1ba88a23a$var$line_from_start_end_distance,
    centroid: $b12aa3a1ba88a23a$var$centroid
};

});
parcelRequire.register("fw40F", function(module, exports) {

$parcel$export(module.exports, "default", () => $b4bcf46d914a9151$export$2e2bcd8739ae039);
class $b4bcf46d914a9151$var$Point {
    /**
     * Constructs a point based on the x y z values
     * @param x x value
     * @param y y value
     * @param z z value
     */ constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    // Points are somewhat the same thing as a vector 
    // So im using the same type instead of redeclaring the 
    // Type
    /**
     * Displaces a point - note this method moves the existing point
     * @param Point - Displacement vector (used as a point)
     */ translate(Point) {
        this.x = this.x + Point.x;
        this.y = this.y + Point.y;
        this.z = this.z + Point.z;
    }
}
var $b4bcf46d914a9151$export$2e2bcd8739ae039 = $b4bcf46d914a9151$var$Point;

});

parcelRequire.register("3WMe9", function(module, exports) {

$parcel$export(module.exports, "default", () => $2dfc32cf7d94658f$export$2e2bcd8739ae039);

var $fw40F = parcelRequire("fw40F");
class $2dfc32cf7d94658f$var$Line {
    /**
     * Constructs a line from an array of points
     * @param points an array of points
     */ constructor(points){
        this.points = [];
        points.forEach((p)=>{
            const point = new (0, $fw40F.default)(p.x, p.y, p.z);
            this.points.push(point);
        });
    }
}
var $2dfc32cf7d94658f$export$2e2bcd8739ae039 = $2dfc32cf7d94658f$var$Line;

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
/**
 *
 * Performs a BFS search on a graph - Async because it takes a while on large graphs
 *
 * @param Graph - The graph which has to be searched using the BFS algorithm
 * @param node - The node form which to start
 * @returns - A map of which node was explored from which other node
 */ function $96b4f4dcd8ff333f$var$BFSSearch(Graph, node) {
    return $96b4f4dcd8ff333f$var$__awaiter(this, void 0, void 0, function*() {
        const adj = Graph.get_adjacency();
        const exploredFromMap = new Map();
        const explored = new Set([
            node
        ]);
        const queue = [
            node
        ];
        exploredFromMap.set(node, -1);
        while(queue.length > 0){
            const currentNode = queue.shift();
            const neighbours = adj.get(currentNode);
            for(let i = 0; i < neighbours.length; i++){
                const neighbour = neighbours[i];
                if (!explored.has(neighbour)) {
                    explored.add(neighbour);
                    queue.push(neighbour);
                    exploredFromMap.set(neighbour, currentNode);
                }
            }
        }
        // then return the explored from map
        return exploredFromMap;
    });
}
// do a dijkstra Search Distance map
/**
 *
 * Performs a dijkstra search on a graph
 *
 * @param Graph - The graph on which to perform the Dijkstra search
 * @param Node - The node from which to start
 * @returns - Map from which each one of the nodes was searched from
 */ function $96b4f4dcd8ff333f$var$Dijkstra(Graph, Node) {
    return $96b4f4dcd8ff333f$var$__awaiter(this, void 0, void 0, function*() {
        const adj = Graph.get_adjacency();
        const Dmap = new Map();
        const exploredFromMap = yield $96b4f4dcd8ff333f$var$BFSSearch(Graph, Node);
        for (const n of adj.keys()){
            if (!exploredFromMap.has(n)) continue; // unreachable (disconnected)
            let i = 0;
            let exploredFrom = exploredFromMap.get(n);
            while(exploredFrom !== undefined && exploredFrom !== -1){
                exploredFrom = exploredFromMap.get(exploredFrom);
                i += 1;
            }
            Dmap.set(n, i);
        }
        return Dmap;
    });
}
// This file contains basic things like
// Graph searches and stuff
// this only returns one of the diameters that is the longest 
// not all of them
/**
 *
 * Finds the diameter of the graph
 *
 * @param Graph
 * @returns returns an object with a start, end - the two points of a graph and the diameter of the graph
 */ function $96b4f4dcd8ff333f$var$GraphDiameter(Graph) {
    return $96b4f4dcd8ff333f$var$__awaiter(this, void 0, void 0, function*() {
        const nodeIds = [
            ...Graph.nodes.keys()
        ];
        if (nodeIds.length === 0) return {
            start: 0,
            end: 0,
            distance: 0
        };
        if (nodeIds.length === 1) return {
            start: nodeIds[0],
            end: nodeIds[0],
            distance: 0
        };
        const adj = Graph.get_adjacency();
        const withNeighbors = nodeIds.filter((id)=>{
            var _a, _b;
            return ((_b = (_a = adj.get(id)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 0;
        });
        const pickFrom = withNeighbors.length > 0 ? withNeighbors : nodeIds;
        let seed = pickFrom[Math.floor(Math.random() * pickFrom.length)];
        let Dstart = yield $96b4f4dcd8ff333f$var$Dijkstra(Graph, seed);
        let currentDistance = -1;
        for (const n of Dstart.keys()){
            const dval = Dstart.get(n);
            if (dval > currentDistance) {
                seed = n;
                currentDistance = dval;
            }
        }
        const newStart = seed;
        Dstart = yield $96b4f4dcd8ff333f$var$Dijkstra(Graph, seed);
        currentDistance = -1;
        for (const n of Dstart.keys()){
            const dval = Dstart.get(n);
            if (dval > currentDistance) {
                seed = n;
                currentDistance = dval;
            }
        }
        return {
            start: newStart,
            end: seed,
            distance: currentDistance
        };
    });
}
// Select a subrgaph
// you must specify a list of nodes that you passed in
/**
 *
 * Select a subgraph
 *
 * @param graph - The main graph to select from
 * @param nodeList - The selection of nodes that we want to select from this graph
 * @returns A graph object that contains this subgraph
 */ function $96b4f4dcd8ff333f$var$SelectSubgraph(graph, nodeList) {
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
        const newGraph = yield (0, $9TL8g.default).create(prunedNodes, prunedEdges);
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

$parcel$export(module.exports, "default", () => $734dcf9f6d72d709$export$2e2bcd8739ae039);

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
/**
 * The main graph object: contains nodes and edges that get modified with different
 * operations (layout, clustering, etc.).
 */ class $734dcf9f6d72d709$var$Graph {
    /**
     *
     * Construct a graph object (no initializing)
     *
     * @param nodes - Map of all the nodes associated with the graph
     * @param edges - Map of all the edges associated with the graph
     */ constructor(nodes, edges){
        this.nodes = nodes;
        this.edges = edges;
    // execute Internal methods
    // this.printData();
    }
    // test function
    /**
     * Prints out a snapshot of data associated with this graph like how many nodes and how many edges
     */ printData() {
        const message = "This is a graph with " + this.nodes.size + " nodes and " + this.edges.size + " edges";
        console.log(message);
    }
    // initialize
    /**
     * Initializes the graph and constructs the node adjacency list.
     */ initialize() {
        return $734dcf9f6d72d709$var$__awaiter(this, void 0, void 0, function*() {
            yield this.constructAdjacencyList();
        });
    }
    // new create method
    /**
     *
     * This is the official create method to make a graph based on a set of nodes and edges
     * It also auto-initializes the graph and sets all the adjacency lists in memory.
     *
     * @param nodes - map of nodes
     * @param edges - map of edges
     * @returns
     */ static create(nodes, edges) {
        return $734dcf9f6d72d709$var$__awaiter(this, void 0, void 0, function*() {
            const g = new $734dcf9f6d72d709$var$Graph(nodes, edges);
            yield g.initialize();
            return g;
        });
    }
    // construct the adjacency list represntation
    /**
     * Constructs the adjacency associated with the graph
     */ constructAdjacencyList() {
        return $734dcf9f6d72d709$var$__awaiter(this, void 0, void 0, function*() {
            // I'm constructing a Graph here so some of the stuff doesnt matter
            this.edges.forEach((edge)=>{
                const start = edge.start;
                const end = edge.end;
                if (this.nodes.get(start)) this.nodes.get(start).neighbours.push(end);
                if (this.nodes.get(end)) this.nodes.get(end).neighbours.push(start);
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
    /**
     * Add a node to the graph.
     * @param nodeID - The node ID
     * @param data - Data associated with the node
     */ add_node(nodeID, data) {
        this.nodes.set(nodeID, data);
    }
    // add an edge
    /**
     * Add an edge to the graph
     * @param start - Starting index of the edge
     * @param end - The end index of the edge
     * @param data - data associated with the edge
     */ add_edge(start, end, data) {
        const newEdge = new (0, $i8obY.default)(start, end, data);
        this.edges.set(this.edges.size, newEdge);
        // keep adjacency consistent for undirected graph (both directions)
        const startNode = this.nodes.get(start);
        const endNode = this.nodes.get(end);
        if (startNode) startNode.neighbours.push(end);
        if (endNode) endNode.neighbours.push(start);
    }
    // get an adjacency list reprentation of the graph
    // this onlu has the indices and not the actual data
    // associated with the node to speed things up
    /**
     *
     * @returns The adjacency lists associated with the graph
     */ get_adjacency() {
        const SparseMap = new Map();
        // iterate through the node list
        for (const key of this.nodes.keys())SparseMap.set(key, this.nodes.get(key).neighbours);
        return SparseMap;
    }
    // set position based on an array of positions
    // this could be anything (we use kamada kawai )
    /**
     * Apply a position map based on some data
     * @param data - the position map that has to be applied to the graph
     */ apply_position_map(data) {
        for (let n of data.keys())this.nodes.get(n).data = Object.assign(Object.assign({}, this.nodes.get(n).data), {
            pos: data.get(n)
        });
    }
    // create new edge pos representation
    // same approach for applying the key data
    /**
     * Apply an line map to a graph
     * @param data Line data that has to be applied to the graph
     */ apply_edge_pos_maps(data) {
        for (let key of data.keys())this.edges.get(key).data = Object.assign(Object.assign({}, this.edges.get(key).data), {
            ldata: data.get(key)
        });
    }
    // get the edge reps
    // this returns all the edge map readings
    /**
     * get the current edge map
     * @returns The current set of edges associated with the graph
     */ get_edge_map() {
        const lines = new Map();
        for (const key of this.edges.keys()){
            const ldata = this.edges.get(key).data.ldata;
            if (ldata != null) lines.set(key, ldata);
        }
        return lines;
    }
    // graph apply pos and edge map
    /**
     * Applies all the maps to the graph
     * @param layout - Applies an object of maps associated with with a graph is made up of {pmap:(the position map), emap:{the edge map}}
     */ apply_drawing_maps(layout) {
        if (layout.pmap) this.apply_position_map(layout.pmap);
        if (layout.emap) this.apply_edge_pos_maps(layout.emap);
    }
    // get the positon map of the graph
    /**
     * Gets the position map and the edge map respectively
     * @returns The position map and the edge map as pmap and emap
     */ get_map() {
        return {
            pmap: this.get_position_map(),
            emap: this.get_edge_map()
        };
    }
    /**
     * Get the position of the nodes in the graph.
     * @returns The position map (node ID to Point)
     */ get_position_map() {
        const pmap = new Map();
        for (const node of this.nodes.keys())pmap.set(node, this.nodes.get(node).data.pos);
        return pmap;
    }
}
var // Export the graph Library
$734dcf9f6d72d709$export$2e2bcd8739ae039 = $734dcf9f6d72d709$var$Graph;

});
parcelRequire.register("i8obY", function(module, exports) {

$parcel$export(module.exports, "default", () => $d33bbd65b64ffa49$export$2e2bcd8739ae039);
/**
 * Edge class: connects two nodes by start/end IDs; can hold optional data (e.g. "ldata" for line geometry).
 */ class $d33bbd65b64ffa49$var$Edge {
    /**
     *
     * Construct an edge
     *
     * @param start Start index of the edge based on the array of nodes
     * @param end End index of the edge based on the array of nodes
     * @param data - Optional data; "ldata" is reserved for line geometry used when drawing the edge
     */ constructor(start, end, data){
        this.start = start;
        this.end = end;
        this.data = Object.assign({}, data);
    }
}
var $d33bbd65b64ffa49$export$2e2bcd8739ae039 = $d33bbd65b64ffa49$var$Edge;

});




parcelRequire.register("eqUI8", function(module, exports) {

$parcel$export(module.exports, "default", () => $a81f7bf7ba151678$export$2e2bcd8739ae039);


var $3WMe9 = parcelRequire("3WMe9");

var $2vhjw = parcelRequire("2vhjw");

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
/**
 *
 * Draw the veritces of the graph out as a point cloud
 *
 * @param Graph - the graph that has to be drawn out
 * @param bounds - A global scaling parameter defaults to 1 but change to scale up a garph
 * @param size - The size of all the nodes - either input an array the same length of the number of nodes decribing how big each node is, or a global node value as a number or defaults to 1
 * @param color - the color of the node defaults to white
 * @param alpha - the alpha value of the node defaults to 1 (opaque)
 * @returns a three JS group that contains all the vertices as a point cloud or a three js points object that can be added to the scene
 */ function DrawTHREEGraphVertices(Graph11, bounds11 = 1, size11 = 1, color11 = 0xffffff, alpha11 = 1) {
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
/**
 *
 * Draws out all the edges (Thick edges of a graph)
 *
 * @param Graph - The graph whose edges have to be drawn
 * @param bounds - the global scale for all the edges to be drawn defaults to 1
 * @param color - color of the edges defaults to white
 * @param thickness - thickness of the edges (defaults to 0.4; screen-space pixels ≈ thickness × 100 for values &lt; 1)
 * @returns a Three Js group of edges that can be added to the scene
 */ function DrawTHREEGraphEdgesThick(Graph11, bounds11 = 1, color11 = 0xffffff, thickness11 = 0.4) {
    // add the interpolation function
    const lineMap11 = Graph11.get_edge_map();
    return DrawThickEdgesFromEdgeMap(lineMap11, bounds11, color11, thickness11);
}
// draw a thing to draw out all the edges from the edge map stuff
/**
 *
 * Draw thick edges from an edge map
 *
 * @param EdgeMap - The edge map associated with the graph
 * @param bounds - The global scale of the graph - defaults to 1
 * @param color - The color of the edges - defaults to white
 * @param thickness - thickness of the edges (defaults to 0.4; pixels ≈ thickness × 100 for values &lt; 1)
 * @returns
 */ function DrawThickEdgesFromEdgeMap(EdgeMap11, bounds11, color11 = 0xffffff, thickness11 = 0.4) {
    return (0, $2vhjw.createThickEdgesGroup)(EdgeMap11, bounds11, color11, thickness11);
}
// make a thing that draws out all the lines (Thin)
/**
 *
 * Draw thin lines for all the edges given a graph
 *
 * @param Graph - The graph that has to be drawn
 * @param bounds - The global scale factor for the the edges - defaults to 1
 * @param color - color of the lines - defaults to white
 * @returns
 */ function DrawTHREEGraphEdgesThin(Graph11, bounds11 = 1, color11 = 0xffffff) {
    // first get the edge map positions
    const emap11 = Graph11.get_edge_map();
    return DrawThinEdgesFromEdgeMap(emap11, bounds11, color11);
}
/**
 * Draw a single thick line through an ordered list of node IDs (e.g. a path).
 * Uses graph positions; line width in pixels (pass thickness >= 1 for pixel width).
 *
 * @param Graph - Graph with position map
 * @param bounds - Scale factor for positions
 * @param pathNodeIds - Ordered node IDs (start to end)
 * @param color - Hex color for the path line
 * @param thickness - Line width in pixels (e.g. 5 for a thick path)
 */ function DrawThickPathFromNodeIds(Graph11, bounds11, pathNodeIds11, color11 = 0xffffff, thickness11 = 5) {
    const pmap11 = Graph11.get_position_map();
    const pathPoints11 = pathNodeIds11.map((id11)=>pmap11.get(id11)).filter((p11)=>p11 != null);
    if (pathPoints11.length < 2) return new $h9nKb$three.Group();
    const pathLine11 = new (0, $3WMe9.default)(pathPoints11);
    return (0, $2vhjw.createThickEdgesGroup)(new Map([
        [
            0,
            pathLine11
        ]
    ]), bounds11, color11, thickness11);
}
// function to draw edges from edge map
/**
 *
 * Draw Line map as lines given the edge map assocaited with the graph
 *
 * @param LineMap - The edge map that has to be drawn out
 * @param bounds - Global scale for the edges to be drawn defaults to 1
 * @param color - Color of the edges defaults to 1
 * @returns
 */ function DrawThinEdgesFromEdgeMap(LineMap11, bounds11 = 1, color11 = 0xffffff) {
    const material11 = new $h9nKb$three.LineBasicMaterial({
        color: color11
    });
    const lines11 = new $h9nKb$three.Group();
    let points11;
    for (const edge11 of LineMap11.values()){
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
/**
 *
 * Adde boxes where all the boxes are
 *
 * @param nodeMap - a map of all the nodes
 * @param bounds - global scale of the edges to be drawn, defaults to 1
 * @param color - default color of the edges, defaults to white
 * @param size - size of the nodes defaults to 10
 * @returns a group of vertices that contains all of the boxes associated with each one of the vertices
 */ function AddBoxBasedImaging(nodeMap11, bounds11 = 1, color11 = 0xffffff, size11 = 10) {
    // precompute all the sizes
    let sizes11;
    if (typeof size11 == "number") sizes11 = Array(nodeMap11.size).fill(size11);
    else sizes11 = size11;
    // returns a group (iterate map entries so any node ID set works)
    const group11 = new $h9nKb$three.Group();
    const material11 = new $h9nKb$three.MeshBasicMaterial({
        color: color11
    });
    let i11 = 0;
    for (const [id11, nodeData11] of nodeMap11){
        const s11 = typeof sizes11 === "number" ? sizes11 : sizes11[i11];
        const geometry11 = new $h9nKb$three.BoxGeometry(s11, s11, s11);
        geometry11.name = String(id11);
        const nodeMesh11 = new $h9nKb$three.Mesh(geometry11, material11);
        nodeMesh11.position.set(nodeData11.x * bounds11, nodeData11.y * bounds11, nodeData11.z * bounds11);
        group11.add(nodeMesh11);
        i11 += 1;
    }
    return group11;
}
// Draw BoxBased imaging from a graph
/**
 *
 * Draw box based verices given a graph
 *
 * @param Graph - The graph that needs its vertices drawn
 * @param bounds - A global scale for the graph, defaults to one
 * @param color - Default color of the boxes defaults to white
 * @param size - Default size of the nodes defaults to 10
 * @returns
 */ function DrawTHREEBoxBasedVertices(Graph11, bounds11 = 1, color11 = 0xffffff, size11 = 10) {
    const pmap11 = Graph11.get_position_map();
    const Bgroup11 = AddBoxBasedImaging(pmap11, bounds11, color11, size11);
    return Bgroup11;
}
// draw cylinders where required
/**
 *
 * Draw cylinders where all the vertices are based on a node map
 *
 * @param nodeMap - the node map assiciate with the graph that has to be drawn out
 * @param divisonLength - the length of the divisions that are there in each one of the cylinder (this is a circumfurence amount), defaults to 16
 * @param color - the default color of the cylinder, defaults to white
 * @param size - the default size of the cylinder, defaults to 10
 * @returns
 */ function AddCylinderBasedImaging(nodeMap11, divisonLength11 = 16, color11 = 0xffffff, size11 = 10) {
    // precompute all the sizes
    let sizes11;
    if (typeof size11 == "number") sizes11 = Array(nodeMap11.size).fill(size11);
    else sizes11 = size11;
    // returns a group (iterate map entries so any node ID set works)
    const group11 = new $h9nKb$three.Group();
    const material11 = new $h9nKb$three.MeshBasicMaterial({
        color: color11
    });
    let i11 = 0;
    for (const [id11, nodeData11] of nodeMap11){
        const radius11 = typeof sizes11 === "number" ? sizes11 : sizes11[i11];
        const circumfurence11 = 2 * radius11 * Math.PI;
        const segments11 = Math.ceil(circumfurence11 / divisonLength11);
        const geometry11 = new $h9nKb$three.CylinderGeometry(radius11, radius11, 10, segments11);
        geometry11.name = String(id11);
        const nodeMesh11 = new $h9nKb$three.Mesh(geometry11, material11);
        nodeMesh11.position.set(nodeData11.x, nodeData11.y, nodeData11.z);
        group11.add(nodeMesh11);
        i11 += 1;
    }
    return group11;
}
// draw the sparse graph as groups
// this seperates all the points based on some or the other group
/**
 *
 * Split up a graph and return an boject containing a bunch of node groups and edge groups based on some parameterS
 *
 * @param Graph - the graph that you want to split up
 * @param propertyName - the property that you want to split them on
 * @returns - an object that hasa set of node vertices and a set of edge lines based on the splitting factor
 */ function AddInModularityBasedPointGroups(Graph, propertyName) {
    return __awaiter(this, void 0, void 0, function*() {
        // returns an array of groups
        const groups = new Map();
        let ndata;
        let modularity;
        for (let node of Graph.nodes.keys()){
            ndata = Graph.nodes.get(node);
            modularity = eval(`ndata.data.${propertyName}`);
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
/**
 *
 * Draw simplified line edges (thin based) based on some number. This number is a fraction of the total number of edges (so if you specify 0.1 it would draw 10% of the edges)
 *
 * @param Graph - The graph that has to be drawn out
 * @param amount - The fraction of edges to be drawn
 * @param color - color of these edges - defaults to 0.1
 * @returns - a group of simple lines based on all the edges supplied to it
 */ function DrawSimplifiedEdges(Graph11, amount11, color11 = 0xffffff) {
    const lineGroup11 = new $h9nKb$three.Group();
    const material11 = new $h9nKb$three.LineBasicMaterial({
        color: color11
    });
    let start11;
    let end11;
    let points11;
    for (let edge11 of Graph11.edges.values())if (Math.random() <= amount11) {
        start11 = Graph11.nodes.get(edge11.start).data.pos;
        end11 = Graph11.nodes.get(edge11.end).data.pos;
        points11 = [];
        points11.push(new $h9nKb$three.Vector3(start11.x, start11.y, start11.z));
        points11.push(new $h9nKb$three.Vector3(end11.x, end11.y, end11.z));
        const geometry11 = new $h9nKb$three.BufferGeometry().setFromPoints(points11);
        const line11 = new $h9nKb$three.Line(geometry11, material11);
        lineGroup11.add(line11);
    }
    return lineGroup11;
}
/**
 * Set vertex colors by node ID. Uses the geometry's "label" attribute (node ID per vertex) to map node IDs to vertex indices; if "label" is missing, indexArray is treated as vertex indices.
 *
 * @param vertices - THREE.Points with customColor (and optionally label) attribute, or a Group whose first child is that Points object
 * @param indexArray - Node IDs to color, or vertex indices if geometry has no label attribute
 * @param color - Hex color to apply
 */ function ChangeTheVertexColours(vertices11, indexArray11, color11) {
    try {
        const points11 = vertices11 instanceof $h9nKb$three.Group ? vertices11.children[0] : vertices11;
        const geom11 = points11 === null || points11 === void 0 ? void 0 : points11.geometry;
        if (!(geom11 === null || geom11 === void 0 ? void 0 : geom11.attributes)) return;
        const customColor11 = geom11.attributes.customColor;
        const arr11 = customColor11 === null || customColor11 === void 0 ? void 0 : customColor11.array;
        if (!arr11 || arr11.length === 0) return;
        const col11 = new $h9nKb$three.Color(color11);
        const labelAttr11 = geom11.attributes.label;
        const labels11 = labelAttr11 === null || labelAttr11 === void 0 ? void 0 : labelAttr11.array;
        if (labels11 && labels11.length > 0) // Map node IDs to vertex indices via label attribute
        indexArray11.forEach((nodeId11)=>{
            for(let i11 = 0; i11 < labels11.length; i11++)if (labels11[i11] === nodeId11) {
                const k11 = i11 * 3;
                if (k11 + 2 < arr11.length) {
                    arr11[k11] = col11.r;
                    arr11[k11 + 1] = col11.g;
                    arr11[k11 + 2] = col11.b;
                }
                break;
            }
        });
        else // No label: treat indexArray as vertex indices
        indexArray11.forEach((node11)=>{
            const k11 = node11 * 3;
            if (k11 + 2 < arr11.length) {
                arr11[k11] = col11.r;
                arr11[k11 + 1] = col11.g;
                arr11[k11 + 2] = col11.b;
            }
        });
        if (customColor11) customColor11.needsUpdate = true;
    } catch (_a11) {
    // Points object or customColor may be missing; skip coloring
    }
}
/**
 * Reset all vertex colors to white.
 * @param vertices - THREE.Points with customColor attribute, or a Group whose first child is that Points object
 */ function ResetVertexColors(vertices11) {
    var _a11, _b11, _c11;
    try {
        const points11 = vertices11 instanceof $h9nKb$three.Group ? vertices11.children[0] : vertices11;
        const customColor11 = (_b11 = (_a11 = points11 === null || points11 === void 0 ? void 0 : points11.geometry) === null || _a11 === void 0 ? void 0 : _a11.attributes) === null || _b11 === void 0 ? void 0 : _b11.customColor;
        const arr11 = customColor11 === null || customColor11 === void 0 ? void 0 : customColor11.array;
        if (!arr11 || arr11.length === 0) return;
        const count11 = (_c11 = customColor11 === null || customColor11 === void 0 ? void 0 : customColor11.count) !== null && _c11 !== void 0 ? _c11 : Math.floor(arr11.length / 3);
        for(let i11 = 0; i11 < count11; i11++){
            const k11 = i11 * 3;
            arr11[k11] = 1;
            arr11[k11 + 1] = 1;
            arr11[k11 + 2] = 1;
        }
        if (customColor11) customColor11.needsUpdate = true;
    } catch (_d11) {
    // skip if wrong object or missing attribute
    }
}
var $a81f7bf7ba151678$export$2e2bcd8739ae039 = {
    DrawTHREEGraphVertices: DrawTHREEGraphVertices,
    DrawTHREEGraphEdgesThick: DrawTHREEGraphEdgesThick,
    DrawTHREEGraphEdgesThin: DrawTHREEGraphEdgesThin,
    DrawThickPathFromNodeIds: DrawThickPathFromNodeIds,
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
parcelRequire.register("2vhjw", function(module, exports) {

$parcel$export(module.exports, "createThickEdgesGroup", () => $1d2be82fc40a9241$export$7b0c62ef08ca9c15);
/**
 * Internal thick-line drawing: billboarded mesh-line (ribbon with screen-space width).
 * No dependency on Three.js examples; geometry and material are maintained in-house.
 * Based on the MeshLine approach (see e.g. threejs-meshline / THREE.MeshLine).
 */ 

var $436k9 = parcelRequire("436k9");

var $fXX8p = parcelRequire("fXX8p");
/** Default line width in pixels (screen space) */ const $1d2be82fc40a9241$var$DEFAULT_LINE_WIDTH_PX = 2;
/** Default resolution for material (canvas size); can be updated on resize */ const $1d2be82fc40a9241$var$DEFAULT_RESOLUTION = new $h9nKb$three.Vector2(800, 700);
function $1d2be82fc40a9241$export$20bd75665e2e29b9(line, bounds, color, lineWidthPx = $1d2be82fc40a9241$var$DEFAULT_LINE_WIDTH_PX, resolution) {
    if (line.points.length < 2) {
        const geo = new $h9nKb$three.BufferGeometry();
        return new $h9nKb$three.Mesh(geo, new $h9nKb$three.MeshBasicMaterial({
            color: color
        }));
    }
    const positions = line.points.map((p)=>new $h9nKb$three.Vector3(p.x * bounds, p.y * bounds, p.z * bounds));
    const geometry = (0, $436k9.buildMeshLineGeometry)(positions);
    const material = (0, $fXX8p.createMeshLineMaterial)({
        color: color,
        lineWidth: lineWidthPx,
        resolution: resolution !== null && resolution !== void 0 ? resolution : $1d2be82fc40a9241$var$DEFAULT_RESOLUTION
    });
    return new $h9nKb$three.Mesh(geometry, material);
}
/**
 * Create a group of thick line meshes from an edge map.
 * Lines are billboarded and drawn with the given pixel width.
 *
 * @param edgeMap - Map of edge id to Line
 * @param bounds - Scale factor for coordinates
 * @param color - Hex color for all lines
 * @param lineWidthPx - Line width in pixels (screen space); default 2
 * @param resolution - Canvas size (optional, for correct pixel scaling)
 * @returns THREE.Group containing one mesh per edge
 */ /**
 * Convert legacy thickness (world-unit style 0.02, 0.03) to pixel width for screen-space lines.
 */ function $1d2be82fc40a9241$var$toPixelWidth(thickness) {
    if (thickness >= 1) return Math.max(1, Math.round(thickness));
    return Math.max(1, Math.round(thickness * 100));
}
function $1d2be82fc40a9241$export$7b0c62ef08ca9c15(edgeMap, bounds, color, thickness = $1d2be82fc40a9241$var$DEFAULT_LINE_WIDTH_PX, resolution) {
    const lineWidthPx = $1d2be82fc40a9241$var$toPixelWidth(thickness);
    const group = new $h9nKb$three.Group();
    for (const line of edgeMap.values()){
        if (!(line === null || line === void 0 ? void 0 : line.points) || line.points.length < 2) continue;
        group.add($1d2be82fc40a9241$export$20bd75665e2e29b9(line, bounds, color, lineWidthPx, resolution));
    }
    return group;
}

});
parcelRequire.register("436k9", function(module, exports) {

$parcel$export(module.exports, "buildMeshLineGeometry", () => $2f2c59116e45c6bb$export$55668220777ec285);
/**
 * Ribbon geometry for billboarded thick lines (MeshLine-style).
 * Each line point becomes two vertices (left/right edge); the material
 * expands them in screen space so the line has visible thickness.
 */ 
function $2f2c59116e45c6bb$export$55668220777ec285(positions) {
    const n = positions.length;
    if (n < 2) return new $h9nKb$three.BufferGeometry();
    const posArr = [];
    const prevArr = [];
    const nextArr = [];
    const sideArr = [];
    for(let i = 0; i < n; i++){
        const p = positions[i];
        const pPrev = i > 0 ? positions[i - 1] : p;
        const pNext = i < n - 1 ? positions[i + 1] : p;
        // Left edge vertex
        posArr.push(p.x, p.y, p.z);
        prevArr.push(pPrev.x, pPrev.y, pPrev.z);
        nextArr.push(pNext.x, pNext.y, pNext.z);
        sideArr.push(-1);
        // Right edge vertex
        posArr.push(p.x, p.y, p.z);
        prevArr.push(pPrev.x, pPrev.y, pPrev.z);
        nextArr.push(pNext.x, pNext.y, pNext.z);
        sideArr.push(1);
    }
    const geometry = new $h9nKb$three.BufferGeometry();
    geometry.setAttribute("position", new $h9nKb$three.Float32BufferAttribute(posArr, 3));
    geometry.setAttribute("positionPrev", new $h9nKb$three.Float32BufferAttribute(prevArr, 3));
    geometry.setAttribute("positionNext", new $h9nKb$three.Float32BufferAttribute(nextArr, 3));
    geometry.setAttribute("side", new $h9nKb$three.Float32BufferAttribute(sideArr, 1));
    // Triangle list: each quad (segment) = two triangles (0,1,2) and (2,1,3)
    const indices = [];
    for(let i = 0; i < n - 1; i++){
        const a = i * 2;
        indices.push(a, a + 1, a + 2, a + 2, a + 1, a + 3);
    }
    geometry.setIndex(indices);
    geometry.computeBoundingSphere();
    return geometry;
}

});

parcelRequire.register("fXX8p", function(module, exports) {

$parcel$export(module.exports, "createMeshLineMaterial", () => $b9fa3ca18b98d59b$export$b6150c01f92eba96);
/**
 * Billboarded thick-line material (screen-space width).
 * Adapted from the MeshLine approach: vertex shader expands the ribbon
 * in clip space so lines have consistent pixel width and always face the camera.
 */ 
const $b9fa3ca18b98d59b$var$MESHLINE_VERTEX = `
attribute vec3 positionPrev;
attribute vec3 positionNext;
attribute float side;

uniform vec2 resolution;
uniform float lineWidth;

void main() {
  vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vec4 clipPrev = projectionMatrix * modelViewMatrix * vec4(positionPrev, 1.0);
  vec4 clipNext = projectionMatrix * modelViewMatrix * vec4(positionNext, 1.0);

  vec2 ndcCurr = clipPos.xy / clipPos.w;
  vec2 ndcPrev = clipPrev.xy / clipPrev.w;
  vec2 ndcNext = clipNext.xy / clipNext.w;

  vec2 dir = normalize(ndcNext - ndcPrev);
  vec2 perp = vec2(-dir.y, dir.x);

  float w = clipPos.w;
  float pixelScale = min(resolution.x, resolution.y);
  float ndcPerPixel = 2.0 / pixelScale;
  vec2 offsetNdc = perp * side * (lineWidth * 0.5 * ndcPerPixel);
  clipPos.xy += offsetNdc * w;

  gl_Position = clipPos;
}
`;
const $b9fa3ca18b98d59b$var$MESHLINE_FRAGMENT = `
uniform vec3 color;

void main() {
  gl_FragColor = vec4(color, 1.0);
}
`;
function $b9fa3ca18b98d59b$export$b6150c01f92eba96(options = {}) {
    var _a, _b, _c;
    const color = (_a = options.color) !== null && _a !== void 0 ? _a : 0xffffff;
    const lineWidth = (_b = options.lineWidth) !== null && _b !== void 0 ? _b : 2;
    const resolution = (_c = options.resolution) !== null && _c !== void 0 ? _c : new $h9nKb$three.Vector2(800, 700);
    const threeColor = new $h9nKb$three.Color(color);
    return new $h9nKb$three.ShaderMaterial({
        uniforms: {
            resolution: {
                value: resolution
            },
            lineWidth: {
                value: lineWidth
            },
            color: {
                value: new $h9nKb$three.Vector3(threeColor.r, threeColor.g, threeColor.b)
            }
        },
        vertexShader: $b9fa3ca18b98d59b$var$MESHLINE_VERTEX,
        fragmentShader: $b9fa3ca18b98d59b$var$MESHLINE_FRAGMENT,
        transparent: false,
        depthTest: true,
        side: $h9nKb$three.DoubleSide
    });
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



$parcel$export(module.exports, "Graph", () => (parcelRequire("9TL8g")).default);
$parcel$export(module.exports, "GraphMethods", () => (parcelRequire("cWcXJ")).default);
$parcel$export(module.exports, "SampleData", () => $c57cf0c4853fb804$exports.default);
$parcel$export(module.exports, "Constructors", () => $942e91a547b4130c$exports.default);
$parcel$export(module.exports, "Drawing", () => (parcelRequire("jYcHE")).default);
$parcel$export(module.exports, "Geometry", () => (parcelRequire("fd3jp")).default);
$parcel$export(module.exports, "Utilities", () => (parcelRequire("6Xdhg")).default);
$parcel$export(module.exports, "ThreeWrapper", () => (parcelRequire("eqUI8")).default);
$parcel$export(module.exports, "GraphDrawer", () => $6abda68f7f78a6fb$exports.default);
$parcel$export(module.exports, "Models", () => $7308258d93363088$exports.default);
$parcel$export(module.exports, "Hierarchy", () => $e31e6eca1eba1baf$exports.default);

var $9TL8g = parcelRequire("9TL8g");


var $9TL8g = parcelRequire("9TL8g");

var $cWcXJ = parcelRequire("cWcXJ");


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
/**
 * Node class: each node has an ID (index) and arbitrary data.
 * The data typically includes "pos" (Point) for visualization.
 */ class $d0af3be0040778ae$var$_Node {
    /**
     *
     * @param data - Data associated with the node; include "pos" (Point) for graph visuals
     */ constructor(data){
        // this data is an arbitrary thing with which I can create any object
        this.data = Object.assign({}, data);
        // the neighbours bit is explicity set from the code outside
        this.neighbours = [];
    }
}
var $d0af3be0040778ae$export$2e2bcd8739ae039 = $d0af3be0040778ae$var$_Node;



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
/**
 * construct a graph based on an edge list and node list
 * @param nodes nodes as a list
 * @param edges edges as a list
 * @returns A graph that was construct from the list of nodes and edges
 */ function $942e91a547b4130c$var$ConstructGraphNodeEdgesList(nodes, edges) {
    return $942e91a547b4130c$var$__awaiter(this, void 0, void 0, function*() {
        // make a node OBJ
        const nodeOBJ = new Map();
        for(let i = 0; i < nodes.length; i++){
            const n = new (0, $d0af3be0040778ae$export$2e2bcd8739ae039)(nodes[i].data);
            nodeOBJ.set(nodes[i], n);
        }
        // make an edge object
        const edgeOBJ = new Map();
        for(let i = 0; i < edges.length; i++){
            const e = new (0, $i8obY.default)(edges[i][0], edges[i][1], edges[i].data);
            edgeOBJ.set(i, e);
        }
        // make a graph object
        const G = yield (0, $9TL8g.default).create(nodeOBJ, edgeOBJ);
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
/**
 *
 * @returns the raw ZKC dataset
 */ function $c57cf0c4853fb804$var$LoadZKC() {
    return $c57cf0c4853fb804$var$__awaiter(this, void 0, void 0, function*() {
        // load up the dataset representation
        const data = (0, $a79fcfb00e2fad28$export$b6cdfb6bd6195507);
        const G = yield (0, $942e91a547b4130c$exports.default).ConstructGraphNodeEdgesList(data.nodes, data.edges);
        return G;
    });
}
/**
 *
 * @returns the ZKC dataset with the positons simulated before hand
 */ function $c57cf0c4853fb804$var$LoadZKCSimulated() {
    return $c57cf0c4853fb804$var$__awaiter(this, void 0, void 0, function*() {
        // make a map
        const data = (0, $16cc01d9c2706f25$export$aa88f89bcd11f8a9);
        const nodes = new Map();
        const edges = new Map();
        // set the node map
        data.nodes.forEach((node)=>{
            const id = node.id;
            const pos = new (0, $fw40F.default)(node.px * 50, 0, node.py * 50);
            const modularity = node.member;
            const n = new (0, $d0af3be0040778ae$export$2e2bcd8739ae039)({
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
            const e = new (0, $i8obY.default)(start, end, {});
            edges.set(i, e);
        }
        // make a graph object
        const G = yield (0, $9TL8g.default).create(nodes, edges);
        const lmap = (0, $jYcHE.default).DrawEdgeLines(G, 20);
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
/**
 * This is the main graph drawer class
 */ class $6abda68f7f78a6fb$var$GraphDrawer3d {
    /**
     * To initialize the graph drawer there are a set of graph drawing settings that have to be set.
     * Here are the details to do the same:
     * canvas - the html canvas element that you would like to render
     * height - the the height of the initialized canvas
     * width - the width of the initialized canvas
     * geometry map - a map that keeps track of all the geometry in the scene (Optional)
     * material map - a mapt that keeps track of all the materials in the scene (Optional)
     * controls - Controls that define how one can navigate this 3d space (Self initialized)
     * renderer - Renderer element form the three JS library
     * camera -  A perspective camera from the threeJS library
     * scene - The three JS scene that gets define automatically
     *
     * @param GraphDrawerOptions3d - These above options are construdeted into a single object and passed into the Options elem
     */ constructor(GraphDrawerOptions3d){
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
        // graph map is the hash map that holds all the
        // graphs that we are working with together
        this.graphs = new Map();
    }
    /**
     * This essentially initializes the drawing element based on the settings
     * Remember to do this since if if its not done the scene will not render
     */ init() {
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
            this.controls.maxDistance = 10000;
            this.controls.minDistance = 10;
            this.controls.update();
            // finally print out that the initialization has finished
            const t2 = performance.now();
            console.log("initialization has finished");
            console.log(`Time to initialize ${t2 - t1} milliseconds`);
        });
    }
    //add graph
    // this adds a graph to the current visualizer
    /**
     *
     * This is the main way to add elements to the viewer window that gets initialized
     *
     * @param element A geomerty element + material element to add to the scene as a group line or point cloud
     */ addVisElement(element) {
        this.scene.add(element);
    }
    // this stuff renders out one specific instances
    /**
     * This is the render call that is called every frame to update the rendering of the canvas
     * Remember to do this since this is a common are for bugs to occur
     */ rendercall() {
        // this is the render draw call
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
    }
}
var $6abda68f7f78a6fb$export$2e2bcd8739ae039 = {
    GraphDrawer3d: $6abda68f7f78a6fb$var$GraphDrawer3d
};


var $7308258d93363088$exports = {};

$parcel$export($7308258d93363088$exports, "default", () => $7308258d93363088$export$2e2bcd8739ae039);
// This essentially generates a erdos reyni graph
// Super useful for juszt getting a random graph and studying
// graph structure. Read more https://en.wikipedia.org/wiki/Erd%C5%91s%E2%80%93R%C3%A9nyi_model

var $i8obY = parcelRequire("i8obY");

var $9TL8g = parcelRequire("9TL8g");

var $7308258d93363088$var$__awaiter = undefined && undefined.__awaiter || function(thisArg, _arguments, P, generator) {
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
/**
 * The G ( n , p ) G(n,p) model, a graph is constructed by connecting labeled nodes randomly. Each edge is included in the graph with probability p p, independently from every other edge.
 * https://en.wikipedia.org/wiki/Erd%C5%91s%E2%80%93R%C3%A9nyi_model
 * @param n Number of nodes
 * @param p Probability of two edges to eb connected
 * @returns A Erdos Reyni graph
 */ function $7308258d93363088$var$GenerateErdosReyni_n_p(n, p) {
    return $7308258d93363088$var$__awaiter(this, void 0, void 0, function*() {
        // first create a list of nodes
        const nodes = new Map();
        const edges = new Map();
        let node; // define once use many times basically
        for(let i = 0; i < n; i++){
            node = new (0, $d0af3be0040778ae$export$2e2bcd8739ae039)({});
            // set this node
            nodes.set(i, node);
        }
        // now that all the nodes have been created
        // now loop all the node combinations and then
        // create the edge
        let interimP;
        let edge;
        let index = 0;
        for(let i = 0; i < n; i++){
            for(let ii = 0; ii < n; ii++)// im skipping self loops so just make sure there is
            // an if statement for the settings
            if (i != ii) {
                interimP = Math.random();
                if (p > interimP) {
                    // then create and edge and add that edge to the list of edges
                    edge = new (0, $i8obY.default)(i, ii, {});
                    edges.set(index, edge);
                    index += 1;
                }
            }
        }
        // now create the actual graph
        const G = new (0, $9TL8g.default)(nodes, edges);
        // lastly return the graph
        return G;
    });
}
var $7308258d93363088$export$2e2bcd8739ae039 = {
    GenerateErdosReyni_n_p: $7308258d93363088$var$GenerateErdosReyni_n_p
};




var $e31e6eca1eba1baf$exports = {};

$parcel$export($e31e6eca1eba1baf$exports, "default", () => $e31e6eca1eba1baf$export$2e2bcd8739ae039);
$parcel$export($e31e6eca1eba1baf$exports, "createKDDistanceStrategy", () => $6fb2afd4b7f1d7b7$export$6f3ad585c6c6bfb5, (v) => $6fb2afd4b7f1d7b7$export$6f3ad585c6c6bfb5 = v);
$parcel$export($e31e6eca1eba1baf$exports, "buildSimplifiedGraph", () => $d0b36de3485b8eec$exports.buildSimplifiedGraph, (v) => $d0b36de3485b8eec$exports.buildSimplifiedGraph = v);
/**
 * Hierarchical node combining: cluster nodes (e.g. by distance) and build a simplified graph.
 * Inspired by FlowmapBlue-style location clustering; uses KD-tree distance-based grouping by default.
 */ /**
 * KD-tree distance-based cluster strategy.
 * Nodes within the given distance threshold are merged into the same cluster.
 */ 
var $fd3jp = parcelRequire("fd3jp");
/**
 * Minimal 3D KD-tree for range queries (points within distance).
 * Used by the distance-based cluster strategy.
 */ function $a8b1a05002a80b84$var$sqDist(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return dx * dx + dy * dy + dz * dz;
}
function $a8b1a05002a80b84$var$selectAxis(depth) {
    const axes = [
        "x",
        "y",
        "z"
    ];
    return axes[depth % 3];
}
/**
 * Build a KD-tree from points with node IDs.
 * Returns a tree structure used for range queries.
 */ function $a8b1a05002a80b84$var$buildKDT(items, depth) {
    if (items.length === 0) return null;
    if (items.length === 1) return {
        item: items[0]
    };
    const axis = $a8b1a05002a80b84$var$selectAxis(depth);
    const sorted = [
        ...items
    ].sort((a, b)=>a.point[axis] - b.point[axis]);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted[mid];
    const left = mid > 0 ? $a8b1a05002a80b84$var$buildKDT(sorted.slice(0, mid), depth + 1) : null;
    const right = mid + 1 < sorted.length ? $a8b1a05002a80b84$var$buildKDT(sorted.slice(mid + 1), depth + 1) : null;
    return {
        left: left !== null && left !== void 0 ? left : undefined,
        right: right !== null && right !== void 0 ? right : undefined,
        item: median
    };
}
/**
 * Query all points within squared distance dSq of the given point.
 * Returns array of node IDs.
 */ function $a8b1a05002a80b84$var$rangeQuery(node, center, dSq, depth, out) {
    if (node === null) return;
    const axis = $a8b1a05002a80b84$var$selectAxis(depth);
    const dist = $a8b1a05002a80b84$var$sqDist(center, node.item.point);
    if (dist <= dSq) out.push(node.item.nodeId);
    const planeDist = center[axis] - node.item.point[axis];
    const planeDistSq = planeDist * planeDist;
    if (planeDist <= 0) {
        if (node.left) $a8b1a05002a80b84$var$rangeQuery(node.left, center, dSq, depth + 1, out);
        if (node.right && planeDistSq <= dSq) $a8b1a05002a80b84$var$rangeQuery(node.right, center, dSq, depth + 1, out);
    } else {
        if (node.right) $a8b1a05002a80b84$var$rangeQuery(node.right, center, dSq, depth + 1, out);
        if (node.left && planeDistSq <= dSq) $a8b1a05002a80b84$var$rangeQuery(node.left, center, dSq, depth + 1, out);
    }
}
function $a8b1a05002a80b84$export$c3701a8b10dd9c83(items, radius) {
    const tree = $a8b1a05002a80b84$var$buildKDT(items, 0);
    const radiusSq = radius * radius;
    const result = new Map();
    for (const { point: point, nodeId: nodeId } of items){
        const out = [];
        if (tree) $a8b1a05002a80b84$var$rangeQuery(tree, point, radiusSq, 0, out);
        result.set(nodeId, out);
    }
    return result;
}


class $6fb2afd4b7f1d7b7$var$UnionFind {
    constructor(){
        this.parent = new Map();
    }
    find(x) {
        if (!this.parent.has(x)) this.parent.set(x, x);
        if (this.parent.get(x) !== x) this.parent.set(x, this.find(this.parent.get(x)));
        return this.parent.get(x);
    }
    union(x, y) {
        const px = this.find(x);
        const py = this.find(y);
        if (px !== py) this.parent.set(px, py);
    }
}
function $6fb2afd4b7f1d7b7$export$6f3ad585c6c6bfb5() {
    return {
        cluster (graph, options) {
            const { distanceThreshold: distanceThreshold } = options;
            const pmap = graph.get_position_map();
            const items = [];
            for (const [nodeId, point] of pmap)items.push({
                point: point,
                nodeId: nodeId
            });
            if (items.length === 0) return {
                nodeToCluster: new Map(),
                clusterCentroids: new Map(),
                clusterIds: []
            };
            const withinRadius = (0, $a8b1a05002a80b84$export$c3701a8b10dd9c83)(items, distanceThreshold);
            const uf = new $6fb2afd4b7f1d7b7$var$UnionFind();
            for (const [nodeId, neighbors] of withinRadius)for (const other of neighbors)uf.union(nodeId, other);
            const rootToClusterId = new Map();
            let nextId = 0;
            const nodeToCluster = new Map();
            const clusterToNodes = new Map();
            for (const { nodeId: nodeId } of items){
                const root = uf.find(nodeId);
                if (!rootToClusterId.has(root)) rootToClusterId.set(root, nextId++);
                const cid = rootToClusterId.get(root);
                nodeToCluster.set(nodeId, cid);
                if (!clusterToNodes.has(cid)) clusterToNodes.set(cid, []);
                clusterToNodes.get(cid).push(nodeId);
            }
            const clusterCentroids = new Map();
            for (const [cid, nids] of clusterToNodes){
                const points = nids.map((id)=>pmap.get(id));
                clusterCentroids.set(cid, (0, $fd3jp.default).centroid(points));
            }
            const clusterIds = [
                ...clusterToNodes.keys()
            ];
            return {
                nodeToCluster: nodeToCluster,
                clusterCentroids: clusterCentroids,
                clusterIds: clusterIds
            };
        }
    };
}


var $d0b36de3485b8eec$exports = {};

$parcel$export($d0b36de3485b8eec$exports, "buildSimplifiedGraph", () => $d0b36de3485b8eec$export$38cdc4a9373e213);
/**
 * Build a simplified Graph from a clustering result and the original graph.
 * Super-nodes are placed at cluster centroids; edges between clusters are aggregated.
 */ 
var $9TL8g = parcelRequire("9TL8g");


var $i8obY = parcelRequire("i8obY");
var $d0b36de3485b8eec$var$__awaiter = undefined && undefined.__awaiter || function(thisArg, _arguments, P, generator) {
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
function $d0b36de3485b8eec$export$38cdc4a9373e213(originalGraph, clusterResult) {
    var _a;
    return $d0b36de3485b8eec$var$__awaiter(this, void 0, void 0, function*() {
        const { nodeToCluster: nodeToCluster, clusterCentroids: clusterCentroids, clusterIds: clusterIds } = clusterResult;
        const nodes = new Map();
        const edges = new Map();
        for (const cid of clusterIds){
            const pos = clusterCentroids.get(cid);
            const n = new (0, $d0af3be0040778ae$export$2e2bcd8739ae039)({
                pos: pos
            });
            nodes.set(cid, n);
        }
        const edgeCount = new Map();
        const key = (a, b)=>a <= b ? `${a},${b}` : `${b},${a}`;
        for (const [, edge] of originalGraph.edges){
            const ca = nodeToCluster.get(edge.start);
            const cb = nodeToCluster.get(edge.end);
            if (ca === undefined || cb === undefined) continue;
            if (ca === cb) continue;
            const k = key(ca, cb);
            edgeCount.set(k, ((_a = edgeCount.get(k)) !== null && _a !== void 0 ? _a : 0) + 1);
        }
        let eid = 0;
        for (const [k, count] of edgeCount){
            const [a, b] = k.split(",").map(Number);
            edges.set(eid++, new (0, $i8obY.default)(a, b, {
                count: count
            }));
        }
        const simplified = new (0, $9TL8g.default)(nodes, edges);
        yield simplified.initialize();
        return simplified;
    });
}


var $e31e6eca1eba1baf$var$__awaiter = undefined && undefined.__awaiter || function(thisArg, _arguments, P, generator) {
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
/**
 * Cluster the graph by distance (KD-tree based) and return a simplified graph.
 * Nodes within `distanceThreshold` are merged; super-nodes are placed at cluster centroids.
 *
 * @param graph - The graph to cluster
 * @param options - { distanceThreshold: number }
 * @returns A new graph with one node per cluster and aggregated edges between clusters
 */ function $e31e6eca1eba1baf$var$clusterByDistance(graph, options) {
    return $e31e6eca1eba1baf$var$__awaiter(this, void 0, void 0, function*() {
        const strategy = (0, $6fb2afd4b7f1d7b7$export$6f3ad585c6c6bfb5)();
        const result = strategy.cluster(graph, options);
        return (0, $d0b36de3485b8eec$exports.buildSimplifiedGraph)(graph, result);
    });
}
/**
 * Cluster the graph using a custom strategy and return a simplified graph.
 *
 * @param graph - The graph to cluster
 * @param strategy - A ClusterStrategy implementation
 * @param options - Strategy-specific options
 * @returns A new graph with one node per cluster and aggregated edges
 */ function $e31e6eca1eba1baf$var$clusterByStrategy(graph, strategy, options) {
    return $e31e6eca1eba1baf$var$__awaiter(this, void 0, void 0, function*() {
        const result = strategy.cluster(graph, options);
        return (0, $d0b36de3485b8eec$exports.buildSimplifiedGraph)(graph, result);
    });
}
var $e31e6eca1eba1baf$export$2e2bcd8739ae039 = {
    clusterByDistance: $e31e6eca1eba1baf$var$clusterByDistance,
    clusterByStrategy: $e31e6eca1eba1baf$var$clusterByStrategy
};




//# sourceMappingURL=pgl.js.map
