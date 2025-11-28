// 
import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Code, Bot, Zap, BarChart3, Check, User, Building2, Paintbrush, Briefcase, ChevronRight, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/lib/i18n';

export default function Services() {
  const { t, isRTL } = useI18n();
  const [activeAudience, setActiveAudience] = useState<'brand' | 'business'>('brand');

  // === DATA: PATH 1 (BRAND / INDIVIDUALS) ===
  const brandServices = [
    {
      icon: Code,
      title: 'Website Development',
      description: 'We build websites that act as digital identities — visually distinct, technically solid, and designed to leave a lasting impression.',
      features: ['Custom Visual Design', 'Fast Performance', 'Mobile Optimized'],
      badge: 'Creator: Built a premium site that doubled inquiries.',
      href: '/services/website-development',
    },
    {
      icon: Paintbrush,
      title: 'Brand Strategy & Identity',
      description: 'Research-driven branding built on market insight, audience psychology, and a clear visual identity that communicates authority.',
      features: ['Logo & Visual Systems', 'Voice & Messaging', 'Market Positioning'],
      badge: 'Consultant: Rebranded for high-ticket clients.',
      href: '/services/website-development', // Linking to main dev page for now
    },
    {
      icon: BarChart3,
      title: 'Visual Identity',
      description: 'Compelling visual narratives that elevate your presence across all digital touchpoints.',
      features: ['Social Media Assets', 'Presentation Decks', 'Digital Collateral'],
      badge: null,
      href: '/services/digital-marketing',
    }
  ];

  // === DATA: PATH 2 (BUSINESS / TECH) ===
  const businessServices = [
    {
      icon: Workflow,
      title: 'Workflow Automation',
      description: 'Connect your tools, remove manual work, and build processes that run consistently without human oversight.',
      features: ['Zapier/n8n Integration', 'CRM Sync', 'Automated Reporting'],
      badge: 'Clinic: Automated 9 operational workflows.',
      href: '/services/automation',
    },
    {
      icon: Bot,
      title: 'AI Agents',
      description: 'AI agents trained on your data to handle support, bookings, repetitive tasks, and internal operations — available nonstop.',
      features: ['24/7 Support Bot', 'Internal Knowledge Base', 'Lead Qualification'],
      badge: 'TechCo: Reduced support tickets by 60%.',
      href: '/services/ai-agents',
    },
    {
      icon: Briefcase,
      title: 'System Integrations',
      description: 'Unified dashboards and custom ERP modules to give you total control over your business data.',
      features: ['Custom Dashboards', 'ERP Modules', 'Data Migration'],
      badge: null,
      href: '/services/automation',
    }
  ];

  const currentServices = activeAudience === 'brand' ? brandServices : businessServices;
  const isBrand = activeAudience === 'brand';

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-500 ${isBrand ? 'bg-[#FDFBF7]' : 'bg-slate-50'}`}>

      {/* === SECTION A: AUDIENCE SELECTOR === */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-slate-900">
              {t('services.selector.title')}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Card 1: Brand/Individual */}
            <div 
              onClick={() => setActiveAudience('brand')}
              className={`cursor-pointer relative overflow-hidden rounded-2xl p-8 border-2 transition-all duration-300 group ${
                isBrand 
                  ? 'border-slate-900 bg-white shadow-xl scale-[1.02]' 
                  : 'border-transparent bg-white/50 hover:bg-white hover:border-slate-200 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full ${isBrand ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                  <User className="w-6 h-6" />
                </div>
                <h3 className={`text-xl font-bold ${isBrand ? 'text-slate-900' : 'text-slate-500'}`}>
                  {t('services.selector.brand.title')}
                </h3>
              </div>
              <p className={`text-base mb-6 ${isBrand ? 'text-slate-600' : 'text-slate-400'}`}>
                {t('services.selector.brand.desc')}
              </p>
              <div className={`flex items-center text-sm font-medium ${isBrand ? 'text-slate-900' : 'text-slate-400'}`}>
                {t('services.selector.brand.cta')}
                {isBrand && <ChevronRight className={`w-4 h-4 ${isRTL ? 'mr-1' : 'ml-1'}`} />}
              </div>
            </div>

            {/* Card 2: Business/Tech */}
            <div 
              onClick={() => setActiveAudience('business')}
              className={`cursor-pointer relative overflow-hidden rounded-2xl p-8 border-2 transition-all duration-300 group ${
                !isBrand 
                  ? 'border-blue-600 bg-white shadow-xl scale-[1.02]' 
                  : 'border-transparent bg-white/50 hover:bg-white hover:border-slate-200 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full ${!isBrand ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className={`text-xl font-bold ${!isBrand ? 'text-slate-900' : 'text-slate-500'}`}>
                  {t('services.selector.business.title')}
                </h3>
              </div>
              <p className={`text-base mb-6 ${!isBrand ? 'text-slate-600' : 'text-slate-400'}`}>
                {t('services.selector.business.desc')}
              </p>
              <div className={`flex items-center text-sm font-medium ${!isBrand ? 'text-blue-600' : 'text-slate-400'}`}>
                {t('services.selector.business.cta')}
                {!isBrand && <ChevronRight className={`w-4 h-4 ${isRTL ? 'mr-1' : 'ml-1'}`} />}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === SECTION B: CURATED SERVICES LIST === */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card 
                  key={index} 
                  className={`border-0 shadow-sm hover:shadow-lg transition-all duration-300 group ${
                    isBrand ? 'hover:translate-y-[-4px]' : 'hover:border-blue-200 hover:border'
                  }`}
                >
                  <CardContent className="p-8 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isBrand 
                          ? 'bg-slate-50 text-slate-900' 
                          : 'bg-blue-50 text-blue-600'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>

                    <h3 className={`text-2xl font-bold mb-3 ${isBrand ? 'font-serif' : 'font-display'}`}>
                      {service.title}
                    </h3>

                    <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                      {service.description}
                    </p>

                    {/* Features List (Micro-descriptions on hover could go here, but static for clarity first) */}
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-500">
                          <div className={`w-1.5 h-1.5 rounded-full ${isBrand ? 'bg-slate-300' : 'bg-blue-300'}`} />
                          {feat}
                        </li>
                      ))}
                    </ul>

                    {/* Case Study Badge */}
                    {service.badge && (
                      <div className={`mb-6 text-xs font-medium px-3 py-2 rounded-lg ${
                        isBrand 
                          ? 'bg-amber-50 text-amber-800 border border-amber-100' 
                          : 'bg-green-50 text-green-800 border border-green-100'
                      }`}>
                        {service.badge}
                      </div>
                    )}

                    <Link href={service.href}>
                      <Button 
                        variant="ghost" 
                        className={`w-full justify-between group-hover:bg-slate-50 ${
                          isBrand ? 'text-slate-900' : 'text-blue-600'
                        }`}
                      >
                        Learn More
                        <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* === SECTION C: DYNAMIC CTA === */}
          <div className="mt-20 text-center">
            <div className={`inline-block p-1 rounded-full ${isBrand ? 'bg-slate-100' : 'bg-blue-50'}`}>
              <Link href={`/contact?intent=${isBrand ? 'consultation' : 'audit'}`}>
                <Button 
                  size="lg" 
                  className={`rounded-full px-10 py-7 text-lg ${
                    isBrand 
                      ? 'bg-slate-900 text-white hover:bg-slate-800' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                  }`}
                >
                  {isBrand ? t('services.cta.brand') : t('services.cta.business')}
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}