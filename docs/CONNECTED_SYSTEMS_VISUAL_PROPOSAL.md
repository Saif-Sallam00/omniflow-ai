# OmniflowAI — Connected-Systems Visual Language (Technical / Design Proposal)

> **Status:** Proposal only. **No code changes.** Homepage is **not** being redesigned in
> this document — this specifies the reusable visual-language toolkit that a *later*
> approved pass would build and place.
>
> **Design direction:** "Ember on gunmetal" (see `docs/DESIGN_DIRECTION_REFINEMENT.md`).
> Thin geometric line-work — hexagon nodes, flow lines, small system maps — rendered as a
> calm, mostly-neutral diagram on the dark ground, with orange used sparingly as a signal.
> Derived from the existing logo hexagon so it's ownable, not generic "tech lines."
>
> **Hard constraints honored throughout:** no heavy dependencies · CSS/SVG only ·
> reduced-motion support · RTL-safe · reusable components · orange/ember on gunmetal via
> existing tokens · **no fake metrics or fake product data.**

---

## 1. Principles

1. **CSS + inline SVG only.** Zero new runtime dependencies. No canvas, no WebGL, no
   animation libraries (framer-motion stays removed). Geometry is plain SVG; motion is CSS
   `transform`/`opacity`/`stroke-dashoffset` (compositor-friendly).
2. **Token-driven.** Everything consumes the tokens shipped in the foundation pass:
   `brand`/`--brand-400/500/600/700/light`, neutrals (`slate-*`), `--ease-standard`,
   `--duration-fast/base/slow`, `shadow-card`/`shadow-elevated`. No hardcoded hexes.
   Because `brand` is a Tailwind color, `fill-brand-500`, `stroke-brand-400`,
   `fill-brand-500/10` etc. are already available as utilities.
3. **Decorative by default, semantic on request.** Every visual is `aria-hidden` +
   `pointer-events-none` unless it genuinely conveys meaning, in which case it exposes a
   single `role="img"` + `aria-label` and hides its internals from assistive tech.
4. **Motion is a whisper.** One or two slow pulses on screen at most. All motion is gated
   twice: the global `@media (prefers-reduced-motion: reduce)` block (already in
   `index.css`) **and** a JS `useReducedMotion()` gate that avoids *mounting* infinite
   animations at all.
5. **No invented data.** Nodes/lines are abstract geometry. Labels come only from real
   sources (`shared/taxonomy.ts` pillar/capability names, or i18n keys). `ProductFrame`
   frames only **real** project images or a neutral empty state — never fabricated
   dashboards, charts, or numbers.
6. **RTL is first-class.** Directional composition (flow reading order, chrome, labels)
   mirrors correctly under `dir="rtl"`; symmetric primitives (hexagons, grids) are
   inherently safe.

---

## 2. Proposed file layout

```
client/src/components/systems/
  index.ts                 # barrel export
  primitives.ts            # geometry + shared types (hexPath, layout presets, Point)
  HexNode.tsx              # single hexagon node
  FlowLine.tsx             # connector between two points, optional traveling pulse
  SystemMap.tsx            # composes nodes + edges into a diagram (declarative)
  HexGridSubstrate.tsx     # full-bleed low-opacity background texture
  ProductFrame.tsx         # minimal app-window chrome around real media/children
client/src/hooks/
  use-reduced-motion.ts    # matchMedia gate for JS-driven motion decisions
client/src/index.css       # + @keyframes hex-pulse, flow-travel (gated by existing RM block)
```

Rationale: a dedicated `components/systems/` namespace keeps the visual language separate
from `components/ui/` (shadcn primitives) and page components, matching the repo's existing
separation. A barrel `index.ts` gives one import site: `import { SystemMap } from
"@/components/systems"`.

---

## 3. Shared foundations (build these first)

### 3.1 Geometry — `systems/primitives.ts`

Pure functions + types, no React. Keeps every component's SVG math in one tested place.

