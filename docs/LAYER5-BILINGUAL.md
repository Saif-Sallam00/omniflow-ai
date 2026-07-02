# Layer 5 — Bilingual (English + Arabic + RTL)

The site is now genuinely bilingual: **English (default)** and **Modern Standard
Arabic** with right-to-left layout. The existing i18n system
(`client/src/lib/i18n.tsx` — `I18nProvider` / `useI18n` / `t` / `isRTL`) was reused
and repopulated with final copy; **no new i18n library was added** (no i18next
etc.). The only new asset is the **Cairo** Arabic webfont.

`npx tsc` → **0 errors**. `npm run build` → **success**. EN/AR dictionaries have
**perfect key parity (243 keys each, 0 missing on either side)**.

---

## Files changed (one line each)

- `client/src/lib/i18n.tsx` — replaced the stale dictionary with the final,
  namespaced EN + AR copy (243 keys each). Provider logic (localStorage persistence,
  `lang`/`dir` on `<html>`, default English) reused unchanged.
- `client/index.html` — added the **Cairo** webfont (`wght@400;700`, `display=swap`)
  to the existing Google Fonts link (existing preconnects reused).
- `client/src/index.css` — RTL/Arabic rules (unlayered so they win over Tailwind):
  Cairo applied to `[dir="rtl"] body` and `[dir="rtl"] .font-display`; directional
  lucide icons flipped via `[dir="rtl"] .lucide-arrow-*/chevron-* { scaleX(-1) }`.
- `client/src/pages/Home.tsx` — every string via `t()`; logical `ms-*` arrow margins.
- `client/src/pages/Services.tsx` — via `t()`; pillar cards share `pillars.*` keys;
  connector arrow uses logical `-end-3`.
- `client/src/pages/ServiceDetail.tsx` — pillar data object built from `t()` keys
  (titles, features, process, FAQ); logical margins.
- `client/src/pages/Portfolio.tsx` — title/sub/empty + tabs + badges via `t()`
  (category labels now translate via `category.*`).
- `client/src/pages/ProjectDetail.tsx` — labels + category badge via `t()`.
- `client/src/pages/Contact.tsx` — labels, placeholders, service options, submit,
  sidebar, and toasts via `t()`.
- `client/src/pages/About.tsx` — hero, story narrative, values, CTA via `t()`;
  **team grid + founder attribution stay frozen** (`[TODO(team-final)]`, not translated).
- `client/src/components/Navigation.tsx` — CTA now uses `nav.cta` (desktop + mobile).
- `client/src/components/Footer.tsx` — all labels/links/newsletter/toasts via `t()`;
  `md:text-left` → logical `md:text-start`.
- `client/src/pages/not-found.tsx` — title/body/button via `t()`.
- `client/src/App.tsx` — WhatsApp button label via `t("whatsapp.chat")`.

**Admin pages left in English by design** (internal tooling — translating them is
wasted effort): `client/src/pages/admin/Dashboard.tsx`, `admin/Leads.tsx`, `admin/Auth.tsx`.

---

## How it works

- **No new library.** Reused `useI18n().t(key)` — a flat, dot-namespaced dictionary.
- **Default = English.** Language persists in **localStorage** (`"language"`), read on
  first load, falling back to English if unset — survives reload. The nav globe toggle
  flips EN↔AR.
- **RTL is global.** The provider sets `document.documentElement.dir` / `lang` (and
  `body.dir`) whenever the language changes; `dir="rtl"` cascades block layout, text
  alignment, and flexbox order. Directional icons are flipped in CSS; CTA/arrow spacing
  uses Tailwind logical utilities (`ms-*`, `me-*`, `ps-*`, `-end-*`) so gaps mirror.
- **Arabic font.** Cairo loads globally; applied only under `[dir="rtl"]` so English
  stays on Inter/Space Grotesk. Latin runs inside Arabic (OmniflowAI, ERP/CRM/AI/SEO)
  fall through Cairo → Inter and render cleanly.

## Pages wired
Home, Services, ServiceDetail (all 3 pillars), Portfolio, ProjectDetail, Contact,
About (non-team copy), Navigation, Footer, 404, and the WhatsApp button. Admin
stays English. DB-entered project content (title/description/challenge/etc.) is
single-language user content and is not translated.

## RTL — components that may still want polish (reported, not blocking)
1. **Client-logo marquee** (Home): the CSS keyframe scrolls one fixed direction in
   both languages. It does **not** break or overflow in RTL — it just isn't mirrored.
   (Task explicitly allows leaving marquee scroll direction as-is.)
2. **"Recent work" carousel** (embla): the prev/next chevrons flip visually, but
   embla's internal drag/scroll direction isn't RTL-aware, so paging can feel reversed.
   Layout is fine; navigation direction is the only nit.
3. **Decorative corner gradients** (ServiceDetail/Contact/About hero glows positioned
   `right-0`/`left-0`) are not mirrored. Purely decorative; no layout impact.
4. **Form validation messages** come from the shared Zod schema (server) and remain
   **English** — making them language-aware would require reworking the shared schema,
   which is out of this layer's scope. Field labels/placeholders/toasts are translated.

