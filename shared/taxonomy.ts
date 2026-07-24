// =============================================================================
// SINGLE SOURCE OF TRUTH for the OmniflowAI pillar/category taxonomy.
// Every other file (schema, pages, admin, server) MUST import from here.
// Do NOT hardcode pillar/category slugs or labels anywhere else.
// (Layer 1 — structural migration.)
// =============================================================================

// --- PILLARS (top-level services) ---
export const PILLARS = ["ai-training", "digital-marketing", "software"] as const;
export type Pillar = (typeof PILLARS)[number];

export const PILLAR_LABELS: Record<Pillar, string> = {
  "ai-training": "AI Training",
  "digital-marketing": "Digital Marketing",
  software: "Software",
};

// --- PORTFOLIO CATEGORIES (capability-level; projects are tagged with these) ---
export const CATEGORIES = [
  "business-systems",
  "web",
  "mobile",
  "automation",
  "digital-marketing",
  "ai-training",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  "business-systems": "Business Systems",
  web: "Web",
  mobile: "Mobile",
  automation: "Automation & AI",
  "digital-marketing": "Digital Marketing",
  "ai-training": "AI Training",
};

// --- CATEGORY → PARENT PILLAR ---
export const CATEGORY_TO_PILLAR: Record<Category, Pillar> = {
  "business-systems": "software",
  web: "software",
  mobile: "software",
  automation: "software",
  "digital-marketing": "digital-marketing",
  "ai-training": "ai-training",
};

// --- PORTFOLIO FILTER TAB ORDER (left → right). "All" is handled separately. ---
export const PORTFOLIO_TAB_ORDER = [
  "business-systems",
  "web",
  "mobile",
  "automation",
  "digital-marketing",
  "ai-training",
] as const satisfies readonly Category[];

// --- CONTACT FORM "service" options = the three pillars + "other" ---
export const CONTACT_SERVICES = [...PILLARS, "other"] as const;
export type ContactService = (typeof CONTACT_SERVICES)[number];

// --- SHARED CONTACT EMAIL ---
// TODO(email-final): placeholder — replace with real address before launch
export const CONTACT_EMAIL = "contact@omniflowai.net";

// --- SOCIAL LINKS (footer) ---
// TODO(social-final): fill in real profile URLs. Empty entries render no icon.
export const SOCIAL_LINKS: Record<"twitter" | "github" | "linkedin", string> = {
  twitter: "",
  github: "",
  linkedin: "",
};

// --- LEGACY → NEW CATEGORY MIGRATION MAP ---
// Used to migrate any pre-existing DB rows from the old taxonomy.
// build → web, attract → digital-marketing, automate → automation.
export const LEGACY_CATEGORY_MAP: Record<string, Category> = {
  build: "web",
  attract: "digital-marketing",
  automate: "automation",
};
