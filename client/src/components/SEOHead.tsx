import { useEffect } from "react";
import { headTag, isServer, ssrState } from "@/lib/ssr";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  schema?: object;
  noIndex?: boolean;
}

export const SITE_URL = "https://netzero.international";
const DEFAULT_TITLE = "Net Zero International — Carbon Accounting & Net Zero Consultants";
const DEFAULT_DESCRIPTION =
  "Net Zero International provides carbon reduction plans, life cycle assessments, CPD-accredited training and Scope 3 supply chain support. PPN006, NHS Evergreen, SECR and CSRD.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/turbines-hills.jpg`;

/** Who we are, in the form search engines and AI assistants read. Present on every page. */
export const ORGANISATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organisation`,
  name: "Net Zero International",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: DEFAULT_OG_IMAGE,
  email: "info@netzero.international",
  description: DEFAULT_DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    streetAddress: "167-169 Great Portland Street",
    addressLocality: "London",
    postalCode: "W1W 5PF",
    addressCountry: "GB",
  },
  identifier: { "@type": "PropertyValue", propertyID: "Companies House registration number", value: "13587676" },
  areaServed: ["United Kingdom", "Europe", "Middle East", "Africa", "Asia"],
  memberOf: { "@type": "Organization", name: "Carbon Accounting Alliance" },
  knowsAbout: [
    "Carbon Reduction Plans",
    "PPN006",
    "NHS Net Zero Supplier Roadmap",
    "NHS Evergreen",
    "Life Cycle Assessment",
    "ISO 14040",
    "ISO 14044",
    "ISO 14064",
    "GHG Protocol",
    "Scope 3 emissions",
    "SECR",
    "CSRD",
    "Science Based Targets initiative",
  ],
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Carbon Reduction Plans", url: `${SITE_URL}/services/carbon-reduction-plans` } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Life Cycle Assessments", url: `${SITE_URL}/services/life-cycle-assessments` } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Scope 3 supply chain emissions", url: `${SITE_URL}/services/scope-3-supply-chain` } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Net zero strategy workshops", url: `${SITE_URL}/services/net-zero-strategy-workshops` } },
    { "@type": "Offer", itemOffered: { "@type": "Course", name: "Net Zero Leaders (CPD-accredited)", url: `${SITE_URL}/training` } },
  ],
  sameAs: ["https://www.linkedin.com/company/76115279"],
};

export default function SEOHead({ title, description, canonical, ogImage, schema, noIndex = false }: SEOHeadProps) {
  const fullTitle = title ? `${title} | Net Zero International` : DEFAULT_TITLE;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical === "/" ? "" : canonical}` : undefined;
  const ogImageUrl = ogImage ? (ogImage.startsWith("/") ? `${SITE_URL}${ogImage}` : ogImage) : DEFAULT_OG_IMAGE;
  const robots = noIndex ? "noindex, nofollow" : "index, follow";

  // On the server: write the tags straight into the page's HTML.
  if (isServer) {
    const h = headTag;
    ssrState.head.push(
      h.title(fullTitle),
      h.meta("name", "description", metaDescription),
      h.meta("name", "robots", robots),
      ...(canonicalUrl ? [h.link("canonical", canonicalUrl), h.meta("property", "og:url", canonicalUrl)] : []),
      h.meta("property", "og:title", fullTitle),
      h.meta("property", "og:description", metaDescription),
      h.meta("property", "og:type", "website"),
      h.meta("property", "og:site_name", "Net Zero International"),
      h.meta("property", "og:locale", "en_GB"),
      h.meta("property", "og:image", ogImageUrl),
      h.meta("name", "twitter:card", "summary_large_image"),
      h.meta("name", "twitter:title", fullTitle),
      h.meta("name", "twitter:description", metaDescription),
      h.meta("name", "twitter:image", ogImageUrl),
      h.jsonLd("org-schema", ORGANISATION_SCHEMA),
      ...(schema ? [h.jsonLd("page-schema", schema)] : []),
    );
  }

  // In the browser: keep the tags in step as the visitor moves between pages.
  useEffect(() => {
    document.title = fullTitle;
    setMeta("name", "description", metaDescription);
    setMeta("name", "robots", robots);
    if (canonicalUrl) {
      setLink("canonical", canonicalUrl);
      setMeta("property", "og:url", canonicalUrl);
    }
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", metaDescription);
    setMeta("property", "og:image", ogImageUrl);
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", metaDescription);
    setMeta("name", "twitter:image", ogImageUrl);
    setJsonLd("org-schema", ORGANISATION_SCHEMA);
    if (schema) setJsonLd("page-schema", schema);
    else document.getElementById("page-schema")?.remove();
  }, [fullTitle, metaDescription, canonicalUrl, ogImageUrl, schema, robots]);

  return null;
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function setJsonLd(id: string, data: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}