---

## Arabic dictionary — full review table (proofread here)

> Brand ("OmniflowAI"), `CONTACT_EMAIL`, enum/code values, DB content, and the frozen
> `[TODO(team-final)]` nodes are intentionally NOT translated.

### Navigation & common
| Key | English | العربية |
|---|---|---|
| nav.home | Home | الرئيسية |
| nav.services | Services | الخدمات |
| nav.portfolio | Portfolio | أعمالنا |
| nav.about | About | من نحن |
| nav.contact | Contact | تواصل معنا |
| nav.cta | Let's Talk | لنتحدث |
| common.cta.bookCall | Book a strategy call | احجز مكالمة استراتيجية |
| common.brandLine | We don't hand over deliverables and walk away. We build systems that keep working after we're gone. | نحن لا نسلّم مخرجات ونمضي. نحن نبني أنظمة تستمر في العمل حتى بعد انتهاء تعاوننا. |
| common.all | All | الكل |
| common.viewAllProjects | View all projects | عرض جميع المشاريع |
| whatsapp.chat | Chat on WhatsApp | تواصل عبر واتساب |

### Category labels & service options
| Key | English | العربية |
|---|---|---|
| category.business-systems | Business Systems | أنظمة الأعمال |
| category.web | Web | الويب |
| category.mobile | Mobile | تطبيقات الجوال |
| category.automation | Automation & AI | الأتمتة والذكاء الاصطناعي |
| category.digital-marketing | Digital Marketing | التسويق الرقمي |
| category.ai-training | AI Training | تدريب الذكاء الاصطناعي |
| serviceOpt.ai-training | AI Training | تدريب الذكاء الاصطناعي |
| serviceOpt.digital-marketing | Digital Marketing | التسويق الرقمي |
| serviceOpt.software | Software | البرمجيات |
| serviceOpt.other | Other | أخرى |

### Pillars (shared by Home + Services)
| Key | English | العربية |
|---|---|---|
| pillars.aiTraining.title | AI training that turns tools into capability | تدريب على الذكاء الاصطناعي يحوّل الأدوات إلى قدرات فعلية |
| pillars.aiTraining.body | We run structured AI adoption programs for teams and leadership — from executive strategy sessions to hands-on workflow integration. The goal isn't awareness, it's operational capability: your people using AI on real work, not watching a demo. | نقدّم برامج منظّمة لتبنّي الذكاء الاصطناعي للفرق والقيادات — من جلسات استراتيجية للمدراء إلى دمج عملي في سير العمل. الهدف ليس مجرد المعرفة، بل قدرة تشغيلية حقيقية: أن يستخدم فريقك الذكاء الاصطناعي في عمل حقيقي، لا أن يشاهد عرضاً توضيحياً فحسب. |
| pillars.digitalMarketing.title | Marketing built as an acquisition system | تسويق مبني كنظام لاستقطاب العملاء |
| pillars.digitalMarketing.body | SEO, paid campaigns, and conversion strategy wired into one engine that targets qualified buyers — not vanity traffic. Every stage is tracked, so you know what a lead actually costs and where revenue comes from. | تحسين محركات البحث والحملات المدفوعة واستراتيجية التحويل، مدمجة في محرك واحد يستهدف المشترين المؤهّلين — لا الزيارات الشكلية. كل مرحلة قابلة للقياس، لتعرف كم يكلّفك العميل المحتمل فعلاً ومن أين تأتي الإيرادات. |
| pillars.software.title | Software that becomes your operational backbone | برمجيات تتحوّل إلى العمود الفقري التشغيلي لأعمالك |
| pillars.software.body | The systems your business runs on — ERP and CRM platforms, customer-facing web, mobile apps, and the automation that connects them. Built to own, integrate, and scale, not to rent. | الأنظمة التي تدير أعمالك — منصّات تخطيط موارد المؤسسات (ERP) وإدارة علاقات العملاء (CRM)، ومواقع تواجه العملاء، وتطبيقات الجوال، والأتمتة التي تربطها معاً. مبنية لتملكها وتدمجها وتوسّعها، لا لتستأجرها. |
| pillars.software.subcaps | Business Systems (ERP/CRM) · Web Platforms · Mobile Apps · Automation & AI | أنظمة الأعمال (ERP/CRM) · منصّات الويب · تطبيقات الجوال · الأتمتة والذكاء الاصطناعي |

