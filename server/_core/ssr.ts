/**
 * Renders each page to full HTML on the server. Data a page shows on first load
 * (blog posts, course dates, testimonials) is fetched first and sent along, so the
 * browser picks up exactly where the server left off.
 */
import fs from "node:fs";
import path from "node:path";
import type { Express } from "express";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { dehydrate } from "@tanstack/react-query";
import superjson from "superjson";
import { appRouter } from "../routers";

type RenderFn = (path: string, search: string, state: unknown) => { html: string; head: string; status: number };

async function prefetch(pathname: string, req: Express["request"], res: Express["response"]) {
  const helpers = createServerSideHelpers({ router: appRouter, ctx: { req, res } as never, transformer: superjson });
  const jobs: Promise<unknown>[] = [];
  const blogPost = pathname.match(/^\/blog\/([^/]+)$/);
  if (pathname === "/") {
    jobs.push(helpers.blog.getPosts.prefetch({ limit: 3, offset: 0 }), helpers.testimonials.getApproved.prefetch());
  } else if (pathname === "/blog") {
    jobs.push(helpers.blog.getPosts.prefetch({ limit: 9, offset: 0 }));
  } else if (blogPost) {
    jobs.push(helpers.blog.getPost.prefetch({ slug: decodeURIComponent(blogPost[1]!) }));
  } else if (pathname === "/training") {
    jobs.push(helpers.training.getSessions.prefetch());
  }
  await Promise.all(jobs);
  return dehydrate(helpers.queryClient);
}

export function serveRendered(app: Express, distPath: string) {
  const template = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8")
    // The page supplies its own title and description.
    .replace(/<title>[\s\S]*?<\/title>\s*/, "")
    .replace(/<meta name="description"[^>]*>\s*/, "");
  const entry = path.resolve(import.meta.dirname, "server", "entry-server.js");
  let renderPromise: Promise<RenderFn> | null = null;
  const getRender = () => (renderPromise ??= import(entry).then(m => m.render as RenderFn));

  app.get("*", async (req, res) => {
    try {
      const render = await getRender();
      const url = new URL(req.originalUrl, "http://localhost");
      const state = await prefetch(url.pathname, req, res);
      const { html, head, status } = render(url.pathname, url.search, state);
      const page = template
        .replace("</head>", `    ${head}\n  </head>`)
        .replace('<div id="root"></div>', `<div id="root">${html}</div><script type="application/json" id="__RQ_STATE__">${superjson.stringify(state).replace(/</g, "\\u003c")}</script>`);
      res.status(status).set({ "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" }).send(page);
    } catch (error) {
      // If rendering fails, fall back to the plain app shell so the site still works.
      console.error("[SSR] Render failed for", req.originalUrl, error);
      res.status(200).set({ "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" }).sendFile(path.resolve(distPath, "index.html"));
    }
  });
}
