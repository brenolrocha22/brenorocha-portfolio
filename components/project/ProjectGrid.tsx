import type { ProjectSummary } from "@/lib/content/projects";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";

/**
 * Grid without gaps (design system §3.4): 3 columns on desktop; when the last row
 * is incomplete its cards stretch (5 cards → 3 + 2). 2 columns on tablet.
 */
function spanClass(index: number, total: number): string {
  const remainder = total % 3;
  const lastRowStart = total - remainder;
  const classes: string[] = ["lg:col-span-2"];
  if (remainder === 2 && index >= lastRowStart) classes[0] = "lg:col-span-3";
  if (remainder === 1 && index === total - 1) classes[0] = "lg:col-span-6";
  if (total % 2 === 1 && index === total - 1) classes.push("md:col-span-2");
  return classes.join(" ");
}

export function ProjectGrid({
  projects,
  headingLevel,
  className,
}: {
  projects: ProjectSummary[];
  headingLevel?: "h2" | "h3";
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-6", className)}>
      {projects.map((project, index) => (
        <li key={project.slug} className={cn("flex", spanClass(index, projects.length))}>
          <ProjectCard project={project} headingLevel={headingLevel} className="w-full" />
        </li>
      ))}
    </ul>
  );
}
