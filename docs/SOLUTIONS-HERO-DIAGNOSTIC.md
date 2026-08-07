# Solutions hero — the Business Diagnostic

Replaces the hero system visual on `/services`. Scoped task; the page's
information architecture, section order and §0 locked decisions are unchanged.

---

## Why the old visual was replaced

`SystemVisual` said **disconnected tools → one connected hub**. That is a
systems-integration claim, and it is the positioning this page exists to argue
*against*: the page's own thesis line is

> "None of these is a tool problem. They're system problems — and they get
> diagnosed before they get built."

The enemy is complexity, founder dependency and missing visibility — not the
tools.

Two earlier attempts are worth recording, because each failed differently:

| Attempt | Why it failed |
|---|---|
| `a1a046c` (reverted in `5642244`) — static three-stage transformation map | Fixed the message but only *stated* it. A diagram of a conclusion. |
| First pass at this component — stacked signal/constraint registers with range markers | Legible and accessible, but it read as an assessment dashboard. It **presented diagnosis results** instead of letting the visitor watch a diagnosis happen. |

This build keeps that pass's business logic verbatim — same seven signals,
same three constraints, same capability mapping — and replaces the metaphor.

---

## The concept

A living constraint map. Four beats:

```
1  SYMPTOMS         seven signals drifting in a field, unconnected
2  RELATIONSHIPS    probe one → the hidden links to its siblings draw in
3  ROOT CONSTRAINT  the cause surfaces from beneath that cluster
4  SYSTEM           symptoms are absorbed; three capabilities stand on
                    one Strategy rail
```

### What keeps it from reading as a network diagram

This was the live risk in taking the spatial direction, and it is answered in
four specific ways. Any change to the component should preserve all four.

1. **At rest there are no edges.** Seven problems float in isolation — the way
   they look from inside the business. Connection is the *discovery*, not the
   permanent subject. This is the inverse of a topology drawing, where the
   edges are the whole point.
2. **Nodes are typographic.** Text chips with a hairline border. No hexagons,
   no circles, no icons, no glyphs.
3. **Constraints surface under their own cluster**, at its x-centroid, at
   staggered depths. Nothing is a hub that everything else plugs into.
4. **Edges mean "same cause", never "sends data to".** Peer links are dashed —
   a shared cause is an inference, not a wire. Traces into the constraint are
   solid, and they draw in *after* the peer links, so the sequence reads
   relate → trace → conclude.

### The entrance demo

On scroll-in the map diagnoses one cluster by itself — the three-signal one,
because it is the clearest proof that separate-looking problems share a cause —
then lets go. It shows the visitor that probing is possible without asking them
to guess, and it is the only place the sequence plays unprompted. Any real
interaction retires it permanently, including a pending one.

---

## Implementation notes

**Geometry.** Nodes are absolutely positioned HTML at x/y percentages, so
labels stay real text (wrapping, RTL, focusable, readable by AT) and are correct
on first paint with no measurement. Edges are SVG over the same field, drawn in
a **pixel** viewBox taken from a `ResizeObserver` — matching the element 1:1
keeps the scale uniform, so hairlines and dash patterns behave normally. (An
earlier revision used `viewBox="0 0 100 100"` with `preserveAspectRatio="none"`;
that needs `vector-effect="non-scaling-stroke"`, whose interaction with
`pathLength` is not reliably specified. Not worth the risk.) Until the first
measurement the edge layer does not render, which costs nothing: every edge is
transparent at rest anyway.

**Edge endpoints are each node's base centre while the chip drifts a few px off
it.** That never shows — the chip is opaque, sits above the edge layer, and is
far larger than the drift, so every edge terminates behind its chip.

**Two layouts, picked from the field's measured width, not the viewport.** The
component sits in a ~495px hero column on a 1280px screen, so a viewport
breakpoint would pick the wrong one. Narrow (<400px) is a real composition, not
a fallback: taller field, wider vertical spread, same seven nodes, same
interactions, and the resolve formation stacks vertically instead of spreading.

**`strokeDashoffset` is set in `style`, not as an attribute.** A presentation
attribute participates in the cascade at the lowest priority; putting the value
in an inline CSS declaration is what makes the transition reliable. `pathLength=1`
makes the draw-in independent of the actual path length.

**Drift pauses, never unmounts.** Removing the animation would snap a node back
to its base point mid-hover. `animation-play-state: paused` holds it where it
is, and the field "holds its breath" while the map is being read.

---

## Deviations from the spec, and why

