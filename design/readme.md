# BlastRadius — design system

The visual design system for **BlastRadius**, a temporal supply-chain blast-radius analysis
console built for Hack Hydra 2026 (Track 02). This project is a **design pass over an
existing, working product** — it restyles what ships, it does not redefine it.

---

## 1. The product

BlastRadius answers one question, precisely:

> **Given a compromised package version and a UTC time window, which of my applications
> actually depended on it *during that window*?**

The distinction that gives the product its reason to exist is between a *topological*
answer and a *temporal* one. Plenty of tools can tell you that a dependency path exists.
BlastRadius separates:

| | Meaning |
|---|---|
| **Candidate root** | A path exists from this application to the compromised version. |
| **Exposed** | That path existed *and* every edge on it was valid inside the requested window. |
| **Outside window** | The path is real; its validity intervals never overlap the window. |
| **Unresolved** | An edge on the path has no validity interval, so exposure can be neither confirmed nor ruled out. |

It runs on **HydraDB**, using an `incoming` `algo.SSpaths` traversal over `DEPENDS_ON`
relationships with a 6-hop cap. Intervals are **half-open** `[start, end)` — touching
boundaries do not overlap. The console's whole job is to make those four verdicts, and the
evidence behind them, impossible to misread.

### Surfaces

There is exactly **one product and one route** (`/`) — an incident-analysis workspace. The
"screens" are states within that route, not separate pages. That is a deliberate product
constraint, not an omission: see `docs/design/07-design-constraints.md` in the source
repository. There is no marketing site, no docs site, no settings, no auth, no dashboard,
no incident list. This design system covers the one console it has, thoroughly.

### Scope honesty

The shipping product runs against a **curated demonstration fixture** — three
applications, six graph nodes, one advisory (`GHSA-pjwm-rvh2-c87w` / `CVE-2021-4229`,
malware in `ua-parser-js@0.7.29`). The console renders that provenance string in the
sidebar and this design system keeps it there. Nothing in the visual language may imply
ecosystem-scale coverage the product does not have.

---

## 2. Sources this system was built from

