import type { ReactNode } from "react";
import { pageTitleClass } from "@/components/project/styles";
import { cn } from "@/lib/utils";
import { SectionLabel } from "./SectionLabel";

type PageHeaderProps = {
  eyebrow: string;
  /** Two-digit index shown as "(01)" before the eyebrow (D22). */
  index?: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
};

/** Numbered label + serif H1 + intro shared by the inner pages. */
export function PageHeader({ eyebrow, index, title, intro, children }: PageHeaderProps) {
  return (
    <header>
      <SectionLabel index={index}>{eyebrow}</SectionLabel>
      <h1 className={cn("mt-5 max-w-4xl", pageTitleClass)}>{title}</h1>
      {intro ? <p className="mt-6 max-w-measure text-body-lg text-muted-foreground">{intro}</p> : null}
      {children}
    </header>
  );
}
