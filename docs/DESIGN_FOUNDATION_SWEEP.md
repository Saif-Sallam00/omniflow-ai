# OmniflowAI — Design Foundation Sweep (Cross-Page Consistency)

> **Scope:** Apply the established foundation (tokens, radius, cards, subtle
> shadows, brand orange, red-only-for-errors) consistently across the six remaining
> public pages: **Services, Contact, Portfolio, ProjectDetail, About, not-found.**
> No copy, layout, sections, hero visuals, or system maps. Admin untouched. Button
> text contrast left unchanged per instruction.
>
> **Verification:** `npm run check` (tsc) → **0 errors**. `npm run build` →
> **success**. New utilities confirmed in the built CSS.

---

## Summary

Brought the six public pages onto the foundation shipped in the previous pass. Every
public-page card is now **`rounded-xl`** with a **whisper `shadow-card`**; card hovers
are **neutral** (orange reserved for genuine emphasis surfaces only); accent `orange-*`
utilities are replaced with **semantic `brand`/`primary` tokens**; CTAs follow the
component-based radius rules (major CTAs `rounded-full`, form/utility `rounded-lg`) with
solid brand fills and no gradients; heavy `shadow-2xl` frames dropped to the subtle
`shadow-elevated` token; and low-contrast `slate-500/600` body text was lifted to
`slate-400`. **No brand red** was introduced. **Frozen `[TODO(team-final)]` content was
left exactly as-is.**

---

## Files Changed (6)

- `client/src/pages/Services.tsx`
- `client/src/pages/Contact.tsx`
- `client/src/pages/Portfolio.tsx`
- `client/src/pages/ProjectDetail.tsx`
- `client/src/pages/About.tsx`
- `client/src/pages/not-found.tsx`

(No shared components or tokens were modified in this pass — they were finalized in the
previous foundation pass; this sweep only consumes them.)

---

## What Was Normalized

### Radius → `rounded-xl` (cards) / role-based (buttons)
- **Services:** service info card, showcase preview card `2xl → xl`; "together" step
  cards gained `shadow-card`.
- **Contact:** form card, info sidebar card, quick-response accent card `2xl → xl`
  (+ `shadow-card`).
- **Portfolio:** project image card + loading skeleton `2xl → xl`.
- **ProjectDetail:** tech-stack sidebar card, main-visual image frame
  (`rounded-xl md:rounded-2xl → rounded-xl`), and skeleton `2xl → xl`.
- **About:** founder image + its offset backing block, TeamCard shell, ValueCard shell,
  and the ValueCard icon tile (`rounded-lg → rounded-xl`) all normalized to `xl`.
- **not-found:** icon tile `2xl → xl`.
- **Buttons (role-based):** Services CTA and (prior pass) About/ProjectDetail CTAs =
  `rounded-full` (major CTAs, solid `bg-primary`); Contact submit and not-found button =
  `rounded-lg` (form/utility, solid `bg-primary`).

### Accent utilities → semantic brand tokens
- `text-orange-400 → text-brand-400`, `bg-orange-500/10 → bg-brand-500/10`,
  `border-orange-500/20|30 → border-brand-500/20|30`, `bg-orange-500 → bg-brand-500`,
  `focus:border-orange-500/50 → focus:border-brand-500/50`, and solid CTA fills →
  `bg-primary text-primary-foreground`.
- **Gradient-clipped heading** (About headline) → solid `text-brand-400` (matches Home,
  removes the loud clip).
- Applied across Services (eyebrow, icon pill, subcaps, featured label, CTA), Contact
  (input focus borders, info icons, submit, quick-response accent card), Portfolio (hover
  arrow chip, title hover), ProjectDetail (back button, category badge, challenge accent
  border), About (badge, headline, founder offset block, ValueCard), not-found (icon +
  button).

### Card hovers → neutral (orange reserved for emphasis)
- Card border hovers changed `border-orange-500/30 → border-slate-700` on Services,
  Portfolio, ProjectDetail, About team cards, and Home (prior pass).
- Portfolio's orange hover wash → neutral `bg-white/5`; the brand pop is kept only on the
  small circular hover arrow (now `bg-brand-500`).
- **Orange retained deliberately** where it signals emphasis: Contact quick-response
  accent card, ProjectDetail category badge + challenge accent border, the "After"
  transformation card (Home).

