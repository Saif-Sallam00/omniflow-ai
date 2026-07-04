# Layer 2 — Copy Replacement (final copy swap-in)

Replaced user-facing marketing copy with final approved copy and removed the
Layer-1 placeholder fold. **No taxonomy/routes/schema/structure changes, no i18n
work, no bug fixes, no team bios, no invented numbers.** Fabricated testimonials,
case-study numbers, and trust stats were nulled to `[Layer 3: …]` placeholders;
team text was frozen to `[TODO(team-final)]`.

Typecheck (`npx tsc`) passes with **0 errors**. Build (`npm run build`) succeeds.

---

## Files changed (one line each)

- `shared/taxonomy.ts` — added `CONTACT_EMAIL = "hello@omniflowai.agency"`
  (`// TODO(email-final)`), the single email constant used everywhere.
- `client/src/pages/Home.tsx` — full copy swap: new hero (H1/sub/CTAs), text trust
  strip (replaces the "50+/21+" numbers), new Value Proposition, Pillars, Before/After
  Transformation, Proof frame (`[Layer 3: real case studies]`), 4-step How-we-work
  (Diagnose/Design/Build/Optimize), global brand line band, new Final CTA. Removed the
  fabricated testimonials array + Petra case-study numbers; nulled the ResultsDashboard
  metrics to `[Layer 3: real metric]`.
- `client/src/pages/About.tsx` — new badge/headline/sub, impersonal company "Story"
  (heading + 3 bodies), 4 new Values, new CTA (heading + brand line + button). Founder
  attribution and the 3 team cards **frozen** to `[TODO(team-final)]`; layout untouched.
- `client/src/pages/ServiceDetail.tsx` — deleted the Layer-1 concatenated
  features/process/FAQ superset; wrote final copy for all three pillar entries
  (`software`, `digital-marketing`, `ai-training`), added a per-service `cta` label.
- `client/src/pages/Services.tsx` — new eyebrow/headline/brand-line sub; three overview
  cards now use the pillar titles + bodies (software gets the sub-capabilities line);
  "Better together" heading + new sub.
- `client/src/pages/Contact.tsx` — heading "Let's talk" + new sub; plain-text labels
  ("What do you need?", "(optional)", etc.); submit "Send message / Sending…"; sidebar
  email → `CONTACT_EMAIL`, phone "Available on request", response "Within 24 hours on
  business days"; success/error toasts as plain strings (replaced the missing-i18n-key
  literals `contact.success` / `contact.error` / `contact.info.hours`); neutralized the
  name/email input placeholders.
- `client/src/components/Footer.tsx` — brand tagline → "We build the systems behind
  business growth."; email → `CONTACT_EMAIL`. Dead social/legal links left as-is (Layer 4).

---

## Where every placeholder now lives

**`[Layer 3: real metric]` / `[Layer 3: real case studies]` / `[Layer 3: real threshold]`**
(all tagged `// TODO(Layer3-proof)`)
- `client/src/pages/Home.tsx:70` — ResultsDashboard "Cost/Lead" value.
- `client/src/pages/Home.tsx:75` — ResultsDashboard "Time Saved" value.
- `client/src/pages/Home.tsx:85` — ResultsDashboard "Avg. Client ROI" value.
  (Component-level tag at `Home.tsx:47`.)
- `client/src/pages/Home.tsx:340` — Proof section case-studies placeholder, with the
  Business Systems → Automation → Marketing → Web ordering note (tag at `Home.tsx:338`).
- `client/src/pages/ServiceDetail.tsx:57` — digital-marketing FAQ #1 ad-budget threshold
  (tag at `ServiceDetail.tsx:56`).

**`[TODO(team-final)]`** (blocks tagged `// TODO(team-final)`)
- `client/src/pages/About.tsx:91,93` — frozen founder name + role (tag at `:86`).
- `client/src/pages/About.tsx:119–121, 125–127, 131–133` — the 3 team cards' name/role/bio
  (tag at `:103`). Team images and layout left intact.

**`TODO(email-final)`**
- `shared/taxonomy.ts:63` — on the `CONTACT_EMAIL` constant (placeholder address to be
  replaced before launch). Both old addresses (`hello@omniflow.ai`,
  `contact@omniflowai.agency`) are gone; the only email literal in the codebase is the
  constant definition.

---

## Decisions / notes

- **Global brand line** ("We don't hand over deliverables and walk away…") is placed where
  the old anti-agency lines sat: the Home brand-line band, the Services overview sub, and
  the About CTA sub.
- **Trust numbers → text strip.** The hero "Trusted by 50+ Businesses" badge and mobile
  340h/60%/100% stat grid, plus the "Trusted by 21+ teams" logo header, were all removed;
  the client-logo strip now carries the no-number line "Trusted by teams building the
  future of their industries."
- **Guarantee band repurposed.** The old "90-day results guarantee / full refund" band
  (an unverifiable claim not in the new structure) was reused as the global-brand-line band
  — layout kept, claim removed.
- **Process microcopy.** For the digital-marketing and ai-training process steps (where the
  brief said "as in software's tone" without giving text), I wrote terse, procedural,
  number-free descriptions. Software's process uses the parenthetical descriptions given.
- **ServiceDetail feature lists.** digital-marketing "Included" and ai-training "Delivered"
  items are titles only; their `description` is empty and the component now conditionally
  hides the empty paragraph.
- **Out of scope, untouched:** contact-form delivery, the related-projects render bug (its
  Layer-1 `// TODO(Layer4-bugs)` cast remains), dead social/legal links, the 404 dev copy,
  i18n/Arabic, dead code (`ROICalculator`, empty `ProjectEditor`), and real team bios/metrics.
  The Contact `t`/`useI18n` wiring is left in place for Layer 5 (now unused, harmless).

---

## Verification

- `npx tsc` → **0 errors.** `npm run build` → **success.**
- Grep confirms: **no old email literals** (`hello@omniflow.ai`, `contact@omniflowai.agency`)
  remain — the only `@omniflow` string is the `CONTACT_EMAIL` definition.
- **No `TODO(Layer2-copy)` tags remain.**
- **No fabricated testimonial/stat strings remain** (no Ahmed/Sarah/Mohamed testimonials,
  no 23%→41% / 340h / 6.8× / 50+ / 21+ / 90-day, no Mosatafa/Roaa/Saif/Faris names) — only
  `[Layer 3: …]` placeholders.
- **Team text is `[TODO(team-final)]` everywhere** (founder attribution + 3 cards).

**Changed files:** `shared/taxonomy.ts`, `client/src/pages/Home.tsx`,
`client/src/pages/About.tsx`, `client/src/pages/ServiceDetail.tsx`,
`client/src/pages/Services.tsx`, `client/src/pages/Contact.tsx`,
`client/src/components/Footer.tsx`, plus `LAYER2-COPY.md` (new).

**Confirmation:** All visible marketing copy across Home, About, Services, the three pillar
service pages, Contact, and the Footer now reflects the final approved wording built around
the "one integrated system" positioning. The Layer-1 placeholder fold is gone. Everything a
company shouldn't ship fake — testimonials, case-study numbers, hero trust stats, team
names/roles/bios, and the contact email — is now either a clearly-tagged `[Layer 3: …]`
proof placeholder, a `[TODO(team-final)]` freeze, or the single `CONTACT_EMAIL` constant.
Typecheck and build are both green.
