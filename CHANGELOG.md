# Changelog

All notable changes to the Plebeian Graph Library (PGL) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
