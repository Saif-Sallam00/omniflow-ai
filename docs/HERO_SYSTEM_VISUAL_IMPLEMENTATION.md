# Hero — Connected-Systems Visual Integration

> **Scope:** Homepage **hero only.** Integrate the already-built connected-systems
> components into the hero. No new sections, no copy changes, no routing/data/model
> changes, no product mockups, no fake metrics, no new dependencies.
>
> **Verification:** `npm run check` (tsc) → **0 errors**. `npm run build` →
> **success**. Wiring confirmed present in the built Home chunk.

---

## Summary

The hero now expresses OmniflowAI's core idea visually: **three real pillars — AI
Training · Digital Marketing · Software — flowing into one central system node.** The
existing headline, subhead, and both CTAs are **unchanged** in text. The hero's inner
layout became a two-column ("beside") composition on desktop — copy on one side, the
`SystemMap` on the other — and stacks to a single column (copy first, visual below) on
mobile so the visual never crowds the copy. A `HexGridSubstrate` at ~3.5% opacity sits
behind the whole hero as an engineered texture.

Everything reuses the components in `client/src/components/systems/`; **no component
code changed** in this pass. Orange stays rationed: only the **central system node** and
**one pulsing flow line** carry brand color — the three pillar nodes and their connectors
are neutral slate.

---

## Files Changed (1)

- `client/src/pages/Home.tsx`
  - Added import: `SystemMap, HexGridSubstrate, hub, hubEdges, type SystemMapNode` from
    `@/components/systems`.
  - Added a module const `HERO_SPOKES` mapping the three pillar ids → their site-wide
    lucide icons (`Bot`, `Target`, `Layers`, already imported) + real i18n label keys
    (`serviceOpt.*`).
  - In the component body, built `heroNodes` / `heroEdges` from the `hub(...)` /
    `hubEdges(...)` presets (center node id `"system"`, unlabeled).
  - Replaced the hero's inner container with a `grid lg:grid-cols-2` (copy + visual) and
    inserted `<HexGridSubstrate>` (full-bleed) and `<SystemMap>`.

No other files were touched. No component in `components/systems/` was modified. No
i18n keys were added (labels/aria-label reuse existing strings).

---

## How the visual was placed

- **Substrate:** `<HexGridSubstrate className="absolute inset-0" opacity={0.035}
  fade="radial" />` — a single tiled hex `<pattern>` behind everything, radial-faded at
  the edges, `pointer-events-none`, `aria-hidden`. Whisper-subtle (~3.5%).
- **SystemMap (three-pillar hub):**
  - `nodes = hub("system", ["ai-training","digital-marketing","software"])` → one
    **accented, solid center node** ("the connected system") + three **neutral outline
    spoke nodes** with pillar icons and **real translated labels** (`serviceOpt.*`).
  - `edges = hubEdges("system", ids)` → each spoke → center; **only the first edge
    pulses** (one pulse total).
  - `ariaLabel={t("home.pillars.title")}` — an existing bilingual string
    ("Three capabilities. One transformation partner."), so the diagram is exposed to
    assistive tech as a single meaningful image with **no new copy**.
  - `nodeSize={30}`; the SVG scales fluidly (`viewBox`, `w-full h-auto`).
- **Layout:** desktop = copy column + visual column, vertically centered. Mobile/tablet
  = single column, copy first, visual below in a `max-w-sm` box so it stays modest.
- **No invented content:** the center node is intentionally **unlabeled** (no
  fabricated "system" string); pillar labels are real i18n; no metrics, no product
  screenshot, no dashboard.

---

## RTL behavior

- The hero grid reverses naturally under `dir="rtl"` (copy moves to the right column,
  visual to the left) because it uses logical grid flow; copy alignment uses logical
  classes (`lg:text-start`, `lg:justify-start`, `lg:mx-0`).
- The `SystemMap` mirrors its **own** geometry internally (`mirrorOnRTL` default `true`):
  every x-coordinate passes through `mx(x) = width - x`, so nodes/edges/flow-direction
  mirror while **labels stay upright and readable** (labels are center-anchored, only
  their x is mirrored — glyphs are never flipped).
