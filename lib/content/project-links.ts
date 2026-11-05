// Pure helpers (no fs): safe to use from client components.
import type { ProjectBadge, ProjectFrontmatter } from "./schemas";

export type GithubRepoRef = { owner: string; repo: string };

/** "https://github.com/<owner>/<repo>" → { owner, repo } (repoUrl is validated by the schema). */
export function parseGithubRepo(url: string): GithubRepoRef | null {
  const [owner, repo] = new URL(url).pathname.split("/").filter(Boolean);
  return owner && repo ? { owner, repo } : null;
}

export function githubRepoUrl(github: GithubRepoRef): string {
  return `https://github.com/${github.owner}/${github.repo}`;
}

/** Badges derived from the content: demo ⇐ demoUrl, testes ⇐ testsCount, docker ⇐ docker. */
export function projectBadgesOf(project: Pick<ProjectFrontmatter, "demoUrl" | "testsCount" | "docker">): ProjectBadge[] {
  const badges: ProjectBadge[] = [];
  if (project.demoUrl) badges.push("demo");
  if (project.testsCount) badges.push("testes");
  if (project.docker) badges.push("docker");
  return badges;
}
