# Website Content Inventory & User Journey Reference

**Prepared for:** Marketing · Conversion Copywriting · Brand Strategy · UX
**Source of record:** OmniflowAI codebase at commit `381fe70`, verified 2026-08-06
**Companion document:** `docs/OMNIFLOW-AUDIT.md`

---

## How to read this document

This is a factual inventory. It records what exists in the current implementation. It contains no evaluation, recommendation, or rewriting.

**Formatting convention:**
- Text inside `"straight quotation marks"` is **existing website copy, reproduced exactly** — including punctuation, em dashes, and ellipses.
- Plain prose outside quotation marks is **descriptive documentation** written for this reference.
- Where information does not exist in the implementation, the entry reads: **"Not available in current implementation."**

**Language note:** All public-facing copy is stored in a single dictionary at `client/src/lib/i18n.tsx` with 296 English keys and 296 Arabic keys at exact parity. This document reproduces the **English** copy in full, plus **Arabic** for the homepage and global elements. Arabic for every other key exists at the same key name in the same file.

---

# 1. Website Overview

## 1.1 Website purpose

Based only on the site's own meta description and hero copy:

- SEO/meta description: `"OmniflowAI is your digital transformation partner — we build systems for growth across AI training, digital marketing, and business software."`
- Homepage H1: `"Most teams buy the tool first."` + `"We diagnose first."`
- About page sub-headline: `"OmniflowAI is a digital transformation partner built around one belief: most companies don't need more tools — they need the right systems, built well and connected properly."`

## 1.2 Target audience

The site does not contain a demographic or firmographic audience statement. The only explicit statements of who a service is for appear as pillar taglines on the Services page:

| Pillar | Stated audience (exact copy) |
|---|---|
| AI Training | `"For teams using AI ad hoc — or not at all."` |
| Marketing | `"For pipelines running on referrals and word of mouth."` |
| Software | `"For teams running the business on spreadsheets and disconnected tools."` |

Geographic statements (Home, trust strip):
- `"Trusted by brands across the US, the GCC & Egypt"`
- `"Egypt · Saudi Arabia · UAE · Qatar · Kuwait · Bahrain · Oman · United States"`

Any further audience definition: **Not available in current implementation.**

## 1.3 Main conversion actions

| Action | Mechanism | Destination |
|---|---|---|
| Book a strategy call | CTA buttons across all public pages | `/contact` |
| Submit the contact form | Form on `/contact` | `POST /api/contact` → lead record |
| Subscribe to the newsletter | Footer form (desktop only) | `POST /api/subscribe` → lead record |
| Start a WhatsApp conversation | Floating button on all public pages | `https://wa.me/201119936014` |
| View portfolio work | Secondary CTAs and nav | `/portfolio` |

The primary CTA string used site-wide is `"Book a strategy call"` (Arabic: `"احجز مكالمة استراتيجية"`).

## 1.4 Available languages

- **English (en)** — default
- **Arabic (ar)** — formal Modern Standard Arabic, right-to-left

Switching is via a globe icon in the desktop navigation and a labelled button in the mobile menu (`"العربية"` / `"English"`). The selection persists in `localStorage` and sets `lang` and `dir` on the document.

Not translated by design: the brand name "OmniflowAI", the contact email address, database-stored project content, browser tab titles, and the entire admin CMS.

## 1.5 Main website sections

Public: Home · About · Services · Service Detail (×3) · Portfolio · Project Detail · Contact · 404
Admin: Login · Portfolio Management · Lead Management

There is no blog. **Not available in current implementation.**

---

# 2. Website Copy Inventory

## 2.1 Global — Meta / `<head>`

| Field | Value |
|---|---|
| SEO title | `"OmniflowAI — Your Digital Transformation Partner"` |
| Meta description | `"OmniflowAI is your digital transformation partner — we build systems for growth across AI training, digital marketing, and business software."` |
| OG title | `"OmniflowAI — Your Digital Transformation Partner"` |
| OG description | Same as meta description |
| Twitter card | `summary_large_image`, same title and description |
| Per-page tab title pattern | `"<Page> — OmniflowAI"` (English only) |

Per-page tab titles in use: `"About"`, `"Services"`, `"Portfolio"`, `"Contact"`, `"Page not found"`, `"Admin Login"`, `"Admin — Leads"`, the pillar label on service pages, and the project title on project pages.

## 2.2 Global — Navigation

| Element | English | Arabic |
|---|---|---|
| Link 1 | `"Home"` | `"الرئيسية"` |
| Link 2 | `"Services"` | `"الخدمات"` |
| Link 3 | `"Portfolio"` | `"أعمالنا"` |
| Link 4 | `"About"` | `"من نحن"` |
| Link 5 | `"Contact"` | `"تواصل معنا"` |
| Header CTA | `"Let's Talk"` | `"لنتحدث"` |

Logo lockup renders as `"Omniflow"` + `"AI"` beside a hexagon icon, forced left-to-right in both languages.

## 2.3 Global — Repeated strings

| Key | English | Arabic |
|---|---|---|
| Primary CTA | `"Book a strategy call"` | `"احجز مكالمة استراتيجية"` |
| Brand line | `"We don't hand over deliverables and walk away. We build systems that keep working after we're gone."` | `"نحن لا نسلّم مخرجات ونمضي. نحن نبني أنظمة تستمر في العمل حتى بعد انتهاء تعاوننا."` |
| Filter label | `"All"` | `"الكل"` |
| Portfolio link | `"View all projects"` | `"عرض جميع الأعمال"` |
| WhatsApp button | `"Chat on WhatsApp"` | `"تواصل عبر واتساب"` |

**Category labels** (used on project cards, badges, and portfolio filters):

| English | Arabic |
|---|---|
| `"Business Systems"` | `"أنظمة الأعمال"` |
| `"Web"` | `"الويب"` |
| `"Mobile"` | `"تطبيقات الجوال"` |
| `"Automation & AI"` | `"الأتمتة والذكاء الاصطناعي"` |
| `"Digital Marketing"` | `"التسويق الرقمي"` |
| `"AI Training"` | `"التدريب على الذكاء الاصطناعي"` |

## 2.4 Home — `/`

Ten sections in render order.

### Section 1 — Hero

| Element | English | Arabic |
|---|---|---|
| H1 (lead) | `"Most teams buy the tool first."` | `"معظم الفِرق تبدأ باختيار الأداة."` |
| H1 (accent) | `"We diagnose first."` | `"نحن نبدأ بالتشخيص."` |
| Supporting text | `"AI, marketing, software, automation — we only build what the diagnosis supports. We look before we touch, so what we build fits how your business actually runs."` | `"ذكاء اصطناعي، تسويق، برمجيات، أتمتة — لا نبني إلا ما يدعمه التشخيص. ننظر قبل أن نلمس، ليلائم ما نبنيه طريقة عمل أعمالك فعلاً."` |
| Primary CTA | `"Book a strategy call"` | `"احجز مكالمة استراتيجية"` |
| Secondary CTA | `"See our work"` | `"استعرض أعمالنا"` |

**Interactive system map labels** (six ring nodes + centre):

