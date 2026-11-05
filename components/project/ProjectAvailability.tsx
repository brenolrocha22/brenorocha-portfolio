import type { ProjectSummary } from "@/lib/content/projects";
import { cn } from "@/lib/utils";

/** Card status (design system §3.4): demo online · code on GitHub · private repository. */
export function ProjectAvailability({
  project,
  className,
}: {
  project: Pick<ProjectSummary, "demoUrl" | "github" | "privateRepo">;
  className?: string;
}) {
  if (project.demoUrl) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-success", className)}>
        <span aria-hidden="true">●</span> Demo online
      </span>
    );
  }
  if (project.privateRepo) {
    return <span className={cn("text-subtle", className)}>Repositório privado</span>;
  }
  if (project.github) {
    return <span className={cn("text-muted-foreground", className)}>Código no GitHub</span>;
  }
  return null;
}
