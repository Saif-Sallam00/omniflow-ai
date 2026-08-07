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
    "nav.services": "Solutions",
    "nav.portfolio": "Portfolio",
    "nav.about": "About",
    "nav.contact": "Contact",
    // NOTE: nav.cta ("Let's Talk") removed — the header CTA now reads
    // common.cta.bookCall like every other CTA on the site, so the one primary
    // CTA label (§0.10) exists in exactly one place and cannot drift.

    // --- COMMON ---
    "common.cta.bookCall": "Book a strategy call",
    "common.brandLine":
      "We don't hand over deliverables and walk away. We build systems that keep working after we're gone.",
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
    // Solution names are product names — identical in both languages.
    "serviceOpt.foundation": "Foundation",
    "serviceOpt.growth-engine": "Growth Engine",
    "serviceOpt.scale-infrastructure": "Scale Infrastructure",
    "serviceOpt.custom": "Custom Transformation",
    "serviceOpt.not-sure": "Not sure yet",

    // --- PILLARS (shared by Home + Services) ---
    "pillars.aiTraining.title": "AI Enablement",
    "pillars.aiTraining.body":
      "We run structured AI adoption programs for teams and leadership — from executive strategy sessions to hands-on workflow integration. The goal isn't awareness, it's operational capability: your people using AI on real work, not watching a demo.",
    "pillars.digitalMarketing.title": "Marketing Systems",
    "pillars.digitalMarketing.body":
      "SEO, paid campaigns, and conversion strategy wired into one engine that targets qualified buyers — not vanity traffic. Every stage is tracked, so you know what a lead actually costs and where revenue comes from.",
    "pillars.software.title": "Business Technology",
    "pillars.software.body":
      "The systems your business runs on — ERP and CRM platforms, customer-facing web, mobile apps, and the automation that connects them. Built to own, integrate, and scale, not to rent.",
    "pillars.software.subcaps":
      "Business Systems (ERP/CRM) · Web Platforms · Mobile Apps · Automation & AI",

    // --- HERO SYSTEM MAP (interactive; real capability labels) ---
    "systemMap.center": "Business System",
    "systemMap.node.aiTraining": "AI Enablement",
    "systemMap.node.marketing": "Marketing Systems",
    "systemMap.node.software": "Business Technology",
    "systemMap.node.automation": "Automation",
    "systemMap.node.crm": "CRM",
    "systemMap.node.strategy": "Strategy",
    "systemMap.aria":
      "A connected business system: AI enablement, marketing systems, business technology, automation, CRM and strategy all connecting into one central system.",

    // --- HOME ---
    "home.hero.h1.lead": "Most teams buy the tool first.",
    "home.hero.h1.highlight": "We diagnose first.",
    "home.hero.sub":
      "AI, marketing, software, automation — we only build what the diagnosis supports. We look before we touch, so what we build fits how your business actually runs.",
    "home.hero.cta2": "See our work",
    "home.trustEyebrow": "Trusted partners",
    "home.trust": "Trusted by teams shaping the future.",
    "home.reach.headline": "Trusted by brands across the US, the GCC & Egypt",
    "home.reach.stat1.value": "50+",
    "home.reach.stat1.label": "Projects delivered",
    "home.reach.stat2.value": "8",
    "home.reach.stat2.label": "Countries",
    "home.reach.stat3.value": "Full GCC coverage",
    "home.reach.stat3.label": "+ US & Egypt",
    "home.reach.countries":
      "Egypt · Saudi Arabia · UAE · Qatar · Kuwait · Bahrain · Oman · United States",
    "home.valueProp.title.lead":
      "Most companies don't have a marketing problem.",
    "home.valueProp.title.highlight": "They have a systems problem.",
    "home.valueProp.body":
      "Disconnected tools, manual handoffs, and no clear line of sight from a lead to a closed deal. We connect the whole chain — how you acquire customers, how you convert them, and how you operate once they're in — so the parts work as one system you can actually measure.",
    "home.pillars.title": "Three capabilities. One transformation partner.",
    "home.transform.title": "From scattered tools to one connected system",
    "home.transform.before.label": "Before",
    "home.transform.after.label": "After",
    "home.transform.before.1": "Tools that don't talk to each other",
    "home.transform.before.2": "Marketing disconnected from operations",
    "home.transform.before.3": "Manual work slowing everything down",
    "home.transform.before.4": "No clear view of what's actually working",
    "home.transform.after.1": "One integrated business system",
    "home.transform.after.2":
      "Acquisition, conversion, and operations connected",
    "home.transform.after.3": "Automated workflows across the business",
    "home.transform.after.4": "Real-time visibility into performance",
    "home.proof.title": "Measured by outcomes, not deliverables",
    "home.proof.body":
      "Every engagement is tied to something your business can feel — revenue, efficiency, acquisition cost, scale. Here's the work behind that.",
    "home.recent.title": "Recent work",
    "home.recent.sub": "A look at the systems we've built.",
    "home.how.title": "How we work",
    "home.how.diagnose.title": "Diagnose",
    "home.how.diagnose.desc":
      "We map your business model, systems, and the bottlenecks slowing growth.",
    "home.how.design.title": "Design",
    "home.how.design.desc":
      "We design the right mix of software, marketing, and automation for how you actually operate.",
    "home.how.build.title": "Build",
    "home.how.build.desc":
      "We develop and integrate the system, and hand you full ownership.",
    "home.how.optimize.title": "Optimize",
    "home.how.optimize.desc":
      "We keep improving it against real business data.",
    "home.finalCta.title": "Ready to transform how your business runs?",
    "home.finalCta.body":
      "Book a strategy call. We'll look at your current systems and show you exactly what's blocking growth — even if you don't work with us.",
    "home.finalCta.button": "Book your strategy call",
    "home.finalCta.sub": "No sales pitch. Just clarity.",

    // =========================================================================
    // --- SERVICES --- @deprecated (Phase 1 — Solutions cutover)
    //
    // Superseded by the `solutions.*` prefix above. This whole block — from
    // "services.eyebrow" down to "services.painRouter.all" — is dead copy from
    // the old three-capability Services page and must not be referenced by any
    // new component.
    //
    // NOT deleted yet, deliberately: it stays through this deploy so the old
    // page can be restored if /services has to be rolled back.
    //
    // Removal condition (ticketed in THIS phase, not "later" — spec §7.1):
    //   1. /services live and verified in both EN and AR, and
    //   2. `grep -rn "t(['\"\`]services\." client/src` returns zero hits.
    // When both hold, delete this block in both dictionaries in one commit.
    //
    // Note: several keys here (services.learnMore, services.featuredProject,
    // services.viewCaseStudy, services.together.*, services.cta.*) were already
    // orphaned before this phase — no component has referenced them for some
    // time. They go out with the rest of the block.
    // =========================================================================
    "services.eyebrow": "What we do",
    "services.title.lead": "Three capabilities.",
    "services.title.highlight": "One transformation partner.",
    "services.learnMore": "Learn more",
    "services.featuredProject": "Featured Project",
    "services.viewCaseStudy": "View Case Study",
    "services.together.title": "Better together",
    "services.together.sub":
      "Each capability works on its own. Together they compound — your software captures the data, your marketing fills the pipeline, your automation runs it, and your team knows how to drive all of it.",
    "services.together.capture.title": "Capture",
    "services.together.capture.desc":
      "Your website captures leads and collects the data you need to qualify them.",
    "services.together.attract.title": "Attract",
    "services.together.attract.desc":
      "Marketing drives the right people to your site—decision-makers, not tire-kickers.",
    "services.together.automate.title": "Automate",
    "services.together.automate.desc":
      "Automation qualifies leads, books meetings, and syncs everything to your CRM.",
    "services.cta.title": "Not sure what you need?",
    "services.cta.body":
      "Book a free call. We'll look at your current setup and tell you exactly what would move the needle—even if it's not something we do.",
    "services.cta.button": "Book a free strategy call",

    // --- SERVICES PAGE: selectable pillar panels ---
    // "Marketing" here is a LOCAL display label for the digital-marketing pillar;
    // the canonical taxonomy label ("Digital Marketing") is unchanged.
    "services.subhead":
      "Marketing that fills the pipeline, software that runs the business, and AI your team actually uses.",
    "services.explore": "Explore",

    "services.pillar.aiTraining.label": "AI Training",
    "services.pillar.aiTraining.title": "AI Training",
    "services.pillar.aiTraining.tagline":
      "For teams using AI ad hoc — or not at all.",
    "services.pillar.aiTraining.body":
      "We turn AI from scattered experiments into repeatable team capability.",
    "services.pillar.aiTraining.step.1": "Assess",
    "services.pillar.aiTraining.step.2": "Locate",
    "services.pillar.aiTraining.step.3": "Train",
    "services.pillar.aiTraining.step.4": "Embed",

    "services.pillar.marketing.label": "Marketing",
    "services.pillar.marketing.title": "Marketing",
    "services.pillar.marketing.tagline":
      "For pipelines running on referrals and word of mouth.",
    "services.pillar.marketing.body":
      "We turn scattered campaigns into one acquisition system that brings in qualified buyers.",
    "services.pillar.marketing.step.1": "Audit",
    "services.pillar.marketing.step.2": "Target",
    "services.pillar.marketing.step.3": "Launch",
    "services.pillar.marketing.step.4": "Measure",

    "services.pillar.software.label": "Software",
    "services.pillar.software.title": "Software",
    "services.pillar.software.tagline":
      "For teams running the business on spreadsheets and disconnected tools.",
    "services.pillar.software.body":
      "We turn manual workarounds into systems you own, integrate, and scale.",
    "services.pillar.software.step.1": "Map",
    "services.pillar.software.step.2": "Design",
    "services.pillar.software.step.3": "Build",
    "services.pillar.software.step.4": "Integrate",

    "services.painRouter.title": "Not sure which one fits?",
    "services.painRouter.leads": "More qualified leads",
    "services.painRouter.ops": "Messy operations & tools",
    "services.painRouter.aiAdoption": "Team AI adoption",
    "services.painRouter.all": "All of the above",
    // --- END deprecated services.* block ---

    // =========================================================================
    // --- SOLUTIONS PAGE (/services) — Phase 1 ---
    // Spec: docs/PHASE-1-SOLUTIONS-PAGE-SPEC-v2.md §2, as amended by §12 (v2.1).
    // Where §12 revises a §2 string, the §12 wording is the one that lives here.
    // Solution names (Foundation / Growth Engine / Scale Infrastructure /
    // Custom Transformation) are product names: identical in both languages and
    // rendered inside dir="ltr" so they never reorder inside an Arabic sentence.
    // =========================================================================

    // Hero
    "solutions.eyebrow": "Solutions",
    "solutions.h1.lead": "Build the systems behind",
    "solutions.h1.accent": "your next stage of growth.",
    "solutions.subhead":
      "Your business already works. What it needs now is the infrastructure to scale. We find what's blocking growth, then build the marketing, technology, and AI systems that remove it.",
    "solutions.hero.secondary": "Find your constraint",

    // Hero visual — the Business Diagnostic (components/systems/
    // BusinessDiagnostic.tsx). §12.5 mandates a hero visual but defines no copy
    // for it. Seven growth SIGNALS in the language a CEO would use, grouped
    // onto three ROOT CONSTRAINTS. Deliberately a different axis from the five
    // §2.2 pains below it — those are symptoms stated plainly, these are
    // signals traced to a cause — so the page never says the same thing twice.
    // The three systems built from the constraints are NOT keyed here: they
    // read from solutions.work.*.title, so the capability names are spelled
    // out in exactly one place site-wide.
    // {s} = signal count, {c} = constraint count, {n} = signals in the
    // selected group. All are substituted from the component's data, so a
    // figure here can never drift from what is on screen.
    "solutions.diag.title": "Business diagnosis",
    "solutions.diag.systemTitle": "Growth operating system",
    "solutions.diag.summary": "{s} signals · {c} root constraints",
    "solutions.diag.rootLabel": "Root constraint",
    "solutions.diag.hint":
      "Select any signal to reveal what it's really connected to.",
    "solutions.diag.trace": "{n} of {s} signals trace to this constraint",
    "solutions.diag.buildLabel": "We build",
    "solutions.diag.showSystem": "Show the system",
    "solutions.diag.showSignals": "Back to the signals",
    "solutions.diag.strategyLabel": "Strategy",
    "solutions.diag.strategyBody":
      "The business diagnosis decides which of the three you need, and in what order.",
    "solutions.diag.thesis":
      "Most growth problems are symptoms of one missing system.",

    // Each signal carries two strings: `label` is the map chip (short enough
    // to stay one or two lines inside a node), `text` is the full statement,
    // which becomes the chip's accessible name so screen readers get the
    // business meaning rather than a two-word fragment.
    "solutions.diag.s1.label": "Inconsistent growth",
    "solutions.diag.s1.text": "Growth is inconsistent, not compounding.",
    "solutions.diag.s2.label": "Untraceable spend",
    "solutions.diag.s2.text": "Spend can't be traced to revenue.",
    "solutions.diag.s3.label": "Handoff delays",
    "solutions.diag.s3.text": "Work stalls at every handoff.",
    "solutions.diag.s4.label": "Manual reporting",
    "solutions.diag.s4.text": "Every report is rebuilt by hand.",
    "solutions.diag.s5.label": "Founder-dependent decisions",
    "solutions.diag.s5.text": "Decisions route through a few people.",
    "solutions.diag.s6.label": "Headcount-bound capacity",
    "solutions.diag.s6.text": "More volume still means more headcount.",
    "solutions.diag.s7.label": "Stalled AI adoption",
    "solutions.diag.s7.text": "AI is discussed, never operational.",

    "solutions.diag.c1.name": "Demand isn't a system.",
    "solutions.diag.c1.impact":
      "Revenue depends on effort, so it can't be forecast or compounded.",
    "solutions.diag.c2.name": "The business runs on people, not systems.",
    "solutions.diag.c2.impact":
      "Every process needs a person inside it, so complexity grows faster than output.",
    "solutions.diag.c3.name": "Capacity only scales by hiring.",
    "solutions.diag.c3.impact":
      "Output is capped by headcount — the slowest and most expensive way to grow.",

    // NOTE: solutions.trust.*, solutions.problem.* and solutions.shift.* were
    // removed with the trust strip and the problem-recognition section. Both
    // restated the homepage (home.reach.*, home.valueProp.*, home.transform.*)
    // rather than adding anything the Solutions page needed. The homepage keys
    // they duplicated are untouched and still in use there.

    // Diagnostic router
    "solutions.router.eyebrow": "Business diagnostic",
    "solutions.router.heading": "Find your growth constraint.",
    "solutions.router.sub":
      "Pick what sounds closest to your business. We'll point you to the right starting point.",
    "solutions.router.q1": "We have customers, but growth is inconsistent.",
    "solutions.router.q2":
      "Our growth depends on adding more people instead of better systems.",
    "solutions.router.q3": "We have tools, but nothing is connected.",
    "solutions.router.q4": "We know AI matters but don't know where to start.",
    "solutions.router.q5": "We're not sure what's actually broken.",
    "solutions.router.q6":
      "We have a unique challenge that needs a tailored approach.",
    "solutions.router.resultLabel": "Recommended starting point",
    "solutions.router.r1":
      "Your acquisition needs to become a system before more technology gets built on top of it.",
    "solutions.router.r2":
      "Headcount-driven growth is an infrastructure limit. The systems have to carry that load instead.",
    "solutions.router.r3":
      "Disconnected tools is an infrastructure problem, not a marketing one.",
    "solutions.router.r4":
      "Start by finding where AI actually pays off inside your workflows.",
    "solutions.router.r5":
      "That's exactly what the diagnosis is for. Nobody should build before that answer exists.",
    "solutions.router.r6":
      "Then the answer is a system designed around your constraints, not a predefined scope.",
    "solutions.router.unsure":
      "Rather just talk it through? Book a strategy call.",

    // Solutions — section frame
    "solutions.grid.heading":
      "Three ways in. One business diagnosis behind all of them.",
    "solutions.grid.sub":
      "These aren't tiers. They're different starting points for different constraints. The business diagnosis decides which one fits.",
    "solutions.grid.bestFor": "Best for",
    "solutions.grid.problem": "The problem",
    "solutions.grid.included": "What's included",
    "solutions.grid.outcome": "Outcome",
    "solutions.grid.outcomeLabel": "Outcome",
    "solutions.grid.priceFrom": "Starting from",
    // The three price floors are a Phase 2 decision (spec §10.1). Until a real
    // number exists the cards read "Pricing on request" — never a fake figure.
    "solutions.grid.priceOnRequest": "Pricing on request",
    "solutions.grid.priceNote1":
      "Final scope is determined after the business diagnosis.",
    "solutions.grid.priceNote2":
      "Not a monthly retainer. A system your business owns.",
    "solutions.grid.detailLink": "See the full solution",
    // The Recommended mark is driven by the diagnostic router, so it moves with
    // the selected constraint and never asserts that one solution outranks
    // another. The note keeps that legible to anyone who scrolled past the
    // router — without it the badge would read as a fixed ranking.
    "solutions.grid.recommended": "Recommended",
    "solutions.grid.recommendedNote":
      "Marked against the growth constraint selected above. Change the constraint and the recommendation changes with it.",

    // Foundation — promises DIAGNOSIS, never implementation. Do not reintroduce
    // "build", "create" or "deliver" into this block (spec §2.5).
    "solutions.foundation.name": "Foundation",
    "solutions.foundation.statement":
      "You know growth is stuck. You don't yet know why.",
    "solutions.foundation.outcomeShort":
      "Find the constraint before spending on solutions.",
    "solutions.foundation.tagline":
      "Discover what's blocking your next stage of growth.",
    "solutions.foundation.bestFor":
      "Companies that know something is limiting growth but can't name it — and don't want to commit to a build before they can.",
    "solutions.foundation.problem":
      "Your business is growing, but the reason it's slowing isn't obvious from the inside. Every proposal you receive assumes an answer nobody has actually verified.",
    // Every capability appears here as something ASSESSED, never delivered —
    // that is the whole line between Foundation and the other two (§2.5).
    "solutions.foundation.inc1.title": "Business Diagnosis",
    "solutions.foundation.inc1.body":
      "How the company runs today — where work moves, where it stops, and why.",
    "solutions.foundation.inc1.item1":
      "Processes, workflows and operational structure",
    "solutions.foundation.inc1.item2":
      "Marketing performance and the customer acquisition journey",
    "solutions.foundation.inc1.item3": "The current technology stack and its limits",
    "solutions.foundation.inc1.item4": "Data visibility and reporting gaps",
    "solutions.foundation.inc2.title": "Growth and bottleneck assessment",
    "solutions.foundation.inc2.body":
      "The specific points where growth is being capped, and what each one is costing.",
    "solutions.foundation.inc2.item1": "Where opportunities are being lost",
    "solutions.foundation.inc2.item2": "Which processes are slowing growth",
    "solutions.foundation.inc2.item3": "Which manual work is capping scale",
    "solutions.foundation.inc2.item4": "The highest-impact areas to address first",
    "solutions.foundation.inc3.title": "Marketing and technology opportunity map",
    "solutions.foundation.inc3.body":
      "Where each capability would pay off in this business — and in what order.",
    "solutions.foundation.inc3.item1": "SEO and organic growth",
    "solutions.foundation.inc3.item2": "Paid acquisition and media buying",
    "solutions.foundation.inc3.item3": "Funnel and conversion",
    "solutions.foundation.inc3.item4": "CRM and customer management",
    "solutions.foundation.inc3.item5": "Business automation",
    "solutions.foundation.inc3.item6": "Custom software and platforms",
    "solutions.foundation.inc4.title": "AI opportunity identification",
    "solutions.foundation.inc4.body":
      "Which workflows are genuinely worth applying AI to, and which aren't.",
    "solutions.foundation.inc4.item1": "Which departments benefit first",
    "solutions.foundation.inc4.item2": "Which workflows should be automated",
    "solutions.foundation.inc4.item3": "Where AI creates measurable impact",
    "solutions.foundation.outcome":
      "A clear roadmap showing where technology, AI, and systems create measurable business impact.",
    "solutions.foundation.note":
      "Foundation produces a decision, not a deliverable. If you build with us afterwards, the work carries forward.",
    "solutions.foundation.credit":
      "Move forward with implementation within 90 days and your Foundation fee is credited toward the project.",

    // Growth Engine
    "solutions.growth.name": "Growth Engine",
    "solutions.growth.statement": "You have demand. Growth is unpredictable.",
    "solutions.growth.outcomeShort":
      "Build a measurable acquisition system your team runs with AI.",
    "solutions.growth.tagline": "Turn growth into a system you can measure.",
    "solutions.growth.bestFor":
      "Companies with real demand, held back by inconsistent acquisition, scattered marketing, and manual follow-through.",
    "solutions.growth.problem":
      "Revenue is growing, but growth depends on disconnected campaigns, manual processes, and people pushing everything forward.",
    // The constraint at this stage is COMMERCIAL, so every component serves the
    // path from stranger to customer. Where a capability also appears in Scale
    // (CRM, websites, automation, AI, reporting), the body states the depth
    // difference — that boundary is what stops the two solutions overlapping.
    "solutions.growth.inc1.title": "Marketing Systems",
    "solutions.growth.inc1.body":
      "The acquisition engine — planned, built and measured as one system rather than separate campaigns.",
    "solutions.growth.inc1.item1": "Marketing strategy and plan",
    "solutions.growth.inc1.item2": "SEO and organic growth",
    "solutions.growth.inc1.item3": "Media buying and paid campaigns",
    "solutions.growth.inc1.item4": "Funnel strategy and conversion optimization",
    "solutions.growth.inc1.item5": "Performance tracking and attribution",
    "solutions.growth.inc2.title": "Conversion assets",
    "solutions.growth.inc2.body":
      "What the funnel points at — the pages the acquisition system needs in order to convert.",
    "solutions.growth.inc2.item1": "CMS website",
    "solutions.growth.inc2.item2": "Landing pages",
    "solutions.growth.inc2.item3": "Campaign pages",
    "solutions.growth.inc3.title": "Revenue operations",
    "solutions.growth.inc3.body":
      "CRM set up for lead management across the commercial team, with the follow-through automated.",
    "solutions.growth.inc3.item1": "CRM for lead capture and pipeline",
    "solutions.growth.inc3.item2": "Lead routing and follow-up automation",
    "solutions.growth.inc3.item3": "The handoff from marketing to sales",
    "solutions.growth.inc3.item4": "Data connected across the tools already in use",
    "solutions.growth.inc4.title": "AI Enablement",
    "solutions.growth.inc4.body":
      "AI inside the daily work of the commercial teams — not a training deck.",
    "solutions.growth.inc4.item1": "Department-specific use cases",
    "solutions.growth.inc4.item2": "Employee AI training",
    "solutions.growth.inc4.item3":
      "AI-assisted workflows inside existing processes",
    "solutions.growth.outcome":
      "More qualified opportunities, clearer visibility, and a team operating with AI inside real workflows.",

    // Scale Infrastructure — inherits the VISIBILITY LAYER only (spec §0.3).
    "solutions.scale.name": "Scale Infrastructure",
    "solutions.scale.statement":
      "Your business has outgrown the systems running it.",
    "solutions.scale.outcomeShort":
      "Build the operating infrastructure for scale.",
    "solutions.scale.tagline":
      "Build the systems required for operational scale.",
    "solutions.scale.bestFor":
      "Companies where growth has outgrown the operation — complexity is rising and the current systems can't carry it.",
    "solutions.scale.problem":
      "Growth creates complexity. Disconnected tools, manual operations, and limited visibility start slowing the business down — and adding people stops helping.",
    "solutions.scale.alwaysLabel": "Always included",
    "solutions.scale.always":
      "The visibility layer: measurement, reporting, and business data connection — so the decisions after the build are made on evidence, not instinct.",
    "solutions.scale.expandsLabel":
      "Then expands, based on the business diagnosis, into:",
    // The constraint here is OPERATIONAL. Where a capability is shared with
    // Growth Engine it appears at a different depth: CRM as the system of
    // record rather than lead management, platforms rather than pages,
    // cross-department automation rather than marketing workflows.
    "solutions.scale.inc1.title": "Core business systems",
    "solutions.scale.inc1.body":
      "The systems of record the business runs on, integrated rather than stacked side by side.",
    "solutions.scale.inc1.item1": "CRM as the system of record across departments",
    "solutions.scale.inc1.item2": "ERP platforms",
    "solutions.scale.inc1.item3": "Business development performance management",
    "solutions.scale.inc1.item4": "Integration between the core systems",
    "solutions.scale.inc2.title": "Custom applications",
    "solutions.scale.inc2.body":
      "Software built for how this business works, where nothing off the shelf fits.",
    "solutions.scale.inc2.item1": "Internal business applications",
    "solutions.scale.inc2.item2": "Custom software solutions",
    "solutions.scale.inc2.item3": "B2B mobile applications",
    "solutions.scale.inc2.item4": "Customer portals and internal tools",
    "solutions.scale.inc3.title": "Advanced automation and AI",
    "solutions.scale.inc3.body":
      "Automation across departments, and AI embedded in the systems rather than bolted beside them.",
    "solutions.scale.inc3.item1": "Cross-department workflow automation",
    "solutions.scale.inc3.item2": "AI embedded in the business systems",
    "solutions.scale.inc3.item3": "Intelligent reporting and decision support",
    "solutions.scale.inc3.item4": "Org-wide AI adoption and employee training",
    "solutions.scale.inc4.title": "Operational enablement",
    "solutions.scale.inc4.body":
      "The change work that makes new systems stick after handover.",
    "solutions.scale.inc4.item1": "Process redesign",
    "solutions.scale.inc4.item2": "Adoption support",
    "solutions.scale.inc4.item3": "Continuous optimization after handover",
    "solutions.scale.outcome":
      "A scalable business infrastructure built around how your company actually operates.",

    // Custom Transformation — an exception path, not a fourth product.
    // `composed` is retained for the Phase 1b detail copy; it is not on the band.
    "solutions.custom.eyebrow": "The escape hatch",
    "solutions.custom.heading": "Not every business fits a pattern.",
    "solutions.custom.name": "Custom Transformation",
    "solutions.custom.body":
      "Strong sales with broken operations. AI adoption across every department at once. A combination no standard scope covers. When the business diagnosis points somewhere none of the three fit, the answer isn't a package — it's a system designed around your reality.",
    "solutions.custom.composed":
      "Built from the same four parts — strategy, marketing systems, business technology, and AI enablement — in whatever proportion the business diagnosis calls for.",
    "solutions.custom.price": "Priced after the business diagnosis.",

    // How we work. AI Enablement copy states CAPABILITY ONLY — no results
    // claim, no client count, no "proven" framing (spec §2.9 honesty constraint).
    "solutions.work.heading": "How we work",
    "solutions.work.strategy.label": "Strategy",
    "solutions.work.strategy.body":
      "We diagnose the business, identify the constraints, and define the roadmap. Strategy isn't something we sell — it's how everything else gets decided.",
    "solutions.work.divider": "Three capabilities deliver the transformation",
    "solutions.work.marketing.title": "Marketing Systems",
    "solutions.work.marketing.body":
      "Build measurable acquisition systems — search, paid, conversion, and tracking wired together instead of run separately.",
    "solutions.work.tech.title": "Business Technology",
    "solutions.work.tech.body":
      "Build and connect the systems the business runs on — ERP, CRM, web and mobile platforms, and the automation between them.",
    "solutions.work.ai.title": "AI Enablement",
    "solutions.work.ai.body":
      "Embed AI into real workflows so teams actually use it, inside the work they already do.",

    // Proof — reuses the featured-projects data; hidden entirely when empty.
    "solutions.proof.heading": "What this looks like in practice",
    "solutions.proof.sub": "Real engagements, and what changed in the business.",

    // FAQ
    "solutions.faq.heading": "Common questions",
    "solutions.faq.q1": "How do we know which solution we need?",
    "solutions.faq.a1":
      "Most companies don't, and that's fine. The business diagnosis exists to answer that question before anyone commits to a build.",
    "solutions.faq.q2": "Do we have to start with Foundation?",
    "solutions.faq.a2":
      "No. Foundation is for companies that can't yet name the constraint. If it's already clear, we start where the problem is. Every solution includes a business diagnosis phase either way.",
    "solutions.faq.q3": "Why is pricing “starting from”?",
    "solutions.faq.a3":
      "Because scope depends on what the business diagnosis finds. The figure shown is the floor. The final number comes with the proposal.",
    "solutions.faq.q4": "Is this a monthly retainer?",
    "solutions.faq.a4":
      "No. These are systems you own — source code, platforms, and data. Ongoing support is a separate agreement if you want one.",
    "solutions.faq.q5": "Do we own what you build?",
    "solutions.faq.a5":
      "Yes. Full source code and IP transfer on completion. No lock-in, no fee to access your own system.",
    "solutions.faq.q6": "What happens to the Foundation fee if we implement?",
    "solutions.faq.a6":
      "It's credited toward the project, provided implementation starts within 90 days and is based on that diagnosis. It isn't a refund — you bought a roadmap, and you keep it whether you build with us or not.",
    "solutions.faq.q7": "Is AI training sold separately?",
    "solutions.faq.a7":
      "No. AI enablement is built into every solution, because training that isn't attached to a real workflow doesn't survive the month after it ends.",

    // Final CTA
    "solutions.cta.heading": "Not sure what's blocking you?",
    "solutions.cta.body":
      "Book a strategy call. We'll tell you honestly where the constraint is — and if we're not the right partner, we'll say that too.",

    // --- SERVICE DETAIL (shared labels) ---
    // Shared across the three capability pages.
    // REMOVED with the page rewrite: `serviceDetail.included`, `.how.title`,
    // `.how.sub` and every `*.proc.*` step. The site already carries a process
    // on the homepage and on Solutions; a third per-page variant contradicted
    // both, and one of its steps promised a "fixed price" that the Solutions
    // page explicitly does not offer. The per-page `*.cta` labels are gone too
    // — all three pages now share one label for one destination.
    "serviceDetail.backAll": "← All services",
    "serviceDetail.seeExamples": "See examples",
    "serviceDetail.notFound.title": "Service not found",
    "serviceDetail.notFound.button": "View all services",
    "serviceDetail.related.title": "Proven Results",
    "serviceDetail.related.sub": "See how we've helped companies like yours.",
    "serviceDetail.related.viewPortfolio": "View Full Portfolio",
    "serviceDetail.faqTitle": "Common questions",
    "serviceDetail.lives.heading": "Where this sits in the solutions",
    "serviceDetail.lives.sub":
      "The same capability appears at different depths depending on what the business diagnosis finds. This is not a service you buy on its own.",
    "serviceDetail.lives.assessed": "Assessed here",
    "serviceDetail.lives.built": "Built here",
    "serviceDetail.cta.title": "Not sure this is your constraint?",
    "serviceDetail.cta.body":
      "That is what the business diagnosis is for. Start from the solutions and find where your growth is actually blocked.",
    "serviceDetail.cta.button": "See the solutions",

    // Service Detail — SOFTWARE (Business Technology)
    "serviceDetail.software.label": "Business Technology",
    "serviceDetail.software.title":
      "Business Technology: software, ERP, CRM, and automation",
    "serviceDetail.software.desc":
      "ERP and CRM platforms, customer-facing web, mobile apps, and the automation that connects them — designed to own, integrate, and scale.",
    "serviceDetail.software.pain.heading":
      "When the systems are the constraint, it looks like this.",
    "serviceDetail.software.pain.item1":
      "Three teams keep three versions of the same customer list.",
    "serviceDetail.software.pain.item2":
      "Every report is exported, pasted and reconciled by hand.",
    "serviceDetail.software.pain.item3":
      "The tools you bought don't talk, so people are the integration.",
    "serviceDetail.software.pain.item4":
      "The system you run was built for a smaller company than the one you have.",
    "serviceDetail.software.build.heading": "What we build",
    "serviceDetail.software.build.sub":
      "Six systems, and the constraint each one removes. Which of them you need comes out of the business diagnosis — this is not a catalogue to order from.",
    "serviceDetail.software.build.1.title": "ERP platforms",
    "serviceDetail.software.build.1.pain":
      "Finance, inventory and operations each keep their own numbers.",
    "serviceDetail.software.build.1.body":
      "One operational backbone — procurement, inventory, finance and fulfilment on the same data, so a number means the same thing in every department.",
    "serviceDetail.software.build.2.title": "CRM platforms",
    "serviceDetail.software.build.2.pain":
      "Nobody can say what stage a deal is at without asking the person who owns it.",
    "serviceDetail.software.build.2.body":
      "A pipeline the whole commercial team works inside — accounts, stages, activity and history in one place, with the reporting that makes forecasting possible.",
    "serviceDetail.software.build.3.title":
      "Business development performance systems",
    "serviceDetail.software.build.3.pain":
      "Sales performance is judged on impressions rather than measured.",
    "serviceDetail.software.build.3.body":
      "Targets, quotas, activity and outcomes tracked per rep and per team, so business development is managed on evidence instead of on who sounds busiest.",
    "serviceDetail.software.build.4.title": "Custom internal applications",
    "serviceDetail.software.build.4.pain":
      "A core process runs on a spreadsheet that one person guards.",
    "serviceDetail.software.build.4.body":
      "The workflow that makes your business different, built as a real application — permissions, audit trail, and integration with the rest of the stack.",
    "serviceDetail.software.build.5.title":
      "Customer portals and B2B mobile apps",
    "serviceDetail.software.build.5.pain":
      "Customers and partners phone your team for information they should be able to see.",
    "serviceDetail.software.build.5.body":
      "Direct access for clients, partners or field teams to their own orders, status, documents and requests — instead of routing every question through a person.",
    "serviceDetail.software.build.6.title": "Web platforms",
    "serviceDetail.software.build.6.pain":
      "The website is a brochure, disconnected from everything behind it.",
    "serviceDetail.software.build.6.body":
      "Sites and web applications connected to your systems from day one, so a form submission becomes a record in the CRM rather than an email somebody re-types.",
    "serviceDetail.software.lives.foundation":
      "Your current stack, its limits and the reporting gaps are assessed. Nothing is built at this stage — the point is deciding what should be.",
    "serviceDetail.software.lives.growth-engine":
      "The commercial layer: a CMS website and landing pages that convert, and CRM set up for lead capture, pipeline and follow-up across the sales team.",
    "serviceDetail.software.lives.scale-infrastructure":
      "The operational layer: CRM as the system of record across departments, ERP, business development performance systems, custom applications, portals and B2B mobile.",
    "serviceDetail.software.faq.1.q": "Do we own the code?",
    "serviceDetail.software.faq.1.a":
      "Yes. Full source code and IP transfer on completion. No lock-in, no fees to access your own system.",
    "serviceDetail.software.faq.2.q":
      "Can it integrate with our existing tools?",
    "serviceDetail.software.faq.2.a":
      "That's the point. We connect to your CRM, ERP, and existing stack from day one.",
    "serviceDetail.software.faq.3.q": "How long does a build take?",
    "serviceDetail.software.faq.3.a":
      "Depends on scope — we give you a specific timeline in the proposal, not a vague range.",
    "serviceDetail.software.faq.4.q": "What if we already have a system?",
    "serviceDetail.software.faq.4.a":
      "We rebuild or extend what you have, whichever actually makes sense for your situation.",

    // Service Detail — DIGITAL MARKETING (Marketing Systems)
    "serviceDetail.dm.label": "Marketing Systems",
    "serviceDetail.dm.title": "Marketing Systems: SEO, paid, and conversion",
    "serviceDetail.dm.desc":
      "SEO, paid campaigns, and conversion strategy wired into one measurable engine that brings in qualified buyers — not vanity traffic.",
    "serviceDetail.dm.pain.heading":
      "When acquisition is the constraint, it looks like this.",
    "serviceDetail.dm.pain.item1":
      "Leads arrive in bursts you can't forecast.",
    "serviceDetail.dm.pain.item2":
      "You're spending on ads and can't say which spend produced a customer.",
    "serviceDetail.dm.pain.item3": "Traffic goes up. Qualified enquiries don't.",
    "serviceDetail.dm.pain.item4":
      "Follow-up depends on somebody remembering.",
    "serviceDetail.dm.build.heading": "What we build",
    "serviceDetail.dm.build.sub":
      "Five parts of one acquisition system. Run separately they compete for budget; wired together they compound.",
    "serviceDetail.dm.build.1.title": "Marketing strategy and planning",
    "serviceDetail.dm.build.1.pain":
      "Channels were chosen one at a time, by whoever pitched last.",
    "serviceDetail.dm.build.1.body":
      "Which buyers, which channels, which offers, in what order — and what you stop doing. The plan the other four parts execute against.",
    "serviceDetail.dm.build.2.title": "Buyer-intent SEO",
    "serviceDetail.dm.build.2.pain":
      "You rank for terms that bring readers, not buyers.",
    "serviceDetail.dm.build.2.body":
      "Targeting the searches made by someone with a budget and a deadline, then building the pages and technical foundation to hold those positions.",
    "serviceDetail.dm.build.3.title": "Media buying",
    "serviceDetail.dm.build.3.pain":
      "Ad spend is a monthly bill nobody can defend.",
    "serviceDetail.dm.build.3.body":
      "Google, Meta and LinkedIn campaigns built around the cost of a qualified lead rather than clicks, with the account structure and creative testing to bring that cost down.",
    "serviceDetail.dm.build.4.title": "Conversion rate optimization",
    "serviceDetail.dm.build.4.pain":
      "You're paying to send traffic to pages that lose it.",
    "serviceDetail.dm.build.4.body":
      "Landing pages, forms and offers rebuilt and tested against real behaviour, so the same spend produces more enquiries.",
    "serviceDetail.dm.build.5.title": "Funnel strategy and tracking",
    "serviceDetail.dm.build.5.pain":
      "The report says the campaign worked. Sales says the leads were bad.",
    "serviceDetail.dm.build.5.body":
      "Measurement from first touch to closed deal, so a channel is judged on revenue instead of on what the ad platform reports about itself.",
    "serviceDetail.dm.lives.foundation":
      "Where SEO, paid, funnel and conversion would pay off in your business, and in what order. Assessment only — nothing is run at this stage.",
    "serviceDetail.dm.lives.growth-engine":
      "All five, built and run as one acquisition engine, together with the conversion assets and the CRM the system needs in order to work.",
    "serviceDetail.dm.faq.1.q": "What's the minimum to make this work?",
    "serviceDetail.dm.faq.1.a":
      "We're honest about fit — we're upfront about whether the budget justifies the work, and we'll tell you before you commit.",
    "serviceDetail.dm.faq.2.q": "How fast do results come?",
    "serviceDetail.dm.faq.2.a":
      "Paid moves in weeks; SEO is a few months for meaningful traffic. We set realistic expectations before we start.",
    "serviceDetail.dm.faq.3.q": "Do you guarantee results?",
    "serviceDetail.dm.faq.3.a":
      "We guarantee our work and our process, not market conditions. Targets are agreed upfront and we're accountable to them.",

    // Service Detail — AI TRAINING (AI Enablement)
    // §2.9 honesty constraint: CAPABILITY ONLY on this page. No results claim,
    // no client count, no "proven" framing, until delivery history exists.
    "serviceDetail.ai.label": "AI Enablement",
    "serviceDetail.ai.title": "AI Enablement and team AI training",
    "serviceDetail.ai.desc":
      "AI enablement isn't sold on its own — it's built into every solution. Department-specific use cases, workflow adoption, and practical team enablement, so AI ends up in daily work rather than in a training deck.",
    "serviceDetail.ai.pain.heading":
      "When AI adoption is the constraint, it looks like this.",
    "serviceDetail.ai.pain.item1":
      "Everyone is talking about AI. Nobody on the team uses it on real work.",
    "serviceDetail.ai.pain.item2":
      "You're paying for licences that sit unopened.",
    "serviceDetail.ai.pain.item3":
      "The team tried it once, got a bad answer, and went back to the old way.",
    "serviceDetail.ai.pain.item4":
      "You can't tell which processes are genuinely worth automating.",
    "serviceDetail.ai.build.heading": "How the work is delivered",
    "serviceDetail.ai.build.sub":
      "AI Enablement is a layer inside the other solutions, never a standalone purchase. These are the formats that layer takes.",
    "serviceDetail.ai.build.1.title": "Executive AI strategy sessions",
    "serviceDetail.ai.build.1.pain":
      "Leadership is being sold AI without a way to judge it.",
    "serviceDetail.ai.build.1.body":
      "Where AI changes the economics of your business and where it does not, so the investment decision is made on the same basis as any other.",
    "serviceDetail.ai.build.2.title": "Department-level adoption programs",
    "serviceDetail.ai.build.2.pain":
      "Generic training teaches tools nobody's job requires.",
    "serviceDetail.ai.build.2.body":
      "Use cases built from what a specific department actually does each week — sales, finance, operations, service — with the tools they already have open.",
    "serviceDetail.ai.build.3.title":
      "Hands-on workflow integration workshops",
    "serviceDetail.ai.build.3.pain":
      "People leave training impressed and change nothing.",
    "serviceDetail.ai.build.3.body":
      "Working sessions on live tasks, so the team finishes with AI inside a process they actually run rather than with a set of notes.",
    "serviceDetail.ai.build.4.title": "Implementation support",
    "serviceDetail.ai.build.4.pain":
      "Adoption fades in the month after the training ends.",
    "serviceDetail.ai.build.4.body":
      "Follow-through while the new way of working becomes the normal one — the part that decides whether any of the rest survives.",
    "serviceDetail.ai.lives.foundation":
      "Which departments benefit first, which workflows should be automated, and where AI would create measurable impact. Identification only.",
    "serviceDetail.ai.lives.growth-engine":
      "The commercial teams: department use cases, employee training, and AI-assisted workflows inside the processes that already run.",
    "serviceDetail.ai.lives.scale-infrastructure":
      "Organisation-wide adoption, plus AI embedded in the business systems themselves rather than sitting beside them.",
    "serviceDetail.ai.faq.1.q": "Is this generic AI training?",
    "serviceDetail.ai.faq.1.a":
      "No. Programs are built around your actual workflows and tools, not a stock curriculum.",
    "serviceDetail.ai.faq.2.q": "Who is it for?",
    "serviceDetail.ai.faq.2.a":
      "Leadership and teams — we run both strategy-level and hands-on tracks.",
    "serviceDetail.ai.faq.3.q": "What do we walk away with?",
    "serviceDetail.ai.faq.3.a":
      "People who use AI on real work, plus documented workflows your team keeps.",

    // --- PORTFOLIO ---
    "portfolio.title": "Selected Work",
    "portfolio.sub":
      "A curation of digital infrastructure and growth systems engineered for market leaders.",
    "portfolio.empty": "No projects found in this category.",
    // Portfolio pillar deep-link filter (?service=<pillar>)
    "portfolio.filter.showing": "Showing",
    "portfolio.filter.clear": "View all work",
    "portfolio.pillar.ai-training": "AI Training",
    "portfolio.pillar.digital-marketing": "Digital Marketing",
    "portfolio.pillar.software": "Software",

    // --- PROJECT DETAIL ---
    "projectDetail.back": "Back to Portfolio",
    "projectDetail.notFound": "Project not found",
    "projectDetail.mobileCta": "Start a Project Like This",
    "projectDetail.challenge": "The Problem",
    "projectDetail.diagnosis": "The Diagnosis",
    "projectDetail.solution": "The System",
    "projectDetail.techStack": "Tech Stack",
    "projectDetail.startProject": "Start Your Project",

    // --- CONTACT ---
    "contact.title": "Let's talk",
    "contact.sub":
      "Tell us about your business and what's slowing it down. We'll tell you honestly if we can help.",
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
    "contact.quick.body":
      "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please mention it in your message.",
    "contact.toast.success":
      "Message sent — we'll get back to you within 24 hours.",
    "contact.toast.error":
      "Something went wrong — please try again, or email us directly.",

    // --- FOOTER ---
    "footer.tagline": "We build the systems behind business growth.",
    "footer.services": "Services",
    "footer.company": "Company",
    "footer.connectShort": "Connect",
    "footer.stayConnected": "Stay Connected",
    "footer.link.aiTraining": "AI Enablement",
    "footer.link.digitalMarketing": "Marketing Systems",
    "footer.link.software": "Business Technology",
    "footer.link.about": "About",
    "footer.link.work": "Work",
    "footer.link.contact": "Contact",
    "footer.newsletter.text":
      "Practical notes on AI, marketing, and the systems that connect them — straight to your inbox.",
    "footer.newsletter.placeholder": "Enter your email",
    "footer.location": " Wilmington, DE, USA",
    "footer.copyright": "Omniflowai LLC · Registered in Wyoming, USA",
    "footer.toast.subscribed": "Thanks — you're subscribed.",
    "footer.toast.error": "Something went wrong, please try again.",

    // --- ABOUT (team/founder attribution stays frozen: [TODO(team-final)]) ---
    "about.badge": "Who we are",
    "about.headline.lead": "Engineers who understand",
    "about.headline.highlight": "business.",
    "about.sub":
      "OmniflowAI is a digital transformation partner built around one belief: most companies don't need more tools — they need the right systems, built well and connected properly.",
    "about.story.heading": "We started OmniflowAI to close a gap.",
    "about.story.p1":
      "Too many businesses are sold disconnected pieces — a website here, an ad campaign there, a tool nobody integrates — and left to stitch them together themselves. The result is expensive fragmentation: software that doesn't talk, marketing that doesn't convert, and no clear view of what's working.",
    "about.story.p2":
      "We do the opposite. We start from how your business actually operates, then design and build the systems that fit it — software, marketing, and automation that work as one. You own everything we build. No lock-in, no dependency, no black boxes.",
    "about.story.p3":
      "We work like engineers, not order-takers: we care about outcomes you can measure, systems that outlast the engagement, and giving you the keys at the end.",
    "about.team.heading": "Meet the Builders",
    "about.team.sub":
      "No outsourcing. No juniors learning on your dime. Just senior talent dedicated to your growth.",
    "about.values.1.title": "Systems over services",
    "about.values.1.desc":
      "We don't sell isolated deliverables. Everything we build is designed to connect and compound.",
    "about.values.2.title": "You own it",
    "about.values.2.desc":
      "Full source code and IP transfer on every build. What you pay for is yours.",
    "about.values.3.title": "Engineering-led",
    "about.values.3.desc":
      "You work directly with the people building your systems, not an account manager relaying messages.",
    "about.values.4.title": "Measured by outcomes",
    "about.values.4.desc":
      "We tie our work to business results — revenue, efficiency, acquisition — not hours logged or assets shipped.",
    "about.cta.title": "Let's map your systems",

    // --- 404 ---
    "notFound.title": "Page not found",
    "notFound.body": "The page you're looking for doesn't exist or has moved.",
    "notFound.button": "Back to home",
  },

  ar: {
    // --- NAV ---
    "nav.home": "الرئيسية",
    "nav.services": "الحلول",
    "nav.portfolio": "أعمالنا",
    "nav.about": "من نحن",
    "nav.contact": "تواصل معنا",

    // --- COMMON ---
    "common.cta.bookCall": "احجز مكالمة استراتيجية",
    "common.brandLine":
      "نحن لا نسلّم مخرجات ونمضي. نحن نبني أنظمة تستمر في العمل حتى بعد انتهاء تعاوننا.",
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
    "serviceOpt.foundation": "Foundation",
    "serviceOpt.growth-engine": "Growth Engine",
    "serviceOpt.scale-infrastructure": "Scale Infrastructure",
    "serviceOpt.custom": "Custom Transformation",
    "serviceOpt.not-sure": "لست متأكداً بعد",

    // --- PILLARS (shared by Home + Services) ---
    "pillars.aiTraining.title": "تمكين الذكاء الاصطناعي",
    "pillars.aiTraining.body":
      "نقدّم برامج منظّمة لتبنّي الذكاء الاصطناعي للفرق والقيادات — من جلسات استراتيجية للمدراء إلى دمج عملي في سير العمل. الهدف ليس مجرد المعرفة، بل قدرة تشغيلية حقيقية: أن يستخدم فريقك الذكاء الاصطناعي في عمل حقيقي، لا أن يشاهد عرضاً توضيحياً فحسب.",
    "pillars.digitalMarketing.title": "أنظمة التسويق",
    "pillars.digitalMarketing.body":
      "تحسين محركات البحث والحملات المدفوعة واستراتيجية التحويل، مدمجة في محرك واحد يستهدف المشترين المؤهّلين — لا الزيارات الشكلية. كل مرحلة قابلة للقياس، لتعرف كم يكلّفك العميل المحتمل فعلاً ومن أين تأتي الإيرادات.",
    "pillars.software.title": "تقنية الأعمال",
    "pillars.software.body":
      "الأنظمة التي تدير أعمالك — منصّات تخطيط موارد المؤسسات (ERP) وإدارة علاقات العملاء (CRM)، ومواقع موجّهة للعملاء، وتطبيقات الجوال، والأتمتة التي تربطها معاً. مبنية لتملكها وتدمجها وتوسّعها، لا لتستأجرها.",
    "pillars.software.subcaps":
      "أنظمة الأعمال (ERP/CRM) · منصّات الويب · تطبيقات الجوال · الأتمتة والذكاء الاصطناعي",

    // --- HERO SYSTEM MAP (interactive; real capability labels) ---
    "systemMap.center": "نظام الأعمال",
    "systemMap.node.aiTraining": "تمكين الذكاء الاصطناعي",
    "systemMap.node.marketing": "أنظمة التسويق",
    "systemMap.node.software": "تقنية الأعمال",
    "systemMap.node.automation": "الأتمتة",
    "systemMap.node.crm": "إدارة العملاء",
    "systemMap.node.strategy": "الاستراتيجية",
    "systemMap.aria":
      "نظام أعمال مترابط: تمكين الذكاء الاصطناعي، وأنظمة التسويق، وتقنية الأعمال، والأتمتة، وإدارة العملاء، والاستراتيجية، تترابط جميعها في نظام مركزي واحد.",

    // --- HOME ---
    "home.hero.h1.lead": "معظم الفِرق تبدأ باختيار الأداة.",
    "home.hero.h1.highlight": "نحن نبدأ بالتشخيص.",
    "home.hero.sub":
      "ذكاء اصطناعي، تسويق، برمجيات، أتمتة — لا نبني إلا ما يدعمه التشخيص. ننظر قبل أن نلمس، ليلائم ما نبنيه طريقة عمل أعمالك فعلاً.",
    "home.hero.cta2": "استعرض أعمالنا",
    "home.trustEyebrow": "شركاء نثق بهم",
    "home.trust": "تثق بنا فرقٌ تبني مستقبل قطاعاتها.",
    "home.reach.headline":
      "موثوقون من علاماتٍ تجارية في الولايات المتحدة ودول الخليج ومصر",
    "home.reach.stat1.value": "50+",
    "home.reach.stat1.label": "مشروعٌ منجز",
    "home.reach.stat2.value": "8",
    "home.reach.stat2.label": "دول",
    "home.reach.stat3.value": "تغطية كاملة لدول الخليج",
    "home.reach.stat3.label": "+ الولايات المتحدة ومصر",
    "home.reach.countries":
      "مصر · السعودية · الإمارات · قطر · الكويت · البحرين · عُمان · الولايات المتحدة",
    "home.valueProp.title.lead": "معظم الشركات لا تعاني مشكلة تسويق.",
    "home.valueProp.title.highlight": "بل تعاني مشكلة أنظمة.",
    "home.valueProp.body":
      "أدوات غير مترابطة، وعمليات تسليم يدوية، وغياب رؤية واضحة من العميل المحتمل حتى إتمام الصفقة. نحن نربط السلسلة كاملة — كيف تستقطب عملاءك، وكيف تحوّلهم، وكيف تدير أعمالك بعد انضمامهم — لتعمل الأجزاء كنظام واحد يمكنك قياسه فعلاً.",
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
    "home.proof.body":
      "كل مشروع مرتبط بأثر تلمسه أعمالك — إيرادات، كفاءة، تكلفة استقطاب، توسّع. وهذه هي الأعمال التي تقف وراء ذلك.",
    "home.recent.title": "أحدث الأعمال",
    "home.recent.sub": "لمحة عن الأنظمة التي بنيناها.",
    "home.how.title": "كيف نعمل",
    "home.how.diagnose.title": "التشخيص",
    "home.how.diagnose.desc":
      "نرسم خريطة نموذج عملك وأنظمتك والعوائق التي تبطّئ نموّك.",
    "home.how.design.title": "التصميم",
    "home.how.design.desc":
      "نصمّم المزيج المناسب من البرمجيات والتسويق والأتمتة بما يلائم طريقة عملك الفعلية.",
    "home.how.build.title": "البناء",
    "home.how.build.desc": "نطوّر النظام وندمجه ونسلّمك ملكيته الكاملة.",
    "home.how.optimize.title": "التحسين",
    "home.how.optimize.desc":
      "نواصل تحسينه استناداً إلى بيانات أعمالك الحقيقية.",
    "home.finalCta.title": "جاهز لتغيير طريقة إدارة أعمالك؟",
    "home.finalCta.body":
      "احجز مكالمة استراتيجية. سننظر في أنظمتك الحالية ونوضّح لك بالضبط ما يعيق النمو — حتى إن لم تعمل معنا.",
    "home.finalCta.button": "احجز مكالمتك الاستراتيجية",
    "home.finalCta.sub": "بلا عروض بيعية. وضوح فقط.",

    // =========================================================================
    // --- SERVICES --- @deprecated (Phase 1 — Solutions cutover)
    // Superseded by `solutions.*`. Kept through this deploy only; removed once
    // /services is verified in both languages and nothing references the prefix.
    // See the full note on the EN block above.
    // =========================================================================
    "services.eyebrow": "ما الذي نقدّمه",
    "services.title.lead": "ثلاث قدرات.",
    "services.title.highlight": "شريك تحوّل رقمي واحد.",
    "services.learnMore": "اعرف المزيد",
    "services.featuredProject": "مشروع مميّز",
    "services.viewCaseStudy": "عرض دراسة الحالة",
    "services.together.title": "أقوى معاً",
    "services.together.sub":
      "كل قدرة تعمل بمفردها. ومعاً تتضاعف قيمتها — برمجياتك تلتقط البيانات، وتسويقك يغذّي مسار المبيعات، وأتمتتك تديره، وفريقك يعرف كيف يقود ذلك كله.",
    "services.together.capture.title": "الالتقاط",
    "services.together.capture.desc":
      "موقعك يلتقط العملاء المحتملين ويجمع البيانات التي تحتاجها لتأهيلهم.",
    "services.together.attract.title": "الاستقطاب",
    "services.together.attract.desc":
      "التسويق يقود الأشخاص المناسبين إلى موقعك — صنّاع القرار، لا المتفرّجين.",
    "services.together.automate.title": "الأتمتة",
    "services.together.automate.desc":
      "الأتمتة تؤهّل العملاء المحتملين، وتحجز الاجتماعات، وتزامن كل شيء مع نظام إدارة علاقات العملاء لديك.",
    "services.cta.title": "غير متأكد مما تحتاجه؟",
    "services.cta.body":
      "احجز مكالمة مجانية. سننظر في وضعك الحالي ونخبرك بالضبط بما يُحدث فرقاً — حتى لو لم يكن ضمن ما نقدّمه.",
    "services.cta.button": "احجز مكالمة استراتيجية مجانية",

    // --- SERVICES PAGE: selectable pillar panels ---
    // "التسويق" هنا تسمية عرض محلية لركيزة digital-marketing؛ التسمية المرجعية
    // في التصنيف ("التسويق الرقمي") تبقى دون تغيير.
    "services.subhead":
      "تسويقٌ يملأ مسار المبيعات، وبرمجياتٌ تُدير أعمالك، وذكاءٌ اصطناعي يستخدمه فريقك فعلاً.",
    "services.explore": "استكشف",

    "services.pillar.aiTraining.label": "التدريب على الذكاء الاصطناعي",
    "services.pillar.aiTraining.title": "التدريب على الذكاء الاصطناعي",
    "services.pillar.aiTraining.tagline":
      "للفرق التي تستخدم الذكاء الاصطناعي بشكل عشوائي — أو لا تستخدمه إطلاقاً.",
    "services.pillar.aiTraining.body":
      "نحوّل الذكاء الاصطناعي من تجارب متفرّقة إلى قدرة جماعية قابلة للتكرار.",
    "services.pillar.aiTraining.step.1": "التقييم",
    "services.pillar.aiTraining.step.2": "التحديد",
    "services.pillar.aiTraining.step.3": "التدريب",
    "services.pillar.aiTraining.step.4": "الترسيخ",

    "services.pillar.marketing.label": "التسويق",
    "services.pillar.marketing.title": "التسويق",
    "services.pillar.marketing.tagline":
      "لمسارات المبيعات التي تعتمد على الإحالات والكلمة المنقولة.",
    "services.pillar.marketing.body":
      "نحوّل الحملات المتفرّقة إلى نظام استقطاب واحد يجذب المشترين المؤهّلين.",
    "services.pillar.marketing.step.1": "التدقيق",
    "services.pillar.marketing.step.2": "الاستهداف",
    "services.pillar.marketing.step.3": "الإطلاق",
    "services.pillar.marketing.step.4": "القياس",

    "services.pillar.software.label": "البرمجيات",
    "services.pillar.software.title": "البرمجيات",
    "services.pillar.software.tagline":
      "للفرق التي تُدير أعمالها بجداول البيانات وأدوات غير مترابطة.",
    "services.pillar.software.body":
      "نحوّل الحلول اليدوية المؤقتة إلى أنظمة تملكها وتدمجها وتوسّعها.",
    "services.pillar.software.step.1": "التخطيط",
    "services.pillar.software.step.2": "التصميم",
    "services.pillar.software.step.3": "البناء",
    "services.pillar.software.step.4": "الدمج",

    "services.painRouter.title": "غير متأكد أيّها يناسبك؟",
    "services.painRouter.leads": "المزيد من العملاء المؤهّلين",
    "services.painRouter.ops": "عمليات وأدوات مبعثرة",
    "services.painRouter.aiAdoption": "تبنّي الفريق للذكاء الاصطناعي",
    "services.painRouter.all": "كل ما سبق",
    // --- END deprecated services.* block ---

    // =========================================================================
    // --- SOLUTIONS PAGE (/services) — Phase 1 ---
    // مطابق للمفاتيح الإنجليزية مفتاحاً بمفتاح. أسماء الحلول (Foundation /
    // Growth Engine / Scale Infrastructure / Custom Transformation) أسماء منتجات
    // لا تُترجم، وتُعرض داخل dir="ltr" حتى لا يختلّ ترتيبها داخل الجملة العربية.
    // الأرقام غربية (0–9) في اللغتين (spec §12.7).
    // =========================================================================

    // Hero
    "solutions.eyebrow": "الحلول",
    "solutions.h1.lead": "ابنِ الأنظمة التي يقوم عليها",
    "solutions.h1.accent": "نموك في المرحلة القادمة.",
    "solutions.subhead":
      "أعمالك تعمل بالفعل. ما تحتاجه الآن هو البنية التي تتيح لها التوسّع. نكتشف ما الذي يعيق النمو، ثم نبني أنظمة التسويق والتقنية والذكاء الاصطناعي التي تزيله.",
    "solutions.hero.secondary": "حدّد القيد لديك",

    // Hero visual — the Business Diagnostic
    "solutions.diag.title": "تشخيص الأعمال",
    "solutions.diag.systemTitle": "نظام تشغيل النمو",
    "solutions.diag.summary": "{s} إشارات · {c} قيود جذرية",
    "solutions.diag.rootLabel": "قيد جذري",
    "solutions.diag.hint": "اختر أي إشارة لتكشف ما ترتبط به فعلاً.",
    "solutions.diag.trace": "{n} من {s} إشارات تعود إلى هذا القيد",
    "solutions.diag.buildLabel": "نبني",
    "solutions.diag.showSystem": "اعرض النظام",
    "solutions.diag.showSignals": "العودة إلى الإشارات",
    "solutions.diag.strategyLabel": "الاستراتيجية",
    "solutions.diag.strategyBody":
      "تشخيص الأعمال هو ما يحدّد أيّاً من الثلاثة تحتاج، وبأي ترتيب.",
    "solutions.diag.thesis": "معظم مشكلات النمو أعراضٌ لنظام واحد مفقود.",

    "solutions.diag.s1.label": "نمو غير منتظم",
    "solutions.diag.s1.text": "النمو غير منتظم ولا يتراكم.",
    "solutions.diag.s2.label": "إنفاق لا يُقاس",
    "solutions.diag.s2.text": "لا يمكن ربط الإنفاق بالإيرادات.",
    "solutions.diag.s3.label": "تعثّر عند التسليم",
    "solutions.diag.s3.text": "العمل يتعثّر عند كل عملية تسليم.",
    "solutions.diag.s4.label": "تقارير يدوية",
    "solutions.diag.s4.text": "كل تقرير يُعاد بناؤه يدوياً.",
    "solutions.diag.s5.label": "قرارات معتمدة على المؤسّس",
    "solutions.diag.s5.text": "القرارات تمرّ عبر عدد قليل من الأشخاص.",
    "solutions.diag.s6.label": "طاقة مقيّدة بالتوظيف",
    "solutions.diag.s6.text": "زيادة الحجم ما زالت تعني زيادة الموظفين.",
    "solutions.diag.s7.label": "تبنٍّ متعثّر للذكاء الاصطناعي",
    "solutions.diag.s7.text": "الذكاء الاصطناعي يُناقَش ولا يُشغَّل.",

    "solutions.diag.c1.name": "الطلب ليس نظاماً.",
    "solutions.diag.c1.impact":
      "الإيرادات تعتمد على الجهد، فلا يمكن توقّعها ولا مراكمتها.",
    "solutions.diag.c2.name": "الأعمال تُدار بالأشخاص لا بالأنظمة.",
    "solutions.diag.c2.impact":
      "كل عملية تحتاج شخصاً بداخلها، فيتزايد التعقيد أسرع من الإنتاج.",
    "solutions.diag.c3.name": "الطاقة لا تتوسّع إلا بالتوظيف.",
    "solutions.diag.c3.impact":
      "الإنتاج مسقوف بعدد الموظفين — وهو أبطأ طرق النمو وأغلاها.",

    // Trust strip
    // solutions.trust.* / .problem.* / .shift.* removed — see the EN block.

    // Diagnostic router
    "solutions.router.eyebrow": "تشخيص الأعمال",
    "solutions.router.heading": "حدّد القيد الذي يعيق نموك.",
    "solutions.router.sub":
      "اختر ما يقترب أكثر من وضع أعمالك، وسنوجّهك إلى نقطة البداية المناسبة.",
    "solutions.router.q1": "لدينا عملاء، لكن النمو غير منتظم.",
    "solutions.router.q2":
      "نموّنا يعتمد على زيادة عدد الموظفين بدلاً من أنظمة أفضل.",
    "solutions.router.q3": "لدينا أدوات، لكن لا شيء مترابط.",
    "solutions.router.q4":
      "نعلم أن الذكاء الاصطناعي مهم، لكن لا نعرف من أين نبدأ.",
    "solutions.router.q5": "لسنا متأكدين ما الذي تعطّل فعلاً.",
    "solutions.router.q6": "لدينا تحدٍّ فريد يحتاج إلى نهج مصمَّم خصيصاً.",
    "solutions.router.resultLabel": "نقطة البداية المقترحة",
    "solutions.router.r1":
      "يجب أن يتحوّل الاستقطاب لديك إلى نظام قبل بناء مزيد من التقنية فوقه.",
    "solutions.router.r2":
      "النمو المعتمد على زيادة الموظفين هو حدٌّ في البنية التحتية. الأنظمة هي ما يجب أن يحمل هذا العبء بدلاً من ذلك.",
    "solutions.router.r3":
      "الأدوات غير المترابطة مشكلة بنية تحتية، لا مشكلة تسويق.",
    "solutions.router.r4":
      "ابدأ بتحديد أين يحقّق الذكاء الاصطناعي عائداً فعلياً داخل سير عملك.",
    "solutions.router.r5":
      "هذا بالضبط ما وُجد التشخيص من أجله. لا ينبغي لأحد أن يبني قبل أن تتوفّر هذه الإجابة.",
    "solutions.router.r6":
      "إذن الإجابة نظام مصمَّم حول قيودك، لا نطاق مُعدّ مسبقاً.",
    "solutions.router.unsure": "تفضّل الحديث مباشرة؟ احجز مكالمة استراتيجية.",

    // Solutions — section frame
    "solutions.grid.heading": "ثلاث نقاط دخول. وتشخيص أعمال واحد وراءها جميعاً.",
    "solutions.grid.sub":
      "هذه ليست مستويات. بل نقاط بداية مختلفة لقيود مختلفة. وتشخيص الأعمال هو ما يحدّد الملائم منها.",
    "solutions.grid.bestFor": "مناسب لـ",
    "solutions.grid.problem": "المشكلة",
    "solutions.grid.included": "ما الذي يشمله",
    "solutions.grid.outcome": "النتيجة",
    "solutions.grid.outcomeLabel": "النتيجة",
    "solutions.grid.priceFrom": "يبدأ من",
    "solutions.grid.priceOnRequest": "السعر عند الطلب",
    "solutions.grid.priceNote1": "يُحدَّد النطاق النهائي بعد تشخيص الأعمال.",
    "solutions.grid.priceNote2": "ليس اشتراكاً شهرياً. بل نظام تملكه أعمالك.",
    "solutions.grid.detailLink": "تفاصيل الحل كاملة",
    "solutions.grid.recommended": "موصى به",
    "solutions.grid.recommendedNote":
      "محدَّد بناءً على قيد النمو المختار أعلاه. غيّر القيد لتتغيّر التوصية معه.",

    // Foundation
    "solutions.foundation.name": "Foundation",
    "solutions.foundation.statement":
      "تعرف أن النمو متوقّف، لكنك لا تعرف السبب بعد.",
    "solutions.foundation.outcomeShort": "حدّد القيد قبل الإنفاق على الحلول.",
    "solutions.foundation.tagline":
      "اكتشف ما الذي يعيق مرحلتك التالية من النمو.",
    "solutions.foundation.bestFor":
      "شركات تعرف أن شيئاً ما يحدّ من نموها لكنها لا تستطيع تسميته — ولا تريد الالتزام ببناء قبل أن تستطيع.",
    "solutions.foundation.problem":
      "أعمالك تنمو، لكن سبب تباطؤها ليس واضحاً من الداخل. وكل عرض يصلك يفترض إجابة لم يتحقّق منها أحد فعلاً.",
    "solutions.foundation.inc1.title": "تشخيص الأعمال",
    "solutions.foundation.inc1.body":
      "كيف تعمل الشركة اليوم — أين يتحرّك العمل، وأين يتوقّف، ولماذا.",
    "solutions.foundation.inc1.item1": "العمليات وسير العمل والهيكل التشغيلي",
    "solutions.foundation.inc1.item2": "أداء التسويق ورحلة استقطاب العملاء",
    "solutions.foundation.inc1.item3": "المنظومة التقنية الحالية وحدودها",
    "solutions.foundation.inc1.item4": "فجوات وضوح البيانات والتقارير",
    "solutions.foundation.inc2.title": "تقييم النمو والاختناقات",
    "solutions.foundation.inc2.body":
      "النقاط المحدّدة التي يُقيَّد عندها النمو، وكلفة كلٍّ منها.",
    "solutions.foundation.inc2.item1": "أين تُفقد الفرص",
    "solutions.foundation.inc2.item2": "أي العمليات تُبطئ النمو",
    "solutions.foundation.inc2.item3": "أي عمل يدوي يحدّ من التوسّع",
    "solutions.foundation.inc2.item4": "أعلى المجالات أثراً للبدء بها",
    "solutions.foundation.inc3.title": "خريطة فرص التسويق والتقنية",
    "solutions.foundation.inc3.body":
      "أين تحقّق كل قدرة عائداً في هذه الأعمال — وبأي ترتيب.",
    "solutions.foundation.inc3.item1": "تحسين محركات البحث والنمو العضوي",
    "solutions.foundation.inc3.item2": "الاستقطاب المدفوع وشراء الوسائط",
    "solutions.foundation.inc3.item3": "المسار التسويقي والتحويل",
    "solutions.foundation.inc3.item4": "أنظمة إدارة العملاء (CRM)",
    "solutions.foundation.inc3.item5": "أتمتة الأعمال",
    "solutions.foundation.inc3.item6": "البرمجيات والمنصّات المخصّصة",
    "solutions.foundation.inc4.title": "تحديد فرص الذكاء الاصطناعي",
    "solutions.foundation.inc4.body":
      "أي مسارات العمل تستحق فعلاً تطبيق الذكاء الاصطناعي عليها، وأيها لا.",
    "solutions.foundation.inc4.item1": "أي الأقسام تستفيد أولاً",
    "solutions.foundation.inc4.item2": "أي مسارات العمل ينبغي أتمتتها",
    "solutions.foundation.inc4.item3":
      "أين يصنع الذكاء الاصطناعي أثراً قابلاً للقياس",
    "solutions.foundation.outcome":
      "خارطة طريق واضحة تُبيّن أين تصنع التقنية والذكاء الاصطناعي والأنظمة أثراً قابلاً للقياس.",
    "solutions.foundation.note":
      "‏Foundation يُنتج قراراً لا مخرجاً. وإن بنيت معنا بعده، فإن العمل ينتقل إلى ما يليه.",
    "solutions.foundation.credit":
      "إن مضيت في التنفيذ خلال 90 يوماً، تُخصم قيمة Foundation من قيمة المشروع.",

    // Growth Engine
    "solutions.growth.name": "Growth Engine",
    "solutions.growth.statement": "لديك طلب. لكن النمو غير قابل للتوقّع.",
    "solutions.growth.outcomeShort":
      "ابنِ نظام استقطاب قابلاً للقياس يديره فريقك بالذكاء الاصطناعي.",
    "solutions.growth.tagline": "حوّل النمو إلى نظام يمكن قياسه.",
    "solutions.growth.bestFor":
      "شركات لديها طلب حقيقي، يعيقها استقطاب غير منتظم وتسويق متفرّق ومتابعة يدوية.",
    "solutions.growth.problem":
      "الإيرادات تنمو، لكن النمو يعتمد على حملات غير مترابطة وعمليات يدوية وأشخاص يدفعون كل شيء إلى الأمام.",
    "solutions.growth.inc1.title": "أنظمة التسويق",
    "solutions.growth.inc1.body":
      "محرّك الاستقطاب — يُخطَّط ويُبنى ويُقاس كنظام واحد لا كحملات منفصلة.",
    "solutions.growth.inc1.item1": "استراتيجية التسويق وخطة التنفيذ",
    "solutions.growth.inc1.item2": "تحسين محركات البحث والنمو العضوي",
    "solutions.growth.inc1.item3": "شراء الوسائط والحملات المدفوعة",
    "solutions.growth.inc1.item4": "استراتيجية المسار وتحسين التحويل",
    "solutions.growth.inc1.item5": "تتبّع الأداء وإسناد النتائج",
    "solutions.growth.inc2.title": "أصول التحويل",
    "solutions.growth.inc2.body":
      "ما يوجّه إليه المسار التسويقي — الصفحات التي يحتاجها نظام الاستقطاب ليحوّل.",
    "solutions.growth.inc2.item1": "موقع بنظام إدارة محتوى",
    "solutions.growth.inc2.item2": "صفحات هبوط",
    "solutions.growth.inc2.item3": "صفحات الحملات",
    "solutions.growth.inc3.title": "عمليات الإيرادات",
    "solutions.growth.inc3.body":
      "نظام إدارة عملاء مهيّأ لإدارة العملاء المحتملين عبر الفريق التجاري، مع أتمتة المتابعة.",
    "solutions.growth.inc3.item1":
      "نظام CRM لالتقاط العملاء المحتملين وإدارة المسار",
    "solutions.growth.inc3.item2": "توجيه العملاء المحتملين وأتمتة المتابعة",
    "solutions.growth.inc3.item3": "التسليم من التسويق إلى المبيعات",
    "solutions.growth.inc3.item4": "ربط البيانات عبر الأدوات المستخدمة بالفعل",
    "solutions.growth.inc4.title": "تمكين الذكاء الاصطناعي",
    "solutions.growth.inc4.body":
      "الذكاء الاصطناعي داخل العمل اليومي للفرق التجارية — لا شريحة في عرض تدريبي.",
    "solutions.growth.inc4.item1": "استخدامات خاصة بكل قسم",
    "solutions.growth.inc4.item2": "تدريب الموظفين على الذكاء الاصطناعي",
    "solutions.growth.inc4.item3":
      "مسارات عمل مدعومة بالذكاء الاصطناعي ضمن العمليات القائمة",
    "solutions.growth.outcome":
      "فرص أكثر تأهيلاً، ورؤية أوضح، وفريق يعمل بالذكاء الاصطناعي داخل مسارات عمل حقيقية.",

    // Scale Infrastructure
    "solutions.scale.name": "Scale Infrastructure",
    "solutions.scale.statement": "أعمالك تجاوزت الأنظمة التي تديرها.",
    "solutions.scale.outcomeShort": "ابنِ البنية التشغيلية اللازمة للتوسّع.",
    "solutions.scale.tagline": "ابنِ الأنظمة اللازمة للتوسّع التشغيلي.",
    "solutions.scale.bestFor":
      "شركات تجاوز نموّها تشغيلها — التعقيد يتصاعد والأنظمة الحالية لا تستطيع حمله.",
    "solutions.scale.problem":
      "النمو يولّد التعقيد. الأدوات غير المترابطة والعمليات اليدوية والرؤية المحدودة تبدأ في إبطاء الأعمال — وزيادة الموظفين تتوقّف عن الإفادة.",
    "solutions.scale.alwaysLabel": "مشمول دائماً",
    "solutions.scale.always":
      "طبقة الرؤية: القياس والتقارير وربط بيانات الأعمال — لتُتّخذ القرارات بعد البناء على أدلة لا على حدس.",
    "solutions.scale.expandsLabel":
      "ثم يتوسّع، بناءً على تشخيص الأعمال، ليشمل:",
    "solutions.scale.inc1.title": "الأنظمة الأساسية للأعمال",
    "solutions.scale.inc1.body":
      "أنظمة السجلّ التي تقوم عليها الأعمال، مترابطة لا مرصوفة جنباً إلى جنب.",
    "solutions.scale.inc1.item1": "نظام CRM كسجلّ موحّد عبر الأقسام",
    "solutions.scale.inc1.item2": "منصّات تخطيط الموارد ERP",
    "solutions.scale.inc1.item3": "أنظمة إدارة أداء تطوير الأعمال",
    "solutions.scale.inc1.item4": "الربط بين الأنظمة الأساسية",
    "solutions.scale.inc2.title": "التطبيقات المخصّصة",
    "solutions.scale.inc2.body":
      "برمجيات مبنية على طريقة عمل هذه الشركة، حيث لا يناسبها أي حل جاهز.",
    "solutions.scale.inc2.item1": "تطبيقات الأعمال الداخلية",
    "solutions.scale.inc2.item2": "حلول برمجية مخصّصة",
    "solutions.scale.inc2.item3": "تطبيقات جوال للأعمال B2B",
    "solutions.scale.inc2.item4": "بوابات العملاء والأدوات الداخلية",
    "solutions.scale.inc3.title": "أتمتة وذكاء اصطناعي متقدّم",
    "solutions.scale.inc3.body":
      "أتمتة عابرة للأقسام، وذكاء اصطناعي مدمج في الأنظمة لا ملحق بها.",
    "solutions.scale.inc3.item1": "أتمتة سير العمل عبر الأقسام",
    "solutions.scale.inc3.item2": "ذكاء اصطناعي مدمج في أنظمة الأعمال",
    "solutions.scale.inc3.item3": "تقارير ذكية ودعم القرار",
    "solutions.scale.inc3.item4":
      "تبنّي الذكاء الاصطناعي على مستوى الشركة وتدريب الموظفين",
    "solutions.scale.inc4.title": "التمكين التشغيلي",
    "solutions.scale.inc4.body":
      "عمل التغيير الذي يجعل الأنظمة الجديدة تستمر بعد التسليم.",
    "solutions.scale.inc4.item1": "إعادة تصميم العمليات",
    "solutions.scale.inc4.item2": "دعم التبنّي",
    "solutions.scale.inc4.item3": "التحسين المستمر بعد التسليم",
    "solutions.scale.outcome":
      "بنية أعمال قابلة للتوسّع مبنية حول الطريقة التي تعمل بها شركتك فعلاً.",

    // Custom Transformation
    "solutions.custom.eyebrow": "المسار الاستثنائي",
    "solutions.custom.heading": "ليست كل الأعمال تناسبها الأنماط الجاهزة.",
    "solutions.custom.name": "Custom Transformation",
    "solutions.custom.body":
      "مبيعات قوية مع عمليات مكسورة. تبنٍّ للذكاء الاصطناعي عبر كل الأقسام دفعة واحدة. تركيبة لا يغطّيها أي نطاق جاهز. حين يشير تشخيص الأعمال إلى ما لا يناسبه أيٌّ من الثلاثة، فالإجابة ليست باقة — بل نظام مصمَّم حول واقعك.",
    "solutions.custom.composed":
      "مبني من الأجزاء الأربعة نفسها — الاستراتيجية وأنظمة التسويق وتقنية الأعمال وتمكين الذكاء الاصطناعي — بالنِّسَب التي يستدعيها تشخيص الأعمال.",
    "solutions.custom.price": "يُسعَّر بعد تشخيص الأعمال.",

    // How we work
    "solutions.work.heading": "كيف نعمل",
    "solutions.work.strategy.label": "الاستراتيجية",
    "solutions.work.strategy.body":
      "نُشخّص الأعمال، ونحدّد القيود، ونضع خارطة الطريق. الاستراتيجية ليست شيئاً نبيعه، بل الطريقة التي تُتّخذ بها كل القرارات الأخرى.",
    "solutions.work.divider": "وثلاث قدرات تُنفّذ التحوّل",
    "solutions.work.marketing.title": "أنظمة التسويق",
    "solutions.work.marketing.body":
      "بناء أنظمة استقطاب قابلة للقياس — بحث وإعلانات مدفوعة وتحويل وقياس مترابطة معاً بدلاً من تشغيلها منفصلة.",
    "solutions.work.tech.title": "تقنية الأعمال",
    "solutions.work.tech.body":
      "بناء وربط الأنظمة التي تدير بها الأعمال — تخطيط الموارد وإدارة العملاء ومنصّات الويب والجوال والأتمتة بينها.",
    "solutions.work.ai.title": "تمكين الذكاء الاصطناعي",
    "solutions.work.ai.body":
      "دمج الذكاء الاصطناعي في مسارات العمل الحقيقية ليستخدمه الفريق فعلاً، ضمن العمل الذي يؤدّيه أصلاً.",

    // Proof
    "solutions.proof.heading": "كيف يبدو هذا على أرض الواقع",
    "solutions.proof.sub": "تعاونات حقيقية، وما الذي تغيّر في الأعمال.",

    // FAQ
    "solutions.faq.heading": "أسئلة شائعة",
    "solutions.faq.q1": "كيف نعرف أي حل نحتاج؟",
    "solutions.faq.a1":
      "معظم الشركات لا تعرف، وهذا طبيعي. تشخيص الأعمال موجود للإجابة عن هذا السؤال قبل الالتزام بأي تنفيذ.",
    "solutions.faq.q2": "هل يجب أن نبدأ بـ Foundation؟",
    "solutions.faq.a2":
      "لا. Foundation مخصّص للشركات التي لا تستطيع بعد تسمية القيد. وإن كان واضحاً بالفعل، فنبدأ من حيث المشكلة. وكل حل يشمل مرحلة تشخيص أعمال في الحالتين.",
    "solutions.faq.q3": "لماذا السعر «يبدأ من»؟",
    "solutions.faq.a3":
      "لأن النطاق يعتمد على ما يكشفه تشخيص الأعمال. الرقم المعروض هو الحد الأدنى، والرقم النهائي يأتي مع العرض.",
    "solutions.faq.q4": "هل هذا اشتراك شهري؟",
    "solutions.faq.a4":
      "لا. هذه أنظمة تملكها — الشيفرة المصدرية والمنصّات والبيانات. أما الدعم المستمر فاتفاق منفصل إن أردته.",
    "solutions.faq.q5": "هل نملك ما تبنونه؟",
    "solutions.faq.a5":
      "نعم. تُنقل الملكية الفكرية وكامل الشيفرة المصدرية عند الإنجاز. لا تقييد، ولا رسوم للوصول إلى نظامك.",
    "solutions.faq.q6": "ماذا يحدث لقيمة Foundation إن مضينا في التنفيذ؟",
    "solutions.faq.a6":
      "تُخصم من قيمة المشروع، شريطة أن يبدأ التنفيذ خلال 90 يوماً وأن يستند إلى ذلك التشخيص. وهي ليست استرداداً — لقد اشتريت خارطة طريق، وتبقى لك سواء بنيت معنا أم لا.",
    "solutions.faq.q7": "هل يُباع التدريب على الذكاء الاصطناعي بشكل منفصل؟",
    "solutions.faq.a7":
      "لا. تمكين الذكاء الاصطناعي مدمج في كل حل، لأن التدريب غير المرتبط بسير عمل حقيقي لا يصمد بعد انتهائه بشهر.",

    // Final CTA
    "solutions.cta.heading": "لست متأكداً ما الذي يعيقك؟",
    "solutions.cta.body":
      "احجز مكالمة استراتيجية. سنخبرك بصراحة أين يقع القيد — وإن لم نكن الشريك المناسب، فسنقول ذلك أيضاً.",

    // --- SERVICE DETAIL (shared labels) ---
    "serviceDetail.backAll": "جميع الخدمات →",
    "serviceDetail.seeExamples": "شاهد أمثلة",
    "serviceDetail.notFound.title": "الخدمة غير موجودة",
    "serviceDetail.notFound.button": "عرض جميع الخدمات",
    "serviceDetail.related.title": "نتائج مثبتة",
    "serviceDetail.related.sub": "شاهد كيف ساعدنا شركات مثل شركتك.",
    "serviceDetail.related.viewPortfolio": "عرض كامل الأعمال",
    "serviceDetail.faqTitle": "أسئلة شائعة",
    "serviceDetail.lives.heading": "أين يقع هذا ضمن الحلول",
    "serviceDetail.lives.sub":
      "القدرة نفسها تظهر بعمق مختلف بحسب ما يكشفه تشخيص الأعمال. وهي ليست خدمة تُشترى منفردة.",
    "serviceDetail.lives.assessed": "يُقيَّم هنا",
    "serviceDetail.lives.built": "يُبنى هنا",
    "serviceDetail.cta.title": "لست متأكداً أن هذا هو القيد لديك؟",
    "serviceDetail.cta.body":
      "لهذا وُجد تشخيص الأعمال. ابدأ من الحلول واكتشف أين يُعاق نموك فعلاً.",
    "serviceDetail.cta.button": "استعرض الحلول",

    // Service Detail — SOFTWARE
    "serviceDetail.software.label": "تقنية الأعمال",
    "serviceDetail.software.title":
      "تقنية الأعمال: البرمجيات وتخطيط الموارد وإدارة العملاء والأتمتة",
    "serviceDetail.software.desc":
      "منصّات تخطيط الموارد وإدارة العملاء، ومواقع موجّهة للعملاء، وتطبيقات جوال، والأتمتة التي تربطها — مصمّمة لتملكها وتربطها وتوسّعها.",
    "serviceDetail.software.pain.heading":
      "حين تكون الأنظمة هي القيد، تبدو الصورة هكذا.",
    "serviceDetail.software.pain.item1":
      "ثلاثة فرق تحتفظ بثلاث نسخ من قائمة العملاء نفسها.",
    "serviceDetail.software.pain.item2":
      "كل تقرير يُصدَّر ويُلصق ويُطابَق يدوياً.",
    "serviceDetail.software.pain.item3":
      "الأدوات التي اشتريتها لا تتحدّث إلى بعضها، فصار الموظفون هم حلقة الربط.",
    "serviceDetail.software.pain.item4":
      "النظام الذي تعمل عليه بُني لشركة أصغر من شركتك الحالية.",
    "serviceDetail.software.build.heading": "ما الذي نبنيه",
    "serviceDetail.software.build.sub":
      "ستة أنظمة، والقيد الذي يزيله كلٌّ منها. وأيّها تحتاج يتحدّد من تشخيص الأعمال — فهذه ليست قائمة تختار منها.",
    "serviceDetail.software.build.1.title": "منصّات تخطيط الموارد ERP",
    "serviceDetail.software.build.1.pain":
      "المالية والمخزون والعمليات، لكلٍّ منها أرقامه الخاصة.",
    "serviceDetail.software.build.1.body":
      "عمود تشغيلي واحد — المشتريات والمخزون والمالية والتنفيذ على البيانات نفسها، ليحمل الرقم المعنى ذاته في كل قسم.",
    "serviceDetail.software.build.2.title": "منصّات إدارة العملاء CRM",
    "serviceDetail.software.build.2.pain":
      "لا أحد يعرف في أي مرحلة صفقةٌ ما دون أن يسأل صاحبها.",
    "serviceDetail.software.build.2.body":
      "مسار مبيعات يعمل داخله الفريق التجاري كاملاً — الحسابات والمراحل والأنشطة والسجل في مكان واحد، مع التقارير التي تجعل التنبّؤ ممكناً.",
    "serviceDetail.software.build.3.title": "أنظمة إدارة أداء تطوير الأعمال",
    "serviceDetail.software.build.3.pain":
      "أداء المبيعات يُقدَّر بالانطباعات بدل أن يُقاس.",
    "serviceDetail.software.build.3.body":
      "أهداف وحصص وأنشطة ونتائج تُتابَع لكل مندوب ولكل فريق، ليُدار تطوير الأعمال على أدلة لا على من يبدو أكثر انشغالاً.",
    "serviceDetail.software.build.4.title": "تطبيقات داخلية مخصّصة",
    "serviceDetail.software.build.4.pain":
      "عملية أساسية تعمل على جدول بيانات يحرسه شخص واحد.",
    "serviceDetail.software.build.4.body":
      "سير العمل الذي يميّز أعمالك، مبنيّاً كتطبيق حقيقي — بصلاحيات وسجلّ تدقيق وربط ببقية الأنظمة.",
    "serviceDetail.software.build.5.title": "بوابات العملاء وتطبيقات الجوال B2B",
    "serviceDetail.software.build.5.pain":
      "العملاء والشركاء يتّصلون بفريقك لمعلومات ينبغي أن يروها بأنفسهم.",
    "serviceDetail.software.build.5.body":
      "وصول مباشر للعملاء أو الشركاء أو الفرق الميدانية إلى طلباتهم وحالتها ومستنداتهم — بدل تمرير كل سؤال عبر شخص.",
    "serviceDetail.software.build.6.title": "منصّات الويب",
    "serviceDetail.software.build.6.pain":
      "الموقع مجرّد كتيّب تعريفي، منفصل عن كل ما خلفه.",
    "serviceDetail.software.build.6.body":
      "مواقع وتطبيقات ويب مرتبطة بأنظمتك من اليوم الأول، ليتحوّل إرسال النموذج إلى سجلّ في نظام إدارة العملاء لا إلى بريد يعيد أحدهم كتابته.",
    "serviceDetail.software.lives.foundation":
      "تُقيَّم منظومتك التقنية الحالية وحدودها وفجوات التقارير فيها. ولا يُبنى شيء في هذه المرحلة — الغاية هي تحديد ما ينبغي بناؤه.",
    "serviceDetail.software.lives.growth-engine":
      "الطبقة التجارية: موقع بنظام إدارة محتوى وصفحات هبوط تحوّل، ونظام إدارة عملاء مهيّأ لالتقاط العملاء المحتملين وإدارة المسار والمتابعة عبر فريق المبيعات.",
    "serviceDetail.software.lives.scale-infrastructure":
      "الطبقة التشغيلية: نظام إدارة العملاء كسجلّ موحّد عبر الأقسام، وتخطيط الموارد، وأنظمة إدارة أداء تطوير الأعمال، والتطبيقات المخصّصة والبوابات وتطبيقات الجوال.",
    "serviceDetail.software.faq.1.q": "هل نملك الشيفرة المصدرية؟",
    "serviceDetail.software.faq.1.a":
      "نعم. تُنقل الشيفرة المصدرية كاملة والملكية الفكرية عند الإنجاز. لا تقييد، ولا رسوم للوصول إلى نظامك.",
    "serviceDetail.software.faq.2.q": "هل يمكن ربطه بأدواتنا الحالية؟",
    "serviceDetail.software.faq.2.a":
      "هذا هو المقصود. نربطه بنظام إدارة العملاء وتخطيط الموارد وأدواتك الحالية من اليوم الأول.",
    "serviceDetail.software.faq.3.q": "كم يستغرق البناء؟",
    "serviceDetail.software.faq.3.a":
      "يعتمد على النطاق — نعطيك جدولاً زمنياً محدّداً في العرض، لا مدى غامضاً.",
    "serviceDetail.software.faq.4.q": "ماذا لو كان لدينا نظام بالفعل؟",
    "serviceDetail.software.faq.4.a":
      "نعيد بناء ما لديك أو نوسّعه، بحسب ما يناسب وضعك فعلاً.",

    // Service Detail — DIGITAL MARKETING
    "serviceDetail.dm.label": "أنظمة التسويق",
    "serviceDetail.dm.title":
      "أنظمة التسويق: تحسين محركات البحث والإعلانات المدفوعة والتحويل",
    "serviceDetail.dm.desc":
      "تحسين محركات البحث والحملات المدفوعة واستراتيجية التحويل، مترابطة في محرّك واحد قابل للقياس يجلب مشترين مؤهّلين — لا زيارات بلا قيمة.",
    "serviceDetail.dm.pain.heading":
      "حين يكون الاستقطاب هو القيد، تبدو الصورة هكذا.",
    "serviceDetail.dm.pain.item1":
      "العملاء المحتملون يصلون على دفعات لا يمكن توقّعها.",
    "serviceDetail.dm.pain.item2":
      "تنفق على الإعلانات ولا تستطيع تحديد أي إنفاق جاء بعميل.",
    "serviceDetail.dm.pain.item3":
      "الزيارات ترتفع. أما الطلبات المؤهّلة فلا.",
    "serviceDetail.dm.pain.item4": "المتابعة تعتمد على تذكّر أحدهم.",
    "serviceDetail.dm.build.heading": "ما الذي نبنيه",
    "serviceDetail.dm.build.sub":
      "خمسة أجزاء من نظام استقطاب واحد. منفصلةً تتنافس على الميزانية، ومترابطةً تتراكم نتائجها.",
    "serviceDetail.dm.build.1.title": "استراتيجية التسويق والتخطيط",
    "serviceDetail.dm.build.1.pain":
      "اختيرت القنوات واحدة تلو الأخرى، بحسب من قدّم العرض أخيراً.",
    "serviceDetail.dm.build.1.body":
      "أي المشترين، وأي القنوات، وأي العروض، وبأي ترتيب — وما الذي تتوقّف عنه. إنها الخطة التي تنفّذها الأجزاء الأربعة الأخرى.",
    "serviceDetail.dm.build.2.title": "تحسين محركات البحث بنيّة الشراء",
    "serviceDetail.dm.build.2.pain":
      "تتصدّر كلمات تجلب قرّاءً لا مشترين.",
    "serviceDetail.dm.build.2.body":
      "استهداف عمليات البحث التي يجريها من لديه ميزانية وموعد نهائي، ثم بناء الصفحات والأساس التقني للحفاظ على تلك المراكز.",
    "serviceDetail.dm.build.3.title": "شراء الوسائط",
    "serviceDetail.dm.build.3.pain":
      "الإنفاق الإعلاني فاتورة شهرية لا يستطيع أحد تبريرها.",
    "serviceDetail.dm.build.3.body":
      "حملات على Google وMeta وLinkedIn مبنية حول كلفة العميل المحتمل المؤهّل لا حول النقرات، مع بنية الحسابات واختبار المحتوى الذي يخفض تلك الكلفة.",
    "serviceDetail.dm.build.4.title": "تحسين معدّل التحويل",
    "serviceDetail.dm.build.4.pain":
      "تدفع لتوجيه زيارات إلى صفحات تفقدها.",
    "serviceDetail.dm.build.4.body":
      "صفحات هبوط ونماذج وعروض يُعاد بناؤها واختبارها على سلوك حقيقي، ليُنتج الإنفاق نفسه طلبات أكثر.",
    "serviceDetail.dm.build.5.title": "استراتيجية المسار والقياس",
    "serviceDetail.dm.build.5.pain":
      "التقرير يقول إن الحملة نجحت. والمبيعات تقول إن العملاء لم يكونوا مؤهّلين.",
    "serviceDetail.dm.build.5.body":
      "قياس من أول تفاعل حتى إغلاق الصفقة، لتُقيَّم القناة بالإيرادات لا بما تقوله منصّة الإعلانات عن نفسها.",
    "serviceDetail.dm.lives.foundation":
      "أين يحقّق تحسين محركات البحث والإعلانات المدفوعة والمسار والتحويل عائداً في أعمالك، وبأي ترتيب. تقييم فقط — لا يُشغَّل شيء في هذه المرحلة.",
    "serviceDetail.dm.lives.growth-engine":
      "الخمسة جميعاً، مبنيّة ومُشغَّلة كمحرّك استقطاب واحد، مع أصول التحويل ونظام إدارة العملاء الذي يحتاجه النظام ليعمل.",
    "serviceDetail.dm.faq.1.q": "ما الحد الأدنى ليعمل هذا؟",
    "serviceDetail.dm.faq.1.a":
      "نحن صرحاء بشأن الملاءمة — نخبرك مباشرة إن كانت الميزانية تبرّر العمل، قبل أن تلتزم.",
    "serviceDetail.dm.faq.2.q": "متى تظهر النتائج؟",
    "serviceDetail.dm.faq.2.a":
      "الإعلانات المدفوعة تتحرّك خلال أسابيع؛ وتحسين محركات البحث يحتاج أشهراً لزيارات ذات أثر. نضع توقّعات واقعية قبل البدء.",
    "serviceDetail.dm.faq.3.q": "هل تضمنون النتائج؟",
    "serviceDetail.dm.faq.3.a":
      "نضمن عملنا ومنهجيتنا، لا ظروف السوق. تُتّفق الأهداف مسبقاً ونكون مسؤولين أمامها.",

    // Service Detail — AI TRAINING
    "serviceDetail.ai.label": "تمكين الذكاء الاصطناعي",
    "serviceDetail.ai.title": "تمكين الذكاء الاصطناعي وتدريب الفرق عليه",
    "serviceDetail.ai.desc":
      "تمكين الذكاء الاصطناعي لا يُباع منفرداً — بل هو مدمج في كل حل. استخدامات خاصة بكل قسم، وتبنٍّ داخل سير العمل، وتمكين عملي للفريق، ليصبح الذكاء الاصطناعي جزءاً من العمل اليومي لا شريحة في عرض تدريبي.",
    "serviceDetail.ai.pain.heading":
      "حين يكون تبنّي الذكاء الاصطناعي هو القيد، تبدو الصورة هكذا.",
    "serviceDetail.ai.pain.item1":
      "الجميع يتحدّث عن الذكاء الاصطناعي. ولا أحد في الفريق يستخدمه في عمل حقيقي.",
    "serviceDetail.ai.pain.item2": "تدفع مقابل تراخيص لا يفتحها أحد.",
    "serviceDetail.ai.pain.item3":
      "جرّبه الفريق مرة، فجاءته إجابة سيئة، فعاد إلى الطريقة القديمة.",
    "serviceDetail.ai.pain.item4":
      "لا تستطيع تحديد أي العمليات تستحق الأتمتة فعلاً.",
    "serviceDetail.ai.build.heading": "كيف يُنفَّذ العمل",
    "serviceDetail.ai.build.sub":
      "تمكين الذكاء الاصطناعي طبقة داخل الحلول الأخرى، لا شراءً منفرداً. وهذه هي الصيغ التي تأخذها هذه الطبقة.",
    "serviceDetail.ai.build.1.title": "جلسات استراتيجية للقيادات",
    "serviceDetail.ai.build.1.pain":
      "يُعرض على القيادة ذكاء اصطناعي دون معيار للحكم عليه.",
    "serviceDetail.ai.build.1.body":
      "أين يغيّر الذكاء الاصطناعي اقتصاديات أعمالك وأين لا يفعل، ليُتّخذ قرار الاستثمار على الأساس نفسه الذي تُتّخذ به بقية القرارات.",
    "serviceDetail.ai.build.2.title": "برامج تبنٍّ على مستوى الأقسام",
    "serviceDetail.ai.build.2.pain":
      "التدريب العام يعلّم أدوات لا يحتاجها عمل أحد.",
    "serviceDetail.ai.build.2.body":
      "استخدامات مبنية على ما يفعله قسم بعينه كل أسبوع — المبيعات والمالية والعمليات وخدمة العملاء — بالأدوات المفتوحة أمامه أصلاً.",
    "serviceDetail.ai.build.3.title": "ورش دمج عملية في سير العمل",
    "serviceDetail.ai.build.3.pain":
      "يخرج الناس من التدريب معجبين ولا يغيّرون شيئاً.",
    "serviceDetail.ai.build.3.body":
      "جلسات عمل على مهام حيّة، لينتهي الفريق والذكاء الاصطناعي داخل عملية يديرها فعلاً، لا بمجرّد ملاحظات.",
    "serviceDetail.ai.build.4.title": "دعم التطبيق",
    "serviceDetail.ai.build.4.pain":
      "يخفت التبنّي في الشهر الذي يلي انتهاء التدريب.",
    "serviceDetail.ai.build.4.body":
      "مواكبة حتى تصبح الطريقة الجديدة في العمل هي الطريقة المعتادة — وهي الجزء الذي يقرّر بقاء ما سبق من عدمه.",
    "serviceDetail.ai.lives.foundation":
      "أي الأقسام تستفيد أولاً، وأي مسارات العمل ينبغي أتمتتها، وأين يصنع الذكاء الاصطناعي أثراً قابلاً للقياس. تحديد فقط.",
    "serviceDetail.ai.lives.growth-engine":
      "الفرق التجارية: استخدامات خاصة بكل قسم، وتدريب الموظفين، ومسارات عمل مدعومة بالذكاء الاصطناعي داخل العمليات القائمة.",
    "serviceDetail.ai.lives.scale-infrastructure":
      "تبنٍّ على مستوى الشركة، مع ذكاء اصطناعي مدمج في أنظمة الأعمال نفسها لا ملحق بها.",
    "serviceDetail.ai.faq.1.q": "هل هذا تدريب عام على الذكاء الاصطناعي؟",
    "serviceDetail.ai.faq.1.a":
      "لا. البرامج مبنية حول سير عملك وأدواتك الفعلية، لا منهجاً جاهزاً.",
    "serviceDetail.ai.faq.2.q": "لمن هذا التدريب؟",
    "serviceDetail.ai.faq.2.a":
      "للقيادات والفرق — نقدّم مسارين: على المستوى الاستراتيجي وعلى المستوى العملي.",
    "serviceDetail.ai.faq.3.q": "بماذا نخرج في النهاية؟",
    "serviceDetail.ai.faq.3.a":
      "أشخاص يستخدمون الذكاء الاصطناعي في عمل حقيقي، إضافة إلى سير عمل موثّق يحتفظ به فريقك.",

    // --- PORTFOLIO ---
    "portfolio.title": "أعمال مختارة",
    "portfolio.sub":
      "نخبة من البنية الرقمية وأنظمة النمو المصمّمة لروّاد السوق.",
    "portfolio.empty": "لا توجد مشاريع في هذه الفئة.",
    // Portfolio pillar deep-link filter (?service=<pillar>)
    "portfolio.filter.showing": "عرض",
    "portfolio.filter.clear": "عرض جميع الأعمال",
    "portfolio.pillar.ai-training": "التدريب على الذكاء الاصطناعي",
    "portfolio.pillar.digital-marketing": "التسويق الرقمي",
    "portfolio.pillar.software": "البرمجيات",

    // --- PROJECT DETAIL ---
    "projectDetail.back": "العودة إلى الأعمال",
    "projectDetail.notFound": "المشروع غير موجود",
    "projectDetail.mobileCta": "ابدأ مشروعاً مثل هذا",
    "projectDetail.challenge": "المشكلة",
    "projectDetail.diagnosis": "التشخيص",
    "projectDetail.solution": "النظام",
    "projectDetail.techStack": "التقنيات المستخدمة",
    "projectDetail.startProject": "ابدأ مشروعك",

    // --- CONTACT ---
    "contact.title": "لنتحدث",
    "contact.sub":
      "أخبرنا عن أعمالك وما الذي يبطّئها، وسنخبرك بصراحة إن كنا نستطيع مساعدتك.",
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
    "contact.quick.body":
      "نردّ عادةً على كل الاستفسارات خلال 24 ساعة في أيام العمل. وإن كان الأمر عاجلاً، اذكر ذلك في رسالتك.",
    "contact.toast.success":
      "تم إرسال الرسالة — سنعاود التواصل معك خلال 24 ساعة.",
    "contact.toast.error":
      "حدث خطأ ما — حاول مجدداً، أو راسلنا مباشرةً عبر البريد.",

    // --- FOOTER ---
    "footer.tagline": "نبني الأنظمة التي تقف خلف نمو الأعمال.",
    "footer.services": "الخدمات",
    "footer.company": "الشركة",
    "footer.connectShort": "تواصل",
    "footer.stayConnected": "ابقَ على تواصل",
    "footer.link.aiTraining": "تمكين الذكاء الاصطناعي",
    "footer.link.digitalMarketing": "أنظمة التسويق",
    "footer.link.software": "تقنية الأعمال",
    "footer.link.about": "من نحن",
    "footer.link.work": "الأعمال",
    "footer.link.contact": "تواصل",
    "footer.newsletter.text":
      "ملاحظات عملية حول الذكاء الاصطناعي والتسويق والأنظمة التي تربطها — إلى بريدك مباشرة.",
    "footer.newsletter.placeholder": "أدخل بريدك الإلكتروني",
    "footer.location": "وايومنغ، الولايات المتحدة الأمريكية",
    "footer.copyright": "شركة OmniflowAI LLC. جميع الحقوق محفوظة.",
    "footer.toast.subscribed": "شكراً — تم اشتراكك.",
    "footer.toast.error": "حدث خطأ ما، حاول مجدداً.",

    // --- ABOUT (team/founder attribution stays frozen: [TODO(team-final)]) ---
    "about.badge": "من نحن",
    "about.headline.lead": "مهندسون يفهمون",
    "about.headline.highlight": "الأعمال.",
    "about.sub":
      "‏OmniflowAI شريك في التحول الرقمي يقوم على قناعة واحدة: معظم الشركات لا تحتاج مزيداً من الأدوات — بل تحتاج الأنظمة الصحيحة، مبنية بإتقان ومترابطة كما ينبغي.",
    "about.story.heading": "أسّسنا OmniflowAI لسدّ فجوة.",
    "about.story.p1":
      "تُباع لكثير من الشركات أجزاء غير مترابطة — موقع هنا، وحملة إعلانية هناك، وأداة لا يدمجها أحد — وتُترك لتجمّعها بنفسها. والنتيجة تشتّت مكلف: برمجيات لا تتحاور، وتسويق لا يحوّل، وغياب رؤية واضحة لما ينجح.",
    "about.story.p2":
      "نحن نفعل العكس. نبدأ من طريقة عمل شركتك الفعلية، ثم نصمّم ونبني الأنظمة التي تلائمها — برمجيات وتسويق وأتمتة تعمل ككلٍّ واحد. أنت تملك كل ما نبنيه. لا احتكار، ولا تبعية، ولا صناديق مغلقة.",
    "about.story.p3":
      "نعمل كمهندسين لا كمنفّذي طلبات: يهمّنا تحقيق نتائج تستطيع قياسها، وأنظمة تدوم بعد انتهاء التعاون، وتسليمك المفاتيح في النهاية.",
    "about.team.heading": "تعرّف على فريق البناء",
    "about.team.sub":
      "لا إسناد خارجي. لا مبتدئون يتعلّمون على حسابك. فقط كفاءات خبيرة مكرّسة لنموّك.",
    "about.values.1.title": "الأنظمة قبل الخدمات",
    "about.values.1.desc":
      "لا نبيع مخرجات منعزلة. كل ما نبنيه مصمَّم ليترابط وتتضاعف قيمته.",
    "about.values.2.title": "الملكية لك",
    "about.values.2.desc":
      "نقل كامل للشيفرة المصدرية والملكية الفكرية في كل مشروع. ما تدفع مقابله يصبح ملكك.",
    "about.values.3.title": "بقيادة هندسية",
    "about.values.3.desc":
      "تتعامل مباشرةً مع من يبنون أنظمتك، لا مع مدير حسابات ينقل الرسائل.",
    "about.values.4.title": "نُقاس بالنتائج",
    "about.values.4.desc":
      "نربط عملنا بنتائج الأعمال — إيرادات وكفاءة واستقطاب — لا بساعات مسجّلة أو مخرجات مُسلّمة.",
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
