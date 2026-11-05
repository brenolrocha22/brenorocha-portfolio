import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { eyebrowClass, primaryButtonClass, secondaryButtonClass } from "@/components/project/styles";
import type { HomeContent } from "@/lib/content/home";
import type { Profile } from "@/lib/content/profile";
import { cn } from "@/lib/utils";
import { Portrait } from "./Portrait";

type HeroProps = {
  content: HomeContent["hero"];
  profile: Profile;
};

/**
 * Hero (design-refresh §5): status line → photo + name + area → H1 (slogan, D14) →
 * one support line → 2 CTAs → strip of 3 proofs. The photo turns to color on hover of
 * the whole section (`portrait-scope`).
 */
export function Hero({ content, profile }: HeroProps) {
  return (
    <section aria-labelledby="hero-title" className="portrait-scope relative overflow-hidden border-b border-border">
      {/* Technical 1px grid with radial mask: decorative, hero only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-tech-grid opacity-70 [--grid-size:32px] lg:opacity-100 lg:[--grid-size:48px]"
      />
      <Container className="relative grid gap-12 py-16 lg:grid-cols-12 lg:items-center lg:py-28">
        <div className="lg:col-span-8">
          <p className={cn(eyebrowClass, "flex items-center gap-2")}>
            <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-success" />
            {content.eyebrow}
          </p>

          {/* D14: name + area above the slogan H1, so the hero says who and for what. */}
          <div className="mt-6 flex items-center gap-4">
            <Portrait variant="hero-compact" className="lg:hidden" />
            <p className="text-h3 font-semibold text-foreground">
              {profile.shortName}
              {profile.headline ? (
                <span className="block text-body-lg font-normal text-muted-foreground">{profile.headline}</span>
              ) : null}
            </p>
          </div>

          <h1 id="hero-title" className="mt-6 text-display font-semibold text-balance">
            Transformando conhecimento, dados e tecnologia em soluções para problemas{" "}
            <em className="font-serif font-normal">reais</em>.
          </h1>
          <p className="mt-5 max-w-measure text-body-lg text-muted-foreground">{content.lead}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/projetos" className={primaryButtonClass}>
              Ver projetos
            </Link>
            <Link href="/contato" className={secondaryButtonClass}>
              Falar comigo
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-1 divide-y divide-border rounded-md border border-border font-mono sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {content.facts.map((fact) => (
              <div
                key={fact.value}
                className={cn(
                  "relative flex flex-row-reverse items-baseline justify-end gap-3 px-4 py-3 sm:flex-col-reverse sm:justify-start sm:gap-1 sm:py-4",
                  fact.href && "transition-colors duration-(--duration-fast) hover:bg-surface",
                )}
              >
                <dt className="text-mono-xs text-muted-foreground uppercase">
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
                <dd className="shrink-0 text-h3 font-medium whitespace-nowrap text-foreground sm:text-body-lg lg:text-h3">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <Portrait variant="hero" preload className="hidden lg:col-span-4 lg:block lg:justify-self-end" />
      </Container>
    </section>
  );
}
