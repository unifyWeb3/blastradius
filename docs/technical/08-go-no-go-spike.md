# GO/NO-GO Spike 01: Deterministic Dependency Graph Insertion

## Verdict

# CONDITIONAL GO

Deterministic dependency-graph insertion, exact `DEPENDS_ON` relationships,
version identity, structured temporal edge properties, incoming transitive
traversal, hydrated paths, and repeatable ingestion are **VERIFIED BY
EXECUTION** on HydraDB's pinned OSS property-graph HTTP interface.

The requested Context Graph `graph_payload` route is **not proven suitable as
the MVP's core temporal dependency store**:

- its request and readback contracts are established, and the official SDK
  sends the field correctly;
- the hosted round trip could not be executed because this workspace has no
  HydraDB API key or database;
- the public OSS repository does not contain the hosted Context Graph handler;
- `graph_payload` intentionally normalizes entity names, discards caller-local
  entity keys, generates internal entity/relationship IDs, and canonicalizes
  predicates for readback;
- it supports only the free-form relation string `temporal_details`, not
  structured `t_valid_start` / `t_valid_end` properties;
- no evidence connects Context Graph relations to the OSS `algo.SSpaths`
  procedure.

**Exact condition:** proceed only if the application-owned supply-chain graph
uses either:

1. the execution-verified OSS graph query API and `algo.SSpaths`; or
2. hosted Graph Collections (`/byog/query`) after one authenticated spike proves
   deterministic writes, structured properties, repeat ingestion, and incoming
   path queries on the actual account.

Do **not** make Context Graph `graph_payload` the authoritative dependency and
temporal store. It may remain useful later as an optional source-attached
semantic/provenance projection.

## Scope and Evidence Standard

This spike answers only whether a developer-defined dependency graph can be
inserted, read back, traversed in reverse, assigned temporal validity, and
replayed predictably. No frontend, production pipeline, agent, or product
implementation was created.

Evidence labels used below:

- **VERIFIED BY EXECUTION** — observed in a command run during this spike.
- **VERIFIED IN SOURCE** — observed in executable source or generated SDK code.
- **DOCUMENTED BUT NOT VERIFIED** — stated by HydraDB documentation but not
  executed with a hosted account.
- **INFERENCE** — conclusion derived from the evidence.
- **UNKNOWN** — no adequate evidence.

## Repository and Implementation Findings

### Repositories inspected

| Repository/artifact | Revision | Finding |
|---|---|---|
| HydraDB OSS | `6a2fbb192f37f51a93690a2ae2d2f5e27e6e4219` | Contains the graph engine, OpenCypher subset, HTTP/Bolt query services, and native path procedures. It contains no `graph_payload`, `/context/ingest`, `/context/relations`, or `/byog/query` handler. |
| HydraDB docs | `3d79851e99fe6a4bae36aab4644b7aab38952827` | Defines both Context Graph `graph_payload` and the separate Graph Collections `/byog/query` product. |
| HydraDB CLI | `e6077b1964baf7f743abb510c4face7cb45aa84f` | Pins `hydradb-sdk==2.1.2`; delegates to SDK context ingest/relations but its CLI wrapper does not expose `graph_payload`. |
| Python SDK wheel | `hydradb-sdk==2.1.2` | Generated client exposes `context.ingest(graph_payload: Optional[str])` and sends it as multipart field `graph_payload`; exposes `context.relations(...)` as a GET request. |

The SDK wheel SHA-256 was verified as:

```text
0d814e7d03e6275daef840b8f1639469957407bcbb38d1cea720b57a74a0cfa1
```

**VERIFIED BY EXECUTION.** GitHub code search across the public `hydra-db`
organization returned zero source hits for both `graph_payload` and
`/byog/query`. The hosted server implementation is therefore not public in the
repositories available for inspection.

### Important product-surface distinction

HydraDB uses “BYOG” for two different interfaces:

