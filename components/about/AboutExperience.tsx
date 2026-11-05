import type { AboutContent } from "@/lib/content/about";

/** Work history with company, role and period as stated in the résumé (design system: list, mono meta). */
export function AboutExperience({ content }: { content: AboutContent["experience"] }) {
  return (
    <section aria-labelledby="experiencia-title">
      <h2 id="experiencia-title" className="text-h2 font-semibold">
        {content.title}
      </h2>
      <ol className="mt-8 divide-y divide-border border-y border-border">
        {content.items.map((item) => (
          <li key={`${item.company}-${item.period}`} className="grid gap-2 py-6 md:grid-cols-12 md:gap-6">
            <p className="font-mono text-mono-xs text-muted-foreground uppercase md:col-span-3">
              {item.period}
              <span className="block normal-case">{item.place}</span>
            </p>
            <div className="md:col-span-9">
              <h3 className="text-h3 font-semibold">
                {item.role} <span className="text-muted-foreground">· {item.company}</span>
              </h3>
              <p className="mt-2 max-w-measure text-small text-muted-foreground">{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
      {content.earlier ? <p className="mt-4 max-w-measure text-small text-muted-foreground">{content.earlier}</p> : null}
    </section>
  );
}
