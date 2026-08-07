# Solutions — conversion pass

Scoped changes to `/services`: two sections removed, a router-driven
recommendation, and per-solution CTAs. §0 locked decisions are otherwise
untouched.

---

## 0. Trust strip and problem recognition removed

Both were cut from §12.5's order. They restated the homepage rather than adding
anything the Solutions page needed:

| Removed section | What it duplicated on the homepage |
|---|---|
| Trust strip (§12.3) | Homepage §2 — and it reused `home.reach.stat1–3` **verbatim**, the same three figures |
| Problem recognition: five pains + close | Homepage §3 value prop — "most companies don't have a marketing problem, they have a systems problem" is the same argument |
| The shift chain: "What you're running on → What it becomes" | Homepage §5 Before/After — "from scattered tools to one connected system", the same device with near-identical rows |

A visitor arriving from the homepage was reading the systems-problem argument
for the second time before reaching anything they could buy. The page now
assumes the premise is already made and gets to the diagnostic immediately.

**Resulting order:** Hero → Diagnostic router → Three solutions → Custom
Transformation → How we work → Proof → FAQ → Final CTA. Eight sections, down
from ten. The §12.6 surface rhythm still alternates.

**Orphaned by the removal and deleted:** `solutions.trust.label`,
`solutions.problem.*` (8 keys), `solutions.shift.*` (13 keys) — 22 keys in each
language. Plus the `ShiftChain` component, the `SHIFT_ROWS` and `PROBLEM_ITEMS`
constants, and the now-unused `isRTL` binding. `pad2` stays (the router uses it).
The homepage keys these duplicated are **untouched** and still in use on Home.

**Side effect worth noting:** the hero's secondary CTA ("Find your constraint")
scrolls to the router, which is now the very next section. Still functional,
close to redundant. Left alone — changing it was out of scope.

---

## What changed and why

### 1. The router starts answered (q1 → Growth Engine)

Previously the router opened empty, so the first thing a visitor met at the
decision point was three cards of deliberately equal weight and no guidance.

The alternative considered and rejected was a **static** "Recommended" badge on
Growth Engine. That breaks the positioning: recommending before diagnosing
contradicts Foundation's entire promise ("find the constraint before spending
on solutions"), and it is not defensible — recommended on what basis?

Pre-answering the router solves the same conversion problem without that cost.
The recommendation is always **earned by a stated constraint**, so:

- it never asserts that one solution outranks another — §0 decision 1 (paths,
  not tiers) survives;
- it moves. Pick a different constraint and the mark moves with it, which is
  itself a demonstration of the diagnostic model;
- it is a starting assumption the visitor overrides in one click, not a claim
  about them and not a claim about what other companies choose.

`DEFAULT_ROUTER_INDEX` at the top of `Services.tsx` is the single place this is
set.

### 2. "Recommended" mark on the matching solution

Driven by `recommended`, so it lands on whichever of the four the router points
at — including the Custom Transformation band (q6), where it renders inverted
for the accent background.

`solutions.grid.recommendedNote` sits under the section sub and explains the
mechanism. Without it the badge reads as a fixed ranking to anyone who scrolled
past the router, which is exactly the meaning this design avoids.

### 3. Per-solution CTAs

The three cards previously had **no CTA at all** — the money section on the page
had no action in it.

Each card now ends with "Book a strategy call" (the one site-wide CTA label,
§0.10) linking to `/contact?service=<id>`. Filled on the recommended card,
outlined on the other two: hierarchy without three competing fills. All three
align at the card foot because they sit inside the existing `mt-auto` price
block.

### 4. Contact form honours `?service=`

`Contact.tsx` now reads the param and pre-selects the matching option, using the
same `URLSearchParams` idiom as `Portfolio.tsx`. The solution ids already match
`CONTACT_SERVICES` exactly, so no mapping is needed.

This is what makes the per-card CTAs worth having: the lead record carries which
card produced the enquiry rather than it being inferred from the message.

