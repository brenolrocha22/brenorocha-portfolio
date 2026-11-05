import { Container } from "@/components/layout/Container";
import { ProjectFilter } from "@/components/project/ProjectFilter";
import { PageHeader } from "@/components/layout/PageHeader";
import { navIndex } from "@/lib/site";
import { getProjectSummaries } from "@/lib/content/projects";
import { pageMetadata } from "@/lib/seo/metadata";

const description =
  "Projetos de dados, IA, machine learning e apps com problema real, código aberto e limitações ditas.";

export const metadata = pageMetadata({ title: "Projetos", description, path: "/projetos" });

export default async function ProjectsPage() {
  const projects = await getProjectSummaries();

  return (
    <Container className="py-16 lg:py-24">
      <PageHeader
        index={navIndex("/projetos")}
        eyebrow="Projetos"
        title="Projetos com problema real, código aberto e limitações ditas."
        intro="Cada estudo de caso mostra o problema, a solução, a stack, os números conferidos no repositório e o que ainda falta."
      />

      <ProjectFilter projects={projects} />
    </Container>
  );
}
