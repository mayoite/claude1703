"use client";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface FounderProps {
  name: string;
  title: string;
  bio: string;
  image: string;
}

export function FounderCard({ name, title, bio, image }: FounderProps) {
  const ref = useScrollAnimation();
  return (
    <div
      ref={ref}
      className="bg-white shadow-md rounded-xl p-6 flex flex-col gap-4"
    >
      <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto">
        <Image
          src={image}
          alt={name}
          fill
          sizes="128px"
          className="object-cover"
        />
      </div>
      <h3 className="text-xl text-center">{name}</h3>
      <p className="text-sm text-stone-500 text-center uppercase tracking-wide">
        {title}
      </p>
      <p className="text-stone-700 text-sm leading-relaxed">{bio}</p>
    </div>
  );
}
