import { redirect } from "next/navigation";

export default function WorkstationConfiguratorPage() {
  redirect("/configurator?type=workstations");
}