| Position | English | Arabic |
|---|---|---|
| Centre | `"Business System"` | `"نظام الأعمال"` |
| Node | `"AI Training"` | `"تدريب الذكاء الاصطناعي"` |
| Node | `"Digital Marketing"` | `"التسويق الرقمي"` |
| Node | `"Software"` | `"البرمجيات"` |
| Node | `"Automation"` | `"الأتمتة"` |
| Node | `"CRM"` | `"إدارة العملاء"` |
| Node | `"Strategy"` | `"الاستراتيجية"` |

Screen-reader description: `"A connected business system: AI training, digital marketing, software, automation, CRM and strategy all connecting into one central system."`

### Section 2 — Trust strip + client logos

| Element | English | Arabic |
|---|---|---|
| Eyebrow | `"Trusted partners"` | `"شركاء نثق بهم"` |
| Headline | `"Trusted by brands across the US, the GCC & Egypt"` | `"موثوقون من علاماتٍ تجارية في الولايات المتحدة ودول الخليج ومصر"` |
| Stat 1 | `"50+"` / `"Projects delivered"` | `"50+"` / `"مشروعٌ منجز"` |
| Stat 2 | `"8"` / `"Countries"` | `"8"` / `"دول"` |
| Stat 3 | `"Full GCC coverage"` / `"+ US & Egypt"` | `"تغطية كاملة لدول الخليج"` / `"+ الولايات المتحدة ومصر"` |
| Country strip | `"Egypt · Saudi Arabia · UAE · Qatar · Kuwait · Bahrain · Oman · United States"` | `"مصر · السعودية · الإمارات · قطر · الكويت · البحرين · عُمان · الولايات المتحدة"` |

Below the copy: a continuously scrolling row of 32 client logos. Logos carry no captions; the only text is each image's `alt` attribute (the client name).

### Section 3 — Value proposition

| Element | English | Arabic |
|---|---|---|
| Headline (lead) | `"Most companies don't have a marketing problem."` | `"معظم الشركات لا تعاني مشكلة تسويق."` |
| Headline (accent) | `"They have a systems problem."` | `"بل تعاني مشكلة أنظمة."` |
| Body | `"Disconnected tools, manual handoffs, and no clear line of sight from a lead to a closed deal. We connect the whole chain — how you acquire customers, how you convert them, and how you operate once they're in — so the parts work as one system you can actually measure."` | `"أدوات غير مترابطة، وعمليات تسليم يدوية، وغياب رؤية واضحة من العميل المحتمل حتى إتمام الصفقة. نحن نربط السلسلة كاملة — كيف تستقطب عملاءك، وكيف تحوّلهم، وكيف تدير أعمالك بعد انضمامهم — لتعمل الأجزاء كنظام واحد يمكنك قياسه فعلاً."` |

### Section 4 — Pillars

Section headline: `"Three capabilities. One transformation partner."` (AR: `"ثلاث قدرات. شريك تحوّل رقمي واحد."`)

Three cards, each linking to its service detail page.

**Card 1 — links to `/services/ai-training`**
- Title: `"AI training that turns tools into capability"`
- Body: `"We run structured AI adoption programs for teams and leadership — from executive strategy sessions to hands-on workflow integration. The goal isn't awareness, it's operational capability: your people using AI on real work, not watching a demo."`
- AR title: `"تدريب على الذكاء الاصطناعي يحوّل الأدوات إلى قدرات فعلية"`

**Card 2 — links to `/services/digital-marketing`**
- Title: `"Marketing built as an acquisition system"`
- Body: `"SEO, paid campaigns, and conversion strategy wired into one engine that targets qualified buyers — not vanity traffic. Every stage is tracked, so you know what a lead actually costs and where revenue comes from."`
- AR title: `"تسويق مبني كنظام لاستقطاب العملاء"`

**Card 3 — links to `/services/software`**
- Title: `"Software that becomes your operational backbone"`
- Body: `"The systems your business runs on — ERP and CRM platforms, customer-facing web, mobile apps, and the automation that connects them. Built to own, integrate, and scale, not to rent."`
- Sub-capability line: `"Business Systems (ERP/CRM) · Web Platforms · Mobile Apps · Automation & AI"`
- AR title: `"برمجيات تتحوّل إلى العمود الفقري التشغيلي لأعمالك"`

### Section 5 — Transformation (Before / After)

Headline: `"From scattered tools to one connected system"` (AR: `"من أدوات متناثرة إلى نظام واحد مترابط"`)

Column labels: `"Before"` / `"After"` (AR: `"قبل"` / `"بعد"`)

| Before | After |
|---|---|
| `"Tools that don't talk to each other"` | `"One integrated business system"` |
| `"Marketing disconnected from operations"` | `"Acquisition, conversion, and operations connected"` |
| `"Manual work slowing everything down"` | `"Automated workflows across the business"` |
| `"No clear view of what's actually working"` | `"Real-time visibility into performance"` |

Arabic equivalents: `"أدوات لا تتواصل فيما بينها"` / `"نظام أعمال واحد متكامل"`; `"تسويق منفصل عن العمليات التشغيلية"` / `"ترابط بين الاستقطاب والتحويل والعمليات"`; `"عمل يدوي يبطّئ كل شيء"` / `"سير عمل مؤتمت في الشركة كلها"`; `"غياب رؤية واضحة لما ينجح فعلاً"` / `"رؤية لحظية للأداء"`

### Section 6 — Proof (conditional)

Renders only when at least one project is flagged "Featured" in the CMS.

| Element | English | Arabic |
|---|---|---|
| Headline | `"Measured by outcomes, not deliverables"` | `"نُقاس بالنتائج، لا بالمخرجات"` |
| Body | `"Every engagement is tied to something your business can feel — revenue, efficiency, acquisition cost, scale. Here's the work behind that."` | `"كل مشروع مرتبط بأثر تلمسه أعمالك — إيرادات، كفاءة، تكلفة استقطاب، توسّع. وهذه هي الأعمال التي تقف وراء ذلك."` |

Card content is database-driven: project image, project title, category label, and the first entry from the project's results list. No static copy.

### Section 7 — Recent work (conditional)

Renders only when at least one non-featured project exists. Displays up to six in a carousel.

| Element | English | Arabic |
|---|---|---|
| Headline | `"Recent work"` | `"أحدث الأعمال"` |
| Sub | `"A look at the systems we've built."` | `"لمحة عن الأنظمة التي بنيناها."` |
| Link | `"View all projects"` | `"عرض جميع الأعمال"` |

### Section 8 — How we work

Headline: `"How we work"` (AR: `"كيف نعمل"`)

| Step | Title | Description |
|---|---|---|
| 01 | `"Diagnose"` | `"We map your business model, systems, and the bottlenecks slowing growth."` |
| 02 | `"Design"` | `"We design the right mix of software, marketing, and automation for how you actually operate."` |
| 03 | `"Build"` | `"We develop and integrate the system, and hand you full ownership."` |
| 04 | `"Optimize"` | `"We keep improving it against real business data."` |

Arabic: `"التشخيص"` / `"نرسم خريطة نموذج عملك وأنظمتك والعوائق التي تبطّئ نموّك."` · `"التصميم"` / `"نصمّم المزيج المناسب من البرمجيات والتسويق والأتمتة بما يلائم طريقة عملك الفعلية."` · `"البناء"` / `"نطوّر النظام وندمجه ونسلّمك ملكيته الكاملة."` · `"التحسين"` / `"نواصل تحسينه استناداً إلى بيانات أعمالك الحقيقية."`

