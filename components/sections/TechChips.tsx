"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { m } from "motion/react";
import { ChevronDown } from "lucide-react";
import { TECH_FILTER_EVENT } from "@/components/project/ProjectExplorer";
import { goToSection } from "@/lib/active-section";
import type { SkillLevel } from "@/lib/content/schemas";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Chip = { id: string; name: string; detail?: string; level: SkillLevel; proven: boolean };
type Group = { id: string; title: string; items: Chip[] };
type LevelMeta = Record<SkillLevel, { label: string; marker: string; className: string }>;

type TechChipsProps = { groups: Group[]; levels: LevelMeta; focusQuery: string };

/**
 * #tecnologias (spec §4.5): groups of chips with a level marker. A chip with proof filters
 * #projetos by that technology (link works without JS: /?tech=<id>#projetos). Mobile: accordion.
 */
export function TechChips({ groups, levels, focusQuery }: TechChipsProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // Desktop: every group open (the accordion is only a mobile convenience).
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const apply = () => {
      if (!media.matches) return;
      listRef.current?.querySelectorAll("details").forEach((details) => (details.open = true));
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  function onChip(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (window.location.pathname !== "/") return;
    event.preventDefault();
    window.dispatchEvent(new CustomEvent(TECH_FILTER_EVENT, { detail: id }));
    goToSection("projetos");
  }

  return (
    <div>
      <ul aria-label="Legenda dos níveis" className="flex flex-wrap gap-x-5 gap-y-2 text-small text-muted-foreground">
        {(Object.keys(levels) as SkillLevel[]).map((level) => (
          <li key={level} className="inline-flex items-center gap-2">
            <span aria-hidden="true" className={levels[level].className}>
              {levels[level].marker}
            </span>
            {levels[level].label}
          </li>
        ))}
      </ul>

      <div ref={listRef} className="mt-8 grid gap-4 lg:grid-cols-2">
        {groups.map((group, groupIndex) => (
          <details
            key={group.id}
            open={groupIndex === 0}
            className={cn(
              "group rounded-lg border border-border bg-veil",
              group.id === "negocio" && "lg:col-span-2 opacity-90",
            )}
          >
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 px-5 font-medium lg:pointer-events-none">
              {group.title}
              <ChevronDown
                aria-hidden="true"
                className="size-4 transition-transform duration-(--duration-fast) group-open:rotate-180 lg:hidden"
              />
            </summary>
            <ul className="flex flex-wrap gap-2 px-5 pb-5">
              {group.items.map((item, index) => {
                const meta = levels[item.level];
                const content = (
                  <>
                    <span aria-hidden="true" className={meta.className}>
                      {meta.marker}
                    </span>
                    {item.name}
                    {item.detail ? <span className="text-muted-foreground"> · {item.detail}</span> : null}
                    <span className="sr-only"> ({meta.label})</span>
                  </>
                );
                return (
                  <m.li
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, ease: EASE_OUT_EXPO, delay: Math.min(index, 11) * 0.02 }}
                    data-reveal=""
                  >
                    {item.proven ? (
                      <a
                        id={`tech-${item.id}`}
                        href={`/${focusQuery ? `${focusQuery}&` : "?"}tech=${item.id}#projetos`}
                        onClick={(event) => onChip(event, item.id)}
                        title="Ver projetos com esta ferramenta"
                        className="inline-flex min-h-9 scroll-mt-32 items-center gap-1.5 rounded-sm border border-border-strong bg-surface px-3 text-small text-foreground transition-[border-color,color,scale] duration-(--duration-fast) hover:border-accent hover:text-accent active:scale-95"
                      >
                        {content}
                      </a>
                    ) : (
                      <span
                        id={`tech-${item.id}`}
                        className="inline-flex min-h-9 scroll-mt-32 items-center gap-1.5 rounded-sm border border-border bg-surface px-3 text-small text-foreground"
                      >
                        {content}
                      </span>
                    )}
                  </m.li>
                );
              })}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
}
