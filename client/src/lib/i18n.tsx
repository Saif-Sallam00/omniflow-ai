import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.portfolio': 'Portfolio',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'hero.title': 'Transform Your Business with Custom Websites',
    'hero.subtitle': 'and AI-Powered Automation',
    'hero.description': 'Performance-driven websites, built to drive sales and help your business grow.',
    'hero.cta': 'Get Your Custom Website Today',
    'hero.cta.secondary': 'Schedule Consultation',
    'hero.trust': 'Trusted by 500+ businesses',
    'value.title': 'Websites That Drive Sales, Not Just Traffic',
    'value.description': 'OmniflowAI builds performance-driven websites designed to drive conversions and maximize sales. Custom dashboards, SEO optimization, and maintenance services included.',
    'value.custom.title': 'Fully Customizable',
    'value.custom.description': 'Tailored to your brand and business needs with intuitive A-to-Z dashboards.',
    'value.performance.title': 'Performance-Driven',
    'value.performance.description': 'Built for speed, SEO, and conversions to maximize your sales.',
    'value.support.title': 'Ongoing Support',
    'value.support.description': 'Maintenance packages and excellent post-sale service to keep you growing.',
    'service.main.title': 'Custom Websites Built for Growth',
    'service.main.subtitle': 'Fully customizable websites with performance-driven results',
    'service.main.description': 'We build custom websites for service-based businesses like real estate brokers, beauty centers, and more. Easy to use with A-to-Z dashboards, SEO-optimized, and ready to drive sales from day one.',
    'service.main.cta': 'Start Building Your Website Today',
    'service.secondary.title': 'Boost Your Sales with AI and Automation',
    'service.secondary.subtitle': 'Take your business further with automation, AI-driven customer service, and expert digital marketing',
    'service.ai.title': 'AI Agents',
    'service.ai.description': 'Intelligent AI-powered customer service agents that work 24/7 to engage your customers.',
    'service.automation.title': 'Business Automation',
    'service.automation.description': 'Streamline your operations with custom automation solutions that save time and money.',
    'service.marketing.title': 'Digital Marketing',
    'service.marketing.description': 'SEO and performance marketing strategies that drive traffic and conversions.',
    'service.other.title': 'Custom Solutions',
    'service.other.description': 'Tailored solutions for your unique business needs.',
    'portfolio.title': 'Our Work',
    'portfolio.subtitle': 'Results-driven projects that deliver real business value',
    'portfolio.cta': 'View All Projects',
    'testimonials.title': 'What Our Clients Say',
    'testimonials.subtitle': 'Trusted by businesses worldwide',
    'cta.final.title': 'Ready to Get Started?',
    'cta.final.description': 'Let\'s transform your business together. Reach out today and start your project.',
    'cta.final.button': 'Request a Free Consultation',
    'about.title': 'About OmniflowAI',
    'about.subtitle': 'Building digital solutions that drive real business growth',
    'about.description': 'We are committed to delivering excellent post-sale service and performance-driven results. Our team specializes in creating custom websites, AI agents, and automation solutions that help businesses grow.',
    'contact.title': 'Get In Touch',
    'contact.subtitle': 'Ready to transform your business? Contact us today.',
    'contact.form.name': 'Full Name',
    'contact.form.email': 'Email Address',
    'contact.form.phone': 'Phone Number',
    'contact.form.company': 'Company Name',
    'contact.form.service': 'Service Interested In',
    'contact.form.message': 'Your Message',
    'contact.form.submit': 'Send Message',
    'contact.form.submitting': 'Sending...',
    'contact.info.title': 'Contact Information',
    'contact.info.hours': 'Response Time: 24 hours',
    'contact.success': 'Thank you! We\'ll be in touch soon.',
    'contact.error': 'Something went wrong. Please try again.',
    'footer.tagline': 'Transform your business with custom websites and AI-powered automation.',
    'footer.rights': '© 2024 OmniflowAI. All rights reserved.',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.services': 'الخدمات',
    'nav.portfolio': 'الأعمال',
    'nav.about': 'عن الشركة',
    'nav.contact': 'اتصل بنا',
    'hero.title': 'حول عملك بمواقع مخصصة',
    'hero.subtitle': 'وأتمتة مدعومة بالذكاء الاصطناعي',
    'hero.description': 'مواقع ويب تركز على الأداء، مصممة لزيادة المبيعات ومساعدة عملك على النمو.',
    'hero.cta': 'احصل على موقعك المخصص اليوم',
    'hero.cta.secondary': 'حدد موعد استشارة',
    'hero.trust': 'موثوق به من قبل أكثر من 500 شركة',
    'value.title': 'مواقع تحقق المبيعات، وليس فقط الزيارات',
    'value.description': 'تبني OmniflowAI مواقع ويب تركز على الأداء مصممة لزيادة التحويلات وتعظيم المبيعات. لوحات تحكم مخصصة، تحسين SEO، وخدمات الصيانة متضمنة.',
    'value.custom.title': 'قابل للتخصيص بالكامل',
    'value.custom.description': 'مصمم خصيصاً لعلامتك التجارية واحتياجات عملك مع لوحات تحكم بديهية.',
    'value.performance.title': 'يركز على الأداء',
    'value.performance.description': 'مبني للسرعة، تحسين محركات البحث، والتحويلات لتعظيم مبيعاتك.',
    'value.support.title': 'دعم مستمر',
    'value.support.description': 'حزم صيانة وخدمة ممتازة بعد البيع للحفاظ على نموك.',
    'service.main.title': 'مواقع مخصصة مبنية للنمو',
    'service.main.subtitle': 'مواقع ويب قابلة للتخصيص بالكامل مع نتائج تركز على الأداء',
    'service.main.description': 'نبني مواقع ويب مخصصة للشركات القائمة على الخدمات مثل وسطاء العقارات ومراكز التجميل وغيرها. سهلة الاستخدام مع لوحات تحكم شاملة، محسّنة لمحركات البحث، وجاهزة لزيادة المبيعات من اليوم الأول.',
    'service.main.cta': 'ابدأ بناء موقعك اليوم',
    'service.secondary.title': 'عزز مبيعاتك بالذكاء الاصطناعي والأتمتة',
    'service.secondary.subtitle': 'انتقل بعملك إلى الأمام مع الأتمتة وخدمة العملاء المدعومة بالذكاء الاصطناعي والتسويق الرقمي الخبير',
    'service.ai.title': 'وكلاء الذكاء الاصطناعي',
    'service.ai.description': 'وكلاء خدمة عملاء أذكياء مدعومون بالذكاء الاصطناعي يعملون على مدار الساعة للتفاعل مع عملائك.',
    'service.automation.title': 'أتمتة الأعمال',
    'service.automation.description': 'بسّط عملياتك مع حلول أتمتة مخصصة توفر الوقت والمال.',
    'service.marketing.title': 'التسويق الرقمي',
    'service.marketing.description': 'استراتيجيات SEO والتسويق الأدائي التي تزيد من الزيارات والتحويلات.',
    'service.other.title': 'حلول مخصصة',
    'service.other.description': 'حلول مصممة خصيصاً لاحتياجات عملك الفريدة.',
    'portfolio.title': 'أعمالنا',
    'portfolio.subtitle': 'مشاريع تركز على النتائج وتقدم قيمة عمل حقيقية',
    'portfolio.cta': 'عرض جميع المشاريع',
    'testimonials.title': 'آراء عملائنا',
    'testimonials.subtitle': 'موثوق به من قبل الشركات في جميع أنحاء العالم',
    'cta.final.title': 'هل أنت مستعد للبدء؟',
    'cta.final.description': 'لنحول عملك معاً. تواصل معنا اليوم وابدأ مشروعك.',
    'cta.final.button': 'اطلب استشارة مجانية',
    'about.title': 'عن OmniflowAI',
    'about.subtitle': 'بناء حلول رقمية تدفع نمو الأعمال الحقيقي',
    'about.description': 'نحن ملتزمون بتقديم خدمة ممتازة بعد البيع ونتائج تركز على الأداء. فريقنا متخصص في إنشاء مواقع ويب مخصصة ووكلاء ذكاء اصطناعي وحلول أتمتة تساعد الشركات على النمو.',
    'contact.title': 'تواصل معنا',
    'contact.subtitle': 'هل أنت مستعد لتحويل عملك؟ اتصل بنا اليوم.',
    'contact.form.name': 'الاسم الكامل',
    'contact.form.email': 'البريد الإلكتروني',
    'contact.form.phone': 'رقم الهاتف',
    'contact.form.company': 'اسم الشركة',
    'contact.form.service': 'الخدمة المهتم بها',
    'contact.form.message': 'رسالتك',
    'contact.form.submit': 'إرسال الرسالة',
    'contact.form.submitting': 'جاري الإرسال...',
    'contact.info.title': 'معلومات الاتصال',
    'contact.info.hours': 'وقت الاستجابة: 24 ساعة',
    'contact.success': 'شكراً لك! سنتواصل معك قريباً.',
    'contact.error': 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    'footer.tagline': 'حول عملك بمواقع مخصصة وأتمتة مدعومة بالذكاء الاصطناعي.',
    'footer.rights': '© 2024 OmniflowAI. جميع الحقوق محفوظة.',
  },
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'ar' || saved === 'en') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'ar';

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
