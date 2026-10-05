import { Link } from "wouter";
import Logo from "./Logo";
import { REGIONS, SERVICES } from "./Navbar";
import { CONTACT_EMAIL } from "./site";

const linkClass = "text-[0.9375rem] text-white/70 hover:text-white transition-colors";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white border-t-4 border-leaf">
      <div className="container py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link href="/" aria-label="Net Zero International — home" className="inline-block bg-white rounded-[3px] px-4 py-3"><Logo /></Link>
          <p className="text-white/70 mt-6 max-w-xs text-[0.9375rem]">
            Carbon accounting, life cycle assessment and net zero training for organisations that want numbers they can stand behind.
          </p>
          <ul className="mt-6 space-y-1 text-sm text-white/70">
            <li>CPD-accredited training provider</li>
            <li>Founding member, Carbon Accounting Alliance</li>
          </ul>
        </div>

        <nav aria-label="Services" className="lg:col-span-3">
          <h2 className="font-sans text-sm font-semibold text-white uppercase tracking-[0.12em] mb-4">Services</h2>
          <ul className="space-y-2.5">
            {SERVICES.map(s => <li key={s.href}><Link href={s.href} className={linkClass}>{s.title}</Link></li>)}
            <li><Link href="/training" className={linkClass}>Net Zero Leaders Training</Link></li>
          </ul>
        </nav>

        <nav aria-label="International" className="lg:col-span-2">
          <h2 className="font-sans text-sm font-semibold text-white uppercase tracking-[0.12em] mb-4">International</h2>
          <ul className="space-y-2.5">
            {REGIONS.map(r => <li key={r.href}><Link href={r.href} className={linkClass}>{r.title}</Link></li>)}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="font-sans text-sm font-semibold text-white uppercase tracking-[0.12em] mb-4">Contact</h2>
          <ul className="space-y-2.5">
            <li><a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>{CONTACT_EMAIL}</a></li>
            <li><a href="https://www.linkedin.com/company/76115279" target="_blank" rel="noopener noreferrer" className={linkClass}>LinkedIn</a></li>
            <li><Link href="/about" className={linkClass}>About us</Link></li>
            <li><Link href="/blog" className={linkClass}>Insights</Link></li>
          </ul>
          <Link href="/contact" className="btn btn-light btn-sm mt-6">Get in touch</Link>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container py-6 flex flex-col sm:flex-row gap-3 sm:items-end sm:justify-between text-sm text-white/55">
          <p>
            © {new Date().getFullYear()} Net Zero International. Registered in England and Wales, company number 13587676.
            <span className="block">Registered office: 167-169 Great Portland Street, London W1W 5PF.</span>
          </p>
          <p className="flex gap-6">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <a href="/sitemap.xml" className="hover:text-white">Sitemap</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
