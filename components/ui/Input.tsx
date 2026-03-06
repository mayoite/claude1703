import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "filled";
  error?: boolean;
}

export function Input({
  variant = "default",
  error = false,
  className,
  disabled,
  ...props
}: InputProps) {
  const variantClasses = {
    default: "bg-background border border-input",
    filled: "bg-muted border border-transparent"
  };

  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-none px-3 py-2 text-sm transition-all duration-150 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "placeholder:text-muted-foreground",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-text",
        variantClasses[variant],
        error && "border-destructive focus-visible:ring-destructive",
        className
      )}
      disabled={disabled}
      {...props}
    />
  );
}
