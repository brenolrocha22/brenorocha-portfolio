"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 8;

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

const getSnapshot = () => window.scrollY > SCROLL_THRESHOLD;
const getServerSnapshot = () => false;

/**
 * Floating light-blue bar (D22): fixed, inset from the top and sides by --header-inset,
 * dark ink text. Gains a soft shadow after the page scrolls past 8px. `.on-accent`
 * switches the focus outline to navy so it stays visible on the light bar.
 */
export function HeaderFrame({ children }: { children: ReactNode }) {
  const scrolled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <header
      className={cn(
        "on-accent fixed inset-x-(--header-inset) top-(--header-inset) z-40 h-14 rounded-md bg-accent text-accent-ink transition-shadow duration-(--duration-fast)",
        scrolled && "shadow-card",
      )}
    >
      {children}
    </header>
  );
}