### Section 9 — Brand line

Displays the global brand line (see §2.3) beside a shield icon, with the primary CTA button.

### Section 10 — Final CTA

| Element | English | Arabic |
|---|---|---|
| Headline | `"Ready to transform how your business runs?"` | `"جاهز لتغيير طريقة إدارة أعمالك؟"` |
| Body | `"Book a strategy call. We'll look at your current systems and show you exactly what's blocking growth — even if you don't work with us."` | `"احجز مكالمة استراتيجية. سننظر في أنظمتك الحالية ونوضّح لك بالضبط ما يعيق النمو — حتى إن لم تعمل معنا."` |
| Button | `"Book your strategy call"` | `"احجز مكالمتك الاستراتيجية"` |
| Sub-text | `"No sales pitch. Just clarity."` | `"بلا عروض بيعية. وضوح فقط."` |

## 2.5 Services — `/services`

| Element | English | Arabic |
|---|---|---|
| Eyebrow | `"What we do"` | `"ما الذي نقدّمه"` |
| H1 (lead) | `"Three capabilities."` | `"ثلاث قدرات."` |
| H1 (accent) | `"One transformation partner."` | `"شريك تحوّل رقمي واحد."` |
| Sub-headline | `"Marketing that fills the pipeline, software that runs the business, and AI your team actually uses."` | Available at key `services.subhead` |

**Pillar tabs** — labels: `"AI Training"` · `"Marketing"` · `"Software"`

Note: `"Marketing"` is a display label used only on this page; the taxonomy label elsewhere is `"Digital Marketing"`.

**Selected pillar panel** — content changes with the active tab:

| Pillar | Title | Tagline | Body | Steps |
|---|---|---|---|---|
| AI Training | `"AI Training"` | `"For teams using AI ad hoc — or not at all."` | `"We turn AI from scattered experiments into repeatable team capability."` | `"Assess"` · `"Locate"` · `"Train"` · `"Embed"` |
| Marketing | `"Marketing"` | `"For pipelines running on referrals and word of mouth."` | `"We turn scattered campaigns into one acquisition system that brings in qualified buyers."` | `"Audit"` · `"Target"` · `"Launch"` · `"Measure"` |
| Software | `"Software"` | `"For teams running the business on spreadsheets and disconnected tools."` | `"We turn manual workarounds into systems you own, integrate, and scale."` | `"Map"` · `"Design"` · `"Build"` · `"Integrate"` |

Panel buttons: `"Book a strategy call"` and `"Explore"` + the active pillar label (e.g. `"Explore Software"`).

**Pain router section**

| Element | Copy |
|---|---|
| Headline | `"Not sure which one fits?"` |
| Button 1 | `"More qualified leads"` |
| Button 2 | `"Messy operations & tools"` |
| Button 3 | `"Team AI adoption"` |
| Button 4 | `"All of the above"` |

## 2.6 Service Detail — `/services/:slug`

Three valid slugs. Full content in §5.

**Shared labels across all three pages:**

| Element | Copy |
|---|---|
| Back link | `"← All services"` |
| Secondary CTA | `"See examples"` |
| Features heading | `"What's included"` |
| Process heading | `"How it works"` |
| Process sub | `"No mystery. No endless meetings. Here's the process."` |
| FAQ heading | `"Common questions"` |
| Related section heading | `"Proven Results"` |
| Related section sub | `"See how we've helped companies like yours."` |
| Related section link | `"View Full Portfolio"` |
| Closing CTA heading | `"Ready to get started?"` |
| Closing CTA body | `"Book a strategy call. We'll discuss your needs and tell you honestly if we're the right fit — no pressure, no sales pitch."` |
| Invalid slug heading | `"Service not found"` |
| Invalid slug button | `"View all services"` |

## 2.7 Portfolio — `/portfolio`

| Element | Copy |
|---|---|
| H1 | `"Selected Work"` |
| Sub-headline | `"A curation of digital infrastructure and growth systems engineered for market leaders."` |
| Empty state | `"No projects found in this category."` |
| Filter tab (always present) | `"All"` |
| Other filter tabs | Category labels (see §2.3), shown only for categories in use |
| Deep-link banner prefix | `"Showing"` |
| Deep-link banner clear link | `"View all work"` |
| Deep-link pillar labels | `"AI Training"` · `"Digital Marketing"` · `"Software"` |

## 2.8 Project Detail — `/portfolio/:id`

| Element | Copy |
|---|---|
| Back link | `"Back to Portfolio"` |
| Error state | `"Project not found"` |
| Mobile CTA | `"Start a Project Like This"` |
| Section heading 1 | `"The Problem"` |
| Section heading 2 | `"The Diagnosis"` |
| Section heading 3 | `"The System"` |
| Sidebar heading | `"Tech Stack"` |
| Sidebar CTA | `"Start Your Project"` |

All other content on this page is database-driven (see §6.2).

## 2.9 Contact — `/contact`

| Element | Copy |
|---|---|
| H1 | `"Let's talk"` |
| Sub-headline | `"Tell us about your business and what's slowing it down. We'll tell you honestly if we can help."` |

**Form labels**

| Field | Label | Placeholder |
|---|---|---|
| Name | `"Name"` | `"Your name"` |
| Email | `"Email"` | `"you@company.com"` |
| Phone | `"Phone"` + `"(optional)"` | `"+20 100 000 0000"` |
| Company | `"Company"` + `"(optional)"` | `"Your Company"` |
| Service | `"What do you need?"` | `"Select a service"` |
| Message | `"Message"` | `"Tell us about your project goals..."` |

**Service dropdown options:** `"AI Training"` · `"Digital Marketing"` · `"Software"` · `"Other"`

**Buttons:** `"Send message"` / while submitting: `"Sending…"`

**Sidebar — contact details**

| Element | Copy |
|---|---|
| Card heading | `"Contact details"` |
| Email label / value | `"Email"` / `contact@omniflowai.net` |
| Phone label / value | `"Phone"` / `"Available on request"` |
| Response label / value | `"Response Time"` / `"Within 24 hours on business days"` |

**Sidebar — guarantee card**

- Heading: `"Quick Response Guarantee"`
- Body: `"We typically respond to all inquiries within 24 hours during business days. For urgent matters, please mention it in your message."`

**Toast messages**

- Success: `"Message sent — we'll get back to you within 24 hours."`
- Error: `"Something went wrong — please try again, or email us directly."`

## 2.10 About — `/about`

| Element | Copy |
|---|---|
| Badge | `"Who we are"` |
| H1 (lead) | `"Engineers who understand"` |
| H1 (accent) | `"business."` |
| Sub-headline | `"OmniflowAI is a digital transformation partner built around one belief: most companies don't need more tools — they need the right systems, built well and connected properly."` |

**Story section** (accompanied by a team photograph)

