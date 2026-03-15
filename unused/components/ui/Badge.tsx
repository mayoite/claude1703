import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "outline";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "badge",
        variant === "primary" && "badge-primary",
        variant === "outline" && "badge-outline",
        className,
      )}
    >
      {children}
    </span>
  );
}
