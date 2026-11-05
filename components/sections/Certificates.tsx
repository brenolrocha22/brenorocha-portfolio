import { BadgeCheck, FileCheck2 } from "lucide-react";
import { ExternalLink } from "@/components/layout/ExternalLink";
import { Reveal } from "@/components/motion/Reveal";
import { CopyButton } from "@/components/ui/CopyButton";
import type { CertificationView } from "@/lib/content/certifications";
import { CertificateThumb } from "./CertificateThumb";

type CertificatesProps = {
  certifications: CertificationView[];
  education: string;
};

function meta(cert: CertificationView): string {
  return [cert.institution, cert.hours ? `${cert.hours} h` : null, cert.displayDate].filter(Boolean).join(" · ");
}

function thumbOf(cert: CertificationView) {
  if (!cert.thumb) return null;
  const alt = `Certificado ${cert.name} — ${cert.institution ?? ""}${cert.hours ? `, ${cert.hours} h` : ""}`;
  return { ...cert.thumb, alt, title: cert.name };
}

/** #certificados (spec §4.4): validated by public code first, then PDF-checked, education and others. */
export function Certificates({ certifications, education }: CertificatesProps) {
  const validated = certifications.filter((cert) => cert.level === "validado");
  const withCertificate = certifications.filter((cert) => cert.level === "com-certificado");
  const others = certifications.filter((cert) => cert.level === "andamento" || cert.level === "outro");

  return (
    <div className="grid gap-12">
      <div>
        <h3 className="flex items-center gap-2 font-mono text-mono-xs text-success uppercase">
          <BadgeCheck aria-hidden="true" className="size-4" />
          Validados por código
        </h3>
        <ul className="mt-5 grid gap-6 md:grid-cols-2">
          {validated.map((cert, index) => {
            const thumb = thumbOf(cert);
            return (
              <Reveal as="li" key={cert.name} index={index}>
                <article className="flex h-full flex-col gap-4 rounded-lg border border-border bg-veil p-5">
                  {thumb ? <CertificateThumb image={thumb} /> : null}
                  <div>
                    <h4 className="flex items-start gap-2 text-h3 font-semibold">
                      <BadgeCheck aria-hidden="true" className="mt-1 size-5 shrink-0 text-success" />
                      {cert.name}
                    </h4>
                    <p className="mt-1 text-small text-muted-foreground">{meta(cert)}</p>
                    {cert.topics ? <p className="mt-1 text-small text-muted-foreground">{cert.topics}</p> : null}
                  </div>
                  {cert.code ? (
                    <div className="mt-auto flex flex-wrap items-center gap-2">
                      <code className="rounded-sm border border-border bg-background px-2 py-1 font-mono text-mono-xs break-all text-foreground">
                        {cert.code}
                      </code>
                      <CopyButton
                        text={cert.code}
                        label={`Copiar código de ${cert.name}`}
                        successMessage="Código copiado."
                        iconOnly
                        className="size-11 rounded-sm text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                      />
                      {cert.validationUrl ? (
                        <ExternalLink
                          href={cert.validationUrl}
                          className="min-h-11 text-small font-medium text-accent underline-offset-4 hover:underline"
                        >
                          {cert.validationLabel}
                        </ExternalLink>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h3 className="flex items-center gap-2 font-mono text-mono-xs text-muted-foreground uppercase">
            <FileCheck2 aria-hidden="true" className="size-4" />
            Com certificado (PDF conferido, sem código público)
          </h3>
          <ul className="mt-5 grid gap-4">
            {withCertificate.map((cert) => {
              const thumb = thumbOf(cert);
              return (
                <li key={cert.name} className="flex flex-col gap-4 rounded-lg border border-border bg-veil p-5 sm:flex-row sm:items-center">
                  {thumb ? (
                    <div className="sm:w-48">
                      <CertificateThumb image={thumb} />
                    </div>
                  ) : null}
                  <div>
                    <h4 className="font-semibold">{cert.name}</h4>
                    <p className="mt-1 text-small text-muted-foreground">{meta(cert)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="grid content-start gap-8">
          <div>
            <h3 className="font-mono text-mono-xs text-muted-foreground uppercase">Formação acadêmica</h3>
            <p className="mt-3 text-body">{education}</p>
          </div>
          <div>
            <h3 className="font-mono text-mono-xs text-muted-foreground uppercase">Em andamento e outros cursos</h3>
            <ul className="mt-3 grid gap-2 text-small">
              {others.map((cert) => (
                <li key={cert.name}>
                  <span className="text-foreground">{cert.name}</span>
                  <span className="text-muted-foreground"> · {meta(cert)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
