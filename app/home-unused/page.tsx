import Link from "next/link";
import type { ReactNode } from "react";
import { HeroCarousel } from "@/unused/components/HeroCarousel";
import { ThreeDViewer } from "@/unused/components/3DViewer";
import { AIAdvisor } from "@/unused/components/ai/Advisor";
import { ConfiguratorCSS } from "@/unused/components/configurator/ConfiguratorCSS";
import { ProductCategories } from "@/unused/components/home/ProductCategories";
import { ProductClientBlocks } from "@/unused/components/home/ProductClientBlocks";
import { Recommendations } from "@/unused/components/home/Recommendations";
import { SolutionsGrid } from "@/unused/components/home/SolutionsGrid";
import { ParallaxGallery } from "@/unused/components/product/ParallaxGallery";
import { ClientCard } from "@/unused/components/ClientCard";
import { FounderCard } from "@/unused/components/FounderCard";
import { ScrollAnimate } from "@/unused/components/ScrollAnimate";
import { Breadcrumbs } from "@/unused/components/ui/Breadcrumbs";
import { Card } from "@/unused/components/ui/Card";
import { ContactPerson } from "@/unused/components/ui/ContactPerson";
import { SectionHeader } from "@/unused/components/ui/SectionHeader";
import { Teaser } from "@/unused/components/ui/Teaser";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/unused/components/ui/Accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/unused/components/ui/Tabs";
import { ContentBlock } from "@/unused/components/shared/ContentBlock";

type RenderableArchiveBlock = {
  id: string;
  title: string;
  source: string;
  note: string;
  element: ReactNode;
  compareHref?: string;
  compareLabel?: string;
  verdict?: "salvage-now" | "mine-selectively" | "reference-only";
};

type RenderableArchiveGroup = {
  id: string;
  eyebrow: string;
  title: string;
  note: string;
  blocks: RenderableArchiveBlock[];
};

type VerdictFilter = NonNullable<RenderableArchiveBlock["verdict"]> | "all";

function readSingleParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function isValidVerdictFilter(value: string | undefined): value is VerdictFilter {
  return (
    value === "all" ||
    value === "salvage-now" ||
    value === "mine-selectively" ||
    value === "reference-only"
  );
}

