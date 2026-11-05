"use client";

import { useState } from "react";
import { AnimatePresence, m, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUp } from "lucide-react";

/**
 * Back to top with a reading-progress ring. Appears after 1.5 viewports; sits above the
 * contact button (same right edge, 12 px gap) so the two never overlap.
 */
export function BackToTop() {
  const { scrollY, scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > window.innerHeight * 1.5));

  function toTop() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    document.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
  }

  return (
    <AnimatePresence>
      {visible ? (
        <m.button
          type="button"
          onClick={toTop}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.18 }}
          className="fixed right-[1.375rem] bottom-[calc(1rem+3.5rem+0.75rem+env(safe-area-inset-bottom))] z-30 inline-flex size-11 items-center justify-center rounded-full border border-border-strong bg-surface text-foreground shadow-card transition-colors duration-(--duration-fast) hover:text-accent"
        >
          <svg aria-hidden="true" viewBox="0 0 44 44" className="absolute inset-0 size-11 -rotate-90">
            <m.circle
              cx="22"
              cy="22"
              r="19"
              fill="none"
              strokeWidth="2"
              className="stroke-accent"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
          <ArrowUp aria-hidden="true" className="size-4" />
          <span className="sr-only">Voltar ao topo</span>
        </m.button>
      ) : null}
    </AnimatePresence>
  );
}
