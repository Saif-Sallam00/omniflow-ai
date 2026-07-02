import { Link, useRoute } from 'wouter';
import { ArrowRight, CheckCircle2, Globe, Bot, BarChart3, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { Project } from '@shared/schema';
import { CATEGORY_TO_PILLAR } from '@shared/taxonomy';
import { onImageError } from '@/lib/placeholder';

// The three PILLAR service pages.
const services = {
  software: {
    icon: Globe,
    title: 'Software that becomes your operational backbone',
    subtitle: 'ERP and CRM platforms, customer-facing web, mobile apps, and the automation that connects them — designed to own, integrate, and scale.',
    description: 'ERP and CRM platforms, customer-facing web, mobile apps, and the automation that connects them — designed to own, integrate, and scale.',
    cta: 'Build your system',
    features: [
      { title: 'Business Systems (ERP / CRM)', description: 'Custom platforms that centralize your sales, operations, and customer data into one source of truth. Built on proven frameworks, shaped to how your business actually runs.' },
      { title: 'Web Platforms', description: 'High-performance websites and web apps engineered for conversion and speed — connected to your systems from day one, not bolted on later.' },
      { title: 'Mobile Apps', description: 'Customer-facing and internal apps built for real-world use and scale, integrated with the same backend as everything else.' },
      { title: 'Automation & AI', description: "Workflow automation and AI integrations that remove manual work — lead routing, data sync, follow-ups, and the repetitive tasks eating your team's time." },
    ],
    process: [
      { title: 'Discovery', description: 'We learn your business, goals, and technical requirements.' },
      { title: 'Proposal', description: 'Clear scope, timeline, and a fixed price.' },
      { title: 'Design', description: 'Wireframes and visual design — you approve before we build.' },
      { title: 'Build', description: 'We build and integrate, with weekly reviews. No surprises.' },
      { title: 'Launch', description: 'Tested, live, and handed over — full ownership transferred.' },
    ],
    faq: [
      { q: 'Do we own the code?', a: 'Yes. Full source code and IP transfer on completion. No lock-in, no fees to access your own system.' },
      { q: 'Can it integrate with our existing tools?', a: "That's the point. We connect to your CRM, ERP, and existing stack from day one." },
      { q: 'How long does a build take?', a: 'Depends on scope — we give you a specific timeline in the proposal, not a vague range.' },
      { q: 'What if we already have a system?', a: 'We rebuild or extend what you have, whichever actually makes sense for your situation.' },
    ],
  },
  'digital-marketing': {
    icon: BarChart3,
    title: 'Marketing built as an acquisition system',
    subtitle: 'SEO, paid campaigns, and conversion strategy wired into one measurable engine that brings in qualified buyers — not vanity traffic.',
    description: 'SEO, paid campaigns, and conversion strategy wired into one measurable engine that brings in qualified buyers — not vanity traffic.',
    cta: 'Scale your acquisition',
    features: [
      { title: 'Paid campaigns (Google / Meta / LinkedIn)', description: '' },
      { title: 'Buyer-intent SEO', description: '' },
      { title: 'Conversion-rate optimization', description: '' },
      { title: 'Funnel strategy & tracking', description: '' },
    ],
    process: [
      { title: 'Audit', description: 'We review your funnel, channels, and competitors.' },
      { title: 'Strategy', description: "A clear plan — channels, offers, and what we'll test." },
      { title: 'Setup', description: 'Tracking, campaigns, and landing pages built and launched.' },
      { title: 'Optimize', description: 'Continuous testing against real performance data.' },
    ],
    faq: [
      { q: "What's the minimum to make this work?", a: "We're honest about fit — we're upfront about whether the budget justifies the work, and we'll tell you before you commit." },
      { q: 'How fast do results come?', a: 'Paid moves in weeks; SEO is a few months for meaningful traffic. We set realistic expectations before we start.' },
      { q: 'Do you guarantee results?', a: "We guarantee our work and our process, not market conditions. Targets are agreed upfront and we're accountable to them." },
    ],
  },
  'ai-training': {
    icon: Bot,
    title: 'AI training that turns tools into capability',
    subtitle: 'Structured AI adoption programs for teams and leadership — built to leave your people using AI on real work, not just aware of it.',
    description: 'Structured AI adoption programs for teams and leadership — built to leave your people using AI on real work, not just aware of it.',
    cta: 'Start your AI program',
    features: [
      { title: 'Executive AI strategy sessions', description: '' },
      { title: 'Department-level adoption programs', description: '' },
      { title: 'Hands-on workflow integration workshops', description: '' },
      { title: 'Implementation support', description: '' },
    ],
    process: [
      { title: 'Assess', description: "We map your team's workflows and where AI actually helps." },
      { title: 'Design', description: 'A program built around your tools and real tasks.' },
      { title: 'Train', description: 'Hands-on sessions for leadership and teams.' },
      { title: 'Embed', description: 'Documented workflows your team keeps and reuses.' },
    ],
    faq: [
      { q: 'Is this generic AI training?', a: 'No. Programs are built around your actual workflows and tools, not a stock curriculum.' },
      { q: 'Who is it for?', a: 'Leadership and teams — we run both strategy-level and hands-on tracks.' },
      { q: 'What do we walk away with?', a: 'People who use AI on real work, plus documented workflows your team keeps.' },
    ],
  },
};

export default function ServiceDetail() {
  const [, params] = useRoute('/services/:slug');
  const { isRTL } = useI18n();
  const slug = params?.slug || '';

  // slug is a PILLAR slug. A project belongs on this pillar's page when its
  // category rolls up to the pillar (CATEGORY_TO_PILLAR) and it is flagged
  // showOnServicePage. Uses the default JSON query fn so the data parses properly.
  const { data: allProjects } = useQuery<Project[]>({ queryKey: ['/api/projects'] });
  const relatedProjects = (allProjects || []).filter(
    (p) => p.showOnServicePage && CATEGORY_TO_PILLAR[p.category] === slug
  );

  const service = params?.slug ? services[params.slug as keyof typeof services] : null;

  if (!service) {
    return (
      <div className="min-h-screen pt-20 bg-[#0a0a0b] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Service not found</h1>
          <Link href="/services">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg">
              View all services
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = service.icon;

  return (
    <div className="min-h-screen pt-20 bg-[#0a0a0b]">

      {/* === HERO === */}
      <section className="py-24 relative">
        <div className="absolute top-0 right-0 w-[50%] h-[60%] bg-gradient-to-bl from-orange-950/30 via-transparent to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8">
          <Link href="/services">
            <Button variant="ghost" className="text-slate-500 hover:text-white mb-8 -ml-4">
              ← All services
            </Button>
          </Link>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-7 h-7 text-orange-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                {service.title}
              </h1>
              <p className="text-xl text-orange-400/80 font-medium">
                {service.subtitle}
              </p>
            </div>
          </div>

          <p className="text-lg text-slate-400 leading-relaxed max-w-3xl mb-10">
            {service.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-6 rounded-lg"
              >
                {service.cta}
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button
                size="lg"
                variant="ghost"
                className="text-slate-400 hover:text-white hover:bg-white/5 px-8 py-6 rounded-lg"
              >
                See examples
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* === RELATED PROJECTS SECTION === */}
      {relatedProjects && relatedProjects.length > 0 && (
        <section className="py-24 bg-slate-900/30 border-y border-slate-800/30">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Proven Results</h2>
                <p className="text-slate-400">See how we've helped companies like yours.</p>
              </div>
              <Link href="/portfolio">
                <Button variant="ghost" className="text-slate-400 hover:text-white">View Full Portfolio <ArrowRight className="ml-2 w-4 h-4"/></Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProjects.map((project) => (
                <Link key={project.id} href={`/portfolio/${project.id}`}>
                  <div className="group cursor-pointer bg-slate-950 border border-slate-800 rounded-xl overflow-hidden hover:border-orange-500/30 transition-all">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        onError={onImageError}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors">{project.title}</h3>
                        <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-orange-400" />
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2">{project.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === FEATURES === */}
      <section className="py-24 bg-slate-900/30 border-y border-slate-800/30">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <h2 className="text-2xl font-bold text-white mb-12">
            What's included
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {service.features.map((feature, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                </div>
                {feature.description && (
                  <p className="text-sm text-slate-400 leading-relaxed pl-8">
                    {feature.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === PROCESS === */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            How it works
          </h2>
          <p className="text-slate-400 mb-12">
            No mystery. No endless meetings. Here's the process.
          </p>

          <div className="space-y-6">
            {service.process.map((step, index) => (
              <div
                key={index}
                className="flex gap-6 p-6 rounded-xl bg-slate-900/40 border border-slate-800/50"
              >
                <div className="text-3xl font-bold text-slate-700 w-12 flex-shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === FAQ === */}
      <section className="py-24 bg-slate-900/30 border-y border-slate-800/30">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <h2 className="text-2xl font-bold text-white mb-12">
            Common questions
          </h2>

          <div className="space-y-8">
            {service.faq.map((item, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-semibold text-white">{item.q}</h3>
                <p className="text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA === */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-950/20 via-transparent to-transparent" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg text-slate-400 mb-10">
            Book a strategy call. We'll discuss your needs and tell you honestly
            if we're the right fit — no pressure, no sales pitch.
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-6 text-base rounded-lg"
            >
              {service.cta}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
