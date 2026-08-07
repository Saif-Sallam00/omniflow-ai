import { Link, useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { type Project } from '@shared/schema';
import { CATEGORY_TO_PILLAR, type Pillar } from '@shared/taxonomy';
import { useI18n } from '@/lib/i18n';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { onImageError } from '@/lib/placeholder';
import { HexGlyph, type HexGlyphName } from '@/components/systems';

// =============================================================================
// CAPABILITY PAGES — /services/ai-training · /services/digital-marketing ·
// /services/software. Slugs unchanged (§0.5).
//
// These pages answer "is this my problem, and what exactly would you build?" —
// they do NOT sell. Buying intent is funnelled to /services (§6), which is why
// every CTA here points there rather than to /contact.
//
// Section order:
//   1 Hero        keyword-rich H1 (§5.1 SEO) + the constraint under it
//   2 The problem the symptoms, in the owner's words — the page's emotional hook
//   3 What we build the real product types / offers / formats, each with the
//                  constraint it removes. This is the substance the page lacked.
//   4 Where it sits how the capability appears in Foundation / Growth Engine /
//                  Scale Infrastructure, at what depth, deep-linked
//   5 Proof       related projects, hidden when empty
//   6 FAQ
//   7 CTA         → /services
//
// There is deliberately NO process section. The site already carries a process
// on the homepage (Diagnose → Design → Build → Optimize) and on Solutions
// (Strategy → three capabilities); a third, per-page variant contradicted both
// and promised a "fixed price" that the Solutions page explicitly does not.
//
// Visual system follows /services, not the older homepage generation: slate-950
// surfaces, `primary` accent (never raw orange-*), display headings, mono
// eyebrows, hexagon glyphs, and the 950/900 section alternation.
// =============================================================================

// Keyword-rich meta titles (§5.1). Slugs are unchanged, so no redirects and no
// lost index — clean labels in the nav, search terms here and in the H1.
const META_TITLES: Record<Pillar, string> = {
  'ai-training': 'AI Training & Enablement for Business Teams',
  'digital-marketing': 'Digital Marketing Systems — SEO, Paid & Conversion',
  software: 'Software Development, ERP & CRM Systems',
};

// Which solutions this capability appears in, and in what order. Marketing
// stops at Growth Engine — it is not part of Scale Infrastructure, and saying
// so is useful information rather than an omission
// (see docs/CAPABILITY-PACKAGE-MAP.md).
type SolutionRef = { id: string; nameKey: string; assessed?: boolean };

const FOUNDATION: SolutionRef = {
  id: 'foundation',
  nameKey: 'solutions.foundation.name',
  assessed: true,
};
const GROWTH: SolutionRef = { id: 'growth-engine', nameKey: 'solutions.growth.name' };
const SCALE: SolutionRef = {
  id: 'scale-infrastructure',
  nameKey: 'solutions.scale.name',
};

// `key` is the i18n namespace; `build` is how many "what we build" entries the
// page has. Counts live beside the data so the page can only ever render items
// that exist in the dictionary.
const PAGES: Record<
  Pillar,
  { key: string; glyph: HexGlyphName; pains: number; build: number; lives: SolutionRef[] }
> = {
  software: {
    key: 'software',
    glyph: 'tech',
    pains: 4,
    build: 6,
    lives: [FOUNDATION, GROWTH, SCALE],
  },
  'digital-marketing': {
    key: 'dm',
    glyph: 'marketing',
    pains: 4,
    build: 5,
    lives: [FOUNDATION, GROWTH],
  },
  'ai-training': {
    key: 'ai',
    glyph: 'ai',
    pains: 4,
    build: 4,
    lives: [FOUNDATION, GROWTH, SCALE],
  },
};

const FAQ_COUNTS: Record<Pillar, number> = {
  software: 4,
  'digital-marketing': 3,
  'ai-training': 3,
};

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

export default function ServiceDetail() {
  const [, params] = useRoute('/services/:slug');
  const { t } = useI18n();
  const slug = (params?.slug || '') as Pillar;
  const page = PAGES[slug];
  // undefined for an unknown slug → falls back to the site-wide title.
  useDocumentTitle(META_TITLES[slug]);

  // A project belongs on this pillar's page when its category rolls up to the
  // pillar (CATEGORY_TO_PILLAR).
  const { data: allProjects } = useQuery<Project[]>({ queryKey: ['/api/projects'] });
  const relatedProjects = (allProjects || []).filter(
    (p) => CATEGORY_TO_PILLAR[p.category] === slug,
  );

  if (!page) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 pt-20">
        <div className="text-center">
          <h1 className="mb-4 font-display text-3xl font-bold text-white">
            {t('serviceDetail.notFound.title')}
          </h1>
          <Link href="/services">
            <span className="inline-block rounded-lg border border-primary bg-primary px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-brand-400">
              {t('serviceDetail.notFound.button')}
            </span>
          </Link>
        </div>
      </div>
    );
  }

  const { key, glyph, pains, build, lives } = page;

  return (
    <div className="min-h-screen bg-slate-950 pt-20 text-slate-300">

      {/* ================= 1. HERO ================= */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="pointer-events-none absolute -top-40 end-[-120px] h-[520px] w-[520px] rounded-full bg-primary/[0.13] blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 md:px-8">
          <Link href="/services">
            <span className="mb-8 inline-block cursor-pointer font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400 transition-colors hover:text-white">
              {t('serviceDetail.backAll')}
            </span>
          </Link>

          <div className="flex items-start gap-4">
            <span className="flex-none pt-1">
              <HexGlyph glyph={glyph} size={30} />
            </span>
            <div>
              {/* Clean capability label above the keyword-rich H1: the label is
                  what the nav and cards use, the H1 is what search reads. */}
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                {t(`serviceDetail.${key}.label`)}
              </p>
              <h1 className="mt-3 max-w-[24ch] font-display text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl">
                {t(`serviceDetail.${key}.title`)}
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-slate-300">
            {t(`serviceDetail.${key}.desc`)}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/services" className="w-full sm:w-auto">
              <span className="block w-full rounded-lg border border-primary bg-primary px-6 py-3 text-center text-sm font-semibold text-slate-950 transition-colors hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
                {t('serviceDetail.cta.button')}
              </span>
            </Link>
            <Link href="/portfolio" className="w-full sm:w-auto">
              <span className="block w-full rounded-lg border border-slate-700 px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:border-slate-600 hover:bg-white/5">
                {t('serviceDetail.seeExamples')}
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 2. THE PROBLEM ================= */}
      {/* Display-type symptoms on hairline rules — the page's hook. Never
          compressed at mobile widths (§4). */}
      <section className="border-y border-slate-800 bg-slate-900/30 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <h2 className="max-w-[26ch] font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
            {t(`serviceDetail.${key}.pain.heading`)}
          </h2>

          <ul className="mt-8 border-t border-slate-800/40">
            {range(pains).map((n) => (
              <li
                key={n}
                className="flex items-baseline gap-4 border-b border-slate-800/40 py-4 font-display text-lg font-medium leading-snug tracking-tight text-white sm:text-xl"
              >
                <span
                  aria-hidden="true"
                  className="w-7 flex-none font-mono text-[11px] font-normal tracking-[0.1em] text-slate-400"
                >
                  {String(n).padStart(2, '0')}
                </span>
                {t(`serviceDetail.${key}.pain.item${n}`)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= 3. WHAT WE BUILD ================= */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
            {t(`serviceDetail.${key}.build.heading`)}
          </h2>
          <p className="mt-3 max-w-[66ch] leading-relaxed text-slate-400">
            {t(`serviceDetail.${key}.build.sub`)}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {range(build).map((n) => (
              <div
                key={n}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-6"
              >
                <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-white">
                  {t(`serviceDetail.${key}.build.${n}.title`)}
                </h3>

                {/* The constraint this removes, before what it is. An owner
                    recognises the symptom faster than the product name. */}
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
                  {t('solutions.grid.problem')}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-primary/90">
                  {t(`serviceDetail.${key}.build.${n}.pain`)}
                </p>

                <p className="mt-3 border-t border-slate-800/40 pt-3 text-sm leading-relaxed text-slate-400">
                  {t(`serviceDetail.${key}.build.${n}.body`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 4. WHERE THIS SITS ================= */}
      {/* Ties the capability back into the three solutions, at the depth the
          capability map defines. Without this the page is an orphan: a visitor
          can read the whole thing and still not know what to buy. */}
      <section className="border-y border-slate-800 bg-slate-900/30 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
            {t('serviceDetail.lives.heading')}
          </h2>
          <p className="mt-3 max-w-[66ch] leading-relaxed text-slate-400">
            {t('serviceDetail.lives.sub')}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {lives.map((solution) => (
              <Link key={solution.id} href={`/services#${solution.id}`}>
                <div className="card-lift group relative h-full cursor-pointer overflow-hidden rounded-e-xl border border-slate-800 bg-slate-950/60 p-6 hover:border-slate-700">
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-0 start-0 w-[2px] ${
                      solution.assessed ? 'bg-primary/30' : 'bg-primary'
                    }`}
                  />
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
                    {t(
                      solution.assessed
                        ? 'serviceDetail.lives.assessed'
                        : 'serviceDetail.lives.built',
                    )}
                  </p>
                  <p
                    dir="ltr"
                    className="mt-2 font-display text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-primary rtl:text-end"
                  >
                    {t(solution.nameKey)}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {t(`serviceDetail.${key}.lives.${solution.id}`)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 5. PROOF ================= */}
      {/* Now rendered on all three pages. It was previously suppressed on
          /services/ai-training, which left the thinnest page with the least
          evidence; the section already hides itself when empty. */}
      {relatedProjects.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
                  {t('serviceDetail.related.title')}
                </h2>
                <p className="mt-2 text-slate-400">{t('serviceDetail.related.sub')}</p>
              </div>
              <Link href="/portfolio">
                <span className="cursor-pointer whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em] text-primary transition-colors hover:text-brand-400">
                  {t('serviceDetail.related.viewPortfolio')}
                </span>
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((project) => (
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
                      <p className="mt-2 text-sm font-semibold text-brand-400">
                        {project.results[0]}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= 6. FAQ ================= */}
      <section className="border-y border-slate-800 bg-slate-900/30 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
            {t('serviceDetail.faqTitle')}
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-2">
            {range(FAQ_COUNTS[slug]).map((n) => (
              <div key={n}>
                <h3 className="font-display text-base font-semibold text-white">
                  {t(`serviceDetail.${key}.faq.${n}.q`)}
                </h3>
                <p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-slate-400">
                  {t(`serviceDetail.${key}.faq.${n}.a`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 7. CTA ================= */}
      <section className="relative overflow-hidden py-20 text-center md:py-24">
        <div className="pointer-events-none absolute -bottom-52 left-1/2 h-[420px] w-[640px] -translate-x-1/2 rounded-full bg-primary/[0.13] blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-6 md:px-8">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            {t('serviceDetail.cta.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-[56ch] leading-relaxed text-slate-400">
            {t('serviceDetail.cta.body')}
          </p>
          <Link href="/services">
            <span className="mt-7 inline-block rounded-lg border border-primary bg-primary px-7 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
              {t('serviceDetail.cta.button')}
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
