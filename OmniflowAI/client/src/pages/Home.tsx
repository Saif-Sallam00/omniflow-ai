import { Link } from "wouter";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Bot,
  Award,
  Sparkles,
  Layers,
  Target,
  Globe,
  Zap,
  Quote,
  CheckCircle2,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { Project } from '@shared/schema';
import { useI18n } from '@/lib/i18n';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi
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

// --- COMPONENT: Results Dashboard (Responsive) ---
const ResultsDashboard = () => (
  <div className="relative w-full max-w-lg mx-auto mt-12 lg:mt-0">
    <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 animate-pulse" />
    <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-orange-500/20 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">

      {/* Header */}
      <div className="px-4 md:px-6 py-4 border-b border-orange-500/20 flex items-center justify-between bg-slate-950/80 backdrop-blur-sm relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
        </div>
        <div className="text-[10px] font-bold text-orange-400 uppercase tracking-[0.2em] font-mono">
          CLIENT RESULTS
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-4 md:space-y-6 relative z-10">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div className="relative bg-slate-900/90 rounded-xl p-3 md:p-4 border border-emerald-500/20 backdrop-blur-sm">
            <div className="text-[10px] text-emerald-400 mb-2 uppercase tracking-wider font-bold">Cost/Lead</div>
            <div className="text-2xl md:text-3xl font-black text-white flex items-baseline gap-2 mb-1">
              $150
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-emerald-400 text-[10px] md:text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                62% ↓
              </span>
            </div>
          </div>

          <div className="relative bg-slate-900/90 rounded-xl p-3 md:p-4 border border-blue-500/20 backdrop-blur-sm">
            <div className="text-[10px] text-blue-400 mb-2 uppercase tracking-wider font-bold">Time Saved</div>
            <div className="text-2xl md:text-3xl font-black text-white mb-1">
              340<span className="text-sm md:text-lg text-slate-400 font-normal">hrs</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">≈ 2 FTEs</div>
          </div>
        </div>

        {/* ROI Indicator */}
        <div className="relative bg-gradient-to-br from-orange-950/50 to-red-950/30 rounded-xl p-4 md:p-5 border border-orange-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-orange-300 font-bold uppercase tracking-wider">Avg. Client ROI</div>
            <Award className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-orange-100">
            6.8<span className="text-2xl md:text-3xl">×</span>
          </div>
          <div className="text-[10px] md:text-[11px] text-orange-400/80 mt-1 font-medium">within 12 months</div>
        </div>
      </div>
    </div>
  </div>
);

