import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content/projects";
import { absoluteUrl, navItems } from "@/lib/site";

/** No `lastModified` until projects have real dates (D15: never invent dates). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = navItems.map((item) => ({
    url: absoluteUrl(item.href),
    changeFrequency: "monthly",
    priority: item.href === "/" ? 1 : item.href === "/projetos" ? 0.9 : 0.7,
  }));

  const projects = await getProjects(); // drafts excluded
  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: absoluteUrl(`/projetos/${project.slug}`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes];
}
