import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { ArrowLink, ButtonLink, CTA, Page, PageHero, Photo, Section, Split, SITE_URL } from "@/components/site";

const services = [
  {
    title: "Life Cycle Assessments",
    text: "ISO 14040/14044 studies for products and projects. Independent, and written to support procurement, regulatory and marketing requirements.",
    href: "/services/life-cycle-assessments",
    image: "engineer.jpg",
    alt: "Engineer working at a laptop beside manufacturing equipment",
  },
  {
    title: "Carbon Reduction Plans",
    text: "Independently verified Carbon Reduction Plans that meet PPN006, NHS Evergreen, SECR and CSRD, so you can keep bidding for public sector contracts.",
    href: "/services/carbon-reduction-plans",
    image: "planning.jpg",
    alt: "Two people reviewing printed documents with laptops",
  },
  {
    title: "Scope 3 Supply Chain",
    text: "Measurement and reduction of the emissions in your value chain. Needed by NHS suppliers ahead of the April 2027 full Scope 3 requirement.",
    href: "/services/scope-3-supply-chain",
    image: "port.jpg",
    alt: "Aerial view of a container port",
  },
  {
    title: "Net Zero Strategy Workshops",
    text: "Facilitated sessions in which your board, leadership team or suppliers agree a net zero roadmap, shaped around your sector and supply chain.",
    href: "/services/net-zero-strategy-workshops",
    image: "workshop.jpg",
    alt: "Facilitator at a whiteboard covered in sticky notes with a group",
  },
];

export default function Services() {
  return (
    <Page
      seo={{
        title: "Our Services — Carbon Reduction, LCA, Scope 3 & Training",
        description:
          "Net Zero International offers carbon reduction plans, life cycle assessments, Scope 3 supply chain solutions, and net zero strategy workshops. PPN006, NHS, SECR and CSRD compliant.",
        canonical: "/services",
        schema: {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Net Zero International services",
          itemListElement: services.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: s.title,
            url: `${SITE_URL}${s.href}`,
          })),
        },
      }}
    >
      <PageHero
        eyebrow="Services"
        title="Carbon reduction services"
        lead="For organisations that want measurable progress to net zero and need the evidence to show it. We work in any sector, in the UK and internationally, to the standards that buyers and regulators ask for."
        image="desk-overhead.jpg"
        alt="Overhead view of a team's shared desk with laptops"
        crumbs={[{ label: "Services" }]}
      >
        <ButtonLink href="/contact" arrow>Talk to us</ButtonLink>
      </PageHero>

      <Section eyebrow="What we do" title="Four services">
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
      </Section>

      <Section>
        <Split image="training-room.jpg" alt="Presenter with a group round a boardroom table" eyebrow="Training" title="Training for leaders and their teams" flip>
          <p>
            If your people need a working knowledge of carbon accounting and the regulations before the consultancy work starts, our training courses cover it.
          </p>
          <div className="pt-2"><ArrowLink href="/training">See training courses</ArrowLink></div>
        </Split>
      </Section>

      <CTA
        title="Not sure which service you need?"
        text="Tell us what you have been asked for and by whom. We will explain what is required and recommend the right approach for your organisation."
        image="turbines-sunset.jpg"
        primary={{ label: "Get in touch", href: "/contact" }}
      />
    </Page>
  );
}