```ts
export type Point = { x: number; y: number };
export type HexOrientation = "flat" | "pointy";

// Regular hexagon path string for an SVG <path d=...>, centered at (cx,cy), radius r.
export function hexPath(cx: number, cy: number, r: number, o: HexOrientation = "flat"): string;

// Node model used by SystemMap
export type SystemNode = {
  id: string;
  x: number; y: number;          // in the map's viewBox coordinate space
  variant?: "solid" | "outline" | "ghost";
  labelKey?: string;             // i18n key OR taxonomy label — never a literal invented string
  icon?: LucideIcon;             // optional centered glyph
  accent?: boolean;              // tint with brand
};
export type SystemEdge = {
  from: string; to: string;
  variant?: "straight" | "elbow" | "curve";
  pulse?: boolean;
};

// Layout presets that generate node coordinates for common shapes.
export const layouts = {
  hub(centerId: string, spokeIds: string[]): SystemNode[] /* hub-and-spoke */,
  pipeline(ids: string[]): SystemNode[]                    /* left→right chain */,
  mesh(ids: string[]): SystemNode[],
};
```

All coordinates live in a fixed **viewBox** (e.g. `0 0 320 200`); the SVG scales fluidly via
`preserveAspectRatio="xMidYMid meet"`. No pixel math in components.

### 3.2 Motion gate — `hooks/use-reduced-motion.ts`

```ts
export function useReducedMotion(): boolean; // window.matchMedia('(prefers-reduced-motion: reduce)')
```

- SSR/first-paint safe (defaults to `true` — i.e., *no* motion — until measured, so we never
  flash an animation at motion-sensitive users).
- Subscribes to changes so toggling the OS setting updates live.
- Used to **conditionally not render** the animated overlay `<path>`/`<circle>`, which is
  stronger than CSS alone (the global RM block only zeroes durations).

### 3.3 Motion keyframes — added to `client/src/index.css`

Two keyframes, both extremely subtle, both already covered by the existing
`@media (prefers-reduced-motion: reduce)` block:

```css
/* Node "breathing" — barely-there opacity lift */
@keyframes hex-pulse { 0%,100%{opacity:.85} 50%{opacity:1} }

/* Flow "comet" — a short bright dash travelling the path */
@keyframes flow-travel { to { stroke-dashoffset: -240; } }
```

Durations/easing come from tokens (`--duration-slow` ≈ 400ms for hover, 3–5s for ambient
pulses; `--ease-standard`). No `!important`; nothing animates `width/height/top/left`.

---

## 4. Components

### 4.1 `HexNode` — `systems/HexNode.tsx`

**Purpose:** the atomic unit — a single hexagon (the logo glyph abstracted). Represents a
"system": solid = owned/active, outline = connected external, ghost = inactive/background.

**Proposed signature**

