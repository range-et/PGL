class _n {
  /**
   * Construct an edge
   *
   * @param start Start index of the edge based on the array of nodes
   * @param end End index of the edge based on the array of nodes
   * @param data - Optional data; "ldata" is reserved for line geometry used when drawing the edge
   */
  constructor(e, n, i = {}) {
    this.start = e, this.end = n, this.data = { ...i };
  }
}
class nn {
  /**
   * Construct a graph object (no initializing)
   *
   * @param nodes - Map of all the nodes associated with the graph
   * @param edges - Map of all the edges associated with the graph
   */
  constructor(e, n) {
    this.nodes = e, this.edges = n;
    let i = -1;
    for (const r of n.keys()) r > i && (i = r);
    this._nextEdgeId = i + 1;
  }
  // test function
  /**
   * Prints out a snapshot of data associated with this graph like how many nodes and how many edges
   */
  printData() {
    const e = "This is a graph with " + this.nodes.size + " nodes and " + this.edges.size + " edges";
    console.log(e);
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
  static async create(e, n) {
    const i = new nn(e, n);
    return await i.initialize(), i;
  }
  /**
   * Constructs the adjacency list representation for the graph.
   * Async to allow yielding on large graphs and avoid hanging the browser.
   */
  async constructAdjacencyList() {
    for (const e of this.nodes.values()) e.neighbours = [];
    this.edges.forEach((e) => {
      const n = e.start, i = e.end;
      this.nodes.get(n) && this.nodes.get(n).neighbours.push(i), this.nodes.get(i) && this.nodes.get(i).neighbours.push(n);
    }), await Promise.resolve();
    for (const e of this.nodes.keys()) {
      const n = this.nodes.get(e).neighbours, i = [...new Set(n)], r = i.indexOf(e);
      r > -1 && i.splice(r, 1), this.nodes.get(e).neighbours = i;
    }
  }
  // add a node
  /**
   * Add a node to the graph.
   * @param nodeID - The node ID
   * @param data - Data associated with the node
   */
  add_node(e, n) {
    this.nodes.set(e, n);
  }
  // add an edge
  /**
   * Add an edge to the graph
   * @param start - Starting index of the edge
   * @param end - The end index of the edge
   * @param data - data associated with the edge
   */
  add_edge(e, n, i = {}) {
    const r = new _n(e, n, i), s = this._nextEdgeId++;
    this.edges.set(s, r);
    const a = this.nodes.get(e), o = this.nodes.get(n);
    e !== n && (a && !a.neighbours.includes(n) && a.neighbours.push(n), o && !o.neighbours.includes(e) && o.neighbours.push(e));
  }
  /**
   * Remove an edge by ID. Updates adjacency lists.
   * Call {@link constructAdjacencyList} after bulk removals if you need a clean adjacency state.
   *
   * @param edgeId - The edge ID (from add_edge or edges Map key)
   * @returns true if the edge existed and was removed, false otherwise
   */
  remove_edge(e) {
    const n = this.edges.get(e);
    if (!n) return !1;
    const { start: i, end: r } = n;
    if (this.edges.delete(e), ![...this.edges.values()].some(
      (a) => a.start === i && a.end === r || a.start === r && a.end === i
    )) {
      const a = this.nodes.get(i), o = this.nodes.get(r);
      a && (a.neighbours = a.neighbours.filter((c) => c !== r)), o && (o.neighbours = o.neighbours.filter((c) => c !== i));
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
  remove_node(e) {
    if (!this.nodes.has(e)) return !1;
    for (const [n, i] of this.edges)
      (i.start === e || i.end === e) && this.edges.delete(n);
    this.nodes.delete(e);
    for (const n of this.nodes.values())
      n.neighbours = n.neighbours.filter((i) => i !== e);
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
    const e = /* @__PURE__ */ new Map();
    for (const n of this.nodes.keys())
      e.set(n, this.nodes.get(n).neighbours);
    return e;
  }
  // set position based on an array of positions
  // this could be anything (we use kamada kawai )
  /**
   * Apply a position map based on some data
   * @param data - the position map that has to be applied to the graph
   */
  apply_position_map(e) {
    for (let n of e.keys())
      this.nodes.get(n).data = {
        ...this.nodes.get(n).data,
        pos: e.get(n)
      };
  }
  // create new edge pos representation
  // same approach for applying the key data
  /**
   * Apply an line map to a graph
   * @param data Line data that has to be applied to the graph
   */
  apply_edge_pos_maps(e) {
    for (let n of e.keys())
      this.edges.get(n).data = {
        ...this.edges.get(n).data,
        ldata: e.get(n)
      };
  }
  // get the edge reps
  // this returns all the edge map readings
  /**
   * get the current edge map
   * @returns The current set of edges associated with the graph
   */
  get_edge_map() {
    const e = /* @__PURE__ */ new Map();
    for (const n of this.edges.keys()) {
      const i = this.edges.get(n).data.ldata;
      i != null && e.set(n, i);
    }
    return e;
  }
  // graph apply pos and edge map
  /**
   * Applies all the maps to the graph
   * @param layout - Applies an object of maps associated with a graph: {pmap:(the position map), emap:(the edge map)}
   */
  apply_drawing_maps(e) {
    e.pmap && this.apply_position_map(e.pmap), e.emap && this.apply_edge_pos_maps(e.emap);
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
    var n, i;
    const e = /* @__PURE__ */ new Map();
    for (const r of this.nodes.keys()) {
      const s = (i = (n = this.nodes.get(r)) == null ? void 0 : n.data) == null ? void 0 : i.pos;
      s != null && e.set(r, s);
    }
    return e;
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
    const e = this.get_node_ids_order(), n = e.length, i = new Float32Array(n * n), r = this.get_adjacency(), s = /* @__PURE__ */ new Map();
    e.forEach((a, o) => s.set(a, o));
    for (let a = 0; a < n; a++) {
      const o = e[a], c = r.get(o);
      for (const l of c) {
        const h = s.get(l);
        h !== void 0 && (i[a * n + h] = 1);
      }
    }
    return { matrix: i, nodeIds: e };
  }
}
class Nn {
  /**
   * @param data - Data associated with the node; include "pos" (Point) for graph visuals
   */
  constructor(e = {}) {
    this.data = { ...e }, this.neighbours = [];
  }
}
async function yc(t, e) {
  const n = t.get_adjacency(), i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set([e]), s = [e];
  i.set(e, -1);
  for (let a = 0; a < s.length; a++) {
    const o = s[a], c = n.get(o) ?? [];
    for (let l = 0; l < c.length; l++) {
      const h = c[l];
      !r.has(h) && n.has(h) && (r.add(h), s.push(h), i.set(h, o));
    }
  }
  return i;
}
async function Rs(t, e) {
  const n = await yc(t, e), i = /* @__PURE__ */ new Map();
  for (const [s, a] of n)
    i.set(s, s === e ? 0 : i.get(a) + 1);
  const r = /* @__PURE__ */ new Map();
  for (const s of t.nodes.keys()) {
    const a = i.get(s);
    a !== void 0 && r.set(s, a);
  }
  return r;
}
async function Ch(t) {
  const e = [...t.nodes.keys()];
  if (e.length === 0) return { start: 0, end: 0, distance: 0 };
  if (e.length === 1) return { start: e[0], end: e[0], distance: 0 };
  const n = t.get_adjacency(), i = e.filter((l) => n.get(l).length > 0), r = i.length > 0 ? i : e;
  let s = r[Math.floor(Math.random() * r.length)], a = await Rs(t, s), o = -1;
  for (const l of a.keys()) {
    const h = a.get(l);
    h > o && (s = l, o = h);
  }
  const c = s;
  a = await Rs(t, s), o = -1;
  for (const l of a.keys()) {
    const h = a.get(l);
    h > o && (s = l, o = h);
  }
  return { start: c, end: s, distance: o };
}
async function Ph(t, e) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  for (const a of e) {
    const o = t.nodes.get(a);
    o && n.set(a, new Nn(o.data));
  }
  let r = 0;
  for (const a of t.edges.values())
    n.has(a.start) && n.has(a.end) && (i.set(r, new _n(a.start, a.end, a.data)), r += 1);
  return await nn.create(n, i);
}
const Sc = { GraphDiameter: Ch, Dijkstra: Rs, BFSSearch: yc, SelectSubgraph: Ph }, Dh = {
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
}, Lh = {
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
async function Ih(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (let s = 0; s < t.length; s++) {
    const a = new Nn(t[s].data);
    n.set(t[s], a);
  }
  const i = /* @__PURE__ */ new Map();
  for (let s = 0; s < e.length; s++) {
    const a = new _n(e[s][0], e[s][1], e[s].data);
    i.set(s, a);
  }
  return await nn.create(n, i);
}
const Uh = { ConstructGraphNodeEdgesList: Ih };
class mt {
  /**
   * Constructs a point based on the x y z values
   * @param x x value 
   * @param y y value
   * @param z z value 
   */
  constructor(e, n, i) {
    this.x = e, this.y = n, this.z = i;
  }
  // Points are somewhat the same thing as a vector 
  // So im using the same type instead of redeclaring the 
  // Type
  /**
   * Displaces a point - note this method moves the existing point
   * @param Point - Displacement vector (used as a point)
   */
  translate(e) {
    this.x = this.x + e.x, this.y = this.y + e.y, this.z = this.z + e.z;
  }
}
function Nh(t) {
  let e = 0;
  for (let i = 0; i < t.length; i++)
    e = e + t[i];
  const n = e / t.length;
  return Number.isNaN(n) ? 0 : n;
}
function Fh(t, e) {
  return Math.pow(
    Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2) + Math.pow(t.z - e.z, 2),
    0.5
  );
}
function Oh(t, e) {
  return Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2) + Math.pow(t.z - e.z, 2);
}
function zh(t, e) {
  var n = new Array(e), i = t.length, r = new Array(i);
  if (e > i)
    throw new RangeError("getRandom: more elements taken than available");
  for (; e--; ) {
    var s = Math.floor(Math.random() * i);
    n[e] = t[s in r ? r[s] : s], r[s] = --i in r ? r[i] : i;
  }
  return n;
}
function Bh(t, e) {
  const n = /* @__PURE__ */ new Map();
  let i;
  for (const r of t.keys())
    i = Math.random(), i < e && n.set(r, t.get(r));
  return n;
}
const Ct = {
  calculateAverage: Nh,
  calculateDistance: Fh,
  calculateSquaredDistance: Oh,
  getRandomSubset: zh,
  getRandomSubset_map: Bh
};
function lt(t, e, n = -1 / 0, i = 1 / 0) {
  if (!Number.isFinite(t) || t < n || t > i)
    throw new RangeError(`${e} must be finite and between ${n} and ${i}`);
}
function Pn(t, e, n = 0) {
  if (!Number.isSafeInteger(t) || t < n)
    throw new RangeError(`${e} must be a safe integer >= ${n}`);
}
let $i = class {
  /**
   * Constructs a line from an array of points
   * @param points an array of points
   */
  constructor(e) {
    this.points = [], e.forEach((n) => {
      const i = new mt(n.x, n.y, n.z);
      this.points.push(i);
    });
  }
};
function Ec(t, e, n) {
  Pn(n, "divisions", 1);
  const i = new mt(t.x, t.y, t.z), r = new mt(e.x, e.y, e.z), s = [];
  for (let o = 0; o <= n; o++) {
    const c = o / n, l = (1 - c) * i.x + c * r.x, h = (1 - c) * i.y + c * r.y, f = (1 - c) * i.z + c * r.z, d = new mt(l, h, f);
    s.push(d);
  }
  return new $i(s);
}
function Hh(t, e, n) {
  lt(n, "distance", Number.MIN_VALUE);
  const i = Ct.calculateDistance(t, e), r = Math.round(i / n) + 2;
  return Ec(t, e, r);
}
function kh(t) {
  if (t.length === 0) throw new RangeError("centroid requires at least one point");
  let e = 0, n = 0, i = 0;
  return t.forEach((s) => {
    e += s.x, n += s.y, i += s.z;
  }), e = e / t.length, n = n / t.length, i = i / t.length, new mt(e, n, i);
}
const Yi = {
  line_from_start_end_divisions: Ec,
  line_from_start_end_distance: Hh,
  centroid: kh
};
async function Vh(t, e, n = 1e3, i = 1, r = 1) {
  const s = t.get_adjacency(), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
  let c, l;
  for (const M of s.keys())
    c = Math.random() * n, l = Math.random() * n, a.set(M, c), o.set(M, l);
  for (let M = 0; M < e; M++) {
    let x, P, b, A, R, S, v, C, F, L, D, W, V, K;
    for (const G of s.keys()) {
      const te = s.get(G);
      x = a.get(G), P = o.get(G), b = [], A = [], te.forEach((he) => {
        const ie = a.get(he), Se = o.get(he);
        b.push(ie), A.push(Se);
      }), D = Ct.calculateAverage(b), W = Ct.calculateAverage(A), R = [], S = [];
      let ae, de, Le, Xe;
      for (const he of t.nodes.keys())
        he != G && (Le = a.get(he), Xe = o.get(he), ae = Le - x, de = Xe - P, S.push(ae), R.push(de));
      F = r * 1 / (Ct.calculateAverage(S) * Ct.calculateAverage(S)), L = r * 1 / (Ct.calculateAverage(R) * Ct.calculateAverage(R)), v = i * (D - x), C = i * (W - P), V = i * (0 - x), K = i * (0 - P);
      const q = F + V + v + x, Q = L + K + C + P;
      a.set(G, q), o.set(G, Q);
    }
  }
  let h = /* @__PURE__ */ new Map();
  for (const M of a.keys())
    h.set(M, new mt(a.get(M), 0, o.get(M)));
  const f = [], d = [], u = [];
  let g;
  for (const M of h.keys())
    g = h.get(M), f.push(g.x), d.push(g.y), u.push(g.z);
  const _ = Ct.calculateAverage(f), p = Ct.calculateAverage(d), m = Ct.calculateAverage(u), E = new mt(
    -_,
    -p,
    -m
  );
  return h = Ac(h, E), h;
}
function Gh(t) {
  const e = t.get_adjacency(), n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  for (const s of e.keys())
    n.set(s, Math.random() * 200), i.set(s, Math.random() * 200);
  const r = /* @__PURE__ */ new Map();
  for (const s of n.keys())
    r.set(s, new mt(n.get(s), 0, i.get(s)));
  return r;
}
function Tc(t, e) {
  const n = /* @__PURE__ */ new Map();
  let i, r, s;
  for (const a of t.edges.keys()) {
    i = t.edges.get(a), r = t.nodes.get(i.start).data.pos, s = t.nodes.get(i.end).data.pos;
    const o = Yi.line_from_start_end_distance(
      r,
      s,
      e
    );
    n.set(a, o);
  }
  return n;
}
function Wh(t, e) {
  const n = /* @__PURE__ */ new Map();
  let i, r, s;
  for (const a of t.edges.keys()) {
    i = t.edges.get(a), r = t.nodes.get(i.start).data.pos, s = t.nodes.get(i.end).data.pos;
    const o = Yi.line_from_start_end_divisions(
      r,
      s,
      e
    );
    n.set(a, o);
  }
  return n;
}
async function bc(t, e, n) {
  const i = /* @__PURE__ */ new Map();
  for (let E of t.keys())
    i.set(E, new $i(t.get(E).points));
  let r, s, a, o, c, l, h, f, d, u, g, _, p, m;
  for (let E = 0; E < e; E++)
    for (let M of i.keys()) {
      r = i.get(M);
      for (let x = 1; x < r.points.length - 1; x++) {
        a = [], o = [], c = [], l = r.points[x];
        for (let b of i.keys())
          if (b != M) {
            s = i.get(b);
            for (let A = 1; A < s.points.length - 1; A++)
              h = s.points[A], f = Ct.calculateSquaredDistance(l, h), f <= Math.pow(n, 2) && (d = h.x - l.x, u = h.y - l.y, g = h.z - l.z, a.push(d), o.push(u), c.push(g));
          }
        _ = l.x + 0.8 * (Ct.calculateAverage(a) || 0), p = l.y + 0.8 * (Ct.calculateAverage(o) || 0), m = l.z + 0.8 * (Ct.calculateAverage(c) || 0);
        const P = new mt(_, p, m);
        r.points[x] = P;
      }
    }
  return i;
}
function Xh(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (let i of t.keys())
    n.set(i, new $i(t.get(i).points));
  for (const i of n.keys()) {
    const r = n.get(i);
    if (r.points.length < 2) continue;
    let s, a;
    for (let o = 0; o < r.points.length; o++)
      s = r.points[o], a = e * Math.sin(Math.PI * o / (r.points.length - 1)), s.y = s.y + a;
  }
  return n;
}
function qh(t, e, n) {
  let i = 0, r, s;
  const a = (o) => {
    const c = o[e];
    return typeof c == "number" ? c : Number(c) || 0;
  };
  for (let o of t.nodes.values())
    r = a(o.data), r >= i && (i = r);
  for (const o of t.nodes.values())
    r = a(o.data), s = i > 0 ? r / i * n : 0, s = Math.max(0, s), s = Math.min(n, s), o.data.pos.y = s;
}
async function $h(t, e, n, i) {
  const r = t.get_adjacency(), s = await Sc.Dijkstra(t, e);
  let a = 0;
  for (const _ of s.values()) _ > a && (a = _);
  if ([...r.keys()].some((_) => !s.has(_))) {
    a += 1;
    for (const _ of r.keys()) s.has(_) || s.set(_, a);
  }
  const c = /* @__PURE__ */ new Map();
  for (let _ = 0; _ <= a; _++) {
    const p = [];
    for (const m of s.keys())
      _ == s.get(m) && p.push(m);
    c.set(_, p);
  }
  const l = /* @__PURE__ */ new Map(), h = i.x || 0, f = i.y || 0, d = i.z || 0;
  for (const _ of r.keys()) {
    const p = s.get(_) * n, m = c.get(s.get(_)), E = 2 * Math.PI * (m.indexOf(_) / m.length), M = Math.sin(E) * p, x = Math.cos(E) * p, P = new mt(M + h, -p + f, x + d);
    l.set(_, P);
  }
  t.apply_position_map(l);
  const u = Tc(t, 1), g = await bc(u, 12, 5);
  return { pmap: l, emap: g };
}
function Yh(t, e) {
  const n = t.get_map(), i = Ac(n.pmap, e), r = jh(n.emap, e);
  t.apply_drawing_maps({ pmap: i, emap: r });
}
function Ac(t, e) {
  const n = /* @__PURE__ */ new Map();
  for (let i of t.keys()) {
    const r = t.get(i);
    n.set(i, new mt(r.x + e.x, r.y + e.y, r.z + e.z));
  }
  return n;
}
function jh(t, e) {
  const n = /* @__PURE__ */ new Map();
  let i, r, s;
  for (let a of t.keys()) {
    i = [], r = t.get(a);
    for (let o of r.points)
      i.push(new mt(o.x + e.x, o.y + e.y, o.z + e.z));
    s = new $i(i), n.set(a, s);
  }
  return n;
}
function Zh(t, e) {
  let n, i, r, s;
  for (const a of t.edges.keys())
    n = t.edges.get(a), i = t.nodes.get(n.start).data.pos, r = t.nodes.get(n.end).data.pos, s = Yi.line_from_start_end_distance(
      i,
      r,
      e
    ), n.data.ldata = s;
}
function Kh(t, e) {
  let n, i, r, s;
  for (const a of t.edges.keys())
    n = t.edges.get(a), i = t.nodes.get(n.start).data.pos, r = t.nodes.get(n.end).data.pos, s = Yi.line_from_start_end_divisions(i, r, e), n.data.ldata = s;
}
const Jh = {
  SimulateKamadaKawai: Vh,
  DrawEdgeLines: Tc,
  DrawEdgeLinesDivisions: Wh,
  DrawEdgeBundling: bc,
  HivePlot: $h,
  DisplaceEdgeInY: Xh,
  MoveGraph: Yh,
  InstanciateRandomPositions: Gh,
  DisplaceVertices: qh,
  // these two are special functions
  UpdateEdgeLinesDist: Zh,
  UpdateEdgeLinesDivs: Kh
};
async function Qh(t) {
  const e = t.split(/\r?\n/), n = [], i = /* @__PURE__ */ new Set();
  for (const o of e) {
    const c = o.trim();
    if (!c || c.startsWith("#")) continue;
    const l = c.split(/\s+/);
    if (l.length < 2 || !/^[+-]?\d+$/.test(l[0]) || !/^[+-]?\d+$/.test(l[1])) continue;
    const h = Number(l[0]), f = Number(l[1]);
    !Number.isSafeInteger(h) || !Number.isSafeInteger(f) || (n.push([h, f]), i.add(h), i.add(f));
  }
  const r = /* @__PURE__ */ new Map();
  for (const o of i)
    r.set(o, new Nn({ pos: new mt(0, 0, 0) }));
  const s = /* @__PURE__ */ new Map();
  return n.forEach(([o, c], l) => {
    s.set(l, new _n(o, c, {}));
  }), await nn.create(r, s);
}
async function ef() {
  const t = Dh;
  return await Uh.ConstructGraphNodeEdgesList(t.nodes, t.edges);
}
async function tf() {
  const t = Lh, e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  t.nodes.forEach((s) => {
    const a = s.id, o = new mt(s.px * 50, 0, s.py * 50), c = s.member, l = new Nn({ pos: o, size: 10, info: "Node Info", modularity: c });
    e.set(a, l);
  });
  for (let s = 0; s < t.edges.length; s++) {
    const a = t.edges[s], o = a[0], c = a[1], l = new _n(o, c, {});
    n.set(s, l);
  }
  const i = await nn.create(e, n), r = Jh.DrawEdgeLines(i, 20);
  return i.apply_edge_pos_maps(r), i;
}
async function nf(t) {
  const e = t.split(/\r?\n/), n = [], i = /* @__PURE__ */ new Set(), r = [], s = [];
  for (const d of e) {
    const u = d.trim();
    if (!u || u.startsWith("#")) continue;
    const g = u.split(/\s+/);
    if (g[0] === "v") {
      const _ = g.slice(1, 4).map(Number);
      _.length === 3 && _.every((p) => Number.isFinite(Math.fround(p))) ? (r.push(n.length / 3), n.push(..._)) : r.push(void 0);
    } else if (g[0] === "f") {
      const _ = g.slice(1).map((m) => m.split("/")[0]);
      if (_.length < 3 || _.some((m) => !/^\d+$/.test(m))) continue;
      const p = _.map(Number);
      p.every((m) => Number.isSafeInteger(m) && m >= 1) && s.push(p);
    }
  }
  for (const d of s) {
    const u = d.map((g) => r[g - 1]);
    if (!u.some((g) => g === void 0))
      for (let g = 0; g < u.length; g++) {
        const _ = u[g], p = u[(g + 1) % u.length];
        _ !== p && i.add(_ < p ? `${_},${p}` : `${p},${_}`);
      }
  }
  const a = n.length / 3, o = /* @__PURE__ */ new Map();
  for (let d = 0; d < a; d++)
    o.set(d, new Nn({ pos: new mt(0, 0, 0) }));
  const c = /* @__PURE__ */ new Map();
  let l = 0;
  for (const d of i) {
    const [u, g] = d.split(",").map((_) => parseInt(_, 10));
    c.set(l++, new _n(u, g, {}));
  }
  const h = await nn.create(o, c), f = new Float32Array(n);
  return { graph: h, positions: f };
}
async function rf() {
  const { dwt_1005: t } = await import("./dwt_1005-C8KXz1aw.mjs"), e = t, n = /* @__PURE__ */ new Set();
  for (const l of Object.keys(e)) {
    const h = parseInt(l, 10);
    n.add(h);
    for (const f of e[l]) n.add(f);
  }
  const i = /* @__PURE__ */ new Set();
  for (const l of Object.keys(e)) {
    const h = parseInt(l, 10);
    for (const f of e[l]) {
      const d = Math.min(h, f), u = Math.max(h, f);
      i.add(`${d},${u}`);
    }
  }
  const r = /* @__PURE__ */ new Map(), s = [...n].sort((l, h) => l - h);
  for (const l of s)
    r.set(l, new Nn({ pos: new mt(0, 0, 0) }));
  const a = /* @__PURE__ */ new Map();
  let o = 0;
  for (const l of i) {
    const [h, f] = l.split(",").map((d) => parseInt(d, 10));
    a.set(o++, new _n(h, f, {}));
  }
  return await nn.create(r, a);
}
const zy = { LoadZKC: ef, LoadZKCSimulated: tf, LoadGraphFromEdgeListText: Qh, LoadGraphFromObjText: nf, LoadDwt1005: rf };
/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
const ya = "170", xi = { ROTATE: 0, DOLLY: 1, PAN: 2 }, gi = { ROTATE: 0, PAN: 1, DOLLY_PAN: 2, DOLLY_ROTATE: 3 }, sf = 0, to = 1, af = 2, wc = 1, of = 2, fn = 3, In = 0, Pt = 1, Kt = 2, Dn = 0, Mi = 1, no = 2, io = 3, ro = 4, cf = 5, Wn = 100, lf = 101, hf = 102, ff = 103, df = 104, uf = 200, pf = 201, mf = 202, gf = 203, Cs = 204, Ps = 205, _f = 206, vf = 207, xf = 208, Mf = 209, yf = 210, Sf = 211, Ef = 212, Tf = 213, bf = 214, Ds = 0, Ls = 1, Is = 2, Ei = 3, Us = 4, Ns = 5, Fs = 6, Os = 7, Rc = 0, Af = 1, wf = 2, Ln = 0, Rf = 1, Cf = 2, Pf = 3, Df = 4, Lf = 5, If = 6, Uf = 7, Cc = 300, Ti = 301, bi = 302, zs = 303, Bs = 304, Vr = 306, Hs = 1e3, qn = 1001, ks = 1002, Nt = 1003, Nf = 1004, tr = 1005, Jt = 1006, Zr = 1007, $n = 1008, mn = 1009, Pc = 1010, Dc = 1011, Xi = 1012, Sa = 1013, Yn = 1014, Qt = 1015, ji = 1016, Ea = 1017, Ta = 1018, Ai = 1020, Lc = 35902, Ic = 1021, Uc = 1022, $t = 1023, Nc = 1024, Fc = 1025, yi = 1026, wi = 1027, ba = 1028, Aa = 1029, Oc = 1030, wa = 1031, Ra = 1033, Cr = 33776, Pr = 33777, Dr = 33778, Lr = 33779, Vs = 35840, Gs = 35841, Ws = 35842, Xs = 35843, qs = 36196, $s = 37492, Ys = 37496, js = 37808, Zs = 37809, Ks = 37810, Js = 37811, Qs = 37812, ea = 37813, ta = 37814, na = 37815, ia = 37816, ra = 37817, sa = 37818, aa = 37819, oa = 37820, ca = 37821, Ir = 36492, la = 36494, ha = 36495, zc = 36283, fa = 36284, da = 36285, ua = 36286, Ff = 3200, Of = 3201, zf = 0, Bf = 1, Cn = "", Bt = "srgb", Ci = "srgb-linear", Gr = "linear", Ze = "srgb", ti = 7680, so = 519, Hf = 512, kf = 513, Vf = 514, Bc = 515, Gf = 516, Wf = 517, Xf = 518, qf = 519, ao = 35044, oo = "300 es", un = 2e3, zr = 2001;
class Zn {
  addEventListener(e, n) {
    this._listeners === void 0 && (this._listeners = {});
    const i = this._listeners;
    i[e] === void 0 && (i[e] = []), i[e].indexOf(n) === -1 && i[e].push(n);
  }
  hasEventListener(e, n) {
    if (this._listeners === void 0) return !1;
    const i = this._listeners;
    return i[e] !== void 0 && i[e].indexOf(n) !== -1;
  }
  removeEventListener(e, n) {
    if (this._listeners === void 0) return;
    const r = this._listeners[e];
    if (r !== void 0) {
      const s = r.indexOf(n);
      s !== -1 && r.splice(s, 1);
    }
  }
  dispatchEvent(e) {
    if (this._listeners === void 0) return;
    const i = this._listeners[e.type];
    if (i !== void 0) {
      e.target = this;
      const r = i.slice(0);
      for (let s = 0, a = r.length; s < a; s++)
        r[s].call(this, e);
      e.target = null;
    }
  }
}
const xt = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"], Ur = Math.PI / 180, pa = 180 / Math.PI;
function Zi() {
  const t = Math.random() * 4294967295 | 0, e = Math.random() * 4294967295 | 0, n = Math.random() * 4294967295 | 0, i = Math.random() * 4294967295 | 0;
  return (xt[t & 255] + xt[t >> 8 & 255] + xt[t >> 16 & 255] + xt[t >> 24 & 255] + "-" + xt[e & 255] + xt[e >> 8 & 255] + "-" + xt[e >> 16 & 15 | 64] + xt[e >> 24 & 255] + "-" + xt[n & 63 | 128] + xt[n >> 8 & 255] + "-" + xt[n >> 16 & 255] + xt[n >> 24 & 255] + xt[i & 255] + xt[i >> 8 & 255] + xt[i >> 16 & 255] + xt[i >> 24 & 255]).toLowerCase();
}
function bt(t, e, n) {
  return Math.max(e, Math.min(n, t));
}
function $f(t, e) {
  return (t % e + e) % e;
}
function Kr(t, e, n) {
  return (1 - n) * t + n * e;
}
function Ui(t, e) {
  switch (e.constructor) {
    case Float32Array:
      return t;
    case Uint32Array:
      return t / 4294967295;
    case Uint16Array:
      return t / 65535;
    case Uint8Array:
      return t / 255;
    case Int32Array:
      return Math.max(t / 2147483647, -1);
    case Int16Array:
      return Math.max(t / 32767, -1);
    case Int8Array:
      return Math.max(t / 127, -1);
    default:
      throw new Error("Invalid component type.");
  }
}
function wt(t, e) {
  switch (e.constructor) {
    case Float32Array:
      return t;
    case Uint32Array:
      return Math.round(t * 4294967295);
    case Uint16Array:
      return Math.round(t * 65535);
    case Uint8Array:
      return Math.round(t * 255);
    case Int32Array:
      return Math.round(t * 2147483647);
    case Int16Array:
      return Math.round(t * 32767);
    case Int8Array:
      return Math.round(t * 127);
    default:
      throw new Error("Invalid component type.");
  }
}
const Yf = {
  DEG2RAD: Ur
};
class we {
  constructor(e = 0, n = 0) {
    we.prototype.isVector2 = !0, this.x = e, this.y = n;
  }
  get width() {
    return this.x;
  }
  set width(e) {
    this.x = e;
  }
  get height() {
    return this.y;
  }
  set height(e) {
    this.y = e;
  }
  set(e, n) {
    return this.x = e, this.y = n, this;
  }
  setScalar(e) {
    return this.x = e, this.y = e, this;
  }
  setX(e) {
    return this.x = e, this;
  }
  setY(e) {
    return this.y = e, this;
  }
  setComponent(e, n) {
    switch (e) {
      case 0:
        this.x = n;
        break;
      case 1:
        this.y = n;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      default:
        throw new Error("index is out of range: " + e);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y);
  }
  copy(e) {
    return this.x = e.x, this.y = e.y, this;
  }
  add(e) {
    return this.x += e.x, this.y += e.y, this;
  }
  addScalar(e) {
    return this.x += e, this.y += e, this;
  }
  addVectors(e, n) {
    return this.x = e.x + n.x, this.y = e.y + n.y, this;
  }
  addScaledVector(e, n) {
    return this.x += e.x * n, this.y += e.y * n, this;
  }
  sub(e) {
    return this.x -= e.x, this.y -= e.y, this;
  }
  subScalar(e) {
    return this.x -= e, this.y -= e, this;
  }
  subVectors(e, n) {
    return this.x = e.x - n.x, this.y = e.y - n.y, this;
  }
  multiply(e) {
    return this.x *= e.x, this.y *= e.y, this;
  }
  multiplyScalar(e) {
    return this.x *= e, this.y *= e, this;
  }
  divide(e) {
    return this.x /= e.x, this.y /= e.y, this;
  }
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  applyMatrix3(e) {
    const n = this.x, i = this.y, r = e.elements;
    return this.x = r[0] * n + r[3] * i + r[6], this.y = r[1] * n + r[4] * i + r[7], this;
  }
  min(e) {
    return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this;
  }
  max(e) {
    return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this;
  }
  clamp(e, n) {
    return this.x = Math.max(e.x, Math.min(n.x, this.x)), this.y = Math.max(e.y, Math.min(n.y, this.y)), this;
  }
  clampScalar(e, n) {
    return this.x = Math.max(e, Math.min(n, this.x)), this.y = Math.max(e, Math.min(n, this.y)), this;
  }
  clampLength(e, n) {
    const i = this.length();
    return this.divideScalar(i || 1).multiplyScalar(Math.max(e, Math.min(n, i)));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this;
  }
  dot(e) {
    return this.x * e.x + this.y * e.y;
  }
  cross(e) {
    return this.x * e.y - this.y * e.x;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  angle() {
    return Math.atan2(-this.y, -this.x) + Math.PI;
  }
  angleTo(e) {
    const n = Math.sqrt(this.lengthSq() * e.lengthSq());
    if (n === 0) return Math.PI / 2;
    const i = this.dot(e) / n;
    return Math.acos(bt(i, -1, 1));
  }
  distanceTo(e) {
    return Math.sqrt(this.distanceToSquared(e));
  }
  distanceToSquared(e) {
    const n = this.x - e.x, i = this.y - e.y;
    return n * n + i * i;
  }
  manhattanDistanceTo(e) {
    return Math.abs(this.x - e.x) + Math.abs(this.y - e.y);
  }
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  lerp(e, n) {
    return this.x += (e.x - this.x) * n, this.y += (e.y - this.y) * n, this;
  }
  lerpVectors(e, n, i) {
    return this.x = e.x + (n.x - e.x) * i, this.y = e.y + (n.y - e.y) * i, this;
  }
  equals(e) {
    return e.x === this.x && e.y === this.y;
  }
  fromArray(e, n = 0) {
    return this.x = e[n], this.y = e[n + 1], this;
  }
  toArray(e = [], n = 0) {
    return e[n] = this.x, e[n + 1] = this.y, e;
  }
  fromBufferAttribute(e, n) {
    return this.x = e.getX(n), this.y = e.getY(n), this;
  }
  rotateAround(e, n) {
    const i = Math.cos(n), r = Math.sin(n), s = this.x - e.x, a = this.y - e.y;
    return this.x = s * i - a * r + e.x, this.y = s * r + a * i + e.y, this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y;
  }
}
class De {
  constructor(e, n, i, r, s, a, o, c, l) {
    De.prototype.isMatrix3 = !0, this.elements = [
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ], e !== void 0 && this.set(e, n, i, r, s, a, o, c, l);
  }
  set(e, n, i, r, s, a, o, c, l) {
    const h = this.elements;
    return h[0] = e, h[1] = r, h[2] = o, h[3] = n, h[4] = s, h[5] = c, h[6] = i, h[7] = a, h[8] = l, this;
  }
  identity() {
    return this.set(
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ), this;
  }
  copy(e) {
    const n = this.elements, i = e.elements;
    return n[0] = i[0], n[1] = i[1], n[2] = i[2], n[3] = i[3], n[4] = i[4], n[5] = i[5], n[6] = i[6], n[7] = i[7], n[8] = i[8], this;
  }
  extractBasis(e, n, i) {
    return e.setFromMatrix3Column(this, 0), n.setFromMatrix3Column(this, 1), i.setFromMatrix3Column(this, 2), this;
  }
  setFromMatrix4(e) {
    const n = e.elements;
    return this.set(
      n[0],
      n[4],
      n[8],
      n[1],
      n[5],
      n[9],
      n[2],
      n[6],
      n[10]
    ), this;
  }
  multiply(e) {
    return this.multiplyMatrices(this, e);
  }
  premultiply(e) {
    return this.multiplyMatrices(e, this);
  }
  multiplyMatrices(e, n) {
    const i = e.elements, r = n.elements, s = this.elements, a = i[0], o = i[3], c = i[6], l = i[1], h = i[4], f = i[7], d = i[2], u = i[5], g = i[8], _ = r[0], p = r[3], m = r[6], E = r[1], M = r[4], x = r[7], P = r[2], b = r[5], A = r[8];
    return s[0] = a * _ + o * E + c * P, s[3] = a * p + o * M + c * b, s[6] = a * m + o * x + c * A, s[1] = l * _ + h * E + f * P, s[4] = l * p + h * M + f * b, s[7] = l * m + h * x + f * A, s[2] = d * _ + u * E + g * P, s[5] = d * p + u * M + g * b, s[8] = d * m + u * x + g * A, this;
  }
  multiplyScalar(e) {
    const n = this.elements;
    return n[0] *= e, n[3] *= e, n[6] *= e, n[1] *= e, n[4] *= e, n[7] *= e, n[2] *= e, n[5] *= e, n[8] *= e, this;
  }
  determinant() {
    const e = this.elements, n = e[0], i = e[1], r = e[2], s = e[3], a = e[4], o = e[5], c = e[6], l = e[7], h = e[8];
    return n * a * h - n * o * l - i * s * h + i * o * c + r * s * l - r * a * c;
  }
  invert() {
    const e = this.elements, n = e[0], i = e[1], r = e[2], s = e[3], a = e[4], o = e[5], c = e[6], l = e[7], h = e[8], f = h * a - o * l, d = o * c - h * s, u = l * s - a * c, g = n * f + i * d + r * u;
    if (g === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const _ = 1 / g;
    return e[0] = f * _, e[1] = (r * l - h * i) * _, e[2] = (o * i - r * a) * _, e[3] = d * _, e[4] = (h * n - r * c) * _, e[5] = (r * s - o * n) * _, e[6] = u * _, e[7] = (i * c - l * n) * _, e[8] = (a * n - i * s) * _, this;
  }
  transpose() {
    let e;
    const n = this.elements;
    return e = n[1], n[1] = n[3], n[3] = e, e = n[2], n[2] = n[6], n[6] = e, e = n[5], n[5] = n[7], n[7] = e, this;
  }
  getNormalMatrix(e) {
    return this.setFromMatrix4(e).invert().transpose();
  }
  transposeIntoArray(e) {
    const n = this.elements;
    return e[0] = n[0], e[1] = n[3], e[2] = n[6], e[3] = n[1], e[4] = n[4], e[5] = n[7], e[6] = n[2], e[7] = n[5], e[8] = n[8], this;
  }
  setUvTransform(e, n, i, r, s, a, o) {
    const c = Math.cos(s), l = Math.sin(s);
    return this.set(
      i * c,
      i * l,
      -i * (c * a + l * o) + a + e,
      -r * l,
      r * c,
      -r * (-l * a + c * o) + o + n,
      0,
      0,
      1
    ), this;
  }
  //
  scale(e, n) {
    return this.premultiply(Jr.makeScale(e, n)), this;
  }
  rotate(e) {
    return this.premultiply(Jr.makeRotation(-e)), this;
  }
  translate(e, n) {
    return this.premultiply(Jr.makeTranslation(e, n)), this;
  }
  // for 2D Transforms
  makeTranslation(e, n) {
    return e.isVector2 ? this.set(
      1,
      0,
      e.x,
      0,
      1,
      e.y,
      0,
      0,
      1
    ) : this.set(
      1,
      0,
      e,
      0,
      1,
      n,
      0,
      0,
      1
    ), this;
  }
  makeRotation(e) {
    const n = Math.cos(e), i = Math.sin(e);
    return this.set(
      n,
      -i,
      0,
      i,
      n,
      0,
      0,
      0,
      1
    ), this;
  }
  makeScale(e, n) {
    return this.set(
      e,
      0,
      0,
      0,
      n,
      0,
      0,
      0,
      1
    ), this;
  }
  //
  equals(e) {
    const n = this.elements, i = e.elements;
    for (let r = 0; r < 9; r++)
      if (n[r] !== i[r]) return !1;
    return !0;
  }
  fromArray(e, n = 0) {
    for (let i = 0; i < 9; i++)
      this.elements[i] = e[i + n];
    return this;
  }
  toArray(e = [], n = 0) {
    const i = this.elements;
    return e[n] = i[0], e[n + 1] = i[1], e[n + 2] = i[2], e[n + 3] = i[3], e[n + 4] = i[4], e[n + 5] = i[5], e[n + 6] = i[6], e[n + 7] = i[7], e[n + 8] = i[8], e;
  }
  clone() {
    return new this.constructor().fromArray(this.elements);
  }
}
const Jr = /* @__PURE__ */ new De();
function Hc(t) {
  for (let e = t.length - 1; e >= 0; --e)
    if (t[e] >= 65535) return !0;
  return !1;
}
function qi(t) {
  return document.createElementNS("http://www.w3.org/1999/xhtml", t);
}
function jf() {
  const t = qi("canvas");
  return t.style.display = "block", t;
}
const co = {};
function Vi(t) {
  t in co || (co[t] = !0, console.warn(t));
}
function Zf(t, e, n) {
  return new Promise(function(i, r) {
    function s() {
      switch (t.clientWaitSync(e, t.SYNC_FLUSH_COMMANDS_BIT, 0)) {
        case t.WAIT_FAILED:
          r();
          break;
        case t.TIMEOUT_EXPIRED:
          setTimeout(s, n);
          break;
        default:
          i();
      }
    }
    setTimeout(s, n);
  });
}
function Kf(t) {
  const e = t.elements;
  e[2] = 0.5 * e[2] + 0.5 * e[3], e[6] = 0.5 * e[6] + 0.5 * e[7], e[10] = 0.5 * e[10] + 0.5 * e[11], e[14] = 0.5 * e[14] + 0.5 * e[15];
}
function Jf(t) {
  const e = t.elements;
  e[11] === -1 ? (e[10] = -e[10] - 1, e[14] = -e[14]) : (e[10] = -e[10], e[14] = -e[14] + 1);
}
const Ge = {
  enabled: !0,
  workingColorSpace: Ci,
  /**
   * Implementations of supported color spaces.
   *
   * Required:
   *	- primaries: chromaticity coordinates [ rx ry gx gy bx by ]
   *	- whitePoint: reference white [ x y ]
   *	- transfer: transfer function (pre-defined)
   *	- toXYZ: Matrix3 RGB to XYZ transform
   *	- fromXYZ: Matrix3 XYZ to RGB transform
   *	- luminanceCoefficients: RGB luminance coefficients
   *
   * Optional:
   *  - outputColorSpaceConfig: { drawingBufferColorSpace: ColorSpace }
   *  - workingColorSpaceConfig: { unpackColorSpace: ColorSpace }
   *
   * Reference:
   * - https://www.russellcottrell.com/photo/matrixCalculator.htm
   */
  spaces: {},
  convert: function(t, e, n) {
    return this.enabled === !1 || e === n || !e || !n || (this.spaces[e].transfer === Ze && (t.r = pn(t.r), t.g = pn(t.g), t.b = pn(t.b)), this.spaces[e].primaries !== this.spaces[n].primaries && (t.applyMatrix3(this.spaces[e].toXYZ), t.applyMatrix3(this.spaces[n].fromXYZ)), this.spaces[n].transfer === Ze && (t.r = Si(t.r), t.g = Si(t.g), t.b = Si(t.b))), t;
  },
  fromWorkingColorSpace: function(t, e) {
    return this.convert(t, this.workingColorSpace, e);
  },
  toWorkingColorSpace: function(t, e) {
    return this.convert(t, e, this.workingColorSpace);
  },
  getPrimaries: function(t) {
    return this.spaces[t].primaries;
  },
  getTransfer: function(t) {
    return t === Cn ? Gr : this.spaces[t].transfer;
  },
  getLuminanceCoefficients: function(t, e = this.workingColorSpace) {
    return t.fromArray(this.spaces[e].luminanceCoefficients);
  },
  define: function(t) {
    Object.assign(this.spaces, t);
  },
  // Internal APIs
  _getMatrix: function(t, e, n) {
    return t.copy(this.spaces[e].toXYZ).multiply(this.spaces[n].fromXYZ);
  },
  _getDrawingBufferColorSpace: function(t) {
    return this.spaces[t].outputColorSpaceConfig.drawingBufferColorSpace;
  },
  _getUnpackColorSpace: function(t = this.workingColorSpace) {
    return this.spaces[t].workingColorSpaceConfig.unpackColorSpace;
  }
};
function pn(t) {
  return t < 0.04045 ? t * 0.0773993808 : Math.pow(t * 0.9478672986 + 0.0521327014, 2.4);
}
function Si(t) {
  return t < 31308e-7 ? t * 12.92 : 1.055 * Math.pow(t, 0.41666) - 0.055;
}
const lo = [0.64, 0.33, 0.3, 0.6, 0.15, 0.06], ho = [0.2126, 0.7152, 0.0722], fo = [0.3127, 0.329], uo = /* @__PURE__ */ new De().set(
  0.4123908,
  0.3575843,
  0.1804808,
  0.212639,
  0.7151687,
  0.0721923,
  0.0193308,
  0.1191948,
  0.9505322
), po = /* @__PURE__ */ new De().set(
  3.2409699,
  -1.5373832,
  -0.4986108,
  -0.9692436,
  1.8759675,
  0.0415551,
  0.0556301,
  -0.203977,
  1.0569715
);
Ge.define({
  [Ci]: {
    primaries: lo,
    whitePoint: fo,
    transfer: Gr,
    toXYZ: uo,
    fromXYZ: po,
    luminanceCoefficients: ho,
    workingColorSpaceConfig: { unpackColorSpace: Bt },
    outputColorSpaceConfig: { drawingBufferColorSpace: Bt }
  },
  [Bt]: {
    primaries: lo,
    whitePoint: fo,
    transfer: Ze,
    toXYZ: uo,
    fromXYZ: po,
    luminanceCoefficients: ho,
    outputColorSpaceConfig: { drawingBufferColorSpace: Bt }
  }
});
let ni;
class Qf {
  static getDataURL(e) {
    if (/^data:/i.test(e.src) || typeof HTMLCanvasElement > "u")
      return e.src;
    let n;
    if (e instanceof HTMLCanvasElement)
      n = e;
    else {
      ni === void 0 && (ni = qi("canvas")), ni.width = e.width, ni.height = e.height;
      const i = ni.getContext("2d");
      e instanceof ImageData ? i.putImageData(e, 0, 0) : i.drawImage(e, 0, 0, e.width, e.height), n = ni;
    }
    return n.width > 2048 || n.height > 2048 ? (console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons", e), n.toDataURL("image/jpeg", 0.6)) : n.toDataURL("image/png");
  }
  static sRGBToLinear(e) {
    if (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap) {
      const n = qi("canvas");
      n.width = e.width, n.height = e.height;
      const i = n.getContext("2d");
      i.drawImage(e, 0, 0, e.width, e.height);
      const r = i.getImageData(0, 0, e.width, e.height), s = r.data;
      for (let a = 0; a < s.length; a++)
        s[a] = pn(s[a] / 255) * 255;
      return i.putImageData(r, 0, 0), n;
    } else if (e.data) {
      const n = e.data.slice(0);
      for (let i = 0; i < n.length; i++)
        n instanceof Uint8Array || n instanceof Uint8ClampedArray ? n[i] = Math.floor(pn(n[i] / 255) * 255) : n[i] = pn(n[i]);
      return {
        data: n,
        width: e.width,
        height: e.height
      };
    } else
      return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), e;
  }
}
let ed = 0;
class kc {
  constructor(e = null) {
    this.isSource = !0, Object.defineProperty(this, "id", { value: ed++ }), this.uuid = Zi(), this.data = e, this.dataReady = !0, this.version = 0;
  }
  set needsUpdate(e) {
    e === !0 && this.version++;
  }
  toJSON(e) {
    const n = e === void 0 || typeof e == "string";
    if (!n && e.images[this.uuid] !== void 0)
      return e.images[this.uuid];
    const i = {
      uuid: this.uuid,
      url: ""
    }, r = this.data;
    if (r !== null) {
      let s;
      if (Array.isArray(r)) {
        s = [];
        for (let a = 0, o = r.length; a < o; a++)
          r[a].isDataTexture ? s.push(Qr(r[a].image)) : s.push(Qr(r[a]));
      } else
        s = Qr(r);
      i.url = s;
    }
    return n || (e.images[this.uuid] = i), i;
  }
}
function Qr(t) {
  return typeof HTMLImageElement < "u" && t instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && t instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && t instanceof ImageBitmap ? Qf.getDataURL(t) : t.data ? {
    data: Array.from(t.data),
    width: t.width,
    height: t.height,
    type: t.data.constructor.name
  } : (console.warn("THREE.Texture: Unable to serialize Texture."), {});
}
let td = 0;
class St extends Zn {
  constructor(e = St.DEFAULT_IMAGE, n = St.DEFAULT_MAPPING, i = qn, r = qn, s = Jt, a = $n, o = $t, c = mn, l = St.DEFAULT_ANISOTROPY, h = Cn) {
    super(), this.isTexture = !0, Object.defineProperty(this, "id", { value: td++ }), this.uuid = Zi(), this.name = "", this.source = new kc(e), this.mipmaps = [], this.mapping = n, this.channel = 0, this.wrapS = i, this.wrapT = r, this.magFilter = s, this.minFilter = a, this.anisotropy = l, this.format = o, this.internalFormat = null, this.type = c, this.offset = new we(0, 0), this.repeat = new we(1, 1), this.center = new we(0, 0), this.rotation = 0, this.matrixAutoUpdate = !0, this.matrix = new De(), this.generateMipmaps = !0, this.premultiplyAlpha = !1, this.flipY = !0, this.unpackAlignment = 4, this.colorSpace = h, this.userData = {}, this.version = 0, this.onUpdate = null, this.isRenderTargetTexture = !1, this.pmremVersion = 0;
  }
  get image() {
    return this.source.data;
  }
  set image(e = null) {
    this.source.data = e;
  }
  updateMatrix() {
    this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return this.name = e.name, this.source = e.source, this.mipmaps = e.mipmaps.slice(0), this.mapping = e.mapping, this.channel = e.channel, this.wrapS = e.wrapS, this.wrapT = e.wrapT, this.magFilter = e.magFilter, this.minFilter = e.minFilter, this.anisotropy = e.anisotropy, this.format = e.format, this.internalFormat = e.internalFormat, this.type = e.type, this.offset.copy(e.offset), this.repeat.copy(e.repeat), this.center.copy(e.center), this.rotation = e.rotation, this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrix.copy(e.matrix), this.generateMipmaps = e.generateMipmaps, this.premultiplyAlpha = e.premultiplyAlpha, this.flipY = e.flipY, this.unpackAlignment = e.unpackAlignment, this.colorSpace = e.colorSpace, this.userData = JSON.parse(JSON.stringify(e.userData)), this.needsUpdate = !0, this;
  }
  toJSON(e) {
    const n = e === void 0 || typeof e == "string";
    if (!n && e.textures[this.uuid] !== void 0)
      return e.textures[this.uuid];
    const i = {
      metadata: {
        version: 4.6,
        type: "Texture",
        generator: "Texture.toJSON"
      },
      uuid: this.uuid,
      name: this.name,
      image: this.source.toJSON(e).uuid,
      mapping: this.mapping,
      channel: this.channel,
      repeat: [this.repeat.x, this.repeat.y],
      offset: [this.offset.x, this.offset.y],
      center: [this.center.x, this.center.y],
      rotation: this.rotation,
      wrap: [this.wrapS, this.wrapT],
      format: this.format,
      internalFormat: this.internalFormat,
      type: this.type,
      colorSpace: this.colorSpace,
      minFilter: this.minFilter,
      magFilter: this.magFilter,
      anisotropy: this.anisotropy,
      flipY: this.flipY,
      generateMipmaps: this.generateMipmaps,
      premultiplyAlpha: this.premultiplyAlpha,
      unpackAlignment: this.unpackAlignment
    };
    return Object.keys(this.userData).length > 0 && (i.userData = this.userData), n || (e.textures[this.uuid] = i), i;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  transformUv(e) {
    if (this.mapping !== Cc) return e;
    if (e.applyMatrix3(this.matrix), e.x < 0 || e.x > 1)
      switch (this.wrapS) {
        case Hs:
          e.x = e.x - Math.floor(e.x);
          break;
        case qn:
          e.x = e.x < 0 ? 0 : 1;
          break;
        case ks:
          Math.abs(Math.floor(e.x) % 2) === 1 ? e.x = Math.ceil(e.x) - e.x : e.x = e.x - Math.floor(e.x);
          break;
      }
    if (e.y < 0 || e.y > 1)
      switch (this.wrapT) {
        case Hs:
          e.y = e.y - Math.floor(e.y);
          break;
        case qn:
          e.y = e.y < 0 ? 0 : 1;
          break;
        case ks:
          Math.abs(Math.floor(e.y) % 2) === 1 ? e.y = Math.ceil(e.y) - e.y : e.y = e.y - Math.floor(e.y);
          break;
      }
    return this.flipY && (e.y = 1 - e.y), e;
  }
  set needsUpdate(e) {
    e === !0 && (this.version++, this.source.needsUpdate = !0);
  }
  set needsPMREMUpdate(e) {
    e === !0 && this.pmremVersion++;
  }
}
St.DEFAULT_IMAGE = null;
St.DEFAULT_MAPPING = Cc;
St.DEFAULT_ANISOTROPY = 1;
class st {
  constructor(e = 0, n = 0, i = 0, r = 1) {
    st.prototype.isVector4 = !0, this.x = e, this.y = n, this.z = i, this.w = r;
  }
  get width() {
    return this.z;
  }
  set width(e) {
    this.z = e;
  }
  get height() {
    return this.w;
  }
  set height(e) {
    this.w = e;
  }
  set(e, n, i, r) {
    return this.x = e, this.y = n, this.z = i, this.w = r, this;
  }
  setScalar(e) {
    return this.x = e, this.y = e, this.z = e, this.w = e, this;
  }
  setX(e) {
    return this.x = e, this;
  }
  setY(e) {
    return this.y = e, this;
  }
  setZ(e) {
    return this.z = e, this;
  }
  setW(e) {
    return this.w = e, this;
  }
  setComponent(e, n) {
    switch (e) {
      case 0:
        this.x = n;
        break;
      case 1:
        this.y = n;
        break;
      case 2:
        this.z = n;
        break;
      case 3:
        this.w = n;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      case 3:
        return this.w;
      default:
        throw new Error("index is out of range: " + e);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z, this.w);
  }
  copy(e) {
    return this.x = e.x, this.y = e.y, this.z = e.z, this.w = e.w !== void 0 ? e.w : 1, this;
  }
  add(e) {
    return this.x += e.x, this.y += e.y, this.z += e.z, this.w += e.w, this;
  }
  addScalar(e) {
    return this.x += e, this.y += e, this.z += e, this.w += e, this;
  }
  addVectors(e, n) {
    return this.x = e.x + n.x, this.y = e.y + n.y, this.z = e.z + n.z, this.w = e.w + n.w, this;
  }
  addScaledVector(e, n) {
    return this.x += e.x * n, this.y += e.y * n, this.z += e.z * n, this.w += e.w * n, this;
  }
  sub(e) {
    return this.x -= e.x, this.y -= e.y, this.z -= e.z, this.w -= e.w, this;
  }
  subScalar(e) {
    return this.x -= e, this.y -= e, this.z -= e, this.w -= e, this;
  }
  subVectors(e, n) {
    return this.x = e.x - n.x, this.y = e.y - n.y, this.z = e.z - n.z, this.w = e.w - n.w, this;
  }
  multiply(e) {
    return this.x *= e.x, this.y *= e.y, this.z *= e.z, this.w *= e.w, this;
  }
  multiplyScalar(e) {
    return this.x *= e, this.y *= e, this.z *= e, this.w *= e, this;
  }
  applyMatrix4(e) {
    const n = this.x, i = this.y, r = this.z, s = this.w, a = e.elements;
    return this.x = a[0] * n + a[4] * i + a[8] * r + a[12] * s, this.y = a[1] * n + a[5] * i + a[9] * r + a[13] * s, this.z = a[2] * n + a[6] * i + a[10] * r + a[14] * s, this.w = a[3] * n + a[7] * i + a[11] * r + a[15] * s, this;
  }
  divide(e) {
    return this.x /= e.x, this.y /= e.y, this.z /= e.z, this.w /= e.w, this;
  }
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  setAxisAngleFromQuaternion(e) {
    this.w = 2 * Math.acos(e.w);
    const n = Math.sqrt(1 - e.w * e.w);
    return n < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = e.x / n, this.y = e.y / n, this.z = e.z / n), this;
  }
  setAxisAngleFromRotationMatrix(e) {
    let n, i, r, s;
    const c = e.elements, l = c[0], h = c[4], f = c[8], d = c[1], u = c[5], g = c[9], _ = c[2], p = c[6], m = c[10];
    if (Math.abs(h - d) < 0.01 && Math.abs(f - _) < 0.01 && Math.abs(g - p) < 0.01) {
      if (Math.abs(h + d) < 0.1 && Math.abs(f + _) < 0.1 && Math.abs(g + p) < 0.1 && Math.abs(l + u + m - 3) < 0.1)
        return this.set(1, 0, 0, 0), this;
      n = Math.PI;
      const M = (l + 1) / 2, x = (u + 1) / 2, P = (m + 1) / 2, b = (h + d) / 4, A = (f + _) / 4, R = (g + p) / 4;
      return M > x && M > P ? M < 0.01 ? (i = 0, r = 0.707106781, s = 0.707106781) : (i = Math.sqrt(M), r = b / i, s = A / i) : x > P ? x < 0.01 ? (i = 0.707106781, r = 0, s = 0.707106781) : (r = Math.sqrt(x), i = b / r, s = R / r) : P < 0.01 ? (i = 0.707106781, r = 0.707106781, s = 0) : (s = Math.sqrt(P), i = A / s, r = R / s), this.set(i, r, s, n), this;
    }
    let E = Math.sqrt((p - g) * (p - g) + (f - _) * (f - _) + (d - h) * (d - h));
    return Math.abs(E) < 1e-3 && (E = 1), this.x = (p - g) / E, this.y = (f - _) / E, this.z = (d - h) / E, this.w = Math.acos((l + u + m - 1) / 2), this;
  }
  setFromMatrixPosition(e) {
    const n = e.elements;
    return this.x = n[12], this.y = n[13], this.z = n[14], this.w = n[15], this;
  }
  min(e) {
    return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this.w = Math.min(this.w, e.w), this;
  }
  max(e) {
    return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this.w = Math.max(this.w, e.w), this;
  }
  clamp(e, n) {
    return this.x = Math.max(e.x, Math.min(n.x, this.x)), this.y = Math.max(e.y, Math.min(n.y, this.y)), this.z = Math.max(e.z, Math.min(n.z, this.z)), this.w = Math.max(e.w, Math.min(n.w, this.w)), this;
  }
  clampScalar(e, n) {
    return this.x = Math.max(e, Math.min(n, this.x)), this.y = Math.max(e, Math.min(n, this.y)), this.z = Math.max(e, Math.min(n, this.z)), this.w = Math.max(e, Math.min(n, this.w)), this;
  }
  clampLength(e, n) {
    const i = this.length();
    return this.divideScalar(i || 1).multiplyScalar(Math.max(e, Math.min(n, i)));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this.w = Math.trunc(this.w), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this;
  }
  dot(e) {
    return this.x * e.x + this.y * e.y + this.z * e.z + this.w * e.w;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  lerp(e, n) {
    return this.x += (e.x - this.x) * n, this.y += (e.y - this.y) * n, this.z += (e.z - this.z) * n, this.w += (e.w - this.w) * n, this;
  }
  lerpVectors(e, n, i) {
    return this.x = e.x + (n.x - e.x) * i, this.y = e.y + (n.y - e.y) * i, this.z = e.z + (n.z - e.z) * i, this.w = e.w + (n.w - e.w) * i, this;
  }
  equals(e) {
    return e.x === this.x && e.y === this.y && e.z === this.z && e.w === this.w;
  }
  fromArray(e, n = 0) {
    return this.x = e[n], this.y = e[n + 1], this.z = e[n + 2], this.w = e[n + 3], this;
  }
  toArray(e = [], n = 0) {
    return e[n] = this.x, e[n + 1] = this.y, e[n + 2] = this.z, e[n + 3] = this.w, e;
  }
  fromBufferAttribute(e, n) {
    return this.x = e.getX(n), this.y = e.getY(n), this.z = e.getZ(n), this.w = e.getW(n), this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z, yield this.w;
  }
}
class nd extends Zn {
  constructor(e = 1, n = 1, i = {}) {
    super(), this.isRenderTarget = !0, this.width = e, this.height = n, this.depth = 1, this.scissor = new st(0, 0, e, n), this.scissorTest = !1, this.viewport = new st(0, 0, e, n);
    const r = { width: e, height: n, depth: 1 };
    i = Object.assign({
      generateMipmaps: !1,
      internalFormat: null,
      minFilter: Jt,
      depthBuffer: !0,
      stencilBuffer: !1,
      resolveDepthBuffer: !0,
      resolveStencilBuffer: !0,
      depthTexture: null,
      samples: 0,
      count: 1
    }, i);
    const s = new St(r, i.mapping, i.wrapS, i.wrapT, i.magFilter, i.minFilter, i.format, i.type, i.anisotropy, i.colorSpace);
    s.flipY = !1, s.generateMipmaps = i.generateMipmaps, s.internalFormat = i.internalFormat, this.textures = [];
    const a = i.count;
    for (let o = 0; o < a; o++)
      this.textures[o] = s.clone(), this.textures[o].isRenderTargetTexture = !0;
    this.depthBuffer = i.depthBuffer, this.stencilBuffer = i.stencilBuffer, this.resolveDepthBuffer = i.resolveDepthBuffer, this.resolveStencilBuffer = i.resolveStencilBuffer, this.depthTexture = i.depthTexture, this.samples = i.samples;
  }
  get texture() {
    return this.textures[0];
  }
  set texture(e) {
    this.textures[0] = e;
  }
  setSize(e, n, i = 1) {
    if (this.width !== e || this.height !== n || this.depth !== i) {
      this.width = e, this.height = n, this.depth = i;
      for (let r = 0, s = this.textures.length; r < s; r++)
        this.textures[r].image.width = e, this.textures[r].image.height = n, this.textures[r].image.depth = i;
      this.dispose();
    }
    this.viewport.set(0, 0, e, n), this.scissor.set(0, 0, e, n);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    this.width = e.width, this.height = e.height, this.depth = e.depth, this.scissor.copy(e.scissor), this.scissorTest = e.scissorTest, this.viewport.copy(e.viewport), this.textures.length = 0;
    for (let i = 0, r = e.textures.length; i < r; i++)
      this.textures[i] = e.textures[i].clone(), this.textures[i].isRenderTargetTexture = !0;
    const n = Object.assign({}, e.texture.image);
    return this.texture.source = new kc(n), this.depthBuffer = e.depthBuffer, this.stencilBuffer = e.stencilBuffer, this.resolveDepthBuffer = e.resolveDepthBuffer, this.resolveStencilBuffer = e.resolveStencilBuffer, e.depthTexture !== null && (this.depthTexture = e.depthTexture.clone()), this.samples = e.samples, this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
class jn extends nd {
  constructor(e = 1, n = 1, i = {}) {
    super(e, n, i), this.isWebGLRenderTarget = !0;
  }
}
class Vc extends St {
  constructor(e = null, n = 1, i = 1, r = 1) {
    super(null), this.isDataArrayTexture = !0, this.image = { data: e, width: n, height: i, depth: r }, this.magFilter = Nt, this.minFilter = Nt, this.wrapR = qn, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1, this.layerUpdates = /* @__PURE__ */ new Set();
  }
  addLayerUpdate(e) {
    this.layerUpdates.add(e);
  }
  clearLayerUpdates() {
    this.layerUpdates.clear();
  }
}
class id extends St {
  constructor(e = null, n = 1, i = 1, r = 1) {
    super(null), this.isData3DTexture = !0, this.image = { data: e, width: n, height: i, depth: r }, this.magFilter = Nt, this.minFilter = Nt, this.wrapR = qn, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
  }
}
class Un {
  constructor(e = 0, n = 0, i = 0, r = 1) {
    this.isQuaternion = !0, this._x = e, this._y = n, this._z = i, this._w = r;
  }
  static slerpFlat(e, n, i, r, s, a, o) {
    let c = i[r + 0], l = i[r + 1], h = i[r + 2], f = i[r + 3];
    const d = s[a + 0], u = s[a + 1], g = s[a + 2], _ = s[a + 3];
    if (o === 0) {
      e[n + 0] = c, e[n + 1] = l, e[n + 2] = h, e[n + 3] = f;
      return;
    }
    if (o === 1) {
      e[n + 0] = d, e[n + 1] = u, e[n + 2] = g, e[n + 3] = _;
      return;
    }
    if (f !== _ || c !== d || l !== u || h !== g) {
      let p = 1 - o;
      const m = c * d + l * u + h * g + f * _, E = m >= 0 ? 1 : -1, M = 1 - m * m;
      if (M > Number.EPSILON) {
        const P = Math.sqrt(M), b = Math.atan2(P, m * E);
        p = Math.sin(p * b) / P, o = Math.sin(o * b) / P;
      }
      const x = o * E;
      if (c = c * p + d * x, l = l * p + u * x, h = h * p + g * x, f = f * p + _ * x, p === 1 - o) {
        const P = 1 / Math.sqrt(c * c + l * l + h * h + f * f);
        c *= P, l *= P, h *= P, f *= P;
      }
    }
    e[n] = c, e[n + 1] = l, e[n + 2] = h, e[n + 3] = f;
  }
  static multiplyQuaternionsFlat(e, n, i, r, s, a) {
    const o = i[r], c = i[r + 1], l = i[r + 2], h = i[r + 3], f = s[a], d = s[a + 1], u = s[a + 2], g = s[a + 3];
    return e[n] = o * g + h * f + c * u - l * d, e[n + 1] = c * g + h * d + l * f - o * u, e[n + 2] = l * g + h * u + o * d - c * f, e[n + 3] = h * g - o * f - c * d - l * u, e;
  }
  get x() {
    return this._x;
  }
  set x(e) {
    this._x = e, this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(e) {
    this._y = e, this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(e) {
    this._z = e, this._onChangeCallback();
  }
  get w() {
    return this._w;
  }
  set w(e) {
    this._w = e, this._onChangeCallback();
  }
  set(e, n, i, r) {
    return this._x = e, this._y = n, this._z = i, this._w = r, this._onChangeCallback(), this;
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._w);
  }
  copy(e) {
    return this._x = e.x, this._y = e.y, this._z = e.z, this._w = e.w, this._onChangeCallback(), this;
  }
  setFromEuler(e, n = !0) {
    const i = e._x, r = e._y, s = e._z, a = e._order, o = Math.cos, c = Math.sin, l = o(i / 2), h = o(r / 2), f = o(s / 2), d = c(i / 2), u = c(r / 2), g = c(s / 2);
    switch (a) {
      case "XYZ":
        this._x = d * h * f + l * u * g, this._y = l * u * f - d * h * g, this._z = l * h * g + d * u * f, this._w = l * h * f - d * u * g;
        break;
      case "YXZ":
        this._x = d * h * f + l * u * g, this._y = l * u * f - d * h * g, this._z = l * h * g - d * u * f, this._w = l * h * f + d * u * g;
        break;
      case "ZXY":
        this._x = d * h * f - l * u * g, this._y = l * u * f + d * h * g, this._z = l * h * g + d * u * f, this._w = l * h * f - d * u * g;
        break;
      case "ZYX":
        this._x = d * h * f - l * u * g, this._y = l * u * f + d * h * g, this._z = l * h * g - d * u * f, this._w = l * h * f + d * u * g;
        break;
      case "YZX":
        this._x = d * h * f + l * u * g, this._y = l * u * f + d * h * g, this._z = l * h * g - d * u * f, this._w = l * h * f - d * u * g;
        break;
      case "XZY":
        this._x = d * h * f - l * u * g, this._y = l * u * f - d * h * g, this._z = l * h * g + d * u * f, this._w = l * h * f + d * u * g;
        break;
      default:
        console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: " + a);
    }
    return n === !0 && this._onChangeCallback(), this;
  }
  setFromAxisAngle(e, n) {
    const i = n / 2, r = Math.sin(i);
    return this._x = e.x * r, this._y = e.y * r, this._z = e.z * r, this._w = Math.cos(i), this._onChangeCallback(), this;
  }
  setFromRotationMatrix(e) {
    const n = e.elements, i = n[0], r = n[4], s = n[8], a = n[1], o = n[5], c = n[9], l = n[2], h = n[6], f = n[10], d = i + o + f;
    if (d > 0) {
      const u = 0.5 / Math.sqrt(d + 1);
      this._w = 0.25 / u, this._x = (h - c) * u, this._y = (s - l) * u, this._z = (a - r) * u;
    } else if (i > o && i > f) {
      const u = 2 * Math.sqrt(1 + i - o - f);
      this._w = (h - c) / u, this._x = 0.25 * u, this._y = (r + a) / u, this._z = (s + l) / u;
    } else if (o > f) {
      const u = 2 * Math.sqrt(1 + o - i - f);
      this._w = (s - l) / u, this._x = (r + a) / u, this._y = 0.25 * u, this._z = (c + h) / u;
    } else {
      const u = 2 * Math.sqrt(1 + f - i - o);
      this._w = (a - r) / u, this._x = (s + l) / u, this._y = (c + h) / u, this._z = 0.25 * u;
    }
    return this._onChangeCallback(), this;
  }
  setFromUnitVectors(e, n) {
    let i = e.dot(n) + 1;
    return i < Number.EPSILON ? (i = 0, Math.abs(e.x) > Math.abs(e.z) ? (this._x = -e.y, this._y = e.x, this._z = 0, this._w = i) : (this._x = 0, this._y = -e.z, this._z = e.y, this._w = i)) : (this._x = e.y * n.z - e.z * n.y, this._y = e.z * n.x - e.x * n.z, this._z = e.x * n.y - e.y * n.x, this._w = i), this.normalize();
  }
  angleTo(e) {
    return 2 * Math.acos(Math.abs(bt(this.dot(e), -1, 1)));
  }
  rotateTowards(e, n) {
    const i = this.angleTo(e);
    if (i === 0) return this;
    const r = Math.min(1, n / i);
    return this.slerp(e, r), this;
  }
  identity() {
    return this.set(0, 0, 0, 1);
  }
  invert() {
    return this.conjugate();
  }
  conjugate() {
    return this._x *= -1, this._y *= -1, this._z *= -1, this._onChangeCallback(), this;
  }
  dot(e) {
    return this._x * e._x + this._y * e._y + this._z * e._z + this._w * e._w;
  }
  lengthSq() {
    return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
  }
  length() {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
  }
  normalize() {
    let e = this.length();
    return e === 0 ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (e = 1 / e, this._x = this._x * e, this._y = this._y * e, this._z = this._z * e, this._w = this._w * e), this._onChangeCallback(), this;
  }
  multiply(e) {
    return this.multiplyQuaternions(this, e);
  }
  premultiply(e) {
    return this.multiplyQuaternions(e, this);
  }
  multiplyQuaternions(e, n) {
    const i = e._x, r = e._y, s = e._z, a = e._w, o = n._x, c = n._y, l = n._z, h = n._w;
    return this._x = i * h + a * o + r * l - s * c, this._y = r * h + a * c + s * o - i * l, this._z = s * h + a * l + i * c - r * o, this._w = a * h - i * o - r * c - s * l, this._onChangeCallback(), this;
  }
  slerp(e, n) {
    if (n === 0) return this;
    if (n === 1) return this.copy(e);
    const i = this._x, r = this._y, s = this._z, a = this._w;
    let o = a * e._w + i * e._x + r * e._y + s * e._z;
    if (o < 0 ? (this._w = -e._w, this._x = -e._x, this._y = -e._y, this._z = -e._z, o = -o) : this.copy(e), o >= 1)
      return this._w = a, this._x = i, this._y = r, this._z = s, this;
    const c = 1 - o * o;
    if (c <= Number.EPSILON) {
      const u = 1 - n;
      return this._w = u * a + n * this._w, this._x = u * i + n * this._x, this._y = u * r + n * this._y, this._z = u * s + n * this._z, this.normalize(), this;
    }
    const l = Math.sqrt(c), h = Math.atan2(l, o), f = Math.sin((1 - n) * h) / l, d = Math.sin(n * h) / l;
    return this._w = a * f + this._w * d, this._x = i * f + this._x * d, this._y = r * f + this._y * d, this._z = s * f + this._z * d, this._onChangeCallback(), this;
  }
  slerpQuaternions(e, n, i) {
    return this.copy(e).slerp(n, i);
  }
  random() {
    const e = 2 * Math.PI * Math.random(), n = 2 * Math.PI * Math.random(), i = Math.random(), r = Math.sqrt(1 - i), s = Math.sqrt(i);
    return this.set(
      r * Math.sin(e),
      r * Math.cos(e),
      s * Math.sin(n),
      s * Math.cos(n)
    );
  }
  equals(e) {
    return e._x === this._x && e._y === this._y && e._z === this._z && e._w === this._w;
  }
  fromArray(e, n = 0) {
    return this._x = e[n], this._y = e[n + 1], this._z = e[n + 2], this._w = e[n + 3], this._onChangeCallback(), this;
  }
  toArray(e = [], n = 0) {
    return e[n] = this._x, e[n + 1] = this._y, e[n + 2] = this._z, e[n + 3] = this._w, e;
  }
  fromBufferAttribute(e, n) {
    return this._x = e.getX(n), this._y = e.getY(n), this._z = e.getZ(n), this._w = e.getW(n), this._onChangeCallback(), this;
  }
  toJSON() {
    return this.toArray();
  }
  _onChange(e) {
    return this._onChangeCallback = e, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._w;
  }
}
class z {
  constructor(e = 0, n = 0, i = 0) {
    z.prototype.isVector3 = !0, this.x = e, this.y = n, this.z = i;
  }
  set(e, n, i) {
    return i === void 0 && (i = this.z), this.x = e, this.y = n, this.z = i, this;
  }
  setScalar(e) {
    return this.x = e, this.y = e, this.z = e, this;
  }
  setX(e) {
    return this.x = e, this;
  }
  setY(e) {
    return this.y = e, this;
  }
  setZ(e) {
    return this.z = e, this;
  }
  setComponent(e, n) {
    switch (e) {
      case 0:
        this.x = n;
        break;
      case 1:
        this.y = n;
        break;
      case 2:
        this.z = n;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      default:
        throw new Error("index is out of range: " + e);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z);
  }
  copy(e) {
    return this.x = e.x, this.y = e.y, this.z = e.z, this;
  }
  add(e) {
    return this.x += e.x, this.y += e.y, this.z += e.z, this;
  }
  addScalar(e) {
    return this.x += e, this.y += e, this.z += e, this;
  }
  addVectors(e, n) {
    return this.x = e.x + n.x, this.y = e.y + n.y, this.z = e.z + n.z, this;
  }
  addScaledVector(e, n) {
    return this.x += e.x * n, this.y += e.y * n, this.z += e.z * n, this;
  }
  sub(e) {
    return this.x -= e.x, this.y -= e.y, this.z -= e.z, this;
  }
  subScalar(e) {
    return this.x -= e, this.y -= e, this.z -= e, this;
  }
  subVectors(e, n) {
    return this.x = e.x - n.x, this.y = e.y - n.y, this.z = e.z - n.z, this;
  }
  multiply(e) {
    return this.x *= e.x, this.y *= e.y, this.z *= e.z, this;
  }
  multiplyScalar(e) {
    return this.x *= e, this.y *= e, this.z *= e, this;
  }
  multiplyVectors(e, n) {
    return this.x = e.x * n.x, this.y = e.y * n.y, this.z = e.z * n.z, this;
  }
  applyEuler(e) {
    return this.applyQuaternion(mo.setFromEuler(e));
  }
  applyAxisAngle(e, n) {
    return this.applyQuaternion(mo.setFromAxisAngle(e, n));
  }
  applyMatrix3(e) {
    const n = this.x, i = this.y, r = this.z, s = e.elements;
    return this.x = s[0] * n + s[3] * i + s[6] * r, this.y = s[1] * n + s[4] * i + s[7] * r, this.z = s[2] * n + s[5] * i + s[8] * r, this;
  }
  applyNormalMatrix(e) {
    return this.applyMatrix3(e).normalize();
  }
  applyMatrix4(e) {
    const n = this.x, i = this.y, r = this.z, s = e.elements, a = 1 / (s[3] * n + s[7] * i + s[11] * r + s[15]);
    return this.x = (s[0] * n + s[4] * i + s[8] * r + s[12]) * a, this.y = (s[1] * n + s[5] * i + s[9] * r + s[13]) * a, this.z = (s[2] * n + s[6] * i + s[10] * r + s[14]) * a, this;
  }
  applyQuaternion(e) {
    const n = this.x, i = this.y, r = this.z, s = e.x, a = e.y, o = e.z, c = e.w, l = 2 * (a * r - o * i), h = 2 * (o * n - s * r), f = 2 * (s * i - a * n);
    return this.x = n + c * l + a * f - o * h, this.y = i + c * h + o * l - s * f, this.z = r + c * f + s * h - a * l, this;
  }
  project(e) {
    return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix);
  }
  unproject(e) {
    return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld);
  }
  transformDirection(e) {
    const n = this.x, i = this.y, r = this.z, s = e.elements;
    return this.x = s[0] * n + s[4] * i + s[8] * r, this.y = s[1] * n + s[5] * i + s[9] * r, this.z = s[2] * n + s[6] * i + s[10] * r, this.normalize();
  }
  divide(e) {
    return this.x /= e.x, this.y /= e.y, this.z /= e.z, this;
  }
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  min(e) {
    return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this;
  }
  max(e) {
    return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this;
  }
  clamp(e, n) {
    return this.x = Math.max(e.x, Math.min(n.x, this.x)), this.y = Math.max(e.y, Math.min(n.y, this.y)), this.z = Math.max(e.z, Math.min(n.z, this.z)), this;
  }
  clampScalar(e, n) {
    return this.x = Math.max(e, Math.min(n, this.x)), this.y = Math.max(e, Math.min(n, this.y)), this.z = Math.max(e, Math.min(n, this.z)), this;
  }
  clampLength(e, n) {
    const i = this.length();
    return this.divideScalar(i || 1).multiplyScalar(Math.max(e, Math.min(n, i)));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
  }
  dot(e) {
    return this.x * e.x + this.y * e.y + this.z * e.z;
  }
  // TODO lengthSquared?
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  lerp(e, n) {
    return this.x += (e.x - this.x) * n, this.y += (e.y - this.y) * n, this.z += (e.z - this.z) * n, this;
  }
  lerpVectors(e, n, i) {
    return this.x = e.x + (n.x - e.x) * i, this.y = e.y + (n.y - e.y) * i, this.z = e.z + (n.z - e.z) * i, this;
  }
  cross(e) {
    return this.crossVectors(this, e);
  }
  crossVectors(e, n) {
    const i = e.x, r = e.y, s = e.z, a = n.x, o = n.y, c = n.z;
    return this.x = r * c - s * o, this.y = s * a - i * c, this.z = i * o - r * a, this;
  }
  projectOnVector(e) {
    const n = e.lengthSq();
    if (n === 0) return this.set(0, 0, 0);
    const i = e.dot(this) / n;
    return this.copy(e).multiplyScalar(i);
  }
  projectOnPlane(e) {
    return es.copy(this).projectOnVector(e), this.sub(es);
  }
  reflect(e) {
    return this.sub(es.copy(e).multiplyScalar(2 * this.dot(e)));
  }
  angleTo(e) {
    const n = Math.sqrt(this.lengthSq() * e.lengthSq());
    if (n === 0) return Math.PI / 2;
    const i = this.dot(e) / n;
    return Math.acos(bt(i, -1, 1));
  }
  distanceTo(e) {
    return Math.sqrt(this.distanceToSquared(e));
  }
  distanceToSquared(e) {
    const n = this.x - e.x, i = this.y - e.y, r = this.z - e.z;
    return n * n + i * i + r * r;
  }
  manhattanDistanceTo(e) {
    return Math.abs(this.x - e.x) + Math.abs(this.y - e.y) + Math.abs(this.z - e.z);
  }
  setFromSpherical(e) {
    return this.setFromSphericalCoords(e.radius, e.phi, e.theta);
  }
  setFromSphericalCoords(e, n, i) {
    const r = Math.sin(n) * e;
    return this.x = r * Math.sin(i), this.y = Math.cos(n) * e, this.z = r * Math.cos(i), this;
  }
  setFromCylindrical(e) {
    return this.setFromCylindricalCoords(e.radius, e.theta, e.y);
  }
  setFromCylindricalCoords(e, n, i) {
    return this.x = e * Math.sin(n), this.y = i, this.z = e * Math.cos(n), this;
  }
  setFromMatrixPosition(e) {
    const n = e.elements;
    return this.x = n[12], this.y = n[13], this.z = n[14], this;
  }
  setFromMatrixScale(e) {
    const n = this.setFromMatrixColumn(e, 0).length(), i = this.setFromMatrixColumn(e, 1).length(), r = this.setFromMatrixColumn(e, 2).length();
    return this.x = n, this.y = i, this.z = r, this;
  }
  setFromMatrixColumn(e, n) {
    return this.fromArray(e.elements, n * 4);
  }
  setFromMatrix3Column(e, n) {
    return this.fromArray(e.elements, n * 3);
  }
  setFromEuler(e) {
    return this.x = e._x, this.y = e._y, this.z = e._z, this;
  }
  setFromColor(e) {
    return this.x = e.r, this.y = e.g, this.z = e.b, this;
  }
  equals(e) {
    return e.x === this.x && e.y === this.y && e.z === this.z;
  }
  fromArray(e, n = 0) {
    return this.x = e[n], this.y = e[n + 1], this.z = e[n + 2], this;
  }
  toArray(e = [], n = 0) {
    return e[n] = this.x, e[n + 1] = this.y, e[n + 2] = this.z, e;
  }
  fromBufferAttribute(e, n) {
    return this.x = e.getX(n), this.y = e.getY(n), this.z = e.getZ(n), this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this;
  }
  randomDirection() {
    const e = Math.random() * Math.PI * 2, n = Math.random() * 2 - 1, i = Math.sqrt(1 - n * n);
    return this.x = i * Math.cos(e), this.y = n, this.z = i * Math.sin(e), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z;
  }
}
const es = /* @__PURE__ */ new z(), mo = /* @__PURE__ */ new Un();
class Kn {
  constructor(e = new z(1 / 0, 1 / 0, 1 / 0), n = new z(-1 / 0, -1 / 0, -1 / 0)) {
    this.isBox3 = !0, this.min = e, this.max = n;
  }
  set(e, n) {
    return this.min.copy(e), this.max.copy(n), this;
  }
  setFromArray(e) {
    this.makeEmpty();
    for (let n = 0, i = e.length; n < i; n += 3)
      this.expandByPoint(Gt.fromArray(e, n));
    return this;
  }
  setFromBufferAttribute(e) {
    this.makeEmpty();
    for (let n = 0, i = e.count; n < i; n++)
      this.expandByPoint(Gt.fromBufferAttribute(e, n));
    return this;
  }
  setFromPoints(e) {
    this.makeEmpty();
    for (let n = 0, i = e.length; n < i; n++)
      this.expandByPoint(e[n]);
    return this;
  }
  setFromCenterAndSize(e, n) {
    const i = Gt.copy(n).multiplyScalar(0.5);
    return this.min.copy(e).sub(i), this.max.copy(e).add(i), this;
  }
  setFromObject(e, n = !1) {
    return this.makeEmpty(), this.expandByObject(e, n);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return this.min.copy(e.min), this.max.copy(e.max), this;
  }
  makeEmpty() {
    return this.min.x = this.min.y = this.min.z = 1 / 0, this.max.x = this.max.y = this.max.z = -1 / 0, this;
  }
  isEmpty() {
    return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
  }
  getCenter(e) {
    return this.isEmpty() ? e.set(0, 0, 0) : e.addVectors(this.min, this.max).multiplyScalar(0.5);
  }
  getSize(e) {
    return this.isEmpty() ? e.set(0, 0, 0) : e.subVectors(this.max, this.min);
  }
  expandByPoint(e) {
    return this.min.min(e), this.max.max(e), this;
  }
  expandByVector(e) {
    return this.min.sub(e), this.max.add(e), this;
  }
  expandByScalar(e) {
    return this.min.addScalar(-e), this.max.addScalar(e), this;
  }
  expandByObject(e, n = !1) {
    e.updateWorldMatrix(!1, !1);
    const i = e.geometry;
    if (i !== void 0) {
      const s = i.getAttribute("position");
      if (n === !0 && s !== void 0 && e.isInstancedMesh !== !0)
        for (let a = 0, o = s.count; a < o; a++)
          e.isMesh === !0 ? e.getVertexPosition(a, Gt) : Gt.fromBufferAttribute(s, a), Gt.applyMatrix4(e.matrixWorld), this.expandByPoint(Gt);
      else
        e.boundingBox !== void 0 ? (e.boundingBox === null && e.computeBoundingBox(), nr.copy(e.boundingBox)) : (i.boundingBox === null && i.computeBoundingBox(), nr.copy(i.boundingBox)), nr.applyMatrix4(e.matrixWorld), this.union(nr);
    }
    const r = e.children;
    for (let s = 0, a = r.length; s < a; s++)
      this.expandByObject(r[s], n);
    return this;
  }
  containsPoint(e) {
    return e.x >= this.min.x && e.x <= this.max.x && e.y >= this.min.y && e.y <= this.max.y && e.z >= this.min.z && e.z <= this.max.z;
  }
  containsBox(e) {
    return this.min.x <= e.min.x && e.max.x <= this.max.x && this.min.y <= e.min.y && e.max.y <= this.max.y && this.min.z <= e.min.z && e.max.z <= this.max.z;
  }
  getParameter(e, n) {
    return n.set(
      (e.x - this.min.x) / (this.max.x - this.min.x),
      (e.y - this.min.y) / (this.max.y - this.min.y),
      (e.z - this.min.z) / (this.max.z - this.min.z)
    );
  }
  intersectsBox(e) {
    return e.max.x >= this.min.x && e.min.x <= this.max.x && e.max.y >= this.min.y && e.min.y <= this.max.y && e.max.z >= this.min.z && e.min.z <= this.max.z;
  }
  intersectsSphere(e) {
    return this.clampPoint(e.center, Gt), Gt.distanceToSquared(e.center) <= e.radius * e.radius;
  }
  intersectsPlane(e) {
    let n, i;
    return e.normal.x > 0 ? (n = e.normal.x * this.min.x, i = e.normal.x * this.max.x) : (n = e.normal.x * this.max.x, i = e.normal.x * this.min.x), e.normal.y > 0 ? (n += e.normal.y * this.min.y, i += e.normal.y * this.max.y) : (n += e.normal.y * this.max.y, i += e.normal.y * this.min.y), e.normal.z > 0 ? (n += e.normal.z * this.min.z, i += e.normal.z * this.max.z) : (n += e.normal.z * this.max.z, i += e.normal.z * this.min.z), n <= -e.constant && i >= -e.constant;
  }
  intersectsTriangle(e) {
    if (this.isEmpty())
      return !1;
    this.getCenter(Ni), ir.subVectors(this.max, Ni), ii.subVectors(e.a, Ni), ri.subVectors(e.b, Ni), si.subVectors(e.c, Ni), Mn.subVectors(ri, ii), yn.subVectors(si, ri), On.subVectors(ii, si);
    let n = [
      0,
      -Mn.z,
      Mn.y,
      0,
      -yn.z,
      yn.y,
      0,
      -On.z,
      On.y,
      Mn.z,
      0,
      -Mn.x,
      yn.z,
      0,
      -yn.x,
      On.z,
      0,
      -On.x,
      -Mn.y,
      Mn.x,
      0,
      -yn.y,
      yn.x,
      0,
      -On.y,
      On.x,
      0
    ];
    return !ts(n, ii, ri, si, ir) || (n = [1, 0, 0, 0, 1, 0, 0, 0, 1], !ts(n, ii, ri, si, ir)) ? !1 : (rr.crossVectors(Mn, yn), n = [rr.x, rr.y, rr.z], ts(n, ii, ri, si, ir));
  }
  clampPoint(e, n) {
    return n.copy(e).clamp(this.min, this.max);
  }
  distanceToPoint(e) {
    return this.clampPoint(e, Gt).distanceTo(e);
  }
  getBoundingSphere(e) {
    return this.isEmpty() ? e.makeEmpty() : (this.getCenter(e.center), e.radius = this.getSize(Gt).length() * 0.5), e;
  }
  intersect(e) {
    return this.min.max(e.min), this.max.min(e.max), this.isEmpty() && this.makeEmpty(), this;
  }
  union(e) {
    return this.min.min(e.min), this.max.max(e.max), this;
  }
  applyMatrix4(e) {
    return this.isEmpty() ? this : (an[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(e), an[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(e), an[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(e), an[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(e), an[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(e), an[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(e), an[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(e), an[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(e), this.setFromPoints(an), this);
  }
  translate(e) {
    return this.min.add(e), this.max.add(e), this;
  }
  equals(e) {
    return e.min.equals(this.min) && e.max.equals(this.max);
  }
}
const an = [
  /* @__PURE__ */ new z(),
  /* @__PURE__ */ new z(),
  /* @__PURE__ */ new z(),
  /* @__PURE__ */ new z(),
  /* @__PURE__ */ new z(),
  /* @__PURE__ */ new z(),
  /* @__PURE__ */ new z(),
  /* @__PURE__ */ new z()
], Gt = /* @__PURE__ */ new z(), nr = /* @__PURE__ */ new Kn(), ii = /* @__PURE__ */ new z(), ri = /* @__PURE__ */ new z(), si = /* @__PURE__ */ new z(), Mn = /* @__PURE__ */ new z(), yn = /* @__PURE__ */ new z(), On = /* @__PURE__ */ new z(), Ni = /* @__PURE__ */ new z(), ir = /* @__PURE__ */ new z(), rr = /* @__PURE__ */ new z(), zn = /* @__PURE__ */ new z();
function ts(t, e, n, i, r) {
  for (let s = 0, a = t.length - 3; s <= a; s += 3) {
    zn.fromArray(t, s);
    const o = r.x * Math.abs(zn.x) + r.y * Math.abs(zn.y) + r.z * Math.abs(zn.z), c = e.dot(zn), l = n.dot(zn), h = i.dot(zn);
    if (Math.max(-Math.max(c, l, h), Math.min(c, l, h)) > o)
      return !1;
  }
  return !0;
}
const rd = /* @__PURE__ */ new Kn(), Fi = /* @__PURE__ */ new z(), ns = /* @__PURE__ */ new z();
class Jn {
  constructor(e = new z(), n = -1) {
    this.isSphere = !0, this.center = e, this.radius = n;
  }
  set(e, n) {
    return this.center.copy(e), this.radius = n, this;
  }
  setFromPoints(e, n) {
    const i = this.center;
    n !== void 0 ? i.copy(n) : rd.setFromPoints(e).getCenter(i);
    let r = 0;
    for (let s = 0, a = e.length; s < a; s++)
      r = Math.max(r, i.distanceToSquared(e[s]));
    return this.radius = Math.sqrt(r), this;
  }
  copy(e) {
    return this.center.copy(e.center), this.radius = e.radius, this;
  }
  isEmpty() {
    return this.radius < 0;
  }
  makeEmpty() {
    return this.center.set(0, 0, 0), this.radius = -1, this;
  }
  containsPoint(e) {
    return e.distanceToSquared(this.center) <= this.radius * this.radius;
  }
  distanceToPoint(e) {
    return e.distanceTo(this.center) - this.radius;
  }
  intersectsSphere(e) {
    const n = this.radius + e.radius;
    return e.center.distanceToSquared(this.center) <= n * n;
  }
  intersectsBox(e) {
    return e.intersectsSphere(this);
  }
  intersectsPlane(e) {
    return Math.abs(e.distanceToPoint(this.center)) <= this.radius;
  }
  clampPoint(e, n) {
    const i = this.center.distanceToSquared(e);
    return n.copy(e), i > this.radius * this.radius && (n.sub(this.center).normalize(), n.multiplyScalar(this.radius).add(this.center)), n;
  }
  getBoundingBox(e) {
    return this.isEmpty() ? (e.makeEmpty(), e) : (e.set(this.center, this.center), e.expandByScalar(this.radius), e);
  }
  applyMatrix4(e) {
    return this.center.applyMatrix4(e), this.radius = this.radius * e.getMaxScaleOnAxis(), this;
  }
  translate(e) {
    return this.center.add(e), this;
  }
  expandByPoint(e) {
    if (this.isEmpty())
      return this.center.copy(e), this.radius = 0, this;
    Fi.subVectors(e, this.center);
    const n = Fi.lengthSq();
    if (n > this.radius * this.radius) {
      const i = Math.sqrt(n), r = (i - this.radius) * 0.5;
      this.center.addScaledVector(Fi, r / i), this.radius += r;
    }
    return this;
  }
  union(e) {
    return e.isEmpty() ? this : this.isEmpty() ? (this.copy(e), this) : (this.center.equals(e.center) === !0 ? this.radius = Math.max(this.radius, e.radius) : (ns.subVectors(e.center, this.center).setLength(e.radius), this.expandByPoint(Fi.copy(e.center).add(ns)), this.expandByPoint(Fi.copy(e.center).sub(ns))), this);
  }
  equals(e) {
    return e.center.equals(this.center) && e.radius === this.radius;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const on = /* @__PURE__ */ new z(), is = /* @__PURE__ */ new z(), sr = /* @__PURE__ */ new z(), Sn = /* @__PURE__ */ new z(), rs = /* @__PURE__ */ new z(), ar = /* @__PURE__ */ new z(), ss = /* @__PURE__ */ new z();
class Ki {
  constructor(e = new z(), n = new z(0, 0, -1)) {
    this.origin = e, this.direction = n;
  }
  set(e, n) {
    return this.origin.copy(e), this.direction.copy(n), this;
  }
  copy(e) {
    return this.origin.copy(e.origin), this.direction.copy(e.direction), this;
  }
  at(e, n) {
    return n.copy(this.origin).addScaledVector(this.direction, e);
  }
  lookAt(e) {
    return this.direction.copy(e).sub(this.origin).normalize(), this;
  }
  recast(e) {
    return this.origin.copy(this.at(e, on)), this;
  }
  closestPointToPoint(e, n) {
    n.subVectors(e, this.origin);
    const i = n.dot(this.direction);
    return i < 0 ? n.copy(this.origin) : n.copy(this.origin).addScaledVector(this.direction, i);
  }
  distanceToPoint(e) {
    return Math.sqrt(this.distanceSqToPoint(e));
  }
  distanceSqToPoint(e) {
    const n = on.subVectors(e, this.origin).dot(this.direction);
    return n < 0 ? this.origin.distanceToSquared(e) : (on.copy(this.origin).addScaledVector(this.direction, n), on.distanceToSquared(e));
  }
  distanceSqToSegment(e, n, i, r) {
    is.copy(e).add(n).multiplyScalar(0.5), sr.copy(n).sub(e).normalize(), Sn.copy(this.origin).sub(is);
    const s = e.distanceTo(n) * 0.5, a = -this.direction.dot(sr), o = Sn.dot(this.direction), c = -Sn.dot(sr), l = Sn.lengthSq(), h = Math.abs(1 - a * a);
    let f, d, u, g;
    if (h > 0)
      if (f = a * c - o, d = a * o - c, g = s * h, f >= 0)
        if (d >= -g)
          if (d <= g) {
            const _ = 1 / h;
            f *= _, d *= _, u = f * (f + a * d + 2 * o) + d * (a * f + d + 2 * c) + l;
          } else
            d = s, f = Math.max(0, -(a * d + o)), u = -f * f + d * (d + 2 * c) + l;
        else
          d = -s, f = Math.max(0, -(a * d + o)), u = -f * f + d * (d + 2 * c) + l;
      else
        d <= -g ? (f = Math.max(0, -(-a * s + o)), d = f > 0 ? -s : Math.min(Math.max(-s, -c), s), u = -f * f + d * (d + 2 * c) + l) : d <= g ? (f = 0, d = Math.min(Math.max(-s, -c), s), u = d * (d + 2 * c) + l) : (f = Math.max(0, -(a * s + o)), d = f > 0 ? s : Math.min(Math.max(-s, -c), s), u = -f * f + d * (d + 2 * c) + l);
    else
      d = a > 0 ? -s : s, f = Math.max(0, -(a * d + o)), u = -f * f + d * (d + 2 * c) + l;
    return i && i.copy(this.origin).addScaledVector(this.direction, f), r && r.copy(is).addScaledVector(sr, d), u;
  }
  intersectSphere(e, n) {
    on.subVectors(e.center, this.origin);
    const i = on.dot(this.direction), r = on.dot(on) - i * i, s = e.radius * e.radius;
    if (r > s) return null;
    const a = Math.sqrt(s - r), o = i - a, c = i + a;
    return c < 0 ? null : o < 0 ? this.at(c, n) : this.at(o, n);
  }
  intersectsSphere(e) {
    return this.distanceSqToPoint(e.center) <= e.radius * e.radius;
  }
  distanceToPlane(e) {
    const n = e.normal.dot(this.direction);
    if (n === 0)
      return e.distanceToPoint(this.origin) === 0 ? 0 : null;
    const i = -(this.origin.dot(e.normal) + e.constant) / n;
    return i >= 0 ? i : null;
  }
  intersectPlane(e, n) {
    const i = this.distanceToPlane(e);
    return i === null ? null : this.at(i, n);
  }
  intersectsPlane(e) {
    const n = e.distanceToPoint(this.origin);
    return n === 0 || e.normal.dot(this.direction) * n < 0;
  }
  intersectBox(e, n) {
    let i, r, s, a, o, c;
    const l = 1 / this.direction.x, h = 1 / this.direction.y, f = 1 / this.direction.z, d = this.origin;
    return l >= 0 ? (i = (e.min.x - d.x) * l, r = (e.max.x - d.x) * l) : (i = (e.max.x - d.x) * l, r = (e.min.x - d.x) * l), h >= 0 ? (s = (e.min.y - d.y) * h, a = (e.max.y - d.y) * h) : (s = (e.max.y - d.y) * h, a = (e.min.y - d.y) * h), i > a || s > r || ((s > i || isNaN(i)) && (i = s), (a < r || isNaN(r)) && (r = a), f >= 0 ? (o = (e.min.z - d.z) * f, c = (e.max.z - d.z) * f) : (o = (e.max.z - d.z) * f, c = (e.min.z - d.z) * f), i > c || o > r) || ((o > i || i !== i) && (i = o), (c < r || r !== r) && (r = c), r < 0) ? null : this.at(i >= 0 ? i : r, n);
  }
  intersectsBox(e) {
    return this.intersectBox(e, on) !== null;
  }
  intersectTriangle(e, n, i, r, s) {
    rs.subVectors(n, e), ar.subVectors(i, e), ss.crossVectors(rs, ar);
    let a = this.direction.dot(ss), o;
    if (a > 0) {
      if (r) return null;
      o = 1;
    } else if (a < 0)
      o = -1, a = -a;
    else
      return null;
    Sn.subVectors(this.origin, e);
    const c = o * this.direction.dot(ar.crossVectors(Sn, ar));
    if (c < 0)
      return null;
    const l = o * this.direction.dot(rs.cross(Sn));
    if (l < 0 || c + l > a)
      return null;
    const h = -o * Sn.dot(ss);
    return h < 0 ? null : this.at(h / a, s);
  }
  applyMatrix4(e) {
    return this.origin.applyMatrix4(e), this.direction.transformDirection(e), this;
  }
  equals(e) {
    return e.origin.equals(this.origin) && e.direction.equals(this.direction);
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class je {
  constructor(e, n, i, r, s, a, o, c, l, h, f, d, u, g, _, p) {
    je.prototype.isMatrix4 = !0, this.elements = [
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ], e !== void 0 && this.set(e, n, i, r, s, a, o, c, l, h, f, d, u, g, _, p);
  }
  set(e, n, i, r, s, a, o, c, l, h, f, d, u, g, _, p) {
    const m = this.elements;
    return m[0] = e, m[4] = n, m[8] = i, m[12] = r, m[1] = s, m[5] = a, m[9] = o, m[13] = c, m[2] = l, m[6] = h, m[10] = f, m[14] = d, m[3] = u, m[7] = g, m[11] = _, m[15] = p, this;
  }
  identity() {
    return this.set(
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  clone() {
    return new je().fromArray(this.elements);
  }
  copy(e) {
    const n = this.elements, i = e.elements;
    return n[0] = i[0], n[1] = i[1], n[2] = i[2], n[3] = i[3], n[4] = i[4], n[5] = i[5], n[6] = i[6], n[7] = i[7], n[8] = i[8], n[9] = i[9], n[10] = i[10], n[11] = i[11], n[12] = i[12], n[13] = i[13], n[14] = i[14], n[15] = i[15], this;
  }
  copyPosition(e) {
    const n = this.elements, i = e.elements;
    return n[12] = i[12], n[13] = i[13], n[14] = i[14], this;
  }
  setFromMatrix3(e) {
    const n = e.elements;
    return this.set(
      n[0],
      n[3],
      n[6],
      0,
      n[1],
      n[4],
      n[7],
      0,
      n[2],
      n[5],
      n[8],
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  extractBasis(e, n, i) {
    return e.setFromMatrixColumn(this, 0), n.setFromMatrixColumn(this, 1), i.setFromMatrixColumn(this, 2), this;
  }
  makeBasis(e, n, i) {
    return this.set(
      e.x,
      n.x,
      i.x,
      0,
      e.y,
      n.y,
      i.y,
      0,
      e.z,
      n.z,
      i.z,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  extractRotation(e) {
    const n = this.elements, i = e.elements, r = 1 / ai.setFromMatrixColumn(e, 0).length(), s = 1 / ai.setFromMatrixColumn(e, 1).length(), a = 1 / ai.setFromMatrixColumn(e, 2).length();
    return n[0] = i[0] * r, n[1] = i[1] * r, n[2] = i[2] * r, n[3] = 0, n[4] = i[4] * s, n[5] = i[5] * s, n[6] = i[6] * s, n[7] = 0, n[8] = i[8] * a, n[9] = i[9] * a, n[10] = i[10] * a, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, this;
  }
  makeRotationFromEuler(e) {
    const n = this.elements, i = e.x, r = e.y, s = e.z, a = Math.cos(i), o = Math.sin(i), c = Math.cos(r), l = Math.sin(r), h = Math.cos(s), f = Math.sin(s);
    if (e.order === "XYZ") {
      const d = a * h, u = a * f, g = o * h, _ = o * f;
      n[0] = c * h, n[4] = -c * f, n[8] = l, n[1] = u + g * l, n[5] = d - _ * l, n[9] = -o * c, n[2] = _ - d * l, n[6] = g + u * l, n[10] = a * c;
    } else if (e.order === "YXZ") {
      const d = c * h, u = c * f, g = l * h, _ = l * f;
      n[0] = d + _ * o, n[4] = g * o - u, n[8] = a * l, n[1] = a * f, n[5] = a * h, n[9] = -o, n[2] = u * o - g, n[6] = _ + d * o, n[10] = a * c;
    } else if (e.order === "ZXY") {
      const d = c * h, u = c * f, g = l * h, _ = l * f;
      n[0] = d - _ * o, n[4] = -a * f, n[8] = g + u * o, n[1] = u + g * o, n[5] = a * h, n[9] = _ - d * o, n[2] = -a * l, n[6] = o, n[10] = a * c;
    } else if (e.order === "ZYX") {
      const d = a * h, u = a * f, g = o * h, _ = o * f;
      n[0] = c * h, n[4] = g * l - u, n[8] = d * l + _, n[1] = c * f, n[5] = _ * l + d, n[9] = u * l - g, n[2] = -l, n[6] = o * c, n[10] = a * c;
    } else if (e.order === "YZX") {
      const d = a * c, u = a * l, g = o * c, _ = o * l;
      n[0] = c * h, n[4] = _ - d * f, n[8] = g * f + u, n[1] = f, n[5] = a * h, n[9] = -o * h, n[2] = -l * h, n[6] = u * f + g, n[10] = d - _ * f;
    } else if (e.order === "XZY") {
      const d = a * c, u = a * l, g = o * c, _ = o * l;
      n[0] = c * h, n[4] = -f, n[8] = l * h, n[1] = d * f + _, n[5] = a * h, n[9] = u * f - g, n[2] = g * f - u, n[6] = o * h, n[10] = _ * f + d;
    }
    return n[3] = 0, n[7] = 0, n[11] = 0, n[12] = 0, n[13] = 0, n[14] = 0, n[15] = 1, this;
  }
  makeRotationFromQuaternion(e) {
    return this.compose(sd, e, ad);
  }
  lookAt(e, n, i) {
    const r = this.elements;
    return Lt.subVectors(e, n), Lt.lengthSq() === 0 && (Lt.z = 1), Lt.normalize(), En.crossVectors(i, Lt), En.lengthSq() === 0 && (Math.abs(i.z) === 1 ? Lt.x += 1e-4 : Lt.z += 1e-4, Lt.normalize(), En.crossVectors(i, Lt)), En.normalize(), or.crossVectors(Lt, En), r[0] = En.x, r[4] = or.x, r[8] = Lt.x, r[1] = En.y, r[5] = or.y, r[9] = Lt.y, r[2] = En.z, r[6] = or.z, r[10] = Lt.z, this;
  }
  multiply(e) {
    return this.multiplyMatrices(this, e);
  }
  premultiply(e) {
    return this.multiplyMatrices(e, this);
  }
  multiplyMatrices(e, n) {
    const i = e.elements, r = n.elements, s = this.elements, a = i[0], o = i[4], c = i[8], l = i[12], h = i[1], f = i[5], d = i[9], u = i[13], g = i[2], _ = i[6], p = i[10], m = i[14], E = i[3], M = i[7], x = i[11], P = i[15], b = r[0], A = r[4], R = r[8], S = r[12], v = r[1], C = r[5], F = r[9], L = r[13], D = r[2], W = r[6], V = r[10], K = r[14], G = r[3], te = r[7], ae = r[11], de = r[15];
    return s[0] = a * b + o * v + c * D + l * G, s[4] = a * A + o * C + c * W + l * te, s[8] = a * R + o * F + c * V + l * ae, s[12] = a * S + o * L + c * K + l * de, s[1] = h * b + f * v + d * D + u * G, s[5] = h * A + f * C + d * W + u * te, s[9] = h * R + f * F + d * V + u * ae, s[13] = h * S + f * L + d * K + u * de, s[2] = g * b + _ * v + p * D + m * G, s[6] = g * A + _ * C + p * W + m * te, s[10] = g * R + _ * F + p * V + m * ae, s[14] = g * S + _ * L + p * K + m * de, s[3] = E * b + M * v + x * D + P * G, s[7] = E * A + M * C + x * W + P * te, s[11] = E * R + M * F + x * V + P * ae, s[15] = E * S + M * L + x * K + P * de, this;
  }
  multiplyScalar(e) {
    const n = this.elements;
    return n[0] *= e, n[4] *= e, n[8] *= e, n[12] *= e, n[1] *= e, n[5] *= e, n[9] *= e, n[13] *= e, n[2] *= e, n[6] *= e, n[10] *= e, n[14] *= e, n[3] *= e, n[7] *= e, n[11] *= e, n[15] *= e, this;
  }
  determinant() {
    const e = this.elements, n = e[0], i = e[4], r = e[8], s = e[12], a = e[1], o = e[5], c = e[9], l = e[13], h = e[2], f = e[6], d = e[10], u = e[14], g = e[3], _ = e[7], p = e[11], m = e[15];
    return g * (+s * c * f - r * l * f - s * o * d + i * l * d + r * o * u - i * c * u) + _ * (+n * c * u - n * l * d + s * a * d - r * a * u + r * l * h - s * c * h) + p * (+n * l * f - n * o * u - s * a * f + i * a * u + s * o * h - i * l * h) + m * (-r * o * h - n * c * f + n * o * d + r * a * f - i * a * d + i * c * h);
  }
  transpose() {
    const e = this.elements;
    let n;
    return n = e[1], e[1] = e[4], e[4] = n, n = e[2], e[2] = e[8], e[8] = n, n = e[6], e[6] = e[9], e[9] = n, n = e[3], e[3] = e[12], e[12] = n, n = e[7], e[7] = e[13], e[13] = n, n = e[11], e[11] = e[14], e[14] = n, this;
  }
  setPosition(e, n, i) {
    const r = this.elements;
    return e.isVector3 ? (r[12] = e.x, r[13] = e.y, r[14] = e.z) : (r[12] = e, r[13] = n, r[14] = i), this;
  }
  invert() {
    const e = this.elements, n = e[0], i = e[1], r = e[2], s = e[3], a = e[4], o = e[5], c = e[6], l = e[7], h = e[8], f = e[9], d = e[10], u = e[11], g = e[12], _ = e[13], p = e[14], m = e[15], E = f * p * l - _ * d * l + _ * c * u - o * p * u - f * c * m + o * d * m, M = g * d * l - h * p * l - g * c * u + a * p * u + h * c * m - a * d * m, x = h * _ * l - g * f * l + g * o * u - a * _ * u - h * o * m + a * f * m, P = g * f * c - h * _ * c - g * o * d + a * _ * d + h * o * p - a * f * p, b = n * E + i * M + r * x + s * P;
    if (b === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const A = 1 / b;
    return e[0] = E * A, e[1] = (_ * d * s - f * p * s - _ * r * u + i * p * u + f * r * m - i * d * m) * A, e[2] = (o * p * s - _ * c * s + _ * r * l - i * p * l - o * r * m + i * c * m) * A, e[3] = (f * c * s - o * d * s - f * r * l + i * d * l + o * r * u - i * c * u) * A, e[4] = M * A, e[5] = (h * p * s - g * d * s + g * r * u - n * p * u - h * r * m + n * d * m) * A, e[6] = (g * c * s - a * p * s - g * r * l + n * p * l + a * r * m - n * c * m) * A, e[7] = (a * d * s - h * c * s + h * r * l - n * d * l - a * r * u + n * c * u) * A, e[8] = x * A, e[9] = (g * f * s - h * _ * s - g * i * u + n * _ * u + h * i * m - n * f * m) * A, e[10] = (a * _ * s - g * o * s + g * i * l - n * _ * l - a * i * m + n * o * m) * A, e[11] = (h * o * s - a * f * s - h * i * l + n * f * l + a * i * u - n * o * u) * A, e[12] = P * A, e[13] = (h * _ * r - g * f * r + g * i * d - n * _ * d - h * i * p + n * f * p) * A, e[14] = (g * o * r - a * _ * r - g * i * c + n * _ * c + a * i * p - n * o * p) * A, e[15] = (a * f * r - h * o * r + h * i * c - n * f * c - a * i * d + n * o * d) * A, this;
  }
  scale(e) {
    const n = this.elements, i = e.x, r = e.y, s = e.z;
    return n[0] *= i, n[4] *= r, n[8] *= s, n[1] *= i, n[5] *= r, n[9] *= s, n[2] *= i, n[6] *= r, n[10] *= s, n[3] *= i, n[7] *= r, n[11] *= s, this;
  }
  getMaxScaleOnAxis() {
    const e = this.elements, n = e[0] * e[0] + e[1] * e[1] + e[2] * e[2], i = e[4] * e[4] + e[5] * e[5] + e[6] * e[6], r = e[8] * e[8] + e[9] * e[9] + e[10] * e[10];
    return Math.sqrt(Math.max(n, i, r));
  }
  makeTranslation(e, n, i) {
    return e.isVector3 ? this.set(
      1,
      0,
      0,
      e.x,
      0,
      1,
      0,
      e.y,
      0,
      0,
      1,
      e.z,
      0,
      0,
      0,
      1
    ) : this.set(
      1,
      0,
      0,
      e,
      0,
      1,
      0,
      n,
      0,
      0,
      1,
      i,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationX(e) {
    const n = Math.cos(e), i = Math.sin(e);
    return this.set(
      1,
      0,
      0,
      0,
      0,
      n,
      -i,
      0,
      0,
      i,
      n,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationY(e) {
    const n = Math.cos(e), i = Math.sin(e);
    return this.set(
      n,
      0,
      i,
      0,
      0,
      1,
      0,
      0,
      -i,
      0,
      n,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationZ(e) {
    const n = Math.cos(e), i = Math.sin(e);
    return this.set(
      n,
      -i,
      0,
      0,
      i,
      n,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationAxis(e, n) {
    const i = Math.cos(n), r = Math.sin(n), s = 1 - i, a = e.x, o = e.y, c = e.z, l = s * a, h = s * o;
    return this.set(
      l * a + i,
      l * o - r * c,
      l * c + r * o,
      0,
      l * o + r * c,
      h * o + i,
      h * c - r * a,
      0,
      l * c - r * o,
      h * c + r * a,
      s * c * c + i,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeScale(e, n, i) {
    return this.set(
      e,
      0,
      0,
      0,
      0,
      n,
      0,
      0,
      0,
      0,
      i,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeShear(e, n, i, r, s, a) {
    return this.set(
      1,
      i,
      s,
      0,
      e,
      1,
      a,
      0,
      n,
      r,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  compose(e, n, i) {
    const r = this.elements, s = n._x, a = n._y, o = n._z, c = n._w, l = s + s, h = a + a, f = o + o, d = s * l, u = s * h, g = s * f, _ = a * h, p = a * f, m = o * f, E = c * l, M = c * h, x = c * f, P = i.x, b = i.y, A = i.z;
    return r[0] = (1 - (_ + m)) * P, r[1] = (u + x) * P, r[2] = (g - M) * P, r[3] = 0, r[4] = (u - x) * b, r[5] = (1 - (d + m)) * b, r[6] = (p + E) * b, r[7] = 0, r[8] = (g + M) * A, r[9] = (p - E) * A, r[10] = (1 - (d + _)) * A, r[11] = 0, r[12] = e.x, r[13] = e.y, r[14] = e.z, r[15] = 1, this;
  }
  decompose(e, n, i) {
    const r = this.elements;
    let s = ai.set(r[0], r[1], r[2]).length();
    const a = ai.set(r[4], r[5], r[6]).length(), o = ai.set(r[8], r[9], r[10]).length();
    this.determinant() < 0 && (s = -s), e.x = r[12], e.y = r[13], e.z = r[14], Wt.copy(this);
    const l = 1 / s, h = 1 / a, f = 1 / o;
    return Wt.elements[0] *= l, Wt.elements[1] *= l, Wt.elements[2] *= l, Wt.elements[4] *= h, Wt.elements[5] *= h, Wt.elements[6] *= h, Wt.elements[8] *= f, Wt.elements[9] *= f, Wt.elements[10] *= f, n.setFromRotationMatrix(Wt), i.x = s, i.y = a, i.z = o, this;
  }
  makePerspective(e, n, i, r, s, a, o = un) {
    const c = this.elements, l = 2 * s / (n - e), h = 2 * s / (i - r), f = (n + e) / (n - e), d = (i + r) / (i - r);
    let u, g;
    if (o === un)
      u = -(a + s) / (a - s), g = -2 * a * s / (a - s);
    else if (o === zr)
      u = -a / (a - s), g = -a * s / (a - s);
    else
      throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + o);
    return c[0] = l, c[4] = 0, c[8] = f, c[12] = 0, c[1] = 0, c[5] = h, c[9] = d, c[13] = 0, c[2] = 0, c[6] = 0, c[10] = u, c[14] = g, c[3] = 0, c[7] = 0, c[11] = -1, c[15] = 0, this;
  }
  makeOrthographic(e, n, i, r, s, a, o = un) {
    const c = this.elements, l = 1 / (n - e), h = 1 / (i - r), f = 1 / (a - s), d = (n + e) * l, u = (i + r) * h;
    let g, _;
    if (o === un)
      g = (a + s) * f, _ = -2 * f;
    else if (o === zr)
      g = s * f, _ = -1 * f;
    else
      throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + o);
    return c[0] = 2 * l, c[4] = 0, c[8] = 0, c[12] = -d, c[1] = 0, c[5] = 2 * h, c[9] = 0, c[13] = -u, c[2] = 0, c[6] = 0, c[10] = _, c[14] = -g, c[3] = 0, c[7] = 0, c[11] = 0, c[15] = 1, this;
  }
  equals(e) {
    const n = this.elements, i = e.elements;
    for (let r = 0; r < 16; r++)
      if (n[r] !== i[r]) return !1;
    return !0;
  }
  fromArray(e, n = 0) {
    for (let i = 0; i < 16; i++)
      this.elements[i] = e[i + n];
    return this;
  }
  toArray(e = [], n = 0) {
    const i = this.elements;
    return e[n] = i[0], e[n + 1] = i[1], e[n + 2] = i[2], e[n + 3] = i[3], e[n + 4] = i[4], e[n + 5] = i[5], e[n + 6] = i[6], e[n + 7] = i[7], e[n + 8] = i[8], e[n + 9] = i[9], e[n + 10] = i[10], e[n + 11] = i[11], e[n + 12] = i[12], e[n + 13] = i[13], e[n + 14] = i[14], e[n + 15] = i[15], e;
  }
}
const ai = /* @__PURE__ */ new z(), Wt = /* @__PURE__ */ new je(), sd = /* @__PURE__ */ new z(0, 0, 0), ad = /* @__PURE__ */ new z(1, 1, 1), En = /* @__PURE__ */ new z(), or = /* @__PURE__ */ new z(), Lt = /* @__PURE__ */ new z(), go = /* @__PURE__ */ new je(), _o = /* @__PURE__ */ new Un();
class gn {
  constructor(e = 0, n = 0, i = 0, r = gn.DEFAULT_ORDER) {
    this.isEuler = !0, this._x = e, this._y = n, this._z = i, this._order = r;
  }
  get x() {
    return this._x;
  }
  set x(e) {
    this._x = e, this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(e) {
    this._y = e, this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(e) {
    this._z = e, this._onChangeCallback();
  }
  get order() {
    return this._order;
  }
  set order(e) {
    this._order = e, this._onChangeCallback();
  }
  set(e, n, i, r = this._order) {
    return this._x = e, this._y = n, this._z = i, this._order = r, this._onChangeCallback(), this;
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._order);
  }
  copy(e) {
    return this._x = e._x, this._y = e._y, this._z = e._z, this._order = e._order, this._onChangeCallback(), this;
  }
  setFromRotationMatrix(e, n = this._order, i = !0) {
    const r = e.elements, s = r[0], a = r[4], o = r[8], c = r[1], l = r[5], h = r[9], f = r[2], d = r[6], u = r[10];
    switch (n) {
      case "XYZ":
        this._y = Math.asin(bt(o, -1, 1)), Math.abs(o) < 0.9999999 ? (this._x = Math.atan2(-h, u), this._z = Math.atan2(-a, s)) : (this._x = Math.atan2(d, l), this._z = 0);
        break;
      case "YXZ":
        this._x = Math.asin(-bt(h, -1, 1)), Math.abs(h) < 0.9999999 ? (this._y = Math.atan2(o, u), this._z = Math.atan2(c, l)) : (this._y = Math.atan2(-f, s), this._z = 0);
        break;
      case "ZXY":
        this._x = Math.asin(bt(d, -1, 1)), Math.abs(d) < 0.9999999 ? (this._y = Math.atan2(-f, u), this._z = Math.atan2(-a, l)) : (this._y = 0, this._z = Math.atan2(c, s));
        break;
      case "ZYX":
        this._y = Math.asin(-bt(f, -1, 1)), Math.abs(f) < 0.9999999 ? (this._x = Math.atan2(d, u), this._z = Math.atan2(c, s)) : (this._x = 0, this._z = Math.atan2(-a, l));
        break;
      case "YZX":
        this._z = Math.asin(bt(c, -1, 1)), Math.abs(c) < 0.9999999 ? (this._x = Math.atan2(-h, l), this._y = Math.atan2(-f, s)) : (this._x = 0, this._y = Math.atan2(o, u));
        break;
      case "XZY":
        this._z = Math.asin(-bt(a, -1, 1)), Math.abs(a) < 0.9999999 ? (this._x = Math.atan2(d, l), this._y = Math.atan2(o, s)) : (this._x = Math.atan2(-h, u), this._y = 0);
        break;
      default:
        console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + n);
    }
    return this._order = n, i === !0 && this._onChangeCallback(), this;
  }
  setFromQuaternion(e, n, i) {
    return go.makeRotationFromQuaternion(e), this.setFromRotationMatrix(go, n, i);
  }
  setFromVector3(e, n = this._order) {
    return this.set(e.x, e.y, e.z, n);
  }
  reorder(e) {
    return _o.setFromEuler(this), this.setFromQuaternion(_o, e);
  }
  equals(e) {
    return e._x === this._x && e._y === this._y && e._z === this._z && e._order === this._order;
  }
  fromArray(e) {
    return this._x = e[0], this._y = e[1], this._z = e[2], e[3] !== void 0 && (this._order = e[3]), this._onChangeCallback(), this;
  }
  toArray(e = [], n = 0) {
    return e[n] = this._x, e[n + 1] = this._y, e[n + 2] = this._z, e[n + 3] = this._order, e;
  }
  _onChange(e) {
    return this._onChangeCallback = e, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._order;
  }
}
gn.DEFAULT_ORDER = "XYZ";
class Ca {
  constructor() {
    this.mask = 1;
  }
  set(e) {
    this.mask = (1 << e | 0) >>> 0;
  }
  enable(e) {
    this.mask |= 1 << e | 0;
  }
  enableAll() {
    this.mask = -1;
  }
  toggle(e) {
    this.mask ^= 1 << e | 0;
  }
  disable(e) {
    this.mask &= ~(1 << e | 0);
  }
  disableAll() {
    this.mask = 0;
  }
  test(e) {
    return (this.mask & e.mask) !== 0;
  }
  isEnabled(e) {
    return (this.mask & (1 << e | 0)) !== 0;
  }
}
let od = 0;
const vo = /* @__PURE__ */ new z(), oi = /* @__PURE__ */ new Un(), cn = /* @__PURE__ */ new je(), cr = /* @__PURE__ */ new z(), Oi = /* @__PURE__ */ new z(), cd = /* @__PURE__ */ new z(), ld = /* @__PURE__ */ new Un(), xo = /* @__PURE__ */ new z(1, 0, 0), Mo = /* @__PURE__ */ new z(0, 1, 0), yo = /* @__PURE__ */ new z(0, 0, 1), So = { type: "added" }, hd = { type: "removed" }, ci = { type: "childadded", child: null }, as = { type: "childremoved", child: null };
class gt extends Zn {
  constructor() {
    super(), this.isObject3D = !0, Object.defineProperty(this, "id", { value: od++ }), this.uuid = Zi(), this.name = "", this.type = "Object3D", this.parent = null, this.children = [], this.up = gt.DEFAULT_UP.clone();
    const e = new z(), n = new gn(), i = new Un(), r = new z(1, 1, 1);
    function s() {
      i.setFromEuler(n, !1);
    }
    function a() {
      n.setFromQuaternion(i, void 0, !1);
    }
    n._onChange(s), i._onChange(a), Object.defineProperties(this, {
      position: {
        configurable: !0,
        enumerable: !0,
        value: e
      },
      rotation: {
        configurable: !0,
        enumerable: !0,
        value: n
      },
      quaternion: {
        configurable: !0,
        enumerable: !0,
        value: i
      },
      scale: {
        configurable: !0,
        enumerable: !0,
        value: r
      },
      modelViewMatrix: {
        value: new je()
      },
      normalMatrix: {
        value: new De()
      }
    }), this.matrix = new je(), this.matrixWorld = new je(), this.matrixAutoUpdate = gt.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldAutoUpdate = gt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.matrixWorldNeedsUpdate = !1, this.layers = new Ca(), this.visible = !0, this.castShadow = !1, this.receiveShadow = !1, this.frustumCulled = !0, this.renderOrder = 0, this.animations = [], this.userData = {};
  }
  onBeforeShadow() {
  }
  onAfterShadow() {
  }
  onBeforeRender() {
  }
  onAfterRender() {
  }
  applyMatrix4(e) {
    this.matrixAutoUpdate && this.updateMatrix(), this.matrix.premultiply(e), this.matrix.decompose(this.position, this.quaternion, this.scale);
  }
  applyQuaternion(e) {
    return this.quaternion.premultiply(e), this;
  }
  setRotationFromAxisAngle(e, n) {
    this.quaternion.setFromAxisAngle(e, n);
  }
  setRotationFromEuler(e) {
    this.quaternion.setFromEuler(e, !0);
  }
  setRotationFromMatrix(e) {
    this.quaternion.setFromRotationMatrix(e);
  }
  setRotationFromQuaternion(e) {
    this.quaternion.copy(e);
  }
  rotateOnAxis(e, n) {
    return oi.setFromAxisAngle(e, n), this.quaternion.multiply(oi), this;
  }
  rotateOnWorldAxis(e, n) {
    return oi.setFromAxisAngle(e, n), this.quaternion.premultiply(oi), this;
  }
  rotateX(e) {
    return this.rotateOnAxis(xo, e);
  }
  rotateY(e) {
    return this.rotateOnAxis(Mo, e);
  }
  rotateZ(e) {
    return this.rotateOnAxis(yo, e);
  }
  translateOnAxis(e, n) {
    return vo.copy(e).applyQuaternion(this.quaternion), this.position.add(vo.multiplyScalar(n)), this;
  }
  translateX(e) {
    return this.translateOnAxis(xo, e);
  }
  translateY(e) {
    return this.translateOnAxis(Mo, e);
  }
  translateZ(e) {
    return this.translateOnAxis(yo, e);
  }
  localToWorld(e) {
    return this.updateWorldMatrix(!0, !1), e.applyMatrix4(this.matrixWorld);
  }
  worldToLocal(e) {
    return this.updateWorldMatrix(!0, !1), e.applyMatrix4(cn.copy(this.matrixWorld).invert());
  }
  lookAt(e, n, i) {
    e.isVector3 ? cr.copy(e) : cr.set(e, n, i);
    const r = this.parent;
    this.updateWorldMatrix(!0, !1), Oi.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? cn.lookAt(Oi, cr, this.up) : cn.lookAt(cr, Oi, this.up), this.quaternion.setFromRotationMatrix(cn), r && (cn.extractRotation(r.matrixWorld), oi.setFromRotationMatrix(cn), this.quaternion.premultiply(oi.invert()));
  }
  add(e) {
    if (arguments.length > 1) {
      for (let n = 0; n < arguments.length; n++)
        this.add(arguments[n]);
      return this;
    }
    return e === this ? (console.error("THREE.Object3D.add: object can't be added as a child of itself.", e), this) : (e && e.isObject3D ? (e.removeFromParent(), e.parent = this, this.children.push(e), e.dispatchEvent(So), ci.child = e, this.dispatchEvent(ci), ci.child = null) : console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", e), this);
  }
  remove(e) {
    if (arguments.length > 1) {
      for (let i = 0; i < arguments.length; i++)
        this.remove(arguments[i]);
      return this;
    }
    const n = this.children.indexOf(e);
    return n !== -1 && (e.parent = null, this.children.splice(n, 1), e.dispatchEvent(hd), as.child = e, this.dispatchEvent(as), as.child = null), this;
  }
  removeFromParent() {
    const e = this.parent;
    return e !== null && e.remove(this), this;
  }
  clear() {
    return this.remove(...this.children);
  }
  attach(e) {
    return this.updateWorldMatrix(!0, !1), cn.copy(this.matrixWorld).invert(), e.parent !== null && (e.parent.updateWorldMatrix(!0, !1), cn.multiply(e.parent.matrixWorld)), e.applyMatrix4(cn), e.removeFromParent(), e.parent = this, this.children.push(e), e.updateWorldMatrix(!1, !0), e.dispatchEvent(So), ci.child = e, this.dispatchEvent(ci), ci.child = null, this;
  }
  getObjectById(e) {
    return this.getObjectByProperty("id", e);
  }
  getObjectByName(e) {
    return this.getObjectByProperty("name", e);
  }
  getObjectByProperty(e, n) {
    if (this[e] === n) return this;
    for (let i = 0, r = this.children.length; i < r; i++) {
      const a = this.children[i].getObjectByProperty(e, n);
      if (a !== void 0)
        return a;
    }
  }
  getObjectsByProperty(e, n, i = []) {
    this[e] === n && i.push(this);
    const r = this.children;
    for (let s = 0, a = r.length; s < a; s++)
      r[s].getObjectsByProperty(e, n, i);
    return i;
  }
  getWorldPosition(e) {
    return this.updateWorldMatrix(!0, !1), e.setFromMatrixPosition(this.matrixWorld);
  }
  getWorldQuaternion(e) {
    return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(Oi, e, cd), e;
  }
  getWorldScale(e) {
    return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(Oi, ld, e), e;
  }
  getWorldDirection(e) {
    this.updateWorldMatrix(!0, !1);
    const n = this.matrixWorld.elements;
    return e.set(n[8], n[9], n[10]).normalize();
  }
  raycast() {
  }
  traverse(e) {
    e(this);
    const n = this.children;
    for (let i = 0, r = n.length; i < r; i++)
      n[i].traverse(e);
  }
  traverseVisible(e) {
    if (this.visible === !1) return;
    e(this);
    const n = this.children;
    for (let i = 0, r = n.length; i < r; i++)
      n[i].traverseVisible(e);
  }
  traverseAncestors(e) {
    const n = this.parent;
    n !== null && (e(n), n.traverseAncestors(e));
  }
  updateMatrix() {
    this.matrix.compose(this.position, this.quaternion, this.scale), this.matrixWorldNeedsUpdate = !0;
  }
  updateMatrixWorld(e) {
    this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || e) && (this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), this.matrixWorldNeedsUpdate = !1, e = !0);
    const n = this.children;
    for (let i = 0, r = n.length; i < r; i++)
      n[i].updateMatrixWorld(e);
  }
  updateWorldMatrix(e, n) {
    const i = this.parent;
    if (e === !0 && i !== null && i.updateWorldMatrix(!0, !1), this.matrixAutoUpdate && this.updateMatrix(), this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), n === !0) {
      const r = this.children;
      for (let s = 0, a = r.length; s < a; s++)
        r[s].updateWorldMatrix(!1, !0);
    }
  }
  toJSON(e) {
    const n = e === void 0 || typeof e == "string", i = {};
    n && (e = {
      geometries: {},
      materials: {},
      textures: {},
      images: {},
      shapes: {},
      skeletons: {},
      animations: {},
      nodes: {}
    }, i.metadata = {
      version: 4.6,
      type: "Object",
      generator: "Object3D.toJSON"
    });
    const r = {};
    r.uuid = this.uuid, r.type = this.type, this.name !== "" && (r.name = this.name), this.castShadow === !0 && (r.castShadow = !0), this.receiveShadow === !0 && (r.receiveShadow = !0), this.visible === !1 && (r.visible = !1), this.frustumCulled === !1 && (r.frustumCulled = !1), this.renderOrder !== 0 && (r.renderOrder = this.renderOrder), Object.keys(this.userData).length > 0 && (r.userData = this.userData), r.layers = this.layers.mask, r.matrix = this.matrix.toArray(), r.up = this.up.toArray(), this.matrixAutoUpdate === !1 && (r.matrixAutoUpdate = !1), this.isInstancedMesh && (r.type = "InstancedMesh", r.count = this.count, r.instanceMatrix = this.instanceMatrix.toJSON(), this.instanceColor !== null && (r.instanceColor = this.instanceColor.toJSON())), this.isBatchedMesh && (r.type = "BatchedMesh", r.perObjectFrustumCulled = this.perObjectFrustumCulled, r.sortObjects = this.sortObjects, r.drawRanges = this._drawRanges, r.reservedRanges = this._reservedRanges, r.visibility = this._visibility, r.active = this._active, r.bounds = this._bounds.map((o) => ({
      boxInitialized: o.boxInitialized,
      boxMin: o.box.min.toArray(),
      boxMax: o.box.max.toArray(),
      sphereInitialized: o.sphereInitialized,
      sphereRadius: o.sphere.radius,
      sphereCenter: o.sphere.center.toArray()
    })), r.maxInstanceCount = this._maxInstanceCount, r.maxVertexCount = this._maxVertexCount, r.maxIndexCount = this._maxIndexCount, r.geometryInitialized = this._geometryInitialized, r.geometryCount = this._geometryCount, r.matricesTexture = this._matricesTexture.toJSON(e), this._colorsTexture !== null && (r.colorsTexture = this._colorsTexture.toJSON(e)), this.boundingSphere !== null && (r.boundingSphere = {
      center: r.boundingSphere.center.toArray(),
      radius: r.boundingSphere.radius
    }), this.boundingBox !== null && (r.boundingBox = {
      min: r.boundingBox.min.toArray(),
      max: r.boundingBox.max.toArray()
    }));
    function s(o, c) {
      return o[c.uuid] === void 0 && (o[c.uuid] = c.toJSON(e)), c.uuid;
    }
    if (this.isScene)
      this.background && (this.background.isColor ? r.background = this.background.toJSON() : this.background.isTexture && (r.background = this.background.toJSON(e).uuid)), this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== !0 && (r.environment = this.environment.toJSON(e).uuid);
    else if (this.isMesh || this.isLine || this.isPoints) {
      r.geometry = s(e.geometries, this.geometry);
      const o = this.geometry.parameters;
      if (o !== void 0 && o.shapes !== void 0) {
        const c = o.shapes;
        if (Array.isArray(c))
          for (let l = 0, h = c.length; l < h; l++) {
            const f = c[l];
            s(e.shapes, f);
          }
        else
          s(e.shapes, c);
      }
    }
    if (this.isSkinnedMesh && (r.bindMode = this.bindMode, r.bindMatrix = this.bindMatrix.toArray(), this.skeleton !== void 0 && (s(e.skeletons, this.skeleton), r.skeleton = this.skeleton.uuid)), this.material !== void 0)
      if (Array.isArray(this.material)) {
        const o = [];
        for (let c = 0, l = this.material.length; c < l; c++)
          o.push(s(e.materials, this.material[c]));
        r.material = o;
      } else
        r.material = s(e.materials, this.material);
    if (this.children.length > 0) {
      r.children = [];
      for (let o = 0; o < this.children.length; o++)
        r.children.push(this.children[o].toJSON(e).object);
    }
    if (this.animations.length > 0) {
      r.animations = [];
      for (let o = 0; o < this.animations.length; o++) {
        const c = this.animations[o];
        r.animations.push(s(e.animations, c));
      }
    }
    if (n) {
      const o = a(e.geometries), c = a(e.materials), l = a(e.textures), h = a(e.images), f = a(e.shapes), d = a(e.skeletons), u = a(e.animations), g = a(e.nodes);
      o.length > 0 && (i.geometries = o), c.length > 0 && (i.materials = c), l.length > 0 && (i.textures = l), h.length > 0 && (i.images = h), f.length > 0 && (i.shapes = f), d.length > 0 && (i.skeletons = d), u.length > 0 && (i.animations = u), g.length > 0 && (i.nodes = g);
    }
    return i.object = r, i;
    function a(o) {
      const c = [];
      for (const l in o) {
        const h = o[l];
        delete h.metadata, c.push(h);
      }
      return c;
    }
  }
  clone(e) {
    return new this.constructor().copy(this, e);
  }
  copy(e, n = !0) {
    if (this.name = e.name, this.up.copy(e.up), this.position.copy(e.position), this.rotation.order = e.rotation.order, this.quaternion.copy(e.quaternion), this.scale.copy(e.scale), this.matrix.copy(e.matrix), this.matrixWorld.copy(e.matrixWorld), this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrixWorldAutoUpdate = e.matrixWorldAutoUpdate, this.matrixWorldNeedsUpdate = e.matrixWorldNeedsUpdate, this.layers.mask = e.layers.mask, this.visible = e.visible, this.castShadow = e.castShadow, this.receiveShadow = e.receiveShadow, this.frustumCulled = e.frustumCulled, this.renderOrder = e.renderOrder, this.animations = e.animations.slice(), this.userData = JSON.parse(JSON.stringify(e.userData)), n === !0)
      for (let i = 0; i < e.children.length; i++) {
        const r = e.children[i];
        this.add(r.clone());
      }
    return this;
  }
}
gt.DEFAULT_UP = /* @__PURE__ */ new z(0, 1, 0);
gt.DEFAULT_MATRIX_AUTO_UPDATE = !0;
gt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0;
const Xt = /* @__PURE__ */ new z(), ln = /* @__PURE__ */ new z(), os = /* @__PURE__ */ new z(), hn = /* @__PURE__ */ new z(), li = /* @__PURE__ */ new z(), hi = /* @__PURE__ */ new z(), Eo = /* @__PURE__ */ new z(), cs = /* @__PURE__ */ new z(), ls = /* @__PURE__ */ new z(), hs = /* @__PURE__ */ new z(), fs = /* @__PURE__ */ new st(), ds = /* @__PURE__ */ new st(), us = /* @__PURE__ */ new st();
class qt {
  constructor(e = new z(), n = new z(), i = new z()) {
    this.a = e, this.b = n, this.c = i;
  }
  static getNormal(e, n, i, r) {
    r.subVectors(i, n), Xt.subVectors(e, n), r.cross(Xt);
    const s = r.lengthSq();
    return s > 0 ? r.multiplyScalar(1 / Math.sqrt(s)) : r.set(0, 0, 0);
  }
  // static/instance method to calculate barycentric coordinates
  // based on: http://www.blackpawn.com/texts/pointinpoly/default.html
  static getBarycoord(e, n, i, r, s) {
    Xt.subVectors(r, n), ln.subVectors(i, n), os.subVectors(e, n);
    const a = Xt.dot(Xt), o = Xt.dot(ln), c = Xt.dot(os), l = ln.dot(ln), h = ln.dot(os), f = a * l - o * o;
    if (f === 0)
      return s.set(0, 0, 0), null;
    const d = 1 / f, u = (l * c - o * h) * d, g = (a * h - o * c) * d;
    return s.set(1 - u - g, g, u);
  }
  static containsPoint(e, n, i, r) {
    return this.getBarycoord(e, n, i, r, hn) === null ? !1 : hn.x >= 0 && hn.y >= 0 && hn.x + hn.y <= 1;
  }
  static getInterpolation(e, n, i, r, s, a, o, c) {
    return this.getBarycoord(e, n, i, r, hn) === null ? (c.x = 0, c.y = 0, "z" in c && (c.z = 0), "w" in c && (c.w = 0), null) : (c.setScalar(0), c.addScaledVector(s, hn.x), c.addScaledVector(a, hn.y), c.addScaledVector(o, hn.z), c);
  }
  static getInterpolatedAttribute(e, n, i, r, s, a) {
    return fs.setScalar(0), ds.setScalar(0), us.setScalar(0), fs.fromBufferAttribute(e, n), ds.fromBufferAttribute(e, i), us.fromBufferAttribute(e, r), a.setScalar(0), a.addScaledVector(fs, s.x), a.addScaledVector(ds, s.y), a.addScaledVector(us, s.z), a;
  }
  static isFrontFacing(e, n, i, r) {
    return Xt.subVectors(i, n), ln.subVectors(e, n), Xt.cross(ln).dot(r) < 0;
  }
  set(e, n, i) {
    return this.a.copy(e), this.b.copy(n), this.c.copy(i), this;
  }
  setFromPointsAndIndices(e, n, i, r) {
    return this.a.copy(e[n]), this.b.copy(e[i]), this.c.copy(e[r]), this;
  }
  setFromAttributeAndIndices(e, n, i, r) {
    return this.a.fromBufferAttribute(e, n), this.b.fromBufferAttribute(e, i), this.c.fromBufferAttribute(e, r), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return this.a.copy(e.a), this.b.copy(e.b), this.c.copy(e.c), this;
  }
  getArea() {
    return Xt.subVectors(this.c, this.b), ln.subVectors(this.a, this.b), Xt.cross(ln).length() * 0.5;
  }
  getMidpoint(e) {
    return e.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
  }
  getNormal(e) {
    return qt.getNormal(this.a, this.b, this.c, e);
  }
  getPlane(e) {
    return e.setFromCoplanarPoints(this.a, this.b, this.c);
  }
  getBarycoord(e, n) {
    return qt.getBarycoord(e, this.a, this.b, this.c, n);
  }
  getInterpolation(e, n, i, r, s) {
    return qt.getInterpolation(e, this.a, this.b, this.c, n, i, r, s);
  }
  containsPoint(e) {
    return qt.containsPoint(e, this.a, this.b, this.c);
  }
  isFrontFacing(e) {
    return qt.isFrontFacing(this.a, this.b, this.c, e);
  }
  intersectsBox(e) {
    return e.intersectsTriangle(this);
  }
  closestPointToPoint(e, n) {
    const i = this.a, r = this.b, s = this.c;
    let a, o;
    li.subVectors(r, i), hi.subVectors(s, i), cs.subVectors(e, i);
    const c = li.dot(cs), l = hi.dot(cs);
    if (c <= 0 && l <= 0)
      return n.copy(i);
    ls.subVectors(e, r);
    const h = li.dot(ls), f = hi.dot(ls);
    if (h >= 0 && f <= h)
      return n.copy(r);
    const d = c * f - h * l;
    if (d <= 0 && c >= 0 && h <= 0)
      return a = c / (c - h), n.copy(i).addScaledVector(li, a);
    hs.subVectors(e, s);
    const u = li.dot(hs), g = hi.dot(hs);
    if (g >= 0 && u <= g)
      return n.copy(s);
    const _ = u * l - c * g;
    if (_ <= 0 && l >= 0 && g <= 0)
      return o = l / (l - g), n.copy(i).addScaledVector(hi, o);
    const p = h * g - u * f;
    if (p <= 0 && f - h >= 0 && u - g >= 0)
      return Eo.subVectors(s, r), o = (f - h) / (f - h + (u - g)), n.copy(r).addScaledVector(Eo, o);
    const m = 1 / (p + _ + d);
    return a = _ * m, o = d * m, n.copy(i).addScaledVector(li, a).addScaledVector(hi, o);
  }
  equals(e) {
    return e.a.equals(this.a) && e.b.equals(this.b) && e.c.equals(this.c);
  }
}
const Gc = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
}, Tn = { h: 0, s: 0, l: 0 }, lr = { h: 0, s: 0, l: 0 };
function ps(t, e, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? t + (e - t) * 6 * n : n < 1 / 2 ? e : n < 2 / 3 ? t + (e - t) * 6 * (2 / 3 - n) : t;
}
class Oe {
  constructor(e, n, i) {
    return this.isColor = !0, this.r = 1, this.g = 1, this.b = 1, this.set(e, n, i);
  }
  set(e, n, i) {
    if (n === void 0 && i === void 0) {
      const r = e;
      r && r.isColor ? this.copy(r) : typeof r == "number" ? this.setHex(r) : typeof r == "string" && this.setStyle(r);
    } else
      this.setRGB(e, n, i);
    return this;
  }
  setScalar(e) {
    return this.r = e, this.g = e, this.b = e, this;
  }
  setHex(e, n = Bt) {
    return e = Math.floor(e), this.r = (e >> 16 & 255) / 255, this.g = (e >> 8 & 255) / 255, this.b = (e & 255) / 255, Ge.toWorkingColorSpace(this, n), this;
  }
  setRGB(e, n, i, r = Ge.workingColorSpace) {
    return this.r = e, this.g = n, this.b = i, Ge.toWorkingColorSpace(this, r), this;
  }
  setHSL(e, n, i, r = Ge.workingColorSpace) {
    if (e = $f(e, 1), n = bt(n, 0, 1), i = bt(i, 0, 1), n === 0)
      this.r = this.g = this.b = i;
    else {
      const s = i <= 0.5 ? i * (1 + n) : i + n - i * n, a = 2 * i - s;
      this.r = ps(a, s, e + 1 / 3), this.g = ps(a, s, e), this.b = ps(a, s, e - 1 / 3);
    }
    return Ge.toWorkingColorSpace(this, r), this;
  }
  setStyle(e, n = Bt) {
    function i(s) {
      s !== void 0 && parseFloat(s) < 1 && console.warn("THREE.Color: Alpha component of " + e + " will be ignored.");
    }
    let r;
    if (r = /^(\w+)\(([^\)]*)\)/.exec(e)) {
      let s;
      const a = r[1], o = r[2];
      switch (a) {
        case "rgb":
        case "rgba":
          if (s = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
            return i(s[4]), this.setRGB(
              Math.min(255, parseInt(s[1], 10)) / 255,
              Math.min(255, parseInt(s[2], 10)) / 255,
              Math.min(255, parseInt(s[3], 10)) / 255,
              n
            );
          if (s = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
            return i(s[4]), this.setRGB(
              Math.min(100, parseInt(s[1], 10)) / 100,
              Math.min(100, parseInt(s[2], 10)) / 100,
              Math.min(100, parseInt(s[3], 10)) / 100,
              n
            );
          break;
        case "hsl":
        case "hsla":
          if (s = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
            return i(s[4]), this.setHSL(
              parseFloat(s[1]) / 360,
              parseFloat(s[2]) / 100,
              parseFloat(s[3]) / 100,
              n
            );
          break;
        default:
          console.warn("THREE.Color: Unknown color model " + e);
      }
    } else if (r = /^\#([A-Fa-f\d]+)$/.exec(e)) {
      const s = r[1], a = s.length;
      if (a === 3)
        return this.setRGB(
          parseInt(s.charAt(0), 16) / 15,
          parseInt(s.charAt(1), 16) / 15,
          parseInt(s.charAt(2), 16) / 15,
          n
        );
      if (a === 6)
        return this.setHex(parseInt(s, 16), n);
      console.warn("THREE.Color: Invalid hex color " + e);
    } else if (e && e.length > 0)
      return this.setColorName(e, n);
    return this;
  }
  setColorName(e, n = Bt) {
    const i = Gc[e.toLowerCase()];
    return i !== void 0 ? this.setHex(i, n) : console.warn("THREE.Color: Unknown color " + e), this;
  }
  clone() {
    return new this.constructor(this.r, this.g, this.b);
  }
  copy(e) {
    return this.r = e.r, this.g = e.g, this.b = e.b, this;
  }
  copySRGBToLinear(e) {
    return this.r = pn(e.r), this.g = pn(e.g), this.b = pn(e.b), this;
  }
  copyLinearToSRGB(e) {
    return this.r = Si(e.r), this.g = Si(e.g), this.b = Si(e.b), this;
  }
  convertSRGBToLinear() {
    return this.copySRGBToLinear(this), this;
  }
  convertLinearToSRGB() {
    return this.copyLinearToSRGB(this), this;
  }
  getHex(e = Bt) {
    return Ge.fromWorkingColorSpace(Mt.copy(this), e), Math.round(bt(Mt.r * 255, 0, 255)) * 65536 + Math.round(bt(Mt.g * 255, 0, 255)) * 256 + Math.round(bt(Mt.b * 255, 0, 255));
  }
  getHexString(e = Bt) {
    return ("000000" + this.getHex(e).toString(16)).slice(-6);
  }
  getHSL(e, n = Ge.workingColorSpace) {
    Ge.fromWorkingColorSpace(Mt.copy(this), n);
    const i = Mt.r, r = Mt.g, s = Mt.b, a = Math.max(i, r, s), o = Math.min(i, r, s);
    let c, l;
    const h = (o + a) / 2;
    if (o === a)
      c = 0, l = 0;
    else {
      const f = a - o;
      switch (l = h <= 0.5 ? f / (a + o) : f / (2 - a - o), a) {
        case i:
          c = (r - s) / f + (r < s ? 6 : 0);
          break;
        case r:
          c = (s - i) / f + 2;
          break;
        case s:
          c = (i - r) / f + 4;
          break;
      }
      c /= 6;
    }
    return e.h = c, e.s = l, e.l = h, e;
  }
  getRGB(e, n = Ge.workingColorSpace) {
    return Ge.fromWorkingColorSpace(Mt.copy(this), n), e.r = Mt.r, e.g = Mt.g, e.b = Mt.b, e;
  }
  getStyle(e = Bt) {
    Ge.fromWorkingColorSpace(Mt.copy(this), e);
    const n = Mt.r, i = Mt.g, r = Mt.b;
    return e !== Bt ? `color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})` : `rgb(${Math.round(n * 255)},${Math.round(i * 255)},${Math.round(r * 255)})`;
  }
  offsetHSL(e, n, i) {
    return this.getHSL(Tn), this.setHSL(Tn.h + e, Tn.s + n, Tn.l + i);
  }
  add(e) {
    return this.r += e.r, this.g += e.g, this.b += e.b, this;
  }
  addColors(e, n) {
    return this.r = e.r + n.r, this.g = e.g + n.g, this.b = e.b + n.b, this;
  }
  addScalar(e) {
    return this.r += e, this.g += e, this.b += e, this;
  }
  sub(e) {
    return this.r = Math.max(0, this.r - e.r), this.g = Math.max(0, this.g - e.g), this.b = Math.max(0, this.b - e.b), this;
  }
  multiply(e) {
    return this.r *= e.r, this.g *= e.g, this.b *= e.b, this;
  }
  multiplyScalar(e) {
    return this.r *= e, this.g *= e, this.b *= e, this;
  }
  lerp(e, n) {
    return this.r += (e.r - this.r) * n, this.g += (e.g - this.g) * n, this.b += (e.b - this.b) * n, this;
  }
  lerpColors(e, n, i) {
    return this.r = e.r + (n.r - e.r) * i, this.g = e.g + (n.g - e.g) * i, this.b = e.b + (n.b - e.b) * i, this;
  }
  lerpHSL(e, n) {
    this.getHSL(Tn), e.getHSL(lr);
    const i = Kr(Tn.h, lr.h, n), r = Kr(Tn.s, lr.s, n), s = Kr(Tn.l, lr.l, n);
    return this.setHSL(i, r, s), this;
  }
  setFromVector3(e) {
    return this.r = e.x, this.g = e.y, this.b = e.z, this;
  }
  applyMatrix3(e) {
    const n = this.r, i = this.g, r = this.b, s = e.elements;
    return this.r = s[0] * n + s[3] * i + s[6] * r, this.g = s[1] * n + s[4] * i + s[7] * r, this.b = s[2] * n + s[5] * i + s[8] * r, this;
  }
  equals(e) {
    return e.r === this.r && e.g === this.g && e.b === this.b;
  }
  fromArray(e, n = 0) {
    return this.r = e[n], this.g = e[n + 1], this.b = e[n + 2], this;
  }
  toArray(e = [], n = 0) {
    return e[n] = this.r, e[n + 1] = this.g, e[n + 2] = this.b, e;
  }
  fromBufferAttribute(e, n) {
    return this.r = e.getX(n), this.g = e.getY(n), this.b = e.getZ(n), this;
  }
  toJSON() {
    return this.getHex();
  }
  *[Symbol.iterator]() {
    yield this.r, yield this.g, yield this.b;
  }
}
const Mt = /* @__PURE__ */ new Oe();
Oe.NAMES = Gc;
let fd = 0;
class Pi extends Zn {
  static get type() {
    return "Material";
  }
  get type() {
    return this.constructor.type;
  }
  set type(e) {
  }
  constructor() {
    super(), this.isMaterial = !0, Object.defineProperty(this, "id", { value: fd++ }), this.uuid = Zi(), this.name = "", this.blending = Mi, this.side = In, this.vertexColors = !1, this.opacity = 1, this.transparent = !1, this.alphaHash = !1, this.blendSrc = Cs, this.blendDst = Ps, this.blendEquation = Wn, this.blendSrcAlpha = null, this.blendDstAlpha = null, this.blendEquationAlpha = null, this.blendColor = new Oe(0, 0, 0), this.blendAlpha = 0, this.depthFunc = Ei, this.depthTest = !0, this.depthWrite = !0, this.stencilWriteMask = 255, this.stencilFunc = so, this.stencilRef = 0, this.stencilFuncMask = 255, this.stencilFail = ti, this.stencilZFail = ti, this.stencilZPass = ti, this.stencilWrite = !1, this.clippingPlanes = null, this.clipIntersection = !1, this.clipShadows = !1, this.shadowSide = null, this.colorWrite = !0, this.precision = null, this.polygonOffset = !1, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.dithering = !1, this.alphaToCoverage = !1, this.premultipliedAlpha = !1, this.forceSinglePass = !1, this.visible = !0, this.toneMapped = !0, this.userData = {}, this.version = 0, this._alphaTest = 0;
  }
  get alphaTest() {
    return this._alphaTest;
  }
  set alphaTest(e) {
    this._alphaTest > 0 != e > 0 && this.version++, this._alphaTest = e;
  }
  // onBeforeRender and onBeforeCompile only supported in WebGLRenderer
  onBeforeRender() {
  }
  onBeforeCompile() {
  }
  customProgramCacheKey() {
    return this.onBeforeCompile.toString();
  }
  setValues(e) {
    if (e !== void 0)
      for (const n in e) {
        const i = e[n];
        if (i === void 0) {
          console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);
          continue;
        }
        const r = this[n];
        if (r === void 0) {
          console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);
          continue;
        }
        r && r.isColor ? r.set(i) : r && r.isVector3 && i && i.isVector3 ? r.copy(i) : this[n] = i;
      }
  }
  toJSON(e) {
    const n = e === void 0 || typeof e == "string";
    n && (e = {
      textures: {},
      images: {}
    });
    const i = {
      metadata: {
        version: 4.6,
        type: "Material",
        generator: "Material.toJSON"
      }
    };
    i.uuid = this.uuid, i.type = this.type, this.name !== "" && (i.name = this.name), this.color && this.color.isColor && (i.color = this.color.getHex()), this.roughness !== void 0 && (i.roughness = this.roughness), this.metalness !== void 0 && (i.metalness = this.metalness), this.sheen !== void 0 && (i.sheen = this.sheen), this.sheenColor && this.sheenColor.isColor && (i.sheenColor = this.sheenColor.getHex()), this.sheenRoughness !== void 0 && (i.sheenRoughness = this.sheenRoughness), this.emissive && this.emissive.isColor && (i.emissive = this.emissive.getHex()), this.emissiveIntensity !== void 0 && this.emissiveIntensity !== 1 && (i.emissiveIntensity = this.emissiveIntensity), this.specular && this.specular.isColor && (i.specular = this.specular.getHex()), this.specularIntensity !== void 0 && (i.specularIntensity = this.specularIntensity), this.specularColor && this.specularColor.isColor && (i.specularColor = this.specularColor.getHex()), this.shininess !== void 0 && (i.shininess = this.shininess), this.clearcoat !== void 0 && (i.clearcoat = this.clearcoat), this.clearcoatRoughness !== void 0 && (i.clearcoatRoughness = this.clearcoatRoughness), this.clearcoatMap && this.clearcoatMap.isTexture && (i.clearcoatMap = this.clearcoatMap.toJSON(e).uuid), this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (i.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(e).uuid), this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (i.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(e).uuid, i.clearcoatNormalScale = this.clearcoatNormalScale.toArray()), this.dispersion !== void 0 && (i.dispersion = this.dispersion), this.iridescence !== void 0 && (i.iridescence = this.iridescence), this.iridescenceIOR !== void 0 && (i.iridescenceIOR = this.iridescenceIOR), this.iridescenceThicknessRange !== void 0 && (i.iridescenceThicknessRange = this.iridescenceThicknessRange), this.iridescenceMap && this.iridescenceMap.isTexture && (i.iridescenceMap = this.iridescenceMap.toJSON(e).uuid), this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (i.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(e).uuid), this.anisotropy !== void 0 && (i.anisotropy = this.anisotropy), this.anisotropyRotation !== void 0 && (i.anisotropyRotation = this.anisotropyRotation), this.anisotropyMap && this.anisotropyMap.isTexture && (i.anisotropyMap = this.anisotropyMap.toJSON(e).uuid), this.map && this.map.isTexture && (i.map = this.map.toJSON(e).uuid), this.matcap && this.matcap.isTexture && (i.matcap = this.matcap.toJSON(e).uuid), this.alphaMap && this.alphaMap.isTexture && (i.alphaMap = this.alphaMap.toJSON(e).uuid), this.lightMap && this.lightMap.isTexture && (i.lightMap = this.lightMap.toJSON(e).uuid, i.lightMapIntensity = this.lightMapIntensity), this.aoMap && this.aoMap.isTexture && (i.aoMap = this.aoMap.toJSON(e).uuid, i.aoMapIntensity = this.aoMapIntensity), this.bumpMap && this.bumpMap.isTexture && (i.bumpMap = this.bumpMap.toJSON(e).uuid, i.bumpScale = this.bumpScale), this.normalMap && this.normalMap.isTexture && (i.normalMap = this.normalMap.toJSON(e).uuid, i.normalMapType = this.normalMapType, i.normalScale = this.normalScale.toArray()), this.displacementMap && this.displacementMap.isTexture && (i.displacementMap = this.displacementMap.toJSON(e).uuid, i.displacementScale = this.displacementScale, i.displacementBias = this.displacementBias), this.roughnessMap && this.roughnessMap.isTexture && (i.roughnessMap = this.roughnessMap.toJSON(e).uuid), this.metalnessMap && this.metalnessMap.isTexture && (i.metalnessMap = this.metalnessMap.toJSON(e).uuid), this.emissiveMap && this.emissiveMap.isTexture && (i.emissiveMap = this.emissiveMap.toJSON(e).uuid), this.specularMap && this.specularMap.isTexture && (i.specularMap = this.specularMap.toJSON(e).uuid), this.specularIntensityMap && this.specularIntensityMap.isTexture && (i.specularIntensityMap = this.specularIntensityMap.toJSON(e).uuid), this.specularColorMap && this.specularColorMap.isTexture && (i.specularColorMap = this.specularColorMap.toJSON(e).uuid), this.envMap && this.envMap.isTexture && (i.envMap = this.envMap.toJSON(e).uuid, this.combine !== void 0 && (i.combine = this.combine)), this.envMapRotation !== void 0 && (i.envMapRotation = this.envMapRotation.toArray()), this.envMapIntensity !== void 0 && (i.envMapIntensity = this.envMapIntensity), this.reflectivity !== void 0 && (i.reflectivity = this.reflectivity), this.refractionRatio !== void 0 && (i.refractionRatio = this.refractionRatio), this.gradientMap && this.gradientMap.isTexture && (i.gradientMap = this.gradientMap.toJSON(e).uuid), this.transmission !== void 0 && (i.transmission = this.transmission), this.transmissionMap && this.transmissionMap.isTexture && (i.transmissionMap = this.transmissionMap.toJSON(e).uuid), this.thickness !== void 0 && (i.thickness = this.thickness), this.thicknessMap && this.thicknessMap.isTexture && (i.thicknessMap = this.thicknessMap.toJSON(e).uuid), this.attenuationDistance !== void 0 && this.attenuationDistance !== 1 / 0 && (i.attenuationDistance = this.attenuationDistance), this.attenuationColor !== void 0 && (i.attenuationColor = this.attenuationColor.getHex()), this.size !== void 0 && (i.size = this.size), this.shadowSide !== null && (i.shadowSide = this.shadowSide), this.sizeAttenuation !== void 0 && (i.sizeAttenuation = this.sizeAttenuation), this.blending !== Mi && (i.blending = this.blending), this.side !== In && (i.side = this.side), this.vertexColors === !0 && (i.vertexColors = !0), this.opacity < 1 && (i.opacity = this.opacity), this.transparent === !0 && (i.transparent = !0), this.blendSrc !== Cs && (i.blendSrc = this.blendSrc), this.blendDst !== Ps && (i.blendDst = this.blendDst), this.blendEquation !== Wn && (i.blendEquation = this.blendEquation), this.blendSrcAlpha !== null && (i.blendSrcAlpha = this.blendSrcAlpha), this.blendDstAlpha !== null && (i.blendDstAlpha = this.blendDstAlpha), this.blendEquationAlpha !== null && (i.blendEquationAlpha = this.blendEquationAlpha), this.blendColor && this.blendColor.isColor && (i.blendColor = this.blendColor.getHex()), this.blendAlpha !== 0 && (i.blendAlpha = this.blendAlpha), this.depthFunc !== Ei && (i.depthFunc = this.depthFunc), this.depthTest === !1 && (i.depthTest = this.depthTest), this.depthWrite === !1 && (i.depthWrite = this.depthWrite), this.colorWrite === !1 && (i.colorWrite = this.colorWrite), this.stencilWriteMask !== 255 && (i.stencilWriteMask = this.stencilWriteMask), this.stencilFunc !== so && (i.stencilFunc = this.stencilFunc), this.stencilRef !== 0 && (i.stencilRef = this.stencilRef), this.stencilFuncMask !== 255 && (i.stencilFuncMask = this.stencilFuncMask), this.stencilFail !== ti && (i.stencilFail = this.stencilFail), this.stencilZFail !== ti && (i.stencilZFail = this.stencilZFail), this.stencilZPass !== ti && (i.stencilZPass = this.stencilZPass), this.stencilWrite === !0 && (i.stencilWrite = this.stencilWrite), this.rotation !== void 0 && this.rotation !== 0 && (i.rotation = this.rotation), this.polygonOffset === !0 && (i.polygonOffset = !0), this.polygonOffsetFactor !== 0 && (i.polygonOffsetFactor = this.polygonOffsetFactor), this.polygonOffsetUnits !== 0 && (i.polygonOffsetUnits = this.polygonOffsetUnits), this.linewidth !== void 0 && this.linewidth !== 1 && (i.linewidth = this.linewidth), this.dashSize !== void 0 && (i.dashSize = this.dashSize), this.gapSize !== void 0 && (i.gapSize = this.gapSize), this.scale !== void 0 && (i.scale = this.scale), this.dithering === !0 && (i.dithering = !0), this.alphaTest > 0 && (i.alphaTest = this.alphaTest), this.alphaHash === !0 && (i.alphaHash = !0), this.alphaToCoverage === !0 && (i.alphaToCoverage = !0), this.premultipliedAlpha === !0 && (i.premultipliedAlpha = !0), this.forceSinglePass === !0 && (i.forceSinglePass = !0), this.wireframe === !0 && (i.wireframe = !0), this.wireframeLinewidth > 1 && (i.wireframeLinewidth = this.wireframeLinewidth), this.wireframeLinecap !== "round" && (i.wireframeLinecap = this.wireframeLinecap), this.wireframeLinejoin !== "round" && (i.wireframeLinejoin = this.wireframeLinejoin), this.flatShading === !0 && (i.flatShading = !0), this.visible === !1 && (i.visible = !1), this.toneMapped === !1 && (i.toneMapped = !1), this.fog === !1 && (i.fog = !1), Object.keys(this.userData).length > 0 && (i.userData = this.userData);
    function r(s) {
      const a = [];
      for (const o in s) {
        const c = s[o];
        delete c.metadata, a.push(c);
      }
      return a;
    }
    if (n) {
      const s = r(e.textures), a = r(e.images);
      s.length > 0 && (i.textures = s), a.length > 0 && (i.images = a);
    }
    return i;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    this.name = e.name, this.blending = e.blending, this.side = e.side, this.vertexColors = e.vertexColors, this.opacity = e.opacity, this.transparent = e.transparent, this.blendSrc = e.blendSrc, this.blendDst = e.blendDst, this.blendEquation = e.blendEquation, this.blendSrcAlpha = e.blendSrcAlpha, this.blendDstAlpha = e.blendDstAlpha, this.blendEquationAlpha = e.blendEquationAlpha, this.blendColor.copy(e.blendColor), this.blendAlpha = e.blendAlpha, this.depthFunc = e.depthFunc, this.depthTest = e.depthTest, this.depthWrite = e.depthWrite, this.stencilWriteMask = e.stencilWriteMask, this.stencilFunc = e.stencilFunc, this.stencilRef = e.stencilRef, this.stencilFuncMask = e.stencilFuncMask, this.stencilFail = e.stencilFail, this.stencilZFail = e.stencilZFail, this.stencilZPass = e.stencilZPass, this.stencilWrite = e.stencilWrite;
    const n = e.clippingPlanes;
    let i = null;
    if (n !== null) {
      const r = n.length;
      i = new Array(r);
      for (let s = 0; s !== r; ++s)
        i[s] = n[s].clone();
    }
    return this.clippingPlanes = i, this.clipIntersection = e.clipIntersection, this.clipShadows = e.clipShadows, this.shadowSide = e.shadowSide, this.colorWrite = e.colorWrite, this.precision = e.precision, this.polygonOffset = e.polygonOffset, this.polygonOffsetFactor = e.polygonOffsetFactor, this.polygonOffsetUnits = e.polygonOffsetUnits, this.dithering = e.dithering, this.alphaTest = e.alphaTest, this.alphaHash = e.alphaHash, this.alphaToCoverage = e.alphaToCoverage, this.premultipliedAlpha = e.premultipliedAlpha, this.forceSinglePass = e.forceSinglePass, this.visible = e.visible, this.toneMapped = e.toneMapped, this.userData = JSON.parse(JSON.stringify(e.userData)), this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  set needsUpdate(e) {
    e === !0 && this.version++;
  }
  onBuild() {
    console.warn("Material: onBuild() has been removed.");
  }
}
class Ji extends Pi {
  static get type() {
    return "MeshBasicMaterial";
  }
  constructor(e) {
    super(), this.isMeshBasicMaterial = !0, this.color = new Oe(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new gn(), this.combine = Rc, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.color.copy(e.color), this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.specularMap = e.specularMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.combine = e.combine, this.reflectivity = e.reflectivity, this.refractionRatio = e.refractionRatio, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.fog = e.fog, this;
  }
}
const ot = /* @__PURE__ */ new z(), hr = /* @__PURE__ */ new we();
class ht {
  constructor(e, n, i = !1) {
    if (Array.isArray(e))
      throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");
    this.isBufferAttribute = !0, this.name = "", this.array = e, this.itemSize = n, this.count = e !== void 0 ? e.length / n : 0, this.normalized = i, this.usage = ao, this.updateRanges = [], this.gpuType = Qt, this.version = 0;
  }
  onUploadCallback() {
  }
  set needsUpdate(e) {
    e === !0 && this.version++;
  }
  setUsage(e) {
    return this.usage = e, this;
  }
  addUpdateRange(e, n) {
    this.updateRanges.push({ start: e, count: n });
  }
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  copy(e) {
    return this.name = e.name, this.array = new e.array.constructor(e.array), this.itemSize = e.itemSize, this.count = e.count, this.normalized = e.normalized, this.usage = e.usage, this.gpuType = e.gpuType, this;
  }
  copyAt(e, n, i) {
    e *= this.itemSize, i *= n.itemSize;
    for (let r = 0, s = this.itemSize; r < s; r++)
      this.array[e + r] = n.array[i + r];
    return this;
  }
  copyArray(e) {
    return this.array.set(e), this;
  }
  applyMatrix3(e) {
    if (this.itemSize === 2)
      for (let n = 0, i = this.count; n < i; n++)
        hr.fromBufferAttribute(this, n), hr.applyMatrix3(e), this.setXY(n, hr.x, hr.y);
    else if (this.itemSize === 3)
      for (let n = 0, i = this.count; n < i; n++)
        ot.fromBufferAttribute(this, n), ot.applyMatrix3(e), this.setXYZ(n, ot.x, ot.y, ot.z);
    return this;
  }
  applyMatrix4(e) {
    for (let n = 0, i = this.count; n < i; n++)
      ot.fromBufferAttribute(this, n), ot.applyMatrix4(e), this.setXYZ(n, ot.x, ot.y, ot.z);
    return this;
  }
  applyNormalMatrix(e) {
    for (let n = 0, i = this.count; n < i; n++)
      ot.fromBufferAttribute(this, n), ot.applyNormalMatrix(e), this.setXYZ(n, ot.x, ot.y, ot.z);
    return this;
  }
  transformDirection(e) {
    for (let n = 0, i = this.count; n < i; n++)
      ot.fromBufferAttribute(this, n), ot.transformDirection(e), this.setXYZ(n, ot.x, ot.y, ot.z);
    return this;
  }
  set(e, n = 0) {
    return this.array.set(e, n), this;
  }
  getComponent(e, n) {
    let i = this.array[e * this.itemSize + n];
    return this.normalized && (i = Ui(i, this.array)), i;
  }
  setComponent(e, n, i) {
    return this.normalized && (i = wt(i, this.array)), this.array[e * this.itemSize + n] = i, this;
  }
  getX(e) {
    let n = this.array[e * this.itemSize];
    return this.normalized && (n = Ui(n, this.array)), n;
  }
  setX(e, n) {
    return this.normalized && (n = wt(n, this.array)), this.array[e * this.itemSize] = n, this;
  }
  getY(e) {
    let n = this.array[e * this.itemSize + 1];
    return this.normalized && (n = Ui(n, this.array)), n;
  }
  setY(e, n) {
    return this.normalized && (n = wt(n, this.array)), this.array[e * this.itemSize + 1] = n, this;
  }
  getZ(e) {
    let n = this.array[e * this.itemSize + 2];
    return this.normalized && (n = Ui(n, this.array)), n;
  }
  setZ(e, n) {
    return this.normalized && (n = wt(n, this.array)), this.array[e * this.itemSize + 2] = n, this;
  }
  getW(e) {
    let n = this.array[e * this.itemSize + 3];
    return this.normalized && (n = Ui(n, this.array)), n;
  }
  setW(e, n) {
    return this.normalized && (n = wt(n, this.array)), this.array[e * this.itemSize + 3] = n, this;
  }
  setXY(e, n, i) {
    return e *= this.itemSize, this.normalized && (n = wt(n, this.array), i = wt(i, this.array)), this.array[e + 0] = n, this.array[e + 1] = i, this;
  }
  setXYZ(e, n, i, r) {
    return e *= this.itemSize, this.normalized && (n = wt(n, this.array), i = wt(i, this.array), r = wt(r, this.array)), this.array[e + 0] = n, this.array[e + 1] = i, this.array[e + 2] = r, this;
  }
  setXYZW(e, n, i, r, s) {
    return e *= this.itemSize, this.normalized && (n = wt(n, this.array), i = wt(i, this.array), r = wt(r, this.array), s = wt(s, this.array)), this.array[e + 0] = n, this.array[e + 1] = i, this.array[e + 2] = r, this.array[e + 3] = s, this;
  }
  onUpload(e) {
    return this.onUploadCallback = e, this;
  }
  clone() {
    return new this.constructor(this.array, this.itemSize).copy(this);
  }
  toJSON() {
    const e = {
      itemSize: this.itemSize,
      type: this.array.constructor.name,
      array: Array.from(this.array),
      normalized: this.normalized
    };
    return this.name !== "" && (e.name = this.name), this.usage !== ao && (e.usage = this.usage), e;
  }
}
class Wc extends ht {
  constructor(e, n, i) {
    super(new Uint16Array(e), n, i);
  }
}
class Xc extends ht {
  constructor(e, n, i) {
    super(new Int32Array(e), n, i);
  }
}
class qc extends ht {
  constructor(e, n, i) {
    super(new Uint32Array(e), n, i);
  }
}
class ft extends ht {
  constructor(e, n, i) {
    super(new Float32Array(e), n, i);
  }
}
let dd = 0;
const zt = /* @__PURE__ */ new je(), ms = /* @__PURE__ */ new gt(), fi = /* @__PURE__ */ new z(), It = /* @__PURE__ */ new Kn(), zi = /* @__PURE__ */ new Kn(), pt = /* @__PURE__ */ new z();
class _t extends Zn {
  constructor() {
    super(), this.isBufferGeometry = !0, Object.defineProperty(this, "id", { value: dd++ }), this.uuid = Zi(), this.name = "", this.type = "BufferGeometry", this.index = null, this.indirect = null, this.attributes = {}, this.morphAttributes = {}, this.morphTargetsRelative = !1, this.groups = [], this.boundingBox = null, this.boundingSphere = null, this.drawRange = { start: 0, count: 1 / 0 }, this.userData = {};
  }
  getIndex() {
    return this.index;
  }
  setIndex(e) {
    return Array.isArray(e) ? this.index = new (Hc(e) ? qc : Wc)(e, 1) : this.index = e, this;
  }
  setIndirect(e) {
    return this.indirect = e, this;
  }
  getIndirect() {
    return this.indirect;
  }
  getAttribute(e) {
    return this.attributes[e];
  }
  setAttribute(e, n) {
    return this.attributes[e] = n, this;
  }
  deleteAttribute(e) {
    return delete this.attributes[e], this;
  }
  hasAttribute(e) {
    return this.attributes[e] !== void 0;
  }
  addGroup(e, n, i = 0) {
    this.groups.push({
      start: e,
      count: n,
      materialIndex: i
    });
  }
  clearGroups() {
    this.groups = [];
  }
  setDrawRange(e, n) {
    this.drawRange.start = e, this.drawRange.count = n;
  }
  applyMatrix4(e) {
    const n = this.attributes.position;
    n !== void 0 && (n.applyMatrix4(e), n.needsUpdate = !0);
    const i = this.attributes.normal;
    if (i !== void 0) {
      const s = new De().getNormalMatrix(e);
      i.applyNormalMatrix(s), i.needsUpdate = !0;
    }
    const r = this.attributes.tangent;
    return r !== void 0 && (r.transformDirection(e), r.needsUpdate = !0), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this;
  }
  applyQuaternion(e) {
    return zt.makeRotationFromQuaternion(e), this.applyMatrix4(zt), this;
  }
  rotateX(e) {
    return zt.makeRotationX(e), this.applyMatrix4(zt), this;
  }
  rotateY(e) {
    return zt.makeRotationY(e), this.applyMatrix4(zt), this;
  }
  rotateZ(e) {
    return zt.makeRotationZ(e), this.applyMatrix4(zt), this;
  }
  translate(e, n, i) {
    return zt.makeTranslation(e, n, i), this.applyMatrix4(zt), this;
  }
  scale(e, n, i) {
    return zt.makeScale(e, n, i), this.applyMatrix4(zt), this;
  }
  lookAt(e) {
    return ms.lookAt(e), ms.updateMatrix(), this.applyMatrix4(ms.matrix), this;
  }
  center() {
    return this.computeBoundingBox(), this.boundingBox.getCenter(fi).negate(), this.translate(fi.x, fi.y, fi.z), this;
  }
  setFromPoints(e) {
    const n = this.getAttribute("position");
    if (n === void 0) {
      const i = [];
      for (let r = 0, s = e.length; r < s; r++) {
        const a = e[r];
        i.push(a.x, a.y, a.z || 0);
      }
      this.setAttribute("position", new ft(i, 3));
    } else {
      for (let i = 0, r = n.count; i < r; i++) {
        const s = e[i];
        n.setXYZ(i, s.x, s.y, s.z || 0);
      }
      e.length > n.count && console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."), n.needsUpdate = !0;
    }
    return this;
  }
  computeBoundingBox() {
    this.boundingBox === null && (this.boundingBox = new Kn());
    const e = this.attributes.position, n = this.morphAttributes.position;
    if (e && e.isGLBufferAttribute) {
      console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.", this), this.boundingBox.set(
        new z(-1 / 0, -1 / 0, -1 / 0),
        new z(1 / 0, 1 / 0, 1 / 0)
      );
      return;
    }
    if (e !== void 0) {
      if (this.boundingBox.setFromBufferAttribute(e), n)
        for (let i = 0, r = n.length; i < r; i++) {
          const s = n[i];
          It.setFromBufferAttribute(s), this.morphTargetsRelative ? (pt.addVectors(this.boundingBox.min, It.min), this.boundingBox.expandByPoint(pt), pt.addVectors(this.boundingBox.max, It.max), this.boundingBox.expandByPoint(pt)) : (this.boundingBox.expandByPoint(It.min), this.boundingBox.expandByPoint(It.max));
        }
    } else
      this.boundingBox.makeEmpty();
    (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
  }
  computeBoundingSphere() {
    this.boundingSphere === null && (this.boundingSphere = new Jn());
    const e = this.attributes.position, n = this.morphAttributes.position;
    if (e && e.isGLBufferAttribute) {
      console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.", this), this.boundingSphere.set(new z(), 1 / 0);
      return;
    }
    if (e) {
      const i = this.boundingSphere.center;
      if (It.setFromBufferAttribute(e), n)
        for (let s = 0, a = n.length; s < a; s++) {
          const o = n[s];
          zi.setFromBufferAttribute(o), this.morphTargetsRelative ? (pt.addVectors(It.min, zi.min), It.expandByPoint(pt), pt.addVectors(It.max, zi.max), It.expandByPoint(pt)) : (It.expandByPoint(zi.min), It.expandByPoint(zi.max));
        }
      It.getCenter(i);
      let r = 0;
      for (let s = 0, a = e.count; s < a; s++)
        pt.fromBufferAttribute(e, s), r = Math.max(r, i.distanceToSquared(pt));
      if (n)
        for (let s = 0, a = n.length; s < a; s++) {
          const o = n[s], c = this.morphTargetsRelative;
          for (let l = 0, h = o.count; l < h; l++)
            pt.fromBufferAttribute(o, l), c && (fi.fromBufferAttribute(e, l), pt.add(fi)), r = Math.max(r, i.distanceToSquared(pt));
        }
      this.boundingSphere.radius = Math.sqrt(r), isNaN(this.boundingSphere.radius) && console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
    }
  }
  computeTangents() {
    const e = this.index, n = this.attributes;
    if (e === null || n.position === void 0 || n.normal === void 0 || n.uv === void 0) {
      console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
      return;
    }
    const i = n.position, r = n.normal, s = n.uv;
    this.hasAttribute("tangent") === !1 && this.setAttribute("tangent", new ht(new Float32Array(4 * i.count), 4));
    const a = this.getAttribute("tangent"), o = [], c = [];
    for (let R = 0; R < i.count; R++)
      o[R] = new z(), c[R] = new z();
    const l = new z(), h = new z(), f = new z(), d = new we(), u = new we(), g = new we(), _ = new z(), p = new z();
    function m(R, S, v) {
      l.fromBufferAttribute(i, R), h.fromBufferAttribute(i, S), f.fromBufferAttribute(i, v), d.fromBufferAttribute(s, R), u.fromBufferAttribute(s, S), g.fromBufferAttribute(s, v), h.sub(l), f.sub(l), u.sub(d), g.sub(d);
      const C = 1 / (u.x * g.y - g.x * u.y);
      isFinite(C) && (_.copy(h).multiplyScalar(g.y).addScaledVector(f, -u.y).multiplyScalar(C), p.copy(f).multiplyScalar(u.x).addScaledVector(h, -g.x).multiplyScalar(C), o[R].add(_), o[S].add(_), o[v].add(_), c[R].add(p), c[S].add(p), c[v].add(p));
    }
    let E = this.groups;
    E.length === 0 && (E = [{
      start: 0,
      count: e.count
    }]);
    for (let R = 0, S = E.length; R < S; ++R) {
      const v = E[R], C = v.start, F = v.count;
      for (let L = C, D = C + F; L < D; L += 3)
        m(
          e.getX(L + 0),
          e.getX(L + 1),
          e.getX(L + 2)
        );
    }
    const M = new z(), x = new z(), P = new z(), b = new z();
    function A(R) {
      P.fromBufferAttribute(r, R), b.copy(P);
      const S = o[R];
      M.copy(S), M.sub(P.multiplyScalar(P.dot(S))).normalize(), x.crossVectors(b, S);
      const C = x.dot(c[R]) < 0 ? -1 : 1;
      a.setXYZW(R, M.x, M.y, M.z, C);
    }
    for (let R = 0, S = E.length; R < S; ++R) {
      const v = E[R], C = v.start, F = v.count;
      for (let L = C, D = C + F; L < D; L += 3)
        A(e.getX(L + 0)), A(e.getX(L + 1)), A(e.getX(L + 2));
    }
  }
  computeVertexNormals() {
    const e = this.index, n = this.getAttribute("position");
    if (n !== void 0) {
      let i = this.getAttribute("normal");
      if (i === void 0)
        i = new ht(new Float32Array(n.count * 3), 3), this.setAttribute("normal", i);
      else
        for (let d = 0, u = i.count; d < u; d++)
          i.setXYZ(d, 0, 0, 0);
      const r = new z(), s = new z(), a = new z(), o = new z(), c = new z(), l = new z(), h = new z(), f = new z();
      if (e)
        for (let d = 0, u = e.count; d < u; d += 3) {
          const g = e.getX(d + 0), _ = e.getX(d + 1), p = e.getX(d + 2);
          r.fromBufferAttribute(n, g), s.fromBufferAttribute(n, _), a.fromBufferAttribute(n, p), h.subVectors(a, s), f.subVectors(r, s), h.cross(f), o.fromBufferAttribute(i, g), c.fromBufferAttribute(i, _), l.fromBufferAttribute(i, p), o.add(h), c.add(h), l.add(h), i.setXYZ(g, o.x, o.y, o.z), i.setXYZ(_, c.x, c.y, c.z), i.setXYZ(p, l.x, l.y, l.z);
        }
      else
        for (let d = 0, u = n.count; d < u; d += 3)
          r.fromBufferAttribute(n, d + 0), s.fromBufferAttribute(n, d + 1), a.fromBufferAttribute(n, d + 2), h.subVectors(a, s), f.subVectors(r, s), h.cross(f), i.setXYZ(d + 0, h.x, h.y, h.z), i.setXYZ(d + 1, h.x, h.y, h.z), i.setXYZ(d + 2, h.x, h.y, h.z);
      this.normalizeNormals(), i.needsUpdate = !0;
    }
  }
  normalizeNormals() {
    const e = this.attributes.normal;
    for (let n = 0, i = e.count; n < i; n++)
      pt.fromBufferAttribute(e, n), pt.normalize(), e.setXYZ(n, pt.x, pt.y, pt.z);
  }
  toNonIndexed() {
    function e(o, c) {
      const l = o.array, h = o.itemSize, f = o.normalized, d = new l.constructor(c.length * h);
      let u = 0, g = 0;
      for (let _ = 0, p = c.length; _ < p; _++) {
        o.isInterleavedBufferAttribute ? u = c[_] * o.data.stride + o.offset : u = c[_] * h;
        for (let m = 0; m < h; m++)
          d[g++] = l[u++];
      }
      return new ht(d, h, f);
    }
    if (this.index === null)
      return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."), this;
    const n = new _t(), i = this.index.array, r = this.attributes;
    for (const o in r) {
      const c = r[o], l = e(c, i);
      n.setAttribute(o, l);
    }
    const s = this.morphAttributes;
    for (const o in s) {
      const c = [], l = s[o];
      for (let h = 0, f = l.length; h < f; h++) {
        const d = l[h], u = e(d, i);
        c.push(u);
      }
      n.morphAttributes[o] = c;
    }
    n.morphTargetsRelative = this.morphTargetsRelative;
    const a = this.groups;
    for (let o = 0, c = a.length; o < c; o++) {
      const l = a[o];
      n.addGroup(l.start, l.count, l.materialIndex);
    }
    return n;
  }
  toJSON() {
    const e = {
      metadata: {
        version: 4.6,
        type: "BufferGeometry",
        generator: "BufferGeometry.toJSON"
      }
    };
    if (e.uuid = this.uuid, e.type = this.type, this.name !== "" && (e.name = this.name), Object.keys(this.userData).length > 0 && (e.userData = this.userData), this.parameters !== void 0) {
      const c = this.parameters;
      for (const l in c)
        c[l] !== void 0 && (e[l] = c[l]);
      return e;
    }
    e.data = { attributes: {} };
    const n = this.index;
    n !== null && (e.data.index = {
      type: n.array.constructor.name,
      array: Array.prototype.slice.call(n.array)
    });
    const i = this.attributes;
    for (const c in i) {
      const l = i[c];
      e.data.attributes[c] = l.toJSON(e.data);
    }
    const r = {};
    let s = !1;
    for (const c in this.morphAttributes) {
      const l = this.morphAttributes[c], h = [];
      for (let f = 0, d = l.length; f < d; f++) {
        const u = l[f];
        h.push(u.toJSON(e.data));
      }
      h.length > 0 && (r[c] = h, s = !0);
    }
    s && (e.data.morphAttributes = r, e.data.morphTargetsRelative = this.morphTargetsRelative);
    const a = this.groups;
    a.length > 0 && (e.data.groups = JSON.parse(JSON.stringify(a)));
    const o = this.boundingSphere;
    return o !== null && (e.data.boundingSphere = {
      center: o.center.toArray(),
      radius: o.radius
    }), e;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    this.index = null, this.attributes = {}, this.morphAttributes = {}, this.groups = [], this.boundingBox = null, this.boundingSphere = null;
    const n = {};
    this.name = e.name;
    const i = e.index;
    i !== null && this.setIndex(i.clone(n));
    const r = e.attributes;
    for (const l in r) {
      const h = r[l];
      this.setAttribute(l, h.clone(n));
    }
    const s = e.morphAttributes;
    for (const l in s) {
      const h = [], f = s[l];
      for (let d = 0, u = f.length; d < u; d++)
        h.push(f[d].clone(n));
      this.morphAttributes[l] = h;
    }
    this.morphTargetsRelative = e.morphTargetsRelative;
    const a = e.groups;
    for (let l = 0, h = a.length; l < h; l++) {
      const f = a[l];
      this.addGroup(f.start, f.count, f.materialIndex);
    }
    const o = e.boundingBox;
    o !== null && (this.boundingBox = o.clone());
    const c = e.boundingSphere;
    return c !== null && (this.boundingSphere = c.clone()), this.drawRange.start = e.drawRange.start, this.drawRange.count = e.drawRange.count, this.userData = e.userData, this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
const To = /* @__PURE__ */ new je(), Bn = /* @__PURE__ */ new Ki(), fr = /* @__PURE__ */ new Jn(), bo = /* @__PURE__ */ new z(), dr = /* @__PURE__ */ new z(), ur = /* @__PURE__ */ new z(), pr = /* @__PURE__ */ new z(), gs = /* @__PURE__ */ new z(), mr = /* @__PURE__ */ new z(), Ao = /* @__PURE__ */ new z(), gr = /* @__PURE__ */ new z();
class Ut extends gt {
  constructor(e = new _t(), n = new Ji()) {
    super(), this.isMesh = !0, this.type = "Mesh", this.geometry = e, this.material = n, this.updateMorphTargets();
  }
  copy(e, n) {
    return super.copy(e, n), e.morphTargetInfluences !== void 0 && (this.morphTargetInfluences = e.morphTargetInfluences.slice()), e.morphTargetDictionary !== void 0 && (this.morphTargetDictionary = Object.assign({}, e.morphTargetDictionary)), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
  }
  updateMorphTargets() {
    const n = this.geometry.morphAttributes, i = Object.keys(n);
    if (i.length > 0) {
      const r = n[i[0]];
      if (r !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let s = 0, a = r.length; s < a; s++) {
          const o = r[s].name || String(s);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = s;
        }
      }
    }
  }
  getVertexPosition(e, n) {
    const i = this.geometry, r = i.attributes.position, s = i.morphAttributes.position, a = i.morphTargetsRelative;
    n.fromBufferAttribute(r, e);
    const o = this.morphTargetInfluences;
    if (s && o) {
      mr.set(0, 0, 0);
      for (let c = 0, l = s.length; c < l; c++) {
        const h = o[c], f = s[c];
        h !== 0 && (gs.fromBufferAttribute(f, e), a ? mr.addScaledVector(gs, h) : mr.addScaledVector(gs.sub(n), h));
      }
      n.add(mr);
    }
    return n;
  }
  raycast(e, n) {
    const i = this.geometry, r = this.material, s = this.matrixWorld;
    r !== void 0 && (i.boundingSphere === null && i.computeBoundingSphere(), fr.copy(i.boundingSphere), fr.applyMatrix4(s), Bn.copy(e.ray).recast(e.near), !(fr.containsPoint(Bn.origin) === !1 && (Bn.intersectSphere(fr, bo) === null || Bn.origin.distanceToSquared(bo) > (e.far - e.near) ** 2)) && (To.copy(s).invert(), Bn.copy(e.ray).applyMatrix4(To), !(i.boundingBox !== null && Bn.intersectsBox(i.boundingBox) === !1) && this._computeIntersections(e, n, Bn)));
  }
  _computeIntersections(e, n, i) {
    let r;
    const s = this.geometry, a = this.material, o = s.index, c = s.attributes.position, l = s.attributes.uv, h = s.attributes.uv1, f = s.attributes.normal, d = s.groups, u = s.drawRange;
    if (o !== null)
      if (Array.isArray(a))
        for (let g = 0, _ = d.length; g < _; g++) {
          const p = d[g], m = a[p.materialIndex], E = Math.max(p.start, u.start), M = Math.min(o.count, Math.min(p.start + p.count, u.start + u.count));
          for (let x = E, P = M; x < P; x += 3) {
            const b = o.getX(x), A = o.getX(x + 1), R = o.getX(x + 2);
            r = _r(this, m, e, i, l, h, f, b, A, R), r && (r.faceIndex = Math.floor(x / 3), r.face.materialIndex = p.materialIndex, n.push(r));
          }
        }
      else {
        const g = Math.max(0, u.start), _ = Math.min(o.count, u.start + u.count);
        for (let p = g, m = _; p < m; p += 3) {
          const E = o.getX(p), M = o.getX(p + 1), x = o.getX(p + 2);
          r = _r(this, a, e, i, l, h, f, E, M, x), r && (r.faceIndex = Math.floor(p / 3), n.push(r));
        }
      }
    else if (c !== void 0)
      if (Array.isArray(a))
        for (let g = 0, _ = d.length; g < _; g++) {
          const p = d[g], m = a[p.materialIndex], E = Math.max(p.start, u.start), M = Math.min(c.count, Math.min(p.start + p.count, u.start + u.count));
          for (let x = E, P = M; x < P; x += 3) {
            const b = x, A = x + 1, R = x + 2;
            r = _r(this, m, e, i, l, h, f, b, A, R), r && (r.faceIndex = Math.floor(x / 3), r.face.materialIndex = p.materialIndex, n.push(r));
          }
        }
      else {
        const g = Math.max(0, u.start), _ = Math.min(c.count, u.start + u.count);
        for (let p = g, m = _; p < m; p += 3) {
          const E = p, M = p + 1, x = p + 2;
          r = _r(this, a, e, i, l, h, f, E, M, x), r && (r.faceIndex = Math.floor(p / 3), n.push(r));
        }
      }
  }
}
function ud(t, e, n, i, r, s, a, o) {
  let c;
  if (e.side === Pt ? c = i.intersectTriangle(a, s, r, !0, o) : c = i.intersectTriangle(r, s, a, e.side === In, o), c === null) return null;
  gr.copy(o), gr.applyMatrix4(t.matrixWorld);
  const l = n.ray.origin.distanceTo(gr);
  return l < n.near || l > n.far ? null : {
    distance: l,
    point: gr.clone(),
    object: t
  };
}
function _r(t, e, n, i, r, s, a, o, c, l) {
  t.getVertexPosition(o, dr), t.getVertexPosition(c, ur), t.getVertexPosition(l, pr);
  const h = ud(t, e, n, i, dr, ur, pr, Ao);
  if (h) {
    const f = new z();
    qt.getBarycoord(Ao, dr, ur, pr, f), r && (h.uv = qt.getInterpolatedAttribute(r, o, c, l, f, new we())), s && (h.uv1 = qt.getInterpolatedAttribute(s, o, c, l, f, new we())), a && (h.normal = qt.getInterpolatedAttribute(a, o, c, l, f, new z()), h.normal.dot(i.direction) > 0 && h.normal.multiplyScalar(-1));
    const d = {
      a: o,
      b: c,
      c: l,
      normal: new z(),
      materialIndex: 0
    };
    qt.getNormal(dr, ur, pr, d.normal), h.face = d, h.barycoord = f;
  }
  return h;
}
class Qn extends _t {
  constructor(e = 1, n = 1, i = 1, r = 1, s = 1, a = 1) {
    super(), this.type = "BoxGeometry", this.parameters = {
      width: e,
      height: n,
      depth: i,
      widthSegments: r,
      heightSegments: s,
      depthSegments: a
    };
    const o = this;
    r = Math.floor(r), s = Math.floor(s), a = Math.floor(a);
    const c = [], l = [], h = [], f = [];
    let d = 0, u = 0;
    g("z", "y", "x", -1, -1, i, n, e, a, s, 0), g("z", "y", "x", 1, -1, i, n, -e, a, s, 1), g("x", "z", "y", 1, 1, e, i, n, r, a, 2), g("x", "z", "y", 1, -1, e, i, -n, r, a, 3), g("x", "y", "z", 1, -1, e, n, i, r, s, 4), g("x", "y", "z", -1, -1, e, n, -i, r, s, 5), this.setIndex(c), this.setAttribute("position", new ft(l, 3)), this.setAttribute("normal", new ft(h, 3)), this.setAttribute("uv", new ft(f, 2));
    function g(_, p, m, E, M, x, P, b, A, R, S) {
      const v = x / A, C = P / R, F = x / 2, L = P / 2, D = b / 2, W = A + 1, V = R + 1;
      let K = 0, G = 0;
      const te = new z();
      for (let ae = 0; ae < V; ae++) {
        const de = ae * C - L;
        for (let Le = 0; Le < W; Le++) {
          const Xe = Le * v - F;
          te[_] = Xe * E, te[p] = de * M, te[m] = D, l.push(te.x, te.y, te.z), te[_] = 0, te[p] = 0, te[m] = b > 0 ? 1 : -1, h.push(te.x, te.y, te.z), f.push(Le / A), f.push(1 - ae / R), K += 1;
        }
      }
      for (let ae = 0; ae < R; ae++)
        for (let de = 0; de < A; de++) {
          const Le = d + de + W * ae, Xe = d + de + W * (ae + 1), q = d + (de + 1) + W * (ae + 1), Q = d + (de + 1) + W * ae;
          c.push(Le, Xe, Q), c.push(Xe, q, Q), G += 6;
        }
      o.addGroup(u, G, S), u += G, d += K;
    }
  }
  copy(e) {
    return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
  }
  static fromJSON(e) {
    return new Qn(e.width, e.height, e.depth, e.widthSegments, e.heightSegments, e.depthSegments);
  }
}
function Ri(t) {
  const e = {};
  for (const n in t) {
    e[n] = {};
    for (const i in t[n]) {
      const r = t[n][i];
      r && (r.isColor || r.isMatrix3 || r.isMatrix4 || r.isVector2 || r.isVector3 || r.isVector4 || r.isTexture || r.isQuaternion) ? r.isRenderTargetTexture ? (console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."), e[n][i] = null) : e[n][i] = r.clone() : Array.isArray(r) ? e[n][i] = r.slice() : e[n][i] = r;
    }
  }
  return e;
}
function Tt(t) {
  const e = {};
  for (let n = 0; n < t.length; n++) {
    const i = Ri(t[n]);
    for (const r in i)
      e[r] = i[r];
  }
  return e;
}
function pd(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t[n].clone());
  return e;
}
function $c(t) {
  const e = t.getRenderTarget();
  return e === null ? t.outputColorSpace : e.isXRRenderTarget === !0 ? e.texture.colorSpace : Ge.workingColorSpace;
}
const md = { clone: Ri, merge: Tt };
var gd = `void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`, _d = `void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;
class tn extends Pi {
  static get type() {
    return "ShaderMaterial";
  }
  constructor(e) {
    super(), this.isShaderMaterial = !0, this.defines = {}, this.uniforms = {}, this.uniformsGroups = [], this.vertexShader = gd, this.fragmentShader = _d, this.linewidth = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.fog = !1, this.lights = !1, this.clipping = !1, this.forceSinglePass = !0, this.extensions = {
      clipCullDistance: !1,
      // set to use vertex shader clipping
      multiDraw: !1
      // set to use vertex shader multi_draw / enable gl_DrawID
    }, this.defaultAttributeValues = {
      color: [1, 1, 1],
      uv: [0, 0],
      uv1: [0, 0]
    }, this.index0AttributeName = void 0, this.uniformsNeedUpdate = !1, this.glslVersion = null, e !== void 0 && this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.fragmentShader = e.fragmentShader, this.vertexShader = e.vertexShader, this.uniforms = Ri(e.uniforms), this.uniformsGroups = pd(e.uniformsGroups), this.defines = Object.assign({}, e.defines), this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.fog = e.fog, this.lights = e.lights, this.clipping = e.clipping, this.extensions = Object.assign({}, e.extensions), this.glslVersion = e.glslVersion, this;
  }
  toJSON(e) {
    const n = super.toJSON(e);
    n.glslVersion = this.glslVersion, n.uniforms = {};
    for (const r in this.uniforms) {
      const a = this.uniforms[r].value;
      a && a.isTexture ? n.uniforms[r] = {
        type: "t",
        value: a.toJSON(e).uuid
      } : a && a.isColor ? n.uniforms[r] = {
        type: "c",
        value: a.getHex()
      } : a && a.isVector2 ? n.uniforms[r] = {
        type: "v2",
        value: a.toArray()
      } : a && a.isVector3 ? n.uniforms[r] = {
        type: "v3",
        value: a.toArray()
      } : a && a.isVector4 ? n.uniforms[r] = {
        type: "v4",
        value: a.toArray()
      } : a && a.isMatrix3 ? n.uniforms[r] = {
        type: "m3",
        value: a.toArray()
      } : a && a.isMatrix4 ? n.uniforms[r] = {
        type: "m4",
        value: a.toArray()
      } : n.uniforms[r] = {
        value: a
      };
    }
    Object.keys(this.defines).length > 0 && (n.defines = this.defines), n.vertexShader = this.vertexShader, n.fragmentShader = this.fragmentShader, n.lights = this.lights, n.clipping = this.clipping;
    const i = {};
    for (const r in this.extensions)
      this.extensions[r] === !0 && (i[r] = !0);
    return Object.keys(i).length > 0 && (n.extensions = i), n;
  }
}
class Yc extends gt {
  constructor() {
    super(), this.isCamera = !0, this.type = "Camera", this.matrixWorldInverse = new je(), this.projectionMatrix = new je(), this.projectionMatrixInverse = new je(), this.coordinateSystem = un;
  }
  copy(e, n) {
    return super.copy(e, n), this.matrixWorldInverse.copy(e.matrixWorldInverse), this.projectionMatrix.copy(e.projectionMatrix), this.projectionMatrixInverse.copy(e.projectionMatrixInverse), this.coordinateSystem = e.coordinateSystem, this;
  }
  getWorldDirection(e) {
    return super.getWorldDirection(e).negate();
  }
  updateMatrixWorld(e) {
    super.updateMatrixWorld(e), this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  updateWorldMatrix(e, n) {
    super.updateWorldMatrix(e, n), this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const bn = /* @__PURE__ */ new z(), wo = /* @__PURE__ */ new we(), Ro = /* @__PURE__ */ new we();
class Ht extends Yc {
  constructor(e = 50, n = 1, i = 0.1, r = 2e3) {
    super(), this.isPerspectiveCamera = !0, this.type = "PerspectiveCamera", this.fov = e, this.zoom = 1, this.near = i, this.far = r, this.focus = 10, this.aspect = n, this.view = null, this.filmGauge = 35, this.filmOffset = 0, this.updateProjectionMatrix();
  }
  copy(e, n) {
    return super.copy(e, n), this.fov = e.fov, this.zoom = e.zoom, this.near = e.near, this.far = e.far, this.focus = e.focus, this.aspect = e.aspect, this.view = e.view === null ? null : Object.assign({}, e.view), this.filmGauge = e.filmGauge, this.filmOffset = e.filmOffset, this;
  }
  /**
   * Sets the FOV by focal length in respect to the current .filmGauge.
   *
   * The default film gauge is 35, so that the focal length can be specified for
   * a 35mm (full frame) camera.
   *
   * Values for focal length and film gauge must have the same unit.
   */
  setFocalLength(e) {
    const n = 0.5 * this.getFilmHeight() / e;
    this.fov = pa * 2 * Math.atan(n), this.updateProjectionMatrix();
  }
  /**
   * Calculates the focal length from the current .fov and .filmGauge.
   */
  getFocalLength() {
    const e = Math.tan(Ur * 0.5 * this.fov);
    return 0.5 * this.getFilmHeight() / e;
  }
  getEffectiveFOV() {
    return pa * 2 * Math.atan(
      Math.tan(Ur * 0.5 * this.fov) / this.zoom
    );
  }
  getFilmWidth() {
    return this.filmGauge * Math.min(this.aspect, 1);
  }
  getFilmHeight() {
    return this.filmGauge / Math.max(this.aspect, 1);
  }
  /**
   * Computes the 2D bounds of the camera's viewable rectangle at a given distance along the viewing direction.
   * Sets minTarget and maxTarget to the coordinates of the lower-left and upper-right corners of the view rectangle.
   */
  getViewBounds(e, n, i) {
    bn.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse), n.set(bn.x, bn.y).multiplyScalar(-e / bn.z), bn.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse), i.set(bn.x, bn.y).multiplyScalar(-e / bn.z);
  }
  /**
   * Computes the width and height of the camera's viewable rectangle at a given distance along the viewing direction.
   * Copies the result into the target Vector2, where x is width and y is height.
   */
  getViewSize(e, n) {
    return this.getViewBounds(e, wo, Ro), n.subVectors(Ro, wo);
  }
  /**
   * Sets an offset in a larger frustum. This is useful for multi-window or
   * multi-monitor/multi-machine setups.
   *
   * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
   * the monitors are in grid like this
   *
   *   +---+---+---+
   *   | A | B | C |
   *   +---+---+---+
   *   | D | E | F |
   *   +---+---+---+
   *
   * then for each monitor you would call it like this
   *
   *   const w = 1920;
   *   const h = 1080;
   *   const fullWidth = w * 3;
   *   const fullHeight = h * 2;
   *
   *   --A--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
   *   --B--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
   *   --C--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
   *   --D--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
   *   --E--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
   *   --F--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
   *
   *   Note there is no reason monitors have to be the same size or in a grid.
   */
  setViewOffset(e, n, i, r, s, a) {
    this.aspect = e / n, this.view === null && (this.view = {
      enabled: !0,
      fullWidth: 1,
      fullHeight: 1,
      offsetX: 0,
      offsetY: 0,
      width: 1,
      height: 1
    }), this.view.enabled = !0, this.view.fullWidth = e, this.view.fullHeight = n, this.view.offsetX = i, this.view.offsetY = r, this.view.width = s, this.view.height = a, this.updateProjectionMatrix();
  }
  clearViewOffset() {
    this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    const e = this.near;
    let n = e * Math.tan(Ur * 0.5 * this.fov) / this.zoom, i = 2 * n, r = this.aspect * i, s = -0.5 * r;
    const a = this.view;
    if (this.view !== null && this.view.enabled) {
      const c = a.fullWidth, l = a.fullHeight;
      s += a.offsetX * r / c, n -= a.offsetY * i / l, r *= a.width / c, i *= a.height / l;
    }
    const o = this.filmOffset;
    o !== 0 && (s += e * o / this.getFilmWidth()), this.projectionMatrix.makePerspective(s, s + r, n, n - i, e, this.far, this.coordinateSystem), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(e) {
    const n = super.toJSON(e);
    return n.object.fov = this.fov, n.object.zoom = this.zoom, n.object.near = this.near, n.object.far = this.far, n.object.focus = this.focus, n.object.aspect = this.aspect, this.view !== null && (n.object.view = Object.assign({}, this.view)), n.object.filmGauge = this.filmGauge, n.object.filmOffset = this.filmOffset, n;
  }
}
const di = -90, ui = 1;
class vd extends gt {
  constructor(e, n, i) {
    super(), this.type = "CubeCamera", this.renderTarget = i, this.coordinateSystem = null, this.activeMipmapLevel = 0;
    const r = new Ht(di, ui, e, n);
    r.layers = this.layers, this.add(r);
    const s = new Ht(di, ui, e, n);
    s.layers = this.layers, this.add(s);
    const a = new Ht(di, ui, e, n);
    a.layers = this.layers, this.add(a);
    const o = new Ht(di, ui, e, n);
    o.layers = this.layers, this.add(o);
    const c = new Ht(di, ui, e, n);
    c.layers = this.layers, this.add(c);
    const l = new Ht(di, ui, e, n);
    l.layers = this.layers, this.add(l);
  }
  updateCoordinateSystem() {
    const e = this.coordinateSystem, n = this.children.concat(), [i, r, s, a, o, c] = n;
    for (const l of n) this.remove(l);
    if (e === un)
      i.up.set(0, 1, 0), i.lookAt(1, 0, 0), r.up.set(0, 1, 0), r.lookAt(-1, 0, 0), s.up.set(0, 0, -1), s.lookAt(0, 1, 0), a.up.set(0, 0, 1), a.lookAt(0, -1, 0), o.up.set(0, 1, 0), o.lookAt(0, 0, 1), c.up.set(0, 1, 0), c.lookAt(0, 0, -1);
    else if (e === zr)
      i.up.set(0, -1, 0), i.lookAt(-1, 0, 0), r.up.set(0, -1, 0), r.lookAt(1, 0, 0), s.up.set(0, 0, 1), s.lookAt(0, 1, 0), a.up.set(0, 0, -1), a.lookAt(0, -1, 0), o.up.set(0, -1, 0), o.lookAt(0, 0, 1), c.up.set(0, -1, 0), c.lookAt(0, 0, -1);
    else
      throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " + e);
    for (const l of n)
      this.add(l), l.updateMatrixWorld();
  }
  update(e, n) {
    this.parent === null && this.updateMatrixWorld();
    const { renderTarget: i, activeMipmapLevel: r } = this;
    this.coordinateSystem !== e.coordinateSystem && (this.coordinateSystem = e.coordinateSystem, this.updateCoordinateSystem());
    const [s, a, o, c, l, h] = this.children, f = e.getRenderTarget(), d = e.getActiveCubeFace(), u = e.getActiveMipmapLevel(), g = e.xr.enabled;
    e.xr.enabled = !1;
    const _ = i.texture.generateMipmaps;
    i.texture.generateMipmaps = !1, e.setRenderTarget(i, 0, r), e.render(n, s), e.setRenderTarget(i, 1, r), e.render(n, a), e.setRenderTarget(i, 2, r), e.render(n, o), e.setRenderTarget(i, 3, r), e.render(n, c), e.setRenderTarget(i, 4, r), e.render(n, l), i.texture.generateMipmaps = _, e.setRenderTarget(i, 5, r), e.render(n, h), e.setRenderTarget(f, d, u), e.xr.enabled = g, i.texture.needsPMREMUpdate = !0;
  }
}
class jc extends St {
  constructor(e, n, i, r, s, a, o, c, l, h) {
    e = e !== void 0 ? e : [], n = n !== void 0 ? n : Ti, super(e, n, i, r, s, a, o, c, l, h), this.isCubeTexture = !0, this.flipY = !1;
  }
  get images() {
    return this.image;
  }
  set images(e) {
    this.image = e;
  }
}
class xd extends jn {
  constructor(e = 1, n = {}) {
    super(e, e, n), this.isWebGLCubeRenderTarget = !0;
    const i = { width: e, height: e, depth: 1 }, r = [i, i, i, i, i, i];
    this.texture = new jc(r, n.mapping, n.wrapS, n.wrapT, n.magFilter, n.minFilter, n.format, n.type, n.anisotropy, n.colorSpace), this.texture.isRenderTargetTexture = !0, this.texture.generateMipmaps = n.generateMipmaps !== void 0 ? n.generateMipmaps : !1, this.texture.minFilter = n.minFilter !== void 0 ? n.minFilter : Jt;
  }
  fromEquirectangularTexture(e, n) {
    this.texture.type = n.type, this.texture.colorSpace = n.colorSpace, this.texture.generateMipmaps = n.generateMipmaps, this.texture.minFilter = n.minFilter, this.texture.magFilter = n.magFilter;
    const i = {
      uniforms: {
        tEquirect: { value: null }
      },
      vertexShader: (
        /* glsl */
        `

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`
      ),
      fragmentShader: (
        /* glsl */
        `

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`
      )
    }, r = new Qn(5, 5, 5), s = new tn({
      name: "CubemapFromEquirect",
      uniforms: Ri(i.uniforms),
      vertexShader: i.vertexShader,
      fragmentShader: i.fragmentShader,
      side: Pt,
      blending: Dn
    });
    s.uniforms.tEquirect.value = n;
    const a = new Ut(r, s), o = n.minFilter;
    return n.minFilter === $n && (n.minFilter = Jt), new vd(1, 10, this).update(e, a), n.minFilter = o, a.geometry.dispose(), a.material.dispose(), this;
  }
  clear(e, n, i, r) {
    const s = e.getRenderTarget();
    for (let a = 0; a < 6; a++)
      e.setRenderTarget(this, a), e.clear(n, i, r);
    e.setRenderTarget(s);
  }
}
const _s = /* @__PURE__ */ new z(), Md = /* @__PURE__ */ new z(), yd = /* @__PURE__ */ new De();
class dn {
  constructor(e = new z(1, 0, 0), n = 0) {
    this.isPlane = !0, this.normal = e, this.constant = n;
  }
  set(e, n) {
    return this.normal.copy(e), this.constant = n, this;
  }
  setComponents(e, n, i, r) {
    return this.normal.set(e, n, i), this.constant = r, this;
  }
  setFromNormalAndCoplanarPoint(e, n) {
    return this.normal.copy(e), this.constant = -n.dot(this.normal), this;
  }
  setFromCoplanarPoints(e, n, i) {
    const r = _s.subVectors(i, n).cross(Md.subVectors(e, n)).normalize();
    return this.setFromNormalAndCoplanarPoint(r, e), this;
  }
  copy(e) {
    return this.normal.copy(e.normal), this.constant = e.constant, this;
  }
  normalize() {
    const e = 1 / this.normal.length();
    return this.normal.multiplyScalar(e), this.constant *= e, this;
  }
  negate() {
    return this.constant *= -1, this.normal.negate(), this;
  }
  distanceToPoint(e) {
    return this.normal.dot(e) + this.constant;
  }
  distanceToSphere(e) {
    return this.distanceToPoint(e.center) - e.radius;
  }
  projectPoint(e, n) {
    return n.copy(e).addScaledVector(this.normal, -this.distanceToPoint(e));
  }
  intersectLine(e, n) {
    const i = e.delta(_s), r = this.normal.dot(i);
    if (r === 0)
      return this.distanceToPoint(e.start) === 0 ? n.copy(e.start) : null;
    const s = -(e.start.dot(this.normal) + this.constant) / r;
    return s < 0 || s > 1 ? null : n.copy(e.start).addScaledVector(i, s);
  }
  intersectsLine(e) {
    const n = this.distanceToPoint(e.start), i = this.distanceToPoint(e.end);
    return n < 0 && i > 0 || i < 0 && n > 0;
  }
  intersectsBox(e) {
    return e.intersectsPlane(this);
  }
  intersectsSphere(e) {
    return e.intersectsPlane(this);
  }
  coplanarPoint(e) {
    return e.copy(this.normal).multiplyScalar(-this.constant);
  }
  applyMatrix4(e, n) {
    const i = n || yd.getNormalMatrix(e), r = this.coplanarPoint(_s).applyMatrix4(e), s = this.normal.applyMatrix3(i).normalize();
    return this.constant = -r.dot(s), this;
  }
  translate(e) {
    return this.constant -= e.dot(this.normal), this;
  }
  equals(e) {
    return e.normal.equals(this.normal) && e.constant === this.constant;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const Hn = /* @__PURE__ */ new Jn(), vr = /* @__PURE__ */ new z();
class Pa {
  constructor(e = new dn(), n = new dn(), i = new dn(), r = new dn(), s = new dn(), a = new dn()) {
    this.planes = [e, n, i, r, s, a];
  }
  set(e, n, i, r, s, a) {
    const o = this.planes;
    return o[0].copy(e), o[1].copy(n), o[2].copy(i), o[3].copy(r), o[4].copy(s), o[5].copy(a), this;
  }
  copy(e) {
    const n = this.planes;
    for (let i = 0; i < 6; i++)
      n[i].copy(e.planes[i]);
    return this;
  }
  setFromProjectionMatrix(e, n = un) {
    const i = this.planes, r = e.elements, s = r[0], a = r[1], o = r[2], c = r[3], l = r[4], h = r[5], f = r[6], d = r[7], u = r[8], g = r[9], _ = r[10], p = r[11], m = r[12], E = r[13], M = r[14], x = r[15];
    if (i[0].setComponents(c - s, d - l, p - u, x - m).normalize(), i[1].setComponents(c + s, d + l, p + u, x + m).normalize(), i[2].setComponents(c + a, d + h, p + g, x + E).normalize(), i[3].setComponents(c - a, d - h, p - g, x - E).normalize(), i[4].setComponents(c - o, d - f, p - _, x - M).normalize(), n === un)
      i[5].setComponents(c + o, d + f, p + _, x + M).normalize();
    else if (n === zr)
      i[5].setComponents(o, f, _, M).normalize();
    else
      throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " + n);
    return this;
  }
  intersectsObject(e) {
    if (e.boundingSphere !== void 0)
      e.boundingSphere === null && e.computeBoundingSphere(), Hn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);
    else {
      const n = e.geometry;
      n.boundingSphere === null && n.computeBoundingSphere(), Hn.copy(n.boundingSphere).applyMatrix4(e.matrixWorld);
    }
    return this.intersectsSphere(Hn);
  }
  intersectsSprite(e) {
    return Hn.center.set(0, 0, 0), Hn.radius = 0.7071067811865476, Hn.applyMatrix4(e.matrixWorld), this.intersectsSphere(Hn);
  }
  intersectsSphere(e) {
    const n = this.planes, i = e.center, r = -e.radius;
    for (let s = 0; s < 6; s++)
      if (n[s].distanceToPoint(i) < r)
        return !1;
    return !0;
  }
  intersectsBox(e) {
    const n = this.planes;
    for (let i = 0; i < 6; i++) {
      const r = n[i];
      if (vr.x = r.normal.x > 0 ? e.max.x : e.min.x, vr.y = r.normal.y > 0 ? e.max.y : e.min.y, vr.z = r.normal.z > 0 ? e.max.z : e.min.z, r.distanceToPoint(vr) < 0)
        return !1;
    }
    return !0;
  }
  containsPoint(e) {
    const n = this.planes;
    for (let i = 0; i < 6; i++)
      if (n[i].distanceToPoint(e) < 0)
        return !1;
    return !0;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
function Zc() {
  let t = null, e = !1, n = null, i = null;
  function r(s, a) {
    n(s, a), i = t.requestAnimationFrame(r);
  }
  return {
    start: function() {
      e !== !0 && n !== null && (i = t.requestAnimationFrame(r), e = !0);
    },
    stop: function() {
      t.cancelAnimationFrame(i), e = !1;
    },
    setAnimationLoop: function(s) {
      n = s;
    },
    setContext: function(s) {
      t = s;
    }
  };
}
function Sd(t) {
  const e = /* @__PURE__ */ new WeakMap();
  function n(o, c) {
    const l = o.array, h = o.usage, f = l.byteLength, d = t.createBuffer();
    t.bindBuffer(c, d), t.bufferData(c, l, h), o.onUploadCallback();
    let u;
    if (l instanceof Float32Array)
      u = t.FLOAT;
    else if (l instanceof Uint16Array)
      o.isFloat16BufferAttribute ? u = t.HALF_FLOAT : u = t.UNSIGNED_SHORT;
    else if (l instanceof Int16Array)
      u = t.SHORT;
    else if (l instanceof Uint32Array)
      u = t.UNSIGNED_INT;
    else if (l instanceof Int32Array)
      u = t.INT;
    else if (l instanceof Int8Array)
      u = t.BYTE;
    else if (l instanceof Uint8Array)
      u = t.UNSIGNED_BYTE;
    else if (l instanceof Uint8ClampedArray)
      u = t.UNSIGNED_BYTE;
    else
      throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: " + l);
    return {
      buffer: d,
      type: u,
      bytesPerElement: l.BYTES_PER_ELEMENT,
      version: o.version,
      size: f
    };
  }
  function i(o, c, l) {
    const h = c.array, f = c.updateRanges;
    if (t.bindBuffer(l, o), f.length === 0)
      t.bufferSubData(l, 0, h);
    else {
      f.sort((u, g) => u.start - g.start);
      let d = 0;
      for (let u = 1; u < f.length; u++) {
        const g = f[d], _ = f[u];
        _.start <= g.start + g.count + 1 ? g.count = Math.max(
          g.count,
          _.start + _.count - g.start
        ) : (++d, f[d] = _);
      }
      f.length = d + 1;
      for (let u = 0, g = f.length; u < g; u++) {
        const _ = f[u];
        t.bufferSubData(
          l,
          _.start * h.BYTES_PER_ELEMENT,
          h,
          _.start,
          _.count
        );
      }
      c.clearUpdateRanges();
    }
    c.onUploadCallback();
  }
  function r(o) {
    return o.isInterleavedBufferAttribute && (o = o.data), e.get(o);
  }
  function s(o) {
    o.isInterleavedBufferAttribute && (o = o.data);
    const c = e.get(o);
    c && (t.deleteBuffer(c.buffer), e.delete(o));
  }
  function a(o, c) {
    if (o.isInterleavedBufferAttribute && (o = o.data), o.isGLBufferAttribute) {
      const h = e.get(o);
      (!h || h.version < o.version) && e.set(o, {
        buffer: o.buffer,
        type: o.type,
        bytesPerElement: o.elementSize,
        version: o.version
      });
      return;
    }
    const l = e.get(o);
    if (l === void 0)
      e.set(o, n(o, c));
    else if (l.version < o.version) {
      if (l.size !== o.array.byteLength)
        throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");
      i(l.buffer, o, c), l.version = o.version;
    }
  }
  return {
    get: r,
    remove: s,
    update: a
  };
}
class Wr extends _t {
  constructor(e = 1, n = 1, i = 1, r = 1) {
    super(), this.type = "PlaneGeometry", this.parameters = {
      width: e,
      height: n,
      widthSegments: i,
      heightSegments: r
    };
    const s = e / 2, a = n / 2, o = Math.floor(i), c = Math.floor(r), l = o + 1, h = c + 1, f = e / o, d = n / c, u = [], g = [], _ = [], p = [];
    for (let m = 0; m < h; m++) {
      const E = m * d - a;
      for (let M = 0; M < l; M++) {
        const x = M * f - s;
        g.push(x, -E, 0), _.push(0, 0, 1), p.push(M / o), p.push(1 - m / c);
      }
    }
    for (let m = 0; m < c; m++)
      for (let E = 0; E < o; E++) {
        const M = E + l * m, x = E + l * (m + 1), P = E + 1 + l * (m + 1), b = E + 1 + l * m;
        u.push(M, x, b), u.push(x, P, b);
      }
    this.setIndex(u), this.setAttribute("position", new ft(g, 3)), this.setAttribute("normal", new ft(_, 3)), this.setAttribute("uv", new ft(p, 2));
  }
  copy(e) {
    return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
  }
  static fromJSON(e) {
    return new Wr(e.width, e.height, e.widthSegments, e.heightSegments);
  }
}
var Ed = `#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`, Td = `#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`, bd = `#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`, Ad = `#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, wd = `#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`, Rd = `#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`, Cd = `#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`, Pd = `#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`, Dd = `#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`, Ld = `#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`, Id = `vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`, Ud = `vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`, Nd = `float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`, Fd = `#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`, Od = `#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`, zd = `#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`, Bd = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`, Hd = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`, kd = `#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`, Vd = `#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`, Gd = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`, Wd = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`, Xd = `#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`, qd = `#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`, $d = `#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`, Yd = `vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`, jd = `#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`, Zd = `#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`, Kd = `#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`, Jd = `#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`, Qd = "gl_FragColor = linearToOutputTexel( gl_FragColor );", eu = `vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`, tu = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`, nu = `#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`, iu = `#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`, ru = `#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`, su = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`, au = `#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`, ou = `#ifdef USE_FOG
	varying float vFogDepth;
#endif`, cu = `#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`, lu = `#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`, hu = `#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`, fu = `#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`, du = `LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`, uu = `varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`, pu = `uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`, mu = `#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`, gu = `ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`, _u = `varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`, vu = `BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`, xu = `varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`, Mu = `PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`, yu = `struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`, Su = `
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`, Eu = `#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`, Tu = `#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`, bu = `#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`, Au = `#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, wu = `#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, Ru = `#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`, Cu = `#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`, Pu = `#ifdef USE_MAP
	uniform sampler2D map;
#endif`, Du = `#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`, Lu = `#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, Iu = `float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`, Uu = `#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`, Nu = `#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`, Fu = `#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`, Ou = `#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`, zu = `#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`, Bu = `#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`, Hu = `float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`, ku = `#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`, Vu = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, Gu = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, Wu = `#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`, Xu = `#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`, qu = `#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`, $u = `#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`, Yu = `#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`, ju = `#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`, Zu = `#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`, Ku = `vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`, Ju = `#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`, Qu = `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`, ep = `#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`, tp = `#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`, np = `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`, ip = `#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`, rp = `#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`, sp = `#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`, ap = `#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`, op = `float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`, cp = `#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`, lp = `#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`, hp = `#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`, fp = `#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`, dp = `float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`, up = `#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`, pp = `#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`, mp = `#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`, gp = `#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`, _p = `#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`, vp = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, xp = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, Mp = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`, yp = `#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;
const Sp = `varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`, Ep = `uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Tp = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, bp = `#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Ap = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, wp = `uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Rp = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`, Cp = `#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`, Pp = `#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`, Dp = `#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`, Lp = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`, Ip = `uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Up = `uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, Np = `uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, Fp = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`, Op = `uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, zp = `#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, Bp = `#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Hp = `#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`, kp = `#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Vp = `#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`, Gp = `#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`, Wp = `#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, Xp = `#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, qp = `#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`, $p = `#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Yp = `#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, jp = `#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Zp = `uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`, Kp = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, Jp = `#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, Qp = `uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, em = `uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, tm = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, Ue = {
  alphahash_fragment: Ed,
  alphahash_pars_fragment: Td,
  alphamap_fragment: bd,
  alphamap_pars_fragment: Ad,
  alphatest_fragment: wd,
  alphatest_pars_fragment: Rd,
  aomap_fragment: Cd,
  aomap_pars_fragment: Pd,
  batching_pars_vertex: Dd,
  batching_vertex: Ld,
  begin_vertex: Id,
  beginnormal_vertex: Ud,
  bsdfs: Nd,
  iridescence_fragment: Fd,
  bumpmap_pars_fragment: Od,
  clipping_planes_fragment: zd,
  clipping_planes_pars_fragment: Bd,
  clipping_planes_pars_vertex: Hd,
  clipping_planes_vertex: kd,
  color_fragment: Vd,
  color_pars_fragment: Gd,
  color_pars_vertex: Wd,
  color_vertex: Xd,
  common: qd,
  cube_uv_reflection_fragment: $d,
  defaultnormal_vertex: Yd,
  displacementmap_pars_vertex: jd,
  displacementmap_vertex: Zd,
  emissivemap_fragment: Kd,
  emissivemap_pars_fragment: Jd,
  colorspace_fragment: Qd,
  colorspace_pars_fragment: eu,
  envmap_fragment: tu,
  envmap_common_pars_fragment: nu,
  envmap_pars_fragment: iu,
  envmap_pars_vertex: ru,
  envmap_physical_pars_fragment: mu,
  envmap_vertex: su,
  fog_vertex: au,
  fog_pars_vertex: ou,
  fog_fragment: cu,
  fog_pars_fragment: lu,
  gradientmap_pars_fragment: hu,
  lightmap_pars_fragment: fu,
  lights_lambert_fragment: du,
  lights_lambert_pars_fragment: uu,
  lights_pars_begin: pu,
  lights_toon_fragment: gu,
  lights_toon_pars_fragment: _u,
  lights_phong_fragment: vu,
  lights_phong_pars_fragment: xu,
  lights_physical_fragment: Mu,
  lights_physical_pars_fragment: yu,
  lights_fragment_begin: Su,
  lights_fragment_maps: Eu,
  lights_fragment_end: Tu,
  logdepthbuf_fragment: bu,
  logdepthbuf_pars_fragment: Au,
  logdepthbuf_pars_vertex: wu,
  logdepthbuf_vertex: Ru,
  map_fragment: Cu,
  map_pars_fragment: Pu,
  map_particle_fragment: Du,
  map_particle_pars_fragment: Lu,
  metalnessmap_fragment: Iu,
  metalnessmap_pars_fragment: Uu,
  morphinstance_vertex: Nu,
  morphcolor_vertex: Fu,
  morphnormal_vertex: Ou,
  morphtarget_pars_vertex: zu,
  morphtarget_vertex: Bu,
  normal_fragment_begin: Hu,
  normal_fragment_maps: ku,
  normal_pars_fragment: Vu,
  normal_pars_vertex: Gu,
  normal_vertex: Wu,
  normalmap_pars_fragment: Xu,
  clearcoat_normal_fragment_begin: qu,
  clearcoat_normal_fragment_maps: $u,
  clearcoat_pars_fragment: Yu,
  iridescence_pars_fragment: ju,
  opaque_fragment: Zu,
  packing: Ku,
  premultiplied_alpha_fragment: Ju,
  project_vertex: Qu,
  dithering_fragment: ep,
  dithering_pars_fragment: tp,
  roughnessmap_fragment: np,
  roughnessmap_pars_fragment: ip,
  shadowmap_pars_fragment: rp,
  shadowmap_pars_vertex: sp,
  shadowmap_vertex: ap,
  shadowmask_pars_fragment: op,
  skinbase_vertex: cp,
  skinning_pars_vertex: lp,
  skinning_vertex: hp,
  skinnormal_vertex: fp,
  specularmap_fragment: dp,
  specularmap_pars_fragment: up,
  tonemapping_fragment: pp,
  tonemapping_pars_fragment: mp,
  transmission_fragment: gp,
  transmission_pars_fragment: _p,
  uv_pars_fragment: vp,
  uv_pars_vertex: xp,
  uv_vertex: Mp,
  worldpos_vertex: yp,
  background_vert: Sp,
  background_frag: Ep,
  backgroundCube_vert: Tp,
  backgroundCube_frag: bp,
  cube_vert: Ap,
  cube_frag: wp,
  depth_vert: Rp,
  depth_frag: Cp,
  distanceRGBA_vert: Pp,
  distanceRGBA_frag: Dp,
  equirect_vert: Lp,
  equirect_frag: Ip,
  linedashed_vert: Up,
  linedashed_frag: Np,
  meshbasic_vert: Fp,
  meshbasic_frag: Op,
  meshlambert_vert: zp,
  meshlambert_frag: Bp,
  meshmatcap_vert: Hp,
  meshmatcap_frag: kp,
  meshnormal_vert: Vp,
  meshnormal_frag: Gp,
  meshphong_vert: Wp,
  meshphong_frag: Xp,
  meshphysical_vert: qp,
  meshphysical_frag: $p,
  meshtoon_vert: Yp,
  meshtoon_frag: jp,
  points_vert: Zp,
  points_frag: Kp,
  shadow_vert: Jp,
  shadow_frag: Qp,
  sprite_vert: em,
  sprite_frag: tm
}, ne = {
  common: {
    diffuse: { value: /* @__PURE__ */ new Oe(16777215) },
    opacity: { value: 1 },
    map: { value: null },
    mapTransform: { value: /* @__PURE__ */ new De() },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new De() },
    alphaTest: { value: 0 }
  },
  specularmap: {
    specularMap: { value: null },
    specularMapTransform: { value: /* @__PURE__ */ new De() }
  },
  envmap: {
    envMap: { value: null },
    envMapRotation: { value: /* @__PURE__ */ new De() },
    flipEnvMap: { value: -1 },
    reflectivity: { value: 1 },
    // basic, lambert, phong
    ior: { value: 1.5 },
    // physical
    refractionRatio: { value: 0.98 }
    // basic, lambert, phong
  },
  aomap: {
    aoMap: { value: null },
    aoMapIntensity: { value: 1 },
    aoMapTransform: { value: /* @__PURE__ */ new De() }
  },
  lightmap: {
    lightMap: { value: null },
    lightMapIntensity: { value: 1 },
    lightMapTransform: { value: /* @__PURE__ */ new De() }
  },
  bumpmap: {
    bumpMap: { value: null },
    bumpMapTransform: { value: /* @__PURE__ */ new De() },
    bumpScale: { value: 1 }
  },
  normalmap: {
    normalMap: { value: null },
    normalMapTransform: { value: /* @__PURE__ */ new De() },
    normalScale: { value: /* @__PURE__ */ new we(1, 1) }
  },
  displacementmap: {
    displacementMap: { value: null },
    displacementMapTransform: { value: /* @__PURE__ */ new De() },
    displacementScale: { value: 1 },
    displacementBias: { value: 0 }
  },
  emissivemap: {
    emissiveMap: { value: null },
    emissiveMapTransform: { value: /* @__PURE__ */ new De() }
  },
  metalnessmap: {
    metalnessMap: { value: null },
    metalnessMapTransform: { value: /* @__PURE__ */ new De() }
  },
  roughnessmap: {
    roughnessMap: { value: null },
    roughnessMapTransform: { value: /* @__PURE__ */ new De() }
  },
  gradientmap: {
    gradientMap: { value: null }
  },
  fog: {
    fogDensity: { value: 25e-5 },
    fogNear: { value: 1 },
    fogFar: { value: 2e3 },
    fogColor: { value: /* @__PURE__ */ new Oe(16777215) }
  },
  lights: {
    ambientLightColor: { value: [] },
    lightProbe: { value: [] },
    directionalLights: { value: [], properties: {
      direction: {},
      color: {}
    } },
    directionalLightShadows: { value: [], properties: {
      shadowIntensity: 1,
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {}
    } },
    directionalShadowMap: { value: [] },
    directionalShadowMatrix: { value: [] },
    spotLights: { value: [], properties: {
      color: {},
      position: {},
      direction: {},
      distance: {},
      coneCos: {},
      penumbraCos: {},
      decay: {}
    } },
    spotLightShadows: { value: [], properties: {
      shadowIntensity: 1,
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {}
    } },
    spotLightMap: { value: [] },
    spotShadowMap: { value: [] },
    spotLightMatrix: { value: [] },
    pointLights: { value: [], properties: {
      color: {},
      position: {},
      decay: {},
      distance: {}
    } },
    pointLightShadows: { value: [], properties: {
      shadowIntensity: 1,
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {},
      shadowCameraNear: {},
      shadowCameraFar: {}
    } },
    pointShadowMap: { value: [] },
    pointShadowMatrix: { value: [] },
    hemisphereLights: { value: [], properties: {
      direction: {},
      skyColor: {},
      groundColor: {}
    } },
    // TODO (abelnation): RectAreaLight BRDF data needs to be moved from example to main src
    rectAreaLights: { value: [], properties: {
      color: {},
      position: {},
      width: {},
      height: {}
    } },
    ltc_1: { value: null },
    ltc_2: { value: null }
  },
  points: {
    diffuse: { value: /* @__PURE__ */ new Oe(16777215) },
    opacity: { value: 1 },
    size: { value: 1 },
    scale: { value: 1 },
    map: { value: null },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new De() },
    alphaTest: { value: 0 },
    uvTransform: { value: /* @__PURE__ */ new De() }
  },
  sprite: {
    diffuse: { value: /* @__PURE__ */ new Oe(16777215) },
    opacity: { value: 1 },
    center: { value: /* @__PURE__ */ new we(0.5, 0.5) },
    rotation: { value: 0 },
    map: { value: null },
    mapTransform: { value: /* @__PURE__ */ new De() },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new De() },
    alphaTest: { value: 0 }
  }
}, Zt = {
  basic: {
    uniforms: /* @__PURE__ */ Tt([
      ne.common,
      ne.specularmap,
      ne.envmap,
      ne.aomap,
      ne.lightmap,
      ne.fog
    ]),
    vertexShader: Ue.meshbasic_vert,
    fragmentShader: Ue.meshbasic_frag
  },
  lambert: {
    uniforms: /* @__PURE__ */ Tt([
      ne.common,
      ne.specularmap,
      ne.envmap,
      ne.aomap,
      ne.lightmap,
      ne.emissivemap,
      ne.bumpmap,
      ne.normalmap,
      ne.displacementmap,
      ne.fog,
      ne.lights,
      {
        emissive: { value: /* @__PURE__ */ new Oe(0) }
      }
    ]),
    vertexShader: Ue.meshlambert_vert,
    fragmentShader: Ue.meshlambert_frag
  },
  phong: {
    uniforms: /* @__PURE__ */ Tt([
      ne.common,
      ne.specularmap,
      ne.envmap,
      ne.aomap,
      ne.lightmap,
      ne.emissivemap,
      ne.bumpmap,
      ne.normalmap,
      ne.displacementmap,
      ne.fog,
      ne.lights,
      {
        emissive: { value: /* @__PURE__ */ new Oe(0) },
        specular: { value: /* @__PURE__ */ new Oe(1118481) },
        shininess: { value: 30 }
      }
    ]),
    vertexShader: Ue.meshphong_vert,
    fragmentShader: Ue.meshphong_frag
  },
  standard: {
    uniforms: /* @__PURE__ */ Tt([
      ne.common,
      ne.envmap,
      ne.aomap,
      ne.lightmap,
      ne.emissivemap,
      ne.bumpmap,
      ne.normalmap,
      ne.displacementmap,
      ne.roughnessmap,
      ne.metalnessmap,
      ne.fog,
      ne.lights,
      {
        emissive: { value: /* @__PURE__ */ new Oe(0) },
        roughness: { value: 1 },
        metalness: { value: 0 },
        envMapIntensity: { value: 1 }
      }
    ]),
    vertexShader: Ue.meshphysical_vert,
    fragmentShader: Ue.meshphysical_frag
  },
  toon: {
    uniforms: /* @__PURE__ */ Tt([
      ne.common,
      ne.aomap,
      ne.lightmap,
      ne.emissivemap,
      ne.bumpmap,
      ne.normalmap,
      ne.displacementmap,
      ne.gradientmap,
      ne.fog,
      ne.lights,
      {
        emissive: { value: /* @__PURE__ */ new Oe(0) }
      }
    ]),
    vertexShader: Ue.meshtoon_vert,
    fragmentShader: Ue.meshtoon_frag
  },
  matcap: {
    uniforms: /* @__PURE__ */ Tt([
      ne.common,
      ne.bumpmap,
      ne.normalmap,
      ne.displacementmap,
      ne.fog,
      {
        matcap: { value: null }
      }
    ]),
    vertexShader: Ue.meshmatcap_vert,
    fragmentShader: Ue.meshmatcap_frag
  },
  points: {
    uniforms: /* @__PURE__ */ Tt([
      ne.points,
      ne.fog
    ]),
    vertexShader: Ue.points_vert,
    fragmentShader: Ue.points_frag
  },
  dashed: {
    uniforms: /* @__PURE__ */ Tt([
      ne.common,
      ne.fog,
      {
        scale: { value: 1 },
        dashSize: { value: 1 },
        totalSize: { value: 2 }
      }
    ]),
    vertexShader: Ue.linedashed_vert,
    fragmentShader: Ue.linedashed_frag
  },
  depth: {
    uniforms: /* @__PURE__ */ Tt([
      ne.common,
      ne.displacementmap
    ]),
    vertexShader: Ue.depth_vert,
    fragmentShader: Ue.depth_frag
  },
  normal: {
    uniforms: /* @__PURE__ */ Tt([
      ne.common,
      ne.bumpmap,
      ne.normalmap,
      ne.displacementmap,
      {
        opacity: { value: 1 }
      }
    ]),
    vertexShader: Ue.meshnormal_vert,
    fragmentShader: Ue.meshnormal_frag
  },
  sprite: {
    uniforms: /* @__PURE__ */ Tt([
      ne.sprite,
      ne.fog
    ]),
    vertexShader: Ue.sprite_vert,
    fragmentShader: Ue.sprite_frag
  },
  background: {
    uniforms: {
      uvTransform: { value: /* @__PURE__ */ new De() },
      t2D: { value: null },
      backgroundIntensity: { value: 1 }
    },
    vertexShader: Ue.background_vert,
    fragmentShader: Ue.background_frag
  },
  backgroundCube: {
    uniforms: {
      envMap: { value: null },
      flipEnvMap: { value: -1 },
      backgroundBlurriness: { value: 0 },
      backgroundIntensity: { value: 1 },
      backgroundRotation: { value: /* @__PURE__ */ new De() }
    },
    vertexShader: Ue.backgroundCube_vert,
    fragmentShader: Ue.backgroundCube_frag
  },
  cube: {
    uniforms: {
      tCube: { value: null },
      tFlip: { value: -1 },
      opacity: { value: 1 }
    },
    vertexShader: Ue.cube_vert,
    fragmentShader: Ue.cube_frag
  },
  equirect: {
    uniforms: {
      tEquirect: { value: null }
    },
    vertexShader: Ue.equirect_vert,
    fragmentShader: Ue.equirect_frag
  },
  distanceRGBA: {
    uniforms: /* @__PURE__ */ Tt([
      ne.common,
      ne.displacementmap,
      {
        referencePosition: { value: /* @__PURE__ */ new z() },
        nearDistance: { value: 1 },
        farDistance: { value: 1e3 }
      }
    ]),
    vertexShader: Ue.distanceRGBA_vert,
    fragmentShader: Ue.distanceRGBA_frag
  },
  shadow: {
    uniforms: /* @__PURE__ */ Tt([
      ne.lights,
      ne.fog,
      {
        color: { value: /* @__PURE__ */ new Oe(0) },
        opacity: { value: 1 }
      }
    ]),
    vertexShader: Ue.shadow_vert,
    fragmentShader: Ue.shadow_frag
  }
};
Zt.physical = {
  uniforms: /* @__PURE__ */ Tt([
    Zt.standard.uniforms,
    {
      clearcoat: { value: 0 },
      clearcoatMap: { value: null },
      clearcoatMapTransform: { value: /* @__PURE__ */ new De() },
      clearcoatNormalMap: { value: null },
      clearcoatNormalMapTransform: { value: /* @__PURE__ */ new De() },
      clearcoatNormalScale: { value: /* @__PURE__ */ new we(1, 1) },
      clearcoatRoughness: { value: 0 },
      clearcoatRoughnessMap: { value: null },
      clearcoatRoughnessMapTransform: { value: /* @__PURE__ */ new De() },
      dispersion: { value: 0 },
      iridescence: { value: 0 },
      iridescenceMap: { value: null },
      iridescenceMapTransform: { value: /* @__PURE__ */ new De() },
      iridescenceIOR: { value: 1.3 },
      iridescenceThicknessMinimum: { value: 100 },
      iridescenceThicknessMaximum: { value: 400 },
      iridescenceThicknessMap: { value: null },
      iridescenceThicknessMapTransform: { value: /* @__PURE__ */ new De() },
      sheen: { value: 0 },
      sheenColor: { value: /* @__PURE__ */ new Oe(0) },
      sheenColorMap: { value: null },
      sheenColorMapTransform: { value: /* @__PURE__ */ new De() },
      sheenRoughness: { value: 1 },
      sheenRoughnessMap: { value: null },
      sheenRoughnessMapTransform: { value: /* @__PURE__ */ new De() },
      transmission: { value: 0 },
      transmissionMap: { value: null },
      transmissionMapTransform: { value: /* @__PURE__ */ new De() },
      transmissionSamplerSize: { value: /* @__PURE__ */ new we() },
      transmissionSamplerMap: { value: null },
      thickness: { value: 0 },
      thicknessMap: { value: null },
      thicknessMapTransform: { value: /* @__PURE__ */ new De() },
      attenuationDistance: { value: 0 },
      attenuationColor: { value: /* @__PURE__ */ new Oe(0) },
      specularColor: { value: /* @__PURE__ */ new Oe(1, 1, 1) },
      specularColorMap: { value: null },
      specularColorMapTransform: { value: /* @__PURE__ */ new De() },
      specularIntensity: { value: 1 },
      specularIntensityMap: { value: null },
      specularIntensityMapTransform: { value: /* @__PURE__ */ new De() },
      anisotropyVector: { value: /* @__PURE__ */ new we() },
      anisotropyMap: { value: null },
      anisotropyMapTransform: { value: /* @__PURE__ */ new De() }
    }
  ]),
  vertexShader: Ue.meshphysical_vert,
  fragmentShader: Ue.meshphysical_frag
};
const xr = { r: 0, b: 0, g: 0 }, kn = /* @__PURE__ */ new gn(), nm = /* @__PURE__ */ new je();
function im(t, e, n, i, r, s, a) {
  const o = new Oe(0);
  let c = s === !0 ? 0 : 1, l, h, f = null, d = 0, u = null;
  function g(E) {
    let M = E.isScene === !0 ? E.background : null;
    return M && M.isTexture && (M = (E.backgroundBlurriness > 0 ? n : e).get(M)), M;
  }
  function _(E) {
    let M = !1;
    const x = g(E);
    x === null ? m(o, c) : x && x.isColor && (m(x, 1), M = !0);
    const P = t.xr.getEnvironmentBlendMode();
    P === "additive" ? i.buffers.color.setClear(0, 0, 0, 1, a) : P === "alpha-blend" && i.buffers.color.setClear(0, 0, 0, 0, a), (t.autoClear || M) && (i.buffers.depth.setTest(!0), i.buffers.depth.setMask(!0), i.buffers.color.setMask(!0), t.clear(t.autoClearColor, t.autoClearDepth, t.autoClearStencil));
  }
  function p(E, M) {
    const x = g(M);
    x && (x.isCubeTexture || x.mapping === Vr) ? (h === void 0 && (h = new Ut(
      new Qn(1, 1, 1),
      new tn({
        name: "BackgroundCubeMaterial",
        uniforms: Ri(Zt.backgroundCube.uniforms),
        vertexShader: Zt.backgroundCube.vertexShader,
        fragmentShader: Zt.backgroundCube.fragmentShader,
        side: Pt,
        depthTest: !1,
        depthWrite: !1,
        fog: !1
      })
    ), h.geometry.deleteAttribute("normal"), h.geometry.deleteAttribute("uv"), h.onBeforeRender = function(P, b, A) {
      this.matrixWorld.copyPosition(A.matrixWorld);
    }, Object.defineProperty(h.material, "envMap", {
      get: function() {
        return this.uniforms.envMap.value;
      }
    }), r.update(h)), kn.copy(M.backgroundRotation), kn.x *= -1, kn.y *= -1, kn.z *= -1, x.isCubeTexture && x.isRenderTargetTexture === !1 && (kn.y *= -1, kn.z *= -1), h.material.uniforms.envMap.value = x, h.material.uniforms.flipEnvMap.value = x.isCubeTexture && x.isRenderTargetTexture === !1 ? -1 : 1, h.material.uniforms.backgroundBlurriness.value = M.backgroundBlurriness, h.material.uniforms.backgroundIntensity.value = M.backgroundIntensity, h.material.uniforms.backgroundRotation.value.setFromMatrix4(nm.makeRotationFromEuler(kn)), h.material.toneMapped = Ge.getTransfer(x.colorSpace) !== Ze, (f !== x || d !== x.version || u !== t.toneMapping) && (h.material.needsUpdate = !0, f = x, d = x.version, u = t.toneMapping), h.layers.enableAll(), E.unshift(h, h.geometry, h.material, 0, 0, null)) : x && x.isTexture && (l === void 0 && (l = new Ut(
      new Wr(2, 2),
      new tn({
        name: "BackgroundMaterial",
        uniforms: Ri(Zt.background.uniforms),
        vertexShader: Zt.background.vertexShader,
        fragmentShader: Zt.background.fragmentShader,
        side: In,
        depthTest: !1,
        depthWrite: !1,
        fog: !1
      })
    ), l.geometry.deleteAttribute("normal"), Object.defineProperty(l.material, "map", {
      get: function() {
        return this.uniforms.t2D.value;
      }
    }), r.update(l)), l.material.uniforms.t2D.value = x, l.material.uniforms.backgroundIntensity.value = M.backgroundIntensity, l.material.toneMapped = Ge.getTransfer(x.colorSpace) !== Ze, x.matrixAutoUpdate === !0 && x.updateMatrix(), l.material.uniforms.uvTransform.value.copy(x.matrix), (f !== x || d !== x.version || u !== t.toneMapping) && (l.material.needsUpdate = !0, f = x, d = x.version, u = t.toneMapping), l.layers.enableAll(), E.unshift(l, l.geometry, l.material, 0, 0, null));
  }
  function m(E, M) {
    E.getRGB(xr, $c(t)), i.buffers.color.setClear(xr.r, xr.g, xr.b, M, a);
  }
  return {
    getClearColor: function() {
      return o;
    },
    setClearColor: function(E, M = 1) {
      o.set(E), c = M, m(o, c);
    },
    getClearAlpha: function() {
      return c;
    },
    setClearAlpha: function(E) {
      c = E, m(o, c);
    },
    render: _,
    addToRenderList: p
  };
}
function rm(t, e) {
  const n = t.getParameter(t.MAX_VERTEX_ATTRIBS), i = {}, r = d(null);
  let s = r, a = !1;
  function o(v, C, F, L, D) {
    let W = !1;
    const V = f(L, F, C);
    s !== V && (s = V, l(s.object)), W = u(v, L, F, D), W && g(v, L, F, D), D !== null && e.update(D, t.ELEMENT_ARRAY_BUFFER), (W || a) && (a = !1, x(v, C, F, L), D !== null && t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, e.get(D).buffer));
  }
  function c() {
    return t.createVertexArray();
  }
  function l(v) {
    return t.bindVertexArray(v);
  }
  function h(v) {
    return t.deleteVertexArray(v);
  }
  function f(v, C, F) {
    const L = F.wireframe === !0;
    let D = i[v.id];
    D === void 0 && (D = {}, i[v.id] = D);
    let W = D[C.id];
    W === void 0 && (W = {}, D[C.id] = W);
    let V = W[L];
    return V === void 0 && (V = d(c()), W[L] = V), V;
  }
  function d(v) {
    const C = [], F = [], L = [];
    for (let D = 0; D < n; D++)
      C[D] = 0, F[D] = 0, L[D] = 0;
    return {
      // for backward compatibility on non-VAO support browser
      geometry: null,
      program: null,
      wireframe: !1,
      newAttributes: C,
      enabledAttributes: F,
      attributeDivisors: L,
      object: v,
      attributes: {},
      index: null
    };
  }
  function u(v, C, F, L) {
    const D = s.attributes, W = C.attributes;
    let V = 0;
    const K = F.getAttributes();
    for (const G in K)
      if (K[G].location >= 0) {
        const ae = D[G];
        let de = W[G];
        if (de === void 0 && (G === "instanceMatrix" && v.instanceMatrix && (de = v.instanceMatrix), G === "instanceColor" && v.instanceColor && (de = v.instanceColor)), ae === void 0 || ae.attribute !== de || de && ae.data !== de.data) return !0;
        V++;
      }
    return s.attributesNum !== V || s.index !== L;
  }
  function g(v, C, F, L) {
    const D = {}, W = C.attributes;
    let V = 0;
    const K = F.getAttributes();
    for (const G in K)
      if (K[G].location >= 0) {
        let ae = W[G];
        ae === void 0 && (G === "instanceMatrix" && v.instanceMatrix && (ae = v.instanceMatrix), G === "instanceColor" && v.instanceColor && (ae = v.instanceColor));
        const de = {};
        de.attribute = ae, ae && ae.data && (de.data = ae.data), D[G] = de, V++;
      }
    s.attributes = D, s.attributesNum = V, s.index = L;
  }
  function _() {
    const v = s.newAttributes;
    for (let C = 0, F = v.length; C < F; C++)
      v[C] = 0;
  }
  function p(v) {
    m(v, 0);
  }
  function m(v, C) {
    const F = s.newAttributes, L = s.enabledAttributes, D = s.attributeDivisors;
    F[v] = 1, L[v] === 0 && (t.enableVertexAttribArray(v), L[v] = 1), D[v] !== C && (t.vertexAttribDivisor(v, C), D[v] = C);
  }
  function E() {
    const v = s.newAttributes, C = s.enabledAttributes;
    for (let F = 0, L = C.length; F < L; F++)
      C[F] !== v[F] && (t.disableVertexAttribArray(F), C[F] = 0);
  }
  function M(v, C, F, L, D, W, V) {
    V === !0 ? t.vertexAttribIPointer(v, C, F, D, W) : t.vertexAttribPointer(v, C, F, L, D, W);
  }
  function x(v, C, F, L) {
    _();
    const D = L.attributes, W = F.getAttributes(), V = C.defaultAttributeValues;
    for (const K in W) {
      const G = W[K];
      if (G.location >= 0) {
        let te = D[K];
        if (te === void 0 && (K === "instanceMatrix" && v.instanceMatrix && (te = v.instanceMatrix), K === "instanceColor" && v.instanceColor && (te = v.instanceColor)), te !== void 0) {
          const ae = te.normalized, de = te.itemSize, Le = e.get(te);
          if (Le === void 0) continue;
          const Xe = Le.buffer, q = Le.type, Q = Le.bytesPerElement, he = q === t.INT || q === t.UNSIGNED_INT || te.gpuType === Sa;
          if (te.isInterleavedBufferAttribute) {
            const ie = te.data, Se = ie.stride, Re = te.offset;
            if (ie.isInstancedInterleavedBuffer) {
              for (let Fe = 0; Fe < G.locationSize; Fe++)
                m(G.location + Fe, ie.meshPerAttribute);
              v.isInstancedMesh !== !0 && L._maxInstanceCount === void 0 && (L._maxInstanceCount = ie.meshPerAttribute * ie.count);
            } else
              for (let Fe = 0; Fe < G.locationSize; Fe++)
                p(G.location + Fe);
            t.bindBuffer(t.ARRAY_BUFFER, Xe);
            for (let Fe = 0; Fe < G.locationSize; Fe++)
              M(
                G.location + Fe,
                de / G.locationSize,
                q,
                ae,
                Se * Q,
                (Re + de / G.locationSize * Fe) * Q,
                he
              );
          } else {
            if (te.isInstancedBufferAttribute) {
              for (let ie = 0; ie < G.locationSize; ie++)
                m(G.location + ie, te.meshPerAttribute);
              v.isInstancedMesh !== !0 && L._maxInstanceCount === void 0 && (L._maxInstanceCount = te.meshPerAttribute * te.count);
            } else
              for (let ie = 0; ie < G.locationSize; ie++)
                p(G.location + ie);
            t.bindBuffer(t.ARRAY_BUFFER, Xe);
            for (let ie = 0; ie < G.locationSize; ie++)
              M(
                G.location + ie,
                de / G.locationSize,
                q,
                ae,
                de * Q,
                de / G.locationSize * ie * Q,
                he
              );
          }
        } else if (V !== void 0) {
          const ae = V[K];
          if (ae !== void 0)
            switch (ae.length) {
              case 2:
                t.vertexAttrib2fv(G.location, ae);
                break;
              case 3:
                t.vertexAttrib3fv(G.location, ae);
                break;
              case 4:
                t.vertexAttrib4fv(G.location, ae);
                break;
              default:
                t.vertexAttrib1fv(G.location, ae);
            }
        }
      }
    }
    E();
  }
  function P() {
    R();
    for (const v in i) {
      const C = i[v];
      for (const F in C) {
        const L = C[F];
        for (const D in L)
          h(L[D].object), delete L[D];
        delete C[F];
      }
      delete i[v];
    }
  }
  function b(v) {
    if (i[v.id] === void 0) return;
    const C = i[v.id];
    for (const F in C) {
      const L = C[F];
      for (const D in L)
        h(L[D].object), delete L[D];
      delete C[F];
    }
    delete i[v.id];
  }
  function A(v) {
    for (const C in i) {
      const F = i[C];
      if (F[v.id] === void 0) continue;
      const L = F[v.id];
      for (const D in L)
        h(L[D].object), delete L[D];
      delete F[v.id];
    }
  }
  function R() {
    S(), a = !0, s !== r && (s = r, l(s.object));
  }
  function S() {
    r.geometry = null, r.program = null, r.wireframe = !1;
  }
  return {
    setup: o,
    reset: R,
    resetDefaultState: S,
    dispose: P,
    releaseStatesOfGeometry: b,
    releaseStatesOfProgram: A,
    initAttributes: _,
    enableAttribute: p,
    disableUnusedAttributes: E
  };
}
function sm(t, e, n) {
  let i;
  function r(l) {
    i = l;
  }
  function s(l, h) {
    t.drawArrays(i, l, h), n.update(h, i, 1);
  }
  function a(l, h, f) {
    f !== 0 && (t.drawArraysInstanced(i, l, h, f), n.update(h, i, f));
  }
  function o(l, h, f) {
    if (f === 0) return;
    e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i, l, 0, h, 0, f);
    let u = 0;
    for (let g = 0; g < f; g++)
      u += h[g];
    n.update(u, i, 1);
  }
  function c(l, h, f, d) {
    if (f === 0) return;
    const u = e.get("WEBGL_multi_draw");
    if (u === null)
      for (let g = 0; g < l.length; g++)
        a(l[g], h[g], d[g]);
    else {
      u.multiDrawArraysInstancedWEBGL(i, l, 0, h, 0, d, 0, f);
      let g = 0;
      for (let _ = 0; _ < f; _++)
        g += h[_] * d[_];
      n.update(g, i, 1);
    }
  }
  this.setMode = r, this.render = s, this.renderInstances = a, this.renderMultiDraw = o, this.renderMultiDrawInstances = c;
}
function am(t, e, n, i) {
  let r;
  function s() {
    if (r !== void 0) return r;
    if (e.has("EXT_texture_filter_anisotropic") === !0) {
      const A = e.get("EXT_texture_filter_anisotropic");
      r = t.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    } else
      r = 0;
    return r;
  }
  function a(A) {
    return !(A !== $t && i.convert(A) !== t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT));
  }
  function o(A) {
    const R = A === ji && (e.has("EXT_color_buffer_half_float") || e.has("EXT_color_buffer_float"));
    return !(A !== mn && i.convert(A) !== t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE) && // Edge and Chrome Mac < 52 (#9513)
    A !== Qt && !R);
  }
  function c(A) {
    if (A === "highp") {
      if (t.getShaderPrecisionFormat(t.VERTEX_SHADER, t.HIGH_FLOAT).precision > 0 && t.getShaderPrecisionFormat(t.FRAGMENT_SHADER, t.HIGH_FLOAT).precision > 0)
        return "highp";
      A = "mediump";
    }
    return A === "mediump" && t.getShaderPrecisionFormat(t.VERTEX_SHADER, t.MEDIUM_FLOAT).precision > 0 && t.getShaderPrecisionFormat(t.FRAGMENT_SHADER, t.MEDIUM_FLOAT).precision > 0 ? "mediump" : "lowp";
  }
  let l = n.precision !== void 0 ? n.precision : "highp";
  const h = c(l);
  h !== l && (console.warn("THREE.WebGLRenderer:", l, "not supported, using", h, "instead."), l = h);
  const f = n.logarithmicDepthBuffer === !0, d = n.reverseDepthBuffer === !0 && e.has("EXT_clip_control"), u = t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS), g = t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS), _ = t.getParameter(t.MAX_TEXTURE_SIZE), p = t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE), m = t.getParameter(t.MAX_VERTEX_ATTRIBS), E = t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS), M = t.getParameter(t.MAX_VARYING_VECTORS), x = t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS), P = g > 0, b = t.getParameter(t.MAX_SAMPLES);
  return {
    isWebGL2: !0,
    // keeping this for backwards compatibility
    getMaxAnisotropy: s,
    getMaxPrecision: c,
    textureFormatReadable: a,
    textureTypeReadable: o,
    precision: l,
    logarithmicDepthBuffer: f,
    reverseDepthBuffer: d,
    maxTextures: u,
    maxVertexTextures: g,
    maxTextureSize: _,
    maxCubemapSize: p,
    maxAttributes: m,
    maxVertexUniforms: E,
    maxVaryings: M,
    maxFragmentUniforms: x,
    vertexTextures: P,
    maxSamples: b
  };
}
function om(t) {
  const e = this;
  let n = null, i = 0, r = !1, s = !1;
  const a = new dn(), o = new De(), c = { value: null, needsUpdate: !1 };
  this.uniform = c, this.numPlanes = 0, this.numIntersection = 0, this.init = function(f, d) {
    const u = f.length !== 0 || d || // enable state of previous frame - the clipping code has to
    // run another frame in order to reset the state:
    i !== 0 || r;
    return r = d, i = f.length, u;
  }, this.beginShadows = function() {
    s = !0, h(null);
  }, this.endShadows = function() {
    s = !1;
  }, this.setGlobalState = function(f, d) {
    n = h(f, d, 0);
  }, this.setState = function(f, d, u) {
    const g = f.clippingPlanes, _ = f.clipIntersection, p = f.clipShadows, m = t.get(f);
    if (!r || g === null || g.length === 0 || s && !p)
      s ? h(null) : l();
    else {
      const E = s ? 0 : i, M = E * 4;
      let x = m.clippingState || null;
      c.value = x, x = h(g, d, M, u);
      for (let P = 0; P !== M; ++P)
        x[P] = n[P];
      m.clippingState = x, this.numIntersection = _ ? this.numPlanes : 0, this.numPlanes += E;
    }
  };
  function l() {
    c.value !== n && (c.value = n, c.needsUpdate = i > 0), e.numPlanes = i, e.numIntersection = 0;
  }
  function h(f, d, u, g) {
    const _ = f !== null ? f.length : 0;
    let p = null;
    if (_ !== 0) {
      if (p = c.value, g !== !0 || p === null) {
        const m = u + _ * 4, E = d.matrixWorldInverse;
        o.getNormalMatrix(E), (p === null || p.length < m) && (p = new Float32Array(m));
        for (let M = 0, x = u; M !== _; ++M, x += 4)
          a.copy(f[M]).applyMatrix4(E, o), a.normal.toArray(p, x), p[x + 3] = a.constant;
      }
      c.value = p, c.needsUpdate = !0;
    }
    return e.numPlanes = _, e.numIntersection = 0, p;
  }
}
function cm(t) {
  let e = /* @__PURE__ */ new WeakMap();
  function n(a, o) {
    return o === zs ? a.mapping = Ti : o === Bs && (a.mapping = bi), a;
  }
  function i(a) {
    if (a && a.isTexture) {
      const o = a.mapping;
      if (o === zs || o === Bs)
        if (e.has(a)) {
          const c = e.get(a).texture;
          return n(c, a.mapping);
        } else {
          const c = a.image;
          if (c && c.height > 0) {
            const l = new xd(c.height);
            return l.fromEquirectangularTexture(t, a), e.set(a, l), a.addEventListener("dispose", r), n(l.texture, a.mapping);
          } else
            return null;
        }
    }
    return a;
  }
  function r(a) {
    const o = a.target;
    o.removeEventListener("dispose", r);
    const c = e.get(o);
    c !== void 0 && (e.delete(o), c.dispose());
  }
  function s() {
    e = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: i,
    dispose: s
  };
}
class Kc extends Yc {
  constructor(e = -1, n = 1, i = 1, r = -1, s = 0.1, a = 2e3) {
    super(), this.isOrthographicCamera = !0, this.type = "OrthographicCamera", this.zoom = 1, this.view = null, this.left = e, this.right = n, this.top = i, this.bottom = r, this.near = s, this.far = a, this.updateProjectionMatrix();
  }
  copy(e, n) {
    return super.copy(e, n), this.left = e.left, this.right = e.right, this.top = e.top, this.bottom = e.bottom, this.near = e.near, this.far = e.far, this.zoom = e.zoom, this.view = e.view === null ? null : Object.assign({}, e.view), this;
  }
  setViewOffset(e, n, i, r, s, a) {
    this.view === null && (this.view = {
      enabled: !0,
      fullWidth: 1,
      fullHeight: 1,
      offsetX: 0,
      offsetY: 0,
      width: 1,
      height: 1
    }), this.view.enabled = !0, this.view.fullWidth = e, this.view.fullHeight = n, this.view.offsetX = i, this.view.offsetY = r, this.view.width = s, this.view.height = a, this.updateProjectionMatrix();
  }
  clearViewOffset() {
    this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    const e = (this.right - this.left) / (2 * this.zoom), n = (this.top - this.bottom) / (2 * this.zoom), i = (this.right + this.left) / 2, r = (this.top + this.bottom) / 2;
    let s = i - e, a = i + e, o = r + n, c = r - n;
    if (this.view !== null && this.view.enabled) {
      const l = (this.right - this.left) / this.view.fullWidth / this.zoom, h = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
      s += l * this.view.offsetX, a = s + l * this.view.width, o -= h * this.view.offsetY, c = o - h * this.view.height;
    }
    this.projectionMatrix.makeOrthographic(s, a, o, c, this.near, this.far, this.coordinateSystem), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(e) {
    const n = super.toJSON(e);
    return n.object.zoom = this.zoom, n.object.left = this.left, n.object.right = this.right, n.object.top = this.top, n.object.bottom = this.bottom, n.object.near = this.near, n.object.far = this.far, this.view !== null && (n.object.view = Object.assign({}, this.view)), n;
  }
}
const _i = 4, Co = [0.125, 0.215, 0.35, 0.446, 0.526, 0.582], Xn = 20, vs = /* @__PURE__ */ new Kc(), Po = /* @__PURE__ */ new Oe();
let xs = null, Ms = 0, ys = 0, Ss = !1;
const Gn = (1 + Math.sqrt(5)) / 2, pi = 1 / Gn, Do = [
  /* @__PURE__ */ new z(-Gn, pi, 0),
  /* @__PURE__ */ new z(Gn, pi, 0),
  /* @__PURE__ */ new z(-pi, 0, Gn),
  /* @__PURE__ */ new z(pi, 0, Gn),
  /* @__PURE__ */ new z(0, Gn, -pi),
  /* @__PURE__ */ new z(0, Gn, pi),
  /* @__PURE__ */ new z(-1, 1, -1),
  /* @__PURE__ */ new z(1, 1, -1),
  /* @__PURE__ */ new z(-1, 1, 1),
  /* @__PURE__ */ new z(1, 1, 1)
];
class Lo {
  constructor(e) {
    this._renderer = e, this._pingPongRenderTarget = null, this._lodMax = 0, this._cubeSize = 0, this._lodPlanes = [], this._sizeLods = [], this._sigmas = [], this._blurMaterial = null, this._cubemapMaterial = null, this._equirectMaterial = null, this._compileMaterial(this._blurMaterial);
  }
  /**
   * Generates a PMREM from a supplied Scene, which can be faster than using an
   * image if networking bandwidth is low. Optional sigma specifies a blur radius
   * in radians to be applied to the scene before PMREM generation. Optional near
   * and far planes ensure the scene is rendered in its entirety (the cubeCamera
   * is placed at the origin).
   */
  fromScene(e, n = 0, i = 0.1, r = 100) {
    xs = this._renderer.getRenderTarget(), Ms = this._renderer.getActiveCubeFace(), ys = this._renderer.getActiveMipmapLevel(), Ss = this._renderer.xr.enabled, this._renderer.xr.enabled = !1, this._setSize(256);
    const s = this._allocateTargets();
    return s.depthBuffer = !0, this._sceneToCubeUV(e, i, r, s), n > 0 && this._blur(s, 0, 0, n), this._applyPMREM(s), this._cleanup(s), s;
  }
  /**
   * Generates a PMREM from an equirectangular texture, which can be either LDR
   * or HDR. The ideal input image size is 1k (1024 x 512),
   * as this matches best with the 256 x 256 cubemap output.
   * The smallest supported equirectangular image size is 64 x 32.
   */
  fromEquirectangular(e, n = null) {
    return this._fromTexture(e, n);
  }
  /**
   * Generates a PMREM from an cubemap texture, which can be either LDR
   * or HDR. The ideal input cube size is 256 x 256,
   * as this matches best with the 256 x 256 cubemap output.
   * The smallest supported cube size is 16 x 16.
   */
  fromCubemap(e, n = null) {
    return this._fromTexture(e, n);
  }
  /**
   * Pre-compiles the cubemap shader. You can get faster start-up by invoking this method during
   * your texture's network fetch for increased concurrency.
   */
  compileCubemapShader() {
    this._cubemapMaterial === null && (this._cubemapMaterial = No(), this._compileMaterial(this._cubemapMaterial));
  }
  /**
   * Pre-compiles the equirectangular shader. You can get faster start-up by invoking this method during
   * your texture's network fetch for increased concurrency.
   */
  compileEquirectangularShader() {
    this._equirectMaterial === null && (this._equirectMaterial = Uo(), this._compileMaterial(this._equirectMaterial));
  }
  /**
   * Disposes of the PMREMGenerator's internal memory. Note that PMREMGenerator is a static class,
   * so you should not need more than one PMREMGenerator object. If you do, calling dispose() on
   * one of them will cause any others to also become unusable.
   */
  dispose() {
    this._dispose(), this._cubemapMaterial !== null && this._cubemapMaterial.dispose(), this._equirectMaterial !== null && this._equirectMaterial.dispose();
  }
  // private interface
  _setSize(e) {
    this._lodMax = Math.floor(Math.log2(e)), this._cubeSize = Math.pow(2, this._lodMax);
  }
  _dispose() {
    this._blurMaterial !== null && this._blurMaterial.dispose(), this._pingPongRenderTarget !== null && this._pingPongRenderTarget.dispose();
    for (let e = 0; e < this._lodPlanes.length; e++)
      this._lodPlanes[e].dispose();
  }
  _cleanup(e) {
    this._renderer.setRenderTarget(xs, Ms, ys), this._renderer.xr.enabled = Ss, e.scissorTest = !1, Mr(e, 0, 0, e.width, e.height);
  }
  _fromTexture(e, n) {
    e.mapping === Ti || e.mapping === bi ? this._setSize(e.image.length === 0 ? 16 : e.image[0].width || e.image[0].image.width) : this._setSize(e.image.width / 4), xs = this._renderer.getRenderTarget(), Ms = this._renderer.getActiveCubeFace(), ys = this._renderer.getActiveMipmapLevel(), Ss = this._renderer.xr.enabled, this._renderer.xr.enabled = !1;
    const i = n || this._allocateTargets();
    return this._textureToCubeUV(e, i), this._applyPMREM(i), this._cleanup(i), i;
  }
  _allocateTargets() {
    const e = 3 * Math.max(this._cubeSize, 112), n = 4 * this._cubeSize, i = {
      magFilter: Jt,
      minFilter: Jt,
      generateMipmaps: !1,
      type: ji,
      format: $t,
      colorSpace: Ci,
      depthBuffer: !1
    }, r = Io(e, n, i);
    if (this._pingPongRenderTarget === null || this._pingPongRenderTarget.width !== e || this._pingPongRenderTarget.height !== n) {
      this._pingPongRenderTarget !== null && this._dispose(), this._pingPongRenderTarget = Io(e, n, i);
      const { _lodMax: s } = this;
      ({ sizeLods: this._sizeLods, lodPlanes: this._lodPlanes, sigmas: this._sigmas } = lm(s)), this._blurMaterial = hm(s, e, n);
    }
    return r;
  }
  _compileMaterial(e) {
    const n = new Ut(this._lodPlanes[0], e);
    this._renderer.compile(n, vs);
  }
  _sceneToCubeUV(e, n, i, r) {
    const o = new Ht(90, 1, n, i), c = [1, -1, 1, 1, 1, 1], l = [1, 1, 1, -1, -1, -1], h = this._renderer, f = h.autoClear, d = h.toneMapping;
    h.getClearColor(Po), h.toneMapping = Ln, h.autoClear = !1;
    const u = new Ji({
      name: "PMREM.Background",
      side: Pt,
      depthWrite: !1,
      depthTest: !1
    }), g = new Ut(new Qn(), u);
    let _ = !1;
    const p = e.background;
    p ? p.isColor && (u.color.copy(p), e.background = null, _ = !0) : (u.color.copy(Po), _ = !0);
    for (let m = 0; m < 6; m++) {
      const E = m % 3;
      E === 0 ? (o.up.set(0, c[m], 0), o.lookAt(l[m], 0, 0)) : E === 1 ? (o.up.set(0, 0, c[m]), o.lookAt(0, l[m], 0)) : (o.up.set(0, c[m], 0), o.lookAt(0, 0, l[m]));
      const M = this._cubeSize;
      Mr(r, E * M, m > 2 ? M : 0, M, M), h.setRenderTarget(r), _ && h.render(g, o), h.render(e, o);
    }
    g.geometry.dispose(), g.material.dispose(), h.toneMapping = d, h.autoClear = f, e.background = p;
  }
  _textureToCubeUV(e, n) {
    const i = this._renderer, r = e.mapping === Ti || e.mapping === bi;
    r ? (this._cubemapMaterial === null && (this._cubemapMaterial = No()), this._cubemapMaterial.uniforms.flipEnvMap.value = e.isRenderTargetTexture === !1 ? -1 : 1) : this._equirectMaterial === null && (this._equirectMaterial = Uo());
    const s = r ? this._cubemapMaterial : this._equirectMaterial, a = new Ut(this._lodPlanes[0], s), o = s.uniforms;
    o.envMap.value = e;
    const c = this._cubeSize;
    Mr(n, 0, 0, 3 * c, 2 * c), i.setRenderTarget(n), i.render(a, vs);
  }
  _applyPMREM(e) {
    const n = this._renderer, i = n.autoClear;
    n.autoClear = !1;
    const r = this._lodPlanes.length;
    for (let s = 1; s < r; s++) {
      const a = Math.sqrt(this._sigmas[s] * this._sigmas[s] - this._sigmas[s - 1] * this._sigmas[s - 1]), o = Do[(r - s - 1) % Do.length];
      this._blur(e, s - 1, s, a, o);
    }
    n.autoClear = i;
  }
  /**
   * This is a two-pass Gaussian blur for a cubemap. Normally this is done
   * vertically and horizontally, but this breaks down on a cube. Here we apply
   * the blur latitudinally (around the poles), and then longitudinally (towards
   * the poles) to approximate the orthogonally-separable blur. It is least
   * accurate at the poles, but still does a decent job.
   */
  _blur(e, n, i, r, s) {
    const a = this._pingPongRenderTarget;
    this._halfBlur(
      e,
      a,
      n,
      i,
      r,
      "latitudinal",
      s
    ), this._halfBlur(
      a,
      e,
      i,
      i,
      r,
      "longitudinal",
      s
    );
  }
  _halfBlur(e, n, i, r, s, a, o) {
    const c = this._renderer, l = this._blurMaterial;
    a !== "latitudinal" && a !== "longitudinal" && console.error(
      "blur direction must be either latitudinal or longitudinal!"
    );
    const h = 3, f = new Ut(this._lodPlanes[r], l), d = l.uniforms, u = this._sizeLods[i] - 1, g = isFinite(s) ? Math.PI / (2 * u) : 2 * Math.PI / (2 * Xn - 1), _ = s / g, p = isFinite(s) ? 1 + Math.floor(h * _) : Xn;
    p > Xn && console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Xn}`);
    const m = [];
    let E = 0;
    for (let A = 0; A < Xn; ++A) {
      const R = A / _, S = Math.exp(-R * R / 2);
      m.push(S), A === 0 ? E += S : A < p && (E += 2 * S);
    }
    for (let A = 0; A < m.length; A++)
      m[A] = m[A] / E;
    d.envMap.value = e.texture, d.samples.value = p, d.weights.value = m, d.latitudinal.value = a === "latitudinal", o && (d.poleAxis.value = o);
    const { _lodMax: M } = this;
    d.dTheta.value = g, d.mipInt.value = M - i;
    const x = this._sizeLods[r], P = 3 * x * (r > M - _i ? r - M + _i : 0), b = 4 * (this._cubeSize - x);
    Mr(n, P, b, 3 * x, 2 * x), c.setRenderTarget(n), c.render(f, vs);
  }
}
function lm(t) {
  const e = [], n = [], i = [];
  let r = t;
  const s = t - _i + 1 + Co.length;
  for (let a = 0; a < s; a++) {
    const o = Math.pow(2, r);
    n.push(o);
    let c = 1 / o;
    a > t - _i ? c = Co[a - t + _i - 1] : a === 0 && (c = 0), i.push(c);
    const l = 1 / (o - 2), h = -l, f = 1 + l, d = [h, h, f, h, f, f, h, h, f, f, h, f], u = 6, g = 6, _ = 3, p = 2, m = 1, E = new Float32Array(_ * g * u), M = new Float32Array(p * g * u), x = new Float32Array(m * g * u);
    for (let b = 0; b < u; b++) {
      const A = b % 3 * 2 / 3 - 1, R = b > 2 ? 0 : -1, S = [
        A,
        R,
        0,
        A + 2 / 3,
        R,
        0,
        A + 2 / 3,
        R + 1,
        0,
        A,
        R,
        0,
        A + 2 / 3,
        R + 1,
        0,
        A,
        R + 1,
        0
      ];
      E.set(S, _ * g * b), M.set(d, p * g * b);
      const v = [b, b, b, b, b, b];
      x.set(v, m * g * b);
    }
    const P = new _t();
    P.setAttribute("position", new ht(E, _)), P.setAttribute("uv", new ht(M, p)), P.setAttribute("faceIndex", new ht(x, m)), e.push(P), r > _i && r--;
  }
  return { lodPlanes: e, sizeLods: n, sigmas: i };
}
function Io(t, e, n) {
  const i = new jn(t, e, n);
  return i.texture.mapping = Vr, i.texture.name = "PMREM.cubeUv", i.scissorTest = !0, i;
}
function Mr(t, e, n, i, r) {
  t.viewport.set(e, n, i, r), t.scissor.set(e, n, i, r);
}
function hm(t, e, n) {
  const i = new Float32Array(Xn), r = new z(0, 1, 0);
  return new tn({
    name: "SphericalGaussianBlur",
    defines: {
      n: Xn,
      CUBEUV_TEXEL_WIDTH: 1 / e,
      CUBEUV_TEXEL_HEIGHT: 1 / n,
      CUBEUV_MAX_MIP: `${t}.0`
    },
    uniforms: {
      envMap: { value: null },
      samples: { value: 1 },
      weights: { value: i },
      latitudinal: { value: !1 },
      dTheta: { value: 0 },
      mipInt: { value: 0 },
      poleAxis: { value: r }
    },
    vertexShader: Da(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`
    ),
    blending: Dn,
    depthTest: !1,
    depthWrite: !1
  });
}
function Uo() {
  return new tn({
    name: "EquirectangularToCubeUV",
    uniforms: {
      envMap: { value: null }
    },
    vertexShader: Da(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`
    ),
    blending: Dn,
    depthTest: !1,
    depthWrite: !1
  });
}
function No() {
  return new tn({
    name: "CubemapToCubeUV",
    uniforms: {
      envMap: { value: null },
      flipEnvMap: { value: -1 }
    },
    vertexShader: Da(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`
    ),
    blending: Dn,
    depthTest: !1,
    depthWrite: !1
  });
}
function Da() {
  return (
    /* glsl */
    `

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`
  );
}
function fm(t) {
  let e = /* @__PURE__ */ new WeakMap(), n = null;
  function i(o) {
    if (o && o.isTexture) {
      const c = o.mapping, l = c === zs || c === Bs, h = c === Ti || c === bi;
      if (l || h) {
        let f = e.get(o);
        const d = f !== void 0 ? f.texture.pmremVersion : 0;
        if (o.isRenderTargetTexture && o.pmremVersion !== d)
          return n === null && (n = new Lo(t)), f = l ? n.fromEquirectangular(o, f) : n.fromCubemap(o, f), f.texture.pmremVersion = o.pmremVersion, e.set(o, f), f.texture;
        if (f !== void 0)
          return f.texture;
        {
          const u = o.image;
          return l && u && u.height > 0 || h && u && r(u) ? (n === null && (n = new Lo(t)), f = l ? n.fromEquirectangular(o) : n.fromCubemap(o), f.texture.pmremVersion = o.pmremVersion, e.set(o, f), o.addEventListener("dispose", s), f.texture) : null;
        }
      }
    }
    return o;
  }
  function r(o) {
    let c = 0;
    const l = 6;
    for (let h = 0; h < l; h++)
      o[h] !== void 0 && c++;
    return c === l;
  }
  function s(o) {
    const c = o.target;
    c.removeEventListener("dispose", s);
    const l = e.get(c);
    l !== void 0 && (e.delete(c), l.dispose());
  }
  function a() {
    e = /* @__PURE__ */ new WeakMap(), n !== null && (n.dispose(), n = null);
  }
  return {
    get: i,
    dispose: a
  };
}
function dm(t) {
  const e = {};
  function n(i) {
    if (e[i] !== void 0)
      return e[i];
    let r;
    switch (i) {
      case "WEBGL_depth_texture":
        r = t.getExtension("WEBGL_depth_texture") || t.getExtension("MOZ_WEBGL_depth_texture") || t.getExtension("WEBKIT_WEBGL_depth_texture");
        break;
      case "EXT_texture_filter_anisotropic":
        r = t.getExtension("EXT_texture_filter_anisotropic") || t.getExtension("MOZ_EXT_texture_filter_anisotropic") || t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
        break;
      case "WEBGL_compressed_texture_s3tc":
        r = t.getExtension("WEBGL_compressed_texture_s3tc") || t.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
        break;
      case "WEBGL_compressed_texture_pvrtc":
        r = t.getExtension("WEBGL_compressed_texture_pvrtc") || t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
        break;
      default:
        r = t.getExtension(i);
    }
    return e[i] = r, r;
  }
  return {
    has: function(i) {
      return n(i) !== null;
    },
    init: function() {
      n("EXT_color_buffer_float"), n("WEBGL_clip_cull_distance"), n("OES_texture_float_linear"), n("EXT_color_buffer_half_float"), n("WEBGL_multisampled_render_to_texture"), n("WEBGL_render_shared_exponent");
    },
    get: function(i) {
      const r = n(i);
      return r === null && Vi("THREE.WebGLRenderer: " + i + " extension not supported."), r;
    }
  };
}
function um(t, e, n, i) {
  const r = {}, s = /* @__PURE__ */ new WeakMap();
  function a(f) {
    const d = f.target;
    d.index !== null && e.remove(d.index);
    for (const g in d.attributes)
      e.remove(d.attributes[g]);
    for (const g in d.morphAttributes) {
      const _ = d.morphAttributes[g];
      for (let p = 0, m = _.length; p < m; p++)
        e.remove(_[p]);
    }
    d.removeEventListener("dispose", a), delete r[d.id];
    const u = s.get(d);
    u && (e.remove(u), s.delete(d)), i.releaseStatesOfGeometry(d), d.isInstancedBufferGeometry === !0 && delete d._maxInstanceCount, n.memory.geometries--;
  }
  function o(f, d) {
    return r[d.id] === !0 || (d.addEventListener("dispose", a), r[d.id] = !0, n.memory.geometries++), d;
  }
  function c(f) {
    const d = f.attributes;
    for (const g in d)
      e.update(d[g], t.ARRAY_BUFFER);
    const u = f.morphAttributes;
    for (const g in u) {
      const _ = u[g];
      for (let p = 0, m = _.length; p < m; p++)
        e.update(_[p], t.ARRAY_BUFFER);
    }
  }
  function l(f) {
    const d = [], u = f.index, g = f.attributes.position;
    let _ = 0;
    if (u !== null) {
      const E = u.array;
      _ = u.version;
      for (let M = 0, x = E.length; M < x; M += 3) {
        const P = E[M + 0], b = E[M + 1], A = E[M + 2];
        d.push(P, b, b, A, A, P);
      }
    } else if (g !== void 0) {
      const E = g.array;
      _ = g.version;
      for (let M = 0, x = E.length / 3 - 1; M < x; M += 3) {
        const P = M + 0, b = M + 1, A = M + 2;
        d.push(P, b, b, A, A, P);
      }
    } else
      return;
    const p = new (Hc(d) ? qc : Wc)(d, 1);
    p.version = _;
    const m = s.get(f);
    m && e.remove(m), s.set(f, p);
  }
  function h(f) {
    const d = s.get(f);
    if (d) {
      const u = f.index;
      u !== null && d.version < u.version && l(f);
    } else
      l(f);
    return s.get(f);
  }
  return {
    get: o,
    update: c,
    getWireframeAttribute: h
  };
}
function pm(t, e, n) {
  let i;
  function r(d) {
    i = d;
  }
  let s, a;
  function o(d) {
    s = d.type, a = d.bytesPerElement;
  }
  function c(d, u) {
    t.drawElements(i, u, s, d * a), n.update(u, i, 1);
  }
  function l(d, u, g) {
    g !== 0 && (t.drawElementsInstanced(i, u, s, d * a, g), n.update(u, i, g));
  }
  function h(d, u, g) {
    if (g === 0) return;
    e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i, u, 0, s, d, 0, g);
    let p = 0;
    for (let m = 0; m < g; m++)
      p += u[m];
    n.update(p, i, 1);
  }
  function f(d, u, g, _) {
    if (g === 0) return;
    const p = e.get("WEBGL_multi_draw");
    if (p === null)
      for (let m = 0; m < d.length; m++)
        l(d[m] / a, u[m], _[m]);
    else {
      p.multiDrawElementsInstancedWEBGL(i, u, 0, s, d, 0, _, 0, g);
      let m = 0;
      for (let E = 0; E < g; E++)
        m += u[E] * _[E];
      n.update(m, i, 1);
    }
  }
  this.setMode = r, this.setIndex = o, this.render = c, this.renderInstances = l, this.renderMultiDraw = h, this.renderMultiDrawInstances = f;
}
function mm(t) {
  const e = {
    geometries: 0,
    textures: 0
  }, n = {
    frame: 0,
    calls: 0,
    triangles: 0,
    points: 0,
    lines: 0
  };
  function i(s, a, o) {
    switch (n.calls++, a) {
      case t.TRIANGLES:
        n.triangles += o * (s / 3);
        break;
      case t.LINES:
        n.lines += o * (s / 2);
        break;
      case t.LINE_STRIP:
        n.lines += o * (s - 1);
        break;
      case t.LINE_LOOP:
        n.lines += o * s;
        break;
      case t.POINTS:
        n.points += o * s;
        break;
      default:
        console.error("THREE.WebGLInfo: Unknown draw mode:", a);
        break;
    }
  }
  function r() {
    n.calls = 0, n.triangles = 0, n.points = 0, n.lines = 0;
  }
  return {
    memory: e,
    render: n,
    programs: null,
    autoReset: !0,
    reset: r,
    update: i
  };
}
function gm(t, e, n) {
  const i = /* @__PURE__ */ new WeakMap(), r = new st();
  function s(a, o, c) {
    const l = a.morphTargetInfluences, h = o.morphAttributes.position || o.morphAttributes.normal || o.morphAttributes.color, f = h !== void 0 ? h.length : 0;
    let d = i.get(o);
    if (d === void 0 || d.count !== f) {
      let S = function() {
        A.dispose(), i.delete(o), o.removeEventListener("dispose", S);
      };
      d !== void 0 && d.texture.dispose();
      const u = o.morphAttributes.position !== void 0, g = o.morphAttributes.normal !== void 0, _ = o.morphAttributes.color !== void 0, p = o.morphAttributes.position || [], m = o.morphAttributes.normal || [], E = o.morphAttributes.color || [];
      let M = 0;
      u === !0 && (M = 1), g === !0 && (M = 2), _ === !0 && (M = 3);
      let x = o.attributes.position.count * M, P = 1;
      x > e.maxTextureSize && (P = Math.ceil(x / e.maxTextureSize), x = e.maxTextureSize);
      const b = new Float32Array(x * P * 4 * f), A = new Vc(b, x, P, f);
      A.type = Qt, A.needsUpdate = !0;
      const R = M * 4;
      for (let v = 0; v < f; v++) {
        const C = p[v], F = m[v], L = E[v], D = x * P * 4 * v;
        for (let W = 0; W < C.count; W++) {
          const V = W * R;
          u === !0 && (r.fromBufferAttribute(C, W), b[D + V + 0] = r.x, b[D + V + 1] = r.y, b[D + V + 2] = r.z, b[D + V + 3] = 0), g === !0 && (r.fromBufferAttribute(F, W), b[D + V + 4] = r.x, b[D + V + 5] = r.y, b[D + V + 6] = r.z, b[D + V + 7] = 0), _ === !0 && (r.fromBufferAttribute(L, W), b[D + V + 8] = r.x, b[D + V + 9] = r.y, b[D + V + 10] = r.z, b[D + V + 11] = L.itemSize === 4 ? r.w : 1);
        }
      }
      d = {
        count: f,
        texture: A,
        size: new we(x, P)
      }, i.set(o, d), o.addEventListener("dispose", S);
    }
    if (a.isInstancedMesh === !0 && a.morphTexture !== null)
      c.getUniforms().setValue(t, "morphTexture", a.morphTexture, n);
    else {
      let u = 0;
      for (let _ = 0; _ < l.length; _++)
        u += l[_];
      const g = o.morphTargetsRelative ? 1 : 1 - u;
      c.getUniforms().setValue(t, "morphTargetBaseInfluence", g), c.getUniforms().setValue(t, "morphTargetInfluences", l);
    }
    c.getUniforms().setValue(t, "morphTargetsTexture", d.texture, n), c.getUniforms().setValue(t, "morphTargetsTextureSize", d.size);
  }
  return {
    update: s
  };
}
function _m(t, e, n, i) {
  let r = /* @__PURE__ */ new WeakMap();
  function s(c) {
    const l = i.render.frame, h = c.geometry, f = e.get(c, h);
    if (r.get(f) !== l && (e.update(f), r.set(f, l)), c.isInstancedMesh && (c.hasEventListener("dispose", o) === !1 && c.addEventListener("dispose", o), r.get(c) !== l && (n.update(c.instanceMatrix, t.ARRAY_BUFFER), c.instanceColor !== null && n.update(c.instanceColor, t.ARRAY_BUFFER), r.set(c, l))), c.isSkinnedMesh) {
      const d = c.skeleton;
      r.get(d) !== l && (d.update(), r.set(d, l));
    }
    return f;
  }
  function a() {
    r = /* @__PURE__ */ new WeakMap();
  }
  function o(c) {
    const l = c.target;
    l.removeEventListener("dispose", o), n.remove(l.instanceMatrix), l.instanceColor !== null && n.remove(l.instanceColor);
  }
  return {
    update: s,
    dispose: a
  };
}
class Jc extends St {
  constructor(e, n, i, r, s, a, o, c, l, h = yi) {
    if (h !== yi && h !== wi)
      throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");
    i === void 0 && h === yi && (i = Yn), i === void 0 && h === wi && (i = Ai), super(null, r, s, a, o, c, h, i, l), this.isDepthTexture = !0, this.image = { width: e, height: n }, this.magFilter = o !== void 0 ? o : Nt, this.minFilter = c !== void 0 ? c : Nt, this.flipY = !1, this.generateMipmaps = !1, this.compareFunction = null;
  }
  copy(e) {
    return super.copy(e), this.compareFunction = e.compareFunction, this;
  }
  toJSON(e) {
    const n = super.toJSON(e);
    return this.compareFunction !== null && (n.compareFunction = this.compareFunction), n;
  }
}
const Qc = /* @__PURE__ */ new St(), Fo = /* @__PURE__ */ new Jc(1, 1), el = /* @__PURE__ */ new Vc(), tl = /* @__PURE__ */ new id(), nl = /* @__PURE__ */ new jc(), Oo = [], zo = [], Bo = new Float32Array(16), Ho = new Float32Array(9), ko = new Float32Array(4);
function Di(t, e, n) {
  const i = t[0];
  if (i <= 0 || i > 0) return t;
  const r = e * n;
  let s = Oo[r];
  if (s === void 0 && (s = new Float32Array(r), Oo[r] = s), e !== 0) {
    i.toArray(s, 0);
    for (let a = 1, o = 0; a !== e; ++a)
      o += n, t[a].toArray(s, o);
  }
  return s;
}
function dt(t, e) {
  if (t.length !== e.length) return !1;
  for (let n = 0, i = t.length; n < i; n++)
    if (t[n] !== e[n]) return !1;
  return !0;
}
function ut(t, e) {
  for (let n = 0, i = e.length; n < i; n++)
    t[n] = e[n];
}
function Xr(t, e) {
  let n = zo[e];
  n === void 0 && (n = new Int32Array(e), zo[e] = n);
  for (let i = 0; i !== e; ++i)
    n[i] = t.allocateTextureUnit();
  return n;
}
function vm(t, e) {
  const n = this.cache;
  n[0] !== e && (t.uniform1f(this.addr, e), n[0] = e);
}
function xm(t, e) {
  const n = this.cache;
  if (e.x !== void 0)
    (n[0] !== e.x || n[1] !== e.y) && (t.uniform2f(this.addr, e.x, e.y), n[0] = e.x, n[1] = e.y);
  else {
    if (dt(n, e)) return;
    t.uniform2fv(this.addr, e), ut(n, e);
  }
}
function Mm(t, e) {
  const n = this.cache;
  if (e.x !== void 0)
    (n[0] !== e.x || n[1] !== e.y || n[2] !== e.z) && (t.uniform3f(this.addr, e.x, e.y, e.z), n[0] = e.x, n[1] = e.y, n[2] = e.z);
  else if (e.r !== void 0)
    (n[0] !== e.r || n[1] !== e.g || n[2] !== e.b) && (t.uniform3f(this.addr, e.r, e.g, e.b), n[0] = e.r, n[1] = e.g, n[2] = e.b);
  else {
    if (dt(n, e)) return;
    t.uniform3fv(this.addr, e), ut(n, e);
  }
}
function ym(t, e) {
  const n = this.cache;
  if (e.x !== void 0)
    (n[0] !== e.x || n[1] !== e.y || n[2] !== e.z || n[3] !== e.w) && (t.uniform4f(this.addr, e.x, e.y, e.z, e.w), n[0] = e.x, n[1] = e.y, n[2] = e.z, n[3] = e.w);
  else {
    if (dt(n, e)) return;
    t.uniform4fv(this.addr, e), ut(n, e);
  }
}
function Sm(t, e) {
  const n = this.cache, i = e.elements;
  if (i === void 0) {
    if (dt(n, e)) return;
    t.uniformMatrix2fv(this.addr, !1, e), ut(n, e);
  } else {
    if (dt(n, i)) return;
    ko.set(i), t.uniformMatrix2fv(this.addr, !1, ko), ut(n, i);
  }
}
function Em(t, e) {
  const n = this.cache, i = e.elements;
  if (i === void 0) {
    if (dt(n, e)) return;
    t.uniformMatrix3fv(this.addr, !1, e), ut(n, e);
  } else {
    if (dt(n, i)) return;
    Ho.set(i), t.uniformMatrix3fv(this.addr, !1, Ho), ut(n, i);
  }
}
function Tm(t, e) {
  const n = this.cache, i = e.elements;
  if (i === void 0) {
    if (dt(n, e)) return;
    t.uniformMatrix4fv(this.addr, !1, e), ut(n, e);
  } else {
    if (dt(n, i)) return;
    Bo.set(i), t.uniformMatrix4fv(this.addr, !1, Bo), ut(n, i);
  }
}
function bm(t, e) {
  const n = this.cache;
  n[0] !== e && (t.uniform1i(this.addr, e), n[0] = e);
}
function Am(t, e) {
  const n = this.cache;
  if (e.x !== void 0)
    (n[0] !== e.x || n[1] !== e.y) && (t.uniform2i(this.addr, e.x, e.y), n[0] = e.x, n[1] = e.y);
  else {
    if (dt(n, e)) return;
    t.uniform2iv(this.addr, e), ut(n, e);
  }
}
function wm(t, e) {
  const n = this.cache;
  if (e.x !== void 0)
    (n[0] !== e.x || n[1] !== e.y || n[2] !== e.z) && (t.uniform3i(this.addr, e.x, e.y, e.z), n[0] = e.x, n[1] = e.y, n[2] = e.z);
  else {
    if (dt(n, e)) return;
    t.uniform3iv(this.addr, e), ut(n, e);
  }
}
function Rm(t, e) {
  const n = this.cache;
  if (e.x !== void 0)
    (n[0] !== e.x || n[1] !== e.y || n[2] !== e.z || n[3] !== e.w) && (t.uniform4i(this.addr, e.x, e.y, e.z, e.w), n[0] = e.x, n[1] = e.y, n[2] = e.z, n[3] = e.w);
  else {
    if (dt(n, e)) return;
    t.uniform4iv(this.addr, e), ut(n, e);
  }
}
function Cm(t, e) {
  const n = this.cache;
  n[0] !== e && (t.uniform1ui(this.addr, e), n[0] = e);
}
function Pm(t, e) {
  const n = this.cache;
  if (e.x !== void 0)
    (n[0] !== e.x || n[1] !== e.y) && (t.uniform2ui(this.addr, e.x, e.y), n[0] = e.x, n[1] = e.y);
  else {
    if (dt(n, e)) return;
    t.uniform2uiv(this.addr, e), ut(n, e);
  }
}
function Dm(t, e) {
  const n = this.cache;
  if (e.x !== void 0)
    (n[0] !== e.x || n[1] !== e.y || n[2] !== e.z) && (t.uniform3ui(this.addr, e.x, e.y, e.z), n[0] = e.x, n[1] = e.y, n[2] = e.z);
  else {
    if (dt(n, e)) return;
    t.uniform3uiv(this.addr, e), ut(n, e);
  }
}
function Lm(t, e) {
  const n = this.cache;
  if (e.x !== void 0)
    (n[0] !== e.x || n[1] !== e.y || n[2] !== e.z || n[3] !== e.w) && (t.uniform4ui(this.addr, e.x, e.y, e.z, e.w), n[0] = e.x, n[1] = e.y, n[2] = e.z, n[3] = e.w);
  else {
    if (dt(n, e)) return;
    t.uniform4uiv(this.addr, e), ut(n, e);
  }
}
function Im(t, e, n) {
  const i = this.cache, r = n.allocateTextureUnit();
  i[0] !== r && (t.uniform1i(this.addr, r), i[0] = r);
  let s;
  this.type === t.SAMPLER_2D_SHADOW ? (Fo.compareFunction = Bc, s = Fo) : s = Qc, n.setTexture2D(e || s, r);
}
function Um(t, e, n) {
  const i = this.cache, r = n.allocateTextureUnit();
  i[0] !== r && (t.uniform1i(this.addr, r), i[0] = r), n.setTexture3D(e || tl, r);
}
function Nm(t, e, n) {
  const i = this.cache, r = n.allocateTextureUnit();
  i[0] !== r && (t.uniform1i(this.addr, r), i[0] = r), n.setTextureCube(e || nl, r);
}
function Fm(t, e, n) {
  const i = this.cache, r = n.allocateTextureUnit();
  i[0] !== r && (t.uniform1i(this.addr, r), i[0] = r), n.setTexture2DArray(e || el, r);
}
function Om(t) {
  switch (t) {
    case 5126:
      return vm;
    // FLOAT
    case 35664:
      return xm;
    // _VEC2
    case 35665:
      return Mm;
    // _VEC3
    case 35666:
      return ym;
    // _VEC4
    case 35674:
      return Sm;
    // _MAT2
    case 35675:
      return Em;
    // _MAT3
    case 35676:
      return Tm;
    // _MAT4
    case 5124:
    case 35670:
      return bm;
    // INT, BOOL
    case 35667:
    case 35671:
      return Am;
    // _VEC2
    case 35668:
    case 35672:
      return wm;
    // _VEC3
    case 35669:
    case 35673:
      return Rm;
    // _VEC4
    case 5125:
      return Cm;
    // UINT
    case 36294:
      return Pm;
    // _VEC2
    case 36295:
      return Dm;
    // _VEC3
    case 36296:
      return Lm;
    // _VEC4
    case 35678:
    // SAMPLER_2D
    case 36198:
    // SAMPLER_EXTERNAL_OES
    case 36298:
    // INT_SAMPLER_2D
    case 36306:
    // UNSIGNED_INT_SAMPLER_2D
    case 35682:
      return Im;
    case 35679:
    // SAMPLER_3D
    case 36299:
    // INT_SAMPLER_3D
    case 36307:
      return Um;
    case 35680:
    // SAMPLER_CUBE
    case 36300:
    // INT_SAMPLER_CUBE
    case 36308:
    // UNSIGNED_INT_SAMPLER_CUBE
    case 36293:
      return Nm;
    case 36289:
    // SAMPLER_2D_ARRAY
    case 36303:
    // INT_SAMPLER_2D_ARRAY
    case 36311:
    // UNSIGNED_INT_SAMPLER_2D_ARRAY
    case 36292:
      return Fm;
  }
}
function zm(t, e) {
  t.uniform1fv(this.addr, e);
}
function Bm(t, e) {
  const n = Di(e, this.size, 2);
  t.uniform2fv(this.addr, n);
}
function Hm(t, e) {
  const n = Di(e, this.size, 3);
  t.uniform3fv(this.addr, n);
}
function km(t, e) {
  const n = Di(e, this.size, 4);
  t.uniform4fv(this.addr, n);
}
function Vm(t, e) {
  const n = Di(e, this.size, 4);
  t.uniformMatrix2fv(this.addr, !1, n);
}
function Gm(t, e) {
  const n = Di(e, this.size, 9);
  t.uniformMatrix3fv(this.addr, !1, n);
}
function Wm(t, e) {
  const n = Di(e, this.size, 16);
  t.uniformMatrix4fv(this.addr, !1, n);
}
function Xm(t, e) {
  t.uniform1iv(this.addr, e);
}
function qm(t, e) {
  t.uniform2iv(this.addr, e);
}
function $m(t, e) {
  t.uniform3iv(this.addr, e);
}
function Ym(t, e) {
  t.uniform4iv(this.addr, e);
}
function jm(t, e) {
  t.uniform1uiv(this.addr, e);
}
function Zm(t, e) {
  t.uniform2uiv(this.addr, e);
}
function Km(t, e) {
  t.uniform3uiv(this.addr, e);
}
function Jm(t, e) {
  t.uniform4uiv(this.addr, e);
}
function Qm(t, e, n) {
  const i = this.cache, r = e.length, s = Xr(n, r);
  dt(i, s) || (t.uniform1iv(this.addr, s), ut(i, s));
  for (let a = 0; a !== r; ++a)
    n.setTexture2D(e[a] || Qc, s[a]);
}
function e0(t, e, n) {
  const i = this.cache, r = e.length, s = Xr(n, r);
  dt(i, s) || (t.uniform1iv(this.addr, s), ut(i, s));
  for (let a = 0; a !== r; ++a)
    n.setTexture3D(e[a] || tl, s[a]);
}
function t0(t, e, n) {
  const i = this.cache, r = e.length, s = Xr(n, r);
  dt(i, s) || (t.uniform1iv(this.addr, s), ut(i, s));
  for (let a = 0; a !== r; ++a)
    n.setTextureCube(e[a] || nl, s[a]);
}
function n0(t, e, n) {
  const i = this.cache, r = e.length, s = Xr(n, r);
  dt(i, s) || (t.uniform1iv(this.addr, s), ut(i, s));
  for (let a = 0; a !== r; ++a)
    n.setTexture2DArray(e[a] || el, s[a]);
}
function i0(t) {
  switch (t) {
    case 5126:
      return zm;
    // FLOAT
    case 35664:
      return Bm;
    // _VEC2
    case 35665:
      return Hm;
    // _VEC3
    case 35666:
      return km;
    // _VEC4
    case 35674:
      return Vm;
    // _MAT2
    case 35675:
      return Gm;
    // _MAT3
    case 35676:
      return Wm;
    // _MAT4
    case 5124:
    case 35670:
      return Xm;
    // INT, BOOL
    case 35667:
    case 35671:
      return qm;
    // _VEC2
    case 35668:
    case 35672:
      return $m;
    // _VEC3
    case 35669:
    case 35673:
      return Ym;
    // _VEC4
    case 5125:
      return jm;
    // UINT
    case 36294:
      return Zm;
    // _VEC2
    case 36295:
      return Km;
    // _VEC3
    case 36296:
      return Jm;
    // _VEC4
    case 35678:
    // SAMPLER_2D
    case 36198:
    // SAMPLER_EXTERNAL_OES
    case 36298:
    // INT_SAMPLER_2D
    case 36306:
    // UNSIGNED_INT_SAMPLER_2D
    case 35682:
      return Qm;
    case 35679:
    // SAMPLER_3D
    case 36299:
    // INT_SAMPLER_3D
    case 36307:
      return e0;
    case 35680:
    // SAMPLER_CUBE
    case 36300:
    // INT_SAMPLER_CUBE
    case 36308:
    // UNSIGNED_INT_SAMPLER_CUBE
    case 36293:
      return t0;
    case 36289:
    // SAMPLER_2D_ARRAY
    case 36303:
    // INT_SAMPLER_2D_ARRAY
    case 36311:
    // UNSIGNED_INT_SAMPLER_2D_ARRAY
    case 36292:
      return n0;
  }
}
class r0 {
  constructor(e, n, i) {
    this.id = e, this.addr = i, this.cache = [], this.type = n.type, this.setValue = Om(n.type);
  }
}
class s0 {
  constructor(e, n, i) {
    this.id = e, this.addr = i, this.cache = [], this.type = n.type, this.size = n.size, this.setValue = i0(n.type);
  }
}
class a0 {
  constructor(e) {
    this.id = e, this.seq = [], this.map = {};
  }
  setValue(e, n, i) {
    const r = this.seq;
    for (let s = 0, a = r.length; s !== a; ++s) {
      const o = r[s];
      o.setValue(e, n[o.id], i);
    }
  }
}
const Es = /(\w+)(\])?(\[|\.)?/g;
function Vo(t, e) {
  t.seq.push(e), t.map[e.id] = e;
}
function o0(t, e, n) {
  const i = t.name, r = i.length;
  for (Es.lastIndex = 0; ; ) {
    const s = Es.exec(i), a = Es.lastIndex;
    let o = s[1];
    const c = s[2] === "]", l = s[3];
    if (c && (o = o | 0), l === void 0 || l === "[" && a + 2 === r) {
      Vo(n, l === void 0 ? new r0(o, t, e) : new s0(o, t, e));
      break;
    } else {
      let f = n.map[o];
      f === void 0 && (f = new a0(o), Vo(n, f)), n = f;
    }
  }
}
class Nr {
  constructor(e, n) {
    this.seq = [], this.map = {};
    const i = e.getProgramParameter(n, e.ACTIVE_UNIFORMS);
    for (let r = 0; r < i; ++r) {
      const s = e.getActiveUniform(n, r), a = e.getUniformLocation(n, s.name);
      o0(s, a, this);
    }
  }
  setValue(e, n, i, r) {
    const s = this.map[n];
    s !== void 0 && s.setValue(e, i, r);
  }
  setOptional(e, n, i) {
    const r = n[i];
    r !== void 0 && this.setValue(e, i, r);
  }
  static upload(e, n, i, r) {
    for (let s = 0, a = n.length; s !== a; ++s) {
      const o = n[s], c = i[o.id];
      c.needsUpdate !== !1 && o.setValue(e, c.value, r);
    }
  }
  static seqWithValue(e, n) {
    const i = [];
    for (let r = 0, s = e.length; r !== s; ++r) {
      const a = e[r];
      a.id in n && i.push(a);
    }
    return i;
  }
}
function Go(t, e, n) {
  const i = t.createShader(e);
  return t.shaderSource(i, n), t.compileShader(i), i;
}
const c0 = 37297;
let l0 = 0;
function h0(t, e) {
  const n = t.split(`
`), i = [], r = Math.max(e - 6, 0), s = Math.min(e + 6, n.length);
  for (let a = r; a < s; a++) {
    const o = a + 1;
    i.push(`${o === e ? ">" : " "} ${o}: ${n[a]}`);
  }
  return i.join(`
`);
}
const Wo = /* @__PURE__ */ new De();
function f0(t) {
  Ge._getMatrix(Wo, Ge.workingColorSpace, t);
  const e = `mat3( ${Wo.elements.map((n) => n.toFixed(4))} )`;
  switch (Ge.getTransfer(t)) {
    case Gr:
      return [e, "LinearTransferOETF"];
    case Ze:
      return [e, "sRGBTransferOETF"];
    default:
      return console.warn("THREE.WebGLProgram: Unsupported color space: ", t), [e, "LinearTransferOETF"];
  }
}
function Xo(t, e, n) {
  const i = t.getShaderParameter(e, t.COMPILE_STATUS), r = t.getShaderInfoLog(e).trim();
  if (i && r === "") return "";
  const s = /ERROR: 0:(\d+)/.exec(r);
  if (s) {
    const a = parseInt(s[1]);
    return n.toUpperCase() + `

` + r + `

` + h0(t.getShaderSource(e), a);
  } else
    return r;
}
function d0(t, e) {
  const n = f0(e);
  return [
    `vec4 ${t}( vec4 value ) {`,
    `	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,
    "}"
  ].join(`
`);
}
function u0(t, e) {
  let n;
  switch (e) {
    case Rf:
      n = "Linear";
      break;
    case Cf:
      n = "Reinhard";
      break;
    case Pf:
      n = "Cineon";
      break;
    case Df:
      n = "ACESFilmic";
      break;
    case If:
      n = "AgX";
      break;
    case Uf:
      n = "Neutral";
      break;
    case Lf:
      n = "Custom";
      break;
    default:
      console.warn("THREE.WebGLProgram: Unsupported toneMapping:", e), n = "Linear";
  }
  return "vec3 " + t + "( vec3 color ) { return " + n + "ToneMapping( color ); }";
}
const yr = /* @__PURE__ */ new z();
function p0() {
  Ge.getLuminanceCoefficients(yr);
  const t = yr.x.toFixed(4), e = yr.y.toFixed(4), n = yr.z.toFixed(4);
  return [
    "float luminance( const in vec3 rgb ) {",
    `	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,
    "	return dot( weights, rgb );",
    "}"
  ].join(`
`);
}
function m0(t) {
  return [
    t.extensionClipCullDistance ? "#extension GL_ANGLE_clip_cull_distance : require" : "",
    t.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : ""
  ].filter(Gi).join(`
`);
}
function g0(t) {
  const e = [];
  for (const n in t) {
    const i = t[n];
    i !== !1 && e.push("#define " + n + " " + i);
  }
  return e.join(`
`);
}
function _0(t, e) {
  const n = {}, i = t.getProgramParameter(e, t.ACTIVE_ATTRIBUTES);
  for (let r = 0; r < i; r++) {
    const s = t.getActiveAttrib(e, r), a = s.name;
    let o = 1;
    s.type === t.FLOAT_MAT2 && (o = 2), s.type === t.FLOAT_MAT3 && (o = 3), s.type === t.FLOAT_MAT4 && (o = 4), n[a] = {
      type: s.type,
      location: t.getAttribLocation(e, a),
      locationSize: o
    };
  }
  return n;
}
function Gi(t) {
  return t !== "";
}
function qo(t, e) {
  const n = e.numSpotLightShadows + e.numSpotLightMaps - e.numSpotLightShadowsWithMaps;
  return t.replace(/NUM_DIR_LIGHTS/g, e.numDirLights).replace(/NUM_SPOT_LIGHTS/g, e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, n).replace(/NUM_RECT_AREA_LIGHTS/g, e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, e.numPointLights).replace(/NUM_HEMI_LIGHTS/g, e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g, e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, e.numPointLightShadows);
}
function $o(t, e) {
  return t.replace(/NUM_CLIPPING_PLANES/g, e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, e.numClippingPlanes - e.numClipIntersection);
}
const v0 = /^[ \t]*#include +<([\w\d./]+)>/gm;
function ma(t) {
  return t.replace(v0, M0);
}
const x0 = /* @__PURE__ */ new Map();
function M0(t, e) {
  let n = Ue[e];
  if (n === void 0) {
    const i = x0.get(e);
    if (i !== void 0)
      n = Ue[i], console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.', e, i);
    else
      throw new Error("Can not resolve #include <" + e + ">");
  }
  return ma(n);
}
const y0 = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function Yo(t) {
  return t.replace(y0, S0);
}
function S0(t, e, n, i) {
  let r = "";
  for (let s = parseInt(e); s < parseInt(n); s++)
    r += i.replace(/\[\s*i\s*\]/g, "[ " + s + " ]").replace(/UNROLLED_LOOP_INDEX/g, s);
  return r;
}
function jo(t) {
  let e = `precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;
  return t.precision === "highp" ? e += `
#define HIGH_PRECISION` : t.precision === "mediump" ? e += `
#define MEDIUM_PRECISION` : t.precision === "lowp" && (e += `
#define LOW_PRECISION`), e;
}
function E0(t) {
  let e = "SHADOWMAP_TYPE_BASIC";
  return t.shadowMapType === wc ? e = "SHADOWMAP_TYPE_PCF" : t.shadowMapType === of ? e = "SHADOWMAP_TYPE_PCF_SOFT" : t.shadowMapType === fn && (e = "SHADOWMAP_TYPE_VSM"), e;
}
function T0(t) {
  let e = "ENVMAP_TYPE_CUBE";
  if (t.envMap)
    switch (t.envMapMode) {
      case Ti:
      case bi:
        e = "ENVMAP_TYPE_CUBE";
        break;
      case Vr:
        e = "ENVMAP_TYPE_CUBE_UV";
        break;
    }
  return e;
}
function b0(t) {
  let e = "ENVMAP_MODE_REFLECTION";
  if (t.envMap)
    switch (t.envMapMode) {
      case bi:
        e = "ENVMAP_MODE_REFRACTION";
        break;
    }
  return e;
}
function A0(t) {
  let e = "ENVMAP_BLENDING_NONE";
  if (t.envMap)
    switch (t.combine) {
      case Rc:
        e = "ENVMAP_BLENDING_MULTIPLY";
        break;
      case Af:
        e = "ENVMAP_BLENDING_MIX";
        break;
      case wf:
        e = "ENVMAP_BLENDING_ADD";
        break;
    }
  return e;
}
function w0(t) {
  const e = t.envMapCubeUVHeight;
  if (e === null) return null;
  const n = Math.log2(e) - 2, i = 1 / e;
  return { texelWidth: 1 / (3 * Math.max(Math.pow(2, n), 112)), texelHeight: i, maxMip: n };
}
function R0(t, e, n, i) {
  const r = t.getContext(), s = n.defines;
  let a = n.vertexShader, o = n.fragmentShader;
  const c = E0(n), l = T0(n), h = b0(n), f = A0(n), d = w0(n), u = m0(n), g = g0(s), _ = r.createProgram();
  let p, m, E = n.glslVersion ? "#version " + n.glslVersion + `
` : "";
  n.isRawShaderMaterial ? (p = [
    "#define SHADER_TYPE " + n.shaderType,
    "#define SHADER_NAME " + n.shaderName,
    g
  ].filter(Gi).join(`
`), p.length > 0 && (p += `
`), m = [
    "#define SHADER_TYPE " + n.shaderType,
    "#define SHADER_NAME " + n.shaderName,
    g
  ].filter(Gi).join(`
`), m.length > 0 && (m += `
`)) : (p = [
    jo(n),
    "#define SHADER_TYPE " + n.shaderType,
    "#define SHADER_NAME " + n.shaderName,
    g,
    n.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "",
    n.batching ? "#define USE_BATCHING" : "",
    n.batchingColor ? "#define USE_BATCHING_COLOR" : "",
    n.instancing ? "#define USE_INSTANCING" : "",
    n.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
    n.instancingMorph ? "#define USE_INSTANCING_MORPH" : "",
    n.useFog && n.fog ? "#define USE_FOG" : "",
    n.useFog && n.fogExp2 ? "#define FOG_EXP2" : "",
    n.map ? "#define USE_MAP" : "",
    n.envMap ? "#define USE_ENVMAP" : "",
    n.envMap ? "#define " + h : "",
    n.lightMap ? "#define USE_LIGHTMAP" : "",
    n.aoMap ? "#define USE_AOMAP" : "",
    n.bumpMap ? "#define USE_BUMPMAP" : "",
    n.normalMap ? "#define USE_NORMALMAP" : "",
    n.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
    n.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
    n.displacementMap ? "#define USE_DISPLACEMENTMAP" : "",
    n.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
    n.anisotropy ? "#define USE_ANISOTROPY" : "",
    n.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
    n.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
    n.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
    n.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
    n.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
    n.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
    n.specularMap ? "#define USE_SPECULARMAP" : "",
    n.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
    n.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
    n.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
    n.metalnessMap ? "#define USE_METALNESSMAP" : "",
    n.alphaMap ? "#define USE_ALPHAMAP" : "",
    n.alphaHash ? "#define USE_ALPHAHASH" : "",
    n.transmission ? "#define USE_TRANSMISSION" : "",
    n.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
    n.thicknessMap ? "#define USE_THICKNESSMAP" : "",
    n.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
    n.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
    //
    n.mapUv ? "#define MAP_UV " + n.mapUv : "",
    n.alphaMapUv ? "#define ALPHAMAP_UV " + n.alphaMapUv : "",
    n.lightMapUv ? "#define LIGHTMAP_UV " + n.lightMapUv : "",
    n.aoMapUv ? "#define AOMAP_UV " + n.aoMapUv : "",
    n.emissiveMapUv ? "#define EMISSIVEMAP_UV " + n.emissiveMapUv : "",
    n.bumpMapUv ? "#define BUMPMAP_UV " + n.bumpMapUv : "",
    n.normalMapUv ? "#define NORMALMAP_UV " + n.normalMapUv : "",
    n.displacementMapUv ? "#define DISPLACEMENTMAP_UV " + n.displacementMapUv : "",
    n.metalnessMapUv ? "#define METALNESSMAP_UV " + n.metalnessMapUv : "",
    n.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + n.roughnessMapUv : "",
    n.anisotropyMapUv ? "#define ANISOTROPYMAP_UV " + n.anisotropyMapUv : "",
    n.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + n.clearcoatMapUv : "",
    n.clearcoatNormalMapUv ? "#define CLEARCOAT_NORMALMAP_UV " + n.clearcoatNormalMapUv : "",
    n.clearcoatRoughnessMapUv ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + n.clearcoatRoughnessMapUv : "",
    n.iridescenceMapUv ? "#define IRIDESCENCEMAP_UV " + n.iridescenceMapUv : "",
    n.iridescenceThicknessMapUv ? "#define IRIDESCENCE_THICKNESSMAP_UV " + n.iridescenceThicknessMapUv : "",
    n.sheenColorMapUv ? "#define SHEEN_COLORMAP_UV " + n.sheenColorMapUv : "",
    n.sheenRoughnessMapUv ? "#define SHEEN_ROUGHNESSMAP_UV " + n.sheenRoughnessMapUv : "",
    n.specularMapUv ? "#define SPECULARMAP_UV " + n.specularMapUv : "",
    n.specularColorMapUv ? "#define SPECULAR_COLORMAP_UV " + n.specularColorMapUv : "",
    n.specularIntensityMapUv ? "#define SPECULAR_INTENSITYMAP_UV " + n.specularIntensityMapUv : "",
    n.transmissionMapUv ? "#define TRANSMISSIONMAP_UV " + n.transmissionMapUv : "",
    n.thicknessMapUv ? "#define THICKNESSMAP_UV " + n.thicknessMapUv : "",
    //
    n.vertexTangents && n.flatShading === !1 ? "#define USE_TANGENT" : "",
    n.vertexColors ? "#define USE_COLOR" : "",
    n.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
    n.vertexUv1s ? "#define USE_UV1" : "",
    n.vertexUv2s ? "#define USE_UV2" : "",
    n.vertexUv3s ? "#define USE_UV3" : "",
    n.pointsUvs ? "#define USE_POINTS_UV" : "",
    n.flatShading ? "#define FLAT_SHADED" : "",
    n.skinning ? "#define USE_SKINNING" : "",
    n.morphTargets ? "#define USE_MORPHTARGETS" : "",
    n.morphNormals && n.flatShading === !1 ? "#define USE_MORPHNORMALS" : "",
    n.morphColors ? "#define USE_MORPHCOLORS" : "",
    n.morphTargetsCount > 0 ? "#define MORPHTARGETS_TEXTURE_STRIDE " + n.morphTextureStride : "",
    n.morphTargetsCount > 0 ? "#define MORPHTARGETS_COUNT " + n.morphTargetsCount : "",
    n.doubleSided ? "#define DOUBLE_SIDED" : "",
    n.flipSided ? "#define FLIP_SIDED" : "",
    n.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
    n.shadowMapEnabled ? "#define " + c : "",
    n.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
    n.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
    n.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
    n.reverseDepthBuffer ? "#define USE_REVERSEDEPTHBUF" : "",
    "uniform mat4 modelMatrix;",
    "uniform mat4 modelViewMatrix;",
    "uniform mat4 projectionMatrix;",
    "uniform mat4 viewMatrix;",
    "uniform mat3 normalMatrix;",
    "uniform vec3 cameraPosition;",
    "uniform bool isOrthographic;",
    "#ifdef USE_INSTANCING",
    "	attribute mat4 instanceMatrix;",
    "#endif",
    "#ifdef USE_INSTANCING_COLOR",
    "	attribute vec3 instanceColor;",
    "#endif",
    "#ifdef USE_INSTANCING_MORPH",
    "	uniform sampler2D morphTexture;",
    "#endif",
    "attribute vec3 position;",
    "attribute vec3 normal;",
    "attribute vec2 uv;",
    "#ifdef USE_UV1",
    "	attribute vec2 uv1;",
    "#endif",
    "#ifdef USE_UV2",
    "	attribute vec2 uv2;",
    "#endif",
    "#ifdef USE_UV3",
    "	attribute vec2 uv3;",
    "#endif",
    "#ifdef USE_TANGENT",
    "	attribute vec4 tangent;",
    "#endif",
    "#if defined( USE_COLOR_ALPHA )",
    "	attribute vec4 color;",
    "#elif defined( USE_COLOR )",
    "	attribute vec3 color;",
    "#endif",
    "#ifdef USE_SKINNING",
    "	attribute vec4 skinIndex;",
    "	attribute vec4 skinWeight;",
    "#endif",
    `
`
  ].filter(Gi).join(`
`), m = [
    jo(n),
    "#define SHADER_TYPE " + n.shaderType,
    "#define SHADER_NAME " + n.shaderName,
    g,
    n.useFog && n.fog ? "#define USE_FOG" : "",
    n.useFog && n.fogExp2 ? "#define FOG_EXP2" : "",
    n.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "",
    n.map ? "#define USE_MAP" : "",
    n.matcap ? "#define USE_MATCAP" : "",
    n.envMap ? "#define USE_ENVMAP" : "",
    n.envMap ? "#define " + l : "",
    n.envMap ? "#define " + h : "",
    n.envMap ? "#define " + f : "",
    d ? "#define CUBEUV_TEXEL_WIDTH " + d.texelWidth : "",
    d ? "#define CUBEUV_TEXEL_HEIGHT " + d.texelHeight : "",
    d ? "#define CUBEUV_MAX_MIP " + d.maxMip + ".0" : "",
    n.lightMap ? "#define USE_LIGHTMAP" : "",
    n.aoMap ? "#define USE_AOMAP" : "",
    n.bumpMap ? "#define USE_BUMPMAP" : "",
    n.normalMap ? "#define USE_NORMALMAP" : "",
    n.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
    n.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
    n.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
    n.anisotropy ? "#define USE_ANISOTROPY" : "",
    n.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
    n.clearcoat ? "#define USE_CLEARCOAT" : "",
    n.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
    n.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
    n.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
    n.dispersion ? "#define USE_DISPERSION" : "",
    n.iridescence ? "#define USE_IRIDESCENCE" : "",
    n.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
    n.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
    n.specularMap ? "#define USE_SPECULARMAP" : "",
    n.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
    n.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
    n.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
    n.metalnessMap ? "#define USE_METALNESSMAP" : "",
    n.alphaMap ? "#define USE_ALPHAMAP" : "",
    n.alphaTest ? "#define USE_ALPHATEST" : "",
    n.alphaHash ? "#define USE_ALPHAHASH" : "",
    n.sheen ? "#define USE_SHEEN" : "",
    n.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
    n.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
    n.transmission ? "#define USE_TRANSMISSION" : "",
    n.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
    n.thicknessMap ? "#define USE_THICKNESSMAP" : "",
    n.vertexTangents && n.flatShading === !1 ? "#define USE_TANGENT" : "",
    n.vertexColors || n.instancingColor || n.batchingColor ? "#define USE_COLOR" : "",
    n.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
    n.vertexUv1s ? "#define USE_UV1" : "",
    n.vertexUv2s ? "#define USE_UV2" : "",
    n.vertexUv3s ? "#define USE_UV3" : "",
    n.pointsUvs ? "#define USE_POINTS_UV" : "",
    n.gradientMap ? "#define USE_GRADIENTMAP" : "",
    n.flatShading ? "#define FLAT_SHADED" : "",
    n.doubleSided ? "#define DOUBLE_SIDED" : "",
    n.flipSided ? "#define FLIP_SIDED" : "",
    n.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
    n.shadowMapEnabled ? "#define " + c : "",
    n.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
    n.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
    n.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "",
    n.decodeVideoTextureEmissive ? "#define DECODE_VIDEO_TEXTURE_EMISSIVE" : "",
    n.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
    n.reverseDepthBuffer ? "#define USE_REVERSEDEPTHBUF" : "",
    "uniform mat4 viewMatrix;",
    "uniform vec3 cameraPosition;",
    "uniform bool isOrthographic;",
    n.toneMapping !== Ln ? "#define TONE_MAPPING" : "",
    n.toneMapping !== Ln ? Ue.tonemapping_pars_fragment : "",
    // this code is required here because it is used by the toneMapping() function defined below
    n.toneMapping !== Ln ? u0("toneMapping", n.toneMapping) : "",
    n.dithering ? "#define DITHERING" : "",
    n.opaque ? "#define OPAQUE" : "",
    Ue.colorspace_pars_fragment,
    // this code is required here because it is used by the various encoding/decoding function defined below
    d0("linearToOutputTexel", n.outputColorSpace),
    p0(),
    n.useDepthPacking ? "#define DEPTH_PACKING " + n.depthPacking : "",
    `
`
  ].filter(Gi).join(`
`)), a = ma(a), a = qo(a, n), a = $o(a, n), o = ma(o), o = qo(o, n), o = $o(o, n), a = Yo(a), o = Yo(o), n.isRawShaderMaterial !== !0 && (E = `#version 300 es
`, p = [
    u,
    "#define attribute in",
    "#define varying out",
    "#define texture2D texture"
  ].join(`
`) + `
` + p, m = [
    "#define varying in",
    n.glslVersion === oo ? "" : "layout(location = 0) out highp vec4 pc_fragColor;",
    n.glslVersion === oo ? "" : "#define gl_FragColor pc_fragColor",
    "#define gl_FragDepthEXT gl_FragDepth",
    "#define texture2D texture",
    "#define textureCube texture",
    "#define texture2DProj textureProj",
    "#define texture2DLodEXT textureLod",
    "#define texture2DProjLodEXT textureProjLod",
    "#define textureCubeLodEXT textureLod",
    "#define texture2DGradEXT textureGrad",
    "#define texture2DProjGradEXT textureProjGrad",
    "#define textureCubeGradEXT textureGrad"
  ].join(`
`) + `
` + m);
  const M = E + p + a, x = E + m + o, P = Go(r, r.VERTEX_SHADER, M), b = Go(r, r.FRAGMENT_SHADER, x);
  r.attachShader(_, P), r.attachShader(_, b), n.index0AttributeName !== void 0 ? r.bindAttribLocation(_, 0, n.index0AttributeName) : n.morphTargets === !0 && r.bindAttribLocation(_, 0, "position"), r.linkProgram(_);
  function A(C) {
    if (t.debug.checkShaderErrors) {
      const F = r.getProgramInfoLog(_).trim(), L = r.getShaderInfoLog(P).trim(), D = r.getShaderInfoLog(b).trim();
      let W = !0, V = !0;
      if (r.getProgramParameter(_, r.LINK_STATUS) === !1)
        if (W = !1, typeof t.debug.onShaderError == "function")
          t.debug.onShaderError(r, _, P, b);
        else {
          const K = Xo(r, P, "vertex"), G = Xo(r, b, "fragment");
          console.error(
            "THREE.WebGLProgram: Shader Error " + r.getError() + " - VALIDATE_STATUS " + r.getProgramParameter(_, r.VALIDATE_STATUS) + `

Material Name: ` + C.name + `
Material Type: ` + C.type + `

Program Info Log: ` + F + `
` + K + `
` + G
          );
        }
      else F !== "" ? console.warn("THREE.WebGLProgram: Program Info Log:", F) : (L === "" || D === "") && (V = !1);
      V && (C.diagnostics = {
        runnable: W,
        programLog: F,
        vertexShader: {
          log: L,
          prefix: p
        },
        fragmentShader: {
          log: D,
          prefix: m
        }
      });
    }
    r.deleteShader(P), r.deleteShader(b), R = new Nr(r, _), S = _0(r, _);
  }
  let R;
  this.getUniforms = function() {
    return R === void 0 && A(this), R;
  };
  let S;
  this.getAttributes = function() {
    return S === void 0 && A(this), S;
  };
  let v = n.rendererExtensionParallelShaderCompile === !1;
  return this.isReady = function() {
    return v === !1 && (v = r.getProgramParameter(_, c0)), v;
  }, this.destroy = function() {
    i.releaseStatesOfProgram(this), r.deleteProgram(_), this.program = void 0;
  }, this.type = n.shaderType, this.name = n.shaderName, this.id = l0++, this.cacheKey = e, this.usedTimes = 1, this.program = _, this.vertexShader = P, this.fragmentShader = b, this;
}
let C0 = 0;
class P0 {
  constructor() {
    this.shaderCache = /* @__PURE__ */ new Map(), this.materialCache = /* @__PURE__ */ new Map();
  }
  update(e) {
    const n = e.vertexShader, i = e.fragmentShader, r = this._getShaderStage(n), s = this._getShaderStage(i), a = this._getShaderCacheForMaterial(e);
    return a.has(r) === !1 && (a.add(r), r.usedTimes++), a.has(s) === !1 && (a.add(s), s.usedTimes++), this;
  }
  remove(e) {
    const n = this.materialCache.get(e);
    for (const i of n)
      i.usedTimes--, i.usedTimes === 0 && this.shaderCache.delete(i.code);
    return this.materialCache.delete(e), this;
  }
  getVertexShaderID(e) {
    return this._getShaderStage(e.vertexShader).id;
  }
  getFragmentShaderID(e) {
    return this._getShaderStage(e.fragmentShader).id;
  }
  dispose() {
    this.shaderCache.clear(), this.materialCache.clear();
  }
  _getShaderCacheForMaterial(e) {
    const n = this.materialCache;
    let i = n.get(e);
    return i === void 0 && (i = /* @__PURE__ */ new Set(), n.set(e, i)), i;
  }
  _getShaderStage(e) {
    const n = this.shaderCache;
    let i = n.get(e);
    return i === void 0 && (i = new D0(e), n.set(e, i)), i;
  }
}
class D0 {
  constructor(e) {
    this.id = C0++, this.code = e, this.usedTimes = 0;
  }
}
function L0(t, e, n, i, r, s, a) {
  const o = new Ca(), c = new P0(), l = /* @__PURE__ */ new Set(), h = [], f = r.logarithmicDepthBuffer, d = r.vertexTextures;
  let u = r.precision;
  const g = {
    MeshDepthMaterial: "depth",
    MeshDistanceMaterial: "distanceRGBA",
    MeshNormalMaterial: "normal",
    MeshBasicMaterial: "basic",
    MeshLambertMaterial: "lambert",
    MeshPhongMaterial: "phong",
    MeshToonMaterial: "toon",
    MeshStandardMaterial: "physical",
    MeshPhysicalMaterial: "physical",
    MeshMatcapMaterial: "matcap",
    LineBasicMaterial: "basic",
    LineDashedMaterial: "dashed",
    PointsMaterial: "points",
    ShadowMaterial: "shadow",
    SpriteMaterial: "sprite"
  };
  function _(S) {
    return l.add(S), S === 0 ? "uv" : `uv${S}`;
  }
  function p(S, v, C, F, L) {
    const D = F.fog, W = L.geometry, V = S.isMeshStandardMaterial ? F.environment : null, K = (S.isMeshStandardMaterial ? n : e).get(S.envMap || V), G = K && K.mapping === Vr ? K.image.height : null, te = g[S.type];
    S.precision !== null && (u = r.getMaxPrecision(S.precision), u !== S.precision && console.warn("THREE.WebGLProgram.getParameters:", S.precision, "not supported, using", u, "instead."));
    const ae = W.morphAttributes.position || W.morphAttributes.normal || W.morphAttributes.color, de = ae !== void 0 ? ae.length : 0;
    let Le = 0;
    W.morphAttributes.position !== void 0 && (Le = 1), W.morphAttributes.normal !== void 0 && (Le = 2), W.morphAttributes.color !== void 0 && (Le = 3);
    let Xe, q, Q, he;
    if (te) {
      const Ye = Zt[te];
      Xe = Ye.vertexShader, q = Ye.fragmentShader;
    } else
      Xe = S.vertexShader, q = S.fragmentShader, c.update(S), Q = c.getVertexShaderID(S), he = c.getFragmentShaderID(S);
    const ie = t.getRenderTarget(), Se = t.state.buffers.depth.getReversed(), Re = L.isInstancedMesh === !0, Fe = L.isBatchedMesh === !0, it = !!S.map, ke = !!S.matcap, at = !!K, O = !!S.aoMap, Ft = !!S.lightMap, ze = !!S.bumpMap, Be = !!S.normalMap, Ee = !!S.displacementMap, et = !!S.emissiveMap, ye = !!S.metalnessMap, w = !!S.roughnessMap, y = S.anisotropy > 0, B = S.clearcoat > 0, Y = S.dispersion > 0, Z = S.iridescence > 0, $ = S.sheen > 0, xe = S.transmission > 0, se = y && !!S.anisotropyMap, fe = B && !!S.clearcoatMap, Ve = B && !!S.clearcoatNormalMap, J = B && !!S.clearcoatRoughnessMap, ue = Z && !!S.iridescenceMap, Te = Z && !!S.iridescenceThicknessMap, be = $ && !!S.sheenColorMap, pe = $ && !!S.sheenRoughnessMap, He = !!S.specularMap, Ie = !!S.specularColorMap, Je = !!S.specularIntensityMap, I = xe && !!S.transmissionMap, re = xe && !!S.thicknessMap, X = !!S.gradientMap, j = !!S.alphaMap, le = S.alphaTest > 0, oe = !!S.alphaHash, Ce = !!S.extensions;
    let rt = Ln;
    S.toneMapped && (ie === null || ie.isXRRenderTarget === !0) && (rt = t.toneMapping);
    const vt = {
      shaderID: te,
      shaderType: S.type,
      shaderName: S.name,
      vertexShader: Xe,
      fragmentShader: q,
      defines: S.defines,
      customVertexShaderID: Q,
      customFragmentShaderID: he,
      isRawShaderMaterial: S.isRawShaderMaterial === !0,
      glslVersion: S.glslVersion,
      precision: u,
      batching: Fe,
      batchingColor: Fe && L._colorsTexture !== null,
      instancing: Re,
      instancingColor: Re && L.instanceColor !== null,
      instancingMorph: Re && L.morphTexture !== null,
      supportsVertexTextures: d,
      outputColorSpace: ie === null ? t.outputColorSpace : ie.isXRRenderTarget === !0 ? ie.texture.colorSpace : Ci,
      alphaToCoverage: !!S.alphaToCoverage,
      map: it,
      matcap: ke,
      envMap: at,
      envMapMode: at && K.mapping,
      envMapCubeUVHeight: G,
      aoMap: O,
      lightMap: Ft,
      bumpMap: ze,
      normalMap: Be,
      displacementMap: d && Ee,
      emissiveMap: et,
      normalMapObjectSpace: Be && S.normalMapType === Bf,
      normalMapTangentSpace: Be && S.normalMapType === zf,
      metalnessMap: ye,
      roughnessMap: w,
      anisotropy: y,
      anisotropyMap: se,
      clearcoat: B,
      clearcoatMap: fe,
      clearcoatNormalMap: Ve,
      clearcoatRoughnessMap: J,
      dispersion: Y,
      iridescence: Z,
      iridescenceMap: ue,
      iridescenceThicknessMap: Te,
      sheen: $,
      sheenColorMap: be,
      sheenRoughnessMap: pe,
      specularMap: He,
      specularColorMap: Ie,
      specularIntensityMap: Je,
      transmission: xe,
      transmissionMap: I,
      thicknessMap: re,
      gradientMap: X,
      opaque: S.transparent === !1 && S.blending === Mi && S.alphaToCoverage === !1,
      alphaMap: j,
      alphaTest: le,
      alphaHash: oe,
      combine: S.combine,
      //
      mapUv: it && _(S.map.channel),
      aoMapUv: O && _(S.aoMap.channel),
      lightMapUv: Ft && _(S.lightMap.channel),
      bumpMapUv: ze && _(S.bumpMap.channel),
      normalMapUv: Be && _(S.normalMap.channel),
      displacementMapUv: Ee && _(S.displacementMap.channel),
      emissiveMapUv: et && _(S.emissiveMap.channel),
      metalnessMapUv: ye && _(S.metalnessMap.channel),
      roughnessMapUv: w && _(S.roughnessMap.channel),
      anisotropyMapUv: se && _(S.anisotropyMap.channel),
      clearcoatMapUv: fe && _(S.clearcoatMap.channel),
      clearcoatNormalMapUv: Ve && _(S.clearcoatNormalMap.channel),
      clearcoatRoughnessMapUv: J && _(S.clearcoatRoughnessMap.channel),
      iridescenceMapUv: ue && _(S.iridescenceMap.channel),
      iridescenceThicknessMapUv: Te && _(S.iridescenceThicknessMap.channel),
      sheenColorMapUv: be && _(S.sheenColorMap.channel),
      sheenRoughnessMapUv: pe && _(S.sheenRoughnessMap.channel),
      specularMapUv: He && _(S.specularMap.channel),
      specularColorMapUv: Ie && _(S.specularColorMap.channel),
      specularIntensityMapUv: Je && _(S.specularIntensityMap.channel),
      transmissionMapUv: I && _(S.transmissionMap.channel),
      thicknessMapUv: re && _(S.thicknessMap.channel),
      alphaMapUv: j && _(S.alphaMap.channel),
      //
      vertexTangents: !!W.attributes.tangent && (Be || y),
      vertexColors: S.vertexColors,
      vertexAlphas: S.vertexColors === !0 && !!W.attributes.color && W.attributes.color.itemSize === 4,
      pointsUvs: L.isPoints === !0 && !!W.attributes.uv && (it || j),
      fog: !!D,
      useFog: S.fog === !0,
      fogExp2: !!D && D.isFogExp2,
      flatShading: S.flatShading === !0,
      sizeAttenuation: S.sizeAttenuation === !0,
      logarithmicDepthBuffer: f,
      reverseDepthBuffer: Se,
      skinning: L.isSkinnedMesh === !0,
      morphTargets: W.morphAttributes.position !== void 0,
      morphNormals: W.morphAttributes.normal !== void 0,
      morphColors: W.morphAttributes.color !== void 0,
      morphTargetsCount: de,
      morphTextureStride: Le,
      numDirLights: v.directional.length,
      numPointLights: v.point.length,
      numSpotLights: v.spot.length,
      numSpotLightMaps: v.spotLightMap.length,
      numRectAreaLights: v.rectArea.length,
      numHemiLights: v.hemi.length,
      numDirLightShadows: v.directionalShadowMap.length,
      numPointLightShadows: v.pointShadowMap.length,
      numSpotLightShadows: v.spotShadowMap.length,
      numSpotLightShadowsWithMaps: v.numSpotLightShadowsWithMaps,
      numLightProbes: v.numLightProbes,
      numClippingPlanes: a.numPlanes,
      numClipIntersection: a.numIntersection,
      dithering: S.dithering,
      shadowMapEnabled: t.shadowMap.enabled && C.length > 0,
      shadowMapType: t.shadowMap.type,
      toneMapping: rt,
      decodeVideoTexture: it && S.map.isVideoTexture === !0 && Ge.getTransfer(S.map.colorSpace) === Ze,
      decodeVideoTextureEmissive: et && S.emissiveMap.isVideoTexture === !0 && Ge.getTransfer(S.emissiveMap.colorSpace) === Ze,
      premultipliedAlpha: S.premultipliedAlpha,
      doubleSided: S.side === Kt,
      flipSided: S.side === Pt,
      useDepthPacking: S.depthPacking >= 0,
      depthPacking: S.depthPacking || 0,
      index0AttributeName: S.index0AttributeName,
      extensionClipCullDistance: Ce && S.extensions.clipCullDistance === !0 && i.has("WEBGL_clip_cull_distance"),
      extensionMultiDraw: (Ce && S.extensions.multiDraw === !0 || Fe) && i.has("WEBGL_multi_draw"),
      rendererExtensionParallelShaderCompile: i.has("KHR_parallel_shader_compile"),
      customProgramCacheKey: S.customProgramCacheKey()
    };
    return vt.vertexUv1s = l.has(1), vt.vertexUv2s = l.has(2), vt.vertexUv3s = l.has(3), l.clear(), vt;
  }
  function m(S) {
    const v = [];
    if (S.shaderID ? v.push(S.shaderID) : (v.push(S.customVertexShaderID), v.push(S.customFragmentShaderID)), S.defines !== void 0)
      for (const C in S.defines)
        v.push(C), v.push(S.defines[C]);
    return S.isRawShaderMaterial === !1 && (E(v, S), M(v, S), v.push(t.outputColorSpace)), v.push(S.customProgramCacheKey), v.join();
  }
  function E(S, v) {
    S.push(v.precision), S.push(v.outputColorSpace), S.push(v.envMapMode), S.push(v.envMapCubeUVHeight), S.push(v.mapUv), S.push(v.alphaMapUv), S.push(v.lightMapUv), S.push(v.aoMapUv), S.push(v.bumpMapUv), S.push(v.normalMapUv), S.push(v.displacementMapUv), S.push(v.emissiveMapUv), S.push(v.metalnessMapUv), S.push(v.roughnessMapUv), S.push(v.anisotropyMapUv), S.push(v.clearcoatMapUv), S.push(v.clearcoatNormalMapUv), S.push(v.clearcoatRoughnessMapUv), S.push(v.iridescenceMapUv), S.push(v.iridescenceThicknessMapUv), S.push(v.sheenColorMapUv), S.push(v.sheenRoughnessMapUv), S.push(v.specularMapUv), S.push(v.specularColorMapUv), S.push(v.specularIntensityMapUv), S.push(v.transmissionMapUv), S.push(v.thicknessMapUv), S.push(v.combine), S.push(v.fogExp2), S.push(v.sizeAttenuation), S.push(v.morphTargetsCount), S.push(v.morphAttributeCount), S.push(v.numDirLights), S.push(v.numPointLights), S.push(v.numSpotLights), S.push(v.numSpotLightMaps), S.push(v.numHemiLights), S.push(v.numRectAreaLights), S.push(v.numDirLightShadows), S.push(v.numPointLightShadows), S.push(v.numSpotLightShadows), S.push(v.numSpotLightShadowsWithMaps), S.push(v.numLightProbes), S.push(v.shadowMapType), S.push(v.toneMapping), S.push(v.numClippingPlanes), S.push(v.numClipIntersection), S.push(v.depthPacking);
  }
  function M(S, v) {
    o.disableAll(), v.supportsVertexTextures && o.enable(0), v.instancing && o.enable(1), v.instancingColor && o.enable(2), v.instancingMorph && o.enable(3), v.matcap && o.enable(4), v.envMap && o.enable(5), v.normalMapObjectSpace && o.enable(6), v.normalMapTangentSpace && o.enable(7), v.clearcoat && o.enable(8), v.iridescence && o.enable(9), v.alphaTest && o.enable(10), v.vertexColors && o.enable(11), v.vertexAlphas && o.enable(12), v.vertexUv1s && o.enable(13), v.vertexUv2s && o.enable(14), v.vertexUv3s && o.enable(15), v.vertexTangents && o.enable(16), v.anisotropy && o.enable(17), v.alphaHash && o.enable(18), v.batching && o.enable(19), v.dispersion && o.enable(20), v.batchingColor && o.enable(21), S.push(o.mask), o.disableAll(), v.fog && o.enable(0), v.useFog && o.enable(1), v.flatShading && o.enable(2), v.logarithmicDepthBuffer && o.enable(3), v.reverseDepthBuffer && o.enable(4), v.skinning && o.enable(5), v.morphTargets && o.enable(6), v.morphNormals && o.enable(7), v.morphColors && o.enable(8), v.premultipliedAlpha && o.enable(9), v.shadowMapEnabled && o.enable(10), v.doubleSided && o.enable(11), v.flipSided && o.enable(12), v.useDepthPacking && o.enable(13), v.dithering && o.enable(14), v.transmission && o.enable(15), v.sheen && o.enable(16), v.opaque && o.enable(17), v.pointsUvs && o.enable(18), v.decodeVideoTexture && o.enable(19), v.decodeVideoTextureEmissive && o.enable(20), v.alphaToCoverage && o.enable(21), S.push(o.mask);
  }
  function x(S) {
    const v = g[S.type];
    let C;
    if (v) {
      const F = Zt[v];
      C = md.clone(F.uniforms);
    } else
      C = S.uniforms;
    return C;
  }
  function P(S, v) {
    let C;
    for (let F = 0, L = h.length; F < L; F++) {
      const D = h[F];
      if (D.cacheKey === v) {
        C = D, ++C.usedTimes;
        break;
      }
    }
    return C === void 0 && (C = new R0(t, v, S, s), h.push(C)), C;
  }
  function b(S) {
    if (--S.usedTimes === 0) {
      const v = h.indexOf(S);
      h[v] = h[h.length - 1], h.pop(), S.destroy();
    }
  }
  function A(S) {
    c.remove(S);
  }
  function R() {
    c.dispose();
  }
  return {
    getParameters: p,
    getProgramCacheKey: m,
    getUniforms: x,
    acquireProgram: P,
    releaseProgram: b,
    releaseShaderCache: A,
    // Exposed for resource monitoring & error feedback via renderer.info:
    programs: h,
    dispose: R
  };
}
function I0() {
  let t = /* @__PURE__ */ new WeakMap();
  function e(a) {
    return t.has(a);
  }
  function n(a) {
    let o = t.get(a);
    return o === void 0 && (o = {}, t.set(a, o)), o;
  }
  function i(a) {
    t.delete(a);
  }
  function r(a, o, c) {
    t.get(a)[o] = c;
  }
  function s() {
    t = /* @__PURE__ */ new WeakMap();
  }
  return {
    has: e,
    get: n,
    remove: i,
    update: r,
    dispose: s
  };
}
function U0(t, e) {
  return t.groupOrder !== e.groupOrder ? t.groupOrder - e.groupOrder : t.renderOrder !== e.renderOrder ? t.renderOrder - e.renderOrder : t.material.id !== e.material.id ? t.material.id - e.material.id : t.z !== e.z ? t.z - e.z : t.id - e.id;
}
function Zo(t, e) {
  return t.groupOrder !== e.groupOrder ? t.groupOrder - e.groupOrder : t.renderOrder !== e.renderOrder ? t.renderOrder - e.renderOrder : t.z !== e.z ? e.z - t.z : t.id - e.id;
}
function Ko() {
  const t = [];
  let e = 0;
  const n = [], i = [], r = [];
  function s() {
    e = 0, n.length = 0, i.length = 0, r.length = 0;
  }
  function a(f, d, u, g, _, p) {
    let m = t[e];
    return m === void 0 ? (m = {
      id: f.id,
      object: f,
      geometry: d,
      material: u,
      groupOrder: g,
      renderOrder: f.renderOrder,
      z: _,
      group: p
    }, t[e] = m) : (m.id = f.id, m.object = f, m.geometry = d, m.material = u, m.groupOrder = g, m.renderOrder = f.renderOrder, m.z = _, m.group = p), e++, m;
  }
  function o(f, d, u, g, _, p) {
    const m = a(f, d, u, g, _, p);
    u.transmission > 0 ? i.push(m) : u.transparent === !0 ? r.push(m) : n.push(m);
  }
  function c(f, d, u, g, _, p) {
    const m = a(f, d, u, g, _, p);
    u.transmission > 0 ? i.unshift(m) : u.transparent === !0 ? r.unshift(m) : n.unshift(m);
  }
  function l(f, d) {
    n.length > 1 && n.sort(f || U0), i.length > 1 && i.sort(d || Zo), r.length > 1 && r.sort(d || Zo);
  }
  function h() {
    for (let f = e, d = t.length; f < d; f++) {
      const u = t[f];
      if (u.id === null) break;
      u.id = null, u.object = null, u.geometry = null, u.material = null, u.group = null;
    }
  }
  return {
    opaque: n,
    transmissive: i,
    transparent: r,
    init: s,
    push: o,
    unshift: c,
    finish: h,
    sort: l
  };
}
function N0() {
  let t = /* @__PURE__ */ new WeakMap();
  function e(i, r) {
    const s = t.get(i);
    let a;
    return s === void 0 ? (a = new Ko(), t.set(i, [a])) : r >= s.length ? (a = new Ko(), s.push(a)) : a = s[r], a;
  }
  function n() {
    t = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: e,
    dispose: n
  };
}
function F0() {
  const t = {};
  return {
    get: function(e) {
      if (t[e.id] !== void 0)
        return t[e.id];
      let n;
      switch (e.type) {
        case "DirectionalLight":
          n = {
            direction: new z(),
            color: new Oe()
          };
          break;
        case "SpotLight":
          n = {
            position: new z(),
            direction: new z(),
            color: new Oe(),
            distance: 0,
            coneCos: 0,
            penumbraCos: 0,
            decay: 0
          };
          break;
        case "PointLight":
          n = {
            position: new z(),
            color: new Oe(),
            distance: 0,
            decay: 0
          };
          break;
        case "HemisphereLight":
          n = {
            direction: new z(),
            skyColor: new Oe(),
            groundColor: new Oe()
          };
          break;
        case "RectAreaLight":
          n = {
            color: new Oe(),
            position: new z(),
            halfWidth: new z(),
            halfHeight: new z()
          };
          break;
      }
      return t[e.id] = n, n;
    }
  };
}
function O0() {
  const t = {};
  return {
    get: function(e) {
      if (t[e.id] !== void 0)
        return t[e.id];
      let n;
      switch (e.type) {
        case "DirectionalLight":
          n = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new we()
          };
          break;
        case "SpotLight":
          n = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new we()
          };
          break;
        case "PointLight":
          n = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new we(),
            shadowCameraNear: 1,
            shadowCameraFar: 1e3
          };
          break;
      }
      return t[e.id] = n, n;
    }
  };
}
let z0 = 0;
function B0(t, e) {
  return (e.castShadow ? 2 : 0) - (t.castShadow ? 2 : 0) + (e.map ? 1 : 0) - (t.map ? 1 : 0);
}
function H0(t) {
  const e = new F0(), n = O0(), i = {
    version: 0,
    hash: {
      directionalLength: -1,
      pointLength: -1,
      spotLength: -1,
      rectAreaLength: -1,
      hemiLength: -1,
      numDirectionalShadows: -1,
      numPointShadows: -1,
      numSpotShadows: -1,
      numSpotMaps: -1,
      numLightProbes: -1
    },
    ambient: [0, 0, 0],
    probe: [],
    directional: [],
    directionalShadow: [],
    directionalShadowMap: [],
    directionalShadowMatrix: [],
    spot: [],
    spotLightMap: [],
    spotShadow: [],
    spotShadowMap: [],
    spotLightMatrix: [],
    rectArea: [],
    rectAreaLTC1: null,
    rectAreaLTC2: null,
    point: [],
    pointShadow: [],
    pointShadowMap: [],
    pointShadowMatrix: [],
    hemi: [],
    numSpotLightShadowsWithMaps: 0,
    numLightProbes: 0
  };
  for (let l = 0; l < 9; l++) i.probe.push(new z());
  const r = new z(), s = new je(), a = new je();
  function o(l) {
    let h = 0, f = 0, d = 0;
    for (let S = 0; S < 9; S++) i.probe[S].set(0, 0, 0);
    let u = 0, g = 0, _ = 0, p = 0, m = 0, E = 0, M = 0, x = 0, P = 0, b = 0, A = 0;
    l.sort(B0);
    for (let S = 0, v = l.length; S < v; S++) {
      const C = l[S], F = C.color, L = C.intensity, D = C.distance, W = C.shadow && C.shadow.map ? C.shadow.map.texture : null;
      if (C.isAmbientLight)
        h += F.r * L, f += F.g * L, d += F.b * L;
      else if (C.isLightProbe) {
        for (let V = 0; V < 9; V++)
          i.probe[V].addScaledVector(C.sh.coefficients[V], L);
        A++;
      } else if (C.isDirectionalLight) {
        const V = e.get(C);
        if (V.color.copy(C.color).multiplyScalar(C.intensity), C.castShadow) {
          const K = C.shadow, G = n.get(C);
          G.shadowIntensity = K.intensity, G.shadowBias = K.bias, G.shadowNormalBias = K.normalBias, G.shadowRadius = K.radius, G.shadowMapSize = K.mapSize, i.directionalShadow[u] = G, i.directionalShadowMap[u] = W, i.directionalShadowMatrix[u] = C.shadow.matrix, E++;
        }
        i.directional[u] = V, u++;
      } else if (C.isSpotLight) {
        const V = e.get(C);
        V.position.setFromMatrixPosition(C.matrixWorld), V.color.copy(F).multiplyScalar(L), V.distance = D, V.coneCos = Math.cos(C.angle), V.penumbraCos = Math.cos(C.angle * (1 - C.penumbra)), V.decay = C.decay, i.spot[_] = V;
        const K = C.shadow;
        if (C.map && (i.spotLightMap[P] = C.map, P++, K.updateMatrices(C), C.castShadow && b++), i.spotLightMatrix[_] = K.matrix, C.castShadow) {
          const G = n.get(C);
          G.shadowIntensity = K.intensity, G.shadowBias = K.bias, G.shadowNormalBias = K.normalBias, G.shadowRadius = K.radius, G.shadowMapSize = K.mapSize, i.spotShadow[_] = G, i.spotShadowMap[_] = W, x++;
        }
        _++;
      } else if (C.isRectAreaLight) {
        const V = e.get(C);
        V.color.copy(F).multiplyScalar(L), V.halfWidth.set(C.width * 0.5, 0, 0), V.halfHeight.set(0, C.height * 0.5, 0), i.rectArea[p] = V, p++;
      } else if (C.isPointLight) {
        const V = e.get(C);
        if (V.color.copy(C.color).multiplyScalar(C.intensity), V.distance = C.distance, V.decay = C.decay, C.castShadow) {
          const K = C.shadow, G = n.get(C);
          G.shadowIntensity = K.intensity, G.shadowBias = K.bias, G.shadowNormalBias = K.normalBias, G.shadowRadius = K.radius, G.shadowMapSize = K.mapSize, G.shadowCameraNear = K.camera.near, G.shadowCameraFar = K.camera.far, i.pointShadow[g] = G, i.pointShadowMap[g] = W, i.pointShadowMatrix[g] = C.shadow.matrix, M++;
        }
        i.point[g] = V, g++;
      } else if (C.isHemisphereLight) {
        const V = e.get(C);
        V.skyColor.copy(C.color).multiplyScalar(L), V.groundColor.copy(C.groundColor).multiplyScalar(L), i.hemi[m] = V, m++;
      }
    }
    p > 0 && (t.has("OES_texture_float_linear") === !0 ? (i.rectAreaLTC1 = ne.LTC_FLOAT_1, i.rectAreaLTC2 = ne.LTC_FLOAT_2) : (i.rectAreaLTC1 = ne.LTC_HALF_1, i.rectAreaLTC2 = ne.LTC_HALF_2)), i.ambient[0] = h, i.ambient[1] = f, i.ambient[2] = d;
    const R = i.hash;
    (R.directionalLength !== u || R.pointLength !== g || R.spotLength !== _ || R.rectAreaLength !== p || R.hemiLength !== m || R.numDirectionalShadows !== E || R.numPointShadows !== M || R.numSpotShadows !== x || R.numSpotMaps !== P || R.numLightProbes !== A) && (i.directional.length = u, i.spot.length = _, i.rectArea.length = p, i.point.length = g, i.hemi.length = m, i.directionalShadow.length = E, i.directionalShadowMap.length = E, i.pointShadow.length = M, i.pointShadowMap.length = M, i.spotShadow.length = x, i.spotShadowMap.length = x, i.directionalShadowMatrix.length = E, i.pointShadowMatrix.length = M, i.spotLightMatrix.length = x + P - b, i.spotLightMap.length = P, i.numSpotLightShadowsWithMaps = b, i.numLightProbes = A, R.directionalLength = u, R.pointLength = g, R.spotLength = _, R.rectAreaLength = p, R.hemiLength = m, R.numDirectionalShadows = E, R.numPointShadows = M, R.numSpotShadows = x, R.numSpotMaps = P, R.numLightProbes = A, i.version = z0++);
  }
  function c(l, h) {
    let f = 0, d = 0, u = 0, g = 0, _ = 0;
    const p = h.matrixWorldInverse;
    for (let m = 0, E = l.length; m < E; m++) {
      const M = l[m];
      if (M.isDirectionalLight) {
        const x = i.directional[f];
        x.direction.setFromMatrixPosition(M.matrixWorld), r.setFromMatrixPosition(M.target.matrixWorld), x.direction.sub(r), x.direction.transformDirection(p), f++;
      } else if (M.isSpotLight) {
        const x = i.spot[u];
        x.position.setFromMatrixPosition(M.matrixWorld), x.position.applyMatrix4(p), x.direction.setFromMatrixPosition(M.matrixWorld), r.setFromMatrixPosition(M.target.matrixWorld), x.direction.sub(r), x.direction.transformDirection(p), u++;
      } else if (M.isRectAreaLight) {
        const x = i.rectArea[g];
        x.position.setFromMatrixPosition(M.matrixWorld), x.position.applyMatrix4(p), a.identity(), s.copy(M.matrixWorld), s.premultiply(p), a.extractRotation(s), x.halfWidth.set(M.width * 0.5, 0, 0), x.halfHeight.set(0, M.height * 0.5, 0), x.halfWidth.applyMatrix4(a), x.halfHeight.applyMatrix4(a), g++;
      } else if (M.isPointLight) {
        const x = i.point[d];
        x.position.setFromMatrixPosition(M.matrixWorld), x.position.applyMatrix4(p), d++;
      } else if (M.isHemisphereLight) {
        const x = i.hemi[_];
        x.direction.setFromMatrixPosition(M.matrixWorld), x.direction.transformDirection(p), _++;
      }
    }
  }
  return {
    setup: o,
    setupView: c,
    state: i
  };
}
function Jo(t) {
  const e = new H0(t), n = [], i = [];
  function r(h) {
    l.camera = h, n.length = 0, i.length = 0;
  }
  function s(h) {
    n.push(h);
  }
  function a(h) {
    i.push(h);
  }
  function o() {
    e.setup(n);
  }
  function c(h) {
    e.setupView(n, h);
  }
  const l = {
    lightsArray: n,
    shadowsArray: i,
    camera: null,
    lights: e,
    transmissionRenderTarget: {}
  };
  return {
    init: r,
    state: l,
    setupLights: o,
    setupLightsView: c,
    pushLight: s,
    pushShadow: a
  };
}
function k0(t) {
  let e = /* @__PURE__ */ new WeakMap();
  function n(r, s = 0) {
    const a = e.get(r);
    let o;
    return a === void 0 ? (o = new Jo(t), e.set(r, [o])) : s >= a.length ? (o = new Jo(t), a.push(o)) : o = a[s], o;
  }
  function i() {
    e = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: n,
    dispose: i
  };
}
class V0 extends Pi {
  static get type() {
    return "MeshDepthMaterial";
  }
  constructor(e) {
    super(), this.isMeshDepthMaterial = !0, this.depthPacking = Ff, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = !1, this.wireframeLinewidth = 1, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.depthPacking = e.depthPacking, this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this;
  }
}
class G0 extends Pi {
  static get type() {
    return "MeshDistanceMaterial";
  }
  constructor(e) {
    super(), this.isMeshDistanceMaterial = !0, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this;
  }
}
const W0 = `void main() {
	gl_Position = vec4( position, 1.0 );
}`, X0 = `uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;
function q0(t, e, n) {
  let i = new Pa();
  const r = new we(), s = new we(), a = new st(), o = new V0({ depthPacking: Of }), c = new G0(), l = {}, h = n.maxTextureSize, f = { [In]: Pt, [Pt]: In, [Kt]: Kt }, d = new tn({
    defines: {
      VSM_SAMPLES: 8
    },
    uniforms: {
      shadow_pass: { value: null },
      resolution: { value: new we() },
      radius: { value: 4 }
    },
    vertexShader: W0,
    fragmentShader: X0
  }), u = d.clone();
  u.defines.HORIZONTAL_PASS = 1;
  const g = new _t();
  g.setAttribute(
    "position",
    new ht(
      new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]),
      3
    )
  );
  const _ = new Ut(g, d), p = this;
  this.enabled = !1, this.autoUpdate = !0, this.needsUpdate = !1, this.type = wc;
  let m = this.type;
  this.render = function(b, A, R) {
    if (p.enabled === !1 || p.autoUpdate === !1 && p.needsUpdate === !1 || b.length === 0) return;
    const S = t.getRenderTarget(), v = t.getActiveCubeFace(), C = t.getActiveMipmapLevel(), F = t.state;
    F.setBlending(Dn), F.buffers.color.setClear(1, 1, 1, 1), F.buffers.depth.setTest(!0), F.setScissorTest(!1);
    const L = m !== fn && this.type === fn, D = m === fn && this.type !== fn;
    for (let W = 0, V = b.length; W < V; W++) {
      const K = b[W], G = K.shadow;
      if (G === void 0) {
        console.warn("THREE.WebGLShadowMap:", K, "has no shadow.");
        continue;
      }
      if (G.autoUpdate === !1 && G.needsUpdate === !1) continue;
      r.copy(G.mapSize);
      const te = G.getFrameExtents();
      if (r.multiply(te), s.copy(G.mapSize), (r.x > h || r.y > h) && (r.x > h && (s.x = Math.floor(h / te.x), r.x = s.x * te.x, G.mapSize.x = s.x), r.y > h && (s.y = Math.floor(h / te.y), r.y = s.y * te.y, G.mapSize.y = s.y)), G.map === null || L === !0 || D === !0) {
        const de = this.type !== fn ? { minFilter: Nt, magFilter: Nt } : {};
        G.map !== null && G.map.dispose(), G.map = new jn(r.x, r.y, de), G.map.texture.name = K.name + ".shadowMap", G.camera.updateProjectionMatrix();
      }
      t.setRenderTarget(G.map), t.clear();
      const ae = G.getViewportCount();
      for (let de = 0; de < ae; de++) {
        const Le = G.getViewport(de);
        a.set(
          s.x * Le.x,
          s.y * Le.y,
          s.x * Le.z,
          s.y * Le.w
        ), F.viewport(a), G.updateMatrices(K, de), i = G.getFrustum(), x(A, R, G.camera, K, this.type);
      }
      G.isPointLightShadow !== !0 && this.type === fn && E(G, R), G.needsUpdate = !1;
    }
    m = this.type, p.needsUpdate = !1, t.setRenderTarget(S, v, C);
  };
  function E(b, A) {
    const R = e.update(_);
    d.defines.VSM_SAMPLES !== b.blurSamples && (d.defines.VSM_SAMPLES = b.blurSamples, u.defines.VSM_SAMPLES = b.blurSamples, d.needsUpdate = !0, u.needsUpdate = !0), b.mapPass === null && (b.mapPass = new jn(r.x, r.y)), d.uniforms.shadow_pass.value = b.map.texture, d.uniforms.resolution.value = b.mapSize, d.uniforms.radius.value = b.radius, t.setRenderTarget(b.mapPass), t.clear(), t.renderBufferDirect(A, null, R, d, _, null), u.uniforms.shadow_pass.value = b.mapPass.texture, u.uniforms.resolution.value = b.mapSize, u.uniforms.radius.value = b.radius, t.setRenderTarget(b.map), t.clear(), t.renderBufferDirect(A, null, R, u, _, null);
  }
  function M(b, A, R, S) {
    let v = null;
    const C = R.isPointLight === !0 ? b.customDistanceMaterial : b.customDepthMaterial;
    if (C !== void 0)
      v = C;
    else if (v = R.isPointLight === !0 ? c : o, t.localClippingEnabled && A.clipShadows === !0 && Array.isArray(A.clippingPlanes) && A.clippingPlanes.length !== 0 || A.displacementMap && A.displacementScale !== 0 || A.alphaMap && A.alphaTest > 0 || A.map && A.alphaTest > 0) {
      const F = v.uuid, L = A.uuid;
      let D = l[F];
      D === void 0 && (D = {}, l[F] = D);
      let W = D[L];
      W === void 0 && (W = v.clone(), D[L] = W, A.addEventListener("dispose", P)), v = W;
    }
    if (v.visible = A.visible, v.wireframe = A.wireframe, S === fn ? v.side = A.shadowSide !== null ? A.shadowSide : A.side : v.side = A.shadowSide !== null ? A.shadowSide : f[A.side], v.alphaMap = A.alphaMap, v.alphaTest = A.alphaTest, v.map = A.map, v.clipShadows = A.clipShadows, v.clippingPlanes = A.clippingPlanes, v.clipIntersection = A.clipIntersection, v.displacementMap = A.displacementMap, v.displacementScale = A.displacementScale, v.displacementBias = A.displacementBias, v.wireframeLinewidth = A.wireframeLinewidth, v.linewidth = A.linewidth, R.isPointLight === !0 && v.isMeshDistanceMaterial === !0) {
      const F = t.properties.get(v);
      F.light = R;
    }
    return v;
  }
  function x(b, A, R, S, v) {
    if (b.visible === !1) return;
    if (b.layers.test(A.layers) && (b.isMesh || b.isLine || b.isPoints) && (b.castShadow || b.receiveShadow && v === fn) && (!b.frustumCulled || i.intersectsObject(b))) {
      b.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse, b.matrixWorld);
      const L = e.update(b), D = b.material;
      if (Array.isArray(D)) {
        const W = L.groups;
        for (let V = 0, K = W.length; V < K; V++) {
          const G = W[V], te = D[G.materialIndex];
          if (te && te.visible) {
            const ae = M(b, te, S, v);
            b.onBeforeShadow(t, b, A, R, L, ae, G), t.renderBufferDirect(R, null, L, ae, b, G), b.onAfterShadow(t, b, A, R, L, ae, G);
          }
        }
      } else if (D.visible) {
        const W = M(b, D, S, v);
        b.onBeforeShadow(t, b, A, R, L, W, null), t.renderBufferDirect(R, null, L, W, b, null), b.onAfterShadow(t, b, A, R, L, W, null);
      }
    }
    const F = b.children;
    for (let L = 0, D = F.length; L < D; L++)
      x(F[L], A, R, S, v);
  }
  function P(b) {
    b.target.removeEventListener("dispose", P);
    for (const R in l) {
      const S = l[R], v = b.target.uuid;
      v in S && (S[v].dispose(), delete S[v]);
    }
  }
}
const $0 = {
  [Ds]: Ls,
  [Is]: Fs,
  [Us]: Os,
  [Ei]: Ns,
  [Ls]: Ds,
  [Fs]: Is,
  [Os]: Us,
  [Ns]: Ei
};
function Y0(t, e) {
  function n() {
    let I = !1;
    const re = new st();
    let X = null;
    const j = new st(0, 0, 0, 0);
    return {
      setMask: function(le) {
        X !== le && !I && (t.colorMask(le, le, le, le), X = le);
      },
      setLocked: function(le) {
        I = le;
      },
      setClear: function(le, oe, Ce, rt, vt) {
        vt === !0 && (le *= rt, oe *= rt, Ce *= rt), re.set(le, oe, Ce, rt), j.equals(re) === !1 && (t.clearColor(le, oe, Ce, rt), j.copy(re));
      },
      reset: function() {
        I = !1, X = null, j.set(-1, 0, 0, 0);
      }
    };
  }
  function i() {
    let I = !1, re = !1, X = null, j = null, le = null;
    return {
      setReversed: function(oe) {
        if (re !== oe) {
          const Ce = e.get("EXT_clip_control");
          re ? Ce.clipControlEXT(Ce.LOWER_LEFT_EXT, Ce.ZERO_TO_ONE_EXT) : Ce.clipControlEXT(Ce.LOWER_LEFT_EXT, Ce.NEGATIVE_ONE_TO_ONE_EXT);
          const rt = le;
          le = null, this.setClear(rt);
        }
        re = oe;
      },
      getReversed: function() {
        return re;
      },
      setTest: function(oe) {
        oe ? ie(t.DEPTH_TEST) : Se(t.DEPTH_TEST);
      },
      setMask: function(oe) {
        X !== oe && !I && (t.depthMask(oe), X = oe);
      },
      setFunc: function(oe) {
        if (re && (oe = $0[oe]), j !== oe) {
          switch (oe) {
            case Ds:
              t.depthFunc(t.NEVER);
              break;
            case Ls:
              t.depthFunc(t.ALWAYS);
              break;
            case Is:
              t.depthFunc(t.LESS);
              break;
            case Ei:
              t.depthFunc(t.LEQUAL);
              break;
            case Us:
              t.depthFunc(t.EQUAL);
              break;
            case Ns:
              t.depthFunc(t.GEQUAL);
              break;
            case Fs:
              t.depthFunc(t.GREATER);
              break;
            case Os:
              t.depthFunc(t.NOTEQUAL);
              break;
            default:
              t.depthFunc(t.LEQUAL);
          }
          j = oe;
        }
      },
      setLocked: function(oe) {
        I = oe;
      },
      setClear: function(oe) {
        le !== oe && (re && (oe = 1 - oe), t.clearDepth(oe), le = oe);
      },
      reset: function() {
        I = !1, X = null, j = null, le = null, re = !1;
      }
    };
  }
  function r() {
    let I = !1, re = null, X = null, j = null, le = null, oe = null, Ce = null, rt = null, vt = null;
    return {
      setTest: function(Ye) {
        I || (Ye ? ie(t.STENCIL_TEST) : Se(t.STENCIL_TEST));
      },
      setMask: function(Ye) {
        re !== Ye && !I && (t.stencilMask(Ye), re = Ye);
      },
      setFunc: function(Ye, kt, rn) {
        (X !== Ye || j !== kt || le !== rn) && (t.stencilFunc(Ye, kt, rn), X = Ye, j = kt, le = rn);
      },
      setOp: function(Ye, kt, rn) {
        (oe !== Ye || Ce !== kt || rt !== rn) && (t.stencilOp(Ye, kt, rn), oe = Ye, Ce = kt, rt = rn);
      },
      setLocked: function(Ye) {
        I = Ye;
      },
      setClear: function(Ye) {
        vt !== Ye && (t.clearStencil(Ye), vt = Ye);
      },
      reset: function() {
        I = !1, re = null, X = null, j = null, le = null, oe = null, Ce = null, rt = null, vt = null;
      }
    };
  }
  const s = new n(), a = new i(), o = new r(), c = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap();
  let h = {}, f = {}, d = /* @__PURE__ */ new WeakMap(), u = [], g = null, _ = !1, p = null, m = null, E = null, M = null, x = null, P = null, b = null, A = new Oe(0, 0, 0), R = 0, S = !1, v = null, C = null, F = null, L = null, D = null;
  const W = t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
  let V = !1, K = 0;
  const G = t.getParameter(t.VERSION);
  G.indexOf("WebGL") !== -1 ? (K = parseFloat(/^WebGL (\d)/.exec(G)[1]), V = K >= 1) : G.indexOf("OpenGL ES") !== -1 && (K = parseFloat(/^OpenGL ES (\d)/.exec(G)[1]), V = K >= 2);
  let te = null, ae = {};
  const de = t.getParameter(t.SCISSOR_BOX), Le = t.getParameter(t.VIEWPORT), Xe = new st().fromArray(de), q = new st().fromArray(Le);
  function Q(I, re, X, j) {
    const le = new Uint8Array(4), oe = t.createTexture();
    t.bindTexture(I, oe), t.texParameteri(I, t.TEXTURE_MIN_FILTER, t.NEAREST), t.texParameteri(I, t.TEXTURE_MAG_FILTER, t.NEAREST);
    for (let Ce = 0; Ce < X; Ce++)
      I === t.TEXTURE_3D || I === t.TEXTURE_2D_ARRAY ? t.texImage3D(re, 0, t.RGBA, 1, 1, j, 0, t.RGBA, t.UNSIGNED_BYTE, le) : t.texImage2D(re + Ce, 0, t.RGBA, 1, 1, 0, t.RGBA, t.UNSIGNED_BYTE, le);
    return oe;
  }
  const he = {};
  he[t.TEXTURE_2D] = Q(t.TEXTURE_2D, t.TEXTURE_2D, 1), he[t.TEXTURE_CUBE_MAP] = Q(t.TEXTURE_CUBE_MAP, t.TEXTURE_CUBE_MAP_POSITIVE_X, 6), he[t.TEXTURE_2D_ARRAY] = Q(t.TEXTURE_2D_ARRAY, t.TEXTURE_2D_ARRAY, 1, 1), he[t.TEXTURE_3D] = Q(t.TEXTURE_3D, t.TEXTURE_3D, 1, 1), s.setClear(0, 0, 0, 1), a.setClear(1), o.setClear(0), ie(t.DEPTH_TEST), a.setFunc(Ei), ze(!1), Be(to), ie(t.CULL_FACE), O(Dn);
  function ie(I) {
    h[I] !== !0 && (t.enable(I), h[I] = !0);
  }
  function Se(I) {
    h[I] !== !1 && (t.disable(I), h[I] = !1);
  }
  function Re(I, re) {
    return f[I] !== re ? (t.bindFramebuffer(I, re), f[I] = re, I === t.DRAW_FRAMEBUFFER && (f[t.FRAMEBUFFER] = re), I === t.FRAMEBUFFER && (f[t.DRAW_FRAMEBUFFER] = re), !0) : !1;
  }
  function Fe(I, re) {
    let X = u, j = !1;
    if (I) {
      X = d.get(re), X === void 0 && (X = [], d.set(re, X));
      const le = I.textures;
      if (X.length !== le.length || X[0] !== t.COLOR_ATTACHMENT0) {
        for (let oe = 0, Ce = le.length; oe < Ce; oe++)
          X[oe] = t.COLOR_ATTACHMENT0 + oe;
        X.length = le.length, j = !0;
      }
    } else
      X[0] !== t.BACK && (X[0] = t.BACK, j = !0);
    j && t.drawBuffers(X);
  }
  function it(I) {
    return g !== I ? (t.useProgram(I), g = I, !0) : !1;
  }
  const ke = {
    [Wn]: t.FUNC_ADD,
    [lf]: t.FUNC_SUBTRACT,
    [hf]: t.FUNC_REVERSE_SUBTRACT
  };
  ke[ff] = t.MIN, ke[df] = t.MAX;
  const at = {
    [uf]: t.ZERO,
    [pf]: t.ONE,
    [mf]: t.SRC_COLOR,
    [Cs]: t.SRC_ALPHA,
    [yf]: t.SRC_ALPHA_SATURATE,
    [xf]: t.DST_COLOR,
    [_f]: t.DST_ALPHA,
    [gf]: t.ONE_MINUS_SRC_COLOR,
    [Ps]: t.ONE_MINUS_SRC_ALPHA,
    [Mf]: t.ONE_MINUS_DST_COLOR,
    [vf]: t.ONE_MINUS_DST_ALPHA,
    [Sf]: t.CONSTANT_COLOR,
    [Ef]: t.ONE_MINUS_CONSTANT_COLOR,
    [Tf]: t.CONSTANT_ALPHA,
    [bf]: t.ONE_MINUS_CONSTANT_ALPHA
  };
  function O(I, re, X, j, le, oe, Ce, rt, vt, Ye) {
    if (I === Dn) {
      _ === !0 && (Se(t.BLEND), _ = !1);
      return;
    }
    if (_ === !1 && (ie(t.BLEND), _ = !0), I !== cf) {
      if (I !== p || Ye !== S) {
        if ((m !== Wn || x !== Wn) && (t.blendEquation(t.FUNC_ADD), m = Wn, x = Wn), Ye)
          switch (I) {
            case Mi:
              t.blendFuncSeparate(t.ONE, t.ONE_MINUS_SRC_ALPHA, t.ONE, t.ONE_MINUS_SRC_ALPHA);
              break;
            case no:
              t.blendFunc(t.ONE, t.ONE);
              break;
            case io:
              t.blendFuncSeparate(t.ZERO, t.ONE_MINUS_SRC_COLOR, t.ZERO, t.ONE);
              break;
            case ro:
              t.blendFuncSeparate(t.ZERO, t.SRC_COLOR, t.ZERO, t.SRC_ALPHA);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", I);
              break;
          }
        else
          switch (I) {
            case Mi:
              t.blendFuncSeparate(t.SRC_ALPHA, t.ONE_MINUS_SRC_ALPHA, t.ONE, t.ONE_MINUS_SRC_ALPHA);
              break;
            case no:
              t.blendFunc(t.SRC_ALPHA, t.ONE);
              break;
            case io:
              t.blendFuncSeparate(t.ZERO, t.ONE_MINUS_SRC_COLOR, t.ZERO, t.ONE);
              break;
            case ro:
              t.blendFunc(t.ZERO, t.SRC_COLOR);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", I);
              break;
          }
        E = null, M = null, P = null, b = null, A.set(0, 0, 0), R = 0, p = I, S = Ye;
      }
      return;
    }
    le = le || re, oe = oe || X, Ce = Ce || j, (re !== m || le !== x) && (t.blendEquationSeparate(ke[re], ke[le]), m = re, x = le), (X !== E || j !== M || oe !== P || Ce !== b) && (t.blendFuncSeparate(at[X], at[j], at[oe], at[Ce]), E = X, M = j, P = oe, b = Ce), (rt.equals(A) === !1 || vt !== R) && (t.blendColor(rt.r, rt.g, rt.b, vt), A.copy(rt), R = vt), p = I, S = !1;
  }
  function Ft(I, re) {
    I.side === Kt ? Se(t.CULL_FACE) : ie(t.CULL_FACE);
    let X = I.side === Pt;
    re && (X = !X), ze(X), I.blending === Mi && I.transparent === !1 ? O(Dn) : O(I.blending, I.blendEquation, I.blendSrc, I.blendDst, I.blendEquationAlpha, I.blendSrcAlpha, I.blendDstAlpha, I.blendColor, I.blendAlpha, I.premultipliedAlpha), a.setFunc(I.depthFunc), a.setTest(I.depthTest), a.setMask(I.depthWrite), s.setMask(I.colorWrite);
    const j = I.stencilWrite;
    o.setTest(j), j && (o.setMask(I.stencilWriteMask), o.setFunc(I.stencilFunc, I.stencilRef, I.stencilFuncMask), o.setOp(I.stencilFail, I.stencilZFail, I.stencilZPass)), et(I.polygonOffset, I.polygonOffsetFactor, I.polygonOffsetUnits), I.alphaToCoverage === !0 ? ie(t.SAMPLE_ALPHA_TO_COVERAGE) : Se(t.SAMPLE_ALPHA_TO_COVERAGE);
  }
  function ze(I) {
    v !== I && (I ? t.frontFace(t.CW) : t.frontFace(t.CCW), v = I);
  }
  function Be(I) {
    I !== sf ? (ie(t.CULL_FACE), I !== C && (I === to ? t.cullFace(t.BACK) : I === af ? t.cullFace(t.FRONT) : t.cullFace(t.FRONT_AND_BACK))) : Se(t.CULL_FACE), C = I;
  }
  function Ee(I) {
    I !== F && (V && t.lineWidth(I), F = I);
  }
  function et(I, re, X) {
    I ? (ie(t.POLYGON_OFFSET_FILL), (L !== re || D !== X) && (t.polygonOffset(re, X), L = re, D = X)) : Se(t.POLYGON_OFFSET_FILL);
  }
  function ye(I) {
    I ? ie(t.SCISSOR_TEST) : Se(t.SCISSOR_TEST);
  }
  function w(I) {
    I === void 0 && (I = t.TEXTURE0 + W - 1), te !== I && (t.activeTexture(I), te = I);
  }
  function y(I, re, X) {
    X === void 0 && (te === null ? X = t.TEXTURE0 + W - 1 : X = te);
    let j = ae[X];
    j === void 0 && (j = { type: void 0, texture: void 0 }, ae[X] = j), (j.type !== I || j.texture !== re) && (te !== X && (t.activeTexture(X), te = X), t.bindTexture(I, re || he[I]), j.type = I, j.texture = re);
  }
  function B() {
    const I = ae[te];
    I !== void 0 && I.type !== void 0 && (t.bindTexture(I.type, null), I.type = void 0, I.texture = void 0);
  }
  function Y() {
    try {
      t.compressedTexImage2D.apply(t, arguments);
    } catch (I) {
      console.error("THREE.WebGLState:", I);
    }
  }
  function Z() {
    try {
      t.compressedTexImage3D.apply(t, arguments);
    } catch (I) {
      console.error("THREE.WebGLState:", I);
    }
  }
  function $() {
    try {
      t.texSubImage2D.apply(t, arguments);
    } catch (I) {
      console.error("THREE.WebGLState:", I);
    }
  }
  function xe() {
    try {
      t.texSubImage3D.apply(t, arguments);
    } catch (I) {
      console.error("THREE.WebGLState:", I);
    }
  }
  function se() {
    try {
      t.compressedTexSubImage2D.apply(t, arguments);
    } catch (I) {
      console.error("THREE.WebGLState:", I);
    }
  }
  function fe() {
    try {
      t.compressedTexSubImage3D.apply(t, arguments);
    } catch (I) {
      console.error("THREE.WebGLState:", I);
    }
  }
  function Ve() {
    try {
      t.texStorage2D.apply(t, arguments);
    } catch (I) {
      console.error("THREE.WebGLState:", I);
    }
  }
  function J() {
    try {
      t.texStorage3D.apply(t, arguments);
    } catch (I) {
      console.error("THREE.WebGLState:", I);
    }
  }
  function ue() {
    try {
      t.texImage2D.apply(t, arguments);
    } catch (I) {
      console.error("THREE.WebGLState:", I);
    }
  }
  function Te() {
    try {
      t.texImage3D.apply(t, arguments);
    } catch (I) {
      console.error("THREE.WebGLState:", I);
    }
  }
  function be(I) {
    Xe.equals(I) === !1 && (t.scissor(I.x, I.y, I.z, I.w), Xe.copy(I));
  }
  function pe(I) {
    q.equals(I) === !1 && (t.viewport(I.x, I.y, I.z, I.w), q.copy(I));
  }
  function He(I, re) {
    let X = l.get(re);
    X === void 0 && (X = /* @__PURE__ */ new WeakMap(), l.set(re, X));
    let j = X.get(I);
    j === void 0 && (j = t.getUniformBlockIndex(re, I.name), X.set(I, j));
  }
  function Ie(I, re) {
    const j = l.get(re).get(I);
    c.get(re) !== j && (t.uniformBlockBinding(re, j, I.__bindingPointIndex), c.set(re, j));
  }
  function Je() {
    t.disable(t.BLEND), t.disable(t.CULL_FACE), t.disable(t.DEPTH_TEST), t.disable(t.POLYGON_OFFSET_FILL), t.disable(t.SCISSOR_TEST), t.disable(t.STENCIL_TEST), t.disable(t.SAMPLE_ALPHA_TO_COVERAGE), t.blendEquation(t.FUNC_ADD), t.blendFunc(t.ONE, t.ZERO), t.blendFuncSeparate(t.ONE, t.ZERO, t.ONE, t.ZERO), t.blendColor(0, 0, 0, 0), t.colorMask(!0, !0, !0, !0), t.clearColor(0, 0, 0, 0), t.depthMask(!0), t.depthFunc(t.LESS), a.setReversed(!1), t.clearDepth(1), t.stencilMask(4294967295), t.stencilFunc(t.ALWAYS, 0, 4294967295), t.stencilOp(t.KEEP, t.KEEP, t.KEEP), t.clearStencil(0), t.cullFace(t.BACK), t.frontFace(t.CCW), t.polygonOffset(0, 0), t.activeTexture(t.TEXTURE0), t.bindFramebuffer(t.FRAMEBUFFER, null), t.bindFramebuffer(t.DRAW_FRAMEBUFFER, null), t.bindFramebuffer(t.READ_FRAMEBUFFER, null), t.useProgram(null), t.lineWidth(1), t.scissor(0, 0, t.canvas.width, t.canvas.height), t.viewport(0, 0, t.canvas.width, t.canvas.height), h = {}, te = null, ae = {}, f = {}, d = /* @__PURE__ */ new WeakMap(), u = [], g = null, _ = !1, p = null, m = null, E = null, M = null, x = null, P = null, b = null, A = new Oe(0, 0, 0), R = 0, S = !1, v = null, C = null, F = null, L = null, D = null, Xe.set(0, 0, t.canvas.width, t.canvas.height), q.set(0, 0, t.canvas.width, t.canvas.height), s.reset(), a.reset(), o.reset();
  }
  return {
    buffers: {
      color: s,
      depth: a,
      stencil: o
    },
    enable: ie,
    disable: Se,
    bindFramebuffer: Re,
    drawBuffers: Fe,
    useProgram: it,
    setBlending: O,
    setMaterial: Ft,
    setFlipSided: ze,
    setCullFace: Be,
    setLineWidth: Ee,
    setPolygonOffset: et,
    setScissorTest: ye,
    activeTexture: w,
    bindTexture: y,
    unbindTexture: B,
    compressedTexImage2D: Y,
    compressedTexImage3D: Z,
    texImage2D: ue,
    texImage3D: Te,
    updateUBOMapping: He,
    uniformBlockBinding: Ie,
    texStorage2D: Ve,
    texStorage3D: J,
    texSubImage2D: $,
    texSubImage3D: xe,
    compressedTexSubImage2D: se,
    compressedTexSubImage3D: fe,
    scissor: be,
    viewport: pe,
    reset: Je
  };
}
function Qo(t, e, n, i) {
  const r = j0(i);
  switch (n) {
    // https://registry.khronos.org/OpenGL-Refpages/es3.0/html/glTexImage2D.xhtml
    case Ic:
      return t * e;
    case Nc:
      return t * e;
    case Fc:
      return t * e * 2;
    case ba:
      return t * e / r.components * r.byteLength;
    case Aa:
      return t * e / r.components * r.byteLength;
    case Oc:
      return t * e * 2 / r.components * r.byteLength;
    case wa:
      return t * e * 2 / r.components * r.byteLength;
    case Uc:
      return t * e * 3 / r.components * r.byteLength;
    case $t:
      return t * e * 4 / r.components * r.byteLength;
    case Ra:
      return t * e * 4 / r.components * r.byteLength;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_s3tc_srgb/
    case Cr:
    case Pr:
      return Math.floor((t + 3) / 4) * Math.floor((e + 3) / 4) * 8;
    case Dr:
    case Lr:
      return Math.floor((t + 3) / 4) * Math.floor((e + 3) / 4) * 16;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_pvrtc/
    case Gs:
    case Xs:
      return Math.max(t, 16) * Math.max(e, 8) / 4;
    case Vs:
    case Ws:
      return Math.max(t, 8) * Math.max(e, 8) / 2;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_etc/
    case qs:
    case $s:
      return Math.floor((t + 3) / 4) * Math.floor((e + 3) / 4) * 8;
    case Ys:
      return Math.floor((t + 3) / 4) * Math.floor((e + 3) / 4) * 16;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_astc/
    case js:
      return Math.floor((t + 3) / 4) * Math.floor((e + 3) / 4) * 16;
    case Zs:
      return Math.floor((t + 4) / 5) * Math.floor((e + 3) / 4) * 16;
    case Ks:
      return Math.floor((t + 4) / 5) * Math.floor((e + 4) / 5) * 16;
    case Js:
      return Math.floor((t + 5) / 6) * Math.floor((e + 4) / 5) * 16;
    case Qs:
      return Math.floor((t + 5) / 6) * Math.floor((e + 5) / 6) * 16;
    case ea:
      return Math.floor((t + 7) / 8) * Math.floor((e + 4) / 5) * 16;
    case ta:
      return Math.floor((t + 7) / 8) * Math.floor((e + 5) / 6) * 16;
    case na:
      return Math.floor((t + 7) / 8) * Math.floor((e + 7) / 8) * 16;
    case ia:
      return Math.floor((t + 9) / 10) * Math.floor((e + 4) / 5) * 16;
    case ra:
      return Math.floor((t + 9) / 10) * Math.floor((e + 5) / 6) * 16;
    case sa:
      return Math.floor((t + 9) / 10) * Math.floor((e + 7) / 8) * 16;
    case aa:
      return Math.floor((t + 9) / 10) * Math.floor((e + 9) / 10) * 16;
    case oa:
      return Math.floor((t + 11) / 12) * Math.floor((e + 9) / 10) * 16;
    case ca:
      return Math.floor((t + 11) / 12) * Math.floor((e + 11) / 12) * 16;
    // https://registry.khronos.org/webgl/extensions/EXT_texture_compression_bptc/
    case Ir:
    case la:
    case ha:
      return Math.ceil(t / 4) * Math.ceil(e / 4) * 16;
    // https://registry.khronos.org/webgl/extensions/EXT_texture_compression_rgtc/
    case zc:
    case fa:
      return Math.ceil(t / 4) * Math.ceil(e / 4) * 8;
    case da:
    case ua:
      return Math.ceil(t / 4) * Math.ceil(e / 4) * 16;
  }
  throw new Error(
    `Unable to determine texture byte length for ${n} format.`
  );
}
function j0(t) {
  switch (t) {
    case mn:
    case Pc:
      return { byteLength: 1, components: 1 };
    case Xi:
    case Dc:
    case ji:
      return { byteLength: 2, components: 1 };
    case Ea:
    case Ta:
      return { byteLength: 2, components: 4 };
    case Yn:
    case Sa:
    case Qt:
      return { byteLength: 4, components: 1 };
    case Lc:
      return { byteLength: 4, components: 3 };
  }
  throw new Error(`Unknown texture type ${t}.`);
}
function Z0(t, e, n, i, r, s, a) {
  const o = e.has("WEBGL_multisampled_render_to_texture") ? e.get("WEBGL_multisampled_render_to_texture") : null, c = typeof navigator > "u" ? !1 : /OculusBrowser/g.test(navigator.userAgent), l = new we(), h = /* @__PURE__ */ new WeakMap();
  let f;
  const d = /* @__PURE__ */ new WeakMap();
  let u = !1;
  try {
    u = typeof OffscreenCanvas < "u" && new OffscreenCanvas(1, 1).getContext("2d") !== null;
  } catch {
  }
  function g(w, y) {
    return u ? (
      // eslint-disable-next-line compat/compat
      new OffscreenCanvas(w, y)
    ) : qi("canvas");
  }
  function _(w, y, B) {
    let Y = 1;
    const Z = ye(w);
    if ((Z.width > B || Z.height > B) && (Y = B / Math.max(Z.width, Z.height)), Y < 1)
      if (typeof HTMLImageElement < "u" && w instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && w instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && w instanceof ImageBitmap || typeof VideoFrame < "u" && w instanceof VideoFrame) {
        const $ = Math.floor(Y * Z.width), xe = Math.floor(Y * Z.height);
        f === void 0 && (f = g($, xe));
        const se = y ? g($, xe) : f;
        return se.width = $, se.height = xe, se.getContext("2d").drawImage(w, 0, 0, $, xe), console.warn("THREE.WebGLRenderer: Texture has been resized from (" + Z.width + "x" + Z.height + ") to (" + $ + "x" + xe + ")."), se;
      } else
        return "data" in w && console.warn("THREE.WebGLRenderer: Image in DataTexture is too big (" + Z.width + "x" + Z.height + ")."), w;
    return w;
  }
  function p(w) {
    return w.generateMipmaps;
  }
  function m(w) {
    t.generateMipmap(w);
  }
  function E(w) {
    return w.isWebGLCubeRenderTarget ? t.TEXTURE_CUBE_MAP : w.isWebGL3DRenderTarget ? t.TEXTURE_3D : w.isWebGLArrayRenderTarget || w.isCompressedArrayTexture ? t.TEXTURE_2D_ARRAY : t.TEXTURE_2D;
  }
  function M(w, y, B, Y, Z = !1) {
    if (w !== null) {
      if (t[w] !== void 0) return t[w];
      console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '" + w + "'");
    }
    let $ = y;
    if (y === t.RED && (B === t.FLOAT && ($ = t.R32F), B === t.HALF_FLOAT && ($ = t.R16F), B === t.UNSIGNED_BYTE && ($ = t.R8)), y === t.RED_INTEGER && (B === t.UNSIGNED_BYTE && ($ = t.R8UI), B === t.UNSIGNED_SHORT && ($ = t.R16UI), B === t.UNSIGNED_INT && ($ = t.R32UI), B === t.BYTE && ($ = t.R8I), B === t.SHORT && ($ = t.R16I), B === t.INT && ($ = t.R32I)), y === t.RG && (B === t.FLOAT && ($ = t.RG32F), B === t.HALF_FLOAT && ($ = t.RG16F), B === t.UNSIGNED_BYTE && ($ = t.RG8)), y === t.RG_INTEGER && (B === t.UNSIGNED_BYTE && ($ = t.RG8UI), B === t.UNSIGNED_SHORT && ($ = t.RG16UI), B === t.UNSIGNED_INT && ($ = t.RG32UI), B === t.BYTE && ($ = t.RG8I), B === t.SHORT && ($ = t.RG16I), B === t.INT && ($ = t.RG32I)), y === t.RGB_INTEGER && (B === t.UNSIGNED_BYTE && ($ = t.RGB8UI), B === t.UNSIGNED_SHORT && ($ = t.RGB16UI), B === t.UNSIGNED_INT && ($ = t.RGB32UI), B === t.BYTE && ($ = t.RGB8I), B === t.SHORT && ($ = t.RGB16I), B === t.INT && ($ = t.RGB32I)), y === t.RGBA_INTEGER && (B === t.UNSIGNED_BYTE && ($ = t.RGBA8UI), B === t.UNSIGNED_SHORT && ($ = t.RGBA16UI), B === t.UNSIGNED_INT && ($ = t.RGBA32UI), B === t.BYTE && ($ = t.RGBA8I), B === t.SHORT && ($ = t.RGBA16I), B === t.INT && ($ = t.RGBA32I)), y === t.RGB && B === t.UNSIGNED_INT_5_9_9_9_REV && ($ = t.RGB9_E5), y === t.RGBA) {
      const xe = Z ? Gr : Ge.getTransfer(Y);
      B === t.FLOAT && ($ = t.RGBA32F), B === t.HALF_FLOAT && ($ = t.RGBA16F), B === t.UNSIGNED_BYTE && ($ = xe === Ze ? t.SRGB8_ALPHA8 : t.RGBA8), B === t.UNSIGNED_SHORT_4_4_4_4 && ($ = t.RGBA4), B === t.UNSIGNED_SHORT_5_5_5_1 && ($ = t.RGB5_A1);
    }
    return ($ === t.R16F || $ === t.R32F || $ === t.RG16F || $ === t.RG32F || $ === t.RGBA16F || $ === t.RGBA32F) && e.get("EXT_color_buffer_float"), $;
  }
  function x(w, y) {
    let B;
    return w ? y === null || y === Yn || y === Ai ? B = t.DEPTH24_STENCIL8 : y === Qt ? B = t.DEPTH32F_STENCIL8 : y === Xi && (B = t.DEPTH24_STENCIL8, console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")) : y === null || y === Yn || y === Ai ? B = t.DEPTH_COMPONENT24 : y === Qt ? B = t.DEPTH_COMPONENT32F : y === Xi && (B = t.DEPTH_COMPONENT16), B;
  }
  function P(w, y) {
    return p(w) === !0 || w.isFramebufferTexture && w.minFilter !== Nt && w.minFilter !== Jt ? Math.log2(Math.max(y.width, y.height)) + 1 : w.mipmaps !== void 0 && w.mipmaps.length > 0 ? w.mipmaps.length : w.isCompressedTexture && Array.isArray(w.image) ? y.mipmaps.length : 1;
  }
  function b(w) {
    const y = w.target;
    y.removeEventListener("dispose", b), R(y), y.isVideoTexture && h.delete(y);
  }
  function A(w) {
    const y = w.target;
    y.removeEventListener("dispose", A), v(y);
  }
  function R(w) {
    const y = i.get(w);
    if (y.__webglInit === void 0) return;
    const B = w.source, Y = d.get(B);
    if (Y) {
      const Z = Y[y.__cacheKey];
      Z.usedTimes--, Z.usedTimes === 0 && S(w), Object.keys(Y).length === 0 && d.delete(B);
    }
    i.remove(w);
  }
  function S(w) {
    const y = i.get(w);
    t.deleteTexture(y.__webglTexture);
    const B = w.source, Y = d.get(B);
    delete Y[y.__cacheKey], a.memory.textures--;
  }
  function v(w) {
    const y = i.get(w);
    if (w.depthTexture && (w.depthTexture.dispose(), i.remove(w.depthTexture)), w.isWebGLCubeRenderTarget)
      for (let Y = 0; Y < 6; Y++) {
        if (Array.isArray(y.__webglFramebuffer[Y]))
          for (let Z = 0; Z < y.__webglFramebuffer[Y].length; Z++) t.deleteFramebuffer(y.__webglFramebuffer[Y][Z]);
        else
          t.deleteFramebuffer(y.__webglFramebuffer[Y]);
        y.__webglDepthbuffer && t.deleteRenderbuffer(y.__webglDepthbuffer[Y]);
      }
    else {
      if (Array.isArray(y.__webglFramebuffer))
        for (let Y = 0; Y < y.__webglFramebuffer.length; Y++) t.deleteFramebuffer(y.__webglFramebuffer[Y]);
      else
        t.deleteFramebuffer(y.__webglFramebuffer);
      if (y.__webglDepthbuffer && t.deleteRenderbuffer(y.__webglDepthbuffer), y.__webglMultisampledFramebuffer && t.deleteFramebuffer(y.__webglMultisampledFramebuffer), y.__webglColorRenderbuffer)
        for (let Y = 0; Y < y.__webglColorRenderbuffer.length; Y++)
          y.__webglColorRenderbuffer[Y] && t.deleteRenderbuffer(y.__webglColorRenderbuffer[Y]);
      y.__webglDepthRenderbuffer && t.deleteRenderbuffer(y.__webglDepthRenderbuffer);
    }
    const B = w.textures;
    for (let Y = 0, Z = B.length; Y < Z; Y++) {
      const $ = i.get(B[Y]);
      $.__webglTexture && (t.deleteTexture($.__webglTexture), a.memory.textures--), i.remove(B[Y]);
    }
    i.remove(w);
  }
  let C = 0;
  function F() {
    C = 0;
  }
  function L() {
    const w = C;
    return w >= r.maxTextures && console.warn("THREE.WebGLTextures: Trying to use " + w + " texture units while this GPU supports only " + r.maxTextures), C += 1, w;
  }
  function D(w) {
    const y = [];
    return y.push(w.wrapS), y.push(w.wrapT), y.push(w.wrapR || 0), y.push(w.magFilter), y.push(w.minFilter), y.push(w.anisotropy), y.push(w.internalFormat), y.push(w.format), y.push(w.type), y.push(w.generateMipmaps), y.push(w.premultiplyAlpha), y.push(w.flipY), y.push(w.unpackAlignment), y.push(w.colorSpace), y.join();
  }
  function W(w, y) {
    const B = i.get(w);
    if (w.isVideoTexture && Ee(w), w.isRenderTargetTexture === !1 && w.version > 0 && B.__version !== w.version) {
      const Y = w.image;
      if (Y === null)
        console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");
      else if (Y.complete === !1)
        console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");
      else {
        q(B, w, y);
        return;
      }
    }
    n.bindTexture(t.TEXTURE_2D, B.__webglTexture, t.TEXTURE0 + y);
  }
  function V(w, y) {
    const B = i.get(w);
    if (w.version > 0 && B.__version !== w.version) {
      q(B, w, y);
      return;
    }
    n.bindTexture(t.TEXTURE_2D_ARRAY, B.__webglTexture, t.TEXTURE0 + y);
  }
  function K(w, y) {
    const B = i.get(w);
    if (w.version > 0 && B.__version !== w.version) {
      q(B, w, y);
      return;
    }
    n.bindTexture(t.TEXTURE_3D, B.__webglTexture, t.TEXTURE0 + y);
  }
  function G(w, y) {
    const B = i.get(w);
    if (w.version > 0 && B.__version !== w.version) {
      Q(B, w, y);
      return;
    }
    n.bindTexture(t.TEXTURE_CUBE_MAP, B.__webglTexture, t.TEXTURE0 + y);
  }
  const te = {
    [Hs]: t.REPEAT,
    [qn]: t.CLAMP_TO_EDGE,
    [ks]: t.MIRRORED_REPEAT
  }, ae = {
    [Nt]: t.NEAREST,
    [Nf]: t.NEAREST_MIPMAP_NEAREST,
    [tr]: t.NEAREST_MIPMAP_LINEAR,
    [Jt]: t.LINEAR,
    [Zr]: t.LINEAR_MIPMAP_NEAREST,
    [$n]: t.LINEAR_MIPMAP_LINEAR
  }, de = {
    [Hf]: t.NEVER,
    [qf]: t.ALWAYS,
    [kf]: t.LESS,
    [Bc]: t.LEQUAL,
    [Vf]: t.EQUAL,
    [Xf]: t.GEQUAL,
    [Gf]: t.GREATER,
    [Wf]: t.NOTEQUAL
  };
  function Le(w, y) {
    if (y.type === Qt && e.has("OES_texture_float_linear") === !1 && (y.magFilter === Jt || y.magFilter === Zr || y.magFilter === tr || y.magFilter === $n || y.minFilter === Jt || y.minFilter === Zr || y.minFilter === tr || y.minFilter === $n) && console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."), t.texParameteri(w, t.TEXTURE_WRAP_S, te[y.wrapS]), t.texParameteri(w, t.TEXTURE_WRAP_T, te[y.wrapT]), (w === t.TEXTURE_3D || w === t.TEXTURE_2D_ARRAY) && t.texParameteri(w, t.TEXTURE_WRAP_R, te[y.wrapR]), t.texParameteri(w, t.TEXTURE_MAG_FILTER, ae[y.magFilter]), t.texParameteri(w, t.TEXTURE_MIN_FILTER, ae[y.minFilter]), y.compareFunction && (t.texParameteri(w, t.TEXTURE_COMPARE_MODE, t.COMPARE_REF_TO_TEXTURE), t.texParameteri(w, t.TEXTURE_COMPARE_FUNC, de[y.compareFunction])), e.has("EXT_texture_filter_anisotropic") === !0) {
      if (y.magFilter === Nt || y.minFilter !== tr && y.minFilter !== $n || y.type === Qt && e.has("OES_texture_float_linear") === !1) return;
      if (y.anisotropy > 1 || i.get(y).__currentAnisotropy) {
        const B = e.get("EXT_texture_filter_anisotropic");
        t.texParameterf(w, B.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(y.anisotropy, r.getMaxAnisotropy())), i.get(y).__currentAnisotropy = y.anisotropy;
      }
    }
  }
  function Xe(w, y) {
    let B = !1;
    w.__webglInit === void 0 && (w.__webglInit = !0, y.addEventListener("dispose", b));
    const Y = y.source;
    let Z = d.get(Y);
    Z === void 0 && (Z = {}, d.set(Y, Z));
    const $ = D(y);
    if ($ !== w.__cacheKey) {
      Z[$] === void 0 && (Z[$] = {
        texture: t.createTexture(),
        usedTimes: 0
      }, a.memory.textures++, B = !0), Z[$].usedTimes++;
      const xe = Z[w.__cacheKey];
      xe !== void 0 && (Z[w.__cacheKey].usedTimes--, xe.usedTimes === 0 && S(y)), w.__cacheKey = $, w.__webglTexture = Z[$].texture;
    }
    return B;
  }
  function q(w, y, B) {
    let Y = t.TEXTURE_2D;
    (y.isDataArrayTexture || y.isCompressedArrayTexture) && (Y = t.TEXTURE_2D_ARRAY), y.isData3DTexture && (Y = t.TEXTURE_3D);
    const Z = Xe(w, y), $ = y.source;
    n.bindTexture(Y, w.__webglTexture, t.TEXTURE0 + B);
    const xe = i.get($);
    if ($.version !== xe.__version || Z === !0) {
      n.activeTexture(t.TEXTURE0 + B);
      const se = Ge.getPrimaries(Ge.workingColorSpace), fe = y.colorSpace === Cn ? null : Ge.getPrimaries(y.colorSpace), Ve = y.colorSpace === Cn || se === fe ? t.NONE : t.BROWSER_DEFAULT_WEBGL;
      t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, y.flipY), t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, y.premultiplyAlpha), t.pixelStorei(t.UNPACK_ALIGNMENT, y.unpackAlignment), t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL, Ve);
      let J = _(y.image, !1, r.maxTextureSize);
      J = et(y, J);
      const ue = s.convert(y.format, y.colorSpace), Te = s.convert(y.type);
      let be = M(y.internalFormat, ue, Te, y.colorSpace, y.isVideoTexture);
      Le(Y, y);
      let pe;
      const He = y.mipmaps, Ie = y.isVideoTexture !== !0, Je = xe.__version === void 0 || Z === !0, I = $.dataReady, re = P(y, J);
      if (y.isDepthTexture)
        be = x(y.format === wi, y.type), Je && (Ie ? n.texStorage2D(t.TEXTURE_2D, 1, be, J.width, J.height) : n.texImage2D(t.TEXTURE_2D, 0, be, J.width, J.height, 0, ue, Te, null));
      else if (y.isDataTexture)
        if (He.length > 0) {
          Ie && Je && n.texStorage2D(t.TEXTURE_2D, re, be, He[0].width, He[0].height);
          for (let X = 0, j = He.length; X < j; X++)
            pe = He[X], Ie ? I && n.texSubImage2D(t.TEXTURE_2D, X, 0, 0, pe.width, pe.height, ue, Te, pe.data) : n.texImage2D(t.TEXTURE_2D, X, be, pe.width, pe.height, 0, ue, Te, pe.data);
          y.generateMipmaps = !1;
        } else
          Ie ? (Je && n.texStorage2D(t.TEXTURE_2D, re, be, J.width, J.height), I && n.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, J.width, J.height, ue, Te, J.data)) : n.texImage2D(t.TEXTURE_2D, 0, be, J.width, J.height, 0, ue, Te, J.data);
      else if (y.isCompressedTexture)
        if (y.isCompressedArrayTexture) {
          Ie && Je && n.texStorage3D(t.TEXTURE_2D_ARRAY, re, be, He[0].width, He[0].height, J.depth);
          for (let X = 0, j = He.length; X < j; X++)
            if (pe = He[X], y.format !== $t)
              if (ue !== null)
                if (Ie) {
                  if (I)
                    if (y.layerUpdates.size > 0) {
                      const le = Qo(pe.width, pe.height, y.format, y.type);
                      for (const oe of y.layerUpdates) {
                        const Ce = pe.data.subarray(
                          oe * le / pe.data.BYTES_PER_ELEMENT,
                          (oe + 1) * le / pe.data.BYTES_PER_ELEMENT
                        );
                        n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY, X, 0, 0, oe, pe.width, pe.height, 1, ue, Ce);
                      }
                      y.clearLayerUpdates();
                    } else
                      n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY, X, 0, 0, 0, pe.width, pe.height, J.depth, ue, pe.data);
                } else
                  n.compressedTexImage3D(t.TEXTURE_2D_ARRAY, X, be, pe.width, pe.height, J.depth, 0, pe.data, 0, 0);
              else
                console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");
            else
              Ie ? I && n.texSubImage3D(t.TEXTURE_2D_ARRAY, X, 0, 0, 0, pe.width, pe.height, J.depth, ue, Te, pe.data) : n.texImage3D(t.TEXTURE_2D_ARRAY, X, be, pe.width, pe.height, J.depth, 0, ue, Te, pe.data);
        } else {
          Ie && Je && n.texStorage2D(t.TEXTURE_2D, re, be, He[0].width, He[0].height);
          for (let X = 0, j = He.length; X < j; X++)
            pe = He[X], y.format !== $t ? ue !== null ? Ie ? I && n.compressedTexSubImage2D(t.TEXTURE_2D, X, 0, 0, pe.width, pe.height, ue, pe.data) : n.compressedTexImage2D(t.TEXTURE_2D, X, be, pe.width, pe.height, 0, pe.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : Ie ? I && n.texSubImage2D(t.TEXTURE_2D, X, 0, 0, pe.width, pe.height, ue, Te, pe.data) : n.texImage2D(t.TEXTURE_2D, X, be, pe.width, pe.height, 0, ue, Te, pe.data);
        }
      else if (y.isDataArrayTexture)
        if (Ie) {
          if (Je && n.texStorage3D(t.TEXTURE_2D_ARRAY, re, be, J.width, J.height, J.depth), I)
            if (y.layerUpdates.size > 0) {
              const X = Qo(J.width, J.height, y.format, y.type);
              for (const j of y.layerUpdates) {
                const le = J.data.subarray(
                  j * X / J.data.BYTES_PER_ELEMENT,
                  (j + 1) * X / J.data.BYTES_PER_ELEMENT
                );
                n.texSubImage3D(t.TEXTURE_2D_ARRAY, 0, 0, 0, j, J.width, J.height, 1, ue, Te, le);
              }
              y.clearLayerUpdates();
            } else
              n.texSubImage3D(t.TEXTURE_2D_ARRAY, 0, 0, 0, 0, J.width, J.height, J.depth, ue, Te, J.data);
        } else
          n.texImage3D(t.TEXTURE_2D_ARRAY, 0, be, J.width, J.height, J.depth, 0, ue, Te, J.data);
      else if (y.isData3DTexture)
        Ie ? (Je && n.texStorage3D(t.TEXTURE_3D, re, be, J.width, J.height, J.depth), I && n.texSubImage3D(t.TEXTURE_3D, 0, 0, 0, 0, J.width, J.height, J.depth, ue, Te, J.data)) : n.texImage3D(t.TEXTURE_3D, 0, be, J.width, J.height, J.depth, 0, ue, Te, J.data);
      else if (y.isFramebufferTexture) {
        if (Je)
          if (Ie)
            n.texStorage2D(t.TEXTURE_2D, re, be, J.width, J.height);
          else {
            let X = J.width, j = J.height;
            for (let le = 0; le < re; le++)
              n.texImage2D(t.TEXTURE_2D, le, be, X, j, 0, ue, Te, null), X >>= 1, j >>= 1;
          }
      } else if (He.length > 0) {
        if (Ie && Je) {
          const X = ye(He[0]);
          n.texStorage2D(t.TEXTURE_2D, re, be, X.width, X.height);
        }
        for (let X = 0, j = He.length; X < j; X++)
          pe = He[X], Ie ? I && n.texSubImage2D(t.TEXTURE_2D, X, 0, 0, ue, Te, pe) : n.texImage2D(t.TEXTURE_2D, X, be, ue, Te, pe);
        y.generateMipmaps = !1;
      } else if (Ie) {
        if (Je) {
          const X = ye(J);
          n.texStorage2D(t.TEXTURE_2D, re, be, X.width, X.height);
        }
        I && n.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, ue, Te, J);
      } else
        n.texImage2D(t.TEXTURE_2D, 0, be, ue, Te, J);
      p(y) && m(Y), xe.__version = $.version, y.onUpdate && y.onUpdate(y);
    }
    w.__version = y.version;
  }
  function Q(w, y, B) {
    if (y.image.length !== 6) return;
    const Y = Xe(w, y), Z = y.source;
    n.bindTexture(t.TEXTURE_CUBE_MAP, w.__webglTexture, t.TEXTURE0 + B);
    const $ = i.get(Z);
    if (Z.version !== $.__version || Y === !0) {
      n.activeTexture(t.TEXTURE0 + B);
      const xe = Ge.getPrimaries(Ge.workingColorSpace), se = y.colorSpace === Cn ? null : Ge.getPrimaries(y.colorSpace), fe = y.colorSpace === Cn || xe === se ? t.NONE : t.BROWSER_DEFAULT_WEBGL;
      t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, y.flipY), t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, y.premultiplyAlpha), t.pixelStorei(t.UNPACK_ALIGNMENT, y.unpackAlignment), t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL, fe);
      const Ve = y.isCompressedTexture || y.image[0].isCompressedTexture, J = y.image[0] && y.image[0].isDataTexture, ue = [];
      for (let j = 0; j < 6; j++)
        !Ve && !J ? ue[j] = _(y.image[j], !0, r.maxCubemapSize) : ue[j] = J ? y.image[j].image : y.image[j], ue[j] = et(y, ue[j]);
      const Te = ue[0], be = s.convert(y.format, y.colorSpace), pe = s.convert(y.type), He = M(y.internalFormat, be, pe, y.colorSpace), Ie = y.isVideoTexture !== !0, Je = $.__version === void 0 || Y === !0, I = Z.dataReady;
      let re = P(y, Te);
      Le(t.TEXTURE_CUBE_MAP, y);
      let X;
      if (Ve) {
        Ie && Je && n.texStorage2D(t.TEXTURE_CUBE_MAP, re, He, Te.width, Te.height);
        for (let j = 0; j < 6; j++) {
          X = ue[j].mipmaps;
          for (let le = 0; le < X.length; le++) {
            const oe = X[le];
            y.format !== $t ? be !== null ? Ie ? I && n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + j, le, 0, 0, oe.width, oe.height, be, oe.data) : n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + j, le, He, oe.width, oe.height, 0, oe.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()") : Ie ? I && n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + j, le, 0, 0, oe.width, oe.height, be, pe, oe.data) : n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + j, le, He, oe.width, oe.height, 0, be, pe, oe.data);
          }
        }
      } else {
        if (X = y.mipmaps, Ie && Je) {
          X.length > 0 && re++;
          const j = ye(ue[0]);
          n.texStorage2D(t.TEXTURE_CUBE_MAP, re, He, j.width, j.height);
        }
        for (let j = 0; j < 6; j++)
          if (J) {
            Ie ? I && n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + j, 0, 0, 0, ue[j].width, ue[j].height, be, pe, ue[j].data) : n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + j, 0, He, ue[j].width, ue[j].height, 0, be, pe, ue[j].data);
            for (let le = 0; le < X.length; le++) {
              const Ce = X[le].image[j].image;
              Ie ? I && n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + j, le + 1, 0, 0, Ce.width, Ce.height, be, pe, Ce.data) : n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + j, le + 1, He, Ce.width, Ce.height, 0, be, pe, Ce.data);
            }
          } else {
            Ie ? I && n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + j, 0, 0, 0, be, pe, ue[j]) : n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + j, 0, He, be, pe, ue[j]);
            for (let le = 0; le < X.length; le++) {
              const oe = X[le];
              Ie ? I && n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + j, le + 1, 0, 0, be, pe, oe.image[j]) : n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + j, le + 1, He, be, pe, oe.image[j]);
            }
          }
      }
      p(y) && m(t.TEXTURE_CUBE_MAP), $.__version = Z.version, y.onUpdate && y.onUpdate(y);
    }
    w.__version = y.version;
  }
  function he(w, y, B, Y, Z, $) {
    const xe = s.convert(B.format, B.colorSpace), se = s.convert(B.type), fe = M(B.internalFormat, xe, se, B.colorSpace), Ve = i.get(y), J = i.get(B);
    if (J.__renderTarget = y, !Ve.__hasExternalTextures) {
      const ue = Math.max(1, y.width >> $), Te = Math.max(1, y.height >> $);
      Z === t.TEXTURE_3D || Z === t.TEXTURE_2D_ARRAY ? n.texImage3D(Z, $, fe, ue, Te, y.depth, 0, xe, se, null) : n.texImage2D(Z, $, fe, ue, Te, 0, xe, se, null);
    }
    n.bindFramebuffer(t.FRAMEBUFFER, w), Be(y) ? o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER, Y, Z, J.__webglTexture, 0, ze(y)) : (Z === t.TEXTURE_2D || Z >= t.TEXTURE_CUBE_MAP_POSITIVE_X && Z <= t.TEXTURE_CUBE_MAP_NEGATIVE_Z) && t.framebufferTexture2D(t.FRAMEBUFFER, Y, Z, J.__webglTexture, $), n.bindFramebuffer(t.FRAMEBUFFER, null);
  }
  function ie(w, y, B) {
    if (t.bindRenderbuffer(t.RENDERBUFFER, w), y.depthBuffer) {
      const Y = y.depthTexture, Z = Y && Y.isDepthTexture ? Y.type : null, $ = x(y.stencilBuffer, Z), xe = y.stencilBuffer ? t.DEPTH_STENCIL_ATTACHMENT : t.DEPTH_ATTACHMENT, se = ze(y);
      Be(y) ? o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER, se, $, y.width, y.height) : B ? t.renderbufferStorageMultisample(t.RENDERBUFFER, se, $, y.width, y.height) : t.renderbufferStorage(t.RENDERBUFFER, $, y.width, y.height), t.framebufferRenderbuffer(t.FRAMEBUFFER, xe, t.RENDERBUFFER, w);
    } else {
      const Y = y.textures;
      for (let Z = 0; Z < Y.length; Z++) {
        const $ = Y[Z], xe = s.convert($.format, $.colorSpace), se = s.convert($.type), fe = M($.internalFormat, xe, se, $.colorSpace), Ve = ze(y);
        B && Be(y) === !1 ? t.renderbufferStorageMultisample(t.RENDERBUFFER, Ve, fe, y.width, y.height) : Be(y) ? o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER, Ve, fe, y.width, y.height) : t.renderbufferStorage(t.RENDERBUFFER, fe, y.width, y.height);
      }
    }
    t.bindRenderbuffer(t.RENDERBUFFER, null);
  }
  function Se(w, y) {
    if (y && y.isWebGLCubeRenderTarget) throw new Error("Depth Texture with cube render targets is not supported");
    if (n.bindFramebuffer(t.FRAMEBUFFER, w), !(y.depthTexture && y.depthTexture.isDepthTexture))
      throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");
    const Y = i.get(y.depthTexture);
    Y.__renderTarget = y, (!Y.__webglTexture || y.depthTexture.image.width !== y.width || y.depthTexture.image.height !== y.height) && (y.depthTexture.image.width = y.width, y.depthTexture.image.height = y.height, y.depthTexture.needsUpdate = !0), W(y.depthTexture, 0);
    const Z = Y.__webglTexture, $ = ze(y);
    if (y.depthTexture.format === yi)
      Be(y) ? o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER, t.DEPTH_ATTACHMENT, t.TEXTURE_2D, Z, 0, $) : t.framebufferTexture2D(t.FRAMEBUFFER, t.DEPTH_ATTACHMENT, t.TEXTURE_2D, Z, 0);
    else if (y.depthTexture.format === wi)
      Be(y) ? o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER, t.DEPTH_STENCIL_ATTACHMENT, t.TEXTURE_2D, Z, 0, $) : t.framebufferTexture2D(t.FRAMEBUFFER, t.DEPTH_STENCIL_ATTACHMENT, t.TEXTURE_2D, Z, 0);
    else
      throw new Error("Unknown depthTexture format");
  }
  function Re(w) {
    const y = i.get(w), B = w.isWebGLCubeRenderTarget === !0;
    if (y.__boundDepthTexture !== w.depthTexture) {
      const Y = w.depthTexture;
      if (y.__depthDisposeCallback && y.__depthDisposeCallback(), Y) {
        const Z = () => {
          delete y.__boundDepthTexture, delete y.__depthDisposeCallback, Y.removeEventListener("dispose", Z);
        };
        Y.addEventListener("dispose", Z), y.__depthDisposeCallback = Z;
      }
      y.__boundDepthTexture = Y;
    }
    if (w.depthTexture && !y.__autoAllocateDepthBuffer) {
      if (B) throw new Error("target.depthTexture not supported in Cube render targets");
      Se(y.__webglFramebuffer, w);
    } else if (B) {
      y.__webglDepthbuffer = [];
      for (let Y = 0; Y < 6; Y++)
        if (n.bindFramebuffer(t.FRAMEBUFFER, y.__webglFramebuffer[Y]), y.__webglDepthbuffer[Y] === void 0)
          y.__webglDepthbuffer[Y] = t.createRenderbuffer(), ie(y.__webglDepthbuffer[Y], w, !1);
        else {
          const Z = w.stencilBuffer ? t.DEPTH_STENCIL_ATTACHMENT : t.DEPTH_ATTACHMENT, $ = y.__webglDepthbuffer[Y];
          t.bindRenderbuffer(t.RENDERBUFFER, $), t.framebufferRenderbuffer(t.FRAMEBUFFER, Z, t.RENDERBUFFER, $);
        }
    } else if (n.bindFramebuffer(t.FRAMEBUFFER, y.__webglFramebuffer), y.__webglDepthbuffer === void 0)
      y.__webglDepthbuffer = t.createRenderbuffer(), ie(y.__webglDepthbuffer, w, !1);
    else {
      const Y = w.stencilBuffer ? t.DEPTH_STENCIL_ATTACHMENT : t.DEPTH_ATTACHMENT, Z = y.__webglDepthbuffer;
      t.bindRenderbuffer(t.RENDERBUFFER, Z), t.framebufferRenderbuffer(t.FRAMEBUFFER, Y, t.RENDERBUFFER, Z);
    }
    n.bindFramebuffer(t.FRAMEBUFFER, null);
  }
  function Fe(w, y, B) {
    const Y = i.get(w);
    y !== void 0 && he(Y.__webglFramebuffer, w, w.texture, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, 0), B !== void 0 && Re(w);
  }
  function it(w) {
    const y = w.texture, B = i.get(w), Y = i.get(y);
    w.addEventListener("dispose", A);
    const Z = w.textures, $ = w.isWebGLCubeRenderTarget === !0, xe = Z.length > 1;
    if (xe || (Y.__webglTexture === void 0 && (Y.__webglTexture = t.createTexture()), Y.__version = y.version, a.memory.textures++), $) {
      B.__webglFramebuffer = [];
      for (let se = 0; se < 6; se++)
        if (y.mipmaps && y.mipmaps.length > 0) {
          B.__webglFramebuffer[se] = [];
          for (let fe = 0; fe < y.mipmaps.length; fe++)
            B.__webglFramebuffer[se][fe] = t.createFramebuffer();
        } else
          B.__webglFramebuffer[se] = t.createFramebuffer();
    } else {
      if (y.mipmaps && y.mipmaps.length > 0) {
        B.__webglFramebuffer = [];
        for (let se = 0; se < y.mipmaps.length; se++)
          B.__webglFramebuffer[se] = t.createFramebuffer();
      } else
        B.__webglFramebuffer = t.createFramebuffer();
      if (xe)
        for (let se = 0, fe = Z.length; se < fe; se++) {
          const Ve = i.get(Z[se]);
          Ve.__webglTexture === void 0 && (Ve.__webglTexture = t.createTexture(), a.memory.textures++);
        }
      if (w.samples > 0 && Be(w) === !1) {
        B.__webglMultisampledFramebuffer = t.createFramebuffer(), B.__webglColorRenderbuffer = [], n.bindFramebuffer(t.FRAMEBUFFER, B.__webglMultisampledFramebuffer);
        for (let se = 0; se < Z.length; se++) {
          const fe = Z[se];
          B.__webglColorRenderbuffer[se] = t.createRenderbuffer(), t.bindRenderbuffer(t.RENDERBUFFER, B.__webglColorRenderbuffer[se]);
          const Ve = s.convert(fe.format, fe.colorSpace), J = s.convert(fe.type), ue = M(fe.internalFormat, Ve, J, fe.colorSpace, w.isXRRenderTarget === !0), Te = ze(w);
          t.renderbufferStorageMultisample(t.RENDERBUFFER, Te, ue, w.width, w.height), t.framebufferRenderbuffer(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0 + se, t.RENDERBUFFER, B.__webglColorRenderbuffer[se]);
        }
        t.bindRenderbuffer(t.RENDERBUFFER, null), w.depthBuffer && (B.__webglDepthRenderbuffer = t.createRenderbuffer(), ie(B.__webglDepthRenderbuffer, w, !0)), n.bindFramebuffer(t.FRAMEBUFFER, null);
      }
    }
    if ($) {
      n.bindTexture(t.TEXTURE_CUBE_MAP, Y.__webglTexture), Le(t.TEXTURE_CUBE_MAP, y);
      for (let se = 0; se < 6; se++)
        if (y.mipmaps && y.mipmaps.length > 0)
          for (let fe = 0; fe < y.mipmaps.length; fe++)
            he(B.__webglFramebuffer[se][fe], w, y, t.COLOR_ATTACHMENT0, t.TEXTURE_CUBE_MAP_POSITIVE_X + se, fe);
        else
          he(B.__webglFramebuffer[se], w, y, t.COLOR_ATTACHMENT0, t.TEXTURE_CUBE_MAP_POSITIVE_X + se, 0);
      p(y) && m(t.TEXTURE_CUBE_MAP), n.unbindTexture();
    } else if (xe) {
      for (let se = 0, fe = Z.length; se < fe; se++) {
        const Ve = Z[se], J = i.get(Ve);
        n.bindTexture(t.TEXTURE_2D, J.__webglTexture), Le(t.TEXTURE_2D, Ve), he(B.__webglFramebuffer, w, Ve, t.COLOR_ATTACHMENT0 + se, t.TEXTURE_2D, 0), p(Ve) && m(t.TEXTURE_2D);
      }
      n.unbindTexture();
    } else {
      let se = t.TEXTURE_2D;
      if ((w.isWebGL3DRenderTarget || w.isWebGLArrayRenderTarget) && (se = w.isWebGL3DRenderTarget ? t.TEXTURE_3D : t.TEXTURE_2D_ARRAY), n.bindTexture(se, Y.__webglTexture), Le(se, y), y.mipmaps && y.mipmaps.length > 0)
        for (let fe = 0; fe < y.mipmaps.length; fe++)
          he(B.__webglFramebuffer[fe], w, y, t.COLOR_ATTACHMENT0, se, fe);
      else
        he(B.__webglFramebuffer, w, y, t.COLOR_ATTACHMENT0, se, 0);
      p(y) && m(se), n.unbindTexture();
    }
    w.depthBuffer && Re(w);
  }
  function ke(w) {
    const y = w.textures;
    for (let B = 0, Y = y.length; B < Y; B++) {
      const Z = y[B];
      if (p(Z)) {
        const $ = E(w), xe = i.get(Z).__webglTexture;
        n.bindTexture($, xe), m($), n.unbindTexture();
      }
    }
  }
  const at = [], O = [];
  function Ft(w) {
    if (w.samples > 0) {
      if (Be(w) === !1) {
        const y = w.textures, B = w.width, Y = w.height;
        let Z = t.COLOR_BUFFER_BIT;
        const $ = w.stencilBuffer ? t.DEPTH_STENCIL_ATTACHMENT : t.DEPTH_ATTACHMENT, xe = i.get(w), se = y.length > 1;
        if (se)
          for (let fe = 0; fe < y.length; fe++)
            n.bindFramebuffer(t.FRAMEBUFFER, xe.__webglMultisampledFramebuffer), t.framebufferRenderbuffer(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0 + fe, t.RENDERBUFFER, null), n.bindFramebuffer(t.FRAMEBUFFER, xe.__webglFramebuffer), t.framebufferTexture2D(t.DRAW_FRAMEBUFFER, t.COLOR_ATTACHMENT0 + fe, t.TEXTURE_2D, null, 0);
        n.bindFramebuffer(t.READ_FRAMEBUFFER, xe.__webglMultisampledFramebuffer), n.bindFramebuffer(t.DRAW_FRAMEBUFFER, xe.__webglFramebuffer);
        for (let fe = 0; fe < y.length; fe++) {
          if (w.resolveDepthBuffer && (w.depthBuffer && (Z |= t.DEPTH_BUFFER_BIT), w.stencilBuffer && w.resolveStencilBuffer && (Z |= t.STENCIL_BUFFER_BIT)), se) {
            t.framebufferRenderbuffer(t.READ_FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.RENDERBUFFER, xe.__webglColorRenderbuffer[fe]);
            const Ve = i.get(y[fe]).__webglTexture;
            t.framebufferTexture2D(t.DRAW_FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, Ve, 0);
          }
          t.blitFramebuffer(0, 0, B, Y, 0, 0, B, Y, Z, t.NEAREST), c === !0 && (at.length = 0, O.length = 0, at.push(t.COLOR_ATTACHMENT0 + fe), w.depthBuffer && w.resolveDepthBuffer === !1 && (at.push($), O.push($), t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER, O)), t.invalidateFramebuffer(t.READ_FRAMEBUFFER, at));
        }
        if (n.bindFramebuffer(t.READ_FRAMEBUFFER, null), n.bindFramebuffer(t.DRAW_FRAMEBUFFER, null), se)
          for (let fe = 0; fe < y.length; fe++) {
            n.bindFramebuffer(t.FRAMEBUFFER, xe.__webglMultisampledFramebuffer), t.framebufferRenderbuffer(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0 + fe, t.RENDERBUFFER, xe.__webglColorRenderbuffer[fe]);
            const Ve = i.get(y[fe]).__webglTexture;
            n.bindFramebuffer(t.FRAMEBUFFER, xe.__webglFramebuffer), t.framebufferTexture2D(t.DRAW_FRAMEBUFFER, t.COLOR_ATTACHMENT0 + fe, t.TEXTURE_2D, Ve, 0);
          }
        n.bindFramebuffer(t.DRAW_FRAMEBUFFER, xe.__webglMultisampledFramebuffer);
      } else if (w.depthBuffer && w.resolveDepthBuffer === !1 && c) {
        const y = w.stencilBuffer ? t.DEPTH_STENCIL_ATTACHMENT : t.DEPTH_ATTACHMENT;
        t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER, [y]);
      }
    }
  }
  function ze(w) {
    return Math.min(r.maxSamples, w.samples);
  }
  function Be(w) {
    const y = i.get(w);
    return w.samples > 0 && e.has("WEBGL_multisampled_render_to_texture") === !0 && y.__useRenderToTexture !== !1;
  }
  function Ee(w) {
    const y = a.render.frame;
    h.get(w) !== y && (h.set(w, y), w.update());
  }
  function et(w, y) {
    const B = w.colorSpace, Y = w.format, Z = w.type;
    return w.isCompressedTexture === !0 || w.isVideoTexture === !0 || B !== Ci && B !== Cn && (Ge.getTransfer(B) === Ze ? (Y !== $t || Z !== mn) && console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.") : console.error("THREE.WebGLTextures: Unsupported texture color space:", B)), y;
  }
  function ye(w) {
    return typeof HTMLImageElement < "u" && w instanceof HTMLImageElement ? (l.width = w.naturalWidth || w.width, l.height = w.naturalHeight || w.height) : typeof VideoFrame < "u" && w instanceof VideoFrame ? (l.width = w.displayWidth, l.height = w.displayHeight) : (l.width = w.width, l.height = w.height), l;
  }
  this.allocateTextureUnit = L, this.resetTextureUnits = F, this.setTexture2D = W, this.setTexture2DArray = V, this.setTexture3D = K, this.setTextureCube = G, this.rebindTextures = Fe, this.setupRenderTarget = it, this.updateRenderTargetMipmap = ke, this.updateMultisampleRenderTarget = Ft, this.setupDepthRenderbuffer = Re, this.setupFrameBufferTexture = he, this.useMultisampledRTT = Be;
}
function K0(t, e) {
  function n(i, r = Cn) {
    let s;
    const a = Ge.getTransfer(r);
    if (i === mn) return t.UNSIGNED_BYTE;
    if (i === Ea) return t.UNSIGNED_SHORT_4_4_4_4;
    if (i === Ta) return t.UNSIGNED_SHORT_5_5_5_1;
    if (i === Lc) return t.UNSIGNED_INT_5_9_9_9_REV;
    if (i === Pc) return t.BYTE;
    if (i === Dc) return t.SHORT;
    if (i === Xi) return t.UNSIGNED_SHORT;
    if (i === Sa) return t.INT;
    if (i === Yn) return t.UNSIGNED_INT;
    if (i === Qt) return t.FLOAT;
    if (i === ji) return t.HALF_FLOAT;
    if (i === Ic) return t.ALPHA;
    if (i === Uc) return t.RGB;
    if (i === $t) return t.RGBA;
    if (i === Nc) return t.LUMINANCE;
    if (i === Fc) return t.LUMINANCE_ALPHA;
    if (i === yi) return t.DEPTH_COMPONENT;
    if (i === wi) return t.DEPTH_STENCIL;
    if (i === ba) return t.RED;
    if (i === Aa) return t.RED_INTEGER;
    if (i === Oc) return t.RG;
    if (i === wa) return t.RG_INTEGER;
    if (i === Ra) return t.RGBA_INTEGER;
    if (i === Cr || i === Pr || i === Dr || i === Lr)
      if (a === Ze)
        if (s = e.get("WEBGL_compressed_texture_s3tc_srgb"), s !== null) {
          if (i === Cr) return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;
          if (i === Pr) return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
          if (i === Dr) return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
          if (i === Lr) return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
        } else
          return null;
      else if (s = e.get("WEBGL_compressed_texture_s3tc"), s !== null) {
        if (i === Cr) return s.COMPRESSED_RGB_S3TC_DXT1_EXT;
        if (i === Pr) return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        if (i === Dr) return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        if (i === Lr) return s.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      } else
        return null;
    if (i === Vs || i === Gs || i === Ws || i === Xs)
      if (s = e.get("WEBGL_compressed_texture_pvrtc"), s !== null) {
        if (i === Vs) return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        if (i === Gs) return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        if (i === Ws) return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        if (i === Xs) return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
      } else
        return null;
    if (i === qs || i === $s || i === Ys)
      if (s = e.get("WEBGL_compressed_texture_etc"), s !== null) {
        if (i === qs || i === $s) return a === Ze ? s.COMPRESSED_SRGB8_ETC2 : s.COMPRESSED_RGB8_ETC2;
        if (i === Ys) return a === Ze ? s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : s.COMPRESSED_RGBA8_ETC2_EAC;
      } else
        return null;
    if (i === js || i === Zs || i === Ks || i === Js || i === Qs || i === ea || i === ta || i === na || i === ia || i === ra || i === sa || i === aa || i === oa || i === ca)
      if (s = e.get("WEBGL_compressed_texture_astc"), s !== null) {
        if (i === js) return a === Ze ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : s.COMPRESSED_RGBA_ASTC_4x4_KHR;
        if (i === Zs) return a === Ze ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : s.COMPRESSED_RGBA_ASTC_5x4_KHR;
        if (i === Ks) return a === Ze ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : s.COMPRESSED_RGBA_ASTC_5x5_KHR;
        if (i === Js) return a === Ze ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : s.COMPRESSED_RGBA_ASTC_6x5_KHR;
        if (i === Qs) return a === Ze ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : s.COMPRESSED_RGBA_ASTC_6x6_KHR;
        if (i === ea) return a === Ze ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : s.COMPRESSED_RGBA_ASTC_8x5_KHR;
        if (i === ta) return a === Ze ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : s.COMPRESSED_RGBA_ASTC_8x6_KHR;
        if (i === na) return a === Ze ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : s.COMPRESSED_RGBA_ASTC_8x8_KHR;
        if (i === ia) return a === Ze ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : s.COMPRESSED_RGBA_ASTC_10x5_KHR;
        if (i === ra) return a === Ze ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : s.COMPRESSED_RGBA_ASTC_10x6_KHR;
        if (i === sa) return a === Ze ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : s.COMPRESSED_RGBA_ASTC_10x8_KHR;
        if (i === aa) return a === Ze ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : s.COMPRESSED_RGBA_ASTC_10x10_KHR;
        if (i === oa) return a === Ze ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : s.COMPRESSED_RGBA_ASTC_12x10_KHR;
        if (i === ca) return a === Ze ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : s.COMPRESSED_RGBA_ASTC_12x12_KHR;
      } else
        return null;
    if (i === Ir || i === la || i === ha)
      if (s = e.get("EXT_texture_compression_bptc"), s !== null) {
        if (i === Ir) return a === Ze ? s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : s.COMPRESSED_RGBA_BPTC_UNORM_EXT;
        if (i === la) return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
        if (i === ha) return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
      } else
        return null;
    if (i === zc || i === fa || i === da || i === ua)
      if (s = e.get("EXT_texture_compression_rgtc"), s !== null) {
        if (i === Ir) return s.COMPRESSED_RED_RGTC1_EXT;
        if (i === fa) return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;
        if (i === da) return s.COMPRESSED_RED_GREEN_RGTC2_EXT;
        if (i === ua) return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
      } else
        return null;
    return i === Ai ? t.UNSIGNED_INT_24_8 : t[i] !== void 0 ? t[i] : null;
  }
  return { convert: n };
}
class J0 extends Ht {
  constructor(e = []) {
    super(), this.isArrayCamera = !0, this.cameras = e;
  }
}
class yt extends gt {
  constructor() {
    super(), this.isGroup = !0, this.type = "Group";
  }
}
const Q0 = { type: "move" };
class Ts {
  constructor() {
    this._targetRay = null, this._grip = null, this._hand = null;
  }
  getHandSpace() {
    return this._hand === null && (this._hand = new yt(), this._hand.matrixAutoUpdate = !1, this._hand.visible = !1, this._hand.joints = {}, this._hand.inputState = { pinching: !1 }), this._hand;
  }
  getTargetRaySpace() {
    return this._targetRay === null && (this._targetRay = new yt(), this._targetRay.matrixAutoUpdate = !1, this._targetRay.visible = !1, this._targetRay.hasLinearVelocity = !1, this._targetRay.linearVelocity = new z(), this._targetRay.hasAngularVelocity = !1, this._targetRay.angularVelocity = new z()), this._targetRay;
  }
  getGripSpace() {
    return this._grip === null && (this._grip = new yt(), this._grip.matrixAutoUpdate = !1, this._grip.visible = !1, this._grip.hasLinearVelocity = !1, this._grip.linearVelocity = new z(), this._grip.hasAngularVelocity = !1, this._grip.angularVelocity = new z()), this._grip;
  }
  dispatchEvent(e) {
    return this._targetRay !== null && this._targetRay.dispatchEvent(e), this._grip !== null && this._grip.dispatchEvent(e), this._hand !== null && this._hand.dispatchEvent(e), this;
  }
  connect(e) {
    if (e && e.hand) {
      const n = this._hand;
      if (n)
        for (const i of e.hand.values())
          this._getHandJoint(n, i);
    }
    return this.dispatchEvent({ type: "connected", data: e }), this;
  }
  disconnect(e) {
    return this.dispatchEvent({ type: "disconnected", data: e }), this._targetRay !== null && (this._targetRay.visible = !1), this._grip !== null && (this._grip.visible = !1), this._hand !== null && (this._hand.visible = !1), this;
  }
  update(e, n, i) {
    let r = null, s = null, a = null;
    const o = this._targetRay, c = this._grip, l = this._hand;
    if (e && n.session.visibilityState !== "visible-blurred") {
      if (l && e.hand) {
        a = !0;
        for (const _ of e.hand.values()) {
          const p = n.getJointPose(_, i), m = this._getHandJoint(l, _);
          p !== null && (m.matrix.fromArray(p.transform.matrix), m.matrix.decompose(m.position, m.rotation, m.scale), m.matrixWorldNeedsUpdate = !0, m.jointRadius = p.radius), m.visible = p !== null;
        }
        const h = l.joints["index-finger-tip"], f = l.joints["thumb-tip"], d = h.position.distanceTo(f.position), u = 0.02, g = 5e-3;
        l.inputState.pinching && d > u + g ? (l.inputState.pinching = !1, this.dispatchEvent({
          type: "pinchend",
          handedness: e.handedness,
          target: this
        })) : !l.inputState.pinching && d <= u - g && (l.inputState.pinching = !0, this.dispatchEvent({
          type: "pinchstart",
          handedness: e.handedness,
          target: this
        }));
      } else
        c !== null && e.gripSpace && (s = n.getPose(e.gripSpace, i), s !== null && (c.matrix.fromArray(s.transform.matrix), c.matrix.decompose(c.position, c.rotation, c.scale), c.matrixWorldNeedsUpdate = !0, s.linearVelocity ? (c.hasLinearVelocity = !0, c.linearVelocity.copy(s.linearVelocity)) : c.hasLinearVelocity = !1, s.angularVelocity ? (c.hasAngularVelocity = !0, c.angularVelocity.copy(s.angularVelocity)) : c.hasAngularVelocity = !1));
      o !== null && (r = n.getPose(e.targetRaySpace, i), r === null && s !== null && (r = s), r !== null && (o.matrix.fromArray(r.transform.matrix), o.matrix.decompose(o.position, o.rotation, o.scale), o.matrixWorldNeedsUpdate = !0, r.linearVelocity ? (o.hasLinearVelocity = !0, o.linearVelocity.copy(r.linearVelocity)) : o.hasLinearVelocity = !1, r.angularVelocity ? (o.hasAngularVelocity = !0, o.angularVelocity.copy(r.angularVelocity)) : o.hasAngularVelocity = !1, this.dispatchEvent(Q0)));
    }
    return o !== null && (o.visible = r !== null), c !== null && (c.visible = s !== null), l !== null && (l.visible = a !== null), this;
  }
  // private method
  _getHandJoint(e, n) {
    if (e.joints[n.jointName] === void 0) {
      const i = new yt();
      i.matrixAutoUpdate = !1, i.visible = !1, e.joints[n.jointName] = i, e.add(i);
    }
    return e.joints[n.jointName];
  }
}
const eg = `
void main() {

	gl_Position = vec4( position, 1.0 );

}`, tg = `
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;
class ng {
  constructor() {
    this.texture = null, this.mesh = null, this.depthNear = 0, this.depthFar = 0;
  }
  init(e, n, i) {
    if (this.texture === null) {
      const r = new St(), s = e.properties.get(r);
      s.__webglTexture = n.texture, (n.depthNear != i.depthNear || n.depthFar != i.depthFar) && (this.depthNear = n.depthNear, this.depthFar = n.depthFar), this.texture = r;
    }
  }
  getMesh(e) {
    if (this.texture !== null && this.mesh === null) {
      const n = e.cameras[0].viewport, i = new tn({
        vertexShader: eg,
        fragmentShader: tg,
        uniforms: {
          depthColor: { value: this.texture },
          depthWidth: { value: n.z },
          depthHeight: { value: n.w }
        }
      });
      this.mesh = new Ut(new Wr(20, 20), i);
    }
    return this.mesh;
  }
  reset() {
    this.texture = null, this.mesh = null;
  }
  getDepthTexture() {
    return this.texture;
  }
}
class ig extends Zn {
  constructor(e, n) {
    super();
    const i = this;
    let r = null, s = 1, a = null, o = "local-floor", c = 1, l = null, h = null, f = null, d = null, u = null, g = null;
    const _ = new ng(), p = n.getContextAttributes();
    let m = null, E = null;
    const M = [], x = [], P = new we();
    let b = null;
    const A = new Ht();
    A.viewport = new st();
    const R = new Ht();
    R.viewport = new st();
    const S = [A, R], v = new J0();
    let C = null, F = null;
    this.cameraAutoUpdate = !0, this.enabled = !1, this.isPresenting = !1, this.getController = function(q) {
      let Q = M[q];
      return Q === void 0 && (Q = new Ts(), M[q] = Q), Q.getTargetRaySpace();
    }, this.getControllerGrip = function(q) {
      let Q = M[q];
      return Q === void 0 && (Q = new Ts(), M[q] = Q), Q.getGripSpace();
    }, this.getHand = function(q) {
      let Q = M[q];
      return Q === void 0 && (Q = new Ts(), M[q] = Q), Q.getHandSpace();
    };
    function L(q) {
      const Q = x.indexOf(q.inputSource);
      if (Q === -1)
        return;
      const he = M[Q];
      he !== void 0 && (he.update(q.inputSource, q.frame, l || a), he.dispatchEvent({ type: q.type, data: q.inputSource }));
    }
    function D() {
      r.removeEventListener("select", L), r.removeEventListener("selectstart", L), r.removeEventListener("selectend", L), r.removeEventListener("squeeze", L), r.removeEventListener("squeezestart", L), r.removeEventListener("squeezeend", L), r.removeEventListener("end", D), r.removeEventListener("inputsourceschange", W);
      for (let q = 0; q < M.length; q++) {
        const Q = x[q];
        Q !== null && (x[q] = null, M[q].disconnect(Q));
      }
      C = null, F = null, _.reset(), e.setRenderTarget(m), u = null, d = null, f = null, r = null, E = null, Xe.stop(), i.isPresenting = !1, e.setPixelRatio(b), e.setSize(P.width, P.height, !1), i.dispatchEvent({ type: "sessionend" });
    }
    this.setFramebufferScaleFactor = function(q) {
      s = q, i.isPresenting === !0 && console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.");
    }, this.setReferenceSpaceType = function(q) {
      o = q, i.isPresenting === !0 && console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.");
    }, this.getReferenceSpace = function() {
      return l || a;
    }, this.setReferenceSpace = function(q) {
      l = q;
    }, this.getBaseLayer = function() {
      return d !== null ? d : u;
    }, this.getBinding = function() {
      return f;
    }, this.getFrame = function() {
      return g;
    }, this.getSession = function() {
      return r;
    }, this.setSession = async function(q) {
      if (r = q, r !== null) {
        if (m = e.getRenderTarget(), r.addEventListener("select", L), r.addEventListener("selectstart", L), r.addEventListener("selectend", L), r.addEventListener("squeeze", L), r.addEventListener("squeezestart", L), r.addEventListener("squeezeend", L), r.addEventListener("end", D), r.addEventListener("inputsourceschange", W), p.xrCompatible !== !0 && await n.makeXRCompatible(), b = e.getPixelRatio(), e.getSize(P), r.renderState.layers === void 0) {
          const Q = {
            antialias: p.antialias,
            alpha: !0,
            depth: p.depth,
            stencil: p.stencil,
            framebufferScaleFactor: s
          };
          u = new XRWebGLLayer(r, n, Q), r.updateRenderState({ baseLayer: u }), e.setPixelRatio(1), e.setSize(u.framebufferWidth, u.framebufferHeight, !1), E = new jn(
            u.framebufferWidth,
            u.framebufferHeight,
            {
              format: $t,
              type: mn,
              colorSpace: e.outputColorSpace,
              stencilBuffer: p.stencil
            }
          );
        } else {
          let Q = null, he = null, ie = null;
          p.depth && (ie = p.stencil ? n.DEPTH24_STENCIL8 : n.DEPTH_COMPONENT24, Q = p.stencil ? wi : yi, he = p.stencil ? Ai : Yn);
          const Se = {
            colorFormat: n.RGBA8,
            depthFormat: ie,
            scaleFactor: s
          };
          f = new XRWebGLBinding(r, n), d = f.createProjectionLayer(Se), r.updateRenderState({ layers: [d] }), e.setPixelRatio(1), e.setSize(d.textureWidth, d.textureHeight, !1), E = new jn(
            d.textureWidth,
            d.textureHeight,
            {
              format: $t,
              type: mn,
              depthTexture: new Jc(d.textureWidth, d.textureHeight, he, void 0, void 0, void 0, void 0, void 0, void 0, Q),
              stencilBuffer: p.stencil,
              colorSpace: e.outputColorSpace,
              samples: p.antialias ? 4 : 0,
              resolveDepthBuffer: d.ignoreDepthValues === !1
            }
          );
        }
        E.isXRRenderTarget = !0, this.setFoveation(c), l = null, a = await r.requestReferenceSpace(o), Xe.setContext(r), Xe.start(), i.isPresenting = !0, i.dispatchEvent({ type: "sessionstart" });
      }
    }, this.getEnvironmentBlendMode = function() {
      if (r !== null)
        return r.environmentBlendMode;
    }, this.getDepthTexture = function() {
      return _.getDepthTexture();
    };
    function W(q) {
      for (let Q = 0; Q < q.removed.length; Q++) {
        const he = q.removed[Q], ie = x.indexOf(he);
        ie >= 0 && (x[ie] = null, M[ie].disconnect(he));
      }
      for (let Q = 0; Q < q.added.length; Q++) {
        const he = q.added[Q];
        let ie = x.indexOf(he);
        if (ie === -1) {
          for (let Re = 0; Re < M.length; Re++)
            if (Re >= x.length) {
              x.push(he), ie = Re;
              break;
            } else if (x[Re] === null) {
              x[Re] = he, ie = Re;
              break;
            }
          if (ie === -1) break;
        }
        const Se = M[ie];
        Se && Se.connect(he);
      }
    }
    const V = new z(), K = new z();
    function G(q, Q, he) {
      V.setFromMatrixPosition(Q.matrixWorld), K.setFromMatrixPosition(he.matrixWorld);
      const ie = V.distanceTo(K), Se = Q.projectionMatrix.elements, Re = he.projectionMatrix.elements, Fe = Se[14] / (Se[10] - 1), it = Se[14] / (Se[10] + 1), ke = (Se[9] + 1) / Se[5], at = (Se[9] - 1) / Se[5], O = (Se[8] - 1) / Se[0], Ft = (Re[8] + 1) / Re[0], ze = Fe * O, Be = Fe * Ft, Ee = ie / (-O + Ft), et = Ee * -O;
      if (Q.matrixWorld.decompose(q.position, q.quaternion, q.scale), q.translateX(et), q.translateZ(Ee), q.matrixWorld.compose(q.position, q.quaternion, q.scale), q.matrixWorldInverse.copy(q.matrixWorld).invert(), Se[10] === -1)
        q.projectionMatrix.copy(Q.projectionMatrix), q.projectionMatrixInverse.copy(Q.projectionMatrixInverse);
      else {
        const ye = Fe + Ee, w = it + Ee, y = ze - et, B = Be + (ie - et), Y = ke * it / w * ye, Z = at * it / w * ye;
        q.projectionMatrix.makePerspective(y, B, Y, Z, ye, w), q.projectionMatrixInverse.copy(q.projectionMatrix).invert();
      }
    }
    function te(q, Q) {
      Q === null ? q.matrixWorld.copy(q.matrix) : q.matrixWorld.multiplyMatrices(Q.matrixWorld, q.matrix), q.matrixWorldInverse.copy(q.matrixWorld).invert();
    }
    this.updateCamera = function(q) {
      if (r === null) return;
      let Q = q.near, he = q.far;
      _.texture !== null && (_.depthNear > 0 && (Q = _.depthNear), _.depthFar > 0 && (he = _.depthFar)), v.near = R.near = A.near = Q, v.far = R.far = A.far = he, (C !== v.near || F !== v.far) && (r.updateRenderState({
        depthNear: v.near,
        depthFar: v.far
      }), C = v.near, F = v.far), A.layers.mask = q.layers.mask | 2, R.layers.mask = q.layers.mask | 4, v.layers.mask = A.layers.mask | R.layers.mask;
      const ie = q.parent, Se = v.cameras;
      te(v, ie);
      for (let Re = 0; Re < Se.length; Re++)
        te(Se[Re], ie);
      Se.length === 2 ? G(v, A, R) : v.projectionMatrix.copy(A.projectionMatrix), ae(q, v, ie);
    };
    function ae(q, Q, he) {
      he === null ? q.matrix.copy(Q.matrixWorld) : (q.matrix.copy(he.matrixWorld), q.matrix.invert(), q.matrix.multiply(Q.matrixWorld)), q.matrix.decompose(q.position, q.quaternion, q.scale), q.updateMatrixWorld(!0), q.projectionMatrix.copy(Q.projectionMatrix), q.projectionMatrixInverse.copy(Q.projectionMatrixInverse), q.isPerspectiveCamera && (q.fov = pa * 2 * Math.atan(1 / q.projectionMatrix.elements[5]), q.zoom = 1);
    }
    this.getCamera = function() {
      return v;
    }, this.getFoveation = function() {
      if (!(d === null && u === null))
        return c;
    }, this.setFoveation = function(q) {
      c = q, d !== null && (d.fixedFoveation = q), u !== null && u.fixedFoveation !== void 0 && (u.fixedFoveation = q);
    }, this.hasDepthSensing = function() {
      return _.texture !== null;
    }, this.getDepthSensingMesh = function() {
      return _.getMesh(v);
    };
    let de = null;
    function Le(q, Q) {
      if (h = Q.getViewerPose(l || a), g = Q, h !== null) {
        const he = h.views;
        u !== null && (e.setRenderTargetFramebuffer(E, u.framebuffer), e.setRenderTarget(E));
        let ie = !1;
        he.length !== v.cameras.length && (v.cameras.length = 0, ie = !0);
        for (let Re = 0; Re < he.length; Re++) {
          const Fe = he[Re];
          let it = null;
          if (u !== null)
            it = u.getViewport(Fe);
          else {
            const at = f.getViewSubImage(d, Fe);
            it = at.viewport, Re === 0 && (e.setRenderTargetTextures(
              E,
              at.colorTexture,
              d.ignoreDepthValues ? void 0 : at.depthStencilTexture
            ), e.setRenderTarget(E));
          }
          let ke = S[Re];
          ke === void 0 && (ke = new Ht(), ke.layers.enable(Re), ke.viewport = new st(), S[Re] = ke), ke.matrix.fromArray(Fe.transform.matrix), ke.matrix.decompose(ke.position, ke.quaternion, ke.scale), ke.projectionMatrix.fromArray(Fe.projectionMatrix), ke.projectionMatrixInverse.copy(ke.projectionMatrix).invert(), ke.viewport.set(it.x, it.y, it.width, it.height), Re === 0 && (v.matrix.copy(ke.matrix), v.matrix.decompose(v.position, v.quaternion, v.scale)), ie === !0 && v.cameras.push(ke);
        }
        const Se = r.enabledFeatures;
        if (Se && Se.includes("depth-sensing")) {
          const Re = f.getDepthInformation(he[0]);
          Re && Re.isValid && Re.texture && _.init(e, Re, r.renderState);
        }
      }
      for (let he = 0; he < M.length; he++) {
        const ie = x[he], Se = M[he];
        ie !== null && Se !== void 0 && Se.update(ie, Q, l || a);
      }
      de && de(q, Q), Q.detectedPlanes && i.dispatchEvent({ type: "planesdetected", data: Q }), g = null;
    }
    const Xe = new Zc();
    Xe.setAnimationLoop(Le), this.setAnimationLoop = function(q) {
      de = q;
    }, this.dispose = function() {
    };
  }
}
const Vn = /* @__PURE__ */ new gn(), rg = /* @__PURE__ */ new je();
function sg(t, e) {
  function n(p, m) {
    p.matrixAutoUpdate === !0 && p.updateMatrix(), m.value.copy(p.matrix);
  }
  function i(p, m) {
    m.color.getRGB(p.fogColor.value, $c(t)), m.isFog ? (p.fogNear.value = m.near, p.fogFar.value = m.far) : m.isFogExp2 && (p.fogDensity.value = m.density);
  }
  function r(p, m, E, M, x) {
    m.isMeshBasicMaterial || m.isMeshLambertMaterial ? s(p, m) : m.isMeshToonMaterial ? (s(p, m), f(p, m)) : m.isMeshPhongMaterial ? (s(p, m), h(p, m)) : m.isMeshStandardMaterial ? (s(p, m), d(p, m), m.isMeshPhysicalMaterial && u(p, m, x)) : m.isMeshMatcapMaterial ? (s(p, m), g(p, m)) : m.isMeshDepthMaterial ? s(p, m) : m.isMeshDistanceMaterial ? (s(p, m), _(p, m)) : m.isMeshNormalMaterial ? s(p, m) : m.isLineBasicMaterial ? (a(p, m), m.isLineDashedMaterial && o(p, m)) : m.isPointsMaterial ? c(p, m, E, M) : m.isSpriteMaterial ? l(p, m) : m.isShadowMaterial ? (p.color.value.copy(m.color), p.opacity.value = m.opacity) : m.isShaderMaterial && (m.uniformsNeedUpdate = !1);
  }
  function s(p, m) {
    p.opacity.value = m.opacity, m.color && p.diffuse.value.copy(m.color), m.emissive && p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity), m.map && (p.map.value = m.map, n(m.map, p.mapTransform)), m.alphaMap && (p.alphaMap.value = m.alphaMap, n(m.alphaMap, p.alphaMapTransform)), m.bumpMap && (p.bumpMap.value = m.bumpMap, n(m.bumpMap, p.bumpMapTransform), p.bumpScale.value = m.bumpScale, m.side === Pt && (p.bumpScale.value *= -1)), m.normalMap && (p.normalMap.value = m.normalMap, n(m.normalMap, p.normalMapTransform), p.normalScale.value.copy(m.normalScale), m.side === Pt && p.normalScale.value.negate()), m.displacementMap && (p.displacementMap.value = m.displacementMap, n(m.displacementMap, p.displacementMapTransform), p.displacementScale.value = m.displacementScale, p.displacementBias.value = m.displacementBias), m.emissiveMap && (p.emissiveMap.value = m.emissiveMap, n(m.emissiveMap, p.emissiveMapTransform)), m.specularMap && (p.specularMap.value = m.specularMap, n(m.specularMap, p.specularMapTransform)), m.alphaTest > 0 && (p.alphaTest.value = m.alphaTest);
    const E = e.get(m), M = E.envMap, x = E.envMapRotation;
    M && (p.envMap.value = M, Vn.copy(x), Vn.x *= -1, Vn.y *= -1, Vn.z *= -1, M.isCubeTexture && M.isRenderTargetTexture === !1 && (Vn.y *= -1, Vn.z *= -1), p.envMapRotation.value.setFromMatrix4(rg.makeRotationFromEuler(Vn)), p.flipEnvMap.value = M.isCubeTexture && M.isRenderTargetTexture === !1 ? -1 : 1, p.reflectivity.value = m.reflectivity, p.ior.value = m.ior, p.refractionRatio.value = m.refractionRatio), m.lightMap && (p.lightMap.value = m.lightMap, p.lightMapIntensity.value = m.lightMapIntensity, n(m.lightMap, p.lightMapTransform)), m.aoMap && (p.aoMap.value = m.aoMap, p.aoMapIntensity.value = m.aoMapIntensity, n(m.aoMap, p.aoMapTransform));
  }
  function a(p, m) {
    p.diffuse.value.copy(m.color), p.opacity.value = m.opacity, m.map && (p.map.value = m.map, n(m.map, p.mapTransform));
  }
  function o(p, m) {
    p.dashSize.value = m.dashSize, p.totalSize.value = m.dashSize + m.gapSize, p.scale.value = m.scale;
  }
  function c(p, m, E, M) {
    p.diffuse.value.copy(m.color), p.opacity.value = m.opacity, p.size.value = m.size * E, p.scale.value = M * 0.5, m.map && (p.map.value = m.map, n(m.map, p.uvTransform)), m.alphaMap && (p.alphaMap.value = m.alphaMap, n(m.alphaMap, p.alphaMapTransform)), m.alphaTest > 0 && (p.alphaTest.value = m.alphaTest);
  }
  function l(p, m) {
    p.diffuse.value.copy(m.color), p.opacity.value = m.opacity, p.rotation.value = m.rotation, m.map && (p.map.value = m.map, n(m.map, p.mapTransform)), m.alphaMap && (p.alphaMap.value = m.alphaMap, n(m.alphaMap, p.alphaMapTransform)), m.alphaTest > 0 && (p.alphaTest.value = m.alphaTest);
  }
  function h(p, m) {
    p.specular.value.copy(m.specular), p.shininess.value = Math.max(m.shininess, 1e-4);
  }
  function f(p, m) {
    m.gradientMap && (p.gradientMap.value = m.gradientMap);
  }
  function d(p, m) {
    p.metalness.value = m.metalness, m.metalnessMap && (p.metalnessMap.value = m.metalnessMap, n(m.metalnessMap, p.metalnessMapTransform)), p.roughness.value = m.roughness, m.roughnessMap && (p.roughnessMap.value = m.roughnessMap, n(m.roughnessMap, p.roughnessMapTransform)), m.envMap && (p.envMapIntensity.value = m.envMapIntensity);
  }
  function u(p, m, E) {
    p.ior.value = m.ior, m.sheen > 0 && (p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen), p.sheenRoughness.value = m.sheenRoughness, m.sheenColorMap && (p.sheenColorMap.value = m.sheenColorMap, n(m.sheenColorMap, p.sheenColorMapTransform)), m.sheenRoughnessMap && (p.sheenRoughnessMap.value = m.sheenRoughnessMap, n(m.sheenRoughnessMap, p.sheenRoughnessMapTransform))), m.clearcoat > 0 && (p.clearcoat.value = m.clearcoat, p.clearcoatRoughness.value = m.clearcoatRoughness, m.clearcoatMap && (p.clearcoatMap.value = m.clearcoatMap, n(m.clearcoatMap, p.clearcoatMapTransform)), m.clearcoatRoughnessMap && (p.clearcoatRoughnessMap.value = m.clearcoatRoughnessMap, n(m.clearcoatRoughnessMap, p.clearcoatRoughnessMapTransform)), m.clearcoatNormalMap && (p.clearcoatNormalMap.value = m.clearcoatNormalMap, n(m.clearcoatNormalMap, p.clearcoatNormalMapTransform), p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale), m.side === Pt && p.clearcoatNormalScale.value.negate())), m.dispersion > 0 && (p.dispersion.value = m.dispersion), m.iridescence > 0 && (p.iridescence.value = m.iridescence, p.iridescenceIOR.value = m.iridescenceIOR, p.iridescenceThicknessMinimum.value = m.iridescenceThicknessRange[0], p.iridescenceThicknessMaximum.value = m.iridescenceThicknessRange[1], m.iridescenceMap && (p.iridescenceMap.value = m.iridescenceMap, n(m.iridescenceMap, p.iridescenceMapTransform)), m.iridescenceThicknessMap && (p.iridescenceThicknessMap.value = m.iridescenceThicknessMap, n(m.iridescenceThicknessMap, p.iridescenceThicknessMapTransform))), m.transmission > 0 && (p.transmission.value = m.transmission, p.transmissionSamplerMap.value = E.texture, p.transmissionSamplerSize.value.set(E.width, E.height), m.transmissionMap && (p.transmissionMap.value = m.transmissionMap, n(m.transmissionMap, p.transmissionMapTransform)), p.thickness.value = m.thickness, m.thicknessMap && (p.thicknessMap.value = m.thicknessMap, n(m.thicknessMap, p.thicknessMapTransform)), p.attenuationDistance.value = m.attenuationDistance, p.attenuationColor.value.copy(m.attenuationColor)), m.anisotropy > 0 && (p.anisotropyVector.value.set(m.anisotropy * Math.cos(m.anisotropyRotation), m.anisotropy * Math.sin(m.anisotropyRotation)), m.anisotropyMap && (p.anisotropyMap.value = m.anisotropyMap, n(m.anisotropyMap, p.anisotropyMapTransform))), p.specularIntensity.value = m.specularIntensity, p.specularColor.value.copy(m.specularColor), m.specularColorMap && (p.specularColorMap.value = m.specularColorMap, n(m.specularColorMap, p.specularColorMapTransform)), m.specularIntensityMap && (p.specularIntensityMap.value = m.specularIntensityMap, n(m.specularIntensityMap, p.specularIntensityMapTransform));
  }
  function g(p, m) {
    m.matcap && (p.matcap.value = m.matcap);
  }
  function _(p, m) {
    const E = e.get(m).light;
    p.referencePosition.value.setFromMatrixPosition(E.matrixWorld), p.nearDistance.value = E.shadow.camera.near, p.farDistance.value = E.shadow.camera.far;
  }
  return {
    refreshFogUniforms: i,
    refreshMaterialUniforms: r
  };
}
function ag(t, e, n, i) {
  let r = {}, s = {}, a = [];
  const o = t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);
  function c(E, M) {
    const x = M.program;
    i.uniformBlockBinding(E, x);
  }
  function l(E, M) {
    let x = r[E.id];
    x === void 0 && (g(E), x = h(E), r[E.id] = x, E.addEventListener("dispose", p));
    const P = M.program;
    i.updateUBOMapping(E, P);
    const b = e.render.frame;
    s[E.id] !== b && (d(E), s[E.id] = b);
  }
  function h(E) {
    const M = f();
    E.__bindingPointIndex = M;
    const x = t.createBuffer(), P = E.__size, b = E.usage;
    return t.bindBuffer(t.UNIFORM_BUFFER, x), t.bufferData(t.UNIFORM_BUFFER, P, b), t.bindBuffer(t.UNIFORM_BUFFER, null), t.bindBufferBase(t.UNIFORM_BUFFER, M, x), x;
  }
  function f() {
    for (let E = 0; E < o; E++)
      if (a.indexOf(E) === -1)
        return a.push(E), E;
    return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."), 0;
  }
  function d(E) {
    const M = r[E.id], x = E.uniforms, P = E.__cache;
    t.bindBuffer(t.UNIFORM_BUFFER, M);
    for (let b = 0, A = x.length; b < A; b++) {
      const R = Array.isArray(x[b]) ? x[b] : [x[b]];
      for (let S = 0, v = R.length; S < v; S++) {
        const C = R[S];
        if (u(C, b, S, P) === !0) {
          const F = C.__offset, L = Array.isArray(C.value) ? C.value : [C.value];
          let D = 0;
          for (let W = 0; W < L.length; W++) {
            const V = L[W], K = _(V);
            typeof V == "number" || typeof V == "boolean" ? (C.__data[0] = V, t.bufferSubData(t.UNIFORM_BUFFER, F + D, C.__data)) : V.isMatrix3 ? (C.__data[0] = V.elements[0], C.__data[1] = V.elements[1], C.__data[2] = V.elements[2], C.__data[3] = 0, C.__data[4] = V.elements[3], C.__data[5] = V.elements[4], C.__data[6] = V.elements[5], C.__data[7] = 0, C.__data[8] = V.elements[6], C.__data[9] = V.elements[7], C.__data[10] = V.elements[8], C.__data[11] = 0) : (V.toArray(C.__data, D), D += K.storage / Float32Array.BYTES_PER_ELEMENT);
          }
          t.bufferSubData(t.UNIFORM_BUFFER, F, C.__data);
        }
      }
    }
    t.bindBuffer(t.UNIFORM_BUFFER, null);
  }
  function u(E, M, x, P) {
    const b = E.value, A = M + "_" + x;
    if (P[A] === void 0)
      return typeof b == "number" || typeof b == "boolean" ? P[A] = b : P[A] = b.clone(), !0;
    {
      const R = P[A];
      if (typeof b == "number" || typeof b == "boolean") {
        if (R !== b)
          return P[A] = b, !0;
      } else if (R.equals(b) === !1)
        return R.copy(b), !0;
    }
    return !1;
  }
  function g(E) {
    const M = E.uniforms;
    let x = 0;
    const P = 16;
    for (let A = 0, R = M.length; A < R; A++) {
      const S = Array.isArray(M[A]) ? M[A] : [M[A]];
      for (let v = 0, C = S.length; v < C; v++) {
        const F = S[v], L = Array.isArray(F.value) ? F.value : [F.value];
        for (let D = 0, W = L.length; D < W; D++) {
          const V = L[D], K = _(V), G = x % P, te = G % K.boundary, ae = G + te;
          x += te, ae !== 0 && P - ae < K.storage && (x += P - ae), F.__data = new Float32Array(K.storage / Float32Array.BYTES_PER_ELEMENT), F.__offset = x, x += K.storage;
        }
      }
    }
    const b = x % P;
    return b > 0 && (x += P - b), E.__size = x, E.__cache = {}, this;
  }
  function _(E) {
    const M = {
      boundary: 0,
      // bytes
      storage: 0
      // bytes
    };
    return typeof E == "number" || typeof E == "boolean" ? (M.boundary = 4, M.storage = 4) : E.isVector2 ? (M.boundary = 8, M.storage = 8) : E.isVector3 || E.isColor ? (M.boundary = 16, M.storage = 12) : E.isVector4 ? (M.boundary = 16, M.storage = 16) : E.isMatrix3 ? (M.boundary = 48, M.storage = 48) : E.isMatrix4 ? (M.boundary = 64, M.storage = 64) : E.isTexture ? console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.") : console.warn("THREE.WebGLRenderer: Unsupported uniform value type.", E), M;
  }
  function p(E) {
    const M = E.target;
    M.removeEventListener("dispose", p);
    const x = a.indexOf(M.__bindingPointIndex);
    a.splice(x, 1), t.deleteBuffer(r[M.id]), delete r[M.id], delete s[M.id];
  }
  function m() {
    for (const E in r)
      t.deleteBuffer(r[E]);
    a = [], r = {}, s = {};
  }
  return {
    bind: c,
    update: l,
    dispose: m
  };
}
class og {
  constructor(e = {}) {
    const {
      canvas: n = jf(),
      context: i = null,
      depth: r = !0,
      stencil: s = !1,
      alpha: a = !1,
      antialias: o = !1,
      premultipliedAlpha: c = !0,
      preserveDrawingBuffer: l = !1,
      powerPreference: h = "default",
      failIfMajorPerformanceCaveat: f = !1,
      reverseDepthBuffer: d = !1
    } = e;
    this.isWebGLRenderer = !0;
    let u;
    if (i !== null) {
      if (typeof WebGLRenderingContext < "u" && i instanceof WebGLRenderingContext)
        throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");
      u = i.getContextAttributes().alpha;
    } else
      u = a;
    const g = new Uint32Array(4), _ = new Int32Array(4);
    let p = null, m = null;
    const E = [], M = [];
    this.domElement = n, this.debug = {
      /**
       * Enables error checking and reporting when shader programs are being compiled
       * @type {boolean}
       */
      checkShaderErrors: !0,
      /**
       * Callback for custom error reporting.
       * @type {?Function}
       */
      onShaderError: null
    }, this.autoClear = !0, this.autoClearColor = !0, this.autoClearDepth = !0, this.autoClearStencil = !0, this.sortObjects = !0, this.clippingPlanes = [], this.localClippingEnabled = !1, this._outputColorSpace = Bt, this.toneMapping = Ln, this.toneMappingExposure = 1;
    const x = this;
    let P = !1, b = 0, A = 0, R = null, S = -1, v = null;
    const C = new st(), F = new st();
    let L = null;
    const D = new Oe(0);
    let W = 0, V = n.width, K = n.height, G = 1, te = null, ae = null;
    const de = new st(0, 0, V, K), Le = new st(0, 0, V, K);
    let Xe = !1;
    const q = new Pa();
    let Q = !1, he = !1;
    const ie = new je(), Se = new je(), Re = new z(), Fe = new st(), it = { background: null, fog: null, environment: null, overrideMaterial: null, isScene: !0 };
    let ke = !1;
    function at() {
      return R === null ? G : 1;
    }
    let O = i;
    function Ft(T, U) {
      return n.getContext(T, U);
    }
    try {
      const T = {
        alpha: !0,
        depth: r,
        stencil: s,
        antialias: o,
        premultipliedAlpha: c,
        preserveDrawingBuffer: l,
        powerPreference: h,
        failIfMajorPerformanceCaveat: f
      };
      if ("setAttribute" in n && n.setAttribute("data-engine", `three.js r${ya}`), n.addEventListener("webglcontextlost", j, !1), n.addEventListener("webglcontextrestored", le, !1), n.addEventListener("webglcontextcreationerror", oe, !1), O === null) {
        const U = "webgl2";
        if (O = Ft(U, T), O === null)
          throw Ft(U) ? new Error("Error creating WebGL context with your selected attributes.") : new Error("Error creating WebGL context.");
      }
    } catch (T) {
      throw console.error("THREE.WebGLRenderer: " + T.message), T;
    }
    let ze, Be, Ee, et, ye, w, y, B, Y, Z, $, xe, se, fe, Ve, J, ue, Te, be, pe, He, Ie, Je, I;
    function re() {
      ze = new dm(O), ze.init(), Ie = new K0(O, ze), Be = new am(O, ze, e, Ie), Ee = new Y0(O, ze), Be.reverseDepthBuffer && d && Ee.buffers.depth.setReversed(!0), et = new mm(O), ye = new I0(), w = new Z0(O, ze, Ee, ye, Be, Ie, et), y = new cm(x), B = new fm(x), Y = new Sd(O), Je = new rm(O, Y), Z = new um(O, Y, et, Je), $ = new _m(O, Z, Y, et), be = new gm(O, Be, w), J = new om(ye), xe = new L0(x, y, B, ze, Be, Je, J), se = new sg(x, ye), fe = new N0(), Ve = new k0(ze), Te = new im(x, y, B, Ee, $, u, c), ue = new q0(x, $, Be), I = new ag(O, et, Be, Ee), pe = new sm(O, ze, et), He = new pm(O, ze, et), et.programs = xe.programs, x.capabilities = Be, x.extensions = ze, x.properties = ye, x.renderLists = fe, x.shadowMap = ue, x.state = Ee, x.info = et;
    }
    re();
    const X = new ig(x, O);
    this.xr = X, this.getContext = function() {
      return O;
    }, this.getContextAttributes = function() {
      return O.getContextAttributes();
    }, this.forceContextLoss = function() {
      const T = ze.get("WEBGL_lose_context");
      T && T.loseContext();
    }, this.forceContextRestore = function() {
      const T = ze.get("WEBGL_lose_context");
      T && T.restoreContext();
    }, this.getPixelRatio = function() {
      return G;
    }, this.setPixelRatio = function(T) {
      T !== void 0 && (G = T, this.setSize(V, K, !1));
    }, this.getSize = function(T) {
      return T.set(V, K);
    }, this.setSize = function(T, U, H = !0) {
      if (X.isPresenting) {
        console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");
        return;
      }
      V = T, K = U, n.width = Math.floor(T * G), n.height = Math.floor(U * G), H === !0 && (n.style.width = T + "px", n.style.height = U + "px"), this.setViewport(0, 0, T, U);
    }, this.getDrawingBufferSize = function(T) {
      return T.set(V * G, K * G).floor();
    }, this.setDrawingBufferSize = function(T, U, H) {
      V = T, K = U, G = H, n.width = Math.floor(T * H), n.height = Math.floor(U * H), this.setViewport(0, 0, T, U);
    }, this.getCurrentViewport = function(T) {
      return T.copy(C);
    }, this.getViewport = function(T) {
      return T.copy(de);
    }, this.setViewport = function(T, U, H, k) {
      T.isVector4 ? de.set(T.x, T.y, T.z, T.w) : de.set(T, U, H, k), Ee.viewport(C.copy(de).multiplyScalar(G).round());
    }, this.getScissor = function(T) {
      return T.copy(Le);
    }, this.setScissor = function(T, U, H, k) {
      T.isVector4 ? Le.set(T.x, T.y, T.z, T.w) : Le.set(T, U, H, k), Ee.scissor(F.copy(Le).multiplyScalar(G).round());
    }, this.getScissorTest = function() {
      return Xe;
    }, this.setScissorTest = function(T) {
      Ee.setScissorTest(Xe = T);
    }, this.setOpaqueSort = function(T) {
      te = T;
    }, this.setTransparentSort = function(T) {
      ae = T;
    }, this.getClearColor = function(T) {
      return T.copy(Te.getClearColor());
    }, this.setClearColor = function() {
      Te.setClearColor.apply(Te, arguments);
    }, this.getClearAlpha = function() {
      return Te.getClearAlpha();
    }, this.setClearAlpha = function() {
      Te.setClearAlpha.apply(Te, arguments);
    }, this.clear = function(T = !0, U = !0, H = !0) {
      let k = 0;
      if (T) {
        let N = !1;
        if (R !== null) {
          const ee = R.texture.format;
          N = ee === Ra || ee === wa || ee === Aa;
        }
        if (N) {
          const ee = R.texture.type, ce = ee === mn || ee === Yn || ee === Xi || ee === Ai || ee === Ea || ee === Ta, ge = Te.getClearColor(), _e = Te.getClearAlpha(), Ae = ge.r, Pe = ge.g, ve = ge.b;
          ce ? (g[0] = Ae, g[1] = Pe, g[2] = ve, g[3] = _e, O.clearBufferuiv(O.COLOR, 0, g)) : (_[0] = Ae, _[1] = Pe, _[2] = ve, _[3] = _e, O.clearBufferiv(O.COLOR, 0, _));
        } else
          k |= O.COLOR_BUFFER_BIT;
      }
      U && (k |= O.DEPTH_BUFFER_BIT), H && (k |= O.STENCIL_BUFFER_BIT, this.state.buffers.stencil.setMask(4294967295)), O.clear(k);
    }, this.clearColor = function() {
      this.clear(!0, !1, !1);
    }, this.clearDepth = function() {
      this.clear(!1, !0, !1);
    }, this.clearStencil = function() {
      this.clear(!1, !1, !0);
    }, this.dispose = function() {
      n.removeEventListener("webglcontextlost", j, !1), n.removeEventListener("webglcontextrestored", le, !1), n.removeEventListener("webglcontextcreationerror", oe, !1), fe.dispose(), Ve.dispose(), ye.dispose(), y.dispose(), B.dispose(), $.dispose(), Je.dispose(), I.dispose(), xe.dispose(), X.dispose(), X.removeEventListener("sessionstart", $a), X.removeEventListener("sessionend", Ya), Fn.stop();
    };
    function j(T) {
      T.preventDefault(), console.log("THREE.WebGLRenderer: Context Lost."), P = !0;
    }
    function le() {
      console.log("THREE.WebGLRenderer: Context Restored."), P = !1;
      const T = et.autoReset, U = ue.enabled, H = ue.autoUpdate, k = ue.needsUpdate, N = ue.type;
      re(), et.autoReset = T, ue.enabled = U, ue.autoUpdate = H, ue.needsUpdate = k, ue.type = N;
    }
    function oe(T) {
      console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ", T.statusMessage);
    }
    function Ce(T) {
      const U = T.target;
      U.removeEventListener("dispose", Ce), rt(U);
    }
    function rt(T) {
      vt(T), ye.remove(T);
    }
    function vt(T) {
      const U = ye.get(T).programs;
      U !== void 0 && (U.forEach(function(H) {
        xe.releaseProgram(H);
      }), T.isShaderMaterial && xe.releaseShaderCache(T));
    }
    this.renderBufferDirect = function(T, U, H, k, N, ee) {
      U === null && (U = it);
      const ce = N.isMesh && N.matrixWorld.determinant() < 0, ge = Ah(T, U, H, k, N);
      Ee.setMaterial(k, ce);
      let _e = H.index, Ae = 1;
      if (k.wireframe === !0) {
        if (_e = Z.getWireframeAttribute(H), _e === void 0) return;
        Ae = 2;
      }
      const Pe = H.drawRange, ve = H.attributes.position;
      let We = Pe.start * Ae, Qe = (Pe.start + Pe.count) * Ae;
      ee !== null && (We = Math.max(We, ee.start * Ae), Qe = Math.min(Qe, (ee.start + ee.count) * Ae)), _e !== null ? (We = Math.max(We, 0), Qe = Math.min(Qe, _e.count)) : ve != null && (We = Math.max(We, 0), Qe = Math.min(Qe, ve.count));
      const tt = Qe - We;
      if (tt < 0 || tt === 1 / 0) return;
      Je.setup(N, k, ge, H, _e);
      let At, qe = pe;
      if (_e !== null && (At = Y.get(_e), qe = He, qe.setIndex(At)), N.isMesh)
        k.wireframe === !0 ? (Ee.setLineWidth(k.wireframeLinewidth * at()), qe.setMode(O.LINES)) : qe.setMode(O.TRIANGLES);
      else if (N.isLine) {
        let Me = k.linewidth;
        Me === void 0 && (Me = 1), Ee.setLineWidth(Me * at()), N.isLineSegments ? qe.setMode(O.LINES) : N.isLineLoop ? qe.setMode(O.LINE_LOOP) : qe.setMode(O.LINE_STRIP);
      } else N.isPoints ? qe.setMode(O.POINTS) : N.isSprite && qe.setMode(O.TRIANGLES);
      if (N.isBatchedMesh)
        if (N._multiDrawInstances !== null)
          qe.renderMultiDrawInstances(N._multiDrawStarts, N._multiDrawCounts, N._multiDrawCount, N._multiDrawInstances);
        else if (ze.get("WEBGL_multi_draw"))
          qe.renderMultiDraw(N._multiDrawStarts, N._multiDrawCounts, N._multiDrawCount);
        else {
          const Me = N._multiDrawStarts, sn = N._multiDrawCounts, $e = N._multiDrawCount, Vt = _e ? Y.get(_e).bytesPerElement : 1, ei = ye.get(k).currentProgram.getUniforms();
          for (let Dt = 0; Dt < $e; Dt++)
            ei.setValue(O, "_gl_DrawID", Dt), qe.render(Me[Dt] / Vt, sn[Dt]);
        }
      else if (N.isInstancedMesh)
        qe.renderInstances(We, tt, N.count);
      else if (H.isInstancedBufferGeometry) {
        const Me = H._maxInstanceCount !== void 0 ? H._maxInstanceCount : 1 / 0, sn = Math.min(H.instanceCount, Me);
        qe.renderInstances(We, tt, sn);
      } else
        qe.render(We, tt);
    };
    function Ye(T, U, H) {
      T.transparent === !0 && T.side === Kt && T.forceSinglePass === !1 ? (T.side = Pt, T.needsUpdate = !0, er(T, U, H), T.side = In, T.needsUpdate = !0, er(T, U, H), T.side = Kt) : er(T, U, H);
    }
    this.compile = function(T, U, H = null) {
      H === null && (H = T), m = Ve.get(H), m.init(U), M.push(m), H.traverseVisible(function(N) {
        N.isLight && N.layers.test(U.layers) && (m.pushLight(N), N.castShadow && m.pushShadow(N));
      }), T !== H && T.traverseVisible(function(N) {
        N.isLight && N.layers.test(U.layers) && (m.pushLight(N), N.castShadow && m.pushShadow(N));
      }), m.setupLights();
      const k = /* @__PURE__ */ new Set();
      return T.traverse(function(N) {
        if (!(N.isMesh || N.isPoints || N.isLine || N.isSprite))
          return;
        const ee = N.material;
        if (ee)
          if (Array.isArray(ee))
            for (let ce = 0; ce < ee.length; ce++) {
              const ge = ee[ce];
              Ye(ge, H, N), k.add(ge);
            }
          else
            Ye(ee, H, N), k.add(ee);
      }), M.pop(), m = null, k;
    }, this.compileAsync = function(T, U, H = null) {
      const k = this.compile(T, U, H);
      return new Promise((N) => {
        function ee() {
          if (k.forEach(function(ce) {
            ye.get(ce).currentProgram.isReady() && k.delete(ce);
          }), k.size === 0) {
            N(T);
            return;
          }
          setTimeout(ee, 10);
        }
        ze.get("KHR_parallel_shader_compile") !== null ? ee() : setTimeout(ee, 10);
      });
    };
    let kt = null;
    function rn(T) {
      kt && kt(T);
    }
    function $a() {
      Fn.stop();
    }
    function Ya() {
      Fn.start();
    }
    const Fn = new Zc();
    Fn.setAnimationLoop(rn), typeof self < "u" && Fn.setContext(self), this.setAnimationLoop = function(T) {
      kt = T, X.setAnimationLoop(T), T === null ? Fn.stop() : Fn.start();
    }, X.addEventListener("sessionstart", $a), X.addEventListener("sessionend", Ya), this.render = function(T, U) {
      if (U !== void 0 && U.isCamera !== !0) {
        console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");
        return;
      }
      if (P === !0) return;
      if (T.matrixWorldAutoUpdate === !0 && T.updateMatrixWorld(), U.parent === null && U.matrixWorldAutoUpdate === !0 && U.updateMatrixWorld(), X.enabled === !0 && X.isPresenting === !0 && (X.cameraAutoUpdate === !0 && X.updateCamera(U), U = X.getCamera()), T.isScene === !0 && T.onBeforeRender(x, T, U, R), m = Ve.get(T, M.length), m.init(U), M.push(m), Se.multiplyMatrices(U.projectionMatrix, U.matrixWorldInverse), q.setFromProjectionMatrix(Se), he = this.localClippingEnabled, Q = J.init(this.clippingPlanes, he), p = fe.get(T, E.length), p.init(), E.push(p), X.enabled === !0 && X.isPresenting === !0) {
        const ee = x.xr.getDepthSensingMesh();
        ee !== null && jr(ee, U, -1 / 0, x.sortObjects);
      }
      jr(T, U, 0, x.sortObjects), p.finish(), x.sortObjects === !0 && p.sort(te, ae), ke = X.enabled === !1 || X.isPresenting === !1 || X.hasDepthSensing() === !1, ke && Te.addToRenderList(p, T), this.info.render.frame++, Q === !0 && J.beginShadows();
      const H = m.state.shadowsArray;
      ue.render(H, T, U), Q === !0 && J.endShadows(), this.info.autoReset === !0 && this.info.reset();
      const k = p.opaque, N = p.transmissive;
      if (m.setupLights(), U.isArrayCamera) {
        const ee = U.cameras;
        if (N.length > 0)
          for (let ce = 0, ge = ee.length; ce < ge; ce++) {
            const _e = ee[ce];
            Za(k, N, T, _e);
          }
        ke && Te.render(T);
        for (let ce = 0, ge = ee.length; ce < ge; ce++) {
          const _e = ee[ce];
          ja(p, T, _e, _e.viewport);
        }
      } else
        N.length > 0 && Za(k, N, T, U), ke && Te.render(T), ja(p, T, U);
      R !== null && (w.updateMultisampleRenderTarget(R), w.updateRenderTargetMipmap(R)), T.isScene === !0 && T.onAfterRender(x, T, U), Je.resetDefaultState(), S = -1, v = null, M.pop(), M.length > 0 ? (m = M[M.length - 1], Q === !0 && J.setGlobalState(x.clippingPlanes, m.state.camera)) : m = null, E.pop(), E.length > 0 ? p = E[E.length - 1] : p = null;
    };
    function jr(T, U, H, k) {
      if (T.visible === !1) return;
      if (T.layers.test(U.layers)) {
        if (T.isGroup)
          H = T.renderOrder;
        else if (T.isLOD)
          T.autoUpdate === !0 && T.update(U);
        else if (T.isLight)
          m.pushLight(T), T.castShadow && m.pushShadow(T);
        else if (T.isSprite) {
          if (!T.frustumCulled || q.intersectsSprite(T)) {
            k && Fe.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Se);
            const ce = $.update(T), ge = T.material;
            ge.visible && p.push(T, ce, ge, H, Fe.z, null);
          }
        } else if ((T.isMesh || T.isLine || T.isPoints) && (!T.frustumCulled || q.intersectsObject(T))) {
          const ce = $.update(T), ge = T.material;
          if (k && (T.boundingSphere !== void 0 ? (T.boundingSphere === null && T.computeBoundingSphere(), Fe.copy(T.boundingSphere.center)) : (ce.boundingSphere === null && ce.computeBoundingSphere(), Fe.copy(ce.boundingSphere.center)), Fe.applyMatrix4(T.matrixWorld).applyMatrix4(Se)), Array.isArray(ge)) {
            const _e = ce.groups;
            for (let Ae = 0, Pe = _e.length; Ae < Pe; Ae++) {
              const ve = _e[Ae], We = ge[ve.materialIndex];
              We && We.visible && p.push(T, ce, We, H, Fe.z, ve);
            }
          } else ge.visible && p.push(T, ce, ge, H, Fe.z, null);
        }
      }
      const ee = T.children;
      for (let ce = 0, ge = ee.length; ce < ge; ce++)
        jr(ee[ce], U, H, k);
    }
    function ja(T, U, H, k) {
      const N = T.opaque, ee = T.transmissive, ce = T.transparent;
      m.setupLightsView(H), Q === !0 && J.setGlobalState(x.clippingPlanes, H), k && Ee.viewport(C.copy(k)), N.length > 0 && Qi(N, U, H), ee.length > 0 && Qi(ee, U, H), ce.length > 0 && Qi(ce, U, H), Ee.buffers.depth.setTest(!0), Ee.buffers.depth.setMask(!0), Ee.buffers.color.setMask(!0), Ee.setPolygonOffset(!1);
    }
    function Za(T, U, H, k) {
      if ((H.isScene === !0 ? H.overrideMaterial : null) !== null)
        return;
      m.state.transmissionRenderTarget[k.id] === void 0 && (m.state.transmissionRenderTarget[k.id] = new jn(1, 1, {
        generateMipmaps: !0,
        type: ze.has("EXT_color_buffer_half_float") || ze.has("EXT_color_buffer_float") ? ji : mn,
        minFilter: $n,
        samples: 4,
        stencilBuffer: s,
        resolveDepthBuffer: !1,
        resolveStencilBuffer: !1,
        colorSpace: Ge.workingColorSpace
      }));
      const ee = m.state.transmissionRenderTarget[k.id], ce = k.viewport || C;
      ee.setSize(ce.z, ce.w);
      const ge = x.getRenderTarget();
      x.setRenderTarget(ee), x.getClearColor(D), W = x.getClearAlpha(), W < 1 && x.setClearColor(16777215, 0.5), x.clear(), ke && Te.render(H);
      const _e = x.toneMapping;
      x.toneMapping = Ln;
      const Ae = k.viewport;
      if (k.viewport !== void 0 && (k.viewport = void 0), m.setupLightsView(k), Q === !0 && J.setGlobalState(x.clippingPlanes, k), Qi(T, H, k), w.updateMultisampleRenderTarget(ee), w.updateRenderTargetMipmap(ee), ze.has("WEBGL_multisampled_render_to_texture") === !1) {
        let Pe = !1;
        for (let ve = 0, We = U.length; ve < We; ve++) {
          const Qe = U[ve], tt = Qe.object, At = Qe.geometry, qe = Qe.material, Me = Qe.group;
          if (qe.side === Kt && tt.layers.test(k.layers)) {
            const sn = qe.side;
            qe.side = Pt, qe.needsUpdate = !0, Ka(tt, H, k, At, qe, Me), qe.side = sn, qe.needsUpdate = !0, Pe = !0;
          }
        }
        Pe === !0 && (w.updateMultisampleRenderTarget(ee), w.updateRenderTargetMipmap(ee));
      }
      x.setRenderTarget(ge), x.setClearColor(D, W), Ae !== void 0 && (k.viewport = Ae), x.toneMapping = _e;
    }
    function Qi(T, U, H) {
      const k = U.isScene === !0 ? U.overrideMaterial : null;
      for (let N = 0, ee = T.length; N < ee; N++) {
        const ce = T[N], ge = ce.object, _e = ce.geometry, Ae = k === null ? ce.material : k, Pe = ce.group;
        ge.layers.test(H.layers) && Ka(ge, U, H, _e, Ae, Pe);
      }
    }
    function Ka(T, U, H, k, N, ee) {
      T.onBeforeRender(x, U, H, k, N, ee), T.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse, T.matrixWorld), T.normalMatrix.getNormalMatrix(T.modelViewMatrix), N.onBeforeRender(x, U, H, k, T, ee), N.transparent === !0 && N.side === Kt && N.forceSinglePass === !1 ? (N.side = Pt, N.needsUpdate = !0, x.renderBufferDirect(H, U, k, N, T, ee), N.side = In, N.needsUpdate = !0, x.renderBufferDirect(H, U, k, N, T, ee), N.side = Kt) : x.renderBufferDirect(H, U, k, N, T, ee), T.onAfterRender(x, U, H, k, N, ee);
    }
    function er(T, U, H) {
      U.isScene !== !0 && (U = it);
      const k = ye.get(T), N = m.state.lights, ee = m.state.shadowsArray, ce = N.state.version, ge = xe.getParameters(T, N.state, ee, U, H), _e = xe.getProgramCacheKey(ge);
      let Ae = k.programs;
      k.environment = T.isMeshStandardMaterial ? U.environment : null, k.fog = U.fog, k.envMap = (T.isMeshStandardMaterial ? B : y).get(T.envMap || k.environment), k.envMapRotation = k.environment !== null && T.envMap === null ? U.environmentRotation : T.envMapRotation, Ae === void 0 && (T.addEventListener("dispose", Ce), Ae = /* @__PURE__ */ new Map(), k.programs = Ae);
      let Pe = Ae.get(_e);
      if (Pe !== void 0) {
        if (k.currentProgram === Pe && k.lightsStateVersion === ce)
          return Qa(T, ge), Pe;
      } else
        ge.uniforms = xe.getUniforms(T), T.onBeforeCompile(ge, x), Pe = xe.acquireProgram(ge, _e), Ae.set(_e, Pe), k.uniforms = ge.uniforms;
      const ve = k.uniforms;
      return (!T.isShaderMaterial && !T.isRawShaderMaterial || T.clipping === !0) && (ve.clippingPlanes = J.uniform), Qa(T, ge), k.needsLights = Rh(T), k.lightsStateVersion = ce, k.needsLights && (ve.ambientLightColor.value = N.state.ambient, ve.lightProbe.value = N.state.probe, ve.directionalLights.value = N.state.directional, ve.directionalLightShadows.value = N.state.directionalShadow, ve.spotLights.value = N.state.spot, ve.spotLightShadows.value = N.state.spotShadow, ve.rectAreaLights.value = N.state.rectArea, ve.ltc_1.value = N.state.rectAreaLTC1, ve.ltc_2.value = N.state.rectAreaLTC2, ve.pointLights.value = N.state.point, ve.pointLightShadows.value = N.state.pointShadow, ve.hemisphereLights.value = N.state.hemi, ve.directionalShadowMap.value = N.state.directionalShadowMap, ve.directionalShadowMatrix.value = N.state.directionalShadowMatrix, ve.spotShadowMap.value = N.state.spotShadowMap, ve.spotLightMatrix.value = N.state.spotLightMatrix, ve.spotLightMap.value = N.state.spotLightMap, ve.pointShadowMap.value = N.state.pointShadowMap, ve.pointShadowMatrix.value = N.state.pointShadowMatrix), k.currentProgram = Pe, k.uniformsList = null, Pe;
    }
    function Ja(T) {
      if (T.uniformsList === null) {
        const U = T.currentProgram.getUniforms();
        T.uniformsList = Nr.seqWithValue(U.seq, T.uniforms);
      }
      return T.uniformsList;
    }
    function Qa(T, U) {
      const H = ye.get(T);
      H.outputColorSpace = U.outputColorSpace, H.batching = U.batching, H.batchingColor = U.batchingColor, H.instancing = U.instancing, H.instancingColor = U.instancingColor, H.instancingMorph = U.instancingMorph, H.skinning = U.skinning, H.morphTargets = U.morphTargets, H.morphNormals = U.morphNormals, H.morphColors = U.morphColors, H.morphTargetsCount = U.morphTargetsCount, H.numClippingPlanes = U.numClippingPlanes, H.numIntersection = U.numClipIntersection, H.vertexAlphas = U.vertexAlphas, H.vertexTangents = U.vertexTangents, H.toneMapping = U.toneMapping;
    }
    function Ah(T, U, H, k, N) {
      U.isScene !== !0 && (U = it), w.resetTextureUnits();
      const ee = U.fog, ce = k.isMeshStandardMaterial ? U.environment : null, ge = R === null ? x.outputColorSpace : R.isXRRenderTarget === !0 ? R.texture.colorSpace : Ci, _e = (k.isMeshStandardMaterial ? B : y).get(k.envMap || ce), Ae = k.vertexColors === !0 && !!H.attributes.color && H.attributes.color.itemSize === 4, Pe = !!H.attributes.tangent && (!!k.normalMap || k.anisotropy > 0), ve = !!H.morphAttributes.position, We = !!H.morphAttributes.normal, Qe = !!H.morphAttributes.color;
      let tt = Ln;
      k.toneMapped && (R === null || R.isXRRenderTarget === !0) && (tt = x.toneMapping);
      const At = H.morphAttributes.position || H.morphAttributes.normal || H.morphAttributes.color, qe = At !== void 0 ? At.length : 0, Me = ye.get(k), sn = m.state.lights;
      if (Q === !0 && (he === !0 || T !== v)) {
        const Ot = T === v && k.id === S;
        J.setState(k, T, Ot);
      }
      let $e = !1;
      k.version === Me.__version ? (Me.needsLights && Me.lightsStateVersion !== sn.state.version || Me.outputColorSpace !== ge || N.isBatchedMesh && Me.batching === !1 || !N.isBatchedMesh && Me.batching === !0 || N.isBatchedMesh && Me.batchingColor === !0 && N.colorTexture === null || N.isBatchedMesh && Me.batchingColor === !1 && N.colorTexture !== null || N.isInstancedMesh && Me.instancing === !1 || !N.isInstancedMesh && Me.instancing === !0 || N.isSkinnedMesh && Me.skinning === !1 || !N.isSkinnedMesh && Me.skinning === !0 || N.isInstancedMesh && Me.instancingColor === !0 && N.instanceColor === null || N.isInstancedMesh && Me.instancingColor === !1 && N.instanceColor !== null || N.isInstancedMesh && Me.instancingMorph === !0 && N.morphTexture === null || N.isInstancedMesh && Me.instancingMorph === !1 && N.morphTexture !== null || Me.envMap !== _e || k.fog === !0 && Me.fog !== ee || Me.numClippingPlanes !== void 0 && (Me.numClippingPlanes !== J.numPlanes || Me.numIntersection !== J.numIntersection) || Me.vertexAlphas !== Ae || Me.vertexTangents !== Pe || Me.morphTargets !== ve || Me.morphNormals !== We || Me.morphColors !== Qe || Me.toneMapping !== tt || Me.morphTargetsCount !== qe) && ($e = !0) : ($e = !0, Me.__version = k.version);
      let Vt = Me.currentProgram;
      $e === !0 && (Vt = er(k, U, N));
      let ei = !1, Dt = !1, Li = !1;
      const nt = Vt.getUniforms(), jt = Me.uniforms;
      if (Ee.useProgram(Vt.program) && (ei = !0, Dt = !0, Li = !0), k.id !== S && (S = k.id, Dt = !0), ei || v !== T) {
        Ee.buffers.depth.getReversed() ? (ie.copy(T.projectionMatrix), Kf(ie), Jf(ie), nt.setValue(O, "projectionMatrix", ie)) : nt.setValue(O, "projectionMatrix", T.projectionMatrix), nt.setValue(O, "viewMatrix", T.matrixWorldInverse);
        const vn = nt.map.cameraPosition;
        vn !== void 0 && vn.setValue(O, Re.setFromMatrixPosition(T.matrixWorld)), Be.logarithmicDepthBuffer && nt.setValue(
          O,
          "logDepthBufFC",
          2 / (Math.log(T.far + 1) / Math.LN2)
        ), (k.isMeshPhongMaterial || k.isMeshToonMaterial || k.isMeshLambertMaterial || k.isMeshBasicMaterial || k.isMeshStandardMaterial || k.isShaderMaterial) && nt.setValue(O, "isOrthographic", T.isOrthographicCamera === !0), v !== T && (v = T, Dt = !0, Li = !0);
      }
      if (N.isSkinnedMesh) {
        nt.setOptional(O, N, "bindMatrix"), nt.setOptional(O, N, "bindMatrixInverse");
        const Ot = N.skeleton;
        Ot && (Ot.boneTexture === null && Ot.computeBoneTexture(), nt.setValue(O, "boneTexture", Ot.boneTexture, w));
      }
      N.isBatchedMesh && (nt.setOptional(O, N, "batchingTexture"), nt.setValue(O, "batchingTexture", N._matricesTexture, w), nt.setOptional(O, N, "batchingIdTexture"), nt.setValue(O, "batchingIdTexture", N._indirectTexture, w), nt.setOptional(O, N, "batchingColorTexture"), N._colorsTexture !== null && nt.setValue(O, "batchingColorTexture", N._colorsTexture, w));
      const Ii = H.morphAttributes;
      if ((Ii.position !== void 0 || Ii.normal !== void 0 || Ii.color !== void 0) && be.update(N, H, Vt), (Dt || Me.receiveShadow !== N.receiveShadow) && (Me.receiveShadow = N.receiveShadow, nt.setValue(O, "receiveShadow", N.receiveShadow)), k.isMeshGouraudMaterial && k.envMap !== null && (jt.envMap.value = _e, jt.flipEnvMap.value = _e.isCubeTexture && _e.isRenderTargetTexture === !1 ? -1 : 1), k.isMeshStandardMaterial && k.envMap === null && U.environment !== null && (jt.envMapIntensity.value = U.environmentIntensity), Dt && (nt.setValue(O, "toneMappingExposure", x.toneMappingExposure), Me.needsLights && wh(jt, Li), ee && k.fog === !0 && se.refreshFogUniforms(jt, ee), se.refreshMaterialUniforms(jt, k, G, K, m.state.transmissionRenderTarget[T.id]), Nr.upload(O, Ja(Me), jt, w)), k.isShaderMaterial && k.uniformsNeedUpdate === !0 && (Nr.upload(O, Ja(Me), jt, w), k.uniformsNeedUpdate = !1), k.isSpriteMaterial && nt.setValue(O, "center", N.center), nt.setValue(O, "modelViewMatrix", N.modelViewMatrix), nt.setValue(O, "normalMatrix", N.normalMatrix), nt.setValue(O, "modelMatrix", N.matrixWorld), k.isShaderMaterial || k.isRawShaderMaterial) {
        const Ot = k.uniformsGroups;
        for (let vn = 0, xn = Ot.length; vn < xn; vn++) {
          const eo = Ot[vn];
          I.update(eo, Vt), I.bind(eo, Vt);
        }
      }
      return Vt;
    }
    function wh(T, U) {
      T.ambientLightColor.needsUpdate = U, T.lightProbe.needsUpdate = U, T.directionalLights.needsUpdate = U, T.directionalLightShadows.needsUpdate = U, T.pointLights.needsUpdate = U, T.pointLightShadows.needsUpdate = U, T.spotLights.needsUpdate = U, T.spotLightShadows.needsUpdate = U, T.rectAreaLights.needsUpdate = U, T.hemisphereLights.needsUpdate = U;
    }
    function Rh(T) {
      return T.isMeshLambertMaterial || T.isMeshToonMaterial || T.isMeshPhongMaterial || T.isMeshStandardMaterial || T.isShadowMaterial || T.isShaderMaterial && T.lights === !0;
    }
    this.getActiveCubeFace = function() {
      return b;
    }, this.getActiveMipmapLevel = function() {
      return A;
    }, this.getRenderTarget = function() {
      return R;
    }, this.setRenderTargetTextures = function(T, U, H) {
      ye.get(T.texture).__webglTexture = U, ye.get(T.depthTexture).__webglTexture = H;
      const k = ye.get(T);
      k.__hasExternalTextures = !0, k.__autoAllocateDepthBuffer = H === void 0, k.__autoAllocateDepthBuffer || ze.has("WEBGL_multisampled_render_to_texture") === !0 && (console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"), k.__useRenderToTexture = !1);
    }, this.setRenderTargetFramebuffer = function(T, U) {
      const H = ye.get(T);
      H.__webglFramebuffer = U, H.__useDefaultFramebuffer = U === void 0;
    }, this.setRenderTarget = function(T, U = 0, H = 0) {
      R = T, b = U, A = H;
      let k = !0, N = null, ee = !1, ce = !1;
      if (T) {
        const _e = ye.get(T);
        if (_e.__useDefaultFramebuffer !== void 0)
          Ee.bindFramebuffer(O.FRAMEBUFFER, null), k = !1;
        else if (_e.__webglFramebuffer === void 0)
          w.setupRenderTarget(T);
        else if (_e.__hasExternalTextures)
          w.rebindTextures(T, ye.get(T.texture).__webglTexture, ye.get(T.depthTexture).__webglTexture);
        else if (T.depthBuffer) {
          const ve = T.depthTexture;
          if (_e.__boundDepthTexture !== ve) {
            if (ve !== null && ye.has(ve) && (T.width !== ve.image.width || T.height !== ve.image.height))
              throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");
            w.setupDepthRenderbuffer(T);
          }
        }
        const Ae = T.texture;
        (Ae.isData3DTexture || Ae.isDataArrayTexture || Ae.isCompressedArrayTexture) && (ce = !0);
        const Pe = ye.get(T).__webglFramebuffer;
        T.isWebGLCubeRenderTarget ? (Array.isArray(Pe[U]) ? N = Pe[U][H] : N = Pe[U], ee = !0) : T.samples > 0 && w.useMultisampledRTT(T) === !1 ? N = ye.get(T).__webglMultisampledFramebuffer : Array.isArray(Pe) ? N = Pe[H] : N = Pe, C.copy(T.viewport), F.copy(T.scissor), L = T.scissorTest;
      } else
        C.copy(de).multiplyScalar(G).floor(), F.copy(Le).multiplyScalar(G).floor(), L = Xe;
      if (Ee.bindFramebuffer(O.FRAMEBUFFER, N) && k && Ee.drawBuffers(T, N), Ee.viewport(C), Ee.scissor(F), Ee.setScissorTest(L), ee) {
        const _e = ye.get(T.texture);
        O.framebufferTexture2D(O.FRAMEBUFFER, O.COLOR_ATTACHMENT0, O.TEXTURE_CUBE_MAP_POSITIVE_X + U, _e.__webglTexture, H);
      } else if (ce) {
        const _e = ye.get(T.texture), Ae = U || 0;
        O.framebufferTextureLayer(O.FRAMEBUFFER, O.COLOR_ATTACHMENT0, _e.__webglTexture, H || 0, Ae);
      }
      S = -1;
    }, this.readRenderTargetPixels = function(T, U, H, k, N, ee, ce) {
      if (!(T && T.isWebGLRenderTarget)) {
        console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
        return;
      }
      let ge = ye.get(T).__webglFramebuffer;
      if (T.isWebGLCubeRenderTarget && ce !== void 0 && (ge = ge[ce]), ge) {
        Ee.bindFramebuffer(O.FRAMEBUFFER, ge);
        try {
          const _e = T.texture, Ae = _e.format, Pe = _e.type;
          if (!Be.textureFormatReadable(Ae)) {
            console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
            return;
          }
          if (!Be.textureTypeReadable(Pe)) {
            console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");
            return;
          }
          U >= 0 && U <= T.width - k && H >= 0 && H <= T.height - N && O.readPixels(U, H, k, N, Ie.convert(Ae), Ie.convert(Pe), ee);
        } finally {
          const _e = R !== null ? ye.get(R).__webglFramebuffer : null;
          Ee.bindFramebuffer(O.FRAMEBUFFER, _e);
        }
      }
    }, this.readRenderTargetPixelsAsync = async function(T, U, H, k, N, ee, ce) {
      if (!(T && T.isWebGLRenderTarget))
        throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
      let ge = ye.get(T).__webglFramebuffer;
      if (T.isWebGLCubeRenderTarget && ce !== void 0 && (ge = ge[ce]), ge) {
        const _e = T.texture, Ae = _e.format, Pe = _e.type;
        if (!Be.textureFormatReadable(Ae))
          throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");
        if (!Be.textureTypeReadable(Pe))
          throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");
        if (U >= 0 && U <= T.width - k && H >= 0 && H <= T.height - N) {
          Ee.bindFramebuffer(O.FRAMEBUFFER, ge);
          const ve = O.createBuffer();
          O.bindBuffer(O.PIXEL_PACK_BUFFER, ve), O.bufferData(O.PIXEL_PACK_BUFFER, ee.byteLength, O.STREAM_READ), O.readPixels(U, H, k, N, Ie.convert(Ae), Ie.convert(Pe), 0);
          const We = R !== null ? ye.get(R).__webglFramebuffer : null;
          Ee.bindFramebuffer(O.FRAMEBUFFER, We);
          const Qe = O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE, 0);
          return O.flush(), await Zf(O, Qe, 4), O.bindBuffer(O.PIXEL_PACK_BUFFER, ve), O.getBufferSubData(O.PIXEL_PACK_BUFFER, 0, ee), O.deleteBuffer(ve), O.deleteSync(Qe), ee;
        } else
          throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.");
      }
    }, this.copyFramebufferToTexture = function(T, U = null, H = 0) {
      T.isTexture !== !0 && (Vi("WebGLRenderer: copyFramebufferToTexture function signature has changed."), U = arguments[0] || null, T = arguments[1]);
      const k = Math.pow(2, -H), N = Math.floor(T.image.width * k), ee = Math.floor(T.image.height * k), ce = U !== null ? U.x : 0, ge = U !== null ? U.y : 0;
      w.setTexture2D(T, 0), O.copyTexSubImage2D(O.TEXTURE_2D, H, 0, 0, ce, ge, N, ee), Ee.unbindTexture();
    }, this.copyTextureToTexture = function(T, U, H = null, k = null, N = 0) {
      T.isTexture !== !0 && (Vi("WebGLRenderer: copyTextureToTexture function signature has changed."), k = arguments[0] || null, T = arguments[1], U = arguments[2], N = arguments[3] || 0, H = null);
      let ee, ce, ge, _e, Ae, Pe, ve, We, Qe;
      const tt = T.isCompressedTexture ? T.mipmaps[N] : T.image;
      H !== null ? (ee = H.max.x - H.min.x, ce = H.max.y - H.min.y, ge = H.isBox3 ? H.max.z - H.min.z : 1, _e = H.min.x, Ae = H.min.y, Pe = H.isBox3 ? H.min.z : 0) : (ee = tt.width, ce = tt.height, ge = tt.depth || 1, _e = 0, Ae = 0, Pe = 0), k !== null ? (ve = k.x, We = k.y, Qe = k.z) : (ve = 0, We = 0, Qe = 0);
      const At = Ie.convert(U.format), qe = Ie.convert(U.type);
      let Me;
      U.isData3DTexture ? (w.setTexture3D(U, 0), Me = O.TEXTURE_3D) : U.isDataArrayTexture || U.isCompressedArrayTexture ? (w.setTexture2DArray(U, 0), Me = O.TEXTURE_2D_ARRAY) : (w.setTexture2D(U, 0), Me = O.TEXTURE_2D), O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL, U.flipY), O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL, U.premultiplyAlpha), O.pixelStorei(O.UNPACK_ALIGNMENT, U.unpackAlignment);
      const sn = O.getParameter(O.UNPACK_ROW_LENGTH), $e = O.getParameter(O.UNPACK_IMAGE_HEIGHT), Vt = O.getParameter(O.UNPACK_SKIP_PIXELS), ei = O.getParameter(O.UNPACK_SKIP_ROWS), Dt = O.getParameter(O.UNPACK_SKIP_IMAGES);
      O.pixelStorei(O.UNPACK_ROW_LENGTH, tt.width), O.pixelStorei(O.UNPACK_IMAGE_HEIGHT, tt.height), O.pixelStorei(O.UNPACK_SKIP_PIXELS, _e), O.pixelStorei(O.UNPACK_SKIP_ROWS, Ae), O.pixelStorei(O.UNPACK_SKIP_IMAGES, Pe);
      const Li = T.isDataArrayTexture || T.isData3DTexture, nt = U.isDataArrayTexture || U.isData3DTexture;
      if (T.isRenderTargetTexture || T.isDepthTexture) {
        const jt = ye.get(T), Ii = ye.get(U), Ot = ye.get(jt.__renderTarget), vn = ye.get(Ii.__renderTarget);
        Ee.bindFramebuffer(O.READ_FRAMEBUFFER, Ot.__webglFramebuffer), Ee.bindFramebuffer(O.DRAW_FRAMEBUFFER, vn.__webglFramebuffer);
        for (let xn = 0; xn < ge; xn++)
          Li && O.framebufferTextureLayer(O.READ_FRAMEBUFFER, O.COLOR_ATTACHMENT0, ye.get(T).__webglTexture, N, Pe + xn), T.isDepthTexture ? (nt && O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER, O.COLOR_ATTACHMENT0, ye.get(U).__webglTexture, N, Qe + xn), O.blitFramebuffer(_e, Ae, ee, ce, ve, We, ee, ce, O.DEPTH_BUFFER_BIT, O.NEAREST)) : nt ? O.copyTexSubImage3D(Me, N, ve, We, Qe + xn, _e, Ae, ee, ce) : O.copyTexSubImage2D(Me, N, ve, We, Qe + xn, _e, Ae, ee, ce);
        Ee.bindFramebuffer(O.READ_FRAMEBUFFER, null), Ee.bindFramebuffer(O.DRAW_FRAMEBUFFER, null);
      } else
        nt ? T.isDataTexture || T.isData3DTexture ? O.texSubImage3D(Me, N, ve, We, Qe, ee, ce, ge, At, qe, tt.data) : U.isCompressedArrayTexture ? O.compressedTexSubImage3D(Me, N, ve, We, Qe, ee, ce, ge, At, tt.data) : O.texSubImage3D(Me, N, ve, We, Qe, ee, ce, ge, At, qe, tt) : T.isDataTexture ? O.texSubImage2D(O.TEXTURE_2D, N, ve, We, ee, ce, At, qe, tt.data) : T.isCompressedTexture ? O.compressedTexSubImage2D(O.TEXTURE_2D, N, ve, We, tt.width, tt.height, At, tt.data) : O.texSubImage2D(O.TEXTURE_2D, N, ve, We, ee, ce, At, qe, tt);
      O.pixelStorei(O.UNPACK_ROW_LENGTH, sn), O.pixelStorei(O.UNPACK_IMAGE_HEIGHT, $e), O.pixelStorei(O.UNPACK_SKIP_PIXELS, Vt), O.pixelStorei(O.UNPACK_SKIP_ROWS, ei), O.pixelStorei(O.UNPACK_SKIP_IMAGES, Dt), N === 0 && U.generateMipmaps && O.generateMipmap(Me), Ee.unbindTexture();
    }, this.copyTextureToTexture3D = function(T, U, H = null, k = null, N = 0) {
      return T.isTexture !== !0 && (Vi("WebGLRenderer: copyTextureToTexture3D function signature has changed."), H = arguments[0] || null, k = arguments[1] || null, T = arguments[2], U = arguments[3], N = arguments[4] || 0), Vi('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'), this.copyTextureToTexture(T, U, H, k, N);
    }, this.initRenderTarget = function(T) {
      ye.get(T).__webglFramebuffer === void 0 && w.setupRenderTarget(T);
    }, this.initTexture = function(T) {
      T.isCubeTexture ? w.setTextureCube(T, 0) : T.isData3DTexture ? w.setTexture3D(T, 0) : T.isDataArrayTexture || T.isCompressedArrayTexture ? w.setTexture2DArray(T, 0) : w.setTexture2D(T, 0), Ee.unbindTexture();
    }, this.resetState = function() {
      b = 0, A = 0, R = null, Ee.reset(), Je.reset();
    }, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  get coordinateSystem() {
    return un;
  }
  get outputColorSpace() {
    return this._outputColorSpace;
  }
  set outputColorSpace(e) {
    this._outputColorSpace = e;
    const n = this.getContext();
    n.drawingBufferColorspace = Ge._getDrawingBufferColorSpace(e), n.unpackColorSpace = Ge._getUnpackColorSpace();
  }
}
class cg extends gt {
  constructor() {
    super(), this.isScene = !0, this.type = "Scene", this.background = null, this.environment = null, this.fog = null, this.backgroundBlurriness = 0, this.backgroundIntensity = 1, this.backgroundRotation = new gn(), this.environmentIntensity = 1, this.environmentRotation = new gn(), this.overrideMaterial = null, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  copy(e, n) {
    return super.copy(e, n), e.background !== null && (this.background = e.background.clone()), e.environment !== null && (this.environment = e.environment.clone()), e.fog !== null && (this.fog = e.fog.clone()), this.backgroundBlurriness = e.backgroundBlurriness, this.backgroundIntensity = e.backgroundIntensity, this.backgroundRotation.copy(e.backgroundRotation), this.environmentIntensity = e.environmentIntensity, this.environmentRotation.copy(e.environmentRotation), e.overrideMaterial !== null && (this.overrideMaterial = e.overrideMaterial.clone()), this.matrixAutoUpdate = e.matrixAutoUpdate, this;
  }
  toJSON(e) {
    const n = super.toJSON(e);
    return this.fog !== null && (n.object.fog = this.fog.toJSON()), this.backgroundBlurriness > 0 && (n.object.backgroundBlurriness = this.backgroundBlurriness), this.backgroundIntensity !== 1 && (n.object.backgroundIntensity = this.backgroundIntensity), n.object.backgroundRotation = this.backgroundRotation.toArray(), this.environmentIntensity !== 1 && (n.object.environmentIntensity = this.environmentIntensity), n.object.environmentRotation = this.environmentRotation.toArray(), n;
  }
}
class lg extends St {
  constructor(e = null, n = 1, i = 1, r, s, a, o, c, l = Nt, h = Nt, f, d) {
    super(null, a, o, c, l, h, r, s, f, d), this.isDataTexture = !0, this.image = { data: e, width: n, height: i }, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
  }
}
class ec extends ht {
  constructor(e, n, i, r = 1) {
    super(e, n, i), this.isInstancedBufferAttribute = !0, this.meshPerAttribute = r;
  }
  copy(e) {
    return super.copy(e), this.meshPerAttribute = e.meshPerAttribute, this;
  }
  toJSON() {
    const e = super.toJSON();
    return e.meshPerAttribute = this.meshPerAttribute, e.isInstancedBufferAttribute = !0, e;
  }
}
const mi = /* @__PURE__ */ new je(), tc = /* @__PURE__ */ new je(), Sr = [], nc = /* @__PURE__ */ new Kn(), hg = /* @__PURE__ */ new je(), Bi = /* @__PURE__ */ new Ut(), Hi = /* @__PURE__ */ new Jn();
class La extends Ut {
  constructor(e, n, i) {
    super(e, n), this.isInstancedMesh = !0, this.instanceMatrix = new ec(new Float32Array(i * 16), 16), this.instanceColor = null, this.morphTexture = null, this.count = i, this.boundingBox = null, this.boundingSphere = null;
    for (let r = 0; r < i; r++)
      this.setMatrixAt(r, hg);
  }
  computeBoundingBox() {
    const e = this.geometry, n = this.count;
    this.boundingBox === null && (this.boundingBox = new Kn()), e.boundingBox === null && e.computeBoundingBox(), this.boundingBox.makeEmpty();
    for (let i = 0; i < n; i++)
      this.getMatrixAt(i, mi), nc.copy(e.boundingBox).applyMatrix4(mi), this.boundingBox.union(nc);
  }
  computeBoundingSphere() {
    const e = this.geometry, n = this.count;
    this.boundingSphere === null && (this.boundingSphere = new Jn()), e.boundingSphere === null && e.computeBoundingSphere(), this.boundingSphere.makeEmpty();
    for (let i = 0; i < n; i++)
      this.getMatrixAt(i, mi), Hi.copy(e.boundingSphere).applyMatrix4(mi), this.boundingSphere.union(Hi);
  }
  copy(e, n) {
    return super.copy(e, n), this.instanceMatrix.copy(e.instanceMatrix), e.morphTexture !== null && (this.morphTexture = e.morphTexture.clone()), e.instanceColor !== null && (this.instanceColor = e.instanceColor.clone()), this.count = e.count, e.boundingBox !== null && (this.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (this.boundingSphere = e.boundingSphere.clone()), this;
  }
  getColorAt(e, n) {
    n.fromArray(this.instanceColor.array, e * 3);
  }
  getMatrixAt(e, n) {
    n.fromArray(this.instanceMatrix.array, e * 16);
  }
  getMorphAt(e, n) {
    const i = n.morphTargetInfluences, r = this.morphTexture.source.data.data, s = i.length + 1, a = e * s + 1;
    for (let o = 0; o < i.length; o++)
      i[o] = r[a + o];
  }
  raycast(e, n) {
    const i = this.matrixWorld, r = this.count;
    if (Bi.geometry = this.geometry, Bi.material = this.material, Bi.material !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), Hi.copy(this.boundingSphere), Hi.applyMatrix4(i), e.ray.intersectsSphere(Hi) !== !1))
      for (let s = 0; s < r; s++) {
        this.getMatrixAt(s, mi), tc.multiplyMatrices(i, mi), Bi.matrixWorld = tc, Bi.raycast(e, Sr);
        for (let a = 0, o = Sr.length; a < o; a++) {
          const c = Sr[a];
          c.instanceId = s, c.object = this, n.push(c);
        }
        Sr.length = 0;
      }
  }
  setColorAt(e, n) {
    this.instanceColor === null && (this.instanceColor = new ec(new Float32Array(this.instanceMatrix.count * 3).fill(1), 3)), n.toArray(this.instanceColor.array, e * 3);
  }
  setMatrixAt(e, n) {
    n.toArray(this.instanceMatrix.array, e * 16);
  }
  setMorphAt(e, n) {
    const i = n.morphTargetInfluences, r = i.length + 1;
    this.morphTexture === null && (this.morphTexture = new lg(new Float32Array(r * this.count), r, this.count, ba, Qt));
    const s = this.morphTexture.source.data.data;
    let a = 0;
    for (let l = 0; l < i.length; l++)
      a += i[l];
    const o = this.geometry.morphTargetsRelative ? 1 : 1 - a, c = r * e;
    s[c] = o, s.set(i, c + 1);
  }
  updateMorphTargets() {
  }
  dispose() {
    return this.dispatchEvent({ type: "dispose" }), this.morphTexture !== null && (this.morphTexture.dispose(), this.morphTexture = null), this;
  }
}
class qr extends Pi {
  static get type() {
    return "LineBasicMaterial";
  }
  constructor(e) {
    super(), this.isLineBasicMaterial = !0, this.color = new Oe(16777215), this.map = null, this.linewidth = 1, this.linecap = "round", this.linejoin = "round", this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.color.copy(e.color), this.map = e.map, this.linewidth = e.linewidth, this.linecap = e.linecap, this.linejoin = e.linejoin, this.fog = e.fog, this;
  }
}
const Br = /* @__PURE__ */ new z(), Hr = /* @__PURE__ */ new z(), ic = /* @__PURE__ */ new je(), ki = /* @__PURE__ */ new Ki(), Er = /* @__PURE__ */ new Jn(), bs = /* @__PURE__ */ new z(), rc = /* @__PURE__ */ new z();
class il extends gt {
  constructor(e = new _t(), n = new qr()) {
    super(), this.isLine = !0, this.type = "Line", this.geometry = e, this.material = n, this.updateMorphTargets();
  }
  copy(e, n) {
    return super.copy(e, n), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
  }
  computeLineDistances() {
    const e = this.geometry;
    if (e.index === null) {
      const n = e.attributes.position, i = [0];
      for (let r = 1, s = n.count; r < s; r++)
        Br.fromBufferAttribute(n, r - 1), Hr.fromBufferAttribute(n, r), i[r] = i[r - 1], i[r] += Br.distanceTo(Hr);
      e.setAttribute("lineDistance", new ft(i, 1));
    } else
      console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
    return this;
  }
  raycast(e, n) {
    const i = this.geometry, r = this.matrixWorld, s = e.params.Line.threshold, a = i.drawRange;
    if (i.boundingSphere === null && i.computeBoundingSphere(), Er.copy(i.boundingSphere), Er.applyMatrix4(r), Er.radius += s, e.ray.intersectsSphere(Er) === !1) return;
    ic.copy(r).invert(), ki.copy(e.ray).applyMatrix4(ic);
    const o = s / ((this.scale.x + this.scale.y + this.scale.z) / 3), c = o * o, l = this.isLineSegments ? 2 : 1, h = i.index, d = i.attributes.position;
    if (h !== null) {
      const u = Math.max(0, a.start), g = Math.min(h.count, a.start + a.count);
      for (let _ = u, p = g - 1; _ < p; _ += l) {
        const m = h.getX(_), E = h.getX(_ + 1), M = Tr(this, e, ki, c, m, E);
        M && n.push(M);
      }
      if (this.isLineLoop) {
        const _ = h.getX(g - 1), p = h.getX(u), m = Tr(this, e, ki, c, _, p);
        m && n.push(m);
      }
    } else {
      const u = Math.max(0, a.start), g = Math.min(d.count, a.start + a.count);
      for (let _ = u, p = g - 1; _ < p; _ += l) {
        const m = Tr(this, e, ki, c, _, _ + 1);
        m && n.push(m);
      }
      if (this.isLineLoop) {
        const _ = Tr(this, e, ki, c, g - 1, u);
        _ && n.push(_);
      }
    }
  }
  updateMorphTargets() {
    const n = this.geometry.morphAttributes, i = Object.keys(n);
    if (i.length > 0) {
      const r = n[i[0]];
      if (r !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let s = 0, a = r.length; s < a; s++) {
          const o = r[s].name || String(s);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = s;
        }
      }
    }
  }
}
function Tr(t, e, n, i, r, s) {
  const a = t.geometry.attributes.position;
  if (Br.fromBufferAttribute(a, r), Hr.fromBufferAttribute(a, s), n.distanceSqToSegment(Br, Hr, bs, rc) > i) return;
  bs.applyMatrix4(t.matrixWorld);
  const c = e.ray.origin.distanceTo(bs);
  if (!(c < e.near || c > e.far))
    return {
      distance: c,
      // What do we want? intersection point on the ray or on the segment??
      // point: raycaster.ray.at( distance ),
      point: rc.clone().applyMatrix4(t.matrixWorld),
      index: r,
      face: null,
      faceIndex: null,
      barycoord: null,
      object: t
    };
}
const sc = /* @__PURE__ */ new z(), ac = /* @__PURE__ */ new z();
class Ia extends il {
  constructor(e, n) {
    super(e, n), this.isLineSegments = !0, this.type = "LineSegments";
  }
  computeLineDistances() {
    const e = this.geometry;
    if (e.index === null) {
      const n = e.attributes.position, i = [];
      for (let r = 0, s = n.count; r < s; r += 2)
        sc.fromBufferAttribute(n, r), ac.fromBufferAttribute(n, r + 1), i[r] = r === 0 ? 0 : i[r - 1], i[r + 1] = i[r] + sc.distanceTo(ac);
      e.setAttribute("lineDistance", new ft(i, 1));
    } else
      console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
    return this;
  }
}
class fg extends Pi {
  static get type() {
    return "PointsMaterial";
  }
  constructor(e) {
    super(), this.isPointsMaterial = !0, this.color = new Oe(16777215), this.map = null, this.alphaMap = null, this.size = 1, this.sizeAttenuation = !0, this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.color.copy(e.color), this.map = e.map, this.alphaMap = e.alphaMap, this.size = e.size, this.sizeAttenuation = e.sizeAttenuation, this.fog = e.fog, this;
  }
}
const oc = /* @__PURE__ */ new je(), ga = /* @__PURE__ */ new Ki(), br = /* @__PURE__ */ new Jn(), Ar = /* @__PURE__ */ new z();
class Ua extends gt {
  constructor(e = new _t(), n = new fg()) {
    super(), this.isPoints = !0, this.type = "Points", this.geometry = e, this.material = n, this.updateMorphTargets();
  }
  copy(e, n) {
    return super.copy(e, n), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
  }
  raycast(e, n) {
    const i = this.geometry, r = this.matrixWorld, s = e.params.Points.threshold, a = i.drawRange;
    if (i.boundingSphere === null && i.computeBoundingSphere(), br.copy(i.boundingSphere), br.applyMatrix4(r), br.radius += s, e.ray.intersectsSphere(br) === !1) return;
    oc.copy(r).invert(), ga.copy(e.ray).applyMatrix4(oc);
    const o = s / ((this.scale.x + this.scale.y + this.scale.z) / 3), c = o * o, l = i.index, f = i.attributes.position;
    if (l !== null) {
      const d = Math.max(0, a.start), u = Math.min(l.count, a.start + a.count);
      for (let g = d, _ = u; g < _; g++) {
        const p = l.getX(g);
        Ar.fromBufferAttribute(f, p), cc(Ar, p, c, r, e, n, this);
      }
    } else {
      const d = Math.max(0, a.start), u = Math.min(f.count, a.start + a.count);
      for (let g = d, _ = u; g < _; g++)
        Ar.fromBufferAttribute(f, g), cc(Ar, g, c, r, e, n, this);
    }
  }
  updateMorphTargets() {
    const n = this.geometry.morphAttributes, i = Object.keys(n);
    if (i.length > 0) {
      const r = n[i[0]];
      if (r !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let s = 0, a = r.length; s < a; s++) {
          const o = r[s].name || String(s);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = s;
        }
      }
    }
  }
}
function cc(t, e, n, i, r, s, a) {
  const o = ga.distanceSqToPoint(t);
  if (o < n) {
    const c = new z();
    ga.closestPointToPoint(t, c), c.applyMatrix4(i);
    const l = r.ray.origin.distanceTo(c);
    if (l < r.near || l > r.far) return;
    s.push({
      distance: l,
      distanceToRay: Math.sqrt(o),
      point: c,
      index: e,
      face: null,
      faceIndex: null,
      barycoord: null,
      object: a
    });
  }
}
class Na extends _t {
  constructor(e = 1, n = 1, i = 1, r = 32, s = 1, a = !1, o = 0, c = Math.PI * 2) {
    super(), this.type = "CylinderGeometry", this.parameters = {
      radiusTop: e,
      radiusBottom: n,
      height: i,
      radialSegments: r,
      heightSegments: s,
      openEnded: a,
      thetaStart: o,
      thetaLength: c
    };
    const l = this;
    r = Math.floor(r), s = Math.floor(s);
    const h = [], f = [], d = [], u = [];
    let g = 0;
    const _ = [], p = i / 2;
    let m = 0;
    E(), a === !1 && (e > 0 && M(!0), n > 0 && M(!1)), this.setIndex(h), this.setAttribute("position", new ft(f, 3)), this.setAttribute("normal", new ft(d, 3)), this.setAttribute("uv", new ft(u, 2));
    function E() {
      const x = new z(), P = new z();
      let b = 0;
      const A = (n - e) / i;
      for (let R = 0; R <= s; R++) {
        const S = [], v = R / s, C = v * (n - e) + e;
        for (let F = 0; F <= r; F++) {
          const L = F / r, D = L * c + o, W = Math.sin(D), V = Math.cos(D);
          P.x = C * W, P.y = -v * i + p, P.z = C * V, f.push(P.x, P.y, P.z), x.set(W, A, V).normalize(), d.push(x.x, x.y, x.z), u.push(L, 1 - v), S.push(g++);
        }
        _.push(S);
      }
      for (let R = 0; R < r; R++)
        for (let S = 0; S < s; S++) {
          const v = _[S][R], C = _[S + 1][R], F = _[S + 1][R + 1], L = _[S][R + 1];
          (e > 0 || S !== 0) && (h.push(v, C, L), b += 3), (n > 0 || S !== s - 1) && (h.push(C, F, L), b += 3);
        }
      l.addGroup(m, b, 0), m += b;
    }
    function M(x) {
      const P = g, b = new we(), A = new z();
      let R = 0;
      const S = x === !0 ? e : n, v = x === !0 ? 1 : -1;
      for (let F = 1; F <= r; F++)
        f.push(0, p * v, 0), d.push(0, v, 0), u.push(0.5, 0.5), g++;
      const C = g;
      for (let F = 0; F <= r; F++) {
        const D = F / r * c + o, W = Math.cos(D), V = Math.sin(D);
        A.x = S * V, A.y = p * v, A.z = S * W, f.push(A.x, A.y, A.z), d.push(0, v, 0), b.x = W * 0.5 + 0.5, b.y = V * 0.5 * v + 0.5, u.push(b.x, b.y), g++;
      }
      for (let F = 0; F < r; F++) {
        const L = P + F, D = C + F;
        x === !0 ? h.push(D, D + 1, L) : h.push(D + 1, D, L), R += 3;
      }
      l.addGroup(m, R, x === !0 ? 1 : 2), m += R;
    }
  }
  copy(e) {
    return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
  }
  static fromJSON(e) {
    return new Na(e.radiusTop, e.radiusBottom, e.height, e.radialSegments, e.heightSegments, e.openEnded, e.thetaStart, e.thetaLength);
  }
}
const lc = {
  enabled: !1,
  files: {},
  add: function(t, e) {
    this.enabled !== !1 && (this.files[t] = e);
  },
  get: function(t) {
    if (this.enabled !== !1)
      return this.files[t];
  },
  remove: function(t) {
    delete this.files[t];
  },
  clear: function() {
    this.files = {};
  }
};
class dg {
  constructor(e, n, i) {
    const r = this;
    let s = !1, a = 0, o = 0, c;
    const l = [];
    this.onStart = void 0, this.onLoad = e, this.onProgress = n, this.onError = i, this.itemStart = function(h) {
      o++, s === !1 && r.onStart !== void 0 && r.onStart(h, a, o), s = !0;
    }, this.itemEnd = function(h) {
      a++, r.onProgress !== void 0 && r.onProgress(h, a, o), a === o && (s = !1, r.onLoad !== void 0 && r.onLoad());
    }, this.itemError = function(h) {
      r.onError !== void 0 && r.onError(h);
    }, this.resolveURL = function(h) {
      return c ? c(h) : h;
    }, this.setURLModifier = function(h) {
      return c = h, this;
    }, this.addHandler = function(h, f) {
      return l.push(h, f), this;
    }, this.removeHandler = function(h) {
      const f = l.indexOf(h);
      return f !== -1 && l.splice(f, 2), this;
    }, this.getHandler = function(h) {
      for (let f = 0, d = l.length; f < d; f += 2) {
        const u = l[f], g = l[f + 1];
        if (u.global && (u.lastIndex = 0), u.test(h))
          return g;
      }
      return null;
    };
  }
}
const ug = /* @__PURE__ */ new dg();
class Fa {
  constructor(e) {
    this.manager = e !== void 0 ? e : ug, this.crossOrigin = "anonymous", this.withCredentials = !1, this.path = "", this.resourcePath = "", this.requestHeader = {};
  }
  load() {
  }
  loadAsync(e, n) {
    const i = this;
    return new Promise(function(r, s) {
      i.load(e, r, n, s);
    });
  }
  parse() {
  }
  setCrossOrigin(e) {
    return this.crossOrigin = e, this;
  }
  setWithCredentials(e) {
    return this.withCredentials = e, this;
  }
  setPath(e) {
    return this.path = e, this;
  }
  setResourcePath(e) {
    return this.resourcePath = e, this;
  }
  setRequestHeader(e) {
    return this.requestHeader = e, this;
  }
}
Fa.DEFAULT_MATERIAL_NAME = "__DEFAULT";
class pg extends Fa {
  constructor(e) {
    super(e);
  }
  load(e, n, i, r) {
    this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
    const s = this, a = lc.get(e);
    if (a !== void 0)
      return s.manager.itemStart(e), setTimeout(function() {
        n && n(a), s.manager.itemEnd(e);
      }, 0), a;
    const o = qi("img");
    function c() {
      h(), lc.add(e, this), n && n(this), s.manager.itemEnd(e);
    }
    function l(f) {
      h(), r && r(f), s.manager.itemError(e), s.manager.itemEnd(e);
    }
    function h() {
      o.removeEventListener("load", c, !1), o.removeEventListener("error", l, !1);
    }
    return o.addEventListener("load", c, !1), o.addEventListener("error", l, !1), e.slice(0, 5) !== "data:" && this.crossOrigin !== void 0 && (o.crossOrigin = this.crossOrigin), s.manager.itemStart(e), o.src = e, o;
  }
}
class mg extends Fa {
  constructor(e) {
    super(e);
  }
  load(e, n, i, r) {
    const s = new St(), a = new pg(this.manager);
    return a.setCrossOrigin(this.crossOrigin), a.setPath(this.path), a.load(e, function(o) {
      s.image = o, s.needsUpdate = !0, n !== void 0 && n(s);
    }, i, r), s;
  }
}
class rl extends gt {
  constructor(e, n = 1) {
    super(), this.isLight = !0, this.type = "Light", this.color = new Oe(e), this.intensity = n;
  }
  dispose() {
  }
  copy(e, n) {
    return super.copy(e, n), this.color.copy(e.color), this.intensity = e.intensity, this;
  }
  toJSON(e) {
    const n = super.toJSON(e);
    return n.object.color = this.color.getHex(), n.object.intensity = this.intensity, this.groundColor !== void 0 && (n.object.groundColor = this.groundColor.getHex()), this.distance !== void 0 && (n.object.distance = this.distance), this.angle !== void 0 && (n.object.angle = this.angle), this.decay !== void 0 && (n.object.decay = this.decay), this.penumbra !== void 0 && (n.object.penumbra = this.penumbra), this.shadow !== void 0 && (n.object.shadow = this.shadow.toJSON()), this.target !== void 0 && (n.object.target = this.target.uuid), n;
  }
}
const As = /* @__PURE__ */ new je(), hc = /* @__PURE__ */ new z(), fc = /* @__PURE__ */ new z();
class gg {
  constructor(e) {
    this.camera = e, this.intensity = 1, this.bias = 0, this.normalBias = 0, this.radius = 1, this.blurSamples = 8, this.mapSize = new we(512, 512), this.map = null, this.mapPass = null, this.matrix = new je(), this.autoUpdate = !0, this.needsUpdate = !1, this._frustum = new Pa(), this._frameExtents = new we(1, 1), this._viewportCount = 1, this._viewports = [
      new st(0, 0, 1, 1)
    ];
  }
  getViewportCount() {
    return this._viewportCount;
  }
  getFrustum() {
    return this._frustum;
  }
  updateMatrices(e) {
    const n = this.camera, i = this.matrix;
    hc.setFromMatrixPosition(e.matrixWorld), n.position.copy(hc), fc.setFromMatrixPosition(e.target.matrixWorld), n.lookAt(fc), n.updateMatrixWorld(), As.multiplyMatrices(n.projectionMatrix, n.matrixWorldInverse), this._frustum.setFromProjectionMatrix(As), i.set(
      0.5,
      0,
      0,
      0.5,
      0,
      0.5,
      0,
      0.5,
      0,
      0,
      0.5,
      0.5,
      0,
      0,
      0,
      1
    ), i.multiply(As);
  }
  getViewport(e) {
    return this._viewports[e];
  }
  getFrameExtents() {
    return this._frameExtents;
  }
  dispose() {
    this.map && this.map.dispose(), this.mapPass && this.mapPass.dispose();
  }
  copy(e) {
    return this.camera = e.camera.clone(), this.intensity = e.intensity, this.bias = e.bias, this.radius = e.radius, this.mapSize.copy(e.mapSize), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  toJSON() {
    const e = {};
    return this.intensity !== 1 && (e.intensity = this.intensity), this.bias !== 0 && (e.bias = this.bias), this.normalBias !== 0 && (e.normalBias = this.normalBias), this.radius !== 1 && (e.radius = this.radius), (this.mapSize.x !== 512 || this.mapSize.y !== 512) && (e.mapSize = this.mapSize.toArray()), e.camera = this.camera.toJSON(!1).object, delete e.camera.matrix, e;
  }
}
class _g extends gg {
  constructor() {
    super(new Kc(-5, 5, 5, -5, 0.5, 500)), this.isDirectionalLightShadow = !0;
  }
}
class vg extends rl {
  constructor(e, n) {
    super(e, n), this.isDirectionalLight = !0, this.type = "DirectionalLight", this.position.copy(gt.DEFAULT_UP), this.updateMatrix(), this.target = new gt(), this.shadow = new _g();
  }
  dispose() {
    this.shadow.dispose();
  }
  copy(e) {
    return super.copy(e), this.target = e.target.clone(), this.shadow = e.shadow.clone(), this;
  }
}
class xg extends rl {
  constructor(e, n) {
    super(e, n), this.isAmbientLight = !0, this.type = "AmbientLight";
  }
}
const dc = /* @__PURE__ */ new je();
class Mg {
  constructor(e, n, i = 0, r = 1 / 0) {
    this.ray = new Ki(e, n), this.near = i, this.far = r, this.camera = null, this.layers = new Ca(), this.params = {
      Mesh: {},
      Line: { threshold: 1 },
      LOD: {},
      Points: { threshold: 1 },
      Sprite: {}
    };
  }
  set(e, n) {
    this.ray.set(e, n);
  }
  setFromCamera(e, n) {
    n.isPerspectiveCamera ? (this.ray.origin.setFromMatrixPosition(n.matrixWorld), this.ray.direction.set(e.x, e.y, 0.5).unproject(n).sub(this.ray.origin).normalize(), this.camera = n) : n.isOrthographicCamera ? (this.ray.origin.set(e.x, e.y, (n.near + n.far) / (n.near - n.far)).unproject(n), this.ray.direction.set(0, 0, -1).transformDirection(n.matrixWorld), this.camera = n) : console.error("THREE.Raycaster: Unsupported camera type: " + n.type);
  }
  setFromXRController(e) {
    return dc.identity().extractRotation(e.matrixWorld), this.ray.origin.setFromMatrixPosition(e.matrixWorld), this.ray.direction.set(0, 0, -1).applyMatrix4(dc), this;
  }
  intersectObject(e, n = !0, i = []) {
    return _a(e, this, i, n), i.sort(uc), i;
  }
  intersectObjects(e, n = !0, i = []) {
    for (let r = 0, s = e.length; r < s; r++)
      _a(e[r], this, i, n);
    return i.sort(uc), i;
  }
}
function uc(t, e) {
  return t.distance - e.distance;
}
function _a(t, e, n, i) {
  let r = !0;
  if (t.layers.test(e.layers) && t.raycast(e, n) === !1 && (r = !1), r === !0 && i === !0) {
    const s = t.children;
    for (let a = 0, o = s.length; a < o; a++)
      _a(s[a], e, n, !0);
  }
}
class pc {
  constructor(e = 1, n = 0, i = 0) {
    return this.radius = e, this.phi = n, this.theta = i, this;
  }
  set(e, n, i) {
    return this.radius = e, this.phi = n, this.theta = i, this;
  }
  copy(e) {
    return this.radius = e.radius, this.phi = e.phi, this.theta = e.theta, this;
  }
  // restrict phi to be between EPS and PI-EPS
  makeSafe() {
    return this.phi = Math.max(1e-6, Math.min(Math.PI - 1e-6, this.phi)), this;
  }
  setFromVector3(e) {
    return this.setFromCartesianCoords(e.x, e.y, e.z);
  }
  setFromCartesianCoords(e, n, i) {
    return this.radius = Math.sqrt(e * e + n * n + i * i), this.radius === 0 ? (this.theta = 0, this.phi = 0) : (this.theta = Math.atan2(e, i), this.phi = Math.acos(bt(n / this.radius, -1, 1))), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class yg extends Zn {
  constructor(e, n = null) {
    super(), this.object = e, this.domElement = n, this.enabled = !0, this.state = -1, this.keys = {}, this.mouseButtons = { LEFT: null, MIDDLE: null, RIGHT: null }, this.touches = { ONE: null, TWO: null };
  }
  connect() {
  }
  disconnect() {
  }
  dispose() {
  }
  update() {
  }
}
typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", { detail: {
  revision: ya
} }));
typeof window < "u" && (window.__THREE__ ? console.warn("WARNING: Multiple instances of Three.js being imported.") : window.__THREE__ = ya);
function Sg(t) {
  let e = 0, n = 0;
  for (const f of t)
    f.length < 2 || (e += f.length * 2, n += (f.length - 1) * 6);
  const i = new Float32Array(e * 3), r = new Float32Array(e * 3), s = new Float32Array(e * 3), a = new Float32Array(e), o = e > 65535 ? new Uint32Array(n) : new Uint16Array(n);
  let c = 0, l = 0;
  for (const f of t) {
    const d = f.length;
    if (d < 2) continue;
    const u = c;
    for (let g = 0; g < d; g++) {
      const _ = f[g], p = g > 0 ? f[g - 1] : _, m = g < d - 1 ? f[g + 1] : _;
      for (let E = -1; E <= 1; E += 2) {
        const M = c * 3;
        i[M] = _.x, i[M + 1] = _.y, i[M + 2] = _.z, r[M] = p.x, r[M + 1] = p.y, r[M + 2] = p.z, s[M] = m.x, s[M + 1] = m.y, s[M + 2] = m.z, a[c] = E, c++;
      }
    }
    for (let g = 0; g < d - 1; g++) {
      const _ = u + g * 2;
      o[l++] = _, o[l++] = _ + 1, o[l++] = _ + 2, o[l++] = _ + 2, o[l++] = _ + 1, o[l++] = _ + 3;
    }
  }
  const h = new _t();
  return h.setAttribute("position", new ht(i, 3)), h.setAttribute("positionPrev", new ht(r, 3)), h.setAttribute("positionNext", new ht(s, 3)), h.setAttribute("side", new ht(a, 1)), h.setIndex(new ht(o, 1)), h.computeBoundingSphere(), h;
}
const Eg = `
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
`, Tg = `
uniform vec3 color;

void main() {
  gl_FragColor = vec4(color, 1.0);
}
`;
function bg(t = {}) {
  const e = t.color ?? 16777215, n = t.lineWidth ?? 2, i = t.resolution ?? new we(800, 700), r = new Oe(e);
  return new tn({
    uniforms: {
      resolution: { value: i },
      lineWidth: { value: n },
      color: { value: new z(r.r, r.g, r.b) }
    },
    vertexShader: Eg,
    fragmentShader: Tg,
    transparent: !1,
    depthTest: !0,
    side: Kt
  });
}
const Ag = 2;
function wg(t) {
  return t >= 1 ? Math.max(1, Math.round(t)) : Math.max(1, Math.round(t * 100));
}
function sl(t, e, n, i = Ag) {
  const r = [], s = [], a = [];
  for (const [f, d] of t.entries()) {
    if (!(d != null && d.points) || d.points.length < 2) continue;
    const u = d.points.map((g) => new z(g.x * e, g.y * e, g.z * e));
    r.push(u);
    for (let g = 0; g < u.length - 1; g++) {
      const _ = u[g], p = u[g + 1];
      s.push(_.x, _.y, _.z, p.x, p.y, p.z), a.push(f);
    }
  }
  const o = new yt();
  if (r.length === 0) return o;
  const c = bg({ color: n, lineWidth: wg(i) }), l = new Ut(Sg(r), c);
  l.userData = { segmentEdgeIds: a };
  const h = new Ia(
    new _t().setAttribute(
      "position",
      new ft(s, 3)
    )
  );
  return l.raycast = (f, d) => {
    h.matrixWorld.copy(l.matrixWorld);
    const u = [];
    h.raycast(f, u);
    for (const g of u) d.push({ ...g, object: l });
  }, l.onBeforeRender = (f) => {
    f.getSize(c.uniforms.resolution.value);
  }, o.add(l), o;
}
const Rg = `
attribute float size;
attribute vec3 customColor;

varying vec3 vColor;

void main() {
    vColor = customColor;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = size * ( 300.0 / -mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
}
`, Cg = `
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
function al(t) {
  return new tn({
    uniforms: {
      color: { value: new Oe(16777215) },
      // base color multiplied with per-vertex customColor
      pointTexture: {
        value: new mg().load("./Textures/Square.png")
      },
      alpha: { value: t }
    },
    vertexShader: Rg,
    fragmentShader: Cg,
    transparent: t < 1,
    depthWrite: t >= 1
  });
}
function ol(t, e = 1, n = 1, i = 16777215, r = 1) {
  const s = [], a = t.get_position_map();
  let o;
  const c = [];
  typeof n == "number" ? o = Array(t.nodes.size).fill(n) : o = n;
  const l = [], h = new Oe(i);
  let f = 0, d;
  for (let p of t.nodes.keys())
    d = a.get(p), s.push(
      d.x * e,
      d.y * e,
      d.z * e
    ), h.toArray(c, f * 3), l.push(p), f += 1;
  const u = new _t();
  u.setAttribute(
    "position",
    new ft(s, 3)
  ), u.setAttribute(
    "customColor",
    new ft(c, 3)
  ), u.setAttribute("size", new ft(o, 1)), u.setAttribute("label", new Xc(l, 1)), u.name = "nodes";
  const g = al(r), _ = new yt();
  return _.add(new Ua(u, g)), _;
}
function Pg(t, e = 1, n = 1, i = 16777215, r = 1) {
  const s = t.get_node_ids_order(), a = s.length, o = t.get_position_map(), c = [];
  let l;
  const h = [], f = s.slice(), d = new Oe(i);
  for (let E = 0; E < a; E++) {
    const M = o.get(s[E]);
    c.push(
      M.x * e,
      M.y * e,
      M.z * e
    ), d.toArray(h, E * 3);
  }
  typeof n == "number" ? l = Array(a).fill(n) : l = n;
  const u = new _t();
  u.setAttribute(
    "position",
    new ft(c, 3)
  ), u.setAttribute(
    "customColor",
    new ft(h, 3)
  ), u.setAttribute("size", new ft(l, 1)), u.setAttribute("label", new Xc(f, 1)), u.name = "nodes";
  const g = al(r), _ = new yt();
  _.add(new Ua(u, g));
  const p = u.getAttribute("position");
  function m(E) {
    const M = p.array;
    if (E instanceof Float32Array)
      for (let x = 0; x < a * 3; x++)
        M[x] = E[x] * e;
    else
      for (let x = 0; x < a; x++) {
        const P = E.get(s[x]);
        M[x * 3] = P.x * e, M[x * 3 + 1] = P.y * e, M[x * 3 + 2] = P.z * e;
      }
    p.needsUpdate = !0;
  }
  return { group: _, updatePositions: m };
}
function Dg(t, e = 1, n = 16777215, i = 0.4) {
  const r = t.get_edge_map();
  return cl(r, e, n, i);
}
function cl(t, e, n = 16777215, i = 0.4) {
  return sl(t, e, n, i);
}
function Lg(t, e = 1, n = 16777215) {
  const i = t.get_edge_map();
  return ll(i, e, n);
}
function Ig(t, e = 1, n = 16777215) {
  const i = new Ia(
    new _t(),
    new qr({ color: n })
  ), r = new yt();
  r.add(i);
  function s() {
    const { positions: a, segmentEdgeIds: o } = hl(t.get_edge_map(), e), c = i.geometry.getAttribute("position");
    c && c.array.length === a.length ? (c.array.set(a), c.needsUpdate = !0, i.geometry.boundingSphere = null) : (i.geometry.dispose(), i.geometry = new _t(), i.geometry.setAttribute("position", new ht(a, 3))), i.userData = { segmentEdgeIds: o };
  }
  return s(), { group: r, updateEdges: s };
}
function Ug(t, e, n, i = 16777215, r = 5) {
  const s = t.get_position_map(), a = n.map((c) => s.get(c)).filter((c) => c != null);
  if (a.length < 2) return new yt();
  const o = new $i(a);
  return sl(/* @__PURE__ */ new Map([[0, o]]), e, i, r);
}
function ll(t, e = 1, n = 16777215) {
  const { positions: i, segmentEdgeIds: r } = hl(t, e), s = new _t();
  s.setAttribute("position", new ht(i, 3));
  const a = new Ia(
    s,
    new qr({ color: n })
  );
  a.userData = { segmentEdgeIds: r };
  const o = new yt();
  return o.add(a), o;
}
function hl(t, e) {
  let n = 0;
  for (const a of t.values()) n += Math.max(0, a.points.length - 1);
  const i = new Float32Array(n * 6), r = [];
  let s = 0;
  for (const [a, o] of t.entries()) {
    const c = o.points;
    for (let l = 0; l < c.length - 1; l++) {
      const h = c[l], f = c[l + 1];
      i[s++] = h.x * e, i[s++] = h.y * e, i[s++] = h.z * e, i[s++] = f.x * e, i[s++] = f.y * e, i[s++] = f.z * e, r.push(a);
    }
  }
  return { positions: i, segmentEdgeIds: r };
}
const An = new je(), wn = new z(), vi = new Un(), Rn = new z();
function fl(t, e = 1, n = 16777215, i = 10) {
  const r = t.size, s = Array.from(t.entries()), a = typeof i == "number" ? Array(r).fill(i) : i, o = new Qn(1, 1, 1), c = new Ji({ color: n }), l = new La(o, c, r);
  l.name = "boxVertices", vi.identity();
  for (let f = 0; f < r; f++) {
    const d = s[f][1], u = a[f];
    wn.set(
      d.x * e,
      d.y * e,
      d.z * e
    ), Rn.set(u, u, u), An.compose(
      wn,
      vi,
      Rn
    ), l.setMatrixAt(f, An);
  }
  l.instanceMatrix.needsUpdate = !0, l.userData = { nodeIds: s.map((f) => f[0]) };
  const h = new yt();
  return h.add(l), h;
}
function Ng(t, e = 1, n = 16777215, i = 10) {
  const r = t.get_node_ids_order(), s = r.length, a = t.get_position_map(), o = typeof i == "number" ? Array(s).fill(i) : i, c = new Qn(1, 1, 1), l = new Ji({ color: n }), h = new La(c, l, s);
  h.name = "boxVertices", vi.identity();
  for (let u = 0; u < s; u++) {
    const g = a.get(r[u]), _ = o[u];
    wn.set(
      g.x * e,
      g.y * e,
      g.z * e
    ), Rn.set(_, _, _), An.compose(
      wn,
      vi,
      Rn
    ), h.setMatrixAt(u, An);
  }
  h.instanceMatrix.needsUpdate = !0, h.userData = { nodeIds: r.slice() };
  const f = new yt();
  f.add(h);
  function d(u) {
    if (u instanceof Float32Array)
      for (let g = 0; g < s; g++)
        wn.set(
          u[g * 3] * e,
          u[g * 3 + 1] * e,
          u[g * 3 + 2] * e
        ), Rn.set(o[g], o[g], o[g]), An.compose(
          wn,
          vi,
          Rn
        ), h.setMatrixAt(g, An);
    else
      for (let g = 0; g < s; g++) {
        const _ = u.get(r[g]);
        wn.set(_.x * e, _.y * e, _.z * e), Rn.set(o[g], o[g], o[g]), An.compose(
          wn,
          vi,
          Rn
        ), h.setMatrixAt(g, An);
      }
    h.instanceMatrix.needsUpdate = !0;
  }
  return { group: f, updatePositions: d };
}
function Fg(t, e = 1, n = 16777215, i = 10) {
  const r = t.get_position_map();
  return fl(r, e, n, i);
}
function Og(t, e = 16, n = 16777215, i = 10) {
  let r;
  typeof i == "number" ? r = Array(t.size).fill(i) : r = i;
  const s = new yt(), a = new Ji({ color: n });
  let o = 0;
  for (const [c, l] of t) {
    const h = r[o], f = 2 * h * Math.PI, d = Math.ceil(f / e), u = new Na(h, h, 10, d);
    u.name = String(c);
    const g = new Ut(u, a);
    g.position.set(l.x, l.y, l.z), s.add(g), o += 1;
  }
  return s;
}
async function zg(t, e) {
  const n = /* @__PURE__ */ new Map();
  let i, r;
  for (let d of t.nodes.keys()) {
    i = t.nodes.get(d);
    const u = i.data[e];
    r = typeof u == "number" ? u : u != null ? Number(u) : void 0, r !== void 0 && (n.has(r) ? n.get(r).push(d) : n.set(r, [d]));
  }
  const s = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
  let o, c, l, h;
  for (let d of n.keys())
    o = n.get(d), c = await Sc.SelectSubgraph(t, o), l = ol(c, 1), s.set(d, l), h = dl(c, 0.03), a.set(d, h);
  return {
    nodeGroups: s,
    EdgeGroups: a
  };
}
function dl(t, e, n = 16777215) {
  const i = new yt(), r = new qr({ color: n });
  let s, a, o;
  for (let c of t.edges.values())
    if (Math.random() <= e) {
      s = t.nodes.get(c.start).data.pos, a = t.nodes.get(c.end).data.pos, o = [], o.push(new z(s.x, s.y, s.z)), o.push(new z(a.x, a.y, a.z));
      const l = new _t().setFromPoints(o), h = new il(l, r);
      i.add(h);
    }
  return i;
}
function Bg(t, e, n) {
  try {
    const i = t instanceof yt ? t.children[0] : t, r = i == null ? void 0 : i.geometry;
    if (!(r != null && r.attributes)) return;
    const s = r.attributes.customColor, a = s == null ? void 0 : s.array;
    if (!a || a.length === 0) return;
    const o = new Oe(n), c = r.attributes.label, l = c == null ? void 0 : c.array;
    l && l.length > 0 ? e.forEach((h) => {
      for (let f = 0; f < l.length; f++)
        if (l[f] === h) {
          const d = f * 3;
          d + 2 < a.length && (a[d] = o.r, a[d + 1] = o.g, a[d + 2] = o.b);
          break;
        }
    }) : e.forEach((h) => {
      const f = h * 3;
      f + 2 < a.length && (a[f] = o.r, a[f + 1] = o.g, a[f + 2] = o.b);
    }), s.needsUpdate = !0;
  } catch {
  }
}
function Hg(t) {
  var e, n;
  try {
    const i = t instanceof yt ? t.children[0] : t, r = (n = (e = i == null ? void 0 : i.geometry) == null ? void 0 : e.attributes) == null ? void 0 : n.customColor, s = r == null ? void 0 : r.array;
    if (!s || s.length === 0) return;
    const a = r.count;
    for (let o = 0; o < a; o++) {
      const c = o * 3;
      s[c] = 1, s[c + 1] = 1, s[c + 2] = 1;
    }
    r.needsUpdate = !0;
  } catch {
  }
}
const By = {
  DrawTHREEGraphVertices: ol,
  DrawTHREEGraphVerticesMutable: Pg,
  DrawTHREEGraphEdgesThick: Dg,
  DrawTHREEGraphEdgesThin: Lg,
  DrawTHREEGraphEdgesThinMutable: Ig,
  DrawThickPathFromNodeIds: Ug,
  AddBoxBasedImaging: fl,
  AddInModularityBasedPointGroups: zg,
  DrawThinEdgesFromEdgeMap: ll,
  DrawThickEdgesFromEdgeMap: cl,
  AddCylinderBasedImaging: Og,
  DrawSimplifiedEdges: dl,
  ChangeTheVertexColours: Bg,
  ResetVertexColors: Hg,
  DrawTHREEBoxBasedVertices: Fg,
  DrawTHREEBoxBasedVerticesMutable: Ng
}, mc = { type: "change" }, Oa = { type: "start" }, ul = { type: "end" }, wr = new Ki(), gc = new dn(), kg = Math.cos(70 * Yf.DEG2RAD), ct = new z(), Rt = 2 * Math.PI, Ke = {
  NONE: -1,
  ROTATE: 0,
  DOLLY: 1,
  PAN: 2,
  TOUCH_ROTATE: 3,
  TOUCH_PAN: 4,
  TOUCH_DOLLY_PAN: 5,
  TOUCH_DOLLY_ROTATE: 6
}, ws = 1e-6;
class Vg extends yg {
  constructor(e, n = null) {
    super(e, n), this.state = Ke.NONE, this.enabled = !0, this.target = new z(), this.cursor = new z(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minTargetRadius = 0, this.maxTargetRadius = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = 0.05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.zoomToCursor = !1, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: xi.ROTATE, MIDDLE: xi.DOLLY, RIGHT: xi.PAN }, this.touches = { ONE: gi.ROTATE, TWO: gi.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this._lastPosition = new z(), this._lastQuaternion = new Un(), this._lastTargetPosition = new z(), this._quat = new Un().setFromUnitVectors(e.up, new z(0, 1, 0)), this._quatInverse = this._quat.clone().invert(), this._spherical = new pc(), this._sphericalDelta = new pc(), this._scale = 1, this._panOffset = new z(), this._rotateStart = new we(), this._rotateEnd = new we(), this._rotateDelta = new we(), this._panStart = new we(), this._panEnd = new we(), this._panDelta = new we(), this._dollyStart = new we(), this._dollyEnd = new we(), this._dollyDelta = new we(), this._dollyDirection = new z(), this._mouse = new we(), this._performCursorZoom = !1, this._pointers = [], this._pointerPositions = {}, this._controlActive = !1, this._onPointerMove = Wg.bind(this), this._onPointerDown = Gg.bind(this), this._onPointerUp = Xg.bind(this), this._onContextMenu = Jg.bind(this), this._onMouseWheel = Yg.bind(this), this._onKeyDown = jg.bind(this), this._onTouchStart = Zg.bind(this), this._onTouchMove = Kg.bind(this), this._onMouseDown = qg.bind(this), this._onMouseMove = $g.bind(this), this._interceptControlDown = Qg.bind(this), this._interceptControlUp = e_.bind(this), this.domElement !== null && this.connect(), this.update();
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
  listenToKeyEvents(e) {
    e.addEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = e;
  }
  stopListenToKeyEvents() {
    this._domElementKeyEvents !== null && (this._domElementKeyEvents.removeEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = null);
  }
  saveState() {
    this.target0.copy(this.target), this.position0.copy(this.object.position), this.zoom0 = this.object.zoom;
  }
  reset() {
    this.target.copy(this.target0), this.object.position.copy(this.position0), this.object.zoom = this.zoom0, this.object.updateProjectionMatrix(), this.dispatchEvent(mc), this.update(), this.state = Ke.NONE;
  }
  update(e = null) {
    const n = this.object.position;
    ct.copy(n).sub(this.target), ct.applyQuaternion(this._quat), this._spherical.setFromVector3(ct), this.autoRotate && this.state === Ke.NONE && this._rotateLeft(this._getAutoRotationAngle(e)), this.enableDamping ? (this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor, this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor) : (this._spherical.theta += this._sphericalDelta.theta, this._spherical.phi += this._sphericalDelta.phi);
    let i = this.minAzimuthAngle, r = this.maxAzimuthAngle;
    isFinite(i) && isFinite(r) && (i < -Math.PI ? i += Rt : i > Math.PI && (i -= Rt), r < -Math.PI ? r += Rt : r > Math.PI && (r -= Rt), i <= r ? this._spherical.theta = Math.max(i, Math.min(r, this._spherical.theta)) : this._spherical.theta = this._spherical.theta > (i + r) / 2 ? Math.max(i, this._spherical.theta) : Math.min(r, this._spherical.theta)), this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi)), this._spherical.makeSafe(), this.enableDamping === !0 ? this.target.addScaledVector(this._panOffset, this.dampingFactor) : this.target.add(this._panOffset), this.target.sub(this.cursor), this.target.clampLength(this.minTargetRadius, this.maxTargetRadius), this.target.add(this.cursor);
    let s = !1;
    if (this.zoomToCursor && this._performCursorZoom || this.object.isOrthographicCamera)
      this._spherical.radius = this._clampDistance(this._spherical.radius);
    else {
      const a = this._spherical.radius;
      this._spherical.radius = this._clampDistance(this._spherical.radius * this._scale), s = a != this._spherical.radius;
    }
    if (ct.setFromSpherical(this._spherical), ct.applyQuaternion(this._quatInverse), n.copy(this.target).add(ct), this.object.lookAt(this.target), this.enableDamping === !0 ? (this._sphericalDelta.theta *= 1 - this.dampingFactor, this._sphericalDelta.phi *= 1 - this.dampingFactor, this._panOffset.multiplyScalar(1 - this.dampingFactor)) : (this._sphericalDelta.set(0, 0, 0), this._panOffset.set(0, 0, 0)), this.zoomToCursor && this._performCursorZoom) {
      let a = null;
      if (this.object.isPerspectiveCamera) {
        const o = ct.length();
        a = this._clampDistance(o * this._scale);
        const c = o - a;
        this.object.position.addScaledVector(this._dollyDirection, c), this.object.updateMatrixWorld(), s = !!c;
      } else if (this.object.isOrthographicCamera) {
        const o = new z(this._mouse.x, this._mouse.y, 0);
        o.unproject(this.object);
        const c = this.object.zoom;
        this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), this.object.updateProjectionMatrix(), s = c !== this.object.zoom;
        const l = new z(this._mouse.x, this._mouse.y, 0);
        l.unproject(this.object), this.object.position.sub(l).add(o), this.object.updateMatrixWorld(), a = ct.length();
      } else
        console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), this.zoomToCursor = !1;
      a !== null && (this.screenSpacePanning ? this.target.set(0, 0, -1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position) : (wr.origin.copy(this.object.position), wr.direction.set(0, 0, -1).transformDirection(this.object.matrix), Math.abs(this.object.up.dot(wr.direction)) < kg ? this.object.lookAt(this.target) : (gc.setFromNormalAndCoplanarPoint(this.object.up, this.target), wr.intersectPlane(gc, this.target))));
    } else if (this.object.isOrthographicCamera) {
      const a = this.object.zoom;
      this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), a !== this.object.zoom && (this.object.updateProjectionMatrix(), s = !0);
    }
    return this._scale = 1, this._performCursorZoom = !1, s || this._lastPosition.distanceToSquared(this.object.position) > ws || 8 * (1 - this._lastQuaternion.dot(this.object.quaternion)) > ws || this._lastTargetPosition.distanceToSquared(this.target) > ws ? (this.dispatchEvent(mc), this._lastPosition.copy(this.object.position), this._lastQuaternion.copy(this.object.quaternion), this._lastTargetPosition.copy(this.target), !0) : !1;
  }
  _getAutoRotationAngle(e) {
    return e !== null ? Rt / 60 * this.autoRotateSpeed * e : Rt / 60 / 60 * this.autoRotateSpeed;
  }
  _getZoomScale(e) {
    const n = Math.abs(e * 0.01);
    return Math.pow(0.95, this.zoomSpeed * n);
  }
  _rotateLeft(e) {
    this._sphericalDelta.theta -= e;
  }
  _rotateUp(e) {
    this._sphericalDelta.phi -= e;
  }
  _panLeft(e, n) {
    ct.setFromMatrixColumn(n, 0), ct.multiplyScalar(-e), this._panOffset.add(ct);
  }
  _panUp(e, n) {
    this.screenSpacePanning === !0 ? ct.setFromMatrixColumn(n, 1) : (ct.setFromMatrixColumn(n, 0), ct.crossVectors(this.object.up, ct)), ct.multiplyScalar(e), this._panOffset.add(ct);
  }
  // deltaX and deltaY are in pixels; right and down are positive
  _pan(e, n) {
    const i = this.domElement;
    if (this.object.isPerspectiveCamera) {
      const r = this.object.position;
      ct.copy(r).sub(this.target);
      let s = ct.length();
      s *= Math.tan(this.object.fov / 2 * Math.PI / 180), this._panLeft(2 * e * s / i.clientHeight, this.object.matrix), this._panUp(2 * n * s / i.clientHeight, this.object.matrix);
    } else this.object.isOrthographicCamera ? (this._panLeft(e * (this.object.right - this.object.left) / this.object.zoom / i.clientWidth, this.object.matrix), this._panUp(n * (this.object.top - this.object.bottom) / this.object.zoom / i.clientHeight, this.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), this.enablePan = !1);
  }
  _dollyOut(e) {
    this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale /= e : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = !1);
  }
  _dollyIn(e) {
    this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale *= e : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = !1);
  }
  _updateZoomParameters(e, n) {
    if (!this.zoomToCursor)
      return;
    this._performCursorZoom = !0;
    const i = this.domElement.getBoundingClientRect(), r = e - i.left, s = n - i.top, a = i.width, o = i.height;
    this._mouse.x = r / a * 2 - 1, this._mouse.y = -(s / o) * 2 + 1, this._dollyDirection.set(this._mouse.x, this._mouse.y, 1).unproject(this.object).sub(this.object.position).normalize();
  }
  _clampDistance(e) {
    return Math.max(this.minDistance, Math.min(this.maxDistance, e));
  }
  //
  // event callbacks - update the object state
  //
  _handleMouseDownRotate(e) {
    this._rotateStart.set(e.clientX, e.clientY);
  }
  _handleMouseDownDolly(e) {
    this._updateZoomParameters(e.clientX, e.clientX), this._dollyStart.set(e.clientX, e.clientY);
  }
  _handleMouseDownPan(e) {
    this._panStart.set(e.clientX, e.clientY);
  }
  _handleMouseMoveRotate(e) {
    this._rotateEnd.set(e.clientX, e.clientY), this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const n = this.domElement;
    this._rotateLeft(Rt * this._rotateDelta.x / n.clientHeight), this._rotateUp(Rt * this._rotateDelta.y / n.clientHeight), this._rotateStart.copy(this._rotateEnd), this.update();
  }
  _handleMouseMoveDolly(e) {
    this._dollyEnd.set(e.clientX, e.clientY), this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart), this._dollyDelta.y > 0 ? this._dollyOut(this._getZoomScale(this._dollyDelta.y)) : this._dollyDelta.y < 0 && this._dollyIn(this._getZoomScale(this._dollyDelta.y)), this._dollyStart.copy(this._dollyEnd), this.update();
  }
  _handleMouseMovePan(e) {
    this._panEnd.set(e.clientX, e.clientY), this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd), this.update();
  }
  _handleMouseWheel(e) {
    this._updateZoomParameters(e.clientX, e.clientY), e.deltaY < 0 ? this._dollyIn(this._getZoomScale(e.deltaY)) : e.deltaY > 0 && this._dollyOut(this._getZoomScale(e.deltaY)), this.update();
  }
  _handleKeyDown(e) {
    let n = !1;
    switch (e.code) {
      case this.keys.UP:
        e.ctrlKey || e.metaKey || e.shiftKey ? this._rotateUp(Rt * this.rotateSpeed / this.domElement.clientHeight) : this._pan(0, this.keyPanSpeed), n = !0;
        break;
      case this.keys.BOTTOM:
        e.ctrlKey || e.metaKey || e.shiftKey ? this._rotateUp(-Rt * this.rotateSpeed / this.domElement.clientHeight) : this._pan(0, -this.keyPanSpeed), n = !0;
        break;
      case this.keys.LEFT:
        e.ctrlKey || e.metaKey || e.shiftKey ? this._rotateLeft(Rt * this.rotateSpeed / this.domElement.clientHeight) : this._pan(this.keyPanSpeed, 0), n = !0;
        break;
      case this.keys.RIGHT:
        e.ctrlKey || e.metaKey || e.shiftKey ? this._rotateLeft(-Rt * this.rotateSpeed / this.domElement.clientHeight) : this._pan(-this.keyPanSpeed, 0), n = !0;
        break;
    }
    n && (e.preventDefault(), this.update());
  }
  _handleTouchStartRotate(e) {
    if (this._pointers.length === 1)
      this._rotateStart.set(e.pageX, e.pageY);
    else {
      const n = this._getSecondPointerPosition(e), i = 0.5 * (e.pageX + n.x), r = 0.5 * (e.pageY + n.y);
      this._rotateStart.set(i, r);
    }
  }
  _handleTouchStartPan(e) {
    if (this._pointers.length === 1)
      this._panStart.set(e.pageX, e.pageY);
    else {
      const n = this._getSecondPointerPosition(e), i = 0.5 * (e.pageX + n.x), r = 0.5 * (e.pageY + n.y);
      this._panStart.set(i, r);
    }
  }
  _handleTouchStartDolly(e) {
    const n = this._getSecondPointerPosition(e), i = e.pageX - n.x, r = e.pageY - n.y, s = Math.sqrt(i * i + r * r);
    this._dollyStart.set(0, s);
  }
  _handleTouchStartDollyPan(e) {
    this.enableZoom && this._handleTouchStartDolly(e), this.enablePan && this._handleTouchStartPan(e);
  }
  _handleTouchStartDollyRotate(e) {
    this.enableZoom && this._handleTouchStartDolly(e), this.enableRotate && this._handleTouchStartRotate(e);
  }
  _handleTouchMoveRotate(e) {
    if (this._pointers.length == 1)
      this._rotateEnd.set(e.pageX, e.pageY);
    else {
      const i = this._getSecondPointerPosition(e), r = 0.5 * (e.pageX + i.x), s = 0.5 * (e.pageY + i.y);
      this._rotateEnd.set(r, s);
    }
    this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const n = this.domElement;
    this._rotateLeft(Rt * this._rotateDelta.x / n.clientHeight), this._rotateUp(Rt * this._rotateDelta.y / n.clientHeight), this._rotateStart.copy(this._rotateEnd);
  }
  _handleTouchMovePan(e) {
    if (this._pointers.length === 1)
      this._panEnd.set(e.pageX, e.pageY);
    else {
      const n = this._getSecondPointerPosition(e), i = 0.5 * (e.pageX + n.x), r = 0.5 * (e.pageY + n.y);
      this._panEnd.set(i, r);
    }
    this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd);
  }
  _handleTouchMoveDolly(e) {
    const n = this._getSecondPointerPosition(e), i = e.pageX - n.x, r = e.pageY - n.y, s = Math.sqrt(i * i + r * r);
    this._dollyEnd.set(0, s), this._dollyDelta.set(0, Math.pow(this._dollyEnd.y / this._dollyStart.y, this.zoomSpeed)), this._dollyOut(this._dollyDelta.y), this._dollyStart.copy(this._dollyEnd);
    const a = (e.pageX + n.x) * 0.5, o = (e.pageY + n.y) * 0.5;
    this._updateZoomParameters(a, o);
  }
  _handleTouchMoveDollyPan(e) {
    this.enableZoom && this._handleTouchMoveDolly(e), this.enablePan && this._handleTouchMovePan(e);
  }
  _handleTouchMoveDollyRotate(e) {
    this.enableZoom && this._handleTouchMoveDolly(e), this.enableRotate && this._handleTouchMoveRotate(e);
  }
  // pointers
  _addPointer(e) {
    this._pointers.push(e.pointerId);
  }
  _removePointer(e) {
    delete this._pointerPositions[e.pointerId];
    for (let n = 0; n < this._pointers.length; n++)
      if (this._pointers[n] == e.pointerId) {
        this._pointers.splice(n, 1);
        return;
      }
  }
  _isTrackingPointer(e) {
    for (let n = 0; n < this._pointers.length; n++)
      if (this._pointers[n] == e.pointerId) return !0;
    return !1;
  }
  _trackPointer(e) {
    let n = this._pointerPositions[e.pointerId];
    n === void 0 && (n = new we(), this._pointerPositions[e.pointerId] = n), n.set(e.pageX, e.pageY);
  }
  _getSecondPointerPosition(e) {
    const n = e.pointerId === this._pointers[0] ? this._pointers[1] : this._pointers[0];
    return this._pointerPositions[n];
  }
  //
  _customWheelEvent(e) {
    const n = e.deltaMode, i = {
      clientX: e.clientX,
      clientY: e.clientY,
      deltaY: e.deltaY
    };
    switch (n) {
      case 1:
        i.deltaY *= 16;
        break;
      case 2:
        i.deltaY *= 100;
        break;
    }
    return e.ctrlKey && !this._controlActive && (i.deltaY *= 10), i;
  }
}
function Gg(t) {
  this.enabled !== !1 && (this._pointers.length === 0 && (this.domElement.setPointerCapture(t.pointerId), this.domElement.addEventListener("pointermove", this._onPointerMove), this.domElement.addEventListener("pointerup", this._onPointerUp)), !this._isTrackingPointer(t) && (this._addPointer(t), t.pointerType === "touch" ? this._onTouchStart(t) : this._onMouseDown(t)));
}
function Wg(t) {
  this.enabled !== !1 && (t.pointerType === "touch" ? this._onTouchMove(t) : this._onMouseMove(t));
}
function Xg(t) {
  switch (this._removePointer(t), this._pointers.length) {
    case 0:
      this.domElement.releasePointerCapture(t.pointerId), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.dispatchEvent(ul), this.state = Ke.NONE;
      break;
    case 1:
      const e = this._pointers[0], n = this._pointerPositions[e];
      this._onTouchStart({ pointerId: e, pageX: n.x, pageY: n.y });
      break;
  }
}
function qg(t) {
  let e;
  switch (t.button) {
    case 0:
      e = this.mouseButtons.LEFT;
      break;
    case 1:
      e = this.mouseButtons.MIDDLE;
      break;
    case 2:
      e = this.mouseButtons.RIGHT;
      break;
    default:
      e = -1;
  }
  switch (e) {
    case xi.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseDownDolly(t), this.state = Ke.DOLLY;
      break;
    case xi.ROTATE:
      if (t.ctrlKey || t.metaKey || t.shiftKey) {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(t), this.state = Ke.PAN;
      } else {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(t), this.state = Ke.ROTATE;
      }
      break;
    case xi.PAN:
      if (t.ctrlKey || t.metaKey || t.shiftKey) {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(t), this.state = Ke.ROTATE;
      } else {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(t), this.state = Ke.PAN;
      }
      break;
    default:
      this.state = Ke.NONE;
  }
  this.state !== Ke.NONE && this.dispatchEvent(Oa);
}
function $g(t) {
  switch (this.state) {
    case Ke.ROTATE:
      if (this.enableRotate === !1) return;
      this._handleMouseMoveRotate(t);
      break;
    case Ke.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseMoveDolly(t);
      break;
    case Ke.PAN:
      if (this.enablePan === !1) return;
      this._handleMouseMovePan(t);
      break;
  }
}
function Yg(t) {
  this.enabled === !1 || this.enableZoom === !1 || this.state !== Ke.NONE || (t.preventDefault(), this.dispatchEvent(Oa), this._handleMouseWheel(this._customWheelEvent(t)), this.dispatchEvent(ul));
}
function jg(t) {
  this.enabled === !1 || this.enablePan === !1 || this._handleKeyDown(t);
}
function Zg(t) {
  switch (this._trackPointer(t), this._pointers.length) {
    case 1:
      switch (this.touches.ONE) {
        case gi.ROTATE:
          if (this.enableRotate === !1) return;
          this._handleTouchStartRotate(t), this.state = Ke.TOUCH_ROTATE;
          break;
        case gi.PAN:
          if (this.enablePan === !1) return;
          this._handleTouchStartPan(t), this.state = Ke.TOUCH_PAN;
          break;
        default:
          this.state = Ke.NONE;
      }
      break;
    case 2:
      switch (this.touches.TWO) {
        case gi.DOLLY_PAN:
          if (this.enableZoom === !1 && this.enablePan === !1) return;
          this._handleTouchStartDollyPan(t), this.state = Ke.TOUCH_DOLLY_PAN;
          break;
        case gi.DOLLY_ROTATE:
          if (this.enableZoom === !1 && this.enableRotate === !1) return;
          this._handleTouchStartDollyRotate(t), this.state = Ke.TOUCH_DOLLY_ROTATE;
          break;
        default:
          this.state = Ke.NONE;
      }
      break;
    default:
      this.state = Ke.NONE;
  }
  this.state !== Ke.NONE && this.dispatchEvent(Oa);
}
function Kg(t) {
  switch (this._trackPointer(t), this.state) {
    case Ke.TOUCH_ROTATE:
      if (this.enableRotate === !1) return;
      this._handleTouchMoveRotate(t), this.update();
      break;
    case Ke.TOUCH_PAN:
      if (this.enablePan === !1) return;
      this._handleTouchMovePan(t), this.update();
      break;
    case Ke.TOUCH_DOLLY_PAN:
      if (this.enableZoom === !1 && this.enablePan === !1) return;
      this._handleTouchMoveDollyPan(t), this.update();
      break;
    case Ke.TOUCH_DOLLY_ROTATE:
      if (this.enableZoom === !1 && this.enableRotate === !1) return;
      this._handleTouchMoveDollyRotate(t), this.update();
      break;
    default:
      this.state = Ke.NONE;
  }
}
function Jg(t) {
  this.enabled !== !1 && t.preventDefault();
}
function Qg(t) {
  t.key === "Control" && (this._controlActive = !0, this.domElement.getRootNode().addEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
function e_(t) {
  t.key === "Control" && (this._controlActive = !1, this.domElement.getRootNode().removeEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
function t_(t) {
  var n;
  const e = t.object;
  if (e instanceof Ua) {
    const i = e.geometry, r = (n = i == null ? void 0 : i.attributes) == null ? void 0 : n.label;
    return r && t.index != null ? r.array[t.index] ?? null : null;
  }
  if (e instanceof La && t.instanceId != null) {
    const i = e.userData.nodeIds;
    return i && t.instanceId < i.length ? i[t.instanceId] : null;
  }
  return null;
}
function n_(t) {
  const { edgeId: e, segmentEdgeIds: n } = t.object.userData;
  return n && t.index != null ? n[Math.floor(t.index / 2)] ?? null : e ?? null;
}
function _c(t, e) {
  var i, r;
  const n = t.nodes.get(e);
  return {
    nodeId: e,
    data: (n == null ? void 0 : n.data) ?? {},
    neighbours: ((i = n == null ? void 0 : n.neighbours) == null ? void 0 : i.slice()) ?? [],
    position: ((r = n == null ? void 0 : n.data) == null ? void 0 : r.pos) ?? void 0
  };
}
function vc(t, e) {
  const n = t.edges.get(e);
  return n ? {
    edgeId: e,
    start: n.start,
    end: n.end,
    data: n.data ?? {}
  } : null;
}
const Rr = new z(), xc = new dn(), Mc = new z();
class i_ {
  constructor(e, n, i, r, s) {
    this.lastHoverNodeId = null, this.lastHoverEdgeId = null, this.dragNodeId = null, this.wasDragging = !1, this.scene = e, this.camera = n, this.domElement = i, this.graph = r, this.options = s, this.raycaster = new Mg(), this.mouse = new we(), this.hoverEnabled = s.hoverEnabled !== !1, this.controls = s.controls, this.raycaster.params.Line = { threshold: 5 }, this.raycaster.params.Points = { threshold: 10 }, this.boundOnClick = this.onClick.bind(this), this.boundOnPointerMove = this.onPointerMove.bind(this), this.boundOnPointerDown = this.onPointerDown.bind(this), this.boundOnPointerUp = this.onPointerUp.bind(this);
    const a = !!(s.enableNodeDrag && s.onNodeDrag);
    i.addEventListener("click", this.boundOnClick), (this.hoverEnabled || a) && i.addEventListener("pointermove", this.boundOnPointerMove), a && (i.addEventListener("pointerdown", this.boundOnPointerDown), i.addEventListener("pointerup", this.boundOnPointerUp), i.addEventListener("pointerleave", this.boundOnPointerUp));
  }
  dispose() {
    this.domElement.removeEventListener("click", this.boundOnClick), this.domElement.removeEventListener("pointermove", this.boundOnPointerMove), this.domElement.removeEventListener("pointerdown", this.boundOnPointerDown), this.domElement.removeEventListener("pointerup", this.boundOnPointerUp), this.domElement.removeEventListener("pointerleave", this.boundOnPointerUp);
  }
  getMouseNDC(e) {
    const n = this.domElement;
    if (e.target === n)
      this.mouse.x = e.offsetX / n.offsetWidth * 2 - 1, this.mouse.y = -(e.offsetY / n.offsetHeight) * 2 + 1;
    else {
      const r = n.getBoundingClientRect();
      this.mouse.x = (e.clientX - r.left) / r.width * 2 - 1, this.mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    }
  }
  pick() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const e = this.raycaster.intersectObject(this.scene, !0);
    let n = null, i = null, r = 1 / 0, s = 1 / 0;
    for (const a of e) {
      const o = t_(a), c = n_(a);
      o != null && a.distance < r && (n = o, r = a.distance), c != null && a.distance < s && (i = c, s = a.distance);
    }
    return n != null && i != null && r <= s ? i = null : n != null && i != null && (n = null), { nodeId: n, edgeId: i };
  }
  onClick(e) {
    if (this.wasDragging) {
      this.wasDragging = !1;
      return;
    }
    this.getMouseNDC(e);
    const { nodeId: n, edgeId: i } = this.pick();
    if (n != null && this.options.onNodeClick && this.options.onNodeClick(_c(this.graph, n)), i != null && this.options.onEdgeClick) {
      const r = vc(this.graph, i);
      r && this.options.onEdgeClick(r);
    }
  }
  onPointerDown(e) {
    if (this.wasDragging = !1, e.button !== 0) return;
    this.getMouseNDC(e);
    const { nodeId: n } = this.pick();
    n != null && this.options.enableNodeDrag && this.options.onNodeDrag && (this.dragNodeId = n, this.controls && (this.controls.enabled = !1));
  }
  onPointerUp(e) {
    this.dragNodeId != null && (this.wasDragging = !0, this.dragNodeId = null, this.controls && (this.controls.enabled = !0));
  }
  getDragPosition(e) {
    var i, r;
    const n = (r = (i = this.graph.nodes.get(e)) == null ? void 0 : i.data) == null ? void 0 : r.pos;
    return n ? (Mc.set(0, 0, -1).applyQuaternion(this.camera.quaternion), xc.setFromNormalAndCoplanarPoint(Mc, new z(n.x, n.y, n.z)), this.raycaster.setFromCamera(this.mouse, this.camera), this.raycaster.ray.intersectPlane(xc, Rr) ? { x: Rr.x, y: Rr.y, z: Rr.z } : null) : null;
  }
  onPointerMove(e) {
    if (this.getMouseNDC(e), this.dragNodeId != null && this.options.onNodeDrag) {
      const r = this.getDragPosition(this.dragNodeId);
      r && this.options.onNodeDrag(this.dragNodeId, r);
      return;
    }
    if (!this.hoverEnabled) return;
    const { nodeId: n, edgeId: i } = this.pick();
    this.fireHoverCallbacks(n, i);
  }
  fireHoverCallbacks(e, n) {
    if (this.options.onNodeHover && (e != null ? e !== this.lastHoverNodeId && (this.lastHoverNodeId = e, this.options.onNodeHover(_c(this.graph, e))) : this.lastHoverNodeId != null && (this.lastHoverNodeId = null, this.options.onNodeHover(null))), this.options.onEdgeHover)
      if (n != null) {
        if (n !== this.lastHoverEdgeId) {
          this.lastHoverEdgeId = n;
          const i = vc(this.graph, n);
          i && this.options.onEdgeHover(i);
        }
      } else
        this.lastHoverEdgeId != null && (this.lastHoverEdgeId = null, this.options.onEdgeHover(null));
  }
}
class r_ {
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
  constructor(e) {
    this.canvas = e.canvas, this.width = e.width, this.height = e.height, this.geometryMap = /* @__PURE__ */ new Map(), this.materialMap = /* @__PURE__ */ new Map(), this.meshMap = /* @__PURE__ */ new Map(), this.controls, this.renderer, this.camera, this.scene, this.graphs = /* @__PURE__ */ new Map(), e.graph && this.graphs.set(0, e.graph);
  }
  /**
   * This essentially initializes the drawing element based on the settings
   * Remember to do this since if if its not done the scene will not render
   */
  async init() {
    const e = performance.now();
    this.camera = new Ht(), this.scene = new cg(), this.renderer = new og({
      canvas: this.canvas,
      antialias: !0
    }), this.renderer.setSize(this.width, this.height), this.renderer.setClearColor(16711935, 0), this.camera.aspect = this.width / this.height, this.camera.updateProjectionMatrix(), this.scene.add(new xg(16777215));
    const n = new vg(16777215, 1);
    n.position.set(0, 10, 0), this.scene.add(n), this.controls = new Vg(this.camera, this.renderer.domElement), this.camera.position.set(0, 100, 100), this.controls.autoRotate = !0, this.controls.maxPolarAngle = Math.PI * 0.5, this.controls.maxDistance = 1e4, this.controls.minDistance = 10, this.controls.update();
    const i = performance.now();
    console.log("initialization has finished"), console.log(`Time to initialize ${i - e} milliseconds`);
  }
  //add graph
  // this adds a graph to the current visualizer
  /**
   * 
   * This is the main way to add elements to the viewer window that gets initialized
   * 
   * @param element A geometry element (THREE.Group, Line, or Points) to add to the scene
   */
  addVisElement(e) {
    this.scene.add(e);
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
  enableInteraction(e) {
    this.disableInteraction();
    const n = { ...e, controls: e.controls ?? this.controls };
    this.interactionLayer = new i_(
      this.scene,
      this.camera,
      this.renderer.domElement,
      e.graph,
      n
    );
  }
  /**
   * Disable interaction and remove event listeners.
   */
  disableInteraction() {
    this.interactionLayer && (this.interactionLayer.dispose(), this.interactionLayer = void 0);
  }
}
const Hy = {
  GraphDrawer3d: r_
};
async function s_(t, e) {
  Pn(t, "n"), lt(e, "p", 0, 1);
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let r;
  for (let c = 0; c < t; c++)
    r = new Nn({}), n.set(c, r);
  let s, a, o = 0;
  for (let c = 0; c < t; c++)
    for (let l = c + 1; l < t; l++)
      s = Math.random(), e > s && (a = new _n(c, l, {}), i.set(o, a), o += 1);
  return nn.create(n, i);
}
const ky = { GenerateErdosReyni_n_p: s_ };
function a_(t, e) {
  const n = t.x - e.x, i = t.y - e.y, r = t.z - e.z;
  return n * n + i * i + r * r;
}
function pl(t) {
  return ["x", "y", "z"][t % 3];
}
function va(t, e) {
  if (t.length === 0) return null;
  if (t.length === 1) return { item: t[0] };
  const n = pl(e), i = [...t].sort((c, l) => c.point[n] - l.point[n]), r = Math.floor(i.length / 2), s = i[r], a = va(i.slice(0, r), e + 1), o = r + 1 < i.length ? va(i.slice(r + 1), e + 1) : null;
  return { left: a, right: o ?? void 0, item: s };
}
function Wi(t, e, n, i, r) {
  const s = pl(i);
  a_(e, t.item.point) <= n && r.push(t.item.nodeId);
  const o = e[s] - t.item.point[s], c = o * o;
  o <= 0 ? (t.left && Wi(t.left, e, n, i + 1, r), t.right && c <= n && Wi(t.right, e, n, i + 1, r)) : (t.right && Wi(t.right, e, n, i + 1, r), t.left && c <= n && Wi(t.left, e, n, i + 1, r));
}
function o_(t, e) {
  lt(e, "radius", 0);
  for (const { point: s } of t)
    lt(s.x, "point.x"), lt(s.y, "point.y"), lt(s.z, "point.z");
  const n = va(t, 0), i = e * e, r = /* @__PURE__ */ new Map();
  for (const { point: s, nodeId: a } of t) {
    const o = [];
    Wi(n, s, i, 0, o), r.set(a, o);
  }
  return r;
}
class c_ {
  constructor() {
    this.parent = /* @__PURE__ */ new Map(), this.size = /* @__PURE__ */ new Map();
  }
  // Iterative with path compression: recursion overflowed the stack on long chains.
  find(e) {
    if (!this.parent.has(e))
      return this.parent.set(e, e), this.size.set(e, 1), e;
    let n = e;
    for (; this.parent.get(n) !== n; ) n = this.parent.get(n);
    for (; e !== n; ) {
      const i = this.parent.get(e);
      this.parent.set(e, n), e = i;
    }
    return n;
  }
  // Union by size keeps trees shallow.
  union(e, n) {
    let i = this.find(e), r = this.find(n);
    i !== r && (this.size.get(i) > this.size.get(r) && ([i, r] = [r, i]), this.parent.set(i, r), this.size.set(r, this.size.get(i) + this.size.get(r)));
  }
}
function l_() {
  return {
    cluster(t, e) {
      const { distanceThreshold: n } = e, i = t.get_position_map(), r = [];
      for (const [u, g] of i)
        r.push({ point: g, nodeId: u });
      if (r.length === 0)
        return { nodeToCluster: /* @__PURE__ */ new Map(), clusterCentroids: /* @__PURE__ */ new Map(), clusterIds: [] };
      const s = o_(r, n), a = new c_();
      for (const [u, g] of s)
        for (const _ of g)
          a.union(u, _);
      const o = /* @__PURE__ */ new Map();
      let c = 0;
      const l = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
      for (const { nodeId: u } of r) {
        const g = a.find(u);
        o.has(g) || o.set(g, c++);
        const _ = o.get(g);
        l.set(u, _), h.has(_) || h.set(_, []), h.get(_).push(u);
      }
      const f = /* @__PURE__ */ new Map();
      for (const [u, g] of h) {
        const _ = g.map((p) => i.get(p));
        f.set(u, Yi.centroid(_));
      }
      const d = [...h.keys()];
      return { nodeToCluster: l, clusterCentroids: f, clusterIds: d };
    }
  };
}
async function ml(t, e) {
  const { nodeToCluster: n, clusterCentroids: i, clusterIds: r } = e, s = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
  for (const f of r) {
    const d = i.get(f), u = new Nn({ pos: d });
    s.set(f, u);
  }
  const o = /* @__PURE__ */ new Map(), c = (f, d) => f <= d ? `${f},${d}` : `${d},${f}`;
  for (const [, f] of t.edges) {
    const d = n.get(f.start), u = n.get(f.end);
    if (d === void 0 || u === void 0 || d === u) continue;
    const g = c(d, u);
    o.set(g, (o.get(g) ?? 0) + 1);
  }
  let l = 0;
  for (const [f, d] of o) {
    const [u, g] = f.split(",").map(Number);
    a.set(l++, new _n(u, g, { count: d }));
  }
  const h = new nn(s, a);
  return await h.initialize(), h;
}
async function h_(t, e) {
  const i = l_().cluster(t, e);
  return ml(t, i);
}
async function f_(t, e, n) {
  const i = e.cluster(t, n);
  return ml(t, i);
}
const Vy = {
  clusterByDistance: h_,
  clusterByStrategy: f_
};
function Gy(t, e, n, i) {
  if (Pn(e, "n"), t.length !== e * e || n.length !== e || i.length !== e)
    throw new RangeError("matrix/vector dimensions must match n");
  for (let r = 0; r < e; r++) {
    let s = 0;
    for (let a = 0; a < e; a++) s += t[r * e + a] * n[a];
    i[r] = s;
  }
}
function Wy(t) {
  for (const i of t) lt(i, "vector coordinate");
  let e = 0;
  for (let i = 0; i < t.length; i++) e += t[i] * t[i];
  const n = Math.sqrt(e);
  if (n > 0) for (let i = 0; i < t.length; i++) t[i] /= n;
}
var me = 1e-6, Ne = typeof Float32Array < "u" ? Float32Array : Array, Yt = Math.random, gl = "zyx";
function en(t) {
  return t >= 0 ? Math.round(t) : t % 0.5 === 0 ? Math.floor(t) : Math.round(t);
}
function d_(t) {
  Ne = t;
}
var u_ = Math.PI / 180, p_ = 180 / Math.PI;
function m_(t) {
  return t * u_;
}
function g_(t) {
  return t * p_;
}
function __(t, e) {
  var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : me;
  return Math.abs(t - e) <= n * Math.max(1, Math.abs(t), Math.abs(e));
}
const v_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ANGLE_ORDER: gl,
  get ARRAY_TYPE() {
    return Ne;
  },
  EPSILON: me,
  RANDOM: Yt,
  equals: __,
  round: en,
  setMatrixArrayType: d_,
  toDegree: g_,
  toRadian: m_
}, Symbol.toStringTag, { value: "Module" }));
function x_() {
  var t = new Ne(4);
  return Ne != Float32Array && (t[1] = 0, t[2] = 0), t[0] = 1, t[3] = 1, t;
}
function M_(t) {
  var e = new Ne(4);
  return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e;
}
function y_(t, e) {
  return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t;
}
function S_(t) {
  return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t;
}
function E_(t, e, n, i) {
  var r = new Ne(4);
  return r[0] = t, r[1] = e, r[2] = n, r[3] = i, r;
}
function T_(t, e, n, i, r) {
  return t[0] = e, t[1] = n, t[2] = i, t[3] = r, t;
}
function b_(t, e) {
  if (t === e) {
    var n = e[1];
    t[1] = e[2], t[2] = n;
  } else
    t[0] = e[0], t[1] = e[2], t[2] = e[1], t[3] = e[3];
  return t;
}
function A_(t, e) {
  var n = e[0], i = e[1], r = e[2], s = e[3], a = n * s - r * i;
  return a ? (a = 1 / a, t[0] = s * a, t[1] = -i * a, t[2] = -r * a, t[3] = n * a, t) : null;
}
function w_(t, e) {
  var n = e[0];
  return t[0] = e[3], t[1] = -e[1], t[2] = -e[2], t[3] = n, t;
}
function R_(t) {
  return t[0] * t[3] - t[2] * t[1];
}
function _l(t, e, n) {
  var i = e[0], r = e[1], s = e[2], a = e[3], o = n[0], c = n[1], l = n[2], h = n[3];
  return t[0] = i * o + s * c, t[1] = r * o + a * c, t[2] = i * l + s * h, t[3] = r * l + a * h, t;
}
function C_(t, e, n) {
  var i = e[0], r = e[1], s = e[2], a = e[3], o = Math.sin(n), c = Math.cos(n);
  return t[0] = i * c + s * o, t[1] = r * c + a * o, t[2] = i * -o + s * c, t[3] = r * -o + a * c, t;
}
function P_(t, e, n) {
  var i = e[0], r = e[1], s = e[2], a = e[3], o = n[0], c = n[1];
  return t[0] = i * o, t[1] = r * o, t[2] = s * c, t[3] = a * c, t;
}
function D_(t, e) {
  var n = Math.sin(e), i = Math.cos(e);
  return t[0] = i, t[1] = n, t[2] = -n, t[3] = i, t;
}
function L_(t, e) {
  return t[0] = e[0], t[1] = 0, t[2] = 0, t[3] = e[1], t;
}
function I_(t) {
  return "mat2(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")";
}
function U_(t) {
  return Math.sqrt(t[0] * t[0] + t[1] * t[1] + t[2] * t[2] + t[3] * t[3]);
}
function N_(t, e, n, i) {
  return t[2] = i[2] / i[0], n[0] = i[0], n[1] = i[1], n[3] = i[3] - t[2] * n[1], [t, e, n];
}
function F_(t, e, n) {
  return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t[3] = e[3] + n[3], t;
}
function vl(t, e, n) {
  return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t[2] = e[2] - n[2], t[3] = e[3] - n[3], t;
}
function O_(t, e) {
  return t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3];
}
function z_(t, e) {
  var n = t[0], i = t[1], r = t[2], s = t[3], a = e[0], o = e[1], c = e[2], l = e[3];
  return Math.abs(n - a) <= me * Math.max(1, Math.abs(n), Math.abs(a)) && Math.abs(i - o) <= me * Math.max(1, Math.abs(i), Math.abs(o)) && Math.abs(r - c) <= me * Math.max(1, Math.abs(r), Math.abs(c)) && Math.abs(s - l) <= me * Math.max(1, Math.abs(s), Math.abs(l));
}
function B_(t, e, n) {
  return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t[3] = e[3] * n, t;
}
function H_(t, e, n, i) {
  return t[0] = e[0] + n[0] * i, t[1] = e[1] + n[1] * i, t[2] = e[2] + n[2] * i, t[3] = e[3] + n[3] * i, t;
}
var k_ = _l, V_ = vl;
const G_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  LDU: N_,
  add: F_,
  adjoint: w_,
  clone: M_,
  copy: y_,
  create: x_,
  determinant: R_,
  equals: z_,
  exactEquals: O_,
  frob: U_,
  fromRotation: D_,
  fromScaling: L_,
  fromValues: E_,
  identity: S_,
  invert: A_,
  mul: k_,
  multiply: _l,
  multiplyScalar: B_,
  multiplyScalarAndAdd: H_,
  rotate: C_,
  scale: P_,
  set: T_,
  str: I_,
  sub: V_,
  subtract: vl,
  transpose: b_
}, Symbol.toStringTag, { value: "Module" }));
function W_() {
  var t = new Ne(6);
  return Ne != Float32Array && (t[1] = 0, t[2] = 0, t[4] = 0, t[5] = 0), t[0] = 1, t[3] = 1, t;
}
function X_(t) {
  var e = new Ne(6);
  return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e;
}
function q_(t, e) {
  return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t;
}
function $_(t) {
  return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, t;
}
function Y_(t, e, n, i, r, s) {
  var a = new Ne(6);
  return a[0] = t, a[1] = e, a[2] = n, a[3] = i, a[4] = r, a[5] = s, a;
}
function j_(t, e, n, i, r, s, a) {
  return t[0] = e, t[1] = n, t[2] = i, t[3] = r, t[4] = s, t[5] = a, t;
}
function Z_(t, e) {
  var n = e[0], i = e[1], r = e[2], s = e[3], a = e[4], o = e[5], c = n * s - i * r;
  return c ? (c = 1 / c, t[0] = s * c, t[1] = -i * c, t[2] = -r * c, t[3] = n * c, t[4] = (r * o - s * a) * c, t[5] = (i * a - n * o) * c, t) : null;
}
function K_(t) {
  return t[0] * t[3] - t[1] * t[2];
}
function xl(t, e, n) {
  var i = e[0], r = e[1], s = e[2], a = e[3], o = e[4], c = e[5], l = n[0], h = n[1], f = n[2], d = n[3], u = n[4], g = n[5];
  return t[0] = i * l + s * h, t[1] = r * l + a * h, t[2] = i * f + s * d, t[3] = r * f + a * d, t[4] = i * u + s * g + o, t[5] = r * u + a * g + c, t;
}
function J_(t, e, n) {
  var i = e[0], r = e[1], s = e[2], a = e[3], o = e[4], c = e[5], l = Math.sin(n), h = Math.cos(n);
  return t[0] = i * h + s * l, t[1] = r * h + a * l, t[2] = i * -l + s * h, t[3] = r * -l + a * h, t[4] = o, t[5] = c, t;
}
function Q_(t, e, n) {
  var i = e[0], r = e[1], s = e[2], a = e[3], o = e[4], c = e[5], l = n[0], h = n[1];
  return t[0] = i * l, t[1] = r * l, t[2] = s * h, t[3] = a * h, t[4] = o, t[5] = c, t;
}
function ev(t, e, n) {
  var i = e[0], r = e[1], s = e[2], a = e[3], o = e[4], c = e[5], l = n[0], h = n[1];
  return t[0] = i, t[1] = r, t[2] = s, t[3] = a, t[4] = i * l + s * h + o, t[5] = r * l + a * h + c, t;
}
function tv(t, e) {
  var n = Math.sin(e), i = Math.cos(e);
  return t[0] = i, t[1] = n, t[2] = -n, t[3] = i, t[4] = 0, t[5] = 0, t;
}
function nv(t, e) {
  return t[0] = e[0], t[1] = 0, t[2] = 0, t[3] = e[1], t[4] = 0, t[5] = 0, t;
}
function iv(t, e) {
  return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = e[0], t[5] = e[1], t;
}
function rv(t) {
  return "mat2d(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ")";
}
function sv(t) {
  return Math.sqrt(t[0] * t[0] + t[1] * t[1] + t[2] * t[2] + t[3] * t[3] + t[4] * t[4] + t[5] * t[5] + 1);
}
function av(t, e, n) {
  return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t[3] = e[3] + n[3], t[4] = e[4] + n[4], t[5] = e[5] + n[5], t;
}
function Ml(t, e, n) {
  return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t[2] = e[2] - n[2], t[3] = e[3] - n[3], t[4] = e[4] - n[4], t[5] = e[5] - n[5], t;
}
function ov(t, e, n) {
  return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t[3] = e[3] * n, t[4] = e[4] * n, t[5] = e[5] * n, t;
}
function cv(t, e, n, i) {
  return t[0] = e[0] + n[0] * i, t[1] = e[1] + n[1] * i, t[2] = e[2] + n[2] * i, t[3] = e[3] + n[3] * i, t[4] = e[4] + n[4] * i, t[5] = e[5] + n[5] * i, t;
}
function lv(t, e) {
  return t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3] && t[4] === e[4] && t[5] === e[5];
}
function hv(t, e) {
  var n = t[0], i = t[1], r = t[2], s = t[3], a = t[4], o = t[5], c = e[0], l = e[1], h = e[2], f = e[3], d = e[4], u = e[5];
  return Math.abs(n - c) <= me * Math.max(1, Math.abs(n), Math.abs(c)) && Math.abs(i - l) <= me * Math.max(1, Math.abs(i), Math.abs(l)) && Math.abs(r - h) <= me * Math.max(1, Math.abs(r), Math.abs(h)) && Math.abs(s - f) <= me * Math.max(1, Math.abs(s), Math.abs(f)) && Math.abs(a - d) <= me * Math.max(1, Math.abs(a), Math.abs(d)) && Math.abs(o - u) <= me * Math.max(1, Math.abs(o), Math.abs(u));
}
var fv = xl, dv = Ml;
const uv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  add: av,
  clone: X_,
  copy: q_,
  create: W_,
  determinant: K_,
  equals: hv,
  exactEquals: lv,
  frob: sv,
  fromRotation: tv,
  fromScaling: nv,
  fromTranslation: iv,
  fromValues: Y_,
  identity: $_,
  invert: Z_,
  mul: fv,
  multiply: xl,
  multiplyScalar: ov,
  multiplyScalarAndAdd: cv,
  rotate: J_,
  scale: Q_,
  set: j_,
  str: rv,
  sub: dv,
  subtract: Ml,
  translate: ev
}, Symbol.toStringTag, { value: "Module" }));
function yl() {
  var t = new Ne(9);
  return Ne != Float32Array && (t[1] = 0, t[2] = 0, t[3] = 0, t[5] = 0, t[6] = 0, t[7] = 0), t[0] = 1, t[4] = 1, t[8] = 1, t;
}
function pv(t, e) {
  return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[4], t[4] = e[5], t[5] = e[6], t[6] = e[8], t[7] = e[9], t[8] = e[10], t;
}
function mv(t) {
  var e = new Ne(9);
  return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], e;
}
function gv(t, e) {
  return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t;
}
function _v(t, e, n, i, r, s, a, o, c) {
  var l = new Ne(9);
  return l[0] = t, l[1] = e, l[2] = n, l[3] = i, l[4] = r, l[5] = s, l[6] = a, l[7] = o, l[8] = c, l;
}
function vv(t, e, n, i, r, s, a, o, c, l) {
  return t[0] = e, t[1] = n, t[2] = i, t[3] = r, t[4] = s, t[5] = a, t[6] = o, t[7] = c, t[8] = l, t;
}
function xv(t) {
  return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t;
}
function Mv(t, e) {
  if (t === e) {
    var n = e[1], i = e[2], r = e[5];
    t[1] = e[3], t[2] = e[6], t[3] = n, t[5] = e[7], t[6] = i, t[7] = r;
  } else
    t[0] = e[0], t[1] = e[3], t[2] = e[6], t[3] = e[1], t[4] = e[4], t[5] = e[7], t[6] = e[2], t[7] = e[5], t[8] = e[8];
  return t;
}
function yv(t, e) {
  var n = e[0], i = e[1], r = e[2], s = e[3], a = e[4], o = e[5], c = e[6], l = e[7], h = e[8], f = h * a - o * l, d = -h * s + o * c, u = l * s - a * c, g = n * f + i * d + r * u;
  return g ? (g = 1 / g, t[0] = f * g, t[1] = (-h * i + r * l) * g, t[2] = (o * i - r * a) * g, t[3] = d * g, t[4] = (h * n - r * c) * g, t[5] = (-o * n + r * s) * g, t[6] = u * g, t[7] = (-l * n + i * c) * g, t[8] = (a * n - i * s) * g, t) : null;
}
function Sv(t, e) {
  var n = e[0], i = e[1], r = e[2], s = e[3], a = e[4], o = e[5], c = e[6], l = e[7], h = e[8];
  return t[0] = a * h - o * l, t[1] = r * l - i * h, t[2] = i * o - r * a, t[3] = o * c - s * h, t[4] = n * h - r * c, t[5] = r * s - n * o, t[6] = s * l - a * c, t[7] = i * c - n * l, t[8] = n * a - i * s, t;
}
function Ev(t) {
  var e = t[0], n = t[1], i = t[2], r = t[3], s = t[4], a = t[5], o = t[6], c = t[7], l = t[8];
  return e * (l * s - a * c) + n * (-l * r + a * o) + i * (c * r - s * o);
}
function Sl(t, e, n) {
  var i = e[0], r = e[1], s = e[2], a = e[3], o = e[4], c = e[5], l = e[6], h = e[7], f = e[8], d = n[0], u = n[1], g = n[2], _ = n[3], p = n[4], m = n[5], E = n[6], M = n[7], x = n[8];
  return t[0] = d * i + u * a + g * l, t[1] = d * r + u * o + g * h, t[2] = d * s + u * c + g * f, t[3] = _ * i + p * a + m * l, t[4] = _ * r + p * o + m * h, t[5] = _ * s + p * c + m * f, t[6] = E * i + M * a + x * l, t[7] = E * r + M * o + x * h, t[8] = E * s + M * c + x * f, t;
}
function Tv(t, e, n) {
  var i = e[0], r = e[1], s = e[2], a = e[3], o = e[4], c = e[5], l = e[6], h = e[7], f = e[8], d = n[0], u = n[1];
  return t[0] = i, t[1] = r, t[2] = s, t[3] = a, t[4] = o, t[5] = c, t[6] = d * i + u * a + l, t[7] = d * r + u * o + h, t[8] = d * s + u * c + f, t;
}
function bv(t, e, n) {
  var i = e[0], r = e[1], s = e[2], a = e[3], o = e[4], c = e[5], l = e[6], h = e[7], f = e[8], d = Math.sin(n), u = Math.cos(n);
  return t[0] = u * i + d * a, t[1] = u * r + d * o, t[2] = u * s + d * c, t[3] = u * a - d * i, t[4] = u * o - d * r, t[5] = u * c - d * s, t[6] = l, t[7] = h, t[8] = f, t;
}
function Av(t, e, n) {
  var i = n[0], r = n[1];
  return t[0] = i * e[0], t[1] = i * e[1], t[2] = i * e[2], t[3] = r * e[3], t[4] = r * e[4], t[5] = r * e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t;
}
function wv(t, e) {
  return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = e[0], t[7] = e[1], t[8] = 1, t;
}
function Rv(t, e) {
  var n = Math.sin(e), i = Math.cos(e);
  return t[0] = i, t[1] = n, t[2] = 0, t[3] = -n, t[4] = i, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t;
}
function Cv(t, e) {
  return t[0] = e[0], t[1] = 0, t[2] = 0, t[3] = 0, t[4] = e[1], t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t;
}
function Pv(t, e) {
  return t[0] = e[0], t[1] = e[1], t[2] = 0, t[3] = e[2], t[4] = e[3], t[5] = 0, t[6] = e[4], t[7] = e[5], t[8] = 1, t;
}
function Dv(t, e) {
  var n = e[0], i = e[1], r = e[2], s = e[3], a = n + n, o = i + i, c = r + r, l = n * a, h = i * a, f = i * o, d = r * a, u = r * o, g = r * c, _ = s * a, p = s * o, m = s * c;
  return t[0] = 1 - f - g, t[3] = h - m, t[6] = d + p, t[1] = h + m, t[4] = 1 - l - g, t[7] = u - _, t[2] = d - p, t[5] = u + _, t[8] = 1 - l - f, t;
}
function Lv(t, e) {
  var n = e[0], i = e[1], r = e[2], s = e[3], a = e[4], o = e[5], c = e[6], l = e[7], h = e[8], f = e[9], d = e[10], u = e[11], g = e[12], _ = e[13], p = e[14], m = e[15], E = n * o - i * a, M = n * c - r * a, x = n * l - s * a, P = i * c - r * o, b = i * l - s * o, A = r * l - s * c, R = h * _ - f * g, S = h * p - d * g, v = h * m - u * g, C = f * p - d * _, F = f * m - u * _, L = d * m - u * p, D = E * L - M * F + x * C + P * v - b * S + A * R;
  return D ? (D = 1 / D, t[0] = (o * L - c * F + l * C) * D, t[1] = (c * v - a * L - l * S) * D, t[2] = (a * F - o * v + l * R) * D, t[3] = (r * F - i * L - s * C) * D, t[4] = (n * L - r * v + s * S) * D, t[5] = (i * v - n * F - s * R) * D, t[6] = (_ * A - p * b + m * P) * D, t[7] = (p * x - g * A - m * M) * D, t[8] = (g * b - _ * x + m * E) * D, t) : null;
}
function Iv(t, e, n) {
  return t[0] = 2 / e, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = -2 / n, t[5] = 0, t[6] = -1, t[7] = 1, t[8] = 1, t;
}
function Uv(t) {
  return "mat3(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ")";
}
function Nv(t) {
  return Math.sqrt(t[0] * t[0] + t[1] * t[1] + t[2] * t[2] + t[3] * t[3] + t[4] * t[4] + t[5] * t[5] + t[6] * t[6] + t[7] * t[7] + t[8] * t[8]);
}
function Fv(t, e, n) {
  return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t[3] = e[3] + n[3], t[4] = e[4] + n[4], t[5] = e[5] + n[5], t[6] = e[6] + n[6], t[7] = e[7] + n[7], t[8] = e[8] + n[8], t;
}
function El(t, e, n) {
  return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t[2] = e[2] - n[2], t[3] = e[3] - n[3], t[4] = e[4] - n[4], t[5] = e[5] - n[5], t[6] = e[6] - n[6], t[7] = e[7] - n[7], t[8] = e[8] - n[8], t;
}
function Ov(t, e, n) {
  return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t[3] = e[3] * n, t[4] = e[4] * n, t[5] = e[5] * n, t[6] = e[6] * n, t[7] = e[7] * n, t[8] = e[8] * n, t;
}
function zv(t, e, n, i) {
  return t[0] = e[0] + n[0] * i, t[1] = e[1] + n[1] * i, t[2] = e[2] + n[2] * i, t[3] = e[3] + n[3] * i, t[4] = e[4] + n[4] * i, t[5] = e[5] + n[5] * i, t[6] = e[6] + n[6] * i, t[7] = e[7] + n[7] * i, t[8] = e[8] + n[8] * i, t;
}
function Bv(t, e) {
  return t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3] && t[4] === e[4] && t[5] === e[5] && t[6] === e[6] && t[7] === e[7] && t[8] === e[8];
}
function Hv(t, e) {
  var n = t[0], i = t[1], r = t[2], s = t[3], a = t[4], o = t[5], c = t[6], l = t[7], h = t[8], f = e[0], d = e[1], u = e[2], g = e[3], _ = e[4], p = e[5], m = e[6], E = e[7], M = e[8];
  return Math.abs(n - f) <= me * Math.max(1, Math.abs(n), Math.abs(f)) && Math.abs(i - d) <= me * Math.max(1, Math.abs(i), Math.abs(d)) && Math.abs(r - u) <= me * Math.max(1, Math.abs(r), Math.abs(u)) && Math.abs(s - g) <= me * Math.max(1, Math.abs(s), Math.abs(g)) && Math.abs(a - _) <= me * Math.max(1, Math.abs(a), Math.abs(_)) && Math.abs(o - p) <= me * Math.max(1, Math.abs(o), Math.abs(p)) && Math.abs(c - m) <= me * Math.max(1, Math.abs(c), Math.abs(m)) && Math.abs(l - E) <= me * Math.max(1, Math.abs(l), Math.abs(E)) && Math.abs(h - M) <= me * Math.max(1, Math.abs(h), Math.abs(M));
}
var kv = Sl, Vv = El;
const Gv = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  add: Fv,
  adjoint: Sv,
  clone: mv,
  copy: gv,
  create: yl,
  determinant: Ev,
  equals: Hv,
  exactEquals: Bv,
  frob: Nv,
  fromMat2d: Pv,
  fromMat4: pv,
  fromQuat: Dv,
  fromRotation: Rv,
  fromScaling: Cv,
  fromTranslation: wv,
  fromValues: _v,
  identity: xv,
  invert: yv,
  mul: kv,
  multiply: Sl,
  multiplyScalar: Ov,
  multiplyScalarAndAdd: zv,
  normalFromMat4: Lv,
  projection: Iv,
  rotate: bv,
  scale: Av,
  set: vv,
  str: Uv,
  sub: Vv,
  subtract: El,
  translate: Tv,
  transpose: Mv
}, Symbol.toStringTag, { value: "Module" }));
function Wv() {
  var t = new Ne(16);
  return Ne != Float32Array && (t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0), t[0] = 1, t[5] = 1, t[10] = 1, t[15] = 1, t;
}
function Xv(t) {
  var e = new Ne(16);
  return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], e[9] = t[9], e[10] = t[10], e[11] = t[11], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15], e;
}
function qv(t, e) {
  return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t;
}
function $v(t, e, n, i, r, s, a, o, c, l, h, f, d, u, g, _) {
  var p = new Ne(16);
  return p[0] = t, p[1] = e, p[2] = n, p[3] = i, p[4] = r, p[5] = s, p[6] = a, p[7] = o, p[8] = c, p[9] = l, p[10] = h, p[11] = f, p[12] = d, p[13] = u, p[14] = g, p[15] = _, p;
}
function Yv(t, e, n, i, r, s, a, o, c, l, h, f, d, u, g, _, p) {
  return t[0] = e, t[1] = n, t[2] = i, t[3] = r, t[4] = s, t[5] = a, t[6] = o, t[7] = c, t[8] = l, t[9] = h, t[10] = f, t[11] = d, t[12] = u, t[13] = g, t[14] = _, t[15] = p, t;
}
function Tl(t) {
  return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
}
function jv(t, e) {
  if (t === e) {
    var n = e[1], i = e[2], r = e[3], s = e[6], a = e[7], o = e[11];
    t[1] = e[4], t[2] = e[8], t[3] = e[12], t[4] = n, t[6] = e[9], t[7] = e[13], t[8] = i, t[9] = s, t[11] = e[14], t[12] = r, t[13] = a, t[14] = o;
  } else
    t[0] = e[0], t[1] = e[4], t[2] = e[8], t[3] = e[12], t[4] = e[1], t[5] = e[5], t[6] = e[9], t[7] = e[13], t[8] = e[2], t[9] = e[6], t[10] = e[10], t[11] = e[14], t[12] = e[3], t[13] = e[7], t[14] = e[11], t[15] = e[15];
  return t;
}
function Zv(t, e) {
  var n = e[0], i = e[1], r = e[2], s = e[3], a = e[4], o = e[5], c = e[6], l = e[7], h = e[8], f = e[9], d = e[10], u = e[11], g = e[12], _ = e[13], p = e[14], m = e[15], E = n * o - i * a, M = n * c - r * a, x = n * l - s * a, P = i * c - r * o, b = i * l - s * o, A = r * l - s * c, R = h * _ - f * g, S = h * p - d * g, v = h * m - u * g, C = f * p - d * _, F = f * m - u * _, L = d * m - u * p, D = E * L - M * F + x * C + P * v - b * S + A * R;
  return D ? (D = 1 / D, t[0] = (o * L - c * F + l * C) * D, t[1] = (r * F - i * L - s * C) * D, t[2] = (_ * A - p * b + m * P) * D, t[3] = (d * b - f * A - u * P) * D, t[4] = (c * v - a * L - l * S) * D, t[5] = (n * L - r * v + s * S) * D, t[6] = (p * x - g * A - m * M) * D, t[7] = (h * A - d * x + u * M) * D, t[8] = (a * F - o * v + l * R) * D, t[9] = (i * v - n * F - s * R) * D, t[10] = (g * b - _ * x + m * E) * D, t[11] = (f * x - h * b - u * E) * D, t[12] = (o * S - a * C - c * R) * D, t[13] = (n * C - i * S + r * R) * D, t[14] = (_ * M - g * P - p * E) * D, t[15] = (h * P - f * M + d * E) * D, t) : null;
}
function Kv(t, e) {
  var n = e[0], i = e[1], r = e[2], s = e[3], a = e[4], o = e[5], c = e[6], l = e[7], h = e[8], f = e[9], d = e[10], u = e[11], g = e[12], _ = e[13], p = e[14], m = e[15], E = n * o - i * a, M = n * c - r * a, x = n * l - s * a, P = i * c - r * o, b = i * l - s * o, A = r * l - s * c, R = h * _ - f * g, S = h * p - d * g, v = h * m - u * g, C = f * p - d * _, F = f * m - u * _, L = d * m - u * p;
  return t[0] = o * L - c * F + l * C, t[1] = r * F - i * L - s * C, t[2] = _ * A - p * b + m * P, t[3] = d * b - f * A - u * P, t[4] = c * v - a * L - l * S, t[5] = n * L - r * v + s * S, t[6] = p * x - g * A - m * M, t[7] = h * A - d * x + u * M, t[8] = a * F - o * v + l * R, t[9] = i * v - n * F - s * R, t[10] = g * b - _ * x + m * E, t[11] = f * x - h * b - u * E, t[12] = o * S - a * C - c * R, t[13] = n * C - i * S + r * R, t[14] = _ * M - g * P - p * E, t[15] = h * P - f * M + d * E, t;
}
function Jv(t) {
  var e = t[0], n = t[1], i = t[2], r = t[3], s = t[4], a = t[5], o = t[6], c = t[7], l = t[8], h = t[9], f = t[10], d = t[11], u = t[12], g = t[13], _ = t[14], p = t[15], m = e * a - n * s, E = e * o - i * s, M = n * o - i * a, x = l * g - h * u, P = l * _ - f * u, b = h * _ - f * g, A = e * b - n * P + i * x, R = s * b - a * P + o * x, S = l * M - h * E + f * m, v = u * M - g * E + _ * m;
  return c * A - r * R + p * S - d * v;
}
function bl(t, e, n) {
  var i = e[0], r = e[1], s = e[2], a = e[3], o = e[4], c = e[5], l = e[6], h = e[7], f = e[8], d = e[9], u = e[10], g = e[11], _ = e[12], p = e[13], m = e[14], E = e[15], M = n[0], x = n[1], P = n[2], b = n[3];
  return t[0] = M * i + x * o + P * f + b * _, t[1] = M * r + x * c + P * d + b * p, t[2] = M * s + x * l + P * u + b * m, t[3] = M * a + x * h + P * g + b * E, M = n[4], x = n[5], P = n[6], b = n[7], t[4] = M * i + x * o + P * f + b * _, t[5] = M * r + x * c + P * d + b * p, t[6] = M * s + x * l + P * u + b * m, t[7] = M * a + x * h + P * g + b * E, M = n[8], x = n[9], P = n[10], b = n[11], t[8] = M * i + x * o + P * f + b * _, t[9] = M * r + x * c + P * d + b * p, t[10] = M * s + x * l + P * u + b * m, t[11] = M * a + x * h + P * g + b * E, M = n[12], x = n[13], P = n[14], b = n[15], t[12] = M * i + x * o + P * f + b * _, t[13] = M * r + x * c + P * d + b * p, t[14] = M * s + x * l + P * u + b * m, t[15] = M * a + x * h + P * g + b * E, t;
}
function Qv(t, e, n) {
  var i = n[0], r = n[1], s = n[2], a, o, c, l, h, f, d, u, g, _, p, m;
  return e === t ? (t[12] = e[0] * i + e[4] * r + e[8] * s + e[12], t[13] = e[1] * i + e[5] * r + e[9] * s + e[13], t[14] = e[2] * i + e[6] * r + e[10] * s + e[14], t[15] = e[3] * i + e[7] * r + e[11] * s + e[15]) : (a = e[0], o = e[1], c = e[2], l = e[3], h = e[4], f = e[5], d = e[6], u = e[7], g = e[8], _ = e[9], p = e[10], m = e[11], t[0] = a, t[1] = o, t[2] = c, t[3] = l, t[4] = h, t[5] = f, t[6] = d, t[7] = u, t[8] = g, t[9] = _, t[10] = p, t[11] = m, t[12] = a * i + h * r + g * s + e[12], t[13] = o * i + f * r + _ * s + e[13], t[14] = c * i + d * r + p * s + e[14], t[15] = l * i + u * r + m * s + e[15]), t;
}
function ex(t, e, n) {
  var i = n[0], r = n[1], s = n[2];
  return t[0] = e[0] * i, t[1] = e[1] * i, t[2] = e[2] * i, t[3] = e[3] * i, t[4] = e[4] * r, t[5] = e[5] * r, t[6] = e[6] * r, t[7] = e[7] * r, t[8] = e[8] * s, t[9] = e[9] * s, t[10] = e[10] * s, t[11] = e[11] * s, t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t;
}
function tx(t, e, n, i) {
  var r = i[0], s = i[1], a = i[2], o = Math.sqrt(r * r + s * s + a * a), c, l, h, f, d, u, g, _, p, m, E, M, x, P, b, A, R, S, v, C, F, L, D, W;
  return o < me ? null : (o = 1 / o, r *= o, s *= o, a *= o, c = Math.sin(n), l = Math.cos(n), h = 1 - l, f = e[0], d = e[1], u = e[2], g = e[3], _ = e[4], p = e[5], m = e[6], E = e[7], M = e[8], x = e[9], P = e[10], b = e[11], A = r * r * h + l, R = s * r * h + a * c, S = a * r * h - s * c, v = r * s * h - a * c, C = s * s * h + l, F = a * s * h + r * c, L = r * a * h + s * c, D = s * a * h - r * c, W = a * a * h + l, t[0] = f * A + _ * R + M * S, t[1] = d * A + p * R + x * S, t[2] = u * A + m * R + P * S, t[3] = g * A + E * R + b * S, t[4] = f * v + _ * C + M * F, t[5] = d * v + p * C + x * F, t[6] = u * v + m * C + P * F, t[7] = g * v + E * C + b * F, t[8] = f * L + _ * D + M * W, t[9] = d * L + p * D + x * W, t[10] = u * L + m * D + P * W, t[11] = g * L + E * D + b * W, e !== t && (t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t);
}
function nx(t, e, n) {
  var i = Math.sin(n), r = Math.cos(n), s = e[4], a = e[5], o = e[6], c = e[7], l = e[8], h = e[9], f = e[10], d = e[11];
  return e !== t && (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t[4] = s * r + l * i, t[5] = a * r + h * i, t[6] = o * r + f * i, t[7] = c * r + d * i, t[8] = l * r - s * i, t[9] = h * r - a * i, t[10] = f * r - o * i, t[11] = d * r - c * i, t;
}
function ix(t, e, n) {
  var i = Math.sin(n), r = Math.cos(n), s = e[0], a = e[1], o = e[2], c = e[3], l = e[8], h = e[9], f = e[10], d = e[11];
  return e !== t && (t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t[0] = s * r - l * i, t[1] = a * r - h * i, t[2] = o * r - f * i, t[3] = c * r - d * i, t[8] = s * i + l * r, t[9] = a * i + h * r, t[10] = o * i + f * r, t[11] = c * i + d * r, t;
}
function rx(t, e, n) {
  var i = Math.sin(n), r = Math.cos(n), s = e[0], a = e[1], o = e[2], c = e[3], l = e[4], h = e[5], f = e[6], d = e[7];
  return e !== t && (t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15]), t[0] = s * r + l * i, t[1] = a * r + h * i, t[2] = o * r + f * i, t[3] = c * r + d * i, t[4] = l * r - s * i, t[5] = h * r - a * i, t[6] = f * r - o * i, t[7] = d * r - c * i, t;
}
function sx(t, e) {
  return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = e[0], t[13] = e[1], t[14] = e[2], t[15] = 1, t;
}
function ax(t, e) {
  return t[0] = e[0], t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = e[1], t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = e[2], t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
}
function ox(t, e, n) {
  var i = n[0], r = n[1], s = n[2], a = Math.sqrt(i * i + r * r + s * s), o, c, l;
  return a < me ? null : (a = 1 / a, i *= a, r *= a, s *= a, o = Math.sin(e), c = Math.cos(e), l = 1 - c, t[0] = i * i * l + c, t[1] = r * i * l + s * o, t[2] = s * i * l - r * o, t[3] = 0, t[4] = i * r * l - s * o, t[5] = r * r * l + c, t[6] = s * r * l + i * o, t[7] = 0, t[8] = i * s * l + r * o, t[9] = r * s * l - i * o, t[10] = s * s * l + c, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t);
}
function cx(t, e) {
  var n = Math.sin(e), i = Math.cos(e);
  return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = i, t[6] = n, t[7] = 0, t[8] = 0, t[9] = -n, t[10] = i, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
}
function lx(t, e) {
  var n = Math.sin(e), i = Math.cos(e);
  return t[0] = i, t[1] = 0, t[2] = -n, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = n, t[9] = 0, t[10] = i, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
}
function hx(t, e) {
  var n = Math.sin(e), i = Math.cos(e);
  return t[0] = i, t[1] = n, t[2] = 0, t[3] = 0, t[4] = -n, t[5] = i, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
}
function Al(t, e, n) {
  var i = e[0], r = e[1], s = e[2], a = e[3], o = i + i, c = r + r, l = s + s, h = i * o, f = i * c, d = i * l, u = r * c, g = r * l, _ = s * l, p = a * o, m = a * c, E = a * l;
  return t[0] = 1 - (u + _), t[1] = f + E, t[2] = d - m, t[3] = 0, t[4] = f - E, t[5] = 1 - (h + _), t[6] = g + p, t[7] = 0, t[8] = d + m, t[9] = g - p, t[10] = 1 - (h + u), t[11] = 0, t[12] = n[0], t[13] = n[1], t[14] = n[2], t[15] = 1, t;
}
function fx(t, e) {
  var n = new Ne(3), i = -e[0], r = -e[1], s = -e[2], a = e[3], o = e[4], c = e[5], l = e[6], h = e[7], f = i * i + r * r + s * s + a * a;
  return f > 0 ? (n[0] = (o * a + h * i + c * s - l * r) * 2 / f, n[1] = (c * a + h * r + l * i - o * s) * 2 / f, n[2] = (l * a + h * s + o * r - c * i) * 2 / f) : (n[0] = (o * a + h * i + c * s - l * r) * 2, n[1] = (c * a + h * r + l * i - o * s) * 2, n[2] = (l * a + h * s + o * r - c * i) * 2), Al(t, e, n), t;
}
function wl(t, e) {
  return t[0] = e[12], t[1] = e[13], t[2] = e[14], t;
}
function Rl(t, e) {
  var n = e[0], i = e[1], r = e[2], s = e[4], a = e[5], o = e[6], c = e[8], l = e[9], h = e[10];
  return t[0] = Math.sqrt(n * n + i * i + r * r), t[1] = Math.sqrt(s * s + a * a + o * o), t[2] = Math.sqrt(c * c + l * l + h * h), t;
}
function Cl(t, e) {
  var n = new Ne(3);
  Rl(n, e);
  var i = 1 / n[0], r = 1 / n[1], s = 1 / n[2], a = e[0] * i, o = e[1] * r, c = e[2] * s, l = e[4] * i, h = e[5] * r, f = e[6] * s, d = e[8] * i, u = e[9] * r, g = e[10] * s, _ = a + h + g, p = 0;
  return _ > 0 ? (p = Math.sqrt(_ + 1) * 2, t[3] = 0.25 * p, t[0] = (f - u) / p, t[1] = (d - c) / p, t[2] = (o - l) / p) : a > h && a > g ? (p = Math.sqrt(1 + a - h - g) * 2, t[3] = (f - u) / p, t[0] = 0.25 * p, t[1] = (o + l) / p, t[2] = (d + c) / p) : h > g ? (p = Math.sqrt(1 + h - a - g) * 2, t[3] = (d - c) / p, t[0] = (o + l) / p, t[1] = 0.25 * p, t[2] = (f + u) / p) : (p = Math.sqrt(1 + g - a - h) * 2, t[3] = (o - l) / p, t[0] = (d + c) / p, t[1] = (f + u) / p, t[2] = 0.25 * p), t;
}
function dx(t, e, n, i) {
  e[0] = i[12], e[1] = i[13], e[2] = i[14];
  var r = i[0], s = i[1], a = i[2], o = i[4], c = i[5], l = i[6], h = i[8], f = i[9], d = i[10];
  n[0] = Math.sqrt(r * r + s * s + a * a), n[1] = Math.sqrt(o * o + c * c + l * l), n[2] = Math.sqrt(h * h + f * f + d * d);
  var u = 1 / n[0], g = 1 / n[1], _ = 1 / n[2], p = r * u, m = s * g, E = a * _, M = o * u, x = c * g, P = l * _, b = h * u, A = f * g, R = d * _, S = p + x + R, v = 0;
  return S > 0 ? (v = Math.sqrt(S + 1) * 2, t[3] = 0.25 * v, t[0] = (P - A) / v, t[1] = (b - E) / v, t[2] = (m - M) / v) : p > x && p > R ? (v = Math.sqrt(1 + p - x - R) * 2, t[3] = (P - A) / v, t[0] = 0.25 * v, t[1] = (m + M) / v, t[2] = (b + E) / v) : x > R ? (v = Math.sqrt(1 + x - p - R) * 2, t[3] = (b - E) / v, t[0] = (m + M) / v, t[1] = 0.25 * v, t[2] = (P + A) / v) : (v = Math.sqrt(1 + R - p - x) * 2, t[3] = (m - M) / v, t[0] = (b + E) / v, t[1] = (P + A) / v, t[2] = 0.25 * v), t;
}
function ux(t, e, n, i) {
  var r = e[0], s = e[1], a = e[2], o = e[3], c = r + r, l = s + s, h = a + a, f = r * c, d = r * l, u = r * h, g = s * l, _ = s * h, p = a * h, m = o * c, E = o * l, M = o * h, x = i[0], P = i[1], b = i[2];
  return t[0] = (1 - (g + p)) * x, t[1] = (d + M) * x, t[2] = (u - E) * x, t[3] = 0, t[4] = (d - M) * P, t[5] = (1 - (f + p)) * P, t[6] = (_ + m) * P, t[7] = 0, t[8] = (u + E) * b, t[9] = (_ - m) * b, t[10] = (1 - (f + g)) * b, t[11] = 0, t[12] = n[0], t[13] = n[1], t[14] = n[2], t[15] = 1, t;
}
function px(t, e, n, i, r) {
  var s = e[0], a = e[1], o = e[2], c = e[3], l = s + s, h = a + a, f = o + o, d = s * l, u = s * h, g = s * f, _ = a * h, p = a * f, m = o * f, E = c * l, M = c * h, x = c * f, P = i[0], b = i[1], A = i[2], R = r[0], S = r[1], v = r[2], C = (1 - (_ + m)) * P, F = (u + x) * P, L = (g - M) * P, D = (u - x) * b, W = (1 - (d + m)) * b, V = (p + E) * b, K = (g + M) * A, G = (p - E) * A, te = (1 - (d + _)) * A;
  return t[0] = C, t[1] = F, t[2] = L, t[3] = 0, t[4] = D, t[5] = W, t[6] = V, t[7] = 0, t[8] = K, t[9] = G, t[10] = te, t[11] = 0, t[12] = n[0] + R - (C * R + D * S + K * v), t[13] = n[1] + S - (F * R + W * S + G * v), t[14] = n[2] + v - (L * R + V * S + te * v), t[15] = 1, t;
}
function mx(t, e) {
  var n = e[0], i = e[1], r = e[2], s = e[3], a = n + n, o = i + i, c = r + r, l = n * a, h = i * a, f = i * o, d = r * a, u = r * o, g = r * c, _ = s * a, p = s * o, m = s * c;
  return t[0] = 1 - f - g, t[1] = h + m, t[2] = d - p, t[3] = 0, t[4] = h - m, t[5] = 1 - l - g, t[6] = u + _, t[7] = 0, t[8] = d + p, t[9] = u - _, t[10] = 1 - l - f, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t;
}
function gx(t, e, n, i, r, s, a) {
  var o = 1 / (n - e), c = 1 / (r - i), l = 1 / (s - a);
  return t[0] = s * 2 * o, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = s * 2 * c, t[6] = 0, t[7] = 0, t[8] = (n + e) * o, t[9] = (r + i) * c, t[10] = (a + s) * l, t[11] = -1, t[12] = 0, t[13] = 0, t[14] = a * s * 2 * l, t[15] = 0, t;
}
function Pl(t, e, n, i, r) {
  var s = 1 / Math.tan(e / 2);
  if (t[0] = s / n, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = s, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[11] = -1, t[12] = 0, t[13] = 0, t[15] = 0, r != null && r !== 1 / 0) {
    var a = 1 / (i - r);
    t[10] = (r + i) * a, t[14] = 2 * r * i * a;
  } else
    t[10] = -1, t[14] = -2 * i;
  return t;
}
var _x = Pl;
function vx(t, e, n, i, r) {
  var s = 1 / Math.tan(e / 2);
  if (t[0] = s / n, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = s, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[11] = -1, t[12] = 0, t[13] = 0, t[15] = 0, r != null && r !== 1 / 0) {
    var a = 1 / (i - r);
    t[10] = r * a, t[14] = r * i * a;
  } else
    t[10] = -1, t[14] = -i;
  return t;
}
function xx(t, e, n, i) {
  var r = Math.tan(e.upDegrees * Math.PI / 180), s = Math.tan(e.downDegrees * Math.PI / 180), a = Math.tan(e.leftDegrees * Math.PI / 180), o = Math.tan(e.rightDegrees * Math.PI / 180), c = 2 / (a + o), l = 2 / (r + s);
  return t[0] = c, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = l, t[6] = 0, t[7] = 0, t[8] = -((a - o) * c * 0.5), t[9] = (r - s) * l * 0.5, t[10] = i / (n - i), t[11] = -1, t[12] = 0, t[13] = 0, t[14] = i * n / (n - i), t[15] = 0, t;
}
function Dl(t, e, n, i, r, s, a) {
  var o = 1 / (e - n), c = 1 / (i - r), l = 1 / (s - a);
  return t[0] = -2 * o, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = -2 * c, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 2 * l, t[11] = 0, t[12] = (e + n) * o, t[13] = (r + i) * c, t[14] = (a + s) * l, t[15] = 1, t;
}
var Mx = Dl;
function yx(t, e, n, i, r, s, a) {
  var o = 1 / (e - n), c = 1 / (i - r), l = 1 / (s - a);
  return t[0] = -2 * o, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = -2 * c, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = l, t[11] = 0, t[12] = (e + n) * o, t[13] = (r + i) * c, t[14] = s * l, t[15] = 1, t;
}
function Sx(t, e, n, i) {
  var r, s, a, o, c, l, h, f, d, u, g = e[0], _ = e[1], p = e[2], m = i[0], E = i[1], M = i[2], x = n[0], P = n[1], b = n[2];
  return Math.abs(g - x) < me && Math.abs(_ - P) < me && Math.abs(p - b) < me ? Tl(t) : (h = g - x, f = _ - P, d = p - b, u = 1 / Math.sqrt(h * h + f * f + d * d), h *= u, f *= u, d *= u, r = E * d - M * f, s = M * h - m * d, a = m * f - E * h, u = Math.sqrt(r * r + s * s + a * a), u ? (u = 1 / u, r *= u, s *= u, a *= u) : (r = 0, s = 0, a = 0), o = f * a - d * s, c = d * r - h * a, l = h * s - f * r, u = Math.sqrt(o * o + c * c + l * l), u ? (u = 1 / u, o *= u, c *= u, l *= u) : (o = 0, c = 0, l = 0), t[0] = r, t[1] = o, t[2] = h, t[3] = 0, t[4] = s, t[5] = c, t[6] = f, t[7] = 0, t[8] = a, t[9] = l, t[10] = d, t[11] = 0, t[12] = -(r * g + s * _ + a * p), t[13] = -(o * g + c * _ + l * p), t[14] = -(h * g + f * _ + d * p), t[15] = 1, t);
}
function Ex(t, e, n, i) {
  var r = e[0], s = e[1], a = e[2], o = i[0], c = i[1], l = i[2], h = r - n[0], f = s - n[1], d = a - n[2], u = h * h + f * f + d * d;
  u > 0 && (u = 1 / Math.sqrt(u), h *= u, f *= u, d *= u);
  var g = c * d - l * f, _ = l * h - o * d, p = o * f - c * h;
  return u = g * g + _ * _ + p * p, u > 0 && (u = 1 / Math.sqrt(u), g *= u, _ *= u, p *= u), t[0] = g, t[1] = _, t[2] = p, t[3] = 0, t[4] = f * p - d * _, t[5] = d * g - h * p, t[6] = h * _ - f * g, t[7] = 0, t[8] = h, t[9] = f, t[10] = d, t[11] = 0, t[12] = r, t[13] = s, t[14] = a, t[15] = 1, t;
}
function Tx(t) {
  return "mat4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ", " + t[9] + ", " + t[10] + ", " + t[11] + ", " + t[12] + ", " + t[13] + ", " + t[14] + ", " + t[15] + ")";
}
function bx(t) {
  return Math.sqrt(t[0] * t[0] + t[1] * t[1] + t[2] * t[2] + t[3] * t[3] + t[4] * t[4] + t[5] * t[5] + t[6] * t[6] + t[7] * t[7] + t[8] * t[8] + t[9] * t[9] + t[10] * t[10] + t[11] * t[11] + t[12] * t[12] + t[13] * t[13] + t[14] * t[14] + t[15] * t[15]);
}
function Ax(t, e, n) {
  return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t[3] = e[3] + n[3], t[4] = e[4] + n[4], t[5] = e[5] + n[5], t[6] = e[6] + n[6], t[7] = e[7] + n[7], t[8] = e[8] + n[8], t[9] = e[9] + n[9], t[10] = e[10] + n[10], t[11] = e[11] + n[11], t[12] = e[12] + n[12], t[13] = e[13] + n[13], t[14] = e[14] + n[14], t[15] = e[15] + n[15], t;
}
function Ll(t, e, n) {
  return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t[2] = e[2] - n[2], t[3] = e[3] - n[3], t[4] = e[4] - n[4], t[5] = e[5] - n[5], t[6] = e[6] - n[6], t[7] = e[7] - n[7], t[8] = e[8] - n[8], t[9] = e[9] - n[9], t[10] = e[10] - n[10], t[11] = e[11] - n[11], t[12] = e[12] - n[12], t[13] = e[13] - n[13], t[14] = e[14] - n[14], t[15] = e[15] - n[15], t;
}
function wx(t, e, n) {
  return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t[3] = e[3] * n, t[4] = e[4] * n, t[5] = e[5] * n, t[6] = e[6] * n, t[7] = e[7] * n, t[8] = e[8] * n, t[9] = e[9] * n, t[10] = e[10] * n, t[11] = e[11] * n, t[12] = e[12] * n, t[13] = e[13] * n, t[14] = e[14] * n, t[15] = e[15] * n, t;
}
function Rx(t, e, n, i) {
  return t[0] = e[0] + n[0] * i, t[1] = e[1] + n[1] * i, t[2] = e[2] + n[2] * i, t[3] = e[3] + n[3] * i, t[4] = e[4] + n[4] * i, t[5] = e[5] + n[5] * i, t[6] = e[6] + n[6] * i, t[7] = e[7] + n[7] * i, t[8] = e[8] + n[8] * i, t[9] = e[9] + n[9] * i, t[10] = e[10] + n[10] * i, t[11] = e[11] + n[11] * i, t[12] = e[12] + n[12] * i, t[13] = e[13] + n[13] * i, t[14] = e[14] + n[14] * i, t[15] = e[15] + n[15] * i, t;
}
function Cx(t, e) {
  return t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3] && t[4] === e[4] && t[5] === e[5] && t[6] === e[6] && t[7] === e[7] && t[8] === e[8] && t[9] === e[9] && t[10] === e[10] && t[11] === e[11] && t[12] === e[12] && t[13] === e[13] && t[14] === e[14] && t[15] === e[15];
}
function Px(t, e) {
  var n = t[0], i = t[1], r = t[2], s = t[3], a = t[4], o = t[5], c = t[6], l = t[7], h = t[8], f = t[9], d = t[10], u = t[11], g = t[12], _ = t[13], p = t[14], m = t[15], E = e[0], M = e[1], x = e[2], P = e[3], b = e[4], A = e[5], R = e[6], S = e[7], v = e[8], C = e[9], F = e[10], L = e[11], D = e[12], W = e[13], V = e[14], K = e[15];
  return Math.abs(n - E) <= me * Math.max(1, Math.abs(n), Math.abs(E)) && Math.abs(i - M) <= me * Math.max(1, Math.abs(i), Math.abs(M)) && Math.abs(r - x) <= me * Math.max(1, Math.abs(r), Math.abs(x)) && Math.abs(s - P) <= me * Math.max(1, Math.abs(s), Math.abs(P)) && Math.abs(a - b) <= me * Math.max(1, Math.abs(a), Math.abs(b)) && Math.abs(o - A) <= me * Math.max(1, Math.abs(o), Math.abs(A)) && Math.abs(c - R) <= me * Math.max(1, Math.abs(c), Math.abs(R)) && Math.abs(l - S) <= me * Math.max(1, Math.abs(l), Math.abs(S)) && Math.abs(h - v) <= me * Math.max(1, Math.abs(h), Math.abs(v)) && Math.abs(f - C) <= me * Math.max(1, Math.abs(f), Math.abs(C)) && Math.abs(d - F) <= me * Math.max(1, Math.abs(d), Math.abs(F)) && Math.abs(u - L) <= me * Math.max(1, Math.abs(u), Math.abs(L)) && Math.abs(g - D) <= me * Math.max(1, Math.abs(g), Math.abs(D)) && Math.abs(_ - W) <= me * Math.max(1, Math.abs(_), Math.abs(W)) && Math.abs(p - V) <= me * Math.max(1, Math.abs(p), Math.abs(V)) && Math.abs(m - K) <= me * Math.max(1, Math.abs(m), Math.abs(K));
}
var Dx = bl, Lx = Ll;
const Ix = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  add: Ax,
  adjoint: Kv,
  clone: Xv,
  copy: qv,
  create: Wv,
  decompose: dx,
  determinant: Jv,
  equals: Px,
  exactEquals: Cx,
  frob: bx,
  fromQuat: mx,
  fromQuat2: fx,
  fromRotation: ox,
  fromRotationTranslation: Al,
  fromRotationTranslationScale: ux,
  fromRotationTranslationScaleOrigin: px,
  fromScaling: ax,
  fromTranslation: sx,
  fromValues: $v,
  fromXRotation: cx,
  fromYRotation: lx,
  fromZRotation: hx,
  frustum: gx,
  getRotation: Cl,
  getScaling: Rl,
  getTranslation: wl,
  identity: Tl,
  invert: Zv,
  lookAt: Sx,
  mul: Dx,
  multiply: bl,
  multiplyScalar: wx,
  multiplyScalarAndAdd: Rx,
  ortho: Mx,
  orthoNO: Dl,
  orthoZO: yx,
  perspective: _x,
  perspectiveFromFieldOfView: xx,
  perspectiveNO: Pl,
  perspectiveZO: vx,
  rotate: tx,
  rotateX: nx,
  rotateY: ix,
  rotateZ: rx,
  scale: ex,
  set: Yv,
  str: Tx,
  sub: Lx,
  subtract: Ll,
  targetTo: Ex,
  translate: Qv,
  transpose: jv
}, Symbol.toStringTag, { value: "Module" }));
function za() {
  var t = new Ne(3);
  return Ne != Float32Array && (t[0] = 0, t[1] = 0, t[2] = 0), t;
}
function Ux(t) {
  var e = new Ne(3);
  return e[0] = t[0], e[1] = t[1], e[2] = t[2], e;
}
function Il(t) {
  var e = t[0], n = t[1], i = t[2];
  return Math.sqrt(e * e + n * n + i * i);
}
function xa(t, e, n) {
  var i = new Ne(3);
  return i[0] = t, i[1] = e, i[2] = n, i;
}
function Nx(t, e) {
  return t[0] = e[0], t[1] = e[1], t[2] = e[2], t;
}
function Fx(t, e, n, i) {
  return t[0] = e, t[1] = n, t[2] = i, t;
}
function Ox(t, e, n) {
  return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t;
}
function Ul(t, e, n) {
  return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t[2] = e[2] - n[2], t;
}
function Nl(t, e, n) {
  return t[0] = e[0] * n[0], t[1] = e[1] * n[1], t[2] = e[2] * n[2], t;
}
function Fl(t, e, n) {
  return t[0] = e[0] / n[0], t[1] = e[1] / n[1], t[2] = e[2] / n[2], t;
}
function zx(t, e) {
  return t[0] = Math.ceil(e[0]), t[1] = Math.ceil(e[1]), t[2] = Math.ceil(e[2]), t;
}
function Bx(t, e) {
  return t[0] = Math.floor(e[0]), t[1] = Math.floor(e[1]), t[2] = Math.floor(e[2]), t;
}
function Hx(t, e, n) {
  return t[0] = Math.min(e[0], n[0]), t[1] = Math.min(e[1], n[1]), t[2] = Math.min(e[2], n[2]), t;
}
function kx(t, e, n) {
  return t[0] = Math.max(e[0], n[0]), t[1] = Math.max(e[1], n[1]), t[2] = Math.max(e[2], n[2]), t;
}
function Vx(t, e) {
  return t[0] = en(e[0]), t[1] = en(e[1]), t[2] = en(e[2]), t;
}
function Gx(t, e, n) {
  return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t;
}
function Wx(t, e, n, i) {
  return t[0] = e[0] + n[0] * i, t[1] = e[1] + n[1] * i, t[2] = e[2] + n[2] * i, t;
}
function Ol(t, e) {
  var n = e[0] - t[0], i = e[1] - t[1], r = e[2] - t[2];
  return Math.sqrt(n * n + i * i + r * r);
}
function zl(t, e) {
  var n = e[0] - t[0], i = e[1] - t[1], r = e[2] - t[2];
  return n * n + i * i + r * r;
}
function Bl(t) {
  var e = t[0], n = t[1], i = t[2];
  return e * e + n * n + i * i;
}
function Xx(t, e) {
  return t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t;
}
function qx(t, e) {
  return t[0] = 1 / e[0], t[1] = 1 / e[1], t[2] = 1 / e[2], t;
}
function Hl(t, e) {
  var n = e[0], i = e[1], r = e[2], s = n * n + i * i + r * r;
  return s > 0 && (s = 1 / Math.sqrt(s)), t[0] = e[0] * s, t[1] = e[1] * s, t[2] = e[2] * s, t;
}
function $r(t, e) {
  return t[0] * e[0] + t[1] * e[1] + t[2] * e[2];
}
function Fr(t, e, n) {
  var i = e[0], r = e[1], s = e[2], a = n[0], o = n[1], c = n[2];
  return t[0] = r * c - s * o, t[1] = s * a - i * c, t[2] = i * o - r * a, t;
}
function $x(t, e, n, i) {
  var r = e[0], s = e[1], a = e[2];
  return t[0] = r + i * (n[0] - r), t[1] = s + i * (n[1] - s), t[2] = a + i * (n[2] - a), t;
}
function Yx(t, e, n, i) {
  var r = Math.acos(Math.min(Math.max($r(e, n), -1), 1)), s = Math.sin(r), a = Math.sin((1 - i) * r) / s, o = Math.sin(i * r) / s;
  return t[0] = a * e[0] + o * n[0], t[1] = a * e[1] + o * n[1], t[2] = a * e[2] + o * n[2], t;
}
function jx(t, e, n, i, r, s) {
  var a = s * s, o = a * (2 * s - 3) + 1, c = a * (s - 2) + s, l = a * (s - 1), h = a * (3 - 2 * s);
  return t[0] = e[0] * o + n[0] * c + i[0] * l + r[0] * h, t[1] = e[1] * o + n[1] * c + i[1] * l + r[1] * h, t[2] = e[2] * o + n[2] * c + i[2] * l + r[2] * h, t;
}
function Zx(t, e, n, i, r, s) {
  var a = 1 - s, o = a * a, c = s * s, l = o * a, h = 3 * s * o, f = 3 * c * a, d = c * s;
  return t[0] = e[0] * l + n[0] * h + i[0] * f + r[0] * d, t[1] = e[1] * l + n[1] * h + i[1] * f + r[1] * d, t[2] = e[2] * l + n[2] * h + i[2] * f + r[2] * d, t;
}
function Kx(t, e) {
  e = e === void 0 ? 1 : e;
  var n = Yt() * 2 * Math.PI, i = Yt() * 2 - 1, r = Math.sqrt(1 - i * i) * e;
  return t[0] = Math.cos(n) * r, t[1] = Math.sin(n) * r, t[2] = i * e, t;
}
function Jx(t, e, n) {
  var i = e[0], r = e[1], s = e[2], a = n[3] * i + n[7] * r + n[11] * s + n[15];
  return a = a || 1, t[0] = (n[0] * i + n[4] * r + n[8] * s + n[12]) / a, t[1] = (n[1] * i + n[5] * r + n[9] * s + n[13]) / a, t[2] = (n[2] * i + n[6] * r + n[10] * s + n[14]) / a, t;
}
function Qx(t, e, n) {
  var i = e[0], r = e[1], s = e[2];
  return t[0] = i * n[0] + r * n[3] + s * n[6], t[1] = i * n[1] + r * n[4] + s * n[7], t[2] = i * n[2] + r * n[5] + s * n[8], t;
}
function e1(t, e, n) {
  var i = n[0], r = n[1], s = n[2], a = n[3], o = e[0], c = e[1], l = e[2], h = r * l - s * c, f = s * o - i * l, d = i * c - r * o;
  return h = h + h, f = f + f, d = d + d, t[0] = o + a * h + r * d - s * f, t[1] = c + a * f + s * h - i * d, t[2] = l + a * d + i * f - r * h, t;
}
function t1(t, e, n, i) {
  var r = [], s = [];
  return r[0] = e[0] - n[0], r[1] = e[1] - n[1], r[2] = e[2] - n[2], s[0] = r[0], s[1] = r[1] * Math.cos(i) - r[2] * Math.sin(i), s[2] = r[1] * Math.sin(i) + r[2] * Math.cos(i), t[0] = s[0] + n[0], t[1] = s[1] + n[1], t[2] = s[2] + n[2], t;
}
function n1(t, e, n, i) {
  var r = [], s = [];
  return r[0] = e[0] - n[0], r[1] = e[1] - n[1], r[2] = e[2] - n[2], s[0] = r[2] * Math.sin(i) + r[0] * Math.cos(i), s[1] = r[1], s[2] = r[2] * Math.cos(i) - r[0] * Math.sin(i), t[0] = s[0] + n[0], t[1] = s[1] + n[1], t[2] = s[2] + n[2], t;
}
function i1(t, e, n, i) {
  var r = [], s = [];
  return r[0] = e[0] - n[0], r[1] = e[1] - n[1], r[2] = e[2] - n[2], s[0] = r[0] * Math.cos(i) - r[1] * Math.sin(i), s[1] = r[0] * Math.sin(i) + r[1] * Math.cos(i), s[2] = r[2], t[0] = s[0] + n[0], t[1] = s[1] + n[1], t[2] = s[2] + n[2], t;
}
function r1(t, e) {
  var n = t[0], i = t[1], r = t[2], s = e[0], a = e[1], o = e[2], c = Math.sqrt((n * n + i * i + r * r) * (s * s + a * a + o * o)), l = c && $r(t, e) / c;
  return Math.acos(Math.min(Math.max(l, -1), 1));
}
function s1(t) {
  return t[0] = 0, t[1] = 0, t[2] = 0, t;
}
function a1(t) {
  return "vec3(" + t[0] + ", " + t[1] + ", " + t[2] + ")";
}
function o1(t, e) {
  return t[0] === e[0] && t[1] === e[1] && t[2] === e[2];
}
function c1(t, e) {
  var n = t[0], i = t[1], r = t[2], s = e[0], a = e[1], o = e[2];
  return Math.abs(n - s) <= me * Math.max(1, Math.abs(n), Math.abs(s)) && Math.abs(i - a) <= me * Math.max(1, Math.abs(i), Math.abs(a)) && Math.abs(r - o) <= me * Math.max(1, Math.abs(r), Math.abs(o));
}
var l1 = Ul, h1 = Nl, f1 = Fl, d1 = Ol, u1 = zl, kl = Il, p1 = Bl, m1 = (function() {
  var t = za();
  return function(e, n, i, r, s, a) {
    var o, c;
    for (n || (n = 3), i || (i = 0), r ? c = Math.min(r * n + i, e.length) : c = e.length, o = i; o < c; o += n)
      t[0] = e[o], t[1] = e[o + 1], t[2] = e[o + 2], s(t, t, a), e[o] = t[0], e[o + 1] = t[1], e[o + 2] = t[2];
    return e;
  };
})();
const g1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  add: Ox,
  angle: r1,
  bezier: Zx,
  ceil: zx,
  clone: Ux,
  copy: Nx,
  create: za,
  cross: Fr,
  dist: d1,
  distance: Ol,
  div: f1,
  divide: Fl,
  dot: $r,
  equals: c1,
  exactEquals: o1,
  floor: Bx,
  forEach: m1,
  fromValues: xa,
  hermite: jx,
  inverse: qx,
  len: kl,
  length: Il,
  lerp: $x,
  max: kx,
  min: Hx,
  mul: h1,
  multiply: Nl,
  negate: Xx,
  normalize: Hl,
  random: Kx,
  rotateX: t1,
  rotateY: n1,
  rotateZ: i1,
  round: Vx,
  scale: Gx,
  scaleAndAdd: Wx,
  set: Fx,
  slerp: Yx,
  sqrDist: u1,
  sqrLen: p1,
  squaredDistance: zl,
  squaredLength: Bl,
  str: a1,
  sub: l1,
  subtract: Ul,
  transformMat3: Qx,
  transformMat4: Jx,
  transformQuat: e1,
  zero: s1
}, Symbol.toStringTag, { value: "Module" }));
function Vl() {
  var t = new Ne(4);
  return Ne != Float32Array && (t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 0), t;
}
function Gl(t) {
  var e = new Ne(4);
  return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e;
}
function Wl(t, e, n, i) {
  var r = new Ne(4);
  return r[0] = t, r[1] = e, r[2] = n, r[3] = i, r;
}
function Xl(t, e) {
  return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t;
}
function ql(t, e, n, i, r) {
  return t[0] = e, t[1] = n, t[2] = i, t[3] = r, t;
}
function $l(t, e, n) {
  return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t[3] = e[3] + n[3], t;
}
function Yl(t, e, n) {
  return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t[2] = e[2] - n[2], t[3] = e[3] - n[3], t;
}
function jl(t, e, n) {
  return t[0] = e[0] * n[0], t[1] = e[1] * n[1], t[2] = e[2] * n[2], t[3] = e[3] * n[3], t;
}
function Zl(t, e, n) {
  return t[0] = e[0] / n[0], t[1] = e[1] / n[1], t[2] = e[2] / n[2], t[3] = e[3] / n[3], t;
}
function _1(t, e) {
  return t[0] = Math.ceil(e[0]), t[1] = Math.ceil(e[1]), t[2] = Math.ceil(e[2]), t[3] = Math.ceil(e[3]), t;
}
function v1(t, e) {
  return t[0] = Math.floor(e[0]), t[1] = Math.floor(e[1]), t[2] = Math.floor(e[2]), t[3] = Math.floor(e[3]), t;
}
function x1(t, e, n) {
  return t[0] = Math.min(e[0], n[0]), t[1] = Math.min(e[1], n[1]), t[2] = Math.min(e[2], n[2]), t[3] = Math.min(e[3], n[3]), t;
}
function M1(t, e, n) {
  return t[0] = Math.max(e[0], n[0]), t[1] = Math.max(e[1], n[1]), t[2] = Math.max(e[2], n[2]), t[3] = Math.max(e[3], n[3]), t;
}
function y1(t, e) {
  return t[0] = en(e[0]), t[1] = en(e[1]), t[2] = en(e[2]), t[3] = en(e[3]), t;
}
function Kl(t, e, n) {
  return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t[3] = e[3] * n, t;
}
function S1(t, e, n, i) {
  return t[0] = e[0] + n[0] * i, t[1] = e[1] + n[1] * i, t[2] = e[2] + n[2] * i, t[3] = e[3] + n[3] * i, t;
}
function Jl(t, e) {
  var n = e[0] - t[0], i = e[1] - t[1], r = e[2] - t[2], s = e[3] - t[3];
  return Math.sqrt(n * n + i * i + r * r + s * s);
}
function Ql(t, e) {
  var n = e[0] - t[0], i = e[1] - t[1], r = e[2] - t[2], s = e[3] - t[3];
  return n * n + i * i + r * r + s * s;
}
function Ba(t) {
  var e = t[0], n = t[1], i = t[2], r = t[3];
  return Math.sqrt(e * e + n * n + i * i + r * r);
}
function Ha(t) {
  var e = t[0], n = t[1], i = t[2], r = t[3];
  return e * e + n * n + i * i + r * r;
}
function E1(t, e) {
  return t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = -e[3], t;
}
function T1(t, e) {
  return t[0] = 1 / e[0], t[1] = 1 / e[1], t[2] = 1 / e[2], t[3] = 1 / e[3], t;
}
function eh(t, e) {
  var n = e[0], i = e[1], r = e[2], s = e[3], a = n * n + i * i + r * r + s * s;
  return a > 0 && (a = 1 / Math.sqrt(a)), t[0] = n * a, t[1] = i * a, t[2] = r * a, t[3] = s * a, t;
}
function ka(t, e) {
  return t[0] * e[0] + t[1] * e[1] + t[2] * e[2] + t[3] * e[3];
}
function b1(t, e, n, i) {
  var r = n[0] * i[1] - n[1] * i[0], s = n[0] * i[2] - n[2] * i[0], a = n[0] * i[3] - n[3] * i[0], o = n[1] * i[2] - n[2] * i[1], c = n[1] * i[3] - n[3] * i[1], l = n[2] * i[3] - n[3] * i[2], h = e[0], f = e[1], d = e[2], u = e[3];
  return t[0] = f * l - d * c + u * o, t[1] = -(h * l) + d * a - u * s, t[2] = h * c - f * a + u * r, t[3] = -(h * o) + f * s - d * r, t;
}
function th(t, e, n, i) {
  var r = e[0], s = e[1], a = e[2], o = e[3];
  return t[0] = r + i * (n[0] - r), t[1] = s + i * (n[1] - s), t[2] = a + i * (n[2] - a), t[3] = o + i * (n[3] - o), t;
}
function A1(t, e) {
  e = e === void 0 ? 1 : e;
  var n, i, r, s, a, o, c;
  c = Yt(), n = c * 2 - 1, i = (4 * Yt() - 2) * Math.sqrt(c * -c + c), a = n * n + i * i, c = Yt(), r = c * 2 - 1, s = (4 * Yt() - 2) * Math.sqrt(c * -c + c), o = r * r + s * s;
  var l = Math.sqrt((1 - a) / o);
  return t[0] = e * n, t[1] = e * i, t[2] = e * r * l, t[3] = e * s * l, t;
}
function w1(t, e, n) {
  var i = e[0], r = e[1], s = e[2], a = e[3];
  return t[0] = n[0] * i + n[4] * r + n[8] * s + n[12] * a, t[1] = n[1] * i + n[5] * r + n[9] * s + n[13] * a, t[2] = n[2] * i + n[6] * r + n[10] * s + n[14] * a, t[3] = n[3] * i + n[7] * r + n[11] * s + n[15] * a, t;
}
function R1(t, e, n) {
  var i = n[0], r = n[1], s = n[2], a = n[3], o = e[0], c = e[1], l = e[2], h = r * l - s * c, f = s * o - i * l, d = i * c - r * o;
  return h = h + h, f = f + f, d = d + d, t[0] = o + a * h + r * d - s * f, t[1] = c + a * f + s * h - i * d, t[2] = l + a * d + i * f - r * h, t[3] = e[3], t;
}
function C1(t) {
  return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 0, t;
}
function P1(t) {
  return "vec4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")";
}
function nh(t, e) {
  return t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3];
}
function D1(t, e) {
  var n = t[0], i = t[1], r = t[2], s = t[3], a = e[0], o = e[1], c = e[2], l = e[3];
  return Math.abs(n - a) <= me * Math.max(1, Math.abs(n), Math.abs(a)) && Math.abs(i - o) <= me * Math.max(1, Math.abs(i), Math.abs(o)) && Math.abs(r - c) <= me * Math.max(1, Math.abs(r), Math.abs(c)) && Math.abs(s - l) <= me * Math.max(1, Math.abs(s), Math.abs(l));
}
var L1 = Yl, I1 = jl, U1 = Zl, N1 = Jl, F1 = Ql, O1 = Ba, z1 = Ha, B1 = (function() {
  var t = Vl();
  return function(e, n, i, r, s, a) {
    var o, c;
    for (n || (n = 4), i || (i = 0), r ? c = Math.min(r * n + i, e.length) : c = e.length, o = i; o < c; o += n)
      t[0] = e[o], t[1] = e[o + 1], t[2] = e[o + 2], t[3] = e[o + 3], s(t, t, a), e[o] = t[0], e[o + 1] = t[1], e[o + 2] = t[2], e[o + 3] = t[3];
    return e;
  };
})();
const H1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  add: $l,
  ceil: _1,
  clone: Gl,
  copy: Xl,
  create: Vl,
  cross: b1,
  dist: N1,
  distance: Jl,
  div: U1,
  divide: Zl,
  dot: ka,
  equals: D1,
  exactEquals: nh,
  floor: v1,
  forEach: B1,
  fromValues: Wl,
  inverse: T1,
  len: O1,
  length: Ba,
  lerp: th,
  max: M1,
  min: x1,
  mul: I1,
  multiply: jl,
  negate: E1,
  normalize: eh,
  random: A1,
  round: y1,
  scale: Kl,
  scaleAndAdd: S1,
  set: ql,
  sqrDist: F1,
  sqrLen: z1,
  squaredDistance: Ql,
  squaredLength: Ha,
  str: P1,
  sub: L1,
  subtract: Yl,
  transformMat4: w1,
  transformQuat: R1,
  zero: C1
}, Symbol.toStringTag, { value: "Module" }));
function kr() {
  var t = new Ne(4);
  return Ne != Float32Array && (t[0] = 0, t[1] = 0, t[2] = 0), t[3] = 1, t;
}
function k1(t) {
  return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t;
}
function ih(t, e, n) {
  n = n * 0.5;
  var i = Math.sin(n);
  return t[0] = i * e[0], t[1] = i * e[1], t[2] = i * e[2], t[3] = Math.cos(n), t;
}
function V1(t, e) {
  var n = Math.acos(e[3]) * 2, i = Math.sin(n / 2);
  return i > me ? (t[0] = e[0] / i, t[1] = e[1] / i, t[2] = e[2] / i) : (t[0] = 1, t[1] = 0, t[2] = 0), n;
}
function G1(t, e) {
  var n = Ga(t, e);
  return Math.acos(2 * n * n - 1);
}
function rh(t, e, n) {
  var i = e[0], r = e[1], s = e[2], a = e[3], o = n[0], c = n[1], l = n[2], h = n[3];
  return t[0] = i * h + a * o + r * l - s * c, t[1] = r * h + a * c + s * o - i * l, t[2] = s * h + a * l + i * c - r * o, t[3] = a * h - i * o - r * c - s * l, t;
}
function sh(t, e, n) {
  n *= 0.5;
  var i = e[0], r = e[1], s = e[2], a = e[3], o = Math.sin(n), c = Math.cos(n);
  return t[0] = i * c + a * o, t[1] = r * c + s * o, t[2] = s * c - r * o, t[3] = a * c - i * o, t;
}
function ah(t, e, n) {
  n *= 0.5;
  var i = e[0], r = e[1], s = e[2], a = e[3], o = Math.sin(n), c = Math.cos(n);
  return t[0] = i * c - s * o, t[1] = r * c + a * o, t[2] = s * c + i * o, t[3] = a * c - r * o, t;
}
function oh(t, e, n) {
  n *= 0.5;
  var i = e[0], r = e[1], s = e[2], a = e[3], o = Math.sin(n), c = Math.cos(n);
  return t[0] = i * c + r * o, t[1] = r * c - i * o, t[2] = s * c + a * o, t[3] = a * c - s * o, t;
}
function W1(t, e) {
  var n = e[0], i = e[1], r = e[2];
  return t[0] = n, t[1] = i, t[2] = r, t[3] = Math.sqrt(Math.abs(1 - n * n - i * i - r * r)), t;
}
function ch(t, e) {
  var n = e[0], i = e[1], r = e[2], s = e[3], a = Math.sqrt(n * n + i * i + r * r), o = Math.exp(s), c = a > 0 ? o * Math.sin(a) / a : 0;
  return t[0] = n * c, t[1] = i * c, t[2] = r * c, t[3] = o * Math.cos(a), t;
}
function lh(t, e) {
  var n = e[0], i = e[1], r = e[2], s = e[3], a = Math.sqrt(n * n + i * i + r * r), o = a > 0 ? Math.atan2(a, s) / a : 0;
  return t[0] = n * o, t[1] = i * o, t[2] = r * o, t[3] = 0.5 * Math.log(n * n + i * i + r * r + s * s), t;
}
function X1(t, e, n) {
  return lh(t, e), fh(t, t, n), ch(t, t), t;
}
function Or(t, e, n, i) {
  var r = e[0], s = e[1], a = e[2], o = e[3], c = n[0], l = n[1], h = n[2], f = n[3], d, u, g, _, p;
  return u = r * c + s * l + a * h + o * f, u < 0 && (u = -u, c = -c, l = -l, h = -h, f = -f), 1 - u > me ? (d = Math.acos(u), g = Math.sin(d), _ = Math.sin((1 - i) * d) / g, p = Math.sin(i * d) / g) : (_ = 1 - i, p = i), t[0] = _ * r + p * c, t[1] = _ * s + p * l, t[2] = _ * a + p * h, t[3] = _ * o + p * f, t;
}
function q1(t) {
  var e = Yt(), n = Yt(), i = Yt(), r = Math.sqrt(1 - e), s = Math.sqrt(e);
  return t[0] = r * Math.sin(2 * Math.PI * n), t[1] = r * Math.cos(2 * Math.PI * n), t[2] = s * Math.sin(2 * Math.PI * i), t[3] = s * Math.cos(2 * Math.PI * i), t;
}
function $1(t, e) {
  var n = e[0], i = e[1], r = e[2], s = e[3], a = n * n + i * i + r * r + s * s, o = a ? 1 / a : 0;
  return t[0] = -n * o, t[1] = -i * o, t[2] = -r * o, t[3] = s * o, t;
}
function Y1(t, e) {
  return t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = e[3], t;
}
function hh(t, e) {
  var n = e[0] + e[4] + e[8], i;
  if (n > 0)
    i = Math.sqrt(n + 1), t[3] = 0.5 * i, i = 0.5 / i, t[0] = (e[5] - e[7]) * i, t[1] = (e[6] - e[2]) * i, t[2] = (e[1] - e[3]) * i;
  else {
    var r = 0;
    e[4] > e[0] && (r = 1), e[8] > e[r * 3 + r] && (r = 2);
    var s = (r + 1) % 3, a = (r + 2) % 3;
    i = Math.sqrt(e[r * 3 + r] - e[s * 3 + s] - e[a * 3 + a] + 1), t[r] = 0.5 * i, i = 0.5 / i, t[3] = (e[s * 3 + a] - e[a * 3 + s]) * i, t[s] = (e[s * 3 + r] + e[r * 3 + s]) * i, t[a] = (e[a * 3 + r] + e[r * 3 + a]) * i;
  }
  return t;
}
function j1(t, e, n, i) {
  var r = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : gl, s = Math.PI / 360;
  e *= s, i *= s, n *= s;
  var a = Math.sin(e), o = Math.cos(e), c = Math.sin(n), l = Math.cos(n), h = Math.sin(i), f = Math.cos(i);
  switch (r) {
    case "xyz":
      t[0] = a * l * f + o * c * h, t[1] = o * c * f - a * l * h, t[2] = o * l * h + a * c * f, t[3] = o * l * f - a * c * h;
      break;
    case "xzy":
      t[0] = a * l * f - o * c * h, t[1] = o * c * f - a * l * h, t[2] = o * l * h + a * c * f, t[3] = o * l * f + a * c * h;
      break;
    case "yxz":
      t[0] = a * l * f + o * c * h, t[1] = o * c * f - a * l * h, t[2] = o * l * h - a * c * f, t[3] = o * l * f + a * c * h;
      break;
    case "yzx":
      t[0] = a * l * f + o * c * h, t[1] = o * c * f + a * l * h, t[2] = o * l * h - a * c * f, t[3] = o * l * f - a * c * h;
      break;
    case "zxy":
      t[0] = a * l * f - o * c * h, t[1] = o * c * f + a * l * h, t[2] = o * l * h + a * c * f, t[3] = o * l * f - a * c * h;
      break;
    case "zyx":
      t[0] = a * l * f - o * c * h, t[1] = o * c * f + a * l * h, t[2] = o * l * h - a * c * f, t[3] = o * l * f + a * c * h;
      break;
    default:
      throw new Error("Unknown angle order " + r);
  }
  return t;
}
function Z1(t) {
  return "quat(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")";
}
var K1 = Gl, J1 = Wl, Va = Xl, Q1 = ql, eM = $l, tM = rh, fh = Kl, Ga = ka, nM = th, Wa = Ba, iM = Wa, Xa = Ha, rM = Xa, qa = eh, sM = nh;
function aM(t, e) {
  return Math.abs(ka(t, e)) >= 1 - me;
}
var oM = (function() {
  var t = za(), e = xa(1, 0, 0), n = xa(0, 1, 0);
  return function(i, r, s) {
    var a = $r(r, s);
    return a < -0.999999 ? (Fr(t, e, r), kl(t) < 1e-6 && Fr(t, n, r), Hl(t, t), ih(i, t, Math.PI), i) : a > 0.999999 ? (i[0] = 0, i[1] = 0, i[2] = 0, i[3] = 1, i) : (Fr(t, r, s), i[0] = t[0], i[1] = t[1], i[2] = t[2], i[3] = 1 + a, qa(i, i));
  };
})(), cM = (function() {
  var t = kr(), e = kr();
  return function(n, i, r, s, a, o) {
    return Or(t, i, a, o), Or(e, r, s, o), Or(n, t, e, 2 * o * (1 - o)), n;
  };
})(), lM = (function() {
  var t = yl();
  return function(e, n, i, r) {
    return t[0] = i[0], t[3] = i[1], t[6] = i[2], t[1] = r[0], t[4] = r[1], t[7] = r[2], t[2] = -n[0], t[5] = -n[1], t[8] = -n[2], qa(e, hh(e, t));
  };
})();
const hM = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  add: eM,
  calculateW: W1,
  clone: K1,
  conjugate: Y1,
  copy: Va,
  create: kr,
  dot: Ga,
  equals: aM,
  exactEquals: sM,
  exp: ch,
  fromEuler: j1,
  fromMat3: hh,
  fromValues: J1,
  getAngle: G1,
  getAxisAngle: V1,
  identity: k1,
  invert: $1,
  len: iM,
  length: Wa,
  lerp: nM,
  ln: lh,
  mul: tM,
  multiply: rh,
  normalize: qa,
  pow: X1,
  random: q1,
  rotateX: sh,
  rotateY: ah,
  rotateZ: oh,
  rotationTo: oM,
  scale: fh,
  set: Q1,
  setAxes: lM,
  setAxisAngle: ih,
  slerp: Or,
  sqlerp: cM,
  sqrLen: rM,
  squaredLength: Xa,
  str: Z1
}, Symbol.toStringTag, { value: "Module" }));
function fM() {
  var t = new Ne(8);
  return Ne != Float32Array && (t[0] = 0, t[1] = 0, t[2] = 0, t[4] = 0, t[5] = 0, t[6] = 0, t[7] = 0), t[3] = 1, t;
}
function dM(t) {
  var e = new Ne(8);
  return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e;
}
function uM(t, e, n, i, r, s, a, o) {
  var c = new Ne(8);
  return c[0] = t, c[1] = e, c[2] = n, c[3] = i, c[4] = r, c[5] = s, c[6] = a, c[7] = o, c;
}
function pM(t, e, n, i, r, s, a) {
  var o = new Ne(8);
  o[0] = t, o[1] = e, o[2] = n, o[3] = i;
  var c = r * 0.5, l = s * 0.5, h = a * 0.5;
  return o[4] = c * i + l * n - h * e, o[5] = l * i + h * t - c * n, o[6] = h * i + c * e - l * t, o[7] = -c * t - l * e - h * n, o;
}
function dh(t, e, n) {
  var i = n[0] * 0.5, r = n[1] * 0.5, s = n[2] * 0.5, a = e[0], o = e[1], c = e[2], l = e[3];
  return t[0] = a, t[1] = o, t[2] = c, t[3] = l, t[4] = i * l + r * c - s * o, t[5] = r * l + s * a - i * c, t[6] = s * l + i * o - r * a, t[7] = -i * a - r * o - s * c, t;
}
function mM(t, e) {
  return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = e[0] * 0.5, t[5] = e[1] * 0.5, t[6] = e[2] * 0.5, t[7] = 0, t;
}
function gM(t, e) {
  return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = 0, t[5] = 0, t[6] = 0, t[7] = 0, t;
}
function _M(t, e) {
  var n = kr();
  Cl(n, e);
  var i = new Ne(3);
  return wl(i, e), dh(t, n, i), t;
}
function uh(t, e) {
  return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t;
}
function vM(t) {
  return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, t[6] = 0, t[7] = 0, t;
}
function xM(t, e, n, i, r, s, a, o, c) {
  return t[0] = e, t[1] = n, t[2] = i, t[3] = r, t[4] = s, t[5] = a, t[6] = o, t[7] = c, t;
}
var MM = Va;
function yM(t, e) {
  return t[0] = e[4], t[1] = e[5], t[2] = e[6], t[3] = e[7], t;
}
var SM = Va;
function EM(t, e) {
  return t[4] = e[0], t[5] = e[1], t[6] = e[2], t[7] = e[3], t;
}
function TM(t, e) {
  var n = e[4], i = e[5], r = e[6], s = e[7], a = -e[0], o = -e[1], c = -e[2], l = e[3];
  return t[0] = (n * l + s * a + i * c - r * o) * 2, t[1] = (i * l + s * o + r * a - n * c) * 2, t[2] = (r * l + s * c + n * o - i * a) * 2, t;
}
function bM(t, e, n) {
  var i = e[0], r = e[1], s = e[2], a = e[3], o = n[0] * 0.5, c = n[1] * 0.5, l = n[2] * 0.5, h = e[4], f = e[5], d = e[6], u = e[7];
  return t[0] = i, t[1] = r, t[2] = s, t[3] = a, t[4] = a * o + r * l - s * c + h, t[5] = a * c + s * o - i * l + f, t[6] = a * l + i * c - r * o + d, t[7] = -i * o - r * c - s * l + u, t;
}
function AM(t, e, n) {
  var i = -e[0], r = -e[1], s = -e[2], a = e[3], o = e[4], c = e[5], l = e[6], h = e[7], f = o * a + h * i + c * s - l * r, d = c * a + h * r + l * i - o * s, u = l * a + h * s + o * r - c * i, g = h * a - o * i - c * r - l * s;
  return sh(t, e, n), i = t[0], r = t[1], s = t[2], a = t[3], t[4] = f * a + g * i + d * s - u * r, t[5] = d * a + g * r + u * i - f * s, t[6] = u * a + g * s + f * r - d * i, t[7] = g * a - f * i - d * r - u * s, t;
}
function wM(t, e, n) {
  var i = -e[0], r = -e[1], s = -e[2], a = e[3], o = e[4], c = e[5], l = e[6], h = e[7], f = o * a + h * i + c * s - l * r, d = c * a + h * r + l * i - o * s, u = l * a + h * s + o * r - c * i, g = h * a - o * i - c * r - l * s;
  return ah(t, e, n), i = t[0], r = t[1], s = t[2], a = t[3], t[4] = f * a + g * i + d * s - u * r, t[5] = d * a + g * r + u * i - f * s, t[6] = u * a + g * s + f * r - d * i, t[7] = g * a - f * i - d * r - u * s, t;
}
function RM(t, e, n) {
  var i = -e[0], r = -e[1], s = -e[2], a = e[3], o = e[4], c = e[5], l = e[6], h = e[7], f = o * a + h * i + c * s - l * r, d = c * a + h * r + l * i - o * s, u = l * a + h * s + o * r - c * i, g = h * a - o * i - c * r - l * s;
  return oh(t, e, n), i = t[0], r = t[1], s = t[2], a = t[3], t[4] = f * a + g * i + d * s - u * r, t[5] = d * a + g * r + u * i - f * s, t[6] = u * a + g * s + f * r - d * i, t[7] = g * a - f * i - d * r - u * s, t;
}
function CM(t, e, n) {
  var i = n[0], r = n[1], s = n[2], a = n[3], o = e[0], c = e[1], l = e[2], h = e[3];
  return t[0] = o * a + h * i + c * s - l * r, t[1] = c * a + h * r + l * i - o * s, t[2] = l * a + h * s + o * r - c * i, t[3] = h * a - o * i - c * r - l * s, o = e[4], c = e[5], l = e[6], h = e[7], t[4] = o * a + h * i + c * s - l * r, t[5] = c * a + h * r + l * i - o * s, t[6] = l * a + h * s + o * r - c * i, t[7] = h * a - o * i - c * r - l * s, t;
}
function PM(t, e, n) {
  var i = e[0], r = e[1], s = e[2], a = e[3], o = n[0], c = n[1], l = n[2], h = n[3];
  return t[0] = i * h + a * o + r * l - s * c, t[1] = r * h + a * c + s * o - i * l, t[2] = s * h + a * l + i * c - r * o, t[3] = a * h - i * o - r * c - s * l, o = n[4], c = n[5], l = n[6], h = n[7], t[4] = i * h + a * o + r * l - s * c, t[5] = r * h + a * c + s * o - i * l, t[6] = s * h + a * l + i * c - r * o, t[7] = a * h - i * o - r * c - s * l, t;
}
function DM(t, e, n, i) {
  if (Math.abs(i) < me)
    return uh(t, e);
  var r = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);
  i = i * 0.5;
  var s = Math.sin(i), a = s * n[0] / r, o = s * n[1] / r, c = s * n[2] / r, l = Math.cos(i), h = e[0], f = e[1], d = e[2], u = e[3];
  t[0] = h * l + u * a + f * c - d * o, t[1] = f * l + u * o + d * a - h * c, t[2] = d * l + u * c + h * o - f * a, t[3] = u * l - h * a - f * o - d * c;
  var g = e[4], _ = e[5], p = e[6], m = e[7];
  return t[4] = g * l + m * a + _ * c - p * o, t[5] = _ * l + m * o + p * a - g * c, t[6] = p * l + m * c + g * o - _ * a, t[7] = m * l - g * a - _ * o - p * c, t;
}
function LM(t, e, n) {
  return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t[2] = e[2] + n[2], t[3] = e[3] + n[3], t[4] = e[4] + n[4], t[5] = e[5] + n[5], t[6] = e[6] + n[6], t[7] = e[7] + n[7], t;
}
function ph(t, e, n) {
  var i = e[0], r = e[1], s = e[2], a = e[3], o = n[4], c = n[5], l = n[6], h = n[7], f = e[4], d = e[5], u = e[6], g = e[7], _ = n[0], p = n[1], m = n[2], E = n[3];
  return t[0] = i * E + a * _ + r * m - s * p, t[1] = r * E + a * p + s * _ - i * m, t[2] = s * E + a * m + i * p - r * _, t[3] = a * E - i * _ - r * p - s * m, t[4] = i * h + a * o + r * l - s * c + f * E + g * _ + d * m - u * p, t[5] = r * h + a * c + s * o - i * l + d * E + g * p + u * _ - f * m, t[6] = s * h + a * l + i * c - r * o + u * E + g * m + f * p - d * _, t[7] = a * h - i * o - r * c - s * l + g * E - f * _ - d * p - u * m, t;
}
var IM = ph;
function UM(t, e, n) {
  return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t[3] = e[3] * n, t[4] = e[4] * n, t[5] = e[5] * n, t[6] = e[6] * n, t[7] = e[7] * n, t;
}
var mh = Ga;
function NM(t, e, n, i) {
  var r = 1 - i;
  return mh(e, n) < 0 && (i = -i), t[0] = e[0] * r + n[0] * i, t[1] = e[1] * r + n[1] * i, t[2] = e[2] * r + n[2] * i, t[3] = e[3] * r + n[3] * i, t[4] = e[4] * r + n[4] * i, t[5] = e[5] * r + n[5] * i, t[6] = e[6] * r + n[6] * i, t[7] = e[7] * r + n[7] * i, t;
}
function FM(t, e) {
  var n = Yr(e);
  return t[0] = -e[0] / n, t[1] = -e[1] / n, t[2] = -e[2] / n, t[3] = e[3] / n, t[4] = -e[4] / n, t[5] = -e[5] / n, t[6] = -e[6] / n, t[7] = e[7] / n, t;
}
function OM(t, e) {
  return t[0] = -e[0], t[1] = -e[1], t[2] = -e[2], t[3] = e[3], t[4] = -e[4], t[5] = -e[5], t[6] = -e[6], t[7] = e[7], t;
}
var gh = Wa, zM = gh, Yr = Xa, BM = Yr;
function HM(t, e) {
  var n = Yr(e);
  if (n > 0) {
    n = Math.sqrt(n);
    var i = e[0] / n, r = e[1] / n, s = e[2] / n, a = e[3] / n, o = e[4], c = e[5], l = e[6], h = e[7], f = i * o + r * c + s * l + a * h;
    t[0] = i, t[1] = r, t[2] = s, t[3] = a, t[4] = (o - i * f) / n, t[5] = (c - r * f) / n, t[6] = (l - s * f) / n, t[7] = (h - a * f) / n;
  }
  return t;
}
function kM(t) {
  return "quat2(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ")";
}
function VM(t, e) {
  return t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3] && t[4] === e[4] && t[5] === e[5] && t[6] === e[6] && t[7] === e[7];
}
function GM(t, e) {
  var n = t[0], i = t[1], r = t[2], s = t[3], a = t[4], o = t[5], c = t[6], l = t[7], h = e[0], f = e[1], d = e[2], u = e[3], g = e[4], _ = e[5], p = e[6], m = e[7];
  return Math.abs(n - h) <= me * Math.max(1, Math.abs(n), Math.abs(h)) && Math.abs(i - f) <= me * Math.max(1, Math.abs(i), Math.abs(f)) && Math.abs(r - d) <= me * Math.max(1, Math.abs(r), Math.abs(d)) && Math.abs(s - u) <= me * Math.max(1, Math.abs(s), Math.abs(u)) && Math.abs(a - g) <= me * Math.max(1, Math.abs(a), Math.abs(g)) && Math.abs(o - _) <= me * Math.max(1, Math.abs(o), Math.abs(_)) && Math.abs(c - p) <= me * Math.max(1, Math.abs(c), Math.abs(p)) && Math.abs(l - m) <= me * Math.max(1, Math.abs(l), Math.abs(m));
}
const WM = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  add: LM,
  clone: dM,
  conjugate: OM,
  copy: uh,
  create: fM,
  dot: mh,
  equals: GM,
  exactEquals: VM,
  fromMat4: _M,
  fromRotation: gM,
  fromRotationTranslation: dh,
  fromRotationTranslationValues: pM,
  fromTranslation: mM,
  fromValues: uM,
  getDual: yM,
  getReal: MM,
  getTranslation: TM,
  identity: vM,
  invert: FM,
  len: zM,
  length: gh,
  lerp: NM,
  mul: IM,
  multiply: ph,
  normalize: HM,
  rotateAroundAxis: DM,
  rotateByQuatAppend: CM,
  rotateByQuatPrepend: PM,
  rotateX: AM,
  rotateY: wM,
  rotateZ: RM,
  scale: UM,
  set: xM,
  setDual: EM,
  setReal: SM,
  sqrLen: BM,
  squaredLength: Yr,
  str: kM,
  translate: bM
}, Symbol.toStringTag, { value: "Module" }));
function _h() {
  var t = new Ne(2);
  return Ne != Float32Array && (t[0] = 0, t[1] = 0), t;
}
function XM(t) {
  var e = new Ne(2);
  return e[0] = t[0], e[1] = t[1], e;
}
function qM(t, e) {
  var n = new Ne(2);
  return n[0] = t, n[1] = e, n;
}
function $M(t, e) {
  return t[0] = e[0], t[1] = e[1], t;
}
function YM(t, e, n) {
  return t[0] = e, t[1] = n, t;
}
function jM(t, e, n) {
  return t[0] = e[0] + n[0], t[1] = e[1] + n[1], t;
}
function vh(t, e, n) {
  return t[0] = e[0] - n[0], t[1] = e[1] - n[1], t;
}
function xh(t, e, n) {
  return t[0] = e[0] * n[0], t[1] = e[1] * n[1], t;
}
function Mh(t, e, n) {
  return t[0] = e[0] / n[0], t[1] = e[1] / n[1], t;
}
function ZM(t, e) {
  return t[0] = Math.ceil(e[0]), t[1] = Math.ceil(e[1]), t;
}
function KM(t, e) {
  return t[0] = Math.floor(e[0]), t[1] = Math.floor(e[1]), t;
}
function JM(t, e, n) {
  return t[0] = Math.min(e[0], n[0]), t[1] = Math.min(e[1], n[1]), t;
}
function QM(t, e, n) {
  return t[0] = Math.max(e[0], n[0]), t[1] = Math.max(e[1], n[1]), t;
}
function ey(t, e) {
  return t[0] = en(e[0]), t[1] = en(e[1]), t;
}
function ty(t, e, n) {
  return t[0] = e[0] * n, t[1] = e[1] * n, t;
}
function ny(t, e, n, i) {
  return t[0] = e[0] + n[0] * i, t[1] = e[1] + n[1] * i, t;
}
function yh(t, e) {
  var n = e[0] - t[0], i = e[1] - t[1];
  return Math.sqrt(n * n + i * i);
}
function Sh(t, e) {
  var n = e[0] - t[0], i = e[1] - t[1];
  return n * n + i * i;
}
function Eh(t) {
  var e = t[0], n = t[1];
  return Math.sqrt(e * e + n * n);
}
function Th(t) {
  var e = t[0], n = t[1];
  return e * e + n * n;
}
function iy(t, e) {
  return t[0] = -e[0], t[1] = -e[1], t;
}
function ry(t, e) {
  return t[0] = 1 / e[0], t[1] = 1 / e[1], t;
}
function sy(t, e) {
  var n = e[0], i = e[1], r = n * n + i * i;
  return r > 0 && (r = 1 / Math.sqrt(r)), t[0] = e[0] * r, t[1] = e[1] * r, t;
}
function ay(t, e) {
  return t[0] * e[0] + t[1] * e[1];
}
function oy(t, e, n) {
  var i = e[0] * n[1] - e[1] * n[0];
  return t[0] = t[1] = 0, t[2] = i, t;
}
function cy(t, e, n, i) {
  var r = e[0], s = e[1];
  return t[0] = r + i * (n[0] - r), t[1] = s + i * (n[1] - s), t;
}
function ly(t, e) {
  e = e === void 0 ? 1 : e;
  var n = Yt() * 2 * Math.PI;
  return t[0] = Math.cos(n) * e, t[1] = Math.sin(n) * e, t;
}
function hy(t, e, n) {
  var i = e[0], r = e[1];
  return t[0] = n[0] * i + n[2] * r, t[1] = n[1] * i + n[3] * r, t;
}
function fy(t, e, n) {
  var i = e[0], r = e[1];
  return t[0] = n[0] * i + n[2] * r + n[4], t[1] = n[1] * i + n[3] * r + n[5], t;
}
function dy(t, e, n) {
  var i = e[0], r = e[1];
  return t[0] = n[0] * i + n[3] * r + n[6], t[1] = n[1] * i + n[4] * r + n[7], t;
}
function uy(t, e, n) {
  var i = e[0], r = e[1];
  return t[0] = n[0] * i + n[4] * r + n[12], t[1] = n[1] * i + n[5] * r + n[13], t;
}
function py(t, e, n, i) {
  var r = e[0] - n[0], s = e[1] - n[1], a = Math.sin(i), o = Math.cos(i);
  return t[0] = r * o - s * a + n[0], t[1] = r * a + s * o + n[1], t;
}
function my(t, e) {
  var n = t[0], i = t[1], r = e[0], s = e[1];
  return Math.abs(Math.atan2(i * r - n * s, n * r + i * s));
}
function gy(t, e) {
  var n = t[0], i = t[1], r = e[0], s = e[1];
  return Math.atan2(n * s - i * r, n * r + i * s);
}
function _y(t) {
  return t[0] = 0, t[1] = 0, t;
}
function vy(t) {
  return "vec2(" + t[0] + ", " + t[1] + ")";
}
function xy(t, e) {
  return t[0] === e[0] && t[1] === e[1];
}
function My(t, e) {
  var n = t[0], i = t[1], r = e[0], s = e[1];
  return Math.abs(n - r) <= me * Math.max(1, Math.abs(n), Math.abs(r)) && Math.abs(i - s) <= me * Math.max(1, Math.abs(i), Math.abs(s));
}
var yy = Eh, Sy = vh, Ey = xh, Ty = Mh, by = yh, Ay = Sh, wy = Th, Ry = (function() {
  var t = _h();
  return function(e, n, i, r, s, a) {
    var o, c;
    for (n || (n = 2), i || (i = 0), r ? c = Math.min(r * n + i, e.length) : c = e.length, o = i; o < c; o += n)
      t[0] = e[o], t[1] = e[o + 1], s(t, t, a), e[o] = t[0], e[o + 1] = t[1];
    return e;
  };
})();
const Cy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  add: jM,
  angle: my,
  ceil: ZM,
  clone: XM,
  copy: $M,
  create: _h,
  cross: oy,
  dist: by,
  distance: yh,
  div: Ty,
  divide: Mh,
  dot: ay,
  equals: My,
  exactEquals: xy,
  floor: KM,
  forEach: Ry,
  fromValues: qM,
  inverse: ry,
  len: yy,
  length: Eh,
  lerp: cy,
  max: QM,
  min: JM,
  mul: Ey,
  multiply: xh,
  negate: iy,
  normalize: sy,
  random: ly,
  rotate: py,
  round: ey,
  scale: ty,
  scaleAndAdd: ny,
  set: YM,
  signedAngle: gy,
  sqrDist: Ay,
  sqrLen: wy,
  squaredDistance: Sh,
  squaredLength: Th,
  str: vy,
  sub: Sy,
  subtract: vh,
  transformMat2: hy,
  transformMat2d: fy,
  transformMat3: dy,
  transformMat4: uy,
  zero: _y
}, Symbol.toStringTag, { value: "Module" })), Py = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  glMatrix: v_,
  mat2: G_,
  mat2d: uv,
  mat3: Gv,
  mat4: Ix,
  quat: hM,
  quat2: WM,
  vec2: Cy,
  vec3: g1,
  vec4: H1
}, Symbol.toStringTag, { value: "Module" })), Dy = 64;
function bh(t, e, n, i, r, s = 0) {
  if (t.length === 0) return null;
  if (t.length === 1) {
    const m = t[0];
    return {
      cx: m.x,
      cy: m.y,
      cz: m.z,
      count: 1,
      size: r,
      children: null,
      point: m
    };
  }
  if (s >= Dy) {
    let m = 0, E = 0, M = 0;
    for (const P of t)
      m += P.x, E += P.y, M += P.z;
    const x = t.length;
    return { cx: m / x, cy: E / x, cz: M / x, count: x, size: r, children: null, point: null };
  }
  const a = e + r, o = n + r, c = i + r, l = r / 2, h = [[], [], [], [], [], [], [], []];
  for (const m of t) {
    let E = 0;
    m.x >= a && (E |= 1), m.y >= o && (E |= 2), m.z >= c && (E |= 4), h[E].push(m);
  }
  let f = 0, d = 0, u = 0, g = 0;
  const _ = [], p = [
    [0, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
    [1, 1, 0],
    [0, 0, 1],
    [1, 0, 1],
    [0, 1, 1],
    [1, 1, 1]
  ];
  for (let m = 0; m < 8; m++) {
    const E = h[m];
    if (E.length === 0) continue;
    const [M, x, P] = p[m], b = e + M * r, A = n + x * r, R = i + P * r, S = bh(E, b, A, R, l, s + 1);
    _.push(S), f += S.cx * S.count, d += S.cy * S.count, u += S.cz * S.count, g += S.count;
  }
  return {
    cx: f / g,
    cy: d / g,
    cz: u / g,
    count: g,
    size: r,
    children: _,
    point: null
  };
}
function Ma(t, e, n, i, r, s, a, o) {
  if (t === null) return;
  const c = t.cx - e, l = t.cy - n, h = t.cz - i, f = c * c + l * l + h * h;
  if (f < 1e-20) {
    if (t.children)
      for (const g of t.children)
        Ma(g, e, n, i, r, s, a, o);
    return;
  }
  const d = Math.sqrt(f);
  if (t.point !== null) {
    if (t.point.index === r) return;
    const g = s / f;
    o.fx -= c * g, o.fy -= l * g, o.fz -= h * g;
    return;
  }
  if (t.size / d < a || t.children === null) {
    const g = s * t.count / f;
    o.fx -= c * g, o.fy -= l * g, o.fz -= h * g;
    return;
  }
  for (const g of t.children)
    Ma(g, e, n, i, r, s, a, o);
}
const { vec3: Et } = Py, Ly = {
  simulationBound: 1e3,
  cohesionValue: 1,
  repulsionValue: 1,
  centerPull: 0.1,
  iterationsPerStep: 1,
  useOctree: !0,
  octreeThreshold: 64,
  octreeTheta: 0.8
};
function Xy(t, e = {}) {
  const n = { ...Ly, ...e };
  lt(n.simulationBound, "simulationBound", 0), lt(n.cohesionValue, "cohesionValue"), lt(n.repulsionValue, "repulsionValue"), lt(n.centerPull, "centerPull"), lt(n.octreeTheta, "octreeTheta", 0), Pn(n.iterationsPerStep, "iterationsPerStep", 1), Pn(n.octreeThreshold, "octreeThreshold", 1);
  const i = t.get_node_ids_order(), r = i.length, s = t.get_adjacency(), a = /* @__PURE__ */ new Map();
  i.forEach((g, _) => a.set(g, _));
  const o = new Float32Array(r * 3);
  for (let g = 0; g < r; g++)
    o[g * 3] = Math.random() * n.simulationBound, o[g * 3 + 1] = Math.random() * n.simulationBound, o[g * 3 + 2] = Math.random() * n.simulationBound;
  const c = {
    force: Et.create(),
    diff: Et.create(),
    neighborAvg: Et.create(),
    posI: Et.create(),
    posJ: Et.create()
  }, l = n.useOctree && r >= n.octreeThreshold, h = l ? Array.from({ length: r }, (g, _) => ({
    x: 0,
    y: 0,
    z: 0,
    index: _
  })) : [];
  function f(g) {
    const _ = Math.max(1, n.iterationsPerStep);
    for (let p = 0; p < _; p++) {
      let m = null;
      if (l) {
        let E = 1 / 0, M = 1 / 0, x = 1 / 0, P = -1 / 0, b = -1 / 0, A = -1 / 0;
        for (let L = 0; L < r; L++) {
          const D = o[L * 3], W = o[L * 3 + 1], V = o[L * 3 + 2];
          h[L].x = D, h[L].y = W, h[L].z = V, D < E && (E = D), D > P && (P = D), W < M && (M = W), W > b && (b = W), V < x && (x = V), V > A && (A = V);
        }
        const R = 1e-6, S = Math.max(P - E, b - M, A - x, R) / 2 + R, v = (E + P) / 2, C = (M + b) / 2, F = (x + A) / 2;
        m = bh(
          h,
          v - S,
          C - S,
          F - S,
          S
        );
      }
      for (let E = 0; E < r; E++) {
        Et.set(
          c.posI,
          o[E * 3],
          o[E * 3 + 1],
          o[E * 3 + 2]
        ), Et.set(c.force, 0, 0, 0);
        const M = s.get(i[E]);
        if (M.length > 0) {
          c.neighborAvg[0] = 0, c.neighborAvg[1] = 0, c.neighborAvg[2] = 0;
          for (const x of M) {
            const P = a.get(x);
            P !== void 0 && (c.neighborAvg[0] += o[P * 3], c.neighborAvg[1] += o[P * 3 + 1], c.neighborAvg[2] += o[P * 3 + 2]);
          }
          c.neighborAvg[0] /= M.length, c.neighborAvg[1] /= M.length, c.neighborAvg[2] /= M.length, Et.subtract(c.diff, c.neighborAvg, c.posI), Et.scale(c.diff, c.diff, n.cohesionValue), Et.add(c.force, c.force, c.diff);
        }
        if (l && m) {
          const x = { fx: 0, fy: 0, fz: 0 };
          Ma(
            m,
            c.posI[0],
            c.posI[1],
            c.posI[2],
            E,
            n.repulsionValue,
            n.octreeTheta,
            x
          ), c.force[0] += x.fx, c.force[1] += x.fy, c.force[2] += x.fz;
        } else
          for (let x = 0; x < r; x++) {
            if (x === E) continue;
            Et.set(
              c.posJ,
              o[x * 3],
              o[x * 3 + 1],
              o[x * 3 + 2]
            ), Et.subtract(c.diff, c.posJ, c.posI);
            const P = Et.squaredLength(c.diff);
            P < 1e-10 || (Et.scale(c.diff, c.diff, n.repulsionValue / P), Et.subtract(c.force, c.force, c.diff));
          }
        c.force[0] -= n.centerPull * c.posI[0], c.force[1] -= n.centerPull * c.posI[1], c.force[2] -= n.centerPull * c.posI[2], o[E * 3] += c.force[0], o[E * 3 + 1] += c.force[1], o[E * 3 + 2] += c.force[2];
      }
    }
  }
  function d() {
    return o;
  }
  function u() {
    const g = /* @__PURE__ */ new Map();
    for (let _ = 0; _ < r; _++)
      g.set(
        i[_],
        new mt(o[_ * 3], o[_ * 3 + 1], o[_ * 3 + 2])
      );
    return g;
  }
  return { step: f, getPositions: d, getPositionMap: u };
}
const Iy = {
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
function Uy(t, e) {
  const { i: n, j: i, d: r } = t;
  for (let s = r.length - 1; s >= 1; s--) {
    const a = Math.floor(e() * (s + 1));
    let o = n[s];
    n[s] = n[a], n[a] = o, o = i[s], i[s] = i[a], i[a] = o;
    const c = r[s];
    r[s] = r[a], r[a] = c;
  }
}
function Ny(t) {
  let e = t & 2147483647;
  return () => (e = Math.imul(e, 1103515245) + 12345 & 2147483647, e / 2147483648);
}
function Fy(t, e, n) {
  const i = e.length, r = t.get_adjacency(), s = e.map((u) => {
    const g = [];
    for (const _ of r.get(u)) {
      const p = n.get(_);
      p !== void 0 && g.push(p);
    }
    return Uint32Array.from(g);
  }), a = new Int32Array(i), o = new Uint32Array(i), c = (u) => {
    a.fill(-1), a[u] = 0, o[0] = u;
    for (let g = 0, _ = 1; g < _; g++) {
      const p = o[g];
      for (const m of s[p])
        a[m] === -1 && (a[m] = a[p] + 1, o[_++] = m);
    }
  }, l = new Int32Array(i).fill(-1);
  let h = 0;
  for (let u = 0; u < i; u++) {
    if (l[u] !== -1) continue;
    c(u);
    let g = 0;
    for (let _ = 0; _ < i; _++)
      a[_] >= 0 && (l[_] = u, g++);
    h += g * (g - 1) / 2;
  }
  const f = {
    i: new Uint32Array(h),
    j: new Uint32Array(h),
    d: new Float32Array(h)
  };
  let d = 0;
  for (let u = 0; u < i; u++) {
    c(u);
    for (let g = u + 1; g < i; g++)
      a[g] > 0 && (f.i[d] = u, f.j[d] = g, f.d[d] = a[g], d++);
  }
  return f;
}
async function qy(t, e = {}) {
  const n = {
    ...Iy,
    ...e,
    seed: e.seed ?? Math.floor(Math.random() * 2147483647)
  };
  if (n.dimensions !== 2 && n.dimensions !== 3) throw new RangeError("dimensions must be 2 or 3");
  Pn(n.epochsPerStep, "epochsPerStep", 1), Pn(n.tMax, "tMax", 1), Pn(n.seed, "seed", -Number.MAX_SAFE_INTEGER), lt(n.simulationBound, "simulationBound", 0), lt(n.centerPull, "centerPull"), lt(n.scaleBound, "scaleBound", 0), lt(n.learningRate, "learningRate", 0), lt(n.eps, "eps", Number.MIN_VALUE, 1), lt(n.initialPreservation, "initialPreservation", 0, 1);
  const i = t.get_node_ids_order(), r = i.length;
  if (n.initialPositions) {
    if (n.initialPositions.length !== r * 3) throw new RangeError("initialPositions must contain n * 3 coordinates");
    for (const A of n.initialPositions) lt(A, "initialPositions coordinate");
  }
  const s = /* @__PURE__ */ new Map();
  i.forEach((A, R) => s.set(A, R));
  const a = Fy(t, i, s), o = a.d.length;
  let c = 1 / 0, l = -1 / 0;
  for (let A = 0; A < o; A++) {
    const R = 1 / (a.d[A] * a.d[A]);
    R < c && (c = R), R > l && (l = R);
  }
  (c <= 0 || l <= 0) && (c = 1), l <= 0 && (l = 1);
  const h = 1 / c, f = n.eps / l, d = n.tMax > 1 ? Math.log(h / f) / (n.tMax - 1) : 0, u = (A) => h * Math.exp(-d * A), g = n.dimensions, _ = Ny(n.seed), p = new Float32Array(r * 3);
  let m = null;
  if (n.initialPositions && n.initialPositions.length >= r * 3) {
    if (p.set(n.initialPositions.subarray(0, r * 3)), n.initialPreservation > 0 && (m = new Float32Array(n.initialPositions.subarray(0, r * 3))), g === 2)
      for (let A = 0; A < r; A++) p[A * 3 + 2] = 0;
  } else {
    const A = n.simulationBound;
    for (let R = 0; R < r; R++)
      p[R * 3] = _() * A, p[R * 3 + 1] = _() * A, p[R * 3 + 2] = g === 2 ? 0 : _() * A;
  }
  let E = 0;
  const M = 1e-12;
  function x(A) {
    const R = Math.max(1, n.epochsPerStep), S = E;
    for (let v = 0; v < R && E < n.tMax; v++) {
      const C = n.useSchedule ? u(E) : n.learningRate;
      E++, Uy(a, _);
      for (let F = 0; F < o; F++) {
        const L = a.i[F], D = a.j[F], W = a.d[F];
        let V = C / (W * W);
        V > 1 && (V = 1);
        const K = p[L * 3] - p[D * 3], G = p[L * 3 + 1] - p[D * 3 + 1], te = g === 3 ? p[L * 3 + 2] - p[D * 3 + 2] : 0, ae = Math.max(Math.sqrt(K * K + G * G + te * te), M), de = V * (ae - W) / (2 * ae);
        p[L * 3] -= de * K, p[L * 3 + 1] -= de * G, g === 3 && (p[L * 3 + 2] -= de * te), p[D * 3] += de * K, p[D * 3 + 1] += de * G, g === 3 && (p[D * 3 + 2] += de * te);
      }
    }
    if (E !== S) {
      if (n.initialPreservation > 0 && m) {
        const v = n.initialPreservation;
        for (let C = 0; C < r * 3; C++)
          p[C] = (1 - v) * p[C] + v * m[C];
      }
      if (n.centerPull > 0)
        for (let v = 0; v < r; v++)
          p[v * 3] -= n.centerPull * p[v * 3], p[v * 3 + 1] -= n.centerPull * p[v * 3 + 1], g === 3 && (p[v * 3 + 2] -= n.centerPull * p[v * 3 + 2]);
      if (n.scaleBound > 0 && r > 0) {
        let v = 0, C = 0, F = 0;
        for (let D = 0; D < r; D++)
          v += p[D * 3], C += p[D * 3 + 1], F += p[D * 3 + 2];
        v /= r, C /= r, F /= r;
        let L = 0;
        for (let D = 0; D < r; D++) {
          p[D * 3] -= v, p[D * 3 + 1] -= C, p[D * 3 + 2] -= F;
          const W = Math.sqrt(
            p[D * 3] ** 2 + p[D * 3 + 1] ** 2 + (g === 3 ? p[D * 3 + 2] ** 2 : 0)
          );
          W > L && (L = W);
        }
        if (L > 0) {
          const D = n.scaleBound / L;
          for (let W = 0; W < r * 3; W++) p[W] *= D;
        }
      }
      if (g === 2)
        for (let v = 0; v < r; v++) p[v * 3 + 2] = 0;
    }
  }
  function P() {
    return p;
  }
  function b() {
    const A = /* @__PURE__ */ new Map();
    for (let R = 0; R < r; R++)
      A.set(
        i[R],
        new mt(p[R * 3], p[R * 3 + 1], p[R * 3 + 2])
      );
    return A;
  }
  return { step: x, getPositions: P, getPositionMap: b };
}
export {
  Uh as Constructors,
  Jh as Drawing,
  _n as Edge,
  Yi as Geometry,
  nn as Graph,
  Hy as GraphDrawer,
  Sc as GraphMethods,
  Vy as Hierarchy,
  $i as Line,
  ky as Models,
  mt as Point,
  zy as SampleData,
  By as ThreeWrapper,
  Ct as Utilities,
  Nn as _Node,
  Xy as createKamadaKawai3D,
  qy as createStressSGD3D,
  Py as glMatrix,
  Gy as matrixVectorMultiply,
  Wy as normalizeVector
};
//# sourceMappingURL=pgl_standalone.js.map
