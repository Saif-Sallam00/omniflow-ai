import { Link, useRoute } from 'wouter';
import { ArrowRight, CheckCircle2, Globe, Bot, Zap, BarChart3, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { Project } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient'; // [!] Added import

// Helper to map slug to category
const getCategoryFromSlug = (slug: string) => {
  if (slug === 'website-development') return 'build';
  if (slug === 'digital-marketing') return 'attract';
  if (slug === 'automation' || slug === 'ai-agents') return 'automate';
  return 'build';
};

export default function ServiceDetail() {
  const [, params] = useRoute('/services/:slug');
  const { isRTL } = useI18n();
  const slug = params?.slug || '';
  const category = getCategoryFromSlug(slug);

  // [!] FIX: Explicitly construct the URL with query parameters
  const { data: relatedProjects } = useQuery<Project[]>({
    queryKey: ['/api/projects', category, 'service-page'], 
    queryFn: async () => {
      // Fetch projects that match the category AND have the "Show on Service Page" toggle on
      return await apiRequest("GET", `/api/projects?category=${category}&showOnServicePage=true`);
    }
  });

  const services = {
    'website-development': {
      icon: Globe,
      title: 'Web Development',
      subtitle: 'Your website should close deals, not just exist.',
      description: 'We build custom platforms that convert visitors into customers. Not templates. Not WordPress themes. Real software that integrates with your tools, captures the data you need, and scales with your business.',
      features: [
        { title: 'Custom development', description: 'React, Next.js, or the right tool for the job. Built for performance and maintainability.' },
        { title: 'Full code ownership', description: 'You own everything. No proprietary lock-in, no monthly fees to access your own site.' },
        { title: 'CRM & tool integrations', description: 'Connected to your existing systems from day one. HubSpot, Salesforce, custom ERPs—we handle it.' },
        { title: 'Conversion-focused design', description: 'Every page built to move visitors toward a specific action. Not just "looking good."' },
        { title: 'Mobile-first approach', description: "Designed for phones first, because that's where your visitors are." },
        { title: 'Performance optimized', description: 'Fast load times, clean code, and built for SEO from the ground up.' },
      ],
      process: [
        { title: 'Discovery', description: 'We learn your business, goals, and technical requirements. 1-2 calls.' },
        { title: 'Proposal', description: 'Clear scope, timeline, and fixed price within 48 hours.' },
        { title: 'Design', description: 'Wireframes and visual design. You approve before we build.' },
        { title: 'Development', description: 'We build, you review weekly. No surprises.' },
        { title: 'Launch', description: 'Tested, optimized, and live. Training included.' },
      ],
      faq: [
        { q: 'How long does a typical project take?', a: "6-12 weeks depending on scope. We'll give you a specific timeline in the proposal." },
        { q: 'Do you do maintenance?', a: "Yes, we offer optional maintenance packages. But you're never locked in—you can maintain it yourself or hire anyone." },
        { q: 'What if I already have a website?', a: 'We can rebuild from scratch or improve what you have. Depends on what makes sense for your situation.' },
      ],
    },
    'digital-marketing': {
      icon: BarChart3,
      title: 'Digital Marketing',
      subtitle: "Stop paying for traffic that doesn't convert.",
      description: 'We run campaigns that target decision-makers in your industry—not random clicks. SEO that ranks for buyer-intent keywords. Ads that pay for themselves. Everything tracked, measured, and optimized.',
      features: [
        { title: 'B2B-focused campaigns', description: 'We target the people who actually make buying decisions. Job titles, company size, intent signals.' },
        { title: 'Technical SEO', description: 'Site structure, page speed, schema markup—the foundation that makes content rank.' },
        { title: 'Content that converts', description: 'Not blog posts for the sake of it. Content designed to capture search traffic that converts.' },
        { title: 'Conversion tracking', description: "You'll know exactly which channels and campaigns drive actual revenue, not just clicks." },
        { title: 'Landing page optimization', description: 'A/B testing and continuous improvement. Small changes, big impact.' },
        { title: 'Monthly reporting', description: "Clear reports on what's working, what's not, and what we're doing about it." },
      ],
      process: [
        { title: 'Audit', description: 'We analyze your current marketing, competitors, and opportunities.' },
        { title: 'Strategy', description: 'A clear plan with channels, budgets, and expected outcomes.' },
        { title: 'Setup', description: 'Tracking, campaigns, and content created and launched.' },
        { title: 'Optimize', description: 'Continuous testing and improvement based on real data.' },
      ],
      faq: [
        { q: "What's the minimum budget?", a: 'We typically work with clients spending $3k+/month on ads. Below that, the math rarely works.' },
        { q: 'How long until we see results?', a: "Paid: 2-4 weeks. SEO: 3-6 months for meaningful traffic. We'll set realistic expectations upfront." },
        { q: 'Do you guarantee results?', a: 'We guarantee our work, not market conditions. If we miss agreed targets in 90 days, we make it right.' },
      ],
    },
    'automation': {
      icon: Bot,
      title: 'AI & Automation',
      subtitle: 'Your team is too expensive for repetitive tasks.',
      description: 'We build intelligent workflows that handle the boring stuff—lead qualification, appointment booking, data entry, follow-ups. Custom AI agents that work 24/7. Your team focuses on closing deals while the system runs.',
      features: [
        { title: 'Workflow automation', description: 'n8n, Make, Zapier—whatever fits. Automated processes that connect all your tools.' },
        { title: 'AI chatbots', description: 'Qualify leads, answer FAQs, and book meetings automatically. WhatsApp, web, or wherever.', },
        { title: 'CRM automation', description: 'Leads automatically scored, tagged, and routed to the right person.' },
        { title: 'Email & SMS sequences', description: 'Automated follow-ups that feel personal. Triggered by behavior, not just time.' },
        { title: 'Data sync', description: 'No more manual copying between systems. Everything connected and up to date.' },
        { title: 'Custom AI agents', description: 'Trained on your data. Handles your specific use cases, not generic responses.' },
      ],
      process: [
        { title: 'Map', description: 'We document your current workflows and identify automation opportunities.' },
        { title: 'Prioritize', description: 'Focus on highest-impact automations first. Quick wins that prove value.' },
        { title: 'Build', description: 'We develop and test the automation. You review and approve.' },
        { title: 'Train', description: 'Your team learns how it works. Documentation included.' },
      ],
      faq: [
        { q: 'Will this replace my team?', a: "No. It handles the tasks they shouldn't be doing manually, so they can focus on higher-value work." },
        { q: 'What if something breaks?', a: "We include monitoring and alerts. You'll know before your customers do. Support packages available." },
        { q: 'How do you price this?', a: 'Project-based for builds, optional retainer for ongoing support. No surprises.' },
      ],
    },
    'ai-agents': {
      icon: Bot,
      title: 'AI Agents',
      subtitle: 'Intelligent automation that works 24/7.',
      description: 'Custom AI agents trained on your data. Handle customer inquiries, qualify leads, and automate repetitive tasks around the clock.',
      features: [
        { title: '24/7 availability', description: 'Your AI agent never sleeps, never takes breaks, never has a bad day.' },
        { title: 'Trained on your data', description: 'Not generic responses. Answers based on your products, services, and processes.' },
        { title: 'Multi-channel', description: 'WhatsApp, web chat, email—wherever your customers are.' },
        { title: 'Seamless handoff', description: 'Complex issues get routed to humans with full context. No starting over.' },
        { title: 'Continuous learning', description: 'Gets smarter over time based on real interactions.' },
        { title: 'Analytics dashboard', description: 'See what people ask, how the bot performs, and where to improve.' },
      ],
      process: [
        { title: 'Scope', description: "Define what the agent should handle and what it shouldn't." },
        { title: 'Train', description: 'Feed it your knowledge base, FAQs, and example conversations.' },
        { title: 'Test', description: 'Internal testing before any customer sees it.' },
        { title: 'Launch', description: 'Gradual rollout with monitoring and refinement.' },
      ],
      faq: [
        { q: 'How accurate is it?', a: 'Depends on training quality. We aim for 90%+ first-response accuracy.' },
        { q: 'What about edge cases?', a: "Graceful handoff to humans. The bot knows what it doesn't know." },
        { q: 'Can it integrate with our CRM?', a: 'Yes. HubSpot, Salesforce, Pipedrive, or custom systems.' },
      ],
    },
  };

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
                Get started
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
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image' }}
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
                <p className="text-sm text-slate-400 leading-relaxed pl-8">
                  {feature.description}
                </p>
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
            Book a free call. We'll discuss your needs and tell you honestly 
            if we're the right fit—no pressure, no sales pitch.
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-6 text-base rounded-lg"
            >
              Book a free strategy call
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}