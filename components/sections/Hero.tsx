import Image from "next/image";
import { SectionLink } from "@/components/chrome/SectionLink";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { Container } from "@/components/layout/Container";
import { primaryButtonClass, secondaryButtonClass } from "@/components/project/styles";
import { CopyButton } from "@/components/ui/CopyButton";
import type { HomeContent } from "@/lib/content/home";
import type { Profile } from "@/lib/content/profile";
import type { Focus, ProofTile } from "@/lib/content/proof";
import { technologyName } from "@/lib/content/technologies";
import { HeroCarousel } from "./HeroCarousel";
import { ProofBar } from "./ProofBar";

/** Native size of breno-studio-3.jpg (260×533): shown at 200 px on desktop, never upscaled. */
const PORTRAIT = { src: "/images/breno-studio-3.jpg", width: 260, height: 533 };
const PORTRAIT_ALT = "Retrato em preto e branco de Breno Rocha";

const iconButtonClass =
  "inline-flex size-11 items-center justify-center rounded-sm border border-border-strong bg-veil text-foreground transition-colors duration-(--duration-fast) hover:border-accent hover:text-accent";

type HeroProps = {
  content: HomeContent["hero"];
  profile: Profile;
  focus: Focus;
  tiles: ProofTile[];
};

/**
 * #inicio. Desktop 1440×900: text (5 col) · a legible dashboard carousel (~430 px) beside a
 * smaller native-resolution portrait (7 col), and the 4 proof numbers inside the first fold.
 * Mobile: name, role and CTAs, then the carousel full width, then lead and stack chips.
 * Nothing here is hidden in the server HTML: the entrance animation is CSS transform only
 * (no opacity), so it never delays the LCP and needs no hydration.
 */
export function Hero({ content, profile, focus, tiles }: HeroProps) {
  const copy = content[focus];
  const [firstName, ...rest] = profile.shortName.split(" ");
  const lastName = rest.join(" ");
  const slides = copy.slideOrder.flatMap((index) => (content.slides[index] ? [content.slides[index]] : []));

  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative overflow-x-clip">
      <Container className="relative flex flex-col gap-8 pt-6 pb-10 lg:gap-6 lg:pt-4 lg:pb-8">
        <div className="grid items-center gap-y-8 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4">
              <div className="relative size-[72px] shrink-0 overflow-hidden rounded-full border border-accent-line lg:hidden">
                <Image
                  src={PORTRAIT.src}
                  alt={PORTRAIT_ALT}
                  fill
                  sizes="72px"
                  loading="eager"
                  className="portrait-photo scale-[1.06] object-cover object-[50%_25%]"
                />
              </div>
              <p className="flex items-center gap-2 font-mono text-mono-xs text-muted-foreground uppercase">
                <span aria-hidden="true" className="text-success">
                  ●
                </span>
                {content.eyebrow}
              </p>
            </div>

            <h1
              id="hero-title"
              tabIndex={-1}
              className="mt-4 font-serif text-hero-name font-normal text-foreground focus:outline-none"
            >
              <span className="block">{firstName}</span>
              {lastName ? <span className="block">{lastName}</span> : null}
            </h1>

            <p className="mt-5 text-h2 font-medium text-foreground">
              <span className="relative inline-block">
                {copy.role}
                <span
                  aria-hidden="true"
                  className="hero-underline absolute inset-x-0 -bottom-1 h-0.5 origin-left bg-accent"
                />
              </span>
            </p>
            <p className="mt-1 text-body text-muted-foreground">{copy.alsoRole}</p>

            {/* DOM order = mobile reading order; desktop reorders lead/chips before the CTAs. */}
            <div className="mt-6 flex flex-col gap-6 lg:gap-5">
              <div className="hero-rise order-1 flex flex-wrap items-center gap-3 lg:order-3">
                <SectionLink section={copy.ctaPrimary.section} className={primaryButtonClass}>
                  {copy.ctaPrimary.label}
                </SectionLink>
                <SectionLink section={copy.ctaSecondary.section} className={secondaryButtonClass}>
                  {copy.ctaSecondary.label}
                </SectionLink>
                <span className="flex gap-2">
                  <CopyButton
                    text={profile.email}
                    label={`Copiar e-mail (${profile.email})`}
                    successMessage="E-mail copiado."
                    iconOnly
                    className={iconButtonClass}
                  />
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={iconButtonClass}>
                    <LinkedinIcon className="size-5" />
                    <span className="sr-only">LinkedIn (abre em nova aba)</span>
                  </a>
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className={iconButtonClass}>
                    <GithubIcon className="size-5" />
                    <span className="sr-only">GitHub (abre em nova aba)</span>
                  </a>
                </span>
              </div>

              {/* Mobile/tablet: the dashboard carousel right after name, role and CTAs. */}
              <HeroCarousel slides={slides} sizes="(max-width: 1024px) 100vw, 1px" className="order-2 lg:hidden" />

              <p className="hero-rise order-3 max-w-xl text-body-lg text-muted-foreground lg:order-1">{copy.lead}</p>

              <ul aria-label="Stack principal" className="hero-rise order-4 flex flex-wrap gap-2 lg:order-2">
                {copy.chips.map((id) => (
                  <li key={id}>
                    <a
                      href={`#tech-${id}`}
                      className="inline-flex min-h-9 items-center rounded-sm border border-border-strong bg-veil px-3 font-mono text-mono-xs text-foreground uppercase transition-colors duration-(--duration-fast) hover:border-accent hover:text-accent"
                    >
                      {technologyName(id) ?? id}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Desktop: a legible carousel BESIDE the portrait (it touches the photo's edge, never the face). */}
          <div className="relative hidden items-end justify-end lg:col-span-7 lg:flex">
            <div className="hero-rise relative z-10 -mr-3 mb-8 w-[432px] shrink-0">
              <HeroCarousel slides={slides} sizes="432px" />
            </div>
            <figure className="relative w-[200px] shrink-0">
              <div className="portrait-fade-bottom relative overflow-hidden rounded-md">
                <Image
                  src={PORTRAIT.src}
                  alt={PORTRAIT_ALT}
                  width={PORTRAIT.width}
                  height={PORTRAIT.height}
                  sizes="200px"
                  preload
                  className="portrait-photo h-auto w-[200px] scale-[1.03]"
                />
                <span aria-hidden="true" className="portrait-tint pointer-events-none absolute inset-0 opacity-35" />
              </div>
              <span aria-hidden="true" className="absolute -top-2 -left-2 size-6 border-t border-l border-accent-line" />
              <span aria-hidden="true" className="absolute -top-2 -right-2 size-6 border-t border-r border-accent-line" />
            </figure>
          </div>
        </div>

        <ProofBar tiles={tiles} />
      </Container>
    </section>
  );
}
