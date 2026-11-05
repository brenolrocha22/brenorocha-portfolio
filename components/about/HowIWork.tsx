import type { AboutContent } from "@/lib/content/about";

export function HowIWork({ content }: { content: AboutContent["howIWork"] }) {
  return (
    <aside aria-labelledby="como-trabalho-title" className="rounded-lg border border-border bg-surface p-6">
      <h2 id="como-trabalho-title" className="font-mono text-mono-xs text-muted-foreground uppercase">
        {content.title}
      </h2>
      <ol className="mt-4 flex flex-col gap-4">
        {content.steps.map((step, index) => (
          <li key={step.title} className="flex gap-3">
            <span aria-hidden="true" className="pt-1 font-mono text-mono-xs text-accent">
              {index + 1}
            </span>
            <div>
              <h3 className="text-body font-semibold">{step.title}</h3>
              <p className="text-small text-muted-foreground">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
