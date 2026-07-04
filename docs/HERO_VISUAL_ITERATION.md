# Hero Visual — Iteration (bigger, richer, more premium)

> **Scope:** Homepage **hero only** + the shared `components/systems/` primitives it
> uses. No copy, CTAs, sections, routes, data, or brand colors changed.
>
> **Verification:** `npm run check` → **0 errors**, `npm run build` → **success**.
> Rendered result confirmed in a real browser across EN/AR × desktop/mobile
> (screenshots below).

---

## Summary

The first pass wired a small, correct SystemMap into the hero, but it read as a tiny
decorative icon row — and (a real defect) **every connector line was orange** because
`FlowLine` derived its accent from the hub node, which touches every edge. This
iteration makes the visual the **main brand element**: a large, dominant, softly-glowing
central hub with three primary pillars **plus two real supporting capabilities**, richer
depth via layered lines, generous spacing — and orange correctly rationed to just the
hub and one pulse.

## Screenshots

| View | Path |
|---|---|
| English desktop | `docs/hero-shots/en-desktop.png` |
| Arabic desktop | `docs/hero-shots/ar-desktop.png` |
| English mobile | `docs/hero-shots/en-mobile.png` |
| Arabic mobile | `docs/hero-shots/ar-mobile.png` |

(Reduced-motion was **not** re-verified in-browser this pass — see that section for the
code-level guarantee.)

## What changed

1. **Fixed the orange over-use (defect).** Edge accent is now an explicit per-edge
   property (`SystemEdge.accent`) instead of being inherited from the connected node. So
   the hub can be orange without turning all five lines orange. Now **only one line is
   orange** (AI Training → hub, which also carries the single pulse); the rest are neutral
   slate.
2. **Bigger footprint.** The map viewBox went `320×200` → `400×372` and `nodeSize`
   `30 → 40`; the visual now fills its hero column (~490px tall on desktop) instead of a
   ~214px strip — roughly a third of the hero, reading as the primary visual.
3. **Dominant central hub.** New per-node `scale` (hub = 1.9×) plus a soft radial brand
   glow (`halo`) and a slightly heavier stroke make the hub clearly the unified
   "OmniflowAI system." It stays unlabeled (no invented copy).
4. **Network richness.** Added two **neutral supporting nodes** using real i18n labels —
   **Web** (`category.web`) and **Automation & AI** (`category.automation`) — connected to
   the hub with faint background lines. Five nodes around one hub now read as a system,
   not three icons.
5. **Depth layering.** `FlowLine` gained a `faint` mode (thinner, lower opacity); the two
   support lines render faint/behind, the three primary lines render stronger/front, and
   the one accent line sits on top with the comet. Faint edges are painted first for
   back-to-front depth.
6. **Spacing / breathing room.** Larger radii and label sizing proportional to node size
   (`labelSize ≈ nodeSize × 0.34`) keep labels legible at every scale and give the diagram
   air.
7. **Integration.** The `HexGridSubstrate` (~3.5%) behind the hero is now clearly visible
   as a faint engineered texture, and the hub glow ties the map into the dark ground so it
   reads as part of the hero rather than a floating widget.

## Before / after reasoning

- **Before:** small, isolated, icon-like; all lines orange (too loud); no hierarchy
  between nodes; no supporting context.
- **After:** one dominant orange hub + one orange pulse line; everything else neutral
  slate; a labeled 5-node network with real capabilities; layered line depth; ~3× the
  footprint. It now communicates "many capabilities → one connected system," which is the
  positioning, while staying calm and premium (no neon, restrained orange).

## Files changed

- `client/src/pages/Home.tsx` — rebuilt the hero map model (explicit nodes/edges: hub +
  3 pillars + Web + Automation), set `width/height/nodeSize`, removed the old
  `hub()/hubEdges()` helper usage and the `HERO_SPOKES` const.
