import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { ArrowLink, ButtonLink, CTA, NumberedList, Page, Photo, Section, Split, CheckList, SITE_URL, formatDate } from "@/components/site";
import { CATEGORY_LABELS, postImage } from "./Blog";

const services = [
  {
    title: "Life Cycle Assessments",
    text: "ISO 14040/14044 studies for products and projects, built to stand up in procurement, regulation and marketing claims.",
    href: "/services/life-cycle-assessments",
    image: "engineer.jpg",
    alt: "Engineer working at a laptop beside manufacturing equipment",
  },
  {
    title: "Carbon Reduction Plans",
    text: "Independently verified plans that meet PPN006, NHS Evergreen, SECR and CSRD, so you can bid with confidence.",
    href: "/services/carbon-reduction-plans",
    image: "planning.jpg",
    alt: "Two people reviewing a printed plan at a desk",
  },
  {
    title: "Scope 3 Supply Chain",
    text: "Measurement and reduction across your value chain, ahead of the April 2027 NHS supplier requirement.",
    href: "/services/scope-3-supply-chain",
    image: "port.jpg",
    alt: "Aerial view of a container port",
  },
  {
    title: "Net Zero Leaders Training",
    text: "A CPD-accredited course for leaders, sustainability managers and procurement teams. Online or in person, up to 12 people.",
    href: "/training",
    image: "training-room.jpg",
    alt: "A trainer presenting to a group around a table",
  },
];

const frameworks = ["GHG Protocol", "ISO 14040/14044", "ISO 14064", "PPN006", "NHS Evergreen", "SECR", "CSRD", "SBTi", "TCFD", "CDP"];

const regions = [
  { title: "United Kingdom", href: "/international/uk", image: "london.jpg", alt: "The River Thames and Tower Bridge from above" },
  { title: "Europe", href: "/international/europe", image: "europe-town.jpg", alt: "A historic European town street" },
  { title: "Middle East", href: "/international/middle-east", image: "dubai.jpg", alt: "Dubai skyline at dusk" },
  { title: "Asia", href: "/international/asia", image: "singapore.jpg", alt: "Singapore's Marina Bay from above" },
];

