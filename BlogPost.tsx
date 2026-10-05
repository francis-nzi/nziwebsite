import { Link, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { ButtonLink, CTA, Page, Photo, SITE_URL, formatDate } from "@/components/site";
import { CATEGORY_LABELS, postImage } from "./Blog";

export default function BlogPost() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = trpc.blog.getPost.useQuery({ slug });

  if (isLoading) {
    return (
      <Page seo={{ title: "Insights", canonical: `/blog/${slug}` }}>
        <div className="container-narrow py-24 min-h-[60vh]"><p className="text-muted">Loading article…</p></div>
      </Page>
    );
  }

  if (isError || !post) {
    return (
      <Page seo={{ title: "Article not found", canonical: `/blog/${slug}`, noIndex: true }}>
        <div className="container-narrow py-24 min-h-[60vh]">
          <h1 className="h-section">{isError ? "We couldn't load this article" : "Article not found"}</h1>
          <p className="mt-4 mb-8">{isError ? "Please refresh the page to try again." : "It may have been moved or renamed."}</p>
          <ButtonLink href="/blog">All insights</ButtonLink>
        </div>
      </Page>
    );
  }

  const image = postImage(post);
  const url = `${SITE_URL}/blog/${post.slug}`;

  return (
    <Page
      seo={{
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt || undefined,
        canonical: `/blog/${post.slug}`,
        ogImage: `/images/${image}`,
        schema: {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          image: `${SITE_URL}/images/${image}`,
          author: { "@type": "Organization", name: post.author },
          publisher: { "@type": "Organization", name: "Net Zero International" },
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          mainEntityOfPage: url,
        },
      }}
    >
      <article>
        <header className="container-narrow pt-10 md:pt-16 pb-10">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark mb-8"><ArrowLeft className="size-4" /> All insights</Link>
          <p className="text-sm text-muted">{CATEGORY_LABELS[post.category] ?? post.category} · {formatDate(post.publishedAt)}</p>
          <h1 className="font-display font-bold text-ink text-[2rem] md:text-[2.75rem] leading-[1.1] tracking-tight mt-3">{post.title}</h1>
          {post.excerpt && <p className="lead mt-5">{post.excerpt}</p>}
        </header>
        <div className="container max-w-5xl"><Photo src={image} alt="" ratio="21/9" eager /></div>
        {/* Article HTML comes from our own content files, not from visitors. */}
        <div className="container-narrow py-12 md:py-16 article" dangerouslySetInnerHTML={{ __html: post.content ?? "" }} />
        <footer className="container-narrow pb-20">
          <div className="border-t border-line pt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted">Written by {post.author}</p>
            <ButtonLink href="/contact" arrow>Discuss this with us</ButtonLink>
          </div>
        </footer>
      </article>
      <CTA title="Need help applying this to your organisation?" text="We can tell you what applies, what it involves and how long it takes." image="solar-field.jpg" secondary={{ label: "More insights", href: "/blog" }} />
    </Page>
  );
}
