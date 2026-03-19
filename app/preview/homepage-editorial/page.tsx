import type { Metadata } from "next";
import { PreviewContactClose } from "@/components/preview/homepage/PreviewContactClose";
import { PreviewHero } from "@/components/preview/homepage/PreviewHero";
import { PreviewProjects } from "@/components/preview/homepage/PreviewProjects";
import { buildPageJsonLd, buildPageMetadata } from "@/lib/helpers/seo";
import { SITE_URL } from "@/lib/siteUrl";

export const metadata: Metadata = {
  ...buildPageMetadata(SITE_URL, {
    title: "Homepage Editorial Preview",
    description:
      "Hidden editorial warmth preview exploring a stronger homepage direction for One&Only.",
    path: "/preview/homepage-editorial",
    image: "/images/hero/titan-patna-hq.webp",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default function HomepageEditorialPreviewPage() {
  const pageJsonLd = buildPageJsonLd(SITE_URL, {
    path: "/preview/homepage-editorial",
    title: "Homepage Editorial Preview",
    description:
      "Hidden editorial warmth preview exploring a stronger homepage direction for One&Only.",
    pageType: "WebPage",
  });

  return (
    <div className="preview-homepage">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <PreviewHero />
      <PreviewProjects />
      <PreviewContactClose />
    </div>
  );
}
