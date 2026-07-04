import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Globe, ArrowRight, Hexagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { t, language, setLanguage, isRTL } = useI18n();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/services', label: t('nav.services') },
    { href: '/portfolio', label: t('nav.portfolio') },
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-slate-950/90 backdrop-blur-md border-slate-800/50 py-2' 
          : 'bg-slate-950/0 border-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-16">

          <Link href="/">
            <span className="flex items-center gap-3 cursor-pointer group">
              {/* Code-based Logo with Hexagon */}
              <span className="text-4xl font-bold font-display tracking-tight transition-colors flex items-center">
                <Hexagon className="w-9 h-9 text-brand-500 group-hover:text-brand-400 transition-colors stroke-[3] mr-1" />
                <span className="text-white group-hover:text-brand-400 transition-colors">Omniflow</span>
                <span className="text-brand-500 group-hover:text-brand-400 transition-colors">AI</span>
              </span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={`text-sm font-medium transition-colors cursor-pointer ${location === link.href ? 'text-brand-400' : 'text-slate-300 hover:text-white'}`}>
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              aria-label={language === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
              className="rounded-full text-slate-400 hover:text-white hover:bg-white/10"
            >
              <Globe className="w-5 h-5" />
            </Button>
            <Link href="/contact">
              <Button className="bg-primary text-primary-foreground font-semibold rounded-full px-6">
                {t('nav.cta')}
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-t border-slate-800 absolute top-full left-0 right-0 h-screen">
          <div className="px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`block px-4 py-4 rounded-xl text-lg font-medium transition-colors cursor-pointer ${
                    location === link.href ? 'text-brand-400 bg-brand-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <div className="flex gap-3 mt-8">
              <Button variant="outline" className="flex-1 border-slate-700 text-slate-300 h-12" onClick={toggleLanguage}>
                <Globe className="w-4 h-4 mr-2" /> {language === 'en' ? 'العربية' : 'English'}
              </Button>
              <Link href="/contact" className="flex-1">
                <Button className="w-full bg-primary text-primary-foreground font-bold h-12 rounded-full" onClick={() => setIsMobileMenuOpen(false)}>
                  {t('nav.cta')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}