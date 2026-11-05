import type { ProjectCategory } from "./schemas";

export const categoryLabels: Record<ProjectCategory, string> = {
  ia: "IA",
  dados: "Dados",
  ml: "Machine learning",
  web: "Apps",
  automacao: "Automação",
};

/** Display order of the filter buttons. */
export const categoryOrder: readonly ProjectCategory[] = ["ia", "dados", "ml", "web", "automacao"];

export function projectCategoriesOf(project: {
  category: ProjectCategory;
  extraCategories: readonly ProjectCategory[];
}): ProjectCategory[] {
  return [project.category, ...project.extraCategories.filter((c) => c !== project.category)];
}
