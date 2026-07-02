import { Link } from "wouter";
import {
  ArrowRight,
  Bot,
  Target,
  Layers,
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
import PluginTalents from '@/assets/clients/Plugin talents.png';
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

const pillars = [
  { icon: Bot, titleKey: "pillars.aiTraining.title", bodyKey: "pillars.aiTraining.body", href: "/services/ai-training" },
  { icon: Target, titleKey: "pillars.digitalMarketing.title", bodyKey: "pillars.digitalMarketing.body", href: "/services/digital-marketing" },
  { icon: Layers, titleKey: "pillars.software.title", bodyKey: "pillars.software.body", subcapsKey: "pillars.software.subcaps", href: "/services/software" },
];

const transformBefore = ["home.transform.before.1", "home.transform.before.2", "home.transform.before.3", "home.transform.before.4"];
const transformAfter = ["home.transform.after.1", "home.transform.after.2", "home.transform.after.3", "home.transform.after.4"];

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

export default function Home() {
  const { t } = useI18n();
  useDocumentTitle();
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
    { name: "Plugin Talents", logo: PluginTalents }, { name: "Beit El 3tara", logo: BeitEl3tara },
    { name: "El Modhsh", logo: elmodhsh }, { name: "Decork", logo: Decork },
    { name: "Princess", logo: Princess }, { name: "Naas", logo: naas },
    { name: "Ta2deer", logo: ta2deer }, { name: "Gzour", logo: Gzour },
    { name: "Mashareeb", logo: mashareeb }, { name: "Cutz", logo: Cutz },
    { name: "Kayan", logo: kayan }, { name: "Darat", logo: darat }, { name: "Rafeek", logo: rafeek },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden">

      {/* === 1. HERO === */}
      <section className="relative min-h-[80vh] mt-16 md:mt-20 flex items-center overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-950/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
            {t("home.hero.h1.lead")}{" "}
            <span className="text-brand-400">
              {t("home.hero.h1.highlight")}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mt-8">
            {t("home.hero.sub")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/contact">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-brand-light to-brand-600 text-white font-bold h-12 md:h-14 px-8 rounded-full shadow-sm hover:brightness-110 transition">
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
      </section>

      {/* === 2. TRUST STRIP + CLIENT LOGOS === */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <p className="text-sm text-slate-400 uppercase tracking-widest text-center mb-16">
            {t("home.trust")}
          </p>
        </div>

        {/* Single-row infinite marquee - no containers */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

          <div className="flex items-center animate-marquee">
            {[...allClients, ...allClients].map((client, index) => (
              <img
                key={index}
                src={client.logo}
                alt={client.name}
                loading="lazy"
                decoding="async"
                className="flex-shrink-0 h-16 md:h-20 w-auto object-contain mx-8 md:mx-12 opacity-90 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 45s linear infinite;
          }
        `}</style>
      </section>

      {/* === 3. VALUE PROPOSITION === */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {t("home.valueProp.title.lead")}{" "}
            <span className="text-brand-400">
              {t("home.valueProp.title.highlight")}
            </span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed mt-8">
            {t("home.valueProp.body")}
          </p>
        </div>
      </section>

      {/* === 4. PILLARS === */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800/30">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 md:mb-16 max-w-2xl">
            {t("home.pillars.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <Link key={index} href={pillar.href}>
                  <div className="group h-full flex flex-col p-6 md:p-8 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors backdrop-blur-sm cursor-pointer shadow-card">
                    <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-brand-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 leading-snug">
                      {t(pillar.titleKey)}
                    </h3>
                    <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                      {t(pillar.bodyKey)}
                    </p>
                    {pillar.subcapsKey && (
                      <p className="text-xs text-brand-400/80 font-medium mt-6 pt-6 border-t border-slate-800">
                        {t(pillar.subcapsKey)}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* === 5. TRANSFORMATION (Before / After) === */}
      <section className="py-20 md:py-24 bg-slate-900/30 border-y border-slate-800/30">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 md:mb-16 text-center">
            {t("home.transform.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Before */}
            <div className="p-6 md:p-8 rounded-xl bg-slate-950/50 border border-slate-800 shadow-card">
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
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* === 6. PROOF (DB-driven; hides cleanly when there are no featured projects) === */}
      {featured.length > 0 && (
        <section className="py-20 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <div className="max-w-2xl mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t("home.proof.title")}
              </h2>
              <p className="text-slate-400 leading-relaxed">
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
                    <div className="relative overflow-hidden rounded-xl bg-slate-950 aspect-[4/3] border border-slate-800 group-hover:border-slate-700 transition-colors mb-4">
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
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === 7. RECENT WORK (DB-driven; hides when empty, no fallback) === */}
      {recent.length > 0 && (
        <section className="py-20 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800/30">
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
                        <div className="relative overflow-hidden rounded-xl bg-slate-950 aspect-[4/3] border border-slate-800/50 group-hover:border-slate-700 transition-colors mb-4">
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

      {/* === 8. HOW WE WORK === */}
      <section className="py-20 md:py-24 bg-slate-900/30 border-y border-slate-800/30">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 md:mb-16">
            {t("home.how.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {howWeWork.map((item, index) => (
              <div key={index} className="relative p-4 md:p-6 rounded-xl bg-slate-950/50 border border-slate-800 shadow-card">
                <div className="text-4xl md:text-6xl font-bold text-slate-800/50 mb-3 md:mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 md:mb-3">
                  {t(item.titleKey)}
                </h3>
                <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                  {t(item.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === 9. GLOBAL BRAND LINE === */}
      <section className="py-20 md:py-24 bg-gradient-to-r from-brand-700/10 via-slate-900/50 to-brand-700/10 border-y border-brand-500/10">
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

        <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-8 text-center">
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
        </div>
      </section>
    </div>
  );
}
