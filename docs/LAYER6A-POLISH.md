# Layer 6a — Polish (SEO/meta, favicon, footer taxonomy fix, dead-code cleanup)

Polish-only pass. **No team/founder/remote content was written, invented, or
unfrozen** — every `[TODO(team-final)]` node in `About.tsx` and the i18n
dictionary is untouched. No copy was rewritten beyond the footer service labels
and the one Arabic standardization noted below.

`npm run check` (tsc) → **0 errors**. `npm run build` → **success**. EN/AR
dictionary parity preserved: **242 = 242 keys, none missing** on either side.

---

## Task 1 — Footer service links (old-taxonomy leak fixed)

The footer "Services" column showed four pre-Layer-1 names linking to `/services`:
**Web Dev · Automation · AI Agents · Marketing**. Replaced with **three pillar
links**, one per real pillar, pointing at the actual pillar routes:

| Label (EN) | Label (AR) | Route |
|---|---|---|
| AI Training | التدريب على الذكاء الاصطناعي | `/services/ai-training` |
| Digital Marketing | التسويق الرقمي | `/services/digital-marketing` |
| Software | البرمجيات | `/services/software` |

- `client/src/components/Footer.tsx` — four `<FooterLink href="/services">` rows
  replaced with three, each pointing at its pillar route.
- `client/src/lib/i18n.tsx` — removed the four now-unused keys
  (`footer.link.webdev` / `.automation` / `.aiagents` / `.marketing`) in **both**
  languages; added `footer.link.aiTraining` / `.digitalMarketing` / `.software`
  in both languages with the values above.

**Repo-wide sweep for other surviving old-taxonomy UI labels:**
- No `"AI Agents"` / `"وكلاء الذكاء الاصطناعي"` string remains anywhere in `client/src`.
- No `"Web Dev"` remains **as a service label/link**.
- **Reported, not changed (out of scope — copy):** `footer.newsletter.text` still
  reads *"Get the latest trends in AI and Web Dev delivered to your inbox."* This
  is descriptive newsletter copy, not a taxonomy label/link, so it was left for a
  copy pass rather than rewritten here.
- The legacy `/services/website-development` etc. **redirect route paths** in
  `App.tsx` are intentional (Layer 1) and were left as-is.

---

## Task 2 — Arabic "AI Training" standardization

The dictionary was already largely standardized on the على-form
(`category.ai-training`, `serviceOpt.ai-training`, both pillar/detail titles all
read *"…على الذكاء الاصطناعي…"*). The **only** remaining على-less occurrence was
in `home.hero.sub`:

- `client/src/lib/i18n.tsx` — `home.hero.sub`:
  `…عبر تدريب الذكاء الاصطناعي…` → `…عبر التدريب على الذكاء الاصطناعي…`
  (definite form for grammatical parallelism with the following
  `التسويق الرقمي وبرمجيات الأعمال`).

Standalone labels use the definite **التدريب على الذكاء الاصطناعي**; the two
headline/title strings keep the indefinite mid-sentence **تدريب على الذكاء
الاصطناعي**, which was already consistent. English unchanged.

---

## Task 3 — SEO / meta (no SSR, no new deps)

`client/index.html` head updated to the new positioning:
- `<title>` → **"OmniflowAI — Your Digital Transformation Partner"** (was
  "OmniflowAI - Design & Automation").
- `<meta name="description">` → concise positioning sentence covering the three
  pillars (AI training, digital marketing, business software).
- Added site-wide **Open Graph** (`og:type=website`, `og:title`, `og:description`)
  and **Twitter card** (`twitter:card=summary_large_image`, `twitter:title`,
  `twitter:description`) defaults. (Per-route OG needs SSR — out of scope; the old
  bare `og:title` "OmniflowAI" was replaced by the full set.)

**Per-route document titles** — added a tiny custom hook rather than a library:
- `client/src/hooks/use-document-title.ts` — **NEW** (~18 lines).
  `useDocumentTitle(title?)` sets `document.title` to `"<title> — OmniflowAI"`
  (or the site-wide default when called with no argument) via `useEffect`, and
  restores the default on unmount. English tab titles by design.
