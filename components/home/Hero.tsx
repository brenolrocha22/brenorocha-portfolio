import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ExternalLink } from "@/components/layout/ExternalLink";
import { eyebrowClass, primaryButtonClass, secondaryButtonClass } from "@/components/project/styles";
import type { HomeContent } from "@/lib/content/home";
import type { Profile } from "@/lib/content/profile";
import { Portrait } from "./Portrait";

type HeroProps = {
  content: HomeContent["hero"];
  profile: Profile;
};

const textLinkClass =
  "min-h-11 text-small text-muted-foreground transition-colors duration-150 hover:text-foreground";

export function Hero({ content, profile }: HeroProps) {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-border">
      {/* Dot-grid texture (design system §2): decorative, hero only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[24px_24px] opacity-40"
      />
      <Container className="relative grid gap-12 py-20 lg:grid-cols-12 lg:items-center lg:py-32">
        <div className="lg:col-span-8">
          <p className={eyebrowClass}>{content.eyebrow}</p>
          <Portrait className="mt-8 lg:hidden" />
          {/* D14: name + area above the slogan H1, so the hero says who and for what. */}
          <p className="mt-6 text-h3 font-semibold text-foreground">
            {profile.shortName}
            {profile.headline ? (
              <span className="block text-body-lg font-normal text-muted-foreground">
                {profile.headline}
              </span>
            ) : null}
          </p>
          <h1 id="hero-title" className="mt-4 text-display font-semibold text-balance">
            Transformando conhecimento, dados e tecnologia em soluções para problemas{" "}
            <em className="font-serif font-normal">reais</em>.
          </h1>
          <div className="mt-6 max-w-measure space-y-2 text-body-lg text-muted-foreground">
            {content.pitch.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link href="/projetos" className={primaryButtonClass}>
              Ver projetos
            </Link>
            <Link href="/contato" className={secondaryButtonClass}>
              Falar comigo
            </Link>
            <div className="flex gap-6 sm:ml-2">
              <ExternalLink href={profile.github} className={textLinkClass}>
                GitHub
              </ExternalLink>
              <ExternalLink href={profile.linkedin} className={textLinkClass}>
                LinkedIn
              </ExternalLink>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:col-span-4 lg:items-center">
          <Portrait className="hidden lg:block" />
          <dl className="grid grid-cols-3 divide-x divide-border rounded-lg border border-border bg-surface font-mono lg:w-full lg:grid-cols-1 lg:divide-x-0 lg:divide-y">
            {content.facts.map((fact) => (
              <div key={fact.value} className="flex flex-col-reverse gap-1 p-3 lg:p-4">
                <dt className="text-mono-xs text-muted-foreground uppercase">
                  {fact.href ? (
                    <Link
                      href={fact.href}
                      className="underline-offset-4 hover:text-foreground hover:underline"
                    >
                      {fact.label}
                    </Link>
                  ) : (
                    fact.label
                  )}
                </dt>
                <dd className="text-small font-medium text-data lg:text-body">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
