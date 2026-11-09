# Contributing to Plebeian Graph Library (PGL)

First off, thank you for considering contributing to PGL! It's people like you that make the open source community such a great place. Here are some guidelines to help you get started.

## How to Contribute
### Reporting Issues

If you find a bug or have a suggestion for a new feature or enhancement, I would love to hear about it! Before you submit an issue, please check to make sure it hasn't already been reported. Here's how you can report an issue:

- Go to the Issues section of our GitHub repository.
- Click on 'New Issue'.
- Write a clear title and a detailed description. For bugs, it's helpful to include:
    * Steps to reproduce
    * Expected and actual behavior
    * Screenshots or error messages
    * Your environment (browser, OS, etc.)

### Submitting Changes

Use GitHub issues as the backlog: triage the relevant issue, establish its scope
and acceptance criteria, then complete and verify the work. Once finished, record
the delivered behavior and verification results in [features.md](features.md),
with a link to the issue and any compatibility notes. Keep unfinished work in
GitHub issues rather than the completed-work log.

Changes are accepted via Pull Requests (PRs) on GitHub. Here’s how you make a PR:

1. Fork the PGL repository.
1. Clone your fork to your local machine.
1. Create a new branch.
1. Make your changes. Please keep your code as clean and well-organized as possible.
1. Test your changes.
1. Commit your changes. Write a clear, descriptive commit message.
1. Push your changes to your fork on GitHub.
1. From your fork, make a Pull Request to the PGL main branch.
1. In your pull request, describe what your changes do and mention any relevant issue numbers.

Please adhere to the coding conventions used throughout the project (indentation, accurate comments, etc.).

### Seeking Support

If you need help or have any questions about contributing, please open an issue in the GitHub Issues. I'd be happy to help!

### Improving Documentation

Good documentation is as important as the code itself. If you find errors, typos, or areas that need enhancement, feel free to create a pull request.

## Code of Conduct

Please follow Code of Conduct in all your interactions with the project.

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
1. Update the README.md with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations, and container parameters.
1. Increase the version numbers in any examples files and the README.md to the new version that this Pull Request would represent. The versioning scheme used is SemVer.
1. The Pull Request will be merged once it is approved and passes CI checks. 


## Automated verification

Use current Node 22 LTS (22.18 or newer, as in CI) or Node 24.11+ and
`npm ci`. The mutation toolchain requires these versions; `.nvmrc` selects Node 22. Before submitting a change, run:

```sh
npm run verify
npm run test:mutation
```

`verify` runs strict TypeScript checks, unit/property/snapshot tests, coverage,
performance regressions, both library builds, the browser image comparison and
a browser walkthrough of every numbered example plus the index.
CI runs these checks plus the full-library mutation audit. `npm test` retains its
existing visual-test behavior and requires a build first.

### Coverage policy

Every executable TypeScript source file must have **100% statements, branches,
functions and lines**, enforced per file by `vitest.config.ts`. Newly added source
files are included automatically. Only shader text and static sample datasets are
excluded; barrel modules and type-only files contain no executable statements.
The WebGL image test separately checks rendering integration. It is not a claim
of exhaustive GPU/shader branch coverage.

Do not add ignore pragmas, remove meaningful behavior or lower thresholds to make
coverage green. Test real boundary cases and invalid inputs; simplify branches
only when invariants make them unreachable. Browser-facing tests use real Three.js
geometry and raycasting where possible, with renderer mocks for lifecycle tests.
The existing browser check exercises a real software WebGL renderer.

### Mutation and property tests

Stryker mutates the entire library, with the same shader/data exclusions. The
mutation score must be at least **80%**. Coverage and mutation scores measure
different things: running a line does not prove its result was asserted. Inspect
survivors; some mutations preserve behavior and others expose missing assertions.
A separate report-integrity check rejects surviving mutants that ran zero tests.
Stryker 10.1.1 supports Vitest 5's nested test-name separator; the older runner
silently skipped nested tests during mutation runs. `vitest.related` is disabled
to avoid a second file filter; Stryker selects tests using per-test coverage.

Property tests run 150 generated cases each with a fixed seed, including in
mutation workers. Oracles include Floyd–Warshall shortest paths, exhaustive
Euclidean radius searches, direct octree force summation, transitive clustering,
edge-count conservation and graph-edit state transitions. To explore more inputs:

```sh
FC_SEED=42 FC_NUM_RUNS=1000 npm run test:property
```

fast-check prints the seed, shrinking path and minimal counterexample on failure.
Replay only that test using the reported values:

```sh
FC_SEED=42 FC_PATH='0:1' npm run test:property -- -t 'failing test name'
```

Replace the example seed/path with the failure output. Preserve useful
counterexamples as regression tests. Invalid seed/run-count settings fail early.

Performance tests run separately via `npm run test:performance`. Coverage and
mutation instrumentation changes execution speed, so the timing and large-scale
regressions are excluded from instrumented runs, but still run in CI and `verify`.

### Reports and baselines

Coverage reports are in `coverage/`; mutation reports are in `reports/mutation/`.
CI uploads both. For an intentional output change, use
`npm run test:unit -- test/regression --update` and review every snapshot diff.
For an intentional rendering change, rebuild, run
`UPDATE_REFERENCE=1 npm run test:visual`, and inspect the reference image.
CI never requests baseline updates.

Passing these gates provides evidence for the tested contracts, not a proof that
all inputs are correct. Review behavioral changes and baseline updates.

### Example browser walkthrough

`npm run test:examples` starts an isolated local server and opens every numbered
HTML demo in headless Chrome using software WebGL. Build first. The suite discovers
new numbered examples automatically and checks index links, runtime/resource/shader
errors, draw calls, finite geometry and nonblank canvas screenshots. It exercises
activation, node/edge clicks and hover transitions, neighbour highlights, dragging,
pause/resume/speed controls, live simulations and growth through all 144 torus nodes.
It also checks that the custom layout retains two independent axes.

The test server injects renderer/callback observation into the served pages; source
examples and the built library still provide all behavior. A seeded `Math.random`
makes the generated demos reproducible (`EXAMPLES_SEED=42` by default). To explore a
different graph sample, use `EXAMPLES_SEED=123 npm run test:examples`. Screenshots
and per-page results are saved to `reports/examples/` and uploaded by CI. These
screenshots are review artifacts; only `test:visual` uses a pixel-diff baseline.
