# Hero SystemMap — Expansion (3 pillars + 6 capability nodes)

> **Scope:** Homepage **hero only** + the shared `components/systems/` primitives it
> uses. No copy/CTA/section/route/data changes, no new dependencies, no images/assets.
>
> **Verification:** `npm run check` → **0 errors**, `npm run build` → **success**, all
> label keys resolve in EN **and** AR. **Not visually verified in a browser** (per your
> standing instruction not to use Chrome unless explicitly asked) — see Risks.

---

## Summary

The hero diagram now reads as a richer connected-systems map: the dominant orange **hub**
in the centre, the **three main pillars** kept as the larger, prominent nodes (AI
Training · Digital Marketing · Software), and **six smaller neutral capability nodes**,
one emanating from each corner of the central hexagon, each connected to the hub by a
faint background line. Orange stays restrained — only the hub, its soft glow, and the one
AI-Training pulse line. To keep it breathable and clip-safe, `SystemMap` gained **radial
label placement** (labels fan outward from the hub) and **2-line wrapping** for long real
labels.

## Files changed

- `client/src/pages/Home.tsx` — rebuilt the hero node/edge model: hub + 3 pillars + 6
  capability nodes in a 480×460 viewBox; six new faint hub→capability edges; the single
  accent+pulse edge unchanged.
- `client/src/components/systems/SystemMap.tsx` — added `wrapLabel()` (≤2 lines, split at
  the space nearest the middle); replaced "label below node" with **radial** placement
  (outward from map centre, anchor chosen by direction) + wrapped `<tspan>` lines; added a
  small-node visual tier (dimmer `slate-700` stroke, smaller `slate-500` label font).

No component API was broken; `SystemMap` is used only by the hero. No i18n keys added.

## Labels used and where they came from

**Every node label is a real existing i18n string.** The 3 pillars use the pillar labels;
the 6 capability nodes map to the requested concepts as below. Where an **exact** label
does not exist, I used the closest existing one and flagged it (⚠ = loose match). I did
**not** invent any label.

| # | Requested concept | Label used (EN) | Label (AR) | i18n key / source | Note |
|---|---|---|---|---|---|
| 1 | Marketing Strategy | **Strategy** | الاستراتيجية | `serviceDetail.dm.proc.2.title` | No exact "Marketing Strategy"; used the Digital-Marketing "Strategy" step (closest). |
| 2 | Web & Mobile Apps | **Web Platforms** | منصّات الويب | `serviceDetail.software.feat.2.title` | No combined label. "Web Platforms" and "Mobile Apps" (`software.feat.3.title`) exist separately; used "Web Platforms". |
| 3 | AI Agents | **Implementation support** | دعم التنفيذ | `serviceDetail.ai.feat.4.title` | ⚠ **"AI Agents" does not exist anywhere** (grep-confirmed) and CLAUDE.md forbids reintroducing it. Used the closest real AI-pillar capability. Weakest match — see "Open choices". |
| 4 | Automation | **Automation & AI** | الأتمتة والذكاء الاصطناعي | `category.automation` (= `serviceDetail.software.feat.4.title`) | Closest existing; exact "Automation" is a substring of the real label. |
| 5 | CRM | **Business Systems** | أنظمة الأعمال | `category.business-systems` | Standalone "CRM" does not exist (only inside "Business Systems (ERP / CRM)"). Used the ERP/CRM category label. |
| 6 | Analytics | **Conversion-rate optimization** | تحسين معدّل التحويل | `serviceDetail.dm.feat.3.title` | ⚠ **"Analytics" does not exist anywhere.** Used the closest measurement/optimization capability. Weak match — see "Open choices". |

Pillars (unchanged, real): AI Training / Digital Marketing / Software →
`serviceOpt.ai-training` · `serviceOpt.digital-marketing` · `serviceOpt.software`.
Map `aria-label` → `home.pillars.title` (existing). Center hub is intentionally
**unlabeled** (no invented copy).

