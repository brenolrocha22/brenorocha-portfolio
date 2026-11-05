import { z } from "zod";

/** Treats empty strings (as in a copied .env.example) as "not set". */
const optionalString = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().optional(),
);

const optionalUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.url().optional(),
);

const optionalEmail = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.email().optional(),
);

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: optionalUrl,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: optionalString,
});

const serverSchema = z.object({
  RESEND_API_KEY: optionalString,
  CONTACT_TO_EMAIL: optionalEmail,
  CONTACT_FROM_EMAIL: optionalEmail,
  GITHUB_TOKEN: optionalString,
  TURNSTILE_SECRET_KEY: optionalString,
  UPSTASH_REDIS_REST_URL: optionalUrl,
  UPSTASH_REDIS_REST_TOKEN: optionalString,
});

function formatEnvError(scope: string, error: z.ZodError): Error {
  return new Error(`Variáveis de ambiente inválidas (${scope}):\n${z.prettifyError(error)}`);
}

function parsePublicEnv() {
  // NEXT_PUBLIC_* must be referenced literally so Next.js can inline them in client bundles.
  const result = publicSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  });
  if (!result.success) throw formatEnvError("públicas", result.error);
  return result.data;
}

/** Public variables: safe to import anywhere. Missing optional values disable features, never the build. */
export const publicEnv = parsePublicEnv();

export type ServerEnv = z.infer<typeof serverSchema>;

/**
 * Server-only variables. Exposed as a function (not a module constant) so importing
 * this file from a client component never evaluates or bundles server secrets.
 */
export function getServerEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() só pode ser chamado no servidor.");
  }
  const result = serverSchema.safeParse(process.env);
  if (!result.success) throw formatEnvError("servidor", result.error);
  return result.data;
}
