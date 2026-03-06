import { Briefcase, GraduationCap, Users } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { JobCard } from "@/components/career/JobCard";

const JOBS = [
  {
    title: "Project Sales Manager",
    department: "Enterprise Sales",
    location: "Patna",
  },
  {
    title: "Workspace Planner",
    department: "Planning and Design",
    location: "Patna",
  },
  {
    title: "Site Execution Coordinator",
    department: "Operations",
    location: "Patna and travel",
  },
  {
    title: "Customer Support Executive",
    department: "After-sales Support",
    location: "Patna",
  },
] as const;

export default function CareerPage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title="Careers"
        subtitle="Join a team that builds practical, high-impact workspaces for organizations across India."
        showButton={false}
        backgroundImage="/images/hero/tvs-patna-enhanced.webp"
      />

      <section className="container px-6 py-18 2xl:px-0 md:py-22">
        <div className="mb-12 max-w-4xl space-y-5">
          <p className="typ-label text-neutral-700">Why join us</p>
          <h2 className="typ-section text-neutral-950">Build your career in workspace delivery.</h2>
          <p className="text-lg leading-relaxed text-neutral-800">
            We work across planning, product consulting, project delivery, and support. If you care
            about reliable execution and customer outcomes, you will fit well here.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <article className="rounded-xl border border-neutral-300 bg-neutral-50 p-7">
            <Users className="mb-4 h-8 w-8 text-primary" />
            <h3 className="text-2xl font-light text-neutral-950">Collaborative teams</h3>
            <p className="mt-3 text-base leading-relaxed text-neutral-800">
              Sales, planning, and operations work closely so decisions are clear and execution stays fast.
            </p>
          </article>
          <article className="rounded-xl border border-neutral-300 bg-neutral-50 p-7">
            <GraduationCap className="mb-4 h-8 w-8 text-primary" />
            <h3 className="text-2xl font-light text-neutral-950">Learning-focused work</h3>
            <p className="mt-3 text-base leading-relaxed text-neutral-800">
              You gain practical exposure to real client briefs, procurement cycles, and installation realities.
            </p>
          </article>
          <article className="rounded-xl border border-neutral-300 bg-neutral-50 p-7">
            <Briefcase className="mb-4 h-8 w-8 text-primary" />
            <h3 className="text-2xl font-light text-neutral-950">Meaningful responsibility</h3>
            <p className="mt-3 text-base leading-relaxed text-neutral-800">
              We give ownership early, with mentorship and clear accountability standards.
            </p>
          </article>
        </div>
      </section>

      <section className="w-full border-y border-neutral-200 bg-neutral-50 py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="typ-section text-neutral-950">Current openings</h2>
            <p className="text-sm font-medium text-neutral-700">{JOBS.length} roles available</p>
          </div>

          <div className="space-y-4">
            {JOBS.map((job) => (
              <JobCard
                key={`${job.title}-${job.department}`}
                title={job.title}
                department={job.department}
                location={job.location}
              />
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-neutral-300 bg-white p-6">
            <h3 className="text-2xl font-light text-neutral-950">No matching role yet?</h3>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-800">
              Send your profile and let us know where you can contribute. We review applications for
              sales, operations, planning, and support functions on a rolling basis.
            </p>
            <a
              href="mailto:careers@oando.co.in"
              className="link-arrow mt-5"
            >
              careers@oando.co.in
            </a>
          </div>
        </div>
      </section>

      <ContactTeaser />
    </section>
  );
}
