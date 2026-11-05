import { getProjects } from "./projects";

export type ProjectRef = { slug: string; title: string };

/**
 * Resolves case-study slugs referenced by other content files. An unknown or draft
 * slug throws, so a broken cross-link fails the build instead of rendering a 404 link.
 */
export async function resolveProjectRefs(slugs: readonly string[], file: string): Promise<ProjectRef[]> {
  const projects = await getProjects();
  return slugs.map((slug) => {
    const project = projects.find((item) => item.slug === slug);
    if (!project) {
      throw new Error(`Conteúdo inválido em ${file}: projeto "${slug}" não existe em content/projects.`);
    }
    return { slug: project.slug, title: project.title };
  });
}
