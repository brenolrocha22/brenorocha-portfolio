"use client";

import { useEffect } from "react";
import { setActiveSection } from "@/lib/active-section";
import { sectionIds, type SectionId } from "@/lib/site";
import { BACKDROP_ID } from "./ScrollBackdrop";

function paintBackdrop(id: SectionId) {
  document.getElementById(BACKDROP_ID)?.setAttribute("data-section", id);
}

/**
 * The single IntersectionObserver of the page (motion-system §2.5): the section crossing
 * the middle band of the viewport is the active one. Without `sections`, pins a fixed
 * section (case studies → "projetos").
 */
export function SectionTracker({ fixed }: { fixed?: SectionId }) {
  useEffect(() => {
    if (fixed) {
      paintBackdrop(fixed);
      setActiveSection(null);
      return;
    }

    let hashTimer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (!visible) return;
        const id = visible.target.id as SectionId;
        paintBackdrop(id);
        setActiveSection(id);
        clearTimeout(hashTimer);
        hashTimer = setTimeout(() => {
          const { pathname, search, hash } = window.location;
          const next = id === "inicio" ? "" : `#${id}`;
          if (hash !== next) window.history.replaceState(window.history.state, "", `${pathname}${search}${next}`);
        }, 150);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => {
      observer.disconnect();
      clearTimeout(hashTimer);
      setActiveSection(null);
    };
  }, [fixed]);

  return null;
}
