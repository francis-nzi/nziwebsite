import { useParams } from "wouter";
import { ArrowLink, ButtonLink, CheckList, Columns, CTA, Page, PageHero, Section, Split, SITE_URL } from "@/components/site";
import NotFound from "@/pages/NotFound";

const SERVICE_LINKS = {
  crp: { href: "/services/carbon-reduction-plans", linkLabel: "Carbon Reduction Plans" },
  lca: { href: "/services/life-cycle-assessments", linkLabel: "Life Cycle Assessments" },
  scope3: { href: "/services/scope-3-supply-chain", linkLabel: "Scope 3 supply chain" },
  strategy: { href: "/services/net-zero-strategy-workshops", linkLabel: "Strategy workshops" },
  training: { href: "/training", linkLabel: "Training" },
};

type Region = {
  name: string;
  /** SEO title (unchanged from the original page). */
  title: string;
  metaDescription: string;
  /** On-page heading and intro. */
  heading: string;
  lead: string;
  image: string;
  alt: string;
  overviewTitle: string;
  overview: string[];
  overviewImage: string;
  overviewAlt: string;
  frameworks: string[];
  servicesTitle: string;
  services: { title: string; text: string; href: string; linkLabel: string }[];
  cta: { title: string; label: string; image: string };
};

const regionData: Record<string, Region> = {
  europe: {
    name: "Europe",
    title: "Carbon Reduction & Net Zero Services for European Businesses",
    metaDescription: "Expert carbon reduction support for European businesses. CSRD compliance, EU Taxonomy alignment, Life Cycle Assessments, and net zero strategy for organisations across Europe.",
    heading: "Carbon reduction and net zero for European businesses",
    lead: "Support with CSRD, the EU Taxonomy and SFDR, alongside carbon reduction plans, Life Cycle Assessments and net zero training.",
    image: "europe-town.jpg",
    alt: "A street of timbered houses in a historic German town",
    overviewTitle: "Several regimes, one set of numbers",
    overview: [
      "The EU's Corporate Sustainability Reporting Directive (CSRD) is among the most far-reaching corporate sustainability reporting requirements anywhere. It sits alongside the EU Taxonomy, SFDR and requirements set at national level.",
      "For a business in Europe that adds up to a complicated set of obligations that is still changing. We help you work out which apply, produce the emissions data they depend on, and build a net zero strategy aligned with the science.",
    ],
    overviewImage: "towers.jpg",
    overviewAlt: "Glass office towers seen from street level",
    frameworks: ["CSRD (Corporate Sustainability Reporting Directive)", "EU Taxonomy for Sustainable Activities", "SFDR (Sustainable Finance Disclosure Regulation)", "GHG Protocol", "ISO 14040/14044 LCA", "Science Based Targets initiative (SBTi)", "TCFD"],
    servicesTitle: "How we support European organisations",
    services: [
      { title: "Carbon reduction plans for CSRD", text: "Carbon reduction plans prepared with CSRD double materiality and disclosure standards in mind.", ...SERVICE_LINKS.crp },
      { title: "Life Cycle Assessments", text: "ISO-compliant LCAs for products and projects, supporting EU Taxonomy alignment and green procurement requirements.", ...SERVICE_LINKS.lca },
      { title: "Scope 3 supply chain", text: "Measurement of all Scope 3 emissions and a reduction strategy for European supply chains.", ...SERVICE_LINKS.scope3 },
      { title: "Net Zero Leaders training", text: "CPD-accredited training for European business leaders and sustainability teams.", ...SERVICE_LINKS.training },
    ],
    cta: { title: "Work out what European reporting rules mean for you", label: "Discuss your requirements", image: "forest.jpg" },
  },
  g20: {
    name: "G20 nations",
    title: "Carbon Reduction & Net Zero Services for G20 Businesses",
    metaDescription: "Carbon reduction plans, life cycle assessments, and net zero strategy for businesses in G20 countries. Aligned with GHG Protocol, SBTi, TCFD, and national reporting requirements.",
    heading: "Carbon reduction and net zero for G20 businesses",
    lead: "Carbon reduction plans, Life Cycle Assessments and net zero strategies for businesses in G20 countries, aligned with national and international frameworks.",
    image: "earth-night.jpg",
    alt: "Earth from orbit at night, with city lights visible",
    overviewTitle: "Where most of the world's emissions are regulated",
    overview: [
      "G20 nations account for approximately 80% of global greenhouse gas emissions. Their governments are tightening carbon reporting and reduction requirements, each in its own way.",
      "Businesses in these markets are under growing pressure from regulators, investors and customers to show that their net zero commitments are credible. We align our work with the regulatory and market requirements of the G20 country, or countries, you operate in.",
    ],
    overviewImage: "pylons.jpg",
    overviewAlt: "Electricity pylons at sunset",
    frameworks: ["GHG Protocol", "Science Based Targets initiative (SBTi)", "TCFD", "CDP", "ISO 14040/14044", "ISO 14064", "National reporting frameworks"],
    servicesTitle: "How we support organisations in G20 countries",
    services: [
      { title: "Carbon reduction plans", text: "Independently verified plans aligned with national and international requirements.", ...SERVICE_LINKS.crp },
      { title: "Life Cycle Assessments", text: "ISO-compliant LCAs supporting export market compliance and green procurement requirements.", ...SERVICE_LINKS.lca },
      { title: "Scope 3 supply chain", text: "Scope 3 measurement for complex international supply chains.", ...SERVICE_LINKS.scope3 },
      { title: "Net zero strategy", text: "Roadmaps aligned with the science for businesses operating across G20 markets.", ...SERVICE_LINKS.strategy },
    ],
    cta: { title: "Develop your net zero strategy across G20 markets", label: "Discuss your requirements", image: "turbines-sunset.jpg" },
  },
  africa: {
    name: "Africa",
    title: "Carbon Reduction & Net Zero Services for African Businesses",
    metaDescription: "Carbon reduction plans, LCAs, and net zero strategy for African businesses. Supporting export market compliance, international supply chain requirements, and voluntary carbon commitments.",
    heading: "Carbon reduction and net zero for African businesses",
    lead: "Carbon reduction and net zero strategy for African businesses, including export market compliance and international supply chain requirements.",
    image: "savanna.jpg",
    alt: "An acacia tree on the savanna at sunset",
    overviewTitle: "Buyers and investors are asking for evidence",
    overview: [
      "African businesses are increasingly asked to demonstrate carbon reduction commitments, both to satisfy international buyers and investors and to prepare for a low-carbon economy.",
      "You may be supplying European or UK markets where CSRD or PPN006 requirements reach you through your customers, or you may be setting a voluntary net zero strategy. In either case we work from your own operating context and the data you can realistically obtain.",
    ],
    overviewImage: "solar-field.jpg",
    overviewAlt: "Ground-mounted solar panels under a blue sky",
    frameworks: ["GHG Protocol", "ISO 14040/14044", "Science Based Targets initiative (SBTi)", "TCFD", "CDP", "CSRD (for EU market access)", "PPN006 (for UK market access)"],
    servicesTitle: "How we support African organisations",
    services: [
      { title: "Export market carbon compliance", text: "Carbon reduction plans and LCAs that meet UK PPN006, EU CSRD and other export market requirements.", ...SERVICE_LINKS.crp },
      { title: "Life Cycle Assessments", text: "ISO-compliant LCAs for products and projects, supporting access to international markets.", ...SERVICE_LINKS.lca },
      { title: "Net zero strategy", text: "Roadmaps aligned with the science for African businesses and organisations.", ...SERVICE_LINKS.strategy },
      { title: "Training and capacity building", text: "CPD-accredited training to build carbon accounting and net zero capability inside your organisation.", ...SERVICE_LINKS.training },
    ],
    cta: { title: "Meet the carbon requirements of international markets", label: "Discuss your requirements", image: "field-sunrise.jpg" },
  },
  "middle-east": {
    name: "the Middle East",
    title: "Carbon Reduction & Net Zero Services for Middle Eastern Organisations",
    metaDescription: "Carbon reduction plans, life cycle assessments, and net zero strategy for Middle Eastern businesses. Supporting national net zero commitments and international supply chain compliance.",
    heading: "Carbon reduction and net zero for Middle Eastern organisations",
    lead: "Net zero strategies, carbon reduction plans and Life Cycle Assessments for organisations in the Middle East as the region's energy transition gathers pace.",
    image: "dubai.jpg",
    alt: "The Dubai skyline at dusk",
    overviewTitle: "National targets are reaching individual businesses",
    overview: [
      "The Middle East is in the middle of a major energy transition, and several of its largest economies have made national net zero commitments.",
      "As the region diversifies its economies and widens its international trade, businesses are increasingly expected to show credible carbon reduction commitments of their own. Our work aligns with both national ambitions and international standards.",
    ],
    overviewImage: "solar-aerial.jpg",
    overviewAlt: "A solar farm seen from the air",
    frameworks: ["GHG Protocol", "ISO 14040/14044", "Science Based Targets initiative (SBTi)", "TCFD", "CDP", "National net zero frameworks", "CSRD (for EU market access)"],
    servicesTitle: "How we support Middle Eastern organisations",
    services: [
      { title: "Carbon reduction plans", text: "Independently verified plans aligned with national and international requirements.", ...SERVICE_LINKS.crp },
      { title: "Life Cycle Assessments", text: "ISO-compliant LCAs for products and projects in the Middle East.", ...SERVICE_LINKS.lca },
      { title: "Net zero strategy", text: "Roadmaps aligned with the science that support national net zero commitments.", ...SERVICE_LINKS.strategy },
      { title: "Net Zero Leaders training", text: "CPD-accredited training for Middle Eastern business leaders and sustainability teams.", ...SERVICE_LINKS.training },
    ],
    cta: { title: "Move your net zero programme forward", label: "Discuss your requirements", image: "solar-field.jpg" },
  },
  asia: {
    name: "Asia",
    title: "Carbon Reduction & Net Zero Services for Asian Businesses",
    metaDescription: "Carbon reduction plans, life cycle assessments, and Scope 3 supply chain solutions for Asian businesses. Supporting international supply chain compliance and net zero strategy.",
    heading: "Carbon reduction and net zero for Asian businesses",
    lead: "Carbon reduction and Life Cycle Assessment services for Asian businesses, including Scope 3 supply chain compliance for international markets.",
    image: "singapore.jpg",
    alt: "Marina Bay, Singapore, from above",
    overviewTitle: "Your customers' Scope 3 is your Scope 1 and 2",
    overview: [
      "Asian businesses sit at the centre of global supply chains, and so at the centre of global sustainability requirements.",
      "As large buyers in Europe, the UK and North America bring in Scope 3 supply chain requirements, Asian manufacturers and suppliers are being asked to measure and reduce their carbon emissions. We help you meet those requests and build a credible net zero strategy behind them.",
    ],
    overviewImage: "port.jpg",
    overviewAlt: "A container port seen from the air",
    frameworks: ["GHG Protocol", "ISO 14040/14044", "Science Based Targets initiative (SBTi)", "TCFD", "CDP", "CSRD (for EU supply chains)", "PPN006 (for UK supply chains)"],
    servicesTitle: "How we support Asian organisations",
    services: [
      { title: "Supply chain carbon compliance", text: "Carbon reduction plans and Scope 3 assessments that meet international buyer requirements.", ...SERVICE_LINKS.crp },
      { title: "Life Cycle Assessments", text: "ISO-compliant LCAs for manufactured products, supporting export market requirements.", ...SERVICE_LINKS.lca },
      { title: "Scope 3 supply chain", text: "Scope 3 measurement for complex Asian supply chains.", ...SERVICE_LINKS.scope3 },
      { title: "Net zero strategy", text: "Roadmaps aligned with the science for Asian businesses.", ...SERVICE_LINKS.strategy },
    ],
    cta: { title: "Meet international supply chain requirements", label: "Discuss your requirements", image: "highlands.jpg" },
  },
};

