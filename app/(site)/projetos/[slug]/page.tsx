import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ExternalLink } from "@/components/layout/ExternalLink";
import { GithubStats } from "@/components/project/GithubStats";
import { MetricList } from "@/components/project/MetricList";
import { ProjectFacts } from "@/components/project/ProjectFacts";
import { TableOfContents } from "@/components/project/TableOfContents";
import {
  eyebrowClass,
  ghostLinkClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/project/styles";
import { categoryLabels, projectCategoriesOf } from "@/lib/content/categories";
import { getNextProject, getProject, getProjectSlugs, githubRepoUrl } from "@/lib/content/projects";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { projectBreadcrumbJsonLd, projectJsonLd } from "@/lib/seo/project";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

// Unknown slugs → 404 (no on-demand rendering).
export const dynamicParams = false;

// ISR: pre-rendered at build, regenerated at most once a day (GitHub badges).
export const revalidate = 86400;

export async function generateStaticParams() {
  return (await getProjectSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};

  // Social image: opengraph-image.tsx in this folder (file convention).
  return pageMetadata({
    title: project.title,
    description: project.summary,
    path: `/projetos/${project.slug}`,
    type: "article",
    defaultSocialImage: false,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const nextProject = await getNextProject(project.slug);
  const categories = projectCategoriesOf(project)
    .map((category) => categoryLabels[category])
    .join(" · ");

  return (
    <article>
      <JsonLd data={projectJsonLd(project)} />
      <JsonLd data={projectBreadcrumbJsonLd(project)} />
      <Container className="pt-10 pb-12 lg:pt-16">
        <nav aria-label="Trilha de navegação">
          <ol className="flex flex-wrap items-center gap-2 text-small text-muted-foreground">
            <li>
              <Link
                href="/projetos"
                className="inline-flex min-h-11 items-center gap-1 transition-colors duration-150 hover:text-foreground"
              >
                <ArrowLeft aria-hidden="true" className="size-4" />
                Projetos
              </Link>
            </li>
            <li aria-hidden="true" className="hidden sm:block">
              /
            </li>
            <li aria-current="page" className="hidden text-foreground sm:block">
              {project.title}
            </li>
          </ol>
        </nav>

        <p className={`mt-6 ${eyebrowClass}`}>{categories}</p>
        <h1 className="mt-3 max-w-4xl text-h1 font-semibold text-balance">{project.title}</h1>
        <p className="mt-4 max-w-measure text-body-lg text-muted-foreground">{project.summary}</p>

        {project.github || project.demoUrl ? (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {project.github ? (
              <ExternalLink href={githubRepoUrl(project.github)} className={primaryButtonClass}>
                Ver código
              </ExternalLink>
            ) : null}
            {project.demoUrl ? (
              <ExternalLink href={project.demoUrl} className={secondaryButtonClass}>
                Ver demo
              </ExternalLink>
            ) : null}
            {project.extraDemos.map((demo) => (
              <ExternalLink key={demo.url} href={demo.url} className={secondaryButtonClass}>
                Ver demo ({demo.label})
              </ExternalLink>
            ))}
          </div>
        ) : null}

        <div className="mt-10">
          <ProjectFacts
            project={project}
            githubStats={project.github ? <GithubStats repo={project.github} /> : undefined}
          />
        </div>

        <MetricList metrics={project.metrics} />
      </Container>

      <Container className="grid gap-8 border-t border-border pt-12 pb-16 lg:grid-cols-[14rem_1fr] lg:gap-12">
        <aside>
          <TableOfContents items={project.toc} />
        </aside>
        <div className="max-w-measure">{project.content}</div>
      </Container>

      <Container className="pb-20">
        <div className="flex flex-col gap-6 rounded-lg border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <p className="font-medium">Gostou da abordagem?</p>
            <Link href="/contato" className={primaryButtonClass}>
              Falar comigo
            </Link>
          </div>
          {nextProject ? (
            <Link href={`/projetos/${nextProject.slug}`} className={ghostLinkClass}>
              Próximo projeto: {nextProject.title}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          ) : null}
        </div>
      </Container>
    </article>
  );
}