### Home
| Key | English | العربية |
|---|---|---|
| home.hero.h1.lead | We build the systems behind | نبني الأنظمة التي تقف خلف |
| home.hero.h1.highlight | business growth. | نمو الأعمال. |
| home.hero.sub | Your digital transformation partner for AI training, digital marketing, and business software — engineered as one integrated system, not four disconnected services. | شريكك في التحول الرقمي عبر تدريب الذكاء الاصطناعي والتسويق الرقمي وبرمجيات الأعمال — مصمَّمة كنظام واحد متكامل، لا كأربع خدمات منفصلة. |
| home.hero.cta2 | See our work | شاهد أعمالنا |
| home.trust | Trusted by teams building the future of their industries. | موثوق به من فرق تبني مستقبل قطاعاتها. |
| home.valueProp.title.lead | Most companies don't have a marketing problem. | معظم الشركات لا تعاني مشكلة تسويق. |
| home.valueProp.title.highlight | They have a systems problem. | بل تعاني مشكلة أنظمة. |
| home.valueProp.body | Disconnected tools, manual handoffs, and no clear line of sight from a lead to a closed deal. We connect the whole chain — how you acquire customers, how you convert them, and how you operate once they're in — so the parts work as one system you can actually measure. | أدوات غير مترابطة، وعمليات تسليم يدوية، وغياب رؤية واضحة من العميل المحتمل حتى إتمام الصفقة. نحن نربط السلسلة كاملة — كيف تستقطب عملاءك، وكيف تحوّلهم، وكيف تدير أعمالك بعد انضمامهم — لتعمل الأجزاء كنظام واحد يمكنك قياسه فعلاً. |
| home.pillars.title | Three capabilities. One transformation partner. | ثلاث قدرات. شريك تحوّل واحد. |
| home.transform.title | From scattered tools to one connected system | من أدوات متناثرة إلى نظام واحد مترابط |
| home.transform.before.label | Before | قبل |
| home.transform.after.label | After | بعد |
| home.transform.before.1 | Tools that don't talk to each other | أدوات لا تتواصل فيما بينها |
| home.transform.before.2 | Marketing disconnected from operations | تسويق منفصل عن العمليات التشغيلية |
| home.transform.before.3 | Manual work slowing everything down | عمل يدوي يبطّئ كل شيء |
| home.transform.before.4 | No clear view of what's actually working | غياب رؤية واضحة لما ينجح فعلاً |
| home.transform.after.1 | One integrated business system | نظام أعمال واحد متكامل |
| home.transform.after.2 | Acquisition, conversion, and operations connected | ترابط بين الاستقطاب والتحويل والعمليات |
| home.transform.after.3 | Automated workflows across the business | سير عمل مؤتمت عبر الأعمال بأكملها |
| home.transform.after.4 | Real-time visibility into performance | رؤية آنية للأداء |
| home.proof.title | Measured by outcomes, not deliverables | نُقاس بالنتائج، لا بالمخرجات |
| home.proof.body | Every engagement is tied to something your business can feel — revenue, efficiency, acquisition cost, scale. Here's the work behind that. | كل مشروع مرتبط بأثر تلمسه أعمالك — إيرادات، كفاءة، تكلفة استقطاب، توسّع. وهذه هي الأعمال التي تقف وراء ذلك. |
| home.recent.title | Recent work | أحدث الأعمال |
| home.recent.sub | A look at the systems we've built. | لمحة عن الأنظمة التي بنيناها. |
| home.how.title | How we work | كيف نعمل |
| home.how.diagnose.title | Diagnose | التشخيص |
| home.how.diagnose.desc | We map your business model, systems, and the bottlenecks slowing growth. | نرسم خريطة نموذج عملك وأنظمتك والعوائق التي تبطّئ نموّك. |
| home.how.design.title | Design | التصميم |
| home.how.design.desc | We design the right mix of software, marketing, and automation for how you actually operate. | نصمّم المزيج المناسب من البرمجيات والتسويق والأتمتة بما يلائم طريقة عملك الفعلية. |
| home.how.build.title | Build | البناء |
| home.how.build.desc | We develop and integrate the system, and hand you full ownership. | نطوّر النظام وندمجه ونسلّمك ملكيته الكاملة. |
| home.how.optimize.title | Optimize | التحسين |
| home.how.optimize.desc | We keep improving it against real business data. | نواصل تحسينه استناداً إلى بيانات أعمالك الحقيقية. |
| home.finalCta.title | Ready to transform how your business runs? | جاهز لتغيير طريقة إدارة أعمالك؟ |
| home.finalCta.body | Book a strategy call. We'll look at your current systems and show you exactly what's blocking growth — even if you don't work with us. | احجز مكالمة استراتيجية. سننظر في أنظمتك الحالية ونوضّح لك بالضبط ما يعيق النمو — حتى إن لم تعمل معنا. |
| home.finalCta.button | Book your strategy call | احجز مكالمتك الاستراتيجية |
| home.finalCta.sub | No sales pitch. Just clarity. | بلا عروض بيعية. وضوح فقط. |

