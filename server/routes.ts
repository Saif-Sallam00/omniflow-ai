import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { pool } from "./db";
import {
  contactFormSchema,
  insertProjectSchema,
  LEAD_STATUSES,
  type Lead,
} from "@shared/schema";
import { CONTACT_EMAIL } from "@shared/taxonomy";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { z } from "zod";
import { Resend } from "resend";
import { ObjectStorageService } from "./objectStorage";
import multer from "multer";

const scryptAsync = promisify(scrypt);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedPasswordBuf = Buffer.from(hashed, "hex");
  const suppliedPasswordBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
}

async function seedAdminUser() {
  const adminUsername = "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@admin1234";
  if (!process.env.ADMIN_PASSWORD) {
    console.warn(
      "[auth] ADMIN_PASSWORD not set — seeding the admin user with the built-in default. Set ADMIN_PASSWORD before production.",
    );
  }
  const existing = await storage.getUserByUsername(adminUsername);
  if (!existing) {
    const hashedPassword = await hashPassword(adminPassword);
    await storage.createUser({ username: adminUsername, password: hashedPassword });
  }
}

// Fire-and-forget lead notification. NEVER blocks or fails the API response.
// Skipped silently when RESEND_API_KEY is not configured.
async function notifyNewLead(lead: Lead) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[leads] RESEND_API_KEY not set — skipping email notification (lead saved to DB).");
    return;
  }
  try {
    const resend = new Resend(apiKey);
    const to = process.env.NOTIFY_EMAIL || CONTACT_EMAIL;
    await resend.emails.send({
      from: "OmniflowAI Leads <onboarding@resend.dev>",
      to,
      subject: `New lead: ${lead.name} (${lead.service})`,
      text: [
        `Name: ${lead.name}`,
        `Email: ${lead.email}`,
        `Phone: ${lead.phone || "-"}`,
        `Company: ${lead.company || "-"}`,
        `Service: ${lead.service}`,
        "",
        "Message:",
        lead.message,
      ].join("\n"),
    });
    console.log(`[leads] Notification email sent to ${to}.`);
  } catch (err) {
    console.error("[leads] Email notification failed (lead already saved):", err);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  await seedAdminUser();

  const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized" });
  };

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password)))
          return done(null, false);
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Session secret from env, with a clearly-warned fallback for local dev.
  const sessionSecret = process.env.SESSION_SECRET || "omniflow-secret-key";
  if (!process.env.SESSION_SECRET) {
    console.warn(
      "[auth] SESSION_SECRET not set — using the built-in default. Set SESSION_SECRET before production.",
    );
  }

  // Postgres-backed session store (survives restarts, unlike the old in-memory store).
  const PgSession = connectPgSimple(session);

  app.use(
    session({
      store: new PgSession({
        pool: pool as any,
        tableName: "session",
        createTableIfMissing: true,
      }),
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 86400000,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.post("/api/login", passport.authenticate("local"), (req, res) =>
    res.status(200).json(req.user),
  );
  app.post("/api/logout", (req, res, next) =>
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    }),
  );
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated())
      return res.status(401).json({ message: "Not logged in" });
    res.json(req.user);
  });

  // --- PROJECT ROUTES ---

  // Get All Projects (with optional filtering)
  app.get("/api/projects", async (req, res) => {
    const category = req.query.category as string;

    if (category) {
      const projects = await storage.getProjectsByCategory(category);
      return res.json(projects);
    }

    const projects = await storage.getProjects();
    res.json(projects);
  });

  // Get Showcase Projects Only
  app.get("/api/projects/showcase", async (req, res) => {
    const projects = await storage.getShowcaseProjects();
    res.json(projects);
  });

  // Get Single Project
  app.get("/api/projects/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const project = await storage.getProject(id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  });

  // Create Project
  app.post("/api/projects", isAuthenticated, async (req, res) => {
    try {
      const parsed = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(parsed);
      res.status(201).json(project);
    } catch (error) {
      console.error("Project Create Error:", error);
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  // Update Project
  app.patch("/api/projects/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateProject(id, req.body);
      if (!updated)
        return res.status(404).json({ message: "Project not found" });
      res.json(updated);
    } catch (error) {
      console.error("Project Update Error:", error);
      res.status(400).json({ message: "Update failed" });
    }
  });

  // Delete Project
  app.delete("/api/projects/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteProject(id);
    if (!success) return res.status(404).json({ message: "Project not found" });
    res.sendStatus(204);
  });

  // --- STORAGE ROUTES ---
  app.post(
    "/api/objects/upload",
    isAuthenticated,
    upload.single("file"),
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }
        const objectStorageService = new ObjectStorageService();

        // This now returns a long "data:image..." string
        const dataUrl = await objectStorageService.uploadImageBuffer(
          req.file.buffer,
          req.file.mimetype,
          req.file.originalname,
        );

        // We send this string back to the frontend to save in the DB
        res.json({ url: dataUrl });
      } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: "Server upload failed" });
      }
    },
  );

  // --- CONTACT / LEADS ---

  // Public: persist a lead, then (optionally) notify by email.
  app.post("/api/contact", async (req, res) => {
    let validated;
    try {
      validated = contactFormSchema.parse(req.body);
    } catch (error) {
      return res.status(400).json({ success: false, message: "Invalid form data." });
    }

    try {
      const lead = await storage.createLead(validated);
      // Fire-and-forget — the lead is already saved; email must never fail the request.
      void notifyNewLead(lead);
      res.json({ success: true, message: "Thank you for your inquiry." });
    } catch (error) {
      console.error("[contact] Failed to save lead:", error);
      res.status(500).json({ success: false, message: "Could not submit right now. Please try again." });
    }
  });

  // Admin: list leads (newest first)
  app.get("/api/leads", isAuthenticated, async (_req, res) => {
    const list = await storage.listLeads();
    res.json(list);
  });

  // Admin: change lead status
  app.patch("/api/leads/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const status = req.body?.status;
    if (!(LEAD_STATUSES as readonly string[]).includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const updated = await storage.updateLeadStatus(id, status);
    if (!updated) return res.status(404).json({ message: "Lead not found" });
    res.json(updated);
  });

  // Admin: delete lead
  app.delete("/api/leads/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const ok = await storage.deleteLead(id);
    if (!ok) return res.status(404).json({ message: "Lead not found" });
    res.sendStatus(204);
  });

  // --- NEWSLETTER ---

  // Public: capture a subscriber email (duplicates are ignored, still return success).
  app.post("/api/subscribe", async (req, res) => {
    const parsed = z.object({ email: z.string().email() }).safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Invalid email." });
    }
    try {
      await storage.createSubscriber(parsed.data.email);
      res.json({ success: true });
    } catch (error) {
      console.error("[subscribe] Failed to save subscriber:", error);
      res.status(500).json({ success: false, message: "Could not subscribe right now." });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
