import { Link } from 'wouter';
import { ArrowRight, Globe, Bot, BarChart3, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Project } from '@shared/schema';
import { CATEGORY_TO_PILLAR, type Pillar } from '@shared/taxonomy';
import { onImageError } from '@/lib/placeholder';

export default function Services() {

  // Fetch Showcase Projects
  const { data: showcaseProjects } = useQuery<Project[]>({
    queryKey: ['/api/projects/showcase'],
  });

  // A pillar's showcase = showcase projects whose category rolls up to it.
  // Deterministic winner when several qualify: most recently created (highest id;
  // there is no updatedAt column). No behaviour change for 0 or 1 match.
  const getShowcaseProject = (pillar: Pillar) => {
    return (showcaseProjects || [])
      .filter(p => CATEGORY_TO_PILLAR[p.category] === pillar)
      .sort((a, b) => b.id - a.id)[0];
  };

  const services = [
    {
      id: 'ai-training',
      pillar: 'ai-training' as Pillar,
      icon: Bot,
      title: 'AI training that turns tools into capability',
      body: "We run structured AI adoption programs for teams and leadership — from executive strategy sessions to hands-on workflow integration. The goal isn't awareness, it's operational capability: your people using AI on real work, not watching a demo.",
      href: '/services/ai-training',
    },
    {
      id: 'digital-marketing',
      pillar: 'digital-marketing' as Pillar,
      icon: BarChart3,
      title: 'Marketing built as an acquisition system',
      body: 'SEO, paid campaigns, and conversion strategy wired into one engine that targets qualified buyers — not vanity traffic. Every stage is tracked, so you know what a lead actually costs and where revenue comes from.',
      href: '/services/digital-marketing',
    },
    {
      id: 'software',
      pillar: 'software' as Pillar,
      icon: Globe,
      title: 'Software that becomes your operational backbone',
      body: 'The systems your business runs on — ERP and CRM platforms, customer-facing web, mobile apps, and the automation that connects them. Built to own, integrate, and scale, not to rent.',
      subcaps: 'Business Systems (ERP/CRM) · Web Platforms · Mobile Apps · Automation & AI',
      href: '/services/software',
    },
  ];

  return (
    <div className="min-h-screen pt-20 bg-slate-950">

      {/* HERO */}
      <section className="py-24 relative">
        <div className="absolute top-0 right-0 w-[50%] h-[60%] bg-gradient-to-bl from-orange-950/30 via-transparent to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 text-center">
          <p className="text-orange-400/80 text-sm font-medium tracking-wide mb-6">What we do</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Three capabilities. <span className="text-slate-500">One transformation partner.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We don't hand over deliverables and walk away. We build systems that keep working after we're gone.
          </p>
        </div>
      </section>

      {/* SERVICES LIST */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-12">
          {services.map((service) => {
            const Icon = service.icon;
            const showcase = getShowcaseProject(service.pillar);

            return (
              <div key={service.id} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

                {/* Service Info Card */}
                <div className={`p-8 md:p-10 rounded-2xl bg-slate-900/40 border border-slate-800/50 backdrop-blur-sm flex flex-col justify-between ${showcase ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-orange-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{service.title}</h2>
                      </div>
                    </div>
                    <p className="text-slate-400 leading-relaxed">{service.body}</p>
                    {service.subcaps && (
                      <p className="text-sm text-orange-400/80 font-medium">{service.subcaps}</p>
                    )}
                  </div>
                  <div className="pt-8">
                    <Link href={service.href}>
                      <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 pl-0">
                        Learn more <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Showcase Project Preview (Only if exists) */}
                {showcase && (
                  <div className="lg:col-span-5 relative group overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-900/60">
                    <img
                      src={showcase.image}
                      alt={showcase.title}
                      loading="lazy"
                      decoding="async"
                      onError={onImageError}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent p-8 flex flex-col justify-end">
                      <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">Featured Project</p>
                        <h3 className="text-xl font-bold text-white">{showcase.title}</h3>
                        <p className="text-sm text-slate-300 line-clamp-2 mb-4">{showcase.description}</p>
                        <Link href={`/portfolio/${showcase.id}`}>
                          <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md rounded-full">
                            View Case Study <ArrowUpRight className="w-3 h-3 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* === HOW THEY WORK TOGETHER === */}
      <section className="py-24 bg-slate-900/30 border-y border-slate-800/30">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Better together
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Each capability works on its own. Together they compound — your
              software captures the data, your marketing fills the pipeline, your
              automation runs it, and your team knows how to drive all of it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Capture',
                description: 'Your website captures leads and collects the data you need to qualify them.',
              },
              {
                step: '02',
                title: 'Attract',
                description: 'Marketing drives the right people to your site—decision-makers, not tire-kickers.',
              },
              {
                step: '03',
                title: 'Automate',
                description: 'Automation qualifies leads, books meetings, and syncs everything to your CRM.',
              },
            ].map((item, index) => (
              <div key={index} className="relative p-6 rounded-xl bg-slate-950/50 border border-slate-800/50">
                <div className="text-4xl font-bold text-slate-800 mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>

                {/* Connector arrow */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-6 -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-slate-700" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA === */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-950/20 via-transparent to-transparent" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Not sure what you need?
          </h2>
          <p className="text-xl text-slate-400 mb-10">
            Book a free call. We'll look at your current setup and tell you
            exactly what would move the needle—even if it's not something we do.
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-6 text-base rounded-lg transition-colors"
            >
              Book a free strategy call
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