| Surface | Purpose | Write model | Query/read model | Spike status |
|---|---|---|---|---|
| Context Graph `graph_payload` | Attach deterministic entity/relation triplets to an ingested source | Multipart `POST /context/ingest`; whole graph per source | `GET /context/relations` and natural-language `/query` with `graph_context` | Schema/source verified; hosted execution blocked |
| Graph Collections BYOG | Own an application property graph | JSON `POST /byog/query` with Cypher | Cypher through `/byog/query` | Documented, not executed |
| OSS graph query API | Low-level/self-hosted property graph | OpenCypher subset through `/v1/graphs/{id}/query` | OpenCypher subset plus native `algo.SSpaths` | Executed and verified |

These are not interchangeable. In particular, no evidence shows that a
Context `graph_payload` relation is addressable by the OSS graph ID or internal
numeric vertex ID required by `algo.SSpaths`.

## Exact `graph_payload` Contract Discovered

### Transport schema

**VERIFIED IN SOURCE** in the generated Python SDK and **VERIFIED IN OPENAPI**:

```text
POST https://api.hydradb.com/context/ingest
Content-Type: multipart/form-data
Authorization: Bearer <API key>
API-Version: 2
```

Multipart fields relevant to this spike:

| Field | Type | Requirement/meaning |
|---|---|---|
| `database` | string | OpenAPI-required |
| `collection` | string | Optional graph/collection scope |
| `type` | `knowledge` or `memory` | Defaults to `knowledge` |
| `app_knowledge` | JSON string | Can provide the source that owns the graph |
| `document_metadata` | JSON string | IDs for uploaded document sources |
| `memories` | JSON string | Sources when `type=memory` |
| `graph_payload` | JSON string | Map of source ID to graph |
| `upsert` | string | Defaults to `true` |

The top-level `graph_payload` key must match an explicit source ID included in
the same ingest request. A non-matching key is documented to return HTTP 400.

### Graph schema

```json
{
  "source-id": {
    "entities": {
      "caller-local-key": {
        "name": "Package Y@4.5.6",
        "type": "PACKAGE_VERSION",
        "namespace": "npm",
        "identifier": "pkg:y@4.5.6"
      }
    },
    "relations": [
      {
        "source": "caller-local-source-key",
        "target": "caller-local-target-key",
        "predicate": "DEPENDS_ON",
        "context": "Package X@1.2.3 depends on Package Y@4.5.6",
        "temporal_details": "2026-08-02/2026-08-20"
      }
    ]
  }
}
```

Entity fields:

| Field | Status |
|---|---|
| `name` | Required |
| `type` | Supported |
| `namespace` | Supported |
| `identifier` | Optional external/display identity |
| arbitrary properties such as `version` or `compromised` | Not part of the schema |

Relation fields:

| Field | Status |
|---|---|
| `source` | Required local entity-map key |
| `target` | Required local entity-map key |
| `predicate` | Required plain string |
| `context` | Optional string |
| `temporal_details` | Optional free-form string |
| arbitrary properties such as `t_valid_start` | Not part of the schema |
| developer-defined relationship ID | Not part of the schema |

### Server transformations

**DOCUMENTED BUT NOT EXECUTED:**

- caller-local entity keys are handles only and are not stored;
- entity names are normalized/lowercased;
- unreferenced entities are dropped;
- chunk IDs are assigned server-side;
- readback contains server-generated `entity_id` and `relationship_id`;
- readback separates `canonical_predicate` and `raw_predicate`;
- graphs operate in replace mode, not per-triple mutation mode;
- re-ingesting the source without `graph_payload` reapplies the saved graph;
- re-ingesting with a new `graph_payload` replaces it.

Therefore literal `INPUT GRAPH == OUTPUT GRAPH` is false by design for local
keys, casing, and internal IDs. The important application values can only be
expected to survive through `name`, `type`, `namespace`, `identifier`,
predicate readback, `context`, and `temporal_details`. Hosted execution is still
required to prove those values on the account used by the MVP.

