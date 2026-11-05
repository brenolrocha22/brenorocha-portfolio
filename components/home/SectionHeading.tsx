import type { ReactNode } from "react";
import { SectionLabel } from "@/components/layout/SectionLabel";
import { sectionTitleClass } from "@/components/project/styles";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  id: string;
  /** Two-digit section number, shown as "(01)". */
  index: string;
  eyebrow: string;
  title: string;
  action?: ReactNode;
};

/** Numbered label + serif H2 used by every Home section (the H2 id labels the section). */
export function SectionHeading({ id, index, eyebrow, title, action }: SectionHeadingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6 border-t border-border pt-6">
      <div>
        <SectionLabel index={index}>{eyebrow}</SectionLabel>
        <h2 id={id} className={cn("mt-5 max-w-4xl", sectionTitleClass)}>
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