- Heading: `"We started OmniflowAI to close a gap."`
- Paragraph 1: `"Too many businesses are sold disconnected pieces — a website here, an ad campaign there, a tool nobody integrates — and left to stitch them together themselves. The result is expensive fragmentation: software that doesn't talk, marketing that doesn't convert, and no clear view of what's working."`
- Paragraph 2: `"We do the opposite. We start from how your business actually operates, then design and build the systems that fit it — software, marketing, and automation that work as one. You own everything we build. No lock-in, no dependency, no black boxes."`
- Paragraph 3: `"We work like engineers, not order-takers: we care about outcomes you can measure, systems that outlast the engagement, and giving you the keys at the end."`

**Values section** (four cards, no section heading)

| Title | Description |
|---|---|
| `"Systems over services"` | `"We don't sell isolated deliverables. Everything we build is designed to connect and compound."` |
| `"You own it"` | `"Full source code and IP transfer on every build. What you pay for is yours."` |
| `"Engineering-led"` | `"You work directly with the people building your systems, not an account manager relaying messages."` |
| `"Measured by outcomes"` | `"We tie our work to business results — revenue, efficiency, acquisition — not hours logged or assets shipped."` |

**Closing CTA**
- Heading: `"Let's map your systems"`
- Body: the global brand line (see §2.3)
- Button: `"Book a strategy call"`

**Team member section:** A team grid heading (`"Meet the Builders"`) and sub-headline (`"No outsourcing. No juniors learning on your dime. Just senior talent dedicated to your growth."`) exist in the content dictionary but **are not rendered on the page**. No individual names, roles, or biographies are displayed. Founder attribution: **Not available in current implementation.**

## 2.11 Footer

| Element | Copy |
|---|---|
| Brand | `"OmniflowAI"` |
| Tagline | `"We build the systems behind business growth."` |
| Column heading | `"Services"` |
| Service links | `"AI Training"` · `"Digital Marketing"` · `"Software"` |
| Column heading | `"Company"` |
| Company links | `"About"` · `"Work"` · `"Contact"` |
| Column heading (desktop) | `"Stay Connected"` |
| Column heading (mobile) | `"Connect"` |
| Newsletter body | `"Practical notes on AI, marketing, and the systems that connect them — straight to your inbox."` |
| Newsletter placeholder | `"Enter your email"` |
| Newsletter success toast | `"Thanks — you're subscribed."` |
| Newsletter error toast | `"Something went wrong, please try again."` |
| Email displayed | `contact@omniflowai.net` |
| Location | `" Wilmington, DE, USA"` |
| Copyright line | `"© {current year} Omniflowai LLC · Registered in Wyoming, USA"` |

Social media icons: no URLs are configured, so no icons render. Legal links (privacy, terms, sitemap): **Not available in current implementation.**

## 2.12 404 page

| Element | Copy |
|---|---|
| Heading | `"Page not found"` |
| Body | `"The page you're looking for doesn't exist or has moved."` |
| Button | `"Back to home"` |

## 2.13 Content types not present

| Content type | Status |
|---|---|
| Pricing / packages / tiers | Not available in current implementation. |
| Testimonials / client quotes | Not available in current implementation. |
| Named case studies (static) | Not available in current implementation. |
| Blog / articles / resources | Not available in current implementation. |
| Team member profiles | Not available in current implementation. |
| Guarantees or refund terms | Not available in current implementation. |
| Awards / certifications / partner badges | Not available in current implementation. |
| Aggregate performance metrics | Not available in current implementation. |

---

# 3. Website Pages Inventory

## 3.1 Home

| Field | Value |
|---|---|
| URL | `/` |
| Purpose (per content) | Introduces the diagnosis-first positioning, the three capabilities, and the working process; routes visitors to contact or portfolio |
| Sections | Hero · Trust strip + logos · Value proposition · Pillars · Before/After · Proof (conditional) · Recent work (conditional) · How we work · Brand line · Final CTA |
| Main messages | `"Most teams buy the tool first. We diagnose first."` · `"Most companies don't have a marketing problem. They have a systems problem."` · `"Three capabilities. One transformation partner."` |
| User actions | Book a strategy call → `/contact` · See our work → `/portfolio` · Open a pillar card → `/services/<pillar>` · Open a project → `/portfolio/:id` · Carousel navigation · WhatsApp · Language toggle |
| Related pages | `/contact`, `/portfolio`, `/services/ai-training`, `/services/digital-marketing`, `/services/software` |

## 3.2 About

| Field | Value |
|---|---|
| URL | `/about` |
| Purpose (per content) | States the company's origin, operating approach, and four stated values |
| Sections | Hero · Story (photo + 3 paragraphs) · Values (4 cards) · CTA |
| Main messages | `"Engineers who understand business."` · `"We started OmniflowAI to close a gap."` |
| User actions | Book a strategy call → `/contact` |
| Related pages | `/contact` |

## 3.3 Services

| Field | Value |
|---|---|
| URL | `/services` |
| Purpose (per content) | Presents three capability pillars as selectable panels and routes visitors by stated problem |
| Sections | Header · Pillar tabs + detail panel · Pain router |
| Main messages | `"Three capabilities. One transformation partner."` · `"Marketing that fills the pipeline, software that runs the business, and AI your team actually uses."` |
| User actions | Select a pillar tab (click or arrow keys) · Book a strategy call → `/contact` · Explore a pillar → `/portfolio?service=<pillar>` · Pain-router buttons (select a pillar and scroll to the panel, or go to `/contact`) |
| Related pages | `/contact`, `/portfolio` |

Note: the pillar tabs on this page do **not** link to the service detail pages. Service detail pages are reached from the homepage pillar cards and the footer.

## 3.4 Service Detail (×3)

| Field | Value |
|---|---|
| URLs | `/services/ai-training`, `/services/digital-marketing`, `/services/software` |
| Purpose (per content) | Presents one pillar in depth: description, inclusions, process, FAQ |
| Sections | Hero · Related projects (conditional) · What's included · How it works · Common questions · CTA |
| User actions | Pillar CTA → `/contact` · `"See examples"` → `/portfolio` · Open a related project → `/portfolio/:id` · `"← All services"` → `/services` |
| Related pages | `/contact`, `/portfolio`, `/services` |

Legacy URLs `/services/website-development`, `/services/automation`, and `/services/ai-agents` redirect to `/services/software`.

## 3.5 Portfolio

| Field | Value |
|---|---|
| URL | `/portfolio` (accepts `?service=<pillar>`) |
| Purpose (per content) | Displays all published projects with category filtering |
| Sections | Header · Deep-link banner (conditional) · Sticky filter tabs · Gallery grid / empty state |
| Main messages | `"Selected Work"` · `"A curation of digital infrastructure and growth systems engineered for market leaders."` |
| User actions | Filter by category · Clear a pillar deep-link filter · Open a project → `/portfolio/:id` |
| Related pages | `/portfolio/:id` |

## 3.6 Project Detail

| Field | Value |
|---|---|
| URL | `/portfolio/:id` |
| Purpose (per content) | Presents a single project as Problem → Diagnosis → System, with results, technologies, and imagery |
| Sections | Hero header (category, client, title, description, up to 4 result tiles) · Full-width image · Narrative blocks · Tech Stack sidebar with CTA |
| Main messages | Database-driven per project |
| User actions | `"Back to Portfolio"` → `/portfolio` · `"Start Your Project"` / `"Start a Project Like This"` → `/contact` |
| Related pages | `/portfolio`, `/contact` |

