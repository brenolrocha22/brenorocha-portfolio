import Link from "next/link";
import { CertificationCard } from "@/components/certifications/CertificationCard";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { primaryButtonClass, secondaryButtonClass } from "@/components/project/styles";
import { getCertifications, getCertificationsHeader } from "@/lib/content/certifications";
import { pageMetadata } from "@/lib/seo/metadata";

const title = "Certificações";
const description =
  "Certificados de Breno Rocha em IA, dados e programação, com código e link de validação quando disponíveis.";

export const metadata = pageMetadata({ title, description, path: "/certificacoes" });

export default function CertificationsPage() {
  const header = getCertificationsHeader();
  const certifications = getCertifications();
  const validated = certifications.filter((cert) => cert.validationUrl);
  const others = certifications.filter((cert) => !cert.validationUrl);

  return (
    <Container className="py-16 lg:py-24">
      <PageHeader eyebrow="Certificações" title={header.title} intro={header.intro} />

      {validated.length > 0 ? (
        <section aria-labelledby="validaveis-title" className="mt-12">
          <h2 id="validaveis-title" className="text-h2 font-semibold">
            Com validação online
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {validated.map((cert) => (
              <CertificationCard key={cert.name} cert={cert} />
            ))}
          </div>
        </section>
      ) : null}

      {others.length > 0 ? (
        <section aria-labelledby="outros-title" className="mt-16">
          <h2 id="outros-title" className="text-h2 font-semibold">
            Outros cursos
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {others.map((cert) => (
              <CertificationCard key={cert.name} cert={cert} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <Link href="/contato" className={primaryButtonClass}>
          Falar comigo
        </Link>
        <Link href="/projetos" className={secondaryButtonClass}>
          Ver projetos
        </Link>
      </div>
    </Container>
  );
}
