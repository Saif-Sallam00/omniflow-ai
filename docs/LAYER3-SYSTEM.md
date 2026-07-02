# Layer 3 — Portfolio System + Performance

Made the portfolio/proof system work end-to-end and made the site fast. **No
case-study content and no numbers were written** — all real content is entered by
the user through the existing admin CMS. The site is now fully presentable with an
**empty database**: no `[Layer 3: …]` tokens, no fake fallback projects, no
fabricated stats.

Typecheck (`npx tsc`) → **0 errors**. Build → **success, chunk-size warning gone**.

---

## Files changed (Layer 3 only; one line each)

- `client/src/lib/placeholder.ts` — **NEW.** Local inline-SVG image fallback
  (`IMAGE_FALLBACK`) + `onImageError` handler — replaces all external `placehold.co`
  round-trips.
- `server/objectStorage.ts` — upload path now processes images with **sharp**
  (resize ≤1600px, no upscale → WebP q80) before base64-encoding for DB storage.
- `client/src/App.tsx` — route-based code-splitting: every page is `React.lazy` +
  a `<Suspense>` fallback (`PageLoader` spinner).
- `client/src/pages/Home.tsx` — removed the fabricated metric card + rebalanced the
  hero to a single centered column; removed the external noise texture; Proof section
  is now DB-driven (featured projects, category-ordered, hides when none); Recent-work
  is DB-driven with no fallback; all imgs lazy + `onImageError`.
- `client/src/pages/ServiceDetail.tsx` — **fixed the related-projects bug** (now filters
  parsed `/api/projects` by `showOnServicePage` + `CATEGORY_TO_PILLAR`, removed the
  `apiRequest` Response misuse and the compile-only cast); reworded the marketing FAQ
  threshold without a number; related img lazy + `onImageError`.
- `client/src/pages/Services.tsx` — deterministic showcase tiebreak (highest `id`);
  showcase img lazy + `onImageError`.
- `client/src/pages/Portfolio.tsx` — grid img lazy + `onImageError`; dropped the lone
  `font-light` (→ `font-normal`) so the 300 weight isn't needed for one element.
- `client/src/pages/ProjectDetail.tsx` — main img lazy/async + `onImageError`.
- `client/src/pages/About.tsx` — founder + team imgs lazy/async.
- `client/src/pages/admin/Dashboard.tsx` — project img lazy/async + `onImageError`
  (removed placehold.co).
- `client/src/components/Footer.tsx` — reduced the two `blur-[100px]` glow layers to
  `blur-[60px]` (paint-cost trim; look preserved).
- `client/index.html` — removed Playfair Display; trimmed Space Grotesk to `400;700`;
  added Inter `900` (used by `font-black`); kept `display=swap` + preconnects.
- `client/src/index.css` — removed the `--font-serif` var and the `.font-serif` utility.
- `tailwind.config.ts` — removed the `serif` font-family entry.
- `package.json` / `package-lock.json` — added `sharp`.

---

## PART A — Portfolio system correctness

- **A1 (related-projects bug fixed):** `ServiceDetail` no longer calls `apiRequest`
  (which returned a raw `Response`). It reads the parsed `/api/projects` list and filters
  client-side by `p.showOnServicePage && CATEGORY_TO_PILLAR[p.category] === <pillar slug>`.
  This also fixes the Software pillar, which spans four categories and could never match a
  single `?category=software` query. With no qualifying projects the section hides cleanly.
