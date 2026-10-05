import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../server/routers";
import SEOHead from "@/components/SEOHead";
import Logo from "@/components/Logo";

type Out = inferRouterOutputs<AppRouter>["admin"];
type Session = Out["listSessions"][number];
type Booking = Out["listBookings"][number];

const MODES = { online: "Online", in_person: "In person", hybrid: "Hybrid" } as const;
const SESSION_STATUS = { active: "Open for booking", full: "Full", cancelled: "Cancelled", completed: "Completed" } as const;
const INTERESTS: Record<string, string> = {
  general: "General", carbon_reduction_plans: "Carbon Reduction Plan", life_cycle_assessments: "Life Cycle Assessment",
  scope_3_supply_chain: "Scope 3", net_zero_strategy: "Strategy workshop", training: "Training",
};
const day = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
const stamp = (d: Date | string) => new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const today = () => new Date().toISOString().slice(0, 10);
const fail = (e: { message: string }) => toast.error(e.message);

const th = "text-left text-xs font-semibold uppercase tracking-wider text-muted py-3 pr-4 whitespace-nowrap";
const td = "py-4 pr-4 align-top";

function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const utils = trpc.useUtils();
  const login = trpc.admin.login.useMutation({
    onSuccess: () => utils.admin.me.invalidate(),
    onError: e => setError(e.data?.httpStatus === 429 ? "Too many attempts. Please wait ten minutes." : e.message),
  });
  return (
    <form className="max-w-sm mx-auto py-24 px-5" onSubmit={e => { e.preventDefault(); setError(null); login.mutate({ password }); }}>
      <Logo />
      <h1 className="h-section mt-10">Admin sign in</h1>
      <label htmlFor="pw" className="field-label mt-8">Password</label>
      <input id="pw" type="password" className="field" autoComplete="current-password" autoFocus required value={password} onChange={e => setPassword(e.target.value)} />
      {error && <p role="alert" className="text-alert font-medium mt-3">{error}</p>}
      <button type="submit" className="btn btn-primary w-full mt-6" disabled={login.isPending}>{login.isPending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}

const EMPTY = { title: "Net Zero Leaders", date: "", time: "09:00", durationHours: 6, deliveryMode: "online" as Session["deliveryMode"], location: "", capacity: 12, priceGbp: "" as number | "", status: "active" as Session["status"], description: "" };

function SessionForm({ initial, onDone }: { initial?: Session; onDone: () => void }) {
  const [f, setF] = useState(initial ? { ...EMPTY, ...initial, location: initial.location ?? "", description: initial.description ?? "", priceGbp: initial.priceGbp ?? ("" as const), durationHours: initial.durationHours ?? 6 } : EMPTY);
  const utils = trpc.useUtils();
  const done = () => { utils.admin.listSessions.invalidate(); utils.training.getSessions.invalidate(); toast.success(initial ? "Course date updated" : "Course date added"); onDone(); };
  const create = trpc.admin.createSession.useMutation({ onSuccess: done, onError: fail });
  const update = trpc.admin.updateSession.useMutation({ onSuccess: done, onError: fail });
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF(v => ({ ...v, [k]: e.target.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: f.title, date: f.date, time: f.time.slice(0, 5), durationHours: Number(f.durationHours), deliveryMode: f.deliveryMode,
      location: f.location || null, capacity: Number(f.capacity), priceGbp: f.priceGbp === "" ? null : Number(f.priceGbp), status: f.status, description: f.description || null,
    };
    if (initial) update.mutate({ id: initial.id, ...data }); else create.mutate(data);
  };
  return (
    <form onSubmit={submit} className="bg-tint rounded-[3px] p-5 md:p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <h3 className="h-sub sm:col-span-2 lg:col-span-4">{initial ? "Edit course date" : "Add a course date"}</h3>
      <div className="sm:col-span-2"><label className="field-label" htmlFor="s-title">Course name</label><input id="s-title" className="field" required maxLength={255} value={f.title} onChange={set("title")} /></div>
      <div><label className="field-label" htmlFor="s-date">Date</label><input id="s-date" type="date" className="field" required value={f.date} onChange={set("date")} /></div>
      <div><label className="field-label" htmlFor="s-time">Start time (UK)</label><input id="s-time" type="time" className="field" required value={f.time} onChange={set("time")} /></div>
      <div><label className="field-label" htmlFor="s-mode">Format</label><select id="s-mode" className="field" value={f.deliveryMode} onChange={set("deliveryMode")}>{Object.entries(MODES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
      <div><label className="field-label" htmlFor="s-loc">Location <span className="font-normal text-muted">(in person)</span></label><input id="s-loc" className="field" maxLength={255} placeholder="e.g. London" value={f.location} onChange={set("location")} /></div>
      <div><label className="field-label" htmlFor="s-dur">Length (hours)</label><input id="s-dur" type="number" min={1} max={24} className="field" required value={f.durationHours} onChange={set("durationHours")} /></div>
      <div><label className="field-label" htmlFor="s-cap">Places</label><input id="s-cap" type="number" min={1} max={500} className="field" required value={f.capacity} onChange={set("capacity")} /></div>
      <div><label className="field-label" htmlFor="s-price">Price per person, £ ex VAT</label><input id="s-price" type="number" min={0} className="field" placeholder="Leave blank to hide" value={f.priceGbp} onChange={set("priceGbp")} /></div>
      <div><label className="field-label" htmlFor="s-status">Status</label><select id="s-status" className="field" value={f.status} onChange={set("status")}>{Object.entries(SESSION_STATUS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
      <div className="sm:col-span-2 lg:col-span-4 flex gap-3 pt-1">
        <button type="submit" className="btn btn-primary btn-sm" disabled={create.isPending || update.isPending}>{initial ? "Save changes" : "Add date"}</button>
        <button type="button" className="btn btn-outline btn-sm" onClick={onDone}>Cancel</button>
      </div>
    </form>
  );
}

function Sessions() {
  const { data, isLoading } = trpc.admin.listSessions.useQuery();
  const [editing, setEditing] = useState<Session | "new" | null>(null);
  const utils = trpc.useUtils();
  const del = trpc.admin.deleteSession.useMutation({ onSuccess: () => { utils.admin.listSessions.invalidate(); toast.success("Course date deleted"); }, onError: fail });
  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <p className="text-muted">Dates marked “Open for booking” and in the future appear on the Training page.</p>
        {!editing && <button type="button" className="btn btn-primary btn-sm shrink-0" onClick={() => setEditing("new")}>Add a date</button>}
      </div>
      {editing && <SessionForm key={editing === "new" ? "new" : editing.id} initial={editing === "new" ? undefined : editing} onDone={() => setEditing(null)} />}
      {isLoading ? <p className="text-muted">Loading…</p> : !data?.length ? <p>No course dates yet. Add the first one above.</p> : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-[0.9375rem]">
            <thead><tr className="border-b border-line"><th className={th}>Date</th><th className={th}>Course</th><th className={th}>Format</th><th className={th}>Booked</th><th className={th}>Price</th><th className={th}>Status</th><th className={th} /></tr></thead>
            <tbody>
              {data.map(s => {
                const past = s.date <= today();
                return (
                  <tr key={s.id} className={`border-b border-line ${past || s.status !== "active" ? "text-muted" : ""}`}>
                    <td className={`${td} whitespace-nowrap font-semibold text-ink`}>{day(s.date)}<span className="block font-normal text-muted text-sm">{s.time}, {s.durationHours}h</span></td>
                    <td className={td}>{s.title}</td>
                    <td className={td}>{MODES[s.deliveryMode]}{s.location ? `, ${s.location}` : ""}</td>
                    <td className={`${td} tabular-nums`}>{s.bookedCount} / {s.capacity}</td>
                    <td className={`${td} tabular-nums`}>{s.priceGbp != null ? `£${s.priceGbp}` : "—"}</td>
                    <td className={td}>{past && s.status === "active" ? "Past" : SESSION_STATUS[s.status]}</td>
                    <td className={`${td} whitespace-nowrap text-right pr-0`}>
                      <button type="button" className="text-link mr-4" onClick={() => { setEditing(s); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit</button>
                      {s.bookedCount === 0 && <button type="button" className="text-alert underline underline-offset-4" onClick={() => { if (window.confirm(`Delete ${day(s.date)}?`)) del.mutate({ id: s.id }); }}>Delete</button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Bookings() {
  const { data, isLoading } = trpc.admin.listBookings.useQuery();
  const utils = trpc.useUtils();
  const setStatus = trpc.admin.setBookingStatus.useMutation({
    onSuccess: () => { utils.admin.listBookings.invalidate(); utils.admin.listSessions.invalidate(); utils.training.getSessions.invalidate(); toast.success("Booking updated"); },
    onError: e => { fail(e); utils.admin.listBookings.invalidate(); },
  });
  if (isLoading) return <p className="text-muted">Loading…</p>;
  if (!data?.length) return <p>No bookings yet. They appear here as soon as someone books a place on the Training page.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-[0.9375rem]">
        <thead><tr className="border-b border-line"><th className={th}>Received</th><th className={th}>Course date</th><th className={th}>Booked by</th><th className={th}>Places</th><th className={th}>Requirements</th><th className={th}>Status</th></tr></thead>
        <tbody>
          {data.map((b: Booking) => (
            <tr key={b.id} className={`border-b border-line ${b.status === "cancelled" ? "text-muted" : ""}`}>
              <td className={`${td} whitespace-nowrap text-sm text-muted`}>{stamp(b.createdAt)}</td>
              <td className={`${td} whitespace-nowrap`}>{b.sessionDate ? day(b.sessionDate) : "Deleted date"}<span className="block text-sm text-muted">{b.sessionMode ? MODES[b.sessionMode] : ""}{b.sessionLocation ? `, ${b.sessionLocation}` : ""}</span></td>
              <td className={td}>
                <span className="font-semibold text-ink">{b.firstName} {b.lastName}</span>{b.jobTitle ? `, ${b.jobTitle}` : ""}
                <span className="block">{b.organisation}</span>
                <a href={`mailto:${b.email}`} className="text-link">{b.email}</a>{b.phone ? <span className="text-muted"> · {b.phone}</span> : null}
              </td>
              <td className={`${td} tabular-nums`}>{b.participants}</td>
              <td className={`${td} max-w-[16rem] text-sm`}>{b.specialRequirements || "—"}</td>
              <td className={td}>
                <select aria-label="Booking status" className="field h-10 w-36 text-sm" value={b.status} disabled={setStatus.isPending} onChange={e => setStatus.mutate({ id: b.id, status: e.target.value as Booking["status"] })}>
                  <option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm text-muted mt-4">Cancelling a booking releases its places back to the course; reinstating it takes them again.</p>
    </div>
  );
}

function Enquiries() {
  const { data, isLoading } = trpc.admin.listEnquiries.useQuery();
  const [show, setShow] = useState<"open" | "all">("open");
  const utils = trpc.useUtils();
  const setHandled = trpc.admin.setEnquiryHandled.useMutation({ onSuccess: () => utils.admin.listEnquiries.invalidate(), onError: fail });
  if (isLoading) return <p className="text-muted">Loading…</p>;
  const rows = (data ?? []).filter(e => show === "all" || !e.handled);
  return (
    <div>
      <div className="flex gap-6 mb-6">
        {(["open", "all"] as const).map(v => (
          <button key={v} type="button" aria-pressed={show === v} onClick={() => setShow(v)} className={`font-medium pb-0.5 border-b-2 ${show === v ? "text-ink border-accent" : "text-muted border-transparent"}`}>
            {v === "open" ? `To deal with (${(data ?? []).filter(e => !e.handled).length})` : `All (${data?.length ?? 0})`}
          </button>
        ))}
      </div>
      {!rows.length ? <p>{show === "open" ? "Nothing waiting. Every enquiry has been dealt with." : "No enquiries yet."}</p> : (
        <ul className="border-t border-line">
          {rows.map(e => (
            <li key={e.id} className={`py-6 border-b border-line grid gap-3 md:grid-cols-12 md:gap-8 ${e.handled ? "text-muted" : ""}`}>
              <div className="md:col-span-4">
                <p className="font-semibold text-ink">{e.firstName} {e.lastName}</p>
                {e.organisation && <p>{e.organisation}</p>}
                <p><a href={`mailto:${e.email}`} className="text-link break-all">{e.email}</a></p>
                {e.phone && <p>{e.phone}</p>}
                <p className="text-sm text-muted mt-2">{INTERESTS[e.serviceInterest] ?? e.serviceInterest} · {stamp(e.createdAt)}</p>
              </div>
              <p className="md:col-span-6 whitespace-pre-wrap">{e.message}</p>
              <div className="md:col-span-2 md:text-right">
                <button type="button" className="btn btn-outline btn-sm" disabled={setHandled.isPending} onClick={() => setHandled.mutate({ id: e.id, handled: !e.handled })}>{e.handled ? "Reopen" : "Mark as done"}</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const TABS = [["dates", "Course dates"], ["bookings", "Bookings"], ["enquiries", "Enquiries"]] as const;

export default function Admin() {
  const me = trpc.admin.me.useQuery(undefined, { staleTime: 0 });
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("dates");
  const utils = trpc.useUtils();
  const logout = trpc.admin.logout.useMutation({ onSuccess: () => utils.invalidate() });

  let body;
  if (me.isLoading) body = <p className="container py-24 text-muted">Loading…</p>;
  else if (!me.data?.enabled) body = (
    <div className="container-narrow py-24">
      <h1 className="h-section">The admin area isn't switched on yet</h1>
      <p className="mt-4">Set an <code>ADMIN_PASSWORD</code> environment variable (at least 10 characters) on the hosting service, then reload this page.</p>
    </div>
  );
  else if (!me.data.signedIn) body = <Login />;
  else body = (
    <>
      <header className="border-b border-line">
        <div className="container flex items-center justify-between h-20">
          <a href="/" aria-label="View website"><Logo /></a>
          <div className="flex items-center gap-6 text-[0.9375rem]">
            <a href="/" className="text-link hidden sm:inline">View website</a>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => logout.mutate()}>Sign out</button>
          </div>
        </div>
      </header>
      <main className="container py-10 md:py-14">
        <h1 className="h-section">Training and enquiries</h1>
        <div className="flex gap-8 border-b border-line mt-8 mb-8" role="tablist">
          {TABS.map(([key, label]) => (
            <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)} className={`pb-3 -mb-px font-display font-semibold border-b-2 ${tab === key ? "text-ink border-accent" : "text-muted border-transparent hover:text-ink"}`}>{label}</button>
          ))}
        </div>
        {tab === "dates" && <Sessions />}
        {tab === "bookings" && <Bookings />}
        {tab === "enquiries" && <Enquiries />}
      </main>
    </>
  );

  return (
    <>
      <SEOHead title="Admin" canonical="/admin" noIndex />
      {body}
    </>
  );
}
