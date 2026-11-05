import type { ProjectSummary } from "@/lib/content/projects";

/** Verifiable numbers from the frontmatter, each with its source when known. */
export function MetricList({ metrics }: { metrics: ProjectSummary["metrics"] }) {
  if (metrics.length === 0) return null;

  return (
    <section aria-labelledby="numeros" className="mt-10">
      <h2 id="numeros" className="font-mono text-mono-xs text-muted-foreground uppercase">
        Números
      </h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border border-border bg-surface p-4">
            <dt className="text-small text-muted-foreground">{metric.label}</dt>
            <dd className="mt-1 font-mono text-h3 text-data">{metric.value}</dd>
            {metric.source ? (
              <dd className="mt-2 font-mono text-mono-xs text-muted-foreground">Fonte: {metric.source}</dd>
            ) : null}
          </div>
        ))}
      </dl>
    </section>
  );
}
