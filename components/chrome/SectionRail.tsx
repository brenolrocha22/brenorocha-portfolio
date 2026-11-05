"use client";

import { m } from "motion/react";
import { useActiveSection } from "@/lib/active-section";
import { SPRING_SOFT } from "@/lib/motion";
import { sections } from "@/lib/site";
import { cn } from "@/lib/utils";
import { SectionLink } from "./SectionLink";

/** Side rail of section dots, only ≥ 1280 px; the active dot becomes a dash, labels on hover/focus. */
export function SectionRail() {
  const active = useActiveSection();

  return (
    <nav aria-label="Seções" className="fixed top-1/2 right-3 z-20 hidden -translate-y-1/2 xl:block">
      <ul className="flex flex-col items-end gap-1">
        {sections.map((section) => {
          const isActive = active === section.id;
          return (
            <li key={section.id}>
              <SectionLink
                section={section.id}
                aria-current={isActive ? "location" : undefined}
                className="group flex h-7 items-center justify-end gap-3 rounded-sm pl-2"
              >
                <span
                  className={cn(
                    "rounded-sm bg-surface px-2 py-0.5 font-mono text-mono-xs text-foreground uppercase opacity-0 transition-[opacity,transform] duration-(--duration-fast) -translate-x-1",
                    "group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
                  )}
                >
                  {section.label}
                </span>
                <span aria-hidden="true" className="relative flex w-4 justify-center">
                  {isActive ? (
                    <m.span layoutId="rail-active" transition={SPRING_SOFT} className="h-5 w-1 rounded-full bg-accent" />
                  ) : (
                    <span className="size-1.5 rounded-full bg-muted-foreground group-hover:bg-foreground" />
                  )}
                </span>
              </SectionLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
