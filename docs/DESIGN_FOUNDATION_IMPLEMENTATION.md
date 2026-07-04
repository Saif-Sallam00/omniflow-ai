# OmniflowAI — Design Foundation Implementation

> **Scope:** The approved *foundation* pass only — design tokens, radius
> consistency, buttons, cards, and accessibility basics. **Orange preserved; red
> removed from brand styling; "Ember on gunmetal" direction applied.**
> Hero visuals, system maps, flow-line animations, illustrations, and any homepage
> redesign were **explicitly deferred** (not implemented).
>
> **Verification:** `npm run check` (tsc) → **0 errors**. `npm run build` →
> **success**. (No linter is configured in this repo — tsc is the only static check.)

---

## Summary

Established the real, enforced token layer the audit called for and pointed it at a
**deepened, red-free orange system**. All brand `orange→red` gradients are gone; the
one sanctioned **Ember gradient** (amber-500 → orange-600) is now used **only** on the
hero primary CTA. Every other CTA is a solid brand fill via the `--primary` token.
Radius is standardized by component role, cards are unified onto one radius + a
whisper-subtle shadow, buttons share one restrained hover (no scale/bounce), and the
core accessibility gaps (contrast, icon-only control labels, reduced-motion, focus
rings, marquee speed) are fixed.

Page-level edits were kept to **Home, Navigation, Footer**, plus two tiny
naturally-following red-removals on About/ProjectDetail CTAs. No copy, IA, sections,
or layouts were changed.

---

## Files Changed (9)

**Token layer**
- `client/src/index.css` — replaced the unused "Growth Engine/gold" vars with the
  **brand orange scale** (`--brand-400/500/600/700/light`); repointed `--primary` →
  orange-600, `--primary-foreground` → white, `--primary-border`/`--ring` → orange;
  added a **subtle shadow scale** (`--shadow-xs/sm/md`) and **motion tokens**
  (`--ease-standard`, `--duration-*`); added a global **`prefers-reduced-motion`**
  block.
