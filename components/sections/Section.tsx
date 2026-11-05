import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { SectionLabel } from "@/components/layout/SectionLabel";
import { Reveal } from "@/components/motion/Reveal";
import { sectionTitleClass } from "@/components/project/styles";
import { sections, type SectionId } from "@/lib/site";
import { cn } from "@/lib/utils";

type SectionProps = {
  id: Exclude<SectionId, "inicio">;
  copy: { label: string; title: string; subtitle?: string };
  children: ReactNode;
  /** Extra content beside the title (e.g. totals). */
  aside?: ReactNode;
  className?: string;
};

/** One-page section: numbered label "(01) Dados", conclusion title (H2, focus target) and subtitle. */
export function Section({ id, copy, children, aside, className }: SectionProps) {
  const index = sections.find((section) => section.id === id)?.index;
  const titleId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={titleId} className={cn("scroll-mt-(--header-height) py-20 lg:py-28", className)}>
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-6 border-t border-border pt-6">
          <div>
            <SectionLabel index={index}>{copy.label}</SectionLabel>
            <h2 id={titleId} tabIndex={-1} className={cn("mt-5 max-w-4xl focus:outline-none", sectionTitleClass)}>
              {copy.title}
            </h2>
            {copy.subtitle ? (
              <p className="mt-4 max-w-measure text-body-lg text-muted-foreground">{copy.subtitle}</p>
            ) : null}
          </div>
          {aside}
        </Reveal>
        <div className="mt-12">{children}</div>
      </Container>
    </section>
  );
}
