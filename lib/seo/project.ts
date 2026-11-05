import type { Project } from "@/lib/content/projects";
import { absoluteUrl } from "@/lib/site";
import { personId } from "./person";

/** SoftwareSourceCode when there is a public repo; CreativeWork otherwise. No dates until they are known. */
export function projectJsonLd(project: Project) {
  const url = absoluteUrl(`/projetos/${project.slug}`);
  const base = {
    "@context": "https://schema.org",
    "@type": project.repoUrl ? "SoftwareSourceCode" : "CreativeWork",
    "@id": `${url}#project`,
    name: project.title,
    description: project.summary,
    url,
    inLanguage: "pt-BR",
    // `stack` mixes languages, libraries and tools, so it is exposed as keywords.
    keywords: project.stack.join(", "),
    author: { "@id": personId() },
  };

  if (!project.repoUrl) return base;

  return {
    ...base,
    codeRepository: project.repoUrl,
    ...(project.demoUrl
      ? { sameAs: [project.demoUrl, ...project.extraDemos.map((demo) => demo.url)] }
      : {}),
  };
}

export function projectBreadcrumbJsonLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Projetos", item: absoluteUrl("/#projetos") },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: absoluteUrl(`/projetos/${project.slug}`),
      },
    ],
  };
}