- `tailwind.config.ts` — added the `brand` color (DEFAULT/400/500/600/700/light) wired
  to the CSS vars; added named `boxShadow.card`/`boxShadow.elevated` (map to the subtle
  vars — Tailwind's default `shadow-*` left untouched); added
  `transitionTimingFunction.standard`.

**Shared components**
- `client/src/components/ui/button.tsx` — base radius `rounded-md` → **`rounded-lg`**
  (utility default); `size=lg` radius aligned to `rounded-lg`; kept the restrained
  `hover-elevate` overlay; no scale. Default variant already consumes `bg-primary` →
  now solid brand orange automatically.
- `client/src/components/ui/card.tsx` — `shadow-sm` → **`shadow-card`** (whisper).
  Radius already `rounded-xl` (kept as the single card radius).

**Pages / components (Home / Nav / Footer + 2 tiny CTA fixes)**
- `client/src/components/Navigation.tsx` — logo, active link, mobile active, and CTAs
  tokenized to `brand`/`primary`; **`aria-label` added to the icon-only globe toggle**;
  mobile CTA given `rounded-full` to match the navbar CTA.
- `client/src/components/Footer.tsx` — amber accents retuned to `brand`/`primary`
  (**the single pulsing signal dot kept amber** — the only amber left); **blue glow
  blob removed** (both glows now warm/brand); newsletter box `rounded-2xl` →
  `rounded-xl`; input focus ring → `brand`; submit button tokenized + **`aria-label`**;
  bottom bar text `slate-500` → `slate-400`; removed a stray social-icon `hover:scale`.
- `client/src/pages/Home.tsx` — full foundation sweep (details below).
- `client/src/pages/About.tsx` — the one CTA's `orange→red` gradient → solid `primary`.
- `client/src/pages/ProjectDetail.tsx` — the two CTA `orange→red` gradients → solid
  `primary`.

---

## Tokens Changed

| Token | Before | After | Role |
|---|---|---|---|
| `--primary` | `38 92% 50%` (amber/gold) | `21 90% 48%` (**orange-600**) | Canonical solid CTA fill |
| `--primary-foreground` | `222 47% 11%` (dark) | `0 0% 100%` (white) | Text on brand fill |
| `--primary-border` | `38 92% 45%` | `17 88% 40%` (orange-700) | CTA border |
| `--ring` | `38 92% 50%` | `25 95% 53%` (**orange-500**) | Focus ring = brand |
| `--brand-400/500/600/700/light` | — (new) | orange-400/500/600/700 + amber-500 | Semantic accent scale |
| `--shadow-xs/sm/md` | — (new) | very subtle (Linear/Vercel/Stripe) | Elevation scale |
| `--ease-standard`, `--duration-*` | — (new) | `cubic-bezier(.2,0,0,1)`, 150/250/400ms | Motion foundation |
| `~~--gold / --gold-hover~~` | present, unused | **removed** | Decorative dead tokens |

New Tailwind primitives: `brand`/`brand-{400,500,600,700,light}` colors,
`shadow-card`/`shadow-elevated`, `ease-standard`. All verified present in the built CSS.

---

## Button Changes

- **One canonical primary:** solid `bg-primary` (orange-600) + white text, driven by the
  token — used by every default `<Button>` and every marketing CTA now. **No gradients**
  except the hero.
- **Hero-only Ember gradient:** `from-brand-light to-brand-600` (amber-500 → orange-600),
  no red, `rounded-full`, `shadow-sm`, restrained `hover:brightness-110` — replaced the
  old `orange→red` + `hover:scale-105` bounce.
- **Radius by role (as approved):** primary marketing CTAs (hero, navbar, major CTA
  sections, About/ProjectDetail CTAs) = **`rounded-full`**; icon buttons / chips =
  `rounded-full`; utility/secondary buttons & form controls = **`rounded-lg`** (Button
  default).
- **Restrained hover everywhere:** the shadcn `hover-elevate` overlay (subtle darken);
  no `scale`/bounce on any brand button.
- **Secondary:** the hero outline button kept `rounded-full` to pair with the primary;
  utility buttons use the `rounded-lg` default.

## Card Changes

- **One radius:** cards standardized to **`rounded-xl`** (shadcn `Card` + all Home
  marketing cards; the footer newsletter box moved `2xl` → `xl`).
- **One surface + subtle depth:** `bg-slate-900/50` + `border-slate-800` + **`shadow-card`**
  (whisper) on marketing cards; shadcn `Card` now uses `shadow-card` too.
- **Neutral hover lift:** card hovers changed from `border-orange-500/30` →
  `border-slate-700`. **Orange is reserved for emphasis** — kept only on the
  "After"/transformation card as the featured/positive accent.
- Accent tints inside cards (icon pills, result figures, labels) tokenized `orange-*` →
  `brand-*` (identical shade, now semantic).

## Accessibility Fixes

- **Contrast:** removed `text-slate-600` for body text (Home final-CTA subtext) and
  bumped low-value `text-slate-500` captions/labels → `text-slate-400` in the touched
  files (client-logo label, project category captions, footer copyright).
- **Icon-only controls:** `aria-label` added to the desktop language **globe toggle**
  (bilingual, reuses no new copy) and to the **footer newsletter submit** icon button.
- **Reduced motion:** global `@media (prefers-reduced-motion: reduce)` neutralizes the
  marquee, hover transitions, and scroll behavior for everyone (verified in built CSS).
- **Marquee:** client-logo speed **10s → 45s** (calm drift), and it now freezes under
  reduced-motion.
- **Focus states preserved:** focus-visible rings still render, now in brand orange via
  `--ring` (orange-500) instead of the old gold; ≥1px ring retained on buttons/inputs.
- **RTL/bilingual untouched:** no structural/logical-property changes; EN/AR parity and
  `dir="rtl"` behavior unaffected.

---

## What Was Intentionally Skipped

- **Hero connected-systems visual, system maps, flow-line animations, illustrations,
  homepage redesign** — explicitly out of scope for this pass.
- **Admin pages' amber** (`Dashboard`, `Leads`, `Auth`, `ObjectUploader`) — internal,
  English-only, light-theme tooling; left as-is per the "focus on shared + Home/Nav/
  Footer" instruction. (Their default `<Button>`s do pick up the new orange `--primary`
  via the token — a free consolidation, no page edits.)
