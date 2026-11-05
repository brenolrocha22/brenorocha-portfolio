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

export type NavItem = {
  href: string;
  label: string;
};

/** Main navigation, in display order. "Contato" is rendered as the primary button. */
export const navItems: readonly NavItem[] = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/projetos", label: "Projetos" },
  { href: "/solucoes", label: "Soluções" },
  { href: "/tecnologias", label: "Tecnologias" },
  { href: "/certificacoes", label: "Certificações" },
  { href: "/contato", label: "Contato" },
];

export const contactNavItem: NavItem = { href: "/contato", label: "Contato" };

/** Links shown inline in the desktop header (brand link covers "Início", button covers "Contato"). */
export const headerNavItems: readonly NavItem[] = navItems.filter(
  (item) => item.href !== "/" && item.href !== contactNavItem.href,
);

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
