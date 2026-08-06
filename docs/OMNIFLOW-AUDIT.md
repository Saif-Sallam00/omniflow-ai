# OmniflowAI — Project State Audit

> **Verified against commit `381fe70` on 2026-08-06.** Read-only snapshot of the
> codebase as it actually exists. Everything below is drawn from files opened in
> this pass. Where something is a placeholder, orphaned, or inconsistent, it is
> called out explicitly. User-facing copy is reproduced verbatim.
>
> `npm run check` (tsc) and `npm run build` were both run for this audit and are
> **green**.
>
> **This file replaces the original Nov-2025/Jan-2026 audit.** That version
> described the pre-Layer-1 site (four services, `build`/`attract`/`automate`
> categories, a contact form that persisted nothing, in-memory sessions, an
> orphaned i18n dictionary). None of that is true anymore. If you need the old
> snapshot, read it from git history — do not treat quotes from it as current.

---

## 1. Tech Stack & Architecture

### Framework & language
- **Frontend**: React 18.3.1 (SPA) + TypeScript, built with **Vite 5.4.20**.
- **Routing**: `wouter` 3.3.5 (client-side, not React Router).
- **Backend**: **Express 4.21.2** (Node, ESM, run via `tsx` in dev, bundled with `esbuild` for prod).
- **Language**: TypeScript 5.6.3 everywhere (`.ts` / `.tsx`), `strict: true`.
- `package.json` `name` is still `"rest-express"`, `version` `1.0.0`, `license` MIT, `type: module`.
- **Node 20+ is required** — the server uses `import.meta.dirname`; on Node 18 it crashes at boot with `ERR_INVALID_ARG_TYPE paths[0]`. (`vite.config.ts` itself derives `__dirname` via `fileURLToPath`, so the config alone is version-tolerant; the server is not.)

### Styling
- **Tailwind CSS 3.4.17** (`tailwind.config.ts`) + PostCSS + Autoprefixer.
- **shadcn/ui** ("new-york", base color `neutral`, CSS variables on) — 47 primitives under `client/src/components/ui/`; **~20 are actually imported** by app code.
- Design tokens in `client/src/index.css` — the "Ember on gunmetal" brand system (see §4).
- Plugins: `tailwindcss-animate`, `@tailwindcss/typography`.

### Build & deployment
- **Build**: `vite build` (client → `dist/public`) **+** `esbuild server/index-prod.ts … → dist/index.js`.
- **Dev**: `NODE_ENV=development tsx server/index-dev.ts` — Express + Vite middleware, single port **5000**.
- **Start (prod)**: `NODE_ENV=production node dist/index.js` — serves static `dist/public`, falls through to `index.html` for the SPA.
- **Measured build output** (this pass): `dist/public` ≈ **1.3 MB** total, `dist/index.js` ≈ **21 KB**. Largest client chunks: shared vendor `index-*.js` 333 KB (gzip 109 KB), `Home` 119 KB (gzip 67 KB), CSS 111 KB (gzip 17 KB). Every page is its own lazy chunk.
- **Deployment target**: **Replit** (`.replit`). `deploymentTarget = "autoscale"`, external port 80 → local 5000. Modules `nodejs-20`, `web`, `postgresql-16`. No Vercel/Netlify config.
- Replit Vite plugins are dev-only and gated on `REPL_ID`, except `@replit/vite-plugin-runtime-error-modal` which is loaded unconditionally.

### Backend / API / services
- **Express REST API** (see §11). Auth via `passport` + `passport-local`; sessions via `express-session` + **`connect-pg-simple`** — a **Postgres-backed session store** (`session` table, `createTableIfMissing: true`). Sessions now survive restarts.
- **Database**: **Neon serverless Postgres** via `@neondatabase/serverless` + `drizzle-orm` 0.39.3 (schema-first, `drizzle-kit push`, no checked-in migrations). WebSocket driver `ws`.
- **File upload**: `multer` (memory storage, 5 MB server cap / 4 MB client cap). Images are compressed by **`sharp` 0.34.5** (rotate-by-EXIF → resize ≤1600 px, no upscale → WebP q80) and returned as a **base64 `data:image/webp` URI** stored in the `projects.image` text column. There is no disk or cloud bucket. `express.json` limit is raised to **50 mb** in `server/app.ts` for this reason.
- **Email**: **Resend** 6.4.2 — fire-and-forget lead notification, skipped silently without `RESEND_API_KEY`.
- **Analytics**: Google Analytics 4, injected client-side (`client/src/lib/analytics.ts`), no-ops without the env var.

> **Gone since the previous audit:** `@google-cloud/storage` and `server/objectAcl.ts` (deleted), `framer-motion`, `react-icons`, `next-themes`, `@tailwindcss/vite`, `tw-animate-css`, `memorystore` as the session store. `memorystore` is still listed in `package.json` but is no longer imported.

### Environment variables
| Var | Required | Behaviour when unset |
|---|---|---|
| `DATABASE_URL` | **Yes** | `server/db.ts` and `drizzle.config.ts` throw on boot |
| `PORT` | No | defaults to `5000` |
| `NODE_ENV` | No | also drives the session `secure` cookie flag |
| `ADMIN_PASSWORD` | No | seeds `admin` with the built-in default, logs a warning |
| `SESSION_SECRET` | No | uses the built-in default, logs a warning |
| `RESEND_API_KEY` | No | email notification skipped, lead still saved |
| `NOTIFY_EMAIL` | No | falls back to `CONTACT_EMAIL` from the taxonomy |
| `VITE_GA_MEASUREMENT_ID` | No | GA never initialises |
| `REPL_ID` | No | presence toggles the Replit dev Vite plugins |

Config is loaded from `.env` (gitignored) via `dotenv/config`, imported at the top of `server/index-dev.ts`, `server/index-prod.ts`, and `drizzle.config.ts`. `.env.example` documents all of the above.

---

## 2. Project Structure

