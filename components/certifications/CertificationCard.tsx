import { ExternalLink } from "@/components/layout/ExternalLink";
import type { CertificationView } from "@/lib/content/certifications";

/** Certification card (design system §3.7). Unknown fields are omitted, never guessed. */
export function CertificationCard({ cert }: { cert: CertificationView }) {
  const meta = [
    cert.institution,
    cert.displayDate ? (
      cert.inProgress || cert.endDate ? (
        cert.displayDate
      ) : (
        <time key="date" dateTime={cert.date}>
          {cert.displayDate}
        </time>
      )
    ) : null,
    cert.hours ? `${cert.hours} h` : null,
  ].filter(Boolean);

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-6">
      {meta.length > 0 ? (
        <p className="font-mono text-mono-xs text-muted-foreground uppercase">
          {meta.map((item, index) => (
            <span key={index}>
              {index > 0 ? " · " : null}
              {item}
            </span>
          ))}
        </p>
      ) : null}
      <h3 className="text-h3 font-semibold text-balance">{cert.name}</h3>
      <div className="mt-auto pt-2">
        {cert.code && cert.validationUrl ? (
          <p className="flex flex-wrap items-center gap-x-4 font-mono text-small">
            <span>
              <span className="text-muted-foreground">Código </span>
              <span className="text-data">{cert.code}</span>
            </span>
            <ExternalLink
              href={cert.validationUrl}
              className="min-h-11 font-sans font-medium text-accent underline-offset-4 hover:underline"
            >
              Validar<span className="sr-only"> o certificado {cert.name} na DIO</span>
            </ExternalLink>
          </p>
        ) : (
          <p className="text-small text-muted-foreground">Validação: não disponível</p>
        )}
      </div>
    </article>
  );
}
