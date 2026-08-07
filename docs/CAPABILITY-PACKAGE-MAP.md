# Capability → package map

How OmniflowAI's delivery capabilities map onto the three solutions, organised by
**what a company needs at each stage** rather than by service category.

Applied to `/services` — the `solutions.*.inc*` keys in `client/src/lib/i18n.tsx`
and the `SOLUTIONS` component data in `client/src/pages/Services.tsx` implement
this map directly. Change one, change the other.

---

## 1. The stage logic

| Stage | The company's situation | What they therefore need | Router signal |
|---|---|---|---|
| **Foundation** | Feels the ceiling, can't name it | Not delivery — a decision. Every capability appears as a *question*, never a service. | q4, q5 |
| **Growth Engine** | Demand exists but arrives unpredictably, and what arrives leaks | A repeatable path from stranger → lead → customer, plus the tracking to prove it works. Constraint is **commercial**. | q1 |
| **Scale Infrastructure** | Volume is there, the operation can't carry it; adding people stops helping | The systems the business actually runs on. Constraint is **operational**. | q2, q3 |
| **Custom Transformation** | A combination the three don't cover | Designed from the diagnosis. | q6 |

"Router signal" refers to the six options in `ROUTER_OPTIONS`, which already
route to these targets.

---

## 2. Master map

Depth matters more than presence — five capabilities appear in two packages at
deliberately different scopes.

| Capability | Foundation | Growth Engine | Scale Infrastructure |
|---|---|---|---|
| Marketing Strategy & Planning | Opportunity mapped | Strategy + execution plan | — |
| SEO | Opportunity assessed | Built and implemented | — |
| Media Buying | Opportunity assessed | Campaigns built and managed | — |
| Funnel Strategy | Gaps identified | Funnel designed and optimized | — |
| Websites | Current state reviewed | CMS site, landing pages, campaign pages | Portals, internal tools, dynamic platforms |
| CRM | Stack and gaps assessed | Lead management | System of record |
| ERP | Need assessed | — | Selected, implemented, integrated |
| BD Performance Mgmt Systems | Need assessed | — | Built |
| Custom Business Applications | Opportunity identified | — | Built |
| B2B Mobile Applications | Opportunity identified | — | Built |
| Automation | Manual work mapped | Marketing + sales workflows | Cross-department processes |
| AI Enablement / employee training | Where AI pays off | Commercial teams | Org-wide + AI inside the systems |
| Data / reporting | Visibility gaps found | Marketing attribution | BI layer *(always included)* |

---

## 3. Components as built

### Foundation — `includes: [4, 4, 6, 3]`

Everything is **assessed**, nothing is delivered. Spec §2.5 is a hard rule here:
if a future edit reintroduces "build", "create" or "deliver" into any Foundation
string, the positioning breaks.

1. **Business Diagnosis** — processes and operational structure · marketing
   performance and the acquisition journey · current technology stack and its
   limits · data visibility and reporting gaps
2. **Growth and bottleneck assessment** — where opportunities are lost · which
   processes slow growth · which manual work caps scale · highest-impact areas
   to address first
3. **Marketing and technology opportunity map** — SEO and organic · paid
   acquisition and media buying · funnel and conversion · CRM and customer
   management · business automation · custom software and platforms
4. **AI opportunity identification** — which departments benefit first · which
   workflows to automate · where AI creates measurable impact

### Growth Engine — `includes: [5, 3, 4, 3]`

1. **Marketing Systems** — marketing strategy and plan · SEO and organic ·
   media buying and paid campaigns · funnel strategy and conversion
   optimization · performance tracking and attribution
2. **Conversion assets** — CMS website · landing pages · campaign pages
3. **Revenue operations** — CRM for lead capture and pipeline · lead routing
   and follow-up automation · marketing→sales handoff · data connected across
   existing tools
4. **AI Enablement** — department-specific use cases · employee AI training ·
   AI-assisted workflows inside existing processes

