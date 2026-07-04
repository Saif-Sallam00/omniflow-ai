import { Link } from "wouter";
import {
  ArrowRight,
  Bot,
  Target,
  Layers,
  Workflow,
  Users,
  Compass,
  CheckCircle2,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { Project } from '@shared/schema';
import { type Category } from '@shared/taxonomy';
import { onImageError } from '@/lib/placeholder';
import { useI18n } from '@/lib/i18n';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { useInView } from '@/hooks/use-in-view';
import { InteractiveSystemMap, HexGridSubstrate, type InteractiveNode } from '@/components/systems';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

// --- CLIENT IMPORTS ---
import Ipec from '@/assets/clients/Ipec.png';
import electromeca from '@/assets/clients/electromeca.png';
import n2oosh from '@/assets/clients/n2oosh.png';
import Petra from '@/assets/clients/Petra.png';
import DarELmaaly from '@/assets/clients/Dar-ELmaaly.png';
import elkhateer from '@/assets/clients/elkhateer.png';
import Madrid from '@/assets/clients/Madrid.png';
import BeitEl3tara from '@/assets/clients/Beit_el3tara.png';
import RelianceHub from '@/assets/clients/Reliance Hub.png';
import elmodhsh from '@/assets/clients/elmodhsh.png';
import Decork from '@/assets/clients/Decork.png';
import Princess from '@/assets/clients/Princess.png';
import naas from '@/assets/clients/naas.png';
import ta2deer from '@/assets/clients/ta2deer.png';
import Gzour from '@/assets/clients/Gzour.png';
import mashareeb from '@/assets/clients/mashareeb.png';
import Cutz from '@/assets/clients/Cutz.png';
import kayan from '@/assets/clients/kayan.png';
import darat from '@/assets/clients/darat.png';
import rafeek from '@/assets/clients/rafeek.png';
import fiveMinutes from '@/assets/clients/5minutes.jpg';
import alforat from '@/assets/clients/alforat.jpg';
import arcade from '@/assets/clients/arcade.png';
import cleaning from '@/assets/clients/cleaning.png';
import elgabry from '@/assets/clients/elgabry.jpg';
import gewiss from '@/assets/clients/gewiss.jpg';
import imagehome from '@/assets/clients/imagehome.jpg';
import jotun from '@/assets/clients/jotun.jpg';
import majarrah from '@/assets/clients/majarrah.jpg';
import oem from '@/assets/clients/oem.png';
import pioneer from '@/assets/clients/pioneer.jpg';
import thaki from '@/assets/clients/thaki.jpg';

const pillars = [
  { icon: Bot, titleKey: "pillars.aiTraining.title", bodyKey: "pillars.aiTraining.body", href: "/services/ai-training" },
  { icon: Target, titleKey: "pillars.digitalMarketing.title", bodyKey: "pillars.digitalMarketing.body", href: "/services/digital-marketing" },
  { icon: Layers, titleKey: "pillars.software.title", bodyKey: "pillars.software.body", subcapsKey: "pillars.software.subcaps", href: "/services/software" },
];

const transformBefore = ["home.transform.before.1", "home.transform.before.2", "home.transform.before.3", "home.transform.before.4"];
const transformAfter = ["home.transform.after.1", "home.transform.after.2", "home.transform.after.3", "home.transform.after.4"];

// Client-reach stats (Section 2 trust strip). Founder-provided real facts, rendered
// verbatim. `text: true` = the value is a phrase, not a numeral, so it uses the
// smaller value size instead of the large numeral treatment.
const reachStats = [
  { valueKey: "home.reach.stat1.value", labelKey: "home.reach.stat1.label", text: false },
  { valueKey: "home.reach.stat2.value", labelKey: "home.reach.stat2.label", text: false },
  { valueKey: "home.reach.stat3.value", labelKey: "home.reach.stat3.label", text: true },
];

const howWeWork = [
  { step: "01", titleKey: "home.how.diagnose.title", descKey: "home.how.diagnose.desc" },
  { step: "02", titleKey: "home.how.design.title", descKey: "home.how.design.desc" },
  { step: "03", titleKey: "home.how.build.title", descKey: "home.how.build.desc" },
  { step: "04", titleKey: "home.how.optimize.title", descKey: "home.how.optimize.desc" },
];

// Ordering for the (DB-driven) proof section: Business Systems → Automation →
// Marketing → Web, then anything else. Projects with no category order sort last.
const PROOF_ORDER: Category[] = ['business-systems', 'automation', 'digital-marketing', 'web', 'mobile', 'ai-training'];
const proofRank = (c: Category) => {
  const i = PROOF_ORDER.indexOf(c);
  return i < 0 ? PROOF_ORDER.length : i;
};

// --- Phase 5 motion helpers (CSS + IntersectionObserver only; reduced-motion safe) ---

// Subtle scroll-in reveal (fade + small rise). Reduced-motion / no-IO → renders in
// final state immediately (useInView initialises inView=true). Purely decorative:
// content is never gated behind it, so touch and no-JS still see everything.
function Reveal({
  children,
  className = "",
  delayMs = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={`transition-all duration-700 ease-standard ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// Systems-problem highlight: reveal the orange words progressively as the moment
// enters view. `inView` comes from the parent section so the stagger is tied to the
// statement, not each word. Splitting on spaces works for EN and AR (word order and
// stagger read right-to-left in RTL because DOM order is preserved).
function HighlightWords({ text, inView }: { text: string; inView: boolean }) {
  const words = text.split(" ");
  return (
    <span className="text-brand-400">
      {words.map((word, i) => (
        <span
          key={i}
          style={{ transitionDelay: `${i * 90}ms` }}
          className={`inline-block me-[0.25em] transition-all duration-500 ease-standard ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          {word}
        </span>
      ))}
    </span>
  );
}

