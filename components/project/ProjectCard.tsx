import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ExternalLink } from "@/components/layout/ExternalLink";
import { categoryLabels, projectCategoriesOf } from "@/lib/content/categories";
import { githubRepoUrl } from "@/lib/content/project-links";
import type { ProjectSummary } from "@/lib/content/projects";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "./CategoryIcon";
import { ProjectAvailability } from "./ProjectAvailability";
import { TechBadge } from "./TechBadge";

const MAX_BADGES = 3;

type ProjectCardProps = {
  project: ProjectSummary;
  className?: string;
  headingLevel?: "h2" | "h3";
};

export function ProjectCard({ project, className, headingLevel = "h2" }: ProjectCardProps) {
  const Heading = headingLevel;
  const href = `/projetos/${project.slug}`;
  const shownStack = project.stack.slice(0, MAX_BADGES);
  const hiddenCount = project.stack.length - shownStack.length;
  // "985 vendas · números via SQL" → proof number + mono caption (design-refresh P1.9).
  const [proof, ...proofRest] = project.highlight?.split(" · ") ?? [];
  const proofCaption = proofRest.join(" · ");

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-[border-color,background-color,box-shadow] duration-(--duration-fast) hover:border-accent/40 hover:bg-surface-2 hover:shadow-glow-sm",
        className,
      )}
    >
      <div className="relative aspect-video overflow-hidden border-b border-border bg-surface-2">
        {project.cover ? (
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-subtle">
            <CategoryIcon category={project.category} className="size-8" />
            <span className="font-mono text-mono-xs">{project.github?.repo ?? project.slug}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-1 flex-wrap items-center justify-between gap-2 font-mono text-mono-xs uppercase">
            <span className="text-muted-foreground">
              {projectCategoriesOf(project)
                .map((category) => categoryLabels[category])
                .join(" · ")}
            </span>
            <ProjectAvailability project={project} />
          </div>
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground transition-colors duration-(--duration-fast) group-hover:text-accent"
          />
        </div>

        <Heading className="text-h3 font-semibold">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-lg focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
          >
            {project.title}
          </Link>
        </Heading>

        {proof ? (
          <p className="flex flex-col gap-0.5 font-mono">
            <span className="text-h3 font-medium text-foreground">{proof}</span>
            {proofCaption ? (
              <span className="text-mono-xs text-muted-foreground uppercase">{proofCaption}</span>
            ) : null}
          </p>
        ) : null}

        <p className="line-clamp-2 text-small text-muted-foreground">{project.summary}</p>

        <ul className="flex flex-wrap gap-2" aria-label="Tecnologias principais">
          {shownStack.map((tech) => (
            <li key={tech}>
              <TechBadge>{tech}</TechBadge>
            </li>
          ))}
          {hiddenCount > 0 ? (
            <li>
              <TechBadge>
                +{hiddenCount}
                <span className="sr-only"> tecnologias</span>
              </TechBadge>
            </li>
          ) : null}
        </ul>

        {project.github ? (
          <div className="mt-auto flex justify-end pt-2">
            <ExternalLink
              href={githubRepoUrl(project.github)}
              className="relative z-10 min-h-11 text-small text-muted-foreground transition-colors duration-(--duration-fast) hover:text-foreground"
            >
              GitHub<span className="sr-only">: {project.title}</span>
            </ExternalLink>
          </div>
        ) : null}
      </div>
    </article>
  );
}