| Source | What was taken from it |
|---|---|
| **GitHub — [github.com/unifyWeb3/blastradius](https://github.com/unifyWeb3/blastradius)** (`main`) | The functional source of truth. `src/client/App.tsx` (route composition, state machine), `src/client/styles.css` (exact colours, radii, breakpoints, dimensions), `src/client/graph-layout.tsx` (node placement algorithm), `src/client/format.ts` (UTC/latency formatting), `src/client/components/*` (DependencyPath, ExposureTimeline, BlastRadiusGraph), `src/graph/fixture.ts` (the real incident data), `src/server/incident-catalog.ts`. |
| **Attached codebase — `docs/`** | `docs/design/01`–`08` (the authoritative structural handoff: product overview, screen inventory, component inventory, interaction states, data-display contract, responsive behaviour, design constraints), `docs/product-spec.md`, and `docs/validation/browser-smoke-final/result.json` (the verified run whose numbers this system quotes). |
| **[lucide-icons/lucide](https://github.com/lucide-icons/lucide)** (`main`) | The icon set. Copied into `assets/icons/` — see §6. |
| **Google Fonts** | IBM Plex Sans, IBM Plex Sans Condensed, IBM Plex Mono. |

> Readers with access to the repository above should explore it directly — reading
> `src/client/` and `docs/design/` alongside this system is the fastest way to build
> BlastRadius work that is faithful rather than approximate.

### What changed in this design pass, and why

The shipping implementation is a **light** interface (`#edf0ee` paper, `#17201e` ink) with
Inter and a reasonable but generic card language. Three changes, each with a reason rooted
in the product:

1. **Inverted to a single dark "instrument" theme.** This is an incident console read
   during an active investigation, often projected or on a war-room screen. A dark chassis
   lets the four status hues be the only bright things on screen. The neutral ramp is
   derived from the source's own green-graphite pair, so the family resemblance holds.
2. **IBM Plex Sans / Plex Mono replace Inter.** Half of everything on screen is a machine
   fact — entity IDs, lockfile evidence, UTC timestamps, reason codes. Plex Mono is
   legible at 9–11px where those live, and Plex Sans gives true tabular figures for the
   summary band. (See §7 Caveats — this is a substitution, not a supplied brand font.)
3. **`unresolved` was given its own treatment.** In the current build,
   `missing_dependency_validity` renders like `no_common_overlap`. The data-display
   contract says these are different facts. This system separates them: steel-blue, a 135°
   hatch, a question glyph, and the words "Temporal evidence incomplete". It is the single
   most consequential visual decision here — a supply-chain console that shows "unknown"
   as "fine" is worse than one that shows nothing.

Everything else — layout dimensions, breakpoints, node placement, wording, state
transitions, the read-only graph — is preserved verbatim.

---

## 3. Content fundamentals

**The voice is a measuring instrument, not a guide.** It reports what the graph and the
clock say, in the third person, and refuses to round off uncertainty.

**Person.** No "I". Almost never "you" — and never "you" in a verdict. The console reports
on the graph, not on the reader: *"No supporting dependency path found."*, not *"You're not
affected."* Second person appears only in a direct instruction about a control
(*"Start must be before end"*).

**Casing.** Sentence case for every heading, title and sentence — "Transitive blast
radius", "Exposure timeline", "Application check". UPPERCASE only at the 10px label size
(kickers, field labels, status pills). `SCREAMING_SNAKE_CASE` only for machine identifiers
quoted verbatim: `DEPENDS_ON`, `missing_dependency_validity`. Package and entity IDs keep
their exact source casing, always — `pkg:npm/@acme/commerce-sdk@3.4.0`, never
title-cased or "prettified".

**Punctuation.** Full stops on complete sentences, none on labels or fragments. Middle dot
`·` separates metadata on one line ("3 hops · active exposure"). Arrows are `→` for
intervals and chains. No exclamation marks anywhere. No ellipses on loading copy —
"Querying HydraDB", not "Querying HydraDB…".

**Emoji: never.** Not in the UI, not in empty states, not in the "good news" case. The
product's whole credibility rests on being read as an instrument.

**Numbers are always attributable.** Every figure in the summary band carries the DTO field
or query parameter it came from (`affectedRoots[]`, `timing.hydraQueryMs`, `6 hop cap`).
Latency is formatted like the source formats it: `50ms`, `1.20s`. An absent value is an em
dash `—`, never `0` and never "N/A".

**The verdict strings are contract copy.** Do not rewrite them:

| Situation | Copy |
|---|---|
| Path overlaps window | **Exposed in window** · *Exposed* · *{n} hop dependency path* |
| Path exists, no overlap | **Outside window** · *Not exposed in window* · *Path has no common temporal overlap.* |
| Validity interval missing | **Temporal evidence incomplete** · *Temporal result unresolved* · *A dependency edge on the supporting path has no validity interval. Exposure can be neither confirmed nor ruled out.* |
| No topological path | **Not exposed** · *No supporting dependency path found.* |
| Before a query | *Analysis pending* · *No graph result* · *No path selected* |
| During a query | *Querying HydraDB* · *Incoming SSpaths traversal* |
| Engine failure | *HydraDB could not complete the graph operation.* |
| Provenance | *curated demonstration fixture* |

**Write / never write.**

| Write | Never write |
|---|---|
| "No supporting dependency path found." | "You're all clear! 🎉" |
| "Temporal result unresolved" | "Possibly not affected" |
| "Querying HydraDB" | "Working our magic…" |
| "incoming · 6 hops" | "deep AI-powered scan" |
| "curated demonstration fixture" | "full ecosystem coverage" |

**Evidence text is quoted, never paraphrased.** `"merchant-web package-lock.json resolved
@acme/commerce-sdk@3.4.0"` is rendered in mono, verbatim, exactly as the API returns it. It
is never replaced with a confidence score, a percentage, or a summary. The audit trail *is*
the feature.

---

## 4. Visual foundations

### Colour

A **single dark theme**; there is no light mode. The neutral ramp (`--gr-1000` → `--gr-000`)
is green-graphite — a faint green cast inherited from the source's `#17201e` / `#edf0ee`
pair, which keeps the interface from reading as pure blue-grey.

Above the neutrals sit exactly **four signal hues, each with one fixed meaning**, and colour
is never decorative:

- **Red** (`--red-500`, source `#B92E27` / `#8F211C`) — compromise and active exposure. The
  compromised node, exposed status, the analysis action, the severity badge, the selected
  edge. Nothing else may be red.
- **Amber** (`--amber-500`, source `#A36A10`) — *the path is real, the timing is not.*
  Outside-window only. Never a UI warning, never uncertainty.
- **Teal** (`--teal-500`, source `#167A69`) — *this was measured.* Effective overlap,
  evidence checks, the selection ring, focus rings, the HydraDB runtime badge, links.
- **Steel** (`--steel-400`) — *unknown.* Unresolved temporal evidence, and only that.

Two background colours in total: `--bg-app` (`#0B100F`) and the graph canvas
`--graph-canvas` (`#0E1413`). Panels step up through `--surface-sunken` → `--surface-panel`
→ `--surface-raised` → `--surface-hover`; **depth comes from surface value and hairlines,
not from shadow.**

### Type

**IBM Plex Sans** for interface, **IBM Plex Sans Condensed** available for tight labels,
**IBM Plex Mono** for every machine fact. Seven roles, no more: display 30 / version 19 /
title 20 / section 15 / subsection 13 / body 13 / meta 11 / label 10 / metric 24 / code 11 /
micro 9. Negative tracking on display and title (`-0.022em`, `-0.014em`); positive
`0.09em` on 10px uppercase labels. Metrics use tabular lining figures so digits align down
the summary band. 9px is the floor and is used only for timeline axis ticks and graph node
detail.

The package name and its version are split onto two lines with the version in red — the
version is the part that decides exposure, so it gets its own colour and cannot be skimmed
past.

### Spacing & layout

2px-based scale; console interiors land between 8 and 20px. `--pad-panel: 18px`,
`--pad-sidebar-section: 20px`, `--gap-inline: 8px`. Layout dimensions are carried verbatim
from the source so the redesign drops into the existing chassis: 58px top bar, 286px
sidebar (250px ≤1100px, full-width ≤820px), 64px panel toolbars, 426px graph canvas (380px
≤820px), 270px root inventory, 190px graph nodes, 155px chain nodes, 36px controls, 38px
buttons. Two breakpoints only: **1100px** and **820px**.

Fixed elements: the top bar and the incident rail are the chassis; the graph's zoom
controls pin to the canvas's bottom-left; the provenance note pins to the bottom of the
rail (and to the page foot on mobile).

### Backgrounds & imagery

**No photography, no illustration, no gradient washes, no texture.** The only patterned
surface in the entire system is the graph canvas's 18px dot grid
(`radial-gradient(var(--graph-grid) 1px, transparent 1px)`) — it exists to make panning
legible, not to decorate. The one other pattern is semantic: the 135° hatch that marks
unresolved state. If a BlastRadius surface needs an image, the answer is almost always that
it needs a number instead.

### Corner radii & cards

**The chassis is square.** Structural regions — panels, the summary band, the graph row,
toolbars — have `--radius-none` and are separated by 1px hairlines. Radius belongs only to
objects sitting *on* the chassis: 3px badges and pills, 5px inputs/buttons/chips, 7px graph
nodes, chain nodes and inventory rows, 10px floating cards and banners, 14px overlays.

There is no "card" in the marketing sense. What looks like a card is a raised slab:
`--surface-raised`, a 1px `--border-default`, 7px radius, and — for graph nodes only —
`--shadow-node`. Status is carried by a **left rail** (3px on rows and result blocks, 4px on
application graph nodes), never by a coloured background wash.

### Shadows & rings

Four values, deliberately dull: `--shadow-node` for graph nodes, `--shadow-raised` for
floating cards, `--shadow-overlay` for dialogs, `--shadow-inset-track` for timeline tracks.
No coloured glows, no neon, no double shadows. The only ring is teal (`--ring-selected`)
and it always means "this is the current selection"; the focus ring is the same hue at 2px
with a 2px offset.

### Transparency & blur

Almost none. Signal backgrounds are `rgba()` tints of their hue at 10–13% over an opaque
surface — that is the entire use of transparency. **No backdrop blur anywhere**: blur on an
evidence surface would make a machine value ambiguous, which is the one thing this product
cannot afford. Off-path graph nodes drop to `opacity: 0.42` — subdued but still readable,
because a dimmed node is still evidence. Edge labels sit on a 94%-opaque canvas-coloured
chip so they never fight the grid.

### Motion

Motion confirms state changes and traces the selected path. Nothing bounces, nothing slides
in, nothing decorates. `--ease-standard: cubic-bezier(0.2, 0, 0.15, 1)`; durations 80 /
130 / 200 / 320ms. Colour and surface transitions only — **no transforms on hover, no
scaling on press.**

Exactly two things loop: the 1s linear analysis spinner (teal), and the selected path's
dashed edge, whose dashes flow toward the target at 1.1s. `prefers-reduced-motion` stops
both.

### Interaction states

| State | Treatment |
|---|---|
| Hover | Surface steps up one value (`--surface-hover`), 130ms. No movement, no shadow change. |
| Press | Surface steps up again (`--surface-active`); the primary button darkens to `--red-800`. Never a scale-down. |
| Focus | 2px teal outline, 2px offset. |
| Selected | Raised surface + left rail in the row's own status colour; graph nodes get the teal ring. |
| Disabled | `opacity: 0.45`, `cursor: not-allowed`, no hue change. |
| Busy | Teal spinner replaces the leading glyph; the label names the real query ("Querying HydraDB"). |

### Borders

Three hairline values (`--border-subtle` for chassis divisions, `--border-default` for
objects, `--border-strong` for hover/selection), one emphasis weight (2px), and two rails
(3px / 4px). Hairlines, not shadows, do the structural work — the interface is a grid of
regions, and you should be able to see the grid.

---

## 5. Component inventory

The families below are exactly the ones `docs/design/03-component-inventory.md` and
`src/client/` define. Nothing was added speculatively — there is no Toast, Avatar, Tabs,
Modal or Tooltip in this system because there is none in the product.

**`components/core/`** — `Icon`, `Button`, `Field`, `Select`, `Kicker`
**`components/status/`** — `SeverityBadge`, `StatusDot`, `StatusPill`, `StatusChip`, `CheckResult`
**`components/layout/`** — `TopBar`, `Panel`, `SectionHeading`, `ScopeNote`
**`components/evidence/`** — `SummaryMetric`, `ApplicationRow`, `ChainNode`, `EvidenceRow`, `TimelineRow`
**`components/graph/`** — `GraphNode`, `GraphLegend`
**`components/feedback/`** — `ErrorBanner`, `EmptyState`, `FullScreenState`

Each directory carries `<Name>.jsx`, `<Name>.d.ts` (props contract), `<Name>.prompt.md`
(what & when, plus a usage example) and one `@dsCard` HTML showing its states.

### Intentional additions

- **`Icon`** — a wrapper over the copied Lucide geometry so glyphs inherit `currentColor`.
  The source uses inline SVG per component; a single wrapper is the only way to keep stroke
  weight and sizing consistent across 26 glyphs.
- **`Kicker`** — the source repeats a 10px uppercase label inline in a dozen places. Naming
  it makes the pattern enforceable.
- **`StatusChip`** / **`StatusPill`** split — the source uses one label element in both
  row-leading and inline-verdict positions. Splitting them keeps the row chip square and
  glyph-only while the pill stays worded.
- **`unresolved` status treatment** — a designed state, discussed in §2.

---

## 6. Iconography

**The set is [Lucide](https://lucide.dev), copied from `lucide-icons/lucide@main` into
`assets/icons/` as 26 individual SVGs** — the same family the source implementation draws
inline, so this is a lift rather than a substitution. There is no icon font, no sprite
sheet and no PNG icon anywhere in the product.

Geometry is inlined into `components/core/icon-paths.js` (generated from the copied SVG
files) so `Icon` can render it with `currentColor`; the original `.svg` files are kept in
`assets/icons/` for use in plain HTML, where they are applied as CSS masks or `<img>` with
`filter: invert(1)`.

**Rules.** Stroke `1.75` at 16px and above, `2` below. Sizes in use: 28 (empty states), 20
(full-screen states), 17 (banners, primary buttons, chain arrows), 16 (sidebar headings,
graph nodes), 15, 14 (links, chevrons), 12 and 10 (pills). Never scale a glyph below 10px.

**Status glyphs are locked to their status** and are never decorative:

| Glyph | Locked meaning |
|---|---|
| `shield-alert` | Compromise / exposed. Also the brand mark. |
| `triangle-alert` | Tool or engine failure — never a data verdict. |
| `circle-check-big` | Outside window. Not "done", not "success". |
| `circle-slash-2` | No supporting path. |
| `circle-question-mark` | Unresolved temporal evidence. |
| `radar` | Run the blast-radius analysis. |
| `search-check` | Run the single-application exposure check. |
| `clock-3` | The UTC exposure window. |
| `database` | HydraDB. |
| `git-branch` | Data provenance / scope. |
| `box` / `package` | Application / package version. |
| `file-check` | Relationship evidence. |
| `loader-circle` | In flight (always spinning, always teal). |

**Emoji are never used. Unicode is used as typography, not as iconography** — `→` in
intervals and chains, `·` as a metadata separator, `—` for an absent value.

**Logo.** The source repository contains **no logo file**. The brand mark is therefore what
the implementation itself builds: the `shield-alert` glyph knocked out of a `--red-700`
square (30px, 5px radius), beside the wordmark "BlastRadius" in IBM Plex Sans 600 at
-0.02em. Nothing was drawn or invented. If a real mark exists, drop it in and update
`components/layout/TopBar.jsx` and `guidelines/brand-lockup.card.html`.

---

## 7. Caveats

- **Fonts are a substitution, not a supplied brand asset.** The source ships Inter plus
  system fallbacks; no licensed font files exist in the repository. IBM Plex Sans / Plex
  Mono are loaded from Google Fonts for the reasons in §2. **If BlastRadius has real brand
  fonts, send the files and this is a one-file change** (`tokens/fonts.css`).
- **No logo asset exists.** See §6.
- **The dark inversion is a design decision, not a documented requirement.** The source is
  light. Every exact colour value from `src/client/styles.css` is preserved in the token
  file (marked `src`), so a light theme is a surface swap on the same tokens if you want the
  original polarity back.
- **`unresolved` is a designed state.** The product currently reaches
  `missing_dependency_validity` but does not visually distinguish it. This system does.

---

## 8. Index

| Path | What it is |
|---|---|
| `styles.css` | The single entry point consumers link. `@import` lines only. |
| `tokens/` | `fonts` · `colors` · `typography` · `spacing` · `radius` · `elevation` · `motion` · `layout` · `base`. 232 custom properties. |
| `components/` | 23 components in 6 groups — see §5. Each with `.jsx`, `.d.ts`, `.prompt.md`, and a group `@dsCard`. |
| `guidelines/` | 24 foundation specimen cards: Colors (8), Type (6), Spacing (4), Brand (4), Motion (1), Graph (1). |
| `ui_kits/console/` | The product recreation: `index.html` (interactive), `states.html` (every route state), `mobile.html` (≤820px), plus `Workspace` / `IncidentSidebar` / `GraphCanvas` / `EvidencePanels` / `fixture.js`. See its own `README.md`. |
| `templates/incident-console/` | A starting-point template consuming projects can copy. |
| `assets/icons/` | 26 Lucide SVGs. |
| `reference/` | Screenshots of the *original* implementation, kept for comparison. |
| `thumbnail.html` | The project tile. |
| `SKILL.md` | Agent-Skills front matter so this folder works as a Claude Code skill. |
| `github.md` | Source-repository association and sync record. |
