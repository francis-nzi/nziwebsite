import { useState } from "react";
import { trpc } from "@/lib/trpc";
import BookingModal, { MODE_LABEL, sessionDate, type TrainingSession } from "@/components/BookingModal";
import { ButtonLink, CheckList, CTA, FAQ, NumberedList, Page, PageHero, Section, Split, SITE_URL } from "@/components/site";

const modules = [
  { title: "The Science of Climate Change", text: "Understanding the physical science basis, key IPCC findings, and the 1.5°C pathway." },
  { title: "Carbon Accounting Fundamentals", text: "GHG Protocol, Scope 1, 2 and 3 emissions, boundary setting, and measurement methodologies." },
  { title: "Science-Based Targets", text: "SBTi framework, near-term and long-term targets, sector-specific pathways, and validation." },
  { title: "Regulatory Frameworks", text: "PPN006, NHS Evergreen, SECR, CSRD, TCFD — what applies to your organisation and when." },
  { title: "Net Zero Strategy Development", text: "Developing a credible, science-aligned net zero roadmap with prioritised reduction actions." },
  { title: "Reporting & Communication", text: "How to report, disclose, and communicate your net zero progress to stakeholders." },
];

const outcomes = [
  "Understand the science and urgency of climate change",
  "Apply GHG Protocol methodology to measure and manage your organisation's carbon emissions",
  "Develop a credible net zero strategy aligned with Science-Based Targets",
  "Navigate key regulatory requirements including PPN006, SECR, and NHS Evergreen",
  "Communicate your net zero commitments effectively to stakeholders",
  "Create an actionable net zero roadmap for your organisation",
];

const audiences = ["Business Leaders & Directors", "Sustainability Managers", "Procurement Professionals", "Finance & Risk Teams", "Operations Managers", "ESG & Reporting Teams"];

const faqs = [
  {
    q: "What is included in the course fee?",
    a: "The online course fee includes all course materials, CPD certificate on completion, and access to post-course resources. In-person courses additionally include lunch and a post-course action planning session.",
  },
  {
    q: "Can we book a private course for our organisation?",
    a: "Yes. We offer bespoke delivery for single organisations, with content tailored to your sector, supply chain, and specific compliance requirements. Contact us to discuss your requirements and we will arrange a suitable date.",
  },
  {
    q: "What is the maximum group size?",
    a: "Our courses accommodate up to 12 participants per session, ensuring a high-quality, interactive learning experience for all participants.",
  },
  {
    q: "Is the course suitable for beginners?",
    a: "Yes. The course is designed to be accessible to participants with no prior knowledge of carbon accounting or net zero strategy. It is equally valuable for those with some existing knowledge who want to deepen their understanding.",
  },
  {
    q: "How will I receive my CPD certificate?",
    a: "CPD certificates are issued digitally within 5 business days of course completion. They are accredited by the CPD Certification Service and can be added to your professional development records.",
  },
];

const details = [
  { label: "Duration", value: "One day (6–7 hours)" },
  { label: "Group size", value: "Up to 12 participants" },
  { label: "Format", value: "Online or in person" },
  { label: "Accreditation", value: "CPD Certification Service" },
  { label: "Certificate", value: "Digital CPD certificate" },
];

function SessionRow({ session, onBook }: { session: TrainingSession; onBook: (s: TrainingSession) => void }) {
  const available = Math.max(0, session.capacity - session.bookedCount);
  const full = available === 0 || session.status === "full";
  return (
    <li className="grid gap-4 md:grid-cols-12 md:items-center py-6 border-b border-line">
      <div className="md:col-span-5">
        <p className="font-display font-semibold text-ink text-lg">{sessionDate(session)}</p>
        <p className="text-sm text-muted">{session.time}, {session.durationHours} hours (UK time)</p>
      </div>
      <div className="md:col-span-3">
        <p className="text-ink font-medium">{MODE_LABEL[session.deliveryMode]}{session.location ? `, ${session.location}` : ""}</p>
        <p className={`text-sm ${!full && available <= 3 ? "text-alert font-medium" : "text-muted"}`}>
          {full ? "Fully booked" : available <= 3 ? `${available} ${available === 1 ? "place" : "places"} left` : "Places available"}
        </p>
      </div>
      <div className="md:col-span-2">
        {session.priceGbp != null && <p className="text-ink font-semibold">£{session.priceGbp.toLocaleString("en-GB")} <span className="text-sm font-normal text-muted">+ VAT</span></p>}
      </div>
      <div className="md:col-span-2 md:text-right">
        <button type="button" className="btn btn-primary btn-sm" disabled={full} onClick={() => onBook(session)}>{full ? "Full" : "Book"}</button>
      </div>
    </li>
  );
}