export default function Home() {
  const { t } = useI18n();
  useDocumentTitle();

  // Phase 5: scroll gates for the systems-problem statement (word reveal) and the
  // process timeline (sequential step activation). Both reduced-motion/touch safe.
  const valueProp = useInView<HTMLDivElement>();
  const process = useInView<HTMLDivElement>();

  // Hero signature piece (Phase 6.1): six real capabilities on a ring that connect
  // into one central Business System — interactive on hover/scroll, static/connected
  // as the touch & reduced-motion fallback. Labels are real i18n strings.
  const heroSystemNodes: InteractiveNode[] = [
    { id: "ai-training", label: t("systemMap.node.aiTraining"), icon: Bot },
    { id: "marketing", label: t("systemMap.node.marketing"), icon: Target },
    { id: "software", label: t("systemMap.node.software"), icon: Layers },
    { id: "automation", label: t("systemMap.node.automation"), icon: Workflow },
    { id: "crm", label: t("systemMap.node.crm"), icon: Users },
    { id: "strategy", label: t("systemMap.node.strategy"), icon: Compass },
  ];

  const { data: projects } = useQuery<Project[]>({ queryKey: ['/api/projects'] });
  const all = projects || [];

  // Proof = curated featured projects; Recent = everything else. Both are purely
  // DB-driven and collapse to nothing when empty — no fabricated fallbacks.
  const featured = all
    .filter((p) => p.isFeatured)
    .sort((a, b) => proofRank(a.category) - proofRank(b.category));
  const recent = all.filter((p) => !p.isFeatured).slice(0, 6);

  const allClients = [
    { name: "Petra", logo: Petra }, { name: "Reliance Hub", logo: RelianceHub },
    { name: "Madrid", logo: Madrid }, { name: "Ipec", logo: Ipec },
    { name: "Electromeca", logo: electromeca }, { name: "N2oosh", logo: n2oosh },
    { name: "Dar El Maaly", logo: DarELmaaly }, { name: "El Khateer", logo: elkhateer },
    { name: "Beit El 3tara", logo: BeitEl3tara },
    { name: "El Modhsh", logo: elmodhsh }, { name: "Decork", logo: Decork },
    { name: "Princess", logo: Princess }, { name: "Naas", logo: naas },
    { name: "Ta2deer", logo: ta2deer }, { name: "Gzour", logo: Gzour },
    { name: "Mashareeb", logo: mashareeb }, { name: "Cutz", logo: Cutz },
    { name: "Kayan", logo: kayan }, { name: "Darat", logo: darat }, { name: "Rafeek", logo: rafeek },
    { name: "5 Minutes", logo: fiveMinutes }, { name: "Alforat", logo: alforat },
    { name: "Arcade", logo: arcade }, { name: "Cleaning", logo: cleaning },
    { name: "El Gabry", logo: elgabry }, { name: "Gewiss", logo: gewiss },
    { name: "Image Home", logo: imagehome }, { name: "Jotun", logo: jotun },
    { name: "Majarrah", logo: majarrah }, { name: "OEM", logo: oem },
    { name: "Pioneer", logo: pioneer }, { name: "Thaki", logo: thaki },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden">

      {/* === 1. HERO === */}
      <section className="relative min-h-[80vh] mt-16 md:mt-20 flex items-center overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-950/10 via-transparent to-transparent pointer-events-none" />
        {/* Engineered hex substrate — whisper-subtle, decorative, full-bleed */}
        <HexGridSubstrate className="absolute inset-0" opacity={0.035} fade="radial" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">

            {/* Copy — text and CTAs unchanged; alignment goes start-aligned on desktop */}
            <div className="text-center lg:text-start">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
                {t("home.hero.h1.lead")}{" "}
                <span className="text-brand-400">
                  {t("home.hero.h1.highlight")}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0 mt-8">
                {t("home.hero.sub")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-10">
                <Link href="/contact">
                  <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground font-bold h-12 md:h-14 px-8 rounded-full shadow-sm hover:brightness-110 transition">
                    {t("common.cta.bookCall")} <ArrowRight className="ms-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/portfolio">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-700 text-slate-300 hover:text-white hover:bg-white/10 h-12 md:h-14 px-8 rounded-full">
                    {t("home.hero.cta2")}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Interactive connected-system: capabilities → one Business System.
                Hover/focus/tap emphasises a connection; scroll-in assembles it.
                Static-connected on touch/reduced-motion. RTL mirrors internally. */}
            <div className="mx-auto w-full max-w-sm lg:max-w-none">
              <InteractiveSystemMap
                centerLabel={t("systemMap.center")}
                nodes={heroSystemNodes}
                ariaLabel={t("systemMap.aria")}
                width={480}
                height={460}
              />
            </div>

          </div>
        </div>
      </section>

      {/* === 2. TRUST STRIP + CLIENT LOGOS (LIGHT band — P6 trust) === */}
      <section className="py-20 md:py-24 bg-surface border-y border-black/[0.06] overflow-hidden">
        {/* Trust header + client reach — static, founder-provided facts. One header:
            the pulse-pill eyebrow over the concrete reach headline (the generic
            "shaping the future" line was redundant with this and was removed). Lives
            inside this same LIGHT band as the logos below, so it does not touch the
            section alternation. Numerals use the site's stat treatment (bold +
            brand-orange), not a mono font (JetBrains Mono is not loaded here). */}
        <div className="max-w-4xl mx-auto px-6 md:px-8 mb-16 flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-brand-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-600">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            {t("home.trustEyebrow")}
          </span>
          <h2 className="mt-5 text-3xl md:text-4xl font-bold tracking-tight text-slate-900 max-w-3xl text-balance">
            {t("home.reach.headline")}
          </h2>

          <dl className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-6 w-full max-w-3xl">
            {reachStats.map((s) => (
              <div key={s.valueKey} className="flex flex-col items-center text-center">
                <dd
                  className={`flex min-h-[3rem] md:min-h-[3.5rem] items-center justify-center font-bold leading-tight text-brand-600 ${
                    s.text
                      ? "text-2xl md:text-3xl"
                      : "text-4xl md:text-5xl tabular-nums"
                  }`}
                >
                  {t(s.valueKey)}
                </dd>
                <dt className="mt-3 text-sm md:text-base text-slate-600">
                  {t(s.labelKey)}
                </dt>
              </div>
            ))}
          </dl>

          {/* Country strip: rendered as discrete spans in a wrap-friendly flex row so
              the middle-dot separators mirror correctly in RTL (Arabic) and wrap
              gracefully on mobile. */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-slate-500">
            {t("home.reach.countries").split(" · ").flatMap((country, i) =>
              i === 0
                ? [<span key={country}>{country}</span>]
                : [
                    <span key={`sep-${i}`} aria-hidden="true" className="text-slate-300">·</span>,
                    <span key={country}>{country}</span>,
                  ]
            )}
          </div>
        </div>

        {/* Single-row infinite marquee - no containers. Edge fades match the light band. */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-r from-[#F6F7F8] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-l from-[#F6F7F8] to-transparent z-10 pointer-events-none" />

          <div className="flex w-max items-center animate-marquee">
            {/* Uniform tiles: every logo sits on the same light surface at the same
                size, so the row reads as one band despite the source PNGs having
                mismatched baked-in backgrounds (white / dark / transparent). */}
            {[...allClients, ...allClients].map((client, index) => (
              <div
                key={index}
                className="flex-shrink-0 mx-3 md:mx-4 h-20 md:h-24 w-40 md:w-48 flex items-center justify-center rounded-xl bg-white border border-slate-200 px-4 shadow-card"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  loading="lazy"
                  decoding="async"
                  className="max-h-16 md:max-h-20 max-w-full w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `}</style>
      </section>

      {/* === 3. VALUE PROPOSITION (systems-problem statement — stays DARK, P6 identity) === */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-y border-white/[0.06]">
        <div ref={valueProp.ref} className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            <span
              className={`transition-opacity duration-700 ease-standard ${
                valueProp.inView ? "opacity-100" : "opacity-0"
              }`}
            >
              {t("home.valueProp.title.lead")}{" "}
            </span>
            {/* Orange highlight words reveal progressively as the moment enters view */}
            <HighlightWords text={t("home.valueProp.title.highlight")} inView={valueProp.inView} />
          </h2>
          <p
            style={{ transitionDelay: "450ms" }}
            className={`text-lg text-slate-400 leading-relaxed mt-8 transition-all duration-700 ease-standard ${
              valueProp.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("home.valueProp.body")}
          </p>
        </div>
      </section>

      {/* === 4. PILLARS / SERVICES (LIGHT band — P6 readability) === */}
      <section className="py-20 md:py-24 bg-surface border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 md:mb-16 max-w-2xl">
            {t("home.pillars.title")}
          </h2>

          <Reveal className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <Link key={index} href={pillar.href}>
                  <div className="card-lift group h-full flex flex-col p-6 md:p-8 rounded-xl bg-white border border-slate-200 hover:border-slate-300 cursor-pointer shadow-card">
                    <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-brand-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3 leading-snug">
                      {t(pillar.titleKey)}
                    </h3>
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                      {t(pillar.bodyKey)}
                    </p>
                    {pillar.subcapsKey && (
                      <p className="text-xs text-brand-700 font-medium mt-6 pt-6 border-t border-slate-200">
                        {t(pillar.subcapsKey)}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* === 5. TRANSFORMATION (Before / After — stays DARK, P6 impact) === */}
      <section className="py-20 md:py-24 bg-slate-950 border-y border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 md:mb-16 text-center">
            {t("home.transform.title")}
          </h2>

          <Reveal className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Before */}
            <div className="p-6 md:p-8 rounded-xl bg-slate-900/50 border border-slate-800 shadow-card">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{t("home.transform.before.label")}</p>
              <ul className="space-y-4">
                {transformBefore.map((key, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 flex-shrink-0" />
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div className="p-6 md:p-8 rounded-xl bg-gradient-to-br from-brand-700/15 to-slate-900/50 border border-brand-500/20 shadow-card">
              <p className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-6">{t("home.transform.after.label")}</p>
              <ul className="space-y-4">
                {transformAfter.map((key, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 mt-1 flex-shrink-0" />
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* === 6. PROOF (DB-driven; hides cleanly when there are no featured projects) === */}
      {featured.length > 0 && (
        <section className="py-20 md:py-24 bg-surface border-t border-black/[0.06]">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <div className="max-w-2xl mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                {t("home.proof.title")}
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {t("home.proof.body")}
              </p>
            </div>

            {/* TODO(Layer3-proof): when real aggregate metrics exist (e.g. total
                revenue lifted, avg. delivery speedup, clients served), render an
                aggregate stat strip here. Do NOT invent numbers — leave empty
                until real data is available. Per-project results surface below. */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((project) => (
                <Link key={project.id} href={`/portfolio/${project.id}`}>
                  <div className="group cursor-pointer">
                    <div className="card-lift relative overflow-hidden rounded-xl bg-slate-100 aspect-[4/3] border border-slate-200 hover:border-slate-300 mb-4">
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        onError={onImageError}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-brand-600 transition-colors mb-1">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-600">{t(`category.${project.category}`)}</p>
                    {/* Real per-project result (CMS-entered). Renders nothing when absent — never fabricated. */}
                    {project.results?.[0] && (
                      <p className="text-sm font-semibold text-brand-700 mt-2">{project.results[0]}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === 7. RECENT WORK (DB-driven; hides when empty, no fallback) === */}
      {recent.length > 0 && (
        <section className="py-20 md:py-24 bg-slate-950 border-y border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {t("home.recent.title")}
                </h2>
                <p className="text-slate-400">
                  {t("home.recent.sub")}
                </p>
              </div>
              <Link href="/portfolio">
                <Button variant="ghost" className="text-slate-400 hover:text-white">
                  {t("common.viewAllProjects")}
                  <ArrowRight className="w-4 h-4 ms-2" />
                </Button>
              </Link>
            </div>

            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {recent.map((project) => (
                  <CarouselItem key={project.id} className="md:basis-1/2 lg:basis-1/3 pl-6">
                    <Link href={`/portfolio/${project.id}`}>
                      <div className="group cursor-pointer">
                        <div className="card-lift relative overflow-hidden rounded-xl bg-slate-900 aspect-[4/3] border border-slate-800 hover:border-slate-700 mb-4">
                          <img
                            src={project.image}
                            alt={project.title}
                            loading="lazy"
                            decoding="async"
                            onError={onImageError}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-brand-400 transition-colors mb-1">
                          {project.title}
                        </h3>
                        <p className="text-sm text-slate-400">{t(`category.${project.category}`)}</p>
                        {/* Real per-project result (CMS-entered). Renders nothing when absent — never fabricated. */}
                        {project.results?.[0] && (
                          <p className="text-sm font-semibold text-brand-400 mt-2">{project.results[0]}</p>
                        )}
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-end gap-2 mt-8">
                <CarouselPrevious className="static translate-y-0 bg-slate-900 border-slate-800 hover:bg-slate-800 text-white w-10 h-10" />
                <CarouselNext className="static translate-y-0 bg-slate-900 border-slate-800 hover:bg-slate-800 text-white w-10 h-10" />
              </div>
            </Carousel>
          </div>
        </section>
      )}

      {/* === 8. HOW WE WORK / PROCESS (LIGHT band — P6 readability) === */}
      <section className="py-20 md:py-24 bg-surface border-t border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 md:mb-16">
            {t("home.how.title")}
          </h2>

          {/* Scroll-activated timeline: steps light up in sequence (staggered delay)
              as the section enters view, reinforcing the ordered method. The active
              step takes the Flow Orange accent (top bar + tinted number); the large
              numbers stay subtle. Opacity/colour only → mirrors cleanly in RTL. */}
          <div ref={process.ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {howWeWork.map((item, index) => {
              const active = process.inView;
              const delay = { transitionDelay: `${index * 180}ms` };
              return (
                <div
                  key={index}
                  style={delay}
                  className={`relative p-4 md:p-6 rounded-xl bg-white shadow-card overflow-hidden border transition-colors duration-500 ease-standard ${
                    active ? "border-brand-500/30" : "border-slate-200"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    style={delay}
                    className={`absolute inset-x-0 top-0 h-1 bg-primary transition-opacity duration-500 ease-standard ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <div
                    style={delay}
                    className={`text-4xl md:text-6xl font-bold mb-3 md:mb-4 transition-colors duration-500 ease-standard ${
                      active ? "text-brand-400" : "text-slate-200"
                    }`}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2 md:mb-3">
                    {t(item.titleKey)}
                  </h3>
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                    {t(item.descKey)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* === 9. GLOBAL BRAND LINE (brand statement — stays DARK, P6 identity) === */}
      <section className="py-20 md:py-24 bg-slate-950 bg-gradient-to-r from-brand-700/15 via-slate-950 to-brand-700/15 border-y border-brand-500/10">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center flex-shrink-0 border border-brand-500/20">
                <Shield className="w-6 h-6 text-brand-400" />
              </div>
              <p className="text-lg md:text-xl font-semibold text-white max-w-2xl">
                {t("common.brandLine")}
              </p>
            </div>
            <Link href="/contact">
              <Button className="bg-primary text-primary-foreground font-semibold px-6 rounded-full transition-colors whitespace-nowrap">
                {t("common.cta.bookCall")}
                <ArrowRight className="w-4 h-4 ms-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* === 10. FINAL CTA === */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-950/20 via-transparent to-transparent" />

        <Reveal className="relative z-10 max-w-3xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {t("home.finalCta.title")}
          </h2>
          <p className="text-xl text-slate-400 mb-10 leading-relaxed">
            {t("home.finalCta.body")}
          </p>

          <Link href="/contact">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground font-semibold px-10 py-7 text-lg rounded-full transition-colors"
            >
              {t("home.finalCta.button")}
              <ArrowRight className="w-5 h-5 ms-2" />
            </Button>
          </Link>

          <p className="text-sm text-slate-400 mt-6">
            {t("home.finalCta.sub")}
          </p>
        </Reveal>
      </section>
    </div>
  );
}
