import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeaderProps) {
  const isCentered = align === "center";

  return (
    <div className={cn(isCentered && "text-center", className)}>
      {eyebrow && (
        <p className="typ-eyebrow mb-3">{eyebrow}</p>
      )}
      <h2 className="typ-h2 text-neutral-900 md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed text-neutral-500 max-w-2xl",
            isCentered && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