```
omniflowai/
├── client/                          # Frontend (Vite root)
│   ├── index.html                   # HTML shell, fonts (Inter/Space Grotesk/Cairo), full meta+OG+Twitter
│   ├── public/favicon.svg           # Orange hexagon mark
│   └── src/
│       ├── App.tsx                  # Router, providers, lazy routes, WhatsApp float
│       ├── main.tsx                 # React root + ErrorBoundary
│       ├── index.css                # "Ember on gunmetal" tokens, RTL, reduced-motion, keyframes
│       ├── env.d.ts
│       ├── assets/
│       │   ├── clients/             # 34 client logo files (32 imported — see §10)
│       │   └── team_images/         # omniflowai-team.webp (single group photo)
│       ├── components/
│       │   ├── Navigation.tsx
│       │   ├── Footer.tsx           # + NewsletterForm, FooterLink, SocialIcon
│       │   ├── ObjectUploader.tsx
│       │   ├── ProtectedRoute.tsx
│       │   ├── systems/             # Connected-systems visual language (see §5)
│       │   │   ├── primitives.ts    # SVG geometry + layouts (hub/pipeline/ring), no React
│       │   │   ├── HexNode.tsx  FlowLine.tsx  SystemMap.tsx
│       │   │   ├── InteractiveSystemMap.tsx   HexGridSubstrate.tsx  ProductFrame.tsx
│       │   │   └── index.ts         # public API barrel
│       │   └── ui/                  # 47 shadcn/ui primitives
│       ├── hooks/
│       │   ├── use-analytics.tsx  use-document-title.ts  use-in-view.ts
│       │   ├── use-reduced-motion.ts  use-mobile.tsx  use-toast.ts  use-user.ts
│       ├── lib/
│       │   ├── i18n.tsx             # EN/AR dictionary + provider (296 keys each)
│       │   ├── analytics.ts  queryClient.ts  placeholder.ts  utils.ts
│       └── pages/
│           ├── Home.tsx  About.tsx  Services.tsx  ServiceDetail.tsx
│           ├── Portfolio.tsx  ProjectDetail.tsx  Contact.tsx  not-found.tsx
│           └── admin/
│               ├── Auth.tsx  Dashboard.tsx  Leads.tsx
├── server/
│   ├── app.ts                       # Express app, 50mb JSON limit, request logger, runApp()
│   ├── index-dev.ts / index-prod.ts # Vite middleware / static serve
│   ├── routes.ts                    # All API routes, auth, session, seeding, Resend notify
│   ├── storage.ts                   # DatabaseStorage implements IStorage (all DB access)
│   ├── db.ts                        # Neon pool + drizzle instance
│   └── objectStorage.ts             # sharp → base64 data-URI "storage"
├── shared/
│   ├── taxonomy.ts                  # SINGLE SOURCE OF TRUTH for pillars/categories/contact
│   └── schema.ts                    # Drizzle tables + drizzle-zod schemas + types
├── scripts/optimize-logos.mjs       # One-off client-logo compression utility
├── attached_assets/                 # Scratch: 3 unused generated PNGs + 4 prompt dumps
├── docs/                            # All project markdown (this file included)
├── CLAUDE.md                        # Only markdown intentionally at repo root
└── package.json · tailwind.config.ts · tsconfig.json · vite.config.ts · drizzle.config.ts
    components.json · postcss.config.js · .env / .env.example / .replit
```

Key structural facts:
- **`shared/taxonomy.ts` is the source of truth** for pillar and category slugs/labels, `CATEGORY_TO_PILLAR`, `CONTACT_SERVICES`, `CONTACT_EMAIL`, `SOCIAL_LINKS`, and `LEGACY_CATEGORY_MAP`. Schema validation, pages, admin, and server all import from it. Nothing hardcodes a slug.
- **`server/storage.ts` is the only DB access layer.** Routes never query Drizzle directly.
- Path aliases: `@` → `client/src`, `@shared` → `shared`, `@assets` → `attached_assets`.
- **No test suite and no linter.** `npm run check` (tsc) is the only static verification.

---

## 3. Routing & Pages

Defined in `client/src/App.tsx` with `wouter`. Every page is `React.lazy`-loaded behind a `<Suspense>` with a spinner fallback. `ScrollToTop` resets scroll on navigation.

**Admin chrome suppression:** `location.startsWith("/admin")` hides the public `Navigation`, `Footer`, and the floating WhatsApp CTA — admin renders its own shell.

| Route | Component | Access | Notes |
|---|---|---|---|
| `/` | `Home` | Public | |
| `/about` | `About` | Public | |
| `/services` | `Services` | Public | |
| `/services/:slug` | `ServiceDetail` | Public | valid slugs = the three **pillars**: `ai-training`, `digital-marketing`, `software` |
| `/services/website-development` | → `Redirect` | Public | legacy → `/services/software` |
| `/services/automation` | → `Redirect` | Public | legacy → `/services/software` |
| `/services/ai-agents` | → `Redirect` | Public | legacy → `/services/software` |
| `/portfolio` | `Portfolio` | Public | DB-driven; supports `?service=<pillar>` deep link |
| `/portfolio/:id` | `ProjectDetail` | Public | DB-driven |
| `/contact` | `Contact` | Public | |
| `/admin/auth` | `AuthPage` | Public (login) | |
| `/admin/dashboard` | `Dashboard` | **Protected** | portfolio CMS |
| `/admin/leads` | `Leads` | **Protected** | lead inbox |
| (any other) | `NotFound` | Public | translated 404 |

The floating WhatsApp CTA links to `https://wa.me/201119936014`.

**There are no dead links.** The old `/privacy`, `/terms`, `/sitemap` footer links were removed and replaced with `TODO(legal-final)` comments; social icons only render for non-empty `SOCIAL_LINKS` entries (all empty → none render).

### Section order per page

**Home (`Home.tsx`)** — 10 numbered sections, alternating dark/light per BUILD_PLAN P6:
1. **Hero** (dark) — headline + sub + 2 CTAs, `InteractiveSystemMap` on the right, `HexGridSubstrate` behind
2. **Trust strip + client logos** (light `bg-surface`) — pulse-pill eyebrow, reach headline, 3 reach stats, country strip, 30s infinite logo marquee (32 logos, doubled)
3. **Value proposition** (dark) — the "systems problem" statement, orange words revealed word-by-word on scroll
4. **Pillars** (light) — 3 cards linking to `/services/<pillar>`
5. **Transformation** (dark) — Before / After lists
6. **Proof** (light) — **DB-driven**, only renders when featured projects exist
7. **Recent work** (dark) — **DB-driven** carousel of non-featured projects (max 6), only renders when non-empty
8. **How we work** (light) — 4-step scroll-activated timeline (Diagnose → Design → Build → Optimize)
9. **Global brand line** (dark) — shield icon + brand line + CTA
10. **Final CTA** (dark)

**About (`About.tsx`)** — 4 sections: Hero ("Who we are") → Story (team photo + 3 paragraphs) → Values (4 cards) → CTA. ⚠ The team-grid section is **deliberately not rendered** (frozen `TODO(team-final)`); the JSX comments still number the values section "4." and the CTA "5.".