### Services
| Key | English | العربية |
|---|---|---|
| services.eyebrow | What we do | ما الذي نقدّمه |
| services.title.lead | Three capabilities. | ثلاث قدرات. |
| services.title.highlight | One transformation partner. | شريك تحوّل واحد. |
| services.learnMore | Learn more | اعرف المزيد |
| services.featuredProject | Featured Project | مشروع مميّز |
| services.viewCaseStudy | View Case Study | عرض دراسة الحالة |
| services.together.title | Better together | أقوى معاً |
| services.together.sub | Each capability works on its own. Together they compound — your software captures the data, your marketing fills the pipeline, your automation runs it, and your team knows how to drive all of it. | كل قدرة تعمل بمفردها. ومعاً تتضاعف قيمتها — برمجياتك تلتقط البيانات، وتسويقك يملأ مسار المبيعات، وأتمتتك تديره، وفريقك يعرف كيف يقود ذلك كله. |
| services.together.capture.title | Capture | الالتقاط |
| services.together.capture.desc | Your website captures leads and collects the data you need to qualify them. | موقعك يلتقط العملاء المحتملين ويجمع البيانات التي تحتاجها لتأهيلهم. |
| services.together.attract.title | Attract | الاستقطاب |
| services.together.attract.desc | Marketing drives the right people to your site—decision-makers, not tire-kickers. | التسويق يقود الأشخاص المناسبين إلى موقعك — صنّاع القرار، لا المتفرّجين. |
| services.together.automate.title | Automate | الأتمتة |
| services.together.automate.desc | Automation qualifies leads, books meetings, and syncs everything to your CRM. | الأتمتة تؤهّل العملاء المحتملين، وتحجز الاجتماعات، وتزامن كل شيء مع نظام إدارة علاقات العملاء لديك. |
| services.cta.title | Not sure what you need? | غير متأكد مما تحتاجه؟ |
| services.cta.body | Book a free call. We'll look at your current setup and tell you exactly what would move the needle—even if it's not something we do. | احجز مكالمة مجانية. سننظر في وضعك الحالي ونخبرك بالضبط بما يُحدث فرقاً — حتى لو لم يكن ضمن ما نقدّمه. |
| services.cta.button | Book a free strategy call | احجز مكالمة استراتيجية مجانية |

### Service Detail — shared labels
| Key | English | العربية |
|---|---|---|
| serviceDetail.backAll | ← All services | جميع الخدمات → |
| serviceDetail.seeExamples | See examples | شاهد أمثلة |
| serviceDetail.notFound.title | Service not found | الخدمة غير موجودة |
| serviceDetail.notFound.button | View all services | عرض جميع الخدمات |
| serviceDetail.related.title | Proven Results | نتائج مثبتة |
| serviceDetail.related.sub | See how we've helped companies like yours. | شاهد كيف ساعدنا شركات مثل شركتك. |
| serviceDetail.related.viewPortfolio | View Full Portfolio | عرض كامل الأعمال |
| serviceDetail.included | What's included | ما الذي يتضمّنه |
| serviceDetail.how.title | How it works | كيف يسير العمل |
| serviceDetail.how.sub | No mystery. No endless meetings. Here's the process. | لا غموض. لا اجتماعات لا تنتهي. إليك الآلية. |
| serviceDetail.faqTitle | Common questions | أسئلة شائعة |
| serviceDetail.cta.title | Ready to get started? | جاهز للبدء؟ |
| serviceDetail.cta.body | Book a strategy call. We'll discuss your needs and tell you honestly if we're the right fit — no pressure, no sales pitch. | احجز مكالمة استراتيجية. سنناقش احتياجاتك ونخبرك بصدق إن كنا الخيار المناسب — بلا ضغط ولا عروض بيعية. |

