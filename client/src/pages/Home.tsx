import { Link } from 'wouter';
import { ArrowRight, Sparkles, Zap, Palette, Settings, Bot, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import dashboardImage from '@assets/generated_images/website_dashboard_mockup_showcase.png';
import aiImage from '@assets/generated_images/ai_automation_visual_concept.png';
import { ROICalculator } from '@/components/ROICalculator';

export default function Home() {
  const { t, isRTL } = useI18n();

  const partners = [
    { 
      name: "Shopify", 
      logo: "https://cdn.worldvectorlogo.com/logos/shopify.svg" 
    },
    { 
      name: "n8n", 
      logo: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/n8n.svg" 
    },
    { 
      name: "Zapier",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zapier_logo.svg" 
    },
    { 
      name: "ERPNext", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Erpnext_logo.svg" 
    },
    { 
      name: "WhatsApp", 
      logo: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/whatsapp.svg" 
    },
    { 
      name: "Facebook", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" 
    },
    { 
      name: "Instagram", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" 
    },
  ];

  // Duplicate list for seamless infinite scroll
  const scrollingPartners = [...partners, ...partners];

  return (
    <div className="min-h-screen flex flex-col">
      {/* === FLOATING WHATSAPP CTA === */}
      <a 
        href="https://wa.me/201092849400" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 group"
      >
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75 group-hover:opacity-100"></div>
        <div className="relative bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2">
          <MessageCircle className="w-8 h-8" />
          <span className="hidden group-hover:block font-bold pr-2 whitespace-nowrap transition-all">
            Chat on WhatsApp
          </span>
        </div>
      </a>

      {/* === THE SPLIT HERO === */}
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)] mt-20">

        {/* LEFT DOOR: The Boutique (Brand/Design) */}
        <div className="relative group overflow-hidden bg-[#FDFBF7] text-slate-900 flex flex-col justify-center p-8 md:p-16 lg:p-24 transition-all duration-500 hover:bg-white border-b lg:border-b-0 lg:border-r border-slate-200">
          <div className="z-10 max-w-xl mx-auto lg:mx-0 transition-transform duration-500 group-hover:translate-y-[-8px]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 text-slate-700 text-xs font-medium mb-6 tracking-wider uppercase">
              <Palette className="w-3 h-3" />
              {t('split.brand.subtitle')}
            </div>
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">
              {t('split.brand.title')}
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-md font-light">
              {t('split.brand.desc')}
            </p>
            <Link href="/services/website-development">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg bg-slate-900 text-white hover:bg-slate-800 shadow-2xl hover:shadow-xl transition-all">
                {t('split.brand.cta')}
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Button>
            </Link>
          </div>

          {/* Decorative BG Element */}
          <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-t from-slate-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </div>

        {/* RIGHT DOOR: The Engine (Automation/Tech) */}
        <div className="relative group overflow-hidden bg-[#0F172A] text-white flex flex-col justify-center p-8 md:p-16 lg:p-24 transition-all duration-500 hover:bg-[#020617]">
          <div className="absolute inset-0 opacity-20">
             <div className="absolute right-[-20%] top-[-20%] w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px]" />
             <div className="absolute left-[-10%] bottom-[-10%] w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px]" />
          </div>

          <div className="z-10 max-w-xl mx-auto lg:mx-0 transition-transform duration-500 group-hover:translate-y-[-8px]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 text-blue-200 border border-blue-800/50 text-xs font-medium mb-6 tracking-wider uppercase font-mono">
              <Bot className="w-3 h-3" />
              {t('split.tech.subtitle')}
            </div>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
              {t('split.tech.title')}
            </h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-md font-light">
              {t('split.tech.desc')}
            </p>
            <Link href="/services/automation">
              <Button size="lg" className="rounded-none px-8 py-6 text-lg bg-blue-600 hover:bg-blue-500 border border-blue-400/20 shadow-[0_0_30px_-10px_rgba(37,99,235,0.5)] transition-all">
                {t('split.tech.cta')}
                <Zap className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* === TECH PARTNERS MARQUEE (Infinite Scroll) === */}
      <div className="border-y border-slate-100 bg-white py-16 overflow-hidden relative group">
        {/* Fade edges for smooth look */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-scroll gap-24 items-center group-hover:[animation-play-state:paused]">
          {scrollingPartners.map((partner, index) => (
            <div key={index} className="flex flex-col items-center justify-center gap-6 min-w-[180px] transition-transform duration-300 hover:scale-105 cursor-default">

              {/* Logo Image - Full Color, Increased size for better visibility */}
              <div className="h-20 w-full flex items-center justify-center">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="h-full w-auto object-contain max-h-16 drop-shadow-sm"
                />
              </div>

              <span className="text-2xl font-bold font-display text-slate-800 tracking-tight text-center">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* === SEGMENTED SERVICES OVERVIEW === */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* COLUMN 1: For Brands */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-[#FDFBF7] border border-slate-200 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-2xl font-serif font-medium">For Brands & Professionals</h3>
              </div>
              <div className="group bg-white p-6 rounded-xl border border-slate-100 hover:shadow-lg transition-all cursor-pointer">
                <h4 className="text-lg font-bold mb-2">Bespoke Website Design</h4>
                <p className="text-slate-500 text-sm leading-relaxed">Minimalist, high-performance websites tailored for lawyers, architects, and premium service providers.</p>
              </div>
              <div className="group bg-white p-6 rounded-xl border border-slate-100 hover:shadow-lg transition-all cursor-pointer">
                <h4 className="text-lg font-bold mb-2">Visual Identity & SEO</h4>
                <p className="text-slate-500 text-sm leading-relaxed">Ensure your practice appears first when clients search for "Best [Service] in [City]".</p>
              </div>
            </div>

            {/* COLUMN 2: For Operations */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-[#0F172A] flex items-center justify-center">
                  <Settings className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-2xl font-display font-bold">For Enterprise & Scale</h3>
              </div>
              <div className="group bg-white p-6 rounded-xl border border-slate-100 hover:shadow-lg hover:border-blue-100 transition-all cursor-pointer">
                <h4 className="text-lg font-bold mb-2 font-display">ERP & CRM Integration</h4>
                <p className="text-slate-500 text-sm leading-relaxed">Connect your inventory to accounting. Sync leads to Slack. Stop manual data entry.</p>
              </div>
              <div className="group bg-white p-6 rounded-xl border border-slate-100 hover:shadow-lg hover:border-blue-100 transition-all cursor-pointer">
                <h4 className="text-lg font-bold mb-2 font-display">AI Customer Agents</h4>
                <p className="text-slate-500 text-sm leading-relaxed">Train an AI on your data to handle support tickets, booking inquiries, and HR questions 24/7.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === ROI CALCULATOR === */}
      <ROICalculator />

      {/* === FEATURED WORK === */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-12 text-center">Selected Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer shadow-lg">
              <img src={dashboardImage} alt="Real Estate" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
              <div className="absolute bottom-0 left-0 p-8">
                <p className="text-xs font-medium text-white/80 uppercase tracking-widest mb-2">Real Estate</p>
                <h3 className="text-2xl font-serif text-white">Luxury Property Portfolio</h3>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer shadow-lg">
              <img src={aiImage} alt="Automation" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-blue-900/60 group-hover:bg-blue-900/40 transition-all" />
              <div className="absolute bottom-0 left-0 p-8">
                <p className="text-xs font-mono text-blue-200 uppercase tracking-widest mb-2">Logistics Automation</p>
                <h3 className="text-2xl font-display font-bold text-white">Global Inventory Sync System</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === FINAL CTA === */}
      <section className="py-32 bg-[#0F172A] text-white text-center px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-display font-bold">Ready to Transform?</h2>
          <p className="text-xl text-slate-400 font-light">Whether you need a brand overhaul or a system upgrade, we have the team.</p>
          <Link href="/contact">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-200 px-10 py-6 text-lg font-bold rounded-full border-none">
              Start Your Project
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}