### Open choices you may want to redirect
- **AI Agents (#3)** and **Analytics (#6)** have no real labels anywhere. I used the
  closest existing capability rather than adding them silently. If you want these exact
  words, they'd need **new i18n keys** — i.e., new copy — which is out of this task's
  scope, so I did not add them. Say the word and I'll add the keys (EN+AR) in a follow-up.
- **Web & Mobile Apps (#2)** could equally use "Mobile Apps" (`software.feat.3.title`)
  instead of "Web Platforms" — both are real. Easy swap if you prefer.

## What changed visually

- **Central hub:** unchanged role — largest node (`scale 1.9`), the only solid/accented
  node, with a soft radial brand glow. Remains the single dominant orange element.
- **3 pillars:** kept larger (`scale 1.05`) with their icons, neutral slate — clearly more
  prominent than the small nodes.
- **6 capability nodes:** small (`scale 0.5`), no icon, dimmer neutral slate stroke and a
  smaller, dimmer label — reading as clearly secondary. Positioned one per hexagon corner
  (0/60/120/180/240/300°) at a tighter radius than the pillars, so they "emanate" from the
  hub's six corners.
- **Depth layering:** the six hub→capability lines render **faint** and **behind**; the
  three hub→pillar lines render stronger/front; the one AI-Training line is the accent and
  carries the comet on top.
- **Labels:** now placed **radially outward** from the hub (never inward) and **wrap to two
  lines** when long, so the diagram stays readable and uncrowded.

## Responsive behavior

- **Desktop (`lg+`):** the map fills its hero column (~500px tall from the near-square
  480×460 viewBox); copy beside it. The map is the primary visual without overpowering the
  headline (orange limited to hub + one line).
- **Mobile/tablet (`< lg`):** single column, copy first, map below in a `max-w-sm` box.
  The SVG scales via `viewBox` + `w-full h-auto`; labels scale with it and wrap, so the
  10-node diagram stays legible. (Density on small screens is the main thing to eyeball —
  see Risks.)

## RTL behavior

- `SystemMap` mirrors geometry (`mirrorOnRTL`, default true): all x pass through
  `mx(x)=width−x`, so nodes/edges/flow mirror. **Radial label anchoring uses the mirrored
  x**, so labels fan outward on the mirrored side and their start/end anchor flips
  automatically — while glyphs stay **upright and unflipped**. Wrapping is
  language-agnostic (splits on spaces), and Arabic renders RTL within each line.
- All six capability labels have real AR translations (verified present): الاستراتيجية ·
  منصّات الويب · دعم التنفيذ · الأتمتة والذكاء الاصطناعي · أنظمة الأعمال · تحسين معدّل التحويل.

## Reduced-motion behavior

- Unchanged and still double-gated: global `@media (prefers-reduced-motion: reduce)` in
  `index.css` **plus** `FlowLine`'s `useReducedMotion()` gate (the comet is not mounted
  under reduced motion). Exactly **one** pulsing line (AI-Training→hub); `SystemMap` caps
  pulses at 2. The hub glow is a static gradient (no animation).

## Risks / QA items

1. **⚠ Not visually verified.** Per your instruction I did not open the browser this pass.
   Label fit was designed by coordinate math (480×460 viewBox, radial placement, 2-line
   wrap, primary wrap ≤12 chars / small ≤14) and every label resolves in EN+AR — but
   **clipping and crowding should be confirmed visually** (both languages, desktop +
   mobile). This is the top risk; tell me if you want me to run a browser check.
2. **Density.** Ten nodes is a busy diagram, especially on mobile at `max-w-sm`. It's
   designed to breathe (small nodes, dimmer, wrapped radial labels), but if it feels
   cramped the easy levers are: reduce to 4 capability nodes, shrink `nodeSize`, or bump
   the mobile container width.
3. **Loose label matches (#3 AI Agents, #6 Analytics).** Functionally real labels but weak
   concept matches; see "Open choices" for how to make them exact (needs new copy) or swap.
4. **AR label lengths.** "الأتمتة والذكاء الاصطناعي" is the longest; it wraps to two lines
   and by math fits, but it's the most likely to need a visual check.
5. **No fake data / no red / restrained orange** — confirmed: hub unlabeled, all labels
   real i18n, no red, orange only on hub + one pulse.

## Build / check results

```
npm run check   (tsc)          → 0 errors
npm run build   (vite+esbuild) → success (only the pre-existing >500 kB chunk advisory)
label keys: all 9 (3 pillars + 6 capabilities) present in EN and AR
```

*No linter is configured (repo policy). Changes are confined to the hero and the systems
components. No images or assets were generated or added.*