### Shadows → subtle tokens
- `shadow-2xl` (ProjectDetail main visual, About founder image) → **`shadow-elevated`**
  (subtle).
- `shadow-sm`/`shadow-lg` on Portfolio card + arrow → `shadow-card` / `shadow-sm`.
- Content cards gained a consistent whisper `shadow-card` (matches Home).

### Accessibility / contrast
- Lifted readable text off low-contrast slate: Contact info values, `(optional)` kept as
  micro-hints; Portfolio empty state, category badge, client name; ProjectDetail back
  label — all `slate-500 → slate-400`.
- Contact input placeholders `slate-600 → slate-500` (more legible, still clearly
  placeholder).
- Input focus borders now brand-tinted (`focus:border-brand-500/50`); the global
  focus-visible ring (brand orange) from the token pass applies here too.

---

## What Was Skipped (Intentionally)

- **Frozen team/founder content** (`About.tsx`): every `[TODO(team-final)]` node left
  exactly as-is. Two lines that *style* frozen content were deliberately **not** touched —
  line 78 (`text-orange-400` on the founder placeholder) and line 186 (`text-orange-400`
  on the TeamCard role text). They render at the identical shade as `brand-400`, so
  there's no visual inconsistency; they simply remain raw utilities on frozen lines. The
  team/founder card **shells** (radius, neutral hover, shadow) were normalized since those
  are structural styling, not content.
- **Decorative `orange-950/*` hero background washes** (Services ×2, Contact, About ×2):
  kept as-is — there is no `brand-950` token, they're extremely subtle, still on-brand
  orange, and this matches the identical decision made on Home (its hero/final-CTA washes
  were also kept). Converting them would shift the shade, not improve consistency.
- **Admin pages** — untouched (their default `<Button>`s already inherit the orange
  `--primary` token from the previous pass; no page edits).
- **Hero connected-systems visual, system maps, flow-line animations, illustrations** —
  out of scope, deferred as instructed.
- **Button text contrast** — left unchanged per your instruction (still white-on-orange).
- **Input height** (`h-9 → h-11/12`) — a separate craft item, not part of this
  consistency sweep.
- **Services muted heading** (`text-slate-500` on the second headline line) — an
  intentional muted styling at large heading size (passes AA-large 3:1); left as designed.

---

## Risks & Visual QA Items

1. **White-on-orange button contrast (unchanged, ~3.56:1).** Still the known
   AA-normal-text gap from the prior pass; untouched per your instruction. One-token fix
   available when you want it.
2. **Card depth is now uniform but very subtle.** `shadow-card` is intentionally a whisper
   on the dark ground (Linear/Vercel style) — depth reads mostly via border. Confirm it's
   visible enough for your taste on the target displays; `shadow-elevated` is available if
   any specific card should sit higher.
3. **Two frozen lines keep raw `orange-400` utilities** (About 78, 186). Identical shade to
   `brand-400`, so no visual diff, but a future team-final pass should tokenize them when
   the content is unfrozen.
4. **Portfolio hover** now shows a neutral wash + a brand-orange arrow chip instead of an
   orange wash — verify the interaction still reads clearly as "clickable."
5. **ProjectDetail main visual** dropped from `shadow-2xl` to `shadow-elevated` — a
   deliberately calmer frame; confirm it still separates from the page background enough.
6. **Consistency achieved across pages:** Home + these six now share one card radius, one
   shadow language, neutral hovers, and brand tokens. Services/Contact/etc. cards match
   Home — the temporary inconsistency flagged in the previous pass is resolved.

---

## Build / Check Results

```
npm run check   (tsc)          → 0 errors
npm run build   (vite+esbuild) → success (only the pre-existing >500 kB chunk advisory)
```

Post-build CSS verification (built `index-*.css`):
- `.shadow-card` → `box-shadow: var(--shadow-xs)` present; `.shadow-elevated` present.
- 14 distinct `brand` border/bg/gradient utilities generated; `border-brand-500/50`
  (input focus) present.
- **No `rounded-2xl`** remains in any of the six pages.
- **No brand red** in any of the six pages (semantic red survives only in `admin/Auth`
  validation and `ui/toast` destructive).
- All `[TODO(team-final)]` nodes verified intact in `About.tsx`.

*No linter is configured (repo policy); tsc + build are the available checks and both
pass.*
