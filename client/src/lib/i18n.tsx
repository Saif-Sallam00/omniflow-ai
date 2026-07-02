import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Language = "en" | "ar";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // === NAVIGATION ===
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.portfolio": "Portfolio",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.login": "Client Login",

    // === HERO SECTION ===
    "hero.badge": "Operational Partner",
    "hero.title.line1": "Turn Digital Presence Into",
    "hero.title.highlight": "Revenue Infrastructure",
    "hero.description":
      "We don't just build websites. We engineer the systems that cut costs, automate workflows, and capture data for serious businesses.",
    "hero.cta.primary": "Book Strategy Call",
    "hero.cta.secondary": "Start Consultation",

    // === CLIENTS ===
    "clients.label": "Powering Growth For",

    // === PROBLEM / SOLUTION ===
    "problem.title": "The Agency Model is Broken.",
    "problem.subtitle":
      "You don't need another redesign. You need operational clarity.",
    "problem.1.gap": "The Gap",
    "problem.1.title": "Your website is a brochure, not a system.",
    "problem.1.fix": "The Fix",
    "problem.1.desc":
      "We build digital infrastructure that integrates with your ERP and captures real data.",
    "problem.2.title": "Your team is drowning in data entry.",
    "problem.2.desc":
      "We deploy n8n workflows that handle the busywork, saving 20+ hours a week.",
    "problem.3.title": "You're losing leads to slow follow-ups.",
    "problem.3.desc":
      "We install AI agents that engage, qualify, and book meetings instantly, 24/7.",

    // === SERVICES (THE 3 SYSTEMS) ===
    "services.title": "The Operational System",
    "services.subtitle": "Three integrated layers. One scalable engine.",

    // System 1: Build
    "system.build.title": "Infrastructure",
    "system.build.subtitle": "High-Performance Web",
    "system.build.desc":
      "Custom architecture. Deep ERP integration. No templates.",
    "system.build.feat1": "Custom Web Applications",
    "system.build.feat2": "E-commerce Systems",
    "system.build.feat3": "SaaS Development",
    "system.build.cta": "Explore Infrastructure",

    // System 2: Attract
    "system.attract.title": "Growth",
    "system.attract.subtitle": "Acquisition Systems",
    "system.attract.desc":
      "Technical SEO and programmatic content that feeds the engine.",
    "system.attract.feat1": "Technical SEO",
    "system.attract.feat2": "B2B Lead Gen",
    "system.attract.feat3": "Conversion Optimization",
    "system.attract.cta": "Explore Growth",

    // System 3: Automate
    "system.automate.title": "Automation",
    "system.automate.subtitle": "Operational Intelligence",
    "system.automate.desc": "Workflows that run your business while you sleep.",
    "system.automate.feat1": "n8n Workflow Design",
    "system.automate.feat2": "AI Agents",
    "system.automate.feat3": "System Syncing",
    "system.automate.cta": "Explore Automation",

    // === FOOTER ===
    "footer.tagline": "Engineered for Scale.",
    "footer.cta": "Start Your Project",
    "footer.rights": "© 2026 OmniflowAI. All rights reserved.",

    // === COMMON ===
    "cta.final.title": "Stop Guessing. Start Scaling.",
    "cta.final.desc":
      "Book a system audit. We'll show you exactly where you're leaking revenue.",
    "cta.final.button": "Start Your Project",
    "testimonials.title": "Partner Feedback",
  },
  ar: {
    // === NAVIGATION ===
    "nav.home": "الرئيسية",
    "nav.services": "الأنظمة",
    "nav.portfolio": "أعمالنا",
    "nav.about": "عن الشركة",
    "nav.contact": "تواصل معنا",
    "nav.login": "دخول العملاء",

    // === HERO SECTION ===
    "hero.badge": "شريكك التشغيلي",
    "hero.title.line1": "حول حضورك الرقمي إلى",
    "hero.title.highlight": "بنية تحتية للعائدات",
    "hero.description":
      "نحن لا نكتفي ببناء المواقع الإلكترونية. نحن نهندس الأنظمة التي تخفض التكاليف، تؤتمت العمليات، وتجمع البيانات للشركات الطموحة.",
    "hero.cta.primary": "حجز مكالمة استراتيجية",
    "hero.cta.secondary": "تصفح دراسات الحالة",

    // === CLIENTS ===
    "clients.label": "شركاء النجاح والنمو",

    // === PROBLEM / SOLUTION ===
    "problem.title": "نموذج الوكالات التقليدي لم يعد يجدي.",
    "problem.subtitle":
      'أنت لا تحتاج إلى "تجديد تصميم". أنت تحتاج إلى وضوح تشغيلي.',
    "problem.1.gap": "الفجوة",
    "problem.1.title": 'موقعك مجرد "بروشور"، وليس نظاماً.',
    "problem.1.fix": "الحل",
    "problem.1.desc":
      "نبني بنية تحتية رقمية تتكامل مع أنظمة تخطيط الموارد (ERP) وتلتقط بيانات حقيقية.",
    "problem.2.title": "فريقك غارق في إدخال البيانات.",
    "problem.2.desc":
      "ننشر مسارات عمل n8n تتولى المهام الروتينية، مما يوفر أكثر من 20 ساعة أسبوعياً.",
    "problem.3.title": "تخسر العملاء بسبب بطء المتابعة.",
    "problem.3.desc":
      "نثبت وكلاء ذكاء اصطناعي يتفاعلون، يؤهلون العملاء، ويحجزون المواعيد فورياً 24/7.",

    // === SERVICES (THE 3 SYSTEMS) ===
    "services.title": "النظام التشغيلي المتكامل",
    "services.subtitle": "ثلاث طبقات مترابطة. محرك واحد قابل للتوسع.",

    // System 1: Build
    "system.build.title": "البنية التحتية",
    "system.build.subtitle": "مواقع عالية الأداء",
    "system.build.desc":
      "هيكلية برمجية مخصصة. تكامل عميق مع ERP. لا نستخدم القوالب الجاهزة.",
    "system.build.feat1": "تطبيقات ويب مخصصة",
    "system.build.feat2": "أنظمة التجارة الإلكترونية",
    "system.build.feat3": "تطوير برمجيات (SaaS)",
    "system.build.cta": "اكتشف البنية التحتية",

    // System 2: Attract
    "system.attract.title": "النمو",
    "system.attract.subtitle": "أنظمة الاستحواذ",
    "system.attract.desc":
      "تحسين محركات البحث التقني ومحتوى مبرمج يغذي محرك النمو.",
    "system.attract.feat1": "تحسين محركات البحث التقني",
    "system.attract.feat2": "توليد عملاء B2B",
    "system.attract.feat3": "تحسين معدلات التحويل",
    "system.attract.cta": "اكتشف أنظمة النمو",

    // System 3: Automate
    "system.automate.title": "الأتمتة",
    "system.automate.subtitle": "الذكاء التشغيلي",
    "system.automate.desc": "مسارات عمل تدير شركتك حتى أثناء نومك.",
    "system.automate.feat1": "تصميم مسارات n8n",
    "system.automate.feat2": "وكلاء الذكاء الاصطناعي",
    "system.automate.feat3": "مزامنة الأنظمة",
    "system.automate.cta": "اكتشف الأتمتة",

    // === FOOTER ===
    "footer.tagline": "هندسة التوسع والنمو.",
    "footer.cta": "ابدأ مشروعك",
    "footer.rights": "© 2026 OmniflowAI. جميع الحقوق محفوظة.",

    // === COMMON ===
    "cta.final.title": "توقف عن التخمين. ابدأ التوسع.",
    "cta.final.desc":
      "احجز تدقيقاً للنظام. سنوضح لك بالضبط أين تخسر الإيرادات.",
    "cta.final.button": "ابدأ مشروعك الآن",
    "testimonials.title": "آراء الشركاء",
  },
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const saved = localStorage.getItem("language");
      return saved === "ar" || saved === "en" ? saved : "en";
    }
    return "en";
  });

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("language", language);
      document.documentElement.lang = language;
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
      document.body.dir = language === "ar" ? "rtl" : "ltr";
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  const isRTL = language === "ar";

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
