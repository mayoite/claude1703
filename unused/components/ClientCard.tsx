"use client";
import { SafeImage } from "@/components/SafeImage";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export interface ProjectClient {
  id?: string;
  client_name: string;
  city: string;
  sector: string;
  description: string;
  image: string;
}

export function ClientCard({ client }: { client: ProjectClient }) {
  const ref = useScrollAnimation();
  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative w-24 h-16">
        <SafeImage
          src={client.image}
          alt={client.client_name}
          fill
          className="object-contain"
          sizes="96px"
        />
      </div>
      <p className="font-semibold text-stone-800">{client.client_name}</p>
      <p className="text-xs text-stone-400 uppercase tracking-wide">
        {client.city} · {client.sector}
      </p>
      <p className="text-sm text-stone-600 text-center">{client.description}</p>
    </div>
  );
}
