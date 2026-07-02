import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  contactFormSchema,
  insertUserSchema,
  insertProjectSchema,
} from "@shared/schema";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import MemoryStore from "memorystore";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { ObjectStorageService } from "./objectStorage";
import multer from "multer";

const scryptAsync = promisify(scrypt);
const SessionStore = MemoryStore(session);

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
  const adminPassword = "Admin@admin1234";
  const existing = await storage.getUserByUsername(adminUsername);
  if (!existing) {
    const hashedPassword = await hashPassword(adminPassword);
    await storage.createUser({
      username: adminUsername,
      password: hashedPassword,
    });
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

  app.use(
    session({
      store: new SessionStore({ checkPeriod: 86400000 }),
      secret: "omniflow-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 86400000 },
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
    const showOnServicePage = req.query.showOnServicePage === 'true';

    if (category) {
      const projects = await storage.getProjectsByCategory(category, showOnServicePage);
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

  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactFormSchema.parse(req.body);
      res.json({ success: true, message: "Thank you for your inquiry." });
    } catch (error) {
      res.status(400).json({ success: false, message: "Invalid form data." });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}