- **A2 (deterministic showcase tiebreak):** `getShowcaseProject(pillar)` filters showcase
  projects whose category rolls up to the pillar and picks the **highest `id`** (most
  recently created). Rule: *among showcase projects mapping to the pillar via
  `CATEGORY_TO_PILLAR`, newest wins.* There is no `updatedAt`/`createdAt` column on
  `projects`, so `id` desc is the "most recent" proxy (documented; no schema change made,
  per the layer's constraints). No behaviour change for pillars with 0 or 1 showcase.
- **A3 (empty states / auto-hiding):** Portfolio tabs still self-derive from
  `PORTFOLIO_TAB_ORDER` (empty categories hidden, "All" always shown); the existing
  "No projects found in this category." empty state is kept as-is (on-brand, not
  fabricated). Every project-driven section collapses (renders nothing) when there's no
  qualifying data — see the empty-DB walkthrough below.

## PART B — fabricated/placeholder surfaces removed

- **B1:** Deleted the ResultsDashboard metric card (Cost/Lead, Time Saved, Avg ROI) and
  its `[Layer 3: real metric]` tokens + tag; hero is now a single strong centered column,
  no numbers.
- **B2:** Home proof section is DB-driven off `isFeatured`, ordered Business Systems →
  Automation → Marketing → Web (then the rest) via a category-rank helper; hides entirely
  when there are no featured projects. Token + tag removed.
- **B3:** Recent-work is purely DB-driven (`projects` minus featured, sliced), no
  hardcoded/fallback cards, hides when empty.
- **B4:** Marketing FAQ #1 reworded to be honest without a number
  ("…we're upfront about whether the budget justifies the work, and we'll tell you before
  you commit."). Token + tag removed.
- **Result:** grep shows **zero `[Layer 3: …]` tokens** anywhere in shipped code.

## PART C — performance

- **C1 — Image pipeline (`sharp`):** kept base64-in-Postgres (no object-storage migration).
  On `/api/objects/upload`, `ObjectStorageService.uploadImageBuffer` now runs
  `sharp(buffer).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 })`
  before base64-encoding, and returns a `data:image/webp;base64,…` URI. This shrinks stored
  images dramatically with no infra change. Client 4MB accept cap unchanged. `sharp` added
  via npm; it stays external in the esbuild server bundle.
- **C2 — Lazy images:** `loading="lazy" decoding="async"` added to portfolio grid, project
  detail, home proof + recent, service showcase, related-projects, admin cards, client-logo
  marquee, and About team/founder images. The (now image-free) home hero is not lazied.
- **C3 — Fonts:** Playfair Display removed entirely (link, `--font-serif` var, `.font-serif`
  utility, tailwind `serif` entry — nothing referenced it). Space Grotesk trimmed to the
  only weights used with `font-display` (`400;700`). Inter kept `300–700` and gained `900`
  (used by `font-black` on the hero headings). `display=swap` and both font preconnects
  retained. No Arabic fonts (Layer 5).
- **C4 — Code-splitting:** all routes `React.lazy`-loaded behind one `<Suspense>`; the
  admin pages, Contact, and Home now ship as separate chunks. **The >500 kB chunk warning
  is gone.**
- **C5 — External round-trips removed:** the `grainy-gradients.vercel.app/noise.svg` hero
  texture was dropped (decorative); every `placehold.co` onError fallback now uses the local
  `onImageError` → inline-SVG `IMAGE_FALLBACK`.
- **C6 — Paint cost:** Footer's two `blur-[100px]` glows reduced to `blur-[60px]`
  (look preserved). (The dead `ROICalculator`'s `blur-[120px]` was left for Layer 6 removal.)

### Bundle size — before / after

| | Before (Layer 2) | After (Layer 3) |
|---|---|---|
| Main JS chunk | **598.30 kB** (gzip 181.89 kB), single file | **298.97 kB** (gzip 97.82 kB) vendor + a 89.37 kB app chunk |
| Per-route chunks | none (all in main) | Home 39.3 kB, Contact 45.5 kB, Dashboard 29.7 kB, ServiceDetail 11.7 kB, Portfolio 11.1 kB, About 8.6 kB, Services 7.2 kB, ProjectDetail 4.8 kB, Auth 4.4 kB, … |
| CSS | 114.44 kB (gzip 17.56 kB) | 109.81 kB (gzip 16.89 kB) |
| >500 kB chunk warning | **yes** | **gone** |

*Known, out-of-scope:* several static client-logo PNGs (`naas` 1.36 MB, `kayan` 1.29 MB, …)
remain large. They are build-time bundled assets (not the CMS upload path C1 targets) and are
now lazy-loaded in the marquee; compressing them is a separate future pass.

---

## Empty-database walkthrough (every section renders real data or hides cleanly)

**Home**
- Hero — static copy, no numbers, no image. **Renders.**
- Trust strip + client-logo marquee — static text + bundled logos (lazy). **Renders.**
- Value proposition / Pillars / Transformation / How-we-work / Brand line / Final CTA —
  static copy. **Render.**
- Proof (featured projects) — `featured.length === 0` → **hidden** (no shell, no token).
- Recent work — `recent.length === 0` → **hidden** (no fallback cards).

**Portfolio** — only the "All" tab shows; grid shows the on-brand
"No projects found in this category." empty state. **Presentable.**

**Services** — three pillar cards render (static copy); each showcase preview is absent
(no showcase project) so cards render full-width. **Clean.**

**ServiceDetail** (`/services/software|digital-marketing|ai-training`) — hero, features,
process, FAQ, CTA all static. Related-projects section `relatedProjects.length === 0` →
**hidden**. **Clean.**

**ProjectDetail** — only reachable from a project link; with an empty DB none exist, and a
direct `/portfolio/:id` shows the existing "Project not found" state. **Fine.**

**About / Contact / Footer** — static copy + `[TODO(team-final)]` freezes (untouched);
no project data. **Render.**

Once the user adds projects via `/admin/dashboard`, they appear automatically: Portfolio
grid + tabs, Home Recent-work, Home Proof (if `isFeatured`), the Services showcase (if
`isServiceShowcase`, newest-id wins per pillar), and the ServiceDetail related list (if
`showOnServicePage`).

---

## Verification

- `npx tsc` → **0 errors.** `npm run build` → **success, no chunk-size warning.**
- Grep: **zero `[Layer 3: …]` tokens**, **zero `placehold.co`**, **zero grainy-gradients**,
  **zero hardcoded fallback projects**; Playfair/`font-serif` fully gone.
- `[TODO(team-final)]` (13 hits in About) and `TODO(email-final)` (taxonomy) **untouched**.

**Changed files:** `client/src/lib/placeholder.ts` (new), `server/objectStorage.ts`,
`client/src/App.tsx`, `client/src/pages/Home.tsx`, `client/src/pages/ServiceDetail.tsx`,
`client/src/pages/Services.tsx`, `client/src/pages/Portfolio.tsx`,
`client/src/pages/ProjectDetail.tsx`, `client/src/pages/About.tsx`,
`client/src/pages/admin/Dashboard.tsx`, `client/src/components/Footer.tsx`,
`client/index.html`, `client/src/index.css`, `tailwind.config.ts`,
`package.json` / `package-lock.json`, plus `LAYER3-SYSTEM.md` (new).
