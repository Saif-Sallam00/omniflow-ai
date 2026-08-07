# Articles — `/articles`

A CMS-backed article section, built for two jobs: SEO, and the LinkedIn →
article → solution/case-study funnel from the GTM plan.

**One step remains before it works: `npm run db:push`.** See below.

---

## Why the server renders the meta tags

The single most important thing in this build, and the reason it is not purely
a client-side feature.

This is a client-side SPA, and **social crawlers do not execute JavaScript**.
LinkedIn — the top of the entire content funnel — reads the HTML exactly as it
is sent. Without intervention every shared article would preview with the
site-wide title and description baked into `client/index.html`: same headline,
same blurb, same image, for every post. Google renders JS, but later and less
reliably than it reads the initial response.

So `server/index-prod.ts` intercepts `GET /articles/:slug`, looks the article
up, and substitutes `<title>`, `description`, `og:*` and `twitter:*` into the
template before sending. No renderer, no framework — a lookup and a string
replace. Anything that throws or misses falls through to the untouched shell: a
wrong preview is bad, a 500 on a link you already posted is worse.

`og:image` needs a *fetchable URL*, and covers are stored as base64 data URIs,
so `GET /api/articles/:slug/cover` decodes and serves the image as a real
binary response with a one-hour cache header.

**This runs in the production build only.** The dev server uses Vite middleware
and does not do the substitution — which is fine, since a crawler cannot reach
`localhost` anyway. Verify previews after deploying, with LinkedIn's Post
Inspector.

---

## Data model

One table, following the `projects` pattern exactly.

| Column | Notes |
|---|---|
| `slug` | unique — the URL. Treat as immutable once published. |
| `title`, `excerpt` | `excerpt` is required: it is the card summary **and** the meta description **and** the LinkedIn preview text. |
| `coverImage` | base64 data URI, same as `projects.image`. |
| `body` | Markdown. |
| `language` | `en` \| `ar`. The index filters to the reader's language. |
| `published`, `publishedAt` | `publishedAt` is stamped once, on the first transition to published — re-editing a live article does not bump it back to the top of the index. An explicit value from the admin always wins, so back-dating an import works. |
| `relatedProjectId`, `relatedSolution` | Both nullable. The end-of-article funnel hop. |

Articles are authored **one language at a time**. The EN/AR parity rule covers
the i18n dictionary, not CMS rows — same as projects.

`ArticleCard` is a `Pick<>` of the columns the list needs, and the two list
queries select exactly those. Bodies carry base64 images, so selecting `body`
to render a grid of cards would move megabytes to draw thumbnails.

## Body format

Markdown, rendered with `@tailwindcss/typography` (`prose prose-invert`), which
was already a dependency and already used on `ProjectDetail`. Three overrides:

- **Links** — relative ones (`/services`, `/portfolio/3`, `/articles/other`)
  route through wouter, so the article → article → solutions → portfolio path
  never full-reloads the SPA. External links get `target="_blank"` + `noopener`.
- **Images** — lazy, bordered, rounded.
- **YouTube** — a YouTube URL alone in a paragraph becomes a
  `youtube-nocookie` embed. Anything else stays ordinary prose.

**Diagrams are uploaded images.** Mermaid would be a ~500 kB dependency for an
occasional diagram.

Inline images are base64 in the body, consistent with the existing deliberate
choice not to use object storage. The admin's *Insert image* button uploads
through the existing endpoint and writes the markdown at the cursor, so the
data URI is never pasted by hand. Practical limit is roughly 4–5 inline images
per article.

## Funnel

`relatedProjectId` and `relatedSolution` render a "Where to go next" block
before the CTA. Both optional. This exists so the hop out of an article is a
deliberate editorial choice rather than depending on the author remembering to
drop a link mid-paragraph.

---

## Deliberately not built

Tags/categories, search, pagination, comments, RSS, author profiles, a WYSIWYG
editor, scheduled publishing. None earns its place under ~20 articles, and all
are additive later.

---

## Files

| File | Change |
|---|---|
| `shared/schema.ts` | `articles` table, `ARTICLE_LANGUAGES`, `ARTICLE_SOLUTIONS`, insert/update schemas, `Article` / `ArticleCard` types. |
| `server/storage.ts` | Article methods on `IStorage` + `DatabaseStorage`; `stampPublishedAt`. |
| `server/routes.ts` | Public list / by-slug / cover; admin `all`, create, update, delete. Slug clashes return **409**, not a 500 from the unique index. |
| `server/index-prod.ts` | Per-article meta tag substitution. |
| `client/src/pages/Articles.tsx` | Index. |
| `client/src/pages/ArticleDetail.tsx` | Article page. |
| `client/src/pages/admin/Articles.tsx` | Admin list + editor. |
| `client/src/lib/article-date.ts` | Date formatting, Western numerals in both languages (§12.7). |
| `client/src/App.tsx` | `/articles`, `/articles/:slug`, `/admin/articles`. |
| `Navigation.tsx`, `Footer.tsx` | One link each. |
| `client/src/lib/i18n.tsx` | `nav.articles` + `articles.*` section chrome, EN + AR. |

New dependencies: `react-markdown`, `remark-gfm`.

## Verification

- `npm run check` (tsc) — clean.
- `npm run build` — clean.
- EN/AR parity — **546/546**. All 17 `articles.*` keys used by the two public
  pages exist in both languages.
- Route order confirmed: `registerRoutes` runs before the `serveStatic` setup
  callback, so `/api/*` is never swallowed by the SPA catch-all, and
  `/api/articles/all` is registered before `/api/articles/:slug`.

### Bundle cost — larger than estimated

`ArticleDetail` is **164 kB / 49.6 kB gzip**, essentially all of it
`react-markdown` + `remark-gfm`. I estimated ~30 kB gzip when proposing this;
the real number is ~65% higher. It is route-split, so only readers of an
article page pay it, and no other page is affected (`Articles` index is 1.07 kB
gzip).

If that matters — and on a page whose purpose is SEO, for mobile readers in
Egypt and Saudi, it plausibly does — `markdown-to-jsx` covers the same needs
(component overrides for links/images/YouTube) at roughly 6 kB gzip. It is a
contained swap: one import and one `<ReactMarkdown>` call in `ArticleDetail`.

### Not verified

No browser was driven. Unchecked: the rendered article typography, the admin
editor dialog, the YouTube embed, and the RTL layout of an Arabic article.

---

## Required before this works

```bash
npm run db:push
```

This creates the `articles` table. The change is **additive** — one new table
plus a nullable FK to `projects` — and touches no existing table. It was not
run here because it writes to the live database.
