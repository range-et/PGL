import * as g from "three";
import { Controls as Gt, Vector3 as H, MOUSE as et, TOUCH as J, Quaternion as ft, Spherical as mt, Vector2 as F, Ray as Kt, Plane as Zt, MathUtils as Wt } from "three";
import * as Xt from "gl-matrix";
class G {
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
    const o = new G(t, e, s), i = this._nextEdgeId++;
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
      for (const h of c) {
        const d = i.get(h);
        d !== void 0 && (s[r * e + d] = 1);
      }
    }
    return { matrix: s, nodeIds: t };
  }
}
class X {
  /**
   * @param data - Data associated with the node; include "pos" (Point) for graph visuals
   */
  constructor(t = {}) {
    this.data = { ...t }, this.neighbours = [];
  }
}
async function xt(n, t) {
  const e = n.get_adjacency(), s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set([t]), i = [t];
  s.set(t, -1);
  for (let r = 0; r < i.length; r++) {
    const a = i[r], c = e.get(a) ?? [];
    for (let h = 0; h < c.length; h++) {
      const d = c[h];
      !o.has(d) && e.has(d) && (o.add(d), i.push(d), s.set(d, a));
    }
  }
  return s;
}
async function lt(n, t) {
  const e = await xt(n, t), s = /* @__PURE__ */ new Map();
  for (const [i, r] of e)
    s.set(i, r === -1 ? 0 : s.get(r) + 1);
  const o = /* @__PURE__ */ new Map();
  for (const i of n.nodes.keys()) {
    const r = s.get(i);
    r !== void 0 && o.set(i, r);
  }
  return o;
}
async function qt(n) {
  const t = [...n.nodes.keys()];
  if (t.length === 0) return { start: 0, end: 0, distance: 0 };
  if (t.length === 1) return { start: t[0], end: t[0], distance: 0 };
  const e = n.get_adjacency(), s = t.filter((h) => {
    var d;
    return (((d = e.get(h)) == null ? void 0 : d.length) ?? 0) > 0;
  }), o = s.length > 0 ? s : t;
  let i = o[Math.floor(Math.random() * o.length)], r = await lt(n, i), a = -1;
  for (const h of r.keys()) {
    const d = r.get(h);
    d > a && (i = h, a = d);
  }
  const c = i;
  r = await lt(n, i), a = -1;
  for (const h of r.keys()) {
    const d = r.get(h);
    d > a && (i = h, a = d);
  }
  return { start: c, end: i, distance: a };
}
async function $t(n, t) {
  const e = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  for (const r of t) {
    const a = n.nodes.get(r);
    a && e.set(r, new X(a.data));
  }
  let o = 0;
  for (const r of n.edges.values())
    e.has(r.start) && e.has(r.end) && (s.set(o, new G(r.start, r.end, r.data)), o += 1);
  return await Y.create(e, s);
}
const Et = { GraphDiameter: qt, Dijkstra: lt, BFSSearch: xt, SelectSubgraph: $t }, Qt = {
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
}, Jt = {
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
async function te(n, t) {
  const e = /* @__PURE__ */ new Map();
  for (let i = 0; i < n.length; i++) {
    const r = new X(n[i].data);
    e.set(n[i], r);
  }
  const s = /* @__PURE__ */ new Map();
  for (let i = 0; i < t.length; i++) {
    const r = new G(t[i][0], t[i][1], t[i].data);
    s.set(i, r);
  }
  return await Y.create(e, s);
}
const ee = { ConstructGraphNodeEdgesList: te };
class L {
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
function se(n) {
  let t = 0;
  for (let s = 0; s < n.length; s++)
    t = t + n[s];
  const e = t / n.length;
  return Number.isNaN(e) ? 0 : e;
}
function ne(n, t) {
  return Math.pow(
    Math.pow(n.x - t.x, 2) + Math.pow(n.y - t.y, 2) + Math.pow(n.z - t.z, 2),
    0.5
  );
}
function oe(n, t) {
  return Math.pow(n.x - t.x, 2) + Math.pow(n.y - t.y, 2) + Math.pow(n.z - t.z, 2);
}
function ie(n, t) {
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
const R = {
  calculateAverage: se,
  calculateDistance: ne,
  calculateSquaredDistance: oe,
  getRandomSubset: ie,
  getRandomSubset_map: re
};
class ot {
  /**
   * Constructs a line from an array of points
   * @param points an array of points
   */
  constructor(t) {
    this.points = [], t.forEach((e) => {
      const s = new L(e.x, e.y, e.z);
      this.points.push(s);
    });
  }
}
function Pt(n, t, e) {
  const s = new L(n.x, n.y, n.z), o = new L(t.x, t.y, t.z), i = [];
  for (let a = 0; a <= e; a++) {
    const c = a / e, h = (1 - c) * s.x + c * o.x, d = (1 - c) * s.y + c * o.y, p = (1 - c) * s.z + c * o.z, m = new L(h, d, p);
    i.push(m);
  }
  return new ot(i);
}
function ae(n, t, e) {
  const s = R.calculateDistance(n, t), o = Math.round(s / e) + 2;
  return Pt(n, t, o);
}
function ce(n) {
  let t = 0, e = 0, s = 0;
  return n.forEach((i) => {
    t += i.x, e += i.y, s += i.z;
  }), t = t / n.length, e = e / n.length, s = s / n.length, new L(t, e, s);
}
const it = {
  line_from_start_end_divisions: Pt,
  line_from_start_end_distance: ae,
  centroid: ce
};
async function le(n, t, e = 1e3, s = 1, o = 1) {
  const i = n.get_adjacency(), r = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
  let c, h;
  for (const w of i.keys())
    c = Math.random() * e, h = Math.random() * e, r.set(w, c), a.set(w, h);
  for (let w = 0; w < t; w++) {
    let b, E, z, x, D, I, A, N, j, T, P, S, B, q;
    for (const U of i.keys()) {
      const $ = i.get(U);
      b = r.get(U), E = a.get(U), z = [], x = [], $.forEach((Q) => {
        const Yt = r.get(Q), Vt = a.get(Q);
        z.push(Yt), x.push(Vt);
      }), P = R.calculateAverage(z), S = R.calculateAverage(x), D = [], I = [];
      let st, V, ut, pt;
      for (const Q of n.nodes.keys())
        Q != U && (ut = r.get(Q), pt = a.get(Q), st = ut - b, V = pt - E, I.push(st), D.push(V));
      j = o * 1 / (R.calculateAverage(I) * R.calculateAverage(I)), T = o * 1 / (R.calculateAverage(D) * R.calculateAverage(D)), A = s * (P - b), N = s * (S - E), B = s * (0 - b), q = s * (0 - E);
      const Ft = j + B + A + b, Ht = T + q + N + E;
      r.set(U, Ft), a.set(U, Ht);
    }
  }
  let d = /* @__PURE__ */ new Map();
  for (const w of r.keys())
    d.set(w, new L(r.get(w), 0, a.get(w)));
  const p = [], m = [], u = [];
  let l;
  for (const w of d.keys())
    l = d.get(w), p.push(l.x), m.push(l.y), u.push(l.z);
  const f = R.calculateAverage(p), y = R.calculateAverage(m), M = R.calculateAverage(u), _ = new L(
    -f,
    -y,
    -M
  );
  return d = At(d, _), d;
}
function he(n) {
  const t = n.get_adjacency(), e = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  for (const i of t.keys())
    e.set(i, Math.random() * 200), s.set(i, Math.random() * 200);
  const o = /* @__PURE__ */ new Map();
  for (const i of e.keys())
    o.set(i, new L(e.get(i), 0, s.get(i)));
  return o;
}
function Dt(n, t) {
  const e = /* @__PURE__ */ new Map();
  let s, o, i;
  for (const r of n.edges.keys()) {
    s = n.edges.get(r), o = n.nodes.get(s.start).data.pos, i = n.nodes.get(s.end).data.pos;
    const a = it.line_from_start_end_distance(
      o,
      i,
      t
    );
    e.set(r, a);
  }
  return e;
}
function de(n, t) {
  const e = /* @__PURE__ */ new Map();
  let s, o, i;
  for (const r of n.edges.keys()) {
    s = n.edges.get(r), o = n.nodes.get(s.start).data.pos, i = n.nodes.get(s.end).data.pos;
    const a = it.line_from_start_end_divisions(
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
  for (let _ of n.keys())
    s.set(_, new ot(n.get(_).points));
  let o, i, r, a, c, h, d, p, m, u, l, f, y, M;
  for (let _ = 0; _ < t; _++)
    for (let w of s.keys()) {
      o = s.get(w);
      for (let b = 1; b < o.points.length - 1; b++) {
        r = [], a = [], c = [], h = o.points[b];
        for (let z of s.keys())
          if (z != w) {
            i = s.get(z);
            for (let x = 1; x < i.points.length - 1; x++)
              d = i.points[x], p = R.calculateSquaredDistance(h, d), p <= Math.pow(e, 2) && (m = d.x - h.x, u = d.y - h.y, l = d.z - h.z, r.push(m), a.push(u), c.push(l));
          }
        f = h.x + 0.8 * (R.calculateAverage(r) || 0), y = h.y + 0.8 * (R.calculateAverage(a) || 0), M = h.z + 0.8 * (R.calculateAverage(c) || 0);
        const E = new L(f, y, M);
        o.points[b] = E;
      }
    }
  return s;
}
function ue(n, t) {
  const e = /* @__PURE__ */ new Map();
  for (let s of n.keys())
    e.set(s, new ot(n.get(s).points));
  for (const s of e.keys()) {
    const o = e.get(s);
    let i, r;
    for (let a = 0; a < o.points.length; a++)
      i = o.points[a], r = t * Math.sin(Math.PI * a / (o.points.length - 1)), i.y = i.y + r;
  }
  return e;
}
function pe(n, t, e) {
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
async function fe(n, t, e, s) {
  const o = n.get_adjacency(), i = await Et.Dijkstra(n, t);
  let r = 0;
  for (const f of i.values()) f > r && (r = f);
  if ([...o.keys()].some((f) => !i.has(f))) {
    r += 1;
    for (const f of o.keys()) i.has(f) || i.set(f, r);
  }
  const c = /* @__PURE__ */ new Map();
  for (let f = 0; f <= r; f++) {
    const y = [];
    for (const M of i.keys())
      f == i.get(M) && y.push(M);
    c.set(f, y);
  }
  const h = /* @__PURE__ */ new Map(), d = s.x || 0, p = s.y || 0, m = s.z || 0;
  for (const f of o.keys()) {
    const y = i.get(f) * e, M = c.get(i.get(f)), _ = 2 * Math.PI * (M.indexOf(f) / M.length), w = Math.sin(_) * y, b = Math.cos(_) * y, E = new L(w + d, -y + p, b + m);
    h.set(f, E);
  }
  n.apply_position_map(h);
  const u = Dt(n, 1), l = await vt(u, 12, 5);
  return { pmap: h, emap: l };
}
function me(n, t) {
  const e = n.get_map(), s = At(e.pmap, t), o = ge(e.emap, t);
  n.apply_drawing_maps({ pmap: s, emap: o });
}
function At(n, t) {
  const e = /* @__PURE__ */ new Map();
  for (let s of n.keys()) {
    const o = n.get(s);
    o.translate(t), e.set(s, o);
  }
  return e;
}
function ge(n, t) {
  const e = /* @__PURE__ */ new Map();
  let s, o, i;
  for (let r of n.keys()) {
    s = [], o = n.get(r);
    for (let a of o.points)
      a.translate(t), s.push(a);
    i = new ot(s), e.set(r, i);
  }
  return e;
}
function ye(n, t) {
  let e, s, o, i;
  for (const r of n.edges.keys())
    e = n.edges.get(r), s = n.nodes.get(e.start).data.pos, o = n.nodes.get(e.end).data.pos, i = it.line_from_start_end_distance(
      s,
      o,
      t
    ), e.data.ldata = i;
}
function _e(n, t) {
  let e, s, o, i;
  for (const r of n.edges.keys())
    e = n.edges.get(r), s = n.nodes.get(e.start).data.pos, o = n.nodes.get(e.end).data.pos, i = it.line_from_start_end_divisions(s, o, t), e.data.ldata = i;
}
const we = {
  SimulateKamadaKawai: le,
  DrawEdgeLines: Dt,
  DrawEdgeLinesDivisions: de,
  DrawEdgeBundling: vt,
  HivePlot: fe,
  DisplaceEdgeInY: ue,
  MoveGraph: me,
  InstanciateRandomPositions: he,
  DisplaceVertices: pe,
  // these two are special functions
  UpdateEdgeLinesDist: ye,
  UpdateEdgeLinesDivs: _e
};
async function be(n) {
  const t = n.split(/\r?\n/), e = [], s = /* @__PURE__ */ new Set();
  for (const a of t) {
    const c = a.trim();
    if (!c || c.startsWith("#")) continue;
    const h = c.split(/\s+/);
    if (h.length < 2) continue;
    const d = parseInt(h[0], 10), p = parseInt(h[1], 10);
    Number.isNaN(d) || Number.isNaN(p) || (e.push([d, p]), s.add(d), s.add(p));
  }
  const o = /* @__PURE__ */ new Map();
  for (const a of s)
    o.set(a, new X({ pos: new L(0, 0, 0) }));
  const i = /* @__PURE__ */ new Map();
  return e.forEach(([a, c], h) => {
    i.set(h, new G(a, c, {}));
  }), await Y.create(o, i);
}
async function Me() {
  const n = Qt;
  return await ee.ConstructGraphNodeEdgesList(n.nodes, n.edges);
}
async function xe() {
  const n = Jt, t = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map();
  n.nodes.forEach((i) => {
    const r = i.id, a = new L(i.px * 50, 0, i.py * 50), c = i.member, h = new X({ pos: a, size: 10, info: "Node Info", modularity: c });
    t.set(r, h);
  });
  for (let i = 0; i < n.edges.length; i++) {
    const r = n.edges[i], a = r[0], c = r[1], h = new G(a, c, {});
    e.set(i, h);
  }
  const s = await Y.create(t, e), o = we.DrawEdgeLines(s, 20);
  return s.apply_edge_pos_maps(o), s;
}
async function Ee(n) {
  const t = n.split(/\r?\n/), e = [], s = /* @__PURE__ */ new Set();
  for (const d of t) {
    const p = d.trim();
    if (!(!p || p.startsWith("#"))) {
      if (p.startsWith("v ")) {
        const m = p.slice(2).trim().split(/\s+/);
        if (m.length >= 3) {
          const u = parseFloat(m[0]), l = parseFloat(m[1]), f = parseFloat(m[2]);
          !Number.isNaN(u) && !Number.isNaN(l) && !Number.isNaN(f) && e.push(u, l, f);
        }
        continue;
      }
      if (p.startsWith("f ")) {
        const m = p.slice(2).trim().split(/\s+/), u = [];
        for (const l of m) {
          const f = parseInt(l.split("/")[0], 10);
          !Number.isNaN(f) && f >= 1 && u.push(f - 1);
        }
        for (let l = 0; l < u.length; l++) {
          const f = u[l], y = u[(l + 1) % u.length];
          if (f === y) continue;
          const M = f < y ? `${f},${y}` : `${y},${f}`;
          s.add(M);
        }
      }
    }
  }
  const o = e.length / 3, i = /* @__PURE__ */ new Map();
  for (let d = 0; d < o; d++)
    i.set(d, new X({ pos: new L(0, 0, 0) }));
  const r = /* @__PURE__ */ new Map();
  let a = 0;
  for (const d of s) {
    const [p, m] = d.split(",").map((u) => parseInt(u, 10));
    r.set(a++, new G(p, m, {}));
  }
  const c = await Y.create(i, r), h = new Float32Array(e);
  return { graph: c, positions: h };
}
async function Pe() {
  const { dwt_1005: n } = await import("./dwt_1005-C8KXz1aw.mjs"), t = n, e = /* @__PURE__ */ new Set();
  for (const h of Object.keys(t)) {
    const d = parseInt(h, 10);
    Number.isNaN(d) || e.add(d);
    for (const p of t[h]) e.add(p);
  }
  const s = /* @__PURE__ */ new Set();
  for (const h of Object.keys(t)) {
    const d = parseInt(h, 10);
    if (!Number.isNaN(d))
      for (const p of t[h]) {
        const m = Math.min(d, p), u = Math.max(d, p);
        s.add(`${m},${u}`);
      }
  }
  const o = /* @__PURE__ */ new Map(), i = [...e].sort((h, d) => h - d);
  for (const h of i)
    o.set(h, new X({ pos: new L(0, 0, 0) }));
  const r = /* @__PURE__ */ new Map();
  let a = 0;
  for (const h of s) {
    const [d, p] = h.split(",").map((m) => parseInt(m, 10));
    r.set(a++, new G(d, p, {}));
  }
  return await Y.create(o, r);
}
const xs = { LoadZKC: Me, LoadZKCSimulated: xe, LoadGraphFromEdgeListText: be, LoadGraphFromObjText: Ee, LoadDwt1005: Pe };
function De(n) {
  let t = 0, e = 0;
  for (const p of n)
    p.length < 2 || (t += p.length * 2, e += (p.length - 1) * 6);
  const s = new Float32Array(t * 3), o = new Float32Array(t * 3), i = new Float32Array(t * 3), r = new Float32Array(t), a = t > 65535 ? new Uint32Array(e) : new Uint16Array(e);
  let c = 0, h = 0;
  for (const p of n) {
    const m = p.length;
    if (m < 2) continue;
    const u = c;
    for (let l = 0; l < m; l++) {
      const f = p[l], y = l > 0 ? p[l - 1] : f, M = l < m - 1 ? p[l + 1] : f;
      for (let _ = -1; _ <= 1; _ += 2) {
        const w = c * 3;
        s[w] = f.x, s[w + 1] = f.y, s[w + 2] = f.z, o[w] = y.x, o[w + 1] = y.y, o[w + 2] = y.z, i[w] = M.x, i[w + 1] = M.y, i[w + 2] = M.z, r[c] = _, c++;
      }
    }
    for (let l = 0; l < m - 1; l++) {
      const f = u + l * 2;
      a[h++] = f, a[h++] = f + 1, a[h++] = f + 2, a[h++] = f + 2, a[h++] = f + 1, a[h++] = f + 3;
    }
  }
  const d = new g.BufferGeometry();
  return d.setAttribute("position", new g.BufferAttribute(s, 3)), d.setAttribute("positionPrev", new g.BufferAttribute(o, 3)), d.setAttribute("positionNext", new g.BufferAttribute(i, 3)), d.setAttribute("side", new g.BufferAttribute(r, 1)), d.setIndex(new g.BufferAttribute(a, 1)), d.computeBoundingSphere(), d;
}
const ve = `
attribute vec3 positionPrev;
attribute vec3 positionNext;
attribute float side;

uniform vec2 resolution;
uniform float lineWidth;

void main() {
  vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vec4 clipPrev = projectionMatrix * modelViewMatrix * vec4(positionPrev, 1.0);
  vec4 clipNext = projectionMatrix * modelViewMatrix * vec4(positionNext, 1.0);

  // Work in screen pixels so the width is the same along x and y on non-square canvases
  vec2 halfRes = resolution * 0.5;
  vec2 screenPrev = clipPrev.xy / clipPrev.w * halfRes;
  vec2 screenNext = clipNext.xy / clipNext.w * halfRes;

  vec2 dir = screenNext - screenPrev;
  float len = length(dir);
  dir = len > 0.0 ? dir / len : vec2(1.0, 0.0);
  vec2 perp = vec2(-dir.y, dir.x);

  vec2 offsetNdc = perp * side * (lineWidth * 0.5) / halfRes;
  clipPos.xy += offsetNdc * clipPos.w;

  gl_Position = clipPos;
}
`, Ae = `
uniform vec3 color;

void main() {
  gl_FragColor = vec4(color, 1.0);
}
`;
function Te(n = {}) {
  const t = n.color ?? 16777215, e = n.lineWidth ?? 2, s = n.resolution ?? new g.Vector2(800, 700), o = new g.Color(t);
  return new g.ShaderMaterial({
    uniforms: {
      resolution: { value: s },
      lineWidth: { value: e },
      color: { value: new g.Vector3(o.r, o.g, o.b) }
    },
    vertexShader: ve,
    fragmentShader: Ae,
    transparent: !1,
    depthTest: !0,
    side: g.DoubleSide
  });
}
const Ie = 2;
function Se(n) {
  return n >= 1 ? Math.max(1, Math.round(n)) : Math.max(1, Math.round(n * 100));
}
function Tt(n, t, e, s = Ie) {
  const o = [], i = [], r = [];
  for (const [p, m] of n.entries()) {
    if (!(m != null && m.points) || m.points.length < 2) continue;
    const u = m.points.map((l) => new g.Vector3(l.x * t, l.y * t, l.z * t));
    o.push(u);
    for (let l = 0; l < u.length - 1; l++) {
      const f = u[l], y = u[l + 1];
      i.push(f.x, f.y, f.z, y.x, y.y, y.z), r.push(p);
    }
  }
  const a = new g.Group();
  if (o.length === 0) return a;
  const c = Te({ color: e, lineWidth: Se(s) }), h = new g.Mesh(De(o), c);
  h.userData = { segmentEdgeIds: r };
  const d = new g.LineSegments(
    new g.BufferGeometry().setAttribute(
      "position",
      new g.Float32BufferAttribute(i, 3)
    )
  );
  return h.raycast = (p, m) => {
    d.matrixWorld.copy(h.matrixWorld);
    const u = [];
    d.raycast(p, u);
    for (const l of u) m.push({ ...l, object: h });
  }, h.onBeforeRender = (p) => {
    p.getSize(c.uniforms.resolution.value);
  }, a.add(h), a;
}
const ke = `
attribute float size;
attribute vec3 customColor;

varying vec3 vColor;

void main() {
    vColor = customColor;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = size * ( 300.0 / -mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
}
`, Ne = `
uniform vec3 color;
uniform sampler2D pointTexture;
uniform float alpha;

varying vec3 vColor;

void main() {
    gl_FragColor = vec4( color * vColor, alpha );
    gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
    // colors are linear (THREE.Color); convert to the renderer's output color space
    #include <colorspace_fragment>
}
`;
function It(n) {
  return new g.ShaderMaterial({
    uniforms: {
      color: { value: new g.Color(16777215) },
      // base color multiplied with per-vertex customColor
      pointTexture: {
        value: new g.TextureLoader().load("./Textures/Square.png")
      },
      alpha: { value: n }
    },
    vertexShader: ke,
    fragmentShader: Ne,
    transparent: n < 1,
    depthWrite: n >= 1
  });
}
function St(n, t = 1, e = 1, s = 16777215, o = 1) {
  const i = [], r = n.get_position_map();
  let a;
  const c = [];
  typeof e == "number" ? a = Array(n.nodes.size).fill(e) : a = e;
  const h = [], d = new g.Color(s);
  let p = 0, m;
  for (let y of n.nodes.keys())
    m = r.get(y), i.push(
      m.x * t,
      m.y * t,
      m.z * t
    ), d.toArray(c, p * 3), h.push(y), p += 1;
  const u = new g.BufferGeometry();
  u.setAttribute(
    "position",
    new g.Float32BufferAttribute(i, 3)
  ), u.setAttribute(
    "customColor",
    new g.Float32BufferAttribute(c, 3)
  ), u.setAttribute("size", new g.Float32BufferAttribute(a, 1)), u.setAttribute("label", new g.Int32BufferAttribute(h, 1)), u.name = "nodes";
  const l = It(o), f = new g.Group();
  return f.add(new g.Points(u, l)), f;
}
function Le(n, t = 1, e = 1, s = 16777215, o = 1) {
  const i = n.get_node_ids_order(), r = i.length, a = n.get_position_map(), c = [];
  let h;
  const d = [], p = i.slice(), m = new g.Color(s);
  for (let _ = 0; _ < r; _++) {
    const w = a.get(i[_]);
    c.push(
      w.x * t,
      w.y * t,
      w.z * t
    ), m.toArray(d, _ * 3);
  }
  typeof e == "number" ? h = Array(r).fill(e) : h = e;
  const u = new g.BufferGeometry();
  u.setAttribute(
    "position",
    new g.Float32BufferAttribute(c, 3)
  ), u.setAttribute(
    "customColor",
    new g.Float32BufferAttribute(d, 3)
  ), u.setAttribute("size", new g.Float32BufferAttribute(h, 1)), u.setAttribute("label", new g.Int32BufferAttribute(p, 1)), u.name = "nodes";
  const l = It(o), f = new g.Group();
  f.add(new g.Points(u, l));
  const y = u.getAttribute("position");
  function M(_) {
    const w = y.array;
    if (_ instanceof Float32Array)
      for (let b = 0; b < r * 3; b++)
        w[b] = _[b] * t;
    else
      for (let b = 0; b < r; b++) {
        const E = _.get(i[b]);
        w[b * 3] = E.x * t, w[b * 3 + 1] = E.y * t, w[b * 3 + 2] = E.z * t;
      }
    y.needsUpdate = !0;
  }
  return { group: f, updatePositions: M };
}
function ze(n, t = 1, e = 16777215, s = 0.4) {
  const o = n.get_edge_map();
  return kt(o, t, e, s);
}
function kt(n, t, e = 16777215, s = 0.4) {
  return Tt(n, t, e, s);
}
function Ce(n, t = 1, e = 16777215) {
  const s = n.get_edge_map();
  return Nt(s, t, e);
}
function je(n, t = 1, e = 16777215) {
  const s = new g.LineSegments(
    new g.BufferGeometry(),
    new g.LineBasicMaterial({ color: e })
  ), o = new g.Group();
  o.add(s);
  function i() {
    const { positions: r, segmentEdgeIds: a } = Lt(n.get_edge_map(), t), c = s.geometry.getAttribute("position");
    c && c.array.length === r.length ? (c.array.set(r), c.needsUpdate = !0, s.geometry.boundingSphere = null) : (s.geometry.dispose(), s.geometry = new g.BufferGeometry(), s.geometry.setAttribute("position", new g.BufferAttribute(r, 3))), s.userData = { segmentEdgeIds: a };
  }
  return i(), { group: o, updateEdges: i };
}
function Oe(n, t, e, s = 16777215, o = 5) {
  const i = n.get_position_map(), r = e.map((c) => i.get(c)).filter((c) => c != null);
  if (r.length < 2) return new g.Group();
  const a = new ot(r);
  return Tt(/* @__PURE__ */ new Map([[0, a]]), t, s, o);
}
function Nt(n, t = 1, e = 16777215) {
  const { positions: s, segmentEdgeIds: o } = Lt(n, t), i = new g.BufferGeometry();
  i.setAttribute("position", new g.BufferAttribute(s, 3));
  const r = new g.LineSegments(
    i,
    new g.LineBasicMaterial({ color: e })
  );
  r.userData = { segmentEdgeIds: o };
  const a = new g.Group();
  return a.add(r), a;
}
function Lt(n, t) {
  let e = 0;
  for (const r of n.values()) e += Math.max(0, r.points.length - 1);
  const s = new Float32Array(e * 6), o = [];
  let i = 0;
  for (const [r, a] of n.entries()) {
    const c = a.points;
    for (let h = 0; h < c.length - 1; h++) {
      const d = c[h], p = c[h + 1];
      s[i++] = d.x * t, s[i++] = d.y * t, s[i++] = d.z * t, s[i++] = p.x * t, s[i++] = p.y * t, s[i++] = p.z * t, o.push(r);
    }
  }
  return { positions: s, segmentEdgeIds: o };
}
const K = new g.Matrix4(), Z = new g.Vector3(), tt = new g.Quaternion(), W = new g.Vector3();
function zt(n, t = 1, e = 16777215, s = 10) {
  const o = n.size, i = Array.from(n.entries()), r = typeof s == "number" ? Array(o).fill(s) : s, a = new g.BoxGeometry(1, 1, 1), c = new g.MeshBasicMaterial({ color: e }), h = new g.InstancedMesh(a, c, o);
  h.name = "boxVertices", tt.identity();
  for (let p = 0; p < o; p++) {
    const m = i[p][1], u = r[p];
    Z.set(
      m.x * t,
      m.y * t,
      m.z * t
    ), W.set(u, u, u), K.compose(
      Z,
      tt,
      W
    ), h.setMatrixAt(p, K);
  }
  h.instanceMatrix.needsUpdate = !0, h.userData = { nodeIds: i.map((p) => p[0]) };
  const d = new g.Group();
  return d.add(h), d;
}
function Re(n, t = 1, e = 16777215, s = 10) {
  const o = n.get_node_ids_order(), i = o.length, r = n.get_position_map(), a = typeof s == "number" ? Array(i).fill(s) : s, c = new g.BoxGeometry(1, 1, 1), h = new g.MeshBasicMaterial({ color: e }), d = new g.InstancedMesh(c, h, i);
  d.name = "boxVertices", tt.identity();
  for (let u = 0; u < i; u++) {
    const l = r.get(o[u]), f = a[u];
    Z.set(
      l.x * t,
      l.y * t,
      l.z * t
    ), W.set(f, f, f), K.compose(
      Z,
      tt,
      W
    ), d.setMatrixAt(u, K);
  }
  d.instanceMatrix.needsUpdate = !0, d.userData = { nodeIds: o.slice() };
  const p = new g.Group();
  p.add(d);
  function m(u) {
    if (u instanceof Float32Array)
      for (let l = 0; l < i; l++)
        Z.set(
          u[l * 3] * t,
          u[l * 3 + 1] * t,
          u[l * 3 + 2] * t
        ), W.set(a[l], a[l], a[l]), K.compose(
          Z,
          tt,
          W
        ), d.setMatrixAt(l, K);
    else
      for (let l = 0; l < i; l++) {
        const f = u.get(o[l]);
        Z.set(f.x * t, f.y * t, f.z * t), W.set(a[l], a[l], a[l]), K.compose(
          Z,
          tt,
          W
        ), d.setMatrixAt(l, K);
      }
    d.instanceMatrix.needsUpdate = !0;
  }
  return { group: p, updatePositions: m };
}
function Be(n, t = 1, e = 16777215, s = 10) {
  const o = n.get_position_map();
  return zt(o, t, e, s);
}
function Ue(n, t = 16, e = 16777215, s = 10) {
  let o;
  typeof s == "number" ? o = Array(n.size).fill(s) : o = s;
  const i = new g.Group(), r = new g.MeshBasicMaterial({ color: e });
  let a = 0;
  for (const [c, h] of n) {
    const d = typeof o == "number" ? o : o[a], p = 2 * d * Math.PI, m = Math.ceil(p / t), u = new g.CylinderGeometry(d, d, 10, m);
    u.name = String(c);
    const l = new g.Mesh(u, r);
    l.position.set(h.x, h.y, h.z), i.add(l), a += 1;
  }
  return i;
}
async function Fe(n, t) {
  const e = /* @__PURE__ */ new Map();
  let s, o;
  for (let m of n.nodes.keys()) {
    s = n.nodes.get(m);
    const u = s.data[t];
    o = typeof u == "number" ? u : u != null ? Number(u) : void 0, o !== void 0 && (e.has(o) ? e.get(o).push(m) : e.set(o, [m]));
  }
  const i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
  let a, c, h, d;
  for (let m of e.keys())
    a = e.get(m), c = await Et.SelectSubgraph(n, a), h = St(c, 1), i.set(m, h), d = Ct(c, 0.03), r.set(m, d);
  return {
    nodeGroups: i,
    EdgeGroups: r
  };
}
function Ct(n, t, e = 16777215) {
  const s = new g.Group(), o = new g.LineBasicMaterial({ color: e });
  let i, r, a;
  for (let c of n.edges.values())
    if (Math.random() <= t) {
      i = n.nodes.get(c.start).data.pos, r = n.nodes.get(c.end).data.pos, a = [], a.push(new g.Vector3(i.x, i.y, i.z)), a.push(new g.Vector3(r.x, r.y, r.z));
      const h = new g.BufferGeometry().setFromPoints(a), d = new g.Line(h, o);
      s.add(d);
    }
  return s;
}
function He(n, t, e) {
  try {
    const s = n instanceof g.Group ? n.children[0] : n, o = s == null ? void 0 : s.geometry;
    if (!(o != null && o.attributes)) return;
    const i = o.attributes.customColor, r = i == null ? void 0 : i.array;
    if (!r || r.length === 0) return;
    const a = new g.Color(e), c = o.attributes.label, h = c == null ? void 0 : c.array;
    h && h.length > 0 ? t.forEach((d) => {
      for (let p = 0; p < h.length; p++)
        if (h[p] === d) {
          const m = p * 3;
          m + 2 < r.length && (r[m] = a.r, r[m + 1] = a.g, r[m + 2] = a.b);
          break;
        }
    }) : t.forEach((d) => {
      const p = d * 3;
      p + 2 < r.length && (r[p] = a.r, r[p + 1] = a.g, r[p + 2] = a.b);
    }), i && (i.needsUpdate = !0);
  } catch {
  }
}
function Ye(n) {
  var t, e;
  try {
    const s = n instanceof g.Group ? n.children[0] : n, o = (e = (t = s == null ? void 0 : s.geometry) == null ? void 0 : t.attributes) == null ? void 0 : e.customColor, i = o == null ? void 0 : o.array;
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
const Es = {
  DrawTHREEGraphVertices: St,
  DrawTHREEGraphVerticesMutable: Le,
  DrawTHREEGraphEdgesThick: ze,
  DrawTHREEGraphEdgesThin: Ce,
  DrawTHREEGraphEdgesThinMutable: je,
  DrawThickPathFromNodeIds: Oe,
  AddBoxBasedImaging: zt,
  AddInModularityBasedPointGroups: Fe,
  DrawThinEdgesFromEdgeMap: Nt,
  DrawThickEdgesFromEdgeMap: kt,
  AddCylinderBasedImaging: Ue,
  DrawSimplifiedEdges: Ct,
  ChangeTheVertexColours: He,
  ResetVertexColors: Ye,
  DrawTHREEBoxBasedVertices: Be,
  DrawTHREEBoxBasedVerticesMutable: Re
}, gt = { type: "change" }, dt = { type: "start" }, jt = { type: "end" }, rt = new Kt(), yt = new Zt(), Ve = Math.cos(70 * Wt.DEG2RAD), k = new H(), O = 2 * Math.PI, v = {
  NONE: -1,
  ROTATE: 0,
  DOLLY: 1,
  PAN: 2,
  TOUCH_ROTATE: 3,
  TOUCH_PAN: 4,
  TOUCH_DOLLY_PAN: 5,
  TOUCH_DOLLY_ROTATE: 6
}, ct = 1e-6;
class Ge extends Gt {
  constructor(t, e = null) {
    super(t, e), this.state = v.NONE, this.enabled = !0, this.target = new H(), this.cursor = new H(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minTargetRadius = 0, this.maxTargetRadius = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = 0.05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.zoomToCursor = !1, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: et.ROTATE, MIDDLE: et.DOLLY, RIGHT: et.PAN }, this.touches = { ONE: J.ROTATE, TWO: J.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this._lastPosition = new H(), this._lastQuaternion = new ft(), this._lastTargetPosition = new H(), this._quat = new ft().setFromUnitVectors(t.up, new H(0, 1, 0)), this._quatInverse = this._quat.clone().invert(), this._spherical = new mt(), this._sphericalDelta = new mt(), this._scale = 1, this._panOffset = new H(), this._rotateStart = new F(), this._rotateEnd = new F(), this._rotateDelta = new F(), this._panStart = new F(), this._panEnd = new F(), this._panDelta = new F(), this._dollyStart = new F(), this._dollyEnd = new F(), this._dollyDelta = new F(), this._dollyDirection = new H(), this._mouse = new F(), this._performCursorZoom = !1, this._pointers = [], this._pointerPositions = {}, this._controlActive = !1, this._onPointerMove = Ze.bind(this), this._onPointerDown = Ke.bind(this), this._onPointerUp = We.bind(this), this._onContextMenu = es.bind(this), this._onMouseWheel = $e.bind(this), this._onKeyDown = Qe.bind(this), this._onTouchStart = Je.bind(this), this._onTouchMove = ts.bind(this), this._onMouseDown = Xe.bind(this), this._onMouseMove = qe.bind(this), this._interceptControlDown = ss.bind(this), this._interceptControlUp = ns.bind(this), this.domElement !== null && this.connect(), this.update();
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
    this.target.copy(this.target0), this.object.position.copy(this.position0), this.object.zoom = this.zoom0, this.object.updateProjectionMatrix(), this.dispatchEvent(gt), this.update(), this.state = v.NONE;
  }
  update(t = null) {
    const e = this.object.position;
    k.copy(e).sub(this.target), k.applyQuaternion(this._quat), this._spherical.setFromVector3(k), this.autoRotate && this.state === v.NONE && this._rotateLeft(this._getAutoRotationAngle(t)), this.enableDamping ? (this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor, this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor) : (this._spherical.theta += this._sphericalDelta.theta, this._spherical.phi += this._sphericalDelta.phi);
    let s = this.minAzimuthAngle, o = this.maxAzimuthAngle;
    isFinite(s) && isFinite(o) && (s < -Math.PI ? s += O : s > Math.PI && (s -= O), o < -Math.PI ? o += O : o > Math.PI && (o -= O), s <= o ? this._spherical.theta = Math.max(s, Math.min(o, this._spherical.theta)) : this._spherical.theta = this._spherical.theta > (s + o) / 2 ? Math.max(s, this._spherical.theta) : Math.min(o, this._spherical.theta)), this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi)), this._spherical.makeSafe(), this.enableDamping === !0 ? this.target.addScaledVector(this._panOffset, this.dampingFactor) : this.target.add(this._panOffset), this.target.sub(this.cursor), this.target.clampLength(this.minTargetRadius, this.maxTargetRadius), this.target.add(this.cursor);
    let i = !1;
    if (this.zoomToCursor && this._performCursorZoom || this.object.isOrthographicCamera)
      this._spherical.radius = this._clampDistance(this._spherical.radius);
    else {
      const r = this._spherical.radius;
      this._spherical.radius = this._clampDistance(this._spherical.radius * this._scale), i = r != this._spherical.radius;
    }
    if (k.setFromSpherical(this._spherical), k.applyQuaternion(this._quatInverse), e.copy(this.target).add(k), this.object.lookAt(this.target), this.enableDamping === !0 ? (this._sphericalDelta.theta *= 1 - this.dampingFactor, this._sphericalDelta.phi *= 1 - this.dampingFactor, this._panOffset.multiplyScalar(1 - this.dampingFactor)) : (this._sphericalDelta.set(0, 0, 0), this._panOffset.set(0, 0, 0)), this.zoomToCursor && this._performCursorZoom) {
      let r = null;
      if (this.object.isPerspectiveCamera) {
        const a = k.length();
        r = this._clampDistance(a * this._scale);
        const c = a - r;
        this.object.position.addScaledVector(this._dollyDirection, c), this.object.updateMatrixWorld(), i = !!c;
      } else if (this.object.isOrthographicCamera) {
        const a = new H(this._mouse.x, this._mouse.y, 0);
        a.unproject(this.object);
        const c = this.object.zoom;
        this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), this.object.updateProjectionMatrix(), i = c !== this.object.zoom;
        const h = new H(this._mouse.x, this._mouse.y, 0);
        h.unproject(this.object), this.object.position.sub(h).add(a), this.object.updateMatrixWorld(), r = k.length();
      } else
        console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), this.zoomToCursor = !1;
      r !== null && (this.screenSpacePanning ? this.target.set(0, 0, -1).transformDirection(this.object.matrix).multiplyScalar(r).add(this.object.position) : (rt.origin.copy(this.object.position), rt.direction.set(0, 0, -1).transformDirection(this.object.matrix), Math.abs(this.object.up.dot(rt.direction)) < Ve ? this.object.lookAt(this.target) : (yt.setFromNormalAndCoplanarPoint(this.object.up, this.target), rt.intersectPlane(yt, this.target))));
    } else if (this.object.isOrthographicCamera) {
      const r = this.object.zoom;
      this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), r !== this.object.zoom && (this.object.updateProjectionMatrix(), i = !0);
    }
    return this._scale = 1, this._performCursorZoom = !1, i || this._lastPosition.distanceToSquared(this.object.position) > ct || 8 * (1 - this._lastQuaternion.dot(this.object.quaternion)) > ct || this._lastTargetPosition.distanceToSquared(this.target) > ct ? (this.dispatchEvent(gt), this._lastPosition.copy(this.object.position), this._lastQuaternion.copy(this.object.quaternion), this._lastTargetPosition.copy(this.target), !0) : !1;
  }
  _getAutoRotationAngle(t) {
    return t !== null ? O / 60 * this.autoRotateSpeed * t : O / 60 / 60 * this.autoRotateSpeed;
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
    k.setFromMatrixColumn(e, 0), k.multiplyScalar(-t), this._panOffset.add(k);
  }
  _panUp(t, e) {
    this.screenSpacePanning === !0 ? k.setFromMatrixColumn(e, 1) : (k.setFromMatrixColumn(e, 0), k.crossVectors(this.object.up, k)), k.multiplyScalar(t), this._panOffset.add(k);
  }
  // deltaX and deltaY are in pixels; right and down are positive
  _pan(t, e) {
    const s = this.domElement;
    if (this.object.isPerspectiveCamera) {
      const o = this.object.position;
      k.copy(o).sub(this.target);
      let i = k.length();
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
    this._rotateLeft(O * this._rotateDelta.x / e.clientHeight), this._rotateUp(O * this._rotateDelta.y / e.clientHeight), this._rotateStart.copy(this._rotateEnd), this.update();
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
        t.ctrlKey || t.metaKey || t.shiftKey ? this._rotateUp(O * this.rotateSpeed / this.domElement.clientHeight) : this._pan(0, this.keyPanSpeed), e = !0;
        break;
      case this.keys.BOTTOM:
        t.ctrlKey || t.metaKey || t.shiftKey ? this._rotateUp(-O * this.rotateSpeed / this.domElement.clientHeight) : this._pan(0, -this.keyPanSpeed), e = !0;
        break;
      case this.keys.LEFT:
        t.ctrlKey || t.metaKey || t.shiftKey ? this._rotateLeft(O * this.rotateSpeed / this.domElement.clientHeight) : this._pan(this.keyPanSpeed, 0), e = !0;
        break;
      case this.keys.RIGHT:
        t.ctrlKey || t.metaKey || t.shiftKey ? this._rotateLeft(-O * this.rotateSpeed / this.domElement.clientHeight) : this._pan(-this.keyPanSpeed, 0), e = !0;
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
    this._rotateLeft(O * this._rotateDelta.x / e.clientHeight), this._rotateUp(O * this._rotateDelta.y / e.clientHeight), this._rotateStart.copy(this._rotateEnd);
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
function We(n) {
  switch (this._removePointer(n), this._pointers.length) {
    case 0:
      this.domElement.releasePointerCapture(n.pointerId), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.dispatchEvent(jt), this.state = v.NONE;
      break;
    case 1:
      const t = this._pointers[0], e = this._pointerPositions[t];
      this._onTouchStart({ pointerId: t, pageX: e.x, pageY: e.y });
      break;
  }
}
function Xe(n) {
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
    case et.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseDownDolly(n), this.state = v.DOLLY;
      break;
    case et.ROTATE:
      if (n.ctrlKey || n.metaKey || n.shiftKey) {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(n), this.state = v.PAN;
      } else {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(n), this.state = v.ROTATE;
      }
      break;
    case et.PAN:
      if (n.ctrlKey || n.metaKey || n.shiftKey) {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(n), this.state = v.ROTATE;
      } else {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(n), this.state = v.PAN;
      }
      break;
    default:
      this.state = v.NONE;
  }
  this.state !== v.NONE && this.dispatchEvent(dt);
}
function qe(n) {
  switch (this.state) {
    case v.ROTATE:
      if (this.enableRotate === !1) return;
      this._handleMouseMoveRotate(n);
      break;
    case v.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseMoveDolly(n);
      break;
    case v.PAN:
      if (this.enablePan === !1) return;
      this._handleMouseMovePan(n);
      break;
  }
}
function $e(n) {
  this.enabled === !1 || this.enableZoom === !1 || this.state !== v.NONE || (n.preventDefault(), this.dispatchEvent(dt), this._handleMouseWheel(this._customWheelEvent(n)), this.dispatchEvent(jt));
}
function Qe(n) {
  this.enabled === !1 || this.enablePan === !1 || this._handleKeyDown(n);
}
function Je(n) {
  switch (this._trackPointer(n), this._pointers.length) {
    case 1:
      switch (this.touches.ONE) {
        case J.ROTATE:
          if (this.enableRotate === !1) return;
          this._handleTouchStartRotate(n), this.state = v.TOUCH_ROTATE;
          break;
        case J.PAN:
          if (this.enablePan === !1) return;
          this._handleTouchStartPan(n), this.state = v.TOUCH_PAN;
          break;
        default:
          this.state = v.NONE;
      }
      break;
    case 2:
      switch (this.touches.TWO) {
        case J.DOLLY_PAN:
          if (this.enableZoom === !1 && this.enablePan === !1) return;
          this._handleTouchStartDollyPan(n), this.state = v.TOUCH_DOLLY_PAN;
          break;
        case J.DOLLY_ROTATE:
          if (this.enableZoom === !1 && this.enableRotate === !1) return;
          this._handleTouchStartDollyRotate(n), this.state = v.TOUCH_DOLLY_ROTATE;
          break;
        default:
          this.state = v.NONE;
      }
      break;
    default:
      this.state = v.NONE;
  }
  this.state !== v.NONE && this.dispatchEvent(dt);
}
function ts(n) {
  switch (this._trackPointer(n), this.state) {
    case v.TOUCH_ROTATE:
      if (this.enableRotate === !1) return;
      this._handleTouchMoveRotate(n), this.update();
      break;
    case v.TOUCH_PAN:
      if (this.enablePan === !1) return;
      this._handleTouchMovePan(n), this.update();
      break;
    case v.TOUCH_DOLLY_PAN:
      if (this.enableZoom === !1 && this.enablePan === !1) return;
      this._handleTouchMoveDollyPan(n), this.update();
      break;
    case v.TOUCH_DOLLY_ROTATE:
      if (this.enableZoom === !1 && this.enableRotate === !1) return;
      this._handleTouchMoveDollyRotate(n), this.update();
      break;
    default:
      this.state = v.NONE;
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
  if (t instanceof g.Points) {
    const s = t.geometry, o = (e = s == null ? void 0 : s.attributes) == null ? void 0 : e.label;
    return o && n.index != null ? o.array[n.index] ?? null : null;
  }
  if (t instanceof g.InstancedMesh && n.instanceId != null) {
    const s = t.userData.nodeIds;
    return s && n.instanceId < s.length ? s[n.instanceId] : null;
  }
  return null;
}
function is(n) {
  const { edgeId: t, segmentEdgeIds: e } = n.object.userData;
  return e && n.index != null ? e[Math.floor(n.index / 2)] ?? null : t ?? null;
}
function _t(n, t) {
  var s, o;
  const e = n.nodes.get(t);
  return {
    nodeId: t,
    data: (e == null ? void 0 : e.data) ?? {},
    neighbours: ((s = e == null ? void 0 : e.neighbours) == null ? void 0 : s.slice()) ?? [],
    position: ((o = e == null ? void 0 : e.data) == null ? void 0 : o.pos) ?? void 0
  };
}
function wt(n, t) {
  const e = n.edges.get(t);
  return e ? {
    edgeId: t,
    start: e.start,
    end: e.end,
    data: e.data ?? {}
  } : null;
}
const at = new g.Vector3(), bt = new g.Plane(), Mt = new g.Vector3();
class rs {
  constructor(t, e, s, o, i) {
    this.lastHoverNodeId = null, this.lastHoverEdgeId = null, this.dragNodeId = null, this.wasDragging = !1, this.scene = t, this.camera = e, this.domElement = s, this.graph = o, this.options = i, this.raycaster = new g.Raycaster(), this.mouse = new g.Vector2(), this.hoverEnabled = i.hoverEnabled !== !1, this.controls = i.controls, this.raycaster.params.Line = { threshold: 5 }, this.raycaster.params.Points = { threshold: 10 }, this.boundOnClick = this.onClick.bind(this), this.boundOnPointerMove = this.onPointerMove.bind(this), this.boundOnPointerDown = this.onPointerDown.bind(this), this.boundOnPointerUp = this.onPointerUp.bind(this);
    const r = !!(i.enableNodeDrag && i.onNodeDrag);
    s.addEventListener("click", this.boundOnClick), (this.hoverEnabled || r) && s.addEventListener("pointermove", this.boundOnPointerMove), r && (s.addEventListener("pointerdown", this.boundOnPointerDown), s.addEventListener("pointerup", this.boundOnPointerUp), s.addEventListener("pointerleave", this.boundOnPointerUp));
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
    if (e != null && this.options.onNodeClick && this.options.onNodeClick(_t(this.graph, e)), s != null && this.options.onEdgeClick) {
      const o = wt(this.graph, s);
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
    var e, s;
    if (this.dragNodeId == null) return null;
    const t = (s = (e = this.graph.nodes.get(this.dragNodeId)) == null ? void 0 : e.data) == null ? void 0 : s.pos;
    return t ? (Mt.set(0, 0, -1).applyQuaternion(this.camera.quaternion), bt.setFromNormalAndCoplanarPoint(Mt, new g.Vector3(t.x, t.y, t.z)), this.raycaster.setFromCamera(this.mouse, this.camera), this.raycaster.ray.intersectPlane(bt, at) ? { x: at.x, y: at.y, z: at.z } : null) : null;
  }
  onPointerMove(t) {
    if (this.getMouseNDC(t), this.dragNodeId != null && this.options.onNodeDrag) {
      const o = this.getDragPosition();
      o && this.options.onNodeDrag(this.dragNodeId, o);
      return;
    }
    if (!this.hoverEnabled) return;
    const { nodeId: e, edgeId: s } = this.pick();
    this.fireHoverCallbacks(e, s);
  }
  fireHoverCallbacks(t, e) {
    if (this.options.onNodeHover && (t != null ? t !== this.lastHoverNodeId && (this.lastHoverNodeId = t, this.options.onNodeHover(_t(this.graph, t))) : this.lastHoverNodeId != null && (this.lastHoverNodeId = null, this.options.onNodeHover(null))), this.options.onEdgeHover)
      if (e != null) {
        if (e !== this.lastHoverEdgeId) {
          this.lastHoverEdgeId = e;
          const s = wt(this.graph, e);
          s && this.options.onEdgeHover(s);
        }
      } else
        this.lastHoverEdgeId != null && (this.lastHoverEdgeId = null, this.options.onEdgeHover(null));
  }
}
class as {
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
   * @param GraphDrawerOptions3d - `{ canvas, width, height }` plus an optional `graph`. The other
   *   fields are created by the drawer; they are accepted only for backwards compatibility and ignored.
   */
  constructor(t) {
    this.canvas = t.canvas, this.width = t.width, this.height = t.height, this.geometryMap = /* @__PURE__ */ new Map(), this.materialMap = /* @__PURE__ */ new Map(), this.meshMap = /* @__PURE__ */ new Map(), this.controls, this.renderer, this.camera, this.scene, this.graphs = /* @__PURE__ */ new Map(), t.graph && this.graphs.set(0, t.graph);
  }
  /**
   * This essentially initializes the drawing element based on the settings
   * Remember to do this since if if its not done the scene will not render
   */
  async init() {
    const t = performance.now();
    this.camera = new g.PerspectiveCamera(), this.scene = new g.Scene(), this.renderer = new g.WebGLRenderer({
      canvas: this.canvas,
      antialias: !0
    }), this.renderer.setSize(this.width, this.height), this.renderer.setClearColor(16711935, 0), this.camera.aspect = this.width / this.height, this.camera.updateProjectionMatrix(), this.scene.add(new g.AmbientLight(16777215));
    const e = new g.DirectionalLight(16777215, 1);
    e.position.set(0, 10, 0), this.scene.add(e), this.controls = new Ge(this.camera, this.renderer.domElement), this.camera.position.set(0, 100, 100), this.controls.autoRotate = !0, this.controls.maxPolarAngle = Math.PI * 0.5, this.controls.maxDistance = 1e4, this.controls.minDistance = 10, this.controls.update();
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
    this.interactionLayer = new rs(
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
const Ps = {
  GraphDrawer3d: as
};
async function cs(n, t) {
  const e = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  let o;
  for (let c = 0; c < n; c++)
    o = new X({}), e.set(c, o);
  let i, r, a = 0;
  for (let c = 0; c < n; c++)
    for (let h = c + 1; h < n; h++)
      i = Math.random(), t > i && (r = new G(c, h, {}), s.set(a, r), a += 1);
  return Y.create(e, s);
}
const Ds = { GenerateErdosReyni_n_p: cs };
function ls(n, t) {
  const e = n.x - t.x, s = n.y - t.y, o = n.z - t.z;
  return e * e + s * s + o * o;
}
function Ot(n) {
  return ["x", "y", "z"][n % 3];
}
function ht(n, t) {
  if (n.length === 0) return null;
  if (n.length === 1) return { item: n[0] };
  const e = Ot(t), s = [...n].sort((c, h) => c.point[e] - h.point[e]), o = Math.floor(s.length / 2), i = s[o], r = o > 0 ? ht(s.slice(0, o), t + 1) : null, a = o + 1 < s.length ? ht(s.slice(o + 1), t + 1) : null;
  return { left: r ?? void 0, right: a ?? void 0, item: i };
}
function nt(n, t, e, s, o) {
  if (n === null) return;
  const i = Ot(s);
  ls(t, n.item.point) <= e && o.push(n.item.nodeId);
  const a = t[i] - n.item.point[i], c = a * a;
  a <= 0 ? (n.left && nt(n.left, t, e, s + 1, o), n.right && c <= e && nt(n.right, t, e, s + 1, o)) : (n.right && nt(n.right, t, e, s + 1, o), n.left && c <= e && nt(n.left, t, e, s + 1, o));
}
function hs(n, t) {
  const e = ht(n, 0), s = t * t, o = /* @__PURE__ */ new Map();
  for (const { point: i, nodeId: r } of n) {
    const a = [];
    e && nt(e, i, s, 0, a), o.set(r, a);
  }
  return o;
}
class ds {
  constructor() {
    this.parent = /* @__PURE__ */ new Map(), this.size = /* @__PURE__ */ new Map();
  }
  // Iterative with path compression: recursion overflowed the stack on long chains.
  find(t) {
    if (!this.parent.has(t))
      return this.parent.set(t, t), this.size.set(t, 1), t;
    let e = t;
    for (; this.parent.get(e) !== e; ) e = this.parent.get(e);
    for (; t !== e; ) {
      const s = this.parent.get(t);
      this.parent.set(t, e), t = s;
    }
    return e;
  }
  // Union by size keeps trees shallow.
  union(t, e) {
    let s = this.find(t), o = this.find(e);
    s !== o && (this.size.get(s) > this.size.get(o) && ([s, o] = [o, s]), this.parent.set(s, o), this.size.set(o, this.size.get(s) + this.size.get(o)));
  }
}
function us() {
  return {
    cluster(n, t) {
      const { distanceThreshold: e } = t, s = n.get_position_map(), o = [];
      for (const [u, l] of s)
        o.push({ point: l, nodeId: u });
      if (o.length === 0)
        return { nodeToCluster: /* @__PURE__ */ new Map(), clusterCentroids: /* @__PURE__ */ new Map(), clusterIds: [] };
      const i = hs(o, e), r = new ds();
      for (const [u, l] of i)
        for (const f of l)
          r.union(u, f);
      const a = /* @__PURE__ */ new Map();
      let c = 0;
      const h = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map();
      for (const { nodeId: u } of o) {
        const l = r.find(u);
        a.has(l) || a.set(l, c++);
        const f = a.get(l);
        h.set(u, f), d.has(f) || d.set(f, []), d.get(f).push(u);
      }
      const p = /* @__PURE__ */ new Map();
      for (const [u, l] of d) {
        const f = l.map((y) => s.get(y));
        p.set(u, it.centroid(f));
      }
      const m = [...d.keys()];
      return { nodeToCluster: h, clusterCentroids: p, clusterIds: m };
    }
  };
}
async function Rt(n, t) {
  const { nodeToCluster: e, clusterCentroids: s, clusterIds: o } = t, i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
  for (const p of o) {
    const m = s.get(p), u = new X({ pos: m });
    i.set(p, u);
  }
  const a = /* @__PURE__ */ new Map(), c = (p, m) => p <= m ? `${p},${m}` : `${m},${p}`;
  for (const [, p] of n.edges) {
    const m = e.get(p.start), u = e.get(p.end);
    if (m === void 0 || u === void 0 || m === u) continue;
    const l = c(m, u);
    a.set(l, (a.get(l) ?? 0) + 1);
  }
  let h = 0;
  for (const [p, m] of a) {
    const [u, l] = p.split(",").map(Number);
    r.set(h++, new G(u, l, { count: m }));
  }
  const d = new Y(i, r);
  return await d.initialize(), d;
}
async function ps(n, t) {
  const s = us().cluster(n, t);
  return Rt(n, s);
}
async function fs(n, t, e) {
  const s = t.cluster(n, e);
  return Rt(n, s);
}
const vs = {
  clusterByDistance: ps,
  clusterByStrategy: fs
};
function As(n, t, e, s) {
  for (let o = 0; o < t; o++) {
    let i = 0;
    for (let r = 0; r < t; r++) i += n[o * t + r] * e[r];
    s[o] = i;
  }
}
function Ts(n) {
  let t = 0;
  for (let s = 0; s < n.length; s++) t += n[s] * n[s];
  const e = Math.sqrt(t);
  if (e > 0) for (let s = 0; s < n.length; s++) n[s] /= e;
}
const ms = 64;
function Bt(n, t, e, s, o, i = 0) {
  if (n.length === 0) return null;
  if (n.length === 1) {
    const M = n[0];
    return {
      cx: M.x,
      cy: M.y,
      cz: M.z,
      count: 1,
      size: o,
      children: null,
      point: M
    };
  }
  if (i >= ms) {
    let M = 0, _ = 0, w = 0;
    for (const E of n)
      M += E.x, _ += E.y, w += E.z;
    const b = n.length;
    return { cx: M / b, cy: _ / b, cz: w / b, count: b, size: o, children: null, point: null };
  }
  const r = t + o, a = e + o, c = s + o, h = o / 2, d = [[], [], [], [], [], [], [], []];
  for (const M of n) {
    let _ = 0;
    M.x >= r && (_ |= 1), M.y >= a && (_ |= 2), M.z >= c && (_ |= 4), d[_].push(M);
  }
  let p = 0, m = 0, u = 0, l = 0;
  const f = [], y = [
    [0, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
    [1, 1, 0],
    [0, 0, 1],
    [1, 0, 1],
    [0, 1, 1],
    [1, 1, 1]
  ];
  for (let M = 0; M < 8; M++) {
    const _ = d[M];
    if (_.length === 0) continue;
    const [w, b, E] = y[M], z = t + w * o, x = e + b * o, D = s + E * o, I = Bt(_, z, x, D, h, i + 1);
    I && (f.push(I), p += I.cx * I.count, m += I.cy * I.count, u += I.cz * I.count, l += I.count);
  }
  return l === 0 ? null : {
    cx: p / l,
    cy: m / l,
    cz: u / l,
    count: l,
    size: o,
    children: f,
    point: null
  };
}
function Ut(n, t, e, s, o, i, r, a) {
  if (n === null) return;
  const c = n.cx - t, h = n.cy - e, d = n.cz - s, p = c * c + h * h + d * d;
  if (p < 1e-20) return;
  const m = Math.sqrt(p);
  if (n.point !== null) {
    if (n.point.index === o) return;
    const l = i / p;
    a.fx -= c * l, a.fy -= h * l, a.fz -= d * l;
    return;
  }
  if ((n.size / m < r || n.children === null) && n.count > 0) {
    const l = i * n.count / p;
    a.fx -= c * l, a.fy -= h * l, a.fz -= d * l;
    return;
  }
  if (n.children)
    for (const l of n.children)
      Ut(l, t, e, s, o, i, r, a);
}
const { vec3: C } = Xt, gs = {
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
  s.forEach((l, f) => r.set(l, f));
  const a = new Float32Array(o * 3);
  for (let l = 0; l < o; l++)
    a[l * 3] = Math.random() * e.simulationBound, a[l * 3 + 1] = Math.random() * e.simulationBound, a[l * 3 + 2] = Math.random() * e.simulationBound;
  const c = {
    force: C.create(),
    diff: C.create(),
    neighborAvg: C.create(),
    posI: C.create(),
    posJ: C.create()
  }, h = e.useOctree && o >= e.octreeThreshold, d = h ? Array.from({ length: o }, (l, f) => ({
    x: 0,
    y: 0,
    z: 0,
    index: f
  })) : [];
  function p(l) {
    const f = Math.max(1, e.iterationsPerStep);
    for (let y = 0; y < f; y++) {
      let M = null;
      if (h) {
        let _ = 1 / 0, w = 1 / 0, b = 1 / 0, E = -1 / 0, z = -1 / 0, x = -1 / 0;
        for (let T = 0; T < o; T++) {
          const P = a[T * 3], S = a[T * 3 + 1], B = a[T * 3 + 2];
          d[T].x = P, d[T].y = S, d[T].z = B, P < _ && (_ = P), P > E && (E = P), S < w && (w = S), S > z && (z = S), B < b && (b = B), B > x && (x = B);
        }
        const D = 1e-6, I = Math.max(E - _, z - w, x - b, D) / 2 + D, A = (_ + E) / 2, N = (w + z) / 2, j = (b + x) / 2;
        M = Bt(
          d,
          A - I,
          N - I,
          j - I,
          I
        );
      }
      for (let _ = 0; _ < o; _++) {
        C.set(
          c.posI,
          a[_ * 3],
          a[_ * 3 + 1],
          a[_ * 3 + 2]
        ), C.set(c.force, 0, 0, 0);
        const w = i.get(s[_]) ?? [];
        if (w.length > 0) {
          c.neighborAvg[0] = 0, c.neighborAvg[1] = 0, c.neighborAvg[2] = 0;
          for (const b of w) {
            const E = r.get(b);
            E !== void 0 && (c.neighborAvg[0] += a[E * 3], c.neighborAvg[1] += a[E * 3 + 1], c.neighborAvg[2] += a[E * 3 + 2]);
          }
          c.neighborAvg[0] /= w.length, c.neighborAvg[1] /= w.length, c.neighborAvg[2] /= w.length, C.subtract(c.diff, c.neighborAvg, c.posI), C.scale(c.diff, c.diff, e.cohesionValue), C.add(c.force, c.force, c.diff);
        }
        if (h && M) {
          const b = { fx: 0, fy: 0, fz: 0 };
          Ut(
            M,
            c.posI[0],
            c.posI[1],
            c.posI[2],
            _,
            e.repulsionValue,
            e.octreeTheta,
            b
          ), c.force[0] += b.fx, c.force[1] += b.fy, c.force[2] += b.fz;
        } else
          for (let b = 0; b < o; b++) {
            if (b === _) continue;
            C.set(
              c.posJ,
              a[b * 3],
              a[b * 3 + 1],
              a[b * 3 + 2]
            ), C.subtract(c.diff, c.posJ, c.posI);
            const E = C.squaredLength(c.diff);
            E < 1e-10 || (C.scale(c.diff, c.diff, e.repulsionValue / E), C.subtract(c.force, c.force, c.diff));
          }
        c.force[0] -= e.centerPull * c.posI[0], c.force[1] -= e.centerPull * c.posI[1], c.force[2] -= e.centerPull * c.posI[2], a[_ * 3] += c.force[0], a[_ * 3 + 1] += c.force[1], a[_ * 3 + 2] += c.force[2];
      }
    }
  }
  function m() {
    return a;
  }
  function u() {
    const l = /* @__PURE__ */ new Map();
    for (let f = 0; f < o; f++)
      l.set(
        s[f],
        new L(a[f * 3], a[f * 3 + 1], a[f * 3 + 2])
      );
    return l;
  }
  return { step: p, getPositions: m, getPositionMap: u };
}
const ys = {
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
function _s(n, t) {
  const { i: e, j: s, d: o } = n;
  for (let i = o.length - 1; i >= 1; i--) {
    const r = Math.floor(t() * (i + 1));
    let a = e[i];
    e[i] = e[r], e[r] = a, a = s[i], s[i] = s[r], s[r] = a;
    const c = o[i];
    o[i] = o[r], o[r] = c;
  }
}
function ws(n) {
  let t = n & 2147483647;
  return () => (t = Math.imul(t, 1103515245) + 12345 & 2147483647, t / 2147483648);
}
function bs(n, t, e) {
  const s = t.length, o = n.get_adjacency(), i = t.map((u) => {
    const l = [];
    for (const f of o.get(u) ?? []) {
      const y = e.get(f);
      y !== void 0 && l.push(y);
    }
    return Uint32Array.from(l);
  }), r = new Int32Array(s), a = new Uint32Array(s), c = (u) => {
    r.fill(-1), r[u] = 0, a[0] = u;
    for (let l = 0, f = 1; l < f; l++) {
      const y = a[l];
      for (const M of i[y])
        r[M] === -1 && (r[M] = r[y] + 1, a[f++] = M);
    }
  }, h = new Int32Array(s).fill(-1);
  let d = 0;
  for (let u = 0; u < s; u++) {
    if (h[u] !== -1) continue;
    c(u);
    let l = 0;
    for (let f = 0; f < s; f++)
      r[f] >= 0 && (h[f] = u, l++);
    d += l * (l - 1) / 2;
  }
  const p = {
    i: new Uint32Array(d),
    j: new Uint32Array(d),
    d: new Float32Array(d)
  };
  let m = 0;
  for (let u = 0; u < s; u++) {
    c(u);
    for (let l = u + 1; l < s; l++)
      r[l] > 0 && (p.i[m] = u, p.j[m] = l, p.d[m] = r[l], m++);
  }
  return p;
}
async function Ss(n, t = {}) {
  const e = {
    ...ys,
    ...t,
    seed: t.seed ?? Math.floor(Math.random() * 2147483647)
  }, s = n.get_node_ids_order(), o = s.length, i = /* @__PURE__ */ new Map();
  s.forEach((x, D) => i.set(x, D));
  const r = bs(n, s, i), a = r.d.length;
  let c = 1 / 0, h = -1 / 0;
  for (let x = 0; x < a; x++) {
    const D = 1 / (r.d[x] * r.d[x]);
    D < c && (c = D), D > h && (h = D);
  }
  (c <= 0 || h <= 0) && (c = 1), h <= 0 && (h = 1);
  const d = 1 / c, p = e.eps / h, m = e.tMax > 1 ? Math.log(d / p) / (e.tMax - 1) : 0, u = (x) => x >= e.tMax ? p : d * Math.exp(-m * x), l = e.dimensions, f = ws(e.seed), y = new Float32Array(o * 3);
  let M = null;
  if (e.initialPositions && e.initialPositions.length >= o * 3) {
    if (y.set(e.initialPositions.subarray(0, o * 3)), e.initialPreservation > 0 && (M = new Float32Array(e.initialPositions.subarray(0, o * 3))), l === 2)
      for (let x = 0; x < o; x++) y[x * 3 + 2] = 0;
  } else {
    const x = e.simulationBound;
    for (let D = 0; D < o; D++)
      y[D * 3] = f() * x, y[D * 3 + 1] = f() * x, y[D * 3 + 2] = l === 2 ? 0 : f() * x;
  }
  let _ = 0;
  const w = 1e-12;
  function b(x) {
    const D = Math.max(1, e.epochsPerStep), I = _;
    for (let A = 0; A < D && _ < e.tMax; A++) {
      const N = e.useSchedule ? u(_) : e.learningRate;
      _++, _s(r, f);
      for (let j = 0; j < a; j++) {
        const T = r.i[j], P = r.j[j], S = r.d[j];
        let B = N / (S * S);
        B > 1 && (B = 1);
        const q = y[T * 3] - y[P * 3], U = y[T * 3 + 1] - y[P * 3 + 1], $ = l === 3 ? y[T * 3 + 2] - y[P * 3 + 2] : 0, st = Math.max(Math.sqrt(q * q + U * U + $ * $), w), V = B * (st - S) / (2 * st);
        y[T * 3] -= V * q, y[T * 3 + 1] -= V * U, l === 3 && (y[T * 3 + 2] -= V * $), y[P * 3] += V * q, y[P * 3 + 1] += V * U, l === 3 && (y[P * 3 + 2] += V * $);
      }
    }
    if (_ !== I) {
      if (e.initialPreservation > 0 && M) {
        const A = e.initialPreservation;
        for (let N = 0; N < o * 3; N++)
          y[N] = (1 - A) * y[N] + A * M[N];
      }
      if (e.centerPull > 0)
        for (let A = 0; A < o; A++)
          y[A * 3] -= e.centerPull * y[A * 3], y[A * 3 + 1] -= e.centerPull * y[A * 3 + 1], l === 3 && (y[A * 3 + 2] -= e.centerPull * y[A * 3 + 2]);
      if (e.scaleBound > 0 && o > 0) {
        let A = 0, N = 0, j = 0;
        for (let P = 0; P < o; P++)
          A += y[P * 3], N += y[P * 3 + 1], j += y[P * 3 + 2];
        A /= o, N /= o, j /= o;
        let T = 0;
        for (let P = 0; P < o; P++) {
          y[P * 3] -= A, y[P * 3 + 1] -= N, y[P * 3 + 2] -= j;
          const S = Math.sqrt(
            y[P * 3] ** 2 + y[P * 3 + 1] ** 2 + (l === 3 ? y[P * 3 + 2] ** 2 : 0)
          );
          S > T && (T = S);
        }
        if (T > 0) {
          const P = e.scaleBound / T;
          for (let S = 0; S < o * 3; S++) y[S] *= P;
        }
      }
      if (l === 2)
        for (let A = 0; A < o; A++) y[A * 3 + 2] = 0;
    }
  }
  function E() {
    return y;
  }
  function z() {
    const x = /* @__PURE__ */ new Map();
    for (let D = 0; D < o; D++)
      x.set(
        s[D],
        new L(y[D * 3], y[D * 3 + 1], y[D * 3 + 2])
      );
    return x;
  }
  return { step: b, getPositions: E, getPositionMap: z };
}
export {
  ee as Constructors,
  we as Drawing,
  G as Edge,
  it as Geometry,
  Y as Graph,
  Ps as GraphDrawer,
  Et as GraphMethods,
  vs as Hierarchy,
  ot as Line,
  Ds as Models,
  L as Point,
  xs as SampleData,
  Es as ThreeWrapper,
  R as Utilities,
  X as _Node,
  Is as createKamadaKawai3D,
  Ss as createStressSGD3D,
  Xt as glMatrix,
  As as matrixVectorMultiply,
  Ts as normalizeVector
};
//# sourceMappingURL=pgl_module.js.map
