# Changelog

All notable changes to the Plebeian Graph Library (PGL) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **npm build no longer bundles three.js or gl-matrix** — `pgl_module.js` / `pgl.js` import them (757 KB → ~90 KB), so apps share one three.js instance. The new **`Build/pgl_standalone.js`** bundles three.js for use without a bundler; the Examples use it.
- **GenerateErdosReyni_n_p** — Samples each unordered pair once (it produced about twice the expected edges, with duplicates) and returns an initialized graph.
- **DrawTHREEGraphVertices / DrawTHREEGraphVerticesMutable** — The `color` argument is applied (vertices were always white) and `alpha` is opacity.
- **Edge drawing** — Thin and thick edges render as a single object each (one draw call). Each group now holds one `LineSegments` / `Mesh` instead of one object per edge; the edge ID for a hit is in `userData.segmentEdgeIds`. Thick-line width follows the canvas size.
- **createStressSGD3D** — Much faster, lower-memory setup. The random generator was fixed, so layouts for a given `seed` differ from earlier versions. Positions no longer change once the schedule has finished.
- **GraphDrawer3d** — Constructor accepts the documented `{ graph, canvas, width, height }` in TypeScript.

### Fixed

- `new Graph()` with more than ~100k edges threw `RangeError`.
- `SelectSubgraph` modified the parent graph's neighbour lists and leaked outside neighbours into the subgraph.
- Edge-list, OBJ and DWT loaders gave every node the same position object.
- Kamada–Kawai (octree) overflowed the stack when two nodes shared a position.
- `MoveGraph` threw after `DrawEdgeBundling` / `DisplaceEdgeInY`.
- `HivePlot` threw on disconnected graphs.
- Distance clustering overflowed the stack on large clusters.
- Edge lines were interpolated end → start.
- `rgbToHex` produced invalid output for non-integer components.
- `BFSSearch` threw on edges to missing nodes; `BFSSearch` / `Dijkstra` were quadratic on long paths.
- Node dragging did nothing with `hoverEnabled: false`.
- Thick edges could not be picked by clicks or hover.

## [2.2.2] - 2025-02-28

### Added

- **remove_node(nodeId)** — Remove a node and all incident edges. Updates adjacency lists for remaining nodes. Returns `true` if the node existed and was removed.
- **remove_edge(edgeId)** — Remove an edge by ID. Updates adjacency lists. Returns `true` if the edge existed and was removed.
- **NodeData** and **EdgeData** types — Exported for typed node/edge data when using add_node and add_edge.
- **exports** field in package.json — Cleaner ESM/CJS resolution for bundlers.

### Changed

- **add_edge** — Uses internal edge ID counter to avoid collisions when edges are removed.
- **LoadDwt1005** — Now lazy-loaded via dynamic import; DWT 1005 dataset is in a separate chunk and only loaded when called (reduces main bundle size).
- **get_position_map** — Skips nodes without `data.pos` instead of returning undefined.
- **constructAdjacencyList** — Added `await Promise.resolve()` between passes to yield to the event loop on large graphs.
- **4_ToggleActivation.html** — Fixed missing `await` on `G.initialize()`.

### Fixed

- Edge ID collisions when removing and re-adding edges (now uses monotonic counter).
- Potential browser hang during adjacency construction on very large graphs (yield point added).

[2.2.2]: https://github.com/range-et/PGL/compare/v2.2.1...v2.2.2
