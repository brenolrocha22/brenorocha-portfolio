import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ExternalLink } from "@/components/layout/ExternalLink";
import { primaryButtonClass } from "@/components/project/styles";
import type { HomeContent } from "@/lib/content/home";
import type { Profile } from "@/lib/content/profile";

type ContactCtaProps = {
  content: HomeContent["contact"];
  profile: Profile;
};

const textLinkClass =
  "inline-flex min-h-11 items-center text-small text-muted-foreground transition-colors duration-(--duration-fast) hover:text-foreground";

export function ContactCta({ content, profile }: ContactCtaProps) {
  return (
    <section aria-labelledby="contato-title" className="relative overflow-hidden">
      {/* Same technical grid as the hero, fainter (decorative). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-tech-grid opacity-50" />
      <Container className="relative py-20 lg:py-32">
        <div className="flex flex-col gap-6 rounded-lg border border-border bg-surface p-6 md:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 id="contato-title" className="text-h2 font-semibold">
              {content.title}
            </h2>
            <p className="mt-2 max-w-measure text-body text-muted-foreground">{content.text}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
            <Link href="/contato" className={primaryButtonClass}>
              Falar comigo
            </Link>
            <a href={`mailto:${profile.email}`} className={`${textLinkClass} font-mono break-all`}>
              {profile.email}
            </a>
            <ExternalLink href={profile.linkedin} className={textLinkClass}>
              LinkedIn
            </ExternalLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
