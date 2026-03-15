import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  wide?: boolean;
  className?: string;
}

export function Container({ children, wide = false, className }: ContainerProps) {
  return (
    <div className={cn(wide ? "container-wide" : "container", "px-6 2xl:px-0", className)}>
      {children}
    </div>
  );
}
