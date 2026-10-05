/**
 * Shared building blocks for every page. Keeping layout here means the pages
 * stay mostly content, and the whole site changes look from one place.
 */
import type { ReactNode } from "react";
import { Link } from "wouter";
import { ArrowRight, Check, Plus } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SEOHead from "./SEOHead";

export const SITE_URL = "https://netzero.international";
export const CONTACT_EMAIL = "info@netzero.international";

type SEO = { title?: string; description?: string; canonical: string; schema?: object; noIndex?: boolean; ogImage?: string };

/** Page shell: SEO tags, header, footer. */
export function Page({ seo, children }: { seo: SEO; children: ReactNode }) {
  return (
    <>
      <SEOHead {...seo} />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-ink">Skip to content</a>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}

/** Photo with a fixed aspect ratio. `src` is a file name in /public/images. */
export function Photo({ src, alt, ratio = "4/3", className = "", eager = false, position }: { src: string; alt: string; ratio?: string; className?: string; eager?: boolean; position?: string }) {
  return (
    <div className={`overflow-hidden rounded-[3px] bg-tint ${className}`} style={{ aspectRatio: ratio }}>
      <img src={`/images/${src}`} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" className="photo" style={position ? { objectPosition: position } : undefined} />
    </div>
  );
}

/** Top of every inner page: breadcrumb, heading and intro on the left, photograph on the right. */
export function PageHero({ eyebrow, title, lead, image, alt, crumbs, children }: { eyebrow?: string; title: ReactNode; lead?: ReactNode; image: string; alt: string; crumbs?: { label: string; href?: string }[]; children?: ReactNode }) {
  return (
    <section className="border-b border-line">
      <div className="container grid gap-10 lg:grid-cols-12 lg:gap-14 items-center py-12 md:py-16 lg:py-20">
        <div className="lg:col-span-6">
          {crumbs && (
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
              <Link href="/" className="hover:text-ink">Home</Link>
              {crumbs.map(c => (
                <span key={c.label}>
                  <span className="mx-2 text-line">/</span>
                  {c.href ? <Link href={c.href} className="hover:text-ink">{c.label}</Link> : <span className="text-ink">{c.label}</span>}
                </span>
              ))}
            </nav>
          )}
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h1 className="h-display">{title}</h1>
          {lead && <p className="lead mt-6 max-w-xl">{lead}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
        <div className="lg:col-span-6">
          <Photo src={image} alt={alt} ratio="3/2" eager />
        </div>
      </div>
    </section>
  );
}

/** Standard content section with an optional heading block. */
export function Section({ eyebrow, title, lead, children, id, className = "", border = true }: { eyebrow?: string; title?: ReactNode; lead?: ReactNode; children: ReactNode; id?: string; className?: string; border?: boolean }) {
  return (
    <section id={id} className={`py-16 md:py-24 ${border ? "border-b border-line" : ""} ${className}`}>
      <div className="container">
        {(eyebrow || title || lead) && (
          <div className="max-w-2xl mb-10 md:mb-14">
            {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
            {title && <h2 className="h-section">{title}</h2>}
            {lead && <p className="lead mt-4">{lead}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/** Photograph beside text. Set `flip` to put the photo on the right. */
export function Split({ image, alt, flip = false, ratio = "4/3", eyebrow, title, children }: { image: string; alt: string; flip?: boolean; ratio?: string; eyebrow?: string; title?: ReactNode; children: ReactNode }) {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
      <Photo src={image} alt={alt} ratio={ratio} className={flip ? "lg:order-2" : ""} />
      <div>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        {title && <h2 className="h-section mb-5">{title}</h2>}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}

/** Ticked list. */
export function CheckList({ items, columns = 1 }: { items: ReactNode[]; columns?: 1 | 2 }) {
  return (
    <ul className={`grid gap-x-10 gap-y-3 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <Check className="size-5 text-leaf shrink-0 mt-[3px]" strokeWidth={3} aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Numbered rows separated by hairlines — used for processes, modules, reasons. */
export function NumberedList({ items }: { items: { title: string; text: ReactNode }[] }) {
  return (
    <ol className="border-t border-line">
      {items.map((item, i) => (
        <li key={item.title} className="grid gap-2 md:grid-cols-12 md:gap-8 py-7 border-b border-line">
          <span className="md:col-span-1 font-display font-semibold text-accent-text tabular-nums">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="md:col-span-4 h-sub">{item.title}</h3>
          <p className="md:col-span-7">{item.text}</p>
        </li>
      ))}
    </ol>
  );
}

/** Plain columns of short points with a rule above each — replaces icon cards. */
export function Columns({ items, columns = 3 }: { items: { title: string; text: ReactNode; href?: string; linkLabel?: string }[]; columns?: 2 | 3 | 4 }) {
  const cols = columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2";
  return (
    <div className={`grid gap-x-10 gap-y-10 ${cols}`}>
      {items.map(item => (
        <div key={item.title} className="border-t-2 border-leaf pt-5">
          <h3 className="h-sub mb-2">{item.title}</h3>
          <p className="text-[0.9375rem]">{item.text}</p>
          {item.href && <Link href={item.href} className="link-arrow mt-4 text-sm">{item.linkLabel ?? "Read more"} <ArrowRight /></Link>}
        </div>
      ))}
    </div>
  );
}

/** Question-and-answer list that opens in place. */
export function FAQ({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <div className="border-t border-line max-w-3xl">
      {items.map(item => (
        <details key={item.q} className="group border-b border-line">
          <summary className="flex items-start justify-between gap-6 py-5 list-none [&::-webkit-details-marker]:hidden">
            <span className="font-display font-semibold text-ink text-lg">{item.q}</span>
            <Plus className="size-5 text-accent shrink-0 mt-1 transition-transform group-open:rotate-45" aria-hidden />
          </summary>
          <div className="pb-6 pr-10">{item.a}</div>
        </details>
      ))}
    </div>
  );
}

/** Large figures in a row. Only use numbers that are verifiably true. */
export function Facts({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
      {items.map(f => (
        <div key={f.label} className="border-l-2 border-leaf pl-5">
          <dt className="font-display font-bold text-ink text-3xl md:text-4xl tracking-tight">{f.value}</dt>
          <dd className="text-sm text-muted mt-1">{f.label}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Closing call to action over a full-width photograph. */
export function CTA({ title, text, image = "highlands.jpg", primary = { label: "Talk to us", href: "/contact" }, secondary }: { title: string; text?: string; image?: string; primary?: { label: string; href: string }; secondary?: { label: string; href: string } }) {
  return (
    <section className="relative isolate">
      <img src={`/images/${image}`} alt="" loading="lazy" decoding="async" className="absolute inset-0 -z-20 w-full h-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-[#12301a]/80" />
      <div className="container py-20 md:py-28">
        <div className="max-w-2xl">
          <h2 className="font-display font-bold text-white text-3xl md:text-[2.75rem] leading-[1.1]">{title}</h2>
          {text && <p className="text-white/85 text-lg mt-5">{text}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={primary.href} className="btn btn-light">{primary.label} <ArrowRight className="size-4" /></Link>
            {secondary && <Link href={secondary.href} className="btn btn-ghost-light">{secondary.label}</Link>}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Link styled as a button. variant: "primary" | "outline". */
export function ButtonLink({ href, children, variant = "primary", arrow = false }: { href: string; children: ReactNode; variant?: "primary" | "outline"; arrow?: boolean }) {
  return (
    <Link href={href} className={`btn ${variant === "primary" ? "btn-primary" : "btn-outline"}`}>
      {children}
      {arrow && <ArrowRight className="size-4" />}
    </Link>
  );
}

export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} className="link-arrow">{children} <ArrowRight /></Link>;
}

export const formatDate = (value: string | Date | null | undefined, long = true) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: long ? "long" : "short", year: "numeric" }) : "";
