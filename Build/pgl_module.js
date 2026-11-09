import * as y from "three";
import { Controls as Zt, Vector3 as Y, MOUSE as st, TOUCH as et, Quaternion as yt, Spherical as _t, Vector2 as H, Ray as Xt, Plane as Wt, MathUtils as qt } from "three";
import * as $t from "gl-matrix";
class K {
  /**
   * Construct an edge
   *
   * @param start Start index of the edge based on the array of nodes
   * @param end End index of the edge based on the array of nodes
   * @param data - Optional data; "ldata" is reserved for line geometry used when drawing the edge
   */
  constructor(t, e, n = {}) {
    this.start = t, this.end = e, this.data = { ...n };
  }
}
class V {
  /**
   * Construct a graph object (no initializing)
   *
   * @param nodes - Map of all the nodes associated with the graph
   * @param edges - Map of all the edges associated with the graph
   */
  constructor(t, e) {
    this.nodes = t, this.edges = e;
    let n = -1;
    for (const o of e.keys()) o > n && (n = o);
    this._nextEdgeId = n + 1;
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
    const n = new V(t, e);
    return await n.initialize(), n;
  }
  /**
   * Constructs the adjacency list representation for the graph.
   * Async to allow yielding on large graphs and avoid hanging the browser.
   */
  async constructAdjacencyList() {
    for (const t of this.nodes.values()) t.neighbours = [];
    this.edges.forEach((t) => {
      const e = t.start, n = t.end;
      this.nodes.get(e) && this.nodes.get(e).neighbours.push(n), this.nodes.get(n) && this.nodes.get(n).neighbours.push(e);
    }), await Promise.resolve();
    for (const t of this.nodes.keys()) {
      const e = this.nodes.get(t).neighbours, n = [...new Set(e)], o = n.indexOf(t);
      o > -1 && n.splice(o, 1), this.nodes.get(t).neighbours = n;
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
  add_edge(t, e, n = {}) {
    const o = new K(t, e, n), i = this._nextEdgeId++;
    this.edges.set(i, o);
    const r = this.nodes.get(t), a = this.nodes.get(e);
    t !== e && (r && !r.neighbours.includes(e) && r.neighbours.push(e), a && !a.neighbours.includes(t) && a.neighbours.push(t));
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
    const { start: n, end: o } = e;
    if (this.edges.delete(t), ![...this.edges.values()].some(
      (r) => r.start === n && r.end === o || r.start === o && r.end === n
    )) {
      const r = this.nodes.get(n), a = this.nodes.get(o);
      r && (r.neighbours = r.neighbours.filter((c) => c !== o)), a && (a.neighbours = a.neighbours.filter((c) => c !== n));
    }
    return !0;
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
    for (const [e, n] of this.edges)
      (n.start === t || n.end === t) && this.edges.delete(e);
    this.nodes.delete(t);
    for (const e of this.nodes.values())
      e.neighbours = e.neighbours.filter((n) => n !== t);
    return !0;
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
      const n = this.edges.get(e).data.ldata;
      n != null && t.set(e, n);
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
    var e, n;
    const t = /* @__PURE__ */ new Map();
    for (const o of this.nodes.keys()) {
      const i = (n = (e = this.nodes.get(o)) == null ? void 0 : e.data) == null ? void 0 : n.pos;
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
    const t = this.get_node_ids_order(), e = t.length, n = new Float32Array(e * e), o = this.get_adjacency(), i = /* @__PURE__ */ new Map();
    t.forEach((r, a) => i.set(r, a));
    for (let r = 0; r < e; r++) {
      const a = t[r], c = o.get(a);
      for (const h of c) {
        const d = i.get(h);
        d !== void 0 && (n[r * e + d] = 1);
      }
    }
    return { matrix: n, nodeIds: t };
  }
}
class $ {
  /**
   * @param data - Data associated with the node; include "pos" (Point) for graph visuals
   */
  constructor(t = {}) {
    this.data = { ...t }, this.neighbours = [];
  }
}
async function vt(s, t) {
  const e = s.get_adjacency(), n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set([t]), i = [t];
  n.set(t, -1);
  for (let r = 0; r < i.length; r++) {
    const a = i[r], c = e.get(a) ?? [];
    for (let h = 0; h < c.length; h++) {
      const d = c[h];
      !o.has(d) && e.has(d) && (o.add(d), i.push(d), n.set(d, a));
    }
  }
  return n;
}
async function dt(s, t) {
  const e = await vt(s, t), n = /* @__PURE__ */ new Map();
  for (const [i, r] of e)
    n.set(i, i === t ? 0 : n.get(r) + 1);
  const o = /* @__PURE__ */ new Map();
  for (const i of s.nodes.keys()) {
    const r = n.get(i);
    r !== void 0 && o.set(i, r);
  }
  return o;
}
async function Qt(s) {
  const t = [...s.nodes.keys()];
  if (t.length === 0) return { start: 0, end: 0, distance: 0 };
  if (t.length === 1) return { start: t[0], end: t[0], distance: 0 };
  const e = s.get_adjacency(), n = t.filter((h) => e.get(h).length > 0), o = n.length > 0 ? n : t;
  let i = o[Math.floor(Math.random() * o.length)], r = await dt(s, i), a = -1;
  for (const h of r.keys()) {
    const d = r.get(h);
    d > a && (i = h, a = d);
  }
  const c = i;
  r = await dt(s, i), a = -1;
  for (const h of r.keys()) {
    const d = r.get(h);
    d > a && (i = h, a = d);
  }
  return { start: c, end: i, distance: a };
}
async function Jt(s, t) {
  const e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  for (const r of t) {
    const a = s.nodes.get(r);
    a && e.set(r, new $(a.data));
  }
  let o = 0;
  for (const r of s.edges.values())
    e.has(r.start) && e.has(r.end) && (n.set(o, new K(r.start, r.end, r.data)), o += 1);
  return await V.create(e, n);
}
const Dt = { GraphDiameter: Qt, Dijkstra: dt, BFSSearch: vt, SelectSubgraph: Jt }, te = {
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
}, ee = {
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
async function ne(s, t) {
  const e = /* @__PURE__ */ new Map();
  for (let i = 0; i < s.length; i++) {
    const r = new $(s[i].data);
    e.set(s[i], r);
  }
  const n = /* @__PURE__ */ new Map();
  for (let i = 0; i < t.length; i++) {
    const r = new K(t[i][0], t[i][1], t[i].data);
    n.set(i, r);
  }
  return await V.create(e, n);
}
const se = { ConstructGraphNodeEdgesList: ne };
class L {
  /**
   * Constructs a point based on the x y z values
   * @param x x value 
   * @param y y value
   * @param z z value 
   */
  constructor(t, e, n) {
    this.x = t, this.y = e, this.z = n;
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
function oe(s) {
  let t = 0;
  for (let n = 0; n < s.length; n++)
    t = t + s[n];
  const e = t / s.length;
  return Number.isNaN(e) ? 0 : e;
}
function ie(s, t) {
  return Math.pow(
    Math.pow(s.x - t.x, 2) + Math.pow(s.y - t.y, 2) + Math.pow(s.z - t.z, 2),
    0.5
  );
}
function re(s, t) {
  return Math.pow(s.x - t.x, 2) + Math.pow(s.y - t.y, 2) + Math.pow(s.z - t.z, 2);
}
function ae(s, t) {
  var e = new Array(t), n = s.length, o = new Array(n);
  if (t > n)
    throw new RangeError("getRandom: more elements taken than available");
  for (; t--; ) {
    var i = Math.floor(Math.random() * n);
    e[t] = s[i in o ? o[i] : i], o[i] = --n in o ? o[n] : n;
  }
  return e;
}
function ce(s, t) {
  const e = /* @__PURE__ */ new Map();
  let n;
  for (const o of s.keys())
    n = Math.random(), n < t && e.set(o, s.get(o));
  return e;
}
const B = {
  calculateAverage: oe,
  calculateDistance: ie,
  calculateSquaredDistance: re,
  getRandomSubset: ae,
  getRandomSubset_map: ce
};
function N(s, t, e = -1 / 0, n = 1 / 0) {
  if (!Number.isFinite(s) || s < e || s > n)
    throw new RangeError(`${t} must be finite and between ${e} and ${n}`);
}
function q(s, t, e = 0) {
  if (!Number.isSafeInteger(s) || s < e)
    throw new RangeError(`${t} must be a safe integer >= ${e}`);
}
class rt {
  /**
   * Constructs a line from an array of points
   * @param points an array of points
   */
  constructor(t) {
    this.points = [], t.forEach((e) => {
      const n = new L(e.x, e.y, e.z);
      this.points.push(n);
    });
  }
}
function At(s, t, e) {
  q(e, "divisions", 1);
  const n = new L(s.x, s.y, s.z), o = new L(t.x, t.y, t.z), i = [];
  for (let a = 0; a <= e; a++) {
    const c = a / e, h = (1 - c) * n.x + c * o.x, d = (1 - c) * n.y + c * o.y, f = (1 - c) * n.z + c * o.z, m = new L(h, d, f);
    i.push(m);
  }
  return new rt(i);
}
function le(s, t, e) {
  N(e, "distance", Number.MIN_VALUE);
  const n = B.calculateDistance(s, t), o = Math.round(n / e) + 2;
  return At(s, t, o);
}
function he(s) {
  if (s.length === 0) throw new RangeError("centroid requires at least one point");
  let t = 0, e = 0, n = 0;
  return s.forEach((i) => {
    t += i.x, e += i.y, n += i.z;
  }), t = t / s.length, e = e / s.length, n = n / s.length, new L(t, e, n);
}
const at = {
  line_from_start_end_divisions: At,
  line_from_start_end_distance: le,
  centroid: he
};
async function de(s, t, e = 1e3, n = 1, o = 1) {
  const i = s.get_adjacency(), r = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
  let c, h;
  for (const b of i.keys())
    c = Math.random() * e, h = Math.random() * e, r.set(b, c), a.set(b, h);
  for (let b = 0; b < t; b++) {
    let M, E, C, x, v, S, A, z, R, T, P, I, U, Q;
    for (const F of i.keys()) {
      const J = i.get(F);
      M = r.get(F), E = a.get(F), C = [], x = [], J.forEach((tt) => {
        const Gt = r.get(tt), Kt = a.get(tt);
        C.push(Gt), x.push(Kt);
      }), P = B.calculateAverage(C), I = B.calculateAverage(x), v = [], S = [];
      let ot, G, mt, gt;
      for (const tt of s.nodes.keys())
        tt != F && (mt = r.get(tt), gt = a.get(tt), ot = mt - M, G = gt - E, S.push(ot), v.push(G));
      R = o * 1 / (B.calculateAverage(S) * B.calculateAverage(S)), T = o * 1 / (B.calculateAverage(v) * B.calculateAverage(v)), A = n * (P - M), z = n * (I - E), U = n * (0 - M), Q = n * (0 - E);
      const Yt = R + U + A + M, Vt = T + Q + z + E;
      r.set(F, Yt), a.set(F, Vt);
    }
  }
  let d = /* @__PURE__ */ new Map();
  for (const b of r.keys())
    d.set(b, new L(r.get(b), 0, a.get(b)));
  const f = [], m = [], u = [];
  let l;
  for (const b of d.keys())
    l = d.get(b), f.push(l.x), m.push(l.y), u.push(l.z);
  const p = B.calculateAverage(f), g = B.calculateAverage(m), w = B.calculateAverage(u), _ = new L(
    -p,
    -g,
    -w
  );
  return d = It(d, _), d;
}
function ue(s) {
  const t = s.get_adjacency(), e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  for (const i of t.keys())
    e.set(i, Math.random() * 200), n.set(i, Math.random() * 200);
  const o = /* @__PURE__ */ new Map();
  for (const i of e.keys())
    o.set(i, new L(e.get(i), 0, n.get(i)));
  return o;
}
function Tt(s, t) {
  const e = /* @__PURE__ */ new Map();
  let n, o, i;
  for (const r of s.edges.keys()) {
    n = s.edges.get(r), o = s.nodes.get(n.start).data.pos, i = s.nodes.get(n.end).data.pos;
    const a = at.line_from_start_end_distance(
      o,
      i,
      t
    );
    e.set(r, a);
  }
  return e;
}
function pe(s, t) {
  const e = /* @__PURE__ */ new Map();
  let n, o, i;
  for (const r of s.edges.keys()) {
    n = s.edges.get(r), o = s.nodes.get(n.start).data.pos, i = s.nodes.get(n.end).data.pos;
    const a = at.line_from_start_end_divisions(
      o,
      i,
      t
    );
    e.set(r, a);
  }
  return e;
}
async function St(s, t, e) {
  const n = /* @__PURE__ */ new Map();
  for (let _ of s.keys())
    n.set(_, new rt(s.get(_).points));
  let o, i, r, a, c, h, d, f, m, u, l, p, g, w;
  for (let _ = 0; _ < t; _++)
    for (let b of n.keys()) {
      o = n.get(b);
      for (let M = 1; M < o.points.length - 1; M++) {
        r = [], a = [], c = [], h = o.points[M];
        for (let C of n.keys())
          if (C != b) {
            i = n.get(C);
            for (let x = 1; x < i.points.length - 1; x++)
              d = i.points[x], f = B.calculateSquaredDistance(h, d), f <= Math.pow(e, 2) && (m = d.x - h.x, u = d.y - h.y, l = d.z - h.z, r.push(m), a.push(u), c.push(l));
          }
        p = h.x + 0.8 * (B.calculateAverage(r) || 0), g = h.y + 0.8 * (B.calculateAverage(a) || 0), w = h.z + 0.8 * (B.calculateAverage(c) || 0);
        const E = new L(p, g, w);
        o.points[M] = E;
      }
    }
  return n;
}
function fe(s, t) {
  const e = /* @__PURE__ */ new Map();
  for (let n of s.keys())
    e.set(n, new rt(s.get(n).points));
  for (const n of e.keys()) {
    const o = e.get(n);
    if (o.points.length < 2) continue;
    let i, r;
    for (let a = 0; a < o.points.length; a++)
      i = o.points[a], r = t * Math.sin(Math.PI * a / (o.points.length - 1)), i.y = i.y + r;
  }
  return e;
}
function me(s, t, e) {
  let n = 0, o, i;
  const r = (a) => {
    const c = a[t];
    return typeof c == "number" ? c : Number(c) || 0;
  };
  for (let a of s.nodes.values())
    o = r(a.data), o >= n && (n = o);
  for (const a of s.nodes.values())
    o = r(a.data), i = n > 0 ? o / n * e : 0, i = Math.max(0, i), i = Math.min(e, i), a.data.pos.y = i;
}
async function ge(s, t, e, n) {
  const o = s.get_adjacency(), i = await Dt.Dijkstra(s, t);
  let r = 0;
  for (const p of i.values()) p > r && (r = p);
  if ([...o.keys()].some((p) => !i.has(p))) {
    r += 1;
    for (const p of o.keys()) i.has(p) || i.set(p, r);
  }
  const c = /* @__PURE__ */ new Map();
  for (let p = 0; p <= r; p++) {
    const g = [];
    for (const w of i.keys())
      p == i.get(w) && g.push(w);
    c.set(p, g);
  }
  const h = /* @__PURE__ */ new Map(), d = n.x || 0, f = n.y || 0, m = n.z || 0;
  for (const p of o.keys()) {
    const g = i.get(p) * e, w = c.get(i.get(p)), _ = 2 * Math.PI * (w.indexOf(p) / w.length), b = Math.sin(_) * g, M = Math.cos(_) * g, E = new L(b + d, -g + f, M + m);
    h.set(p, E);
  }
  s.apply_position_map(h);
  const u = Tt(s, 1), l = await St(u, 12, 5);
  return { pmap: h, emap: l };
}
function ye(s, t) {
  const e = s.get_map(), n = It(e.pmap, t), o = _e(e.emap, t);
  s.apply_drawing_maps({ pmap: n, emap: o });
}
function It(s, t) {
  const e = /* @__PURE__ */ new Map();
  for (let n of s.keys()) {
    const o = s.get(n);
    e.set(n, new L(o.x + t.x, o.y + t.y, o.z + t.z));
  }
  return e;
}
function _e(s, t) {
  const e = /* @__PURE__ */ new Map();
  let n, o, i;
  for (let r of s.keys()) {
    n = [], o = s.get(r);
    for (let a of o.points)
      n.push(new L(a.x + t.x, a.y + t.y, a.z + t.z));
    i = new rt(n), e.set(r, i);
  }
  return e;
}
function we(s, t) {
  let e, n, o, i;
  for (const r of s.edges.keys())
    e = s.edges.get(r), n = s.nodes.get(e.start).data.pos, o = s.nodes.get(e.end).data.pos, i = at.line_from_start_end_distance(
      n,
      o,
      t
    ), e.data.ldata = i;
}
function be(s, t) {
  let e, n, o, i;
  for (const r of s.edges.keys())
    e = s.edges.get(r), n = s.nodes.get(e.start).data.pos, o = s.nodes.get(e.end).data.pos, i = at.line_from_start_end_divisions(n, o, t), e.data.ldata = i;
}
const Me = {
  SimulateKamadaKawai: de,
  DrawEdgeLines: Tt,
  DrawEdgeLinesDivisions: pe,
  DrawEdgeBundling: St,
  HivePlot: ge,
  DisplaceEdgeInY: fe,
  MoveGraph: ye,
  InstanciateRandomPositions: ue,
  DisplaceVertices: me,
  // these two are special functions
  UpdateEdgeLinesDist: we,
  UpdateEdgeLinesDivs: be
};
async function xe(s) {
  const t = s.split(/\r?\n/), e = [], n = /* @__PURE__ */ new Set();
  for (const a of t) {
    const c = a.trim();
    if (!c || c.startsWith("#")) continue;
    const h = c.split(/\s+/);
    if (h.length < 2 || !/^[+-]?\d+$/.test(h[0]) || !/^[+-]?\d+$/.test(h[1])) continue;
    const d = Number(h[0]), f = Number(h[1]);
    !Number.isSafeInteger(d) || !Number.isSafeInteger(f) || (e.push([d, f]), n.add(d), n.add(f));
  }
  const o = /* @__PURE__ */ new Map();
  for (const a of n)
    o.set(a, new $({ pos: new L(0, 0, 0) }));
  const i = /* @__PURE__ */ new Map();
  return e.forEach(([a, c], h) => {
    i.set(h, new K(a, c, {}));
  }), await V.create(o, i);
}
async function Ee() {
  const s = te;
  return await se.ConstructGraphNodeEdgesList(s.nodes, s.edges);
}
async function Pe() {
  const s = ee, t = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map();
  s.nodes.forEach((i) => {
    const r = i.id, a = new L(i.px * 50, 0, i.py * 50), c = i.member, h = new $({ pos: a, size: 10, info: "Node Info", modularity: c });
    t.set(r, h);
  });
  for (let i = 0; i < s.edges.length; i++) {
    const r = s.edges[i], a = r[0], c = r[1], h = new K(a, c, {});
    e.set(i, h);
  }
  const n = await V.create(t, e), o = Me.DrawEdgeLines(n, 20);
  return n.apply_edge_pos_maps(o), n;
}
async function ve(s) {
  const t = s.split(/\r?\n/), e = [], n = /* @__PURE__ */ new Set(), o = [], i = [];
  for (const m of t) {
    const u = m.trim();
    if (!u || u.startsWith("#")) continue;
    const l = u.split(/\s+/);
    if (l[0] === "v") {
      const p = l.slice(1, 4).map(Number);
      p.length === 3 && p.every((g) => Number.isFinite(Math.fround(g))) ? (o.push(e.length / 3), e.push(...p)) : o.push(void 0);
    } else if (l[0] === "f") {
      const p = l.slice(1).map((w) => w.split("/")[0]);
      if (p.length < 3 || p.some((w) => !/^\d+$/.test(w))) continue;
      const g = p.map(Number);
      g.every((w) => Number.isSafeInteger(w) && w >= 1) && i.push(g);
    }
  }
  for (const m of i) {
    const u = m.map((l) => o[l - 1]);
    if (!u.some((l) => l === void 0))
      for (let l = 0; l < u.length; l++) {
        const p = u[l], g = u[(l + 1) % u.length];
        p !== g && n.add(p < g ? `${p},${g}` : `${g},${p}`);
      }
  }
  const r = e.length / 3, a = /* @__PURE__ */ new Map();
  for (let m = 0; m < r; m++)
    a.set(m, new $({ pos: new L(0, 0, 0) }));
  const c = /* @__PURE__ */ new Map();
  let h = 0;
  for (const m of n) {
    const [u, l] = m.split(",").map((p) => parseInt(p, 10));
    c.set(h++, new K(u, l, {}));
  }
  const d = await V.create(a, c), f = new Float32Array(e);
  return { graph: d, positions: f };
}
async function De() {
  const { dwt_1005: s } = await import("./dwt_1005-C8KXz1aw.mjs"), t = s, e = /* @__PURE__ */ new Set();
  for (const h of Object.keys(t)) {
    const d = parseInt(h, 10);
    e.add(d);
    for (const f of t[h]) e.add(f);
  }
  const n = /* @__PURE__ */ new Set();
  for (const h of Object.keys(t)) {
    const d = parseInt(h, 10);
    for (const f of t[h]) {
      const m = Math.min(d, f), u = Math.max(d, f);
      n.add(`${m},${u}`);
    }
  }
  const o = /* @__PURE__ */ new Map(), i = [...e].sort((h, d) => h - d);
  for (const h of i)
    o.set(h, new $({ pos: new L(0, 0, 0) }));
  const r = /* @__PURE__ */ new Map();
  let a = 0;
  for (const h of n) {
    const [d, f] = h.split(",").map((m) => parseInt(m, 10));
    r.set(a++, new K(d, f, {}));
  }
  return await V.create(o, r);
}
const vn = { LoadZKC: Ee, LoadZKCSimulated: Pe, LoadGraphFromEdgeListText: xe, LoadGraphFromObjText: ve, LoadDwt1005: De };
function Ae(s) {
  let t = 0, e = 0;
  for (const f of s)
    f.length < 2 || (t += f.length * 2, e += (f.length - 1) * 6);
  const n = new Float32Array(t * 3), o = new Float32Array(t * 3), i = new Float32Array(t * 3), r = new Float32Array(t), a = t > 65535 ? new Uint32Array(e) : new Uint16Array(e);
  let c = 0, h = 0;
  for (const f of s) {
    const m = f.length;
    if (m < 2) continue;
    const u = c;
    for (let l = 0; l < m; l++) {
      const p = f[l], g = l > 0 ? f[l - 1] : p, w = l < m - 1 ? f[l + 1] : p;
      for (let _ = -1; _ <= 1; _ += 2) {
        const b = c * 3;
        n[b] = p.x, n[b + 1] = p.y, n[b + 2] = p.z, o[b] = g.x, o[b + 1] = g.y, o[b + 2] = g.z, i[b] = w.x, i[b + 1] = w.y, i[b + 2] = w.z, r[c] = _, c++;
      }
    }
    for (let l = 0; l < m - 1; l++) {
      const p = u + l * 2;
      a[h++] = p, a[h++] = p + 1, a[h++] = p + 2, a[h++] = p + 2, a[h++] = p + 1, a[h++] = p + 3;
    }
  }
  const d = new y.BufferGeometry();
  return d.setAttribute("position", new y.BufferAttribute(n, 3)), d.setAttribute("positionPrev", new y.BufferAttribute(o, 3)), d.setAttribute("positionNext", new y.BufferAttribute(i, 3)), d.setAttribute("side", new y.BufferAttribute(r, 1)), d.setIndex(new y.BufferAttribute(a, 1)), d.computeBoundingSphere(), d;
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
`, Se = `
uniform vec3 color;

void main() {
  gl_FragColor = vec4(color, 1.0);
}
`;
function Ie(s = {}) {
  const t = s.color ?? 16777215, e = s.lineWidth ?? 2, n = s.resolution ?? new y.Vector2(800, 700), o = new y.Color(t);
  return new y.ShaderMaterial({
    uniforms: {
      resolution: { value: n },
      lineWidth: { value: e },
      color: { value: new y.Vector3(o.r, o.g, o.b) }
    },
    vertexShader: Te,
    fragmentShader: Se,
    transparent: !1,
    depthTest: !0,
    side: y.DoubleSide
  });
}
const ke = 2;
function Ne(s) {
  return s >= 1 ? Math.max(1, Math.round(s)) : Math.max(1, Math.round(s * 100));
}
function kt(s, t, e, n = ke) {
  const o = [], i = [], r = [];
  for (const [f, m] of s.entries()) {
    if (!(m != null && m.points) || m.points.length < 2) continue;
    const u = m.points.map((l) => new y.Vector3(l.x * t, l.y * t, l.z * t));
    o.push(u);
    for (let l = 0; l < u.length - 1; l++) {
      const p = u[l], g = u[l + 1];
      i.push(p.x, p.y, p.z, g.x, g.y, g.z), r.push(f);
    }
  }
  const a = new y.Group();
  if (o.length === 0) return a;
  const c = Ie({ color: e, lineWidth: Ne(n) }), h = new y.Mesh(Ae(o), c);
  h.userData = { segmentEdgeIds: r };
  const d = new y.LineSegments(
    new y.BufferGeometry().setAttribute(
      "position",
      new y.Float32BufferAttribute(i, 3)
    )
  );
  return h.raycast = (f, m) => {
    d.matrixWorld.copy(h.matrixWorld);
    const u = [];
    d.raycast(f, u);
    for (const l of u) m.push({ ...l, object: h });
  }, h.onBeforeRender = (f) => {
    f.getSize(c.uniforms.resolution.value);
  }, a.add(h), a;
}
const Le = `
attribute float size;
attribute vec3 customColor;

varying vec3 vColor;

void main() {
    vColor = customColor;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = size * ( 300.0 / -mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
}
`, ze = `
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
function Nt(s) {
  return new y.ShaderMaterial({
    uniforms: {
      color: { value: new y.Color(16777215) },
      // base color multiplied with per-vertex customColor
      pointTexture: {
        value: new y.TextureLoader().load("./Textures/Square.png")
      },
      alpha: { value: s }
    },
    vertexShader: Le,
    fragmentShader: ze,
    transparent: s < 1,
    depthWrite: s >= 1
  });
}
function Lt(s, t = 1, e = 1, n = 16777215, o = 1) {
  const i = [], r = s.get_position_map();
  let a;
  const c = [];
  typeof e == "number" ? a = Array(s.nodes.size).fill(e) : a = e;
  const h = [], d = new y.Color(n);
  let f = 0, m;
  for (let g of s.nodes.keys())
    m = r.get(g), i.push(
      m.x * t,
      m.y * t,
      m.z * t
    ), d.toArray(c, f * 3), h.push(g), f += 1;
  const u = new y.BufferGeometry();
  u.setAttribute(
    "position",
    new y.Float32BufferAttribute(i, 3)
  ), u.setAttribute(
    "customColor",
    new y.Float32BufferAttribute(c, 3)
  ), u.setAttribute("size", new y.Float32BufferAttribute(a, 1)), u.setAttribute("label", new y.Int32BufferAttribute(h, 1)), u.name = "nodes";
  const l = Nt(o), p = new y.Group();
  return p.add(new y.Points(u, l)), p;
}
function Ce(s, t = 1, e = 1, n = 16777215, o = 1) {
  const i = s.get_node_ids_order(), r = i.length, a = s.get_position_map(), c = [];
  let h;
  const d = [], f = i.slice(), m = new y.Color(n);
  for (let _ = 0; _ < r; _++) {
    const b = a.get(i[_]);
    c.push(
      b.x * t,
      b.y * t,
      b.z * t
    ), m.toArray(d, _ * 3);
  }
  typeof e == "number" ? h = Array(r).fill(e) : h = e;
  const u = new y.BufferGeometry();
  u.setAttribute(
    "position",
    new y.Float32BufferAttribute(c, 3)
  ), u.setAttribute(
    "customColor",
    new y.Float32BufferAttribute(d, 3)
  ), u.setAttribute("size", new y.Float32BufferAttribute(h, 1)), u.setAttribute("label", new y.Int32BufferAttribute(f, 1)), u.name = "nodes";
  const l = Nt(o), p = new y.Group();
  p.add(new y.Points(u, l));
  const g = u.getAttribute("position");
  function w(_) {
    const b = g.array;
    if (_ instanceof Float32Array)
      for (let M = 0; M < r * 3; M++)
        b[M] = _[M] * t;
    else
      for (let M = 0; M < r; M++) {
        const E = _.get(i[M]);
        b[M * 3] = E.x * t, b[M * 3 + 1] = E.y * t, b[M * 3 + 2] = E.z * t;
      }
    g.needsUpdate = !0;
  }
  return { group: p, updatePositions: w };
}
function je(s, t = 1, e = 16777215, n = 0.4) {
  const o = s.get_edge_map();
  return zt(o, t, e, n);
}
function zt(s, t, e = 16777215, n = 0.4) {
  return kt(s, t, e, n);
}
function Re(s, t = 1, e = 16777215) {
  const n = s.get_edge_map();
  return Ct(n, t, e);
}
function Oe(s, t = 1, e = 16777215) {
  const n = new y.LineSegments(
    new y.BufferGeometry(),
    new y.LineBasicMaterial({ color: e })
  ), o = new y.Group();
  o.add(n);
  function i() {
    const { positions: r, segmentEdgeIds: a } = jt(s.get_edge_map(), t), c = n.geometry.getAttribute("position");
    c && c.array.length === r.length ? (c.array.set(r), c.needsUpdate = !0, n.geometry.boundingSphere = null) : (n.geometry.dispose(), n.geometry = new y.BufferGeometry(), n.geometry.setAttribute("position", new y.BufferAttribute(r, 3))), n.userData = { segmentEdgeIds: a };
  }
  return i(), { group: o, updateEdges: i };
}
function Be(s, t, e, n = 16777215, o = 5) {
  const i = s.get_position_map(), r = e.map((c) => i.get(c)).filter((c) => c != null);
  if (r.length < 2) return new y.Group();
  const a = new rt(r);
  return kt(/* @__PURE__ */ new Map([[0, a]]), t, n, o);
}
function Ct(s, t = 1, e = 16777215) {
  const { positions: n, segmentEdgeIds: o } = jt(s, t), i = new y.BufferGeometry();
  i.setAttribute("position", new y.BufferAttribute(n, 3));
  const r = new y.LineSegments(
    i,
    new y.LineBasicMaterial({ color: e })
  );
  r.userData = { segmentEdgeIds: o };
  const a = new y.Group();
  return a.add(r), a;
}
function jt(s, t) {
  let e = 0;
  for (const r of s.values()) e += Math.max(0, r.points.length - 1);
  const n = new Float32Array(e * 6), o = [];
  let i = 0;
  for (const [r, a] of s.entries()) {
    const c = a.points;
    for (let h = 0; h < c.length - 1; h++) {
      const d = c[h], f = c[h + 1];
      n[i++] = d.x * t, n[i++] = d.y * t, n[i++] = d.z * t, n[i++] = f.x * t, n[i++] = f.y * t, n[i++] = f.z * t, o.push(r);
    }
  }
  return { positions: n, segmentEdgeIds: o };
}
const Z = new y.Matrix4(), X = new y.Vector3(), nt = new y.Quaternion(), W = new y.Vector3();
function Rt(s, t = 1, e = 16777215, n = 10) {
  const o = s.size, i = Array.from(s.entries()), r = typeof n == "number" ? Array(o).fill(n) : n, a = new y.BoxGeometry(1, 1, 1), c = new y.MeshBasicMaterial({ color: e }), h = new y.InstancedMesh(a, c, o);
  h.name = "boxVertices", nt.identity();
  for (let f = 0; f < o; f++) {
    const m = i[f][1], u = r[f];
    X.set(
      m.x * t,
      m.y * t,
      m.z * t
    ), W.set(u, u, u), Z.compose(
      X,
      nt,
      W
    ), h.setMatrixAt(f, Z);
  }
  h.instanceMatrix.needsUpdate = !0, h.userData = { nodeIds: i.map((f) => f[0]) };
  const d = new y.Group();
  return d.add(h), d;
}
function Ue(s, t = 1, e = 16777215, n = 10) {
  const o = s.get_node_ids_order(), i = o.length, r = s.get_position_map(), a = typeof n == "number" ? Array(i).fill(n) : n, c = new y.BoxGeometry(1, 1, 1), h = new y.MeshBasicMaterial({ color: e }), d = new y.InstancedMesh(c, h, i);
  d.name = "boxVertices", nt.identity();
  for (let u = 0; u < i; u++) {
    const l = r.get(o[u]), p = a[u];
    X.set(
      l.x * t,
      l.y * t,
      l.z * t
    ), W.set(p, p, p), Z.compose(
      X,
      nt,
      W
    ), d.setMatrixAt(u, Z);
  }
  d.instanceMatrix.needsUpdate = !0, d.userData = { nodeIds: o.slice() };
  const f = new y.Group();
  f.add(d);
  function m(u) {
    if (u instanceof Float32Array)
      for (let l = 0; l < i; l++)
        X.set(
          u[l * 3] * t,
          u[l * 3 + 1] * t,
          u[l * 3 + 2] * t
        ), W.set(a[l], a[l], a[l]), Z.compose(
          X,
          nt,
          W
        ), d.setMatrixAt(l, Z);
    else
      for (let l = 0; l < i; l++) {
        const p = u.get(o[l]);
        X.set(p.x * t, p.y * t, p.z * t), W.set(a[l], a[l], a[l]), Z.compose(
          X,
          nt,
          W
        ), d.setMatrixAt(l, Z);
      }
    d.instanceMatrix.needsUpdate = !0;
  }
  return { group: f, updatePositions: m };
}
function Fe(s, t = 1, e = 16777215, n = 10) {
  const o = s.get_position_map();
  return Rt(o, t, e, n);
}
function He(s, t = 16, e = 16777215, n = 10) {
  let o;
  typeof n == "number" ? o = Array(s.size).fill(n) : o = n;
  const i = new y.Group(), r = new y.MeshBasicMaterial({ color: e });
  let a = 0;
  for (const [c, h] of s) {
    const d = o[a], f = 2 * d * Math.PI, m = Math.ceil(f / t), u = new y.CylinderGeometry(d, d, 10, m);
    u.name = String(c);
    const l = new y.Mesh(u, r);
    l.position.set(h.x, h.y, h.z), i.add(l), a += 1;
  }
  return i;
}
async function Ye(s, t) {
  const e = /* @__PURE__ */ new Map();
  let n, o;
  for (let m of s.nodes.keys()) {
    n = s.nodes.get(m);
    const u = n.data[t];
    o = typeof u == "number" ? u : u != null ? Number(u) : void 0, o !== void 0 && (e.has(o) ? e.get(o).push(m) : e.set(o, [m]));
  }
  const i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
  let a, c, h, d;
  for (let m of e.keys())
    a = e.get(m), c = await Dt.SelectSubgraph(s, a), h = Lt(c, 1), i.set(m, h), d = Ot(c, 0.03), r.set(m, d);
  return {
    nodeGroups: i,
    EdgeGroups: r
  };
}
function Ot(s, t, e = 16777215) {
  const n = new y.Group(), o = new y.LineBasicMaterial({ color: e });
  let i, r, a;
  for (let c of s.edges.values())
    if (Math.random() <= t) {
      i = s.nodes.get(c.start).data.pos, r = s.nodes.get(c.end).data.pos, a = [], a.push(new y.Vector3(i.x, i.y, i.z)), a.push(new y.Vector3(r.x, r.y, r.z));
      const h = new y.BufferGeometry().setFromPoints(a), d = new y.Line(h, o);
      n.add(d);
    }
  return n;
}
function Ve(s, t, e) {
  try {
    const n = s instanceof y.Group ? s.children[0] : s, o = n == null ? void 0 : n.geometry;
    if (!(o != null && o.attributes)) return;
    const i = o.attributes.customColor, r = i == null ? void 0 : i.array;
    if (!r || r.length === 0) return;
    const a = new y.Color(e), c = o.attributes.label, h = c == null ? void 0 : c.array;
    h && h.length > 0 ? t.forEach((d) => {
      for (let f = 0; f < h.length; f++)
        if (h[f] === d) {
          const m = f * 3;
          m + 2 < r.length && (r[m] = a.r, r[m + 1] = a.g, r[m + 2] = a.b);
          break;
        }
    }) : t.forEach((d) => {
      const f = d * 3;
      f + 2 < r.length && (r[f] = a.r, r[f + 1] = a.g, r[f + 2] = a.b);
    }), i.needsUpdate = !0;
  } catch {
  }
}
function Ge(s) {
  var t, e;
  try {
    const n = s instanceof y.Group ? s.children[0] : s, o = (e = (t = n == null ? void 0 : n.geometry) == null ? void 0 : t.attributes) == null ? void 0 : e.customColor, i = o == null ? void 0 : o.array;
    if (!i || i.length === 0) return;
    const r = o.count;
    for (let a = 0; a < r; a++) {
      const c = a * 3;
      i[c] = 1, i[c + 1] = 1, i[c + 2] = 1;
    }
    o.needsUpdate = !0;
  } catch {
  }
}
const Dn = {
  DrawTHREEGraphVertices: Lt,
  DrawTHREEGraphVerticesMutable: Ce,
  DrawTHREEGraphEdgesThick: je,
  DrawTHREEGraphEdgesThin: Re,
  DrawTHREEGraphEdgesThinMutable: Oe,
  DrawThickPathFromNodeIds: Be,
  AddBoxBasedImaging: Rt,
  AddInModularityBasedPointGroups: Ye,
  DrawThinEdgesFromEdgeMap: Ct,
  DrawThickEdgesFromEdgeMap: zt,
  AddCylinderBasedImaging: He,
  DrawSimplifiedEdges: Ot,
  ChangeTheVertexColours: Ve,
  ResetVertexColors: Ge,
  DrawTHREEBoxBasedVertices: Fe,
  DrawTHREEBoxBasedVerticesMutable: Ue
}, wt = { type: "change" }, ft = { type: "start" }, Bt = { type: "end" }, ct = new Xt(), bt = new Wt(), Ke = Math.cos(70 * qt.DEG2RAD), k = new Y(), O = 2 * Math.PI, D = {
  NONE: -1,
  ROTATE: 0,
  DOLLY: 1,
  PAN: 2,
  TOUCH_ROTATE: 3,
  TOUCH_PAN: 4,
  TOUCH_DOLLY_PAN: 5,
  TOUCH_DOLLY_ROTATE: 6
}, ht = 1e-6;
class Ze extends Zt {
  constructor(t, e = null) {
    super(t, e), this.state = D.NONE, this.enabled = !0, this.target = new Y(), this.cursor = new Y(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minTargetRadius = 0, this.maxTargetRadius = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = 0.05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.zoomToCursor = !1, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: st.ROTATE, MIDDLE: st.DOLLY, RIGHT: st.PAN }, this.touches = { ONE: et.ROTATE, TWO: et.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this._lastPosition = new Y(), this._lastQuaternion = new yt(), this._lastTargetPosition = new Y(), this._quat = new yt().setFromUnitVectors(t.up, new Y(0, 1, 0)), this._quatInverse = this._quat.clone().invert(), this._spherical = new _t(), this._sphericalDelta = new _t(), this._scale = 1, this._panOffset = new Y(), this._rotateStart = new H(), this._rotateEnd = new H(), this._rotateDelta = new H(), this._panStart = new H(), this._panEnd = new H(), this._panDelta = new H(), this._dollyStart = new H(), this._dollyEnd = new H(), this._dollyDelta = new H(), this._dollyDirection = new Y(), this._mouse = new H(), this._performCursorZoom = !1, this._pointers = [], this._pointerPositions = {}, this._controlActive = !1, this._onPointerMove = We.bind(this), this._onPointerDown = Xe.bind(this), this._onPointerUp = qe.bind(this), this._onContextMenu = sn.bind(this), this._onMouseWheel = Je.bind(this), this._onKeyDown = tn.bind(this), this._onTouchStart = en.bind(this), this._onTouchMove = nn.bind(this), this._onMouseDown = $e.bind(this), this._onMouseMove = Qe.bind(this), this._interceptControlDown = on.bind(this), this._interceptControlUp = rn.bind(this), this.domElement !== null && this.connect(), this.update();
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
    this.target.copy(this.target0), this.object.position.copy(this.position0), this.object.zoom = this.zoom0, this.object.updateProjectionMatrix(), this.dispatchEvent(wt), this.update(), this.state = D.NONE;
  }
  update(t = null) {
    const e = this.object.position;
    k.copy(e).sub(this.target), k.applyQuaternion(this._quat), this._spherical.setFromVector3(k), this.autoRotate && this.state === D.NONE && this._rotateLeft(this._getAutoRotationAngle(t)), this.enableDamping ? (this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor, this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor) : (this._spherical.theta += this._sphericalDelta.theta, this._spherical.phi += this._sphericalDelta.phi);
    let n = this.minAzimuthAngle, o = this.maxAzimuthAngle;
    isFinite(n) && isFinite(o) && (n < -Math.PI ? n += O : n > Math.PI && (n -= O), o < -Math.PI ? o += O : o > Math.PI && (o -= O), n <= o ? this._spherical.theta = Math.max(n, Math.min(o, this._spherical.theta)) : this._spherical.theta = this._spherical.theta > (n + o) / 2 ? Math.max(n, this._spherical.theta) : Math.min(o, this._spherical.theta)), this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi)), this._spherical.makeSafe(), this.enableDamping === !0 ? this.target.addScaledVector(this._panOffset, this.dampingFactor) : this.target.add(this._panOffset), this.target.sub(this.cursor), this.target.clampLength(this.minTargetRadius, this.maxTargetRadius), this.target.add(this.cursor);
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
        const a = new Y(this._mouse.x, this._mouse.y, 0);
        a.unproject(this.object);
        const c = this.object.zoom;
        this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), this.object.updateProjectionMatrix(), i = c !== this.object.zoom;
        const h = new Y(this._mouse.x, this._mouse.y, 0);
        h.unproject(this.object), this.object.position.sub(h).add(a), this.object.updateMatrixWorld(), r = k.length();
      } else
        console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), this.zoomToCursor = !1;
      r !== null && (this.screenSpacePanning ? this.target.set(0, 0, -1).transformDirection(this.object.matrix).multiplyScalar(r).add(this.object.position) : (ct.origin.copy(this.object.position), ct.direction.set(0, 0, -1).transformDirection(this.object.matrix), Math.abs(this.object.up.dot(ct.direction)) < Ke ? this.object.lookAt(this.target) : (bt.setFromNormalAndCoplanarPoint(this.object.up, this.target), ct.intersectPlane(bt, this.target))));
    } else if (this.object.isOrthographicCamera) {
      const r = this.object.zoom;
      this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), r !== this.object.zoom && (this.object.updateProjectionMatrix(), i = !0);
    }
    return this._scale = 1, this._performCursorZoom = !1, i || this._lastPosition.distanceToSquared(this.object.position) > ht || 8 * (1 - this._lastQuaternion.dot(this.object.quaternion)) > ht || this._lastTargetPosition.distanceToSquared(this.target) > ht ? (this.dispatchEvent(wt), this._lastPosition.copy(this.object.position), this._lastQuaternion.copy(this.object.quaternion), this._lastTargetPosition.copy(this.target), !0) : !1;
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
    const n = this.domElement;
    if (this.object.isPerspectiveCamera) {
      const o = this.object.position;
      k.copy(o).sub(this.target);
      let i = k.length();
      i *= Math.tan(this.object.fov / 2 * Math.PI / 180), this._panLeft(2 * t * i / n.clientHeight, this.object.matrix), this._panUp(2 * e * i / n.clientHeight, this.object.matrix);
    } else this.object.isOrthographicCamera ? (this._panLeft(t * (this.object.right - this.object.left) / this.object.zoom / n.clientWidth, this.object.matrix), this._panUp(e * (this.object.top - this.object.bottom) / this.object.zoom / n.clientHeight, this.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), this.enablePan = !1);
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
    const n = this.domElement.getBoundingClientRect(), o = t - n.left, i = e - n.top, r = n.width, a = n.height;
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
      const e = this._getSecondPointerPosition(t), n = 0.5 * (t.pageX + e.x), o = 0.5 * (t.pageY + e.y);
      this._rotateStart.set(n, o);
    }
  }
  _handleTouchStartPan(t) {
    if (this._pointers.length === 1)
      this._panStart.set(t.pageX, t.pageY);
    else {
      const e = this._getSecondPointerPosition(t), n = 0.5 * (t.pageX + e.x), o = 0.5 * (t.pageY + e.y);
      this._panStart.set(n, o);
    }
  }
  _handleTouchStartDolly(t) {
    const e = this._getSecondPointerPosition(t), n = t.pageX - e.x, o = t.pageY - e.y, i = Math.sqrt(n * n + o * o);
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
      const n = this._getSecondPointerPosition(t), o = 0.5 * (t.pageX + n.x), i = 0.5 * (t.pageY + n.y);
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
      const e = this._getSecondPointerPosition(t), n = 0.5 * (t.pageX + e.x), o = 0.5 * (t.pageY + e.y);
      this._panEnd.set(n, o);
    }
    this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd);
  }
  _handleTouchMoveDolly(t) {
    const e = this._getSecondPointerPosition(t), n = t.pageX - e.x, o = t.pageY - e.y, i = Math.sqrt(n * n + o * o);
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
    e === void 0 && (e = new H(), this._pointerPositions[t.pointerId] = e), e.set(t.pageX, t.pageY);
  }
  _getSecondPointerPosition(t) {
    const e = t.pointerId === this._pointers[0] ? this._pointers[1] : this._pointers[0];
    return this._pointerPositions[e];
  }
  //
  _customWheelEvent(t) {
    const e = t.deltaMode, n = {
      clientX: t.clientX,
      clientY: t.clientY,
      deltaY: t.deltaY
    };
    switch (e) {
      case 1:
        n.deltaY *= 16;
        break;
      case 2:
        n.deltaY *= 100;
        break;
    }
    return t.ctrlKey && !this._controlActive && (n.deltaY *= 10), n;
  }
}
function Xe(s) {
  this.enabled !== !1 && (this._pointers.length === 0 && (this.domElement.setPointerCapture(s.pointerId), this.domElement.addEventListener("pointermove", this._onPointerMove), this.domElement.addEventListener("pointerup", this._onPointerUp)), !this._isTrackingPointer(s) && (this._addPointer(s), s.pointerType === "touch" ? this._onTouchStart(s) : this._onMouseDown(s)));
}
function We(s) {
  this.enabled !== !1 && (s.pointerType === "touch" ? this._onTouchMove(s) : this._onMouseMove(s));
}
function qe(s) {
  switch (this._removePointer(s), this._pointers.length) {
    case 0:
      this.domElement.releasePointerCapture(s.pointerId), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.dispatchEvent(Bt), this.state = D.NONE;
      break;
    case 1:
      const t = this._pointers[0], e = this._pointerPositions[t];
      this._onTouchStart({ pointerId: t, pageX: e.x, pageY: e.y });
      break;
  }
}
function $e(s) {
  let t;
  switch (s.button) {
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
    case st.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseDownDolly(s), this.state = D.DOLLY;
      break;
    case st.ROTATE:
      if (s.ctrlKey || s.metaKey || s.shiftKey) {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(s), this.state = D.PAN;
      } else {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(s), this.state = D.ROTATE;
      }
      break;
    case st.PAN:
      if (s.ctrlKey || s.metaKey || s.shiftKey) {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(s), this.state = D.ROTATE;
      } else {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(s), this.state = D.PAN;
      }
      break;
    default:
      this.state = D.NONE;
  }
  this.state !== D.NONE && this.dispatchEvent(ft);
}
function Qe(s) {
  switch (this.state) {
    case D.ROTATE:
      if (this.enableRotate === !1) return;
      this._handleMouseMoveRotate(s);
      break;
    case D.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseMoveDolly(s);
      break;
    case D.PAN:
      if (this.enablePan === !1) return;
      this._handleMouseMovePan(s);
      break;
  }
}
function Je(s) {
  this.enabled === !1 || this.enableZoom === !1 || this.state !== D.NONE || (s.preventDefault(), this.dispatchEvent(ft), this._handleMouseWheel(this._customWheelEvent(s)), this.dispatchEvent(Bt));
}
function tn(s) {
  this.enabled === !1 || this.enablePan === !1 || this._handleKeyDown(s);
}
function en(s) {
  switch (this._trackPointer(s), this._pointers.length) {
    case 1:
      switch (this.touches.ONE) {
        case et.ROTATE:
          if (this.enableRotate === !1) return;
          this._handleTouchStartRotate(s), this.state = D.TOUCH_ROTATE;
          break;
        case et.PAN:
          if (this.enablePan === !1) return;
          this._handleTouchStartPan(s), this.state = D.TOUCH_PAN;
          break;
        default:
          this.state = D.NONE;
      }
      break;
    case 2:
      switch (this.touches.TWO) {
        case et.DOLLY_PAN:
          if (this.enableZoom === !1 && this.enablePan === !1) return;
          this._handleTouchStartDollyPan(s), this.state = D.TOUCH_DOLLY_PAN;
          break;
        case et.DOLLY_ROTATE:
          if (this.enableZoom === !1 && this.enableRotate === !1) return;
          this._handleTouchStartDollyRotate(s), this.state = D.TOUCH_DOLLY_ROTATE;
          break;
        default:
          this.state = D.NONE;
      }
      break;
    default:
      this.state = D.NONE;
  }
  this.state !== D.NONE && this.dispatchEvent(ft);
}
function nn(s) {
  switch (this._trackPointer(s), this.state) {
    case D.TOUCH_ROTATE:
      if (this.enableRotate === !1) return;
      this._handleTouchMoveRotate(s), this.update();
      break;
    case D.TOUCH_PAN:
      if (this.enablePan === !1) return;
      this._handleTouchMovePan(s), this.update();
      break;
    case D.TOUCH_DOLLY_PAN:
      if (this.enableZoom === !1 && this.enablePan === !1) return;
      this._handleTouchMoveDollyPan(s), this.update();
      break;
    case D.TOUCH_DOLLY_ROTATE:
      if (this.enableZoom === !1 && this.enableRotate === !1) return;
      this._handleTouchMoveDollyRotate(s), this.update();
      break;
    default:
      this.state = D.NONE;
  }
}
function sn(s) {
  this.enabled !== !1 && s.preventDefault();
}
function on(s) {
  s.key === "Control" && (this._controlActive = !0, this.domElement.getRootNode().addEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
function rn(s) {
  s.key === "Control" && (this._controlActive = !1, this.domElement.getRootNode().removeEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
function an(s) {
  var e;
  const t = s.object;
  if (t instanceof y.Points) {
    const n = t.geometry, o = (e = n == null ? void 0 : n.attributes) == null ? void 0 : e.label;
    return o && s.index != null ? o.array[s.index] ?? null : null;
  }
  if (t instanceof y.InstancedMesh && s.instanceId != null) {
    const n = t.userData.nodeIds;
    return n && s.instanceId < n.length ? n[s.instanceId] : null;
  }
  return null;
}
function cn(s) {
  const { edgeId: t, segmentEdgeIds: e } = s.object.userData;
  return e && s.index != null ? e[Math.floor(s.index / 2)] ?? null : t ?? null;
}
function Mt(s, t) {
  var n, o;
  const e = s.nodes.get(t);
  return {
    nodeId: t,
    data: (e == null ? void 0 : e.data) ?? {},
    neighbours: ((n = e == null ? void 0 : e.neighbours) == null ? void 0 : n.slice()) ?? [],
    position: ((o = e == null ? void 0 : e.data) == null ? void 0 : o.pos) ?? void 0
  };
}
function xt(s, t) {
  const e = s.edges.get(t);
  return e ? {
    edgeId: t,
    start: e.start,
    end: e.end,
    data: e.data ?? {}
  } : null;
}
const lt = new y.Vector3(), Et = new y.Plane(), Pt = new y.Vector3();
class ln {
  constructor(t, e, n, o, i) {
    this.lastHoverNodeId = null, this.lastHoverEdgeId = null, this.dragNodeId = null, this.wasDragging = !1, this.scene = t, this.camera = e, this.domElement = n, this.graph = o, this.options = i, this.raycaster = new y.Raycaster(), this.mouse = new y.Vector2(), this.hoverEnabled = i.hoverEnabled !== !1, this.controls = i.controls, this.raycaster.params.Line = { threshold: 5 }, this.raycaster.params.Points = { threshold: 10 }, this.boundOnClick = this.onClick.bind(this), this.boundOnPointerMove = this.onPointerMove.bind(this), this.boundOnPointerDown = this.onPointerDown.bind(this), this.boundOnPointerUp = this.onPointerUp.bind(this);
    const r = !!(i.enableNodeDrag && i.onNodeDrag);
    n.addEventListener("click", this.boundOnClick), (this.hoverEnabled || r) && n.addEventListener("pointermove", this.boundOnPointerMove), r && (n.addEventListener("pointerdown", this.boundOnPointerDown), n.addEventListener("pointerup", this.boundOnPointerUp), n.addEventListener("pointerleave", this.boundOnPointerUp));
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
    let e = null, n = null, o = 1 / 0, i = 1 / 0;
    for (const r of t) {
      const a = an(r), c = cn(r);
      a != null && r.distance < o && (e = a, o = r.distance), c != null && r.distance < i && (n = c, i = r.distance);
    }
    return e != null && n != null && o <= i ? n = null : e != null && n != null && (e = null), { nodeId: e, edgeId: n };
  }
  onClick(t) {
    if (this.wasDragging) {
      this.wasDragging = !1;
      return;
    }
    this.getMouseNDC(t);
    const { nodeId: e, edgeId: n } = this.pick();
    if (e != null && this.options.onNodeClick && this.options.onNodeClick(Mt(this.graph, e)), n != null && this.options.onEdgeClick) {
      const o = xt(this.graph, n);
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
  getDragPosition(t) {
    var n, o;
    const e = (o = (n = this.graph.nodes.get(t)) == null ? void 0 : n.data) == null ? void 0 : o.pos;
    return e ? (Pt.set(0, 0, -1).applyQuaternion(this.camera.quaternion), Et.setFromNormalAndCoplanarPoint(Pt, new y.Vector3(e.x, e.y, e.z)), this.raycaster.setFromCamera(this.mouse, this.camera), this.raycaster.ray.intersectPlane(Et, lt) ? { x: lt.x, y: lt.y, z: lt.z } : null) : null;
  }
  onPointerMove(t) {
    if (this.getMouseNDC(t), this.dragNodeId != null && this.options.onNodeDrag) {
      const o = this.getDragPosition(this.dragNodeId);
      o && this.options.onNodeDrag(this.dragNodeId, o);
      return;
    }
    if (!this.hoverEnabled) return;
    const { nodeId: e, edgeId: n } = this.pick();
    this.fireHoverCallbacks(e, n);
  }
  fireHoverCallbacks(t, e) {
    if (this.options.onNodeHover && (t != null ? t !== this.lastHoverNodeId && (this.lastHoverNodeId = t, this.options.onNodeHover(Mt(this.graph, t))) : this.lastHoverNodeId != null && (this.lastHoverNodeId = null, this.options.onNodeHover(null))), this.options.onEdgeHover)
      if (e != null) {
        if (e !== this.lastHoverEdgeId) {
          this.lastHoverEdgeId = e;
          const n = xt(this.graph, e);
          n && this.options.onEdgeHover(n);
        }
      } else
        this.lastHoverEdgeId != null && (this.lastHoverEdgeId = null, this.options.onEdgeHover(null));
  }
}
class hn {
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
    this.camera = new y.PerspectiveCamera(), this.scene = new y.Scene(), this.renderer = new y.WebGLRenderer({
      canvas: this.canvas,
      antialias: !0
    }), this.renderer.setSize(this.width, this.height), this.renderer.setClearColor(16711935, 0), this.camera.aspect = this.width / this.height, this.camera.updateProjectionMatrix(), this.scene.add(new y.AmbientLight(16777215));
    const e = new y.DirectionalLight(16777215, 1);
    e.position.set(0, 10, 0), this.scene.add(e), this.controls = new Ze(this.camera, this.renderer.domElement), this.camera.position.set(0, 100, 100), this.controls.autoRotate = !0, this.controls.maxPolarAngle = Math.PI * 0.5, this.controls.maxDistance = 1e4, this.controls.minDistance = 10, this.controls.update();
    const n = performance.now();
    console.log("initialization has finished"), console.log(`Time to initialize ${n - t} milliseconds`);
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
    this.interactionLayer = new ln(
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
const An = {
  GraphDrawer3d: hn
};
async function dn(s, t) {
  q(s, "n"), N(t, "p", 0, 1);
  const e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  let o;
  for (let c = 0; c < s; c++)
    o = new $({}), e.set(c, o);
  let i, r, a = 0;
  for (let c = 0; c < s; c++)
    for (let h = c + 1; h < s; h++)
      i = Math.random(), t > i && (r = new K(c, h, {}), n.set(a, r), a += 1);
  return V.create(e, n);
}
const Tn = { GenerateErdosReyni_n_p: dn };
function un(s, t) {
  const e = s.x - t.x, n = s.y - t.y, o = s.z - t.z;
  return e * e + n * n + o * o;
}
function Ut(s) {
  return ["x", "y", "z"][s % 3];
}
function ut(s, t) {
  if (s.length === 0) return null;
  if (s.length === 1) return { item: s[0] };
  const e = Ut(t), n = [...s].sort((c, h) => c.point[e] - h.point[e]), o = Math.floor(n.length / 2), i = n[o], r = ut(n.slice(0, o), t + 1), a = o + 1 < n.length ? ut(n.slice(o + 1), t + 1) : null;
  return { left: r, right: a ?? void 0, item: i };
}
function it(s, t, e, n, o) {
  const i = Ut(n);
  un(t, s.item.point) <= e && o.push(s.item.nodeId);
  const a = t[i] - s.item.point[i], c = a * a;
  a <= 0 ? (s.left && it(s.left, t, e, n + 1, o), s.right && c <= e && it(s.right, t, e, n + 1, o)) : (s.right && it(s.right, t, e, n + 1, o), s.left && c <= e && it(s.left, t, e, n + 1, o));
}
function pn(s, t) {
  N(t, "radius", 0);
  for (const { point: i } of s)
    N(i.x, "point.x"), N(i.y, "point.y"), N(i.z, "point.z");
  const e = ut(s, 0), n = t * t, o = /* @__PURE__ */ new Map();
  for (const { point: i, nodeId: r } of s) {
    const a = [];
    it(e, i, n, 0, a), o.set(r, a);
  }
  return o;
}
class fn {
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
      const n = this.parent.get(t);
      this.parent.set(t, e), t = n;
    }
    return e;
  }
  // Union by size keeps trees shallow.
  union(t, e) {
    let n = this.find(t), o = this.find(e);
    n !== o && (this.size.get(n) > this.size.get(o) && ([n, o] = [o, n]), this.parent.set(n, o), this.size.set(o, this.size.get(n) + this.size.get(o)));
  }
}
function mn() {
  return {
    cluster(s, t) {
      const { distanceThreshold: e } = t, n = s.get_position_map(), o = [];
      for (const [u, l] of n)
        o.push({ point: l, nodeId: u });
      if (o.length === 0)
        return { nodeToCluster: /* @__PURE__ */ new Map(), clusterCentroids: /* @__PURE__ */ new Map(), clusterIds: [] };
      const i = pn(o, e), r = new fn();
      for (const [u, l] of i)
        for (const p of l)
          r.union(u, p);
      const a = /* @__PURE__ */ new Map();
      let c = 0;
      const h = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map();
      for (const { nodeId: u } of o) {
        const l = r.find(u);
        a.has(l) || a.set(l, c++);
        const p = a.get(l);
        h.set(u, p), d.has(p) || d.set(p, []), d.get(p).push(u);
      }
      const f = /* @__PURE__ */ new Map();
      for (const [u, l] of d) {
        const p = l.map((g) => n.get(g));
        f.set(u, at.centroid(p));
      }
      const m = [...d.keys()];
      return { nodeToCluster: h, clusterCentroids: f, clusterIds: m };
    }
  };
}
async function Ft(s, t) {
  const { nodeToCluster: e, clusterCentroids: n, clusterIds: o } = t, i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
  for (const f of o) {
    const m = n.get(f), u = new $({ pos: m });
    i.set(f, u);
  }
  const a = /* @__PURE__ */ new Map(), c = (f, m) => f <= m ? `${f},${m}` : `${m},${f}`;
  for (const [, f] of s.edges) {
    const m = e.get(f.start), u = e.get(f.end);
    if (m === void 0 || u === void 0 || m === u) continue;
    const l = c(m, u);
    a.set(l, (a.get(l) ?? 0) + 1);
  }
  let h = 0;
  for (const [f, m] of a) {
    const [u, l] = f.split(",").map(Number);
    r.set(h++, new K(u, l, { count: m }));
  }
  const d = new V(i, r);
  return await d.initialize(), d;
}
async function gn(s, t) {
  const n = mn().cluster(s, t);
  return Ft(s, n);
}
async function yn(s, t, e) {
  const n = t.cluster(s, e);
  return Ft(s, n);
}
const Sn = {
  clusterByDistance: gn,
  clusterByStrategy: yn
};
function In(s, t, e, n) {
  if (q(t, "n"), s.length !== t * t || e.length !== t || n.length !== t)
    throw new RangeError("matrix/vector dimensions must match n");
  for (let o = 0; o < t; o++) {
    let i = 0;
    for (let r = 0; r < t; r++) i += s[o * t + r] * e[r];
    n[o] = i;
  }
}
function kn(s) {
  for (const n of s) N(n, "vector coordinate");
  let t = 0;
  for (let n = 0; n < s.length; n++) t += s[n] * s[n];
  const e = Math.sqrt(t);
  if (e > 0) for (let n = 0; n < s.length; n++) s[n] /= e;
}
const _n = 64;
function Ht(s, t, e, n, o, i = 0) {
  if (s.length === 0) return null;
  if (s.length === 1) {
    const w = s[0];
    return {
      cx: w.x,
      cy: w.y,
      cz: w.z,
      count: 1,
      size: o,
      children: null,
      point: w
    };
  }
  if (i >= _n) {
    let w = 0, _ = 0, b = 0;
    for (const E of s)
      w += E.x, _ += E.y, b += E.z;
    const M = s.length;
    return { cx: w / M, cy: _ / M, cz: b / M, count: M, size: o, children: null, point: null };
  }
  const r = t + o, a = e + o, c = n + o, h = o / 2, d = [[], [], [], [], [], [], [], []];
  for (const w of s) {
    let _ = 0;
    w.x >= r && (_ |= 1), w.y >= a && (_ |= 2), w.z >= c && (_ |= 4), d[_].push(w);
  }
  let f = 0, m = 0, u = 0, l = 0;
  const p = [], g = [
    [0, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
    [1, 1, 0],
    [0, 0, 1],
    [1, 0, 1],
    [0, 1, 1],
    [1, 1, 1]
  ];
  for (let w = 0; w < 8; w++) {
    const _ = d[w];
    if (_.length === 0) continue;
    const [b, M, E] = g[w], C = t + b * o, x = e + M * o, v = n + E * o, S = Ht(_, C, x, v, h, i + 1);
    p.push(S), f += S.cx * S.count, m += S.cy * S.count, u += S.cz * S.count, l += S.count;
  }
  return {
    cx: f / l,
    cy: m / l,
    cz: u / l,
    count: l,
    size: o,
    children: p,
    point: null
  };
}
function pt(s, t, e, n, o, i, r, a) {
  if (s === null) return;
  const c = s.cx - t, h = s.cy - e, d = s.cz - n, f = c * c + h * h + d * d;
  if (f < 1e-20) {
    if (s.children)
      for (const l of s.children)
        pt(l, t, e, n, o, i, r, a);
    return;
  }
  const m = Math.sqrt(f);
  if (s.point !== null) {
    if (s.point.index === o) return;
    const l = i / f;
    a.fx -= c * l, a.fy -= h * l, a.fz -= d * l;
    return;
  }
  if (s.size / m < r || s.children === null) {
    const l = i * s.count / f;
    a.fx -= c * l, a.fy -= h * l, a.fz -= d * l;
    return;
  }
  for (const l of s.children)
    pt(l, t, e, n, o, i, r, a);
}
const { vec3: j } = $t, wn = {
  simulationBound: 1e3,
  cohesionValue: 1,
  repulsionValue: 1,
  centerPull: 0.1,
  iterationsPerStep: 1,
  useOctree: !0,
  octreeThreshold: 64,
  octreeTheta: 0.8
};
function Nn(s, t = {}) {
  const e = { ...wn, ...t };
  N(e.simulationBound, "simulationBound", 0), N(e.cohesionValue, "cohesionValue"), N(e.repulsionValue, "repulsionValue"), N(e.centerPull, "centerPull"), N(e.octreeTheta, "octreeTheta", 0), q(e.iterationsPerStep, "iterationsPerStep", 1), q(e.octreeThreshold, "octreeThreshold", 1);
  const n = s.get_node_ids_order(), o = n.length, i = s.get_adjacency(), r = /* @__PURE__ */ new Map();
  n.forEach((l, p) => r.set(l, p));
  const a = new Float32Array(o * 3);
  for (let l = 0; l < o; l++)
    a[l * 3] = Math.random() * e.simulationBound, a[l * 3 + 1] = Math.random() * e.simulationBound, a[l * 3 + 2] = Math.random() * e.simulationBound;
  const c = {
    force: j.create(),
    diff: j.create(),
    neighborAvg: j.create(),
    posI: j.create(),
    posJ: j.create()
  }, h = e.useOctree && o >= e.octreeThreshold, d = h ? Array.from({ length: o }, (l, p) => ({
    x: 0,
    y: 0,
    z: 0,
    index: p
  })) : [];
  function f(l) {
    const p = Math.max(1, e.iterationsPerStep);
    for (let g = 0; g < p; g++) {
      let w = null;
      if (h) {
        let _ = 1 / 0, b = 1 / 0, M = 1 / 0, E = -1 / 0, C = -1 / 0, x = -1 / 0;
        for (let T = 0; T < o; T++) {
          const P = a[T * 3], I = a[T * 3 + 1], U = a[T * 3 + 2];
          d[T].x = P, d[T].y = I, d[T].z = U, P < _ && (_ = P), P > E && (E = P), I < b && (b = I), I > C && (C = I), U < M && (M = U), U > x && (x = U);
        }
        const v = 1e-6, S = Math.max(E - _, C - b, x - M, v) / 2 + v, A = (_ + E) / 2, z = (b + C) / 2, R = (M + x) / 2;
        w = Ht(
          d,
          A - S,
          z - S,
          R - S,
          S
        );
      }
      for (let _ = 0; _ < o; _++) {
        j.set(
          c.posI,
          a[_ * 3],
          a[_ * 3 + 1],
          a[_ * 3 + 2]
        ), j.set(c.force, 0, 0, 0);
        const b = i.get(n[_]);
        if (b.length > 0) {
          c.neighborAvg[0] = 0, c.neighborAvg[1] = 0, c.neighborAvg[2] = 0;
          for (const M of b) {
            const E = r.get(M);
            E !== void 0 && (c.neighborAvg[0] += a[E * 3], c.neighborAvg[1] += a[E * 3 + 1], c.neighborAvg[2] += a[E * 3 + 2]);
          }
          c.neighborAvg[0] /= b.length, c.neighborAvg[1] /= b.length, c.neighborAvg[2] /= b.length, j.subtract(c.diff, c.neighborAvg, c.posI), j.scale(c.diff, c.diff, e.cohesionValue), j.add(c.force, c.force, c.diff);
        }
        if (h && w) {
          const M = { fx: 0, fy: 0, fz: 0 };
          pt(
            w,
            c.posI[0],
            c.posI[1],
            c.posI[2],
            _,
            e.repulsionValue,
            e.octreeTheta,
            M
          ), c.force[0] += M.fx, c.force[1] += M.fy, c.force[2] += M.fz;
        } else
          for (let M = 0; M < o; M++) {
            if (M === _) continue;
            j.set(
              c.posJ,
              a[M * 3],
              a[M * 3 + 1],
              a[M * 3 + 2]
            ), j.subtract(c.diff, c.posJ, c.posI);
            const E = j.squaredLength(c.diff);
            E < 1e-10 || (j.scale(c.diff, c.diff, e.repulsionValue / E), j.subtract(c.force, c.force, c.diff));
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
    for (let p = 0; p < o; p++)
      l.set(
        n[p],
        new L(a[p * 3], a[p * 3 + 1], a[p * 3 + 2])
      );
    return l;
  }
  return { step: f, getPositions: m, getPositionMap: u };
}
const bn = {
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
function Mn(s, t) {
  const { i: e, j: n, d: o } = s;
  for (let i = o.length - 1; i >= 1; i--) {
    const r = Math.floor(t() * (i + 1));
    let a = e[i];
    e[i] = e[r], e[r] = a, a = n[i], n[i] = n[r], n[r] = a;
    const c = o[i];
    o[i] = o[r], o[r] = c;
  }
}
function xn(s) {
  let t = s & 2147483647;
  return () => (t = Math.imul(t, 1103515245) + 12345 & 2147483647, t / 2147483648);
}
function En(s, t, e) {
  const n = t.length, o = s.get_adjacency(), i = t.map((u) => {
    const l = [];
    for (const p of o.get(u)) {
      const g = e.get(p);
      g !== void 0 && l.push(g);
    }
    return Uint32Array.from(l);
  }), r = new Int32Array(n), a = new Uint32Array(n), c = (u) => {
    r.fill(-1), r[u] = 0, a[0] = u;
    for (let l = 0, p = 1; l < p; l++) {
      const g = a[l];
      for (const w of i[g])
        r[w] === -1 && (r[w] = r[g] + 1, a[p++] = w);
    }
  }, h = new Int32Array(n).fill(-1);
  let d = 0;
  for (let u = 0; u < n; u++) {
    if (h[u] !== -1) continue;
    c(u);
    let l = 0;
    for (let p = 0; p < n; p++)
      r[p] >= 0 && (h[p] = u, l++);
    d += l * (l - 1) / 2;
  }
  const f = {
    i: new Uint32Array(d),
    j: new Uint32Array(d),
    d: new Float32Array(d)
  };
  let m = 0;
  for (let u = 0; u < n; u++) {
    c(u);
    for (let l = u + 1; l < n; l++)
      r[l] > 0 && (f.i[m] = u, f.j[m] = l, f.d[m] = r[l], m++);
  }
  return f;
}
async function Ln(s, t = {}) {
  const e = {
    ...bn,
    ...t,
    seed: t.seed ?? Math.floor(Math.random() * 2147483647)
  };
  if (e.dimensions !== 2 && e.dimensions !== 3) throw new RangeError("dimensions must be 2 or 3");
  q(e.epochsPerStep, "epochsPerStep", 1), q(e.tMax, "tMax", 1), q(e.seed, "seed", -Number.MAX_SAFE_INTEGER), N(e.simulationBound, "simulationBound", 0), N(e.centerPull, "centerPull"), N(e.scaleBound, "scaleBound", 0), N(e.learningRate, "learningRate", 0), N(e.eps, "eps", Number.MIN_VALUE, 1), N(e.initialPreservation, "initialPreservation", 0, 1);
  const n = s.get_node_ids_order(), o = n.length;
  if (e.initialPositions) {
    if (e.initialPositions.length !== o * 3) throw new RangeError("initialPositions must contain n * 3 coordinates");
    for (const x of e.initialPositions) N(x, "initialPositions coordinate");
  }
  const i = /* @__PURE__ */ new Map();
  n.forEach((x, v) => i.set(x, v));
  const r = En(s, n, i), a = r.d.length;
  let c = 1 / 0, h = -1 / 0;
  for (let x = 0; x < a; x++) {
    const v = 1 / (r.d[x] * r.d[x]);
    v < c && (c = v), v > h && (h = v);
  }
  (c <= 0 || h <= 0) && (c = 1), h <= 0 && (h = 1);
  const d = 1 / c, f = e.eps / h, m = e.tMax > 1 ? Math.log(d / f) / (e.tMax - 1) : 0, u = (x) => d * Math.exp(-m * x), l = e.dimensions, p = xn(e.seed), g = new Float32Array(o * 3);
  let w = null;
  if (e.initialPositions && e.initialPositions.length >= o * 3) {
    if (g.set(e.initialPositions.subarray(0, o * 3)), e.initialPreservation > 0 && (w = new Float32Array(e.initialPositions.subarray(0, o * 3))), l === 2)
      for (let x = 0; x < o; x++) g[x * 3 + 2] = 0;
  } else {
    const x = e.simulationBound;
    for (let v = 0; v < o; v++)
      g[v * 3] = p() * x, g[v * 3 + 1] = p() * x, g[v * 3 + 2] = l === 2 ? 0 : p() * x;
  }
  let _ = 0;
  const b = 1e-12;
  function M(x) {
    const v = Math.max(1, e.epochsPerStep), S = _;
    for (let A = 0; A < v && _ < e.tMax; A++) {
      const z = e.useSchedule ? u(_) : e.learningRate;
      _++, Mn(r, p);
      for (let R = 0; R < a; R++) {
        const T = r.i[R], P = r.j[R], I = r.d[R];
        let U = z / (I * I);
        U > 1 && (U = 1);
        const Q = g[T * 3] - g[P * 3], F = g[T * 3 + 1] - g[P * 3 + 1], J = l === 3 ? g[T * 3 + 2] - g[P * 3 + 2] : 0, ot = Math.max(Math.sqrt(Q * Q + F * F + J * J), b), G = U * (ot - I) / (2 * ot);
        g[T * 3] -= G * Q, g[T * 3 + 1] -= G * F, l === 3 && (g[T * 3 + 2] -= G * J), g[P * 3] += G * Q, g[P * 3 + 1] += G * F, l === 3 && (g[P * 3 + 2] += G * J);
      }
    }
    if (_ !== S) {
      if (e.initialPreservation > 0 && w) {
        const A = e.initialPreservation;
        for (let z = 0; z < o * 3; z++)
          g[z] = (1 - A) * g[z] + A * w[z];
      }
      if (e.centerPull > 0)
        for (let A = 0; A < o; A++)
          g[A * 3] -= e.centerPull * g[A * 3], g[A * 3 + 1] -= e.centerPull * g[A * 3 + 1], l === 3 && (g[A * 3 + 2] -= e.centerPull * g[A * 3 + 2]);
      if (e.scaleBound > 0 && o > 0) {
        let A = 0, z = 0, R = 0;
        for (let P = 0; P < o; P++)
          A += g[P * 3], z += g[P * 3 + 1], R += g[P * 3 + 2];
        A /= o, z /= o, R /= o;
        let T = 0;
        for (let P = 0; P < o; P++) {
          g[P * 3] -= A, g[P * 3 + 1] -= z, g[P * 3 + 2] -= R;
          const I = Math.sqrt(
            g[P * 3] ** 2 + g[P * 3 + 1] ** 2 + (l === 3 ? g[P * 3 + 2] ** 2 : 0)
          );
          I > T && (T = I);
        }
        if (T > 0) {
          const P = e.scaleBound / T;
          for (let I = 0; I < o * 3; I++) g[I] *= P;
        }
      }
      if (l === 2)
        for (let A = 0; A < o; A++) g[A * 3 + 2] = 0;
    }
  }
  function E() {
    return g;
  }
  function C() {
    const x = /* @__PURE__ */ new Map();
    for (let v = 0; v < o; v++)
      x.set(
        n[v],
        new L(g[v * 3], g[v * 3 + 1], g[v * 3 + 2])
      );
    return x;
  }
  return { step: M, getPositions: E, getPositionMap: C };
}
export {
  se as Constructors,
  Me as Drawing,
  K as Edge,
  at as Geometry,
  V as Graph,
  An as GraphDrawer,
  Dt as GraphMethods,
  Sn as Hierarchy,
  rt as Line,
  Tn as Models,
  L as Point,
  vn as SampleData,
  Dn as ThreeWrapper,
  B as Utilities,
  $ as _Node,
  Nn as createKamadaKawai3D,
  Ln as createStressSGD3D,
  $t as glMatrix,
  In as matrixVectorMultiply,
  kn as normalizeVector
};
//# sourceMappingURL=pgl_module.js.map
