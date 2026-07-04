# BUILD_PLAN

> Read this before any homepage work. These principles and constraints govern every
> future session and every visual phase.

GOVERNING PRINCIPLES
P0 Function before expression. Clarity before beauty. If an interaction doesn't explain,
   guide, or reinforce the business story, it shouldn't exist.
P1 The product is not the tool; the differentiator is the discipline. We deliver systems,
   software, automation, marketing, AI (the outcomes) — but what differentiates us is
   diagnosing before deciding the tool ("we look before we touch; we only build what the
   diagnosis supports"). Show the deliverables, but lead with why they're trustworthy.
   Connected-system visuals = the visual language; diagnosis = the reason to believe.
P2 One master metaphor, many facets. The connected system (hexagon + nodes + links +
   single orange). Sections show different STATES of the same system, never new metaphors.
P3 The homepage is a lifecycle, not a list: exists -> missing -> designed -> built ->
   proven -> performs -> begins.
P4 Vary the presentation pattern, not the metaphor. No two adjacent sections should share
   the title->paragraph->cards->button layout.
P5 Single accent only: Flow Orange #FF6B1F. No second color, ever.
P6 Dark/light with intent. Dark = identity/impact (hero, brand statement, before/after, CTA).
   Light #F6F7F8 = readability/trust (logos, services, process, portfolio, outcomes).

CROSS-CUTTING CONSTRAINTS (gate every phase)
- RTL/Arabic: every layout/animation must mirror correctly; test EN and AR.
- Mobile/touch: hover doesn't exist on phones; every hover needs a scroll/tap fallback.
- Performance: respect the measured bundle baseline; measure after each visual phase.

WORKING RULES
- Stay in the current phase's scope. Report out-of-scope issues; don't silently fix them.
- Never invent content or fake success/metrics.
- Simplicity over cleverness; minimize new dependencies.

---

DECISIONS LOG

Phase 2 — Design-system enforcement (P5 single accent)
- CTA button token: the ONE canonical CTA is the shadcn Button `default` variant
  (`bg-primary text-primary-foreground`), where `--primary` = Flow Orange #FF6B1F
  (hsl 20 100% 56%) in `client/src/index.css`. Solid fill only — no gradient CTAs,
  no second accent. Outline/ghost variants remain for secondary actions.
- Positive/"success" indicators use the orange accent, NOT green. The Before/After
  checkmarks were recolored emerald → `text-brand-400` (orange). Meaning is carried
  by the icon + context, not by a second color (P5).
- Floating WhatsApp widget recolored from WhatsApp green (#25D366 / green-500) to the
  Flow Orange `--primary` token. Tradeoff: loses the green "opens WhatsApp" affordance;
  the message icon + hover label still signal chat. (P5 outranks the platform cue.)
- Client-logo strip: each logo now sits in a uniform #F6F7F8 rounded tile at a fixed
  size so the row reads as one band. NOTE: ~7 source PNGs have opaque dark/colored
  backgrounds baked in that no CSS treatment can strip; a fully-uniform monochrome
  band needs the logos re-exported as transparent silhouettes (deferred asset work).

Phase 3 — Content architecture (P1 discipline-first voice)
- Hero (Open Decision 3) RESOLVED → Option A "Diagnose first": lead "Most teams buy
  the tool first." / highlight "We diagnose first." Leads with the differentiator
  (diagnosis), not the deliverable. EN + AR applied.
- Portfolio narrative is now Problem → Diagnosis → System → Outcome. Mapped to columns
  challenge (Problem) / diagnosis (NEW, nullable) / solution (System) / results[]
  (Outcome). `diagnosis` added via ALTER TABLE, NOT db:push — drizzle push wants to drop
  the runtime `session` table (connect-pg-simple, not modeled in schema.ts); never let
  it. ProjectDetail renders Diagnosis only when present — never fabricated.
- PENDING your approval (proposed, not applied): pillar-card copy reframe, CTA voice
  alignment, and the remaining generic-language rewrites (trust line, pillars.title,
  finalCta.title).

Phase 4 — Visual rhythm (P3 lifecycle, P4 varied patterns, P6 dark/light)
- Light surface #F6F7F8 is now a token: `--surface-light: 210 14% 97%` (exact #F6F7F8)
  in index.css, exposed as Tailwind `bg-surface`. Use it for ALL trust/readability bands.
- Band map (P6), top→bottom: Hero D · Logos L · Systems-problem D · Services L ·
  Before/After D · Proof L · Recent L · Process L · Brand-line D · Final-CTA D.
  Dark = identity/impact; Light = readability/trust. Do not flip a band without re-reading P6.
- Contrast rule per surface (P5 orange behaves differently on each):
  · On DARK: accent text = brand-400; body = slate-400; headings = white.
  · On LIGHT: accent text = brand-600 (large) / brand-700 (small); body = slate-600;
    headings = slate-900. Never use brand-400 on #F6F7F8 (fails contrast). Filled CTA
    stays bg-primary + white text on both surfaces.
- Seams: every band carries one consistent hairline — dark bands `border-*/white/[0.06]`,
  light bands `border-*/black/[0.06]` — plus full-bleed solid bands (no semi-transparent
  fills that leak the root gradient). Robust to the DB-conditional Proof/Recent sections.
  Horizontal-only, so identical in LTR and RTL.
- P4 adjacency (no two ADJACENT sections share title→para→cards→button): hero=split,
  logos=marquee, systems-problem=centered statement, services=3-card grid,
  before/after=2-col contrast, proof=asymmetric grid, recent=carousel, process=numbered
  4-step, brand-line=horizontal banner, final-CTA=centered stack. All neighbors differ;
  the two 3-col grids (services, proof) are never adjacent.
- NOTE: the type system is Inter + Space Grotesk. JetBrains Mono is NOT loaded
  (`--font-mono` unset); homepage kept on Inter, no webfont added, to protect the bundle
  baseline. If a mono is wanted later it must be added deliberately (perf cost).
- Logo band residual DECIDED → Option 3 (leave as-is). The white tiles already frame
  every logo uniformly (identical size/shape); 9 logos have opaque dark/mid backgrounds
  baked into the source PNGs that show as boxes on the light band. No CSS/automated fix
  is viable: rafeek & darat are light-on-dark (stripping bg → invisible on light);
  Cutz/Petra/Madrid/Gzour are near-uniformly dark (no clean edge to key without vectors).
  Do NOT reprocess or recolor the assets. Resolve only via clean client-supplied files:

  CONTENT-TODO(logos): request transparent-PNG or vector logos from the 9 offenders —
  Cutz, Petra, Madrid, Gzour, elkhateer, rafeek (dark boxes) + naas, Princess, darat
  (mid/color boxes). Drop-in replacements for the existing white tiles; no code change
  needed when they arrive. The other 12 logos (6 transparent + 6 white-box) are already clean.

Phase 5 — Restrained motion (P0: motion must explain/guide/reinforce)
- Motion stack: native IntersectionObserver + CSS transitions only. NO animation library
  (framer-motion etc.). New hook `use-in-view.ts` (reveal-once) joins the existing
  `use-reduced-motion.ts`; both fail-open (content visible if reduced-motion / no-IO / no-JS).
- prefers-reduced-motion: useInView initialises `inView=true` (final state, no observer),
  and the global `@media (prefers-reduced-motion: reduce)` block still zeroes any transition.
  Reduced-motion users get the full static page, no entrance motion.
- Touch: all reveals/timeline are scroll-driven (not hover). The only hover effect is
  `.card-lift` (hover/focus lift + faint Flow Orange glow, index.css) — purely decorative,
  nothing is hidden behind it, so touch users get the fully-functional static card.
- RTL: all motion is vertical (translate-y) or colour/opacity only — never directional
  transforms — so it mirrors identically in Arabic. The systems-problem word reveal splits
  on spaces (DOM order preserved → staggers in reading order); the process accent bar fades
  (opacity), it does not slide.
- Effects: (1) systems-problem statement reveals its orange highlight words progressively
  on scroll; (2) process/"How We Work" is a scroll-activated timeline — steps take the Flow
  Orange accent in sequence (staggered), big numbers stay subtle; (3) section scroll-in
  reveals (pillars, before/after, final CTA), card-lift on service/portfolio cards, existing
  logo marquee retained.
- Perf: +~0.65 kB gzip JS / +0.13 kB gzip CSS vs the Phase-4 baseline. Negligible; no library.

Phase 6 — Signature interactive pieces (build ONE at a time; gate hard on RTL/touch/perf)
- Piece 1 SHIPPED (pending your visual QA): `InteractiveSystemMap.tsx` replaces the static
  hero SystemMap. Central hexagon = the Business System; 6 real capability nodes (AI Training,
  Digital Marketing, Software, Automation, CRM, Strategy) on a ring connect to the centre.
  P0/P2: scroll-in assembles the system in sequence (deliberate = diagnosis-first), rests
  connected; hover/focus/tap emphasises one capability's link (Flow Orange + travelling pulse).
  Degrades: reduced-motion / no-IO / touch → fully-connected static diagram (useInView fails
  open); nodes are decorative (svg role=img + aria-label carries the story), no focusable-hidden
  trap. RTL: all x via mx(), label anchors flip by sign. Perf: +0.17 kB gzip Home, CSS flat, no
  new deps (3 lucide icons). Labels are real i18n (`systemMap.*`, EN+AR).
- Piece 2 (Before→After node animation) NOT started — awaiting Piece 1 visual sign-off.