**Services (`Services.tsx`)** — Header → **accessible pillar tablist** (roving tabindex + Left/Right arrow keys) with a detail panel per pillar (title, tagline, body, 4 numbered steps, 2 CTAs) → **pain router** (4 buttons that select-and-scroll to the matching pillar, or go to `/contact`).

**ServiceDetail (`ServiceDetail.tsx`)** — Hero (icon, title, subtitle, description, 2 CTAs) → **Related projects** (DB-driven, filtered by `CATEGORY_TO_PILLAR[p.category] === slug`; renders only when non-empty) → Features grid → Process steps → FAQ (plain divs, not an accordion) → CTA.

**Portfolio (`Portfolio.tsx`)** — Header → optional pillar deep-link banner (`?service=<pillar>`) → sticky filter tabs → gallery grid / empty state / skeleton. Tabs only appear for categories that at least one current project actually uses.

**ProjectDetail (`ProjectDetail.tsx`)** — Hero header (category badge, client, title, description, up to 4 result tiles) → full-width image → **Problem → Diagnosis → System** narrative (Diagnosis renders only when present) + Tech Stack sidebar CTA.

**Contact (`Contact.tsx`)** — one section: heading + form (2/3) + info sidebar (1/3) with contact details and the "Quick Response Guarantee" card.

**Admin** — `Auth` centered login card; `Dashboard` portfolio CMS (cards, create/edit dialog, delete confirm, tag editor); `Leads` inbox (status select, expand message, delete confirm). Both admin pages share an `AdminNav` (Portfolio / Leads).

---

## 4. Design System

### "Ember on gunmetal"
The governing rules live in `docs/BUILD_PLAN.md` (P0–P6). The two that shape everything visible:
- **P5 — single accent only.** Flow Orange `#FF6B1F`. No second colour.
- **P6 — dark/light with intent.** Dark = identity/impact (hero, value prop, before/after, brand line, CTA). Light `#F6F7F8` = readability/trust (logos, pillars, proof, process).

### Theme model
- The public site renders **dark by default via hardcoded slate classes**, not via the `.dark` class. `App.tsx` wraps everything in `bg-slate-950`. Light bands are opt-in via the `bg-surface` token.
- `index.css` defines a full light/dark shadcn token set and `tailwind.config.ts` sets `darkMode: ["class"]`, but **`.dark` is never toggled**. The `:root` (light) values are what shadcn primitives actually resolve to.
- **The admin CMS is now dark too** (`bg-[#0a0a0b]`), matching the public site — it was light in the previous audit. Admin remains intentionally English-only.

### Brand tokens (`index.css` `:root`, HSL)
```
--gunmetal: 222 47% 11%      --midnight: 222 47% 7%
--brand-400: 27 96% 61%      (orange-400 — accent text on dark)
--brand-500: 25 95% 53%      (orange-500 — core brand)
--brand-600: 21 90% 48%      (orange-600 — solid CTA fill)
--brand-700: 17 88% 40%      (orange-700 — hover / on-light text)
--brand-light: 38 92% 50%    (amber-500 — highlight word, footer signal dot)
--surface-light: 210 14% 97% (#F6F7F8 — P6 readability bands)
--primary: 20 100% 56%       (Flow Orange #FF6B1F — the ONE canonical CTA fill)
--primary-foreground: 0 0% 100%
--ring: 25 95% 53%           --radius: 0.5rem
```
Exposed to Tailwind as the `brand.{400,500,600,700,light}` and `surface` colour scales. The shadcn `Button` `default` variant is `bg-primary` — **no gradient CTAs**.

Also defined: a deliberately whisper-quiet shadow scale (`--shadow-xs/sm/md` → `shadow-card` / `shadow-elevated`) and motion tokens (`--ease-standard`, `--duration-fast/base/slow` → `ease-standard`).

### Typography
- Loaded in `client/index.html` via Google Fonts: **Inter** (300–900), **Space Grotesk** (400/700), **Cairo** (400/700).
- `--font-sans: Inter`, `--font-display: Space Grotesk`. **Playfair Display was removed.**
- **Cairo is the Arabic webfont**, applied by `[dir="rtl"] body` and `[dir="rtl"] .font-display`, with Inter/Space Grotesk kept in the stack as the Latin fallback for brand and code runs.
- ⚠ `tailwind.config.ts` still maps `mono: ["var(--font-mono)"]`, but **`--font-mono` is never defined** anywhere. Any `font-mono` usage (e.g. the admin textareas) falls back to the browser default.

### Utilities & motion in `index.css`
- `.hover-elevate` / `.active-elevate` — pseudo-element overlays driven by `--elevate-1/2`.
- `.card-lift` — 4 px hover/focus-within lift with a faint Flow Orange glow.
- **RTL block** (unlayered so it beats Tailwind): Cairo font swap + `scaleX(-1)` on directional lucide icons.
- **`prefers-reduced-motion` block** (unlayered): zeroes all animation/transition durations globally.
- `@keyframes hex-pulse` and `flow-travel` for the connected-systems visuals.
- The Home logo marquee uses an **inline `@keyframes marquee` (30 s)** injected via a `<style>` tag — the Tailwind config's `scroll` (40 s) and `float` (6 s) animations remain **unused**.

### ⚠ Token drift (real, current)
Several files still use raw Tailwind colour utilities instead of the brand tokens the config exposes:
- `ServiceDetail.tsx` — `bg-orange-500 hover:bg-orange-600`, `text-orange-400`, `bg-[#0a0a0b]` throughout (this page was not migrated to `brand-*` / `bg-primary`).
- `admin/Auth.tsx` — an all-`amber-500` treatment (gradient logo tile, glows, brand accent).
- `admin/Dashboard.tsx` / `admin/Leads.tsx` — `amber-*`, `orange-*`, `sky-*` status colours.
- `Home.tsx`, `About.tsx`, `Contact.tsx`, `Services.tsx` — decorative `from-orange-950/…` background gradients.
- `Footer.tsx` — `bg-amber-500` pulse dot next to the wordmark.

Not a bug, but it means "single accent, tokens only" is not yet fully true outside the pages that were swept.

---

## 5. Components Inventory

### App-specific components

| Component | Path | Used by |
|---|---|---|
| `Navigation` | `components/Navigation.tsx` | `App.tsx` (public routes only) |
| `Footer` | `components/Footer.tsx` | `App.tsx` (public routes only). Internal: `NewsletterForm`, `FooterLink`, `SocialIcon` |
| `ObjectUploader` | `components/ObjectUploader.tsx` | admin `Dashboard` |
| `ProtectedRoute` | `components/ProtectedRoute.tsx` | `App.tsx` (`/admin/dashboard`, `/admin/leads`) |

