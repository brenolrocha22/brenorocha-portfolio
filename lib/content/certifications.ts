import certificationsData from "@/content/certifications.json";
import { parseContent } from "./load";
import { certificationsSchema, type Certification } from "./schemas";

export type CertificationView = Certification & {
  /** "04/11/2026", "10/2026", "2023", "04/2026 – 05/2026" or "em andamento desde 10/2026". */
  displayDate?: string;
  validationUrl?: string;
  validationLabel?: string;
};

const DIO_CERTIFICATE_BASE = "https://www.dio.me/certificate/";
const E_CERTIFICADO_URL = "https://e-certificado.com";

function formatIsoDate(date: string): string {
  return date.split("-").reverse().join("/");
}

function displayDate(cert: Certification): string | undefined {
  if (!cert.date) return undefined;
  const start = formatIsoDate(cert.date);
  if (cert.inProgress) return `em andamento desde ${start}`;
  if (cert.endDate) return `${start} – ${formatIsoDate(cert.endDate)}`;
  return start;
}

function toView(cert: Certification): CertificationView {
  const validation =
    cert.code && cert.verifyProvider === "dio"
      ? { validationUrl: `${DIO_CERTIFICATE_BASE}${cert.code}`, validationLabel: "Validar na DIO" }
      : cert.code
        ? { validationUrl: E_CERTIFICADO_URL, validationLabel: "Verificar no e-certificado" }
        : {};
  return { ...cert, displayDate: displayDate(cert), ...validation };
}

// Parsed once at module load: invalid content fails the build.
const { certifications } = parseContent(certificationsSchema, certificationsData, "content/certifications.json");
const views = certifications.map(toView);

/** Certifications in file order (validated ones first). */
export function getCertifications(): CertificationView[] {
  return views;
}

/** Sum of hours of certificates with a public validation code (any provider). */
export function validatedHours(): number {
  return certifications.reduce((total, cert) => total + (cert.code ? (cert.hours ?? 0) : 0), 0);
}

/** Sum of every declared course load. */
export function declaredHours(): number {
  return certifications.reduce((total, cert) => total + (cert.hours ?? 0), 0);
}

/** Earliest year among the certificates (start of the study track). */
export function firstStudyYear(): number {
  return Math.min(...certifications.flatMap((cert) => (cert.date ? [Number(cert.date.slice(0, 4))] : [])));
}
