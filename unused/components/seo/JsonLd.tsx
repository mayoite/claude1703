import { SITE_BRAND } from "@/data/site/brand";
import { SITE_CONTACT } from "@/data/site/contact";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://ourwebsitecopy2026-02-21.vercel.app");

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_BRAND.companyName,
  url: SITE_URL,
  logo: `${SITE_URL.replace(/\/+$/, "")}/logo.png`,
  description: SITE_BRAND.organizationDescription,
  address: {
    "@type": "PostalAddress",
    ...SITE_CONTACT.address,
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: SITE_CONTACT.supportPhone,
    contactType: "customer service",
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_BRAND.siteName,
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