### `components/systems/` — the connected-systems visual language

| Module | What it is | Currently rendered on a page? |
|---|---|---|
| `primitives.ts` | Pure SVG geometry: `hexPath`, `edgePath`, `hub`/`pipeline`/`ring` layouts, `SystemNode`/`SystemEdge` types. No React. | via the components below |
| `HexNode.tsx` | A single flat-top hexagon node | **No** — imported by nothing at all |
| `FlowLine.tsx` | A connector path between two nodes | **No** — imported only by `SystemMap` |
| `SystemMap.tsx` | Static declarative node/edge map. Uses `FlowLine` + `hexPath` directly (**not** `HexNode`) | **No** — exported but used by no page |
| `InteractiveSystemMap.tsx` | Hover/focus/scroll-driven hub-and-spoke map. Draws straight from `primitives` (`hexPath`, `edgePath`, `ring`) | **Yes** — Home hero |
| `HexGridSubstrate.tsx` | Whisper-subtle full-bleed hex background | **Yes** — Home hero |
| `ProductFrame.tsx` | Framing chrome for product imagery | **No** — exported, unused |

The module is a small deliberate design-system library; only 2 of its 6 components are on a page. That is worth knowing before assuming it is dead code — see §12.

### Local (in-file) components
`Reveal`, `HighlightWords` (Home) · `ValueCard` (About) · `PortfolioSkeleton` (Portfolio) · `ProjectSkeleton` (ProjectDetail) · `AdminNav` (Leads, duplicated inline in Dashboard) · tag editor (Dashboard).

### Hooks
- `use-user.ts` — `{ user, isLoading, error, login, logout }` over `/api/user`.
- `use-document-title.ts` — per-route `<title>`; `"<page> — OmniflowAI"`, restores the site default on unmount. Tab titles are English by design.
- `use-in-view.ts` — IntersectionObserver scroll-reveal gate. **Fails open**: reduced-motion, missing IO, or no `window` all initialise `inView = true`, so content is never hidden behind a missing API.
- `use-reduced-motion.ts` — JS gate that defaults to `true` (no motion) until measured, so motion-sensitive users never see a flash.
- `use-analytics.tsx`, `use-toast.ts`, `use-mobile.tsx` — page-view tracking and standard shadcn helpers.

### Libs
- `lib/i18n.tsx` — `I18nProvider` + `useI18n()` → `{ language, setLanguage, t, isRTL }`. Persists to `localStorage`, sets `documentElement.lang/dir` and `body.dir`. `t()` returns the key itself when missing.
- `lib/queryClient.ts` — default `queryFn` fetches `queryKey.join("/")` with `credentials: "include"`; `staleTime: Infinity`, no retries or refetch. **`apiRequest(method, url, data)` returns the raw `Response`** — callers must `.json()` it. (It does throw on non-2xx via `throwIfResNotOk`, so a bare `await apiRequest(...)` is a valid fire-and-check.)
- `lib/placeholder.ts` — `IMAGE_FALLBACK`, an **inline SVG data URI**, plus an `onImageError` handler that detaches itself to avoid loops. Replaced the old external `placehold.co` round-trip.
- `lib/analytics.ts` — `initGA`, `trackPageView`, `trackEvent`; all no-op without `VITE_GA_MEASUREMENT_ID`.
- `lib/utils.ts` — `cn()`.

### shadcn/ui — 47 primitives, ~20 used
**Imported by app code:** `alert-dialog, badge, button, card, carousel, dialog, form, input, label, select, separator, sheet, skeleton, switch, tabs, textarea, toast, toaster, toggle, tooltip`.
**Installed but unused by pages:** `accordion, alert, aspect-ratio, avatar, breadcrumb, calendar, chart, checkbox, collapsible, command, context-menu, drawer, dropdown-menu, hover-card, input-otp, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, sidebar, slider, table, toggle-group`.

---

## 6. UI/UX & Interaction

### Layout patterns
- **Nav**: fixed top, transparent → `bg-slate-950/90 backdrop-blur-md` after 20 px scroll. Hexagon + "Omniflow"/"AI" lockup, forced `dir="ltr"` so the brand renders left-to-right even in Arabic. Desktop: centred links + globe toggle + orange pill CTA. Mobile: hamburger → full-screen menu with language toggle and CTA.
- **Hero**: two-column grid (copy / interactive system map), `min-h-[80vh]`, hex substrate behind.
- **Band alternation**: `bg-surface` (light) and `bg-slate-950` (dark) sections alternate down the homepage per P6, separated by hairline borders.
- **Cards**: light bands use `bg-white border-slate-200 shadow-card`; dark bands use `bg-slate-900/50 border-slate-800`.
- **Footer**: 3-col mobile / 2-col tablet / 4-col desktop; brand blurb, Services, Company, newsletter + contact, bottom bar.

### Animation / motion
All motion is **CSS + IntersectionObserver** — there is no animation library.
- Logo marquee (inline 30 s keyframes), `animate-ping` (trust pulse dot, WhatsApp), `animate-pulse` (skeletons, footer dot), `animate-spin` (loaders).
- `Reveal` (fade + rise), `HighlightWords` (90 ms-staggered word reveal), the process timeline's 180 ms-staggered step activation, `card-lift` hover.
- `embla-carousel-react` powers the Home "Recent work" carousel.
- Reduced motion is handled twice over: the global CSS block zeroes durations, and `useReducedMotion()` lets the systems visuals avoid *mounting* infinite animations at all.

### Responsiveness & accessibility
- Mobile-first with `sm`/`md`/`lg` variants throughout.
- **Services tablist** is a proper `role="tablist"` with roving `tabIndex` and Left/Right arrow navigation; the panel is a focusable `role="tabpanel"`.
- Focus rings use `focus-visible:ring-ring` (brand orange).
- Images are `loading="lazy" decoding="async"` with a local `onError` fallback.
- The system map exposes a descriptive `aria-label`; decorative layers are `aria-hidden`.
- RTL uses logical properties (`ms-`/`me-`/`ps-`/`text-start`) in most places — see §12 for the remaining physical-direction spots.

### Interactive elements
Contact form (RHF + Zod) · footer newsletter (**now functional**) · admin login · admin project create/edit dialog + delete confirm · admin lead status select + delete confirm · Portfolio category tabs + pillar deep-link banner · Services pillar tabs + pain router · Home carousel · language toggle.

