import { ButtonLink, CheckList, Columns, CTA, FAQ, NumberedList, Page, PageHero, Section, Split, SITE_URL } from "@/components/site";

const phases = [
  { title: "Goal and scope definition", text: "We agree the purpose of the study, the functional unit, the system boundaries and the data quality required." },
  { title: "Life cycle inventory (LCI)", text: "We collect and compile data on every input and output across the life cycle of the product or project." },
  { title: "Life cycle impact assessment (LCIA)", text: "We evaluate the potential environmental impacts using recognised impact categories and characterisation factors." },
  { title: "Interpretation", text: "We analyse the results, identify the hotspots, draw conclusions and recommend improvements." },
];

const types = [
  { title: "Product LCAs", text: "The environmental impact of a manufactured product from raw material extraction to end of life. Used for eco-design, Environmental Product Declarations (EPDs) and green procurement." },
  { title: "Project LCAs", text: "The embodied carbon and wider environmental impact of construction projects, infrastructure and capital investments." },
  { title: "Comparative LCAs", text: "The environmental performance of two or more products, processes or systems set side by side, to support a decision." },
  { title: "Screening LCAs", text: "A quicker, lower-cost assessment that identifies the hotspots and shows where deeper analysis is worth doing." },
];

const faqs = [
  {
    q: "What is the difference between an LCA and a carbon emissions assessment?",
    a: "A carbon emissions assessment measures greenhouse gas emissions only, usually expressed in CO₂e. An LCA is broader. It covers several environmental impact categories, including climate change, water use, land use, resource depletion and ecotoxicity, and so gives a fuller picture of environmental performance.",
  },
  {
    q: "How long does an LCA take?",
    a: "A full LCA typically takes 6 to 12 weeks, depending on the complexity of the product or project and how readily the data is available. A screening LCA can be completed in 2 to 4 weeks. We set out the timeline at the start of every project.",
  },
  {
    q: "What data do I need to provide?",
    a: "We identify the data requirements with you at the start. They usually cover materials, energy use, transport, manufacturing processes and end-of-life treatment. We supply data collection templates to keep the work on your side manageable.",
  },
  {
    q: "Can the LCA report be used for marketing claims?",
    a: "Yes, provided the claims are substantiated by the LCA findings and comply with ISO 14021 on environmental labels and declarations. We can advise on how to communicate the findings accurately and in line with the relevant standards.",
  },
];

export default function ServiceLCA() {
  return (
    <Page
      seo={{
        title: "Life Cycle Assessments (LCA) — ISO 14040/14044 Compliant",
        description:
          "ISO 14040/14044 compliant Life Cycle Assessments for products and projects. Independent, rigorous LCA reports for procurement, regulatory compliance, and environmental claims.",
        canonical: "/services/life-cycle-assessments",
        schema: {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Life Cycle Assessments",
          description: "ISO 14040/14044 compliant Life Cycle Assessments for products and projects.",
          url: `${SITE_URL}/services/life-cycle-assessments`,
          provider: { "@type": "Organization", name: "Net Zero International", url: SITE_URL },
          serviceType: "Life Cycle Assessment",
        },
      }}
    >
      <PageHero
        eyebrow="ISO 14040 and ISO 14044"
        title="Life Cycle Assessments"
        lead="We quantify the environmental impact of a product or project across its whole life, from raw material extraction to end of life. The result is the evidence you need for procurement, regulatory compliance and environmental claims."
        image="engineer.jpg"
        alt="Engineer working at a laptop beside manufacturing equipment"
        crumbs={[{ label: "Services", href: "/services" }, { label: "Life Cycle Assessments" }]}
      >
        <ButtonLink href="/contact" arrow>Discuss your LCA requirements</ButtonLink>
      </PageHero>

      <Section>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-3">What is an LCA?</p>
            <h2 className="h-section">Environmental impact, measured at every stage</h2>
          </div>
          <div className="lg:col-span-7 space-y-4">
            <p>
              A Life Cycle Assessment is a systematic method for evaluating the environmental impacts of a product or project at each stage of its life: raw material extraction and processing, manufacture, distribution, use, and disposal or recycling.
            </p>
            <p>
              Unlike a carbon emissions assessment, an LCA covers several impact categories, including climate change, water use, land use, resource depletion and ecotoxicity. This cradle-to-grave view shows where the impacts really sit.
            </p>
            <p>
              Every LCA we carry out follows the international standards ISO 14040 and ISO 14044, so the report is defensible and can be used in procurement, regulatory and marketing contexts.
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Method" title="The four phases of an LCA" lead="ISO 14040 sets out four phases. Every study we deliver works through them in order.">
        <NumberedList items={phases} />
      </Section>

      <Section>
        <Split image="drawings.jpg" alt="Overhead view of a person marking up technical drawings" eyebrow="What you receive" title="A report that stands up to scrutiny" flip>
          <CheckList
            items={[
              "ISO 14040/14044 compliant methodology",
              "Independent, third-party verified report",
              "Suitable for EPDs, procurement bids and marketing claims",
              "Products, projects and processes in any industry",
              "Clear findings and recommendations you can act on",
            ]}
          />
        </Split>
      </Section>

      <Section eyebrow="Applications" title="Types of LCA we deliver">
        <Columns columns={4} items={types} />
      </Section>

      <Section eyebrow="Questions" title="Frequently asked questions">
        <FAQ items={faqs} />
      </Section>

      <CTA
        title="Ready to commission an LCA?"
        text="Tell us about the product or project. We will come back with a clear scope, timeline and fee proposal."
        image="forest.jpg"
        primary={{ label: "Get in touch", href: "/contact" }}
        secondary={{ label: "All services", href: "/services" }}
      />
    </Page>
  );
}
