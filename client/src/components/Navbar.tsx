import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, Menu, X } from "lucide-react";
import Logo from "./Logo";

export const SERVICES = [
  { title: "Life Cycle Assessments", text: "ISO 14040/14044 studies for products and projects", href: "/services/life-cycle-assessments" },
  { title: "Carbon Reduction Plans", text: "PPN006, NHS Evergreen, SECR and CSRD", href: "/services/carbon-reduction-plans" },
  { title: "Scope 3 Supply Chain", text: "Measure and reduce value-chain emissions", href: "/services/scope-3-supply-chain" },
  { title: "Net Zero Strategy Workshops", text: "Facilitated sessions to build your roadmap", href: "/services/net-zero-strategy-workshops" },
];

export const REGIONS = [
  { title: "United Kingdom", href: "/international/uk" },
  { title: "Europe", href: "/international/europe" },
  { title: "G20 Countries", href: "/international/g20" },
  { title: "Africa", href: "/international/africa" },
  { title: "Middle East", href: "/international/middle-east" },
  { title: "Asia", href: "/international/asia" },
];

function Dropdown({ label, base, items, active }: { label: string; base: string; items: { title: string; text?: string; href: string }[]; active: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [location] = useLocation();
  useEffect(() => setOpen(false), [location]);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", close); };
  }, [open]);
  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" aria-expanded={open} onClick={() => setOpen(o => !o)} className={`nav-link flex items-center gap-1 ${active ? "text-brand" : ""}`}>
        {label}
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <div className="absolute left-0 top-full pt-2 z-50">
          <div className={`bg-white border border-line shadow-[0_12px_32px_-12px_rgba(19,33,27,0.25)] rounded-[3px] py-2 ${items[0]?.text ? "w-[22rem]" : "w-56"}`}>
            {items.map(item => (
              <Link key={item.href} href={item.href} className="block px-5 py-2.5 hover:bg-tint">
                <span className="block text-[0.9375rem] font-semibold text-ink">{item.title}</span>
                {item.text && <span className="block text-sm text-muted">{item.text}</span>}
              </Link>
            ))}
            <Link href={base} className="block px-5 py-2.5 mt-1 border-t border-line text-sm font-semibold text-brand hover:bg-tint">View all</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  useEffect(() => { setMenuOpen(false); window.scrollTo(0, 0); }, [location]);
  const isActive = (path: string) => location === path || location.startsWith(path + "/");
  const link = (path: string) => `nav-link ${isActive(path) ? "text-brand" : ""}`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-line">
      <style>{`.nav-link{font-size:.9375rem;font-weight:500;color:var(--color-ink);padding:.5rem .25rem;transition:color .15s}.nav-link:hover{color:var(--color-brand)}`}</style>
      <div className="container flex items-center justify-between h-[72px]">
        <Link href="/" aria-label="Net Zero International — home"><Logo /></Link>

        <nav aria-label="Main" className="hidden lg:flex items-center gap-7">
          <Dropdown label="Services" base="/services" items={SERVICES} active={isActive("/services")} />
          <Link href="/training" className={link("/training")}>Training</Link>
          <Dropdown label="International" base="/international" items={REGIONS} active={isActive("/international")} />
          <Link href="/blog" className={link("/blog")}>Insights</Link>
          <Link href="/about" className={link("/about")}>About</Link>
        </nav>

        <div className="hidden lg:block">
          <Link href="/contact" className="btn btn-primary btn-sm">Get in touch</Link>
        </div>

        <button type="button" className="lg:hidden -mr-2 p-2 text-ink" onClick={() => setMenuOpen(o => !o)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-line bg-white max-h-[calc(100dvh-72px)] overflow-y-auto">
          <nav aria-label="Mobile" className="container py-4">
            <p className="eyebrow pt-2 pb-1">Services</p>
            {SERVICES.map(s => <Link key={s.href} href={s.href} className="block py-2.5 font-medium text-ink">{s.title}</Link>)}
            <div className="border-t border-line my-3" />
            <Link href="/training" className="block py-2.5 font-medium text-ink">Training</Link>
            <Link href="/blog" className="block py-2.5 font-medium text-ink">Insights</Link>
            <Link href="/about" className="block py-2.5 font-medium text-ink">About</Link>
            <div className="border-t border-line my-3" />
            <p className="eyebrow pt-2 pb-1">International</p>
            <div className="grid grid-cols-2">
              {REGIONS.map(r => <Link key={r.href} href={r.href} className="block py-2.5 font-medium text-ink">{r.title}</Link>)}
            </div>
            <Link href="/contact" className="btn btn-primary w-full mt-5 mb-2">Get in touch</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
