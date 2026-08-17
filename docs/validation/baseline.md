# BlastRadius Build Baseline

Captured: 2026-08-17 (Africa/Lagos)

## Repository Root

```text
/home/unify/hydra
```

The locked product documents referenced by the build mission are present at:

```text
docs/product-decision.md
docs/product-spec.md
docs/execution-spec.md
```

They are not nested under `docs/product/` in this workspace.

## Current Commit and Working Tree

The workspace root contains a mounted, empty, read-only `.git` directory. Git
cannot identify the root as a repository:

```text
fatal: not a git repository (or any of the parent directories): .git
```

Therefore:

- root commit: **UNAVAILABLE**;
- root branch: **UNAVAILABLE**;
- root working-tree status: **UNAVAILABLE**;
- commit-based provenance must be established after a usable repository is
  initialized or restored.

This limitation must not be mistaken for a clean working tree.

The pinned HydraDB OSS checkout used by the technical investigation is a real
Git repository with:

```text
branch: main
commit: 6a2fbb192f37f51a93690a2ae2d2f5e27e6e4219
describe: v0.1.1-2-g6a2fbb1
```

## Starting Workspace State

No production application scaffold existed at the start of this build.
Specifically, the workspace root had no:

- `package.json`;
- TypeScript configuration;
- application source directory;
- frontend or backend runtime;
- root README;
- root license;
- production build, test, or development command.

The starting workspace contained:

- locked product decision/specification documents under `docs/`;
- technical investigation reports under `docs/technical/`;
- disposable HydraDB investigation scripts and evidence under
  `investigation/`;
- isolated upstream/external repository checkouts under
  `investigation/upstream/` and `investigation/external/`.

## Participant-Authored Work State

The participant-authored material present before implementation consists of
Hack Hydra research, validation reports, runtime launch helpers, and disposable
experiments created during August 16-17, 2026.

No pre-August-12 participant-authored production application was identified.
Third-party/upstream code may predate the hackathon, but it remains isolated
under `investigation/upstream/` or `investigation/external/` and is not treated
as BlastRadius application code.

Existing participant-authored work must be preserved. Production code will be
created outside `investigation/` so research fixtures and imported repositories
are not overwritten or silently incorporated.

## Runtime and Toolchain

Host environment:

```text
OS: Linux 6.6.87.2-microsoft-standard-WSL2 x86_64
Node.js: v22.22.3
npm: 10.9.8
pnpm: 11.2.2
Python: 3.12.3 (`python3` only)
Git: 2.43.0
jq: 1.7
curl: 8.5.0
Rust/Cargo: unavailable
Docker daemon/WSL integration: unavailable
```

## HydraDB Runtime

Pinned published image:

```text
ghcr.io/hydra-db/hydradb@sha256:db78309a233be54662db29744047e985a39b51c45a270d1a1f47c31a62cdb709
```

Image metadata observed by the investigation:

```text
OCI version: v0.1.1
OCI revision: 02a40025d2d57e97ab2754c8256219cdbfeab379
runtime agent: SlateDBGraph/0.1.0
license: AGPL-3.0
```

Because Docker is unavailable, the verified local path is the extracted image
filesystem:

```text
binary: /tmp/hydradb-rootfs/usr/local/bin/graph-node
launcher: investigation/runtime/run_extracted_image.sh
```

The launcher uses a single local node, local object-store directory, bearer
token, explicit plaintext development mode, and configurable HTTP/Bolt/admin
ports. Runtime data belongs under a task-specific `/tmp` directory.

## Commands Available at the Starting Point

Start the extracted HydraDB runtime in the foreground:

```bash
bash investigation/runtime/run_extracted_image.sh
```

Run the prior verified technical experiments:

```bash
node investigation/experiments/run_http_experiments.mjs
node investigation/experiments/run_bolt_experiment.cjs
node investigation/experiments/run_scale_experiment.mjs
node investigation/experiments/run_go_no_go_spike.mjs
```

No BlastRadius application build/test/dev commands existed yet.

## Verified Starting Technical Contract

The implementation may rely on these previously executed facts:

- HTTP endpoint: `POST /v1/graphs/{graph_id}/query`;
- bearer authentication and `X-Graph-Namespace` are required;
- deterministic numeric node IDs plus application-owned string IDs can be
  stored;
- deterministic relationship IDs and exact predicates can be stored;
- bulk `UNWIND`/`MERGE` uses the narrow verified grammar;
- reverse transitive closure uses incoming `algo.SSpaths`;
- hydrated paths contain nodes, relationships, and properties;
- integer relationship validity fields can be stored and filtered;
- repeated `MERGE` ingestion was duplicate-safe for the tested fixture;
- bookmarks should be propagated across dependent writes/reads;
- one writer per cell is supported in the tested single-node setup.

Context Graph `graph_payload` is explicitly excluded as the authoritative
BlastRadius graph write path.

## Exact Implementation Starting Point

The first production milestone starts from an empty application surface and
must add only:

1. a minimal graph schema compatible with the verified OSS bulk grammar;
2. a deterministic 20-row fixture;
3. a reproducible fixture ingestion/readback path;
4. tests proving transformation and deterministic identity.

No UI, backend API, broad dataset importer, optional pivot, or product feature
is part of this baseline milestone.
