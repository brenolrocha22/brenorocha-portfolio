import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache, type ReactElement } from "react";
import { z } from "zod";
import { compileProjectMdx } from "./mdx";
import { projectFrontmatterSchema, type ProjectBadge, type ProjectFrontmatter } from "./schemas";
import { extractToc, type TocItem } from "./toc";

import { projectBadgesOf } from "./project-links";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

export type Project = ProjectFrontmatter & {
  content: ReactElement;
  toc: TocItem[];
};

/** Serializable card data (safe to pass to client components). */
export type ProjectSummary = ProjectFrontmatter & { badges: ProjectBadge[] };

async function loadProjectFile(fileName: string): Promise<Project> {
  const relativePath = `content/projects/${fileName}`;
  const source = await readFile(path.join(PROJECTS_DIR, fileName), "utf8");

  let compiled;
  try {
    compiled = await compileProjectMdx(source);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`MDX inválido em ${relativePath}: ${reason}`);
  }

  const result = projectFrontmatterSchema.safeParse(compiled.frontmatter);
  if (!result.success) {
    throw new Error(`Conteúdo inválido em ${relativePath}:\n${z.prettifyError(result.error)}`);
  }

  const expectedSlug = fileName.replace(/\.mdx$/, "");
  if (result.data.slug !== expectedSlug) {
    throw new Error(
      `Conteúdo inválido em ${relativePath}: slug "${result.data.slug}" deve ser igual ao nome do arquivo ("${expectedSlug}").`,
    );
  }

  return { ...result.data, content: compiled.content, toc: extractToc(source) };
}

/** All projects, including drafts, validated. Any invalid file fails the build. */
const loadAllProjects = cache(async (): Promise<Project[]> => {
  const files = (await readdir(PROJECTS_DIR)).filter((file) => file.endsWith(".mdx")).sort();
  const projects = await Promise.all(files.map(loadProjectFile));
  return projects.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, "pt-BR"));
});

/** Published projects (no drafts), ordered by `order` (data focus). */
export async function getProjects(): Promise<Project[]> {
  return (await loadAllProjects()).filter((project) => !project.draft);
}

export async function getProjectSummaries(): Promise<ProjectSummary[]> {
  return (await getProjects()).map(toSummary);
}

/** Projects with a case study page (/projetos/<slug>). */
export async function getCaseStudies(): Promise<Project[]> {
  return (await getProjects()).filter((project) => project.caseStudy);
}

export async function getProject(slug: string): Promise<Project | null> {
  return (await getCaseStudies()).find((project) => project.slug === slug) ?? null;
}

export async function getProjectSlugs(): Promise<string[]> {
  return (await getCaseStudies()).map((project) => project.slug);
}

/** Next case study in display order (wraps around), for the "Próximo projeto" link. */
export async function getNextProject(slug: string): Promise<ProjectSummary | null> {
  const projects = await getCaseStudies();
  if (projects.length < 2) return null;
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return null;
  const next = projects[(index + 1) % projects.length];
  return next ? toSummary(next) : null;
}

export function toSummary(project: Project): ProjectSummary {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { content, toc, ...summary } = project;
  return { ...summary, badges: projectBadgesOf(summary) };
}
