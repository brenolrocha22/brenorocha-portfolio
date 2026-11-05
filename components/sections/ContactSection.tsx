import Link from "next/link";
import { ChevronDown, Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { Reveal } from "@/components/motion/Reveal";
import { CopyButton } from "@/components/ui/CopyButton";
import type { ContactContent } from "@/lib/content/contact";
import type { Profile } from "@/lib/content/profile";
import type { SolutionsView } from "@/lib/content/solutions";

type ContactSectionProps = {
  profile: Profile;
  contact: ContactContent;
  solutions: SolutionsView["solutions"];
};

const cardClass =
  "flex h-full min-h-24 flex-col justify-between gap-4 rounded-lg border border-border bg-veil p-5 transition-[border-color,box-shadow] duration-(--duration-base) hover:border-accent-line hover:shadow-glow-md";
const smallAction =
  "inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-border-strong px-3 text-small transition-colors duration-(--duration-fast) hover:border-accent hover:text-accent";

function handleOf(url: string): string {
  return new URL(url).pathname.replace(/\/+$/, "");
}

/** #contato (spec §4.6): 3 direct channels, availability, optional form (Server Action), projects and slogan. */
export function ContactSection({ profile, contact, solutions }: ContactSectionProps) {
  return (
    <div className="grid gap-10">
      <ul className="grid gap-4 md:grid-cols-3">
        <Reveal as="li" index={0}>
          <div className={cardClass}>
            <p className="flex items-center gap-2 font-mono text-mono-xs text-muted-foreground uppercase">
              <Mail aria-hidden="true" className="size-4 text-accent" />
              E-mail
            </p>
            <p className="font-mono text-small break-all text-foreground">{profile.email}</p>
            <div className="flex flex-wrap gap-2">
              <CopyButton text={profile.email} label="Copiar" successMessage="E-mail copiado." className={smallAction} />
              <a href={`mailto:${profile.email}`} className={smallAction}>
                Escrever
              </a>
            </div>
          </div>
        </Reveal>
        <Reveal as="li" index={1}>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={cardClass}>
            <span className="flex items-center gap-2 font-mono text-mono-xs text-muted-foreground uppercase">
              <LinkedinIcon className="size-4 text-accent" />
              LinkedIn
            </span>
            <span className="font-mono text-small text-foreground">{handleOf(profile.linkedin)}</span>
            <span className="text-small text-accent">
              Abrir perfil ↗<span className="sr-only"> (abre em nova aba)</span>
            </span>
          </a>
        </Reveal>
        <Reveal as="li" index={2}>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className={cardClass}>
            <span className="flex items-center gap-2 font-mono text-mono-xs text-muted-foreground uppercase">
              <GithubIcon className="size-4 text-accent" />
              GitHub
            </span>
            <span className="font-mono text-small text-foreground">{handleOf(profile.github)}</span>
            <span className="text-small text-accent">
              Ver repositórios ↗<span className="sr-only"> (abre em nova aba)</span>
            </span>
          </a>
        </Reveal>
      </ul>

      <p className="flex items-start gap-2 text-small text-muted-foreground">
        <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        {contact.availability} · inglês fluente
      </p>

      <details className="group rounded-lg border border-border bg-veil">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 px-5 font-medium">
          Prefere escrever aqui?
          <ChevronDown
            aria-hidden="true"
            className="size-4 transition-transform duration-(--duration-fast) group-open:rotate-180"
          />
        </summary>
        <div className="border-t border-border px-5 py-6">
          <ContactForm
            subjects={contact.subjects}
            messages={contact.messages}
            email={profile.email}
            linkedin={profile.linkedin}
          />
        </div>
      </details>

      <div>
        <h3 className="font-mono text-mono-xs text-muted-foreground uppercase">Também atendo projetos</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {solutions.map((solution) => {
            const proof = solution.projects[0];
            return (
              <li key={solution.id}>
                {proof ? (
                  <Link
                    href={`/projetos/${proof.slug}`}
                    className="inline-flex min-h-11 items-center rounded-sm border border-border-strong bg-veil px-3 text-small transition-colors duration-(--duration-fast) hover:border-accent hover:text-accent"
                  >
                    {solution.title}
                  </Link>
                ) : (
                  solution.title
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <p className="font-serif text-h1 text-balance text-foreground">{profile.tagline}</p>
    </div>
  );
}
