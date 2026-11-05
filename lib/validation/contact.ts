import { z } from "zod";

/** Subject values accepted by the form and by `?assunto=` (design system §3.10). */
export const contactSubjects = ["vaga", "solucao", "outro"] as const;
export type ContactSubject = (typeof contactSubjects)[number];
export const defaultContactSubject: ContactSubject = "vaga";

export function isContactSubject(value: unknown): value is ContactSubject {
  return typeof value === "string" && (contactSubjects as readonly string[]).includes(value);
}

export const CONTACT_LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 120 },
  message: { min: 20, max: 2000 },
} as const;

/**
 * Anti-spam time trap: submissions faster than the minimum are dropped silently; older
 * than the max get an "expired" answer so a real visitor can resend (text is kept).
 */
export const CONTACT_TIME_TRAP = { minMs: 3_000, maxMs: 2 * 60 * 60 * 1_000 } as const;

/**
 * Removes control characters (keeping line breaks in multi-line text), normalizes
 * line endings and trims. Single-line values also lose CR/LF (no header injection).
 */
export function sanitizeText(value: string, { multiline = false } = {}): string {
  const normalized = value.replace(/\r\n?/g, "\n").normalize("NFC");
  const stripped = multiline
    ? normalized.replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "")
    : normalized.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ");
  return stripped.trim();
}

const text = (multiline = false) =>
  z.preprocess((value) => (typeof value === "string" ? sanitizeText(value, { multiline }) : ""), z.string());

export const contactSchema = z.object({
  name: text().pipe(
    z
      .string()
      .min(CONTACT_LIMITS.name.min, "Informe seu nome (mínimo de 2 caracteres).")
      .max(CONTACT_LIMITS.name.max, "O nome pode ter até 80 caracteres."),
  ),
  email: text().pipe(
    z
      .string()
      .min(1, "Informe seu e-mail.")
      .max(CONTACT_LIMITS.email.max, "O e-mail pode ter até 120 caracteres.")
      .pipe(z.email("Informe um e-mail válido, como nome@exemplo.com.")),
  ),
  subject: z.preprocess(
    (value) => (isContactSubject(value) ? value : defaultContactSubject),
    z.enum(contactSubjects),
  ),
  message: text(true).pipe(
    z
      .string()
      .min(CONTACT_LIMITS.message.min, "Escreva uma mensagem com pelo menos 20 caracteres.")
      .max(CONTACT_LIMITS.message.max, "A mensagem pode ter até 2.000 caracteres."),
  ),
});

export type ContactInput = z.output<typeof contactSchema>;
export type ContactField = "name" | "email" | "message";

export type ContactActionState =
  | { status: "idle" }
  | { status: "success"; id: string }
  | { status: "invalid"; fieldErrors: Partial<Record<ContactField, string>> }
  /** Form open longer than CONTACT_TIME_TRAP.maxMs: nothing sent, visitor asked to resend. */
  | { status: "expired" }
  /** Mail delivery is not configured (no RESEND_API_KEY / CONTACT_TO_EMAIL). */
  | { status: "unavailable" }
  | { status: "rate_limited" }
  | { status: "error" };

export const initialContactState: ContactActionState = { status: "idle" };
