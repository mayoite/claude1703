import Image from "next/image";
import { Hero } from "@/components/home/Hero";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { Masonry, MasonryItem } from "@/components/ui/Masonry";

const PROJECTS = [
  {
    title: "Titan Workspace",
    location: "Patna",
    image: "/projects/Titan/27-06-2025 Image 05_edited_edited.webp",
    category: "Corporate fit-out",
  },
  {
    title: "TVS Office",
    location: "Patna",
    image: "/projects/TVS/27-06-2025 Image 03.webp",
    category: "Operations floor",
  },
  {
    title: "DMRC Facility",
    location: "New Delhi",
    image: "/projects/DMRC/IMG_20200612_145931.webp",
    category: "Institutional workspace",
  },
  {
    title: "Usha Setup",
    location: "Patna",
    image: "/projects/Usha/DSC_0077_edited.webp",
    category: "Workspace modernization",
  },
  {
    title: "Government Office",
    location: "Patna",
    image: "/projects/Govenment/20140707_124458_compressed.webp",
    category: "Public sector project",
  },
  {
    title: "Franklin Templeton",
    location: "India",
    image: "/projects/FranklinTempleton/WhatsApp Image 2020-08-28 at 12.40.51.webp",
    category: "Enterprise deployment",
  },
] as const;

export default function GalleryPage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title="Project Gallery"
        subtitle="Selected workspace deliveries across corporate, public, and institutional environments."
        showButton={false}
        backgroundImage="/projects/titan-gallery.webp"
      />

      <section className="container px-6 py-18 2xl:px-0 md:py-22">
        <div className="mb-12 max-w-4xl">
          <p className="typ-label mb-4 text-neutral-700">Recent visual highlights</p>
          <h2 className="typ-section text-neutral-950">Real projects, real installations.</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-neutral-800">
            Browse completed site photos to understand finish quality, layout styles, and delivery
            scale across different project types.
          </p>
        </div>

        <Masonry columns={2} gap="2rem">
          {PROJECTS.map((project) => (
            <MasonryItem key={`${project.title}-${project.location}`}>
              <article className="group relative mb-8 overflow-hidden rounded-xl border border-neutral-300 bg-neutral-100">
                <Image
                  src={project.image}
                  alt={`${project.title} project`}
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                    {project.category}
                  </p>
                  <h3 className="mt-2 text-3xl font-light tracking-tight text-white">{project.title}</h3>
                  <p className="mt-1 text-sm text-white/85">{project.location}</p>
                </div>
              </article>
            </MasonryItem>
          ))}
        </Masonry>
      </section>

      <ContactTeaser />
    </section>
  );
}
