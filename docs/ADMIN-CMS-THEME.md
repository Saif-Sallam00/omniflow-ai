# Admin CMS — Dark Theme + Chrome Isolation + Service-Page Field Removal

Scoped pass over the admin CMS only (`/admin/dashboard`, `/admin/leads`). Public
pages were intentionally left alone **except** for the deliberate, user-approved
removal of the `showOnServicePage` field (task 3, see below).

## 1. Dark theme (match public "Ember on gunmetal" palette)
The admin was light/default (`bg-slate-50`, white cards, amber accents). Converted
to the public dark palette: near-black ground `#0a0a0b`, `slate-950` cards with
`slate-800` borders, white / `slate-400` text, and **Flow Orange** accents via the
shadcn `--primary` token (`#FF6B1F`).

Because Radix Dialog / Select / AlertDialog portal to `document.body` (outside any
admin wrapper), a `.dark` wrapper class would not reach them and `.dark` also flips
`--primary` to white. So dark styling is applied with explicit utility classes per
component instance instead — scoped to the admin pages, no global theme change, no
regression to public pages. Primary buttons/badges/switches pick up Flow Orange for
free from the untouched `:root` `--primary` token.

## 2. Public chrome removed from `/admin/*`
`client/src/App.tsx` rendered `<Navigation>`, `<Footer>`, and the floating WhatsApp
CTA globally. They are now suppressed when `location.startsWith("/admin")`, so admin
routes show only the CMS shell (logo + Portfolio/Leads tabs + Logout). Also cleans
up the login page (`/admin/auth`), which no longer shows public nav.

## 3. `showOnServicePage` ("Service Page") fully removed
User explicitly approved full removal including the public consumer. Was a live
feature: the per-project flag that listed a project in the "Our Work" / related
section of a pillar's service-detail page.
- `client/src/pages/admin/Dashboard.tsx` — removed the blue "Service Page" badge,
  the "Detail Page" toggle card (toggle grid 3→2 cols), the zod field, and all
  form default/reset wiring. Dropped now-unused `Eye`/`Code` icon imports.
- `shared/schema.ts` — dropped the `show_on_service_page` column.
- `server/routes.ts` — dropped the `showOnServicePage` query param on `GET /api/projects`.
- `server/storage.ts` — `getProjectsByCategory` no longer takes the filter arg.
- `client/src/pages/ServiceDetail.tsx` — the related-projects list now filters by
  `CATEGORY_TO_PILLAR` alone (shows all portfolio projects rolling up to the pillar).
  The section still self-hides when empty.

## Verification
- `npm run check` (tsc) — green.
- `npm run build` — green.
- No remaining `showOnServicePage` / `show_on_service_page` references in the repo.

## Follow-ups / notes
- **`npm run db:push` still needed** to drop the leftover `show_on_service_page`
  column from the database. The app runs correctly without it (Drizzle only maps
  schema-defined columns; the orphan column is inert), so this is non-urgent cleanup.
  Not run here — it mutates the live DB.
- **Out of scope, not changed (reported per instructions):** the login page
  (`/admin/auth`) still uses amber (`text-amber-500`, `bg-amber-500`) rather than
  Flow Orange. It was already dark, and it's outside the two named routes. Aligning
  its accent to `--primary` would make the admin fully consistent if desired.
