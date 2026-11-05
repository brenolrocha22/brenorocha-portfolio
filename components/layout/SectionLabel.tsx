import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionLabelProps = {
  /** Two-digit index, e.g. "01". */
  index?: string;
  children: ReactNode;
  className?: string;
};

/** Numbered mono label "(01) Projetos" (D22). The number is decorative. */
export function SectionLabel({ index, children, className }: SectionLabelProps) {
  return (
    <p className={cn("flex items-baseline gap-3 font-mono text-mono-xs text-muted-foreground uppercase", className)}>
      {index ? (
        <span aria-hidden="true" className="text-accent">
          ({index})
        </span>
      ) : null}
      <span>{children}</span>
    </p>
  );
}
