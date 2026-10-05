import { ArrowLink, ButtonLink, CheckList, Columns, CTA, FAQ, Page, PageHero, Section, Split, SITE_URL } from "@/components/site";

const included = [
  "Baseline carbon emissions measurement (Scope 1, Scope 2 and relevant Scope 3)",
  "Net zero commitment aligned with the Science Based Targets initiative",
  "Reduction targets and milestones with clear timelines",
  "At least five environmental management measures in implementation",
  "Director-signed declaration confirming accuracy and commitment",
  "Independent verification of emissions data",
  "Annual update process and progress reporting framework",
];

const frameworks = [
  { title: "PPN006", text: "The UK government procurement requirement for suppliers bidding for contracts worth £5m a year or more." },
  { title: "NHS Evergreen", text: "The NHS sustainable supplier assessment. Full Scope 3 reporting is required from April 2027." },
  { title: "SECR", text: "Streamlined Energy and Carbon Reporting, which is mandatory for large UK companies." },
  { title: "CSRD", text: "The EU Corporate Sustainability Reporting Directive, which applies to large companies operating in Europe." },
];

const faqs = [
  {
    q: "What is the difference between a Carbon Reduction Plan and a net zero strategy?",
    a: "A Carbon Reduction Plan (CRP) is a formal, published document that meets specific regulatory requirements such as PPN006. It contains a baseline carbon emissions measurement, reduction targets and a director-signed commitment. A net zero strategy is broader: it is the internal roadmap your organisation follows to reach net zero. We help you develop both.",
  },
  {
    q: "How long does it take to produce a Carbon Reduction Plan?",
    a: "A typical CRP takes 4 to 8 weeks from first data collection to the final, verified report. The timeline depends on the complexity of your organisation and how readily the data is available. We give you a project plan at the start.",
  },
  {
    q: "Does the CRP need to be independently verified?",
    a: "Yes. PPN006 requires the emissions data in your CRP to be independently verified. The CRPs we produce are independently verified and meet this requirement.",
  },
  {
    q: "How often does the CRP need to be updated?",
    a: "PPN006 requires your CRP to be updated every year. We offer an annual update service so that your plan stays current and compliant.",
  },
  {
    q: "We are an NHS supplier. What do we need to do by 2027?",
    a: "From April 2027 all NHS suppliers must publish a CRP covering global Scope 1, Scope 2 and all relevant Scope 3 emissions. That is a significant expansion of the current requirement. We work with NHS suppliers on exactly this, so contact us to talk through your situation.",
  },
];

export default function ServiceCRP() {
  return (
    <Page
      seo={{
        title: "Carbon Reduction Plans — PPN006, NHS Evergreen, SECR & CSRD Compliant",
        description:
          "Independently verified Carbon Reduction Plans compliant with PPN006, NHS Evergreen, SECR, and CSRD. Expert support for UK government and NHS suppliers. Full Scope 3 compliance by 2027.",
        canonical: "/services/carbon-reduction-plans",
        schema: {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Carbon Reduction Plans",
          description: "Independently verified Carbon Reduction Plans compliant with PPN006, NHS Evergreen, SECR, and CSRD.",
          url: `${SITE_URL}/services/carbon-reduction-plans`,
          provider: { "@type": "Organization", name: "Net Zero International", url: SITE_URL },
        },
      }}
    >
      <PageHero
        eyebrow="PPN006, NHS Evergreen, SECR, CSRD"
        title="Carbon Reduction Plans"
        lead="Independently verified Carbon Reduction Plans that meet the technical requirements of PPN006, NHS Evergreen, SECR and CSRD. For organisations of any size that need to show a real commitment to net zero and keep access to public sector contracts."
        image="planning.jpg"
        alt="Two people reviewing printed documents with laptops"
        crumbs={[{ label: "Services", href: "/services" }, { label: "Carbon Reduction Plans" }]}
      >
        <ButtonLink href="/contact" arrow>Discuss your requirements</ButtonLink>
      </PageHero>

      <Section>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-3">What is included</p>
            <h2 className="h-section">A compliant, verified Carbon Reduction Plan</h2>
            <p className="mt-5">
              Our plans are produced by carbon accountants and independently verified. Each one contains every element that PPN006 and NHS Evergreen require, prepared carefully enough to withstand scrutiny from procurement teams, investors and regulators.
            </p>
          </div>
          <div className="lg:col-span-7 lg:pt-10">
            <CheckList items={included} />
          </div>
        </div>
      </Section>

      <Section>
        <Split image="hospital-ward.jpg" alt="An empty hospital ward" eyebrow="April 2027" title="NHS suppliers: the Scope 3 deadline" flip>
          <p>
            From April 2027 all NHS suppliers must report their full Scope 3 emissions in a published Carbon Reduction Plan, alongside Scope 1 and Scope 2.
          </p>
          <p>If you supply the NHS and your current plan covers only part of Scope 3, it is worth starting on the rest now.</p>
          <div className="pt-2 flex flex-wrap gap-x-8 gap-y-3">
            <ArrowLink href="/international/uk">What UK suppliers need to do</ArrowLink>
            <ArrowLink href="/services/scope-3-supply-chain">Scope 3 support</ArrowLink>
          </div>
        </Split>
      </Section>

      <Section eyebrow="Regulatory frameworks" title="The frameworks we work to">
        <Columns columns={4} items={frameworks} />
      </Section>

      <Section eyebrow="Questions" title="Frequently asked questions">
        <FAQ items={faqs} />
      </Section>

      <CTA
        title="Start your Carbon Reduction Plan"
        text="There is no need to wait for the 2027 deadline. Contact us and we will set out what the process involves."
        image="highlands.jpg"
        primary={{ label: "Get started", href: "/contact" }}
        secondary={{ label: "All services", href: "/services" }}
      />
    </Page>
  );
}
