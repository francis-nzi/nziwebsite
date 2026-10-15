/**
 * Collects what a page needs in <head> (title, meta, JSON-LD) and its HTTP status
 * while it is rendered on the server. Rendering is synchronous, so one shared
 * object per render is safe; entry-server resets it before each page.
 */
export const isServer = typeof window === "undefined";

export const ssrState = {
  head: [] as string[],
  status: 200,
  reset() {
    this.head = [];
    this.status = 200;
  },
};

const escapeAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escapeText = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/** JSON safe to place inside a <script> tag. */
export const safeJson = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

export const headTag = {
  title: (t: string) => `<title>${escapeText(t)}</title>`,
  meta: (attr: "name" | "property", key: string, content: string) => `<meta ${attr}="${escapeAttr(key)}" content="${escapeAttr(content)}" />`,
  link: (rel: string, href: string) => `<link rel="${escapeAttr(rel)}" href="${escapeAttr(href)}" />`,
  jsonLd: (id: string, data: unknown) => `<script type="application/ld+json" id="${escapeAttr(id)}">${safeJson(data)}</script>`,
};
