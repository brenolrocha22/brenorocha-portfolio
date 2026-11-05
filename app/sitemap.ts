import type { MetadataRoute } from "next";
import { getCaseStudies } from "@/lib/content/projects";
import { absoluteUrl } from "@/lib/site";

/** One-page site: the Home plus the case studies. No `lastModified` until there are real dates (D15). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getCaseStudies(); // drafts excluded
  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({
      url: absoluteUrl(`/projetos/${project.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
