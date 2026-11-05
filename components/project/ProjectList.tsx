import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categoryLabels, projectCategoriesOf } from "@/lib/content/categories";
import type { ProjectSummary } from "@/lib/content/projects";
import { cn } from "@/lib/utils";
import { ProjectAvailability } from "./ProjectAvailability";

type ProjectListProps = {
  projects: ProjectSummary[];
  headingLevel?: "h2" | "h3";
  className?: string;
};

/** "rag-dio" → "RAG-DIO" for the mono metadata line. */
function toMeta(slug: string): string {
  return slug.toUpperCase().replace(/\s+/g, "_");
}

/**
 * Numbered project list (D22): big index, mono metadata "PROJETO_01 // RAG-DIO",
 * serif title, proof number and an arrow, separated by hairlines. The whole row is
 * clickable through the title link's ::after.
 */
export function ProjectList({ projects, headingLevel = "h2", className }: ProjectListProps) {
  const Heading = headingLevel;

  return (
    <ol className={cn("border-b border-border", className)}>
      {projects.map((project, index) => {
        const number = String(index + 1).padStart(2, "0");
        // "985 vendas · números via SQL" → proof number + mono caption.
        const [proof, ...proofRest] = project.highlight?.split(" · ") ?? [];
        const proofCaption = proofRest.join(" · ");
        const categories = projectCategoriesOf(project)
          .map((category) => categoryLabels[category])
          .join(" · ");

        return (
          <li
            key={project.slug}
            className="group relative grid grid-cols-[2.75rem_1fr_auto] gap-x-4 gap-y-3 border-t border-border py-7 transition-colors duration-(--duration-fast) hover:bg-surface md:grid-cols-[5rem_1fr_14rem_auto] md:gap-x-8 md:px-2 lg:py-9"
          >
            <span
              aria-hidden="true"
              className="font-serif text-h1 leading-none text-subtle transition-colors duration-(--duration-fast) group-hover:text-accent md:text-title"
            >
              {number}
            </span>

            <div className="min-w-0">
              <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-mono-xs text-muted-foreground uppercase">
                <span>
                  PROJETO_{number} {"//"} {toMeta(project.slug)}
                </span>
                <span className="text-subtle">{categories}</span>
              </p>
              <Heading className="mt-2 font-serif text-h1 leading-tight font-normal text-balance">
                <Link
                  href={`/projetos/${project.slug}`}
                  className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
                >
                  {project.title}
                </Link>
              </Heading>
              <p className="mt-2 line-clamp-2 max-w-measure text-small text-muted-foreground">{project.summary}</p>
              <ProjectAvailability project={project} className="mt-3 inline-flex font-mono text-mono-xs uppercase" />
            </div>

            {proof ? (
              <p className="col-start-2 flex flex-col gap-0.5 md:col-start-3 md:row-start-1 md:self-center">
                <span className="font-serif text-h2 leading-none text-foreground">{proof}</span>
                {proofCaption ? (
                  <span className="font-mono text-mono-xs text-muted-foreground uppercase">{proofCaption}</span>
                ) : null}
              </p>
            ) : null}

            <ArrowUpRight
              aria-hidden="true"
              className="col-start-3 row-start-1 size-6 text-muted-foreground transition-colors duration-(--duration-fast) group-hover:text-accent md:col-start-4 md:self-center"
            />
          </li>
        );
      })}
    </ol>
  );
}
