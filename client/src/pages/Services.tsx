import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { type Project } from '@shared/schema';
import { useI18n } from '@/lib/i18n';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { trackEvent } from '@/lib/analytics';
import { onImageError } from '@/lib/placeholder';
import { BusinessDiagnostic, HexGlyph } from '@/components/systems';

// =============================================================================
// SOLUTIONS PAGE — route stays /services (spec §0.5: slugs do not change).
// Spec: docs/PHASE-1-SOLUTIONS-PAGE-SPEC-v2.md, §12.5 section order.
// Copy lives in i18n under `solutions.*`; nothing here is a hardcoded string.
//
// The trust strip and the problem-recognition section were REMOVED from §12.5's
// order: both restated arguments the homepage already makes (the trust strip
// reused home.reach.* verbatim; the pains and the before/after shift repeated
// the homepage's value-prop and transformation blocks). The page now assumes
// the visitor is past the premise and gets them to the diagnostic sooner.
//
// Surface rhythm alternates between the two darkest surfaces (§12.6):
//   hero 950 · router 900 · solutions 950 · custom ORANGE ·
//   how-we-work 950 · proof 950 · faq 900 · final CTA 950.
// Proof is DB-driven and disappears when empty, so it deliberately repeats the
// 950 of the section above it — hiding it must not break the alternation.
// =============================================================================

type SolutionId = 'foundation' | 'growth-engine' | 'scale-infrastructure' | 'custom';

// The three solutions, in order. `key` is the i18n namespace; `id` is both the
// DOM id and the deep-link anchor.
//
// `priceFloor` is the FLOOR, not the price — the card frames it with
// "Starting from" and the final number comes with the proposal (spec §0.8,
// FAQ q3). USD, written out in full rather than abbreviated: "k" is an English
// abbreviation with no clean Arabic equivalent, and §12.7 requires the same
// Western figure to render identically in both languages. Setting one of these
// back to null falls the card through to "Pricing on request" (§10.1).
// Custom Transformation carries no figure at all — it is priced after the
// business diagnosis (solutions.custom.price).
// `includes` has one entry per component (`inc{n}`, in order); the value is how
// many `item{k}` capability bullets that component carries. Keeping the counts
// beside the data means the card renders exactly what exists in i18n — a
// mismatch can never surface a raw key on the page.
//
// The components map the capability set onto what a company needs at each
// stage; see docs/CAPABILITY-PACKAGE-MAP.md. Capabilities shared between Growth
// Engine and Scale Infrastructure (CRM, websites, automation, AI, reporting)
// appear in both at deliberately different depths — the component `body` lines
// carry that boundary, and they are what stop the two solutions overlapping.
const SOLUTIONS = [
  {
    id: 'foundation',
    key: 'foundation',
    includes: [4, 4, 6, 3],
    priceFloor: '$1,000' as string | null,
    priceNoteKey: 'solutions.grid.priceNote1',
  },
  {
    id: 'growth-engine',
    key: 'growth',
    includes: [5, 3, 4, 3],
    priceFloor: '$7,000' as string | null,
    priceNoteKey: 'solutions.grid.priceNote2',
  },
  {
    id: 'scale-infrastructure',
    key: 'scale',
    includes: [4, 4, 4, 3],
    priceFloor: '$30,000' as string | null,
    priceNoteKey: 'solutions.grid.priceNote2',
  },
] as const;

// Router options 01–06 and where each one lands (spec §2.3, as amended by §12.1).
const ROUTER_OPTIONS = [
  { target: 'growth-engine' },
  { target: 'scale-infrastructure' },
  { target: 'scale-infrastructure' },
  { target: 'foundation' },
  { target: 'foundation' },
  { target: 'custom' },
] as const satisfies readonly { target: SolutionId }[];

// The router starts answered, on q1 → Growth Engine.
//
// An unanswered router leaves three equal cards and no guidance at the exact
// moment the visitor has to choose, and it is the router — not a hardcoded
// badge — that decides which card is marked Recommended. Pre-answering keeps
// that recommendation EARNED: it always follows a stated constraint, so it
// stays consistent with §0 decision 1 (paths, not tiers) rather than asserting
// a ranking. It is a starting assumption the visitor overrides in one click,
// never a claim about them or about anyone else.
//
// It must never fire the GA `router_select` event — see onRouterSelect.
const DEFAULT_ROUTER_INDEX = 0;