function ArchivedConfiguratorShellDemo() {
  const shellStages = [
    {
      title: "Project setup",
      detail: "Type, seat count, and room dimensions appear first so the user gets useful output immediately.",
    },
    {
      title: "System decisions",
      detail: "Layout, finishes, screens, and storage stay grouped instead of scattering across one long stack.",
    },
    {
      title: "Review and send",
      detail: "Summary, fit, and submit actions stay visible instead of ending thousands of pixels later.",
    },
  ];

  return (
    <div className="bg-[linear-gradient(180deg,#f7f5ef_0%,#ffffff_45%)] px-6 py-8 md:px-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)]">
        <aside className="rounded-[2rem] border border-neutral-200 bg-neutral-950 p-6 text-white xl:sticky xl:top-24 xl:self-start">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
            Archived shell pattern
          </p>
          <h3 className="mt-3 text-3xl font-light tracking-tight">
            Split preview with a persistent planning summary.
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-300">
            This reconstructs the value of the old layout file without reviving its dead preview
            and step dependencies. The point is the shell: sticky visual context on the left,
            grouped decisions and review on the right.
          </p>

          <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-neutral-400">Preview zone</p>
                <p className="mt-2 text-xl font-medium text-white">24-seat linear bench</p>
              </div>
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                Fits within room
              </span>
            </div>

            <div className="mt-5 grid grid-cols-6 gap-2">
              {Array.from({ length: 24 }, (_, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-xl border ${
                    index % 6 === 0 || index % 6 === 5
                      ? "border-sky-300/40 bg-sky-300/20"
                      : "border-white/10 bg-white/10"
                  }`}
                />
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-neutral-400">Budget band</p>
                <p className="mt-2 text-lg font-medium text-white">INR 5.8L - 6.6L</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-neutral-400">Density</p>
                <p className="mt-2 text-lg font-medium text-white">Balanced plan</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-neutral-400">Copilot role</p>
                <p className="mt-2 text-lg font-medium text-white">Suggest next changes</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-5">
          <section className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.2)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Why this was worth salvaging
            </p>
            <div className="mt-4 space-y-4">
              {shellStages.map((stage) => (
                <div key={stage.title} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <p className="text-sm font-semibold text-neutral-950">{stage.title}</p>
                  <p className="mt-2 text-sm leading-7 text-neutral-600">{stage.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.2)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Review bar concept
                </p>
                <h4 className="mt-2 text-2xl font-light tracking-tight text-neutral-950">
                  The old shell is good, but only after modernization.
                </h4>
              </div>
              <Link
                href="/configurator"
                className="inline-flex items-center rounded-full bg-neutral-900 px-4 py-2 text-sm text-white transition-colors hover:bg-neutral-700"
              >
                Compare live configurator
              </Link>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                "Keep sticky preview and sticky summary behavior.",
                "Do not restore stale hardcoded furniture steps or pricing logic.",
                "Use the shell to support quick estimate first, technical planner second.",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-7 text-neutral-700">
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

const RENDERABLE_ARCHIVE_GROUPS: RenderableArchiveGroup[] = [
  {
    id: "homepage-explorations",
    eyebrow: "Homepage explorations",
    title: "Legacy marketing surfaces",
    note: "Archived homepage modules that are still useful for reviewing layout, pacing, and motion ideas.",
    blocks: [
      {
        id: "hero-carousel",
        title: "Hero Carousel",
        source: "unused/components/HeroCarousel.tsx",
        note: "Legacy full-bleed homepage hero with animated indicators and CTA stack.",
        element: <HeroCarousel />,
        compareHref: "/",
        compareLabel: "Compare live homepage",
        verdict: "reference-only",
      },
      {
        id: "product-categories",
        title: "Product Categories",
        source: "unused/components/home/ProductCategories.tsx",
        note: "Older category-card grid with image-first hover treatment.",
        element: <ProductCategories />,
        compareHref: "/products",
        compareLabel: "Compare live products route",
        verdict: "reference-only",
      },
      {
        id: "product-client-blocks",
        title: "Product Client Blocks",
        source: "unused/components/home/ProductClientBlocks.tsx",
        note: "Combined product-category matrix plus trust-logo block.",
        element: <ProductClientBlocks />,
        compareHref: "/trusted-by",
        compareLabel: "Compare live trust route",
        verdict: "reference-only",
      },
      {
        id: "solutions-grid",
        title: "Solutions Grid",
        source: "unused/components/home/SolutionsGrid.tsx",
        note: "Legacy horizontal capability cards tied to compare and catalog routes.",
        element: <SolutionsGrid />,
        compareHref: "/solutions",
        compareLabel: "Compare live solutions route",
        verdict: "reference-only",
      },
      {
        id: "recommendations",
        title: "Recommendations",
        source: "unused/components/home/Recommendations.tsx",
        note: "May render empty if the recommendation API returns no data.",
        element: <Recommendations />,
        compareHref: "/",
        compareLabel: "Compare live recommendation surfaces",
        verdict: "reference-only",
      },
    ],
  },
  {
    id: "configurator-and-ai",
    eyebrow: "Configurator and AI",
    title: "Usability reference surfaces",
    note: "The most relevant archive modules for improving the live configurator and advisor experience.",
    blocks: [
      {
        id: "archived-configurator-layout-shell",
        title: "Archived Configurator Layout Shell",
        source: "unused/components/configurator/ConfiguratorLayout.tsx",
        note: "A structural reconstruction of the old split-shell idea, mounted without reviving the deleted preview and steps internals.",
        element: <ArchivedConfiguratorShellDemo />,
        compareHref: "/configurator",
        compareLabel: "Compare live configurator",
        verdict: "salvage-now",
      },
      {
        id: "configurator-css-concept",
        title: "Configurator CSS Concept",
        source: "unused/components/configurator/ConfiguratorCSS.tsx",
        note: "Reference-only interaction concept for swatches, size chips, and direct-manipulation preview.",
        element: <ConfiguratorCSS />,
        compareHref: "/configurator",
        compareLabel: "Compare live configurator",
        verdict: "mine-selectively",
      },
      {
        id: "legacy-ai-advisor",
        title: "Legacy AI Advisor",
        source: "unused/components/ai/Advisor.tsx",
        note: "Floating archive advisor for comparing the older ask-result-reset loop against the live assistant.",
        element: <AIAdvisor />,
        compareHref: "/",
        compareLabel: "Compare live assistant",
        verdict: "salvage-now",
      },
    ],
  },
  {
    id: "product-presentation",
    eyebrow: "Product presentation",
    title: "PDP and media experiments",
    note: "Archived visual treatments that may still be worth referencing for future gallery or media passes.",
    blocks: [
      {
        id: "archived-3d-viewer",
        title: "Archived 3D Viewer",
        source: "unused/components/3DViewer.tsx",
        note: "Now mounted against a real local workstation model so the archive viewer can be judged as an actual product-media surface.",
        element: (
          <div className="grid gap-6 bg-neutral-950 px-6 py-8 text-white md:px-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-neutral-900">
              <div className="aspect-[16/10]">
                <ThreeDViewer
                  src="/models/task4a/oando-workstations/oando-workstations--deskpro.glb"
                  fallbackImage="/images/products/imported/fluid/image-1.webp"
                />
              </div>
            </div>
            <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                Live asset pairing
              </p>
              <p className="text-xl font-light tracking-tight text-white">
                DeskPro workstation model from the local product asset set.
              </p>
              <p className="text-sm leading-7 text-neutral-300">
                This proves the old `model-viewer` wrapper still works technically. It is usable as
                a fallback media component, but it needs tighter loading, framing, and mobile
                behavior before it would be worth restoring into the live PDP.
              </p>
            </div>
          </div>
        ),
        compareHref: "/products/workstations/oando-workstations--deskpro",
        compareLabel: "Compare live PDP media",
        verdict: "mine-selectively",
      },
      {
        id: "parallax-gallery",
        title: "Parallax Gallery",
        source: "unused/components/product/ParallaxGallery.tsx",
        note: "Simple premium-motion image treatment for a future gallery pass.",
        element: (
          <ParallaxGallery
            image="/images/about/hero-corridor.jpg"
            caption="Legacy parallax treatment"
          />
        ),
        compareHref: "/products/workstations/oando-workstations--deskpro",
        compareLabel: "Compare live PDP media",
        verdict: "mine-selectively",
      },
    ],
  },
  {
    id: "shared-primitives",
    eyebrow: "Shared primitives",
    title: "Reusable UI wrappers and layout blocks",
    note: "Archived primitives that still compile and can be judged as building blocks rather than full pages.",
    blocks: [
      {
        id: "archived-tabs-and-accordion",
        title: "Archived Tabs and Accordion",
        source: "unused/components/ui/Tabs.tsx + unused/components/ui/Accordion.tsx",
        note: "Radix-based wrappers with a quieter visual system than the live site. Useful only if we want a shared primitive layer again.",
        element: (
          <div className="px-6 py-8 md:px-8">
            <Tabs defaultValue="tabs-demo" className="w-full">
              <TabsList>
                <TabsTrigger value="tabs-demo">Tabs wrapper</TabsTrigger>
                <TabsTrigger value="accordion-demo">Accordion wrapper</TabsTrigger>
              </TabsList>
              <TabsContent value="tabs-demo">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                  <p className="text-sm leading-7 text-neutral-600">
                    The archived tabs wrapper is clean and lightweight, but stylistically generic.
                    It is useful as a reference for dense spec or compare surfaces, not as a
                    differentiated product pattern by itself.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="accordion-demo">
                <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is still usable here?</AccordionTrigger>
                    <AccordionContent>
                      The keyboard and disclosure behavior are solid. The visual language would
                      need a stronger product-specific treatment before reuse.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Would this return to the live app directly?</AccordionTrigger>
                    <AccordionContent>
                      Not directly. It is better treated as a reference primitive if a future spec
                      or comparison surface needs it.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>
        ),
      },
      {
        id: "archived-content-block",
        title: "Archived Content Block",
        source: "unused/components/shared/ContentBlock.tsx",
        note: "A still-renderable editorial block with image-plus-copy pacing. Stronger than the generic wrappers, but still reference-first.",
        element: (
          <ContentBlock
            title="Archive content pacing block"
            subtitle="Reference-only"
            description="This preserved layout is useful for evaluating image-led storytelling rhythm, but its styling would need to be aligned with the live marketing system before reuse."
            imageSrc="/images/about/hero-corridor.jpg"
            linkText="Open contact route"
            linkHref="/contact"
          />
        ),
      },
    ],
  },
  {
    id: "trust-and-storytelling",
    eyebrow: "Trust and storytelling",
    title: "Legacy people and client cards",
    note: "Older trust-building card patterns that still mount with the current utility layer and animation hook.",
    blocks: [
      {
        id: "archived-founder-card",
        title: "Archived Founder Card",
        source: "unused/components/FounderCard.tsx",
        note: "Still functional, but visually generic. Better as reference material than direct restoration.",
        element: (
          <div className="grid gap-6 px-6 py-8 md:px-8 lg:grid-cols-[minmax(0,22rem)_1fr]">
            <FounderCard
              name="Archive profile sample"
              title="Founder"
              bio="This old card still renders correctly and proves the dependency note was stale, but its presentation is too generic for the live trust system."
              image="/images/about/hero-corridor.jpg"
            />
            <ScrollAnimate className="rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">
                ScrollAnimate wrapper
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600">
                The archived scroll animation wrapper still works because the shared GSAP hook is
                still present. It is useful as proof of compatibility, but it should be mined
                selectively instead of restored wholesale.
              </p>
            </ScrollAnimate>
          </div>
        ),
        compareHref: "/about",
        compareLabel: "Compare live about route",
        verdict: "reference-only",
      },
      {
        id: "archived-client-card",
        title: "Archived Client Card",
        source: "unused/components/ClientCard.tsx",
        note: "A working trust-logo card with live safe-image and scroll-animation dependencies.",
        element: (
          <div className="px-6 py-8 md:px-8">
            <div className="max-w-sm">
              <ClientCard
                client={{
                  client_name: "Archive client sample",
                  city: "Patna",
                  sector: "Commercial interiors",
                  description:
                    "This preserved card still compiles, but the copy rhythm and styling are not distinctive enough for the live site without further redesign.",
                  image: "/ClientLogos/Titan.png",
                }}
              />
            </div>
          </div>
        ),
        compareHref: "/trusted-by",
        compareLabel: "Compare live trust route",
        verdict: "reference-only",
      },
    ],
  },
  {
    id: "utility-composition",
    eyebrow: "Utility composition",
    title: "Composed archive UI patterns",
    note: "A judged preview of the archived mid-level UI pieces that are concrete enough to evaluate together.",
    blocks: [
      {
        id: "archived-navigation-and-sectioning",
        title: "Archived breadcrumbs and section header",
        source: "unused/components/ui/Breadcrumbs.tsx + unused/components/ui/SectionHeader.tsx",
        note: "Functional and clean, but visually restrained. Better suited as reference primitives than hero product work.",
        element: (
          <div className="space-y-8 px-6 py-8 md:px-8">
            <Breadcrumbs
              items={[
                { label: "Archive", href: "/home-unused" },
                { label: "Utility composition", href: "/home-unused#archived-navigation-and-sectioning" },
              ]}
            />
            <SectionHeader
              eyebrow="Archive UI"
              title="Section framing still works"
              subtitle="This pattern is structurally sound, but it relies on very generic typography and does not add much beyond the current live system."
            />
          </div>
        ),
        compareHref: "/downloads",
        compareLabel: "Compare live route framing",
        verdict: "reference-only",
      },
      {
        id: "archived-cards-and-teasers",
        title: "Archived cards and teaser blocks",
        source: "unused/components/ui/Card.tsx + unused/components/ui/Teaser.tsx",
        note: "Usable image-led wrappers, but they need a sharper visual language before any direct reuse.",
        element: (
          <div className="grid gap-6 px-6 py-8 md:px-8 lg:grid-cols-2">
            <Card
              imageSrc="/images/about/hero-corridor.jpg"
              title="Overlay card pattern"
              subtitle="Archive reference"
              href="/projects"
              variant="overlay"
            />
            <Teaser
              imageSrc="/images/about/hero-corridor.jpg"
              title="Teaser pattern"
              description="This preserved teaser still feels coherent, but it would need live-system typography and stronger interaction detail before reuse."
              href="/contact"
              badge="Reference"
            />
          </div>
        ),
        compareHref: "/showrooms",
        compareLabel: "Compare live teaser usage",
        verdict: "reference-only",
      },
      {
        id: "archived-contact-person",
        title: "Archived contact person card",
        source: "unused/components/ui/ContactPerson.tsx",
        note: "One of the more concrete utility components in the archive. Reasonable for human-contact sections, though still visually generic.",
        element: (
          <div className="px-6 py-8 md:px-8">
            <div className="max-w-2xl">
              <ContactPerson
                imageSrc="/images/about/hero-corridor.jpg"
                name="Archive contact sample"
                role="Workspace advisor"
                phone="+91 98356 30940"
                email="hello@oneandonlyfurniture.com"
                location="Patna, Bihar"
              />
            </div>
          </div>
        ),
        compareHref: "/contact",
        compareLabel: "Compare live contact route",
        verdict: "reference-only",
      },
    ],
  },
] as const;

const PENDING_SALVAGE_CANDIDATES = [
  {
    source: "unused/components/ai/Advisor.tsx",
    value: "Worth mining for the simpler ask-result-reset loop and compact recommendation cards.",
    nextStep: "Borrow the route-scoped interaction pattern, not the standalone floating assistant.",
  },
  {
    source: "unused/components/product/ParallaxGallery.tsx",
    value: "Worth keeping as a premium media reference for a later PDP gallery pass.",
    nextStep: "Reuse only if the live PDP gets a richer image stack and motion budget.",
  },
  {
    source: "unused/components/ui/Accordion.tsx",
    value: "Potentially reusable if the repo wants a shared primitive for future dense comparison/spec views.",
    nextStep: "Review against current component ownership before reintroducing any wrapper layer.",
  },
] as const;

const UTILITY_WRAPPER_DECISIONS = [
  {
    source: "unused/components/ui/Accordion.tsx + unused/components/ui/Tabs.tsx",
    decision: "Keep as reference-only candidate",
    reason:
      "They are the only archive wrappers with meaningful behavior not already owned by a stronger live primitive. They could return later for dense compare or spec surfaces.",
    liveOverlap: "Current filter accordions and nav disclosure logic are route-specific, not shared primitives.",
  },
  {
    source: "unused/components/ui/Breadcrumbs.tsx + unused/components/ui/SectionHeader.tsx",
    decision: "Reference-only",
    reason:
      "These are structurally fine but visually generic. The live site already composes page framing directly and does not benefit from adding another abstraction layer.",
    liveOverlap: "Live routes already use direct page hero and framing patterns plus shared contact teasers.",
  },
  {
    source: "unused/components/ui/Card.tsx + unused/components/ui/Teaser.tsx + unused/components/ui/ContactPerson.tsx",
    decision: "Do not graduate as shared primitives",
    reason:
      "They are too visually opinionated to be universal, but not strong enough to define the live design language. Keep them only as archive references.",
    liveOverlap: "Live home teasers, route cards, and contact surfaces already exist in more specific forms.",
  },
  {
    source: "unused/components/ui/Badge.tsx + unused/components/ui/Input.tsx + unused/components/ui/Container.tsx + unused/components/ui/Slider.tsx",
    decision: "Do not promote",
    reason:
      "These are either trivial wrappers or require a fuller design system decision before they add value.",
    liveOverlap: "The repo already uses direct utility classes and existing route-specific layouts instead of a broad primitive layer.",
  },
] as const;

const TOP_ARCHIVE_PICKS = [
  {
    title: "Configurator shell structure",
    target: "#archived-configurator-layout-shell",
    why: "Best structural salvage. The split sticky preview and review shell clearly improves orientation on long planning flows.",
  },
  {
    title: "Legacy advisor interaction loop",
    target: "#legacy-ai-advisor",
    why: "Best AI interaction salvage. The ask-result-reset loop is more focused than the old global modal behavior.",
  },
  {
    title: "3D viewer fallback surface",
    target: "#archived-3d-viewer",
    why: "Technically still viable now that real local models exist. Worth mining only if the PDP media stack gets a richer 3D path.",
  },
  {
    title: "Parallax gallery treatment",
    target: "#parallax-gallery",
    why: "Strong reference for a future premium PDP motion pass, but not urgent enough for general rollout.",
  },
] as const;

const RENDERABLE_ARCHIVE_BLOCKS = RENDERABLE_ARCHIVE_GROUPS.flatMap((group) => group.blocks);

const SKIPPED_ARCHIVE_MODULES = [
  {
    source: "unused/components/configurator/productMapping.ts",
    reason: "Static stale mapping and not a standalone renderable surface.",
  },
  {
    source: "unused/components/shared/GsapAnimations.tsx, PageAnimations.tsx, PageLoader.tsx, SmoothScroll.tsx",
    reason: "Motion wrappers without enough standalone context; better mined selectively than previewed as isolated blocks.",
  },
  {
    source: "unused/components/ui/Badge.tsx, Container.tsx, Input.tsx, Slider.tsx",
    reason: "Either too trivial to justify isolated demos or too dependent on a richer composed surface to judge properly.",
  },
] as const;

function PreviewBlock({
  id,
  title,
  source,
  note,
  children,
  compareHref,
  compareLabel,
  verdict,
}: {
  id: string;
  title: string;
  source: string;
  note: string;
  children: ReactNode;
  compareHref?: string;
  compareLabel?: string;
  verdict?: RenderableArchiveBlock["verdict"];
}) {
  const verdictLabel =
    verdict === "salvage-now"
      ? "Salvage now"
      : verdict === "mine-selectively"
        ? "Mine selectively"
        : verdict === "reference-only"
          ? "Reference only"
          : null;
  const verdictClassName =
    verdict === "salvage-now"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : verdict === "mine-selectively"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-neutral-200 bg-neutral-100 text-neutral-700";

  return (
    <section
      id={id}
      className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-[0_26px_70px_-42px_rgba(15,23,42,0.3)]"
    >
      <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-5 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
          Archive Preview
        </p>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl tracking-tight text-neutral-950">{title}</h2>
              {verdictLabel ? (
                <span
                  className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${verdictClassName}`}
                >
                  {verdictLabel}
                </span>
              ) : null}
            </div>
            <p className="mt-2 max-w-3xl text-sm text-neutral-600">{note}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {compareHref ? (
              <Link
                href={compareHref}
                className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-neutral-700"
              >
                {compareLabel || "Compare live"}
              </Link>
            ) : null}
            <code className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600">
              {source}
            </code>
          </div>
        </div>
      </div>
      <div className="bg-white">{children}</div>
    </section>
  );
}

