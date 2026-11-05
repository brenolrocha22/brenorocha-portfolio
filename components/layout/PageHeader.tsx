import type { ReactNode } from "react";
import { eyebrowClass } from "@/components/project/styles";

type PageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
};

/** Eyebrow + H1 + intro shared by the inner pages. */
export function PageHeader({ eyebrow, title, intro, children }: PageHeaderProps) {
  return (
    <header>
      <p className={eyebrowClass}>{eyebrow}</p>
      <h1 className="mt-3 max-w-3xl text-h1 font-semibold text-balance">{title}</h1>
      {intro ? <p className="mt-4 max-w-measure text-body-lg text-muted-foreground">{intro}</p> : null}
      {children}
    </header>
  );
}
