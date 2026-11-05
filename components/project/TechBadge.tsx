import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type TechBadgeProps = {
  children: ReactNode;
  variant?: "default" | "data";
  className?: string;
};

export function TechBadge({ children, variant = "default", className }: TechBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-mono-xs uppercase",
        variant === "data" ? "border-data text-data" : "border-border text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
