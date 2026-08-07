import {
  users, projects, leads, articles,
  type User, type InsertUser, type Project, type InsertProject,
  type Lead, type LeadStatus, type ContactFormData,
  type Article, type ArticleCard, type InsertArticle,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, ne, desc, sql } from "drizzle-orm";
import type { Category } from "@shared/taxonomy";

export interface IStorage {
  // --- User / Auth Methods ---
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // --- Portfolio Project Methods ---
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // --- New Showcase Methods ---
  getShowcaseProjects(): Promise<Project[]>;
  getProjectsByCategory(category: string): Promise<Project[]>;

  // --- Leads (contact form + newsletter) ---
  createLead(data: ContactFormData): Promise<Lead>;
  createNewsletterLead(email: string): Promise<Lead>;
  listLeads(): Promise<Lead[]>;
  updateLeadStatus(id: number, status: LeadStatus): Promise<Lead | undefined>;
  deleteLead(id: number): Promise<boolean>;

  // --- Articles ---
  // The list methods return ArticleCard, never the body: bodies carry base64
  // images, so selecting them to render a grid of cards would move megabytes.
  listPublishedArticles(): Promise<ArticleCard[]>;
  listAllArticles(): Promise<ArticleCard[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getArticle(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // --- Users ---
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // --- Projects ---

  // Helper: Ensure only one showcase project exists per category
  private async ensureUniqueShowcase(category: string, excludeId?: number) {
    await db.update(projects)
      .set({ isServiceShowcase: false })
      .where(
        and(
          eq(projects.category, category as Category),
          eq(projects.isServiceShowcase, true),
          excludeId ? ne(projects.id, excludeId) : undefined
        )
      );
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    // If this is a showcase, unset others in the same category first
    if (insertProject.isServiceShowcase) {
      await this.ensureUniqueShowcase(insertProject.category);
    }

    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: number, projectUpdate: Partial<InsertProject>): Promise<Project | undefined> {
    // If setting as showcase, unset others in the same category
    if (projectUpdate.isServiceShowcase && projectUpdate.category) {
      await this.ensureUniqueShowcase(projectUpdate.category, id);
    } else if (projectUpdate.isServiceShowcase) {
      // If category isn't in update, fetch current project to get category
      const current = await this.getProject(id);
      if (current) {
        await this.ensureUniqueShowcase(current.category, id);
      }
    }

    const [project] = await db
      .update(projects)
      .set(projectUpdate)
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async deleteProject(id: number): Promise<boolean> {
    const [deleted] = await db.delete(projects).where(eq(projects.id, id)).returning();
    return !!deleted;
  }

  // --- New Methods ---
  async getShowcaseProjects(): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.isServiceShowcase, true));
  }

  async getProjectsByCategory(category: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.category, category as Category));
  }

  // --- Leads ---
  async createLead(data: ContactFormData): Promise<Lead> {
    const [lead] = await db.insert(leads).values({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      service: data.service,
      message: data.message,
      source: "contact",
    }).returning();
    return lead;
  }

  // Newsletter signup: email only. name/service/message stay null (absent, not
  // faked); tagged source="newsletter" so admin can distinguish it.
  async createNewsletterLead(email: string): Promise<Lead> {
    const [lead] = await db.insert(leads).values({
      email,
      source: "newsletter",
    }).returning();
    return lead;
  }

  async listLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async updateLeadStatus(id: number, status: LeadStatus): Promise<Lead | undefined> {
    const [lead] = await db.update(leads).set({ status }).where(eq(leads.id, id)).returning();
    return lead;
  }

  async deleteLead(id: number): Promise<boolean> {
    const [deleted] = await db.delete(leads).where(eq(leads.id, id)).returning();
    return !!deleted;
  }

  // --- Articles ---

  /** Card columns only — deliberately never `body`. See IStorage. */
  private static readonly cardColumns = {
    id: articles.id,
    slug: articles.slug,
    title: articles.title,
    excerpt: articles.excerpt,
    coverImage: articles.coverImage,
    language: articles.language,
    published: articles.published,
    publishedAt: articles.publishedAt,
  };

  async listPublishedArticles(): Promise<ArticleCard[]> {
    return await db
      .select(DatabaseStorage.cardColumns)
      .from(articles)
      .where(eq(articles.published, true))
      .orderBy(desc(articles.publishedAt));
  }

  /** Admin list: drafts included, newest activity first. */
  async listAllArticles(): Promise<ArticleCard[]> {
    return await db
      .select(DatabaseStorage.cardColumns)
      .from(articles)
      .orderBy(desc(articles.updatedAt));
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.slug, slug));
    return article;
  }

  async getArticle(id: number): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article;
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db
      .insert(articles)
      .values({ ...insertArticle, publishedAt: stampPublishedAt(insertArticle) })
      .returning();
    return article;
  }

  async updateArticle(
    id: number,
    articleUpdate: Partial<InsertArticle>,
  ): Promise<Article | undefined> {
    // Only stamp publishedAt on the transition to published — re-publishing an
    // edited article must not move it back to the top of the index.
    const current = await this.getArticle(id);
    if (!current) return undefined;

    const [article] = await db
      .update(articles)
      .set({
        ...articleUpdate,
        publishedAt: stampPublishedAt(articleUpdate, current),
        updatedAt: sql`now()`,
      })
      .where(eq(articles.id, id))
      .returning();
    return article;
  }

  async deleteArticle(id: number): Promise<boolean> {
    const [deleted] = await db.delete(articles).where(eq(articles.id, id)).returning();
    return !!deleted;
  }
}

/**
 * `publishedAt` is the first-publication date: it drives index ordering and the
 * byline, so it is set once and then left alone. An explicit value from the
 * admin always wins (back-dating an import is legitimate).
 */
function stampPublishedAt(
  update: Partial<InsertArticle>,
  current?: Article,
): Date | null | undefined {
  if (update.publishedAt !== undefined) return update.publishedAt;
  const willBePublished = update.published ?? current?.published ?? false;
  if (!willBePublished) return current ? current.publishedAt : null;
  return current?.publishedAt ?? new Date();
}

export const storage = new DatabaseStorage();