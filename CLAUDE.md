# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

OmniflowAI is a bilingual (EN/AR) agency marketing website with a small admin CMS. Single repo containing a React frontend (`client/`), an Express backend (`server/`), and code shared between them (`shared/`). Originally a Replit project (see `replit.md`, `.replit`).

---

## Working principles (read before making changes)

These are as important as the technical facts below. This codebase was built in disciplined, scoped layers; keep it that way.

### Simplicity first
- **Prefer the simplest solution that fully solves the problem.** Simplicity beats cleverness.
- **Don't reinvent what a solid, simple existing tool already covers — but don't add a dependency for what a few lines of clear code would do.** Minimize BOTH new dependencies and new custom surface area. When those two goals conflict, choose the option a maintainer would find easiest to understand six months from now.
- **Don't add abstraction, configuration, or infrastructure for needs that don't exist yet.** Build for the requirement in front of you, not an imagined future one.
- **Don't build from scratch when a simple, proven pattern already exists in this repo** — reuse the existing i18n system, the `storage.ts` data layer, the taxonomy source of truth, etc., rather than introducing parallel mechanisms.

### Scope discipline
- **Stay inside the scope of the task you were given.** Do not refactor, rename, "clean up," or "improve" code outside that scope, even if it looks tempting. Out-of-scope changes hide real changes and break the layered model.
- If you notice a real problem outside your scope, **report it — don't fix it silently.** Leave a clear `// TODO(...)` and note it in your summary.
- **Never remove or reverse a deliberate prior decision** (a redirect, a frozen placeholder, a scoped cast) without being explicitly asked. Frozen content stays frozen.

### Honesty over false completion
- **Never fake success.** If something can't be verified, doesn't build, or is only partially done, say so plainly. A DB/write path must return a real error on failure, never a success response that hides it.
- **Don't invent content.** No placeholder numbers presented as real, no fabricated testimonials, names, metrics, or client claims. Where real content is missing, use a clearly-labelled placeholder token, not plausible-looking fiction.
- **When unsure whether to delete something, keep it and report it.** Removing working code is worse than leaving a harmless unused import.

### Verify before declaring done
- Run `npm run check` (tsc) and `npm run build` and confirm both are green before reporting completion.
- Reason through the result explicitly (e.g. empty-DB states, both languages, auth on/off) rather than assuming.
- For each staged task, write the summary doc it asks for, listing every file changed (one line each) and every placeholder/TODO left behind.

### Placeholder & TODO conventions (do not disturb unless in scope)
- `// TODO(team-final)` / `[TODO(team-final)]` — team/founder/remote content, deliberately frozen until a dedicated pass. **Never unfreeze or invent this.**
- `// TODO(Layer3-proof)` / `[Layer 3: ...]` — real case-study/metric slots filled via the CMS, not by code.
- `// TODO(email-final)` — the placeholder value in `CONTACT_EMAIL`.
- `// TODO(social-final)` — empty `SOCIAL_LINKS`; icons render only when real URLs are added.
- `// TODO(legal-final)` — real privacy/terms pages to be added later.

---

## Commands

```bash
nvm use 20          # REQUIRED — see "Node version" below
npm install
npm run dev         # dev server (Vite middleware + API) on http://localhost:5000
npm run build       # vite build client → dist/public, esbuild server → dist/index.js
npm run start       # run the production build (needs npm run build first)
npm run check       # tsc type-check (no emit)
npm run db:push     # push shared/schema.ts to the database via drizzle-kit
```

There is **no test suite and no linter** configured — `npm run check` (tsc) is the only static verification. Do not add a test framework or linter unless explicitly asked.

### Node version
Node **20+ is required**. `vite.config.ts` and the server use `import.meta.dirname` / Node-20 APIs; on Node 18 the app crashes at boot with `ERR_INVALID_ARG_TYPE paths[0]`. Always `nvm use 20` first (default alias is set to 20).

### Environment
`DATABASE_URL` (Neon/Postgres) is **required** or the server throws on boot. Config is loaded from `.env` (gitignored) via `dotenv/config`, imported at the top of `server/index-dev.ts`, `server/index-prod.ts`, and `drizzle.config.ts`. Copy `.env.example` to `.env`. Other vars (`ADMIN_PASSWORD`, `SESSION_SECRET`, `RESEND_API_KEY`, `NOTIFY_EMAIL`) fall back to built-in defaults with a logged warning if unset.

---

## Architecture

### Single-server model
One Express process serves both the API and the client. `server/app.ts` (`runApp`) builds the app, registers routes, then takes a `setup` callback that differs by entrypoint:
- `server/index-dev.ts` → `setupVite`: mounts Vite in middleware mode with HMR (dev).
- `server/index-prod.ts` → `serveStatic`: serves the built `dist/public` and falls through to `index.html` (prod SPA).

The API is mounted first; anything not under `/api` falls through to the SPA. Server listens on `PORT` (default 5000).

