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
import { CATEGORY_LABELS, type Category } from '@shared/taxonomy';
import { onImageError } from '@/lib/placeholder';
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
  {
    icon: Bot,
    title: "AI training that turns tools into capability",
    body: "We run structured AI adoption programs for teams and leadership — from executive strategy sessions to hands-on workflow integration. The goal isn't awareness, it's operational capability: your people using AI on real work, not watching a demo.",
    href: "/services/ai-training",
  },
  {
    icon: Target,
    title: "Marketing built as an acquisition system",
    body: "SEO, paid campaigns, and conversion strategy wired into one engine that targets qualified buyers — not vanity traffic. Every stage is tracked, so you know what a lead actually costs and where revenue comes from.",
    href: "/services/digital-marketing",
  },
  {
    icon: Layers,
    title: "Software that becomes your operational backbone",
    body: "The systems your business runs on — ERP and CRM platforms, customer-facing web, mobile apps, and the automation that connects them. Built to own, integrate, and scale, not to rent.",
    subcaps: "Business Systems (ERP/CRM) · Web Platforms · Mobile Apps · Automation & AI",
    href: "/services/software",
  },
];

const transformation = {
  before: [
    "Tools that don't talk to each other",
    "Marketing disconnected from operations",
    "Manual work slowing everything down",
    "No clear view of what's actually working",
  ],
  after: [
    "One integrated business system",
    "Acquisition, conversion, and operations connected",
    "Automated workflows across the business",
    "Real-time visibility into performance",
  ],
};

const howWeWork = [
  { step: "01", title: "Diagnose", description: "We map your business model, systems, and the bottlenecks slowing growth." },
  { step: "02", title: "Design", description: "We design the right mix of software, marketing, and automation for how you actually operate." },
  { step: "03", title: "Build", description: "We develop and integrate the system, and hand you full ownership." },
  { step: "04", title: "Optimize", description: "We keep improving it against real business data." },
];

// Ordering for the (DB-driven) proof section: Business Systems → Automation →
// Marketing → Web, then anything else. Projects with no category order sort last.
const PROOF_ORDER: Category[] = ['business-systems', 'automation', 'digital-marketing', 'web', 'mobile', 'ai-training'];
const proofRank = (c: Category) => {
  const i = PROOF_ORDER.indexOf(c);
  return i < 0 ? PROOF_ORDER.length : i;
};

export default function Home() {
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
            We build the systems behind{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              business growth.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mt-8">
            Your digital transformation partner for AI training, digital marketing, and business software — engineered as one integrated system, not four disconnected services.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/contact">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold h-12 md:h-14 px-8 rounded-full shadow-lg hover:scale-105 transition-transform">
                Book a strategy call <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-700 text-slate-300 hover:text-white hover:bg-white/10 h-12 md:h-14 px-8 rounded-full">
                See our work
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* === 2. TRUST STRIP + CLIENT LOGOS === */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <p className="text-sm text-slate-500 uppercase tracking-widest text-center mb-16">
            Trusted by teams building the future of their industries.
          </p>
        </div>

        {/* Single-row infinite marquee - no containers */}
        <div className="relative">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

          {/* Single row - all clients, duplicated for seamless loop */}
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

        {/* Inline keyframes for marquee animation */}
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 10s linear infinite;
          }
        `}</style>
      </section>

      {/* === 3. VALUE PROPOSITION === */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Most companies don't have a marketing problem.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              They have a systems problem.
            </span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed mt-8">
            Disconnected tools, manual handoffs, and no clear line of sight from a lead to a closed deal. We connect the whole chain — how you acquire customers, how you convert them, and how you operate once they're in — so the parts work as one system you can actually measure.
          </p>
        </div>
      </section>

      {/* === 4. PILLARS === */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800/30">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 md:mb-16 max-w-2xl">
            Three capabilities. One transformation partner.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <Link key={index} href={pillar.href}>
                  <div className="group h-full flex flex-col p-6 md:p-8 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:border-orange-500/30 transition-colors backdrop-blur-sm cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-orange-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                      {pillar.body}
                    </p>
                    {pillar.subcaps && (
                      <p className="text-xs text-orange-400/80 font-medium mt-6 pt-6 border-t border-slate-800/50">
                        {pillar.subcaps}
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
            From scattered tools to one connected system
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Before */}
            <div className="p-6 md:p-8 rounded-2xl bg-slate-950/50 border border-slate-800/50">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Before</p>
              <ul className="space-y-4">
                {transformation.before.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-orange-950/20 to-slate-900/50 border border-orange-500/20">
              <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-6">After</p>
              <ul className="space-y-4">
                {transformation.after.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                    {item}
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
                Measured by outcomes, not deliverables
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Every engagement is tied to something your business can feel — revenue, efficiency, acquisition cost, scale. Here's the work behind that.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((project) => (
                <Link key={project.id} href={`/portfolio/${project.id}`}>
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-xl bg-slate-950 aspect-[4/3] border border-slate-800/50 group-hover:border-orange-500/30 transition-colors mb-4">
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        onError={onImageError}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors mb-1">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-500">{CATEGORY_LABELS[project.category] ?? project.category}</p>
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
                  Recent work
                </h2>
                <p className="text-slate-400">
                  A look at the systems we've built.
                </p>
              </div>
              <Link href="/portfolio">
                <Button variant="ghost" className="text-slate-400 hover:text-white">
                  View all projects
                  <ArrowRight className="w-4 h-4 ml-2" />
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
                        <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors mb-1">
                          {project.title}
                        </h3>
                        <p className="text-sm text-slate-500">{CATEGORY_LABELS[project.category] ?? project.category}</p>
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
            How we work
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {howWeWork.map((item, index) => (
              <div key={index} className="relative p-4 md:p-6 rounded-2xl bg-slate-950/50 border border-slate-800/50">
                <div className="text-4xl md:text-6xl font-bold text-slate-800/50 mb-3 md:mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 md:mb-3">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === 9. GLOBAL BRAND LINE === */}
      <section className="py-20 md:py-24 bg-gradient-to-r from-orange-950/20 via-slate-900/50 to-red-950/20 border-y border-orange-500/10">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/10 to-red-500/10 flex items-center justify-center flex-shrink-0 border border-orange-500/20">
                <Shield className="w-6 h-6 text-orange-400" />
              </div>
              <p className="text-lg md:text-xl font-semibold text-white max-w-2xl">
                We don't hand over deliverables and walk away. We build systems that keep working after we're gone.
              </p>
            </div>
            <Link href="/contact">
              <Button className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold px-6 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all whitespace-nowrap">
                Book a strategy call
                <ArrowRight className="w-4 h-4 ml-2" />
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
            Ready to transform how your business runs?
          </h2>
          <p className="text-xl text-slate-400 mb-10 leading-relaxed">
            Book a strategy call. We'll look at your current systems and show you exactly what's blocking growth — even if you don't work with us.
          </p>

          <Link href="/contact">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold px-10 py-7 text-lg rounded-lg transition-all"
            >
              Book your strategy call
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>

          <p className="text-sm text-slate-600 mt-6">
            No sales pitch. Just clarity.
          </p>
        </div>
      </section>
    </div>
  );
}
