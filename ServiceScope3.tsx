import { ArrowLink, ButtonLink, CTA, NumberedList, Page, PageHero, Photo, Section, Split, SITE_URL } from "@/components/site";

const upstream = [
  "Purchased goods and services",
  "Capital goods",
  "Fuel- and energy-related activities",
  "Upstream transportation",
  "Waste generated in operations",
  "Business travel",
  "Employee commuting",
  "Upstream leased assets",
];

const downstream = [
  "Downstream transportation",
  "Processing of sold products",
  "Use of sold products",
  "End-of-life treatment",
  "Downstream leased assets",
  "Franchises",
  "Investments",
];

const process = [
  { title: "Scope 3 screening", text: "We identify and prioritise the Scope 3 categories that are most material to your organisation, using spend-based and activity-based screening." },
  { title: "Data collection", text: "We draw up a data collection plan and gather primary and secondary data from across your value chain." },
  { title: "Emissions calculation", text: "We calculate your Scope 3 emissions using GHG Protocol methodology and appropriate emission factors." },
  { title: "Hotspot analysis", text: "We show where the largest emissions sit in your supply chain and wider value chain." },
  { title: "Reduction strategy", text: "We develop a credible, science-aligned strategy to reduce Scope 3 emissions across your value chain." },
  { title: "Reporting and disclosure", text: "We prepare Scope 3 disclosures for Carbon Reduction Plans, CDP, TCFD, CSRD and other reporting frameworks." },
];

function CategoryList({ heading, items, start }: { heading: string; items: string[]; start: number }) {
  return (
    <div>
      <h3 className="h-sub mb-4">{heading}</h3>
      <ol className="border-t border-line">
        {items.map((name, i) => (
          <li key={name} className="flex gap-4 py-2.5 border-b border-line text-[0.9375rem]">
            <span className="w-6 shrink-0 font-display font-semibold text-brand tabular-nums">{start + i}</span>
            <span>{name}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function ServiceScope3() {
  return (
    <Page
      seo={{
        title: "Scope 3 Supply Chain Solutions — NHS 2027 Compliance",
        description:
          "Comprehensive Scope 3 emissions measurement and reduction strategies. Essential for NHS suppliers ahead of the April 2027 full Scope 3 compliance deadline. GHG Protocol compliant.",
        canonical: "/services/scope-3-supply-chain",
        schema: {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Scope 3 Supply Chain Solutions",
          description: "Scope 3 emissions measurement and reduction strategies to GHG Protocol methodology.",
          url: `${SITE_URL}/services/scope-3-supply-chain`,
          provider: { "@type": "Organization", name: "Net Zero International", url: SITE_URL },
        },
      }}
    >
      <PageHero
        eyebrow="GHG Protocol, all 15 categories"
        title="Scope 3 supply chain"
        lead="For most organisations, Scope 3 accounts for 70 to 90% of total carbon emissions. We help you measure, understand and reduce yours, and prepare for the NHS full Scope 3 requirement in April 2027."
        image="port.jpg"
        alt="Aerial view of a container port"
        crumbs={[{ label: "Services", href: "/services" }, { label: "Scope 3 Supply Chain" }]}
      >
        <ButtonLink href="/contact" arrow>Start your Scope 3 assessment</ButtonLink>
      </PageHero>

      <Section>
        <Split image="trucks.jpg" alt="Aerial view of lorries parked at a logistics depot" eyebrow="Why Scope 3 matters" title="The largest source of emissions, and the most often overlooked">
          <p>
            The GHG Protocol defines 15 categories of Scope 3 emissions, covering upstream and downstream activities. For most organisations these indirect emissions are the great majority of the total, yet they are the least understood and the hardest to measure.
          </p>
          <p>
            A net zero strategy that deals only with Scope 1 and Scope 2 will not achieve much. Regulators, investors and customers increasingly require full Scope 3 disclosure, and from April 2027 the NHS will require every supplier to report all relevant Scope 3 emissions.
          </p>
          <p>We support the whole process, from initial screening and data collection through to the reduction strategy and regulatory reporting.</p>
          <div className="pt-2"><ArrowLink href="/international/uk">What April 2027 means for NHS suppliers</ArrowLink></div>
        </Split>
      </Section>

      <Section eyebrow="GHG Protocol" title="The 15 Scope 3 categories">
        <div className="grid gap-x-16 gap-y-10 md:grid-cols-2">
          <CategoryList heading="Upstream (categories 1 to 8)" items={upstream} start={1} />
          <CategoryList heading="Downstream (categories 9 to 15)" items={downstream} start={9} />
        </div>
      </Section>

      <Section eyebrow="Our process" title="How we work through Scope 3">
        <NumberedList items={process} />
        <Photo src="warehouse.jpg" alt="Interior of a large distribution warehouse" ratio="21/9" className="mt-14 hidden md:block" />
        <Photo src="warehouse.jpg" alt="Interior of a large distribution warehouse" ratio="4/3" className="mt-10 md:hidden" />
      </Section>

      <CTA
        title="Start before the 2027 deadline"
        text="Scope 3 data takes time to collect because it sits with your suppliers. Begin the assessment now and you will be ready to report."
        image="solar-aerial.jpg"
        primary={{ label: "Get in touch", href: "/contact" }}
        secondary={{ label: "Carbon Reduction Plans", href: "/services/carbon-reduction-plans" }}
      />
    </Page>
  );
}
