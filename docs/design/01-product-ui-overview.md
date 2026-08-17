# Product UI Overview

## Product

BlastRadius is a narrow incident-response console for temporal software
supply-chain analysis. Given the curated `ua-parser-js@0.7.29` incident, it
asks HydraDB for incoming transitive dependency paths, identifies application
roots, and evaluates whether each path overlaps the selected incident window.

The graph is the explanation: it is not a decorative background and must remain
the primary visual proof of exposure.

## User

The primary user is a security engineer, platform engineer, or developer-
infrastructure engineer responding to a compromised dependency. They need a
fast answer to three questions:

1. Which applications have a path to the exact compromised version?
2. What exact dependency chain proves each result?
3. Was that chain active during the requested UTC window?

## Current Experience

There is one SPA location, `/`, with no client-side router and no incident
picker. On load, the client fetches `/api/incidents`, selects the first curated
incident, and fills the exposure-window inputs. The visible experience is one
incident workspace:

- a fixed top bar identifies BlastRadius and the HydraDB `incoming SSpaths`
  traversal;
- a left incident/control sidebar contains incident context, UTC window inputs,
  the analysis action, and an application exposure check;
- the main workspace contains summary metrics, a React Flow graph, an
  application-path list, and selected path/timeline evidence.

## Core Workflow

1. Load the curated incident and its compromised package/version.
2. Review or edit the UTC start/end fields.
3. Activate **Analyze blast radius**.
4. The backend runs the fixed HydraDB traversal contract and returns graph,
   candidate paths, temporal decisions, and timing.
5. Review exposed count, topological candidates, query timing, and the graph.
6. Select an application row or application graph node.
7. Inspect the ordered dependency path, relationship evidence, and timeline.
8. Optionally choose an application in the check control and activate
   **Check exposure**. A positive path, outside-window result, or explicit
   no-supporting-path result is shown in the sidebar.

## Product Boundaries

The current UI does not provide a general incident browser, arbitrary package
search, chat, remediation workflow, editable graph, or secondary maintainer /
typosquat pivot. A redesign must preserve this narrow incident-analysis scope.