| Spec | This build | Rationale |
|---|---|---|
| §12.6 "Hero animation runs once on load … not looping" | **Two looping animations**: node drift (±5px, 13–22s, out of phase) and a slow pulse on dormant constraints. Both pause when a cluster is active, stop on resolve, stop off-screen, and are omitted under reduced motion. | Requested directly: the hero must feel like a living system map, not a static exhibit. The amplitude is at the edge of perception and both are transform/opacity only. |
| §12.6 "Permitted: two radial accent glows (hero, final CTA)" | A third, inside the frame — a very faint accent radial under the constraint zone | Carries "something beneath the surface" before anything down there has a name. It is inside the frame, not a section background. |
| §12.6 "Card glyphs are hexagon line-art … no other iconography" | No iconography at all | Consistent with the rule's intent; nothing new introduced. |
| §12.5 "Hero + system visual, two-column" | Unchanged | The frame occupies the same grid cell. |
| §4 "min 44px tap height" | Signal chips are ~36px tall | That rule is written for the router's stacked full-width buttons. A spatial map cannot carry seven 44px chips at 302px wide. 36px clears WCAG 2.2 §2.5.8 (24px) comfortably. |

---

## Accessibility

- Every node is a real `<button>` with real text. Nothing is an image with one
  `alt` string.
- Chips show a short label; the **full statement is the accessible name** via an
  `sr-only` suffix, so screen readers get the business meaning rather than a
  two-word fragment. The visible label leads, so voice control still matches
  what is on screen (WCAG 2.5.3).
- Hover previews are suppressed for `pointerType === "touch"`, and focus
  previews are gated on `:focus-visible`, so a tapped node is never stuck lit.
- Absorbed signal nodes (resolved mode, `opacity: 0`) get `tabIndex={-1}`,
  `aria-hidden`, and `pointer-events: none` — invisible content is never a
  focus trap.
- In resolved mode the three system nodes render as `<div>`s, not dead buttons.
- The edge layer and the Strategy caption are `pointer-events: none`: a stroke
  or an invisible caption must never intercept a hover meant for a node.
- The readout is `aria-live="polite"` and every node points at it with
  `aria-describedby`.
- Emphasis is colour, not opacity: `white` (active) → `slate-300` (rest) →
  `slate-400` (de-emphasised), all above 4.5:1 on the frame surface.
- Under reduced motion: no drift, no demo, no travel transitions. The map
  renders static and every interaction still works.

## RTL

Node text, the readout and all chrome use logical properties and real text; the
toggle arrow mirrors via `rtl:-scale-x-100`. The scatter itself is **not**
mirrored — it is an abstract field whose only directional meaning is vertical
(symptoms above, causes beneath), so mirroring would add risk without adding
meaning. Capability names stay in `dir="ltr"` runs. Numerals are Western in both
languages (§12.7).

---

## Files changed

| File | Change |
|---|---|
| `client/src/components/systems/BusinessDiagnostic.tsx` | **New.** The component. Self-contained: reads its own copy, measures its own field, gates its own motion. |
| `client/src/components/systems/index.ts` | Export `BusinessDiagnostic` + its props type. |
| `client/src/pages/Services.tsx` | Hero renders `<BusinessDiagnostic />`; the local `SystemVisual` function is deleted. |
| `client/src/lib/i18n.tsx` | Removed the 7 orphaned `solutions.viz.*` keys; added 32 `solutions.diag.*` keys. EN/AR parity verified at **466/466**. |
| `client/src/index.css` | Removed the now-unused `connector-draw` keyframe; added `node-drift`, `constraint-breathe`, `diag-resolve`. |

Deleted keys and the `connector-draw` keyframe were orphaned **by this change
only** — nothing else referenced them (verified by grep). No pre-existing dead
code was touched.

`docs/CRO-Audit.md` shows as deleted in `git status`; that predates this work.

## Placeholders / TODOs left behind

None. No new `TODO(...)` markers, no invented metrics, no fabricated client
claims. The seven signals and three constraints are positioning statements, not
data — no figure on screen is presented as measured.

## Verification

- `npm run check` (tsc) — clean.
- `npm run build` — clean. `BusinessDiagnostic` code-splits into its own
  11.18 kB / 3.81 kB gzip chunk; `Services` unchanged at 21.89 kB.
- EN/AR key parity — 466/466, nothing missing on either side.
- Every `t()` key the component references exists in both languages, and no
  `solutions.diag.*` key is orphaned.
- Node positions were checked **arithmetically** against the field dimensions
  and the node max-widths at both layouts: no chip is clipped by a field edge
  and no two chips overlap, allowing for two-line wrapping.

### Not verified

**Rendered appearance.** No browser was driven for this change. The arithmetic
above is not a substitute for looking at it, and this build is far more
layout-sensitive than the previous one:

- The scatter is hand-tuned. Arabic labels are longer and wrap differently, so
  the Arabic field is the most likely place to find a collision.
- The wide layout is tuned for roughly 1.3:1. Between ~450px and ~640px viewport
  the field goes near-square and the scatter stretches vertically.
- The narrow/wide switch at 400px was not observed crossing.

Positions are all in the `LAYOUTS` constant at the top of the file — tuning is
editing numbers there, nothing else.
