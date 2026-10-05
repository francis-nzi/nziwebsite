import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  schema?: object;
  noIndex?: boolean;
}

const DEFAULT_TITLE = "Net Zero International — Carbon Accounting & Net Zero Consultants";
const DEFAULT_DESCRIPTION =
  "Net Zero International provides expert carbon reduction plans, life cycle assessments, CPD-accredited training, and Scope 3 supply chain solutions. PPN006, NHS Evergreen, SECR and CSRD compliant.";
const SITE_URL = "https://netzero.international";
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/turbines-hills.jpg`;

export default function SEOHead({
  title,
  description,
  canonical,
  ogImage,
  schema,
  noIndex = false,
}: SEOHeadProps) {
  const fullTitle = title
    ? `${title} | Net Zero International`
    : DEFAULT_TITLE;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : undefined;
  const ogImageUrl = ogImage ? (ogImage.startsWith("/") ? `${SITE_URL}${ogImage}` : ogImage) : DEFAULT_OG_IMAGE;

  useEffect(() => {
    // Title
    document.title = fullTitle;

    // Meta description
    setMeta("description", metaDescription);

    // Robots
    setMeta("robots", noIndex ? "noindex, nofollow" : "index, follow");

    // Canonical
    if (canonicalUrl) {
      setLink("canonical", canonicalUrl);
    }

    // Open Graph
    setMetaProperty("og:title", fullTitle);
    setMetaProperty("og:description", metaDescription);
    setMetaProperty("og:type", "website");
    setMetaProperty("og:site_name", "Net Zero International");
    setMetaProperty("og:image", ogImageUrl);
    if (canonicalUrl) setMetaProperty("og:url", canonicalUrl);

    // Twitter Card
    setMetaName("twitter:card", "summary_large_image");
    setMetaName("twitter:title", fullTitle);
    setMetaName("twitter:description", metaDescription);
    setMetaName("twitter:image", ogImageUrl);

    // JSON-LD Schema
    if (schema) {
      let scriptEl = document.getElementById("page-schema") as HTMLScriptElement | null;
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.id = "page-schema";
        scriptEl.type = "application/ld+json";
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(schema);
    }

    // Organisation schema always present
    let orgScript = document.getElementById("org-schema") as HTMLScriptElement | null;
    if (!orgScript) {
      orgScript = document.createElement("script");
      orgScript.id = "org-schema";
      orgScript.type = "application/ld+json";
      document.head.appendChild(orgScript);
    }
    orgScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "Net Zero International",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      description: DEFAULT_DESCRIPTION,
      areaServed: ["GB", "EU", "Worldwide"],
      serviceType: [
        "Carbon Reduction Plans",
        "Life Cycle Assessments",
        "Net Zero Training",
        "Scope 3 Supply Chain Solutions",
      ],
      knowsAbout: [
        "GHG Protocol",
        "ISO 14040",
        "ISO 14044",
        "PPN006",
        "NHS Evergreen",
        "SECR",
        "CSRD",
        "Science-Based Targets",
        "Carbon Accounting",
      ],
      sameAs: ["https://www.linkedin.com/company/76115279"],
    });

    return () => {
      // Cleanup schema on unmount
      const el = document.getElementById("page-schema");
      if (el) el.remove();
    };
  }, [fullTitle, metaDescription, canonicalUrl, ogImageUrl, schema, noIndex]);

  return null;
}

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

function setMetaProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setMetaName(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}
