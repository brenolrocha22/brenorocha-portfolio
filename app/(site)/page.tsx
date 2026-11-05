import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ContactCta } from "@/components/home/ContactCta";
import { Differential } from "@/components/home/Differential";
import { Hero } from "@/components/home/Hero";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Trajectory } from "@/components/home/Trajectory";
import { Container } from "@/components/layout/Container";
import { ProjectList } from "@/components/project/ProjectList";
import { ghostLinkClass } from "@/components/project/styles";
import { JsonLd } from "@/components/seo/JsonLd";
import { getHomeContent } from "@/lib/content/home";
import { getProfile } from "@/lib/content/profile";
import { getFeaturedProjectSummaries } from "@/lib/content/projects";
import { pageMetadata } from "@/lib/seo/metadata";
import { personJsonLd } from "@/lib/seo/person";

const description =
  "Breno Lins Rocha, de Recife/PE: Administração, mais de 5 anos em vendas com metas, KPIs e CRM, e projetos com Python, SQL e IA. Disponível para início imediato.";

export const metadata = pageMetadata({
  title: "Breno Rocha | Dados e IA generativa com Python",
  absoluteTitle: true,
  description,
  path: "/",
});

export default async function HomePage() {
  const home = getHomeContent();
  const profile = getProfile();
  const projects = await getFeaturedProjectSummaries();

  return (
    <>
      <JsonLd data={personJsonLd(profile)} />
      <Hero content={home.hero} profile={profile} />
      <Differential index="01" content={home.differential} />

      <section aria-labelledby="projetos-title">
        <Container className="py-20 lg:py-32">
          <SectionHeading
            id="projetos-title"
            index="02"
            eyebrow={`Projetos em destaque · 01–${String(projects.length).padStart(2, "0")}`}
            title="Problema real, números conferidos"
            action={
              <Link href="/projetos" className={ghostLinkClass}>
                Ver todos os projetos
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            }
          />
          <ProjectList projects={projects} headingLevel="h3" className="mt-12" />
        </Container>
      </section>

      <Trajectory index="03" content={home.trajectory} />
      <ContactCta index="04" content={home.contact} profile={profile} />
    </>
  );
}
