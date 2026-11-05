import { Languages, MessagesSquare, Target, Workflow } from "lucide-react";
import { SectionTracker } from "@/components/chrome/SectionTracker";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectExplorer } from "@/components/project/ProjectExplorer";
import { Certificates } from "@/components/sections/Certificates";
import { ContactSection } from "@/components/sections/ContactSection";
import { DataStories, type DataStoryView } from "@/components/sections/DataStories";
import { DualTimeline } from "@/components/sections/DualTimeline";
import { Hero } from "@/components/sections/Hero";
import { Section } from "@/components/sections/Section";
import { TechChips } from "@/components/sections/TechChips";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAboutContent } from "@/lib/content/about";
import { declaredHours, getCertifications, validatedHours } from "@/lib/content/certifications";
import { getContactContent } from "@/lib/content/contact";
import { getDataStories } from "@/lib/content/data-stories";
import { getHomeContent } from "@/lib/content/home";
import { getProfile } from "@/lib/content/profile";
import { parseFilters } from "@/lib/content/project-filters";
import { getProjectSummaries } from "@/lib/content/projects";
import { getProofTiles, type Focus } from "@/lib/content/proof";
import { projectBadges, projectLanguages, projectStorages, projectTypes } from "@/lib/content/schemas";
import { getSolutions } from "@/lib/content/solutions";
import { getTechIndex, getTechnologies, skillLevelMeta } from "@/lib/content/technologies";
import { pageMetadata } from "@/lib/seo/metadata";
import { personJsonLd } from "@/lib/seo/person";

const description =
  "Breno Rocha, Analista de Dados Júnior em Recife/PE: dashboards em Excel, Power BI e Python, SQL e projetos com código aberto. Também Desenvolvedor Júnior.";

export const metadata = pageMetadata({
  title: "Breno Rocha | Analista de Dados Júnior",
  absoluteTitle: true,
  description,
  path: "/",
});

type HomeProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const transferIcons = { target: Target, funnel: Workflow, message: MessagesSquare, languages: Languages } as const;

export default async function HomePage({ searchParams }: HomeProps) {
  const params = await searchParams;
  const focus: Focus = params.foco === "dev" ? "dev" : "dados";

  const home = getHomeContent();
  const profile = getProfile();
  const about = getAboutContent();
  const [projects, tiles, techIndex, technologies, solutions] = await Promise.all([
    getProjectSummaries(),
    getProofTiles(focus),
    getTechIndex(),
    getTechnologies(),
    getSolutions(),
  ]);

  const bySlug = new Map(projects.map((project) => [project.slug, project]));
  const stories: DataStoryView[] = getDataStories().map((story) => {
    const project = bySlug.get(story.project);
    return {
      ...story,
      links: {
        demoUrl: project?.demoUrl,
        caseStudyHref: project?.caseStudy ? `/projetos/${project.slug}` : undefined,
        repoUrl: project?.repoUrl,
      },
    };
  });

  const initialFilters = parseFilters(params, {
    types: projectTypes,
    languages: projectLanguages,
    storages: projectStorages,
    badges: projectBadges,
    techIds: Object.keys(techIndex),
  });

  const publicRepos = projects.filter((project) => project.repoUrl).length;
  const timeline = about.timeline.map((item) => ({
    ...item,
    text: item.text.replace("{publicRepos}", String(publicRepos)),
  }));

  const techGroups = technologies.groups.map((group) => ({
    id: group.id,
    title: group.title,
    items: group.items.map((item) => ({
      id: item.id,
      name: item.name,
      detail: item.detail,
      level: item.level,
      proven: Boolean(techIndex[item.id]),
    })),
  }));

  const explorerProjects = projects.map((project) => ({
    slug: project.slug,
    title: project.title,
    cardTitle: project.cardTitle,
    problem: project.problem,
    proof: project.proof,
    types: project.types,
    languages: project.languages,
    storage: project.storage,
    badges: project.badges,
    cover: project.cover,
    caseStudy: project.caseStudy,
    repoUrl: project.repoUrl,
    demoUrl: project.demoUrl,
    status: project.status,
    order: project.order,
    orderDev: project.orderDev,
  }));

  const sectionsCopy = home.sections;

  return (
    <>
      <JsonLd data={personJsonLd(profile)} />
      <SectionTracker />

      <Hero content={home.hero} profile={profile} focus={focus} tiles={tiles} />

      <Section id="dados" copy={sectionsCopy.dados}>
        <DataStories stories={stories} />
      </Section>

      <Section id="projetos" copy={sectionsCopy.projetos}>
        <ProjectExplorer projects={explorerProjects} focus={focus} initial={initialFilters} techIndex={techIndex} />
      </Section>

      <Section id="trajetoria" copy={sectionsCopy.trajetoria}>
        <DualTimeline items={timeline} />
        <div className="mt-16">
          <h3 className="font-serif text-h1">{about.transfer.title}</h3>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {about.transfer.items.map((item, index) => {
              const Icon = transferIcons[item.icon];
              return (
                <Reveal as="li" key={item.title} index={index} className="rounded-lg border border-border bg-veil p-5">
                  <Icon aria-hidden="true" className="size-5 text-accent" />
                  <h4 className="mt-3 font-semibold">{item.title}</h4>
                  <p className="mt-1 text-small text-muted-foreground">{item.text}</p>
                </Reveal>
              );
            })}
          </ul>
          <p className="mt-6 text-small text-muted-foreground">{getContactContent().availability}</p>
        </div>
      </Section>

      <Section
        id="certificados"
        copy={sectionsCopy.certificados}
        aside={
          <p className="font-mono text-mono-xs text-muted-foreground uppercase">
            <span className="text-foreground">{validatedHours()} h</span> validadas por código ·{" "}
            <span className="text-foreground">{declaredHours()} h</span> de cursos com carga declarada
          </p>
        }
      >
        <Certificates certifications={getCertifications()} education={about.education} />
      </Section>

      <Section id="tecnologias" copy={sectionsCopy.tecnologias}>
        <TechChips groups={techGroups} levels={skillLevelMeta} focusQuery={focus === "dev" ? "?foco=dev" : ""} />
      </Section>

      <Section id="contato" copy={sectionsCopy.contato} className="pb-28">
        <ContactSection profile={profile} contact={getContactContent()} solutions={solutions.solutions} />
      </Section>
    </>
  );
}
