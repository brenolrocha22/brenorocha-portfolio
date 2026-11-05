"use client";

import { useState } from "react";
import { categoryLabels, categoryOrder, projectCategoriesOf } from "@/lib/content/categories";
import type { ProjectCategory } from "@/lib/content/schemas";
import type { ProjectSummary } from "@/lib/content/projects";
import { cn } from "@/lib/utils";
import { ProjectGrid } from "./ProjectGrid";

type Filter = ProjectCategory | "todos";

export function ProjectFilter({ projects }: { projects: ProjectSummary[] }) {
  const [active, setActive] = useState<Filter>("todos");

  // Only areas that actually have projects become filter options.
  const available = categoryOrder.filter((category) =>
    projects.some((project) => projectCategoriesOf(project).includes(category)),
  );
  const options: { value: Filter; label: string }[] = [
    { value: "todos", label: "Todos" },
    ...available.map((category) => ({ value: category, label: categoryLabels[category] })),
  ];

  const visible =
    active === "todos"
      ? projects
      : projects.filter((project) => projectCategoriesOf(project).includes(active));

  return (
    <div className="mt-10">
      <div
        role="group"
        aria-label="Filtrar projetos por área"
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:px-0"
      >
        {options.map((option) => {
          const pressed = option.value === active;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={pressed}
              onClick={() => setActive(option.value)}
              className={cn(
                "inline-flex h-11 shrink-0 items-center rounded-md border px-4 text-small transition-colors duration-(--duration-fast)",
                pressed
                  ? "border-accent bg-accent text-accent-ink"
                  : "border-border-strong text-muted-foreground hover:bg-surface-2 hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mt-4 font-mono text-mono-xs text-muted-foreground uppercase">
        {visible.length} {visible.length === 1 ? "projeto" : "projetos"}
      </p>

      <ProjectGrid projects={visible} className="mt-6" />
    </div>
  );
}
