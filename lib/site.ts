import { publicEnv } from "./env";

/**
 * Vercel system variable (server only), e.g. "meu-site.vercel.app". Fallback so a
 * production build without NEXT_PUBLIC_SITE_URL never publishes localhost canonicals.
 */
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined;

export const siteConfig = {
  name: "Breno Rocha | Tech & Data",
  shortName: "Breno Rocha",
  description:
    "Portfólio de Breno Lins Rocha: transformando conhecimento, dados e tecnologia em soluções para problemas reais.",
  locale: "pt_BR",
  /**
   * Canonical base URL (D11: *.vercel.app for now), without trailing slash.
   * NEXT_PUBLIC_SITE_URL → Vercel production domain → localhost.
   */
  url: (publicEnv.NEXT_PUBLIC_SITE_URL ?? vercelProductionUrl ?? "http://localhost:3000").replace(
    /\/+$/,
    "",
  ),
} as const;

/** Only Vercel production deployments may be indexed (previews and local builds are not). */
export const isIndexable = process.env.VERCEL_ENV === "production";

/** Builds an absolute URL from a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, `${siteConfig.url}/`).toString();
}

/** One-page sections in DOM order (D23/D25 + Orquestrador: Dados before Projetos). */
export const sections = [
  { id: "inicio", label: "Início", index: "" },
  { id: "dados", label: "Dados", index: "01" },
  { id: "projetos", label: "Projetos", index: "02" },
  { id: "trajetoria", label: "Trajetória", index: "03" },
  { id: "certificados", label: "Certificados", index: "04" },
  { id: "tecnologias", label: "Tecnologias", index: "05" },
  { id: "contato", label: "Contato", index: "06" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const sectionIds: readonly SectionId[] = sections.map((section) => section.id);

/** Header links (the brand covers "Início"; "Contato" is the highlighted button). */
export const navSections = sections.filter((section) => section.id !== "inicio" && section.id !== "contato");

export function sectionLabel(id: SectionId | null): string {
  return sections.find((section) => section.id === id)?.label ?? "";
}

/** Public repository of this site (footer, D5). */
export const siteRepoUrl = "https://github.com/brenolrocha22/brenorocha-portfolio";
