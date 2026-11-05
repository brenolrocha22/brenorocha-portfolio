import Image from "next/image";
import { getProfile } from "@/lib/content/profile";
import { hasPortraitPhoto, PORTRAIT_ALT, PORTRAIT_SRC } from "@/lib/content/portrait";
import { cn } from "@/lib/utils";

/**
 * Frame sizes (D22). The source photo is 512px, so it is never shown full-bleed:
 * - hero: up to 440px wide, square, edges fade into the navy (preloaded: LCP candidate);
 * - about: 160px mobile / 240px from md, thin frame.
 */
const variants = {
  hero: {
    frame: "aspect-square w-full max-w-[440px]",
    monogram: "text-hero-name",
    sizes: "(min-width: 1024px) 440px, min(440px, 100vw)",
    fade: true,
    caption: false,
  },
  about: {
    frame: "size-40 rounded-(--photo-radius) border border-border-strong md:size-60",
    monogram: "text-title",
    sizes: "(min-width: 768px) 240px, 160px",
    fade: false,
    caption: true,
  },
} as const;

type PortraitProps = {
  variant: keyof typeof variants;
  className?: string;
  /** Preload the photo (only the hero, which is above the fold). */
  preload?: boolean;
};

/** "BRENO_ROCHA // RECIFE_PE" style metadata caption. */
function toMeta(value: string): string {
  return value.toUpperCase().replace(/[\s/]+/g, "_");
}

/**
 * Breno's photo with the blue duotone treatment (D22, CSS only: grayscale + a blue
 * "color" blend layer, see app/globals.css). Server component: when public/images/breno.jpg
 * does not exist at build time, the same frame shows the "BR" monogram.
 */
export function Portrait({ variant, className, preload = false }: PortraitProps) {
  const config = variants[variant];
  const hasPhoto = hasPortraitPhoto();
  const profile = getProfile();

  return (
    <figure className={cn("shrink-0", className)}>
      <div
        className={cn("relative isolate overflow-hidden bg-surface-2", config.frame, config.fade && "portrait-fade")}
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
            <span aria-hidden="true" className="portrait-tint pointer-events-none absolute inset-0" />
            <span aria-hidden="true" className="portrait-tint-dark pointer-events-none absolute inset-0" />
          </>
        ) : (
          <span
            aria-hidden="true"
            className={cn("flex size-full items-center justify-center font-serif text-accent", config.monogram)}
          >
            BR
          </span>
        )}
      </div>
      {config.caption ? (
        <figcaption className="mt-3 font-mono text-mono-xs text-muted-foreground">
          {toMeta(profile.shortName)} {"//"} {toMeta(profile.location)}
        </figcaption>
      ) : null}
    </figure>
  );
}
