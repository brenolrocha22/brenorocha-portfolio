import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SectionLink } from "@/components/chrome/SectionLink";
import { SectionTracker } from "@/components/chrome/SectionTracker";
import { Container } from "@/components/layout/Container";
import { ExternalLink } from "@/components/layout/ExternalLink";
import { BackToProjects } from "@/components/project/BackToProjects";
import { GithubStats } from "@/components/project/GithubStats";
import { MetricList } from "@/components/project/MetricList";
import { ProjectFacts } from "@/components/project/ProjectFacts";
import { TableOfContents } from "@/components/project/TableOfContents";
import {
  eyebrowClass,
  ghostLinkClass,
  pageTitleClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/project/styles";
import { JsonLd } from "@/components/seo/JsonLd";
import { typeLabels } from "@/lib/content/project-filters";
import { parseGithubRepo } from "@/lib/content/project-links";
import { getNextProject, getProject, getProjectSlugs } from "@/lib/content/projects";
import { pageMetadata } from "@/lib/seo/metadata";
import { projectBreadcrumbJsonLd, projectJsonLd } from "@/lib/seo/project";
import { cn } from "@/lib/utils";

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
  const repo = project.repoUrl ? parseGithubRepo(project.repoUrl) : null;
  const cover = "typographic" in project.cover ? null : project.cover;

  return (
    <article className="page-enter">
      <SectionTracker fixed="projetos" />
      <JsonLd data={projectJsonLd(project)} />
      <JsonLd data={projectBreadcrumbJsonLd(project)} />
      <Container className="pt-10 pb-12 lg:pt-16">
        <nav aria-label="Trilha de navegação">
          <BackToProjects className="inline-flex min-h-11 items-center gap-1 text-small text-muted-foreground transition-colors duration-(--duration-fast) hover:text-foreground" />
        </nav>

        <p className={`mt-6 ${eyebrowClass}`}>{project.types.map((type) => typeLabels[type]).join(" · ")}</p>
        <h1 className={`mt-4 max-w-4xl ${pageTitleClass}`}>{project.title}</h1>
        <p className="mt-4 max-w-measure text-body-lg text-muted-foreground">{project.summary}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {project.demoUrl ? (
            <ExternalLink href={project.demoUrl} className={primaryButtonClass}>
              Abrir demo
            </ExternalLink>
          ) : null}
          {project.extraDemos.map((demo) => (
            <ExternalLink key={demo.url} href={demo.url} className={secondaryButtonClass}>
              Abrir demo ({demo.label})
            </ExternalLink>
          ))}
          {project.repoUrl ? (
            <ExternalLink href={project.repoUrl} className={project.demoUrl ? secondaryButtonClass : primaryButtonClass}>
              Ver código
            </ExternalLink>
          ) : null}
        </div>

        {cover ? (
          <div
            className={cn(
              "mt-10 overflow-hidden rounded-lg border border-border",
              cover.mat === "paper" ? "bg-paper p-4" : "bg-surface",
            )}
          >
            <Image
              src={cover.src}
              alt={cover.alt}
              width={cover.width}
              height={cover.height}
              sizes="(min-width: 1152px) 1088px, 100vw"
              preload
              className="mx-auto h-auto max-h-[70svh] w-auto"
            />
          </div>
        ) : null}

        <div className="mt-10">
          <ProjectFacts project={project} githubStats={repo ? <GithubStats repo={repo} /> : undefined} />
        </div>

        <MetricList metrics={project.metrics} />
      </Container>

      <Container className="grid gap-8 border-t border-border pt-12 pb-16 lg:grid-cols-[14rem_1fr] lg:gap-12">
        <aside>
          <TableOfContents items={project.toc} />
        </aside>
        <div className="max-w-measure">{project.content}</div>
      </Container>

      {project.gallery.length > 0 ? (
        <Container className="pb-16">
          <h2 className="font-serif text-h1">Imagens</h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-2">
            {project.gallery.map((image) => (
              <li key={image.src}>
                <figure className="overflow-hidden rounded-lg border border-border bg-surface">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes="(min-width: 768px) 540px, 100vw"
                    className="mx-auto h-auto max-h-[60svh] w-auto"
                  />
                  <figcaption className="border-t border-border px-4 py-3 text-small text-muted-foreground">
                    {image.caption}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Container>
      ) : null}

      <Container className="pb-20">
        <div className="flex flex-col gap-6 rounded-lg border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <p className="font-medium">Gostou da abordagem?</p>
            <SectionLink section="contato" className={primaryButtonClass}>
              Falar comigo
            </SectionLink>
          </div>
          {nextProject ? (
            <Link href={`/projetos/${nextProject.slug}`} className={ghostLinkClass}>
              Próximo estudo de caso: {nextProject.title}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          ) : null}
        </div>
      </Container>
    </article>
  );
}