## 3.7 Contact

| Field | Value |
|---|---|
| URL | `/contact` |
| Purpose (per content) | Collects enquiries and displays direct contact details |
| Sections | Heading · Form · Contact-details card · Quick Response Guarantee card |
| Main messages | `"Let's talk"` · `"Tell us about your business and what's slowing it down. We'll tell you honestly if we can help."` |
| User actions | Complete and submit the form · Read contact details |
| Related pages | Reached from every public page |

## 3.8 Blog

**Not available in current implementation.** There is no blog route, page, component, or content model.

## 3.9 Admin pages

| Page | URL | Access | Function |
|---|---|---|---|
| Login | `/admin/auth` | Public | Username/password sign-in |
| Portfolio Management | `/admin/dashboard` | Authenticated | Create, edit, delete projects; upload images |
| Lead Management | `/admin/leads` | Authenticated | View, re-status, and delete leads |

Admin pages render their own shell — the public navigation, footer, and WhatsApp button are hidden. The admin interface is English-only.

---

# 4. User Journey Documentation

All journeys below are verifiable from navigation, links, buttons, and form handlers in the implementation.

## 4.1 Global navigation journeys

Available from every public page:

1. Header links → Home, Services, Portfolio, About, Contact
2. Header CTA `"Let's Talk"` → `/contact`
3. Logo → `/`
4. Language toggle → same page, opposite language, direction flips
5. Floating WhatsApp button → external WhatsApp conversation
6. Footer service links → the three service detail pages
7. Footer company links → About, Portfolio, Contact

## 4.2 Homepage journey

1. User lands on `/`
2. User sees the hero: headline, supporting text, two CTAs, and the interactive system map
3. User scrolls through: trust strip and logo marquee → value proposition → three pillar cards → Before/After comparison
4. If featured projects exist, user sees the Proof grid; if other projects exist, user sees the Recent work carousel
5. User sees the four-step process, the brand line, and the final CTA

Branch points from the homepage:

| User action | Result |
|---|---|
| `"Book a strategy call"` (hero) | → `/contact` |
| `"See our work"` (hero) | → `/portfolio` |
| Click a pillar card | → `/services/ai-training` \| `/services/digital-marketing` \| `/services/software` |
| Click a Proof or Recent work card | → `/portfolio/:id` |
| `"View all projects"` | → `/portfolio` |
| Brand-line CTA | → `/contact` |
| `"Book your strategy call"` (final CTA) | → `/contact` |

## 4.3 Service exploration journey

**Entry points:** header "Services" link · homepage pillar cards · footer service links · legacy service URLs (redirect)

**Path A — via `/services`:**
1. User lands on `/services`
2. User sees three pillar tabs; the AI Training panel is selected by default
3. User selects a tab (click, or Left/Right arrow keys when focused)
4. Panel updates with title, tagline, body, four numbered steps, two buttons
5. User scrolls to the pain router and selects a stated problem
6. Selecting a pain-router option changes the active pillar and scrolls back to the panel; selecting `"All of the above"` navigates to `/contact`
7. From the panel: `"Book a strategy call"` → `/contact`, or `"Explore <pillar>"` → `/portfolio?service=<pillar>`

**Path B — via a pillar card or footer link:**
1. User clicks a pillar card on `/` or a service link in the footer
2. User lands on `/services/<pillar>`
3. User reads: hero (title, subtitle, description) → related projects if any exist → `"What's included"` → `"How it works"` → `"Common questions"` → closing CTA
4. Available actions: pillar CTA → `/contact` · `"See examples"` → `/portfolio` · a related project card → `/portfolio/:id` · `"← All services"` → `/services`

## 4.4 Portfolio journey

**Entry points:** header "Portfolio" link · homepage `"See our work"` and `"View all projects"` · homepage project cards · service detail `"See examples"` and `"View Full Portfolio"` · Services page `"Explore <pillar>"` · footer `"Work"`

1. User lands on `/portfolio`
2. A loading skeleton displays while projects load
3. User sees the header and a sticky filter bar
4. **Filter tabs shown:** `"All"` plus one tab per category that at least one current project uses. Categories with no projects produce no tab.
5. **If arriving with `?service=<pillar>`:** a banner reads `"Showing"` + the pillar name, and results are limited to projects whose category rolls up to that pillar. `"View all work"` clears the filter.
6. User selects a filter tab → the grid re-queries and updates
7. If no projects match, the page shows `"No projects found in this category."`
8. User clicks a project card → `/portfolio/:id`

**On the project detail page:**
1. User sees the category badge, client name, title, description, and up to four result tiles
2. User sees the full-width project image
3. User reads `"The Problem"`, then `"The Diagnosis"` if that field is filled, then `"The System"`
4. User sees the `"Tech Stack"` sidebar
5. Available actions: `"Start Your Project"` (sidebar) or `"Start a Project Like This"` (mobile) → `/contact` · `"Back to Portfolio"` → `/portfolio`

## 4.5 Contact submission journey

**Entry points:** header link · header CTA `"Let's Talk"` · every page CTA · footer `"Contact"` · project detail CTAs · pain-router `"All of the above"`

1. User lands on `/contact`
2. User sees the heading, the form, the contact-details card, and the Quick Response Guarantee card
3. User completes: Name, Email, Phone (optional), Company (optional), service dropdown, Message
4. The service dropdown is pre-selected to `"Software"`
5. User clicks `"Send message"`
6. Client-side validation runs; failing fields display an inline message below the field
7. While the request is in flight, the button reads `"Sending…"` and is disabled
8. **On success:** a toast displays `"Message sent — we'll get back to you within 24 hours."` and the form resets to empty
9. **On failure:** a toast displays `"Something went wrong — please try again, or email us directly."` and the form retains the user's input

There is no redirect to a thank-you page and no page-level confirmation state — confirmation is the toast only.

## 4.6 Newsletter journey

1. User scrolls to the footer on any public page
2. **The newsletter block is visible on desktop only** — it is hidden at mobile widths
3. User sees the body copy, an email input (`"Enter your email"`), and a send-icon button
4. User enters an email and submits (button click or Enter)
5. Empty input: submission is skipped, nothing happens
6. During submission the button is disabled
7. **On success:** a toast displays `"Thanks — you're subscribed."` and the input clears
8. **On failure:** a toast displays `"Something went wrong, please try again."`

## 4.7 WhatsApp journey

1. A floating button is fixed to the lower-right corner of every public page
2. On hover the label `"Chat on WhatsApp"` appears
3. Clicking opens `https://wa.me/201119936014` in a new tab

## 4.8 Admin journey

1. Administrator navigates directly to `/admin/auth` (no public link points to it)
2. Administrator enters username and password, clicks `"Sign In"`
3. On success, a toast displays `"Welcome back!"` / `"You are now logged in."` and the browser redirects to `/admin/dashboard`
4. On failure, a toast displays `"Login failed"` with the returned message or `"Invalid username or password"`
5. From the dashboard, an in-app nav switches between `"Portfolio"` and `"Leads"`
6. Visiting `/admin/dashboard` or `/admin/leads` while signed out redirects to `/admin/auth`
7. `"Logout"` clears the session; a toast displays `"Logged out"` / `"See you next time."`