**§6's rule is preserved** — an absent or unrecognised param still falls back to
`not-sure`. The form never pre-selects a service on its own; it only honours a
choice the visitor made by clicking a specific solution.

---

## Deviations from the spec

| Spec | This build | Rationale |
|---|---|---|
| §3.1 "Equal visual weight — no 'recommended' badge, no highlighted middle card" | One card carries a Recommended mark, an accent border and a filled CTA | Superseded deliberately. The mark is router-driven, not fixed, so it does not create a tier — which was §3.1's actual concern. The equal-weight rule assumed a *static* badge. |
| §6 "Default changes to 'Not sure yet' — the current pre-selection silently biases every lead record" | Upheld. Only an explicit `?service=` from a solution CTA overrides. | Not a silent bias: the value comes from the visitor's own click on a named solution. |

---

## Analytics — the meaning of `router_select` has changed

`trackEvent('router_select', ...)` still fires **only on real interaction**, never
on mount. Firing it for the default would log a choice nobody made on every
pageview and destroy the dataset.

But the consequence is that the event now means **"changed away from q1"**, not
"chose". Visitors who agree with the default never fire it, so agreement is
invisible.

Read historical and future data accordingly — they are not comparable across
this change. If the distribution of self-identified constraints matters (it
feeds Phase 2 pricing), that needs a separate event for "accepted the default",
which was not added here.

---

## Files changed

| File | Change |
|---|---|
| `client/src/pages/Services.tsx` | Trust strip and problem-recognition sections deleted, remaining sections renumbered 1–8; `ShiftChain`, `SHIFT_ROWS`, `PROBLEM_ITEMS` and the `isRTL` binding removed with them. `DEFAULT_ROUTER_INDEX`; `selected` is now always a number; result panel always renders; `recommended` passed into `SolutionCard`; Recommended mark on the card and on the Custom band; per-card CTA; Custom band CTA carries `?service=custom`. |
| `client/src/pages/Contact.tsx` | `requestedService()` reads `?service=` and validates against `CONTACT_SERVICES`, falling back to `not-sure`. |
| `client/src/lib/i18n.tsx` | Removed 22 orphaned `solutions.trust/problem/shift.*` keys per language; added `solutions.grid.recommended` and `solutions.grid.recommendedNote`. Parity **446/446**. |

## Placeholders / TODOs left behind

None. No new `TODO(...)` markers. The Recommended mark makes no factual claim
about other customers, so nothing here needs data to back it.

`solutions.grid.detailLink` ("See the full solution") remains unused — the
Phase 1b detail pages do not exist, and a link to them would 404. Left alone.

## Verification

- `npm run check` (tsc) — clean.
- `npm run build` — clean. `Services` 19.84 kB (from 21.89 — the two removed
  sections outweigh the CTAs and badge), `Contact` 45.62 kB (from 45.47).
- EN/AR parity — 446/446, and no `solutions.trust/problem/shift.*` key survives
  in either language.
- Grep confirms no dangling reference to the removed keys, components or
  constants anywhere in `client/`, `server/` or `shared/`.
- `home.reach.*` confirmed still referenced by `Home.tsx` — the shared figures
  were not touched.
- Route matching confirmed: wouter matches on pathname, so `/contact?service=x`
  still resolves to `<Route path="/contact">` while `window.location.search`
  carries the param — the same mechanism `Portfolio.tsx` already relies on.

### Not verified

Rendered appearance. No browser was driven. Specifically unchecked:

- the badge straddling the card's top border at all three breakpoints, and in
  Arabic where "موصى به" is shorter than "Recommended";
- the inverted badge on the orange Custom band;
- the end-to-end param flow (click card CTA → contact form shows that solution).

### Known side effect

The result panel now renders on load, adding roughly 120px between the router
and the cards. That pushes the packages slightly further down a page already
flagged as too long before its first price.
