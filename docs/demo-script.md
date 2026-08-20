# BlastRadius Demo Script

Target duration: 2:30 to 2:40

## 0:00-0:12 - Product entry point

Start at the BlastRadius homepage. Show the headline and the compact graph
preview, then click **Investigate an incident**.

## 0:12-0:27 - Problem

"A package advisory tells us what is compromised. Incident responders still need to know which applications are transitively exposed, through which exact dependency path, and whether that path was active during the incident."

## 0:27-0:44 - Incident

Show the incident sidebar.

"BlastRadius is investigating the real `ua-parser-js@0.7.29` malware advisory, GHSA-pjwm-rvh2-c87w. The selected window is the malicious release-to-fixed interval."

## 0:44-1:24 - Blast Radius

Click **Analyze blast radius**.

"The backend resolves the exact compromised version and asks HydraDB for bounded incoming `DEPENDS_ON` paths using `algo.SSpaths`. HydraDB returns the hydrated nodes, relationships, and evidence."

Point to:

- exposed applications: `1`;
- topological candidates: `2`;
- `HydraDB query` timing;
- `incoming - 6 hops` traversal contract;
- the graph.

## 1:24-1:54 - Exact Path

Select Merchant Web.

"Merchant Web is exposed through this three-hop path: Merchant Web to commerce SDK, to request-ip, to the compromised ua-parser version. Every relationship carries its lockfile-shaped evidence and validity interval. The graph is the explanation, not a similarity result."

## 1:54-2:14 - Temporal Decision

Point to Admin Portal and the exposure timeline.

"Admin Portal also has a topological path, but its dependency intervals begin after the fixed release. BlastRadius keeps the path as evidence and classifies it as not exposed for this half-open incident window. Temporal truth is an explicit application policy over HydraDB path properties."

## 2:14-2:32 - No Evidence

Choose Analytics Worker under **Application check**, then click **Check exposure**.

"Analytics Worker shares the same dependency domain but has no path to the compromised version. The result is explicit: no supporting dependency path found. BlastRadius never invents a path from package similarity."

## 2:32-2:48 - HydraDB Close

Point to the HydraDB label and graph path.

"HydraDB is responsible for the core graph operation: deterministic versioned relationships, incoming transitive traversal, and hydrated explanation paths. Without that traversal, this becomes a vulnerable-package lookup rather than blast-radius analysis."

## Recording Checklist

- Start with the clean fixture already ingested.
- Use the default incident window.
- Keep the browser at 1440x1000 or a 16:9 crop that preserves the graph and evidence row.
- Do one uninterrupted analysis run before recording to warm the local query.
- Confirm Analytics Worker is selected for the no-evidence step.
- Keep the final cut below 2:45 to preserve deadline margin.
- Do not claim ecosystem-scale coverage or global precision/recall.