---

# 5. Service Presentation Structure

Three service detail pages, all content drawn from the shared dictionary.

## 5.1 Software

| Field | Value |
|---|---|
| Service name | `"Software"` |
| Page URL | `/services/software` |
| Headline | `"Software that becomes your operational backbone"` |
| Subtitle & description (same string, shown twice) | `"ERP and CRM platforms, customer-facing web, mobile apps, and the automation that connects them — designed to own, integrate, and scale."` |
| Primary CTA | `"Build your system"` |

**Features displayed** — this is the only pillar with feature descriptions:

| Feature | Description |
|---|---|
| `"Business Systems (ERP / CRM)"` | `"Custom platforms that centralize your sales, operations, and customer data into one source of truth. Built on proven frameworks, shaped to how your business actually runs."` |
| `"Web Platforms"` | `"High-performance websites and web apps engineered for conversion and speed — connected to your systems from day one, not bolted on later."` |
| `"Mobile Apps"` | `"Customer-facing and internal apps built for real-world use and scale, integrated with the same backend as everything else."` |
| `"Automation & AI"` | `"Workflow automation and AI integrations that remove manual work — lead routing, data sync, follow-ups, and the repetitive tasks eating your team's time."` |

**Process steps** (five)

| # | Title | Description |
|---|---|---|
| 01 | `"Discovery"` | `"We learn your business, goals, and technical requirements."` |
| 02 | `"Proposal"` | `"Clear scope, timeline, and a fixed price."` |
| 03 | `"Design"` | `"Wireframes and visual design — you approve before we build."` |
| 04 | `"Build"` | `"We build and integrate, with weekly reviews. No surprises."` |
| 05 | `"Launch"` | `"Tested, live, and handed over — full ownership transferred."` |

**FAQ items** (four)

| Question | Answer |
|---|---|
| `"Do we own the code?"` | `"Yes. Full source code and IP transfer on completion. No lock-in, no fees to access your own system."` |
| `"Can it integrate with our existing tools?"` | `"That's the point. We connect to your CRM, ERP, and existing stack from day one."` |
| `"How long does a build take?"` | `"Depends on scope — we give you a specific timeline in the proposal, not a vague range."` |
| `"What if we already have a system?"` | `"We rebuild or extend what you have, whichever actually makes sense for your situation."` |

**Related content:** projects in the `business-systems`, `web`, `mobile`, or `automation` categories.

## 5.2 Digital Marketing

| Field | Value |
|---|---|
| Service name | `"Digital Marketing"` |
| Page URL | `/services/digital-marketing` |
| Headline | `"Marketing built as an acquisition system"` |
| Subtitle & description | `"SEO, paid campaigns, and conversion strategy wired into one measurable engine that brings in qualified buyers — not vanity traffic."` |
| Primary CTA | `"Scale your acquisition"` |

**Features displayed** — titles only; no descriptions are defined for this pillar, and the page renders nothing where a description would sit:

- `"Paid campaigns (Google / Meta / LinkedIn)"`
- `"Buyer-intent SEO"`
- `"Conversion-rate optimization"`
- `"Funnel strategy & tracking"`

**Process steps** (four)

| # | Title | Description |
|---|---|---|
| 01 | `"Audit"` | `"We review your funnel, channels, and competitors."` |
| 02 | `"Strategy"` | `"A clear plan — channels, offers, and what we'll test."` |
| 03 | `"Setup"` | `"Tracking, campaigns, and landing pages built and launched."` |
| 04 | `"Optimize"` | `"Continuous testing against real performance data."` |

**FAQ items** (three)

| Question | Answer |
|---|---|
| `"What's the minimum to make this work?"` | `"We're honest about fit — we're upfront about whether the budget justifies the work, and we'll tell you before you commit."` |
| `"How fast do results come?"` | `"Paid moves in weeks; SEO is a few months for meaningful traffic. We set realistic expectations before we start."` |
| `"Do you guarantee results?"` | `"We guarantee our work and our process, not market conditions. Targets are agreed upfront and we're accountable to them."` |

**Related content:** projects in the `digital-marketing` category.

## 5.3 AI Training

| Field | Value |
|---|---|
| Service name | `"AI Training"` |
| Page URL | `/services/ai-training` |
| Headline | `"AI training that turns tools into capability"` |
| Subtitle & description | `"Structured AI adoption programs for teams and leadership — built to leave your people using AI on real work, not just aware of it."` |
| Primary CTA | `"Start your AI program"` |

**Features displayed** — titles only; no descriptions defined:

- `"Executive AI strategy sessions"`
- `"Department-level adoption programs"`
- `"Hands-on workflow integration workshops"`
- `"Implementation support"`

**Process steps** (four)

| # | Title | Description |
|---|---|---|
| 01 | `"Assess"` | `"We map your team's workflows and where AI actually helps."` |
| 02 | `"Design"` | `"A program built around your tools and real tasks."` |
| 03 | `"Train"` | `"Hands-on sessions for leadership and teams."` |
| 04 | `"Embed"` | `"Documented workflows your team keeps and reuses."` |

**FAQ items** (three)

| Question | Answer |
|---|---|
| `"Is this generic AI training?"` | `"No. Programs are built around your actual workflows and tools, not a stock curriculum."` |
| `"Who is it for?"` | `"Leadership and teams — we run both strategy-level and hands-on tracks."` |
| `"What do we walk away with?"` | `"People who use AI on real work, plus documented workflows your team keeps."` |

**Related content:** projects in the `ai-training` category.

## 5.4 Cross-service notes

- The Services overview page uses a **different, shorter** set of copy for the same three pillars (see §2.5). The two sets do not share strings.
- Pricing for any service: **Not available in current implementation.**
- Engagement duration or delivery timelines beyond the FAQ answers above: **Not available in current implementation.**

---

# 6. Portfolio Experience

## 6.1 Portfolio page

**Structure:** Header → optional pillar banner → sticky filter bar → gallery grid (or empty state, or loading skeleton).

**Categories available as filters:**

| Slug | Display label | Rolls up to pillar |
|---|---|---|
| `business-systems` | `"Business Systems"` | Software |
| `web` | `"Web"` | Software |
| `mobile` | `"Mobile"` | Software |
| `automation` | `"Automation & AI"` | Software |
| `digital-marketing` | `"Digital Marketing"` | Digital Marketing |
| `ai-training` | `"AI Training"` | AI Training |

Filter tabs render in the order above, preceded by `"All"`. **A tab appears only if at least one current project uses that category.**

**Project card — displayed fields:**

| Element | Source |
|---|---|
| Image | Project image |
| Title | Project title |
| Category badge | Category label |
| Client name | Project client field |
| Tags | Free-text tags, shown as chips; omitted when the list is empty |
| Hover indicator | An arrow icon; no text |

## 6.2 Project detail pages

**Displayed fields, in render order:**

| Field | Behaviour |
|---|---|
| Category | Badge, translated label |
| Client | Text, beside the badge |
| Title | Page H1 |
| Description | Below the title |
| Results / metrics | Up to the first four entries, shown as stat tiles. Free-text strings entered per project |
| Image | Full-width, below the header |
| Problem | Section `"The Problem"` — always shown |
| Diagnosis | Section `"The Diagnosis"` — **shown only when the field is filled**; the section is omitted entirely when empty |
| System | Section `"The System"` — always shown |
| Technologies | Sidebar under `"Tech Stack"`, rendered as badges |
| CTA | `"Start Your Project"` (sidebar) and `"Start a Project Like This"` (mobile) |