```tsx
<HexNode
  size={40}
  variant="solid" | "outline" | "ghost"
  accent={false}
  icon={Boxes}          // optional lucide glyph, centered
  orientation="flat"
  pulse={false}         // ambient breathing (gated)
  label="ERP"           // optional visible micro-label (real/taxonomy only)
  ariaLabel="ERP system node"  // if semantic; else omitted → aria-hidden
  className=""
/>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | number | `40` | px of the SVG box; hexagon radius derived |
| `variant` | `"solid"\|"outline"\|"ghost"` | `"outline"` | fill/stroke recipe (below) |
| `accent` | boolean | `false` | tint with `brand` instead of neutral slate |
| `icon` | `LucideIcon?` | — | centered; inherits node color; RTL flips via existing lucide rules |
| `orientation` | `"flat"\|"pointy"` | `"flat"` | flat-top reads calmer/enterprise |
| `pulse` | boolean | `false` | ambient `hex-pulse` (only when motion allowed) |
| `label` | string? | — | tiny caption under/beside; **must be real** (taxonomy/i18n) |
| `ariaLabel` | string? | — | present → `role="img"`; absent → `aria-hidden` |

**Visual recipe (tokens):**
- solid: `fill-brand-500/10` + `stroke-brand-500` (accent) or `fill-slate-800/40` +
  `stroke-slate-700` (neutral), stroke `1.5`.
- outline: transparent fill + `stroke-slate-700` (or `stroke-brand-500/60` if `accent`).
- ghost: `fill-slate-800/20`, `stroke-slate-800`.

**A11y:** decorative unless `ariaLabel`. Label text (if any) uses `text-slate-300`/`text-brand-400`
to stay AA on gunmetal.
**Perf:** one `<svg>` with one `<path>`; trivial. `pulse` animates `opacity` only.
**RTL:** symmetric — safe; inner icon flips via the existing `[dir=rtl] .lucide-*` rules.

---

### 4.2 `FlowLine` — `systems/FlowLine.tsx`

**Purpose:** a thin connector between two points, optionally carrying a slow traveling
"comet" pulse to express flow/intelligence.

**Proposed signature**

```tsx
<FlowLine
  from={{x, y}} to={{x, y}}
  variant="curve" | "straight" | "elbow"
  accent={false}
  dashed={false}
  pulse={false}
  strokeWidth={1.5}
/>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `from`/`to` | `Point` | — | in the parent SVG's viewBox space |
| `variant` | `"straight"\|"elbow"\|"curve"` | `"curve"` | curve = soft bézier; elbow = orthogonal (engineered) |
| `accent` | boolean | `false` | `stroke-brand-500` vs `stroke-slate-700` |
| `dashed` | boolean | `false` | for "planned/external" links |
| `pulse` | boolean | `false` | mounts the traveling comet **only if** motion allowed |
| `strokeWidth` | number | `1.5` | keep thin |

**Pulse implementation (no deps):** two stacked `<path>`s sharing one `d`:
1. **base** — faint (`stroke-slate-700` or `stroke-brand-500/30`).
2. **comet** — `stroke-brand-400`, `stroke-dasharray: 8 232`, `stroke-linecap: round`,
   `animation: flow-travel var(--flow-dur,4s) linear infinite`. Rendered **only** when
   `pulse && !useReducedMotion()`.

**A11y:** always decorative → the component root is `aria-hidden`. Meaning is conveyed by the
parent `SystemMap`'s label, not per-line.
**Perf:** animates `stroke-dashoffset` (compositor-friendly, no layout). Cap to ≤2 pulsing
lines visible; `SystemMap` enforces this.
**RTL:** `FlowLine` itself is coordinate-based; mirroring is handled once by `SystemMap`
(§4.3), so lines don't each need RTL logic. Standalone use should pass a `dir`-aware `from`/`to`.

---

### 4.3 `SystemMap` — `systems/SystemMap.tsx`

**Purpose:** compose `HexNode`s + `FlowLine`s into a small, declarative architecture diagram
(hub-and-spoke or pipeline). This is the flagship device — e.g. "acquire → convert →
operate," or an ERP/CRM/Web/Automation hub.

**Proposed signature**