const SOLUTION_NAME_KEY: Record<SolutionId, string> = {
  foundation: 'solutions.foundation.name',
  'growth-engine': 'solutions.growth.name',
  'scale-infrastructure': 'solutions.scale.name',
  custom: 'solutions.custom.name',
};

const DEEP_LINK_IDS: readonly string[] = Object.keys(SOLUTION_NAME_KEY);

// The three capability cards under "How we work". Slugs unchanged (§5).
const CAPABILITIES = [
  { key: 'marketing', href: '/services/digital-marketing', glyph: 'marketing' },
  { key: 'tech', href: '/services/software', glyph: 'tech' },
  { key: 'ai', href: '/services/ai-training', glyph: 'ai' },
] as const;

const FAQ_ITEMS = [1, 2, 3, 4, 5, 6, 7] as const;

// Western numerals in both languages (spec §12.7).
const pad2 = (n: number) => String(n).padStart(2, '0');

// Solution names stay Latin in both languages, so in Arabic they are LTR runs
// inside an RTL sentence. Longest-first so "Scale Infrastructure" is matched
// before a bare "Foundation" style prefix could ever partially match.
const SOLUTION_NAMES = /(Custom Transformation|Scale Infrastructure|Growth Engine|Foundation)/;

/**
 * Wraps any solution name occurring inside a translated sentence in
 * `dir="ltr"`, which the UA stylesheet gives `unicode-bidi: isolate` — the
 * name can never be reordered against the Arabic text around it. Returns the
 * plain string untouched when there is nothing to isolate.
 */