**Fields in the content model but not displayed on this page:** the "Featured" and "Showcase" visibility flags, and the tags list (tags appear on portfolio cards only).

**Media:** one image per project. There is no gallery, video, or multi-image support. **Not available in current implementation.**

## 6.3 Current portfolio content

The repository ships with an empty projects table and no seed data. Actual project titles, clients, descriptions, results, and images are entered through the admin CMS at runtime.

Live project content: **Not available in current implementation.**

When no projects exist:
- The homepage Proof and Recent work sections do not render at all
- The Portfolio page shows `"No projects found in this category."`
- Service detail pages omit the `"Proven Results"` section

---

# 7. Lead Generation Flow

## 7.1 Contact form

| Field | Value |
|---|---|
| Location | `/contact`, left column |
| Endpoint | `POST /api/contact` |
| Storage | Lead record with `source: "contact"` |

**Fields and validation:**

| Field | Required | Validation rule | Error message shown |
|---|---|---|---|
| Name | Yes | Minimum 2 characters | `"Name must be at least 2 characters"` |
| Email | Yes | Valid email format | `"Invalid email address"` |
| Phone | No | None | — |
| Company | No | None | — |
| Service | Yes | Must be one of: AI Training, Digital Marketing, Software, Other | — (dropdown, pre-selected to Software) |
| Message | Yes | Minimum 10 characters | `"Message must be at least 10 characters"` |

The same validation rules run on the client and again on the server.

**Submission flow:**
1. Client validation → inline field errors on failure
2. Button label changes to `"Sending…"` and disables
3. Server validates; invalid data returns a 400 with `"Invalid form data."`
4. Valid data is written to the leads table
5. If an email API key is configured, a notification email is sent to the configured address — this happens after the response and cannot delay or fail the submission
6. If the database write fails, the server returns a 500 with `"Could not submit right now. Please try again."`

**Confirmation behaviour:** a toast notification only. Success: `"Message sent — we'll get back to you within 24 hours."` The form clears. Failure: `"Something went wrong — please try again, or email us directly."` The form retains input. No redirect and no thank-you page.

## 7.2 Newsletter

| Field | Value |
|---|---|
| Location | Footer, fourth column — **desktop breakpoints only** (hidden on mobile) |
| Endpoint | `POST /api/subscribe` |
| Storage | Lead record with `source: "newsletter"` |

**Fields:** one email input, placeholder `"Enter your email"`. Required.

**Validation:** valid email format, checked server-side. Invalid input returns `"Invalid email."` An empty input is ignored client-side without a request.

**Submission flow:** submit → button disables → record created with the email and source only (name, service, and message are stored as empty) → same optional notification email as the contact form.

**Confirmation behaviour:** toast only. Success: `"Thanks — you're subscribed."` and the input clears. Failure: `"Something went wrong, please try again."`

## 7.3 Direct contact channels

| Channel | Value | Placement |
|---|---|---|
| Email | `contact@omniflowai.net` | Contact page sidebar, footer |
| WhatsApp | `+20 111 993 6014` (`wa.me/201119936014`) | Floating button, all public pages |
| Phone | `"Available on request"` | Contact page sidebar |
| Physical address | `" Wilmington, DE, USA"` | Footer |

## 7.4 Lead capture summary

Both mechanisms write to the same table and appear in one admin inbox, distinguished by source. There are no other lead-capture forms, popups, exit-intent modals, gated downloads, or chat widgets. **Not available in current implementation.**

---

# 8. Admin Capabilities

## 8.1 Authentication

| Aspect | Detail |
|---|---|
| URL | `/admin/auth` |
| Fields | `"Username"` (placeholder `"Enter your username"`), `"Password"` (placeholder `"Enter your password"`) |
| Validation | `"Username is required"`, `"Password is required"` |
| Button | `"Sign In"` |
| Page copy | `"OmniflowCMS"` · `"Content Management System"` · `"Welcome Back"` · `"Sign in to access your dashboard"` · `"Protected area. Authorized personnel only."` |
| Account model | A single account, username `admin`, seeded on server start |
| Roles / permissions | **Not available in current implementation.** There is no role field; any signed-in user has full access |
| Self-registration / password reset | **Not available in current implementation.** |
| Session | Persists for 24 hours; survives server restarts |

Protected routes redirect signed-out visitors to the login page. Server-side authentication guards every write operation and all lead endpoints.

## 8.2 Portfolio management

**URL:** `/admin/dashboard` · **Page heading:** `"Portfolio"` · **Add button:** `"Add Project"`

**Project list:** cards showing image, title, client, and — when set — a `"Featured"` badge and a `"Showcase"` badge. Each card has `"Edit"` and a delete icon.

**Create / edit dialog** — title `"Create New Project"` or `"Edit Project"`:

| Field | Label | Notes |
|---|---|---|
| Featured toggle | `"Featured"` — `"Show on Home Page \"Recent Work\""` | Controls homepage Proof section placement |
| Showcase toggle | `"Showcase"` — `"The main hero project on Services page (Max 1 per category)"` | Enforced as one per category by the server |
| Title | `"Project Title"` (placeholder `"Luxury Website"`) | Required |
| Client | `"Client Name"` (placeholder `"Client Co."`) | Required |
| Category | `"Category"` (placeholder `"Select category"`) | Dropdown of the six categories |
| Image | `"Image"` | Upload component |
| Description | `"Short Description"` | Required |
| Problem | `"Problem"` | Required |
| Diagnosis | `"Diagnosis — what you found when you looked (the root cause). Optional."` | Optional; omitted from the public page when empty |
| System | `"System — what you built"` | Required |
| Results | `"Outcome — real results (one per line)"` | One entry per line |
| Technologies | `"Technologies (one per line)"` | One entry per line |
| Tags | `"Tags (optional) — type and press Enter to add"` (placeholder `"e.g. ERP, Lead Gen, RAG chatbot"`) | Chip input; Enter or comma adds, Backspace removes the last, × removes one |

**Buttons:** `"Cancel"` · `"Save Project"` (while saving: `"Saving..."`)

**Delete confirmation:** `"Are you sure?"` / `"This will permanently delete this project."` / `"Cancel"` / `"Delete"`

**Toasts:** `"Project added to portfolio"` · `"Project details updated successfully"` · `"Project removed from portfolio"`

## 8.3 Media management

The image field uses a click-to-upload component.

| Element | Copy / behaviour |
|---|---|
| Empty state | `"Click to upload image"` / `"Max 4MB (JPG, PNG, WebP)"` |
| Uploading state | `"Compressing & Saving..."` |
| Preview state | Thumbnail with `"Change"` and a remove button on hover |
| Size limit | 4 MB enforced in the browser; 5 MB on the server |
| Accepted formats | PNG, JPEG, JPG, WebP |
| Processing | Images are resized and re-encoded automatically on upload |
| Oversize error | `"File too large"` / `"Please upload an image smaller than 4MB."` |
| Upload error | `"Upload Failed"` / `"Network error. Try a smaller image or use a URL."` or the server's message |
| Success | `"Success"` / `"Image uploaded and saved."` |

