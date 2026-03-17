import type { Metadata } from "next";
import { HomepageHero } from "@/components/home/HomepageHero";
import { PartnershipBanner } from "@/components/home/PartnershipBanner";
import { TrustStrip } from "@/components/home/TrustStrip";
import { ProcessSection } from "@/components/home/ProcessSection";
import { Collections } from "@/components/home/Collections";
import { Projects } from "@/components/home/Projects";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { SITE_BRAND } from "@/data/site/brand";
import { buildPageJsonLd, buildPageMetadata } from "@/data/site/seo";
import { getBusinessStats } from "@/lib/businessStats";
import { SITE_URL } from "@/lib/siteUrl";

export const metadata: Metadata = buildPageMetadata(SITE_URL, {
  title: SITE_BRAND.defaultTitle,
  description: SITE_BRAND.description,
  path: "/",
});

export default async function Home() {
  const { stats } = await getBusinessStats();
  const homeJsonLd = buildPageJsonLd(SITE_URL, {
    path: "/",
    title: SITE_BRAND.defaultTitle,
    description: SITE_BRAND.description,
    pageType: "WebPage",
  });

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <HomepageHero />
      <SectionReveal>
        <PartnershipBanner />
      </SectionReveal>

      <SectionReveal>
        <Collections />
      </SectionReveal>

      <SectionReveal>
        <Projects />
      </SectionReveal>

      <SectionReveal>
        <section className="home-section home-section--sand py-10 md:py-12">
          <div className="home-shell">
            <div className="home-frame home-frame--standard">
              <ProcessSection embedded />
              <div className="mt-8 md:mt-10">
                <TrustStrip stats={stats} embedded showLogos={false} />
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal>
        <ContactTeaser />
      </SectionReveal>
    </div>
  );
}
