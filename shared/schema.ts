import { pgTable, text, serial, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
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

  // Feature Flags
  isFeatured: boolean("is_featured").default(false).notNull(),            // Home Page
  isServiceShowcase: boolean("is_service_showcase").default(false).notNull() // Services Page Hero
});

// Category validation is sourced from shared/taxonomy.ts (single source of truth).
export const insertProjectSchema = createInsertSchema(projects, {
  category: z.enum(CATEGORIES),
  results: z.array(z.string()),
  technologies: z.array(z.string()),
});
export const selectProjectSchema = createInsertSchema(projects, {
  category: z.enum(CATEGORIES),
  results: z.array(z.string()),
  technologies: z.array(z.string()),
});
// `category` is typed via projects.category.$type<Category>() — sourced from taxonomy.
export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// --- LEADS (contact form submissions) ---
export const LEAD_STATUSES = ["new", "read", "archived"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  service: text("service").$type<ContactService>().notNull(),
  message: text("message").notNull(),
  status: text("status").$type<LeadStatus>().default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leads);
export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// --- NEWSLETTER SUBSCRIBERS (capture only; no emails are sent to them) ---
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSubscriberSchema = createInsertSchema(subscribers);
export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = typeof subscribers.$inferInsert;