import "server-only";
import { z } from "zod";
import { getServerEnv } from "@/lib/env";

const API_BASE = "https://api.github.com";
/** Revalidate GitHub data once a day (technical-architecture §4). */
export const GITHUB_REVALIDATE_SECONDS = 86400;
const TIMEOUT_MS = 5000;
const TOP_LANGUAGES = 3;
const USER_AGENT = "breno-rocha-tech-data-portfolio";

const repoNameSchema = z.string().regex(/^[A-Za-z0-9._-]+$/);

const repoResponseSchema = z.object({
  stargazers_count: z.number().int().nonnegative(),
  pushed_at: z.iso.datetime({ offset: true }).nullable(),
  license: z.object({ spdx_id: z.string().nullable(), name: z.string() }).nullable(),
});

const languagesResponseSchema = z.record(z.string(), z.number().nonnegative());

export type RepoLanguage = { name: string; percent: number };

export type RepoStats = {
  /** ISO timestamp of the last push, or null when the repository is empty. */
  pushedAt: string | null;
  stars: number;
  /** SPDX id (e.g. "MIT") or license name; null when there is no recognized license. */
  license: string | null;
  /** Top languages by bytes, percent of the repository total (0–100, integer). */
  languages: RepoLanguage[];
};

export type GithubRepoRef = { owner: string; repo: string };

function buildHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": USER_AGENT,
  };
  try {
    const token = getServerEnv().GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;
  } catch {
    // Invalid unrelated env vars must not break the page: continue unauthenticated.
  }
  return headers;
}

async function fetchJson(path: string, headers: HeadersInit): Promise<unknown> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers,
    signal: AbortSignal.timeout(TIMEOUT_MS),
    next: { revalidate: GITHUB_REVALIDATE_SECONDS, tags: ["github"] },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} em ${path}`);
  }
  return response.json();
}

function topLanguages(bytesByLanguage: Record<string, number>): RepoLanguage[] {
  const total = Object.values(bytesByLanguage).reduce((sum, bytes) => sum + bytes, 0);
  if (total === 0) return [];
  return Object.entries(bytesByLanguage)
    .sort(([, a], [, b]) => b - a)
    .slice(0, TOP_LANGUAGES)
    .map(([name, bytes]) => ({ name, percent: Math.round((bytes / total) * 100) }));
}

function normalizeLicense(license: z.infer<typeof repoResponseSchema>["license"]): string | null {
  if (!license) return null;
  if (license.spdx_id && license.spdx_id !== "NOASSERTION") return license.spdx_id;
  return license.name === "Other" ? null : license.name;
}

/**
 * Public data of one repository declared in a project's frontmatter.
 * Never throws: any failure (network, rate limit, 404, timeout, unexpected schema)
 * returns null and the page renders without the dynamic badges.
 */
export async function getRepoStats({ owner, repo }: GithubRepoRef): Promise<RepoStats | null> {
  if (!repoNameSchema.safeParse(owner).success || !repoNameSchema.safeParse(repo).success) {
    console.error(`[github] owner/repo inválido: ${owner}/${repo}`);
    return null;
  }

  const base = `/repos/${owner}/${repo}`;
  try {
    const headers = buildHeaders();
    const [repoJson, languagesJson] = await Promise.all([
      fetchJson(base, headers),
      fetchJson(`${base}/languages`, headers),
    ]);
    const repoData = repoResponseSchema.parse(repoJson);
    const languages = languagesResponseSchema.parse(languagesJson);

    return {
      pushedAt: repoData.pushed_at,
      stars: repoData.stargazers_count,
      license: normalizeLicense(repoData.license),
      languages: topLanguages(languages),
    };
  } catch (error) {
    const reason = error instanceof Error ? `${error.name}: ${error.message}` : "erro desconhecido";
    console.error(`[github] sem dados para ${owner}/${repo} (${reason}); selos omitidos.`);
    return null;
  }
}
