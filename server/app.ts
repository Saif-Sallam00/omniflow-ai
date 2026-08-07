import { type Server } from "node:http";
import express, {
  type Express,
  type Request,
  Response,
  NextFunction,
} from "express";
import { registerRoutes } from "./routes";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

export const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

// [CRITICAL FIX] Increased limit to 50mb to handle Base64 images
app.use(express.json({
  limit: '50mb',
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

export default async function runApp(
  setup: (app: Express, server: Server) => Promise<void>,
) {
  // Replit (and any other TLS-terminating host) proxies HTTPS to this process
  // over plain HTTP. Without this, Express reports req.secure === false, and
  // express-session refuses to send a `Secure` cookie over a connection it
  // believes is insecure — so the session cookie is never stored and every
  // authenticated request 401s, while /api/login still returns 200.
  //
  // Must be set before registerRoutes, which installs the session middleware.
  // Scoped to production so a local dev server does not trust spoofable
  // X-Forwarded-* headers; it mirrors the `secure` cookie flag exactly.
  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // This used to `throw err` after responding. A throw inside an Express
    // error handler is not caught by Express — it becomes an uncaught
    // exception and kills the process, so any recoverable error (a multer
    // rejection, a session-store blip) took the whole server down and the
    // platform returned its own opaque 500 instead of this JSON body.
    console.error(`[error] ${status} ${message}`, err?.stack || err);
    if (!res.headersSent) res.status(status).json({ message });
  });

  await setup(app, server);

  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
}