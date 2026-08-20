# BlastRadius deployment

BlastRadius is a two-service deployment. The public Node service serves the
React console and fixed HTTP API. A separate private HydraDB service owns the
property graph and mounts persistent storage at `/data`.

## Required configuration

The app service needs:

```text
HYDRADB_URL=http://hydradb:<graph-http-port>
HYDRADB_TOKEN=<same-value-as-graph-auth-token>
HYDRADB_NAMESPACE=default
HYDRADB_GRAPH_ID=default
HYDRADB_CELL_ID=cell-0
BLASTRADIUS_AUTO_INGEST=true
BLASTRADIUS_INGEST_ATTEMPTS=60
BLASTRADIUS_INGEST_RETRY_MS=2000
```

`BLASTRADIUS_AUTO_INGEST=true` is an explicit deployment choice. On startup it
runs the existing deterministic 20-record fixture ingester with retries, then
starts the HTTP listener. The writes are idempotent and do not change the
analysis or temporal policy.

The HydraDB service uses `deploy/hydradb/Dockerfile`, which pins the verified
OSS image digest. Set `GRAPH_AUTH_TOKEN` as a secret and attach a persistent
volume at `/data`. The wrapper creates `/data/store`, `/data/cache`, and the
token file, then binds HTTP to `0.0.0.0:$PORT`.

## Railway setup

From the repository root:

```bash
npx -y @railway/cli@latest init --name blastradius --workspace <workspace-id> --json
npx -y @railway/cli@latest add --service hydradb --json
npx -y @railway/cli@latest add --service blastradius --json
```

The preferred topology is two services: build the HydraDB service from
`deploy/hydradb/Dockerfile`, set `GRAPH_AUTH_TOKEN`, and attach a volume:

```bash
npx -y @railway/cli@latest volume add --service <hydradb-service-id> --mount-path /data --json
```

Deploy the app from the repository root (the root `Dockerfile` is selected by
`railway.json`), set its variables, and create a Railway domain:

```bash
npx -y @railway/cli@latest up --service <blastradius-service-id> --detach --json
npx -y @railway/cli@latest domain --service <blastradius-service-id> --json
```

Use the HydraDB service's private DNS name and HTTP port for `HYDRADB_URL`.
Do not expose HydraDB publicly. Verify `/api/health`, the incident POST, and a
browser walkthrough from a clean browser before publishing the URL.

### One-service fallback

If the host's resource plan permits only one service, the root `Dockerfile`
contains a constrained fallback. It copies the same pinned `graph-node` binary
into the Node image, starts it on localhost:8443, mounts `/data`, and then
starts the public Node API on Railway's `PORT`. Set only `GRAPH_AUTH_TOKEN` and
attach `/data`; the entrypoint supplies the internal HydraDB URL and enables the
idempotent fixture bootstrap. HydraDB remains the real graph store and query
engine, but both processes share one service budget.

## Current environment note

On August 20, 2026, Railway created the dedicated `blastradius` project and
accepted one `blastradius` service. A second `hydradb` service was rejected by
the free-plan resource limit, so the one-service fallback is the available
deployment topology unless the account is upgraded. No live URL is claimed
until the deployed service's health endpoint and real graph query pass.
