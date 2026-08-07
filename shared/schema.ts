import {
  pgTable, text, serial, integer, jsonb, boolean, timestamp, varchar, json, index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { CATEGORIES, CONTACT_SERVICES, type Category, type ContactService } from "./taxonomy";

// --- EXISTING: Contact Form ---
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.enum(CONTACT_SERVICES),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// --- Newsletter (footer email capture → newsletter lead). Email only. ---
export const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});
export type NewsletterData = z.infer<typeof newsletterSchema>;

// --- SESSION STORE (owned by connect-pg-simple, NOT by this file) ---
//
// This table is created at runtime by connect-pg-simple's `createTableIfMissing`
// and holds live admin logins. It is declared here for one reason only: without
// it, `drizzle-kit push` sees a table in the database that is absent from the
// schema and offers to DELETE it on every push — a data-loss prompt in front of
// real sessions, which meant no new table could be added without either
// dropping everyone's login or aborting the whole batch.
//
// The definition below mirrors connect-pg-simple's own table.sql EXACTLY
// (node_modules/connect-pg-simple/table.sql):
//
//   "sid"    varchar NOT NULL COLLATE "default"  → PRIMARY KEY
//   "sess"   json NOT NULL                        (json, not jsonb)
//   "expire" timestamp(6) NOT NULL                (no time zone)
//   CREATE INDEX "IDX_session_expire" ON "session" ("expire")
//
// Do not "improve" these types. Drizzle diffs this against the live table, so
// any drift here turns into an ALTER against the session store on the next
// push. Nothing in the app reads this table through Drizzle — express-session
// owns it entirely.
export const session = pgTable(
  "session",
  {
    sid: varchar("sid").primaryKey(),
    sess: json("sess").notNull(),
    expire: timestamp("expire", { precision: 6 }).notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// --- EXISTING: Admin Users ---
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createInsertSchema(users);
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// --- UPDATED: Portfolio Projects ---
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  client: text("client").notNull(),
  category: text("category").$type<Category>().notNull(), 
  description: text("description").notNull(),
  // Portfolio narrative: Problem → Diagnosis → System → Outcome (Phase 3).
  challenge: text("challenge").notNull(),        // Problem — what was broken
  diagnosis: text("diagnosis"),                  // Diagnosis — the root cause we found (nullable)
  solution: text("solution").notNull(),          // System — what we built
  // results[] below = Outcome — real, measured results (never fabricated)
  results: jsonb("results").$type<string[]>().notNull(),
  technologies: jsonb("technologies").$type<string[]>().notNull(),
  image: text("image").notNull(),
  // Free-text sub-categorization typed per project (e.g. "ERP", "Lead Gen",
  // "RAG chatbot"). Finer than `category`; not from a fixed taxonomy.
  // Defaulted to [] so existing rows backfill cleanly (backwards-compatible).
  // NOTE: the primary service pillar is NOT stored — it is derived from
  // `category` via CATEGORY_TO_PILLAR (taxonomy is the single source of truth).
  tags: jsonb("tags").$type<string[]>().default([]).notNull(),

  // Feature Flags
  isFeatured: boolean("is_featured").default(false).notNull(),            // Home Page
  isServiceShowcase: boolean("is_service_showcase").default(false).notNull() // Services Page Hero
});

// Category validation is sourced from shared/taxonomy.ts (single source of truth).
export const insertProjectSchema = createInsertSchema(projects, {
  category: z.enum(CATEGORIES),
  results: z.array(z.string()),
  technologies: z.array(z.string()),
  tags: z.array(z.string()).optional(),
});
export const selectProjectSchema = createInsertSchema(projects, {
  category: z.enum(CATEGORIES),
  results: z.array(z.string()),
  technologies: z.array(z.string()),
  tags: z.array(z.string()).optional(),
});
// `category` is typed via projects.category.$type<Category>() — sourced from taxonomy.
export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// --- LEADS (contact form submissions + newsletter signups) ---
export const LEAD_STATUSES = ["new", "read", "archived"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

// Where a lead came from. Defaulted to "contact" so existing rows backfill
// cleanly; newsletter signups are tagged "newsletter" to distinguish them.
export const LEAD_SOURCES = ["contact", "newsletter"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  // name / service / message are nullable: a newsletter lead carries only an
  // email + source. The rest is genuinely absent (null), never faked.
  name: text("name"),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  service: text("service").$type<ContactService>(),
  message: text("message"),
  source: text("source").$type<LeadSource>().default("contact").notNull(),
  status: text("status").$type<LeadStatus>().default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leads);
export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// --- ARTICLES (/articles) ---
// Authored one language at a time, like every other piece of DB content — the
// EN/AR parity rule applies to the i18n dictionary, not to CMS rows. `language`
// exists because the GTM splits content between Egypt- and Saudi-facing posts,
// so Arabic articles are expected; the index filters to the reader's language.
export const ARTICLE_LANGUAGES = ["en", "ar"] as const;
export type ArticleLanguage = (typeof ARTICLE_LANGUAGES)[number];

// The one funnel step out of an article, chosen per article rather than left to
// whether the author remembered to link. Solution ids match CONTACT_SERVICES /
// the /services deep-link anchors.
export const ARTICLE_SOLUTIONS = [
  "foundation",
  "growth-engine",
  "scale-infrastructure",
  "custom",
] as const;
export type ArticleSolution = (typeof ARTICLE_SOLUTIONS)[number];

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  // The URL. Immutable in practice once published — changing it drops whatever
  // search ranking and inbound links the article has earned.
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  // Doubles as the card summary and the meta description / LinkedIn preview
  // text, so it is required rather than derived from the body.
  excerpt: text("excerpt").notNull(),
  // Base64 data URI, same as projects.image (server/objectStorage.ts).
  coverImage: text("cover_image").notNull(),
  // Markdown. Rendered with @tailwindcss/typography, already a dependency.
  body: text("body").notNull(),
  language: text("language").$type<ArticleLanguage>().default("en").notNull(),
  published: boolean("published").default(false).notNull(),
  // Set when the article is first published; drives ordering and the byline
  // date. Null while it is a draft.
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // Optional end-of-article funnel hops. Both nullable: an article may point at
  // a case study, a solution, both, or neither.
  relatedProjectId: integer("related_project_id").references(() => projects.id, {
    onDelete: "set null",
  }),
  relatedSolution: text("related_solution").$type<ArticleSolution>(),
});

const articleFields = {
  slug: z
    .string()
    .min(1)
    // Lowercase, hyphenated, no leading/trailing hyphen — the admin generates
    // this from the title but leaves it editable, so it is validated here too.
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase words separated by hyphens"),
  language: z.enum(ARTICLE_LANGUAGES),
  relatedSolution: z.enum(ARTICLE_SOLUTIONS).nullable().optional(),
  relatedProjectId: z.number().int().positive().nullable().optional(),
  publishedAt: z.coerce.date().nullable().optional(),
} as const;

export const insertArticleSchema = createInsertSchema(articles, articleFields).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateArticleSchema = insertArticleSchema.partial();

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

/** Index-card shape: everything the list needs, and never the body. Article
 *  bodies carry base64 images, so selecting them for a list would move
 *  megabytes to render a grid of cards. */
export type ArticleCard = Pick<
  Article,
  "id" | "slug" | "title" | "excerpt" | "coverImage" | "language" | "published" | "publishedAt"
>;