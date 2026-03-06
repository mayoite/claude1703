import { Hero } from "@/components/home/Hero";
import { Simple2DConfigurator } from "@/components/configurator/Simple2DConfigurator";
import { getBusinessStats } from "@/lib/businessStats";
import { formatKpiValuePlus } from "@/lib/kpiFormat";

export default async function ConfiguratorPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const rawType = Array.isArray(resolvedSearchParams.type)
    ? resolvedSearchParams.type[0]
    : resolvedSearchParams.type;
  const defaultType = rawType === "storages" ? "storages" : "workstations";

  const { stats } = await getBusinessStats();

  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title="Workspace Module Configurator"
        subtitle="Configure workstation or storage modules with room dimensions, screens, modesty panels, raceways, and power/data points, then send a full enquiry."
        showButton={false}
        backgroundImage="/images/catalog/oando-workstations--deskpro/image-1.webp"
      />

      <section className="w-full border-y border-neutral-200 bg-neutral-50 py-12">
        <div className="container px-6 2xl:px-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-neutral-300 bg-white px-5 py-4">
              <p className="text-2xl text-neutral-950">{formatKpiValuePlus(stats.clientOrganisations)}</p>
              <p className="text-sm text-neutral-700">Client organizations served</p>
            </div>
            <div className="rounded-lg border border-neutral-300 bg-white px-5 py-4">
              <p className="text-2xl text-neutral-950">{formatKpiValuePlus(stats.projectsDelivered)}</p>
              <p className="text-sm text-neutral-700">Projects delivered</p>
            </div>
            <div className="rounded-lg border border-neutral-300 bg-white px-5 py-4">
              <p className="text-2xl text-neutral-950">{formatKpiValuePlus(stats.sectorsServed)}</p>
              <p className="text-sm text-neutral-700">Sectors served</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container px-6 py-16 2xl:px-0 md:py-20">
        <Simple2DConfigurator defaultType={defaultType} />
      </section>
    </section>
  );
}
