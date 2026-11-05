"use client";

import { Children, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, m } from "motion/react";
import { ArrowDown } from "lucide-react";
import { EASE_OUT_EXPO, STAGGER } from "@/lib/motion";

/** Lead, chips and CTAs rise in with a 60 ms stagger (the H1 and role line never animate: LCP). */
export function HeroMotion({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 flex flex-col gap-6">
      {Children.map(children, (child, index) => (
        <m.div
          data-reveal=""
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.08 + index * STAGGER }}
        >
          {child}
        </m.div>
      ))}
    </div>
  );
}

/** Role text with an accent underline drawn once (scaleX 0 → 1). */
export function RoleUnderline({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block">
      {children}
      <m.span
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.3 }}
        className="absolute inset-x-0 -bottom-1 h-0.5 origin-left bg-accent"
      />
    </span>
  );
}

/** "Role para ver os dashboards" hint; disappears after 80 px of scroll. */
export function ScrollHint({ label }: { label: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {hidden ? null : (
        <m.p
          exit={{ opacity: 0 }}
          aria-hidden="true"
          className="hidden items-center justify-center gap-2 font-mono text-mono-xs text-muted-foreground uppercase lg:flex"
        >
          {label}
          <ArrowDown className="size-4" />
        </m.p>
      )}
    </AnimatePresence>
  );
}
