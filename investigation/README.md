# HydraDB Technical Investigation

This directory is disposable investigation work for Hack Hydra 2026. It is
separate from any future application code.

## Pinned Inputs

- Upstream checkout: `upstream/hydradb`
- Branch: `main`
- Commit: `6a2fbb192f37f51a93690a2ae2d2f5e27e6e4219`
- Git describe: `v0.1.1-2-g6a2fbb1`
- Published image: `ghcr.io/hydra-db/hydradb:latest`
- Image digest used: `sha256:db78309a233be54662db29744047e985a39b51c45a270d1a1f47c31a62cdb709`
- OCI image revision: `02a40025d2d57e97ab2754c8256219cdbfeab379`

The image labels report `v0.1.1`; the binary reports
`SlateDBGraph/0.1.0`. Treat that mismatch as an operational versioning risk.

## Environment

This WSL environment had Node.js 22.22.3 and Python 3.12.3. It did not have a
usable Docker daemon, Rust/Cargo, or Java. The official image filesystem was
therefore downloaded and extracted, and `graph-node` was run directly with the
image's shared libraries on `LD_LIBRARY_PATH`.

Temporary runtime assets were placed under:

- `/tmp/hydradb-rootfs`
- `/tmp/hydradb-live`
- `/tmp/hydradb-scale-runtime`

The equivalent supported setup on a machine with Docker is the command in
`upstream/hydradb/README.md` under "Run with Docker". Required development
configuration includes a local object-store directory, a token file,
`GRAPH_ALLOW_PLAINTEXT=true`, and `RUST_MIN_STACK=33554432`.

For an already extracted image filesystem, the foreground launcher used here is:

```bash
bash investigation/runtime/run_extracted_image.sh
```

## Experiments

HTTP graph and track experiments:

```bash
node investigation/experiments/run_http_experiments.mjs
```

Bolt compatibility experiment (requires `neo4j-driver`):

```bash
node investigation/experiments/run_bolt_experiment.cjs
```

Small scale experiment:

```bash
node investigation/experiments/run_scale_experiment.mjs
```

Each script accepts connection settings through environment variables. The
defaults are shown at the top of each file. Raw responses are under `results/`.

No general-purpose HydraDB query CLI or first-party language SDK was found in
the checkout. The practical client surfaces are HTTP and Neo4j-compatible Bolt.

## Important Reproduction Notes

- Propagate the returned `bookmark` across dependent HTTP writes and reads.
- The HTTP endpoint is `POST /v1/graphs/{graph_id}/query`; send
  `Authorization: Bearer ...` and `X-Graph-Namespace`.
- Forward bounded variable-length `MATCH` requires a fixed source id.
- Transitive reverse variable-length `MATCH` is rejected. Use
  `algo.SSpaths` with `relDirection: 'incoming'` for reverse closure.
- `UNWIND` is supported through the client service but follows narrow grammar.
- Do not issue `CREATE INDEX`; property indexes are internal and automatic.
- HydraDB permits only one writer per cell. A request reaching another node can
  return HTTP 421 with `not_cell_writer` and the current owner.

## Evidence Index

- `results/http/`: typed JSON request and response records for the minimal graph
  and all three hackathon problem patterns. `final_read_checks.json` closes the
  fixed-id dependency and direct temporal-edge audit at read epoch 27.
- `results/bolt/bolt.json`: Neo4j JavaScript driver connectivity and query
  results, including the malformed wrong-credential failure observed.
- `results/scale/summary.json`: ingestion and latency measurements from 201 to
  2,101 vertices.
- `results/runtime/metadata.json`: pinned repository, image, toolchain, restart,
  authorization, routing, and persistence observations.
