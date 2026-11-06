"use client";

import { useEffect, useId, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import type { HomeContent } from "@/lib/content/home";
import { usePrefersReducedMotion } from "@/lib/use-copy";
import { cn } from "@/lib/utils";

type Slide = HomeContent["hero"]["slides"][number];

const INTERVAL_MS = 4000;

function SlideLink({ slide, className, children, tabIndex }: { slide: Slide; className: string; children: React.ReactNode; tabIndex?: number }) {
  // In-page anchors stay plain <a> (CSS smooth scroll + scroll-margin); routes use next/link.
  return slide.href.startsWith("#") ? (
    <a href={slide.href} className={className} tabIndex={tabIndex}>
      {children}
    </a>
  ) : (
    <Link href={slide.href} className={className} tabIndex={tabIndex}>
      {children}
    </Link>
  );
}

/**
 * Hero carousel of real prints (Porsche, Vendas, Control chat). Loops every ~4 s with a
 * crossfade; pauses on hover/focus or with the pause button; no auto-rotation with reduced
 * motion. Each slide links to its story/project. The live region only announces while
 * paused (WAI-ARIA carousel pattern). Without JS the first slide shows and links work.
 */
export function HeroCarousel({ slides, sizes, className }: { slides: Slide[]; sizes: string; className?: string }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const id = useId();

  const rotating = !reduced && !userPaused && !hovered && !focused && slides.length > 1;

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % slides.length), INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [rotating, slides.length]);

  function go(next: number) {
    setIndex((next + slides.length) % slides.length);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    }
  }

  const current = slides[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Dashboards e projetos em destaque"
      className={cn("relative", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
      onKeyDown={onKeyDown}
    >
      <div className="overflow-hidden rounded-md border border-accent-line bg-surface shadow-card">
        <div id={`${id}-slides`} aria-live={rotating ? "off" : "polite"} className="relative aspect-[16/10]">
          {slides.map((slide, slideIndex) => {
            const active = slideIndex === index;
            return (
              <div
                key={slide.src}
                role="group"
                aria-roledescription="slide"
                aria-label={`${slideIndex + 1} de ${slides.length}: ${slide.caption}`}
                aria-hidden={!active}
                className={cn(
                  "absolute inset-0 transition-opacity duration-[700ms] ease-out-expo",
                  active ? "z-10 opacity-100" : "pointer-events-none opacity-0",
                )}
              >
                <SlideLink slide={slide} tabIndex={active ? 0 : -1} className="group block h-full">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    sizes={sizes}
                    preload={slideIndex === 0}
                    className="object-cover object-top transition-transform duration-(--duration-reveal) ease-out-expo group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                  />
                </SlideLink>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-3 border-t border-border px-3 py-1.5">
          {current ? (
            <SlideLink
              slide={current}
              className="inline-flex min-h-11 min-w-0 flex-1 basis-64 items-center gap-1.5 text-small font-medium text-data hover:text-accent"
            >
              <span>{current.caption}</span>
              <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
            </SlideLink>
          ) : null}
          <div className="ml-auto flex shrink-0 items-center">
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.src}
                type="button"
                aria-controls={`${id}-slides`}
                aria-current={slideIndex === index ? "true" : undefined}
                aria-label={`Mostrar ${slideIndex + 1} de ${slides.length}: ${slide.caption}`}
                onClick={() => go(slideIndex)}
                className="inline-flex size-8 items-center justify-center"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "rounded-full transition-[width,background-color] duration-(--duration-base)",
                    slideIndex === index ? "h-1.5 w-4 bg-accent" : "size-1.5 bg-muted-foreground",
                  )}
                />
              </button>
            ))}
            {slides.length > 1 ? (
              <button
                type="button"
                onClick={() => setUserPaused((value) => !value)}
                aria-label={userPaused ? "Retomar rotação automática" : "Pausar rotação automática"}
                className="ml-1 inline-flex size-8 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground motion-reduce:hidden"
              >
                {userPaused ? <Play aria-hidden="true" className="size-3.5" /> : <Pause aria-hidden="true" className="size-3.5" />}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
