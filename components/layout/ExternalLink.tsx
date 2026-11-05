import type { ComponentPropsWithoutRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ExternalLinkProps = Omit<ComponentPropsWithoutRef<"a">, "target" | "rel"> & {
  href: string;
  showIcon?: boolean;
};

export function ExternalLink({ className, children, showIcon = true, ...props }: ExternalLinkProps) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    >
      {children}
      {showIcon ? <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" /> : null}
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}
