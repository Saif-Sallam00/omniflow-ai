// 
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    // ... (keep existing translations)
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.portfolio': 'Portfolio',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'hero.title': 'High-Performance Websites',
    'hero.subtitle': '& AI Automation',
    'hero.description': 'We build digital solutions designed to scale your revenue and automate your workflow.',
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
    'split.brand.title': 'Build a Brand That Looks Expensive',
    'split.brand.subtitle': 'For Legal, Medical & Creative Professionals',
    'split.brand.desc': 'We craft digital identities that elevate your presence, influence perception, and make your audience take you seriously.',
    'split.brand.cta': 'Craft My Brand Presence',
    'split.tech.title': 'Automate the Work That Slows Your Business',
    'split.tech.subtitle': 'For SMBs, Real Estate & Enterprise',
    'split.tech.desc': 'We design intelligent workflows and AI systems that cut costs, eliminate repetitive tasks, and streamline operations for scale.',
    'split.tech.cta': 'Automate My Operations',
    'partners.trusted': 'Trusted Partners',
    'roi.badge': 'ROI Calculator',
    'roi.title': 'Stop Paying for',
    'roi.title.highlight': 'Repetitive Work',
    'roi.desc': 'Calculate how much your business wastes on manual data entry, scheduling, and repetitive tasks. See how OmniflowAI automation pays for itself.',
    'roi.savings': 'Potential Annual Savings',
    'roi.hours': 'Hours Saved Annually',
    'roi.cta': 'Start Saving Today',
    'roi.input.employees': 'Employees doing manual tasks',
    'roi.input.hours': 'Hours per week (per person)',
    'roi.input.wage': 'Average Hourly Wage',
    'roi.insight.prefix': 'Insight: You are currently spending',
    'roi.insight.mid': 'on manual labor. OmniflowAI could reduce this to approximately',
    'roi.chart.current': 'Current Cost',
    'roi.chart.automated': 'With Automation',
    'nav.category.brand': 'Brand & Presence',
    'nav.category.growth': 'Growth & Operations',
    'nav.service.website.desc': 'Bespoke design & high performance',
    'nav.service.marketing.desc': 'SEO & market positioning',
    'nav.service.automation.desc': 'Streamline workflows & ERP',
    'nav.service.ai.desc': '24/7 Intelligent support',
    'services.selector.title': 'Choose Your Need',
    'services.selector.brand.title': 'For Individuals & Personal Brands',
    'services.selector.brand.desc': 'Build a premium digital identity that elevates your presence.',
    'services.selector.brand.cta': 'Explore Branding & Websites',
    'services.selector.business.title': 'For Businesses',
    'services.selector.business.desc': 'Automate your operations, scale your workflows, and integrate AI.',
    'services.selector.business.cta': 'Explore Business Solutions',
    'services.cta.brand': 'Book a Brand Strategy Call',
    'services.cta.business': 'Request a Business Automation Assessment',

    // NEW PORTFOLIO CATEGORIES
    'portfolio.category.websites': 'Custom Websites',
    'portfolio.category.automation': 'Automation Systems',
    'portfolio.category.ai': 'AI Agents & AI Systems',
  },
  ar: {
    // ... (keep existing translations)
    'nav.home': 'الرئيسية',
    'nav.services': 'الخدمات',
    'nav.portfolio': 'الأعمال',
    'nav.about': 'عن الشركة',
    'nav.contact': 'اتصل بنا',
    'hero.title': 'مواقع إلكترونية عالية الأداء',
    'hero.subtitle': 'وأتمتة بالذكاء الاصطناعي',
    'hero.description': 'نبني حلولاً رقمية مصممة لزيادة إيراداتك وأتمتة سير عملك.',
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
    'split.brand.title': 'ارتقِ بعلامتك التجارية',
    'split.brand.subtitle': 'للمحامين والأطباء والمبدعين',
    'split.brand.desc': 'مواقع إلكترونية مصممة خصيصاً لبناء الثقة والهيبة والحضور المميز في السوق.',
    'split.brand.cta': 'تصفح خدمات التصميم',
    'split.tech.title': 'أتمتة أعمالك',
    'split.tech.subtitle': 'للشركات الصغيرة والمتوسطة والعقارات',
    'split.tech.desc': 'أنظمة ERP قابلة للتوسع، ووكلاء ذكاء اصطناعي، وأتمتة سير العمل لمضاعفة أرباحك.',
    'split.tech.cta': 'اكتشف حلول الأتمتة',
    'partners.trusted': 'شركاء النجاح',
    'roi.badge': 'حاسبة العائد على الاستثمار',
    'roi.title': 'توقف عن الدفع مقابل',
    'roi.title.highlight': 'العمل المتكرر',
    'roi.desc': 'احسب تكلفة إهدار الوقت في إدخال البيانات يدوياً، والجدولة، والمهام المتكررة. اكتشف كيف تدفع أتمتة OmniflowAI تكلفتها بنفسها.',
    'roi.savings': 'التوفير السنوي المتوقع',
    'roi.hours': 'ساعات العمل الموفرة سنوياً',
    'roi.cta': 'ابدأ التوفير اليوم',
    'roi.input.employees': 'عدد الموظفين في المهام اليدوية',
    'roi.input.hours': 'الساعات أسبوعياً (للموظف)',
    'roi.input.wage': 'متوسط الأجر بالساعة ($)',
    'roi.insight.prefix': 'رؤية: أنت تنفق حالياً',
    'roi.insight.mid': 'على العمل اليدوي. يمكننا تقليل هذا إلى',
    'roi.chart.current': 'التكلفة الحالية',
    'roi.chart.automated': 'مع الأتمتة',
    'nav.category.brand': 'العلامة التجارية والحضور الرقمي',
    'nav.category.growth': 'النمو والعمليات',
    'nav.service.website.desc': 'تصميم مخصص وأداء عالي',
    'nav.service.marketing.desc': 'تحسين محركات البحث وتموضع السوق',
    'nav.service.automation.desc': 'تبسيط سير العمل وأنظمة ERP',
    'nav.service.ai.desc': 'دعم ذكي على مدار الساعة',
    'services.selector.title': 'اختر ما يناسبك',
    'services.selector.brand.title': 'للأفراد والعلامات التجارية الشخصية',
    'services.selector.brand.desc': 'ابني هوية رقمية متميزة تعزز حضورك.',
    'services.selector.brand.cta': 'اكتشف العلامة التجارية والمواقع',
    'services.selector.business.title': 'للشركات',
    'services.selector.business.desc': 'أتمتة عملياتك، وتوسيع سير عملك، ودمج الذكاء الاصطناعي.',
    'services.selector.business.cta': 'اكتشف حلول الأعمال',
    'services.cta.brand': 'احجز جلسة استراتيجية للعلامة التجارية',
    'services.cta.business': 'طلب تقييم أتمتة الأعمال',

    // NEW PORTFOLIO CATEGORIES (ARABIC)
    'portfolio.category.websites': 'مواقع مخصصة',
    'portfolio.category.automation': 'أنظمة الأتمتة',
    'portfolio.category.ai': 'وكلاء وأنظمة الذكاء الاصطناعي',
  },
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('language');
      return (saved === 'ar' || saved === 'en') ? saved : 'en';
    }
    return 'en';
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('language', language);
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.body.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
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