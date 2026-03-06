const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://ourwebsitecopy2026-02-21.vercel.app");

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "One and Only Furniture",
  url: SITE_URL,
  logo: `${SITE_URL.replace(/\/+$/, "")}/logo.png`,
  description: "Premium handcrafted furniture for modern living spaces.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "401, Jagat Trade Centre, Frazer Road",
    addressLocality: "Patna",
    postalCode: "800001",
    addressRegion: "Bihar & Jharkhand",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-90310-22875",
    contactType: "customer service",
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "One and Only Furniture",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL.replace(/\/+$/, "")}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