---

## 7. Copywriting (VERBATIM)

> **All user-facing copy now comes from the i18n dictionary.** `client/src/lib/i18n.tsx` holds **296 EN keys and 296 AR keys — verified exact parity, zero missing on either side.** Arabic is formal MSA (فصحى). Below is the **English**; the Arabic mirror exists for every key. Brand name, `CONTACT_EMAIL`, enum/code values, DB content, and the admin CMS are intentionally not translated.

### Global
- **Nav**: "Home", "Services", "Portfolio", "About", "Contact"; CTA "**Let's Talk**"
- **Common CTA**: "**Book a strategy call**"
- **Brand line**: "**We don't hand over deliverables and walk away. We build systems that keep working after we're gone.**"
- "All", "View all projects", WhatsApp: "**Chat on WhatsApp**"
- **Category labels**: Business Systems · Web · Mobile · Automation & AI · Digital Marketing · AI Training
- **Contact service options**: AI Training · Digital Marketing · Software · Other

### Home
**Hero**
- H1: "**Most teams buy the tool first.**" + accent "**We diagnose first.**"
- Sub: "**AI, marketing, software, automation — we only build what the diagnosis supports. We look before we touch, so what we build fits how your business actually runs.**"
- CTAs: "Book a strategy call" · "**See our work**"

**System map labels**: Business System (centre); AI Training, Digital Marketing, Software, Automation, CRM, Strategy (ring). Aria: "A connected business system: AI training, digital marketing, software, automation, CRM and strategy all connecting into one central system."

**Trust strip**
- Eyebrow: "**Trusted partners**"
- Headline: "**Trusted by brands across the US, the GCC & Egypt**"
- Stats: "**50+**" / "Projects delivered" · "**8**" / "Countries" · "**Full GCC coverage**" / "+ US & Egypt"
- Countries: "Egypt · Saudi Arabia · UAE · Qatar · Kuwait · Bahrain · Oman · United States"

**Value proposition**
- "**Most companies don't have a marketing problem.**" + accent "**They have a systems problem.**"
- "**Disconnected tools, manual handoffs, and no clear line of sight from a lead to a closed deal. We connect the whole chain — how you acquire customers, how you convert them, and how you operate once they're in — so the parts work as one system you can actually measure.**"

**Pillars** — heading "**Three capabilities. One transformation partner.**"
- "**AI training that turns tools into capability**" — "We run structured AI adoption programs for teams and leadership — from executive strategy sessions to hands-on workflow integration. The goal isn't awareness, it's operational capability: your people using AI on real work, not watching a demo."
- "**Marketing built as an acquisition system**" — "SEO, paid campaigns, and conversion strategy wired into one engine that targets qualified buyers — not vanity traffic. Every stage is tracked, so you know what a lead actually costs and where revenue comes from."
- "**Software that becomes your operational backbone**" — "The systems your business runs on — ERP and CRM platforms, customer-facing web, mobile apps, and the automation that connects them. Built to own, integrate, and scale, not to rent." — sub-capabilities: "Business Systems (ERP/CRM) · Web Platforms · Mobile Apps · Automation & AI"

**Transformation** — "**From scattered tools to one connected system**"
| Before | After |
|---|---|
| Tools that don't talk to each other | One integrated business system |
| Marketing disconnected from operations | Acquisition, conversion, and operations connected |
| Manual work slowing everything down | Automated workflows across the business |
| No clear view of what's actually working | Real-time visibility into performance |

**Proof** — "**Measured by outcomes, not deliverables**" / "Every engagement is tied to something your business can feel — revenue, efficiency, acquisition cost, scale. Here's the work behind that."

**Recent work** — "**Recent work**" / "A look at the systems we've built."

**How we work** — 01 **Diagnose** "We map your business model, systems, and the bottlenecks slowing growth." · 02 **Design** "We design the right mix of software, marketing, and automation for how you actually operate." · 03 **Build** "We develop and integrate the system, and hand you full ownership." · 04 **Optimize** "We keep improving it against real business data."

**Final CTA** — "**Ready to transform how your business runs?**" / "Book a strategy call. We'll look at your current systems and show you exactly what's blocking growth — even if you don't work with us." / button "Book your strategy call" / "No sales pitch. Just clarity."

### Services
- Eyebrow "What we do"; H1 "**Three capabilities.**" + "**One transformation partner.**"
- Sub: "**Marketing that fills the pipeline, software that runs the business, and AI your team actually uses.**"
- **AI Training** — "For teams using AI ad hoc — or not at all." / "We turn AI from scattered experiments into repeatable team capability." / steps: Assess · Locate · Train · Embed
- **Marketing** (local display label for the `digital-marketing` pillar) — "For pipelines running on referrals and word of mouth." / "We turn scattered campaigns into one acquisition system that brings in qualified buyers." / steps: Audit · Target · Launch · Measure
- **Software** — "For teams running the business on spreadsheets and disconnected tools." / "We turn manual workarounds into systems you own, integrate, and scale." / steps: Map · Design · Build · Integrate
- Panel CTAs: "Book a strategy call" · "Explore {pillar}"
- **Pain router** — "**Not sure which one fits?**" → "More qualified leads" · "Messy operations & tools" · "Team AI adoption" · "All of the above"

### ServiceDetail (three pillar pages, all from i18n)
Shared labels: "← All services", "See examples", "What's included", "How it works" / "No mystery. No endless meetings. Here's the process.", "Common questions", "Proven Results" / "See how we've helped companies like yours." / "View Full Portfolio", "Ready to get started?" / "Book a strategy call. We'll discuss your needs and tell you honestly if we're the right fit — no pressure, no sales pitch.", not-found "Service not found" / "View all services".

- **software** — "Software that becomes your operational backbone" / "ERP and CRM platforms, customer-facing web, mobile apps, and the automation that connects them — designed to own, integrate, and scale." / CTA "**Build your system**"
  - Features (with descriptions): Business Systems (ERP / CRM) · Web Platforms · Mobile Apps · Automation & AI
  - Process: Discovery · Proposal · Design · Build · Launch
  - FAQ: "Do we own the code?" → "Yes. Full source code and IP transfer on completion. No lock-in, no fees to access your own system." · "Can it integrate with our existing tools?" · "How long does a build take?" · "What if we already have a system?"
