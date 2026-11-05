import Link from "next/link";
import type { ProjectRef } from "@/lib/content/project-refs";
import { cn } from "@/lib/utils";

type ProjectLinksProps = {
  projects: readonly ProjectRef[];
  /** Visible label before the links (e.g. "em:" or "Prova:"). */
  label: string;
  className?: string;
};

/** Inline list of links to case studies, used as evidence on skills and solutions. */
export function ProjectLinks({ projects, label, className }: ProjectLinksProps) {
  if (projects.length === 0) return null;
  return (
    <p className={cn("text-small text-muted-foreground", className)}>
      <span>{label} </span>
      {projects.map((project, index) => (
        <span key={project.slug}>
          {index > 0 ? ", " : null}
          <Link
            href={`/projetos/${project.slug}`}
            className="inline-flex min-h-11 items-center font-medium text-accent underline-offset-4 hover:underline sm:min-h-0"
          >
            {project.title}
          </Link>
        </span>
      ))}
    </p>
  );
}
