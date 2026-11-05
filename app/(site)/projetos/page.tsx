import { Container } from "@/components/layout/Container";
import { ProjectFilter } from "@/components/project/ProjectFilter";
import { eyebrowClass } from "@/components/project/styles";
import { getProjectSummaries } from "@/lib/content/projects";
import { pageMetadata } from "@/lib/seo/metadata";

const description =
  "Projetos de dados, IA, machine learning e apps com problema real, código aberto e limitações ditas.";

export const metadata = pageMetadata({ title: "Projetos", description, path: "/projetos" });

export default async function ProjectsPage() {
  const projects = await getProjectSummaries();

  return (
    <Container className="py-16 lg:py-24">
      <p className={eyebrowClass}>Projetos</p>
      <h1 className="mt-3 max-w-3xl text-h1 font-semibold text-balance">
        Projetos com problema real, código aberto e limitações ditas.
      </h1>
      <p className="mt-4 max-w-measure text-body-lg text-muted-foreground">
        Cada estudo de caso mostra o problema, a solução, a stack, os números conferidos no repositório
        e o que ainda falta.
      </p>

      <ProjectFilter projects={projects} />
    </Container>
  );
}
