"use client";

import { useEffect, useId, useMemo, useRef, useState, useTransition } from "react";
import { AnimatePresence, m } from "motion/react";
import { Check, SlidersHorizontal, X } from "lucide-react";
import {
  badgeLabels,
  emptyFilters,
  filtersToSearch,
  languageLabels,
  matchesFilters,
  storageLabels,
  typeLabels,
  typeOrder,
  type FilterState,
} from "@/lib/content/project-filters";
import type { Focus } from "@/lib/content/proof";
import { projectBadges, projectLanguages, projectStorages, type ProjectType } from "@/lib/content/schemas";
import type { TechIndex } from "@/lib/content/technologies";
import { EASE_OUT_EXPO, SPRING_LAYOUT, SPRING_SOFT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ProjectCard, type ProjectCardData } from "./ProjectCard";

export const TECH_FILTER_EVENT = "portfolio:tech-filter";
export const PROJECTS_QUERY_KEY = "projects-query";

type ExplorerProject = ProjectCardData & { order: number; orderDev: number };

type ProjectExplorerProps = {
  projects: ExplorerProject[];
  focus: Focus;
  initial: FilterState;
  techIndex: TechIndex;
};

const chipBase =
  "relative inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-sm border px-3 text-small transition-colors duration-(--duration-fast) disabled:cursor-not-allowed disabled:opacity-50 before:absolute before:-inset-y-1 before:inset-x-0 before:content-['']";

