# Layer 4 — Lead Capture, Dead-Link Cleanup, Admin Hardening, Logo Perf

The site now **actually captures leads** (it previously dropped them), the newsletter
persists subscribers, broken/dead surfaces are gone, the admin is minimally hardened
now that real lead data sits behind it, and the oversized client-logo assets are
compressed. No copy rewriting, no i18n, no team content, no general dead-code removal.

`npm run db:push` → **applied**. `npx tsc` → **0 errors**. `npm run build` → **success**.
Verified end-to-end against the running server (see "Verification").

---

## Files changed (one line each)

**Server / schema**
- `shared/schema.ts` — added `leads` and `subscribers` tables (+ `LEAD_STATUSES`,
  insert schemas, types).
- `shared/taxonomy.ts` — added `SOCIAL_LINKS` config (all empty, `// TODO(social-final)`).
- `server/db.ts` — export the `pool` (needed by the Postgres session store).
- `server/storage.ts` — added `createLead`, `listLeads`, `updateLeadStatus`,
  `deleteLead`, `createSubscriber` (dup-safe).
- `server/routes.ts` — `/api/contact` now persists a lead + fires an optional email;
  new authed `/api/leads` (GET/PATCH/DELETE); public `/api/subscribe`; env-based admin
  password & session secret (warned fallbacks); Postgres session store; hardened cookie.
- `.env.example` — documented `ADMIN_PASSWORD`, `SESSION_SECRET`, `RESEND_API_KEY`,
  `NOTIFY_EMAIL` (names only).
- `replit.md` — removed the hardcoded admin password; replaced with an env note.

**Client**
- `client/src/pages/admin/Leads.tsx` — **NEW.** Authenticated leads inbox (list newest
  first, expandable message, status select, delete).
- `client/src/App.tsx` — lazy-loaded `Leads`, added `ProtectedRoute /admin/leads`.
- `client/src/pages/admin/Dashboard.tsx` — added the admin nav (Portfolio | Leads).
- `client/src/components/Footer.tsx` — real newsletter form (POST `/api/subscribe`,
  toasts); social icons now config-driven (none render while `SOCIAL_LINKS` is empty);
  removed the dead `/privacy` `/terms` `/sitemap` links.
- `client/src/pages/not-found.tsx` — dark-themed, user-facing 404 copy + "Back to home".
- *(Contact.tsx unchanged — its mutation already treats non-2xx as an error via
  `apiRequest` → `throwIfResNotOk`, so A4 was already satisfied.)*

**Assets / tooling**
- `scripts/optimize-logos.mjs` — **NEW.** One-off sharp logo optimizer (max height 160px,
  optimized PNG, same filenames).
- `client/src/assets/clients/*.png` — 21 logos recompressed in place.
- `package.json` / `package-lock.json` — added `resend` (and `sharp` from Layer 3 already present).

---

## New database tables (via `db:push`)

- **`leads`** — `id, name, email, phone (nullable), company (nullable), service, message,
  status ("new" | "read" | "archived", default "new"), created_at (default now)`.
- **`subscribers`** — `id, email (unique), created_at`.
- **`session`** — created automatically at runtime by `connect-pg-simple`
  (`createTableIfMissing: true`); not part of the drizzle schema.

## New environment variables (names only)

| Var | Purpose |
|---|---|
| `ADMIN_PASSWORD` | Password for the seeded `admin` user. Falls back to a built-in default (with a logged warning) if unset. |
| `SESSION_SECRET` | Signs session cookies. Falls back to a built-in default (with a logged warning) if unset. |
| `RESEND_API_KEY` | If set, a lead-notification email is sent via Resend on each new lead. If unset, email is **skipped silently** (lead still saved). |
| `NOTIFY_EMAIL` | Destination for lead emails. Falls back to the app's `CONTACT_EMAIL` constant if unset. |

`RESEND_API_KEY`, `NOTIFY_EMAIL`, real social URLs (`SOCIAL_LINKS`), and real
privacy/terms pages **remain for the user to supply**.

---

## PART A — Lead capture (end to end)

- `POST /api/contact`: validate → `INSERT` into `leads` → `{ success: true }`. A Zod
  failure returns **400**; a DB failure returns a real **500** (never a false success).
- Email is **fire-and-forget** in its own try/catch: it never blocks or fails the request,
  and is skipped entirely (one info log) when `RESEND_API_KEY` is absent.
- Admin `GET /api/leads` (newest first), `PATCH /api/leads/:id` (status), `DELETE
  /api/leads/:id` — all `isAuthenticated`-gated.
- New `/admin/leads` page (ProtectedRoute) lists leads, changes status, deletes,
  reachable via the admin nav.

