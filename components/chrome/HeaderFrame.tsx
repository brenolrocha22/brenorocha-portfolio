"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const SHRINK_AFTER = 120;
const MIN_DELTA = 8;

/**
 * Floating light-blue bar (D22). Scrolling down past 120 px shrinks it from 56 to 48 px
 * (height transition, the bar is fixed so there is no layout shift); scrolling up restores it.
 * It never hides: contact stays one click away.
 */
export function HeaderFrame({ children }: { children: ReactNode }) {
  const [compact, setCompact] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > MIN_DELTA);
      if (Math.abs(y - last) < MIN_DELTA) return;
      setCompact(y > SHRINK_AFTER && y > last);
      last = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "on-accent fixed inset-x-(--header-inset) top-(--header-inset) z-40 rounded-md bg-accent text-accent-ink transition-[height,box-shadow] duration-(--duration-base) ease-brand",
        compact ? "h-12" : "h-14",
        scrolled && "shadow-card",
      )}
    >
      {children}
    </header>
  );
}
