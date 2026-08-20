# BlastRadius Console — UI kit

A high-fidelity recreation of the BlastRadius incident workspace under the redesigned
visual system. Same route, same information architecture, same states as
`src/client/App.tsx` in [unifyWeb3/blastradius](https://github.com/unifyWeb3/blastradius) —
new surface.

## Files

| File | What it is |
|---|---|
| `index.html` | The interactive console. Edit the UTC window, run the analysis, select a root row or an application graph node, run the application exposure check. |
| `Workspace.jsx` | Route-level composition and state: incident load, window validity, analysis, selection, exposure check, responsive mode. |
| `IncidentSidebar.jsx` | Incident identity, UTC window fields, analysis action, application check. |
| `GraphCanvas.jsx` | The blast-radius canvas. Node placement reproduces `src/client/graph-layout.tsx`. |
| `EvidencePanels.jsx` | `PathEvidence` (ordered chain + relationship evidence) and `ExposureTimeline` (UTC interval bars). |
| `fixture.js` | The real curated fixture: entity IDs, evidence strings, validity intervals, timings. Nothing invented. |

## What is real

Every value comes from `src/graph/fixture.ts` and the verified smoke run in
`docs/validation/browser-smoke-final/result.json`: 1 exposed application, 2 topological
candidates, 6 graph nodes, 5 edges, 50ms HydraDB query, `incoming` traversal with a 6-hop
cap. Merchant Web is exposed through a 3-hop path; Admin Portal is a topological candidate
whose intervals sit entirely after the compromise window; Analytics Worker has no
supporting path at all.

## What is simulated

Network latency (analysis 850ms, exposure check 500ms) so the loading states are visible.
No backend is called and no data is fabricated to fill the gap.

## Interactions covered

- edit the UTC window; an invalid window disables the analysis action;
- run and re-run the analysis (`Analyze blast radius` → `Re-run analysis`);
- automatic selection of the first exposed root after a successful analysis;
- select a candidate row **or** an application graph node — both drive the same path;
- pan and zoom the canvas; the graph is read-only (no drag, connect or edit);
- run the exposure check for each of the three catalog applications and get the three
  distinct real outcomes.

## Not built here

`states.html` (the eight documented route states side by side, including the designed
`unresolved` treatment) and `mobile.html` (the ≤820px composition) are the remaining kit
screens. The responsive composition itself is implemented — narrow the preview below
1100px and 820px to see it.
