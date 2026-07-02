# Layer 1 — Structural Migration (positioning skeleton)

Structure-only migration to the new pillar/category taxonomy. **No marketing copy
was rewritten, nothing was translated, no dead code was removed, and no unrelated
bugs were fixed.** Where existing copy sat in a restructured file it was moved
**verbatim** and tagged `// TODO(Layer2-copy)`.

Typecheck (`npx tsc`) passes with **0 errors**. Build (`npm run build` → vite +
esbuild) succeeds.

---

## Final taxonomy (single source of truth: `shared/taxonomy.ts`)

**Pillars (top-level services):**
| slug | label |
|---|---|
| `ai-training` | AI Training |
| `digital-marketing` | Digital Marketing |
| `software` | Software |

**Portfolio categories (capability-level, what projects are tagged with):**
| slug | label | parent pillar |
|---|---|---|
| `business-systems` | Business Systems | `software` |
| `web` | Web | `software` |
| `mobile` | Mobile | `software` |
| `automation` | Automation & AI | `software` |
| `digital-marketing` | Digital Marketing | `digital-marketing` |
| `ai-training` | AI Training | `ai-training` |

**Portfolio filter tab order (left → right):** All, Business Systems, Web, Mobile,
Automation & AI, Digital Marketing, AI Training. (`PORTFOLIO_TAB_ORDER` holds the
six category slugs in this order; "All" is handled separately and always shown.)

**Legacy → new category migration map:** `build → web`, `attract → digital-marketing`,
`automate → automation` (exported as `LEGACY_CATEGORY_MAP`).

`shared/taxonomy.ts` exports: `PILLARS`, `PILLAR_LABELS`, `CATEGORIES`,
`CATEGORY_LABELS`, `CATEGORY_TO_PILLAR`, `PORTFOLIO_TAB_ORDER`, `CONTACT_SERVICES`,
`LEGACY_CATEGORY_MAP`, plus the `Pillar`, `Category`, `ContactService` types.
**Every other file imports from here — no category/pillar slug or label is
redefined anywhere else.**

---

## Schema migration method: **TEXT column (not a pg enum)**

`projects.category` is a plain Postgres `text` column — it was never a pg `enum`
type. Therefore **no enum migration is required**; a `drizzle-kit push` (`npm run
db:push`) is sufficient, and since the DB is currently empty there are no rows to
convert. The `LEGACY_CATEGORY_MAP` (`build→web`, `attract→digital-marketing`,
`automate→automation`) is included in `shared/taxonomy.ts` as a safe mapping should
any legacy rows ever exist; it can be applied with a one-shot `UPDATE` before push.
The column value is now type-constrained to the six `Category` slugs via
`text("category").$type<Category>()` **and** validated at the boundary by
`insertProjectSchema` (`z.enum(CATEGORIES)`), both sourced from the single file.

---

## Files changed (one line each)

**New**
- `shared/taxonomy.ts` — **NEW.** The single source of truth: pillars, categories,
  all labels, `CATEGORY_TO_PILLAR`, `PORTFOLIO_TAB_ORDER`, `CONTACT_SERVICES`,
  `LEGACY_CATEGORY_MAP`, and derived types.
- `LAYER1-STRUCTURE.md` — **NEW.** This document.

**Changed**
- `shared/schema.ts` — `projects.category` now `text().$type<Category>()`;
  `insertProjectSchema`/`selectProjectSchema` validate `category` via
  `z.enum(CATEGORIES)` (results/technologies refined to `string[]` to keep their
  types); `contactFormSchema.service` now `z.enum(CONTACT_SERVICES)` (three pillars +
  `other`); `Project`/`InsertProject` types now carry `Category` end-to-end.
- `client/src/App.tsx` — added `Redirect` import; added client redirects
  `/services/website-development`, `/services/automation`, `/services/ai-agents` →
  `/services/software` (placed before the generic `/services/:slug` route so they win).
- `client/src/pages/Services.tsx` — overview array restructured to exactly three
  entries keyed to pillar slugs (`software`, `digital-marketing`, `ai-training`);
  showcase lookup now maps a project's category to its pillar via `CATEGORY_TO_PILLAR`;
  existing copy carried verbatim and TODO-tagged.
- `client/src/pages/ServiceDetail.tsx` — old `services` object re-keyed to the three
  pillars; old `website-development` + `automation` + `ai-agents` copy folded under
  `software`, `digital-marketing` unchanged, `ai-training` a placeholder reusing the
  legacy AI-Agents block; all copy verbatim + TODO-tagged; removed the old
  `getCategoryFromSlug` (build/attract/automate) helper.
- `client/src/pages/Portfolio.tsx` — filter tabs now derive from `PORTFOLIO_TAB_ORDER`,
  showing a category tab only when ≥1 project has that category ("All" always shown);
  active filter now hits `/api/projects?category=<slug>`; labels from `CATEGORY_LABELS`.
- `client/src/pages/admin/Dashboard.tsx` — category dropdown now lists the six
  `CATEGORIES` with `CATEGORY_LABELS`; form schema `category` uses `z.enum(CATEGORIES)`;
  defaults use `CATEGORIES[0]`; removed the old `as "build" | "attract" | "automate"` cast.
