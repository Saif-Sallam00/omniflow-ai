import { useState, useRef, type KeyboardEvent } from 'react';
import { Link } from 'wouter';
import { ArrowRight, ArrowUpRight, Bot, BarChart3, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Pillar } from '@shared/taxonomy';
import { useI18n } from '@/lib/i18n';
import { useDocumentTitle } from '@/hooks/use-document-title';

// Pillar panels. `pillar` values are taxonomy slugs (the single source of truth —
// `satisfies … Pillar` fails the build if a slug drifts). `key` is the i18n
// namespace: note the digital-marketing pillar uses the LOCAL display label
// "Marketing" (key "marketing") — the canonical taxonomy label is untouched.
// Order matches PILLARS: AI Training → Marketing → Software.
const PANELS = [
  { pillar: 'ai-training', icon: Bot, key: 'aiTraining' },
  { pillar: 'digital-marketing', icon: BarChart3, key: 'marketing' },
  { pillar: 'software', icon: Globe, key: 'software' },
] as const satisfies readonly { pillar: Pillar; icon: typeof Bot; key: string }[];

export default function Services() {
  const { t } = useI18n();
  useDocumentTitle('Services');

  const [active, setActive] = useState<Pillar>('ai-training');
  const panelRef = useRef<HTMLDivElement>(null);

  // Select a pillar and bring the detail panel into view — used by the
  // pain-router buttons, which sit far below the panel. No page reload.
  const selectAndReveal = (pillar: Pillar) => {
    setActive(pillar);
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Accessible tablist: roving tabindex + Left/Right arrow navigation.
  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    const nextPillar = PANELS[(index + dir + PANELS.length) % PANELS.length].pillar;
    setActive(nextPillar);
    requestAnimationFrame(() => document.getElementById(`tab-${nextPillar}`)?.focus());
  };

  const activePanel = PANELS.find((p) => p.pillar === active)!;
  const activeLabel = t(`services.pillar.${activePanel.key}.label`);

  return (
    <div className="min-h-screen pt-20 bg-slate-950 text-white">

      {/* === HEADER === */}
      <section className="py-20 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[60%] bg-gradient-to-bl from-orange-950/30 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 text-center">
          <p className="text-brand-400/80 text-sm font-medium tracking-wide mb-6">{t('services.eyebrow')}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {t('services.title.lead')} <span className="text-slate-500">{t('services.title.highlight')}</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('services.subhead')}
          </p>
        </div>
      </section>

      {/* === PILLAR SELECTOR + DETAIL PANEL === */}
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-6 md:px-8">

          {/* Selectable pillar tabs */}
          <div
            role="tablist"
            aria-label={t('services.eyebrow')}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10"
          >
            {PANELS.map(({ pillar, icon: Icon, key }, index) => {
              const selected = active === pillar;
              return (
                <button
                  key={pillar}
                  role="tab"
                  id={`tab-${pillar}`}
                  aria-selected={selected}
                  aria-controls="pillar-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(pillar)}
                  onKeyDown={(e) => onTabKeyDown(e, index)}
                  className={`flex items-center gap-3 rounded-xl border px-5 py-4 text-start transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    selected
                      ? 'border-brand-500/50 bg-brand-500/10 text-white shadow-card'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${selected ? 'bg-brand-500/20' : 'bg-slate-800/60'}`}>
                    <Icon className={`w-5 h-5 ${selected ? 'text-brand-400' : 'text-slate-400'}`} />
                  </span>
                  <span className="font-semibold">{t(`services.pillar.${key}.label`)}</span>
                </button>
              );
            })}
          </div>

          {/* Detail panel for the selected pillar */}
          <div
            role="tabpanel"
            id="pillar-panel"
            ref={panelRef}
            aria-labelledby={`tab-${active}`}
            tabIndex={0}
            className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/50 p-8 md:p-12 shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <h2 className="text-3xl font-bold text-white mb-3">{t(`services.pillar.${activePanel.key}.title`)}</h2>
            <p className="text-lg text-brand-400/90 font-medium mb-6">{t(`services.pillar.${activePanel.key}.tagline`)}</p>
            <p className="text-slate-400 leading-relaxed max-w-2xl mb-10">{t(`services.pillar.${activePanel.key}.body`)}</p>

            {/* Numbered process steps */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="rounded-xl bg-slate-950/50 border border-slate-800/60 p-5">
                  <div className="text-2xl font-bold text-slate-700 mb-2">{String(n).padStart(2, '0')}</div>
                  <div className="font-semibold text-white">{t(`services.pillar.${activePanel.key}.step.${n}`)}</div>
                </div>
              ))}
            </div>

            {/* Panel CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-primary text-primary-foreground font-semibold px-8 py-6 rounded-lg">
                  {t('common.cta.bookCall')}
                  <ArrowRight className="w-4 h-4 ms-2" />
                </Button>
              </Link>
              <Link href={`/portfolio?service=${active}`}>
                <Button size="lg" variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 px-8 py-6 rounded-lg">
                  {t('services.explore')} {activeLabel}
                  <ArrowUpRight className="w-4 h-4 ms-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* === PAIN ROUTER === */}
      <section className="py-24 bg-slate-900/30 border-y border-slate-800/30">
        <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-10">{t('services.painRouter.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => selectAndReveal('digital-marketing')}
              className="rounded-xl border border-slate-800 bg-slate-950/50 px-6 py-5 text-start font-medium text-slate-300 hover:border-brand-500/40 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t('services.painRouter.leads')}
            </button>
            <button
              onClick={() => selectAndReveal('software')}
              className="rounded-xl border border-slate-800 bg-slate-950/50 px-6 py-5 text-start font-medium text-slate-300 hover:border-brand-500/40 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t('services.painRouter.ops')}
            </button>
            <button
              onClick={() => selectAndReveal('ai-training')}
              className="rounded-xl border border-slate-800 bg-slate-950/50 px-6 py-5 text-start font-medium text-slate-300 hover:border-brand-500/40 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t('services.painRouter.aiAdoption')}
            </button>
            <Link href="/contact">
              <button className="w-full h-full rounded-xl border border-brand-500/40 bg-brand-500/10 px-6 py-5 text-start font-semibold text-white hover:bg-brand-500/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring inline-flex items-center justify-between gap-2">
                {t('services.painRouter.all')}
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
