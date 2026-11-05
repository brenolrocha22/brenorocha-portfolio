"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "motion/react";
import type { AboutContent } from "@/lib/content/about";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Item = AboutContent["timeline"][number];

const trackLabel: Record<Item["track"], string> = {
  trabalho: "Trabalho",
  estudo: "Estudo",
  projetos: "Projetos",
};

/**
 * Two-track timeline (spec §4.3): work on the left, study on the right (mobile: spine on the
 * left, items tagged). The spine fills with scroll; each card rises in from its own side.
 */
export function DualTimeline({ items }: { items: Item[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 50%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <ol ref={ref} className="relative grid gap-6 overflow-x-clip pl-8 lg:pl-0">
      <span aria-hidden="true" className="absolute top-0 bottom-0 left-2.5 w-px bg-border lg:left-1/2" />
      <m.span
        aria-hidden="true"
        style={{ scaleY: fill }}
        className="absolute top-0 bottom-0 left-2.5 w-px origin-top bg-gradient-to-b from-accent to-data lg:left-1/2"
      />
      {items.map((item, index) => {
        const left = item.track === "trabalho";
        return (
          <li key={`${item.period}-${index}`} className="relative lg:grid lg:grid-cols-2 lg:gap-12">
            <m.span
              aria-hidden="true"
              initial={{ scale: 0.6 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -30% 0px" }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              className={cn(
                "absolute top-5 -left-[1.6875rem] size-3 rounded-full border-2 border-background lg:left-1/2 lg:-translate-x-1/2",
                item.highlight ? "bg-accent shadow-glow-md" : item.track === "projetos" ? "bg-accent" : "bg-data",
              )}
            />
            <m.div
              data-reveal=""
              initial={{ opacity: 0, x: left ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              className={cn(
                "rounded-lg border bg-veil p-4",
                left ? "lg:col-start-1 lg:text-right" : "lg:col-start-2",
                item.highlight || item.track === "projetos" ? "border-accent-line" : "border-border",
              )}
            >
              <p className={cn("flex flex-wrap items-center gap-2 font-mono text-mono-xs uppercase", left && "lg:justify-end")}>
                <span className="text-foreground">{item.period}</span>
                <span className={cn("rounded-sm px-1.5 py-0.5", left ? "bg-surface-2 text-muted-foreground" : "bg-surface-2 text-data")}>
                  {trackLabel[item.track]}
                </span>
                {item.highlight ? <span className="text-accent">início do estudo</span> : null}
              </p>
              <p className="mt-2 text-small text-muted-foreground">{item.text}</p>
            </m.div>
          </li>
        );
      })}
    </ol>
  );
}
