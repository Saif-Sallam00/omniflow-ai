# Capability pages rebuild — /services/{ai-training, digital-marketing, software}

All three routes render `client/src/pages/ServiceDetail.tsx`. Slugs unchanged
(§0.5), so no redirects and no lost index.

---

## What was wrong

### The pages were wearing the admin skin

`bg-[#0a0a0b]` existed in exactly four places in the codebase: this page and the
two admin CMS pages. Every public page uses `bg-slate-950` (#020617), which is
blue-tinted — and since the nav is `bg-slate-950/90`, the header sat on a
*different black* than the page body. That seam was the visible artefact.

| | Before | Now |
|---|---|---|
| Background | `bg-[#0a0a0b]` (admin black) | `bg-slate-950` |
| CTA fill | `bg-orange-500` ×4 — the only page in the site doing this | `bg-primary` |
| Actual colour | Tailwind orange `#F97316` | Flow Orange `#FF6B1F` |
| Button text | `text-white` | `text-slate-950` |
| Padding | `py-24` flat | `py-16 md:py-20` |
| Container | `max-w-4xl` | `max-w-6xl` |
| Icons | Lucide `Globe`, `Bot`, `BarChart3` | `HexGlyph` (§12.6) |
| Headings | no `font-display` | `font-display` |

Aligned to the **`/services` generation**, not the homepage. The site carries
two design generations — Home also has zero `font-display` — but these pages are
linked *from* Solutions, so that was the seam that hurt. Home is a separate
decision and was not touched.

### Two of the three pages rendered empty content

Not a judgement call — it was in the code:

```js
'digital-marketing': features: [ { title: …, description: '' }, … ]  // all 4
'ai-training':       features: [ { title: …, description: '' }, … ]  // all 4
```

**8 of 12 feature slots rendered a bare title.** Under the heading "What's
included," two pages showed four naked bullets and nothing else.

### No pain, no use cases

The pages opened with a taxonomy label ("Business Technology: software, ERP,
CRM, and automation") and never named a problem. `software` compressed eight
distinct product types into four bullets.

### They were orphaned from the solutions architecture

Nothing connected a capability to a solution, so a visitor could read the whole
page and still not know what to buy.

---

## Section order now

```
1 Hero          keyword-rich H1 (§5.1) under a clean capability label
2 The problem   4 symptoms in the owner's words — the emotional hook
3 What we build the real product types, each with the constraint it removes
4 Where it sits Foundation / Growth Engine / Scale, at depth, deep-linked
5 Proof         related projects, hidden when empty
6 FAQ
7 CTA           → /services
```

### 3 — What we build

| Page | Entries |
|---|---|
| Software | ERP · CRM · BD performance systems · custom internal applications · customer portals and B2B mobile · web platforms |
| Digital Marketing | strategy and planning · buyer-intent SEO · media buying · CRO · funnel strategy and tracking |
| AI Enablement | exec strategy sessions · department adoption programs · workflow integration workshops · implementation support |

Each entry leads with **the constraint it removes**, then what it is. An owner
recognises the symptom faster than the product name.

### 4 — Where it sits

Reads straight off `docs/CAPABILITY-PACKAGE-MAP.md`. Foundation is marked
*Assessed here*; the others *Built here*. Marketing correctly shows only two
entries — it is not part of Scale Infrastructure, and saying so is information,
not an omission.

### AI Enablement has a deliberately different shape

Its own copy says AI enablement isn't sold on its own, but the page presented
Features/Process/CTA like a product. §6 asked for it to be reframed as "how AI
Enablement works inside a solution" and only the description was ever updated.
Section 3 is now delivery **formats**, and section 4 shows it appearing in all
three solutions. §2.9 holds: capability only, no results claim, no client count,
no "proven" framing.

---

## Removed

**The Process section, entirely.** The site had *five* process models: Home
(Diagnose→Design→Build→Optimize), Solutions (Strategy + three capabilities),
Software (Discovery→Proposal→Design→Build→Launch), Marketing
(Audit→Strategy→Setup→Optimize), AI (Assess→Design→Train→…). Deleting beats
reconciling — the site is now down to two.

One of its steps also promised **"Clear scope, timeline, and a fixed price"**,
which directly contradicts Solutions' *"Starting from $X. Final scope is
determined after the business diagnosis."* That contradiction is gone.

**Per-page CTA labels.** "Build your system" / "Scale your acquisition" / "See
the solutions" were three labels for one destination. Now one shared
`serviceDetail.cta.button`. The destination stays `/services` — that is
deliberate (§6, funnelling buying intent through Solutions), not an oversight.

**Related-projects suppression on AI Training.** `slug !== 'ai-training'` left
the thinnest page with the least evidence. The section already hides itself when
empty, so the guard was redundant.

Orphaned i18n removed: all `*.proc.*`, all `*.feat.*`, the three `*.cta` labels,
`serviceDetail.included`, `.how.title`, `.how.sub`.

---

## Files changed

| File | Change |
|---|---|
| `client/src/components/systems/HexGlyph.tsx` | **New.** Extracted from `Services.tsx` so `/services` and `/services/<pillar>` mark the same capabilities with the same glyph. |
| `client/src/components/systems/index.ts` | Export `HexGlyph`. |
| `client/src/pages/Services.tsx` | Local `HexGlyph` deleted, imported instead. No other change. |
| `client/src/pages/ServiceDetail.tsx` | Rewritten. |
| `client/src/lib/i18n.tsx` | Capability-page copy rebuilt, EN + AR. Parity **530/530**. |

## Verification

- `npm run check` (tsc) — clean.
- `npm run build` — clean. `ServiceDetail` 10.43 kB / 2.55 kB gzip;
  `Services` 18.83 kB (down from 19.84 — the glyph moved out).
- EN/AR parity — **530/530**.
- All **122** keys the three pages request exist in both languages; no
  `serviceDetail.*` key is orphaned.
- No `orange-[0-9]` or `#0a0a0b` remains in the file; no `description: ''`
  remains anywhere in `pages/`.

### Not verified

Rendered appearance — no browser was driven. Arabic runs longer throughout,
and the two-column "What we build" grid at `md` is the most likely place to find
a ragged card.

---

## Open

### The industry layer is not built

`/api/projects` currently holds:

| Project | Category | Featured | Sector |
|---|---|---|---|
| HealBridge | mobile | yes | **Healthcare** — real measured results |
| OmniGrow | business-systems | yes | Agriculture — not a GTM target sector |
| `test` | ai-training | no | junk record, `results: ["sdfsadf"]` |

The GTM commits to **Real Estate, B2B Services and Healthcare**. Only Healthcare
has delivery evidence in the CMS. Real Estate and B2B Services need a concrete
description of what was actually delivered before that section can be written —
generic sector copy is worse than none, and inventing it would breach the
no-fabricated-claims rule.

### Junk record in the production database

The `test` project (`results: ["sdfsadf"]`) is publicly visible on `/portfolio`.
It is `isFeatured: false` so it stays out of featured sections, but it renders in
the portfolio grid. Not deleted here — deleting production data was out of scope
for this task. **Recommend removing it via `/admin/dashboard`.**
