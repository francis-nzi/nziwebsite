import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { CONTACT_EMAIL } from "./site";

export interface TrainingSession {
  id: number;
  title: string;
  date: string;
  time: string;
  durationHours: number | null;
  deliveryMode: "online" | "in_person" | "hybrid";
  location: string | null;
  capacity: number;
  bookedCount: number;
  priceGbp: number | null;
  status: string;
}

export const sessionDate = (s: { date: string }) =>
  new Date(s.date + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export const MODE_LABEL = { online: "Online", in_person: "In person", hybrid: "Hybrid" } as const;

export default function BookingModal({ session, onClose }: { session: TrainingSession; onClose: () => void }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", organisation: "", phone: "", jobTitle: "", participants: 1, specialRequirements: "", website: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const utils = trpc.useUtils();

  const book = trpc.training.createBooking.useMutation({
    onSuccess: () => { setSubmitted(true); utils.training.getSessions.invalidate(); },
    // The server sends a readable reason when places have run out; anything else gets a generic message.
    onError: err => setError(err.data?.code === "BAD_REQUEST" && !err.message.startsWith("[") ? err.message : `Sorry, we couldn't complete your booking. Please try again, or email ${CONTACT_EMAIL}.`),
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  const available = Math.max(0, session.capacity - session.bookedCount);
  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: field === "participants" ? Number(e.target.value) : e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    book.mutate({
      sessionId: session.id,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      organisation: form.organisation,
      participants: form.participants,
      phone: form.phone || undefined,
      jobTitle: form.jobTitle || undefined,
      specialRequirements: form.specialRequirements || undefined,
      website: form.website || undefined,
    });
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={e => { if (e.target === dialogRef.current) onClose(); }}
      aria-labelledby="booking-title"
      className="m-auto w-[calc(100%-2rem)] max-w-xl max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-[3px] bg-white p-0 backdrop:bg-ink/60"
    >
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="eyebrow mb-2">{submitted ? "Booking request received" : "Book your place"}</p>
            <h2 id="booking-title" className="h-sub text-2xl">{session.title}</h2>
            <p className="text-sm text-muted mt-2">
              {sessionDate(session)} · {session.time} · {MODE_LABEL[session.deliveryMode]}{session.location ? `, ${session.location}` : ""}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="-mr-2 -mt-2 p-2 text-muted hover:text-ink"><X className="size-5" /></button>
        </div>

        {submitted ? (
          <div className="mt-8" role="status">
            <p>Thank you, {form.firstName}. We've reserved {form.participants} {form.participants === 1 ? "place" : "places"} and will email {form.email} within one working day with confirmation, joining details and an invoice.</p>
            <button type="button" className="btn btn-primary mt-8" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="b-firstName" className="field-label">First name</label>
              <input id="b-firstName" className="field" required autoComplete="given-name" maxLength={100} value={form.firstName} onChange={set("firstName")} />
            </div>
            <div>
              <label htmlFor="b-lastName" className="field-label">Last name</label>
              <input id="b-lastName" className="field" required autoComplete="family-name" maxLength={100} value={form.lastName} onChange={set("lastName")} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="b-email" className="field-label">Work email</label>
              <input id="b-email" type="email" className="field" required autoComplete="email" maxLength={320} value={form.email} onChange={set("email")} />
            </div>
            <div>
              <label htmlFor="b-organisation" className="field-label">Organisation</label>
              <input id="b-organisation" className="field" required autoComplete="organization" maxLength={255} value={form.organisation} onChange={set("organisation")} />
            </div>
            <div>
              <label htmlFor="b-jobTitle" className="field-label">Job title <span className="font-normal text-muted">(optional)</span></label>
              <input id="b-jobTitle" className="field" autoComplete="organization-title" maxLength={150} value={form.jobTitle} onChange={set("jobTitle")} />
            </div>
            <div>
              <label htmlFor="b-phone" className="field-label">Phone <span className="font-normal text-muted">(optional)</span></label>
              <input id="b-phone" type="tel" className="field" autoComplete="tel" maxLength={30} value={form.phone} onChange={set("phone")} />
            </div>
            <div>
              <label htmlFor="b-participants" className="field-label">Number of places</label>
              <select id="b-participants" className="field" value={form.participants} onChange={set("participants")}>
                {Array.from({ length: Math.min(12, available) }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="b-req" className="field-label">Access or dietary requirements <span className="font-normal text-muted">(optional)</span></label>
              <textarea id="b-req" className="field" rows={3} maxLength={2000} value={form.specialRequirements} onChange={set("specialRequirements")} />
            </div>
            <div className="hidden" aria-hidden="true">
              <label htmlFor="b-website">Website</label>
              <input id="b-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} />
            </div>
            {session.priceGbp != null && (
              <p className="sm:col-span-2 border-t border-line pt-5 flex items-baseline justify-between">
                <span>Total</span>
                <span className="font-display font-bold text-ink text-xl">£{(session.priceGbp * form.participants).toLocaleString("en-GB")} <span className="text-sm font-normal text-muted">+ VAT</span></span>
              </p>
            )}
            {error && <p role="alert" className="sm:col-span-2 text-alert font-medium">{error}</p>}
            <div className="sm:col-span-2">
              <button type="submit" className="btn btn-primary w-full" disabled={book.isPending}>{book.isPending ? "Sending…" : "Request booking"}</button>
              <p className="text-sm text-muted mt-3">No payment is taken now. We'll send an invoice with your confirmation. See our <Link href="/privacy" className="text-link">privacy notice</Link>.</p>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}