function Testimonials() {
  const { data } = trpc.testimonials.getApproved.useQuery();
  if (!data?.length) return null;
  return (
    <Section eyebrow="Clients" title="What clients say">
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
        {data.map(t => (
          <figure key={t.id} className="border-t-2 border-leaf pt-6">
            <blockquote className="text-lg text-ink leading-relaxed">“{t.quote}”</blockquote>
            <figcaption className="mt-5 text-sm">
              <span className="font-semibold text-ink">{t.clientName}</span>
              <span className="block text-muted">{[t.role, t.organisation].filter(Boolean).join(", ")}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

function LatestPosts() {
  const { data } = trpc.blog.getPosts.useQuery({ limit: 3, offset: 0 });
  if (!data?.posts.length) return null;
  return (
    <Section eyebrow="Insights" title="Guidance on the rules that affect you">
      <div className="grid gap-10 md:grid-cols-3">
        {data.posts.map(post => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
            <Photo src={postImage(post)} alt="" ratio="3/2" />
            <p className="text-sm text-muted mt-4">{CATEGORY_LABELS[post.category] ?? post.category} · {formatDate(post.publishedAt, false)}</p>
            <h3 className="h-sub mt-2 group-hover:text-brand transition-colors">{post.title}</h3>
            <p className="text-[0.9375rem] mt-2 line-clamp-3">{post.excerpt}</p>
          </Link>
        ))}
      </div>
      <div className="mt-12"><ArrowLink href="/blog">All insights</ArrowLink></div>
    </Section>
  );
}

export default function Home() {
  return (
    <Page
      seo={{
        canonical: "/",
        schema: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Net Zero International — Carbon Accounting & Net Zero Consultants",
          url: SITE_URL,
        },
      }}
    >
      {/* Hero */}
      <section>
        <div className="container pt-12 md:pt-20 pb-10 md:pb-14">
          <div className="max-w-4xl">
            <p className="eyebrow mb-5">Carbon accounting and net zero consultancy</p>
            <h1 className="h-display lg:text-[4.25rem]">Measuring and managing the carbon emissions that matter</h1>
            <p className="lead mt-7 max-w-2xl">
              We deliver verified Carbon Reduction Plans, ISO-compliant Life Cycle Assessments, Scope 3 supply chain programmes and CPD-accredited training for organisations that are serious about net zero.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/contact" arrow>Develop your net zero strategy</ButtonLink>
              <ButtonLink href="/training" variant="outline">Book a training course</ButtonLink>
            </div>
          </div>
        </div>
        <div className="container">
          <Photo src="turbines-hills.jpg" alt="Wind turbines on rolling green hills" ratio="21/9" eager className="hidden md:block" position="50% 40%" />
          <Photo src="turbines-hills.jpg" alt="Wind turbines on rolling green hills" ratio="4/3" eager className="md:hidden" />
        </div>
        <div className="container py-8 border-b border-line">
          <div className="flex flex-col lg:flex-row lg:items-baseline gap-x-8 gap-y-3">
            <p className="text-sm font-semibold text-ink shrink-0">Standards and frameworks we work to</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-muted">
              {frameworks.map(f => <li key={f}>{f}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* Services */}
      <Section eyebrow="What we do" title="Four services, one aim: numbers you can stand behind" lead="Whether you need to win a public contract, substantiate a product claim or train your leadership team, the work starts with accurate measurement.">
        <div className="grid gap-x-10 gap-y-14 md:grid-cols-2">
          {services.map(s => (
            <Link key={s.href} href={s.href} className="group block">
              <Photo src={s.image} alt={s.alt} ratio="16/9" />
              <h3 className="font-display font-bold text-ink text-2xl mt-6 group-hover:text-brand transition-colors">{s.title}</h3>
              <p className="mt-2 max-w-lg">{s.text}</p>
              <span className="link-arrow mt-4">Learn more <ArrowRight /></span>
            </Link>
          ))}
        </div>
        <p className="mt-14 pt-8 border-t border-line">
          Need help setting direction first? <Link href="/services/net-zero-strategy-workshops" className="text-link">Net Zero Strategy Workshops</Link> bring your leadership team together to agree a roadmap.
        </p>
      </Section>

      {/* NHS deadline */}
      <Section>
        <Split image="hospital-ward.jpg" alt="An empty hospital ward" eyebrow="April 2027" title="NHS suppliers: full Scope 3 reporting is coming" flip>
          <p>
            From April 2027 the NHS expects every supplier, whatever the contract value, to publish a Carbon Reduction Plan covering Scope 1, Scope 2 and all relevant Scope 3 emissions.
          </p>
          <p>Scope 3 is usually the largest part of an organisation's emissions and the slowest to measure, because the data sits with your suppliers. Starting now leaves time to collect it properly.</p>
          <div className="pt-3 flex flex-wrap gap-x-8 gap-y-3">
            <ArrowLink href="/international/uk">What UK suppliers need to do</ArrowLink>
            <ArrowLink href="/services/scope-3-supply-chain">Scope 3 support</ArrowLink>
          </div>
        </Split>
      </Section>

      {/* Why NZI */}
      <Section eyebrow="How we work" title="Straight answers, technically sound">
        <NumberedList
          items={[
            { title: "Technical depth", text: "Our consultants know the carbon accounting standards and the regulations in detail. You get reasoned judgements, not a checklist." },
            { title: "Independently verified", text: "Carbon Reduction Plans and LCA reports are independently verified, so they hold up when a buyer, auditor or regulator looks closely." },
            { title: "Honest advice", text: "We tell you what the numbers say, including when that is uncomfortable. That is what makes a plan credible." },
            { title: "Any sector", text: "Healthcare, manufacturing, construction, professional services and more. The method is the same; the detail is yours." },
          ]}
        />
      </Section>

      {/* Training */}
      <Section>
        <Split image="workshop.jpg" alt="A facilitator leading a workshop with sticky notes on a whiteboard" eyebrow="CPD-accredited training" title="Net Zero Leaders">
          <p>A one-day course that gives leaders and managers a working knowledge of carbon accounting, science-based targets and the regulations that apply to them.</p>
          <CheckList items={["CPD certificate on completion", "Online or in person, up to 12 participants", "Private courses tailored to your organisation"]} />
          <div className="pt-4"><ButtonLink href="/training" arrow>See course dates</ButtonLink></div>
        </Split>
      </Section>

      {/* International */}
      <Section eyebrow="International" title="Local rules, wherever you operate" lead="Reporting requirements differ by country. We work with organisations in the UK, Europe, the Middle East, Africa and Asia.">
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
          {regions.map(r => (
            <Link key={r.href} href={r.href} className="group block">
              <Photo src={r.image} alt={r.alt} ratio="4/5" />
              <span className="link-arrow mt-4 text-ink group-hover:text-brand">{r.title} <ArrowRight /></span>
            </Link>
          ))}
        </div>
        <div className="mt-10"><ArrowLink href="/international">All regions</ArrowLink></div>
      </Section>

      <Testimonials />
      <LatestPosts />

      <CTA
        title="Ready to get your numbers right?"
        text="Tell us what you need to report, to whom and by when. We will tell you what it involves."
        primary={{ label: "Get in touch", href: "/contact" }}
        secondary={{ label: "View training dates", href: "/training" }}
      />
    </Page>
  );
}
