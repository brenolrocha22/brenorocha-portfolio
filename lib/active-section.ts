"use client";

import { useSyncExternalStore } from "react";
import type { SectionId } from "./site";

// Tiny external store: the single IntersectionObserver (SectionTracker) writes, header/FAB/rail read.
let current: SectionId | null = null;
const listeners = new Set<() => void>();

export function setActiveSection(id: SectionId | null): void {
  if (id === current) return;
  current = id;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useActiveSection(): SectionId | null {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}

/** Scrolls to a section and moves focus to its heading (motion-system §3). */
export function goToSection(id: SectionId): void {
  const section = document.getElementById(id);
  if (!section) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (id === "inicio") {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  } else {
    section.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }
  const heading = section.querySelector<HTMLElement>("h1, h2");
  heading?.focus({ preventScroll: true });
  const url = id === "inicio" ? window.location.pathname + window.location.search : `${window.location.search}#${id}`;
  window.history.replaceState(window.history.state, "", url || "/");
}
