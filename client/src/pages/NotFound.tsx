import { ButtonLink, Page } from "@/components/site";

export default function NotFound() {
  return (
    <Page seo={{ title: "Page not found", canonical: "/404", noIndex: true }}>
      <section className="container py-24 md:py-36">
        <p className="eyebrow mb-4">404</p>
        <h1 className="h-display">We can't find that page</h1>
        <p className="lead mt-6 max-w-xl">The link may be out of date. Try the homepage, or tell us what you were looking for.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/">Back to homepage</ButtonLink>
          <ButtonLink href="/contact" variant="outline">Contact us</ButtonLink>
        </div>
      </section>
    </Page>
  );
}