- **Card-radius/accent tokenization on the other public pages** (`Services`, `Contact`,
  `Portfolio`, `not-found`, and the non-CTA parts of `About`/`ProjectDetail`) — those
  cards still use `rounded-2xl` and `orange-*` utility tints. Deferred to respect the
  page-edit limit; they remain on-brand orange. **Follow-up sweep recommended.**
- **Input height increase** (`h-9` → `h-11/12`) — a medium-roadmap craft item, not part
  of the approved a11y basics.
- **Semantic-control refactor** (nav/footer `Link`-wrapped `<span>`s → native anchors)
  and a **skip-to-content link** — larger structural a11y items; deferred to avoid
  markup/layout changes in this pass.
- **WhatsApp FAB `hover:scale-110`** (`App.tsx`) — a utility floating button, not a brand
  CTA; left as-is (and it's now reduced-motion-gated globally anyway).

---

## Risks & Visual QA Items

1. **⚠ White-on-orange-600 button contrast ≈ 3.56:1.** This passes WCAG AA for *large*
   text and UI components (3:1) but **falls short of AA for normal-size text** (4.5:1),
   and button labels are `text-sm` semibold (below WCAG's "large bold" threshold). It's a
   common, brand-consistent choice, but if strict AA on button labels is required, the
   fix is one token change: set `--primary-foreground` to a near-black, **or** move the
   default fill to `orange-700` (white-on-orange-700 ≈ 7.6:1). Flagging for your call —
   not changed unilaterally since you approved solid orange-600 + the white-on-orange
   look.
2. **Default `<Button>` is now solid orange everywhere.** Verify surfaces that used the
   old default primary (Contact submit, admin action buttons) still read well — they now
   render brand orange instead of amber/gold. Expected and on-brand, but worth an eyeball
   on the admin light theme.
3. **Temporary radius inconsistency across pages.** Home cards are now `rounded-xl` while
   Services/Contact/Portfolio/ProjectDetail cards remain `rounded-2xl` until the deferred
   sweep. Not broken, just not yet uniform.
4. **Reduced-motion marquee** jumps to its end frame and stops — logos remain fully
   visible (the row is duplicated), so this is correct, but confirm it looks static/clean
   rather than mid-scroll on your target browsers.
5. **Hero Ember CTA hover** uses `brightness-110` — verify the hover delta is visible
   enough on the amber→orange fill for your taste (it's intentionally subtle).
6. **Two non-approved-page edits** (About + ProjectDetail CTAs) were made solely to
   remove brand red, per the "red only for destructive/validation" rule — the smallest
   possible naturally-following change. Semantic red (`Auth` validation, `toast`
   destructive) was **kept**.

---

## Build / Lint Results

```
npm run check   (tsc)      → 0 errors
npm run build   (vite+esbuild) → success (only the pre-existing >500 kB chunk advisory)
```

Post-build CSS verification (built `index-*.css`):
- `--brand-500: 25 95% 53%` present; `.text-brand-400`, `.bg-brand-500/10`,
  `.from-brand-light`, `.to-brand-600`, `.border-brand-500/20` all generated.
- `--primary: 21 90% 48%`, `--ring: 25 95% 53%`, `--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / .3)`
  present.
- `@media (prefers-reduced-motion: reduce)` present.
- **No remaining brand `orange→red` gradients** anywhere in `client/src`; red survives
  only in `admin/Auth` validation and `ui/toast` destructive (semantic).

*No linter is configured (per repo policy); tsc + build are the available checks and both
pass.*
