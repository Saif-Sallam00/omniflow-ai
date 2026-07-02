# OmniflowAI — Project State Audit

> Read-only snapshot of the codebase as it currently exists. Everything below is
> drawn from files actually opened. Where something is broken, placeholder, or
> orphaned, it is called out explicitly. User-facing copy is reproduced verbatim.

---

## 1. Tech Stack & Architecture

### Framework & language
- **Frontend**: React 18.3.1 (SPA) + TypeScript, built with **Vite 5.4.20**.
- **Routing**: `wouter` 3.3.5 (client-side, not React Router).
- **Backend**: **Express 4.21.2** (Node, ESM, run via `tsx` in dev, bundled with `esbuild` for prod).
- **Language**: TypeScript everywhere (`.ts` / `.tsx`), `strict: true`.
- `package.json` `name` is `"rest-express"`, `version` `1.0.0`, `license` MIT, `type: module`.

### Styling
- **Tailwind CSS 3.4.17** (config `tailwind.config.ts`) + PostCSS + Autoprefixer.
- **shadcn/ui** ("new-york" style, base color `neutral`, CSS variables on) — 47 UI primitives under `client/src/components/ui/`.
- Global CSS + design tokens in `client/src/index.css`.
- Plugins: `tailwindcss-animate`, `@tailwindcss/typography`. Also present in deps but unused config-wise: `tw-animate-css`, `@tailwindcss/vite` (v4 plugin, not wired — project uses Tailwind v3).

