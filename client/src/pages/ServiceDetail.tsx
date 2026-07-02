import { Link, useRoute } from 'wouter';
import { ArrowRight, CheckCircle2, Globe, Bot, BarChart3, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { Project } from '@shared/schema';
import { CATEGORY_TO_PILLAR } from '@shared/taxonomy';
import { onImageError } from '@/lib/placeholder';

export default function ServiceDetail() {
  const [, params] = useRoute('/services/:slug');
  const { t } = useI18n();
  const slug = params?.slug || '';

  // slug is a PILLAR slug. A project belongs on this pillar's page when its
  // category rolls up to the pillar (CATEGORY_TO_PILLAR) and it is flagged
  // showOnServicePage. Uses the default JSON query fn so the data parses properly.
  const { data: allProjects } = useQuery<Project[]>({ queryKey: ['/api/projects'] });
  const relatedProjects = (allProjects || []).filter(
    (p) => p.showOnServicePage && CATEGORY_TO_PILLAR[p.category] === slug
  );

  // The three PILLAR service pages, built from the i18n dictionary.
  const services = {
    software: {
      icon: Globe,
      title: t('serviceDetail.software.title'),
      subtitle: t('serviceDetail.software.desc'),
      description: t('serviceDetail.software.desc'),
      cta: t('serviceDetail.software.cta'),
      features: [
        { title: t('serviceDetail.software.feat.1.title'), description: t('serviceDetail.software.feat.1.desc') },
        { title: t('serviceDetail.software.feat.2.title'), description: t('serviceDetail.software.feat.2.desc') },
        { title: t('serviceDetail.software.feat.3.title'), description: t('serviceDetail.software.feat.3.desc') },
        { title: t('serviceDetail.software.feat.4.title'), description: t('serviceDetail.software.feat.4.desc') },
      ],
      process: [
        { title: t('serviceDetail.software.proc.1.title'), description: t('serviceDetail.software.proc.1.desc') },
        { title: t('serviceDetail.software.proc.2.title'), description: t('serviceDetail.software.proc.2.desc') },
        { title: t('serviceDetail.software.proc.3.title'), description: t('serviceDetail.software.proc.3.desc') },
        { title: t('serviceDetail.software.proc.4.title'), description: t('serviceDetail.software.proc.4.desc') },
        { title: t('serviceDetail.software.proc.5.title'), description: t('serviceDetail.software.proc.5.desc') },
      ],
      faq: [
        { q: t('serviceDetail.software.faq.1.q'), a: t('serviceDetail.software.faq.1.a') },
        { q: t('serviceDetail.software.faq.2.q'), a: t('serviceDetail.software.faq.2.a') },
        { q: t('serviceDetail.software.faq.3.q'), a: t('serviceDetail.software.faq.3.a') },
        { q: t('serviceDetail.software.faq.4.q'), a: t('serviceDetail.software.faq.4.a') },
      ],
    },
    'digital-marketing': {
      icon: BarChart3,
      title: t('serviceDetail.dm.title'),
      subtitle: t('serviceDetail.dm.desc'),
      description: t('serviceDetail.dm.desc'),
      cta: t('serviceDetail.dm.cta'),
      features: [
        { title: t('serviceDetail.dm.feat.1.title'), description: '' },
        { title: t('serviceDetail.dm.feat.2.title'), description: '' },
        { title: t('serviceDetail.dm.feat.3.title'), description: '' },
        { title: t('serviceDetail.dm.feat.4.title'), description: '' },
      ],
      process: [
        { title: t('serviceDetail.dm.proc.1.title'), description: t('serviceDetail.dm.proc.1.desc') },
        { title: t('serviceDetail.dm.proc.2.title'), description: t('serviceDetail.dm.proc.2.desc') },
        { title: t('serviceDetail.dm.proc.3.title'), description: t('serviceDetail.dm.proc.3.desc') },
        { title: t('serviceDetail.dm.proc.4.title'), description: t('serviceDetail.dm.proc.4.desc') },
      ],
      faq: [
        { q: t('serviceDetail.dm.faq.1.q'), a: t('serviceDetail.dm.faq.1.a') },
        { q: t('serviceDetail.dm.faq.2.q'), a: t('serviceDetail.dm.faq.2.a') },
        { q: t('serviceDetail.dm.faq.3.q'), a: t('serviceDetail.dm.faq.3.a') },
      ],
    },
    'ai-training': {
      icon: Bot,
      title: t('serviceDetail.ai.title'),
      subtitle: t('serviceDetail.ai.desc'),
      description: t('serviceDetail.ai.desc'),
      cta: t('serviceDetail.ai.cta'),
      features: [
        { title: t('serviceDetail.ai.feat.1.title'), description: '' },
        { title: t('serviceDetail.ai.feat.2.title'), description: '' },
        { title: t('serviceDetail.ai.feat.3.title'), description: '' },
        { title: t('serviceDetail.ai.feat.4.title'), description: '' },
      ],
      process: [
        { title: t('serviceDetail.ai.proc.1.title'), description: t('serviceDetail.ai.proc.1.desc') },
        { title: t('serviceDetail.ai.proc.2.title'), description: t('serviceDetail.ai.proc.2.desc') },
        { title: t('serviceDetail.ai.proc.3.title'), description: t('serviceDetail.ai.proc.3.desc') },
        { title: t('serviceDetail.ai.proc.4.title'), description: t('serviceDetail.ai.proc.4.desc') },
      ],
      faq: [
        { q: t('serviceDetail.ai.faq.1.q'), a: t('serviceDetail.ai.faq.1.a') },
        { q: t('serviceDetail.ai.faq.2.q'), a: t('serviceDetail.ai.faq.2.a') },
        { q: t('serviceDetail.ai.faq.3.q'), a: t('serviceDetail.ai.faq.3.a') },
      ],
    },
  };

  const service = params?.slug ? services[params.slug as keyof typeof services] : null;

  if (!service) {
    return (
      <div className="min-h-screen pt-20 bg-[#0a0a0b] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">{t('serviceDetail.notFound.title')}</h1>
          <Link href="/services">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg">
              {t('serviceDetail.notFound.button')}
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
            <Button variant="ghost" className="text-slate-500 hover:text-white mb-8 -ms-4">
              {t('serviceDetail.backAll')}
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
                <ArrowRight className="w-4 h-4 ms-2" />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button
                size="lg"
                variant="ghost"
                className="text-slate-400 hover:text-white hover:bg-white/5 px-8 py-6 rounded-lg"
              >
                {t('serviceDetail.seeExamples')}
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
                <h2 className="text-2xl font-bold text-white mb-2">{t('serviceDetail.related.title')}</h2>
                <p className="text-slate-400">{t('serviceDetail.related.sub')}</p>
              </div>
              <Link href="/portfolio">
                <Button variant="ghost" className="text-slate-400 hover:text-white">{t('serviceDetail.related.viewPortfolio')} <ArrowRight className="ms-2 w-4 h-4"/></Button>
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
            {t('serviceDetail.included')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {service.features.map((feature, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                </div>
                {feature.description && (
                  <p className="text-sm text-slate-400 leading-relaxed ps-8">
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
            {t('serviceDetail.how.title')}
          </h2>
          <p className="text-slate-400 mb-12">
            {t('serviceDetail.how.sub')}
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
            {t('serviceDetail.faqTitle')}
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
            {t('serviceDetail.cta.title')}
          </h2>
          <p className="text-lg text-slate-400 mb-10">
            {t('serviceDetail.cta.body')}
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-6 text-base rounded-lg"
            >
              {service.cta}
              <ArrowRight className="w-4 h-4 ms-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