export default async function HomeUnusedComponentsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const verdictParam = readSingleParam(resolvedSearchParams.verdict);
  const compareParam = readSingleParam(resolvedSearchParams.compare);
  const queryParam = readSingleParam(resolvedSearchParams.q)?.trim() ?? "";
  const activeVerdictFilter: VerdictFilter = isValidVerdictFilter(verdictParam)
    ? verdictParam
    : "all";
  const liveComparisonOnly = compareParam === "1";
  const normalizedQuery = queryParam.toLowerCase();
  const filteredGroups = RENDERABLE_ARCHIVE_GROUPS.map((group) => ({
    ...group,
    blocks: group.blocks.filter((block) => {
      const verdictMatches =
        activeVerdictFilter === "all" ? true : block.verdict === activeVerdictFilter;
      const compareMatches = liveComparisonOnly ? Boolean(block.compareHref) : true;
      const queryMatches = normalizedQuery
        ? `${block.title} ${block.source} ${block.note}`.toLowerCase().includes(normalizedQuery)
        : true;
      return verdictMatches && compareMatches && queryMatches;
    }),
  })).filter((group) => group.blocks.length > 0);
  const filteredBlocks = filteredGroups.flatMap((group) => group.blocks);
  const visibleBlockCount = filteredBlocks.length;
  const totalBlockCount = RENDERABLE_ARCHIVE_BLOCKS.length;
  const visibleBlockIds = new Set(filteredBlocks.map((block) => block.id));
  const visibleTopPicks = TOP_ARCHIVE_PICKS.filter((item) =>
    visibleBlockIds.has(item.target.replace(/^#/, "")),
  );
  const verdictCounts = {
    salvageNow: RENDERABLE_ARCHIVE_BLOCKS.filter((block) => block.verdict === "salvage-now").length,
    mineSelectively: RENDERABLE_ARCHIVE_BLOCKS.filter((block) => block.verdict === "mine-selectively").length,
    referenceOnly: RENDERABLE_ARCHIVE_BLOCKS.filter((block) => block.verdict === "reference-only").length,
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f5f1e8_0%,#faf8f3_16%,#ffffff_38%)]">
      <section className="border-b border-neutral-200 bg-white/85 backdrop-blur">
        <div className="container px-6 py-12 2xl:px-0">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Internal review route</p>
          <h1 className="mt-2 text-4xl tracking-tight text-neutral-950">Unused Archive Preview</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-600">
            This route compiles renderable modules from <code>unused/components</code> into one
            review surface so you can inspect the archive visually before deciding what is worth
            salvaging.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-950"
            >
              Back to homepage
            </Link>
            <Link
              href="/configurator"
              className="inline-flex items-center rounded-full bg-neutral-900 px-4 py-2 text-sm text-white transition-colors hover:bg-neutral-700"
            >
              Compare against live configurator
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {filteredBlocks.map((block) => (
              <a
                key={block.id}
                href={`#${block.id}`}
                className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-950"
              >
                {block.title}
              </a>
            ))}
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-neutral-200 bg-neutral-50 px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Archive filters
                </p>
                <p className="mt-2 text-sm text-neutral-600">
                  Showing {visibleBlockCount} of {totalBlockCount} mounted archive previews.
                </p>
              </div>
              <Link
                href="/home-unused"
                className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-950"
              >
                Reset filters
              </Link>
            </div>
            <form action="/home-unused" className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
              <input
                type="text"
                name="q"
                defaultValue={queryParam}
                placeholder="Filter by module name or source path"
                className="min-h-11 rounded-full border border-neutral-300 bg-white px-4 text-sm text-neutral-800 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900"
              />
              <div className="flex flex-wrap gap-2">
                {activeVerdictFilter !== "all" ? (
                  <input type="hidden" name="verdict" value={activeVerdictFilter} />
                ) : null}
                {liveComparisonOnly ? <input type="hidden" name="compare" value="1" /> : null}
                <button
                  type="submit"
                  className="rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-neutral-700"
                >
                  Apply search
                </button>
              </div>
            </form>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                {
                  label: "All",
                  href: queryParam ? `/home-unused?q=${encodeURIComponent(queryParam)}` : "/home-unused",
                  active: activeVerdictFilter === "all" && !liveComparisonOnly,
                },
                {
                  label: "Salvage now",
                  href: queryParam
                    ? `/home-unused?verdict=salvage-now&q=${encodeURIComponent(queryParam)}`
                    : "/home-unused?verdict=salvage-now",
                  active: activeVerdictFilter === "salvage-now" && !liveComparisonOnly,
                },
                {
                  label: "Mine selectively",
                  href: queryParam
                    ? `/home-unused?verdict=mine-selectively&q=${encodeURIComponent(queryParam)}`
                    : "/home-unused?verdict=mine-selectively",
                  active: activeVerdictFilter === "mine-selectively" && !liveComparisonOnly,
                },
                {
                  label: "Reference only",
                  href: queryParam
                    ? `/home-unused?verdict=reference-only&q=${encodeURIComponent(queryParam)}`
                    : "/home-unused?verdict=reference-only",
                  active: activeVerdictFilter === "reference-only" && !liveComparisonOnly,
                },
                {
                  label: "Live compare only",
                  href:
                    activeVerdictFilter === "all"
                      ? queryParam
                        ? `/home-unused?compare=1&q=${encodeURIComponent(queryParam)}`
                        : "/home-unused?compare=1"
                      : queryParam
                        ? `/home-unused?verdict=${activeVerdictFilter}&compare=1&q=${encodeURIComponent(queryParam)}`
                        : `/home-unused?verdict=${activeVerdictFilter}&compare=1`,
                  active: liveComparisonOnly,
                },
              ].map((filter) => (
                <Link
                  key={filter.label}
                  href={filter.href}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                    filter.active
                      ? "border border-neutral-900 bg-neutral-900 text-white"
                      : "border border-neutral-300 bg-white text-neutral-700 hover:border-neutral-900 hover:text-neutral-950"
                  }`}
                >
                  {filter.label}
                </Link>
              ))}
            </div>
            {activeVerdictFilter !== "all" || liveComparisonOnly || queryParam ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Active:
                </span>
                {activeVerdictFilter !== "all" ? (
                  <span className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-semibold text-neutral-700">
                    Verdict: {activeVerdictFilter}
                  </span>
                ) : null}
                {liveComparisonOnly ? (
                  <span className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-semibold text-neutral-700">
                    Live compare only
                  </span>
                ) : null}
                {queryParam ? (
                  <span className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-semibold text-neutral-700">
                    Search: {queryParam}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="container space-y-12 px-6 py-10 2xl:px-0">
        <section className="rounded-[2rem] border border-amber-200 bg-amber-50/80 px-6 py-8 md:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700">
            Pending salvage list
          </p>
          <h2 className="mt-2 text-2xl tracking-tight text-neutral-950">
            Next archive candidates worth reviewing
          </h2>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {PENDING_SALVAGE_CANDIDATES.map((item) => (
              <div key={item.source} className="rounded-2xl border border-amber-200 bg-white px-4 py-4">
                <code className="text-sm text-neutral-800">{item.source}</code>
                <p className="mt-2 text-sm text-neutral-700">{item.value}</p>
                <p className="mt-2 text-sm text-neutral-600">{item.nextStep}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-neutral-950 bg-neutral-950 px-6 py-8 text-white md:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
            Strongest archive picks
          </p>
          <h2 className="mt-2 text-2xl tracking-tight text-white">
            The few things actually worth borrowing into the live app
          </h2>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {visibleTopPicks.map((item) => (
              <a
                key={item.title}
                href={item.target}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 transition-colors hover:border-white/25 hover:bg-white/8"
              >
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-neutral-300">{item.why}</p>
              </a>
            ))}
          </div>
          {visibleTopPicks.length === 0 ? (
            <p className="mt-5 text-sm leading-7 text-neutral-300">
              No top-pick shortcuts match the current filter state.
            </p>
          ) : null}
        </section>

        <section className="rounded-[2rem] border border-neutral-200 bg-white px-6 py-8 md:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Verdict mix
          </p>
          <h2 className="mt-2 text-2xl tracking-tight text-neutral-950">
            How the mounted archive breaks down
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Link
              href="/home-unused?verdict=salvage-now"
              className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-5 transition-colors hover:border-emerald-300"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Salvage now
              </p>
              <p className="mt-3 text-3xl font-light tracking-tight text-emerald-900">
                {verdictCounts.salvageNow}
              </p>
              <p className="mt-2 text-sm leading-7 text-emerald-900/80">
                Strong enough to borrow into live work without needing a full reinvention first.
              </p>
            </Link>
            <Link
              href="/home-unused?verdict=mine-selectively"
              className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-5 transition-colors hover:border-amber-300"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700">
                Mine selectively
              </p>
              <p className="mt-3 text-3xl font-light tracking-tight text-amber-900">
                {verdictCounts.mineSelectively}
              </p>
              <p className="mt-2 text-sm leading-7 text-amber-900/80">
                Worth borrowing pieces from, but not worth restoring wholesale.
              </p>
            </Link>
            <Link
              href="/home-unused?verdict=reference-only"
              className="rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-5 transition-colors hover:border-neutral-300"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Reference only
              </p>
              <p className="mt-3 text-3xl font-light tracking-tight text-neutral-950">
                {verdictCounts.referenceOnly}
              </p>
              <p className="mt-2 text-sm leading-7 text-neutral-700">
                Useful for context and comparison, but not worth promoting into the live system.
              </p>
            </Link>
          </div>
        </section>

        <section className="rounded-[2rem] border border-neutral-200 bg-white px-6 py-8 md:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Utility wrapper decision
          </p>
          <h2 className="mt-2 text-2xl tracking-tight text-neutral-950">
            Which archive primitives are worth graduating?
          </h2>
          <div className="mt-5 grid gap-3">
            {UTILITY_WRAPPER_DECISIONS.map((item) => (
              <div key={item.source} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <code className="text-sm text-neutral-800">{item.source}</code>
                  <span className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-700">
                    {item.decision}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-neutral-700">{item.reason}</p>
                <p className="mt-2 text-sm leading-7 text-neutral-600">{item.liveOverlap}</p>
              </div>
            ))}
          </div>
        </section>

        {filteredGroups.map((group) => (
          <section key={group.id} className="space-y-6">
            <div className="rounded-[2rem] border border-neutral-200 bg-white/80 px-6 py-6 md:px-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                {group.eyebrow}
              </p>
              <h2 className="mt-2 text-3xl tracking-tight text-neutral-950">{group.title}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">{group.note}</p>
            </div>

            {group.blocks.map((block) => (
              <PreviewBlock
                id={block.id}
                key={block.source}
                title={block.title}
                source={block.source}
                note={block.note}
                compareHref={block.compareHref}
                compareLabel={block.compareLabel}
                verdict={block.verdict}
              >
                {block.element}
              </PreviewBlock>
            ))}
          </section>
        ))}

        {visibleBlockCount === 0 ? (
          <section className="rounded-[2rem] border border-dashed border-neutral-300 bg-white px-6 py-10 text-center md:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              No matches
            </p>
            <h2 className="mt-2 text-2xl tracking-tight text-neutral-950">
              No archive blocks match the current filter
            </h2>
            <p className="mt-3 text-sm leading-7 text-neutral-600">
              Reset the current verdict filter, clear the search query, or turn off
              live-comparison-only mode to show the full archive review surface again.
            </p>
          </section>
        ) : null}

        <section className="rounded-[2rem] border border-dashed border-neutral-300 bg-neutral-50 px-6 py-8 md:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Not Mounted Here
          </p>
          <h2 className="mt-2 text-2xl tracking-tight text-neutral-950">Reference-only archive modules</h2>
          <div className="mt-5 grid gap-3">
            {SKIPPED_ARCHIVE_MODULES.map((item) => (
              <div key={item.source} className="rounded-2xl border border-neutral-200 bg-white px-4 py-4">
                <code className="text-sm text-neutral-800">{item.source}</code>
                <p className="mt-2 text-sm text-neutral-600">{item.reason}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