### Limits

**DOCUMENTED BUT NOT EXECUTED:**

| Limit | Value |
|---|---:|
| Entities per source graph | 5,000 |
| Relations per source graph | 10,000 |
| Relations per entity | 500 |
| `context` length | 2,000 characters |
| entity name / predicate length | 256 characters |

The interface is bulk and one-shot; per-triple add/update/delete is documented
as unavailable.

## Exact Dependency `graph_payload` Fixture

The exact JSON generated by the spike is preserved at
`investigation/results/go-no-go/exact-graph-payload.json`.

```json
{
  "hack-hydra-go-no-go-01": {
    "entities": {
      "app_a": {"name":"App A","type":"APPLICATION","namespace":"supply-chain","identifier":"app:a"},
      "app_b": {"name":"App B","type":"APPLICATION","namespace":"supply-chain","identifier":"app:b"},
      "x": {"name":"Package X@1.2.3","type":"PACKAGE_VERSION","namespace":"npm","identifier":"pkg:x@1.2.3"},
      "q": {"name":"Package Q@2.3.4","type":"PACKAGE_VERSION","namespace":"npm","identifier":"pkg:q@2.3.4"},
      "y": {"name":"Package Y@4.5.6","type":"PACKAGE_VERSION","namespace":"npm","identifier":"pkg:y@4.5.6"},
      "z": {"name":"Package Z@7.8.9","type":"PACKAGE_VERSION","namespace":"npm","identifier":"pkg:z@7.8.9"},
      "compromised": {"name":"Compromised","type":"SECURITY_STATUS","namespace":"supply-chain","identifier":"status:compromised"}
    },
    "relations": [
      {"source":"app_a","target":"x","predicate":"DEPENDS_ON","context":"App A depends on Package X@1.2.3","temporal_details":"2026-08-01/2026-08-20"},
      {"source":"x","target":"y","predicate":"DEPENDS_ON","context":"Package X@1.2.3 depends on Package Y@4.5.6","temporal_details":"2026-08-02/2026-08-20"},
      {"source":"app_b","target":"q","predicate":"DEPENDS_ON","context":"App B depends on Package Q@2.3.4","temporal_details":"2026-08-03/2026-08-20"},
      {"source":"q","target":"y","predicate":"DEPENDS_ON","context":"Package Q@2.3.4 depends on Package Y@4.5.6","temporal_details":"2026-08-04/2026-08-20"},
      {"source":"y","target":"z","predicate":"DEPENDS_ON","context":"Package Y@4.5.6 depends on Package Z@7.8.9","temporal_details":"2026-08-05/2026-08-20"},
      {"source":"y","target":"compromised","predicate":"HAS_SECURITY_STATUS","context":"Package Y@4.5.6 was compromised.","temporal_details":"2026-08-06/2026-08-12"}
    ]
  }
}
```

`Package Y@4.5.6 = compromised` must be modeled as an entity/relation fact in
`graph_payload`, because the entity schema has no arbitrary `compromised`
boolean field. This is a constrained but usable representation for semantic
context; it is not equivalent to a filterable property without application
parsing or a property-graph projection.

## Hosted Round-Trip Result

### Connectivity

**VERIFIED BY EXECUTION:** the hosted endpoint resolved and an unauthenticated
request returned:

```text
HTTP/1.1 401 Unauthorized
{"error":{"code":"UNAUTHORIZED","message":"Missing Authorization header"}}
```

The earlier DNS failure was environmental/transient; endpoint reachability is
no longer the blocker.

### Authentication blocker

**VERIFIED BY EXECUTION:** all expected variables were unset:

```text
HYDRADB_API_KEY=unset
HYDRA_DB_API_KEY=unset
HYDRADB_DATABASE=unset
HYDRA_DB_DATABASE=unset
```

