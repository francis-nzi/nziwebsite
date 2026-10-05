import { ArrowLink, ButtonLink, CheckList, Columns, CTA, Page, PageHero, Photo, Section, Split, SITE_URL } from "@/components/site";

const values = [
  {
    title: "Honesty",
    text: "We tell clients what they need to hear, not what they want to hear. Our advice rests on science and evidence, not commercial convenience.",
  },
  {
    title: "Professionalism",
    text: "We hold our work to a high standard of technical rigour and professional conduct. Every report, plan and recommendation has to be defensible.",
  },
  {
    title: "People first",
    text: "We are a people business. We build long-term relationships with clients by understanding their context, constraints and ambitions.",
  },
  {
    title: "Practical impact",
    text: "We focus on what works. The aim is measurable, real-world reductions, not compliance theatre or greenwashing.",
  },
];

const standards = [
  "GHG Protocol (Corporate Standard, Scope 3, Land Sector)",
  "ISO 14040/14044 Life Cycle Assessment",
  "ISO 14064 greenhouse gas accounting",
  "Science Based Targets initiative (SBTi)",
  "Intergovernmental Panel on Climate Change (IPCC) methodologies",
];

const regulations = [
  "PPN006 Carbon Reduction Plans",
  "NHS Evergreen Sustainable Supplier Assessment",
  "Streamlined Energy and Carbon Reporting (SECR)",
  "EU Corporate Sustainability Reporting Directive (CSRD)",
  "Task Force on Climate-related Financial Disclosures (TCFD)",
  "Carbon Disclosure Project (CDP)",
];

export default function About() {
  return (
    <Page
      seo={{
        title: "About Us — Expert Carbon Reduction Consultants",
        description:
          "Net Zero International is a founding member of the Carbon Accounting Alliance. Expert carbon reduction consultants delivering validated plans, LCAs, and CPD-accredited training. Honest, professional, people-first.",
        canonical: "/about",
        schema: {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Net Zero International",
          description: "Net Zero International — expert carbon reduction consultants and founding member of the Carbon Accounting Alliance.",
          url: `${SITE_URL}/about`,
        },
      }}
    >
      <PageHero
        crumbs={[{ label: "About" }]}
        eyebrow="About us"
        title="A specialist carbon reduction consultancy"
        lead="We work where science, regulation and business strategy meet. Our aim is to help organisations reach net zero in fact, with reductions that can be measured, not only compliance on paper."
        image="team-table.jpg"
        alt="A small team working on laptops round a wooden table"
      >
        <ButtonLink href="/contact" arrow>Talk to us</ButtonLink>
        <ButtonLink href="/training" variant="outline">View training courses</ButtonLink>
      </PageHero>

      {/* Mission */}
      <Section>
        <Split
          image="desk-overhead.jpg"
          alt="Overhead view of a team's shared desk with laptops"
          eyebrow="Our mission"
          title="Expertise, sound method and honest advice"
        >
          <p>
            Net Zero International was founded on a simple belief: reaching net zero takes real expertise, rigorous methodology and honest advice. Generic frameworks and tick-box compliance do not get an organisation there.
          </p>
          <p>
            We work with organisations of all sizes, in any sector, in the UK, Europe, the G20 and beyond. The work may be a validated Carbon Reduction Plan, an ISO-compliant Life Cycle Assessment, training for your team or a Scope 3 strategy. In each case we bring the technical knowledge and practical experience to see it through.
          </p>
          <p>
            Our outputs are independently verified, and our client relationships are built on trust and transparency.
          </p>
          <div className="pt-3">
            <ArrowLink href="/services">See our services</ArrowLink>
          </div>
        </Split>
      </Section>

      {/* Values */}
      <Section eyebrow="Our values" title="How we work">
        <Columns columns={4} items={values} />
      </Section>

      {/* Expertise */}
      <Section
        eyebrow="Our expertise"
        title="The standards and regulations we work to"
        lead="We apply the recognised carbon accounting standards and prepare work for the reporting and procurement regimes our clients have to meet."
      >
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          <div className="lg:col-span-7 space-y-10">
            <div>
              <h3 className="h-sub mb-4">Standards and methodologies</h3>
              <CheckList items={standards} />
            </div>
            <div>
              <h3 className="h-sub mb-4">Regulation, procurement and disclosure</h3>
              <CheckList items={regulations} />
            </div>
          </div>
          <div className="lg:col-span-5">
            <Photo src="solar-aerial.jpg" alt="Aerial view of a solar farm" ratio="4/5" />
          </div>
        </div>
      </Section>

      {/* Accreditations */}
      <Section eyebrow="Accreditations and memberships" title="Accreditation and membership">
        <div className="grid gap-x-16 gap-y-10 md:grid-cols-2">
          <div className="border-t border-line pt-6">
            <h3 className="h-sub mb-3">CPD Certification Service</h3>
            <p>
              Our Net Zero Leaders training course is accredited by the CPD Certification Service.
            </p>
            <div className="mt-4">
              <ArrowLink href="/training">About the course</ArrowLink>
            </div>
          </div>
          <div className="border-t border-line pt-6">
            <h3 className="h-sub mb-3">Carbon Accounting Alliance</h3>
            <p>
              We are a founding member of the Carbon Accounting Alliance, a global body committed to improving the quality and consistency of carbon accounting practice.
            </p>
          </div>
        </div>
      </Section>

      <CTA
        title="Work with us"
        text="Tell us what you need to measure, report or reduce, and we will tell you what it involves."
        image="forest.jpg"
        primary={{ label: "Get in touch", href: "/contact" }}
        secondary={{ label: "View training courses", href: "/training" }}
      />
    </Page>
  );
}