### Taxonomy is the single source of truth
`shared/taxonomy.ts` defines the service **PILLARS** (`ai-training`, `digital-marketing`, `software`), portfolio **CATEGORIES**, their labels, and the `CATEGORY_TO_PILLAR` mapping. **Never hardcode pillar/category slugs or labels elsewhere** — schema validation (`shared/schema.ts`), pages, admin, and server all import from here. `CONTACT_SERVICES`, `CONTACT_EMAIL`, and `SOCIAL_LINKS` also live here. `LEGACY_CATEGORY_MAP` migrates old category slugs; `App.tsx` has matching legacy `/services/*` redirect routes so old links fold into the three pillars. **The three-pillar positioning is settled — do not reintroduce old service names** ("Web Dev", "AI Agents", "Automation"/"Revenue Systems" as a service, etc.) anywhere in the UI.

### Data layer (Drizzle + Neon)
`shared/schema.ts` is the schema single source of truth — Drizzle table defs plus `drizzle-zod` insert/select schemas and inferred types (`Project`, `Lead`, `User`, `Subscriber`). Tables: `users`, `projects`, `leads`, `subscribers`, plus a `session` table auto-created by `connect-pg-simple`. `server/db.ts` exports the Neon pool/`db`. All queries go through `server/storage.ts` (`DatabaseStorage implements IStorage`) — add DB access there, not inline in routes. Schema changes are applied with `npm run db:push` (no migration files are checked in).

Notable: `projects.isServiceShowcase` is enforced unique-per-category by `ensureUniqueShowcase` in storage on create/update. When one pillar needs "the one showcase project" and several categories roll up to it, the deterministic winner is the most recently created (highest `id`).

### Images stored as Base64 in Postgres
There is **no object/cloud storage**. `server/objectStorage.ts` compresses uploads with `sharp` (resize ≤1600px, WebP q80) and returns a `data:image/webp;base64,...` string that is stored directly in the `projects.image` text column. This is why `express.json` limit is raised to 50mb in `server/app.ts`. Uploads go through `POST /api/objects/upload` (multer memory storage, 5MB cap). Migrating to real object storage is a known, deliberately deferred option — do not undertake it unless asked.

### Auth (admin CMS)
Session-based auth via Passport local strategy + `express-session` backed by Postgres (`connect-pg-simple`). An `admin` user is seeded on boot (`seedAdminUser` in `server/routes.ts`, password from `ADMIN_PASSWORD`). Passwords hashed with scrypt. Server enforces auth via the `isAuthenticated` middleware on all mutating project routes and all `/api/leads`. On the client, `ProtectedRoute` gates `/admin/dashboard` and `/admin/leads`; the client gate is UX only — the server is the real boundary. Admin pages are intentionally English-only (internal tooling).

### Leads / contact
`POST /api/contact` validates with `contactFormSchema`, saves a lead to the DB, then fires a **fire-and-forget** Resend email (`notifyNewLead`) that never blocks or fails the response — skipped silently if `RESEND_API_KEY` is unset. Admins view/manage leads at `/admin/leads`.

### Frontend
React 18 + Vite, routing via **wouter** (not React Router), data via **TanStack Query**, styling via **Tailwind + shadcn/ui** (components in `client/src/components/ui`, config in `components.json`). Path aliases: `@` → `client/src`, `@shared` → `shared`, `@assets` → `attached_assets`. Pages are route-split with `React.lazy` in `client/src/App.tsx`.

- **Data fetching:** `client/src/lib/queryClient.ts` — default `queryFn` fetches `queryKey.join("/")` as the URL with `credentials: "include"`; `staleTime: Infinity`, no retries/refetch. Use `apiRequest(method, url, data)` for mutations. Note `apiRequest` returns the raw `Response` — parse/`.json()` it and check `.ok`; do not assume it returns parsed data.
- **i18n:** `client/src/lib/i18n.tsx` — `I18nProvider` + `useI18n()` give `t(key)`, `language`, `setLanguage`, `isRTL`. Copy is a flat dot-namespaced dictionary for `en`/`ar` (Arabic is formal MSA / فصحى). Keep EN and AR keys at exact parity. Brand name, emails, enum/code values, DB content, and the team section are intentionally not translated. When adding user-facing copy, add both languages; never hardcode a display string in a component.
- **Performance:** the site was deliberately optimized (route code-splitting, lazy images, trimmed fonts, compressed logos). Don't regress it — lazy-load new content images, don't add heavy dependencies or large uncompressed assets, and keep the main bundle from ballooning.
- **Analytics:** Google Analytics initialized in `App.tsx` only if `VITE_GA_MEASUREMENT_ID` is set; all GA calls are wrapped in try/catch and non-fatal.

---

## Reference docs in the repo
- `replit.md` — original project overview and setup notes.
- `design_guidelines.md` — design system / visual direction.
- `LAYER1-STRUCTURE.md` … `LAYER6A-POLISH.md` — staged build logs (structure, copy, system, leads, bilingual, polish). Each records what a given layer changed and what it deliberately left for later. `OMNIFLOW-AUDIT.md` is an earlier full audit; treat as historical, not current truth.
- When you complete a scoped task/layer, add or update the corresponding `LAYER*.md` log rather than editing the historical ones.