### Build & deployment
- **Build**: `vite build` (client → `dist/public`) **+** `esbuild server/index-prod.ts … → dist/index.js`.
- **Dev**: `NODE_ENV=development tsx server/index-dev.ts` — Express + Vite middleware, single port **5000**.
- **Start (prod)**: `NODE_ENV=production node dist/index.js` — serves static `dist/public`.
- **Deployment target**: **Replit** (`.replit` file). `deploymentTarget = "autoscale"`, external port 80 → local 5000. Modules `nodejs-20`, `web`, `postgresql-16`. **No Vercel/Netlify config present** (despite the prompt's example).
- Replit Vite plugins (dev-only, gated on `REPL_ID`): `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`, `@replit/vite-plugin-runtime-error-modal`.

### Backend / API / services
- **Express REST API** (see §11). Auth via `passport` + `passport-local`, sessions via `express-session` + `memorystore` (in-memory — **sessions do not survive restart**).
- **Database**: **Neon serverless Postgres** via `@neondatabase/serverless` + `drizzle-orm` (schema-first, `drizzle-kit push`). WebSocket driver `ws`.
- **File upload**: `multer` (memory storage, 5MB). Images are **NOT** stored on disk or a bucket — they are converted to **base64 `data:` URIs** and saved in a Postgres text column (`server/objectStorage.ts`).
- `@google-cloud/storage` is a dependency and `server/objectAcl.ts` references it, but the actual storage path (`objectStorage.ts`) explicitly **does not use cloud buckets** ("We are not using disk or cloud buckets anymore"). ACL code is effectively dead.
- **Analytics**: Google Analytics 4, injected client-side (`client/src/lib/analytics.ts`).

### Environment variables referenced (names only)
- `DATABASE_URL` — Neon/Postgres connection string (required; `db.ts`, `drizzle.config.ts`).
- `PORT` — server port, defaults to `5000`.
- `NODE_ENV` — dev/prod switch.
- `REPL_ID` — presence toggles Replit dev plugins (`vite.config.ts`).
- `VITE_GA_MEASUREMENT_ID` — GA4 measurement ID (`analytics.ts`, `env.d.ts`, `App.tsx`).
- `.env` exists and is git-ignored; local `.env` has empty `DATABASE_URL=` and `PORT=` (both blank).

---

## 2. Project Structure

```
omniflowai/
├── client/                         # Frontend (Vite root)
│   ├── index.html                  # HTML shell, fonts, meta tags
│   ├── public/
│   │   └── favicon.svg             # Orange hexagon logo mark
│   └── src/
│       ├── App.tsx                 # Router, providers, WhatsApp float button
│       ├── main.tsx                # React root + ErrorBoundary
│       ├── index.css               # Design tokens (CSS vars) + utilities
│       ├── env.d.ts                # Vite env typing
│       ├── assets/
│       │   ├── clients/            # 21 client logo PNGs
│       │   └── team_images/        # 4 team JPEGs
│       ├── components/
│       │   ├── Navigation.tsx
│       │   ├── Footer.tsx
│       │   ├── ROICalculator.tsx   # ⚠ NOT imported anywhere (dead)
│       │   ├── ObjectUploader.tsx
│       │   ├── ProtectedRoute.tsx
│       │   └── ui/                 # 47 shadcn/ui primitives
│       ├── hooks/
│       │   ├── use-analytics.tsx
│       │   ├── use-mobile.tsx
│       │   ├── use-toast.ts
│       │   └── use-user.ts
│       ├── lib/
│       │   ├── i18n.tsx            # EN/AR translations + RTL
│       │   ├── analytics.ts        # GA4
│       │   ├── queryClient.ts      # TanStack Query + apiRequest
│       │   └── utils.ts            # cn() helper
│       └── pages/
│           ├── Home.tsx
│           ├── About.tsx
│           ├── Services.tsx
│           ├── ServiceDetail.tsx
│           ├── Portfolio.tsx
│           ├── ProjectDetail.tsx
│           ├── Contact.tsx
│           ├── not-found.tsx
│           └── admin/
│               ├── Auth.tsx
│               ├── Dashboard.tsx
│               └── ProjectEditor.tsx   # ⚠ 0 bytes (empty)
├── server/                         # Express backend
│   ├── app.ts                      # Express app, JSON limits, request logger
│   ├── index-dev.ts                # Dev entry (Vite middleware)
│   ├── index-prod.ts               # Prod entry (static serve)
│   ├── routes.ts                   # All API routes + auth + seeding
│   ├── storage.ts                  # Drizzle data-access layer
│   ├── db.ts                       # Neon pool + drizzle instance
│   ├── objectStorage.ts            # base64 data-URI "storage"
│   └── objectAcl.ts                # GCS ACL helpers (⚠ dead code)
├── shared/
│   └── schema.ts                   # Drizzle tables + Zod schemas
├── attached_assets/                # ⚠ Scratch/AI-prompt dump, mostly unused
│   ├── generated_images/           # 3 PNGs, NOT referenced in code
│   └── Pasted-*.txt                # 4 raw prompt/code dumps
├── design_guidelines.md            # Design spec (aspirational, see §4/§12)
├── replit.md                       # Project notes (partly stale, see §12)
├── package.json / package-lock.json
├── tailwind.config.ts / postcss.config.js
├── tsconfig.json / vite.config.ts / drizzle.config.ts
├── components.json                 # shadcn config
├── .env / .env.example / .gitignore / .replit
```

Top-level folders / key files:
- **`client/`** — the entire React frontend; Vite `root` is set here.
- **`server/`** — Express API + dev/prod bootstrapping; two entry points (dev uses Vite middleware, prod serves the built bundle).
- **`shared/`** — a single `schema.ts` shared by client and server (Zod + Drizzle types), aliased `@shared`.
- **`attached_assets/`** — aliased `@assets` in Vite but only holds AI prompt text dumps and 3 unused generated images. Not part of the shipped app.
- **`design_guidelines.md`** / **`replit.md`** — documentation. Both describe an *intended* design that partially diverges from what is actually built.

---

## 3. Routing & Pages

Routing is defined in `client/src/App.tsx` with `wouter`. A `ScrollToTop` resets scroll on navigation; a global `Navigation` (top) and `Footer` (bottom) wrap every route; a fixed **WhatsApp button** (`https://wa.me/201092849400`) floats bottom-right on all pages.

| Route | Component | Access | Notes |
|---|---|---|---|
| `/` | `Home` | Public | |
| `/about` | `About` | Public | |
| `/services` | `Services` | Public | |
| `/services/:slug` | `ServiceDetail` | Public | slugs: `website-development`, `digital-marketing`, `automation`, `ai-agents` |
| `/portfolio` | `Portfolio` | Public | dynamic from DB |
| `/portfolio/:id` | `ProjectDetail` | Public | dynamic from DB |
| `/contact` | `Contact` | Public | |
| `/admin/auth` | `AuthPage` | Public (login) | |
| `/admin/dashboard` | `Dashboard` | **Protected** (`ProtectedRoute`) | redirects to `/admin/auth` if not logged in |
| (any other) | `NotFound` | Public | 404 |

**Dead footer links** point to routes that do not exist and will hit the 404 page: `/privacy`, `/terms`, `/sitemap` (see §12).

### Section order per page

**Home (`Home.tsx`)** — 8 sections:
1. Hero (badge, headline, subhead, trust stat grid, 2 CTAs, "Results Dashboard" card)
2. Trusted By — infinite CSS marquee of 21 client logos
3. How it works — 3-step grid
4. Featured Case Study (Petra Engineering banner)
5. Testimonials — 3 cards (desktop grid / mobile carousel)
6. Featured Work / "Recent work" — carousel of projects (DB or fallback)
7. Guarantee — 90-day results guarantee bar
8. Final CTA — "Ready to scale?"

**About (`About.tsx`)** — 5 sections: Hero ("Our DNA") → Founder story → Team grid (3 cards) → Values (4 cards) → CTA.

**Services (`Services.tsx`)** — Hero → Services list (3 services, each optionally with a showcase project) → "Better together" 3-step → CTA.

**ServiceDetail (`ServiceDetail.tsx`)** — Hero → Related Projects (⚠ never renders, see §12) → Features grid → Process steps → FAQ → CTA.

**Portfolio (`Portfolio.tsx`)** — Header → Filter tabs (All/Build/Attract/Automate) → Gallery grid (or empty-state / skeleton).

**ProjectDetail (`ProjectDetail.tsx`)** — Hero header (category, client, title, description, stat tiles) → Main visual image → Challenge/Solution + Tech Stack sidebar CTA.

**Contact (`Contact.tsx`)** — single section: heading + form (left, 2/3) + info sidebar (right, 1/3).

**Admin/Auth** — centered login card. **Admin/Dashboard** — portfolio CMS (project cards, create/edit dialog, delete confirm).

---

## 4. Design System

### Theme model
- The app renders **dark by default via hardcoded slate classes** (e.g. `bg-slate-950`, `text-white`) on nearly every page — NOT via the `.dark` class. `App.tsx` wraps everything in `<div className="... bg-slate-950">`.
- `index.css` **does** define a full light/dark shadcn token set (`:root` = light, `.dark` = dark), and `tailwind.config.ts` sets `darkMode: ["class"]` — but the `.dark` class is never toggled anywhere. So the shadcn tokens are mostly bypassed for the marketing pages; they only matter for shadcn primitives (buttons, dialogs, etc.).
- Net effect: **the public site is effectively a fixed dark theme**; the **admin dashboard is light** (`bg-slate-50`, white header). No user-facing theme switch. `next-themes` is a dependency but unused.

### Color tokens (from `index.css` `:root`, HSL)
"Growth Engine" custom vars:
- `--gunmetal: 222 47% 11%` (premium tech dark)
- `--midnight: 222 47% 7%`
- `--gold: 38 92% 50%` / `--gold-hover: 38 92% 45%` (Electric Gold accent)

Core shadcn (light `:root`):
- `--background: 0 0% 100%`, `--foreground: 222 47% 11%`
- `--primary: 38 92% 50%` (gold), `--primary-foreground: 222 47% 11%`
- `--secondary: 210 40% 96.1%`, `--muted: 210 40% 96.1%`, `--muted-foreground: 215.4 16.3% 46.9%`
- `--accent: 222 47% 11%`, `--destructive: 0 84.2% 60.2%`
- `--border / --input: 214.3 31.8% 91.4%`, `--ring: 38 92% 50%`, `--radius: 0.5rem`
- Charts: `--chart-1: 38 92% 50%`, `--chart-2: 173 58% 39%`, `--chart-3: 222 47% 11%`, `--chart-4: 43 74% 66%`, `--chart-5: 27 87% 67%`
- Elevation: `--elevate-1: rgba(0,0,0,.03)`, `--elevate-2: rgba(0,0,0,.08)` (light); `.dark` uses `rgba(255,255,255,.04/.09)`.

`.dark` overrides: `--background: 222 47% 11%`, `--foreground: 210 40% 98%`, `--card: 217 33% 17%`, `--primary: 210 40% 98%`, etc.

**Actual brand color in practice (Tailwind utility classes, not the tokens):**
- **Orange** is the real accent on the public site: `orange-400/500/600`, gradients `from-orange-500 to-red-600`, `text-orange-400`. (The gold `--primary` token and orange utilities are two different oranges used in parallel.)
- **Amber** is the accent on Footer + Admin (`amber-500/600`).
- Grayscale base: `slate-950 / 900 / 800 / 700 / 500 / 400 / 300`.
- Status colors: `emerald-400/500` (positive), `blue-400/500/600` (info/ROI), `green-500` (WhatsApp `#25D366`), `red-500`.
- Hardcoded hexes: WhatsApp `#25D366`; ServiceDetail page bg `#0a0a0b`; ROICalculator `#0F172A` bg and chart colors `#94a3b8`, `#2563eb`, grid `#1e293b`, tooltip `#1e293b`/`#334155`; favicon stroke `#f97316`.
- Hero/marquee noise texture pulled from external URL `https://grainy-gradients.vercel.app/noise.svg`.

⚠ Inconsistency: the documented palette (gunmetal + electric gold) and the shipped palette (slate + orange/amber, two accent hues) don't fully match. Footer uses amber; the rest of the site uses orange.

### Typography
- Loaded in `client/index.html` via Google Fonts: **Inter** (300–700), **Space Grotesk** (400/500/700), **Playfair Display** (400/600/700 + italic).
- `--font-sans: 'Inter'`, `--font-display: 'Space Grotesk'`, `--font-serif: 'Playfair Display'`.
- Tailwind `fontFamily`: `sans → Inter`, `display → Space Grotesk`, `serif → Playfair`, `mono → var(--font-mono)` (⚠ `--font-mono` is never defined).
- `font-display` used for headings on About/Portfolio/Contact/Admin. `font-serif` (Playfair) is loaded but **barely/never used** on visible pages.
- Heading scale in practice: hero `text-4xl → lg:text-7xl font-black`; section headings `text-3xl md:text-4xl font-bold`; body `text-lg/xl text-slate-400`.

### Spacing / radius / shadow conventions
- Section padding: `py-20 md:py-24` (commonly), up to `py-24 md:py-32` on CTAs.
- Container: `max-w-7xl` (or `max-w-6xl`/`max-w-4xl`/`max-w-3xl`) `mx-auto px-6 md:px-8`.
- Radius: heavy use of `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-full` (pills/buttons). Token `--radius: 0.5rem` drives shadcn `lg/md/sm`.
- Shadows: `shadow-lg`, `shadow-2xl`, glow blurs (`blur-lg`, `blur-[100px]`, `blur-3xl`), colored ring shadows on buttons.
- Custom `hover-elevate` / `active-elevate` utilities defined in `index.css` (pseudo-element overlays using `--elevate-1/2`).

### Theme/token files
- `client/src/index.css` — reproduced fully in §4 token list above.
- `tailwind.config.ts` — animations `float` (6s), `scroll` (40s, logo ticker), `accordion-down/up`. ⚠ Note: the Home marquee actually uses an **inline `@keyframes marquee` (10s)** injected via a `<style>` tag, **not** the config's `scroll` animation.

---

## 5. Components Inventory

### App-specific components

| Component | Path | Key props | Used by |
|---|---|---|---|
| `Navigation` | `components/Navigation.tsx` | none | `App.tsx` (global) |
| `Footer` | `components/Footer.tsx` | none | `App.tsx` (global). Internal helpers `FooterLink`, `SocialIcon` |
| `ROICalculator` | `components/ROICalculator.tsx` | none | **⚠ Not imported anywhere — dead component** |
| `ObjectUploader` | `components/ObjectUploader.tsx` | `currentImage?: string`, `onUploadComplete: (url)=>void` | admin `Dashboard.tsx` |
| `ProtectedRoute` | `components/ProtectedRoute.tsx` | `component`, `path` | `App.tsx` (admin dashboard) |
| `TeamCard` (local) | inside `About.tsx` | `image, name, role, bio` | About |
| `ValueCard` (local) | inside `About.tsx` | `icon, title, desc` | About |
| `ResultsDashboard` (local) | inside `Home.tsx` | none | Home hero |
| `FeaturedCaseStudy` (local) | inside `Home.tsx` | none | Home |
| `TestimonialCard` (local) | inside `Home.tsx` | `testimonial` | Home |
| `PortfolioSkeleton` (local) | inside `Portfolio.tsx` | none | Portfolio loading |
| `ProjectSkeleton` (local) | inside `ProjectDetail.tsx` | none | ProjectDetail loading |

### Hooks & libs
- `hooks/use-user.ts` — `useUser()`: `{ user, isLoading, error, login, logout }` via TanStack Query on `/api/user`.
- `hooks/use-analytics.tsx` — fires `trackPageView` on route change.
- `hooks/use-toast.ts`, `hooks/use-mobile.tsx` — standard shadcn helpers.
- `lib/i18n.tsx` — `I18nProvider`, `useI18n()` → `{ language, setLanguage, t, isRTL }`.
- `lib/queryClient.ts` — `queryClient`, `apiRequest(method,url,data)` (**returns a raw `Response`**, not parsed JSON — relevant bug in §12), `getQueryFn`.
- `lib/analytics.ts` — `initGA`, `trackPageView`, `trackEvent`.
- `lib/utils.ts` — `cn()` (clsx + tailwind-merge).

### Component library — shadcn/ui (47 primitives in `components/ui/`)
`accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input-otp, input, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, switch, table, tabs, textarea, toaster, toast, toggle-group, toggle, tooltip.`
Many are installed by default and unused by the actual pages (e.g. `calendar`, `command`, `menubar`, `sidebar`, `input-otp`, `breadcrumb`, `pagination`, `resizable`, `context-menu`, `drawer`). Actually used: button, card, badge, input, textarea, select, form, dialog, alert-dialog, switch, tabs, carousel, separator, skeleton, slider, tooltip, toaster/toast.

---

## 6. UI/UX & Interaction

### Layout patterns
- **Nav**: fixed top, transparent → `bg-slate-950/90 backdrop-blur-md` after 20px scroll. Logo left (hexagon + "mniflow" + "AI"), centered links (desktop), globe language toggle + orange pill CTA right. Mobile: hamburger → full-screen slide-down menu.
- **Hero (Home)**: two-column grid (text left, animated "Results Dashboard" card right), min-height `90vh`, noise-texture overlay.
- **Footer**: responsive multi-column (3-col mobile / 2-col tablet / 4-col desktop) with brand blurb, Services, Company, newsletter + contact, bottom bar. Amber accent, background glow blobs.
- **Grids**: heavy `grid-cols-1 md:grid-cols-2/3/4`. Cards use `bg-slate-900/40 border border-slate-800/50` glass style.

### Animations / transitions
- **`framer-motion` 11.13.1 is installed but NOT used** anywhere in the pages (no `motion.` usage found). All motion is CSS.
- CSS: infinite **marquee** (inline keyframes, 10s) for client logos; `animate-pulse`, `animate-ping` (WhatsApp), `animate-spin` (loaders); hover `scale-105/110`, `translate-y`, `grayscale→color`, opacity transitions; `backdrop-blur`.
- Tailwind config animations `float`/`scroll`/`accordion-*` (accordion used by shadcn; `float`/`scroll` largely unused — marquee uses its own inline anim).
- `embla-carousel-react` powers testimonials (mobile) and Recent Work carousels.
- Number "animation" in ROICalculator via `setTimeout` (dead component).

### Responsiveness
- Breakpoints handled throughout: `sm`, `md`, `lg` (Tailwind defaults). Mobile-first with explicit mobile variants (e.g. testimonials switch grid↔carousel at `md`).
- `replit.md` notes flex-wrap and responsive fixes applied Jan 2026.
- The **admin Dashboard** is responsive-ish but is a desktop-oriented CMS; the create/edit **Dialog** is `max-w-4xl max-h-[90vh] overflow-y-auto`.
- No page is fully non-responsive, but the **NotFound** page is a light-theme card (visually inconsistent with the dark site).

### Interactive elements
- **Forms**: Contact form (RHF + Zod), Admin login, Admin project create/edit. Newsletter input in footer (**non-functional — no handler**).
- **Modals**: Admin create/edit `Dialog`, delete `AlertDialog`.
- **Carousels**: testimonials (mobile) + Recent Work (Home).
- **Filters**: Portfolio category tabs (All/Build/Attract/Automate).
- **Sliders**: ROICalculator (3 sliders) — dead component.
- **Language toggle**: globe icon in nav (EN↔AR) — see §12 for how limited its effect is.

---

## 7. Copywriting (VERBATIM)

> Reproduced exactly as written in the source. Most page copy is **hardcoded English** in the page components (NOT pulled from the i18n dictionary — see §8/§12).

### Global — Navigation (`Navigation.tsx`)
- Logo (assembled): "**mniflow**" + "**AI**" (with a hexagon icon standing in for the leading "O").
- Nav links (EN): "Home", "Services", "Portfolio", "About", "Contact" (via i18n keys `nav.*`).
- Desktop CTA button: value of `hero.cta.secondary` → EN "**Start Consultation**" (fallback text in code: "Let's Talk").
- Mobile language button: "**العربية**" / "**English**". Mobile CTA: "**Let's Talk**".

### Global — Footer (`Footer.tsx`) — fully hardcoded English
- Brand: "**OmniflowAI**"
- Blurb: "**We build digital ecosystems that scale. Bridging the gap between premium design and intelligent automation.**"
- Column "Services": "**Web Dev**", "**Automation**", "**AI Agents**", "**Marketing**" (all link to `/services`)
- Column "Company": "**About**", "**Work**", "**Contact**", "**Privacy**"
- Column heading: "**Stay Connected**" (desktop) / "**Connect**" (mobile)
- Newsletter: "**Get the latest trends in AI and Web Dev delivered to your inbox.**", input placeholder "**Enter your email**"
- Contact: "**hello@omniflow.ai**", "**Cairo, Egypt**"
- Bottom bar: "**© {currentYear} OmniflowAI Agency. All rights reserved.**"
- Bottom links: "**Privacy**", "**Terms**", "**Sitemap**"

### Global — WhatsApp button (`App.tsx`)
- "**Chat on WhatsApp**" (links to `https://wa.me/201092849400`)

### Home (`Home.tsx`)

**Hero**
- Badge: "**Trusted by 50+ Businesses**"
- Headline: "**We build the systems that grow your business**" ("grow your business" gradient)
- Subhead: "**Websites that convert. Marketing that targets the right buyers. Automation that saves your team hundreds of hours. All engineered to pay for itself.**"
- Trust grid: "**340h**" / "**Saved/Mo**"; "**60%**" / "**Less CAC**"; "**100%**" / "**Ownership**"
- CTAs: "**Book a Free Strategy Call**", "**View Results**"

**Results Dashboard card**
- "**CLIENT RESULTS**"; "**Cost/Lead**" "**$150**" "**62% ↓**"; "**Time Saved**" "**340hrs**" "**≈ 2 FTEs**"; "**Avg. Client ROI**" "**6.8×**" "**within 12 months**"

**Trusted By**
- "**Trusted by 21+ teams**" (rendered as `Trusted by {allClients.length}+ teams`)

**How it works**
- Heading: "**How it works**"
- Sub: "**No 47-slide proposals. No months of "discovery." We move fast because your business can't wait.**"
- Step 01 "**Strategy call**": "**30 minutes. We learn your business, identify the bottlenecks, and tell you honestly if we can help.**" — note "**Free, no pitch**"
- Step 02 "**Clear proposal**": "**Within 48 hours, you get a specific scope, timeline, and fixed price. No surprises later.**" — note "**Fixed pricing**"
- Step 03 "**We build, you grow**": "**Regular updates, fast iterations, and a system that starts delivering results within weeks—not months.**" — note "**90-day results guarantee**"

**Featured Case Study**
- Badge: "**Success Story**"
- Headline: "**How Petra Engineering Cut Proposal Time by 40%**"
- Sub: "**From manual spreadsheets to automated quoting system that generates proposals in minutes.**"
- Stats: "**40%**" / "**Faster**"; "**2×**" / "**Wins**"; "**90**" / "**Days ROI**"
- CTA: "**Read Full Case Study**"
- Card: "**Petra Engineering**" / "**Construction**"
- Quote: "**"Omniflow engineered a competitive advantage. Our close rate jumped from 23% to 41%."**"

**Testimonials**
- Heading: "**What clients actually say**"
- Sub: "**Not marketing fluff. Real feedback from real projects.**"
- T1: "**"Omniflow transformed our digital presence. Our close rate jumped from 23% to 41% in just 3 months."**" — **Ahmed Hassan**, CEO, Petra Engineering — "**Increased conversion by 78%**"
- T2: "**"The automation system they built saved us over 300 hours per month in manual data entry."**" — **Sarah Johnson**, Operations Director, Reliance Hub — "**Saved 340+ hours monthly**"
- T3: "**"Their B2B marketing strategy brought in qualified leads we never thought possible in our niche."**" — **Mohamed Ali**, Marketing Head, Madrid Contracting — "**Reduced CAC by 60%**"

**Featured Work**
- Heading: "**Recent work**" / Sub: "**Projects that delivered measurable results**" / Link: "**View all projects**"
- Fallback projects (if DB empty): "**Petra Engineering Website**" / Web Development; "**Reliance Hub Automation**" / Business Automation; "**Madrid Marketing Campaign**" / Digital Marketing

**Guarantee**
- "**90-day results guarantee**"
- "**If we don't hit our agreed targets, you get a full refund. Simple as that.**"
- Button: "**Let's talk**"

**Final CTA**
- "**Ready to scale?**"
- "**Book a free 30-minute call. We'll look at your current setup, identify the biggest opportunities, and tell you exactly what we'd do—even if you don't hire us.**"
- Button: "**Book your free strategy call**"
- "**No pitch. No pressure. Just honest advice.**"

### About (`About.tsx`) — hardcoded English
- Badge: "**Our DNA**"
- Headline: "**We are engineers who speak Business.**"
- Sub: "**OmniflowAI wasn't founded by salespeople. It was founded by senior developers tired of seeing businesses overpay for "pretty" websites that break under pressure.**"
- Founder heading: "**"I built this to fix the agency model."**"
- Para 1: "**For 20 years, I worked in enterprise software. I saw a massive gap: Small and mid-sized businesses were getting trapped. Agencies would sell them a "custom site" that was really just a cheap template, or worse, hold their code hostage with monthly fees.**"
- Para 2: "**I started OmniflowAI with one rule: Transparency.**"
- Para 3: "**We don't hide behind jargon. We build robust, scalable systems using the same technology used by tech giants—and then we hand you the keys. No lock-in. No secrets. Just engineering excellence that drives your bottom line.**"
- Founder: "**Mosatafa Hekal**" (⚠ likely typo for "Mostafa"), "**Founder & Technical Lead**"
- Team heading: "**Meet the Builders**" / Sub: "**No outsourcing. No juniors learning on your dime. Just senior talent dedicated to your growth.**"
- Team: "**Roaa Mohamed**" — Head of Design — "**Ex-Shopify designer obsessed with conversion rates and user psychology.**"
- "**Saif Sallam**" — Lead Systems Architect — "**Specialist in ERPNext and high-scale database automation.**"
- "**Faris Sallam**" — Growth Strategist — "**Direct-response marketer who turns traffic into qualified B2B leads.**"
- Values: "**Code Ownership**" — "**You pay for it, you own it. We transfer full IP and source code upon completion.**"; "**Revenue First**" — "**We don't care about 'likes.' We care about leads, sales, and automation ROI.**"; "**Direct Access**" — "**You talk to the engineers building your product, not an account manager.**"; "**Zero Bloat**" — "**We use lean, modern tech stacks. No heavy plugins. No slow loading times.**"
- CTA: "**Ready to work with adults?**" / "**Stop gambling on freelancers and templates. Partner with a team that builds assets, not liabilities.**" / Button "**Book a Strategy Call**"

### Services (`Services.tsx`) — hardcoded English
- Eyebrow: "**What we do**"
- Headline: "**Three services. One goal.**"
- Sub: "**We don't sell hours. We build systems that generate revenue, cut costs, and scale.**"
- **Web Development** — tagline "**Your website should close deals, not just look pretty.**" — "**We build custom platforms that convert visitors into customers. Fast, mobile-first, and integrated with your existing tools. You own every line of code.**" — features: "Custom development (React, Next.js)", "CRM & ERP integrations", "Conversion-optimized design", "Full code ownership"
- **Digital Marketing** — tagline "**Stop paying for traffic that doesn't convert.**" — "**We run campaigns that target decision-makers in your industry. SEO that ranks for buyer-intent keywords. Ads that pay for themselves.**" — features: "B2B-focused paid campaigns", "Technical SEO & content", "Conversion tracking", "Monthly performance reports"
- **AI & Automation** — tagline "**Your team is too expensive for repetitive tasks.**" — "**We build intelligent workflows that handle the boring stuff. Your team focuses on closing deals while the system runs 24/7.**" — features: "Custom workflow automation", "AI chatbots for qualification", "CRM & tool integrations", "WhatsApp/SMS automation"
- Each: "**Learn more**"; showcase card labels: "**Featured Project**", "**View Case Study**"
- "Better together" heading: "**Better together**" / Sub: "**Each service works on its own. But when combined, they create a system that compounds—your website feeds your marketing, your marketing feeds your automation, and everything syncs.**"
- Steps: "**01 Capture**" — "**Your website captures leads and collects the data you need to qualify them.**"; "**02 Attract**" — "**Marketing drives the right people to your site—decision-makers, not tire-kickers.**"; "**03 Automate**" — "**Automation qualifies leads, books meetings, and syncs everything to your CRM.**"
- CTA: "**Not sure what you need?**" / "**Book a free call. We'll look at your current setup and tell you exactly what would move the needle—even if it's not something we do.**" / Button "**Book a free strategy call**"

### ServiceDetail (`ServiceDetail.tsx`) — hardcoded data object, 4 slugs
Common labels: back "**← All services**"; CTAs "**Get started**", "**See examples**"; sections "**What's included**", "**How it works**" ("**No mystery. No endless meetings. Here's the process.**"), "**Common questions**"; bottom CTA "**Ready to get started?**" / "**Book a free call. We'll discuss your needs and tell you honestly if we're the right fit—no pressure, no sales pitch.**" / "**Book a free strategy call**". "Not found" fallback: "**Service not found**" / "**View all services**". Related-projects section (never shows): "**Proven Results**" / "**See how we've helped companies like yours.**" / "**View Full Portfolio**".

- **website-development** — "**Web Development**" — "**Your website should close deals, not just exist.**" — desc: "**We build custom platforms that convert visitors into customers. Not templates. Not WordPress themes. Real software that integrates with your tools, captures the data you need, and scales with your business.**"
  - Features: "Custom development" / "React, Next.js, or the right tool for the job. Built for performance and maintainability."; "Full code ownership" / "You own everything. No proprietary lock-in, no monthly fees to access your own site."; "CRM & tool integrations" / "Connected to your existing systems from day one. HubSpot, Salesforce, custom ERPs—we handle it."; "Conversion-focused design" / "Every page built to move visitors toward a specific action. Not just "looking good.""; "Mobile-first approach" / "Designed for phones first, because that's where your visitors are."; "Performance optimized" / "Fast load times, clean code, and built for SEO from the ground up."
  - Process: Discovery / "We learn your business, goals, and technical requirements. 1-2 calls."; Proposal / "Clear scope, timeline, and fixed price within 48 hours."; Design / "Wireframes and visual design. You approve before we build."; Development / "We build, you review weekly. No surprises."; Launch / "Tested, optimized, and live. Training included."
  - FAQ: "How long does a typical project take?" / "6-12 weeks depending on scope. We'll give you a specific timeline in the proposal."; "Do you do maintenance?" / "Yes, we offer optional maintenance packages. But you're never locked in—you can maintain it yourself or hire anyone."; "What if I already have a website?" / "We can rebuild from scratch or improve what you have. Depends on what makes sense for your situation."
- **digital-marketing** — "**Digital Marketing**" — "**Stop paying for traffic that doesn't convert.**" — desc: "**We run campaigns that target decision-makers in your industry—not random clicks. SEO that ranks for buyer-intent keywords. Ads that pay for themselves. Everything tracked, measured, and optimized.**"
  - Features: "B2B-focused campaigns" / "We target the people who actually make buying decisions. Job titles, company size, intent signals."; "Technical SEO" / "Site structure, page speed, schema markup—the foundation that makes content rank."; "Content that converts" / "Not blog posts for the sake of it. Content designed to capture search traffic that converts."; "Conversion tracking" / "You'll know exactly which channels and campaigns drive actual revenue, not just clicks."; "Landing page optimization" / "A/B testing and continuous improvement. Small changes, big impact."; "Monthly reporting" / "Clear reports on what's working, what's not, and what we're doing about it."
  - Process: Audit / "We analyze your current marketing, competitors, and opportunities."; Strategy / "A clear plan with channels, budgets, and expected outcomes."; Setup / "Tracking, campaigns, and content created and launched."; Optimize / "Continuous testing and improvement based on real data."
  - FAQ: "What's the minimum budget?" / "We typically work with clients spending $3k+/month on ads. Below that, the math rarely works."; "How long until we see results?" / "Paid: 2-4 weeks. SEO: 3-6 months for meaningful traffic. We'll set realistic expectations upfront."; "Do you guarantee results?" / "We guarantee our work, not market conditions. If we miss agreed targets in 90 days, we make it right."
- **automation** — "**AI & Automation**" — "**Your team is too expensive for repetitive tasks.**" — desc: "**We build intelligent workflows that handle the boring stuff—lead qualification, appointment booking, data entry, follow-ups. Custom AI agents that work 24/7. Your team focuses on closing deals while the system runs.**"
  - Features: "Workflow automation" / "n8n, Make, Zapier—whatever fits. Automated processes that connect all your tools."; "AI chatbots" / "Qualify leads, answer FAQs, and book meetings automatically. WhatsApp, web, or wherever."; "CRM automation" / "Leads automatically scored, tagged, and routed to the right person."; "Email & SMS sequences" / "Automated follow-ups that feel personal. Triggered by behavior, not just time."; "Data sync" / "No more manual copying between systems. Everything connected and up to date."; "Custom AI agents" / "Trained on your data. Handles your specific use cases, not generic responses."
  - Process: Map / "We document your current workflows and identify automation opportunities."; Prioritize / "Focus on highest-impact automations first. Quick wins that prove value."; Build / "We develop and test the automation. You review and approve."; Train / "Your team learns how it works. Documentation included."
  - FAQ: "Will this replace my team?" / "No. It handles the tasks they shouldn't be doing manually, so they can focus on higher-value work."; "What if something breaks?" / "We include monitoring and alerts. You'll know before your customers do. Support packages available."; "How do you price this?" / "Project-based for builds, optional retainer for ongoing support. No surprises."
- **ai-agents** — "**AI Agents**" — "**Intelligent automation that works 24/7.**" — desc: "**Custom AI agents trained on your data. Handle customer inquiries, qualify leads, and automate repetitive tasks around the clock.**"
  - Features: "24/7 availability" / "Your AI agent never sleeps, never takes breaks, never has a bad day."; "Trained on your data" / "Not generic responses. Answers based on your products, services, and processes."; "Multi-channel" / "WhatsApp, web chat, email—wherever your customers are."; "Seamless handoff" / "Complex issues get routed to humans with full context. No starting over."; "Continuous learning" / "Gets smarter over time based on real interactions."; "Analytics dashboard" / "See what people ask, how the bot performs, and where to improve."
  - Process: Scope / "Define what the agent should handle and what it shouldn't."; Train / "Feed it your knowledge base, FAQs, and example conversations."; Test / "Internal testing before any customer sees it."; Launch / "Gradual rollout with monitoring and refinement."
  - FAQ: "How accurate is it?" / "Depends on training quality. We aim for 90%+ first-response accuracy."; "What about edge cases?" / "Graceful handoff to humans. The bot knows what it doesn't know."; "Can it integrate with our CRM?" / "Yes. HubSpot, Salesforce, Pipedrive, or custom systems."
  - ⚠ Note: `/services/ai-agents` slug exists in ServiceDetail data but is **not linked** from the Services list page (which only lists website-development, digital-marketing, automation). Reachable only by direct URL.

### Portfolio (`Portfolio.tsx`)
- Heading: "**Selected Work**"
- Sub: "**A curation of digital infrastructure and growth systems engineered for market leaders.**"
- Filter tabs (capitalized): "all", "build", "attract", "automate"
- Empty state: "**No projects found in this category.**"
- (Project cards render `title`, `category`, `client` from DB.)

### ProjectDetail (`ProjectDetail.tsx`)
- Back: "**Back to Portfolio**"
- Error: "**Project not found**"
- Mobile CTA: "**Start a Project Like This**"
- Sections: "**The Challenge**", "**The Solution**", sidebar "**Tech Stack**", CTA "**Start Your Project**"
- (title/description/challenge/solution/results/technologies from DB.)

### Contact (`Contact.tsx`)
- Heading: "**Contact Us**" (rendered via `t("Contact Us")` → key missing → literal fallback)
- Sub: "**Tell us about your project. We'll tell you if we can help.**"
- Labels: "**Name**", "**Email**", "**Phone** (Optional)", "**Company** (Optional)", "**Service**", "**Message**"
- Placeholders: "**Ahmed Hassan**", "**ahmed@example.com**", "**+20 100 000 0000**", "**Your Company**", "**Select a service**", "**Tell us about your project goals...**"
- Service options: "**Website Development**", "**AI Agents**", "**Business Automation**", "**Digital Marketing**", "**Other**"
- Submit: "**Submit**" / "**Submitting**" (via missing i18n keys → literal)
- Sidebar "**Info**": Email "**contact@omniflowai.agency**"; Phone "**Available upon request**"; Response Time → **"contact.info.hours"** (⚠ missing key renders literally)
- "**Quick Response Guarantee**": "**We typically respond to all inquiries within 24 hours during business days. For urgent matters, please mention it in your message.**"
- Success toast: title = **"contact.success"** (⚠ literal key), desc "**We will get back to you within 24 hours.**"
- Error toast: title = **"contact.error"** (⚠ literal key), desc "**Please try again or email us directly.**"

### Admin — Auth (`admin/Auth.tsx`)
- Brand: "**OmniflowCMS**" / "**Content Management System**"
- "**Welcome Back**" / "**Sign in to access your dashboard**"
- Labels: "**Username**" (ph "Enter your username"), "**Password**" (ph "Enter your password")
- Button: "**Sign In**"; footer "**Protected area. Authorized personnel only.**"

### Admin — Dashboard (`admin/Dashboard.tsx`)
- Header brand "**OmniflowCMS**"; "**Logout**"; "**Portfolio**"; "**Add Project**"
- Dialog title: "**Create New Project**" / "**Edit Project**"
- Visibility toggles: "**Featured**" ("Show on Home Page "Recent Work""), "**Showcase**" ("The main hero project on Services page (Max 1 per category)"), "**Detail Page**" ("List this project in "Our Work" section of the service detail page")
- Fields: "**Project Title**" (ph "Luxury Website"), "**Client Name**" (ph "Client Co."), "**Category**" (Build (Web Dev) / Attract (Marketing) / Automate (AI)), "**Image**", "**Short Description**", "**Challenge**", "**Solution**", "**Results (one per line)**", "**Technologies (one per line)**"
- Buttons: "**Cancel**", "**Save Project**" / "**Saving...**"
- Delete dialog: "**Are you sure?**" / "**This will permanently delete this project.**" / "**Cancel**" / "**Delete**"
- Toasts: "Project added to portfolio", "Project details updated successfully", "Project removed from portfolio"

### NotFound (`not-found.tsx`)
- "**404 Page Not Found**"
- "**Did you forget to add the page to the router?**" (⚠ developer-facing placeholder copy shown to end users)

### Meta / `<head>` (`client/index.html`)
- `<title>`: "**OmniflowAI - Design & Automation**"
- `<meta name="description">`: "**OmniflowAI - Custom Websites & AI-Powered Automation.**"
- `<meta property="og:title">`: "**OmniflowAI**"
- No other OG/Twitter tags, no canonical, no favicon PNG (favicon is an SVG referenced as `type="image/png"`).

### i18n dictionary strings (`i18n.tsx`) — MOSTLY ORPHANED
The dictionary contains a full EN + AR set (hero, problem/solution, "3 systems" services, footer, final CTA, testimonials). **Only `nav.*` and `hero.cta.secondary` are actually consumed by the app.** The rest (below) is **dead copy not shown on any current page** — it describes an older "Operational System / 3 Systems" positioning:
- EN hero (unused): badge "Operational Partner"; "Turn Digital Presence Into **Revenue Infrastructure**"; "We don't just build websites. We engineer the systems that cut costs, automate workflows, and capture data for serious businesses."; CTAs "Book Strategy Call" / "Start Consultation".
- EN problem (unused): "The Agency Model is Broken." / "You don't need another redesign. You need operational clarity." + 3 gap/fix blocks.
- EN systems (unused): "The Operational System" / "Three integrated layers. One scalable engine." + Infrastructure/Growth/Automation blocks.
- EN footer/CTA (unused): "Engineered for Scale."; "© 2026 OmniflowAI. All rights reserved."; "Stop Guessing. Start Scaling."; "Partner Feedback".
- Full Arabic mirror of all the above exists but is likewise unused except `nav.*` and the nav CTA.

---

## 8. Positioning & Messaging (as currently expressed)

- **Tagline / value prop (live)**: "**We build the systems that grow your business**" — supported by "Websites that convert. Marketing that targets the right buyers. Automation that saves your team hundreds of hours. All engineered to pay for itself."
- **Core stance**: engineering-led, anti-agency, transparency, code ownership, revenue-first ("We don't sell hours. We build systems that generate revenue, cut costs, and scale.").
- **Services named as** (live Services page):
  1. **Web Development** — "Your website should close deals, not just look pretty."
  2. **Digital Marketing** — "Stop paying for traffic that doesn't convert."
  3. **AI & Automation** — "Your team is too expensive for repetitive tasks."
  - Internal 3-pillar taxonomy: **build / attract / automate**. A 4th service **AI Agents** exists as a detail page but is unlinked.
- **Claims / stats / social proof currently on the site:**
  - "Trusted by 50+ Businesses" (hero badge) — but "Trusted by 21+ teams" in the logos section (⚠ inconsistent; 21 = number of logo files).
  - Hero metrics: 340h saved/mo, 60% less CAC, 100% ownership.
  - Results card: $150 cost/lead (62% ↓), 340hrs time saved (≈2 FTEs), 6.8× avg client ROI within 12 months.
  - Petra Engineering case: cut proposal time 40%, 2× wins, 90-day ROI, close rate 23%→41%.
  - 90-day results guarantee with "full refund."
  - 3 named testimonials (Ahmed Hassan/Petra, Sarah Johnson/Reliance Hub, Mohamed Ali/Madrid Contracting) — first-name Western + Arabic mix; **note the testimonial quotes and case-study numbers are hardcoded and not tied to real DB data**.
  - 21 client logos (marquee).
- ⚠ **Messaging drift**: the i18n dictionary still carries an older, sharper "Revenue Infrastructure / Operational System / 3 integrated layers" positioning that has been superseded by the current friendlier hardcoded copy. Two positionings coexist in the repo; only the hardcoded one ships.

---

## 9. Portfolio / Case Studies / Services Content

### Where content lives — the important part
- **Services content**: **hardcoded** in components. The Services overview array is in `Services.tsx`; the full per-service detail (features/process/FAQ) is a hardcoded `services` object in `ServiceDetail.tsx`. No CMS, no data file.
- **Testimonials, hero stats, "How it works", case-study banner (Petra)**: **hardcoded** in `Home.tsx`.
- **Portfolio projects**: **dynamic, from the Postgres database** via the API (`/api/projects`), managed through the admin CMS. There is **no seed data / JSON** for projects in the repo — the portfolio is empty until an admin adds projects through `/admin/dashboard`.
  - Home "Recent work" uses DB projects, else falls back to 3 hardcoded placeholder cards (Petra/Reliance/Madrid using client logos as images).
  - Portfolio page and ProjectDetail are **100% DB-driven** (empty state if none).
- **Project schema** (`shared/schema.ts`, table `projects`): `id, title, client, category (build|attract|automate), description, challenge, solution, results: string[], technologies: string[], image (base64 data-URI or URL), isFeatured, isServiceShowcase, showOnServicePage`.
- **CMS behavior** (`server/storage.ts`): enforces **max one `isServiceShowcase` per category** (auto-unsets others). `isFeatured` → Home; `isServiceShowcase` → Services hero; `showOnServicePage` → service detail list.

### Actual case-study / portfolio content present in the repo
- **None as data.** The only "case study" text baked into code is the **Petra Engineering** banner on Home (verbatim in §7) and the 3 testimonials. Real portfolio entries must be created at runtime via the admin dashboard; the repo ships with an empty projects table.

---

## 10. Assets

### Present and used
- **Client logos** — `client/src/assets/clients/` (21 PNGs), all imported in `Home.tsx` marquee & fallback cards:
  `Beit_el3tara.png, Cutz.png, darat.png, Dar-ELmaaly.png, Decork.png, electromeca.png, elkhateer.png, elmodhsh.png, Gzour.png, Ipec.png, kayan.png, Madrid.png, mashareeb.png, n2oosh.png, naas.png, Petra.png, "Plugin talents.png" (has a space), Princess.png, rafeek.png, "Reliance Hub.png" (has a space), ta2deer.png`.
- **Team photos** — `client/src/assets/team_images/` (4 JPEGs), used in `About.tsx`: `founder.jpeg`, `headofdesign.jpeg`, `headofsoftware.jpeg`, `headofmarketing.jpeg`.
  - ⚠ `headofmarketing.jpeg` is imported as `MarketingImage` and used for "Faris Sallam / Growth Strategist"; naming vs. role is a bit mismatched but functional.
- **Favicon** — `client/public/favicon.svg`: orange (`#f97316`) hexagon (Lucide-style), 1200×1200. Referenced in `index.html` as `type="image/png"` (⚠ wrong MIME).
- **Icons** — all via `lucide-react` (and `react-icons` is installed but I found no usage in pages).

### Present but NOT used (orphaned)
- `attached_assets/generated_images/` — 3 PNGs, **not referenced anywhere in `client/src`**:
  `hero_workspace_collaboration_scene.png`, `ai_automation_visual_concept.png`, `website_dashboard_mockup_showcase.png`. (These match the "hero image / dashboard mockup" the design guidelines call for — they were generated but never wired in; the hero uses a CSS card instead.)
- `attached_assets/Pasted-*.txt` — 4 raw text dumps of prompts / pasted code (development scratch, not shipped).

### Placeholder / external image behavior
- Every project image has an `onError` fallback to `https://placehold.co/600x400?text=No+Image` (external placeholder service).
- Hero/marquee noise texture loaded from external `https://grainy-gradients.vercel.app/noise.svg`.
- No hero photograph is used on Home despite the design guidelines specifying one — replaced by the coded "Results Dashboard" card.

---

## 11. Forms & Integrations

### Contact form
- Client: `Contact.tsx`, React Hook Form + Zod (`contactFormSchema`), submits **POST `/api/contact`** via `apiRequest` (TanStack mutation). Fields: name, email, phone?, company?, service (enum), message.
- Server: `routes.ts` `/api/contact` **validates with Zod and returns `{ success: true, message: "Thank you for your inquiry." }` — it does NOT persist, email, or forward the submission anywhere.** ⚠ **Leads go into the void.** No email service, no DB table for contacts, no webhook.
- On success the UI shows a toast (with a literal missing-key title, see §7/§12).

### Newsletter (footer)
- Input + send button exist but have **no `onSubmit`/handler and no state** — purely decorative. ⚠ Non-functional.

### Admin auth
- POST `/api/login` (passport-local), `/api/logout`, GET `/api/user`. Passwords hashed with **scrypt** (`crypto`), timing-safe compare.
- **Seeded admin** on server boot: username `admin`, password `Admin@admin1234` (hardcoded in `routes.ts` `seedAdminUser`, and documented in `replit.md`). ⚠ Hardcoded credentials in source/docs.
- Session: `express-session` + **in-memory** `memorystore`, **hardcoded secret `"omniflow-secret-key"`**, cookie `maxAge` 24h, `saveUninitialized:false`. ⚠ Sessions reset on restart; secret in source; cookie not marked `secure`/`httpOnly` explicitly.

### Project CRUD API (`/api/projects`)
- `GET /api/projects` (public; optional `?category=&showOnServicePage=`), `GET /api/projects/showcase`, `GET /api/projects/:id`.
- `POST/PATCH/DELETE /api/projects` — **auth-required** (`isAuthenticated`).
- Validation on POST via `insertProjectSchema` (drizzle-zod).

### Image upload
- `POST /api/objects/upload` (auth-required, multer 5MB) → converts to **base64 data-URI**, returns `{ url }`, saved into DB text column. No cloud bucket. Client cap 4MB, accepts png/jpeg/jpg/webp.

### Analytics
- **GA4** via `VITE_GA_MEASUREMENT_ID`. `initGA()` injects gtag scripts; `useAnalytics` tracks page views on route change. **Gracefully no-ops when the env var is absent** (and it is absent locally). No other analytics/chat widgets (the "chat" is just a WhatsApp deep-link button).

### API keys referenced
- None committed. Only env-var names (`DATABASE_URL`, `VITE_GA_MEASUREMENT_ID`). The WhatsApp number `201092849400` and emails are hardcoded but not secrets.

---

## 12. Incomplete / Broken / Placeholder — the Punch List

**Broken / non-functional**
1. **Contact form submissions go nowhere** — `/api/contact` validates and returns success without storing/emailing. No lead capture despite the form working end-to-end visually.
2. **Contact page missing i18n keys render as raw keys**: the "Response Time" value shows literally **`contact.info.hours`**; success/error toast titles show **`contact.success`** / **`contact.error`**. (Other Contact labels like "Name"/"Email" happen to read fine only because the missing key equals the English word.)
3. **ServiceDetail "Proven Results" section never renders.** Its query uses `apiRequest("GET", …)` which returns a raw `Response` object (not parsed JSON); `relatedProjects.length` is therefore `undefined`, so the guarded section is always hidden. Related projects will never appear on service pages even if `showOnServicePage` is set.
4. **Newsletter signup (footer)** — input + button with no handler/state. Dead.
5. **Footer social icons** (`Twitter`, `Github`, `Linkedin`) all `href="#"` — dead links.
6. **Footer/bottom legal links `/privacy`, `/terms`, `/sitemap`** and Company-column `/privacy` — routes don't exist → land on the 404 page.
7. **NotFound page shows developer copy** to end users: "Did you forget to add the page to the router?" (also light-themed, clashing with the dark site).

**Dead / orphaned code & assets**
8. **`ROICalculator.tsx`** — a full interactive component (sliders, Recharts, savings calc) **imported nowhere**. Not on any page.
9. **`client/src/pages/admin/ProjectEditor.tsx`** — **0 bytes / empty file**.
10. **i18n dictionary is ~90% orphaned** — only `nav.*` + `hero.cta.secondary` are used. All hero/problem/systems/footer/testimonials keys (EN + AR) are unused, and describe a *different, older positioning* ("Revenue Infrastructure / Operational System").
11. **`framer-motion`** installed, imported nowhere. **`react-icons`** installed, no usage found. `next-themes`, `@tailwindcss/vite`, `tw-animate-css`, GCS `objectAcl.ts` — present but effectively unused/dead.
12. **`attached_assets/generated_images/`** — 3 generated hero/dashboard PNGs never referenced; `attached_assets/*.txt` are prompt scratch files.

**Bilingual is largely non-functional**
13. Switching to **Arabic** only: (a) changes the 5 nav labels + nav CTA, and (b) sets `dir="rtl"` + `lang`. **All page body content (Home, About, Services, ServiceDetail, Portfolio, ProjectDetail, Contact, Footer) stays hardcoded English.** The site is not actually bilingual in content, despite `replit.md`/design docs claiming "Full English and Arabic translations." `About.tsx` even imports `t` but never calls it.

**Content / data inconsistencies**
14. **Trust stat conflict**: "Trusted by 50+ Businesses" (hero) vs "Trusted by 21+ teams" (logos, derived from array length).
15. **Contact email mismatch**: Footer says **hello@omniflow.ai**; Contact page says **contact@omniflowai.agency**. Two different domains.
16. **Founder name likely typo**: "**Mosatafa Hekal**" (Mostafa?). Founder in story is unnamed-in-first-person then attributed to Mosatafa Hekal ("Founder & Technical Lead"), while the team grid lists three different people — no overlap, slightly confusing.
17. **`/services/ai-agents`** detail content exists but is unreachable from the UI (Services page never links it); the Contact form offers "AI Agents" as a separate option while Services groups it under "AI & Automation."
18. **Placeholder portfolio**: ships with an **empty projects DB**; Home falls back to 3 placeholder cards that reuse client *logos* as project *images*. Portfolio/ProjectDetail are empty until an admin populates them. Testimonials & the Petra case study are hardcoded, not real records.

**Security / config smells (state, not judgments)**
19. Hardcoded admin credentials (`admin` / `Admin@admin1234`) in `routes.ts` **and** `replit.md`. Hardcoded session secret `omniflow-secret-key`. In-memory sessions (lost on restart). Local `.env` has empty `DATABASE_URL` (app throws on boot without it).

**Doc drift**
20. `replit.md` and `design_guidelines.md` describe features that differ from the build: guidelines call for a hero photo, pricing tiers, FAQ accordion (ServiceDetail FAQ is plain divs, not an accordion), "Trusted by 500+ businesses", Heroicons via CDN (actually Lucide), Tajawal/Cairo Arabic font (not loaded). `replit.md` overview claims full bilingual translations and lists routes accurately but overstates i18n coverage.
21. Favicon declared `type="image/png"` but file is SVG.

---

## Completeness Summary

**Rough completeness: ~70% of a polished marketing-site + light CMS.** The information architecture, routing, page designs, and a working portfolio CMS (auth, CRUD, image-as-base64 upload, feature-flag visibility) are genuinely built and coherent, and the dark UI is consistent and modern across the public pages. However, several load-bearing pieces are unfinished or wired wrong: the **contact form captures nothing** (biggest functional gap), the **"bilingual" promise is essentially cosmetic** (only nav translates; the entire i18n dictionary is stale/orphaned and mismatched to the shipped copy), the **service-detail "related projects" block silently never renders** due to an `apiRequest` return-type bug, and there's meaningful dead weight (unused ROI calculator, empty ProjectEditor, unused framer-motion, orphaned generated images, dead footer links, 404 with developer copy). Content also ships thin — the portfolio DB is empty, and case studies/testimonials/stats are hardcoded and internally inconsistent (50+ vs 21, two contact emails). It reads as a strong front-end shell with a functional admin backend, but with backend integrations (lead delivery), i18n, and content population still to finish before launch.