- **digital-marketing** — "Marketing built as an acquisition system" / CTA "**Scale your acquisition**"
  - Features (titles only, no descriptions): Paid campaigns (Google / Meta / LinkedIn) · Buyer-intent SEO · Conversion-rate optimization · Funnel strategy & tracking
  - Process: Audit · Strategy · Setup · Optimize
  - FAQ: "What's the minimum to make this work?" → "We're honest about fit — we're upfront about whether the budget justifies the work, and we'll tell you before you commit." · "How fast do results come?" · "Do you guarantee results?" → "We guarantee our work and our process, not market conditions."
- **ai-training** — "AI training that turns tools into capability" / CTA "**Start your AI program**"
  - Features (titles only): Executive AI strategy sessions · Department-level adoption programs · Hands-on workflow integration workshops · Implementation support
  - Process: Assess · Design · Train · Embed
  - FAQ: "Is this generic AI training?" → "No. Programs are built around your actual workflows and tools, not a stock curriculum." · "Who is it for?" · "What do we walk away with?"

> Note: the digital-marketing and ai-training feature lists intentionally ship **titles with empty descriptions** (`description: ''`); `ServiceDetail` guards on `feature.description` so nothing empty renders. Software is the only pillar with full feature prose.

### Portfolio / ProjectDetail
- "**Selected Work**" / "A curation of digital infrastructure and growth systems engineered for market leaders." / empty: "No projects found in this category."
- Deep-link banner: "Showing **{pillar}**" + "View all work"
- ProjectDetail: "Back to Portfolio", "Project not found", "Start a Project Like This", **"The Problem"**, **"The Diagnosis"**, **"The System"**, "Tech Stack", "Start Your Project"

### Contact
- "**Let's talk**" / "**Tell us about your business and what's slowing it down. We'll tell you honestly if we can help.**"
- Labels: Name · Email · Phone (optional) · Company (optional) · **What do you need?** · Message
- Placeholders: "Your name", "you@company.com", "+20 100 000 0000", "Your Company", "Select a service", "Tell us about your project goals..."
- Buttons: "Send message" / "Sending…"
- Sidebar "Contact details": Email `contact@omniflowai.net` · Phone "Available on request" · Response Time "Within 24 hours on business days"
- "**Quick Response Guarantee**" / "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please mention it in your message."
- Toasts: "Message sent — we'll get back to you within 24 hours." / "Something went wrong — please try again, or email us directly."

### Footer
- Tagline: "**We build the systems behind business growth.**"
- Services: AI Training · Digital Marketing · Software — Company: About · Work · Contact
- Newsletter: "**Practical notes on AI, marketing, and the systems that connect them — straight to your inbox.**" / placeholder "Enter your email" / toasts "Thanks — you're subscribed." / "Something went wrong, please try again."
- Location: "` Wilmington, DE, USA`" (⚠ leading space in the string)
- Copyright: "© {year} **Omniflowai LLC · Registered in Wyoming, USA**"

### About
- Badge "Who we are"; H1 "**Engineers who understand business.**"
- Sub: "**OmniflowAI is a digital transformation partner built around one belief: most companies don't need more tools — they need the right systems, built well and connected properly.**"
- Story: "**We started OmniflowAI to close a gap.**" + three paragraphs on fragmentation, building systems that fit how the business operates, and full ownership / no lock-in / no black boxes.
- Values: "Systems over services" · "You own it" · "Engineering-led" · "Measured by outcomes"
- CTA: "**Let's map your systems**" (body reuses the global brand line)

### 404 / meta
- "**Page not found**" / "The page you're looking for doesn't exist or has moved." / "Back to home"
- `<title>` and OG/Twitter: "**OmniflowAI — Your Digital Transformation Partner**"; description "OmniflowAI is your digital transformation partner — we build systems for growth across AI training, digital marketing, and business software." Favicon correctly declared `type="image/svg+xml"`.

---

## 8. Positioning & Messaging

- **Category**: digital transformation partner — not an agency, not a vendor.
- **Differentiator (BUILD_PLAN P1)**: **diagnosis before tooling.** "We look before we touch; we only build what the diagnosis supports." The hero leads with it and the process section (Diagnose → Design → Build → Optimize) reinforces it.
- **Master metaphor (P2)**: the connected system — hexagon, nodes, links, one orange. Expressed literally in the hero's `InteractiveSystemMap` and structurally in the before/after section.
- **Three settled pillars** (`shared/taxonomy.ts`): **AI Training · Digital Marketing · Software**. The old service names (Web Dev, AI Agents, Automation as a standalone service, Revenue Systems) are gone from the UI, and old URLs redirect into the pillars.
- **Six portfolio categories** roll up to those pillars: `business-systems`, `web`, `mobile`, `automation` → software; `digital-marketing` → digital-marketing; `ai-training` → ai-training.

### Claims currently on the site — and what backs them
| Claim | Source |
|---|---|
| "50+ projects delivered" | founder-provided, hardcoded in i18n |
| "8 countries" / "Full GCC coverage + US & Egypt" | founder-provided, hardcoded in i18n |
| 32 client logos in the marquee | real logo files in the repo |
| Per-project results on cards and detail pages | **CMS-entered only** — render nothing when absent |

**There are no fabricated numbers anywhere.** The previous version's testimonials (Ahmed Hassan / Sarah Johnson / Mohamed Ali), the Petra case-study banner, the "$150 cost/lead · 340 hrs saved · 6.8× ROI" dashboard, the "90-day results guarantee with full refund", and the "Trusted by 50+ / 21+" contradiction have **all been removed**. The Home proof and recent-work sections simply do not render when the database is empty — there are no placeholder project cards.

### ⚠ Remaining messaging inconsistency
The footer states a **Wilmington, Delaware** address alongside "**Registered in Wyoming, USA**". Two different US states in adjacent lines. One of them is presumably the registered agent and the other the mailing address, but as written it reads as a contradiction to a careful visitor. Worth a founder decision, not a code fix.

---

## 9. Portfolio / Case Studies / Services Content

### Where content lives
| Content | Source |
|---|---|
| All marketing copy (Home, Services, ServiceDetail, About, Portfolio chrome, Contact, Footer, 404) | **i18n dictionary** (`lib/i18n.tsx`), EN + AR |
| Portfolio projects | **Postgres**, via `/api/projects`, managed in `/admin/dashboard` |
| Per-project results / metrics | **Postgres** (`results: string[]`), CMS-entered |
| Client logos, team photo | static imports from `client/src/assets/` |

**No page hardcodes a display string.** The only English strings outside i18n are in the admin CMS, which is English-only by convention.

