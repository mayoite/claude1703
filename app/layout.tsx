import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site/Header";
import { SiteFooter } from "@/components/site/Footer";
import { CookieConsentBar } from "@/components/site/CookieConsentBar";
import dynamic from "next/dynamic";
import QueryProvider from "@/app/providers/QueryProvider";
import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";
import { ciscoSans } from "@/lib/fonts";
import { SITE_URL } from "@/lib/siteUrl";

const DynamicBotWrapper = dynamic(() => import("@/components/bot/DynamicBotWrapper"));

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "One and Only Furniture | Premium Office Solutions",
    template: "%s | One and Only Furniture",
  },
  description:
    "One and Only Furniture - premium ergonomic office furniture in Patna, Bihar & Jharkhand, India. Workstations, seating, storage, tables and soft seating.",
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
  authors: [{ name: "One and Only Furniture", url: SITE_URL }],
  creator: "One and Only Furniture",
  publisher: "One and Only Furniture",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "One and Only Furniture",
    title: "One and Only Furniture | Premium Office Solutions",
    description:
      "Premium ergonomic office furniture in Patna, Bihar & Jharkhand. Workstations, seating, storage and more.",
    images: [
      {
        url: "/images/products/imported/fluid/image-1.webp",
        width: 1200,
        height: 630,
        alt: "One and Only Furniture - Premium Office Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "One and Only Furniture | Premium Office Solutions",
    description:
      "Premium ergonomic office furniture in Patna, Bihar & Jharkhand. Workstations, seating, storage and more.",
    images: ["/images/products/imported/fluid/image-1.webp"],
  },
};

const LOCAL_BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  name: "One and Only Furniture",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "Premium ergonomic office furniture in Patna, Bihar & Jharkhand, India. Authorized dealer for leading office furniture brands.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "401, Jagat Trade Centre, Frazer Road",
    addressLocality: "Patna",
    postalCode: "800001",
    addressRegion: "Bihar",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: 25.6127, longitude: 85.1376 },
  telephone: "+91-90310-22875",
  openingHours: "Mo-Sa 09:00-18:00",
  priceRange: "INR",
  areaServed: ["Bihar", "Jharkhand", "India"],
  sameAs: [
    "https://oando.co.in",
    "https://www.facebook.com/oandofurniture",
    "https://www.youtube.com/channel/UCehXuPNAXkyfODPCwyAU1gQ",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={`${ciscoSans.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(LOCAL_BUSINESS_JSON_LD),
          }}
        />
      </head>
      <body className="antialiased bg-white selection:bg-primary selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-9999 focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Skip to main content
        </a>
        <QueryProvider>
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
          <CookieConsentBar />
          <DynamicBotWrapper />
          <WhatsAppCTA />
        </QueryProvider>
      </body>
    </html>
  );
}
