import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { CONTACT_EMAIL, Page, Photo, SITE_URL } from "@/components/site";

// "value" must be one of the service interests the server accepts; "note" is added to the message.
const ENQUIRY_TYPES = [
  { key: "general", label: "General enquiry", value: "general" },
  { key: "crp", label: "Carbon Reduction Plan", value: "carbon_reduction_plans" },
  { key: "lca", label: "Life Cycle Assessment (LCA)", value: "life_cycle_assessments" },
  { key: "scope3", label: "Scope 3 supply chain", value: "scope_3_supply_chain" },
  { key: "workshop", label: "Net zero strategy workshop", value: "net_zero_strategy" },
  { key: "training_public", label: "Training: public course", value: "training" },
  { key: "training_private", label: "Training: private course for our organisation", value: "training", note: "Private course enquiry" },
] as const;

const NEXT_STEPS = [
  "We reply within one working day.",
  "We arrange a short call to understand what you need, with no obligation.",
  "We send a proposal setting out scope, timescale and fee.",
];

export default function Contact() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", organisation: "", phone: "", type: "general", message: "", website: "", consent: false });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = trpc.contact.submitEnquiry.useMutation({
    onSuccess: () => { setSubmitted(true); window.scrollTo({ top: 0 }); },
    onError: () => setError(`Sorry, we couldn't send your enquiry. Please try again, or email ${CONTACT_EMAIL}.`),
  });

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.message.trim().length < 10) return setError("Please tell us a little more in your message (at least 10 characters).");
    if (!form.consent) return setError("Please tick the box to confirm we may contact you about your enquiry.");
    const type = ENQUIRY_TYPES.find(t => t.key === form.type) ?? ENQUIRY_TYPES[0];
    submit.mutate({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      organisation: form.organisation || undefined,
      phone: form.phone || undefined,
      serviceInterest: type.value,
      message: "note" in type ? `[${type.note}]\n\n${form.message}` : form.message,
      website: form.website || undefined,
    });
  };

  return (
    <Page
      seo={{
        title: "Contact Us",
        description: "Contact Net Zero International about carbon reduction plans, life cycle assessments, Scope 3 or CPD-accredited training. We reply within one working day.",
        canonical: "/contact",
        schema: { "@context": "https://schema.org", "@type": "ContactPage", name: "Contact Net Zero International", url: `${SITE_URL}/contact` },
      }}
    >
      <section className="container py-12 md:py-20 grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {submitted ? (
            <div role="status">
              <p className="eyebrow mb-4">Thank you</p>
              <h1 className="h-display">We've received your enquiry</h1>
              <p className="lead mt-6 max-w-xl">We'll reply to {form.email} within one working day.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/" className="btn btn-primary">Back to homepage</Link>
                <Link href="/blog" className="btn btn-outline">Read our insights</Link>
              </div>
            </div>
          ) : (
            <>
              <p className="eyebrow mb-4">Contact</p>
              <h1 className="h-display">Tell us what you need</h1>
              <p className="lead mt-6 max-w-xl">Whether you have a tender deadline, a reporting requirement or a general question, we reply within one working day.</p>

              <form onSubmit={onSubmit} className="mt-10 grid gap-5 sm:grid-cols-2" noValidate={false}>
                <div>
                  <label htmlFor="firstName" className="field-label">First name</label>
                  <input id="firstName" className="field" required autoComplete="given-name" maxLength={100} value={form.firstName} onChange={set("firstName")} />
                </div>
                <div>
                  <label htmlFor="lastName" className="field-label">Last name</label>
                  <input id="lastName" className="field" required autoComplete="family-name" maxLength={100} value={form.lastName} onChange={set("lastName")} />
                </div>
                <div>
                  <label htmlFor="email" className="field-label">Work email</label>
                  <input id="email" type="email" className="field" required autoComplete="email" maxLength={320} value={form.email} onChange={set("email")} />
                </div>
                <div>
                  <label htmlFor="phone" className="field-label">Phone <span className="font-normal text-muted">(optional)</span></label>
                  <input id="phone" type="tel" className="field" autoComplete="tel" maxLength={30} value={form.phone} onChange={set("phone")} />
                </div>
                <div>
                  <label htmlFor="organisation" className="field-label">Organisation <span className="font-normal text-muted">(optional)</span></label>
                  <input id="organisation" className="field" autoComplete="organization" maxLength={255} value={form.organisation} onChange={set("organisation")} />
                </div>
                <div>
                  <label htmlFor="type" className="field-label">What is it about?</label>
                  <select id="type" className="field" value={form.type} onChange={set("type")}>
                    {ENQUIRY_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="field-label">Message</label>
                  <textarea id="message" className="field" required rows={6} maxLength={5000} value={form.message} onChange={set("message")} placeholder="What you need to report, to whom, and by when." />
                </div>
                {/* Hidden from people; bots fill it in and are discarded. */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input id="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} />
                </div>
                <div className="sm:col-span-2 flex items-start gap-3">
                  <input id="consent" type="checkbox" className="mt-1 size-4 accent-[var(--color-brand)]" checked={form.consent} onChange={set("consent")} />
                  <label htmlFor="consent" className="text-sm">
                    I agree to Net Zero International contacting me about this enquiry. See our <Link href="/privacy" className="text-link">privacy notice</Link>.
                  </label>
                </div>
                {error && <p role="alert" className="sm:col-span-2 text-alert font-medium">{error}</p>}
                <div className="sm:col-span-2">
                  <button type="submit" className="btn btn-primary" disabled={submit.isPending}>
                    {submit.isPending ? "Sending…" : "Send enquiry"} <ArrowRight className="size-4" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <Photo src="discussion.jpg" alt="Two people talking through a document in a meeting" ratio="4/3" eager />
          <dl className="mt-8 border-t border-line">
            <div className="py-5 border-b border-line">
              <dt className="text-sm text-muted">Email</dt>
              <dd><a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-ink hover:text-brand">{CONTACT_EMAIL}</a></dd>
            </div>
            <div className="py-5 border-b border-line">
              <dt className="text-sm text-muted">LinkedIn</dt>
              <dd><a href="https://www.linkedin.com/company/76115279" target="_blank" rel="noopener noreferrer" className="font-semibold text-ink hover:text-brand">Net Zero International</a></dd>
            </div>
          </dl>
          <h2 className="h-sub mt-8 mb-4">What happens next</h2>
          <ol className="space-y-3">
            {NEXT_STEPS.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="font-display font-semibold text-brand tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-8 pt-6 border-t border-line">Booking a place on a course? <Link href="/training#course-dates" className="text-link">See training dates</Link>.</p>
        </aside>
      </section>
    </Page>
  );
}
