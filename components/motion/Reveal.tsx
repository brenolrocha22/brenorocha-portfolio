"use client";

import type { ReactNode } from "react";
import { m } from "motion/react";
import { REVEAL, staggerDelay } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Position in a group, for the stagger delay. */
  index?: number;
  as?: "div" | "li";
};

/**
 * Block that rises in when it enters the viewport (once). `data-reveal` lets the
 * <noscript> rule in the layout show it without JS; reduced motion skips the movement.
 */
export function Reveal({ children, className, index = 0, as = "div" }: RevealProps) {
  const Component = as === "li" ? m.li : m.div;
  return (
    <Component
      data-reveal=""
      className={className}
      initial={REVEAL.initial}
      whileInView={REVEAL.whileInView}
      viewport={REVEAL.viewport}
      transition={{ ...REVEAL.transition, delay: staggerDelay(index) }}
    >
      {children}
    </Component>
  );
}
