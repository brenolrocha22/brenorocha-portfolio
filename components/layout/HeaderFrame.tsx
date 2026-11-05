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

/** Fixed header shell; shows the bottom border after the page scrolls past 8px. */
export function HeaderFrame({ children }: { children: ReactNode }) {
  const scrolled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 h-16 border-b bg-background/80 backdrop-blur-sm transition-colors duration-150",
        scrolled ? "border-border" : "border-transparent",
      )}
    >
      {children}
    </header>
  );
}
