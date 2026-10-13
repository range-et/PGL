import * as m from "three";
import { Controls as Kt, Vector3 as U, MOUSE as tt, TOUCH as Q, Quaternion as mt, Spherical as gt, Vector2 as F, Ray as Zt, Plane as Xt, MathUtils as Wt } from "three";
import * as qt from "gl-matrix";
class V {
  /**
   * Construct an edge
   *
   * @param start Start index of the edge based on the array of nodes
   * @param end End index of the edge based on the array of nodes
   * @param data - Optional data; "ldata" is reserved for line geometry used when drawing the edge
   */
  constructor(t, e, s = {}) {
    this.start = t, this.end = e, this.data = { ...s };
  }
}
class Y {
  /**
   * Construct a graph object (no initializing)
   *
   * @param nodes - Map of all the nodes associated with the graph
   * @param edges - Map of all the edges associated with the graph
   */
  constructor(t, e) {
    this.nodes = t, this.edges = e;
    let s = -1;
    for (const o of e.keys()) o > s && (s = o);
    this._nextEdgeId = s + 1;
  }
  // test function
  /**
   * Prints out a snapshot of data associated with this graph like how many nodes and how many edges
   */
  printData() {
    const t = "This is a graph with " + this.nodes.size + " nodes and " + this.edges.size + " edges";
    console.log(t);
  }
  /**
   * Initializes the graph and constructs the node adjacency list.
   * Async to avoid blocking the main thread on large graphs.
   */
  async initialize() {
    await this.constructAdjacencyList();
  }
  /**
   * Official create method to make a graph based on a set of nodes and edges.
   * Auto-initializes the graph and sets all adjacency lists in memory.
   *
   * @param nodes - map of nodes
   * @param edges - map of edges
   * @returns initialized graph
   */
  static async create(t, e) {
    const s = new Y(t, e);
    return await s.initialize(), s;
  }
  /**
   * Constructs the adjacency list representation for the graph.
   * Async to allow yielding on large graphs and avoid hanging the browser.
   */
  async constructAdjacencyList() {
    this.edges.forEach((t) => {
      const e = t.start, s = t.end;
      this.nodes.get(e) && this.nodes.get(e).neighbours.push(s), this.nodes.get(s) && this.nodes.get(s).neighbours.push(e);
    }), await Promise.resolve();
    for (const t of this.nodes.keys()) {
      const e = this.nodes.get(t).neighbours, s = [...new Set(e)], o = s.indexOf(t);
      o > -1 && s.splice(o, 1), this.nodes.get(t).neighbours = s;
    }
  }
  // add a node
  /**
   * Add a node to the graph.
   * @param nodeID - The node ID
   * @param data - Data associated with the node
   */
  add_node(t, e) {
    this.nodes.set(t, e);
  }
  // add an edge
  /**
   * Add an edge to the graph
   * @param start - Starting index of the edge
   * @param end - The end index of the edge
   * @param data - data associated with the edge
   */
  add_edge(t, e, s = {}) {
    const o = new V(t, e, s), i = this._nextEdgeId++;
    this.edges.set(i, o);
    const r = this.nodes.get(t), a = this.nodes.get(e);
    r && r.neighbours.push(e), a && a.neighbours.push(t);
  }
  /**
   * Remove an edge by ID. Updates adjacency lists.
   * Call {@link constructAdjacencyList} after bulk removals if you need a clean adjacency state.
   *
   * @param edgeId - The edge ID (from add_edge or edges Map key)
   * @returns true if the edge existed and was removed, false otherwise
   */
  remove_edge(t) {
    const e = this.edges.get(t);
    if (!e) return !1;
    const { start: s, end: o } = e, i = this.nodes.get(s), r = this.nodes.get(o);
    if (i) {
      const a = i.neighbours.indexOf(o);
      a > -1 && i.neighbours.splice(a, 1);
    }
    if (r) {
      const a = r.neighbours.indexOf(s);
      a > -1 && r.neighbours.splice(a, 1);
    }
    return this.edges.delete(t), !0;
  }
  /**
   * Remove a node by ID and all edges incident to it. Updates adjacency lists
   * for remaining nodes.
   *
   * @param nodeId - The node ID to remove
   * @returns true if the node existed and was removed, false otherwise
   */
  remove_node(t) {
    if (!this.nodes.has(t)) return !1;
    const e = [];
    for (const [s, o] of this.edges.entries())
      (o.start === t || o.end === t) && e.push(s);
    for (const s of e)
      this.remove_edge(s);
    return this.nodes.delete(t), !0;
  }
  // get an adjacency list representation of the graph
  // this only has the indices and not the actual data
  // associated with the node to speed things up
  /**
   *
   * @returns The adjacency lists associated with the graph
   */
  get_adjacency() {
    const t = /* @__PURE__ */ new Map();
    for (const e of this.nodes.keys())
      t.set(e, this.nodes.get(e).neighbours);
    return t;
  }
  // set position based on an array of positions
  // this could be anything (we use kamada kawai )
  /**
   * Apply a position map based on some data
   * @param data - the position map that has to be applied to the graph
   */
  apply_position_map(t) {
    for (let e of t.keys())
      this.nodes.get(e).data = {
        ...this.nodes.get(e).data,
        pos: t.get(e)
      };
  }
  // create new edge pos representation
  // same approach for applying the key data
  /**
   * Apply an line map to a graph
   * @param data Line data that has to be applied to the graph
   */
  apply_edge_pos_maps(t) {
    for (let e of t.keys())
      this.edges.get(e).data = {
        ...this.edges.get(e).data,
        ldata: t.get(e)
      };
  }
  // get the edge reps
  // this returns all the edge map readings
  /**
   * get the current edge map
   * @returns The current set of edges associated with the graph
   */
  get_edge_map() {
    const t = /* @__PURE__ */ new Map();
    for (const e of this.edges.keys()) {
      const s = this.edges.get(e).data.ldata;
      s != null && t.set(e, s);
    }
    return t;
  }
  // graph apply pos and edge map
  /**
   * Applies all the maps to the graph
   * @param layout - Applies an object of maps associated with a graph: {pmap:(the position map), emap:(the edge map)}
   */
  apply_drawing_maps(t) {
    t.pmap && this.apply_position_map(t.pmap), t.emap && this.apply_edge_pos_maps(t.emap);
  }
  // get the position map of the graph
  /**
   * Gets the position map and the edge map respectively
   * @returns The position map and the edge map as pmap and emap
   */
  get_map() {
    return {
      pmap: this.get_position_map(),
      emap: this.get_edge_map()
    };
  }
  /**
   * Get the position of the nodes in the graph.
   * Nodes without a defined `data.pos` are skipped.
   *
   * @returns The position map (node ID to PointLike)
   */
  get_position_map() {
    var e, s;
    const t = /* @__PURE__ */ new Map();
    for (const o of this.nodes.keys()) {
      const i = (s = (e = this.nodes.get(o)) == null ? void 0 : e.data) == null ? void 0 : s.pos;
      i != null && t.set(o, i);
    }
    return t;
  }
  /**
   * Returns a deterministic order of node IDs (same as iteration order of nodes).
   * Use this order for adjacency matrix rows/columns, simulation buffers, and drawer indices.
   * @returns Array of node IDs in stable order
   */
  get_node_ids_order() {
    return Array.from(this.nodes.keys());
  }
  /**
   * Returns the adjacency matrix and the node ID order. Dense form is for small/medium graphs;
   * for very large graphs use get_adjacency() (sparse) instead.
   * @returns { matrix: Float32Array (row-major n×n), nodeIds: number[] }
   */
  get_adjacency_matrix() {
    const t = this.get_node_ids_order(), e = t.length, s = new Float32Array(e * e), o = this.get_adjacency(), i = /* @__PURE__ */ new Map();
    t.forEach((r, a) => i.set(r, a));
    for (let r = 0; r < e; r++) {
      const a = t[r], c = o.get(a) ?? [];
      for (const l of c) {
        const h = i.get(l);
        h !== void 0 && (s[r * e + h] = 1);
      }
    }
    return { matrix: s, nodeIds: t };
  }
}
class W {
  /**
   * @param data - Data associated with the node; include "pos" (Point) for graph visuals
   */
  constructor(t = {}) {
    this.data = { ...t }, this.neighbours = [];
  }
}
async function Pt(n, t) {
  const e = n.get_adjacency(), s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set([t]), i = [t];
  for (s.set(t, -1); i.length > 0; ) {
    const r = i.shift(), a = e.get(r);
    for (let c = 0; c < a.length; c++) {
      const l = a[c];
      o.has(l) || (o.add(l), i.push(l), s.set(l, r));
    }
  }
  return s;
}
async function rt(n, t) {
  const e = n.get_adjacency(), s = /* @__PURE__ */ new Map(), o = await Pt(n, t);
  for (const i of e.keys()) {
    if (!o.has(i)) continue;
    let r = 0, a = o.get(i);
    for (; a !== void 0 && a !== -1; )
      a = o.get(a), r += 1;
    s.set(i, r);
  }
  return s;
}
async function $t(n) {
  const t = [...n.nodes.keys()];
  if (t.length === 0) return { start: 0, end: 0, distance: 0 };
  if (t.length === 1) return { start: t[0], end: t[0], distance: 0 };
  const e = n.get_adjacency(), s = t.filter((l) => {
    var h;
    return (((h = e.get(l)) == null ? void 0 : h.length) ?? 0) > 0;
  }), o = s.length > 0 ? s : t;
  let i = o[Math.floor(Math.random() * o.length)], r = await rt(n, i), a = -1;
  for (const l of r.keys()) {
    const h = r.get(l);
    h > a && (i = l, a = h);
  }
  const c = i;
  r = await rt(n, i), a = -1;
  for (const l of r.keys()) {
    const h = r.get(l);
    h > a && (i = l, a = h);
  }
  return { start: c, end: i, distance: a };
}
async function Qt(n, t) {
  const e = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  for (const r of t) {
    const a = n.nodes.get(r);
    a && e.set(r, new W(a.data));
  }
  let o = 0;
  for (const r of n.edges.values())
    e.has(r.start) && e.has(r.end) && (s.set(o, new V(r.start, r.end, r.data)), o += 1);
  return await Y.create(e, s);
}
const lt = { GraphDiameter: $t, Dijkstra: rt, BFSSearch: Pt, SelectSubgraph: Qt }, Jt = {
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
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [0, 7],
    [0, 8],
    [0, 10],
    [0, 11],
    [0, 12],
    [0, 13],
    [0, 17],
    [0, 19],
    [0, 21],
    [0, 31],
    [1, 2],
    [1, 3],
    [1, 7],
    [1, 13],
    [1, 17],
    [1, 19],
    [1, 21],
    [1, 30],
    [2, 3],
    [2, 7],
    [2, 8],
    [2, 9],
    [2, 13],
    [2, 27],
    [2, 28],
    [2, 32],
    [3, 7],
    [3, 12],
    [3, 13],
    [4, 6],
    [4, 10],
    [5, 6],
    [5, 10],
    [5, 16],
    [6, 16],
    [8, 30],
    [8, 32],
    [8, 33],
    [9, 33],
    [13, 33],
    [14, 32],
    [14, 33],
    [15, 32],
    [15, 33],
    [18, 32],
    [18, 33],
    [19, 33],
    [20, 32],
    [20, 33],
    [22, 32],
    [22, 33],
    [23, 25],
    [23, 27],
    [23, 29],
    [23, 32],
    [23, 33],
    [24, 25],
    [24, 27],
    [24, 31],
    [25, 31],
    [26, 29],
    [26, 33],
    [27, 33],
    [28, 31],
    [28, 33],
    [29, 32],
    [29, 33],
    [30, 32],
    [30, 33],
    [31, 32],
    [31, 33],
    [32, 33]
  ]
}, te = {
  nodes: [
    { id: 0, px: 0.09083423378081436, py: 1.164162667707135, member: 0 },
    { id: 1, px: -0.5395391223661004, py: 0.8787097882002372, member: 0 },
    { id: 2, px: 0.25483951690897244, py: -0.011894166387290125, member: 0 },
    { id: 3, px: 0.5292273814873625, py: 0.8137715604013231, member: 0 },
    { id: 4, px: 0.6759740200024705, py: 2.010590015934319, member: 3 },
    { id: 5, px: 0.6648725961138767, py: 2.3765595730406712, member: 3 },
    { id: 6, px: -0.015476857282255526, py: 2.421851366492045, member: 3 },
    { id: 7, px: 0.9923183157183725, py: 0.7358251458599251, member: 0 },
    { id: 8, px: -0.6148021363450372, py: -0.03465499210385469, member: 1 },
    { id: 9, px: 0.24714516178546894, py: -1.012380550604274, member: 0 },
    { id: 10, px: 1.3293288757439443, py: 1.8641805845025743, member: 3 },
    { id: 11, px: -0.6571791278403557, py: 2.2163816367270526, member: 0 },
    { id: 12, px: 1.5181044222926994, py: 1.3282665066698078, member: 0 },
    { id: 13, px: -0.2979203330003603, py: 0.18438685313887027, member: 0 },
    { id: 14, px: -1.7502345807734376, py: -1.0935551887354324, member: 1 },
    { id: 15, px: -1.630224787934251, py: -1.5015879850995024, member: 1 },
    { id: 16, px: 0.5585243394360673, py: 3.5, member: 3 },
    { id: 17, px: -0.9776584881745712, py: 1.799718659872538, member: 0 },
    { id: 18, px: -1.385649185975611, py: -1.870388302312794, member: 1 },
    { id: 19, px: -0.9638464461397331, py: 0.24226946279518707, member: 0 },
    { id: 20, px: -1.0268125129631975, py: -2.1543990524894148, member: 1 },
    { id: 21, px: -1.3061680833745626, py: 1.527228276383933, member: 0 },
    { id: 22, px: -0.5552461198316926, py: -2.2498070887997685, member: 1 },
    { id: 23, px: 0.8262268914348979, py: -1.804253160744954, member: 2 },
    { id: 24, px: 1.9952840970427212, py: -1.0382885070400036, member: 2 },
    { id: 25, px: 1.9207660053211613, py: -0.5823795272244723, member: 2 },
    { id: 26, px: -0.1664715343791652, py: -2.6527209168204373, member: 1 },
    { id: 27, px: 0.9961959436268844, py: -1.0143754028553023, member: 2 },
    { id: 28, px: 0.6488880579857091, py: -1.024671500275854, member: 2 },
    { id: 29, px: 0.2398196340697841, py: -2.171491081802323, member: 1 },
    { id: 30, px: -1.3348117368940753, py: -0.31290471156377053, member: 1 },
    { id: 31, px: 0.6901260074375327, py: -0.2526601933356052, member: 2 },
    { id: 32, px: -0.6030949145287146, py: -1.0927507849665647, member: 1 },
    { id: 33, px: -0.3533395323856202, py: -1.1887389845640028, member: 1 }
  ],
  edges: [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [0, 7],
    [0, 8],
    [0, 10],
    [0, 11],
    [0, 12],
    [0, 13],
    [0, 17],
    [0, 19],
    [0, 21],
    [0, 31],
    [1, 2],
    [1, 3],
    [1, 7],
    [1, 13],
    [1, 17],
    [1, 19],
    [1, 21],
    [1, 30],
    [2, 3],
    [2, 7],
    [2, 8],
    [2, 9],
    [2, 13],
    [2, 27],
    [2, 28],
    [2, 32],
    [3, 7],
    [3, 12],
    [3, 13],
    [4, 6],
    [4, 10],
    [5, 6],
    [5, 10],
    [5, 16],
    [6, 16],
    [8, 30],
    [8, 32],
    [8, 33],
    [9, 33],
    [13, 33],
    [14, 32],
    [14, 33],
    [15, 32],
    [15, 33],
    [18, 32],
    [18, 33],
    [19, 33],
    [20, 32],
    [20, 33],
    [22, 32],
    [22, 33],
    [23, 25],
    [23, 27],
    [23, 29],
    [23, 32],
    [23, 33],
    [24, 25],
    [24, 27],
    [24, 31],
    [25, 31],
    [26, 29],
    [26, 33],
    [27, 33],
    [28, 31],
    [28, 33],
    [29, 32],
    [29, 33],
    [30, 32],
    [30, 33],
    [31, 32],
    [31, 33],
    [32, 33]
  ]
};
async function ee(n, t) {
  const e = /* @__PURE__ */ new Map();
  for (let i = 0; i < n.length; i++) {
    const r = new W(n[i].data);
    e.set(n[i], r);
  }
  const s = /* @__PURE__ */ new Map();
  for (let i = 0; i < t.length; i++) {
    const r = new V(t[i][0], t[i][1], t[i].data);
    s.set(i, r);
  }
  return await Y.create(e, s);
}
const se = { ConstructGraphNodeEdgesList: ee };
class N {
  /**
   * Constructs a point based on the x y z values
   * @param x x value 
   * @param y y value
   * @param z z value 
   */
  constructor(t, e, s) {
    this.x = t, this.y = e, this.z = s;
  }
  // Points are somewhat the same thing as a vector 
  // So im using the same type instead of redeclaring the 
  // Type
  /**
   * Displaces a point - note this method moves the existing point
   * @param Point - Displacement vector (used as a point)
   */
  translate(t) {
    this.x = this.x + t.x, this.y = this.y + t.y, this.z = this.z + t.z;
  }
}
function ne(n) {
  let t = 0;
  for (let s = 0; s < n.length; s++)
    t = t + n[s];
  const e = t / n.length;
  return Number.isNaN(e) ? 0 : e;
}
function oe(n, t) {
  return Math.pow(
    Math.pow(n.x - t.x, 2) + Math.pow(n.y - t.y, 2) + Math.pow(n.z - t.z, 2),
    0.5
  );
}
function ie(n, t) {
  return Math.pow(n.x - t.x, 2) + Math.pow(n.y - t.y, 2) + Math.pow(n.z - t.z, 2);
}
function ae(n, t) {
  var e = new Array(t), s = n.length, o = new Array(s);
  if (t > s)
    throw new RangeError("getRandom: more elements taken than available");
  for (; t--; ) {
    var i = Math.floor(Math.random() * s);
    e[t] = n[i in o ? o[i] : i], o[i] = --s in o ? o[s] : s;
  }
  return e;
}
function re(n, t) {
  const e = /* @__PURE__ */ new Map();
  let s;
  for (const o of n.keys())
    s = Math.random(), s < t && e.set(o, n.get(o));
  return e;
}
const z = {
  calculateAverage: ne,
  calculateDistance: oe,
  calculateSquaredDistance: ie,
  getRandomSubset: ae,
  getRandomSubset_map: re
};
class ht {
  /**
   * Constructs a line from an array of points
   * @param points an array of points
   */
  constructor(t) {
    this.points = [], t.forEach((e) => {
      const s = new N(e.x, e.y, e.z);
      this.points.push(s);
    });
  }
}
function Et(n, t, e) {
  const s = new N(n.x, n.y, n.z), o = new N(t.x, t.y, t.z), i = [];
  for (let a = 0; a <= e; a++) {
    const c = a / e, l = c * s.x + (1 - c) * o.x, h = c * s.y + (1 - c) * o.y, p = c * s.z + (1 - c) * o.z, g = new N(l, h, p);
    i.push(g);
  }
  return new ht(i);
}
function ce(n, t, e) {
  const s = z.calculateDistance(n, t), o = Math.round(s / e) + 2;
  return Et(n, t, o);
}
function le(n) {
  let t = 0, e = 0, s = 0;
  return n.forEach((i) => {
    t += i.x, e += i.y, s += i.z;
  }), t = t / n.length, e = e / n.length, s = s / n.length, new N(t, e, s);
}
const st = {
  line_from_start_end_divisions: Et,
  line_from_start_end_distance: ce,
  centroid: le
};
async function he(n, t, e = 1e3, s = 1, o = 1) {
  const i = n.get_adjacency(), r = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
  let c, l;
  for (const w of i.keys())
    c = Math.random() * e, l = Math.random() * e, r.set(w, c), a.set(w, l);
  for (let w = 0; w < t; w++) {
    let _, P, M, D, E, v, B, k, T, I, H, j, O, q;
    for (const R of i.keys()) {
      const nt = i.get(R);
      _ = r.get(R), P = a.get(R), M = [], D = [], nt.forEach(($) => {
        const Gt = r.get($), Vt = a.get($);
        M.push(Gt), D.push(Vt);
      }), H = z.calculateAverage(M), j = z.calculateAverage(D), E = [], v = [];
      let G, ut, pt, ft;
      for (const $ of n.nodes.keys())
        $ != R && (pt = r.get($), ft = a.get($), G = pt - _, ut = ft - P, v.push(G), E.push(ut));
      T = o * 1 / (z.calculateAverage(v) * z.calculateAverage(v)), I = o * 1 / (z.calculateAverage(E) * z.calculateAverage(E)), B = s * (H - _), k = s * (j - P), O = s * (0 - _), q = s * (0 - P);
      const Ut = T + O + B + _, Yt = I + q + k + P;
      r.set(R, Ut), a.set(R, Yt);
    }
  }
  let h = /* @__PURE__ */ new Map();
  for (const w of r.keys())
    h.set(w, new N(r.get(w), 0, a.get(w)));
  const p = [], g = [], f = [];
  let d;
  for (const w of h.keys())
    d = h.get(w), p.push(d.x), g.push(d.y), f.push(d.z);
  const u = z.calculateAverage(p), x = z.calculateAverage(g), b = z.calculateAverage(f), y = new N(
    -u,
    -x,
    -b
  );
  return h = Tt(h, y), h;
}
function de(n) {
  const t = n.get_adjacency(), e = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  for (const i of t.keys())
    e.set(i, Math.random() * 200), s.set(i, Math.random() * 200);
  const o = /* @__PURE__ */ new Map();
  for (const i of e.keys())
    o.set(i, new N(e.get(i), 0, s.get(i)));
  return o;
}
function Dt(n, t) {
  const e = /* @__PURE__ */ new Map();
  let s, o, i;
  for (const r of n.edges.keys()) {
    s = n.edges.get(r), o = n.nodes.get(s.start).data.pos, i = n.nodes.get(s.end).data.pos;
    const a = st.line_from_start_end_distance(
      o,
      i,
      t
    );
    e.set(r, a);
  }
  return e;
}
function ue(n, t) {
  const e = /* @__PURE__ */ new Map();
  let s, o, i;
  for (const r of n.edges.keys()) {
    s = n.edges.get(r), o = n.nodes.get(s.start).data.pos, i = n.nodes.get(s.end).data.pos;
    const a = st.line_from_start_end_divisions(
      o,
      i,
      t
    );
    e.set(r, a);
  }
  return e;
}
async function vt(n, t, e) {
  const s = /* @__PURE__ */ new Map();
  for (let y of n.keys())
    s.set(y, structuredClone(n.get(y)));
  let o, i, r, a, c, l, h, p, g, f, d, u, x, b;
  for (let y = 0; y < t; y++)
    for (let w of s.keys()) {
      o = s.get(w);
      for (let _ = 1; _ < o.points.length - 1; _++) {
        r = [], a = [], c = [], l = o.points[_];
        for (let M of s.keys())
          if (M != w) {
            i = s.get(M);
            for (let D = 1; D < i.points.length - 1; D++)
              h = i.points[D], p = z.calculateSquaredDistance(l, h), p <= Math.pow(e, 2) && (g = h.x - l.x, f = h.y - l.y, d = h.z - l.z, r.push(g), a.push(f), c.push(d));
          }
        u = l.x + 0.8 * (z.calculateAverage(r) || 0), x = l.y + 0.8 * (z.calculateAverage(a) || 0), b = l.z + 0.8 * (z.calculateAverage(c) || 0);
        const P = new N(u, x, b);
        o.points[_] = P;
      }
    }
  return s;
}
function pe(n, t) {
  const e = /* @__PURE__ */ new Map();
  for (let s of n.keys())
    e.set(s, structuredClone(n.get(s)));
  for (const s of e.keys()) {
    const o = e.get(s);
    let i, r;
    for (let a = 0; a < o.points.length; a++)
      i = o.points[a], r = t * Math.sin(Math.PI * a / (o.points.length - 1)), i.y = i.y + r;
  }
  return e;
}
function fe(n, t, e) {
  let s = 0, o, i;
  const r = (a) => {
    const c = a[t];
    return typeof c == "number" ? c : Number(c) || 0;
  };
  for (let a of n.nodes.values())
    o = r(a.data), o >= s && (s = o);
  for (const a of n.nodes.values())
    o = r(a.data), i = s > 0 ? o / s * e : 0, i = Math.max(0, i), i = Math.min(e, i), a.data.pos.y = i;
}
async function me(n, t, e, s) {
  const o = n.get_adjacency(), i = await lt.Dijkstra(n, t), r = Math.max(...i.values()), a = /* @__PURE__ */ new Map();
  for (let d = 0; d <= r; d++) {
    const u = [];
    for (const x of i.keys())
      d == i.get(x) && u.push(x);
    a.set(d, u);
  }
  const c = /* @__PURE__ */ new Map(), l = s.x || 0, h = s.y || 0, p = s.z || 0;
  for (const d of o.keys()) {
    const u = i.get(d) * e, x = a.get(i.get(d)), b = 2 * Math.PI * (x.indexOf(d) / x.length), y = Math.sin(b) * u, w = Math.cos(b) * u, _ = new N(y + l, -u + h, w + p);
    c.set(d, _);
  }
  n.apply_position_map(c);
  const g = Dt(n, 1), f = await vt(g, 12, 5);
  return { pmap: c, emap: f };
}
function ge(n, t) {
  const e = n.get_map(), s = Tt(e.pmap, t), o = _e(e.emap, t);
  n.apply_drawing_maps({ pmap: s, emap: o });
}
function Tt(n, t) {
  const e = /* @__PURE__ */ new Map();
  for (let s of n.keys()) {
    const o = n.get(s);
    o.translate(t), e.set(s, o);
  }
  return e;
}
function _e(n, t) {
  const e = /* @__PURE__ */ new Map();
  let s, o, i;
  for (let r of n.keys()) {
    s = [], o = n.get(r);
    for (let a of o.points)
      a.translate(t), s.push(a);
    i = new ht(s), e.set(r, i);
  }
  return e;
}
function ye(n, t) {
  let e, s, o, i;
  for (const r of n.edges.keys())
    e = n.edges.get(r), s = n.nodes.get(e.start).data.pos, o = n.nodes.get(e.end).data.pos, i = st.line_from_start_end_distance(
      s,
      o,
      t
    ), e.data.ldata = i;
}
function we(n, t) {
  let e, s, o, i;
  for (const r of n.edges.keys())
    e = n.edges.get(r), s = n.nodes.get(e.start).data.pos, o = n.nodes.get(e.end).data.pos, i = st.line_from_start_end_divisions(s, o, t), e.data.ldata = i;
}
const be = {
  SimulateKamadaKawai: he,
  DrawEdgeLines: Dt,
  DrawEdgeLinesDivisions: ue,
  DrawEdgeBundling: vt,
  HivePlot: me,
  DisplaceEdgeInY: pe,
  MoveGraph: ge,
  InstanciateRandomPositions: de,
  DisplaceVertices: fe,
  // these two are special functions
  UpdateEdgeLinesDist: ye,
  UpdateEdgeLinesDivs: we
};
async function Me(n) {
  const t = n.split(/\r?\n/), e = [], s = /* @__PURE__ */ new Set();
  for (const a of t) {
    const c = a.trim();
    if (!c || c.startsWith("#")) continue;
    const l = c.split(/\s+/);
    if (l.length < 2) continue;
    const h = parseInt(l[0], 10), p = parseInt(l[1], 10);
    Number.isNaN(h) || Number.isNaN(p) || (e.push([h, p]), s.add(h), s.add(p));
  }
  const o = /* @__PURE__ */ new Map();
  for (const a of s)
    o.set(a, new W({ pos: new N(0, 0, 0) }));
  const i = /* @__PURE__ */ new Map();
  return e.forEach(([a, c], l) => {
    i.set(l, new V(a, c, {}));
  }), await Y.create(o, i);
}
async function xe() {
  const n = Jt;
  return await se.ConstructGraphNodeEdgesList(n.nodes, n.edges);
}
async function Pe() {
  const n = te, t = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map();
  n.nodes.forEach((i) => {
    const r = i.id, a = new N(i.px * 50, 0, i.py * 50), c = i.member, l = new W({ pos: a, size: 10, info: "Node Info", modularity: c });
    t.set(r, l);
  });
  for (let i = 0; i < n.edges.length; i++) {
    const r = n.edges[i], a = r[0], c = r[1], l = new V(a, c, {});
    e.set(i, l);
  }
  const s = await Y.create(t, e), o = be.DrawEdgeLines(s, 20);
  return s.apply_edge_pos_maps(o), s;
}
async function Ee(n) {
  const t = n.split(/\r?\n/), e = [], s = /* @__PURE__ */ new Set();
  for (const h of t) {
    const p = h.trim();
    if (!(!p || p.startsWith("#"))) {
      if (p.startsWith("v ")) {
        const g = p.slice(2).trim().split(/\s+/);
        if (g.length >= 3) {
          const f = parseFloat(g[0]), d = parseFloat(g[1]), u = parseFloat(g[2]);
          !Number.isNaN(f) && !Number.isNaN(d) && !Number.isNaN(u) && e.push(f, d, u);
        }
        continue;
      }
      if (p.startsWith("f ")) {
        const g = p.slice(2).trim().split(/\s+/), f = [];
        for (const d of g) {
          const u = parseInt(d.split("/")[0], 10);
          !Number.isNaN(u) && u >= 1 && f.push(u - 1);
        }
        for (let d = 0; d < f.length; d++) {
          const u = f[d], x = f[(d + 1) % f.length];
          if (u === x) continue;
          const b = u < x ? `${u},${x}` : `${x},${u}`;
          s.add(b);
        }
      }
    }
  }
  const o = e.length / 3, i = /* @__PURE__ */ new Map();
  for (let h = 0; h < o; h++)
    i.set(h, new W({ pos: new N(0, 0, 0) }));
  const r = /* @__PURE__ */ new Map();
  let a = 0;
  for (const h of s) {
    const [p, g] = h.split(",").map((f) => parseInt(f, 10));
    r.set(a++, new V(p, g, {}));
  }
  const c = await Y.create(i, r), l = new Float32Array(e);
  return { graph: c, positions: l };
}
async function De() {
  const { dwt_1005: n } = await import("./dwt_1005-C8KXz1aw.mjs"), t = n, e = /* @__PURE__ */ new Set();
  for (const l of Object.keys(t)) {
    const h = parseInt(l, 10);
    Number.isNaN(h) || e.add(h);
    for (const p of t[l]) e.add(p);
  }
  const s = /* @__PURE__ */ new Set();
  for (const l of Object.keys(t)) {
    const h = parseInt(l, 10);
    if (!Number.isNaN(h))
      for (const p of t[l]) {
        const g = Math.min(h, p), f = Math.max(h, p);
        s.add(`${g},${f}`);
      }
  }
  const o = /* @__PURE__ */ new Map(), i = [...e].sort((l, h) => l - h);
  for (const l of i)
    o.set(l, new W({ pos: new N(0, 0, 0) }));
  const r = /* @__PURE__ */ new Map();
  let a = 0;
  for (const l of s) {
    const [h, p] = l.split(",").map((g) => parseInt(g, 10));
    r.set(a++, new V(h, p, {}));
  }
  return await Y.create(o, r);
}
const xs = { LoadZKC: xe, LoadZKCSimulated: Pe, LoadGraphFromEdgeListText: Me, LoadGraphFromObjText: Ee, LoadDwt1005: De };
function ve(n) {
  const t = n.length;
  if (t < 2)
    return new m.BufferGeometry();
  const e = [], s = [], o = [], i = [];
  for (let c = 0; c < t; c++) {
    const l = n[c], h = c > 0 ? n[c - 1] : l, p = c < t - 1 ? n[c + 1] : l;
    e.push(l.x, l.y, l.z), s.push(h.x, h.y, h.z), o.push(p.x, p.y, p.z), i.push(-1), e.push(l.x, l.y, l.z), s.push(h.x, h.y, h.z), o.push(p.x, p.y, p.z), i.push(1);
  }
  const r = new m.BufferGeometry();
  r.setAttribute("position", new m.Float32BufferAttribute(e, 3)), r.setAttribute("positionPrev", new m.Float32BufferAttribute(s, 3)), r.setAttribute("positionNext", new m.Float32BufferAttribute(o, 3)), r.setAttribute("side", new m.Float32BufferAttribute(i, 1));
  const a = [];
  for (let c = 0; c < t - 1; c++) {
    const l = c * 2;
    a.push(l, l + 1, l + 2, l + 2, l + 1, l + 3);
  }
  return r.setIndex(a), r.computeBoundingSphere(), r;
}
const Te = `
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
`, Ae = `
uniform vec3 color;

void main() {
  gl_FragColor = vec4(color, 1.0);
}
`;
function Ie(n = {}) {
  const t = n.color ?? 16777215, e = n.lineWidth ?? 2, s = n.resolution ?? new m.Vector2(800, 700), o = new m.Color(t);
  return new m.ShaderMaterial({
    uniforms: {
      resolution: { value: s },
      lineWidth: { value: e },
      color: { value: new m.Vector3(o.r, o.g, o.b) }
    },
    vertexShader: Te,
    fragmentShader: Ae,
    transparent: !1,
    depthTest: !0,
    side: m.DoubleSide
  });
}
const At = 2, Se = new m.Vector2(800, 700);
function ke(n, t, e, s = At, o) {
  if (n.points.length < 2) {
    const c = new m.BufferGeometry();
    return new m.Mesh(c, new m.MeshBasicMaterial({ color: e }));
  }
  const i = n.points.map(
    (c) => new m.Vector3(c.x * t, c.y * t, c.z * t)
  ), r = ve(i), a = Ie({
    color: e,
    lineWidth: s,
    resolution: Se
  });
  return new m.Mesh(r, a);
}
function Ne(n) {
  return n >= 1 ? Math.max(1, Math.round(n)) : Math.max(1, Math.round(n * 100));
}
function It(n, t, e, s = At, o) {
  const i = Ne(s), r = new m.Group();
  for (const [a, c] of n.entries()) {
    if (!(c != null && c.points) || c.points.length < 2) continue;
    const l = ke(c, t, e, i);
    l.userData = { edgeId: a }, r.add(l);
  }
  return r;
}
const St = `
attribute float size;
attribute vec3 customColor;

varying vec3 vColor;

void main() {
    vColor = customColor;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = size * ( 300.0 / -mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
}
`, kt = `
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
function Nt(n, t = 1, e = 1, s = 16777215, o = 1) {
  const i = [], r = n.get_position_map();
  let a, c;
  typeof e == "number" ? a = Array(n.nodes.size).fill(e) : a = e, c = Array(n.nodes.size).fill(s);
  const l = [], h = new m.Color();
  h.setRGB(255, 255, 255);
  let p = 0, g;
  for (let x of n.nodes.keys())
    g = r.get(x), i.push(
      g.x * t,
      g.y * t,
      g.z * t
    ), h.toArray(c, p * 3), l.push(x), p += 1;
  const f = new m.BufferGeometry();
  f.setAttribute(
    "position",
    new m.Float32BufferAttribute(i, 3)
  ), f.setAttribute(
    "customColor",
    new m.Float32BufferAttribute(c, 3)
  ), f.setAttribute("size", new m.Float32BufferAttribute(a, 1)), f.setAttribute("label", new m.Int32BufferAttribute(l, 1)), f.name = "nodes";
  const d = new m.ShaderMaterial({
    uniforms: {
      color: { value: new m.Color(16777215) },
      // this is a base color dont mess with this
      pointTexture: {
        value: new m.TextureLoader().load("./Textures/Square.png")
      },
      alphaTest: { value: o }
    },
    vertexShader: St,
    fragmentShader: kt
  }), u = new m.Group();
  return u.add(new m.Points(f, d)), u;
}
function Le(n, t = 1, e = 1, s = 16777215, o = 1) {
  const i = n.get_node_ids_order(), r = i.length, a = n.get_position_map(), c = [];
  let l;
  const h = Array(r).fill(s), p = i.slice(), g = new m.Color();
  g.setRGB(255, 255, 255);
  for (let y = 0; y < r; y++) {
    const w = a.get(i[y]);
    c.push(
      w.x * t,
      w.y * t,
      w.z * t
    ), g.toArray(h, y * 3);
  }
  typeof e == "number" ? l = Array(r).fill(e) : l = e;
  const f = new m.BufferGeometry();
  f.setAttribute(
    "position",
    new m.Float32BufferAttribute(c, 3)
  ), f.setAttribute(
    "customColor",
    new m.Float32BufferAttribute(h, 3)
  ), f.setAttribute("size", new m.Float32BufferAttribute(l, 1)), f.setAttribute("label", new m.Int32BufferAttribute(p, 1)), f.name = "nodes";
  const d = new m.ShaderMaterial({
    uniforms: {
      color: { value: new m.Color(16777215) },
      pointTexture: {
        value: new m.TextureLoader().load("./Textures/Square.png")
      },
      alphaTest: { value: o }
    },
    vertexShader: St,
    fragmentShader: kt
  }), u = new m.Group();
  u.add(new m.Points(f, d));
  const x = f.getAttribute("position");
  function b(y) {
    const w = x.array;
    if (y instanceof Float32Array)
      for (let _ = 0; _ < r * 3; _++)
        w[_] = y[_] * t;
    else
      for (let _ = 0; _ < r; _++) {
        const P = y.get(i[_]);
        w[_ * 3] = P.x * t, w[_ * 3 + 1] = P.y * t, w[_ * 3 + 2] = P.z * t;
      }
    x.needsUpdate = !0;
  }
  return { group: u, updatePositions: b };
}
function Ce(n, t = 1, e = 16777215, s = 0.4) {
  const o = n.get_edge_map();
  return Lt(o, t, e, s);
}
function Lt(n, t, e = 16777215, s = 0.4) {
  return It(n, t, e, s);
}
function ze(n, t = 1, e = 16777215) {
  const s = n.get_edge_map();
  return Ct(s, t, e);
}
function Oe(n, t = 1, e = 16777215) {
  const s = new m.LineBasicMaterial({ color: e }), o = new m.Group();
  function i() {
    for (; o.children.length > 0; ) {
      const a = o.children[0];
      o.remove(a), a instanceof m.Line && a.geometry && a.geometry.dispose();
    }
    const r = n.get_edge_map();
    for (const [a, c] of r.entries()) {
      const l = [];
      c.points.forEach((g) => {
        l.push(
          new m.Vector3(
            g.x * t,
            g.y * t,
            g.z * t
          )
        );
      });
      const h = new m.BufferGeometry().setFromPoints(l), p = new m.Line(h, s);
      p.userData = { edgeId: a }, o.add(p);
    }
  }
  return i(), { group: o, updateEdges: i };
}
function je(n, t, e, s = 16777215, o = 5) {
  const i = n.get_position_map(), r = e.map((c) => i.get(c)).filter((c) => c != null);
  if (r.length < 2) return new m.Group();
  const a = new ht(r);
  return It(/* @__PURE__ */ new Map([[0, a]]), t, s, o);
}
function Ct(n, t = 1, e = 16777215) {
  const s = new m.LineBasicMaterial({
    color: e
  }), o = new m.Group();
  let i;
  for (const [r, a] of n.entries()) {
    i = [], a.points.forEach((p) => {
      i.push(
        new m.Vector3(
          p.x * t,
          p.y * t,
          p.z * t
        )
      );
    });
    const l = new m.BufferGeometry().setFromPoints(i), h = new m.Line(l, s);
    h.userData = { edgeId: r }, o.add(h);
  }
  return o;
}
const K = new m.Matrix4(), Z = new m.Vector3(), J = new m.Quaternion(), X = new m.Vector3();
function zt(n, t = 1, e = 16777215, s = 10) {
  const o = n.size, i = Array.from(n.entries()), r = typeof s == "number" ? Array(o).fill(s) : s, a = new m.BoxGeometry(1, 1, 1), c = new m.MeshBasicMaterial({ color: e }), l = new m.InstancedMesh(a, c, o);
  l.name = "boxVertices", J.identity();
  for (let p = 0; p < o; p++) {
    const g = i[p][1], f = r[p];
    Z.set(
      g.x * t,
      g.y * t,
      g.z * t
    ), X.set(f, f, f), K.compose(
      Z,
      J,
      X
    ), l.setMatrixAt(p, K);
  }
  l.instanceMatrix.needsUpdate = !0, l.userData = { nodeIds: i.map((p) => p[0]) };
  const h = new m.Group();
  return h.add(l), h;
}
function Re(n, t = 1, e = 16777215, s = 10) {
  const o = n.get_node_ids_order(), i = o.length, r = n.get_position_map(), a = typeof s == "number" ? Array(i).fill(s) : s, c = new m.BoxGeometry(1, 1, 1), l = new m.MeshBasicMaterial({ color: e }), h = new m.InstancedMesh(c, l, i);
  h.name = "boxVertices", J.identity();
  for (let f = 0; f < i; f++) {
    const d = r.get(o[f]), u = a[f];
    Z.set(
      d.x * t,
      d.y * t,
      d.z * t
    ), X.set(u, u, u), K.compose(
      Z,
      J,
      X
    ), h.setMatrixAt(f, K);
  }
  h.instanceMatrix.needsUpdate = !0, h.userData = { nodeIds: o.slice() };
  const p = new m.Group();
  p.add(h);
  function g(f) {
    if (f instanceof Float32Array)
      for (let d = 0; d < i; d++)
        Z.set(
          f[d * 3] * t,
          f[d * 3 + 1] * t,
          f[d * 3 + 2] * t
        ), X.set(a[d], a[d], a[d]), K.compose(
          Z,
          J,
          X
        ), h.setMatrixAt(d, K);
    else
      for (let d = 0; d < i; d++) {
        const u = f.get(o[d]);
        Z.set(u.x * t, u.y * t, u.z * t), X.set(a[d], a[d], a[d]), K.compose(
          Z,
          J,
          X
        ), h.setMatrixAt(d, K);
      }
    h.instanceMatrix.needsUpdate = !0;
  }
  return { group: p, updatePositions: g };
}
function Fe(n, t = 1, e = 16777215, s = 10) {
  const o = n.get_position_map();
  return zt(o, t, e, s);
}
function Be(n, t = 16, e = 16777215, s = 10) {
  let o;
  typeof s == "number" ? o = Array(n.size).fill(s) : o = s;
  const i = new m.Group(), r = new m.MeshBasicMaterial({ color: e });
  let a = 0;
  for (const [c, l] of n) {
    const h = typeof o == "number" ? o : o[a], p = 2 * h * Math.PI, g = Math.ceil(p / t), f = new m.CylinderGeometry(h, h, 10, g);
    f.name = String(c);
    const d = new m.Mesh(f, r);
    d.position.set(l.x, l.y, l.z), i.add(d), a += 1;
  }
  return i;
}
async function He(n, t) {
  const e = /* @__PURE__ */ new Map();
  let s, o;
  for (let g of n.nodes.keys()) {
    s = n.nodes.get(g);
    const f = s.data[t];
    o = typeof f == "number" ? f : f != null ? Number(f) : void 0, o !== void 0 && (e.has(o) ? e.get(o).push(g) : e.set(o, [g]));
  }
  const i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
  let a, c, l, h;
  for (let g of e.keys())
    a = e.get(g), c = await lt.SelectSubgraph(n, a), l = Nt(c, 1), i.set(g, l), h = Ot(c, 0.03), r.set(g, h);
  return {
    nodeGroups: i,
    EdgeGroups: r
  };
}
function Ot(n, t, e = 16777215) {
  const s = new m.Group(), o = new m.LineBasicMaterial({ color: e });
  let i, r, a;
  for (let c of n.edges.values())
    if (Math.random() <= t) {
      i = n.nodes.get(c.start).data.pos, r = n.nodes.get(c.end).data.pos, a = [], a.push(new m.Vector3(i.x, i.y, i.z)), a.push(new m.Vector3(r.x, r.y, r.z));
      const l = new m.BufferGeometry().setFromPoints(a), h = new m.Line(l, o);
      s.add(h);
    }
  return s;
}
function Ue(n, t, e) {
  try {
    const s = n instanceof m.Group ? n.children[0] : n, o = s == null ? void 0 : s.geometry;
    if (!(o != null && o.attributes)) return;
    const i = o.attributes.customColor, r = i == null ? void 0 : i.array;
    if (!r || r.length === 0) return;
    const a = new m.Color(e), c = o.attributes.label, l = c == null ? void 0 : c.array;
    l && l.length > 0 ? t.forEach((h) => {
      for (let p = 0; p < l.length; p++)
        if (l[p] === h) {
          const g = p * 3;
          g + 2 < r.length && (r[g] = a.r, r[g + 1] = a.g, r[g + 2] = a.b);
          break;
        }
    }) : t.forEach((h) => {
      const p = h * 3;
      p + 2 < r.length && (r[p] = a.r, r[p + 1] = a.g, r[p + 2] = a.b);
    }), i && (i.needsUpdate = !0);
  } catch {
  }
}
function Ye(n) {
  var t, e;
  try {
    const s = n instanceof m.Group ? n.children[0] : n, o = (e = (t = s == null ? void 0 : s.geometry) == null ? void 0 : t.attributes) == null ? void 0 : e.customColor, i = o == null ? void 0 : o.array;
    if (!i || i.length === 0) return;
    const r = (o == null ? void 0 : o.count) ?? Math.floor(i.length / 3);
    for (let a = 0; a < r; a++) {
      const c = a * 3;
      i[c] = 1, i[c + 1] = 1, i[c + 2] = 1;
    }
    o && (o.needsUpdate = !0);
  } catch {
  }
}
const Ps = {
  DrawTHREEGraphVertices: Nt,
  DrawTHREEGraphVerticesMutable: Le,
  DrawTHREEGraphEdgesThick: Ce,
  DrawTHREEGraphEdgesThin: ze,
  DrawTHREEGraphEdgesThinMutable: Oe,
  DrawThickPathFromNodeIds: je,
  AddBoxBasedImaging: zt,
  AddInModularityBasedPointGroups: He,
  DrawThinEdgesFromEdgeMap: Ct,
  DrawThickEdgesFromEdgeMap: Lt,
  AddCylinderBasedImaging: Be,
  DrawSimplifiedEdges: Ot,
  ChangeTheVertexColours: Ue,
  ResetVertexColors: Ye,
  DrawTHREEBoxBasedVertices: Fe,
  DrawTHREEBoxBasedVerticesMutable: Re
}, _t = { type: "change" }, dt = { type: "start" }, jt = { type: "end" }, ot = new Zt(), yt = new Xt(), Ge = Math.cos(70 * Wt.DEG2RAD), S = new U(), C = 2 * Math.PI, A = {
  NONE: -1,
  ROTATE: 0,
  DOLLY: 1,
  PAN: 2,
  TOUCH_ROTATE: 3,
  TOUCH_PAN: 4,
  TOUCH_DOLLY_PAN: 5,
  TOUCH_DOLLY_ROTATE: 6
}, at = 1e-6;
class Ve extends Kt {
  constructor(t, e = null) {
    super(t, e), this.state = A.NONE, this.enabled = !0, this.target = new U(), this.cursor = new U(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minTargetRadius = 0, this.maxTargetRadius = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = 0.05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.zoomToCursor = !1, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: tt.ROTATE, MIDDLE: tt.DOLLY, RIGHT: tt.PAN }, this.touches = { ONE: Q.ROTATE, TWO: Q.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this._lastPosition = new U(), this._lastQuaternion = new mt(), this._lastTargetPosition = new U(), this._quat = new mt().setFromUnitVectors(t.up, new U(0, 1, 0)), this._quatInverse = this._quat.clone().invert(), this._spherical = new gt(), this._sphericalDelta = new gt(), this._scale = 1, this._panOffset = new U(), this._rotateStart = new F(), this._rotateEnd = new F(), this._rotateDelta = new F(), this._panStart = new F(), this._panEnd = new F(), this._panDelta = new F(), this._dollyStart = new F(), this._dollyEnd = new F(), this._dollyDelta = new F(), this._dollyDirection = new U(), this._mouse = new F(), this._performCursorZoom = !1, this._pointers = [], this._pointerPositions = {}, this._controlActive = !1, this._onPointerMove = Ze.bind(this), this._onPointerDown = Ke.bind(this), this._onPointerUp = Xe.bind(this), this._onContextMenu = es.bind(this), this._onMouseWheel = $e.bind(this), this._onKeyDown = Qe.bind(this), this._onTouchStart = Je.bind(this), this._onTouchMove = ts.bind(this), this._onMouseDown = We.bind(this), this._onMouseMove = qe.bind(this), this._interceptControlDown = ss.bind(this), this._interceptControlUp = ns.bind(this), this.domElement !== null && this.connect(), this.update();
  }
  connect() {
    this.domElement.addEventListener("pointerdown", this._onPointerDown), this.domElement.addEventListener("pointercancel", this._onPointerUp), this.domElement.addEventListener("contextmenu", this._onContextMenu), this.domElement.addEventListener("wheel", this._onMouseWheel, { passive: !1 }), this.domElement.getRootNode().addEventListener("keydown", this._interceptControlDown, { passive: !0, capture: !0 }), this.domElement.style.touchAction = "none";
  }
  disconnect() {
    this.domElement.removeEventListener("pointerdown", this._onPointerDown), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.domElement.removeEventListener("pointercancel", this._onPointerUp), this.domElement.removeEventListener("wheel", this._onMouseWheel), this.domElement.removeEventListener("contextmenu", this._onContextMenu), this.stopListenToKeyEvents(), this.domElement.getRootNode().removeEventListener("keydown", this._interceptControlDown, { capture: !0 }), this.domElement.style.touchAction = "auto";
  }
  dispose() {
    this.disconnect();
  }
  getPolarAngle() {
    return this._spherical.phi;
  }
  getAzimuthalAngle() {
    return this._spherical.theta;
  }
  getDistance() {
    return this.object.position.distanceTo(this.target);
  }
  listenToKeyEvents(t) {
    t.addEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = t;
  }
  stopListenToKeyEvents() {
    this._domElementKeyEvents !== null && (this._domElementKeyEvents.removeEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = null);
  }
  saveState() {
    this.target0.copy(this.target), this.position0.copy(this.object.position), this.zoom0 = this.object.zoom;
  }
  reset() {
    this.target.copy(this.target0), this.object.position.copy(this.position0), this.object.zoom = this.zoom0, this.object.updateProjectionMatrix(), this.dispatchEvent(_t), this.update(), this.state = A.NONE;
  }
  update(t = null) {
    const e = this.object.position;
    S.copy(e).sub(this.target), S.applyQuaternion(this._quat), this._spherical.setFromVector3(S), this.autoRotate && this.state === A.NONE && this._rotateLeft(this._getAutoRotationAngle(t)), this.enableDamping ? (this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor, this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor) : (this._spherical.theta += this._sphericalDelta.theta, this._spherical.phi += this._sphericalDelta.phi);
    let s = this.minAzimuthAngle, o = this.maxAzimuthAngle;
    isFinite(s) && isFinite(o) && (s < -Math.PI ? s += C : s > Math.PI && (s -= C), o < -Math.PI ? o += C : o > Math.PI && (o -= C), s <= o ? this._spherical.theta = Math.max(s, Math.min(o, this._spherical.theta)) : this._spherical.theta = this._spherical.theta > (s + o) / 2 ? Math.max(s, this._spherical.theta) : Math.min(o, this._spherical.theta)), this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi)), this._spherical.makeSafe(), this.enableDamping === !0 ? this.target.addScaledVector(this._panOffset, this.dampingFactor) : this.target.add(this._panOffset), this.target.sub(this.cursor), this.target.clampLength(this.minTargetRadius, this.maxTargetRadius), this.target.add(this.cursor);
    let i = !1;
    if (this.zoomToCursor && this._performCursorZoom || this.object.isOrthographicCamera)
      this._spherical.radius = this._clampDistance(this._spherical.radius);
    else {
      const r = this._spherical.radius;
      this._spherical.radius = this._clampDistance(this._spherical.radius * this._scale), i = r != this._spherical.radius;
    }
    if (S.setFromSpherical(this._spherical), S.applyQuaternion(this._quatInverse), e.copy(this.target).add(S), this.object.lookAt(this.target), this.enableDamping === !0 ? (this._sphericalDelta.theta *= 1 - this.dampingFactor, this._sphericalDelta.phi *= 1 - this.dampingFactor, this._panOffset.multiplyScalar(1 - this.dampingFactor)) : (this._sphericalDelta.set(0, 0, 0), this._panOffset.set(0, 0, 0)), this.zoomToCursor && this._performCursorZoom) {
      let r = null;
      if (this.object.isPerspectiveCamera) {
        const a = S.length();
        r = this._clampDistance(a * this._scale);
        const c = a - r;
        this.object.position.addScaledVector(this._dollyDirection, c), this.object.updateMatrixWorld(), i = !!c;
      } else if (this.object.isOrthographicCamera) {
        const a = new U(this._mouse.x, this._mouse.y, 0);
        a.unproject(this.object);
        const c = this.object.zoom;
        this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), this.object.updateProjectionMatrix(), i = c !== this.object.zoom;
        const l = new U(this._mouse.x, this._mouse.y, 0);
        l.unproject(this.object), this.object.position.sub(l).add(a), this.object.updateMatrixWorld(), r = S.length();
      } else
        console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), this.zoomToCursor = !1;
      r !== null && (this.screenSpacePanning ? this.target.set(0, 0, -1).transformDirection(this.object.matrix).multiplyScalar(r).add(this.object.position) : (ot.origin.copy(this.object.position), ot.direction.set(0, 0, -1).transformDirection(this.object.matrix), Math.abs(this.object.up.dot(ot.direction)) < Ge ? this.object.lookAt(this.target) : (yt.setFromNormalAndCoplanarPoint(this.object.up, this.target), ot.intersectPlane(yt, this.target))));
    } else if (this.object.isOrthographicCamera) {
      const r = this.object.zoom;
      this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), r !== this.object.zoom && (this.object.updateProjectionMatrix(), i = !0);
    }
    return this._scale = 1, this._performCursorZoom = !1, i || this._lastPosition.distanceToSquared(this.object.position) > at || 8 * (1 - this._lastQuaternion.dot(this.object.quaternion)) > at || this._lastTargetPosition.distanceToSquared(this.target) > at ? (this.dispatchEvent(_t), this._lastPosition.copy(this.object.position), this._lastQuaternion.copy(this.object.quaternion), this._lastTargetPosition.copy(this.target), !0) : !1;
  }
  _getAutoRotationAngle(t) {
    return t !== null ? C / 60 * this.autoRotateSpeed * t : C / 60 / 60 * this.autoRotateSpeed;
  }
  _getZoomScale(t) {
    const e = Math.abs(t * 0.01);
    return Math.pow(0.95, this.zoomSpeed * e);
  }
  _rotateLeft(t) {
    this._sphericalDelta.theta -= t;
  }
  _rotateUp(t) {
    this._sphericalDelta.phi -= t;
  }
  _panLeft(t, e) {
    S.setFromMatrixColumn(e, 0), S.multiplyScalar(-t), this._panOffset.add(S);
  }
  _panUp(t, e) {
    this.screenSpacePanning === !0 ? S.setFromMatrixColumn(e, 1) : (S.setFromMatrixColumn(e, 0), S.crossVectors(this.object.up, S)), S.multiplyScalar(t), this._panOffset.add(S);
  }
  // deltaX and deltaY are in pixels; right and down are positive
  _pan(t, e) {
    const s = this.domElement;
    if (this.object.isPerspectiveCamera) {
      const o = this.object.position;
      S.copy(o).sub(this.target);
      let i = S.length();
      i *= Math.tan(this.object.fov / 2 * Math.PI / 180), this._panLeft(2 * t * i / s.clientHeight, this.object.matrix), this._panUp(2 * e * i / s.clientHeight, this.object.matrix);
    } else this.object.isOrthographicCamera ? (this._panLeft(t * (this.object.right - this.object.left) / this.object.zoom / s.clientWidth, this.object.matrix), this._panUp(e * (this.object.top - this.object.bottom) / this.object.zoom / s.clientHeight, this.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), this.enablePan = !1);
  }
  _dollyOut(t) {
    this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale /= t : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = !1);
  }
  _dollyIn(t) {
    this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale *= t : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = !1);
  }
  _updateZoomParameters(t, e) {
    if (!this.zoomToCursor)
      return;
    this._performCursorZoom = !0;
    const s = this.domElement.getBoundingClientRect(), o = t - s.left, i = e - s.top, r = s.width, a = s.height;
    this._mouse.x = o / r * 2 - 1, this._mouse.y = -(i / a) * 2 + 1, this._dollyDirection.set(this._mouse.x, this._mouse.y, 1).unproject(this.object).sub(this.object.position).normalize();
  }
  _clampDistance(t) {
    return Math.max(this.minDistance, Math.min(this.maxDistance, t));
  }
  //
  // event callbacks - update the object state
  //
  _handleMouseDownRotate(t) {
    this._rotateStart.set(t.clientX, t.clientY);
  }
  _handleMouseDownDolly(t) {
    this._updateZoomParameters(t.clientX, t.clientX), this._dollyStart.set(t.clientX, t.clientY);
  }
  _handleMouseDownPan(t) {
    this._panStart.set(t.clientX, t.clientY);
  }
  _handleMouseMoveRotate(t) {
    this._rotateEnd.set(t.clientX, t.clientY), this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const e = this.domElement;
    this._rotateLeft(C * this._rotateDelta.x / e.clientHeight), this._rotateUp(C * this._rotateDelta.y / e.clientHeight), this._rotateStart.copy(this._rotateEnd), this.update();
  }
  _handleMouseMoveDolly(t) {
    this._dollyEnd.set(t.clientX, t.clientY), this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart), this._dollyDelta.y > 0 ? this._dollyOut(this._getZoomScale(this._dollyDelta.y)) : this._dollyDelta.y < 0 && this._dollyIn(this._getZoomScale(this._dollyDelta.y)), this._dollyStart.copy(this._dollyEnd), this.update();
  }
  _handleMouseMovePan(t) {
    this._panEnd.set(t.clientX, t.clientY), this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd), this.update();
  }
  _handleMouseWheel(t) {
    this._updateZoomParameters(t.clientX, t.clientY), t.deltaY < 0 ? this._dollyIn(this._getZoomScale(t.deltaY)) : t.deltaY > 0 && this._dollyOut(this._getZoomScale(t.deltaY)), this.update();
  }
  _handleKeyDown(t) {
    let e = !1;
    switch (t.code) {
      case this.keys.UP:
        t.ctrlKey || t.metaKey || t.shiftKey ? this._rotateUp(C * this.rotateSpeed / this.domElement.clientHeight) : this._pan(0, this.keyPanSpeed), e = !0;
        break;
      case this.keys.BOTTOM:
        t.ctrlKey || t.metaKey || t.shiftKey ? this._rotateUp(-C * this.rotateSpeed / this.domElement.clientHeight) : this._pan(0, -this.keyPanSpeed), e = !0;
        break;
      case this.keys.LEFT:
        t.ctrlKey || t.metaKey || t.shiftKey ? this._rotateLeft(C * this.rotateSpeed / this.domElement.clientHeight) : this._pan(this.keyPanSpeed, 0), e = !0;
        break;
      case this.keys.RIGHT:
        t.ctrlKey || t.metaKey || t.shiftKey ? this._rotateLeft(-C * this.rotateSpeed / this.domElement.clientHeight) : this._pan(-this.keyPanSpeed, 0), e = !0;
        break;
    }
    e && (t.preventDefault(), this.update());
  }
  _handleTouchStartRotate(t) {
    if (this._pointers.length === 1)
      this._rotateStart.set(t.pageX, t.pageY);
    else {
      const e = this._getSecondPointerPosition(t), s = 0.5 * (t.pageX + e.x), o = 0.5 * (t.pageY + e.y);
      this._rotateStart.set(s, o);
    }
  }
  _handleTouchStartPan(t) {
    if (this._pointers.length === 1)
      this._panStart.set(t.pageX, t.pageY);
    else {
      const e = this._getSecondPointerPosition(t), s = 0.5 * (t.pageX + e.x), o = 0.5 * (t.pageY + e.y);
      this._panStart.set(s, o);
    }
  }
  _handleTouchStartDolly(t) {
    const e = this._getSecondPointerPosition(t), s = t.pageX - e.x, o = t.pageY - e.y, i = Math.sqrt(s * s + o * o);
    this._dollyStart.set(0, i);
  }
  _handleTouchStartDollyPan(t) {
    this.enableZoom && this._handleTouchStartDolly(t), this.enablePan && this._handleTouchStartPan(t);
  }
  _handleTouchStartDollyRotate(t) {
    this.enableZoom && this._handleTouchStartDolly(t), this.enableRotate && this._handleTouchStartRotate(t);
  }
  _handleTouchMoveRotate(t) {
    if (this._pointers.length == 1)
      this._rotateEnd.set(t.pageX, t.pageY);
    else {
      const s = this._getSecondPointerPosition(t), o = 0.5 * (t.pageX + s.x), i = 0.5 * (t.pageY + s.y);
      this._rotateEnd.set(o, i);
    }
    this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const e = this.domElement;
    this._rotateLeft(C * this._rotateDelta.x / e.clientHeight), this._rotateUp(C * this._rotateDelta.y / e.clientHeight), this._rotateStart.copy(this._rotateEnd);
  }
  _handleTouchMovePan(t) {
    if (this._pointers.length === 1)
      this._panEnd.set(t.pageX, t.pageY);
    else {
      const e = this._getSecondPointerPosition(t), s = 0.5 * (t.pageX + e.x), o = 0.5 * (t.pageY + e.y);
      this._panEnd.set(s, o);
    }
    this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd);
  }
  _handleTouchMoveDolly(t) {
    const e = this._getSecondPointerPosition(t), s = t.pageX - e.x, o = t.pageY - e.y, i = Math.sqrt(s * s + o * o);
    this._dollyEnd.set(0, i), this._dollyDelta.set(0, Math.pow(this._dollyEnd.y / this._dollyStart.y, this.zoomSpeed)), this._dollyOut(this._dollyDelta.y), this._dollyStart.copy(this._dollyEnd);
    const r = (t.pageX + e.x) * 0.5, a = (t.pageY + e.y) * 0.5;
    this._updateZoomParameters(r, a);
  }
  _handleTouchMoveDollyPan(t) {
    this.enableZoom && this._handleTouchMoveDolly(t), this.enablePan && this._handleTouchMovePan(t);
  }
  _handleTouchMoveDollyRotate(t) {
    this.enableZoom && this._handleTouchMoveDolly(t), this.enableRotate && this._handleTouchMoveRotate(t);
  }
  // pointers
  _addPointer(t) {
    this._pointers.push(t.pointerId);
  }
  _removePointer(t) {
    delete this._pointerPositions[t.pointerId];
    for (let e = 0; e < this._pointers.length; e++)
      if (this._pointers[e] == t.pointerId) {
        this._pointers.splice(e, 1);
        return;
      }
  }
  _isTrackingPointer(t) {
    for (let e = 0; e < this._pointers.length; e++)
      if (this._pointers[e] == t.pointerId) return !0;
    return !1;
  }
  _trackPointer(t) {
    let e = this._pointerPositions[t.pointerId];
    e === void 0 && (e = new F(), this._pointerPositions[t.pointerId] = e), e.set(t.pageX, t.pageY);
  }
  _getSecondPointerPosition(t) {
    const e = t.pointerId === this._pointers[0] ? this._pointers[1] : this._pointers[0];
    return this._pointerPositions[e];
  }
  //
  _customWheelEvent(t) {
    const e = t.deltaMode, s = {
      clientX: t.clientX,
      clientY: t.clientY,
      deltaY: t.deltaY
    };
    switch (e) {
      case 1:
        s.deltaY *= 16;
        break;
      case 2:
        s.deltaY *= 100;
        break;
    }
    return t.ctrlKey && !this._controlActive && (s.deltaY *= 10), s;
  }
}
function Ke(n) {
  this.enabled !== !1 && (this._pointers.length === 0 && (this.domElement.setPointerCapture(n.pointerId), this.domElement.addEventListener("pointermove", this._onPointerMove), this.domElement.addEventListener("pointerup", this._onPointerUp)), !this._isTrackingPointer(n) && (this._addPointer(n), n.pointerType === "touch" ? this._onTouchStart(n) : this._onMouseDown(n)));
}
function Ze(n) {
  this.enabled !== !1 && (n.pointerType === "touch" ? this._onTouchMove(n) : this._onMouseMove(n));
}
function Xe(n) {
  switch (this._removePointer(n), this._pointers.length) {
    case 0:
      this.domElement.releasePointerCapture(n.pointerId), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.dispatchEvent(jt), this.state = A.NONE;
      break;
    case 1:
      const t = this._pointers[0], e = this._pointerPositions[t];
      this._onTouchStart({ pointerId: t, pageX: e.x, pageY: e.y });
      break;
  }
}
function We(n) {
  let t;
  switch (n.button) {
    case 0:
      t = this.mouseButtons.LEFT;
      break;
    case 1:
      t = this.mouseButtons.MIDDLE;
      break;
    case 2:
      t = this.mouseButtons.RIGHT;
      break;
    default:
      t = -1;
  }
  switch (t) {
    case tt.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseDownDolly(n), this.state = A.DOLLY;
      break;
    case tt.ROTATE:
      if (n.ctrlKey || n.metaKey || n.shiftKey) {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(n), this.state = A.PAN;
      } else {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(n), this.state = A.ROTATE;
      }
      break;
    case tt.PAN:
      if (n.ctrlKey || n.metaKey || n.shiftKey) {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(n), this.state = A.ROTATE;
      } else {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(n), this.state = A.PAN;
      }
      break;
    default:
      this.state = A.NONE;
  }
  this.state !== A.NONE && this.dispatchEvent(dt);
}
function qe(n) {
  switch (this.state) {
    case A.ROTATE:
      if (this.enableRotate === !1) return;
      this._handleMouseMoveRotate(n);
      break;
    case A.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseMoveDolly(n);
      break;
    case A.PAN:
      if (this.enablePan === !1) return;
      this._handleMouseMovePan(n);
      break;
  }
}
function $e(n) {
  this.enabled === !1 || this.enableZoom === !1 || this.state !== A.NONE || (n.preventDefault(), this.dispatchEvent(dt), this._handleMouseWheel(this._customWheelEvent(n)), this.dispatchEvent(jt));
}
function Qe(n) {
  this.enabled === !1 || this.enablePan === !1 || this._handleKeyDown(n);
}
function Je(n) {
  switch (this._trackPointer(n), this._pointers.length) {
    case 1:
      switch (this.touches.ONE) {
        case Q.ROTATE:
          if (this.enableRotate === !1) return;
          this._handleTouchStartRotate(n), this.state = A.TOUCH_ROTATE;
          break;
        case Q.PAN:
          if (this.enablePan === !1) return;
          this._handleTouchStartPan(n), this.state = A.TOUCH_PAN;
          break;
        default:
          this.state = A.NONE;
      }
      break;
    case 2:
      switch (this.touches.TWO) {
        case Q.DOLLY_PAN:
          if (this.enableZoom === !1 && this.enablePan === !1) return;
          this._handleTouchStartDollyPan(n), this.state = A.TOUCH_DOLLY_PAN;
          break;
        case Q.DOLLY_ROTATE:
          if (this.enableZoom === !1 && this.enableRotate === !1) return;
          this._handleTouchStartDollyRotate(n), this.state = A.TOUCH_DOLLY_ROTATE;
          break;
        default:
          this.state = A.NONE;
      }
      break;
    default:
      this.state = A.NONE;
  }
  this.state !== A.NONE && this.dispatchEvent(dt);
}
function ts(n) {
  switch (this._trackPointer(n), this.state) {
    case A.TOUCH_ROTATE:
      if (this.enableRotate === !1) return;
      this._handleTouchMoveRotate(n), this.update();
      break;
    case A.TOUCH_PAN:
      if (this.enablePan === !1) return;
      this._handleTouchMovePan(n), this.update();
      break;
    case A.TOUCH_DOLLY_PAN:
      if (this.enableZoom === !1 && this.enablePan === !1) return;
      this._handleTouchMoveDollyPan(n), this.update();
      break;
    case A.TOUCH_DOLLY_ROTATE:
      if (this.enableZoom === !1 && this.enableRotate === !1) return;
      this._handleTouchMoveDollyRotate(n), this.update();
      break;
    default:
      this.state = A.NONE;
  }
}
function es(n) {
  this.enabled !== !1 && n.preventDefault();
}
function ss(n) {
  n.key === "Control" && (this._controlActive = !0, this.domElement.getRootNode().addEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
function ns(n) {
  n.key === "Control" && (this._controlActive = !1, this.domElement.getRootNode().removeEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
function os(n) {
  var e;
  const t = n.object;
  if (t instanceof m.Points) {
    const s = t.geometry, o = (e = s == null ? void 0 : s.attributes) == null ? void 0 : e.label;
    return o && n.index != null ? o.array[n.index] ?? null : null;
  }
  if (t instanceof m.InstancedMesh && n.instanceId != null) {
    const s = t.userData.nodeIds;
    return s && n.instanceId < s.length ? s[n.instanceId] : null;
  }
  return null;
}
function is(n) {
  const e = n.object.userData.edgeId;
  return e ?? null;
}
function wt(n, t) {
  var o;
  const e = n.nodes.get(t), s = n.get_position_map();
  return {
    nodeId: t,
    data: (e == null ? void 0 : e.data) ?? {},
    neighbours: ((o = e == null ? void 0 : e.neighbours) == null ? void 0 : o.slice()) ?? [],
    position: s.get(t)
  };
}
function bt(n, t) {
  const e = n.edges.get(t);
  return e ? {
    edgeId: t,
    start: e.start,
    end: e.end,
    data: e.data ?? {}
  } : null;
}
const it = new m.Vector3(), Mt = new m.Plane(), xt = new m.Vector3();
class as {
  constructor(t, e, s, o, i) {
    this.lastHoverNodeId = null, this.lastHoverEdgeId = null, this.dragNodeId = null, this.wasDragging = !1, this.scene = t, this.camera = e, this.domElement = s, this.graph = o, this.options = i, this.raycaster = new m.Raycaster(), this.mouse = new m.Vector2(), this.hoverEnabled = i.hoverEnabled !== !1, this.controls = i.controls, this.raycaster.params.Line = { threshold: 5 }, this.raycaster.params.Points = { threshold: 10 }, this.boundOnClick = this.onClick.bind(this), this.boundOnPointerMove = this.onPointerMove.bind(this), this.boundOnPointerDown = this.onPointerDown.bind(this), this.boundOnPointerUp = this.onPointerUp.bind(this), s.addEventListener("click", this.boundOnClick), this.hoverEnabled && s.addEventListener("pointermove", this.boundOnPointerMove), i.enableNodeDrag && i.onNodeDrag && (s.addEventListener("pointerdown", this.boundOnPointerDown), s.addEventListener("pointerup", this.boundOnPointerUp), s.addEventListener("pointerleave", this.boundOnPointerUp));
  }
  dispose() {
    this.domElement.removeEventListener("click", this.boundOnClick), this.domElement.removeEventListener("pointermove", this.boundOnPointerMove), this.domElement.removeEventListener("pointerdown", this.boundOnPointerDown), this.domElement.removeEventListener("pointerup", this.boundOnPointerUp), this.domElement.removeEventListener("pointerleave", this.boundOnPointerUp);
  }
  getMouseNDC(t) {
    const e = this.domElement;
    if (t.target === e)
      this.mouse.x = t.offsetX / e.offsetWidth * 2 - 1, this.mouse.y = -(t.offsetY / e.offsetHeight) * 2 + 1;
    else {
      const o = e.getBoundingClientRect();
      this.mouse.x = (t.clientX - o.left) / o.width * 2 - 1, this.mouse.y = -((t.clientY - o.top) / o.height) * 2 + 1;
    }
  }
  pick() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const t = this.raycaster.intersectObject(this.scene, !0);
    let e = null, s = null, o = 1 / 0, i = 1 / 0;
    for (const r of t) {
      const a = os(r), c = is(r);
      a != null && r.distance < o && (e = a, o = r.distance), c != null && r.distance < i && (s = c, i = r.distance);
    }
    return e != null && s != null && o <= i ? s = null : e != null && s != null && (e = null), { nodeId: e, edgeId: s };
  }
  onClick(t) {
    if (this.wasDragging) {
      this.wasDragging = !1;
      return;
    }
    this.getMouseNDC(t);
    const { nodeId: e, edgeId: s } = this.pick();
    if (e != null && this.options.onNodeClick && this.options.onNodeClick(wt(this.graph, e)), s != null && this.options.onEdgeClick) {
      const o = bt(this.graph, s);
      o && this.options.onEdgeClick(o);
    }
  }
  onPointerDown(t) {
    if (this.wasDragging = !1, t.button !== 0) return;
    this.getMouseNDC(t);
    const { nodeId: e } = this.pick();
    e != null && this.options.enableNodeDrag && this.options.onNodeDrag && (this.dragNodeId = e, this.controls && (this.controls.enabled = !1));
  }
  onPointerUp(t) {
    this.dragNodeId != null && (this.wasDragging = !0, this.dragNodeId = null, this.controls && (this.controls.enabled = !0));
  }
  getDragPosition() {
    if (this.dragNodeId == null) return null;
    const t = this.graph.get_position_map().get(this.dragNodeId);
    return t ? (xt.set(0, 0, -1).applyQuaternion(this.camera.quaternion), Mt.setFromNormalAndCoplanarPoint(xt, new m.Vector3(t.x, t.y, t.z)), this.raycaster.setFromCamera(this.mouse, this.camera), this.raycaster.ray.intersectPlane(Mt, it) ? { x: it.x, y: it.y, z: it.z } : null) : null;
  }
  onPointerMove(t) {
    if (this.getMouseNDC(t), this.dragNodeId != null && this.options.onNodeDrag) {
      const o = this.getDragPosition();
      o && this.options.onNodeDrag(this.dragNodeId, o);
      return;
    }
    const { nodeId: e, edgeId: s } = this.pick();
    this.fireHoverCallbacks(e, s);
  }
  fireHoverCallbacks(t, e) {
    if (this.options.onNodeHover && (t != null ? t !== this.lastHoverNodeId && (this.lastHoverNodeId = t, this.options.onNodeHover(wt(this.graph, t))) : this.lastHoverNodeId != null && (this.lastHoverNodeId = null, this.options.onNodeHover(null))), this.options.onEdgeHover)
      if (e != null) {
        if (e !== this.lastHoverEdgeId) {
          this.lastHoverEdgeId = e;
          const s = bt(this.graph, e);
          s && this.options.onEdgeHover(s);
        }
      } else
        this.lastHoverEdgeId != null && (this.lastHoverEdgeId = null, this.options.onEdgeHover(null));
  }
}
class rs {
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
   * @param GraphDrawerOptions3d - These options are constructed into a single object and passed in
   */
  constructor(t) {
    this.canvas = t.canvas, this.width = t.width, this.height = t.height, this.geometryMap = /* @__PURE__ */ new Map(), this.materialMap = /* @__PURE__ */ new Map(), this.meshMap = /* @__PURE__ */ new Map(), this.controls, this.renderer, this.camera, this.scene, this.graphs = /* @__PURE__ */ new Map();
  }
  /**
   * This essentially initializes the drawing element based on the settings
   * Remember to do this since if if its not done the scene will not render
   */
  async init() {
    const t = performance.now();
    this.camera = new m.PerspectiveCamera(), this.scene = new m.Scene(), this.renderer = new m.WebGLRenderer({
      canvas: this.canvas,
      antialias: !0
    }), this.renderer.setSize(this.width, this.height), this.renderer.setClearColor(16711935, 0), this.camera.aspect = this.width / this.height, this.camera.updateProjectionMatrix(), this.scene.add(new m.AmbientLight(16777215));
    const e = new m.DirectionalLight(16777215, 1);
    e.position.set(0, 10, 0), this.scene.add(e), this.controls = new Ve(this.camera, this.renderer.domElement), this.camera.position.set(0, 100, 100), this.controls.autoRotate = !0, this.controls.maxPolarAngle = Math.PI * 0.5, this.controls.maxDistance = 1e4, this.controls.minDistance = 10, this.controls.update();
    const s = performance.now();
    console.log("initialization has finished"), console.log(`Time to initialize ${s - t} milliseconds`);
  }
  //add graph
  // this adds a graph to the current visualizer
  /**
   * 
   * This is the main way to add elements to the viewer window that gets initialized
   * 
   * @param element A geometry element (THREE.Group, Line, or Points) to add to the scene
   */
  addVisElement(t) {
    this.scene.add(t);
  }
  // this stuff renders out one specific instances
  /**
   * This is the render call that is called every frame to update the rendering of the canvas
   * Remember to do this since this is a common are for bugs to occur
   */
  rendercall() {
    this.renderer.render(this.scene, this.camera), this.controls.update();
  }
  /**
   * Enable opt-in interaction: node and edge picking via click/hover, and optional drag-to-reposition.
   * Callbacks receive graph details (node data, neighbours, edge endpoints).
   *
   * @param options - Interaction options. Must include `graph`. Optional:
   *   - `onNodeClick`, `onEdgeClick` — click callbacks
   *   - `onNodeHover`, `onEdgeHover` — hover callbacks (receive `null` when leaving)
   *   - `hoverEnabled` — default true; set false to disable hover
   *   - `enableNodeDrag` — enable drag-to-reposition (use with mutable vertices/edges)
   *   - `onNodeDrag(nodeId, newPosition)` — called each pointer move while dragging
   *   - `controls` — OrbitControls to disable during drag (auto-passed if omitted)
   */
  enableInteraction(t) {
    this.disableInteraction();
    const e = { ...t, controls: t.controls ?? this.controls };
    this.interactionLayer = new as(
      this.scene,
      this.camera,
      this.renderer.domElement,
      t.graph,
      e
    );
  }
  /**
   * Disable interaction and remove event listeners.
   */
  disableInteraction() {
    this.interactionLayer && (this.interactionLayer.dispose(), this.interactionLayer = void 0);
  }
}
const Es = {
  GraphDrawer3d: rs
};
async function cs(n, t) {
  const e = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  let o;
  for (let l = 0; l < n; l++)
    o = new W({}), e.set(l, o);
  let i, r, a = 0;
  for (let l = 0; l < n; l++)
    for (let h = 0; h < n; h++)
      l != h && (i = Math.random(), t > i && (r = new V(l, h, {}), s.set(a, r), a += 1));
  return new Y(e, s);
}
const Ds = { GenerateErdosReyni_n_p: cs };
function ls(n, t) {
  const e = n.x - t.x, s = n.y - t.y, o = n.z - t.z;
  return e * e + s * s + o * o;
}
function Rt(n) {
  return ["x", "y", "z"][n % 3];
}
function ct(n, t) {
  if (n.length === 0) return null;
  if (n.length === 1) return { item: n[0] };
  const e = Rt(t), s = [...n].sort((c, l) => c.point[e] - l.point[e]), o = Math.floor(s.length / 2), i = s[o], r = o > 0 ? ct(s.slice(0, o), t + 1) : null, a = o + 1 < s.length ? ct(s.slice(o + 1), t + 1) : null;
  return { left: r ?? void 0, right: a ?? void 0, item: i };
}
function et(n, t, e, s, o) {
  if (n === null) return;
  const i = Rt(s);
  ls(t, n.item.point) <= e && o.push(n.item.nodeId);
  const a = t[i] - n.item.point[i], c = a * a;
  a <= 0 ? (n.left && et(n.left, t, e, s + 1, o), n.right && c <= e && et(n.right, t, e, s + 1, o)) : (n.right && et(n.right, t, e, s + 1, o), n.left && c <= e && et(n.left, t, e, s + 1, o));
}
function hs(n, t) {
  const e = ct(n, 0), s = t * t, o = /* @__PURE__ */ new Map();
  for (const { point: i, nodeId: r } of n) {
    const a = [];
    e && et(e, i, s, 0, a), o.set(r, a);
  }
  return o;
}
class ds {
  constructor() {
    this.parent = /* @__PURE__ */ new Map();
  }
  find(t) {
    return this.parent.has(t) || this.parent.set(t, t), this.parent.get(t) !== t && this.parent.set(t, this.find(this.parent.get(t))), this.parent.get(t);
  }
  union(t, e) {
    const s = this.find(t), o = this.find(e);
    s !== o && this.parent.set(s, o);
  }
}
function us() {
  return {
    cluster(n, t) {
      const { distanceThreshold: e } = t, s = n.get_position_map(), o = [];
      for (const [f, d] of s)
        o.push({ point: d, nodeId: f });
      if (o.length === 0)
        return { nodeToCluster: /* @__PURE__ */ new Map(), clusterCentroids: /* @__PURE__ */ new Map(), clusterIds: [] };
      const i = hs(o, e), r = new ds();
      for (const [f, d] of i)
        for (const u of d)
          r.union(f, u);
      const a = /* @__PURE__ */ new Map();
      let c = 0;
      const l = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
      for (const { nodeId: f } of o) {
        const d = r.find(f);
        a.has(d) || a.set(d, c++);
        const u = a.get(d);
        l.set(f, u), h.has(u) || h.set(u, []), h.get(u).push(f);
      }
      const p = /* @__PURE__ */ new Map();
      for (const [f, d] of h) {
        const u = d.map((x) => s.get(x));
        p.set(f, st.centroid(u));
      }
      const g = [...h.keys()];
      return { nodeToCluster: l, clusterCentroids: p, clusterIds: g };
    }
  };
}
async function Ft(n, t) {
  const { nodeToCluster: e, clusterCentroids: s, clusterIds: o } = t, i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
  for (const p of o) {
    const g = s.get(p), f = new W({ pos: g });
    i.set(p, f);
  }
  const a = /* @__PURE__ */ new Map(), c = (p, g) => p <= g ? `${p},${g}` : `${g},${p}`;
  for (const [, p] of n.edges) {
    const g = e.get(p.start), f = e.get(p.end);
    if (g === void 0 || f === void 0 || g === f) continue;
    const d = c(g, f);
    a.set(d, (a.get(d) ?? 0) + 1);
  }
  let l = 0;
  for (const [p, g] of a) {
    const [f, d] = p.split(",").map(Number);
    r.set(l++, new V(f, d, { count: g }));
  }
  const h = new Y(i, r);
  return await h.initialize(), h;
}
async function ps(n, t) {
  const s = us().cluster(n, t);
  return Ft(n, s);
}
async function fs(n, t, e) {
  const s = t.cluster(n, e);
  return Ft(n, s);
}
const vs = {
  clusterByDistance: ps,
  clusterByStrategy: fs
};
function Ts(n, t, e, s) {
  for (let o = 0; o < t; o++) {
    let i = 0;
    for (let r = 0; r < t; r++) i += n[o * t + r] * e[r];
    s[o] = i;
  }
}
function As(n) {
  let t = 0;
  for (let s = 0; s < n.length; s++) t += n[s] * n[s];
  const e = Math.sqrt(t);
  if (e > 0) for (let s = 0; s < n.length; s++) n[s] /= e;
}
const ms = 64;
function Bt(n, t, e, s, o, i = 0) {
  if (n.length === 0) return null;
  if (n.length === 1) {
    const b = n[0];
    return {
      cx: b.x,
      cy: b.y,
      cz: b.z,
      count: 1,
      size: o,
      children: null,
      point: b
    };
  }
  if (i >= ms) {
    let b = 0, y = 0, w = 0;
    for (const P of n)
      b += P.x, y += P.y, w += P.z;
    const _ = n.length;
    return { cx: b / _, cy: y / _, cz: w / _, count: _, size: o, children: null, point: null };
  }
  const r = t + o, a = e + o, c = s + o, l = o / 2, h = [[], [], [], [], [], [], [], []];
  for (const b of n) {
    let y = 0;
    b.x >= r && (y |= 1), b.y >= a && (y |= 2), b.z >= c && (y |= 4), h[y].push(b);
  }
  let p = 0, g = 0, f = 0, d = 0;
  const u = [], x = [
    [0, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
    [1, 1, 0],
    [0, 0, 1],
    [1, 0, 1],
    [0, 1, 1],
    [1, 1, 1]
  ];
  for (let b = 0; b < 8; b++) {
    const y = h[b];
    if (y.length === 0) continue;
    const [w, _, P] = x[b], M = t + w * o, D = e + _ * o, E = s + P * o, v = Bt(y, M, D, E, l, i + 1);
    v && (u.push(v), p += v.cx * v.count, g += v.cy * v.count, f += v.cz * v.count, d += v.count);
  }
  return d === 0 ? null : {
    cx: p / d,
    cy: g / d,
    cz: f / d,
    count: d,
    size: o,
    children: u,
    point: null
  };
}
function Ht(n, t, e, s, o, i, r, a) {
  if (n === null) return;
  const c = n.cx - t, l = n.cy - e, h = n.cz - s, p = c * c + l * l + h * h;
  if (p < 1e-20) return;
  const g = Math.sqrt(p);
  if (n.point !== null) {
    if (n.point.index === o) return;
    const d = i / p;
    a.fx -= c * d, a.fy -= l * d, a.fz -= h * d;
    return;
  }
  if ((n.size / g < r || n.children === null) && n.count > 0) {
    const d = i * n.count / p;
    a.fx -= c * d, a.fy -= l * d, a.fz -= h * d;
    return;
  }
  if (n.children)
    for (const d of n.children)
      Ht(d, t, e, s, o, i, r, a);
}
const { vec3: L } = qt, gs = {
  simulationBound: 1e3,
  cohesionValue: 1,
  repulsionValue: 1,
  centerPull: 0.1,
  iterationsPerStep: 1,
  useOctree: !0,
  octreeThreshold: 64,
  octreeTheta: 0.8
};
function Is(n, t = {}) {
  const e = { ...gs, ...t }, s = n.get_node_ids_order(), o = s.length, i = n.get_adjacency(), r = /* @__PURE__ */ new Map();
  s.forEach((d, u) => r.set(d, u));
  const a = new Float32Array(o * 3);
  for (let d = 0; d < o; d++)
    a[d * 3] = Math.random() * e.simulationBound, a[d * 3 + 1] = Math.random() * e.simulationBound, a[d * 3 + 2] = Math.random() * e.simulationBound;
  const c = {
    force: L.create(),
    diff: L.create(),
    neighborAvg: L.create(),
    posI: L.create(),
    posJ: L.create()
  }, l = e.useOctree && o >= e.octreeThreshold, h = l ? Array.from({ length: o }, (d, u) => ({
    x: 0,
    y: 0,
    z: 0,
    index: u
  })) : [];
  function p(d) {
    const u = Math.max(1, e.iterationsPerStep);
    for (let x = 0; x < u; x++) {
      let b = null;
      if (l) {
        let y = 1 / 0, w = 1 / 0, _ = 1 / 0, P = -1 / 0, M = -1 / 0, D = -1 / 0;
        for (let I = 0; I < o; I++) {
          const H = a[I * 3], j = a[I * 3 + 1], O = a[I * 3 + 2];
          h[I].x = H, h[I].y = j, h[I].z = O, H < y && (y = H), H > P && (P = H), j < w && (w = j), j > M && (M = j), O < _ && (_ = O), O > D && (D = O);
        }
        const E = 1e-6, v = Math.max(P - y, M - w, D - _, E) / 2 + E, B = (y + P) / 2, k = (w + M) / 2, T = (_ + D) / 2;
        b = Bt(
          h,
          B - v,
          k - v,
          T - v,
          v
        );
      }
      for (let y = 0; y < o; y++) {
        L.set(
          c.posI,
          a[y * 3],
          a[y * 3 + 1],
          a[y * 3 + 2]
        ), L.set(c.force, 0, 0, 0);
        const w = i.get(s[y]) ?? [];
        if (w.length > 0) {
          c.neighborAvg[0] = 0, c.neighborAvg[1] = 0, c.neighborAvg[2] = 0;
          for (const _ of w) {
            const P = r.get(_);
            P !== void 0 && (c.neighborAvg[0] += a[P * 3], c.neighborAvg[1] += a[P * 3 + 1], c.neighborAvg[2] += a[P * 3 + 2]);
          }
          c.neighborAvg[0] /= w.length, c.neighborAvg[1] /= w.length, c.neighborAvg[2] /= w.length, L.subtract(c.diff, c.neighborAvg, c.posI), L.scale(c.diff, c.diff, e.cohesionValue), L.add(c.force, c.force, c.diff);
        }
        if (l && b) {
          const _ = { fx: 0, fy: 0, fz: 0 };
          Ht(
            b,
            c.posI[0],
            c.posI[1],
            c.posI[2],
            y,
            e.repulsionValue,
            e.octreeTheta,
            _
          ), c.force[0] += _.fx, c.force[1] += _.fy, c.force[2] += _.fz;
        } else
          for (let _ = 0; _ < o; _++) {
            if (_ === y) continue;
            L.set(
              c.posJ,
              a[_ * 3],
              a[_ * 3 + 1],
              a[_ * 3 + 2]
            ), L.subtract(c.diff, c.posJ, c.posI);
            const P = L.squaredLength(c.diff);
            P < 1e-10 || (L.scale(c.diff, c.diff, e.repulsionValue / P), L.subtract(c.force, c.force, c.diff));
          }
        c.force[0] -= e.centerPull * c.posI[0], c.force[1] -= e.centerPull * c.posI[1], c.force[2] -= e.centerPull * c.posI[2], a[y * 3] += c.force[0], a[y * 3 + 1] += c.force[1], a[y * 3 + 2] += c.force[2];
      }
    }
  }
  function g() {
    return a;
  }
  function f() {
    const d = /* @__PURE__ */ new Map();
    for (let u = 0; u < o; u++)
      d.set(
        s[u],
        new N(a[u * 3], a[u * 3 + 1], a[u * 3 + 2])
      );
    return d;
  }
  return { step: p, getPositions: g, getPositionMap: f };
}
const _s = {
  dimensions: 2,
  simulationBound: 1,
  epochsPerStep: 1,
  centerPull: 0,
  scaleBound: 0,
  useSchedule: !0,
  learningRate: 0.08,
  tMax: 80,
  eps: 0.01,
  initialPreservation: 0
};
function ys(n, t) {
  for (let e = n.length - 1; e >= 1; e--) {
    const s = Math.floor(t() * (e + 1));
    [n[e], n[s]] = [n[s], n[e]];
  }
}
function ws(n) {
  let t = n;
  return () => (t = t * 1103515245 + 12345 & 2147483647, t / 2147483647);
}
async function bs(n, t, e) {
  const s = t.length, o = /* @__PURE__ */ new Map();
  for (let r = 0; r < s; r++) {
    const a = t[r], c = await lt.Dijkstra(n, a);
    o.set(a, c);
  }
  const i = [];
  for (let r = 0; r < s; r++)
    for (let a = r + 1; a < s; a++) {
      const c = o.get(t[r]);
      if (!c) continue;
      const l = c.get(t[a]);
      if (l === void 0 || l <= 0) continue;
      const h = 1 / (l * l);
      i.push({ i: r, j: a, d: l, w: h });
    }
  return i;
}
async function Ss(n, t = {}) {
  const e = {
    ..._s,
    ...t,
    seed: t.seed ?? Math.floor(Math.random() * 2147483647)
  }, s = n.get_node_ids_order(), o = s.length, i = /* @__PURE__ */ new Map();
  s.forEach((M, D) => i.set(M, D));
  const r = await bs(n, s);
  r.length;
  let a = 1 / 0, c = -1 / 0;
  for (const M of r)
    M.w < a && (a = M.w), M.w > c && (c = M.w);
  (a <= 0 || c <= 0) && (a = 1), c <= 0 && (c = 1);
  const l = 1 / a, h = e.eps / c, p = e.tMax > 1 ? Math.log(l / h) / (e.tMax - 1) : 0, g = (M) => M >= e.tMax ? h : l * Math.exp(-p * M), f = e.dimensions, d = ws(e.seed), u = new Float32Array(o * 3);
  let x = null;
  if (e.initialPositions && e.initialPositions.length >= o * 3) {
    if (u.set(e.initialPositions.subarray(0, o * 3)), e.initialPreservation > 0 && (x = new Float32Array(e.initialPositions.subarray(0, o * 3))), f === 2)
      for (let M = 0; M < o; M++) u[M * 3 + 2] = 0;
  } else {
    const M = e.simulationBound;
    for (let D = 0; D < o; D++)
      u[D * 3] = d() * M, u[D * 3 + 1] = d() * M, u[D * 3 + 2] = f === 2 ? 0 : d() * M;
  }
  let b = 0;
  const y = 1e-12;
  function w(M) {
    const D = Math.max(1, e.epochsPerStep);
    for (let E = 0; E < D && b < e.tMax; E++) {
      const v = e.useSchedule ? g(b) : e.learningRate;
      b++, ys(r, d);
      for (const B of r) {
        const { i: k, j: T, d: I, w: H } = B;
        let j = v * H;
        j > 1 && (j = 1);
        const O = u[k * 3] - u[T * 3], q = u[k * 3 + 1] - u[T * 3 + 1], R = f === 3 ? u[k * 3 + 2] - u[T * 3 + 2] : 0, nt = Math.max(Math.sqrt(O * O + q * q + R * R), y), G = j * (nt - I) / (2 * nt);
        u[k * 3] -= G * O, u[k * 3 + 1] -= G * q, f === 3 && (u[k * 3 + 2] -= G * R), u[T * 3] += G * O, u[T * 3 + 1] += G * q, f === 3 && (u[T * 3 + 2] += G * R);
      }
    }
    if (e.initialPreservation > 0 && x) {
      const E = e.initialPreservation;
      for (let v = 0; v < o * 3; v++)
        u[v] = (1 - E) * u[v] + E * x[v];
    }
    if (e.centerPull > 0)
      for (let E = 0; E < o; E++)
        u[E * 3] -= e.centerPull * u[E * 3], u[E * 3 + 1] -= e.centerPull * u[E * 3 + 1], f === 3 && (u[E * 3 + 2] -= e.centerPull * u[E * 3 + 2]);
    if (e.scaleBound > 0 && o > 0) {
      let E = 0, v = 0, B = 0;
      for (let T = 0; T < o; T++)
        E += u[T * 3], v += u[T * 3 + 1], B += u[T * 3 + 2];
      E /= o, v /= o, B /= o;
      let k = 0;
      for (let T = 0; T < o; T++) {
        u[T * 3] -= E, u[T * 3 + 1] -= v, u[T * 3 + 2] -= B;
        const I = Math.sqrt(
          u[T * 3] ** 2 + u[T * 3 + 1] ** 2 + (f === 3 ? u[T * 3 + 2] ** 2 : 0)
        );
        I > k && (k = I);
      }
      if (k > 0) {
        const T = e.scaleBound / k;
        for (let I = 0; I < o * 3; I++) u[I] *= T;
      }
    }
    if (f === 2)
      for (let E = 0; E < o; E++) u[E * 3 + 2] = 0;
  }
  function _() {
    return u;
  }
  function P() {
    const M = /* @__PURE__ */ new Map();
    for (let D = 0; D < o; D++)
      M.set(
        s[D],
        new N(u[D * 3], u[D * 3 + 1], u[D * 3 + 2])
      );
    return M;
  }
  return { step: w, getPositions: _, getPositionMap: P };
}
export {
  se as Constructors,
  be as Drawing,
  V as Edge,
  st as Geometry,
  Y as Graph,
  Es as GraphDrawer,
  lt as GraphMethods,
  vs as Hierarchy,
  ht as Line,
  Ds as Models,
  N as Point,
  xs as SampleData,
  Ps as ThreeWrapper,
  z as Utilities,
  W as _Node,
  Is as createKamadaKawai3D,
  Ss as createStressSGD3D,
  qt as glMatrix,
  Ts as matrixVectorMultiply,
  As as normalizeVector
};
//# sourceMappingURL=pgl_module.js.map