## PART B — Newsletter
- `subscribers` table + `POST /api/subscribe` (validates email, `onConflictDoNothing` so
  duplicates are ignored and **still return success** — no leak of which emails exist).
- Footer input/button is now a real form with toasts
  ("Thanks — you're subscribed." / "Something went wrong, please try again.").
  Capture only; no emails are sent to subscribers (intended).

## PART C — Dead links & 404

**Footer links removed (previously 404'd):**
- Company column: **"Privacy" → `/privacy`** — removed.
- Bottom bar: **"Privacy" → `/privacy`**, **"Terms" → `/terms`**, **"Sitemap" → `/sitemap`** — removed.
- A `// TODO(legal-final)` comment marks both spots for real legal pages later.

**Social icons:** the three `href="#"` dead links (Twitter/GitHub/LinkedIn) are gone.
Icons now render only for platforms with a non-empty URL in `SOCIAL_LINKS` (currently
all empty → **no social icons render**); filling that one config makes them appear.

**Nav/other:** all remaining footer + nav links resolve to real routes
(`/`, `/services`, `/portfolio`, `/about`, `/contact`). No other 404s found.

**404 page:** replaced developer copy with user-facing copy — heading "Page not found",
body "The page you're looking for doesn't exist or has moved.", and a "Back to home"
button; restyled from the clashing light card to the site's dark slate palette.

## PART D — Admin / session hardening

- Admin seed password → `ADMIN_PASSWORD` env (fallback + warning). Session secret →
  `SESSION_SECRET` env (fallback + warning). Hardcoded password removed from `replit.md`.
- Session cookie flags: `httpOnly: true`, `sameSite: "lax"`, `secure: true` when
  `NODE_ENV === "production"`.
- Replaced the in-memory `memorystore` with a **Postgres-backed `connect-pg-simple`
  store** (reuses the existing Neon pool; `createTableIfMissing` creates the `session`
  table) so admin sessions survive restarts.
- No auth redesign (no roles, no reset flow). *Note:* the env password applies when the
  admin is first seeded (empty user table); it does not rewrite an already-seeded admin.

## PART E — Client-logo compression

Ran `scripts/optimize-logos.mjs` (sharp, max height 160px, optimized PNG, identical
filenames incl. the two with spaces).

- **Folder: 5.6 MB → 132 KB** (sum of files ≈ **5.55 MB → 0.09 MB**).
- Biggest wins: `naas` 1331 KB → 6 KB, `kayan` 1263 KB → 2 KB, `Beit_el3tara` 833 KB → 5 KB,
  `Dar-ELmaaly` 510 KB → 12 KB, `elkhateer` 272 KB → 6 KB, `electromeca` 261 KB → 7 KB.
- Filenames unchanged → all existing imports keep working (build passed).

---

## Verification (against the running dev server)

- `POST /api/contact` (valid) → `{"success":true}`; the lead row was created and returned
  by `GET /api/leads`. Invalid payload → **400**.
- Admin `POST /api/login` → **200** (Postgres session cookie); `GET /api/leads` with the
  cookie returned the lead; **without** the cookie → **401**.
- `PATCH /api/leads/:id` `new → read` → returned the updated lead; invalid status → **400**.
- `DELETE /api/leads/:id` → **204**, list then empty.
- Server log confirmed `RESEND_API_KEY not set — skipping email notification (lead saved
  to DB)` — email gated, request still succeeded.
- `POST /api/subscribe` twice with the same email → both **success** (duplicate ignored).
- Startup logged the `ADMIN_PASSWORD` / `SESSION_SECRET` fallback warnings as designed.
- Test rows were cleaned up afterward (leads=0, subscribers=0).

### Empty-DB / dead-surface reasoning
- No footer link 404s; no dead `#` social icons (config empty → none render).
- 404 route shows dark-themed user copy.
- Contact form: submit → lead persists → appears in `/admin/leads` → status/delete work;
  with no `RESEND_API_KEY`, no email is sent and the request still succeeds.
- Newsletter submit creates a subscriber (dedup-safe).

**Changed files:** `shared/schema.ts`, `shared/taxonomy.ts`, `server/db.ts`,
`server/storage.ts`, `server/routes.ts`, `.env.example`, `replit.md`,
`client/src/App.tsx`, `client/src/pages/admin/Leads.tsx` (new),
`client/src/pages/admin/Dashboard.tsx`, `client/src/components/Footer.tsx`,
`client/src/pages/not-found.tsx`, `scripts/optimize-logos.mjs` (new),
`client/src/assets/clients/*.png` (21 recompressed), `package.json` / `package-lock.json`.
