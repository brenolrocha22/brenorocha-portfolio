// Pure helpers (no fs): safe to use from client components.

export function githubRepoUrl(github: { owner: string; repo: string }): string {
  return `https://github.com/${github.owner}/${github.repo}`;
}
