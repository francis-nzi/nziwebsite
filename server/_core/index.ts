import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { bootstrapDatabase } from "../bootstrap";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

/** Small in-memory limiter for the public forms and admin login: 8 attempts per IP per 10 minutes. */
function formRateLimit(): express.RequestHandler {
  const hits = new Map<string, number[]>();
  const WINDOW = 10 * 60_000;
  const MAX = 8;
  setInterval(() => {
    const cutoff = Date.now() - WINDOW;
    hits.forEach((times, ip) => { if (times.every(t => t < cutoff)) hits.delete(ip); });
  }, WINDOW).unref();
  return (req, res, next) => {
    // Only the public forms and the admin login are limited; signed-in admin work is not.
    if (req.method !== "POST" || !/contact\.submitEnquiry|training\.createBooking|admin\.login/.test(req.path)) return next();
    const ip = (req.headers["cf-connecting-ip"] as string) || req.ip || "unknown";
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter(t => t > now - WINDOW);
    if (recent.length >= MAX) {
      res.status(429).json({ error: { message: "Too many submissions. Please try again in a few minutes or email us directly." } });
      return;
    }
    recent.push(now);
    hits.set(ip, recent);
    next();
  };
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.set("trust proxy", true);
  app.disable("x-powered-by");

  app.get("/healthz", (_req, res) => { res.json({ ok: true }); });

  // One address for the site: www → netzero.international
  app.use((req, res, next) => {
    if (req.hostname.startsWith("www.")) {
      res.redirect(301, `https://${req.hostname.slice(4)}${req.originalUrl}`);
      return;
    }
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });

  app.use(express.json({ limit: "100kb" }));
  app.use("/api/trpc", formRateLimit(), createExpressMiddleware({ router: appRouter, createContext }));

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || "3000");
  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });

  // Start listening first so the host's health check passes, then prepare the database.
  bootstrapDatabase().catch(error => console.error("[Database] Setup failed:", error));
}

startServer().catch(error => {
  console.error(error);
  process.exit(1);
});
