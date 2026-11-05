import certificationsData from "@/content/certifications.json";
import { parseContent } from "./load";
import { certificationsSchema, type Certification } from "./schemas";

export type CertificationView = Certification & {
  /** "04/11/2026", "10/2026", "2023", "04/2026 – 05/2026" or "em andamento desde 10/2026". */
  displayDate?: string;
  validationUrl?: string;
};

const DIO_CERTIFICATE_BASE = "https://www.dio.me/certificate/";

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
  return {
    ...cert,
    displayDate: displayDate(cert),
    validationUrl: cert.code ? `${DIO_CERTIFICATE_BASE}${cert.code}` : undefined,
  };
}

// Parsed once at module load: invalid content fails the build.
const { certifications, ...header } = parseContent(
  certificationsSchema,
  certificationsData,
  "content/certifications.json",
);
const views = certifications.map(toView);

export function getCertificationsHeader(): { title: string; intro: string } {
  return header;
}

/** Certifications in file order (validated ones first). */
export function getCertifications(): CertificationView[] {
  return views;
}