Consequently these hosted facts remain **UNKNOWN**:

- whether the exact fixture is accepted;
- whether `DEPENDS_ON` returns unchanged in `canonical_predicate` and/or
  `raw_predicate`;
- whether `identifier` and version-bearing names survive exactly;
- whether all six relations return through `/context/relations`;
- whether `temporal_details` returns unchanged;
- whether replacing the same graph twice preserves logical facts and whether
  server-generated IDs remain stable or churn;
- whether `/query` returns both complete application-to-package paths;
- whether any internal bridge to `algo.SSpaths` exists.

The hosted script deliberately exits with code 2 and writes
`hosted-blocked.json` when credentials are absent. It does not report a false
success.

## Executed Property-Graph Fixture

The execution-proven fallback uses one shared label, `DependencyNode`, with a
`kind` property. That shape is required by the OSS bulk-ingest grammar, which
permits exactly one `SET` label in an `UNWIND` vertex upsert and exactly one
label on each endpoint of an `UNWIND` relationship mutation.

### Minimal round-trip subset

The smallest dependency chain inside the executed fixture was:

```text
App A --DEPENDS_ON--> Package X@1.2.3 --DEPENDS_ON--> Package Y@4.5.6
```

This is 3 nodes and 2 edges. Both edges appeared unchanged in direct readback,
and the incoming `SSpaths` result hydrated the complete three-node path. The
expanded fixture below then added the second application branch, downstream
Package Z, and the temporal compromise fact without changing the ingestion or
query mechanism.

### Nodes

| Internal numeric ID | Stable application ID | Kind | Version/status |
|---:|---|---|---|
| 1001 | `app:a` | application | App A |
| 1002 | `pkg:x@1.2.3` | package_version | 1.2.3 |
| 1003 | `pkg:y@4.5.6` | package_version | 4.5.6, `compromised=true` |
| 1004 | `app:b` | application | App B |
| 1005 | `pkg:q@2.3.4` | package_version | 2.3.4 |
| 1006 | `pkg:z@7.8.9` | package_version | 7.8.9 |
| 1007 | `status:compromised` | security_status | Compromised |

The numeric ID is required for the executed OSS bulk grammar and `SSpaths`.
The application must still use its own deterministic `dep_id` as the portable
identity.

### Relationships

```text
App A --DEPENDS_ON--> X@1.2.3 --DEPENDS_ON--> Y@4.5.6 --DEPENDS_ON--> Z@7.8.9
App B --DEPENDS_ON--> Q@2.3.4 --DEPENDS_ON--> Y@4.5.6
Y@4.5.6 --COMPROMISED_DURING--> Compromised
```

Every relationship was assigned a deterministic relationship identity property
and an application-owned `edge_key`. Dependency edges carried
`t_valid_start`/`t_valid_end`; the compromise relationship carried its own
validity window.

## Exact Commands and Script

The complete disposable script is:

```text
investigation/experiments/run_go_no_go_spike.mjs
```

### Local execution path used

First terminal:

```bash
env \
  HYDRA_INV_RUNTIME_ROOT=/tmp/hydradb-go-no-go-expanded \
  HYDRA_INV_HTTP_ADDR=127.0.0.1:22447 \
  HYDRA_INV_BOLT_ADDR=127.0.0.1:22687 \
  HYDRA_INV_ADMIN_ADDR=127.0.0.1:22093 \
  HYDRA_INV_TOKEN=hydradb-go-no-go-investigation-token-32 \
  bash investigation/runtime/run_extracted_image.sh
```

Second terminal:

```bash
BASE_URL=http://127.0.0.1:22447 \
MODE=local \
node investigation/experiments/run_go_no_go_spike.mjs
```

The runtime used the previously pinned image:

```text
ghcr.io/hydra-db/hydradb@sha256:db78309a233be54662db29744047e985a39b51c45a270d1a1f47c31a62cdb709
```

