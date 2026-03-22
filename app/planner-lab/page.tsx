import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planner Lab",
  description: "Temporary lab route for configurator reference review and workspace experiments.",
  robots: {
    index: false,
    follow: false,
  },
};

const references = [
  {
    title: "mj-react-planner 2.0.7",
    badge: "MIT package",
    role: "Layout reference",
    path: "tmp/imports/mj-react-planner-2.0.7/package",
    status: "Loaded",
    image: "/planner-lab/mj-react-planner-preview.png",
    actionLabel: "Open upstream demo",
    actionHref: "https://cvdlab.github.io/react-planner",
    notes:
      "Useful for planner composition, panel rhythm, and how a design tool can expose layers without turning the screen into noise.",
  },
  {
    title: "Syncfusion floor planner",
    badge: "Repo reference",
    role: "Capability reference",
    path: "tmp/ej2-showcase-react-floor-planner",
    status: "Loaded",
    notes:
      "Useful for enterprise planning affordances and floor-plan tooling ideas, but too heavy to import directly into this Next.js route.",
  },
  {
    title: "threejs-3d-room-designer",
    badge: "Repo reference",
    role: "Interaction reference",
    path: "tmp/threejs-3d-room-designer",
    status: "Loaded",
    image: "/planner-lab/threejs-room-designer-1.jpg",
    imageSecondary: "/planner-lab/threejs-room-designer-2.jpg",
    actionLabel: "Open published demo",
    actionHref: "https://threejs-room-configurator.netlify.app/",
    notes:
      "Useful for room-designer interaction patterns, spatial editing feel, and stronger furniture-placement ambition than the current live planner.",
  },
  {
    title: "starter-main",
    badge: "Starter reference",
    role: "Shell reference",
    path: "tmp/imports/starter-main/starter-main",
    status: "Loaded",
    notes:
      "Useful for route and shell structure ideas while we keep the actual planner interactions owned by this repo.",
  },
  {
    title: "Live configurator baseline",
    badge: "Current route",
    role: "Baseline reference",
    path: "app/configurator + components/configurator + lib/planner",
    status: "Active",
    actionLabel: "Open current route",
    actionHref: "/configurator",
    notes:
      "This is the current in-repo baseline. It is not a reference import, but it belongs in the shortlist because every imported idea has to beat this route in clarity and usability.",
  },
];

const visualReferences = references.filter((reference) => "image" in reference && reference.image);
const secondaryReferences = references.filter(
  (reference) => !("image" in reference && reference.image),
);

export default function PlannerLabPage() {
  return (
    <section className="min-h-screen bg-panel">
      <section className="border-b border-soft bg-hover/70">
        <div className="mx-auto max-w-[1840px] px-4 py-5 md:px-6 2xl:px-8">
          <p className="text-[11px] font-medium text-subtle">Temporary Lab</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-4xl">
              <h1 className="text-lg font-semibold tracking-tight text-strong md:text-xl">
                Planner reference lab
              </h1>
              <p className="mt-1.5 text-sm leading-6 text-body">
                This route is for reference review only. It keeps imported planner material separate
                from the live configurator so we can study patterns without clubbing them into the
                product flow.
              </p>
            </div>
            <Link
              href="/configurator"
              className="inline-flex h-10 items-center rounded-full border border-soft bg-panel px-4 text-sm font-medium text-strong transition hover:border-primary/40"
            >
              Open live configurator
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1840px] px-4 py-6 md:px-6 md:py-8 2xl:px-8">
        <div className="rounded-[1.2rem] border border-soft bg-hover/60 px-4 py-3">
          <p className="text-[11px] font-medium text-subtle">Visual shortlist</p>
          <p className="mt-1 text-sm text-body">
            Only references with usable visual previews belong in the main comparison. Shell-only or
            capability-only references stay below until they have something worth looking at.
          </p>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {visualReferences.map((reference) => (
            <article
              key={reference.title}
              className="rounded-[1.4rem] border border-soft bg-panel p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-medium text-subtle">{reference.badge}</p>
                  <h2 className="mt-1 text-base font-semibold text-strong">{reference.title}</h2>
                  <p className="mt-1 text-[12px] text-muted">{reference.role}</p>
                </div>
                <span className="rounded-full border border-soft px-2.5 py-1 text-[11px] font-medium text-subtle">
                  {reference.status}
                </span>
              </div>
              {reference.image ? (
                <div className="relative mt-4 overflow-hidden rounded-[1rem] border border-soft bg-hover">
                  <Image
                    src={reference.image}
                    alt={reference.title}
                    width={1280}
                    height={720}
                    className="h-auto w-full object-cover"
                  />
                </div>
              ) : null}
              {"imageSecondary" in reference && reference.imageSecondary ? (
                <div className="relative mt-3 overflow-hidden rounded-[1rem] border border-soft bg-hover">
                  <Image
                    src={reference.imageSecondary}
                    alt={`${reference.title} secondary`}
                    width={1280}
                    height={720}
                    className="h-auto w-full object-cover"
                  />
                </div>
              ) : null}
              <div className="mt-4 rounded-[1rem] border border-soft bg-hover px-3 py-2.5">
                <p className="text-[11px] font-medium text-subtle">Local path</p>
                <p className="mt-1 break-all font-mono text-xs text-body">{reference.path}</p>
              </div>
              {"actionHref" in reference && reference.actionHref ? (
                <div className="mt-4">
                  <Link
                    href={reference.actionHref}
                    target={reference.actionHref.startsWith("http") ? "_blank" : undefined}
                    rel={reference.actionHref.startsWith("http") ? "noreferrer" : undefined}
                    className="inline-flex h-10 items-center rounded-full border border-soft bg-panel px-4 text-sm font-medium text-strong transition hover:border-primary/40"
                  >
                    {reference.actionLabel}
                  </Link>
                </div>
              ) : null}
              <p className="mt-4 text-sm leading-6 text-body">{reference.notes}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[1.4rem] border border-soft bg-panel p-4 shadow-sm">
          <p className="text-[11px] font-medium text-subtle">Secondary references</p>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {secondaryReferences.map((reference) => (
              <article
                key={reference.title}
                className="rounded-[1rem] border border-soft bg-hover p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-medium text-subtle">{reference.badge}</p>
                    <h2 className="mt-1 text-base font-semibold text-strong">{reference.title}</h2>
                    <p className="mt-1 text-[12px] text-muted">{reference.role}</p>
                  </div>
                  <span className="rounded-full border border-soft px-2.5 py-1 text-[11px] font-medium text-subtle">
                    {reference.status}
                  </span>
                </div>
                <div className="mt-4 rounded-[1rem] border border-soft bg-panel px-3 py-2.5">
                  <p className="text-[11px] font-medium text-subtle">Local path</p>
                  <p className="mt-1 break-all font-mono text-xs text-body">{reference.path}</p>
                </div>
                {"actionHref" in reference && reference.actionHref ? (
                  <div className="mt-4">
                    <Link
                      href={reference.actionHref}
                      target={reference.actionHref.startsWith("http") ? "_blank" : undefined}
                      rel={reference.actionHref.startsWith("http") ? "noreferrer" : undefined}
                      className="inline-flex h-10 items-center rounded-full border border-soft bg-panel px-4 text-sm font-medium text-strong transition hover:border-primary/40"
                    >
                      {reference.actionLabel}
                    </Link>
                  </div>
                ) : null}
                <p className="mt-4 text-sm leading-6 text-body">{reference.notes}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