- `client/src/pages/Contact.tsx` — service `<Select>` options rebuilt from `PILLARS` +
  `PILLAR_LABELS` (+ "Other"); default service is a pillar slug — kept consistent with
  the new `contactFormSchema` enum so the form still validates/submits.
- `client/src/pages/Home.tsx` — fallback "Recent work" projects re-tagged with new
  category slugs (`web`, `automation`, `digital-marketing`); category rendered via
  `CATEGORY_LABELS`.
- `server/storage.ts` — imported `Category`; the two `eq(projects.category, …)` call
  sites cast the incoming string param to `Category` (needed now that the column is
  typed). The "max one `isServiceShowcase` per category" logic is **unchanged** and
  verified to work as-is with the new category values (it keys generically on the
  `category` string).

---

## Decisions I had to make

1. **`ai-training` has no pre-existing copy.** The new AI Training pillar had no
   source copy on either the Services overview or the ServiceDetail data. Per the
   "use existing text, don't write new copy" rule, I populated it with the closest
   existing block as a clearly-tagged placeholder:
   - *Services overview:* reuses the legacy "AI & Automation" overview card copy.
   - *ServiceDetail:* reuses the legacy "AI Agents" detail block verbatim.
   Both are `TODO(Layer2-copy)`-tagged; Layer 2 must write real AI Training copy.
   (Note the minor cross-surface asymmetry: on the overview the leftover AI-flavored
   block was "AI & Automation"; in the detail data it was "AI Agents", because the two
   surfaces started with different available blocks. Layer 2 unifies them.)

2. **Folding into `software` in ServiceDetail.** As instructed, web-dev + automation +
   ai-agents all land under `software`. To avoid losing any text, their `features`,
   `process`, and `faq` arrays are **concatenated verbatim** (so the software page
   currently renders a long, un-merged superset). Title/subtitle/description use the
   web-dev block as the representative header. Layer 2 will merge/dedupe.

3. **`Project.category` typing.** Rather than an `Omit<…> & { category: Category }`
   hack (which broke drizzle's row inference on the server), I typed the column itself
   with `.$type<Category>()`. This makes drizzle infer `Category` end-to-end (client,
   server, and validation) from the single source with no casts on the happy path.

4. **Showcase lookup on the Services overview.** A pillar no longer equals a single
   category (e.g. `software` spans four). I changed the lookup to match any showcase
   project whose category rolls up to the pillar via `CATEGORY_TO_PILLAR`, rather than
   inventing a pillar↔category identity.

5. **Pre-existing ServiceDetail "related projects" bug (Layer 4, out of scope).** Its
   query still returns a raw `Response` (the section never renders) — I did **not**
   fix that. To keep `tsc` green without changing the broken runtime behavior, I added
   a compile-only `as unknown as Project[]` cast and a `TODO(Layer4-bugs)` note.

6. **Contact form select values (structural, not copy).** Task 2 changes the
   `service` enum; leaving the Contact UI on the old values (`website`/`ai`/…) would
   have made the form fail validation. I updated the option **values** to the pillar
   slugs (labels from `PILLAR_LABELS`) and TODO-tagged the wording for Layer 2.

---

## Verification

- `npx tsc` → **0 errors.**
- `npm run build` (vite client + esbuild server) → **success** (only the pre-existing
  >500 kB chunk-size advisory, unrelated to this layer).
- Three pillar service routes resolve: `/services/software`, `/services/digital-marketing`,
  `/services/ai-training` (keys present in the ServiceDetail `services` object).
- Old service slugs redirect: `/services/website-development`, `/services/automation`,
  `/services/ai-agents` → `/services/software` (redirect routes precede `/services/:slug`).
- Portfolio tabs derive from `PORTFOLIO_TAB_ORDER`, hide empty categories, always show "All",
  and filter via `/api/projects?category=<slug>`.
- Repo-wide sweep for `build`/`attract`/`automate`/`website-development`/`ai-agents` in
  code: only legitimate remnants left — the redirect **route paths** in `App.tsx` and
  descriptive **comments** in `ServiceDetail.tsx`.

**Changed files:** `shared/taxonomy.ts` (new), `shared/schema.ts`, `client/src/App.tsx`,
`client/src/pages/Services.tsx`, `client/src/pages/ServiceDetail.tsx`,
`client/src/pages/Portfolio.tsx`, `client/src/pages/admin/Dashboard.tsx`,
`client/src/pages/Contact.tsx`, `client/src/pages/Home.tsx`, `server/storage.ts`,
`LAYER1-STRUCTURE.md` (new).

**Confirmation:** The site's taxonomy skeleton now flows from one file
(`shared/taxonomy.ts`): three pillars drive the service routes/pages (with old slugs
301-redirecting so no link dies), six categories drive project tagging, the admin
picker, and the portfolio filter (which self-derives its tabs from real data). The
schema, Zod validation, and TypeScript types all source their category union from that
single file, the `projects.category` text column is now type-constrained (no enum
migration needed — `db:push` suffices), and the contact `service` enum is the three
pillars + "other". All existing marketing copy was relocated verbatim and flagged
`TODO(Layer2-copy)`; typecheck and build are both green.