- Wired into every page component:
  - `Home` → site default · `About` → "About" · `Services` → "Services" ·
    `Portfolio` → "Portfolio" · `Contact` → "Contact" · `not-found` → "Page not found"
  - `ServiceDetail` → pillar label via `PILLAR_LABELS[slug]` (falls back to the
    site title for an unknown slug; hook called before any early return)
  - `ProjectDetail` → the loaded `project.title` (hook called before the
    loading/error early returns; shows the site title until data loads)
  - Admin: `Auth` → "Admin Login" · `Dashboard` → "Admin — Portfolio" ·
    `Leads` → "Admin — Leads"

---

## Task 4 — Favicon MIME fix

- `client/index.html` — favicon `<link>` `type="image/png"` → **`type="image/svg+xml"`**
  (the file is `favicon.svg`). Existing mark/href kept.

---

## Task 5 — Dead-code / unused-dependency cleanup

**Files deleted** (each verified unreferenced by grep before deletion):
- `client/src/components/ROICalculator.tsx` — imported nowhere (only self-referenced).
- `client/src/pages/admin/ProjectEditor.tsx` — 0-byte empty file, referenced nowhere.
- `server/objectAcl.ts` — dead GCS ACL code; nothing imports it.

**Dependencies removed from `package.json`** (each grep-verified as unreferenced
in `client/src` / `server` / `shared` / config files):
- `framer-motion` — no `motion.` usage anywhere.
- `react-icons` — no imports.
- `next-themes` — no imports (site is fixed-dark; no theme switch).
- `@tailwindcss/vite` — Tailwind v4 plugin, not wired (project is Tailwind v3).
- `tw-animate-css` — not referenced in CSS/config.
- `@google-cloud/storage` — only import was in the now-deleted `objectAcl.ts`.

`npm install` after removal pruned **78 packages** (the six + transitive deps);
build still green.

**Kept (nothing was kept against the task list):** all six listed deps were
confirmed unreferenced and removed. No borderline/uncertain deletions were made.

---

## Files changed / deleted (one line each)

**New**
- `client/src/hooks/use-document-title.ts` — per-route `document.title` hook.
- `LAYER6A-POLISH.md` — this document.

**Changed**
- `client/index.html` — title + description + OG/Twitter defaults; favicon MIME fix.
- `client/src/lib/i18n.tsx` — footer service keys swapped to pillar keys (EN+AR);
  `home.hero.sub` Arabic AI-training standardization.
- `client/src/components/Footer.tsx` — three pillar links to real pillar routes.
- `client/src/pages/Home.tsx` — `useDocumentTitle()`.
- `client/src/pages/About.tsx` — `useDocumentTitle("About")`.
- `client/src/pages/Services.tsx` — `useDocumentTitle("Services")`.
- `client/src/pages/Portfolio.tsx` — `useDocumentTitle("Portfolio")`.
- `client/src/pages/Contact.tsx` — `useDocumentTitle("Contact")`.
- `client/src/pages/not-found.tsx` — `useDocumentTitle("Page not found")`.
- `client/src/pages/ServiceDetail.tsx` — `useDocumentTitle(PILLAR_LABELS[slug])`.
- `client/src/pages/ProjectDetail.tsx` — `useDocumentTitle(project?.title)`.
- `client/src/pages/admin/Auth.tsx` — `useDocumentTitle("Admin Login")`.
- `client/src/pages/admin/Dashboard.tsx` — `useDocumentTitle("Admin — Portfolio")`.
- `client/src/pages/admin/Leads.tsx` — `useDocumentTitle("Admin — Leads")`.
- `package.json` — removed six unused dependencies (see Task 5).
- `package-lock.json` — regenerated (`npm install`), 78 packages pruned.

**Deleted**
- `client/src/components/ROICalculator.tsx`
- `client/src/pages/admin/ProjectEditor.tsx`
- `server/objectAcl.ts`

---

## Verification
- `npm run check` (tsc) → **0 errors**.
- `npm run build` (vite + esbuild) → **success** (only the pre-existing >500 kB
  chunk-size advisory).
- Footer shows the **3 pillar links** in both languages, each to its real pillar
  route; **no `"AI Agents"` string exists anywhere in the UI**.
- Per-route browser-tab titles set on every page (public + admin + dynamic).
- Favicon declared `image/svg+xml`.
- EN/AR key parity: **242 = 242**, none missing on either side.
- **No team/founder content touched** — all `[TODO(team-final)]` nodes remain frozen.