export default function Training() {
  const [selected, setSelected] = useState<TrainingSession | null>(null);
  const { data: sessions, isLoading, isError } = trpc.training.getSessions.useQuery();

  return (
    <Page
      seo={{
        title: "Net Zero Leaders — CPD Accredited Training Course",
        description: "CPD-accredited Net Zero Leaders training for business leaders, sustainability managers and procurement teams. Online and in person.",
        canonical: "/training",
        schema: {
          "@context": "https://schema.org",
          "@type": "Course",
          name: "Net Zero Leaders",
          description: "CPD-accredited training course covering carbon accounting, net zero strategy and regulatory compliance including PPN006, NHS Evergreen and SECR.",
          provider: { "@type": "Organization", name: "Net Zero International", url: SITE_URL },
          educationalCredentialAwarded: "CPD Certificate",
          courseMode: ["online", "onsite"],
        },
      }}
    >
      <PageHero
        eyebrow="CPD-accredited training"
        title="Net Zero Leaders"
        lead="A one-day course that gives business leaders, sustainability managers and procurement teams the knowledge and practical tools to build and deliver a credible net zero strategy."
        image="training-room.jpg"
        alt="A trainer presenting to a group seated round a table"
        crumbs={[{ label: "Training" }]}
      >
        <a href="#course-dates" className="btn btn-primary">See course dates</a>
        <ButtonLink href="/contact" variant="outline">Ask about a private course</ButtonLink>
      </PageHero>

      <section className="border-b border-line">
        <dl className="container grid grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-6 py-10">
          {details.map(d => (
            <div key={d.label}>
              <dt className="text-sm text-muted">{d.label}</dt>
              <dd className="font-semibold text-ink mt-0.5">{d.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Section eyebrow="Course content" title="What the day covers" lead="Six modules taught by practising consultants, with time to apply each one to your own organisation.">
        <NumberedList items={modules} />
      </Section>

      <Section>
        <Split image="seminar.jpg" alt="Course participants listening to a presentation" eyebrow="Outcomes" title="What you will leave able to do">
          <CheckList items={outcomes} />
        </Split>
      </Section>

      <Section id="course-dates" eyebrow="Upcoming dates" title="Book a place" lead="Online courses run by video conference. In-person courses include materials and lunch.">
        {isLoading && <p className="text-muted">Loading course dates…</p>}
        {isError && <p>We couldn't load the course dates just now. Please refresh the page, or <a href="/contact" className="text-link">contact us</a>.</p>}
        {sessions && sessions.length > 0 && (
          <ul className="border-t border-line">
            {sessions.map(s => <SessionRow key={s.id} session={s} onBook={setSelected} />)}
          </ul>
        )}
        {sessions && sessions.length === 0 && (
          <div className="border-l-2 border-leaf pl-6 max-w-2xl">
            <p className="h-sub">New public dates are being scheduled</p>
            <p className="mt-2">Tell us you're interested and we'll let you know as soon as they are confirmed. We can also run the course privately for your team on a date that suits you.</p>
            <div className="mt-5"><ButtonLink href="/contact" arrow>Register your interest</ButtonLink></div>
          </div>
        )}
        {sessions && sessions.length > 0 && (
          <p className="mt-8">None of these dates work? <a href="/contact" className="text-link">Ask about a private course</a> for your organisation.</p>
        )}
      </Section>

      <Section>
        <Split image="team-table.jpg" alt="A small team working together round a table" flip eyebrow="Who it's for" title="Built for the people who have to deliver it">
          <p>No prior knowledge of carbon accounting is needed. The course suits anyone responsible for setting, funding or reporting on net zero commitments.</p>
          <ul className="grid sm:grid-cols-2 gap-x-8 border-t border-line">
            {audiences.map(a => <li key={a} className="py-3 border-b border-line text-ink font-medium">{a}</li>)}
          </ul>
        </Split>
      </Section>

      <Section eyebrow="Questions" title="Frequently asked questions">
        <FAQ items={faqs} />
      </Section>

      <CTA title="Want the course for your whole team?" text="We run private courses with content adapted to your sector, supply chain and reporting requirements." image="turbines-sunset.jpg" primary={{ label: "Enquire about a private course", href: "/contact" }} />

      {selected && <BookingModal session={selected} onClose={() => setSelected(null)} />}
    </Page>
  );
}