### Scale Infrastructure — `includes: [4, 4, 4, 3]`

Plus the **always-included Business Intelligence layer** (`scale.always`),
which is never collapsed — it carries the §0.3 inheritance logic.

1. **Core business systems** — CRM as the system of record across departments ·
   ERP platforms · business development performance management · integration
   between the core systems
2. **Custom applications** — internal business applications · custom software ·
   B2B mobile applications · customer portals and internal tools
3. **Advanced automation and AI** — cross-department workflow automation · AI
   embedded in the business systems · intelligent reporting and decision
   support · org-wide AI adoption and employee training
4. **Operational enablement** — process redesign · adoption support ·
   continuous optimization after handover

---

## 4. The boundaries — read this before editing any component body

Five capabilities appear in both Growth Engine and Scale Infrastructure. The
distinction lives in the component **`body`** line of each. If those lines get
rewritten loosely, a Growth Engine client will reasonably expect the Scale
version, and that is where scope disputes come from.

| Capability | Growth Engine means | Scale Infrastructure means |
|---|---|---|
| **CRM** | Lead capture → pipeline → follow-up. Commercial team only. | System of record across departments, integrated with ERP and custom apps. |
| **Websites** | Conversion assets — CMS site, landing pages, campaign pages. | Platforms — customer portals, internal tools, transactional applications. |
| **Automation** | Marketing and sales workflows. | Cross-department operational processes. |
| **AI Enablement** | Commercial teams, department use cases. | Org-wide adoption, plus AI inside the systems themselves. |
| **Data** | Marketing attribution and campaign performance. | BI layer across the whole business. |

---

## 5. What does not map

A standalone website, a standalone CRM setup, or a one-off campaign do not
belong to any of the three. They are the *output* of a diagnosis, not an entry
point. Anything needing a combination the three don't cover is Custom
Transformation.

AI Enablement never sells alone — it is a layer inside Growth Engine and Scale
at different depths.

> **Open contradiction.** `shared/taxonomy.ts` treats `ai-training` as a
> co-equal **pillar** with its own capability page at `/services/ai-training`,
> and §0.4 locks the three capabilities. But AI Enablement is not purchasable on
> its own. Those two facts need to agree. Not resolved here.

---

## 6. Presentation

Capability bullets use the **hexagon clip-path marker** already in the visual
language, not icons. §12.6 restricts iconography to the hexagon glyphs that mark
the three solutions and three capabilities; per-component icons would introduce
a second vocabulary. Same shape family, no new symbols.

Bullets live inside the collapsed "What's included" disclosure. What stays
visible without expanding anything is unchanged: statement, outcome, price,
Scale's always-included block, Foundation's credit strip.

---

## Files implementing this

| File | What it holds |
|---|---|
| `client/src/lib/i18n.tsx` | All copy. `solutions.{foundation,growth,scale}.inc{n}.{title,body,item{k}}`, EN + AR. |
| `client/src/pages/Services.tsx` | `SOLUTIONS[].includes` — one entry per component, value = bullet count. `SolutionCard` renders from it. |

The counts in `includes` and the keys in i18n must stay in step: the card
renders exactly `includes[i]` bullets, so a count higher than the keys present
would print a raw key on the page. The parity/coverage check used at build time:

```
node -e "…"   # see docs/SOLUTIONS-ROUTER-RECOMMENDATION.md verification section
```

## Verification

- `npm run check` (tsc) — clean.
- `npm run build` — clean. `Services` 20.25 kB / 4.87 kB gzip.
- EN/AR parity — **497/497**.
- All 71 component keys the cards request exist in both languages; no
  `solutions.*.inc*` key is orphaned.

### Not verified

Rendered appearance. The expanded disclosure is now substantially taller —
Foundation carries 17 bullets, Growth 15, Scale 15 — and the Arabic bullets run
longer. Worth looking at an expanded card at mobile width in both languages.