### Hosted command prepared

```bash
HYDRADB_API_KEY=<key> \
HYDRADB_DATABASE=<database> \
MODE=hosted \
node investigation/experiments/run_go_no_go_spike.mjs
```

Hosted mode performs:

1. multipart `graph_payload` ingest;
2. `/context/status` polling to `completed`;
3. `/context/relations` readback;
4. natural-language `/query` with `graph_context: true`;
5. the identical ingest a second time;
6. another status/readback cycle;
7. logical relation-array comparison.

## Insert Result

**VERIFIED BY EXECUTION.** The final clean local run accepted:

- 7 nodes;
- 5 `DEPENDS_ON` edges;
- 1 `COMPROMISED_DURING` edge;
- exact developer-defined relationship predicates;
- exact `dep_id` and version strings;
- boolean compromise property;
- integer temporal start/end properties.

The supported bulk patterns were:

```cypher
UNWIND $rows AS row
MERGE (n {id: row.vertex})
SET n:DependencyNode,
    n.kind = row.kind,
    n.dep_id = row.dep_id,
    n.name = row.name,
    n.version = row.version,
    n.compromised = row.compromised
```

```cypher
UNWIND $rows AS row
MATCH (s:DependencyNode {id: row.source}),
      (t:DependencyNode {id: row.target})
MERGE (s)-[r:DEPENDS_ON {id: row.relationship_vertex}]->(t)
SET r.edge_key = row.edge_key,
    r.t_valid_start = row.t_valid_start,
    r.t_valid_end = row.t_valid_end
```

## Readback Result

**VERIFIED BY EXECUTION.** Readback returned all five exact dependency edges:

| Source | Target | Edge key | Valid start | Valid end |
|---|---|---|---:|---:|
| `app:a` | `pkg:x@1.2.3` | `app-a-x` | 20260801 | 20260820 |
| `app:b` | `pkg:q@2.3.4` | `app-b-q` | 20260803 | 20260820 |
| `pkg:q@2.3.4` | `pkg:y@4.5.6` | `q-y` | 20260804 | 20260820 |
| `pkg:x@1.2.3` | `pkg:y@4.5.6` | `x-y` | 20260802 | 20260820 |
| `pkg:y@4.5.6` | `pkg:z@7.8.9` | `y-z` | 20260805 | 20260820 |

The compromised vertex query returned:

```text
kind=package_version
name=Package Y
version=4.5.6
compromised=true
```

This proves exact dependency-version identity on the property-graph surface.
It does not prove the hosted Context Graph representation, where version must
be encoded into `name`/`identifier`.

## Incoming Transitive Traversal Result

The exact query was:

```cypher
CALL algo.SSpaths({
  sourceNode: $target,
  relTypes: ['DEPENDS_ON'],
  relDirection: 'incoming',
  maxLen: 3,
  pathCount: 10,
  resultLimit: 10
})
YIELD path
RETURN path
```

with `target=1003`, the numeric vertex for `pkg:y@4.5.6`.

**VERIFIED BY EXECUTION.** HydraDB returned hydrated path values containing
the ordered nodes, node labels/properties, relationship type, endpoints, edge
properties, and temporal values. It returned one-hop prefixes as well as both
two-hop root paths. Filtering hydrated terminal nodes by `kind=application`
produced exactly:

```json
{
  "affected_roots": [
    {
      "application": "App A",
      "exposure_path": ["app:a", "pkg:x@1.2.3", "pkg:y@4.5.6"],
      "predicates": ["DEPENDS_ON", "DEPENDS_ON"]
    },
    {
      "application": "App B",
      "exposure_path": ["app:b", "pkg:q@2.3.4", "pkg:y@4.5.6"],
      "predicates": ["DEPENDS_ON", "DEPENDS_ON"]
    }
  ]
}
```

This meets the required blast-radius result and path explanation on the OSS
interface.

