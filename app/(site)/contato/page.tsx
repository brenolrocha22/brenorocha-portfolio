import { MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { CopyEmailButton } from "@/components/contact/CopyEmailButton";
import { Container } from "@/components/layout/Container";
import { ExternalLink } from "@/components/layout/ExternalLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { getContactContent } from "@/lib/content/contact";
import { getProfile } from "@/lib/content/profile";
import { pageMetadata } from "@/lib/seo/metadata";

const title = "Contato";
const description =
  "Fale com Breno Rocha sobre vagas, projetos e soluções com dados e IA: formulário, e-mail e LinkedIn.";

export const metadata = pageMetadata({ title, description, path: "/contato" });

const channelLinkClass =
  "inline-flex min-h-11 items-center text-body text-foreground underline-offset-4 transition-colors duration-(--duration-fast) hover:text-accent hover:underline";

export default function ContactPage() {
  const content = getContactContent();
  const profile = getProfile();

  return (
    <Container className="py-16 lg:py-24">
      <PageHeader eyebrow={content.eyebrow} title={content.title} intro={content.intro} />

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-12">
        {/* Mobile: direct channels first (fastest path); desktop: beside the form. */}
        <aside
          aria-labelledby="canais-title"
          className="rounded-lg border border-border bg-surface p-6 lg:order-2"
        >
          <h2 id="canais-title" className="text-h3 font-semibold">
            {content.channelsTitle}
          </h2>
          <ul className="mt-4 grid gap-1">
            <li className="flex items-center justify-between gap-2">
              <a
                href={`mailto:${profile.email}`}
                className={`${channelLinkClass} font-mono text-small break-all`}
              >
                {profile.email}
              </a>
              <CopyEmailButton email={profile.email} />
            </li>
            <li>
              <ExternalLink href={profile.linkedin} className={channelLinkClass}>
                LinkedIn
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={profile.github} className={channelLinkClass}>
                GitHub
              </ExternalLink>
            </li>
          </ul>
          <p className="mt-4 flex items-start gap-2 text-small text-muted-foreground">
            <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            {content.availability}
          </p>
        </aside>

        <section
          aria-labelledby="formulario-title"
          className="rounded-lg border border-border bg-surface p-6 md:p-8 lg:order-1"
        >
          <h2 id="formulario-title" className="text-h3 font-semibold">
            Formulário
          </h2>
          <div className="mt-4">
            <ContactForm
              subjects={content.subjects}
              messages={content.messages}
              email={profile.email}
              linkedin={profile.linkedin}
            />
          </div>
        </section>
      </div>
    </Container>
  );
}
