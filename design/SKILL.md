---
name: blastradius-design
description: Use this skill to generate well-branded interfaces and assets for BlastRadius, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for protoyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Fastest orientation

1. `readme.md` — product context, content fundamentals, visual foundations, iconography, index.
2. `styles.css` → `tokens/` — link `styles.css` and use the custom properties; never hard-code a hex.
3. `components/<group>/<Name>.prompt.md` — what each component is for and when to use it.
4. `ui_kits/console/` — the real product recreation. Read `Workspace.jsx` before designing any new BlastRadius screen.

## Non-negotiables for this brand

- Four signal hues, one meaning each: red = compromise/exposed, amber = outside window, teal = measured/selected, steel = unresolved. Never decorative.
- `unresolved` must never look like `not exposed`. Steel + 135° hatch + question glyph + "Temporal evidence incomplete".
- The chassis is square and hairlined; radius belongs to objects on top of it.
- No emoji, no photography, no illustration, no gradients, no backdrop blur, no bouncing motion.
- Evidence strings and entity IDs are quoted verbatim in IBM Plex Mono. Never paraphrase, never replace with a score.
- An absent value is an em dash, never `0`.
- Keep the data-provenance note ("curated demonstration fixture") on screen.