`SSpaths` returns all prefixes, not only application roots. The application
layer must select paths whose terminal hydrated node has `kind=application`,
deduplicate roots if necessary, and reverse the incoming traversal order for
human-readable exposure paths.

## Temporal Result

### Dependency activity

**VERIFIED BY EXECUTION.** Dependency relationships accepted integer
`t_valid_start` and `t_valid_end`, returned them unchanged, and supported an
as-of filter:

```cypher
MATCH (s)-[r:DEPENDS_ON]->(t)
WHERE r.t_valid_start <= 20260816
  AND r.t_valid_end >= 20260816
RETURN s.dep_id, t.dep_id, r.t_valid_start, r.t_valid_end
```

### Compromise window

**VERIFIED BY EXECUTION.** The compromise relationship returned:

```text
package=pkg:y@4.5.6
status=Compromised
start=20260806
end=20260812
```

Thus the property graph can naturally model both dependency activity intervals
and security-event intervals.

### Context `graph_payload`

**DOCUMENTED BUT NOT EXECUTED.** Only a free-form string is writable:

```json
"temporal_details": "2026-08-06/2026-08-12"
```

There is no structured relation-property schema, numeric comparison, or
server-side temporal predicate exposed by `graph_payload`. Using it would
require parsing and filtering the interval in the application layer, or
projecting the relation into a property graph.

## Idempotency Result

### OSS property graph

**VERIFIED BY EXECUTION.** The identical node and edge fixture was inserted a
second time using deterministic numeric node IDs, deterministic relationship
ID properties, and `MERGE`.

After the second ingest:

```text
DependencyNode count: 7
DEPENDS_ON count: 5
COMPROMISED_DURING count: 1
```

The ordered dependency readback rows were byte-for-byte equivalent at the JSON
row level, and the compromise readback was also identical:

```json
{
  "identical_rows_after_second_ingest": true,
  "identical_security_rows_after_second_ingest": true
}
```

No duplicate nodes or relationships were created.

### Context `graph_payload`

**DOCUMENTED BUT NOT EXECUTED.** Its model is source-level replacement rather
than triple-level merge. Re-ingest with a payload replaces the stored graph;
re-ingest without a payload reapplies the previously stored graph. Logical
replacement is documented, but stable server-generated entity/relationship
IDs are not promised. The MVP must not key external state on those IDs.

## Parser and Modeling Constraints Found During Execution

The failed attempts were useful and are confirmed in OSS source:

1. Bulk vertex `MERGE` must match only `id: row.<field>`; labels and other
   properties are applied with `SET`.
2. A bulk vertex upsert accepts exactly one `SET` label.
3. Bulk relationship endpoint patterns require exactly one label each and only
   an `id` property sourced from the row map.
4. A bulk relationship `MERGE` with properties must use
   `id: row.<field>` as its merge identity; remaining properties belong in
   `SET`.
5. Bulk `SET` values must come from the `row` map; literal values such as
   `n.kind = 'application'` were rejected in this optimized grammar.
6. Incoming `SSpaths` starts at the compromised node and returns paths in
   traversal order, so display paths must be reversed.
7. The broad edge readback queries triggered full-edge-scan warnings. The MVP
   should use fixed IDs/native path expansion for its primary traversal and
   avoid collection-wide scans in request paths.

The single-label `DependencyNode` + `kind` property model is the lowest-risk
bulk-ingestion representation for the verified OSS interface.

## Graph Collections Assessment

HydraDB documents hosted Graph Collections as a full application-owned property
graph with Cypher writes, `MERGE`, arbitrary properties, incoming traversal,
variable-length traversal, and hydrated path results. It also documents:

- `POST /byog/databases`;
- `POST /byog/query` with `{database, collection, query, params}`;
- a 256 KiB request-body limit;
- 8-second reads and 30-second writes;
- batch loading with `UNWIND`;
- repeatable loading with `MERGE`;
- path JSON as `{nodes: [...], edges: [...]}`.