### Service Detail — Software
| Key | English | العربية |
|---|---|---|
| serviceDetail.software.title | Software that becomes your operational backbone | برمجيات تتحوّل إلى العمود الفقري التشغيلي لأعمالك |
| serviceDetail.software.desc | ERP and CRM platforms, customer-facing web, mobile apps, and the automation that connects them — designed to own, integrate, and scale. | منصّات ERP وCRM، ومواقع تواجه العملاء، وتطبيقات جوال، والأتمتة التي تربطها — مصمّمة لتملكها وتدمجها وتوسّعها. |
| serviceDetail.software.cta | Build your system | ابنِ نظامك |
| serviceDetail.software.feat.1.title | Business Systems (ERP / CRM) | أنظمة الأعمال (ERP / CRM) |
| serviceDetail.software.feat.1.desc | Custom platforms that centralize your sales, operations, and customer data into one source of truth. Built on proven frameworks, shaped to how your business actually runs. | منصّات مخصّصة توحّد بيانات مبيعاتك وعملياتك وعملائك في مصدر واحد موثوق. مبنية على أطر عمل مُثبتة، ومصمّمة وفق طريقة عمل شركتك الفعلية. |
| serviceDetail.software.feat.2.title | Web Platforms | منصّات الويب |
| serviceDetail.software.feat.2.desc | High-performance websites and web apps engineered for conversion and speed — connected to your systems from day one, not bolted on later. | مواقع وتطبيقات ويب عالية الأداء مصمّمة للتحويل والسرعة — مرتبطة بأنظمتك منذ اليوم الأول، لا مضافة لاحقاً. |
| serviceDetail.software.feat.3.title | Mobile Apps | تطبيقات الجوال |
| serviceDetail.software.feat.3.desc | Customer-facing and internal apps built for real-world use and scale, integrated with the same backend as everything else. | تطبيقات تواجه العملاء وأخرى داخلية، مبنية للاستخدام الواقعي والتوسّع، ومدمجة مع الأنظمة الخلفية نفسها. |
| serviceDetail.software.feat.4.title | Automation & AI | الأتمتة والذكاء الاصطناعي |
| serviceDetail.software.feat.4.desc | Workflow automation and AI integrations that remove manual work — lead routing, data sync, follow-ups, and the repetitive tasks eating your team's time. | أتمتة سير العمل وتكاملات الذكاء الاصطناعي التي تزيل العمل اليدوي — توجيه العملاء المحتملين، ومزامنة البيانات، والمتابعات، والمهام المتكرّرة التي تستهلك وقت فريقك. |
| serviceDetail.software.proc.1.title | Discovery | الاكتشاف |
| serviceDetail.software.proc.1.desc | We learn your business, goals, and technical requirements. | نتعرّف على أعمالك وأهدافك ومتطلباتك التقنية. |
| serviceDetail.software.proc.2.title | Proposal | العرض |
| serviceDetail.software.proc.2.desc | Clear scope, timeline, and a fixed price. | نطاق واضح، وجدول زمني، وسعر ثابت. |
| serviceDetail.software.proc.3.title | Design | التصميم |
| serviceDetail.software.proc.3.desc | Wireframes and visual design — you approve before we build. | مخططات هيكلية وتصميم بصري — تعتمده قبل أن نبدأ البناء. |
| serviceDetail.software.proc.4.title | Build | البناء |
| serviceDetail.software.proc.4.desc | We build and integrate, with weekly reviews. No surprises. | نبني وندمج، مع مراجعات أسبوعية. بلا مفاجآت. |
| serviceDetail.software.proc.5.title | Launch | الإطلاق |
| serviceDetail.software.proc.5.desc | Tested, live, and handed over — full ownership transferred. | مختبر ومُفعّل ومُسلّم — مع نقل الملكية الكاملة. |
| serviceDetail.software.faq.1.q | Do we own the code? | هل نملك الشيفرة البرمجية؟ |
| serviceDetail.software.faq.1.a | Yes. Full source code and IP transfer on completion. No lock-in, no fees to access your own system. | نعم. نقل كامل للشيفرة المصدرية والملكية الفكرية عند الانتهاء. لا احتكار، ولا رسوم للوصول إلى نظامك الخاص. |
| serviceDetail.software.faq.2.q | Can it integrate with our existing tools? | هل يمكن أن يتكامل مع أدواتنا الحالية؟ |
| serviceDetail.software.faq.2.a | That's the point. We connect to your CRM, ERP, and existing stack from day one. | هذا هو الهدف تماماً. نربط النظام بأنظمة CRM وERP وبقية أدواتك منذ اليوم الأول. |
| serviceDetail.software.faq.3.q | How long does a build take? | كم يستغرق البناء؟ |
| serviceDetail.software.faq.3.a | Depends on scope — we give you a specific timeline in the proposal, not a vague range. | يعتمد على النطاق — نمنحك جدولاً زمنياً محدداً في العرض، لا مدى مبهماً. |
| serviceDetail.software.faq.4.q | What if we already have a system? | ماذا لو كان لدينا نظام بالفعل؟ |
| serviceDetail.software.faq.4.a | We rebuild or extend what you have, whichever actually makes sense for your situation. | نعيد بناء ما لديك أو نطوّره، أيّهما أنسب لوضعك فعلاً. |

### Service Detail — Digital Marketing
| Key | English | العربية |
|---|---|---|
| serviceDetail.dm.title | Marketing built as an acquisition system | تسويق مبني كنظام لاستقطاب العملاء |
| serviceDetail.dm.desc | SEO, paid campaigns, and conversion strategy wired into one measurable engine that brings in qualified buyers — not vanity traffic. | تحسين محركات البحث والحملات المدفوعة واستراتيجية التحويل، مدمجة في محرك واحد قابل للقياس يجلب مشترين مؤهّلين — لا زيارات شكلية. |
| serviceDetail.dm.cta | Scale your acquisition | وسّع استقطابك |
| serviceDetail.dm.feat.1.title | Paid campaigns (Google / Meta / LinkedIn) | حملات مدفوعة (جوجل / ميتا / لينكدإن) |
| serviceDetail.dm.feat.2.title | Buyer-intent SEO | تحسين محركات بحث موجّه لنيّة الشراء |
| serviceDetail.dm.feat.3.title | Conversion-rate optimization | تحسين معدّل التحويل |
| serviceDetail.dm.feat.4.title | Funnel strategy & tracking | استراتيجية مسار المبيعات وتتبّعه |
| serviceDetail.dm.proc.1.title | Audit | التدقيق |
| serviceDetail.dm.proc.1.desc | We review your funnel, channels, and competitors. | نراجع مسار مبيعاتك وقنواتك ومنافسيك. |
| serviceDetail.dm.proc.2.title | Strategy | الاستراتيجية |
| serviceDetail.dm.proc.2.desc | A clear plan — channels, offers, and what we'll test. | خطة واضحة — القنوات والعروض وما سنختبره. |
| serviceDetail.dm.proc.3.title | Setup | الإعداد |
| serviceDetail.dm.proc.3.desc | Tracking, campaigns, and landing pages built and launched. | بناء وإطلاق أدوات التتبّع والحملات وصفحات الهبوط. |
| serviceDetail.dm.proc.4.title | Optimize | التحسين |
| serviceDetail.dm.proc.4.desc | Continuous testing against real performance data. | اختبار مستمر استناداً إلى بيانات الأداء الحقيقية. |
| serviceDetail.dm.faq.1.q | What's the minimum to make this work? | ما الحد الأدنى اللازم لنجاح ذلك؟ |
| serviceDetail.dm.faq.1.a | We're honest about fit — we're upfront about whether the budget justifies the work, and we'll tell you before you commit. | نحن صريحون بشأن الملاءمة — نصارحك بما إذا كانت الميزانية تبرّر العمل، ونخبرك بذلك قبل أن تلتزم. |
| serviceDetail.dm.faq.2.q | How fast do results come? | متى تظهر النتائج؟ |
| serviceDetail.dm.faq.2.a | Paid moves in weeks; SEO is a few months for meaningful traffic. We set realistic expectations before we start. | الحملات المدفوعة تتحرّك خلال أسابيع؛ أما تحسين محركات البحث فيحتاج بضعة أشهر لزيارات ذات قيمة. نضع توقعات واقعية قبل أن نبدأ. |
| serviceDetail.dm.faq.3.q | Do you guarantee results? | هل تضمنون النتائج؟ |
| serviceDetail.dm.faq.3.a | We guarantee our work and our process, not market conditions. Targets are agreed upfront and we're accountable to them. | نضمن عملنا ومنهجيتنا، لا ظروف السوق. نتّفق على الأهداف مسبقاً ونكون مسؤولين عنها. |

