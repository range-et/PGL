# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Plebeian Graph Library (PGL) — a TypeScript/WebGL network visualization library built on Three.js. Renders large-scale graphs (5000+ nodes, 200k edges) at interactive frame rates in the browser. Provides NetworkX-style graph APIs, layout algorithms, and an interaction layer.

## Build & Development Commands

```bash
npm run build          # Build library → Build/pgl.js (CJS) + Build/pgl_module.js (ESM)
npm run watch          # Watch mode for development
npm run test:unit      # Run Vitest unit tests
npm run test:unit:watch # Watch mode for unit tests
npm run test           # Visual regression tests (Puppeteer + pixelmatch)
npm run document       # Generate TypeDoc API docs to docs/
npm run build:all      # Build + generate docs
npm run serve          # Python HTTP server on port 3000 (for examples)
```

## Architecture

**Core data model** (`Src/Core/`): `Graph` holds `Map<string, _Node>` and `Map<string, Edge>`. The `_Node` class is underscore-prefixed to avoid Node.js naming collision. Graphs require `await G.initialize()` after construction or mutation.

**Rendering pipeline** (`Src/Drawing/`):
- `GraphDrawer3d` — main renderer wrapping Three.js scene, camera, controls
- `ThreeJSDrawer` — static factory functions for creating visual elements (boxes, planes, cylinders, points, lines)
- `InteractionLayer` — opt-in click/hover/drag callbacks, must be enabled after `addVisElement()`
- Static draw calls produce fixed geometry; Mutable variants return updater functions for animation

**Layout algorithms** (`Src/Simulation/`): Kamada-Kawai 3D and Stress SGD 3D, both supporting live simulation via `step(deltaTime)`.

**Graph algorithms** (`Src/GraphAlgorithms/`): BFS, Dijkstra (hop-count only, not weighted), subgraph selection, diameter.

**Hierarchy** (`Src/Hierarchy/`): Distance-based clustering for LOD.

## 5-Step Pipeline

Every PGL visualization follows this order — getting it wrong is the most common bug source:

1. **Load/build** a Graph (and `await G.initialize()` if manually built)
2. **Create** `GraphDrawer3d({ graph, canvas, width, height })`
3. **Init** `await graph3d.init()`
4. **Draw & add** visual elements via `addVisElement()`, then optionally `enableInteraction()`
5. **Animate** with `requestAnimationFrame` loop calling `graph3d.rendercall()`

## Key Terminology

- `_Node` / `Edge` = abstract graph; `Vertices` / `Lines` = 3D visual equivalents
- `Point` = 3D vector class; `PointLike` = plain `{ x, y, z }` interface

## Testing

- Unit tests: `test/unit/*.test.ts` (Vitest) — cover Graph, Simulation, MatrixHelpers, Utilities
- Visual regression: `test/test_1.js` (Puppeteer screenshots compared with pixelmatch)
- CI runs on GitHub Actions (Ubuntu, Node 20): build → test:unit

## Dependencies

- **Runtime:** `three` (3D rendering), `gl-matrix` (linear algebra)
- **Build:** Vite 6 with `vite-plugin-dts` for declaration generation
- Path alias: `@` → `Src/`

## Common Pitfalls

- `new Graph()` requires `new Graph(new Map(), new Map())`, not empty constructor
- `add_node()` requires a `_Node` instance, not a plain object
- `ChangeTheVertexColours` expects `.children[0]` (inner mesh), not the Group
- `LoadDwt1005()` and `GenerateErdosReyni_n_p()` are async — must `await`
- Texture-based draw calls may fail in bundler projects; use `DrawTHREEBoxBasedVertices` instead