### Project schema (`shared/schema.ts`, table `projects`)
`id · title · client · category (Category enum from taxonomy) · description · challenge · diagnosis (nullable) · solution · results: string[] · technologies: string[] · tags: string[] (default []) · image (base64 data URI or URL) · isFeatured · isServiceShowcase`

- The narrative is explicitly **Problem → Diagnosis → System → Outcome**. `diagnosis` is nullable and renders only when present — never fabricated.
- `tags` is free-text per-project sub-categorisation (e.g. "ERP", "Lead Gen", "RAG chatbot"), not a fixed taxonomy.
- **The pillar is not stored.** It is always derived from `category` via `CATEGORY_TO_PILLAR`.
- `showOnServicePage` (from the old schema) is **gone** — ServiceDetail now derives its related projects from the category→pillar mapping instead of a flag.

### CMS behaviour (`server/storage.ts`)
- `isFeatured` → Home "Proof" section (sorted by `PROOF_ORDER`: business-systems → automation → digital-marketing → web → mobile → ai-training).
- Non-featured projects → Home "Recent work" carousel (max 6).
- `isServiceShowcase` → enforced **unique per category** by `ensureUniqueShowcase` on create and update. ⚠ **No page consumes it** — see §12.

### Actual case-study content in the repo
**None as data.** The repo ships with an empty `projects` table; every portfolio entry is created at runtime through the admin dashboard. Unlike the previous version, the site degrades cleanly to nothing rather than to placeholder cards.

---

## 10. Assets

### Present and used
- **Client logos** — `client/src/assets/clients/`, **34 files on disk, 32 imported** into the Home marquee:
  `Petra, Reliance Hub, Madrid, Ipec, electromeca, n2oosh, Dar-ELmaaly, elkhateer, Beit_el3tara, elmodhsh, Decork, Princess, naas, ta2deer, Gzour, mashareeb, Cutz, kayan, darat, rafeek, 5minutes, alforat, arcade, cleaning, elgabry, gewiss, imagehome, jotun, majarrah, oem, pioneer, thaki`
- **Team photo** — `client/src/assets/team_images/omniflowai-team.webp` (one group photo, used in the About story section). The four individual portraits from the previous version are gone, along with the team grid.
- **Favicon** — `client/public/favicon.svg`, correctly referenced as `type="image/svg+xml"` (the old wrong `image/png` MIME is fixed).
- **Icons** — all `lucide-react`.
- **`scripts/optimize-logos.mjs`** — a one-off utility for compressing the logo set.

### Present but NOT used
- `client/src/assets/clients/elmodhesh.png` — a near-duplicate of `elmodhsh.png`; only the latter is imported.
- `client/src/assets/clients/Plugin talents.png` — not imported (filename contains a space).
- `attached_assets/generated_images/` — 3 PNGs (`hero_workspace_collaboration_scene`, `ai_automation_visual_concept`, `website_dashboard_mockup_showcase`), **still referenced nowhere**.
- `attached_assets/Pasted-*.txt` — 4 raw prompt/code dumps (development scratch).

### Image handling
- Every DB-sourced image uses `loading="lazy" decoding="async"` plus `onError={onImageError}` → a **local inline-SVG "No image" fallback**. No external placeholder service, and the old `grainy-gradients.vercel.app/noise.svg` texture is gone — there are now **no external image requests** beyond Google Fonts.

---

## 11. Forms & Integrations

### Contact form → real lead capture
- **Client**: `Contact.tsx`, React Hook Form + `zodResolver(contactFormSchema)`. Fields: name, email, phone?, company?, service (enum = the three pillars + `other`), message. Default service is `PILLARS[2]` (`software`).
- **Server** (`POST /api/contact`): validates with Zod → `storage.createLead(...)` → **persists to the `leads` table** → `void notifyNewLead(lead)` (fire-and-forget) → `{ success: true }`.
- **Failure is honest**: if the insert throws, the endpoint returns **500** with `{ success: false }`. It never fakes success.
- **Email**: Resend, `from: "OmniflowAI Leads <onboarding@resend.dev>"`, `to: NOTIFY_EMAIL || CONTACT_EMAIL`. Skipped with a log line when `RESEND_API_KEY` is absent; a send failure is caught and logged, never surfaced to the user (the lead is already saved).

### Newsletter (footer) → also a lead
`POST /api/subscribe` validates an email with `newsletterSchema`, then `storage.createNewsletterLead(email)` inserts a `leads` row with `source: "newsletter"` and `name`/`service`/`message` left **null** (genuinely absent, not faked). Same fire-and-forget notification. Surfaces in `/admin/leads` with a distinct source badge.

> ⚠ **`CLAUDE.md` drift**: the project instructions mention a `subscribers` table and a `Subscriber` type. Neither exists in `shared/schema.ts` — newsletter signups live in `leads`. The instruction file should be corrected.

### Leads admin (`/admin/leads`)
`GET /api/leads` (newest first), `PATCH /api/leads/:id` (status ∈ `new | read | archived`, validated server-side), `DELETE /api/leads/:id`. All `isAuthenticated`.

### Project CRUD (`/api/projects`)
- Public: `GET /api/projects` (optional `?category=`), `GET /api/projects/showcase`, `GET /api/projects/:id`.
- Auth-required: `POST` (validated by `insertProjectSchema`), `PATCH`, `DELETE`.

### Image upload
`POST /api/objects/upload` — auth-required, multer memory storage, 5 MB server cap (client rejects >4 MB), accepts png/jpeg/jpg/webp → `sharp` → base64 WebP data URI → `{ url }` → saved into the DB text column.

### Auth & session
- `POST /api/login` (passport-local), `POST /api/logout`, `GET /api/user`.
- Passwords hashed with **scrypt** + random salt, compared with `timingSafeEqual`.
- An `admin` user is seeded on boot from `ADMIN_PASSWORD`; a warning is logged if the env var is unset and the built-in default is used.
- Session: `connect-pg-simple` over the Neon pool, `tableName: "session"`, secret from `SESSION_SECRET` (warned fallback), cookie `maxAge` 24 h, `httpOnly: true`, `sameSite: "lax"`, `secure` in production.
- The client `ProtectedRoute` is **UX only** — `isAuthenticated` on the server is the real boundary, and it covers every mutating project route plus all of `/api/leads`.

### Analytics
GA4 via `VITE_GA_MEASUREMENT_ID`; `initGA()` is wrapped in try/catch in `App.tsx` and `useAnalytics()` is wrapped again in `Router`. Absent env var → complete no-op. No other analytics or chat widgets; the "chat" is a WhatsApp deep link.