function toggle<T>(list: readonly T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

/**
 * #projetos explorer (spec §4.2.4): single-choice type chips + "Mais filtros" (language,
 * storage, badges; OR inside a group, AND between groups), state in the URL via
 * replaceState, and animated enter/exit/reorder of the cards (motion-system §4).
 */
export function ProjectExplorer({ projects, focus, initial, techIndex }: ProjectExplorerProps) {
  const [filters, setFilters] = useState<FilterState>(initial);
  const [panelOpen, setPanelOpen] = useState(initial.lang.length + initial.banco.length + initial.selo.length > 0);
  const [, startTransition] = useTransition();
  const panelId = useId();
  const moreRef = useRef<HTMLButtonElement>(null);
  const [pulse, setPulse] = useState(0);

  const ordered = useMemo(
    () => [...projects].sort((a, b) => (focus === "dev" ? a.orderDev - b.orderDev : a.order - b.order)),
    [projects, focus],
  );

  const techSlugs = filters.tech ? (techIndex[filters.tech]?.slugs ?? []) : null;
  const visible = ordered.filter((project) => matchesFilters(project, filters, techSlugs));
  const isAll = filters === emptyFilters || (!filters.tipo && !filters.tech && filters.lang.length + filters.banco.length + filters.selo.length === 0);
  const extraCount = filters.lang.length + filters.banco.length + filters.selo.length;

  function update(next: FilterState) {
    startTransition(() => setFilters(next));
    const url = `${window.location.pathname}${filtersToSearch(window.location.search, next)}#projetos`;
    window.history.replaceState(window.history.state, "", url);
    try {
      sessionStorage.setItem(PROJECTS_QUERY_KEY, filtersToSearch(window.location.search, next));
    } catch {}
  }

  // Chips from #tecnologias dispatch this event: apply tech=<id> and pulse the results.
  useEffect(() => {
    function onTech(event: Event) {
      const id = (event as CustomEvent<string>).detail;
      if (!techIndex[id]) return;
      update({ ...emptyFilters, tech: id });
      setPulse((value) => value + 1);
    }
    window.addEventListener(TECH_FILTER_EVENT, onTech);
    return () => window.removeEventListener(TECH_FILTER_EVENT, onTech);
  }, [techIndex]);

  /** Count of results for a candidate state (disables options with 0 results instead of hiding them). */
  const countWith = (next: FilterState) => {
    const slugs = next.tech ? (techIndex[next.tech]?.slugs ?? []) : null;
    return ordered.filter((project) => matchesFilters(project, next, slugs)).length;
  };

  const types = typeOrder[focus].filter((type) => projects.some((project) => project.types.includes(type)));
  const groups = [
    { key: "lang" as const, title: "Linguagem", values: projectLanguages, labels: languageLabels },
    { key: "banco" as const, title: "Banco / armazenamento", values: projectStorages, labels: storageLabels },
    { key: "selo" as const, title: "Selos", values: projectBadges, labels: badgeLabels },
  ];

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="Tipo de projeto"
          tabIndex={0}
          className="scroll-fade-x -mx-5 flex gap-2 overflow-x-auto px-5 py-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:[mask-image:none]"
        >
          {[null, ...types].map((type: ProjectType | null) => {
            const active = filters.tipo === type && (type !== null || !filters.tech);
            const count = countWith({ ...filters, tipo: type });
            return (
              <button
                key={type ?? "todos"}
                type="button"
                aria-pressed={active}
                disabled={count === 0}
                onClick={() => update({ ...filters, tipo: type, tech: type === null ? null : filters.tech })}
                className={cn(
                  chipBase,
                  active ? "border-accent text-accent-ink" : "border-border-strong bg-veil text-foreground hover:border-accent",
                )}
              >
                {active ? (
                  <m.span
                    layoutId="type-chip-active"
                    transition={SPRING_SOFT}
                    aria-hidden="true"
                    className="absolute inset-0 -z-0 rounded-sm bg-accent"
                  />
                ) : null}
                <span className="relative">{type ? typeLabels[type] : "Todos"}</span>
                <span className="relative font-mono text-mono-xs tabular-nums">({count})</span>
              </button>
            );
          })}
        </div>

        <button
          ref={moreRef}
          type="button"
          aria-expanded={panelOpen}
          aria-controls={panelId}
          onClick={() => setPanelOpen((open) => !open)}
          className={cn(chipBase, "self-start border-border-strong bg-veil text-foreground hover:border-accent")}
        >
          <SlidersHorizontal aria-hidden="true" className="size-4" />
          Mais filtros{extraCount > 0 ? ` (${extraCount})` : ""}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {panelOpen ? (
          <m.div
            id={panelId}
            key="panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
            className="overflow-hidden"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setPanelOpen(false);
                moreRef.current?.focus();
              }
            }}
          >
            <div className="mt-4 grid gap-5 rounded-lg border border-border bg-veil p-4 md:grid-cols-3">
              {groups.map((group) => (
                <div key={group.key} role="group" aria-labelledby={`${panelId}-${group.key}`}>
                  <p id={`${panelId}-${group.key}`} className="font-mono text-mono-xs text-muted-foreground uppercase">
                    {group.title}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.values.map((value) => {
                      const selected = (filters[group.key] as readonly string[]).includes(value);
                      const next = { ...filters, [group.key]: toggle(filters[group.key] as string[], value) } as FilterState;
                      const count = selected ? visible.length : countWith(next);
                      return (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={selected}
                          disabled={!selected && count === 0}
                          onClick={() => update(next)}
                          className={cn(
                            chipBase,
                            selected ? "border-accent text-foreground" : "border-border-strong text-foreground hover:border-accent",
                          )}
                        >
                          <AnimatePresence initial={false}>
                            {selected ? (
                              <m.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.12 }}>
                                <Check aria-hidden="true" className="size-3.5 text-accent" />
                              </m.span>
                            ) : null}
                          </AnimatePresence>
                          {(group.labels as Record<string, string>)[value]}
                          <span className="font-mono text-mono-xs tabular-nums">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>

      {filters.tech && techIndex[filters.tech] ? (
        <p className="mt-4 flex flex-wrap items-center gap-2 text-small text-muted-foreground">
          Projetos com <strong className="text-foreground">{techIndex[filters.tech]?.name}</strong>
          <button
            type="button"
            onClick={() => update({ ...filters, tech: null })}
            className="inline-flex min-h-9 items-center gap-1 rounded-sm px-2 text-accent hover:underline"
          >
            <X aria-hidden="true" className="size-3.5" />
            limpar
          </button>
        </p>
      ) : null}

      <p role="status" aria-live="polite" className="mt-6 font-mono text-mono-xs text-muted-foreground uppercase">
        Mostrando {visible.length} de {projects.length} projetos
      </p>

      {visible.length === 0 ? (
        <div className="mt-6 rounded-lg border border-border bg-veil p-6 text-center">
          <p>Nenhum projeto com essa combinação.</p>
          <button
            type="button"
            onClick={() => update(emptyFilters)}
            className="mt-3 inline-flex min-h-11 items-center rounded-sm border border-border-strong px-4 text-small hover:border-accent"
          >
            Limpar filtros
          </button>
        </div>
      ) : null}

      <m.ul layout className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project, index) => {
            const large = isAll && index < 2;
            return (
              <m.li
                key={project.slug}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.32, ease: EASE_OUT_EXPO, delay: Math.min(index, 7) * 0.03 },
                }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18, ease: "easeIn" } }}
                transition={{ layout: SPRING_LAYOUT }}
                className={cn(
                  "[perspective:900px]",
                  large ? "lg:col-span-3" : "lg:col-span-2",
                  pulse > 0 && filters.tech && "rounded-lg",
                )}
              >
                <div key={pulse} className={cn("h-full rounded-lg", pulse > 0 && filters.tech && "animate-[tech-pulse_900ms_ease-out]")}>
                  <ProjectCard project={project} large={large} />
                </div>
              </m.li>
            );
          })}
        </AnimatePresence>
      </m.ul>
    </div>
  );
}
