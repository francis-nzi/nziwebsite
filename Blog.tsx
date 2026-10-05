import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { CTA, Page, Photo, SITE_URL, formatDate } from "@/components/site";

export const CATEGORY_LABELS: Record<string, string> = {
  compliance: "Compliance",
  training: "Training",
  lca: "Life Cycle Assessment",
  scope_3: "Scope 3",
  international: "International",
  industry_news: "Industry News",
};

const CATEGORY_IMAGES: Record<string, string> = {
  compliance: "planning.jpg",
  training: "seminar.jpg",
  lca: "drawings.jpg",
  scope_3: "port.jpg",
  international: "earth-night.jpg",
  industry_news: "turbines-sunset.jpg",
};

/** File name in /images for a post: its own featured image if set, otherwise one for its category. */
export function postImage(post: { featuredImage: string | null; category: string }) {
  if (post.featuredImage?.startsWith("/images/")) return post.featuredImage.slice("/images/".length);
  return CATEGORY_IMAGES[post.category] ?? "turbines-sunset.jpg";
}

const PAGE_SIZE = 9;

export default function Blog() {
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = trpc.blog.getPosts.useQuery({ limit: PAGE_SIZE, offset: page * PAGE_SIZE, category: category === "all" ? undefined : category });
  const posts = data?.posts ?? [];
  const pages = Math.ceil((data?.total ?? 0) / PAGE_SIZE);
  const [lead, ...rest] = page === 0 && category === "all" ? posts : [undefined, ...posts];

  return (
    <Page
      seo={{
        title: "Insights — Carbon Reduction, LCA and Net Zero Guidance",
        description: "Practical guidance on carbon reduction plans, life cycle assessments, Scope 3, NHS Evergreen, PPN006 and CSRD from Net Zero International.",
        canonical: "/blog",
        schema: { "@context": "https://schema.org", "@type": "Blog", name: "Net Zero International — Insights", url: `${SITE_URL}/blog`, publisher: { "@type": "Organization", name: "Net Zero International" } },
      }}
    >
      <section className="container pt-12 md:pt-20 pb-10">
        <p className="eyebrow mb-4">Insights</p>
        <h1 className="h-display max-w-3xl">Guidance on carbon reporting and net zero</h1>
        <p className="lead mt-6 max-w-2xl">Plain-English explanations of the standards and regulations our clients ask about most.</p>
      </section>

      <section className="container pb-20 md:pb-28">
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-y border-line py-4 mb-12" role="group" aria-label="Filter by topic">
          {[["all", "All"], ...Object.entries(CATEGORY_LABELS)].map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={category === value}
              onClick={() => { setCategory(value); setPage(0); }}
              className={`text-[0.9375rem] font-medium pb-0.5 border-b-2 transition-colors ${category === value ? "text-ink border-brand" : "text-muted border-transparent hover:text-ink"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {isLoading && <p className="text-muted py-16">Loading articles…</p>}
        {isError && <p className="py-16">We couldn't load the articles just now. Please refresh the page.</p>}
        {!isLoading && !isError && posts.length === 0 && <p className="py-16">No articles in this topic yet.</p>}

        {lead && (
          <Link href={`/blog/${lead.slug}`} className="group grid gap-8 lg:grid-cols-2 lg:gap-14 items-center mb-16 pb-16 border-b border-line">
            <Photo src={postImage(lead)} alt="" ratio="3/2" eager />
            <div>
              <p className="text-sm text-muted">{CATEGORY_LABELS[lead.category] ?? lead.category} · {formatDate(lead.publishedAt)}</p>
              <h2 className="h-section mt-3 group-hover:text-brand transition-colors">{lead.title}</h2>
              <p className="mt-4 text-lg">{lead.excerpt}</p>
              <span className="link-arrow mt-6">Read article</span>
            </div>
          </Link>
        )}

        <div className="grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {rest.filter(Boolean).map(post => (
            <Link key={post!.id} href={`/blog/${post!.slug}`} className="group block">
              <Photo src={postImage(post!)} alt="" ratio="3/2" />
              <p className="text-sm text-muted mt-4">{CATEGORY_LABELS[post!.category] ?? post!.category} · {formatDate(post!.publishedAt, false)}</p>
              <h2 className="h-sub mt-2 group-hover:text-brand transition-colors">{post!.title}</h2>
              <p className="text-[0.9375rem] mt-2 line-clamp-3">{post!.excerpt}</p>
            </Link>
          ))}
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-between mt-16 pt-6 border-t border-line">
            <button type="button" className="btn btn-outline btn-sm" disabled={page === 0} onClick={() => { setPage(p => p - 1); window.scrollTo(0, 0); }}>Newer</button>
            <span className="text-sm text-muted">Page {page + 1} of {pages}</span>
            <button type="button" className="btn btn-outline btn-sm" disabled={page >= pages - 1} onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0); }}>Older</button>
          </div>
        )}
      </section>

      <CTA title="Have a question we haven't covered?" text="Ask us. If it's useful to others we'll write it up." image="forest.jpg" />
    </Page>
  );
}