```tsx
<SystemMap
  nodes={SystemNode[]}          // or:
  layout="hub" | "pipeline" | "mesh"
  ids={["erp","crm","web","automation"]}   // when using a layout preset
  edges={SystemEdge[]}
  animated={true}               // ambient pulses (still RM-gated internally)
  mirrorOnRTL={true}
  ariaLabel="Diagram of OmniflowAI's connected systems"
  className="w-full max-w-xl"
/>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `nodes` / `ids`+`layout` | model or preset | — | preset generates coords via `primitives.layouts` |
| `edges` | `SystemEdge[]` | derived | if omitted, hub/pipeline presets infer sensible edges |
| `animated` | boolean | `true` | whether edges may pulse; individually capped to ≤2 |
| `mirrorOnRTL` | boolean | `true` | flips the diagram horizontally under RTL, counter-flips labels |
| `ariaLabel` | string | — | **required** — the whole map is one `role="img"` |
| `density` | `"sm"\|"md"` | `"md"` | controls node size/stroke for compact vs feature use |

**Visual behavior:** renders one `<svg viewBox="0 0 320 200">`; draws edges *under* nodes;
nodes on top. Labels (real taxonomy/i18n only) sit beside nodes in `text-slate-300`. Accent is
rationed — typically one hub node + one pulsing edge is `brand`, the rest neutral.

**RTL strategy (the one place mirroring lives):**
- Read `isRTL` from `useI18n()`.
- When `mirrorOnRTL && isRTL`: wrap all geometry in `<g transform="translate(W,0) scale(-1,1)">`
  so the diagram reads right→left, **then** counter-transform each `<text>` label with a local
  `scale(-1,1)` so words stay legible. (Same philosophy as the existing
  `[dir=rtl] .lucide-arrow-*` flip.)
- Symmetric hexagons are unaffected; only flow direction + label anchoring change.

**A11y:** the SVG gets `role="img"` + `aria-label`; all inner nodes/edges/labels are
`aria-hidden`. The label is sourced from i18n (bilingual), describing the *concept*, never a
metric. If a node is a link, it must be a real focusable `<a>`/wouter `<Link>` with the
existing focus ring — but default maps are non-interactive.
**Perf:** a handful of paths/polygons; one SVG paint. Ambient animation limited to ≤2 comet
edges. For the hero, mount lazily / below-the-fold maps can defer `animated` until in view via
a tiny IntersectionObserver (optional, no dep).
**No fake data:** node labels must come from `shared/taxonomy.ts` (`PILLARS`, capability
names) or i18n keys. The map shows *relationships*, not made-up KPIs.

---

### 4.4 Subtle pulse animation (the motion sub-system)

Not a single component but a **shared behavior** used by `HexNode` (`pulse`) and `FlowLine`
(`pulse`), defined by:
- the two keyframes in §3.3 (`hex-pulse`, `flow-travel`),
- the `useReducedMotion()` gate (§3.2),
- token-based durations (ambient 3–5s, `--ease-standard`).

**Rules:**
- Max **1–2** pulses per viewport (enforced by `SystemMap`; documented for manual use).
- Pulses never loop faster than ~3s (calm, not blinking).
- Under reduced motion: comet path/breathing simply **isn't mounted** → a clean static
  diagram. No frozen-mid-animation artifacts.
- Only `opacity` and `stroke-dashoffset` animate — no layout, no `filter` blur loops (a single
  static `drop-shadow` on an accent node is allowed; animated blur is not, for perf).

---

### 4.5 `HexGridSubstrate` — `systems/HexGridSubstrate.tsx`

**Purpose:** a full-bleed, very-low-opacity hexagon/dot grid that signals "engineered
surface" as a section background — the ambient texture of the brand.

**Proposed signature**

```tsx
<HexGridSubstrate
  variant="hex" | "dot" | "grid"
  cell={28}
  opacity={0.04}
  fade="radial" | "top" | "none"
  className="absolute inset-0"
/>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `"hex"\|"dot"\|"grid"` | `"hex"` | hexagon tile ties to the brand motif |
| `cell` | number | `28` | tile size in px |
| `opacity` | number | `0.04` | 2–4% only; it must whisper |
| `fade` | `"radial"\|"top"\|"none"` | `"radial"` | CSS mask so edges dissolve |
| `className` | string | — | usually `absolute inset-0 pointer-events-none` |

**Implementation (pick one, both dependency-free):**
- **SVG `<pattern>`** — one `<svg>` with a `<pattern>` containing a hex `<path>`, filled
  `stroke-slate-500` at low opacity; scales infinitely, one paint. *(preferred — crisp, themable)*
- **CSS background** — an inlined SVG `data:` URI as `background-image` with `background-size:
  cell`. Even cheaper; slightly less themable.