- Arabic labels come from the translated `serviceOpt.*` keys (e.g. "التدريب على الذكاء
  الاصطناعي", "التسويق الرقمي", "البرمجيات") and render legibly.

## Reduced-motion behavior

- The single pulsing flow line is gated twice: the global
  `@media (prefers-reduced-motion: reduce)` block in `index.css` **and** the
  `useReducedMotion()` hook inside `FlowLine`, which prevents the animated "comet" path
  from being **mounted** at all under reduced motion.
- Result with reduced motion ON: a clean, fully static diagram — no motion, no
  frozen-mid-animation artifact. (Confirmed the gate string is present in the built
  chunk.)
- Motion budget: **exactly one** pulsing edge (`hubEdges` pulses only the first), well
  within the "max 1–2" rule; `SystemMap` additionally caps pulses at 2.

## Responsive behavior

- **Desktop (`lg+`):** two columns — copy start-aligned beside the map, both centered
  vertically in the `min-h-[80vh]` hero. Map fills its column (`lg:max-w-none`).
- **Tablet/mobile (`< lg`):** single column. Copy stays centered (as before) and comes
  **first**; the map sits **below**, constrained to `max-w-sm` and centered, so it never
  crowds the headline/CTAs.
- The map is SVG with a `viewBox` + `w-full h-auto`, so it scales cleanly at every width
  with no fixed pixel sizes; the hero keeps `overflow-hidden` so nothing spills.

## Accessibility notes

- The map is exposed as a **single** `role="img"` with a real bilingual `aria-label`
  (`home.pillars.title`); all inner nodes, icons, edges, and labels are `aria-hidden`,
  so screen readers get one concise description, not a pile of decorative shapes.
- The substrate is `aria-hidden` + `pointer-events-none`.
- No content is conveyed by color alone — pillars are distinguished by **icon + text
  label + shape**, not hue. Orange marks only the central hub + one pulse.
- Headline/subhead/CTAs are unchanged and remain the primary, high-contrast content;
  the visual sits in its own column and never overlaps the text.
- No focusable elements were added (the map is non-interactive), so keyboard/focus order
  is unchanged.

## Risks / Visual QA items

1. **Desktop alignment shift.** The hero copy moves from centered to **start-aligned**
   on `lg+` (required by the two-column "beside" layout). Text is unchanged; only
   alignment differs. Worth an eyeball to confirm it reads as intended vs. the old
   centered hero.
2. **Label fit at small scales.** The Arabic "AI Training" label is long; it's
   center-anchored at the top node where there's horizontal room, and the outer `<svg>`
   clips to its `viewBox` (UA default), so worst case is a hairline clip, never a layout
   break. Recommend a quick visual check in `ar` at `sm` and `lg`.
2. **Mobile stack height.** The hero is taller on mobile (copy + map below). It's within
   a hero's norms, but confirm the map's `max-w-sm` size feels balanced under the CTAs.
3. **Contrast of node labels.** Labels use `fill-slate-400` on gunmetal (AA-safe for the
   size); the accented center/label use `brand-400`. Confirm legibility on the darkest
   part of the substrate.
4. **Live browser pass not run here.** Only `npm run check` + `npm run build` were run
   (as requested). Recommend a manual pass across breakpoints, `en`/`ar`, and
   reduced-motion on/off before shipping.
5. **No fake data / no red** — verified absent in the built chunk; the center node is
   unlabeled (no invented "system" copy).

## Build / Check results

```
npm run check   (tsc)          → 0 errors
npm run build   (vite+esbuild) → success (only the pre-existing >500 kB chunk advisory)
Home chunk: ~80.1 KB → ~84.6 KB (systems components now bundled; no new dependencies)
```

Built-chunk verification (`dist/public/assets/Home-*.js`):
- Real node labels present: `serviceOpt.ai-training` / `serviceOpt.digital-marketing` /
  `serviceOpt.software`.
- Map aria-label source present: `home.pillars.title`.
- Substrate pattern (`hexsub-`), `role="img"`, and the `prefers-reduced-motion` gate all
  present.
- No `to-red-600` and no invented "Connected System"/"One System" strings.

*No linter is configured (repo policy); tsc + build are the available checks and both
pass. Homepage changes are confined to the hero; no sections, copy, routes, data, or
brand colors were changed.*
