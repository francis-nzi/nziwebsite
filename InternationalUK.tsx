import { ArrowLink, ButtonLink, CheckList, Columns, CTA, Page, PageHero, Section, Split, SITE_URL } from "@/components/site";

const nhsTimeline = [
  { date: "April 2023", event: "Carbon Reduction Plans required for all NHS contracts of £5m a year or more, covering Scope 1, Scope 2 and some Scope 3 emissions." },
  { date: "April 2024", event: "Requirement extended to all NHS contracts of £1m a year or more." },
  { date: "April 2025", event: "Scope 3 reporting requirements expanded across the NHS supply chain." },
  { date: "April 2027", event: "Full Scope 3 compliance required of all NHS suppliers, across all 15 categories." },
];

const crpContents = [
  "A Carbon Reduction Plan published on your company website",
  "A baseline measurement of carbon emissions: Scope 1, Scope 2 and relevant Scope 3",
  "A commitment to net zero by 2050 at the latest",
  "Reduction targets and milestones",
  "The environmental management measures you have in place",
  "Director-level sign-off confirming the plan is accurate",
  "An update every year",
];

const ukServices = [
  { title: "PPN006 Carbon Reduction Plans", text: "Independently verified plans that meet the PPN006 technical requirements for UK government procurement.", href: "/services/carbon-reduction-plans", linkLabel: "Carbon Reduction Plans" },
  { title: "NHS Evergreen assessment", text: "Support with the NHS Evergreen Sustainable Supplier Assessment, including readiness for Scope 3.", href: "/services/scope-3-supply-chain", linkLabel: "Scope 3 support" },
  { title: "SECR reporting", text: "Streamlined Energy and Carbon Reporting for large UK companies: accurate, compliant and on time.", href: "/services/carbon-reduction-plans", linkLabel: "Carbon reporting" },
  { title: "Scope 3 supply chain", text: "Measurement of all Scope 3 emissions and a strategy to reduce them. The priority for NHS suppliers before 2027.", href: "/services/scope-3-supply-chain", linkLabel: "Scope 3 supply chain" },
  { title: "Life Cycle Assessments", text: "ISO 14040/14044 studies for products and projects supplied to the NHS and the wider UK public sector.", href: "/services/life-cycle-assessments", linkLabel: "Life Cycle Assessments" },
  { title: "Net Zero Leaders training", text: "CPD-accredited training that gives NHS supplier teams the knowledge to lead on net zero.", href: "/training", linkLabel: "Training" },
];

export default function InternationalUK() {
  return (
    <Page
      seo={{
        title: "Carbon Reduction for UK & NHS Suppliers — PPN006, NHS Evergreen, SECR Compliance",
        description:
          "Expert carbon reduction support for UK businesses and NHS suppliers. PPN006-compliant Carbon Reduction Plans, NHS Evergreen assessment, SECR reporting, and full Scope 3 compliance by 2027.",
        canonical: "/international/uk",
        schema: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Carbon Reduction for UK & NHS Suppliers",
          description: "Expert carbon reduction support for UK businesses and NHS suppliers. PPN006, NHS Evergreen, SECR compliance.",
          url: `${SITE_URL}/international/uk`,
          keywords: "Carbon Reduction Plan UK, PPN006, NHS Evergreen, SECR, Scope 3 NHS suppliers, net zero UK, carbon accounting UK",
        },
      }}
    >
      <PageHero
        eyebrow="United Kingdom"
        title="Carbon reduction for UK and NHS suppliers"
        lead="Organisations that supply the UK public sector face growing carbon requirements, from PPN006 Carbon Reduction Plans to the NHS Evergreen programme and its April 2027 Scope 3 deadline. We help you meet them and keep bidding."
        image="london.jpg"
        alt="The River Thames and Tower Bridge, London, from above"
        crumbs={[{ label: "International", href: "/international" }, { label: "United Kingdom" }]}
      >
        <ButtonLink href="/contact" arrow>Talk to us about compliance</ButtonLink>
        <ButtonLink href="/services/carbon-reduction-plans" variant="outline">Carbon Reduction Plans</ButtonLink>
      </PageHero>

      <Section>
        <Split image="hospital-ward.jpg" alt="An empty hospital ward" eyebrow="NHS Evergreen programme" title="April 2027: full Scope 3 for every NHS supplier" flip>
          <p>
            Through its Evergreen Sustainable Supplier Assessment, the NHS is requiring all suppliers to measure, report and reduce their carbon emissions. By April 2027 that means full Scope 3, across all 15 categories.
          </p>
          <p>
            For most NHS suppliers, Scope 3 is by far the largest share of total emissions, and the data sits with other organisations. Meeting the deadline takes preparation, and the time to start is now.
          </p>
          <div className="pt-3"><ArrowLink href="/services/scope-3-supply-chain">How we approach Scope 3</ArrowLink></div>
        </Split>
      </Section>

      <Section eyebrow="Timeline" title="How the NHS requirements have tightened">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left border-t border-line">
            <thead>
              <tr className="border-b border-line text-sm text-muted">
                <th scope="col" className="py-3 pr-8 font-semibold w-40">From</th>
                <th scope="col" className="py-3 font-semibold">Requirement</th>
              </tr>
            </thead>
            <tbody>
              {nhsTimeline.map(row => (
                <tr key={row.date} className="border-b border-line align-top">
                  <th scope="row" className="py-5 pr-8 font-display font-semibold text-ink whitespace-nowrap">{row.date}</th>
                  <td className="py-5">{row.event}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <Split image="planning.jpg" alt="Two people reviewing printed documents at a desk" eyebrow="PPN006" title="What your Carbon Reduction Plan must include">
          <p>
            Procurement Policy Note 006 requires suppliers bidding for UK government contracts above certain thresholds to publish a Carbon Reduction Plan that meets specific technical requirements.
          </p>
          <CheckList items={crpContents} />
          <p>Our plans cover each of these, and the emissions data in them is independently verified.</p>
          <div className="pt-3"><ButtonLink href="/services/carbon-reduction-plans" arrow>Our Carbon Reduction Plan service</ButtonLink></div>
        </Split>
      </Section>

      <Section eyebrow="UK services" title="What we do for UK organisations" border={false}>
        <Columns items={ukServices} columns={3} />
      </Section>

      <CTA
        title="April 2027 is closer than it looks"
        text="Full Scope 3 takes time to measure properly. Start your programme now so that you are ready for the deadline and your NHS contracts are not at risk."
        image="highlands.jpg"
        primary={{ label: "Start your Scope 3 assessment", href: "/contact" }}
        secondary={{ label: "Train your team", href: "/training" }}
      />
    </Page>
  );
}
