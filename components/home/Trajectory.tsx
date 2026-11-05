import { Container } from "@/components/layout/Container";
import type { HomeContent } from "@/lib/content/home";
import { SectionHeading } from "./SectionHeading";

/** Summary timeline: vertical on mobile, horizontal from md up. */
export function Trajectory({ content, index }: { content: HomeContent["trajectory"]; index: string }) {
  return (
    <section aria-labelledby="trajetoria-title">
      <Container className="py-20 lg:py-32">
        <SectionHeading id="trajetoria-title" index={index} eyebrow={content.eyebrow} title={content.title} />
        <ol className="mt-10 grid gap-8 border-l border-border-strong pl-6 md:grid-cols-3 md:gap-6 md:border-t md:border-l-0 md:pt-8 md:pl-0">
          {content.milestones.map((milestone) => (
            <li key={milestone.title} className="relative">
              <span
                aria-hidden="true"
                className="absolute top-1.5 -left-[29px] size-2.5 rounded-full bg-accent md:-top-[37px] md:left-0"
              />
              <h3 className="font-serif text-h1 leading-tight font-normal">{milestone.title}</h3>
              <p className="mt-2 max-w-measure text-small text-muted-foreground">{milestone.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
