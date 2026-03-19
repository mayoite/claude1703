import type { Metadata } from "next";
import { HomeFAQ } from "@/components/home/HomeFAQ";
import { buildPageMetadata } from "@/data/site/seo";
import { SITE_URL } from "@/lib/siteUrl";

export const metadata: Metadata = buildPageMetadata(SITE_URL, {
  title: "FAQ | One&Only",
  description: "Common questions about our office furniture, delivery, installation, and warranty.",
  path: "/faq",
});

export default function FAQPage() {
  return (
    <main id="main-content" className="pt-24 pb-16">
      <HomeFAQ />
    </main>
  );
}
