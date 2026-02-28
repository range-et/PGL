# PGL Cheat Sheet

Quick reference for [plebeiangraphlibrary](https://www.plebeiangraphlibrary.com/). Everything on one page, optimized for copy-paste and LLM context.

```javascript
import * as PGL from "plebeiangraphlibrary";
```

---

## The 5-Step Pipeline (always in this order)

```
1. Get a Graph           LoadZKCSimulated() / LoadZKC() / LoadDwt1005()
                         LoadGraphFromEdgeListText(text)
                         new Graph() + add_node/add_edge + await G.initialize()
                         GenerateErdosReyni_n_p(n, p) + await G.initialize()

2. Create renderer       new PGL.GraphDrawer.GraphDrawer3d({ graph, canvas, width, height })

3. Init (async)          await graph3d.init()

4. Draw + add to scene   const nodes = PGL.ThreeWrapper.Draw...(G, ...)
                         graph3d.addVisElement(nodes)
                         // interaction goes here, after addVisElement:
                         graph3d.enableInteraction({ graph: G, onNodeClick: (d) => ... })

5. Animate               function animate() { requestAnimationFrame(animate); graph3d.rendercall(); }
                         animate()
```

---

## Static vs. Mutable Draw Calls

| | Static (one-shot) | Mutable (live animation) |
|---|---|---|
| Nodes (billboard) | `DrawTHREEGraphVertices(G, bounds, size, color, opacity)` → `Group` | `DrawTHREEGraphVerticesMutable(G, bounds, size, color, opacity)` → `{ group, updatePositions(Float32Array) }` |
| Nodes (box) | `DrawTHREEBoxBasedVertices(G, bounds, color, size)` → `Group` | `DrawTHREEBoxBasedVerticesMutable(G, bounds, color, size)` → `{ group, updatePositions(Float32Array) }` |
| Edges (thick) | `DrawTHREEGraphEdgesThick(G, bounds, color, width)` → `Group` | — |
| Edges (thin) | `DrawTHREEGraphEdgesThin(G, bounds, color)` → `Group` | `DrawTHREEGraphEdgesThinMutable(G, bounds, color)` → `{ group, updateEdges() }` |

**Rule:** If positions change after draw time, use the `Mutable` variant.

---

## SampleData

| Function | Returns | Notes |
|---|---|---|
| `LoadZKCSimulated()` | `Graph` (initialized, positions baked) | Best for quick demos — no layout step needed |
| `LoadZKC()` | `Graph` (initialized, random positions) | Run `SimulateKamadaKawai` before drawing |
| `LoadDwt1005()` | `Graph` (initialized) | 1005-node structural graph, lazy-loaded |
| `LoadGraphFromEdgeListText(text)` | `Graph` (initialized) | Space-separated `nodeA nodeB` per line |
| `LoadGraphFromObjText(objText)` | `{ graph, positions: Float32Array }` | OBJ mesh → graph. Use positions as `initialPositions` for StressSGD |

---

## Graph (class)

```javascript
const G = new PGL.Graph();           // empty graph
const G = await PGL.Graph.create(nodes, edges);  // from arrays, auto-initialized

G.add_node(id, { pos: { x, y, z }, ...yourData })
G.add_edge(startId, endId, data?)
G.remove_node(id)
G.remove_edge(id)

await G.initialize()                 // REQUIRED after manual builds — loaders do this for you

G.get_position_map()                 // Map<nodeId, PointLike> — current node positions
G.apply_position_map(map)            // write positions back to nodes
G.get_edge_map()                     // Map<edgeId, { ldata: Point[] }> — edge geometry
G.apply_edge_pos_maps(map)           // write edge geometry back
G.apply_drawing_maps({ pmap, emap }) // shorthand for both apply calls
G.get_map()                          // { pmap, emap } shorthand

G.get_adjacency()                    // Map<nodeId, nodeId[]> — sparse adjacency
G.get_adjacency_matrix()             // { matrix: Float32Array (row-major n×n), nodeIds: number[] }
G.get_node_ids_order()               // number[] — stable node ID ordering

G.nodes                              // Map<nodeId, _Node>
G.edges                              // Map<edgeId, Edge>
G.printData()                        // console-log summary
```

---

## GraphDrawer3d (renderer)

```javascript
const graph3d = new PGL.GraphDrawer.GraphDrawer3d({ graph, canvas, width, height });
await graph3d.init();

graph3d.addVisElement(group)         // add a THREE.Group to the scene
graph3d.rendercall()                 // call every frame inside requestAnimationFrame

graph3d.enableInteraction(options)   // see Interaction section below
graph3d.disableInteraction()

// Direct Three.js access:
graph3d.scene        // THREE.Scene
graph3d.camera       // THREE.PerspectiveCamera
graph3d.controls     // OrbitControls  (controls.autoRotate = false to disable spin)
```

---

## Drawing (layout & edge geometry)

```javascript
// Static layout — returns a position map, then you apply it
const posMap = PGL.Drawing.SimulateKamadaKawai(G, iterations, bound?, cohesion?, repulsion?)
G.apply_position_map(posMap)

// Edge geometry — always run after setting positions
const lmap = PGL.Drawing.DrawEdgeLinesDivisions(G, numDivisions)  // recommended
const lmap = PGL.Drawing.DrawEdgeLines(G, divDistance)
G.apply_edge_pos_maps(lmap)

// Edge bundling (async)
const bundled = await PGL.Drawing.DrawEdgeBundling(lmap, iterations, distance)
G.apply_edge_pos_maps(bundled)

PGL.Drawing.DisplaceEdgeInY(lmap, displacement)   // arc-lift edges
PGL.Drawing.DisplaceVertices(G, parameterKey, maxDisplacement)
PGL.Drawing.MoveGraph(G, displacement)            // translate all nodes
PGL.Drawing.InstanciateRandomPositions(G)         // randomize node positions
PGL.Drawing.HivePlot(G, selectedNode, step, startPosition)
```

---

## ThreeWrapper (geometry factories)

```javascript
// Nodes
PGL.ThreeWrapper.DrawTHREEGraphVertices(G, bounds, size, color, opacity)          → Group  ⚠️ needs ./Textures/Square.png
PGL.ThreeWrapper.DrawTHREEBoxBasedVertices(G, bounds, color, size)                → Group
PGL.ThreeWrapper.DrawTHREEGraphVerticesMutable(G, bounds, size, color, opacity)   → { group, updatePositions(Float32Array) }
PGL.ThreeWrapper.DrawTHREEBoxBasedVerticesMutable(G, bounds, color, size)         → { group, updatePositions(Float32Array) }
PGL.ThreeWrapper.AddBoxBasedImaging(G, bounds, imageUrl, size)                    → Group  (image-textured nodes)

// Edges
PGL.ThreeWrapper.DrawTHREEGraphEdgesThick(G, bounds, color, width)                → Group
PGL.ThreeWrapper.DrawTHREEGraphEdgesThin(G, bounds, color)                        → Group
PGL.ThreeWrapper.DrawTHREEGraphEdgesThinMutable(G, bounds, color)                 → { group, updateEdges() }
PGL.ThreeWrapper.DrawThickEdgesFromEdgeMap(edgeMap, bounds, color, width)         → Group
PGL.ThreeWrapper.DrawThinEdgesFromEdgeMap(edgeMap, bounds, color)                 → Group
PGL.ThreeWrapper.DrawSimplifiedEdges(G, bounds, color)                            → Group

// Color
PGL.ThreeWrapper.ChangeTheVertexColours(mesh, nodeIds[], color)  // ⚠️ pass .children[0], not the Group
PGL.ThreeWrapper.ResetVertexColors(mesh)                         // ⚠️ same — pass .children[0]

// Paths & groups
PGL.ThreeWrapper.DrawThickPathFromNodeIds(G, bounds, nodeIds[], color, width)     → Group
PGL.ThreeWrapper.AddInModularityBasedPointGroups(G, "modularity")                 → Group
```

---

## Interaction (opt-in)

Call **after** all `addVisElement()` calls.

```javascript
graph3d.enableInteraction({
  graph: G,                                         // required

  onNodeClick:  (d: NodePickDetails) => void,       // optional
  onEdgeClick:  (d: EdgePickDetails) => void,       // optional
  onNodeHover:  (d: NodePickDetails | null) => void, // null when cursor leaves
  onEdgeHover:  (d: EdgePickDetails | null) => void,

  hoverEnabled: true,                               // default true; set false to skip hover raycasting
  enableNodeDrag: false,                            // enable drag-to-reposition
  onNodeDrag: (nodeId: number, newPos: PointLike) => void,  // update node + call updatePositions/updateEdges
  controls: graph3d.controls,                       // auto-passed; pauses orbit during drag
})
```

**NodePickDetails:** `{ nodeId, data, neighbours: number[], position: PointLike }`
**EdgePickDetails:** `{ edgeId, start, end, data }`

**Tips:**
- Thick edges are easier to pick than thin lines
- Set `graph3d.controls.autoRotate = false` for interactive demos
- `onNodeHover` fires with `null` when the pointer leaves a node — use this to hide tooltips

---

## Simulation (live layout)

### Kamada–Kawai

```javascript
const sim = PGL.createKamadaKawai3D(G, {
  simulationBound: 500,    // world-space radius
  cohesionValue: 1,        // spring attraction
  repulsionValue: 1,       // node repulsion
  centerPull: 0.1,         // pull toward origin
  iterationsPerStep: 1,    // layout steps per call to step()
  useOctree: true,         // Barnes-Hut approximation (faster for large graphs)
  octreeTheta: 0.5,
})

// In the animation loop:
sim.step(deltaTimeSeconds)
sim.getPositions()       // Float32Array [x0,y0,z0, x1,y1,z1, ...]
sim.getPositionMap()     // Map<nodeId, PointLike>
```

### Stress SGD

```javascript
const sim = await PGL.createStressSGD3D(G, {
  dimensions: 2,                    // 2 or 3
  initialPositions: Float32Array?,  // seed positions (e.g. from LoadGraphFromObjText)
  epochsPerStep: 1,
  tMax: 30,
  eps: 0.1,
  scaleBound: 500,
  initialPreservation: false,
})
// Same step / getPositions / getPositionMap API as Kamada–Kawai
```

---

## GraphMethods (algorithms)

```javascript
PGL.GraphMethods.BFSSearch(G, startNodeId)      → Map<nodeId, exploredFromId>
PGL.GraphMethods.Dijkstra(G, startNodeId)        → Map<nodeId, hopCount>  ⚠️ hop-count only, not weighted
PGL.GraphMethods.GraphDiameter(G)                → { start, end, distance }
PGL.GraphMethods.SelectSubgraph(G, nodeIds[])    → Graph
```

---

## Hierarchy (LOD / clustering)

```javascript
PGL.Hierarchy.clusterByDistance(G, { distanceThreshold: 25 })  → Graph (super-nodes)
PGL.Hierarchy.clusterByStrategy(G, strategy)                    → Graph
```

---

## Models (graph generators)

```javascript
const G = PGL.Models.GenerateErdosReyni_n_p(n, p)  // random graph
await G.initialize()                                 // ⚠️ required — generator does not auto-initialize
```

---

## Constructors

```javascript
PGL.Constructors.ConstructGraphNodeEdgesList(nodes, edges)  → Graph
```

---

## Matrix helpers

```javascript
PGL.MatrixHelpers.matrixVectorMultiply(A, n, x, out)  // dense n×n Float32Array matrix × vector
PGL.MatrixHelpers.normalizeVector(x)                  // normalize Float32Array in place
```

---

## Key Types

```typescript
PointLike     = { x: number; y: number; z: number }
Point         // class with x, y, z and translate()

NodeData      = { pos?: PointLike; [key: string]: any }
EdgeData      = { ldata?: Point[]; [key: string]: any }

NodePickDetails = { nodeId: number; data: NodeData; neighbours: number[]; position: PointLike }
EdgePickDetails = { edgeId: number; start: number; end: number; data: EdgeData }

InteractionOptions   // full options object for enableInteraction()
KamadaKawai3DOptions // options for createKamadaKawai3D()
StressSGD3DOptions   // options for createStressSGD3D()
```

---

## Common Footguns at a Glance

| ⚠️ | Fix |
|---|---|
| `ChangeTheVertexColours(group, ...)` — colors don't change | Use `group.children[0]` (inner instanced mesh) |
| `GenerateErdosReyni_n_p(n, p)` then BFS returns wrong results | Add `await G.initialize()` before any algorithm or draw |
| `DrawTHREEGraphVertices` invisible in bundler projects | Texture `./Textures/Square.png` needs to be in public folder; or use `DrawTHREEBoxBasedVertices` |
| `enableInteraction()` callbacks never fire | Call it **after** all `addVisElement()` calls |
| `Dijkstra` gives wrong results for weighted graphs | It returns hop counts (BFS), not weighted distances |
| Static draw call positions don't update | Use `Mutable` variants + call `updatePositions()` / `updateEdges()` each frame |
