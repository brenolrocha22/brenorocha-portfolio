import { skillLevelMeta } from "@/lib/content/technologies";
import type { SkillLevel } from "@/lib/content/schemas";
import { SkillLevelBadge } from "./SkillLevelBadge";

export function SkillLegend({ levels }: { levels: readonly SkillLevel[] }) {
  return (
    <section aria-labelledby="legenda-title" className="rounded-lg border border-border bg-surface p-5">
      <h2 id="legenda-title" className="font-mono text-mono-xs text-muted-foreground uppercase">
        Legenda
      </h2>
      <dl className="mt-3 grid gap-3 md:grid-cols-3">
        {levels.map((level) => (
          <div key={level} className="flex flex-col gap-1">
            <dt>
              <SkillLevelBadge level={level} />
            </dt>
            <dd className="text-small text-muted-foreground">{skillLevelMeta[level].description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
