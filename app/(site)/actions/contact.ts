"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { getMailConfig, sendContactEmail, type MailConfig } from "@/lib/mail/send-contact";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  CONTACT_TIME_TRAP,
  contactSchema,
  type ContactActionState,
  type ContactField,
} from "@/lib/validation/contact";

const RATE_LIMIT = { limit: 3, windowMs: 10 * 60 * 1_000 };

/** Honeypot hits (bots only: the field is invisible to people) get a success-shaped answer. */
function silentSuccess(): ContactActionState {
  return { status: "success", id: randomUUID() };
}

async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headerList.get("x-real-ip")?.trim() || "unknown";
}

function readMailConfig(): MailConfig | null {
  try {
    return getMailConfig();
  } catch {
    // Invalid env values are treated as "not configured": the UI falls back to mailto/LinkedIn.
    console.error("[contato] Variáveis de ambiente do servidor inválidas.");
    return null;
  }
}

export async function sendContact(
  _previous: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  // 1. Honeypot: humans never see this field.
  const honeypot = formData.get("hp_ref_x7");
  if (typeof honeypot === "string" && honeypot.trim() !== "") return silentSuccess();

  // 2. Time trap: elapsed time measured on the client (no clock skew between machines).
  //    Too fast (or missing) looks like a bot, but it could be a person: never claim a
  //    delivery that did not happen → generic "not sent, try again". Too old is likely a real
  //    visitor who left the tab open → ask to resend instead of losing the message.
  //    "success" is only returned after the mail service confirms the send (step 6).
  const elapsed = Number(formData.get("elapsedMs"));
  if (!Number.isFinite(elapsed) || elapsed < CONTACT_TIME_TRAP.minMs) return { status: "error" };
  if (elapsed > CONTACT_TIME_TRAP.maxMs) return { status: "expired" };

  // 3. Validation + sanitization.
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    const fieldErrors: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if ((field === "name" || field === "email" || field === "message") && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return { status: "invalid", fieldErrors };
  }

  // 4. Delivery configured? Without it the form degrades to mailto/LinkedIn (build never depends on env).
  const config = readMailConfig();
  if (!config) return { status: "unavailable" };

  // 5. Rate limit per IP (best-effort in serverless — see lib/rate-limit.ts).
  const ip = await getClientIp();
  if (!checkRateLimit(`contact:${ip}`, RATE_LIMIT).allowed) return { status: "rate_limited" };

  // 6. Send. Internal error details never reach the client.
  const sent = await sendContactEmail(config, parsed.data);
  return sent ? { status: "success", id: randomUUID() } : { status: "error" };
}