function ltrNames(text: string): ReactNode {
  const parts = text.split(SOLUTION_NAMES);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} dir="ltr">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export default function Solutions() {
  const { t } = useI18n();
  useDocumentTitle('Solutions');
  const reduced = useReducedMotion();

  const [selected, setSelected] = useState<number>(DEFAULT_ROUTER_INDEX);
  const [highlighted, setHighlighted] = useState<SolutionId | null>(null);
  const highlightTimer = useRef<number>();
  const routerRef = useRef<HTMLElement>(null);

  // Scroll to a solution block and flash a highlight ring on it. `scroll-mt-*`
  // on the targets supplies the sticky-header offset, so no manual maths.
  const revealSolution = useCallback(
    (id: SolutionId) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      window.clearTimeout(highlightTimer.current);
      // Clear first, then set on the next frame, so re-selecting the same block
      // restarts the highlight instead of leaving it looking stale.
      setHighlighted(null);
      requestAnimationFrame(() => setHighlighted(id));
      highlightTimer.current = window.setTimeout(() => setHighlighted(null), 2000);
    },
    [reduced],
  );

  // Deep links: #foundation, #growth-engine, #scale-infrastructure, #custom.
  // Runs once — App's ScrollToTop resets the window on mount, so this is
  // deferred a frame to land after it.
  const deepLinked = useRef(false);
  useEffect(() => {
    if (deepLinked.current) return;
    deepLinked.current = true;
    const id = window.location.hash.slice(1);
    if (!DEEP_LINK_IDS.includes(id)) return;
    const frame = requestAnimationFrame(() => revealSolution(id as SolutionId));
    return () => cancelAnimationFrame(frame);
  }, [revealSolution]);

  useEffect(() => () => window.clearTimeout(highlightTimer.current), []);

  // Only ever called from a real selection, never on mount. NOTE: now that the
  // router starts answered, this event means "changed away from the default",
  // not "chose" — visitors who agree with q1 never fire it. Read the data with
  // that in mind.
  const onRouterSelect = (index: number) => {
    setSelected(index);
    const target = ROUTER_OPTIONS[index].target;
    // GA4: which constraint traffic self-identifies with, and where it routes.
    trackEvent('router_select', 'solutions_router', target, index + 1);
    revealSolution(target);
  };

  const { data: projects } = useQuery<Project[]>({ queryKey: ['/api/projects'] });
  const featured = (projects || []).filter((p) => p.isFeatured);

  const recommended = ROUTER_OPTIONS[selected].target;

  return (
    <div className="min-h-screen pt-20 bg-slate-950 text-slate-300">

      {/* ================= 1. HERO ================= */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="pointer-events-none absolute -top-40 end-[-120px] h-[520px] w-[520px] rounded-full bg-primary/[0.13] blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 md:px-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Eyebrow>{t('solutions.eyebrow')}</Eyebrow>
            <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl">
              {t('solutions.h1.lead')}{' '}
              <span className="text-primary">{t('solutions.h1.accent')}</span>
            </h1>
            <p className="mt-5 max-w-[46ch] leading-relaxed text-slate-300">
              {t('solutions.subhead')}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/contact" className="w-full sm:w-auto">
                <span className="block w-full rounded-lg border border-primary bg-primary px-6 py-3 text-center text-sm font-semibold text-slate-950 transition-colors hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
                  {t('common.cta.bookCall')}
                </span>
              </Link>
              <button
                type="button"
                onClick={() =>
                  routerRef.current?.scrollIntoView({
                    behavior: reduced ? 'auto' : 'smooth',
                    block: 'start',
                  })
                }
                className="w-full rounded-lg border border-slate-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-slate-600 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
              >
                {t('solutions.hero.secondary')}
              </button>
            </div>
          </div>

          {/* Signature visual. Self-contained — it reads its own copy and
              handles its own motion gating, so the hero passes it nothing. */}
          <BusinessDiagnostic />
        </div>
      </section>

      {/* ================= 2. DIAGNOSTIC ROUTER ================= */}
      <section
        ref={routerRef}
        id="router"
        className="scroll-mt-24 border-y border-slate-800 bg-slate-900/30 py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <Eyebrow>{t('solutions.router.eyebrow')}</Eyebrow>
          <h2
            id="router-heading"
            className="font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl"
          >
            {t('solutions.router.heading')}
          </h2>
          <p id="router-sub" className="mt-3 max-w-[66ch] leading-relaxed text-slate-400">
            {t('solutions.router.sub')}
          </p>

          {/* Single-select, no submit button. Native radios keep arrow-key
              navigation and screen-reader semantics for free. */}
          <div
            role="radiogroup"
            aria-labelledby="router-heading"
            aria-describedby="router-sub"
            className="mt-8 grid grid-cols-1 gap-2.5 md:grid-cols-2"
          >
            {ROUTER_OPTIONS.map((_, i) => {
              const isOn = selected === i;
              return (
                <label
                  key={i}
                  className={`group flex min-h-[3.25rem] cursor-pointer items-start gap-4 rounded-lg border p-4 transition-colors focus-within:ring-2 focus-within:ring-ring sm:p-5 ${
                    isOn
                      ? 'border-primary bg-primary/[0.13]'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="growth-constraint"
                    className="sr-only"
                    checked={isOn}
                    onChange={() => onRouterSelect(i)}
                  />
                  <span
                    aria-hidden="true"
                    className={`flex-none pt-0.5 font-mono text-[11px] tracking-[0.1em] ${
                      isOn ? 'text-primary' : 'text-slate-400'
                    }`}
                  >
                    {pad2(i + 1)}
                  </span>
                  <span
                    className={`font-display text-base font-medium leading-snug tracking-tight ${
                      isOn ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {t(`solutions.router.q${i + 1}`)}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Recommendation. Always present — the router starts answered — so
              aria-live announces only genuine changes, not the initial state. */}
          <div aria-live="polite">
            <div className="relative mt-4 flex flex-wrap items-center gap-6 overflow-hidden rounded-e-xl border border-primary/30 bg-slate-950/60 p-5 sm:p-6">
              {/* Accent rule as an element, not a border side — mirrors in RTL
                  without depending on utility ordering. */}
              <span aria-hidden="true" className="absolute inset-y-0 start-0 w-[3px] bg-primary" />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                  {t('solutions.router.resultLabel')}
                </p>
                <p
                  dir="ltr"
                  className="mt-1 font-display text-2xl font-bold tracking-tight text-white rtl:text-end"
                >
                  {t(SOLUTION_NAME_KEY[recommended])}
                </p>
              </div>
              <p className="min-w-[15rem] flex-1 text-sm leading-relaxed text-slate-400">
                {ltrNames(t(`solutions.router.r${selected + 1}`))}
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-400">
            <Link href="/contact">
              <span className="cursor-pointer underline decoration-slate-700 underline-offset-4 transition-colors hover:text-white hover:decoration-primary">
                {t('solutions.router.unsure')}
              </span>
            </Link>
          </p>
        </div>
      </section>

      {/* ================= 3. THE THREE SOLUTIONS ================= */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
            {t('solutions.grid.heading')}
          </h2>
          <p className="mt-3 max-w-[66ch] leading-relaxed text-slate-400">
            {t('solutions.grid.sub')}
          </p>
          {/* Explains the badge for anyone who scrolled past the router, and
              keeps it honest: the mark follows the selected constraint. */}
          <p className="mt-2 max-w-[66ch] text-sm leading-relaxed text-slate-400">
            {t('solutions.grid.recommendedNote')}
          </p>

          {/* §3.1 called for three cards of equal weight and no badge. That is
              superseded here: one card is marked Recommended, driven by the
              router's answer rather than by a fixed ranking, so the mark moves
              with the constraint and never asserts a tier. */}
          <div className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-3">
            {SOLUTIONS.map((s) => (
              <SolutionCard
                key={s.id}
                solution={s}
                highlighted={highlighted === s.id}
                recommended={recommended === s.id}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= 4. CUSTOM TRANSFORMATION ================= */}
      {/* The single inverted section on the page — a band, not a fourth card. */}
      <section
        id="custom"
        className={`scroll-mt-24 bg-primary py-16 transition-shadow md:py-20 ${
          highlighted === 'custom' ? 'ring-4 ring-inset ring-slate-950/60' : ''
        }`}
      >
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          {/* q6 routes here, so the band carries the same mark as the cards —
              inverted for the accent background. */}
          {recommended === 'custom' && (
            <p className="mb-4 inline-block rounded-full bg-slate-950 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
              {t('solutions.grid.recommended')}
            </p>
          )}
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-950/80">
            {t('solutions.custom.eyebrow')}
          </p>
          <h2 className="mt-4 max-w-[19ch] font-display text-2xl font-bold leading-tight tracking-tight text-slate-950 sm:text-3xl md:text-4xl">
            {t('solutions.custom.heading')}
          </h2>
          <p className="mt-4 max-w-[62ch] leading-relaxed text-slate-950/80">
            {ltrNames(t('solutions.custom.body'))}
          </p>
          <p
            dir="ltr"
            className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-950 rtl:text-end"
          >
            {t('solutions.custom.name')}
          </p>
          <div className="mt-6 flex flex-col flex-wrap items-stretch gap-4 sm:flex-row sm:items-center">
            <Link href="/contact?service=custom" className="w-full sm:w-auto">
              <span className="block w-full rounded-lg border border-slate-950 bg-slate-950 px-6 py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-primary">
                {t('common.cta.bookCall')}
              </span>
            </Link>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-950/80">
              {t('solutions.custom.price')}
            </p>
          </div>
        </div>
      </section>

      {/* ================= 5. HOW WE WORK ================= */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
            {t('solutions.work.heading')}
          </h2>

          {/* Strategy is method, not a capability card (§0.4). */}
          <div className="relative mt-7 overflow-hidden rounded-e-xl border border-slate-800 bg-slate-900/40 p-6">
            <span aria-hidden="true" className="absolute inset-y-0 start-0 w-[2px] bg-primary" />
            <h3 className="font-display text-lg font-semibold text-white">
              {t('solutions.work.strategy.label')}
            </h3>
            <p className="mt-2 max-w-[80ch] leading-relaxed text-slate-400">
              {t('solutions.work.strategy.body')}
            </p>
          </div>

          <p className="my-6 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
            {t('solutions.work.divider')}
          </p>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {CAPABILITIES.map((c) => (
              <Link key={c.key} href={c.href}>
                <div className="card-lift group h-full cursor-pointer rounded-xl border border-slate-800 bg-slate-900/40 p-6 hover:border-slate-700">
                  <HexGlyph size={26} glyph={c.glyph} />
                  <h3 className="mt-3.5 font-display text-base font-semibold text-white transition-colors group-hover:text-primary">
                    {t(`solutions.work.${c.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {t(`solutions.work.${c.key}.body`)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 6. PROOF (hidden entirely when empty) ================= */}
      {featured.length > 0 && (
        <section className="border-t border-slate-800/40 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
              {t('solutions.proof.heading')}
            </h2>
            <p className="mt-3 max-w-[66ch] leading-relaxed text-slate-400">
              {t('solutions.proof.sub')}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((project) => (
                <Link key={project.id} href={`/portfolio/${project.id}`}>
                  <div className="group cursor-pointer">
                    <div className="card-lift relative mb-4 aspect-[4/3] overflow-hidden rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-700">
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        onError={onImageError}
                        className="h-full w-full transform object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="mb-1 font-display text-lg font-semibold text-white transition-colors group-hover:text-primary">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-400">{t(`category.${project.category}`)}</p>
                    {/* Real CMS-entered result. Renders nothing when absent. */}
                    {project.results?.[0] && (
                      <p className="mt-2 text-sm font-semibold text-brand-400">{project.results[0]}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= 7. FAQ ================= */}
      <section className="border-y border-slate-800 bg-slate-900/30 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
            {t('solutions.faq.heading')}
          </h2>
          <div className="mt-6 border-t border-slate-800/40">
            {FAQ_ITEMS.map((n) => (
              <Disclosure
                key={n}
                id={`faq-${n}`}
                label={ltrNames(t(`solutions.faq.q${n}`))}
                labelClassName="font-display text-base font-medium text-white"
              >
                <p className="max-w-[80ch] pb-4 text-sm leading-relaxed text-slate-400">
                  {ltrNames(t(`solutions.faq.a${n}`))}
                </p>
              </Disclosure>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 8. FINAL CTA ================= */}
      <section className="relative overflow-hidden py-20 text-center md:py-24">
        <div className="pointer-events-none absolute -bottom-52 left-1/2 h-[420px] w-[640px] -translate-x-1/2 rounded-full bg-primary/[0.13] blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-6 md:px-8">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            {t('solutions.cta.heading')}
          </h2>
          <p className="mx-auto mt-4 max-w-[56ch] leading-relaxed text-slate-400">
            {t('solutions.cta.body')}
          </p>
          <Link href="/contact">
            <span className="mt-7 inline-block rounded-lg border border-primary bg-primary px-7 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
              {t('common.cta.bookCall')}
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}

// =============================================================================
// Local building blocks
// =============================================================================

/** Mono eyebrow with the trailing hairline rule used across the page. */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
      {children}
      <span aria-hidden="true" className="h-px flex-1 bg-slate-800" />
    </span>
  );
}

/**
 * Collapsible section. Native button + aria-expanded; the panel is collapsed,
 * never removed, so the content stays reachable at every width.
 */
function Disclosure({
  id,
  label,
  labelClassName = '',
  children,
}: {
  id: string;
  label: ReactNode;
  labelClassName?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-[2.75rem] w-full items-center justify-between gap-4 border-b border-slate-800/40 py-3.5 text-start text-sm text-slate-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className={labelClassName}>{label}</span>
        {/* "+" / "−" rather than a chevron: nothing to mirror in RTL. */}
        <span aria-hidden="true" className="flex-none text-lg leading-none text-primary">
          {open ? '−' : '+'}
        </span>
      </button>
      <div id={`${id}-panel`} className={open ? 'block' : 'hidden'}>
        {children}
      </div>
    </div>
  );
}

/**
 * One solution card. Statement, outcome and price are always visible; Best for,
 * The problem and the inclusion list live in the collapsed disclosure (§4).
 * Scale's "Always included" block and Foundation's credit strip are never
 * collapsed.
 */
function SolutionCard({
  solution,
  highlighted,
  recommended,
}: {
  solution: (typeof SOLUTIONS)[number];
  highlighted: boolean;
  recommended: boolean;
}) {
  const { t } = useI18n();
  const { id, key, includes, priceFloor, priceNoteKey } = solution;
  const isScale = key === 'scale';
  const isFoundation = key === 'foundation';

  return (
    <div
      id={id}
      className={`relative flex scroll-mt-24 flex-col rounded-xl border p-6 transition-colors duration-300 ${
        recommended ? 'bg-primary/[0.05]' : 'bg-slate-900/50'
      } ${
        highlighted
          ? 'border-primary ring-2 ring-primary/60'
          : recommended
            ? 'border-primary/60'
            : 'border-slate-800'
      }`}
    >
      {/* Straddles the top border so the badge reads as part of the frame and
          costs the other two cards no vertical alignment. */}
      {recommended && (
        <p className="absolute -top-px start-6 -translate-y-1/2 rounded-full border border-primary bg-slate-950 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
          {t('solutions.grid.recommended')}
        </p>
      )}

      <HexGlyph glyph={id} />

      <p
        dir="ltr"
        className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-primary rtl:text-end"
      >
        {t(`solutions.${key}.name`)}
      </p>

      <h3 className="mt-2.5 font-display text-xl font-semibold leading-snug tracking-tight text-white">
        {t(`solutions.${key}.statement`)}
      </h3>

      <div className="mt-3 border-t border-slate-800/40 pt-3.5">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
          {t('solutions.grid.outcomeLabel')}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">
          {t(`solutions.${key}.outcomeShort`)}
        </p>
      </div>

      {/* Scale's inheritance signal — legible without expanding anything (§3.1). */}
      {isScale && (
        <div className="mt-3.5 rounded-lg border border-primary/30 bg-primary/[0.13] p-3.5">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
            {t('solutions.scale.alwaysLabel')}
          </p>
          <p className="text-xs leading-relaxed text-slate-300">{t('solutions.scale.always')}</p>
        </div>
      )}

      <div className="mt-4">
        <Disclosure id={`inc-${id}`} label={t('solutions.grid.included')}>
          <div className="space-y-4 py-4">
            <p className="text-sm leading-relaxed text-slate-300">
              {ltrNames(t(`solutions.${key}.tagline`))}
            </p>

            <Field label={t('solutions.grid.bestFor')} body={ltrNames(t(`solutions.${key}.bestFor`))} />
            <Field label={t('solutions.grid.problem')} body={ltrNames(t(`solutions.${key}.problem`))} />

            {isScale && (
              <p className="text-xs leading-relaxed text-slate-400">
                {t('solutions.scale.expandsLabel')}
              </p>
            )}

            <ul className="space-y-4">
              {includes.map((itemCount, idx) => {
                const n = idx + 1;
                return (
                  <li key={n}>
                    <p className="text-sm font-medium text-white">
                      {t(`solutions.${key}.inc${n}.title`)}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                      {t(`solutions.${key}.inc${n}.body`)}
                    </p>
                    {/* Named capabilities. The marker is the hexagon bullet from
                        the existing visual language — §12.6 keeps iconography to
                        the hexagon glyphs, so no per-component icons. */}
                    <ul className="mt-2 space-y-1.5">
                      {Array.from({ length: itemCount }, (_, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-300"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[6px] h-1.5 w-[5px] flex-none bg-primary/70 [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]"
                          />
                          {t(`solutions.${key}.inc${n}.item${i + 1}`)}
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>

            <Field label={t('solutions.grid.outcome')} body={ltrNames(t(`solutions.${key}.outcome`))} />

            {isFoundation && (
              <p className="text-xs leading-relaxed text-slate-400">
                {ltrNames(t('solutions.foundation.note'))}
              </p>
            )}
          </div>
        </Disclosure>
      </div>

      {/* Price — never collapsed, never truncated. */}
      <div className="mt-auto pt-5">
        {priceFloor ? (
          <>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400">
              {t('solutions.grid.priceFrom')}
            </p>
            <p
              dir="ltr"
              className="mt-1 font-display text-3xl font-bold tracking-tight text-white rtl:text-end"
            >
              {priceFloor}
            </p>
          </>
        ) : (
          // Dormant since the floors landed. Kept as the §10.1 escape hatch:
          // if a floor ever has to be pulled, null its priceFloor rather than
          // inventing a placeholder figure.
          <p className="font-display text-xl font-bold tracking-tight text-white">
            {t('solutions.grid.priceOnRequest')}
          </p>
        )}
        <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{t(priceNoteKey)}</p>

        {/* The single non-accent highlight on the page (§12.6). Never collapsed. */}
        {isFoundation && (
          <p className="mt-3 rounded-lg border border-[#7DDBA3]/30 bg-[#7DDBA3]/[0.08] p-3 text-[11px] leading-relaxed text-[#7DDBA3]">
            {ltrNames(t('solutions.foundation.credit'))}
          </p>
        )}

        {/* Per-solution CTA. Same label as every other CTA site-wide (§0.10);
            the `service` param lands the solution on the lead record, so which
            card produced the enquiry is recorded rather than inferred.
            Filled on the recommended card, outlined on the others — hierarchy
            without three competing fills. */}
        <Link href={`/contact?service=${id}`} className="mt-5 block">
          <span
            className={`block w-full rounded-lg border px-5 py-3 text-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
              recommended
                ? 'border-primary bg-primary text-slate-950 hover:bg-brand-400'
                : 'border-slate-700 text-white hover:border-slate-600 hover:bg-white/5'
            }`}
          >
            {t('common.cta.bookCall')}
          </span>
        </Link>
      </div>
    </div>
  );
}

function Field({ label, body }: { label: string; body: ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-400">{body}</p>
    </div>
  );
}
