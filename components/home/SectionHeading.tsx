import type { ReactNode } from "react";
import { eyebrowClass } from "@/components/project/styles";

type SectionHeadingProps = {
  id: string;
  eyebrow: string;
  title: string;
  action?: ReactNode;
};

/** Eyebrow + H2 used by every Home section (the H2 id labels the section). */
export function SectionHeading({ id, eyebrow, title, action }: SectionHeadingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className={eyebrowClass}>{eyebrow}</p>
        <h2 id={id} className="mt-3 text-h2 font-semibold text-balance">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