### Service Detail — AI Training
| Key | English | العربية |
|---|---|---|
| serviceDetail.ai.title | AI training that turns tools into capability | تدريب على الذكاء الاصطناعي يحوّل الأدوات إلى قدرات فعلية |
| serviceDetail.ai.desc | Structured AI adoption programs for teams and leadership — built to leave your people using AI on real work, not just aware of it. | برامج منظّمة لتبنّي الذكاء الاصطناعي للفرق والقيادات — مصمّمة لتجعل فريقك يستخدم الذكاء الاصطناعي في عمل حقيقي، لا مجرد الإلمام به. |
| serviceDetail.ai.cta | Start your AI program | ابدأ برنامجك للذكاء الاصطناعي |
| serviceDetail.ai.feat.1.title | Executive AI strategy sessions | جلسات استراتيجية للمدراء حول الذكاء الاصطناعي |
| serviceDetail.ai.feat.2.title | Department-level adoption programs | برامج تبنٍّ على مستوى الأقسام |
| serviceDetail.ai.feat.3.title | Hands-on workflow integration workshops | ورش عملية لدمج الذكاء الاصطناعي في سير العمل |
| serviceDetail.ai.feat.4.title | Implementation support | دعم التنفيذ |
| serviceDetail.ai.proc.1.title | Assess | التقييم |
| serviceDetail.ai.proc.1.desc | We map your team's workflows and where AI actually helps. | نرسم خريطة سير عمل فريقك ومواضع الفائدة الفعلية للذكاء الاصطناعي. |
| serviceDetail.ai.proc.2.title | Design | التصميم |
| serviceDetail.ai.proc.2.desc | A program built around your tools and real tasks. | برنامج مبني حول أدواتك ومهامك الحقيقية. |
| serviceDetail.ai.proc.3.title | Train | التدريب |
| serviceDetail.ai.proc.3.desc | Hands-on sessions for leadership and teams. | جلسات عملية للقيادات والفرق. |
| serviceDetail.ai.proc.4.title | Embed | الترسيخ |
| serviceDetail.ai.proc.4.desc | Documented workflows your team keeps and reuses. | سير عمل موثّق يحتفظ به فريقك ويعيد استخدامه. |
| serviceDetail.ai.faq.1.q | Is this generic AI training? | هل هذا تدريب عام على الذكاء الاصطناعي؟ |
| serviceDetail.ai.faq.1.a | No. Programs are built around your actual workflows and tools, not a stock curriculum. | لا. البرامج مبنية حول سير عملك وأدواتك الفعلية، لا منهجاً جاهزاً. |
| serviceDetail.ai.faq.2.q | Who is it for? | لمن هذا التدريب؟ |
| serviceDetail.ai.faq.2.a | Leadership and teams — we run both strategy-level and hands-on tracks. | للقيادات والفرق — نقدّم مسارين: على المستوى الاستراتيجي وعلى المستوى العملي. |
| serviceDetail.ai.faq.3.q | What do we walk away with? | بماذا نخرج في النهاية؟ |
| serviceDetail.ai.faq.3.a | People who use AI on real work, plus documented workflows your team keeps. | أشخاص يستخدمون الذكاء الاصطناعي في عمل حقيقي، إضافة إلى سير عمل موثّق يحتفظ به فريقك. |

