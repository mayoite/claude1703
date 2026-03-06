import { HomepageHero } from "@/components/home/HomepageHero";
import { PartnershipBanner } from "@/components/home/PartnershipBanner";
import { TrustStrip } from "@/components/home/TrustStrip";
import { SolutionsGrid } from "@/components/home/SolutionsGrid";
import { ProcessSection } from "@/components/home/ProcessSection";
import { OurExperience } from "@/components/home/OurExperience";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { getBusinessStats } from "@/lib/businessStats";
import { formatKpiAsOf } from "@/lib/kpiFormat";

export default async function Home() {
  // Fetch stats once for TrustStrip and OurWork (fast path - cached)
  const { stats } = await getBusinessStats();
  const asOfLabel = formatKpiAsOf(stats.asOfDate);

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero */}
      <HomepageHero />

      {/* 2. PartnershipBanner */}
      <SectionReveal>
        <PartnershipBanner />
      </SectionReveal>

      {/* 3. TrustStrip — near top for maximum trust signal */}
      <SectionReveal>
        <TrustStrip stats={stats} asOfLabel={asOfLabel} />
      </SectionReveal>

      {/* 4. SolutionsGrid */}
      <SectionReveal>
        <SolutionsGrid />
      </SectionReveal>

      {/* 5. OurExperience */}
      <SectionReveal>
        <OurExperience clientCount={stats.clientOrganisations} />
      </SectionReveal>

      {/* 6. ProcessSection */}
      <SectionReveal>
        <ProcessSection />
      </SectionReveal>

      {/* 7. ContactTeaser */}
      <SectionReveal>
        <ContactTeaser />
      </SectionReveal>
    </div>
  );
}