However:

- these endpoints do not appear in the checked v2 OpenAPI file;
- their server implementation is not in the public OSS repository;
- they were not authenticated/executed during this spike;
- the documentation explicitly rejects server-side procedure calls, so
  `CALL algo.SSpaths(...)` should not be assumed available there.

Graph Collections may still be the easiest hosted fallback if its documented
incoming variable-length Cypher works. That must be a separate authenticated
execution check; it is not proven by the local `SSpaths` result.

## Success Criteria

| Criterion | Context `graph_payload` | Executed OSS property graph | Gate result |
|---|---|---|---|
| Custom graph can be inserted | Documented; hosted execution blocked | **VERIFIED BY EXECUTION** | Conditional pass |
| Custom relationship predicates survive | Documented readback has raw/canonical predicate; exact result unknown | **VERIFIED BY EXECUTION** | Conditional pass |
| Dependency-version identity survives | Documented through normalized name and optional identifier; not executed | **VERIFIED BY EXECUTION** as `dep_id` + `version` | Conditional pass |
| Graph can be read back | `/context/relations` contract verified; hosted result unknown | **VERIFIED BY EXECUTION** | Conditional pass |
| Incoming transitive traversal works | Semantic graph query documented; no `SSpaths` bridge proven | **VERIFIED BY EXECUTION** with incoming `SSpaths` | Pass only on OSS interface |
| Hydrated paths are returned | Query-path structure documented; exact blast-radius path unknown | **VERIFIED BY EXECUTION** | Pass only on OSS interface |
| Temporal metadata can be represented | Free-form `temporal_details` only | **VERIFIED BY EXECUTION** as structured integer properties | Constrained pass |
| Repeated ingestion is predictable | Replace semantics documented; IDs may be regenerated | **VERIFIED BY EXECUTION**, no duplicates | Conditional pass |
| Whole process is scripted reproducibly | Hosted script prepared but credential-blocked | **VERIFIED BY EXECUTION** locally | Pass |

All criteria are not yet true on a single hosted `graph_payload` path.
Therefore an unconditional GO would overstate the evidence.

## Limitations and Risks

### HIGH: `graph_payload` is not a general property graph

It lacks arbitrary node/edge properties, developer-defined stored IDs,
structured temporal values, and per-triple mutation. A supply-chain system that
needs exact version and time filtering will quickly require an application
projection or a different graph surface.

**Mitigation:** keep the authoritative graph in OSS/property Graph Collections;
optionally mirror selected facts into Context Graph for semantic retrieval.

### HIGH: `graph_payload` to `SSpaths` interoperability is unproven

Context entities receive server IDs, while OSS `SSpaths` requires numeric
`sourceNode`. No public API exposes a mapping into the OSS graph namespace.

**Mitigation:** do not design around such a bridge. Run traversal where the
graph is written.

### HIGH: no hosted authenticated round trip

The request is scripted but cannot be executed without a key/database.

**Mitigation:** the first post-direction task should be a 30–60 minute hosted
probe, not product implementation.

### MEDIUM: hosted Graph Collections differs from OSS syntax

Graph Collections documents broad Cypher but rejects procedures. The execution-
verified OSS interface supports the narrower bulk grammar and native paths.

**Mitigation:** select one interface deliberately and keep separate ingestion
and query adapters. Do not assume syntax parity.

### MEDIUM: numeric IDs are required by the verified fast path

The OSS bulk grammar and `SSpaths` need numeric vertex identities. Package URLs
and application IDs are strings.

**Mitigation:** derive a deterministic safe-range integer from the canonical
string and always store the canonical string in `dep_id`; collision-check at
ingest. Avoid using renderer/internal IDs as portable identities.

### MEDIUM: temporal filtering is application-defined

