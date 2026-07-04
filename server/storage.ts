import {
  users, projects, leads, subscribers,
  type User, type InsertUser, type Project, type InsertProject,
  type Lead, type LeadStatus, type ContactFormData,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, ne, desc } from "drizzle-orm";
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

  // --- Leads (contact form) ---
  createLead(data: ContactFormData): Promise<Lead>;
  listLeads(): Promise<Lead[]>;
  updateLeadStatus(id: number, status: LeadStatus): Promise<Lead | undefined>;
  deleteLead(id: number): Promise<boolean>;

  // --- Newsletter subscribers ---
  createSubscriber(email: string): Promise<void>;
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

  // --- Subscribers ---
  async createSubscriber(email: string): Promise<void> {
    // Ignore duplicates gracefully (unique email) — don't leak which emails exist.
    await db.insert(subscribers).values({ email }).onConflictDoNothing();
  }
}

export const storage = new DatabaseStorage();