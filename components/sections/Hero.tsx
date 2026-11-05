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
import { HeroMotion, RoleUnderline, ScrollHint } from "./HeroMotion";
import { ProofBar } from "./ProofBar";

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
 * #inicio (spec §4.0 + correção 3): role, stack, contact and a dashboard proof in the first
 * screen. Desktop: text 7 col / portrait 5 col with the dashboard teaser over its corner.
 * Mobile: the portrait becomes a 72 px avatar and the teaser goes full width after the CTAs.
 */
export function Hero({ content, profile, focus, tiles }: HeroProps) {
  const copy = content[focus];
  const [firstName, ...rest] = profile.shortName.split(" ");
  const lastName = rest.join(" ");

  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative overflow-x-clip">
      <Container className="relative flex flex-col gap-8 pt-6 pb-10 lg:min-h-[calc(100svh-var(--header-height))] lg:gap-10 lg:pt-10">
        <div className="grid flex-1 items-center gap-y-8 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-6">
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
              className="mt-6 font-serif text-hero-name font-normal text-foreground focus:outline-none"
            >
              <span className="block">{firstName}</span>
              {lastName ? <span className="block">{lastName}</span> : null}
            </h1>

            <p className="mt-6 text-h2 font-medium text-foreground">
              <RoleUnderline>{copy.role}</RoleUnderline>
            </p>
            <p className="mt-1 text-body text-muted-foreground">{copy.alsoRole}</p>

            <HeroMotion>
              <p className="max-w-xl text-body-lg text-muted-foreground">{copy.lead}</p>

              <ul aria-label="Stack principal" className="flex flex-wrap gap-2">
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

              <div className="flex flex-wrap items-center gap-3">
                <SectionLink section={content.ctaPrimary.section} className={primaryButtonClass}>
                  {content.ctaPrimary.label}
                </SectionLink>
                <SectionLink section={content.ctaSecondary.section} className={secondaryButtonClass}>
                  {content.ctaSecondary.label}
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
            </HeroMotion>

            {/* Mobile/tablet: carousel full width right after the CTAs (covers nothing). */}
            <HeroCarousel slides={content.slides} sizes="(max-width: 1024px) 100vw, 1px" className="mt-8 lg:hidden" />
          </div>

          {/* Desktop visual: carousel BESIDE the native-size portrait (touches its edge, never the face). */}
          <div className="relative hidden items-end justify-end lg:col-span-6 lg:flex">
            <div className="relative z-10 -mr-3 mb-12 w-[300px] shrink-0">
              <HeroCarousel slides={content.slides} sizes="300px" />
            </div>
            <figure className="relative w-[260px] shrink-0">
              <div className="relative overflow-hidden rounded-md portrait-fade-bottom">
                <Image
                  src={PORTRAIT.src}
                  alt={PORTRAIT_ALT}
                  width={PORTRAIT.width}
                  height={PORTRAIT.height}
                  sizes="260px"
                  preload
                  className="portrait-photo h-auto w-[260px] scale-[1.03]"
                />
                <span aria-hidden="true" className="portrait-tint pointer-events-none absolute inset-0 opacity-35" />
              </div>
              <span aria-hidden="true" className="absolute -top-2 -left-2 size-6 border-t border-l border-accent-line" />
              <span aria-hidden="true" className="absolute -top-2 -right-2 size-6 border-t border-r border-accent-line" />
            </figure>
          </div>
        </div>

        <ProofBar tiles={tiles} />
        <ScrollHint label={content.scrollHint} />
      </Container>
    </section>
  );
}
