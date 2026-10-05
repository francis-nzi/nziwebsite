import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { ButtonLink, CTA, Page, PageHero, Photo, Section, SITE_URL } from "@/components/site";

const regions = [
  {
    name: "United Kingdom",
    href: "/international/uk",
    image: "london.jpg",
    alt: "The River Thames and Tower Bridge, London, from above",
    note: "NHS Scope 3 deadline: April 2027",
    text: "PPN006, NHS Evergreen and SECR. We support NHS suppliers ahead of the April 2027 full Scope 3 deadline.",
  },
  {
    name: "Europe",
    href: "/international/europe",
    image: "europe-town.jpg",
    alt: "A street of timbered houses in a historic German town",
    note: "CSRD, EU Taxonomy, SFDR",
    text: "Support for European organisations working through the EU's sustainability reporting requirements.",
  },
  {
    name: "G20 nations",
    href: "/international/g20",
    image: "earth-night.jpg",
    alt: "Earth from orbit at night, with city lights visible",
    note: "National and international frameworks",
    text: "Carbon reduction plans, LCAs and net zero strategies aligned with national and international frameworks.",
  },
  {
    name: "Africa",
    href: "/international/africa",
    image: "savanna.jpg",
    alt: "An acacia tree on the savanna at sunset",
    note: "Export market requirements",
    text: "Carbon reduction and net zero strategy for African organisations, including export market and international supply chain requirements.",
  },
  {
    name: "Middle East",
    href: "/international/middle-east",
    image: "dubai.jpg",
    alt: "The Dubai skyline at dusk",
    note: "National net zero commitments",
    text: "Net zero strategies, carbon reduction plans and LCAs as the region's energy transition gathers pace.",
  },
  {
    name: "Asia",
    href: "/international/asia",
    image: "singapore.jpg",
    alt: "Marina Bay, Singapore, from above",
    note: "Supply chain Scope 3",
    text: "Carbon reduction and LCA services, including Scope 3 supply chain compliance for international markets.",
  },
];

export default function International() {
  return (
    <Page
      seo={{
        title: "International Carbon Reduction Services — UK, Europe, G20, Africa, Middle East, Asia",
        description:
          "Net Zero International provides carbon reduction plans, LCAs, and net zero training globally. Specialists in NHS Evergreen, PPN006, CSRD, and international supply chain compliance.",
        canonical: "/international",
        schema: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "International Carbon Reduction Services",
          description: "Global carbon reduction consultancy serving UK, Europe, G20, Africa, Middle East, and Asia.",
          url: `${SITE_URL}/international`,
        },
      }}
    >
      <PageHero
        eyebrow="International"
        title="Carbon reduction work, wherever you report"
        lead="We work with organisations around the world: UK NHS suppliers preparing for the 2027 Scope 3 deadline, European businesses reporting under CSRD, and suppliers elsewhere who need to meet the carbon requirements of international buyers."
        image="turbines-sunset.jpg"
        alt="Wind turbines at sunset"
        crumbs={[{ label: "International" }]}
      >
        <ButtonLink href="/contact" arrow>Talk to us</ButtonLink>
      </PageHero>

      <Section eyebrow="Where we work" title="Six regions, different rules" lead="What you have to report, and to whom, depends on where you operate and who you sell to. Each page sets out the frameworks that apply and how we help.">
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map(r => (
            <Link key={r.href} href={r.href} className="group block">
              <Photo src={r.image} alt={r.alt} ratio="3/2" />
              <p className="text-sm text-muted mt-5">{r.note}</p>
              <h3 className="font-display font-bold text-ink text-2xl mt-1 group-hover:text-brand transition-colors">{r.name}</h3>
              <p className="mt-2 text-[0.9375rem]">{r.text}</p>
              <span className="link-arrow mt-4">View {r.name} <ArrowRight /></span>
            </Link>
          ))}
        </div>
      </Section>

      <Section border={false}>
        <div className="grid gap-6 md:grid-cols-12 md:gap-10">
          <h2 className="h-section md:col-span-5">The standards do not change at the border</h2>
          <div className="md:col-span-7 space-y-4">
            <p>
              Local regulation varies, but the measurement underneath it is the same. Our work in every region rests on the GHG Protocol and the ISO 14040/14044 and ISO 14064 standards, and aligns with SBTi, TCFD and CDP where those apply.
            </p>
            <p>
              That matters if you report in more than one country, or supply customers who do: one set of sound numbers can serve several requirements. See our <Link href="/services/carbon-reduction-plans" className="text-link">Carbon Reduction Plans</Link>, <Link href="/services/life-cycle-assessments" className="text-link">Life Cycle Assessments</Link> and <Link href="/services/scope-3-supply-chain" className="text-link">Scope 3 supply chain</Link> services.
            </p>
          </div>
        </div>
      </Section>

      <CTA
        title="Operating somewhere else?"
        text="We work with organisations worldwide. Tell us where you are and what you need to report, and we will tell you how we can support your net zero programme."
        image="field-sunrise.jpg"
        primary={{ label: "Get in touch", href: "/contact" }}
      />
    </Page>
  );
}