Edge fade via `mask-image: radial-gradient(...)` (progressive-enhancement; no fallback needed
since it's decorative).

**A11y:** always `aria-hidden` + `pointer-events-none`.
**Perf:** a single tiled paint, no JS, no animation. Negligible. Prefer the SVG `<pattern>` so
color follows tokens.
**RTL:** symmetric tiling → inherently safe.

---

### 4.6 `ProductFrame` — `systems/ProductFrame.tsx`

**Purpose:** a minimal, premium "app window" chrome to house **real** product/portfolio media
(or arbitrary children), so screenshots read as intentional product shots rather than pasted
images. **Frames real content only — never fabricates dashboard UI.**

**Proposed signature**

```tsx
<ProductFrame
  src={project.image} alt={project.title}   // real data
  // or: <ProductFrame>{children}</ProductFrame>
  chrome="bar" | "minimal" | "none"
  label={project.title}     // real; optional chrome caption
  aspect="16/10"
  className=""
/>
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `src`/`alt` | string | — | real image; `alt` **required** when `src` given |
| `children` | ReactNode | — | alternative to `src` (e.g., a real embed) |
| `chrome` | `"bar"\|"minimal"\|"none"` | `"bar"` | faux window top bar |
| `label` | string? | — | chrome caption — real only (project/client name) |
| `aspect` | string | `"16/10"` | CSS aspect-ratio |
| `emptyState` | ReactNode | neutral skeleton | shown when no real media exists |

**Visual:** rounded window (`rounded-xl`, matching the card radius), thin `border-slate-800`,
`shadow-elevated` (subtle), gunmetal chrome bar with **neutral** dots (not mac traffic-light
colors) and an optional real label. Image uses the repo's existing pattern: `loading="lazy"`,
`decoding="async"`, `onError={onImageError}`.

**No fake data guardrail:** if there is no real image/child, render `emptyState` (a neutral
`Skeleton`/placeholder) — **never** a mocked chart, fake numbers, or invented UI. This mirrors
the site's existing "collapse when empty, no fabricated fallbacks" rule (see `Home.tsx`).

**A11y:** chrome is decorative (`aria-hidden`); the image carries the real `alt`. If the frame
is a link, wrap in a focusable control with the existing ring.
**Perf:** pure CSS chrome + one lazy image. No JS.
**RTL:** chrome dots/label use logical properties (`ps-*`/`pe-*`, `text-start`) so they mirror;
the framed image is content and is not mirrored.

---

## 5. Cross-cutting guarantees

### RTL
- Only `SystemMap` (and standalone `FlowLine`) carry directional meaning; mirroring is
  centralized in `SystemMap` via a single `<g>` transform + label counter-flip, consistent
  with the existing `[dir=rtl]` icon-flip approach in `index.css`.
- Hexagons, grids, and product images are direction-neutral.
- All chrome/label spacing uses Tailwind logical utilities already used across the repo
  (`ms/me`, `ps/pe`, `text-start`).

### Reduced motion
- **Two gates:** the global `@media (prefers-reduced-motion: reduce)` block (already present)
  zeroes any stray animation; `useReducedMotion()` prevents the animated SVG nodes from being
  mounted at all. Result under RM: crisp static diagrams, zero motion, no artifacts.

### Performance budget
- **Zero new dependencies.** Net JS added ≈ a few small components (< ~4–5 KB gzipped total,
  estimate) — all tree-shakeable via the barrel and only imported where used.
- SVG-only rendering; animations limited to `opacity`/`stroke-dashoffset` (compositor layer).
- Ambient motion capped at ≤2 concurrent pulses per view; optional IntersectionObserver
  (no dep) to pause/skip off-screen maps.
- `HexGridSubstrate` = one tiled paint. `ProductFrame` reuses existing lazy-image pattern.
- Keep these out of the critical hero JS where feasible; inline SVG is cheap enough that a
  hero map need not be a separate chunk, but it *can* be `React.lazy`-split like the pages.

### No fake data (enforced by API, not just convention)
- `SystemNode.labelKey` accepts an **i18n key or a taxonomy label only** — document that
  literal invented strings/numbers are disallowed; reviewers reject them.
- `ProductFrame` has no "demo content" prop; absent real media → neutral `emptyState`.
- Nothing in this toolkit renders a number, percentage, chart, or metric.

---

## 6. Where each should be used (future placement — NOT built here)

> This is the intended rollout map for a later approved pass. **None of it is implemented in
> this proposal.** The homepage stays as-is until explicitly approved.

| Surface | Component(s) | Intent |
|---|---|---|
| **Home hero** | `SystemMap` (pipeline/hub) + `HexGridSubstrate` | The flagship "connected systems" proof; one slow pulse. Replaces the text-only hero. |
| **Home pillars** | `HexNode` clusters | A small node hint per pillar card (hub/spoke/flow). |
| **Home "How we work"** | `FlowLine`s | Connect the 4 steps into a left→right (RTL-aware) pipeline. |
| **Section backgrounds** | `HexGridSubstrate` | 2–4% engineered texture on select sections (not every one). |
| **Services** | `SystemMap` (hub: Business Systems/Web/Mobile/Automation) | Visualize the software pillar's sub-capabilities. |
| **Portfolio / ProjectDetail** | `ProductFrame` | House real project imagery as intentional product shots. |
| **Footer** | single `FlowLine`/`HexNode` motif | Replace any leftover glow with a quiet brand mark. |

---

## 7. Suggested build order (later)

1. `primitives.ts` + `use-reduced-motion.ts` + the two keyframes (foundations, testable alone).
2. `HexNode` → `FlowLine` (unit visuals).
3. `SystemMap` (composition + RTL mirror) — the highest-value, most complex piece.
4. `HexGridSubstrate` (trivial, high ambient payoff).
5. `ProductFrame` (independent; can land any time).
6. Barrel `index.ts`; then wire into surfaces one at a time behind review.

Each step ships with a Storybook-less "kitchen-sink" demo route only if desired for QA (not
required; can be verified inline).

---

## 8. QA / acceptance checklist (for the future build)

- [ ] `npm run check` + `npm run build` green; bundle delta within budget.
- [ ] Reduced-motion ON → no motion, clean static diagrams (verify via OS setting).
- [ ] RTL (`ar`) → `SystemMap` reads right→left, labels legible, no clipping; grids/frames unaffected.
- [ ] All decorative SVG is `aria-hidden` + `pointer-events-none`; semantic maps expose one
      `role="img"` + bilingual `aria-label`.
- [ ] AA contrast on any visible label (slate-300 / brand-400 on gunmetal).
- [ ] No literal invented labels/metrics anywhere; `ProductFrame` shows real media or neutral
      empty state.
- [ ] Accent rationed — ≤ one brand-colored node + ≤2 pulsing edges per view; the "10% orange"
      rule from the direction doc holds.
- [ ] No new dependency in `package.json`.

---

## 9. Open questions for sign-off

1. **Node orientation:** flat-top (calmer, enterprise) vs pointy-top (more dynamic)?
   *Recommendation: flat-top.*
2. **Substrate motif:** hexagon tile vs dot grid vs fine line grid for the default background?
   *Recommendation: hexagon at 3% for brand tie-in; dot grid as the quiet alternative.*
3. **Hero map content:** which real relationship to depict first — the three-pillar hub
   (AI Training · Digital Marketing · Software) or the acquire→convert→operate pipeline?
   Labels sourced from `shared/taxonomy.ts` / i18n either way.
4. **ProductFrame chrome:** neutral dots + label, or truly minimal (border only)? *Recommendation:
   minimal by default, dots optional.*

---

*No code was modified in the production of this proposal. Implementation is deferred until a
specific, approved build pass.*
