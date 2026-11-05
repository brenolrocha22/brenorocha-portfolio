import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { primaryButtonClass, secondaryButtonClass } from "@/components/project/styles";
import type { HomeContent } from "@/lib/content/home";
import type { Profile } from "@/lib/content/profile";
import { cn } from "@/lib/utils";
import { Portrait } from "./Portrait";

type HeroProps = {
  content: HomeContent["hero"];
  profile: Profile;
};

/** "Disponível · Recife/PE" → "DISPONÍVEL // RECIFE_PE" (technical metadata style). */
function toStatusMeta(eyebrow: string): string {
  return eyebrow
    .split(" · ")
    .map((part) => part.replace(/\//g, "_"))
    .join(" // ")
    .toUpperCase();
}

/** Roles stacked bottom-left, derived from the headline: "Dados e IA generativa com Python". */
function toRoles(headline: string | undefined): string[] {
  if (!headline) return [];
  return headline
    .split(/\s+(?:e|com)\s+/)
    .map((role) => role.trim())
    .filter(Boolean)
    .map((role) => role.charAt(0).toUpperCase() + role.slice(1));
}

/**
 * Cinematic hero (D22): blue-duotone portrait on the left, giant serif name (H1) on the
 * right overlapping it, roles stacked bottom-left, slogan + lead + 2 CTAs, then the
 * numbered strip of 3 proofs.
 */
export function Hero({ content, profile }: HeroProps) {
  const [firstName, ...rest] = profile.shortName.split(" ");
  const lastName = rest.join(" ");
  const roles = toRoles(profile.headline);

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-border">
      {/* Soft radial blue glow + faint technical grid: decorative. */}
      <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-tech-grid opacity-60 [--grid-size:32px] lg:[--grid-size:48px]"
      />

      <Container className="relative flex min-h-[calc(100svh-var(--header-height))] flex-col py-8 lg:py-12">
        <p className="flex items-center gap-2 font-mono text-mono-xs text-muted-foreground">
          <span aria-hidden="true" className="text-success">
            ●
          </span>
          {toStatusMeta(content.eyebrow)}
        </p>

        <div className="mt-6 grid flex-1 items-center gap-y-8 lg:mt-4 lg:grid-cols-12">
          {/* Portrait + roles (left on desktop, on top on mobile). */}
          <div className="relative mx-auto w-full max-w-[440px] lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:mx-0">
            <Portrait variant="hero" preload />
            {roles.length > 0 ? (
              <ul
                aria-label="Áreas"
                className="absolute bottom-4 left-0 flex flex-col gap-0.5 text-body-lg font-medium text-foreground md:text-h3"
              >
                {roles.map((role) => (
                  <li key={role}>{role}</li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Name (H1) + support copy; the name overlaps the portrait on desktop. */}
          <div className="relative z-10 lg:col-span-8 lg:col-start-5 lg:row-start-1">
            <h1
              id="hero-title"
              className="text-right font-serif text-hero-name font-normal text-foreground"
            >
              {/* Desktop: staggered lines, the first one slightly over the portrait's faded edge. */}
              <span className="block lg:-ml-20 lg:text-left">{firstName}</span>
              {lastName ? <span className="block">{lastName}</span> : null}
            </h1>

            <div className="mt-8 max-w-xl lg:mt-10 lg:ml-auto">
              <p className="text-h3 text-balance text-foreground">
                Transformando conhecimento, dados e tecnologia em soluções para problemas{" "}
                <em className="font-serif text-[1.2em] leading-none font-normal text-accent">reais</em>.
              </p>
              <p className="mt-4 text-body text-muted-foreground">{content.lead}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/projetos" className={primaryButtonClass}>
                  Ver projetos
                </Link>
                <Link href="/contato" className={secondaryButtonClass}>
                  Falar comigo
                </Link>
              </div>
            </div>
          </div>
        </div>

        <dl className="mt-12 grid grid-cols-1 divide-y divide-border border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {content.facts.map((fact, index) => (
            <div
              key={fact.value}
              className={cn(
                "relative flex flex-col-reverse gap-1 py-4 sm:px-5 sm:first:pl-0",
                fact.href && "transition-colors duration-(--duration-fast) hover:bg-surface",
              )}
            >
              <dt className="font-mono text-mono-xs text-muted-foreground uppercase">
                <span aria-hidden="true" className="mr-2 text-accent">
                  ({String(index + 1).padStart(2, "0")})
                </span>
                {fact.href ? (
                  <Link
                    href={fact.href}
                    className="after:absolute after:inset-0 after:content-[''] hover:text-foreground"
                  >
                    {fact.label} <span aria-hidden="true" className="text-accent">→</span>
                  </Link>
                ) : (
                  fact.label
                )}
              </dt>
              <dd className="font-serif text-h1 leading-none whitespace-nowrap text-foreground">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
