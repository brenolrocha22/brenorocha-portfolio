import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ExternalLink } from "@/components/layout/ExternalLink";
import { SectionLabel } from "@/components/layout/SectionLabel";
import { primaryButtonClass, sectionTitleClass } from "@/components/project/styles";
import type { HomeContent } from "@/lib/content/home";
import type { Profile } from "@/lib/content/profile";
import { cn } from "@/lib/utils";

type ContactCtaProps = {
  content: HomeContent["contact"];
  profile: Profile;
  /** Two-digit section number, shown as "(04)". */
  index?: string;
};

const textLinkClass =
  "inline-flex min-h-11 items-center text-small text-muted-foreground underline-offset-4 transition-colors duration-(--duration-fast) hover:text-foreground hover:underline";

/** Closing block (D22): numbered label, big serif title, existing contact links. */
export function ContactCta({ content, profile, index }: ContactCtaProps) {
  return (
    <section aria-labelledby="contato-title" className="relative overflow-hidden">
      <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0 opacity-70" />
      <Container className="relative py-20 lg:py-32">
        <div className="border-t border-border pt-6">
          <SectionLabel index={index}>{content.title}</SectionLabel>
          <h2 id="contato-title" className={cn("mt-5 max-w-4xl", sectionTitleClass)}>
            Conecte-se com <em className="text-accent">{profile.shortName}</em>
          </h2>
          <p className="mt-6 max-w-measure text-body-lg text-muted-foreground">{content.text}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8">
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