export default function InternationalRegion() {
  const { region } = useParams<{ region: string }>();
  const data = region ? regionData[region] : undefined;

  if (!data) return <NotFound />;

  const crumb = data.name.replace(/^the /, "");

  return (
    <Page
      seo={{
        title: data.title,
        description: data.metaDescription,
        canonical: `/international/${region}`,
        schema: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: data.title,
          description: data.metaDescription,
          url: `${SITE_URL}/international/${region}`,
        },
      }}
    >
      <PageHero
        eyebrow="International"
        title={data.heading}
        lead={data.lead}
        image={data.image}
        alt={data.alt}
        crumbs={[{ label: "International", href: "/international" }, { label: crumb.charAt(0).toUpperCase() + crumb.slice(1) }]}
      >
        <ButtonLink href="/contact" arrow>{data.cta.label}</ButtonLink>
      </PageHero>

      <Section>
        <Split image={data.overviewImage} alt={data.overviewAlt} eyebrow="Overview" title={data.overviewTitle} flip>
          {data.overview.map(p => <p key={p}>{p}</p>)}
        </Split>
      </Section>

      <Section>
        <div className="grid gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <p className="eyebrow mb-3">Frameworks and standards</p>
            <h2 className="h-section">What we work to in {data.name}</h2>
          </div>
          <div className="md:col-span-7">
            <CheckList items={data.frameworks} />
          </div>
        </div>
      </Section>

      <Section eyebrow="Services" title={data.servicesTitle} border={false}>
        <Columns items={data.services} columns={4} />
        <div className="mt-14 pt-8 border-t border-line">
          <ArrowLink href="/international">Other regions we work in</ArrowLink>
        </div>
      </Section>

      <CTA
        title={data.cta.title}
        text={`Tell us what you need to report in ${data.name}, to whom and by when. We will tell you what it involves.`}
        image={data.cta.image}
        primary={{ label: "Get in touch", href: "/contact" }}
      />
    </Page>
  );
}
