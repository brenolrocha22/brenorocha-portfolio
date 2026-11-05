"use client";

import { useEffect, useRef, useState } from "react";
import { animate, m, useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { ProofTile } from "@/lib/content/proof";
import { EASE_OUT_EXPO, STAGGER } from "@/lib/motion";

const numberFormatter = new Intl.NumberFormat("pt-BR");

/** Years (countUp: false) are printed without a thousands separator. */
const format = (tile: ProofTile, value: number) => (tile.countUp ? numberFormatter.format(value) : String(value));

/**
 * Animated number. The server HTML already holds the final value (screenshots, no-JS and
 * screen readers read it); the count-up is cosmetic and only runs for tiles that start
 * off screen, once, without reduced motion.
 */
function Counter({ tile }: { tile: ProofTile }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState<number | null>(null);
  const armed = useRef<boolean | null>(null);

  useEffect(() => {
    if (armed.current !== null || !tile.countUp || reduced) return;
    // Decide once, right after hydration: animate only what is not visible yet.
    const rect = ref.current?.getBoundingClientRect();
    const visibleNow = rect ? rect.top < window.innerHeight && rect.bottom > 0 : true;
    armed.current = !visibleNow;
  }, [tile.countUp, reduced]);

  useEffect(() => {
    if (!inView || !armed.current) return;
    armed.current = false;
    const controls = animate(0, tile.value, {
      duration: 0.9,
      ease: EASE_OUT_EXPO,
      onUpdate: (value) => setDisplay(Math.round(value)),
      onComplete: () => setDisplay(null),
    });
    return () => controls.stop();
  }, [inView, tile.value]);

  return (
    <span ref={ref} className="tabular-nums" aria-hidden="true">
      {tile.prefix}
      {format(tile, display ?? tile.value)}
      {tile.suffix}
    </span>
  );
}

/** Proof bar: 4 verifiable numbers per focus (2×2 on mobile, one row from md). */
export function ProofBar({ tiles }: { tiles: ProofTile[] }) {
  return (
    <ul aria-label="Provas em números" className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
      {tiles.map((tile, index) => (
        <m.li
          key={tile.id}
          data-reveal=""
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO, delay: index * STAGGER }}
          className="relative bg-veil"
        >
          <a
            href={tile.href}
            className="group flex h-full min-h-28 flex-col justify-between gap-2 p-4 transition-colors duration-(--duration-fast) hover:bg-surface-2 md:p-5"
          >
            <span className="font-serif text-h1 leading-none text-foreground">
              <span className="sr-only">
                {tile.prefix}
                {format(tile, tile.value)}
                {tile.suffix}
              </span>
              <Counter tile={tile} />
            </span>
            <span className="flex items-end justify-between gap-2 text-small text-muted-foreground group-hover:text-foreground">
              {tile.label}
              <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-accent" />
            </span>
          </a>
        </m.li>
      ))}
    </ul>
  );
}