HydraDB stores and filters the values, but it does not define interval
semantics, open-ended values, advisory precedence, or “exposed at time T.”

**Mitigation:** define one interval convention and one as-of predicate before
loading real data.

## Final Answer to the Make-or-Break Question

### Can we insert a deterministic, developer-defined graph into HydraDB?

**Yes, on HydraDB's property-graph interface.** This was proven end-to-end with
deterministic IDs, exact relationship predicates, exact package versions,
structured temporal edge properties, hydrated incoming paths, and idempotent
replay.

**Not yet proven through Context `graph_payload`, and that interface is too
constrained to be the sole authoritative store for this temporal blast-radius
MVP.** It can encode deterministic semantic triplets, but it transforms
identities and does not expose structured temporal properties or a verified
`SSpaths` route.

## Recommended Next Step

Before any product build, use the actual hackathon HydraDB key to run one of
these two short validations:

1. **Preferred if `SSpaths` is mandatory:** deploy/use the pinned OSS graph
   interface and rerun `MODE=local` in the intended demo environment.
2. **Preferred if hosted service is mandatory:** run `MODE=hosted` for the
   Context readback evidence, then run a separate Graph Collections fixture
   proving `MERGE`, temporal properties, repeat ingestion, and an incoming
   path query. If Graph Collections cannot return both root paths with exact
   edge properties, fall back immediately to OSS.

Do not spend product time trying to force `graph_payload` into an application
property-graph role or trying to bridge its generated entity IDs into
`algo.SSpaths`.

## Evidence Files

- `investigation/experiments/run_go_no_go_spike.mjs`
- `investigation/results/go-no-go/fixture.json`
- `investigation/results/go-no-go/exact-graph-payload.json`
- `investigation/results/go-no-go/readback-first.json`
- `investigation/results/go-no-go/version-readback.json`
- `investigation/results/go-no-go/incoming-sspaths.json`
- `investigation/results/go-no-go/affected-roots.json`
- `investigation/results/go-no-go/security-temporal-readback-first.json`
- `investigation/results/go-no-go/idempotency-compare.json`
- `investigation/results/go-no-go/hosted-blocked.json`

## Source Pointers

- Context `graph_payload` schema and transformations:
  `investigation/upstream/mintlify-docs/essentials/v2/bring-your-own-graph.mdx:32`
- Context replace mode and re-ingestion behavior:
  `investigation/upstream/mintlify-docs/essentials/v2/bring-your-own-graph.mdx:64`
- Context limits and one-shot restriction:
  `investigation/upstream/mintlify-docs/essentials/v2/bring-your-own-graph.mdx:73`
  and `:315`
- OpenAPI multipart field:
  `investigation/upstream/mintlify-docs/api-reference/v2/openapi.json:6406`
- `/context/relations` response contract:
  `investigation/upstream/mintlify-docs/api-reference/v2/endpoint/source-relations.mdx:53`
- Hosted Graph Collections claims and endpoint shape:
  `investigation/upstream/mintlify-docs/essentials/v2/graph-collections-byog.mdx:6`
  and `:68`
- Hosted Graph Collections procedure restriction:
  `investigation/upstream/mintlify-docs/essentials/v2/graph-collections-byog.mdx:176`
- OSS bulk vertex grammar:
  `investigation/upstream/hydradb/src/query/opencypher.rs:1441`
- OSS bulk relationship grammar:
  `investigation/upstream/hydradb/src/query/opencypher.rs:1592` and `:1760`
- OSS temporal/idempotent relationship merge test:
  `investigation/upstream/hydradb/src/query/opencypher.rs:4003`
- `algo.SSpaths` parser:
  `investigation/upstream/hydradb/src/query/path_procedure.rs:6` and `:94`
- `algo.SSpaths` execution test:
  `investigation/upstream/hydradb/src/tests.rs:1024`
- CLI SDK pin:
  `investigation/upstream/hydradb-cli/pyproject.toml:31`
