import { ButtonLink, CheckList, CTA, Page, PageHero, Photo, Section, Split, SITE_URL } from "@/components/site";

const workshops = [
  {
    title: "Net zero roadmap workshop",
    text: "A facilitated day in which you develop your organisation's net zero roadmap. Covers baseline assessment, target setting, the reduction pathway and action planning.",
    duration: "Full day",
    participants: "Up to 20",
  },
  {
    title: "Board-level net zero briefing",
    text: "A focused session for boards and senior leadership teams on climate risk, regulatory requirements and strategic positioning on net zero.",
    duration: "Half day",
    participants: "Up to 12",
  },
  {
    title: "Supply chain engagement workshop",
    text: "Brings your suppliers into the measurement and reduction of Scope 3 emissions, with practical guidance on carbon accounting and reporting.",
    duration: "Full day",
    participants: "Up to 30",
  },
  {
    title: "Bespoke facilitation",
    text: "Workshop design and facilitation built around a particular organisational need, sector requirement or strategic question.",
    duration: "Flexible",
    participants: "Flexible",
  },
];

const outcomes = [
  "A clear, shared understanding of your organisation's net zero ambition",
  "An agreed baseline emissions assessment, with the main hotspots identified",
  "Science-aligned reduction targets and milestones",
  "A prioritised action plan with owners and timelines",
  "Stakeholder alignment and leadership buy-in",
  "Readiness for regulatory reporting and disclosure",
];

export default function ServiceWorkshops() {
  return (
    <Page
      seo={{
        title: "Net Zero Strategy Workshops — Expert Facilitation",
        description:
          "Facilitated net zero strategy workshops for boards, leadership teams, and supply chains. Develop your net zero roadmap with expert guidance from Net Zero International.",
        canonical: "/services/net-zero-strategy-workshops",
        schema: {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Net Zero Strategy Workshops",
          description: "Facilitated net zero strategy workshops for boards, leadership teams and supply chains.",
          url: `${SITE_URL}/services/net-zero-strategy-workshops`,
          provider: { "@type": "Organization", name: "Net Zero International", url: SITE_URL },
        },
      }}
    >
      <PageHero
        eyebrow="Facilitated workshops"
        title="Net Zero Strategy Workshops"
        lead="Facilitated sessions that help your organisation develop a credible, science-aligned net zero strategy. From a board briefing to a full day building the roadmap, the aim is agreement on what to do and who will do it."
        image="workshop.jpg"
        alt="Facilitator at a whiteboard covered in sticky notes with a group"
        crumbs={[{ label: "Services", href: "/services" }, { label: "Net Zero Strategy Workshops" }]}
      >
        <ButtonLink href="/contact" arrow>Enquire about a workshop</ButtonLink>
      </PageHero>

      <Section>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-3">Our approach</p>
            <h2 className="h-section">From discussion to action</h2>
          </div>
          <div className="lg:col-span-7 space-y-4">
            <p>
              The workshops are designed to move an organisation from awareness to action. We combine specialist input on climate science, carbon accounting and regulatory requirements with structured facilitation, so that the group reaches agreement and leaves with outputs it can use.
            </p>
            <p>
              Each workshop is designed around your sector, your starting point and your objectives. We work with you beforehand to understand the context and plan the session accordingly.
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Formats" title="Workshops we run">
        <div className="border-t border-line">
          {workshops.map(w => (
            <div key={w.title} className="grid gap-3 md:grid-cols-12 md:gap-8 py-7 border-b border-line">
              <h3 className="md:col-span-4 h-sub">{w.title}</h3>
              <p className="md:col-span-5">{w.text}</p>
              <dl className="md:col-span-3 text-sm space-y-1">
                <div className="flex gap-2">
                  <dt className="text-muted">Duration:</dt>
                  <dd className="text-ink font-medium">{w.duration}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted">Participants:</dt>
                  <dd className="text-ink font-medium">{w.participants}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <Split image="discussion.jpg" alt="Hands gesturing in a meeting beside a laptop" eyebrow="Outcomes" title="What you leave with" flip>
          <CheckList items={outcomes} />
        </Split>
      </Section>

      <Section border={false}>
        <Photo src="team-table.jpg" alt="Small team working on laptops round a wooden table" ratio="21/9" className="hidden md:block" />
        <Photo src="team-table.jpg" alt="Small team working on laptops round a wooden table" ratio="4/3" className="md:hidden" />
      </Section>

      <CTA
        title="Ready to develop your net zero strategy?"
        text="Tell us who needs to be in the room and what you need to decide. We will design the workshop around that."
        image="field-sunrise.jpg"
        primary={{ label: "Get in touch", href: "/contact" }}
        secondary={{ label: "All services", href: "/services" }}
      />
    </Page>
  );
}