### Portfolio & Project Detail
| Key | English | العربية |
|---|---|---|
| portfolio.title | Selected Work | أعمال مختارة |
| portfolio.sub | A curation of digital infrastructure and growth systems engineered for market leaders. | باقة مختارة من البنى الرقمية وأنظمة النمو المصمّمة لروّاد السوق. |
| portfolio.empty | No projects found in this category. | لا توجد مشاريع في هذه الفئة. |
| projectDetail.back | Back to Portfolio | العودة إلى الأعمال |
| projectDetail.notFound | Project not found | المشروع غير موجود |
| projectDetail.mobileCta | Start a Project Like This | ابدأ مشروعاً مثل هذا |
| projectDetail.challenge | The Challenge | التحدّي |
| projectDetail.solution | The Solution | الحل |
| projectDetail.techStack | Tech Stack | التقنيات المستخدمة |
| projectDetail.startProject | Start Your Project | ابدأ مشروعك |

### Contact
| Key | English | العربية |
|---|---|---|
| contact.title | Let's talk | لنتحدث |
| contact.sub | Tell us about your business and what's slowing it down. We'll tell you honestly if we can help. | أخبرنا عن أعمالك وما الذي يبطّئها. وسنصارحك بما إذا كنا نستطيع المساعدة. |
| contact.name | Name | الاسم |
| contact.email | Email | البريد الإلكتروني |
| contact.phone | Phone | الهاتف |
| contact.optional | (optional) | (اختياري) |
| contact.company | Company | الشركة |
| contact.service | What do you need? | ما الذي تحتاجه؟ |
| contact.message | Message | الرسالة |
| contact.ph.name | Your name | اسمك |
| contact.ph.email | you@company.com | you@company.com |
| contact.ph.phone | +20 100 000 0000 | +20 100 000 0000 |
| contact.ph.company | Your Company | اسم شركتك |
| contact.ph.service | Select a service | اختر خدمة |
| contact.ph.message | Tell us about your project goals... | أخبرنا عن أهداف مشروعك... |
| contact.submit | Send message | إرسال الرسالة |
| contact.submitting | Sending… | جارٍ الإرسال… |
| contact.info | Contact details | بيانات التواصل |
| contact.emailLabel | Email | البريد الإلكتروني |
| contact.phoneLabel | Phone | الهاتف |
| contact.phoneVal | Available on request | متاح عند الطلب |
| contact.responseLabel | Response Time | وقت الاستجابة |
| contact.responseVal | Within 24 hours on business days | خلال 24 ساعة في أيام العمل |
| contact.quick.title | Quick Response Guarantee | ضمان الاستجابة السريعة |
| contact.quick.body | We typically respond to all inquiries within 24 hours during business days. For urgent matters, please mention it in your message. | نردّ عادةً على جميع الاستفسارات خلال 24 ساعة في أيام العمل. وللأمور العاجلة، يُرجى الإشارة إلى ذلك في رسالتك. |
| contact.toast.success | Message sent — we'll get back to you within 24 hours. | تم إرسال الرسالة — سنعاود التواصل معك خلال 24 ساعة. |
| contact.toast.error | Something went wrong — please try again, or email us directly. | حدث خطأ ما — يُرجى المحاولة مجدداً، أو مراسلتنا مباشرةً عبر البريد. |

### Footer
| Key | English | العربية |
|---|---|---|
| footer.tagline | We build the systems behind business growth. | نبني الأنظمة التي تقف خلف نمو الأعمال. |
| footer.services | Services | الخدمات |
| footer.company | Company | الشركة |
| footer.connectShort | Connect | تواصل |
| footer.stayConnected | Stay Connected | ابقَ على تواصل |
| footer.link.webdev | Web Dev | تطوير الويب |
| footer.link.automation | Automation | الأتمتة |
| footer.link.aiagents | AI Agents | وكلاء الذكاء الاصطناعي |
| footer.link.marketing | Marketing | التسويق |
| footer.link.about | About | من نحن |
| footer.link.work | Work | الأعمال |
| footer.link.contact | Contact | تواصل |
| footer.newsletter.text | Get the latest trends in AI and Web Dev delivered to your inbox. | احصل على أحدث اتجاهات الذكاء الاصطناعي وتطوير الويب في بريدك. |
| footer.newsletter.placeholder | Enter your email | أدخل بريدك الإلكتروني |
| footer.location | Cairo, Egypt | القاهرة، مصر |
| footer.copyright | OmniflowAI Agency. All rights reserved. | وكالة OmniflowAI. جميع الحقوق محفوظة. |
| footer.toast.subscribed | Thanks — you're subscribed. | شكراً — تم اشتراكك. |
| footer.toast.error | Something went wrong, please try again. | حدث خطأ ما، يُرجى المحاولة مجدداً. |