There is no media library, reuse, or bulk upload. **Not available in current implementation.**

## 8.4 Lead management

**URL:** `/admin/leads` · **Page heading:** `"Leads"` · Total count displayed as `"<n> total"`

**Displayed per lead:** name (or the email address when a name is absent), source badge (`"contact"` or `"newsletter"`), status badge, service (when present), email as a mailto link, phone and company when present, the message, and the submission timestamp.

**Available actions:**

| Action | Detail |
|---|---|
| Change status | Dropdown: `"New"` · `"Read"` · `"Archived"` |
| Expand message | `"Show more"` / `"Show less"` for messages over 140 characters |
| Delete | Confirmation dialog: `"Delete this lead?"` / `"This permanently removes the submission."` / `"Cancel"` / `"Delete"` |
| Email the lead | Click the address to open a mail client |

**Ordering:** newest first. **Empty state:** `"No leads yet."` / `"Submissions from the contact form will appear here."`

**Toasts:** `"Deleted"` / `"Lead removed."`

Search, filtering, sorting, export, notes, and assignment: **Not available in current implementation.**

## 8.5 Content management scope

The admin CMS manages **projects and leads only**. All marketing copy — every headline, body paragraph, feature, process step, FAQ, CTA, and label documented in §2 and §5 — lives in the codebase and requires a code change and deployment to edit. There is no CMS for page copy, no blog editor, no media library, and no settings screen.

---

# 9. Technical Evidence Reference

| Documented feature | Where it is implemented |
|---|---|
| All public copy, EN + AR | `client/src/lib/i18n.tsx` (296 keys per language) |
| Pillar and category names, contact email, social links | `shared/taxonomy.ts` |
| Routes, redirects, admin chrome suppression, WhatsApp button | `client/src/App.tsx` |
| Homepage sections | `client/src/pages/Home.tsx` |
| Hero interactive system map | `client/src/components/systems/InteractiveSystemMap.tsx` |
| Services pillar tabs and pain router | `client/src/pages/Services.tsx` |
| Service detail pages and related projects | `client/src/pages/ServiceDetail.tsx` |
| Portfolio grid, filters, pillar deep link | `client/src/pages/Portfolio.tsx` |
| Project detail narrative | `client/src/pages/ProjectDetail.tsx` |
| Contact form | `client/src/pages/Contact.tsx` |
| About page | `client/src/pages/About.tsx` |
| Footer and newsletter form | `client/src/components/Footer.tsx` |
| Header navigation and language toggle | `client/src/components/Navigation.tsx` |
| SEO title, meta, OG, Twitter, fonts | `client/index.html` |
| Per-page tab titles | `client/src/hooks/use-document-title.ts` |
| Project and lead content models | `shared/schema.ts` (`projects`, `leads`, `users`) |
| Form validation rules | `shared/schema.ts` (`contactFormSchema`, `newsletterSchema`) |
| Contact submission | `POST /api/contact` — `server/routes.ts` |
| Newsletter submission | `POST /api/subscribe` — `server/routes.ts` |
| Project read endpoints | `GET /api/projects`, `GET /api/projects/:id` — `server/routes.ts` |
| Project write endpoints | `POST` / `PATCH` / `DELETE /api/projects` — `server/routes.ts` |
| Lead endpoints | `GET` / `PATCH` / `DELETE /api/leads` — `server/routes.ts` |
| Image upload | `POST /api/objects/upload` — `server/routes.ts`, `server/objectStorage.ts` |
| Authentication and session | `server/routes.ts`; client gate `client/src/components/ProtectedRoute.tsx` |
| All database access | `server/storage.ts` |
| Admin screens | `client/src/pages/admin/Auth.tsx`, `Dashboard.tsx`, `Leads.tsx` |
| Image upload component | `client/src/components/ObjectUploader.tsx` |
| Analytics | `client/src/lib/analytics.ts` (Google Analytics 4, active only when configured) |

---

# 10. Website Structure Summary

```
Home  /
|
Hero
|  "Most teams buy the tool first." + "We diagnose first." + supporting text
|  → Book a strategy call (/contact) · See our work (/portfolio)
|
Trust strip + client logos
|  "Trusted by brands across the US, the GCC & Egypt" + 3 stats + 8 countries + 32 logos
|  → (no actions)
|
Value proposition
|  "Most companies don't have a marketing problem. They have a systems problem."
|  → (no actions)
|
Pillars
|  "Three capabilities. One transformation partner." + 3 capability cards
|  → /services/ai-training · /services/digital-marketing · /services/software
|
Before / After
|  "From scattered tools to one connected system" + 4 pairs
|  → (no actions)
|
Proof (only if featured projects exist)
|  "Measured by outcomes, not deliverables" + project cards
|  → /portfolio/:id
|
Recent work (only if other projects exist)
|  "Recent work" + carousel
|  → /portfolio/:id · /portfolio
|
How we work
|  "How we work" + Diagnose · Design · Build · Optimize
|  → (no actions)
|
Brand line
|  "We don't hand over deliverables and walk away…"
|  → Book a strategy call (/contact)
|
Final CTA
|  "Ready to transform how your business runs?"
|  → Book your strategy call (/contact)


Services  /services
|
Header · Pillar tabs · Detail panel · Pain router
|  "Three capabilities. One transformation partner." + selected pillar content
|  → Select pillar tab · /contact · /portfolio?service=<pillar> · pain-router selection


Service Detail  /services/{ai-training | digital-marketing | software}
|
Hero · Related projects (conditional) · What's included · How it works · Common questions · CTA
|  Pillar headline + description + features + process + FAQ
|  → /contact · /portfolio · /portfolio/:id · /services


Portfolio  /portfolio  (accepts ?service=<pillar>)
|
Header · Pillar banner (conditional) · Filter tabs · Gallery grid
|  "Selected Work" + project cards (image, title, category, client, tags)
|  → Filter by category · Clear pillar filter · /portfolio/:id


Project Detail  /portfolio/:id
|
Hero header · Image · Problem → Diagnosis → System · Tech Stack sidebar
|  Project title, client, description, up to 4 results, technologies
|  → /contact · /portfolio


About  /about
|
Hero · Story · Values · CTA
|  "Engineers who understand business." + origin narrative + 4 values
|  → Book a strategy call (/contact)


Contact  /contact
|
Heading · Form · Contact details · Quick Response Guarantee
|  "Let's talk" + 6 fields + email, phone, response time
|  → Submit form (toast confirmation)


Footer  (all public pages)
|
Brand · Services · Company · Stay Connected
|  Tagline + 3 service links + 3 company links + newsletter (desktop only) + email + location
|  → /services/* · /about · /portfolio · /contact · Subscribe


Global chrome  (all public pages)
|
Header nav · Language toggle · WhatsApp button
|  Home · Services · Portfolio · About · Contact · "Let's Talk"
|  → any public route · EN ⇄ AR · WhatsApp


Admin  /admin/*
|
/admin/auth      → Sign in
/admin/dashboard → Create, edit, delete projects; upload images
/admin/leads     → View, re-status, delete leads
```

---

**End of document.**
