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

// =============================================================================
// FINAL bilingual copy (Layer 5). English is the live Layer 2/3/4 copy; Arabic
// is formal Modern Standard Arabic (فصحى) for a B2B "digital transformation
// partner". Keys are flat + dot-namespaced by page/section.
// NOTE: brand ("OmniflowAI"), CONTACT_EMAIL, enum/code values, DB content, and
// the frozen team section are intentionally NOT translated.
// =============================================================================
const translations: Record<Language, Record<string, string>> = {
  en: {
    // --- NAV ---
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.portfolio": "Portfolio",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.cta": "Let's Talk",

    // --- COMMON ---
    "common.cta.bookCall": "Book a strategy call",
    "common.brandLine": "We don't hand over deliverables and walk away. We build systems that keep working after we're gone.",
    "common.all": "All",
    "common.viewAllProjects": "View all projects",
    "whatsapp.chat": "Chat on WhatsApp",

    // --- CATEGORY LABELS (public) ---
    "category.business-systems": "Business Systems",
    "category.web": "Web",
    "category.mobile": "Mobile",
    "category.automation": "Automation & AI",
    "category.digital-marketing": "Digital Marketing",
    "category.ai-training": "AI Training",

    // --- CONTACT SERVICE OPTIONS ---
    "serviceOpt.ai-training": "AI Training",
    "serviceOpt.digital-marketing": "Digital Marketing",
    "serviceOpt.software": "Software",
    "serviceOpt.other": "Other",

    // --- PILLARS (shared by Home + Services) ---
    "pillars.aiTraining.title": "AI training that turns tools into capability",
    "pillars.aiTraining.body": "We run structured AI adoption programs for teams and leadership — from executive strategy sessions to hands-on workflow integration. The goal isn't awareness, it's operational capability: your people using AI on real work, not watching a demo.",
    "pillars.digitalMarketing.title": "Marketing built as an acquisition system",
    "pillars.digitalMarketing.body": "SEO, paid campaigns, and conversion strategy wired into one engine that targets qualified buyers — not vanity traffic. Every stage is tracked, so you know what a lead actually costs and where revenue comes from.",
    "pillars.software.title": "Software that becomes your operational backbone",
    "pillars.software.body": "The systems your business runs on — ERP and CRM platforms, customer-facing web, mobile apps, and the automation that connects them. Built to own, integrate, and scale, not to rent.",
    "pillars.software.subcaps": "Business Systems (ERP/CRM) · Web Platforms · Mobile Apps · Automation & AI",

    // --- HOME ---
    "home.hero.h1.lead": "We build the systems behind",
    "home.hero.h1.highlight": "business growth.",
    "home.hero.sub": "Your digital transformation partner for AI training, digital marketing, and business software — engineered as one integrated system, not four disconnected services.",
    "home.hero.cta2": "See our work",
    "home.trust": "Trusted by teams building the future of their industries.",
    "home.valueProp.title.lead": "Most companies don't have a marketing problem.",
    "home.valueProp.title.highlight": "They have a systems problem.",
    "home.valueProp.body": "Disconnected tools, manual handoffs, and no clear line of sight from a lead to a closed deal. We connect the whole chain — how you acquire customers, how you convert them, and how you operate once they're in — so the parts work as one system you can actually measure.",
    "home.pillars.title": "Three capabilities. One transformation partner.",
    "home.transform.title": "From scattered tools to one connected system",
    "home.transform.before.label": "Before",
    "home.transform.after.label": "After",
    "home.transform.before.1": "Tools that don't talk to each other",
    "home.transform.before.2": "Marketing disconnected from operations",
    "home.transform.before.3": "Manual work slowing everything down",
    "home.transform.before.4": "No clear view of what's actually working",
    "home.transform.after.1": "One integrated business system",
    "home.transform.after.2": "Acquisition, conversion, and operations connected",
    "home.transform.after.3": "Automated workflows across the business",
    "home.transform.after.4": "Real-time visibility into performance",
    "home.proof.title": "Measured by outcomes, not deliverables",
    "home.proof.body": "Every engagement is tied to something your business can feel — revenue, efficiency, acquisition cost, scale. Here's the work behind that.",
    "home.recent.title": "Recent work",
    "home.recent.sub": "A look at the systems we've built.",
    "home.how.title": "How we work",
    "home.how.diagnose.title": "Diagnose",
    "home.how.diagnose.desc": "We map your business model, systems, and the bottlenecks slowing growth.",
    "home.how.design.title": "Design",
    "home.how.design.desc": "We design the right mix of software, marketing, and automation for how you actually operate.",
    "home.how.build.title": "Build",
    "home.how.build.desc": "We develop and integrate the system, and hand you full ownership.",
    "home.how.optimize.title": "Optimize",
    "home.how.optimize.desc": "We keep improving it against real business data.",
    "home.finalCta.title": "Ready to transform how your business runs?",
    "home.finalCta.body": "Book a strategy call. We'll look at your current systems and show you exactly what's blocking growth — even if you don't work with us.",
    "home.finalCta.button": "Book your strategy call",
    "home.finalCta.sub": "No sales pitch. Just clarity.",

    // --- SERVICES ---
    "services.eyebrow": "What we do",
    "services.title.lead": "Three capabilities.",
    "services.title.highlight": "One transformation partner.",
    "services.learnMore": "Learn more",
    "services.featuredProject": "Featured Project",
    "services.viewCaseStudy": "View Case Study",
    "services.together.title": "Better together",
    "services.together.sub": "Each capability works on its own. Together they compound — your software captures the data, your marketing fills the pipeline, your automation runs it, and your team knows how to drive all of it.",
    "services.together.capture.title": "Capture",
    "services.together.capture.desc": "Your website captures leads and collects the data you need to qualify them.",
    "services.together.attract.title": "Attract",
    "services.together.attract.desc": "Marketing drives the right people to your site—decision-makers, not tire-kickers.",
    "services.together.automate.title": "Automate",
    "services.together.automate.desc": "Automation qualifies leads, books meetings, and syncs everything to your CRM.",
    "services.cta.title": "Not sure what you need?",
    "services.cta.body": "Book a free call. We'll look at your current setup and tell you exactly what would move the needle—even if it's not something we do.",
    "services.cta.button": "Book a free strategy call",

    // --- SERVICE DETAIL (shared labels) ---
    "serviceDetail.backAll": "← All services",
    "serviceDetail.seeExamples": "See examples",
    "serviceDetail.notFound.title": "Service not found",
    "serviceDetail.notFound.button": "View all services",
    "serviceDetail.related.title": "Proven Results",
    "serviceDetail.related.sub": "See how we've helped companies like yours.",
    "serviceDetail.related.viewPortfolio": "View Full Portfolio",
    "serviceDetail.included": "What's included",
    "serviceDetail.how.title": "How it works",
    "serviceDetail.how.sub": "No mystery. No endless meetings. Here's the process.",
    "serviceDetail.faqTitle": "Common questions",
    "serviceDetail.cta.title": "Ready to get started?",
    "serviceDetail.cta.body": "Book a strategy call. We'll discuss your needs and tell you honestly if we're the right fit — no pressure, no sales pitch.",

    // Service Detail — SOFTWARE
    "serviceDetail.software.title": "Software that becomes your operational backbone",
    "serviceDetail.software.desc": "ERP and CRM platforms, customer-facing web, mobile apps, and the automation that connects them — designed to own, integrate, and scale.",
    "serviceDetail.software.cta": "Build your system",
    "serviceDetail.software.feat.1.title": "Business Systems (ERP / CRM)",
    "serviceDetail.software.feat.1.desc": "Custom platforms that centralize your sales, operations, and customer data into one source of truth. Built on proven frameworks, shaped to how your business actually runs.",
    "serviceDetail.software.feat.2.title": "Web Platforms",
    "serviceDetail.software.feat.2.desc": "High-performance websites and web apps engineered for conversion and speed — connected to your systems from day one, not bolted on later.",
    "serviceDetail.software.feat.3.title": "Mobile Apps",
    "serviceDetail.software.feat.3.desc": "Customer-facing and internal apps built for real-world use and scale, integrated with the same backend as everything else.",
    "serviceDetail.software.feat.4.title": "Automation & AI",
    "serviceDetail.software.feat.4.desc": "Workflow automation and AI integrations that remove manual work — lead routing, data sync, follow-ups, and the repetitive tasks eating your team's time.",
    "serviceDetail.software.proc.1.title": "Discovery",
    "serviceDetail.software.proc.1.desc": "We learn your business, goals, and technical requirements.",
    "serviceDetail.software.proc.2.title": "Proposal",
    "serviceDetail.software.proc.2.desc": "Clear scope, timeline, and a fixed price.",
    "serviceDetail.software.proc.3.title": "Design",
    "serviceDetail.software.proc.3.desc": "Wireframes and visual design — you approve before we build.",
    "serviceDetail.software.proc.4.title": "Build",
    "serviceDetail.software.proc.4.desc": "We build and integrate, with weekly reviews. No surprises.",
    "serviceDetail.software.proc.5.title": "Launch",
    "serviceDetail.software.proc.5.desc": "Tested, live, and handed over — full ownership transferred.",
    "serviceDetail.software.faq.1.q": "Do we own the code?",
    "serviceDetail.software.faq.1.a": "Yes. Full source code and IP transfer on completion. No lock-in, no fees to access your own system.",
    "serviceDetail.software.faq.2.q": "Can it integrate with our existing tools?",
    "serviceDetail.software.faq.2.a": "That's the point. We connect to your CRM, ERP, and existing stack from day one.",
    "serviceDetail.software.faq.3.q": "How long does a build take?",
    "serviceDetail.software.faq.3.a": "Depends on scope — we give you a specific timeline in the proposal, not a vague range.",
    "serviceDetail.software.faq.4.q": "What if we already have a system?",
    "serviceDetail.software.faq.4.a": "We rebuild or extend what you have, whichever actually makes sense for your situation.",

    // Service Detail — DIGITAL MARKETING
    "serviceDetail.dm.title": "Marketing built as an acquisition system",
    "serviceDetail.dm.desc": "SEO, paid campaigns, and conversion strategy wired into one measurable engine that brings in qualified buyers — not vanity traffic.",
    "serviceDetail.dm.cta": "Scale your acquisition",
    "serviceDetail.dm.feat.1.title": "Paid campaigns (Google / Meta / LinkedIn)",
    "serviceDetail.dm.feat.2.title": "Buyer-intent SEO",
    "serviceDetail.dm.feat.3.title": "Conversion-rate optimization",
    "serviceDetail.dm.feat.4.title": "Funnel strategy & tracking",
    "serviceDetail.dm.proc.1.title": "Audit",
    "serviceDetail.dm.proc.1.desc": "We review your funnel, channels, and competitors.",
    "serviceDetail.dm.proc.2.title": "Strategy",
    "serviceDetail.dm.proc.2.desc": "A clear plan — channels, offers, and what we'll test.",
    "serviceDetail.dm.proc.3.title": "Setup",
    "serviceDetail.dm.proc.3.desc": "Tracking, campaigns, and landing pages built and launched.",
    "serviceDetail.dm.proc.4.title": "Optimize",
    "serviceDetail.dm.proc.4.desc": "Continuous testing against real performance data.",
    "serviceDetail.dm.faq.1.q": "What's the minimum to make this work?",
    "serviceDetail.dm.faq.1.a": "We're honest about fit — we're upfront about whether the budget justifies the work, and we'll tell you before you commit.",
    "serviceDetail.dm.faq.2.q": "How fast do results come?",
    "serviceDetail.dm.faq.2.a": "Paid moves in weeks; SEO is a few months for meaningful traffic. We set realistic expectations before we start.",
    "serviceDetail.dm.faq.3.q": "Do you guarantee results?",
    "serviceDetail.dm.faq.3.a": "We guarantee our work and our process, not market conditions. Targets are agreed upfront and we're accountable to them.",

    // Service Detail — AI TRAINING
    "serviceDetail.ai.title": "AI training that turns tools into capability",
    "serviceDetail.ai.desc": "Structured AI adoption programs for teams and leadership — built to leave your people using AI on real work, not just aware of it.",
    "serviceDetail.ai.cta": "Start your AI program",
    "serviceDetail.ai.feat.1.title": "Executive AI strategy sessions",
    "serviceDetail.ai.feat.2.title": "Department-level adoption programs",
    "serviceDetail.ai.feat.3.title": "Hands-on workflow integration workshops",
    "serviceDetail.ai.feat.4.title": "Implementation support",
    "serviceDetail.ai.proc.1.title": "Assess",
    "serviceDetail.ai.proc.1.desc": "We map your team's workflows and where AI actually helps.",
    "serviceDetail.ai.proc.2.title": "Design",
    "serviceDetail.ai.proc.2.desc": "A program built around your tools and real tasks.",
    "serviceDetail.ai.proc.3.title": "Train",
    "serviceDetail.ai.proc.3.desc": "Hands-on sessions for leadership and teams.",
    "serviceDetail.ai.proc.4.title": "Embed",
    "serviceDetail.ai.proc.4.desc": "Documented workflows your team keeps and reuses.",
    "serviceDetail.ai.faq.1.q": "Is this generic AI training?",
    "serviceDetail.ai.faq.1.a": "No. Programs are built around your actual workflows and tools, not a stock curriculum.",
    "serviceDetail.ai.faq.2.q": "Who is it for?",
    "serviceDetail.ai.faq.2.a": "Leadership and teams — we run both strategy-level and hands-on tracks.",
    "serviceDetail.ai.faq.3.q": "What do we walk away with?",
    "serviceDetail.ai.faq.3.a": "People who use AI on real work, plus documented workflows your team keeps.",

    // --- PORTFOLIO ---
    "portfolio.title": "Selected Work",
    "portfolio.sub": "A curation of digital infrastructure and growth systems engineered for market leaders.",
    "portfolio.empty": "No projects found in this category.",

    // --- PROJECT DETAIL ---
    "projectDetail.back": "Back to Portfolio",
    "projectDetail.notFound": "Project not found",
    "projectDetail.mobileCta": "Start a Project Like This",
    "projectDetail.challenge": "The Challenge",
    "projectDetail.solution": "The Solution",
    "projectDetail.techStack": "Tech Stack",
    "projectDetail.startProject": "Start Your Project",

    // --- CONTACT ---
    "contact.title": "Let's talk",
    "contact.sub": "Tell us about your business and what's slowing it down. We'll tell you honestly if we can help.",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.optional": "(optional)",
    "contact.company": "Company",
    "contact.service": "What do you need?",
    "contact.message": "Message",
    "contact.ph.name": "Your name",
    "contact.ph.email": "you@company.com",
    "contact.ph.phone": "+20 100 000 0000",
    "contact.ph.company": "Your Company",
    "contact.ph.service": "Select a service",
    "contact.ph.message": "Tell us about your project goals...",
    "contact.submit": "Send message",
    "contact.submitting": "Sending…",
    "contact.info": "Contact details",
    "contact.emailLabel": "Email",
    "contact.phoneLabel": "Phone",
    "contact.phoneVal": "Available on request",
    "contact.responseLabel": "Response Time",
    "contact.responseVal": "Within 24 hours on business days",
    "contact.quick.title": "Quick Response Guarantee",
    "contact.quick.body": "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please mention it in your message.",
    "contact.toast.success": "Message sent — we'll get back to you within 24 hours.",
    "contact.toast.error": "Something went wrong — please try again, or email us directly.",

    // --- FOOTER ---
    "footer.tagline": "We build the systems behind business growth.",
    "footer.services": "Services",
    "footer.company": "Company",
    "footer.connectShort": "Connect",
    "footer.stayConnected": "Stay Connected",
    "footer.link.webdev": "Web Dev",
    "footer.link.automation": "Automation",
    "footer.link.aiagents": "AI Agents",
    "footer.link.marketing": "Marketing",
    "footer.link.about": "About",
    "footer.link.work": "Work",
    "footer.link.contact": "Contact",
    "footer.newsletter.text": "Get the latest trends in AI and Web Dev delivered to your inbox.",
    "footer.newsletter.placeholder": "Enter your email",
    "footer.location": "Cairo, Egypt",
    "footer.copyright": "OmniflowAI Agency. All rights reserved.",
    "footer.toast.subscribed": "Thanks — you're subscribed.",
    "footer.toast.error": "Something went wrong, please try again.",

    // --- ABOUT (team/founder attribution stays frozen: [TODO(team-final)]) ---
    "about.badge": "Who we are",
    "about.headline.lead": "Engineers who understand",
    "about.headline.highlight": "business.",
    "about.sub": "OmniflowAI is a digital transformation partner built around one belief: most companies don't need more tools — they need the right systems, built well and connected properly.",
    "about.story.heading": "We started OmniflowAI to close a gap.",
    "about.story.p1": "Too many businesses are sold disconnected pieces — a website here, an ad campaign there, a tool nobody integrates — and left to stitch them together themselves. The result is expensive fragmentation: software that doesn't talk, marketing that doesn't convert, and no clear view of what's working.",
    "about.story.p2": "We do the opposite. We start from how your business actually operates, then design and build the systems that fit it — software, marketing, and automation that work as one. You own everything we build. No lock-in, no dependency, no black boxes.",
    "about.story.p3": "We work like engineers, not order-takers: we care about outcomes you can measure, systems that outlast the engagement, and giving you the keys at the end.",
    "about.team.heading": "Meet the Builders",
    "about.team.sub": "No outsourcing. No juniors learning on your dime. Just senior talent dedicated to your growth.",
    "about.values.1.title": "Systems over services",
    "about.values.1.desc": "We don't sell isolated deliverables. Everything we build is designed to connect and compound.",
    "about.values.2.title": "You own it",
    "about.values.2.desc": "Full source code and IP transfer on every build. What you pay for is yours.",
    "about.values.3.title": "Engineering-led",
    "about.values.3.desc": "You work directly with the people building your systems, not an account manager relaying messages.",
    "about.values.4.title": "Measured by outcomes",
    "about.values.4.desc": "We tie our work to business results — revenue, efficiency, acquisition — not hours logged or assets shipped.",
    "about.cta.title": "Let's map your systems",

    // --- 404 ---
    "notFound.title": "Page not found",
    "notFound.body": "The page you're looking for doesn't exist or has moved.",
    "notFound.button": "Back to home",
  },

  ar: {
    // --- NAV ---
    "nav.home": "الرئيسية",
    "nav.services": "الخدمات",
    "nav.portfolio": "أعمالنا",
    "nav.about": "من نحن",
    "nav.contact": "تواصل معنا",
    "nav.cta": "لنتحدث",

    // --- COMMON ---
    "common.cta.bookCall": "احجز مكالمة استراتيجية",
    "common.brandLine": "نحن لا نسلّم مخرجات ونمضي. نحن نبني أنظمة تستمر في العمل حتى بعد انتهاء تعاوننا.",
    "common.all": "الكل",
    "common.viewAllProjects": "عرض جميع الأعمال",
    "whatsapp.chat": "تواصل عبر واتساب",

    // --- CATEGORY LABELS (public) ---
    "category.business-systems": "أنظمة الأعمال",
    "category.web": "الويب",
    "category.mobile": "تطبيقات الجوال",
    "category.automation": "الأتمتة والذكاء الاصطناعي",
    "category.digital-marketing": "التسويق الرقمي",
    "category.ai-training": "التدريب على الذكاء الاصطناعي",

    // --- CONTACT SERVICE OPTIONS ---
    "serviceOpt.ai-training": "التدريب على الذكاء الاصطناعي",
    "serviceOpt.digital-marketing": "التسويق الرقمي",
    "serviceOpt.software": "البرمجيات",
    "serviceOpt.other": "أخرى",

    // --- PILLARS (shared by Home + Services) ---
    "pillars.aiTraining.title": "تدريب على الذكاء الاصطناعي يحوّل الأدوات إلى قدرات فعلية",
    "pillars.aiTraining.body": "نقدّم برامج منظّمة لتبنّي الذكاء الاصطناعي للفرق والقيادات — من جلسات استراتيجية للمدراء إلى دمج عملي في سير العمل. الهدف ليس مجرد المعرفة، بل قدرة تشغيلية حقيقية: أن يستخدم فريقك الذكاء الاصطناعي في عمل حقيقي، لا أن يشاهد عرضاً توضيحياً فحسب.",
    "pillars.digitalMarketing.title": "تسويق مبني كنظام لاستقطاب العملاء",
    "pillars.digitalMarketing.body": "تحسين محركات البحث والحملات المدفوعة واستراتيجية التحويل، مدمجة في محرك واحد يستهدف المشترين المؤهّلين — لا الزيارات الشكلية. كل مرحلة قابلة للقياس، لتعرف كم يكلّفك العميل المحتمل فعلاً ومن أين تأتي الإيرادات.",
    "pillars.software.title": "برمجيات تتحوّل إلى العمود الفقري التشغيلي لأعمالك",
    "pillars.software.body": "الأنظمة التي تدير أعمالك — منصّات تخطيط موارد المؤسسات (ERP) وإدارة علاقات العملاء (CRM)، ومواقع موجّهة للعملاء، وتطبيقات الجوال، والأتمتة التي تربطها معاً. مبنية لتملكها وتدمجها وتوسّعها، لا لتستأجرها.",
    "pillars.software.subcaps": "أنظمة الأعمال (ERP/CRM) · منصّات الويب · تطبيقات الجوال · الأتمتة والذكاء الاصطناعي",

    // --- HOME ---
    "home.hero.h1.lead": "نبني الأنظمة التي تقف خلف",
    "home.hero.h1.highlight": "نمو الأعمال.",
    "home.hero.sub": "شريكك في التحول الرقمي عبر تدريب الذكاء الاصطناعي والتسويق الرقمي وبرمجيات الأعمال — مصمَّمة كنظام واحد متكامل تملكه بالكامل، لا كثلاث خدمات منفصلة.",
    "home.hero.cta2": "استعرض أعمالنا",
    "home.trust": "تثق بنا فرقٌ تبني مستقبل قطاعاتها.",
    "home.valueProp.title.lead": "معظم الشركات لا تعاني مشكلة تسويق.",
    "home.valueProp.title.highlight": "بل تعاني مشكلة أنظمة.",
    "home.valueProp.body": "أدوات غير مترابطة، وعمليات تسليم يدوية، وغياب رؤية واضحة من العميل المحتمل حتى إتمام الصفقة. نحن نربط السلسلة كاملة — كيف تستقطب عملاءك، وكيف تحوّلهم، وكيف تدير أعمالك بعد انضمامهم — لتعمل الأجزاء كنظام واحد يمكنك قياسه فعلاً.",
    "home.pillars.title": "ثلاث قدرات. شريك تحوّل رقمي واحد.",
    "home.transform.title": "من أدوات متناثرة إلى نظام واحد مترابط",
    "home.transform.before.label": "قبل",
    "home.transform.after.label": "بعد",
    "home.transform.before.1": "أدوات لا تتواصل فيما بينها",
    "home.transform.before.2": "تسويق منفصل عن العمليات التشغيلية",
    "home.transform.before.3": "عمل يدوي يبطّئ كل شيء",
    "home.transform.before.4": "غياب رؤية واضحة لما ينجح فعلاً",
    "home.transform.after.1": "نظام أعمال واحد متكامل",
    "home.transform.after.2": "ترابط بين الاستقطاب والتحويل والعمليات",
    "home.transform.after.3": "سير عمل مؤتمت في الشركة كلها",
    "home.transform.after.4": "رؤية لحظية للأداء",
    "home.proof.title": "نُقاس بالنتائج، لا بالمخرجات",
    "home.proof.body": "كل مشروع مرتبط بأثر تلمسه أعمالك — إيرادات، كفاءة، تكلفة استقطاب، توسّع. وهذه هي الأعمال التي تقف وراء ذلك.",
    "home.recent.title": "أحدث الأعمال",
    "home.recent.sub": "لمحة عن الأنظمة التي بنيناها.",
    "home.how.title": "كيف نعمل",
    "home.how.diagnose.title": "التشخيص",
    "home.how.diagnose.desc": "نرسم خريطة نموذج عملك وأنظمتك والعوائق التي تبطّئ نموّك.",
    "home.how.design.title": "التصميم",
    "home.how.design.desc": "نصمّم المزيج المناسب من البرمجيات والتسويق والأتمتة بما يلائم طريقة عملك الفعلية.",
    "home.how.build.title": "البناء",
    "home.how.build.desc": "نطوّر النظام وندمجه ونسلّمك ملكيته الكاملة.",
    "home.how.optimize.title": "التحسين",
    "home.how.optimize.desc": "نواصل تحسينه استناداً إلى بيانات أعمالك الحقيقية.",
    "home.finalCta.title": "جاهز لتغيير طريقة إدارة أعمالك؟",
    "home.finalCta.body": "احجز مكالمة استراتيجية. سننظر في أنظمتك الحالية ونوضّح لك بالضبط ما يعيق النمو — حتى إن لم تعمل معنا.",
    "home.finalCta.button": "احجز مكالمتك الاستراتيجية",
    "home.finalCta.sub": "بلا عروض بيعية. وضوح فقط.",

    // --- SERVICES ---
    "services.eyebrow": "ما الذي نقدّمه",
    "services.title.lead": "ثلاث قدرات.",
    "services.title.highlight": "شريك تحوّل رقمي واحد.",
    "services.learnMore": "اعرف المزيد",
    "services.featuredProject": "مشروع مميّز",
    "services.viewCaseStudy": "عرض دراسة الحالة",
    "services.together.title": "أقوى معاً",
    "services.together.sub": "كل قدرة تعمل بمفردها. ومعاً تتضاعف قيمتها — برمجياتك تلتقط البيانات، وتسويقك يغذّي مسار المبيعات، وأتمتتك تديره، وفريقك يعرف كيف يقود ذلك كله.",
    "services.together.capture.title": "الالتقاط",
    "services.together.capture.desc": "موقعك يلتقط العملاء المحتملين ويجمع البيانات التي تحتاجها لتأهيلهم.",
    "services.together.attract.title": "الاستقطاب",
    "services.together.attract.desc": "التسويق يقود الأشخاص المناسبين إلى موقعك — صنّاع القرار، لا المتفرّجين.",
    "services.together.automate.title": "الأتمتة",
    "services.together.automate.desc": "الأتمتة تؤهّل العملاء المحتملين، وتحجز الاجتماعات، وتزامن كل شيء مع نظام إدارة علاقات العملاء لديك.",
    "services.cta.title": "غير متأكد مما تحتاجه؟",
    "services.cta.body": "احجز مكالمة مجانية. سننظر في وضعك الحالي ونخبرك بالضبط بما يُحدث فرقاً — حتى لو لم يكن ضمن ما نقدّمه.",
    "services.cta.button": "احجز مكالمة استراتيجية مجانية",

    // --- SERVICE DETAIL (shared labels) ---
    "serviceDetail.backAll": "جميع الخدمات →",
    "serviceDetail.seeExamples": "شاهد أمثلة",
    "serviceDetail.notFound.title": "الخدمة غير موجودة",
    "serviceDetail.notFound.button": "عرض جميع الخدمات",
    "serviceDetail.related.title": "نتائج مثبتة",
    "serviceDetail.related.sub": "شاهد كيف ساعدنا شركات مثل شركتك.",
    "serviceDetail.related.viewPortfolio": "عرض كامل الأعمال",
    "serviceDetail.included": "ما الذي تحصل عليه",
    "serviceDetail.how.title": "كيف يسير العمل",
    "serviceDetail.how.sub": "لا غموض ولا اجتماعات بلا نهاية. إليك الآلية.",
    "serviceDetail.faqTitle": "أسئلة شائعة",
    "serviceDetail.cta.title": "جاهز للبدء؟",
    "serviceDetail.cta.body": "احجز مكالمة استراتيجية. سنناقش احتياجاتك ونخبرك بصدق إن كنا الخيار المناسب — بلا ضغط ولا عروض بيعية.",

    // Service Detail — SOFTWARE
    "serviceDetail.software.title": "برمجيات تتحوّل إلى العمود الفقري التشغيلي لأعمالك",
    "serviceDetail.software.desc": "منصّات ERP وCRM، ومواقع موجّهة للعملاء، وتطبيقات جوال، والأتمتة التي تربطها — مصمّمة لتملكها وتدمجها وتوسّعها.",
    "serviceDetail.software.cta": "ابنِ نظامك",
    "serviceDetail.software.feat.1.title": "أنظمة الأعمال (ERP / CRM)",
    "serviceDetail.software.feat.1.desc": "منصّات مخصّصة توحّد بيانات مبيعاتك وعملياتك وعملائك في مصدر واحد موثوق. مبنية على أطر عمل مُثبتة، ومصمّمة وفق طريقة عمل شركتك الفعلية.",
    "serviceDetail.software.feat.2.title": "منصّات الويب",
    "serviceDetail.software.feat.2.desc": "مواقع وتطبيقات ويب عالية الأداء مصمّمة للتحويل والسرعة — مرتبطة بأنظمتك منذ اليوم الأول، لا مضافة لاحقاً.",
    "serviceDetail.software.feat.3.title": "تطبيقات الجوال",
    "serviceDetail.software.feat.3.desc": "تطبيقات للعملاء وأخرى داخلية، مبنية للاستخدام الواقعي والتوسّع، ومدمجة مع الأنظمة الخلفية نفسها.",
    "serviceDetail.software.feat.4.title": "الأتمتة والذكاء الاصطناعي",
    "serviceDetail.software.feat.4.desc": "أتمتة سير العمل وتكاملات الذكاء الاصطناعي التي تزيل العمل اليدوي — توجيه العملاء المحتملين، ومزامنة البيانات، والمتابعات، والمهام المتكرّرة التي تستهلك وقت فريقك.",
    "serviceDetail.software.proc.1.title": "الاكتشاف",
    "serviceDetail.software.proc.1.desc": "نتعرّف على أعمالك وأهدافك ومتطلباتك التقنية.",
    "serviceDetail.software.proc.2.title": "العرض",
    "serviceDetail.software.proc.2.desc": "نطاق واضح، وجدول زمني، وسعر ثابت.",
    "serviceDetail.software.proc.3.title": "التصميم",
    "serviceDetail.software.proc.3.desc": "مخططات هيكلية وتصميم بصري — تعتمده قبل أن نبدأ البناء.",
    "serviceDetail.software.proc.4.title": "البناء",
    "serviceDetail.software.proc.4.desc": "نبني وندمج، مع مراجعات أسبوعية. بلا مفاجآت.",
    "serviceDetail.software.proc.5.title": "الإطلاق",
    "serviceDetail.software.proc.5.desc": "مختبر ومُفعّل ومُسلّم — مع نقل الملكية الكاملة.",
    "serviceDetail.software.faq.1.q": "هل نملك الشيفرة البرمجية؟",
    "serviceDetail.software.faq.1.a": "نعم. نقل كامل للشيفرة المصدرية والملكية الفكرية عند الانتهاء. لا احتكار، ولا رسوم للوصول إلى نظامك الخاص.",
    "serviceDetail.software.faq.2.q": "هل يمكن أن يتكامل مع أدواتنا الحالية؟",
    "serviceDetail.software.faq.2.a": "هذا هو الهدف تماماً. نربط النظام بأنظمة CRM وERP وبقية أدواتك منذ اليوم الأول.",
    "serviceDetail.software.faq.3.q": "كم يستغرق البناء؟",
    "serviceDetail.software.faq.3.a": "يعتمد على النطاق — نمنحك جدولاً زمنياً محدداً في العرض، لا تقديراً مبهماً.",
    "serviceDetail.software.faq.4.q": "ماذا لو كان لدينا نظام بالفعل؟",
    "serviceDetail.software.faq.4.a": "نعيد بناء ما لديك أو نطوّره، أيّهما أنسب لوضعك فعلاً.",

    // Service Detail — DIGITAL MARKETING
    "serviceDetail.dm.title": "تسويق مبني كنظام لاستقطاب العملاء",
    "serviceDetail.dm.desc": "تحسين محركات البحث والحملات المدفوعة واستراتيجية التحويل، مدمجة في محرك واحد قابل للقياس يجلب مشترين مؤهّلين — لا زيارات شكلية.",
    "serviceDetail.dm.cta": "وسّع قاعدة عملائك",
    "serviceDetail.dm.feat.1.title": "حملات مدفوعة (جوجل / ميتا / لينكدإن)",
    "serviceDetail.dm.feat.2.title": "تحسين محركات بحث موجّه لنيّة الشراء",
    "serviceDetail.dm.feat.3.title": "تحسين معدّل التحويل",
    "serviceDetail.dm.feat.4.title": "استراتيجية مسار المبيعات وتتبّعه",
    "serviceDetail.dm.proc.1.title": "التدقيق",
    "serviceDetail.dm.proc.1.desc": "نراجع مسار مبيعاتك وقنواتك ومنافسيك.",
    "serviceDetail.dm.proc.2.title": "الاستراتيجية",
    "serviceDetail.dm.proc.2.desc": "خطة واضحة — القنوات والعروض وما سنختبره.",
    "serviceDetail.dm.proc.3.title": "الإعداد",
    "serviceDetail.dm.proc.3.desc": "بناء وإطلاق أدوات التتبّع والحملات وصفحات الهبوط.",
    "serviceDetail.dm.proc.4.title": "التحسين",
    "serviceDetail.dm.proc.4.desc": "اختبار مستمر استناداً إلى بيانات الأداء الحقيقية.",
    "serviceDetail.dm.faq.1.q": "ما الحد الأدنى اللازم لنجاح ذلك؟",
    "serviceDetail.dm.faq.1.a": "نحن صريحون معك — نصارحك إن كانت ميزانيتك تبرّر العمل، قبل أن تلتزم بأي شيء.",
    "serviceDetail.dm.faq.2.q": "متى تظهر النتائج؟",
    "serviceDetail.dm.faq.2.a": "الحملات المدفوعة تبدأ نتائجها خلال أسابيع؛ أما تحسين محركات البحث فيحتاج بضعة أشهر لزيارات ذات قيمة. نضع توقعات واقعية قبل أن نبدأ.",
    "serviceDetail.dm.faq.3.q": "هل تضمنون النتائج؟",
    "serviceDetail.dm.faq.3.a": "نضمن عملنا ومنهجيتنا، لا ظروف السوق. نتّفق على الأهداف مسبقاً ونكون مسؤولين عنها.",

    // Service Detail — AI TRAINING
    "serviceDetail.ai.title": "تدريب على الذكاء الاصطناعي يحوّل الأدوات إلى قدرات فعلية",
    "serviceDetail.ai.desc": "برامج منظّمة لتبنّي الذكاء الاصطناعي للفرق والقيادات — مصمّمة لتجعل فريقك يستخدم الذكاء الاصطناعي في عمل حقيقي، لا مجرد الإلمام به.",
    "serviceDetail.ai.cta": "ابدأ برنامجك للذكاء الاصطناعي",
    "serviceDetail.ai.feat.1.title": "جلسات استراتيجية للمدراء حول الذكاء الاصطناعي",
    "serviceDetail.ai.feat.2.title": "برامج تبنٍّ على مستوى الأقسام",
    "serviceDetail.ai.feat.3.title": "ورش عملية لدمج الذكاء الاصطناعي في سير العمل",
    "serviceDetail.ai.feat.4.title": "دعم التنفيذ",
    "serviceDetail.ai.proc.1.title": "التقييم",
    "serviceDetail.ai.proc.1.desc": "نرسم خريطة سير عمل فريقك ومواضع الفائدة الفعلية للذكاء الاصطناعي.",
    "serviceDetail.ai.proc.2.title": "التصميم",
    "serviceDetail.ai.proc.2.desc": "برنامج مبني حول أدواتك ومهامك الحقيقية.",
    "serviceDetail.ai.proc.3.title": "التدريب",
    "serviceDetail.ai.proc.3.desc": "جلسات عملية للقيادات والفرق.",
    "serviceDetail.ai.proc.4.title": "الترسيخ",
    "serviceDetail.ai.proc.4.desc": "سير عمل موثّق يحتفظ به فريقك ويعيد استخدامه.",
    "serviceDetail.ai.faq.1.q": "هل هذا تدريب عام على الذكاء الاصطناعي؟",
    "serviceDetail.ai.faq.1.a": "لا. البرامج مبنية حول سير عملك وأدواتك الفعلية، لا منهجاً جاهزاً.",
    "serviceDetail.ai.faq.2.q": "لمن هذا التدريب؟",
    "serviceDetail.ai.faq.2.a": "للقيادات والفرق — نقدّم مسارين: على المستوى الاستراتيجي وعلى المستوى العملي.",
    "serviceDetail.ai.faq.3.q": "بماذا نخرج في النهاية؟",
    "serviceDetail.ai.faq.3.a": "أشخاص يستخدمون الذكاء الاصطناعي في عمل حقيقي، إضافة إلى سير عمل موثّق يحتفظ به فريقك.",

    // --- PORTFOLIO ---
    "portfolio.title": "أعمال مختارة",
    "portfolio.sub": "نخبة من البنية الرقمية وأنظمة النمو المصمّمة لروّاد السوق.",
    "portfolio.empty": "لا توجد مشاريع في هذه الفئة.",

    // --- PROJECT DETAIL ---
    "projectDetail.back": "العودة إلى الأعمال",
    "projectDetail.notFound": "المشروع غير موجود",
    "projectDetail.mobileCta": "ابدأ مشروعاً مثل هذا",
    "projectDetail.challenge": "التحدّي",
    "projectDetail.solution": "الحل",
    "projectDetail.techStack": "التقنيات المستخدمة",
    "projectDetail.startProject": "ابدأ مشروعك",

    // --- CONTACT ---
    "contact.title": "لنتحدث",
    "contact.sub": "أخبرنا عن أعمالك وما الذي يبطّئها، وسنخبرك بصراحة إن كنا نستطيع مساعدتك.",
    "contact.name": "الاسم",
    "contact.email": "البريد الإلكتروني",
    "contact.phone": "الهاتف",
    "contact.optional": "(اختياري)",
    "contact.company": "الشركة",
    "contact.service": "ما الذي تحتاجه؟",
    "contact.message": "الرسالة",
    "contact.ph.name": "اسمك",
    "contact.ph.email": "you@company.com",
    "contact.ph.phone": "+20 100 000 0000",
    "contact.ph.company": "اسم شركتك",
    "contact.ph.service": "اختر خدمة",
    "contact.ph.message": "أخبرنا عن أهداف مشروعك...",
    "contact.submit": "إرسال الرسالة",
    "contact.submitting": "جارٍ الإرسال…",
    "contact.info": "بيانات التواصل",
    "contact.emailLabel": "البريد الإلكتروني",
    "contact.phoneLabel": "الهاتف",
    "contact.phoneVal": "متاح عند الطلب",
    "contact.responseLabel": "وقت الاستجابة",
    "contact.responseVal": "خلال 24 ساعة في أيام العمل",
    "contact.quick.title": "ضمان الاستجابة السريعة",
    "contact.quick.body": "نردّ عادةً على كل الاستفسارات خلال 24 ساعة في أيام العمل. وإن كان الأمر عاجلاً، اذكر ذلك في رسالتك.",
    "contact.toast.success": "تم إرسال الرسالة — سنعاود التواصل معك خلال 24 ساعة.",
    "contact.toast.error": "حدث خطأ ما — حاول مجدداً، أو راسلنا مباشرةً عبر البريد.",

    // --- FOOTER ---
    "footer.tagline": "نبني الأنظمة التي تقف خلف نمو الأعمال.",
    "footer.services": "الخدمات",
    "footer.company": "الشركة",
    "footer.connectShort": "تواصل",
    "footer.stayConnected": "ابقَ على تواصل",
    "footer.link.webdev": "تطوير الويب",
    "footer.link.automation": "الأتمتة",
    "footer.link.aiagents": "وكلاء الذكاء الاصطناعي",
    "footer.link.marketing": "التسويق",
    "footer.link.about": "من نحن",
    "footer.link.work": "الأعمال",
    "footer.link.contact": "تواصل",
    "footer.newsletter.text": "احصل على أحدث اتجاهات الذكاء الاصطناعي وتطوير الويب في بريدك.",
    "footer.newsletter.placeholder": "أدخل بريدك الإلكتروني",
    "footer.location": "القاهرة، مصر",
    "footer.copyright": "وكالة OmniflowAI. جميع الحقوق محفوظة.",
    "footer.toast.subscribed": "شكراً — تم اشتراكك.",
    "footer.toast.error": "حدث خطأ ما، حاول مجدداً.",

    // --- ABOUT (team/founder attribution stays frozen: [TODO(team-final)]) ---
    "about.badge": "من نحن",
    "about.headline.lead": "مهندسون يفهمون",
    "about.headline.highlight": "الأعمال.",
    "about.sub": "‏OmniflowAI شريك في التحول الرقمي يقوم على قناعة واحدة: معظم الشركات لا تحتاج مزيداً من الأدوات — بل تحتاج الأنظمة الصحيحة، مبنية بإتقان ومترابطة كما ينبغي.",
    "about.story.heading": "أسّسنا OmniflowAI لسدّ فجوة.",
    "about.story.p1": "تُباع لكثير من الشركات أجزاء غير مترابطة — موقع هنا، وحملة إعلانية هناك، وأداة لا يدمجها أحد — وتُترك لتجمّعها بنفسها. والنتيجة تشتّت مكلف: برمجيات لا تتحاور، وتسويق لا يحوّل، وغياب رؤية واضحة لما ينجح.",
    "about.story.p2": "نحن نفعل العكس. نبدأ من طريقة عمل شركتك الفعلية، ثم نصمّم ونبني الأنظمة التي تلائمها — برمجيات وتسويق وأتمتة تعمل ككلٍّ واحد. أنت تملك كل ما نبنيه. لا احتكار، ولا تبعية، ولا صناديق مغلقة.",
    "about.story.p3": "نعمل كمهندسين لا كمنفّذي طلبات: يهمّنا تحقيق نتائج تستطيع قياسها، وأنظمة تدوم بعد انتهاء التعاون، وتسليمك المفاتيح في النهاية.",
    "about.team.heading": "تعرّف على فريق البناء",
    "about.team.sub": "لا إسناد خارجي. لا مبتدئون يتعلّمون على حسابك. فقط كفاءات خبيرة مكرّسة لنموّك.",
    "about.values.1.title": "الأنظمة قبل الخدمات",
    "about.values.1.desc": "لا نبيع مخرجات منعزلة. كل ما نبنيه مصمَّم ليترابط وتتضاعف قيمته.",
    "about.values.2.title": "الملكية لك",
    "about.values.2.desc": "نقل كامل للشيفرة المصدرية والملكية الفكرية في كل مشروع. ما تدفع مقابله يصبح ملكك.",
    "about.values.3.title": "بقيادة هندسية",
    "about.values.3.desc": "تتعامل مباشرةً مع من يبنون أنظمتك، لا مع مدير حسابات ينقل الرسائل.",
    "about.values.4.title": "نُقاس بالنتائج",
    "about.values.4.desc": "نربط عملنا بنتائج الأعمال — إيرادات وكفاءة واستقطاب — لا بساعات مسجّلة أو مخرجات مُسلّمة.",
    "about.cta.title": "لنرسم خريطة أنظمتك",

    // --- 404 ---
    "notFound.title": "الصفحة غير موجودة",
    "notFound.body": "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
    "notFound.button": "العودة إلى الرئيسية",
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