### About (team/founder attribution stays frozen — not translated)
| Key | English | العربية |
|---|---|---|
| about.badge | Who we are | من نحن |
| about.headline.lead | Engineers who understand | مهندسون يفهمون |
| about.headline.highlight | business. | الأعمال. |
| about.sub | OmniflowAI is a digital transformation partner built around one belief: most companies don't need more tools — they need the right systems, built well and connected properly. | ‏OmniflowAI شريك في التحول الرقمي يقوم على قناعة واحدة: معظم الشركات لا تحتاج مزيداً من الأدوات — بل تحتاج الأنظمة الصحيحة، مبنية بإتقان ومترابطة كما ينبغي. |
| about.story.heading | We started OmniflowAI to close a gap. | أسّسنا OmniflowAI لسدّ فجوة. |
| about.story.p1 | Too many businesses are sold disconnected pieces — a website here, an ad campaign there, a tool nobody integrates — and left to stitch them together themselves. The result is expensive fragmentation: software that doesn't talk, marketing that doesn't convert, and no clear view of what's working. | تُباع لكثير من الشركات أجزاء غير مترابطة — موقع هنا، وحملة إعلانية هناك، وأداة لا يدمجها أحد — وتُترك لتجمّعها بنفسها. والنتيجة تشتّت مكلف: برمجيات لا تتحاور، وتسويق لا يحوّل، وغياب رؤية واضحة لما ينجح. |
| about.story.p2 | We do the opposite. We start from how your business actually operates, then design and build the systems that fit it — software, marketing, and automation that work as one. You own everything we build. No lock-in, no dependency, no black boxes. | نحن نفعل العكس. نبدأ من طريقة عمل شركتك الفعلية، ثم نصمّم ونبني الأنظمة التي تلائمها — برمجيات وتسويق وأتمتة تعمل ككلٍّ واحد. أنت تملك كل ما نبنيه. لا احتكار، ولا تبعية، ولا صناديق مغلقة. |
| about.story.p3 | We work like engineers, not order-takers: we care about outcomes you can measure, systems that outlast the engagement, and giving you the keys at the end. | نعمل كمهندسين لا كمنفّذي طلبات: يهمّنا تحقيق نتائج تستطيع قياسها، وأنظمة تدوم بعد انتهاء التعاون، وتسليمك المفاتيح في النهاية. |
| about.team.heading | Meet the Builders | تعرّف على فريق البناء |
| about.team.sub | No outsourcing. No juniors learning on your dime. Just senior talent dedicated to your growth. | لا إسناد خارجي. لا مبتدئون يتعلّمون على حسابك. فقط كفاءات خبيرة مكرّسة لنموّك. |
| about.values.1.title | Systems over services | الأنظمة قبل الخدمات |
| about.values.1.desc | We don't sell isolated deliverables. Everything we build is designed to connect and compound. | لا نبيع مخرجات منعزلة. كل ما نبنيه مصمَّم ليترابط وتتضاعف قيمته. |
| about.values.2.title | You own it | الملكية لك |
| about.values.2.desc | Full source code and IP transfer on every build. What you pay for is yours. | نقل كامل للشيفرة المصدرية والملكية الفكرية في كل مشروع. ما تدفع مقابله يصبح ملكك. |
| about.values.3.title | Engineering-led | بقيادة هندسية |
| about.values.3.desc | You work directly with the people building your systems, not an account manager relaying messages. | تتعامل مباشرةً مع من يبنون أنظمتك، لا مع مدير حسابات ينقل الرسائل. |
| about.values.4.title | Measured by outcomes | نُقاس بالنتائج |
| about.values.4.desc | We tie our work to business results — revenue, efficiency, acquisition — not hours logged or assets shipped. | نربط عملنا بنتائج الأعمال — إيرادات وكفاءة واستقطاب — لا بساعات مسجّلة أو مخرجات مُسلّمة. |
| about.cta.title | Let's map your systems | لنرسم خريطة أنظمتك |

### 404
| Key | English | العربية |
|---|---|---|
| notFound.title | Page not found | الصفحة غير موجودة |
| notFound.body | The page you're looking for doesn't exist or has moved. | الصفحة التي تبحث عنها غير موجودة أو تم نقلها. |
| notFound.button | Back to home | العودة إلى الرئيسية |

---

## Verification
- `npx tsc` → **0 errors**; `npm run build` → **success**; built CSS contains the
  `[dir=rtl]` Cairo + icon-flip rules and Cairo is referenced.
- EN/AR key parity: **243 = 243, none missing** on either side (checked
  programmatically), so no key silently falls back to its raw string.
- Default language English; toggling to Arabic switches all public copy, sets
  `dir="rtl"` + `lang="ar"`, and applies Cairo; toggling back restores LTR; the choice
  persists in localStorage across reloads; admin (Dashboard/Leads/Auth) stays English;
  the frozen team/founder nodes remain `[TODO(team-final)]` in both languages.

**Changed files:** `client/src/lib/i18n.tsx`, `client/index.html`,
`client/src/index.css`, `client/src/App.tsx`, `client/src/components/Navigation.tsx`,
`client/src/components/Footer.tsx`, `client/src/pages/not-found.tsx`,
`client/src/pages/Home.tsx`, `client/src/pages/Services.tsx`,
`client/src/pages/ServiceDetail.tsx`, `client/src/pages/Portfolio.tsx`,
`client/src/pages/ProjectDetail.tsx`, `client/src/pages/Contact.tsx`,
`client/src/pages/About.tsx`, plus `LAYER5-BILINGUAL.md` (new).
