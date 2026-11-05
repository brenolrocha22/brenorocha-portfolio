import technologiesData from "@/content/technologies.json";
import { parseContent } from "./load";
import { getProfile } from "./profile";
import { githubRepoUrl, parseGithubRepo } from "./project-links";
import { getProjectSummaries } from "./projects";
import { resolveProjectRefs, type ProjectRef } from "./project-refs";
import { technologiesSchema, type Skill, type SkillLevel } from "./schemas";

const FILE = "content/technologies.json";

export type RepoRef = { name: string; url: string };
export type SkillView = Omit<Skill, "projects" | "repos"> & { projects: ProjectRef[]; repos: RepoRef[] };
export type SkillGroupView = { id: string; title: string; items: SkillView[] };
export type TechnologiesView = { intro: string; groups: SkillGroupView[] };

/** Label and marker per level (text + shape, never color alone). */
export const skillLevelMeta: Record<SkillLevel, { label: string; marker: string; className: string }> = {
  projetos: { label: "uso em projetos", marker: "●", className: "text-accent" },
  profissional: { label: "experiência profissional", marker: "◐", className: "text-data" },
  nocoes: { label: "noções", marker: "○", className: "text-subtle" },
};

// Parsed once at module load: invalid content fails the build.
const technologies = parseContent(technologiesSchema, technologiesData, FILE);

export async function getTechnologies(): Promise<TechnologiesView> {
  // Repositories without a case study belong to the profile owner (content/profile.json).
  const owner = new URL(getProfile().github).pathname.split("/").filter(Boolean)[0] ?? "";
  const ids = technologies.groups.flatMap((group) => group.items.map((item) => item.id));
  const duplicate = ids.find((id, index) => ids.indexOf(id) !== index);
  if (duplicate) throw new Error(`Conteúdo inválido em ${FILE}: id "${duplicate}" repetido.`);

  const groups = await Promise.all(
    technologies.groups.map(async (group) => ({
      ...group,
      items: await Promise.all(
        group.items.map(async (item) => ({
          ...item,
          projects: await resolveProjectRefs(item.projects, FILE),
          repos: item.repos.map((repo) => ({ name: repo, url: githubRepoUrl({ owner, repo }) })),
        })),
      ),
    })),
  );
  return { intro: technologies.intro, groups };
}

/** Levels actually used in the content, in legend order. */
export function usedSkillLevels(view: TechnologiesView): SkillLevel[] {
  const used = new Set(view.groups.flatMap((group) => group.items.map((item) => item.level)));
  return (Object.keys(skillLevelMeta) as SkillLevel[]).filter((level) => used.has(level));
}

/** Groups with technical skills (the "negocio" group is sales/service practice and methods). */
const TECHNICAL_GROUP_IDS = ["dados-bi", "python", "ia-generativa", "web-ferramentas"] as const;

/** Names of the technical skills declared in content/technologies.json (used by the Person JSON-LD). */
export function getTechnicalSkillNames(): string[] {
  return technologies.groups
    .filter((group) => (TECHNICAL_GROUP_IDS as readonly string[]).includes(group.id))
    .flatMap((group) => group.items.map((item) => item.name));
}

export type TechIndex = Record<string, { name: string; slugs: string[] }>;

/**
 * Technology id → projects (rendered on the page) that prove it: case-study slugs plus
 * projects whose repository is listed in `repos`. Only technologies with ≥ 1 project.
 */
export async function getTechIndex(): Promise<TechIndex> {
  const projects = await getProjectSummaries();
  const slugByRepo = new Map(
    projects.flatMap((project) => {
      const repo = project.repoUrl ? parseGithubRepo(project.repoUrl) : null;
      return repo ? [[repo.repo.toLowerCase(), project.slug] as const] : [];
    }),
  );
  const known = new Set(projects.map((project) => project.slug));
  const index: TechIndex = {};
  for (const item of technologies.groups.flatMap((group) => group.items)) {
    const slugs = new Set(item.projects.filter((slug) => known.has(slug)));
    for (const repo of item.repos) {
      const slug = slugByRepo.get(repo.toLowerCase());
      if (slug) slugs.add(slug);
    }
    if (slugs.size > 0) index[item.id] = { name: item.name, slugs: [...slugs] };
  }
  return index;
}

/** Display name of a technology id (hero chips). */
export function technologyName(id: string): string | undefined {
  return technologies.groups.flatMap((group) => group.items).find((item) => item.id === id)?.name;
}
