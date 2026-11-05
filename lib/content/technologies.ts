import technologiesData from "@/content/technologies.json";
import { parseContent } from "./load";
import { getProfile } from "./profile";
import { githubRepoUrl } from "./project-links";
import { resolveProjectRefs, type ProjectRef } from "./project-refs";
import { technologiesSchema, type Skill, type SkillLevel } from "./schemas";

const FILE = "content/technologies.json";

export type RepoRef = { name: string; url: string };
export type SkillView = Omit<Skill, "projects" | "repos"> & { projects: ProjectRef[]; repos: RepoRef[] };
export type SkillGroupView = { id: string; title: string; items: SkillView[] };
export type TechnologiesView = { intro: string; groups: SkillGroupView[] };

/** Label and marker per level (design system §3.6: text + shape, never color alone). */
export const skillLevelMeta: Record<
  SkillLevel,
  { label: string; marker: string; description: string; className: string }
> = {
  projetos: {
    label: "Uso em projetos",
    marker: "●●●",
    description: "aparece em projeto público, com link",
    className: "text-success",
  },
  nocoes: {
    label: "Noções",
    marker: "●○○",
    description: "o currículo declara como básico ou noções",
    className: "text-muted-foreground",
  },
  profissional: {
    label: "Experiência profissional",
    marker: "◆",
    description: "prática de trabalho em vendas e atendimento, fora do GitHub",
    className: "text-accent",
  },
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

/** Groups with technical skills (the others are sales/service practice and methods). */
const TECHNICAL_GROUP_IDS = ["dados", "programacao", "ia"] as const;

/** Names of the technical skills declared in content/technologies.json (used by the Person JSON-LD). */
export function getTechnicalSkillNames(): string[] {
  return technologies.groups
    .filter((group) => (TECHNICAL_GROUP_IDS as readonly string[]).includes(group.id))
    .flatMap((group) => group.items.map((item) => item.name));
}
