import type { ReactNode } from "react";
import { getRepoStats, type GithubRepoRef } from "@/lib/github";
import { TechBadge } from "./TechBadge";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "America/Recife",
});

const numberFormatter = new Intl.NumberFormat("pt-BR");

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
      <dt className="font-mono text-mono-xs text-muted-foreground uppercase">{label}</dt>
      <dd className="text-small text-data">{children}</dd>
    </div>
  );
}

/**
 * Dynamic badges from the GitHub API (revalidated every 24 h).
 * Renders nothing when the API is unavailable, so the page never depends on it.
 */
export async function GithubStats({ repo }: { repo: GithubRepoRef }) {
  const stats = await getRepoStats(repo);
  if (!stats) return null;

  const hasContent =
    stats.pushedAt !== null || stats.languages.length > 0 || stats.stars > 0 || stats.license !== null;
  if (!hasContent) return null;

  return (
    <dl aria-label="Dados do repositório no GitHub" className="divide-y divide-border border-t border-border">
      {stats.pushedAt ? (
        <Row label="Atualizado">
          <time dateTime={stats.pushedAt} className="font-mono">
            {dateFormatter.format(new Date(stats.pushedAt))}
          </time>
        </Row>
      ) : null}
      {stats.languages.length > 0 ? (
        <Row label="Linguagens">
          <ul className="flex flex-wrap gap-2">
            {stats.languages.map((language) => (
              <li key={language.name}>
                <TechBadge variant="data">
                  {language.name} {language.percent < 1 ? "<1" : language.percent}%
                </TechBadge>
              </li>
            ))}
          </ul>
        </Row>
      ) : null}
      {stats.stars > 0 ? (
        <Row label="Estrelas">
          <span className="font-mono">{numberFormatter.format(stats.stars)}</span>
        </Row>
      ) : null}
      {stats.license ? (
        <Row label="Licença">
          <span className="font-mono">{stats.license}</span>
        </Row>
      ) : null}
    </dl>
  );
}
