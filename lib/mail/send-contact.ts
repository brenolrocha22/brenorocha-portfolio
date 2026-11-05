import "server-only";
import { Resend } from "resend";
import { getServerEnv } from "@/lib/env";
import type { ContactInput, ContactSubject } from "@/lib/validation/contact";

/** Without a verified domain (D11) Resend only accepts this sender. */
const DEFAULT_FROM = "Portfólio Breno Rocha <onboarding@resend.dev>";

const subjectLabels: Record<ContactSubject, string> = {
  vaga: "Vaga/recrutamento",
  solucao: "Projeto/solução",
  outro: "Outro",
};

export type MailConfig = { apiKey: string; to: string; from: string };

/** Returns the mail config, or null when delivery is not configured (fallback mode). */
export function getMailConfig(): MailConfig | null {
  const env = getServerEnv();
  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) return null;
  return {
    apiKey: env.RESEND_API_KEY,
    to: env.CONTACT_TO_EMAIL,
    from: env.CONTACT_FROM_EMAIL ? `Portfólio Breno Rocha <${env.CONTACT_FROM_EMAIL}>` : DEFAULT_FROM,
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactEmail(config: MailConfig, input: ContactInput): Promise<boolean> {
  const subjectLabel = subjectLabels[input.subject];
  const text = [
    `Nome: ${input.name}`,
    `E-mail: ${input.email}`,
    `Assunto: ${subjectLabel}`,
    "",
    input.message,
  ].join("\n");
  const html = `<p><strong>Nome:</strong> ${escapeHtml(input.name)}<br><strong>E-mail:</strong> ${escapeHtml(
    input.email,
  )}<br><strong>Assunto:</strong> ${escapeHtml(subjectLabel)}</p><p style="white-space:pre-wrap">${escapeHtml(
    input.message,
  )}</p>`;

  try {
    const resend = new Resend(config.apiKey);
    const { error } = await resend.emails.send({
      from: config.from,
      to: config.to,
      replyTo: input.email,
      subject: `[Portfólio] ${subjectLabel} — ${input.name}`,
      text,
      html,
    });
    if (error) {
      // Log only the error name/code: never the API key or the visitor's message.
      console.error("[contato] Falha no envio via Resend:", error.name);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[contato] Erro inesperado no envio:", error instanceof Error ? error.name : "unknown");
    return false;
  }
}
