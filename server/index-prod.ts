import "dotenv/config";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { type Server } from "node:http";

import express, { type Express } from "express";
import runApp from "./app";
import { storage } from "./storage";

// =============================================================================
// Per-article meta tags, rendered on the SERVER.
//
// This is a client-side SPA, and social crawlers do not run JavaScript.
// LinkedIn — the top of the whole content funnel — reads the HTML exactly as
// it is sent, so without this every shared article would preview as the
// site-wide title and description from client/index.html. Google renders JS,
// but later and less reliably than it reads the initial response.
//
// So `/articles/<slug>` is served from the same index.html with its meta tags
// substituted. No renderer, no framework: a lookup and a string replace.
// =============================================================================

const SITE_NAME = "OmniflowAI";

/** Text going into an HTML attribute. Titles and excerpts are author-entered. */
function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Replace a `<meta name|property="key" content="...">` value in the template. */
function setMeta(html: string, attr: "name" | "property", key: string, value: string): string {
  const pattern = new RegExp(
    `(<meta\\s+${attr}=["']${key}["']\\s+content=["'])[^"']*(["'])`,
    "i",
  );
  return html.replace(pattern, `$1${escapeAttr(value)}$2`);
}

function articleHtml(template: string, article: {
  title: string;
  excerpt: string;
  coverImage: string;
  slug: string;
}, origin: string): string {
  const title = `${article.title} — ${SITE_NAME}`;
  let html = template
    .replace(/<title>[^<]*<\/title>/i, `<title>${escapeAttr(title)}</title>`);

  html = setMeta(html, "name", "description", article.excerpt);
  html = setMeta(html, "property", "og:title", title);
  html = setMeta(html, "property", "og:description", article.excerpt);
  html = setMeta(html, "property", "og:type", "article");
  html = setMeta(html, "name", "twitter:title", title);
  html = setMeta(html, "name", "twitter:description", article.excerpt);

  // og:image and canonical are not in the template, so they are injected.
  // The cover image is a base64 data URI in the database; crawlers need a
  // fetchable URL, so it points at the article's own image endpoint.
  const canonical = `${origin}/articles/${article.slug}`;
  html = html.replace(
    "</head>",
    `  <link rel="canonical" href="${escapeAttr(canonical)}" />\n` +
      `    <meta property="og:url" content="${escapeAttr(canonical)}" />\n` +
      `    <meta property="og:image" content="${escapeAttr(`${origin}/api/articles/${article.slug}/cover`)}" />\n` +
      `  </head>`,
  );

  return html;
}

export async function serveStatic(app: Express, _server: Server) {
  const distPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  const indexPath = path.resolve(distPath, "index.html");

  app.use(express.static(distPath));

  // Article pages get their own meta tags. Anything that throws or misses
  // falls through to the untouched shell — a wrong preview is bad, a 500 on a
  // shared link is worse.
  app.get("/articles/:slug", async (req, res, next) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article || !article.published) return next();

      const origin = `${req.protocol}://${req.get("host")}`;
      const template = await fs.promises.readFile(indexPath, "utf-8");
      res.type("html").send(articleHtml(template, article, origin));
    } catch (error) {
      console.error("Article meta render failed:", error);
      next();
    }
  });

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(indexPath);
  });
}

(async () => {
  await runApp(serveStatic);
})();
