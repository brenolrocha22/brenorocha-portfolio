import type { ReactNode } from "react";
import { ExternalLink } from "@/components/layout/ExternalLink";
import { githubRepoUrl } from "@/lib/content/project-links";
import type { ProjectSummary } from "@/lib/content/projects";
import { ProjectAvailability } from "./ProjectAvailability";
import { TechBadge } from "./TechBadge";

const statusLabels = {
  concluido: "Concluído",
  "em-evolucao": "Em evolução",
  prototipo: "Protótipo",
} as const;

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
      <dt className="font-mono text-mono-xs text-muted-foreground uppercase">{label}</dt>
      <dd className="text-small">{children}</dd>
    </div>
  );
}

type ProjectFactsProps = {
  project: ProjectSummary;
  /** Dynamic GitHub badges (<GithubStats />). Renders nothing when absent or when the API fails. */
  githubStats?: ReactNode;
};

/** "Ficha técnica" (design system §3.12): only fields present in the content are shown. */
export function ProjectFacts({ project, githubStats }: ProjectFactsProps) {
  return (
    <section aria-labelledby="ficha-tecnica" className="rounded-lg border border-border bg-surface px-5 py-2">
      <h2 id="ficha-tecnica" className="sr-only">
        Ficha técnica
      </h2>
      <dl className="divide-y divide-border">
        <Row label="Disponível">
          <ProjectAvailability project={project} />
        </Row>
        {project.status ? <Row label="Status">{statusLabels[project.status]}</Row> : null}
        {project.tests ? <Row label="Testes">{project.tests}</Row> : null}
        <Row label="Stack">
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li key={tech}>
                <TechBadge>{tech}</TechBadge>
              </li>
            ))}
          </ul>
        </Row>
        {project.github ? (
          <Row label="GitHub">
            <ExternalLink
              href={githubRepoUrl(project.github)}
              className="min-h-11 font-mono text-accent underline-offset-4 hover:underline sm:min-h-0"
            >
              {project.github.owner}/{project.github.repo}
            </ExternalLink>
          </Row>
        ) : null}
        {project.demoUrl ? (
          <Row label="Demo">
            <ExternalLink
              href={project.demoUrl}
              className="min-h-11 break-all text-accent underline-offset-4 hover:underline sm:min-h-0"
            >
              {project.demoUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </ExternalLink>
          </Row>
        ) : null}
      </dl>
      {githubStats}
    </section>
  );
}
