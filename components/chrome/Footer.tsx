import { ExternalLink } from "@/components/layout/ExternalLink";
import { getProfile } from "@/lib/content/profile";
import { siteRepoUrl } from "@/lib/site";
import { Container } from "@/components/layout/Container";

export function Footer() {
  const profile = getProfile();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <Container className="flex flex-col gap-2 py-6 font-mono text-mono-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
        <p>
          © {year} {profile.name} · {profile.location}
        </p>
        <ExternalLink
          href={siteRepoUrl}
          className="min-h-11 text-foreground underline-offset-4 hover:text-accent hover:underline sm:min-h-0"
        >
          Código deste site
        </ExternalLink>
        <p>Feito com Next.js, Tailwind e motion</p>
      </Container>
    </footer>
  );
}
