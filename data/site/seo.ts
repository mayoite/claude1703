import type { Metadata } from "next";
import { SITE_BRAND } from "@/data/site/brand";
import { SITE_CONTACT } from "@/data/site/contact";

export function buildSiteMetadata(siteUrl: string): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: SITE_BRAND.defaultTitle,
      template: `%s | ${SITE_BRAND.titleSuffix}`,
    },
    description: SITE_BRAND.description,
    keywords: [
      "office furniture Patna",
      "premium office furniture Bihar",
      "ergonomic chairs India",
      "modular workstations Patna",
      "office furniture Bihar",
      "One and Only Furniture",
      "oando furniture",
      "office chairs Patna",
      "meeting tables Bihar",
      "office furniture Jharkhand",
      "storage solutions India",
    ],
    authors: [{ name: SITE_BRAND.companyName, url: siteUrl }],
    creator: SITE_BRAND.companyName,
    publisher: SITE_BRAND.companyName,
    robots: { index: true, follow: true },
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: siteUrl,
      siteName: SITE_BRAND.siteName,
      title: SITE_BRAND.defaultTitle,
      description: SITE_BRAND.description,
      images: [
        {
          url: SITE_BRAND.ogImage,
          width: 1200,
          height: 630,
          alt: SITE_BRAND.defaultTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_BRAND.defaultTitle,
      description: SITE_BRAND.description,
      images: [SITE_BRAND.ogImage],
    },
  };
}

export function buildLocalBusinessJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: SITE_BRAND.companyName,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description:
      "Premium ergonomic office furniture in Patna, Bihar and Jharkhand, India. Authorized dealer for leading office furniture brands.",
    address: {
      "@type": "PostalAddress",
      ...SITE_CONTACT.address,
    },
    geo: { "@type": "GeoCoordinates", ...SITE_CONTACT.geo },
    telephone: SITE_CONTACT.salesPhone,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SITE_CONTACT.salesPhone,
        contactType: "sales",
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
      {
        "@type": "ContactPoint",
        telephone: SITE_CONTACT.supportPhone,
        contactType: "customer support",
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
    ],
    openingHours: SITE_CONTACT.openingHours,
    priceRange: SITE_CONTACT.priceRange,
    areaServed: SITE_CONTACT.areaServed,
    sameAs: [siteUrl, ...SITE_CONTACT.socialLinks.map((link) => link.href)],
  };
}