- `client/src/components/systems/primitives.ts` — `SystemNode` gained `scale?`, `halo?`;
  `SystemEdge` gained `accent?`, `faint?`.
- `client/src/components/systems/FlowLine.tsx` — added `faint` (thinner + lower opacity);
  accent is now honored as passed (per-edge).
- `client/src/components/systems/SystemMap.tsx` — per-node `scale`; hub `halo` (soft
  radial brand glow via `<radialGradient>`); per-edge `accent`/`faint`; faint edges
  painted first; label size proportional to `nodeSize`.

No files outside the hero and the systems components were touched. No i18n keys added
(labels/aria-label reuse existing strings). No new dependencies.

## Responsive behavior

- **Desktop (`lg+`):** two columns — copy start-aligned, the map filling the opposite
  column (~490px tall). Balanced; the map does not overpower the headline (headline is
  large/white on the left; orange is limited to the hub + one line).
- **Mobile/tablet (`< lg`):** single column, copy first, map below in a `max-w-sm` box,
  centered. It does not crowd the copy. Measured hero height ≈ **116vh** on a 390×844
  device (slightly over one screen — acceptable for a hero with a visual; see risks).
- The SVG scales via `viewBox` + `w-full h-auto`; labels scale with it and stay readable
  because label size is tied to `nodeSize`.

## RTL behavior

- The hero grid reverses via logical flow (copy right, map left in Arabic); copy alignment
  uses logical utilities.
- `SystemMap` mirrors its own geometry (`mirrorOnRTL`, default true): all x-coordinates
  pass through `mx(x) = width − x`, so nodes/edges/flow mirror while **labels stay upright**
  (only their x mirrors). Verified in browser: Software/Digital-Marketing swap sides
  correctly and Arabic labels ("التدريب على الذكاء الاصطناعي", "البرمجيات", "التسويق
  الرقمي", "الويب", "الأتمتة والذكاء الاصطناعي") render legibly.

## Reduced-motion behavior

- Unchanged and still double-gated: the global `@media (prefers-reduced-motion: reduce)`
  block in `index.css` neutralizes animation, **and** `FlowLine` uses `useReducedMotion()`
  to avoid mounting the comet path at all. With reduced motion the hero shows a clean,
  fully static diagram (hub glow is static — it's a gradient, not an animation).
- Motion budget: exactly **one** pulsing line (the AI-Training→hub accent edge);
  `SystemMap` still caps pulses at 2.
- Note: this pass verified layout in-browser but did **not** re-toggle the OS
  reduced-motion setting in the browser; the guarantee above is by code (validated in
  earlier passes and unchanged here).

## Risks / QA items

1. **Support-node labels can crowd, esp. Arabic mobile.** The two bottom labels — "الويب"
   and the long "الأتمتة والذكاء الاصطناعي" — sit close together at the smallest size.
   They're readable but tight. *Optional fix:* widen the horizontal gap between the `web`
   (x=150) and `automation` (x=250) nodes, or drop to a single supporting node. Not
   blocking.
2. **Mobile hero height ≈ 116vh.** Slightly taller than one screen. Acceptable, but if you
   want it ≤100vh, cap the mobile map (`max-w-xs`) or reduce the viewBox height. Optional.
3. **Hub glow strength.** The radial glow reads premium at ~0.3 peak opacity; on very
   bright displays confirm it's still "soft," not "neon." Optional tuning knob
   (`stopOpacity`).
4. **Desktop copy alignment** remains start-aligned (from the two-column layout), a change
   from the original centered hero. Intentional and unchanged this pass.
5. **No fake data / no red** — confirmed: center hub unlabeled, all labels are real i18n,
   no red anywhere in the hero.

## Build / check results

```
npm run check   (tsc)          → 0 errors
npm run build   (vite+esbuild) → success (only the pre-existing >500 kB chunk advisory)
```

*Browser verification was performed with the dev server (now stopped). No linter is
configured; tsc + build are the available static checks and both pass. Changes are
confined to the hero and the systems components.*