// --- COMPONENT: Featured Case Study Banner (Mobile Optimized) ---
const FeaturedCaseStudy = () => (
  <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-y border-orange-500/20 py-20 md:py-24 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-orange-400" />
            <span className="text-orange-300 text-[10px] md:text-xs font-bold uppercase tracking-wider">Success Story</span>
          </div>

          <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
            How Petra Engineering{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
              Cut Proposal Time by 40%
            </span>
          </h3>

          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            From manual spreadsheets to automated quoting system that generates proposals in minutes.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="space-y-1">
              <div className="text-2xl md:text-4xl font-black text-emerald-400">40%</div>
              <div className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold">Faster</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-4xl font-black text-blue-400">2×</div>
              <div className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold">Wins</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-4xl font-black text-orange-400">90</div>
              <div className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold">Days ROI</div>
            </div>
          </div>

          <Link href="/portfolio">
            <Button variant="outline" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 rounded-full w-full md:w-auto">
              Read Full Case Study <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="lg:col-span-5 relative hidden md:block">
          <div className="absolute -inset-4 bg-orange-600/10 rounded-3xl blur-2xl" />
          <div className="relative bg-slate-900 rounded-3xl p-8 border border-orange-500/20">
            <div className="flex items-start gap-4 mb-6">
              <img src={Petra} alt="Petra" className="w-16 h-16 object-contain bg-white/5 rounded-xl p-2" />
              <div>
                <div className="font-bold text-white text-lg">Petra Engineering</div>
                <div className="text-xs text-orange-400">Construction</div>
              </div>
            </div>
            <blockquote className="text-slate-300 italic border-l-2 border-orange-500 pl-4">
              "Omniflow engineered a competitive advantage. Our close rate jumped from 23% to 41%."
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function Home() {
  const { isRTL } = useI18n();
  const { data: projects } = useQuery<Project[]>({ queryKey: ['/api/projects'] });

  // Testimonial Carousel State
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

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

  const testimonials = [
    {
      quote: "Omniflow transformed our digital presence. Our close rate jumped from 23% to 41% in just 3 months.",
      author: "Ahmed Hassan",
      role: "CEO",
      company: "Petra Engineering",
      result: "Increased conversion by 78%"
    },
    {
      quote: "The automation system they built saved us over 300 hours per month in manual data entry.",
      author: "Sarah Johnson",
      role: "Operations Director",
      company: "Reliance Hub",
      result: "Saved 340+ hours monthly"
    },
    {
      quote: "Their B2B marketing strategy brought in qualified leads we never thought possible in our niche.",
      author: "Mohamed Ali",
      role: "Marketing Head",
      company: "Madrid Contracting",
      result: "Reduced CAC by 60%"
    }
  ];

  const featuredProjects = projects?.slice(0, 6) || [
    {
      id: 1,
      title: "Petra Engineering Website",
      category: "Web Development",
      image: Petra
    },
    {
      id: 2,
      title: "Reliance Hub Automation",
      category: "Business Automation",
      image: RelianceHub
    },
    {
      id: 3,
      title: "Madrid Marketing Campaign",
      category: "Digital Marketing",
      image: Madrid
    }
  ];

  // Helper for Testimonial Card to reuse
  const TestimonialCard = ({ testimonial }: { testimonial: any }) => (
    <div className="p-6 md:p-8 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:border-slate-700/50 transition-colors backdrop-blur-sm h-full flex flex-col justify-between">
      <div>
        <Quote className="w-6 h-6 md:w-8 md:h-8 text-orange-500/30 mb-6" />
        <p className="text-slate-300 leading-relaxed mb-8 text-base line-clamp-4 md:line-clamp-none">
          "{testimonial.quote}"
        </p>
      </div>

      <div className="pt-6 border-t border-slate-800/50">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {testimonial.author.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <p className="font-semibold text-white text-sm md:text-base">{testimonial.author}</p>
            <p className="text-xs md:text-sm text-slate-500">{testimonial.role}, {testimonial.company}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs md:text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-slate-400">{testimonial.result}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden">

      {/* === 1. HERO === */}
      <section className="relative min-h-[90vh] mt-16 md:mt-20 flex items-center overflow-hidden py-20 md:py-24">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">

            <div className="inline-flex mx-auto lg:mx-0 items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-orange-500/10 border border-orange-500/30 backdrop-blur-sm">
              <Award className="w-3 h-3 md:w-4 md:h-4 text-orange-400" />
              <span className="text-orange-300 text-[10px] md:text-xs font-bold uppercase tracking-wider">Trusted by 50+ Businesses</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
              We build the systems that <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                grow your business
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Websites that convert. Marketing that targets the right buyers. Automation that saves your team hundreds of hours. All engineered to pay for itself.
            </p>

            {/* Mobile Trust Grid */}
            <div className="grid grid-cols-3 gap-2 md:gap-6 pt-4 pb-6 border-y border-slate-800/50">
              <div>
                <div className="text-xl md:text-3xl font-black text-orange-400">340h</div>
                <div className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold">Saved/Mo</div>
              </div>
              <div>
                <div className="text-xl md:text-3xl font-black text-emerald-400">60%</div>
                <div className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold">Less CAC</div>
              </div>
              <div>
                <div className="text-xl md:text-3xl font-black text-blue-400">100%</div>
                <div className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold">Ownership</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/contact">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold h-12 md:h-14 px-8 rounded-full shadow-lg hover:scale-105 transition-transform">
                  Book a Free Strategy Call <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-700 text-slate-300 hover:text-white hover:bg-white/10 h-12 md:h-14 px-8 rounded-full">
                  View Results
                </Button>
              </Link>
            </div>
          </div>

          {/* Results Dashboard - Visible on Mobile now */}
          <div className="relative">
            <ResultsDashboard />
          </div>
        </div>
      </section>

      {/* === 2. TRUSTED BY (CLIENT LOGOS) === */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <p className="text-sm text-slate-500 uppercase tracking-widest text-center mb-16">
            Trusted by {allClients.length}+ teams
          </p>
        </div>

        {/* Single-row infinite marquee - no containers */}
        <div className="relative">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

          {/* Single row - all 21 clients, duplicated for seamless loop */}
          <div className="flex items-center animate-marquee">
            {[...allClients, ...allClients].map((client, index) => (
              <img
                key={index}
                src={client.logo}
                alt={client.name}
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


      {/* === 3. HOW WE WORK (Compact Mobile) === */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="max-w-2xl mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How it works
            </h2>
            <p className="text-slate-400 leading-relaxed">
              No 47-slide proposals. No months of "discovery." 
              We move fast because your business can't wait.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {[
              {
                step: "01",
                title: "Strategy call",
                description: "30 minutes. We learn your business, identify the bottlenecks, and tell you honestly if we can help.",
                note: "Free, no pitch"
              },
              {
                step: "02", 
                title: "Clear proposal",
                description: "Within 48 hours, you get a specific scope, timeline, and fixed price. No surprises later.",
                note: "Fixed pricing"
              },
              {
                step: "03",
                title: "We build, you grow",
                description: "Regular updates, fast iterations, and a system that starts delivering results within weeks—not months.",
                note: "90-day results guarantee"
              }
            ].map((item, index) => (
              <div key={index} className="relative p-4 md:p-6 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:border-slate-700/50 transition-colors backdrop-blur-sm">
                <div className="text-4xl md:text-6xl font-bold text-slate-800/50 mb-3 md:mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 md:mb-3">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-slate-400 leading-relaxed mb-4">
                  {item.description}
                </p>
                <span className="inline-flex items-center gap-2 text-xs md:text-sm text-orange-400">
                  <CheckCircle2 className="w-4 h-4" />
                  {item.note}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === 4. FEATURED CASE STUDY === */}
      <FeaturedCaseStudy />

      {/* === 5. TESTIMONIALS (Mobile Carousel) === */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What clients actually say
            </h2>
            <p className="text-slate-400">
              Not marketing fluff. Real feedback from real projects.
            </p>
          </div>

          {/* DESKTOP GRID (Hidden on mobile) */}
          <div className="hidden md:grid grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>

          {/* MOBILE CAROUSEL (Hidden on desktop) */}
          <div className="block md:hidden">
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <TestimonialCard testimonial={testimonial} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Carousel Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    current === index 
                      ? "bg-orange-500 w-4" 
                      : "bg-slate-700 hover:bg-slate-600"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === 6. FEATURED WORK === */}
      {featuredProjects.length > 0 && (
        <section className="py-20 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800/30">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Recent work
                </h2>
                <p className="text-slate-400">
                  Projects that delivered measurable results
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
                {featuredProjects.map((project) => (
                  <CarouselItem key={project.id} className="md:basis-1/2 lg:basis-1/3 pl-6">
                    <Link href={`/portfolio/${project.id}`}>
                      <div className="group cursor-pointer">
                        <div className="relative overflow-hidden rounded-xl bg-slate-950 aspect-[4/3] border border-slate-800/50 group-hover:border-slate-700 transition-colors mb-4">
                          <img 
                            src={project.image} 
                            alt={project.title}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image' }}
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors mb-1">
                          {project.title}
                        </h3>
                        <p className="text-sm text-slate-500">{project.category}</p>
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

      {/* === 7. GUARANTEE === */}
      <section className="py-20 md:py-24 bg-gradient-to-r from-orange-950/20 via-slate-900/50 to-red-950/20 border-y border-orange-500/10">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/10 to-red-500/10 flex items-center justify-center flex-shrink-0 border border-orange-500/20">
                <Shield className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  90-day results guarantee
                </h3>
                <p className="text-slate-400 text-sm">
                  If we don't hit our agreed targets, you get a full refund. Simple as that.
                </p>
              </div>
            </div>
            <Link href="/contact">
              <Button className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold px-6 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all">
                Let's talk
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* === 8. FINAL CTA === */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-950/20 via-transparent to-transparent" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to scale?
          </h2>
          <p className="text-xl text-slate-400 mb-10 leading-relaxed">  
            Book a free 30-minute call. We'll look at your current setup, 
            identify the biggest opportunities, and tell you exactly what we'd do—even if you don't hire us.
          </p>

          <Link href="/contact">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold px-10 py-7 text-lg rounded-lg transition-all"
            >
              Book your free strategy call
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>

          <p className="text-sm text-slate-600 mt-6">
            No pitch. No pressure. Just honest advice.
          </p>
        </div>
      </section>
    </div>
  );
}