### Secrets
None committed. Only env-var names. The WhatsApp number `201119936014` and `CONTACT_EMAIL` are in source but are not secrets.

---

## 12. Punch List — Incomplete / Orphaned / Inconsistent

### Deliberately frozen (do not "fix" without being asked)
1. **`TODO(team-final)`** — the About team grid is not rendered and the founder/team attribution is frozen pending a dedicated content pass. Its i18n keys (`about.team.heading`, `about.team.sub`) exist but are unused in both languages.
2. **`TODO(email-final)`** — `CONTACT_EMAIL = "contact@omniflowai.net"` is a placeholder.
3. **`TODO(social-final)`** — `SOCIAL_LINKS` are all empty strings; the footer renders no social icons by design.
4. **`TODO(legal-final)`** — no `/privacy`, `/terms`, or `/sitemap` pages; the footer links were removed rather than left dead.
5. **`TODO(Layer3-proof)`** — the Home proof section reserves space for an aggregate stat strip, deliberately empty until real aggregate metrics exist.

### Orphaned code / content
6. **17 orphaned i18n keys** (× 2 languages = 34 strings), all leftovers from superseded layouts:
   - `home.trust` — the generic "Trusted by teams shaping the future." line, replaced by the concrete reach headline.
   - `services.learnMore`, `services.featuredProject`, `services.viewCaseStudy`, `services.together.{title,sub,capture.*,attract.*,automate.*}`, `services.cta.{title,body,button}` — from the old card-list Services page, replaced by the pillar tablist + pain router.
   - `about.team.heading`, `about.team.sub` — see item 1.
7. **`isServiceShowcase` is orphaned in the UI.** The CMS exposes the toggle, `storage.ensureUniqueShowcase` enforces one-per-category, and `GET /api/projects/showcase` exists — but **no client code calls that endpoint or reads the flag**. The Services page it was built for no longer renders project cards. Either wire it back in or retire it; right now admins can set a flag that changes nothing.
8. **`components/systems/`: `SystemMap`, `HexNode`, `FlowLine`, and `ProductFrame` are not on any page.** `SystemMap` and `ProductFrame` are exported with no consumer; `FlowLine` is reachable only through the unused `SystemMap`; **`HexNode` is imported by nothing at all** — both maps draw their hexagons directly via `hexPath` from `primitives.ts`, so the node component was superseded. This is a partially-built design-system module rather than accidental dead code, but it still ships in the bundle.
9. **Unused assets**: `attached_assets/generated_images/` (3 PNGs), `clients/elmodhesh.png` (duplicate), `clients/Plugin talents.png`.
10. **Unused dependencies**: `memorystore`, `date-fns`, `zod-validation-error`, `@jridgewell/trace-mapping` have no import anywhere. `@types/multer` sits in `dependencies` rather than `devDependencies`.

### Content / config inconsistencies
11. **Footer address vs. registration**: " Wilmington, DE, USA" alongside "Registered in Wyoming, USA" — two states, reads as a contradiction. Also note the **leading space** in the `footer.location` string.
12. **`--font-mono` is referenced but never defined.** `tailwind.config.ts` maps `mono: ["var(--font-mono)"]`; the variable exists in no stylesheet, so `font-mono` (used on the admin results/technologies textareas) resolves to the browser default.
13. **Design-token drift** — `ServiceDetail.tsx` and the three admin pages still use raw `orange-*` / `amber-*` utilities and `bg-[#0a0a0b]` instead of the `brand-*` / `bg-primary` / `bg-surface` tokens the config exposes. Several pages also keep decorative `from-orange-950/…` gradients. P5 ("single accent, one token set") is not yet fully enforced outside the swept pages.
14. **Residual physical-direction classes on public pages** (minor RTL drift): `ProjectDetail.tsx` uses `pl-6 border-l-2` for the three narrative blocks and `border-l … pl-4` for the client divider — in Arabic these sit on the wrong side. Also `Contact.tsx` submit arrow `ml-2`, the Home carousel item `pl-6`, the Portfolio hover badge `top-4 right-4`, and the WhatsApp float `right-8 / pr-2`. (Admin pages use physical classes too, but they are English-only by design.)
15. **`AdminNav` is duplicated** — defined as a component in `Leads.tsx` and inlined again in `Dashboard.tsx`.

### Config smells (state, not judgment)
16. `ADMIN_PASSWORD` and `SESSION_SECRET` both fall back to built-in defaults (`Admin@admin1234`, `omniflow-secret-key`) with a logged warning. Safe for local dev; **must** be set in production.
17. `server/app.ts`'s error handler re-`throw`s after responding, which will surface as an unhandled rejection in the request lifecycle.
18. `server/objectStorage.ts` keeps two no-op methods (`getObjectEntityFile`, `downloadObject`) "for compatibility with routes" — no route calls them.

### Verified working (previously broken)
- ✅ Contact form persists leads and returns a real error on failure.
- ✅ Footer newsletter submits to a real endpoint.
- ✅ ServiceDetail "Proven Results" renders correctly (it now uses the default JSON query fn instead of the raw-`Response` `apiRequest`).
- ✅ Sessions survive restarts (Postgres-backed).
- ✅ The 404 page shows translated user-facing copy, not developer text.
- ✅ No dead footer links, no dead social icons, no external placeholder image service.
- ✅ EN/AR dictionary parity: 296 = 296, verified programmatically.
- ✅ `npm run check` and `npm run build` are both green at `381fe70`.

---

## Completeness Summary

**Rough completeness: ~90% of a launch-ready bilingual marketing site + CMS.** Every functional gap from the previous audit has been closed: leads are captured, stored, and notified; the newsletter works; the site is genuinely bilingual with verified EN/AR key parity and real RTL handling; the positioning is consolidated into three pillars with a single source of truth; the design system has a named brand token set and a deliberate dark/light rhythm; performance was actively engineered (route splitting, lazy images, local SVG fallbacks, a trimmed font set, no external image hosts); and — notably — **every fabricated metric, testimonial, and guarantee has been removed** rather than replaced with better fiction.

What remains is mostly content and tidy-up, not engineering. The portfolio database ships empty, so the two DB-driven homepage sections and the whole `/portfolio` route render nothing until an admin populates them — that is the single biggest thing standing between the current build and a launch. Behind it: the frozen team/founder section, a placeholder contact email, no legal pages, an orphaned showcase flag, 17 stale i18n keys, and incomplete token migration on `ServiceDetail` and the admin pages. None of those block a launch; all of them are visible to someone looking closely.
