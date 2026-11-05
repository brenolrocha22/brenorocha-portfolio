"use client";

import { m, useScroll, useTransform } from "motion/react";

export const BACKDROP_ID = "scroll-backdrop";

/**
 * Fixed decorative background (motion-system §2): 3 radial blobs whose colours follow the
 * active section (`data-section` on this element, written by SectionTracker) plus the
 * technical grid. Only transform/opacity animate; reduced motion keeps it static.
 */
export function ScrollBackdrop() {
  const { scrollYProgress } = useScroll();
  const up = useTransform(scrollYProgress, [0, 1], ["0vh", "-18vh"]);
  const down = useTransform(scrollYProgress, [0, 1], ["0vh", "10vh"]);

  return (
    <div
      id={BACKDROP_ID}
      data-section="inicio"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      <m.div className="absolute inset-0" style={{ y: up }}>
        <div className="backdrop-blob backdrop-blob-a" />
        <div className="backdrop-blob backdrop-blob-b" />
      </m.div>
      <m.div className="absolute inset-0" style={{ y: down }}>
        <div className="backdrop-blob backdrop-blob-c" />
      </m.div>
      <div className="absolute inset-0 bg-tech-grid opacity-60" />
    </div>
  );
}
