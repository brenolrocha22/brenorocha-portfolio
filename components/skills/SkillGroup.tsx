import Link from "next/link";
import { ExternalLink } from "@/components/layout/ExternalLink";
import type { SkillGroupView, SkillView } from "@/lib/content/technologies";
import { SkillLevelBadge } from "./SkillLevelBadge";

const evidenceLinkClass =
  "inline-flex min-h-11 items-center text-small font-medium text-accent underline-offset-4 hover:underline md:min-h-0";

function SkillEvidence({ skill }: { skill: SkillView }) {
  if (skill.projects.length === 0 && skill.repos.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-muted-foreground">
      <span>em:</span>
      <ul className="contents">
        {skill.projects.map((project) => (
          <li key={project.slug}>
            <Link href={`/projetos/${project.slug}`} className={evidenceLinkClass}>
              {project.title}
            </Link>
          </li>
        ))}
        {skill.repos.map((repo) => (
          <li key={repo.name}>
            <ExternalLink href={repo.url} className={`${evidenceLinkClass} font-mono`}>
              {repo.name}
            </ExternalLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SkillGroup({ group }: { group: SkillGroupView }) {
  const titleId = `grupo-${group.id}`;
  return (
    <section aria-labelledby={titleId} className="border-t border-border pt-8">
      <h2 id={titleId} className="text-h2 font-semibold">
        {group.title}
      </h2>
      <ul className="mt-6 divide-y divide-border rounded-lg border border-border bg-surface">
        {group.items.map((skill) => (
          <li key={skill.id} id={skill.id} className="flex scroll-mt-24 flex-col gap-2 p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h3 className="text-body font-semibold">
                {skill.name}
                {skill.detail ? (
                  <span className="font-normal text-muted-foreground"> · {skill.detail}</span>
                ) : null}
              </h3>
              <SkillLevelBadge level={skill.level} />
            </div>
            <SkillEvidence skill={skill} />
          </li>
        ))}
      </ul>
    </section>
  );
}
