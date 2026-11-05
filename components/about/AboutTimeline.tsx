import type { AboutContent } from "@/lib/content/about";

/** Undated timeline (dates not confirmed): vertical on mobile, horizontal from md up. */
export function AboutTimeline({ content }: { content: AboutContent["timeline"] }) {
  return (
    <section aria-labelledby="linha-do-tempo-title">
      <h2 id="linha-do-tempo-title" className="text-h2 font-semibold">
        {content.title}
      </h2>
      <ol className="mt-10 grid gap-8 border-l border-border-strong pl-6 md:grid-cols-4 md:gap-6 md:border-t md:border-l-0 md:pt-8 md:pl-0">
        {content.milestones.map((milestone) => (
          <li key={milestone.title} className="relative">
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-[29px] size-2.5 rounded-full bg-accent md:-top-[37px] md:left-0"
            />
            <h3 className="text-h3 font-semibold">{milestone.title}</h3>
            <p className="mt-2 text-small text-muted-foreground">{milestone.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
