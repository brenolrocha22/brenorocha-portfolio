import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { navItems } from "@/lib/site";
import { getProfile } from "@/lib/content/profile";
import { Container } from "./Container";
import { ExternalLink } from "./ExternalLink";
import { Monogram } from "./Monogram";

const footerLinkClass =
  "inline-flex min-h-11 items-center gap-2 text-muted-foreground transition-colors duration-(--duration-fast) hover:text-foreground md:min-h-9";

export function Footer() {
  const profile = getProfile();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <Container className="grid gap-10 py-12 md:grid-cols-3 md:gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Monogram />
            <span className="font-medium">{profile.shortName}</span>
          </div>
          <p className="max-w-xs text-small text-muted-foreground">{profile.tagline}</p>
        </div>

        <nav aria-label="Rodapé">
          <h2 className="font-mono text-mono-xs text-muted-foreground uppercase">Navegação</h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 text-small md:grid-cols-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={footerLinkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-mono text-mono-xs text-muted-foreground uppercase">Contato</h2>
          <ul className="mt-3 flex flex-col text-small">
            <li>
              <a href={`mailto:${profile.email}`} className={footerLinkClass}>
                <Mail aria-hidden="true" className="size-4 shrink-0" />
                {profile.email}
              </a>
            </li>
            <li>
              <ExternalLink href={profile.linkedin} className={footerLinkClass}>
                LinkedIn
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={profile.github} className={footerLinkClass}>
                GitHub
              </ExternalLink>
            </li>
            <li className="inline-flex min-h-11 items-center gap-2 text-muted-foreground md:min-h-9">
              <MapPin aria-hidden="true" className="size-4 shrink-0" />
              {profile.location}
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="py-5">
          <p className="font-mono text-mono-xs text-muted-foreground uppercase">
            © {year} {profile.name} · Feito com Next.js
          </p>
        </Container>
      </div>
    </footer>
  );
}
