import Image from "next/image";
import { getProfile } from "@/lib/content/profile";
import { hasPortraitPhoto, PORTRAIT_ALT, PORTRAIT_SRC } from "@/lib/content/portrait";
import { cn } from "@/lib/utils";

/**
 * Frame sizes (design-refresh §4.3):
 * - hero-compact: 88px, inline with the name on mobile (no ticks, no caption);
 * - hero: 320px column on desktop (ticks + caption, preloaded: LCP);
 * - about: 160px mobile / 240px from md (ticks + caption).
 */
const variants = {
  "hero-compact": {
    frame: "size-22 rounded-md",
    monogram: "text-h3",
    sizes: "88px",
    ticks: false,
    caption: false,
  },
  hero: {
    frame: "size-80 rounded-(--photo-radius)",
    monogram: "text-display",
    sizes: "320px",
    ticks: true,
    caption: true,
  },
  about: {
    frame: "size-40 rounded-(--photo-radius) md:size-60",
    monogram: "text-h1 md:text-display",
    sizes: "(min-width: 768px) 240px, 160px",
    ticks: true,
    caption: true,
  },
} as const;

type PortraitProps = {
  variant: keyof typeof variants;
  className?: string;
  /** Preload the photo (only the desktop hero, which is the LCP element). */
  preload?: boolean;
};

const tickBase = "pointer-events-none absolute size-2.5 border-accent-line";

/** Corner "crosshair" ticks: the only amber detail on the photo (decorative). */
function CornerTicks() {
  return (
    <>
      <span aria-hidden="true" className={cn(tickBase, "-top-px -left-px border-t border-l")} />
      <span aria-hidden="true" className={cn(tickBase, "-top-px -right-px border-t border-r")} />
      <span aria-hidden="true" className={cn(tickBase, "-bottom-px -left-px border-b border-l")} />
      <span aria-hidden="true" className={cn(tickBase, "-right-px -bottom-px border-r border-b")} />
    </>
  );
}

/**
 * Breno's photo in a "field record" frame (design-refresh §4). Server component: when
 * public/images/breno.jpg does not exist at build time, the same frame shows the "BR" monogram.
 * The grayscale → color filter lives in app/globals.css (.portrait-photo).
 */
export function Portrait({ variant, className, preload = false }: PortraitProps) {
  const config = variants[variant];
  const hasPhoto = hasPortraitPhoto();
  const profile = getProfile();

  return (
    <figure className={cn("portrait-scope shrink-0", className)}>
      {/* Ticks sit on this wrapper: the frame clips its overflow, and the caption stays below. */}
      <div className="relative w-fit">
        <div
          className={cn("relative overflow-hidden border border-border-strong bg-surface-2", config.frame)}
          {...(hasPhoto ? {} : { role: "img", "aria-label": "Monograma de Breno Rocha" })}
        >
          {hasPhoto ? (
            <>
              <Image
                src={PORTRAIT_SRC}
                alt={PORTRAIT_ALT}
                fill
                sizes={config.sizes}
                preload={preload}
                loading={preload ? undefined : "eager"}
                className="portrait-photo object-cover"
              />
              {/* Route A: softens the white shirt against the dark page. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-linear-to-t from-background/40 to-transparent"
              />
            </>
          ) : (
            <span
              aria-hidden="true"
              className={cn(
                "flex size-full items-center justify-center font-sans font-semibold text-foreground",
                config.monogram,
              )}
            >
              BR
            </span>
          )}
        </div>
        {config.ticks ? <CornerTicks /> : null}
      </div>
      {config.caption ? (
        <figcaption className="mt-2 font-mono text-mono-xs text-muted-foreground uppercase">
          {profile.shortName} · {profile.location}
        </figcaption>
      ) : null}
    </figure>
  );
}
