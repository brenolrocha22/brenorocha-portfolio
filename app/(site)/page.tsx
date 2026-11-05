import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ContactCta } from "@/components/home/ContactCta";
import { Differential } from "@/components/home/Differential";
import { Hero } from "@/components/home/Hero";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Trajectory } from "@/components/home/Trajectory";
import { Container } from "@/components/layout/Container";
import { ProjectGrid } from "@/components/project/ProjectGrid";
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
      <Differential content={home.differential} />

      <section aria-labelledby="projetos-title" className="border-b border-border">
        <Container className="py-20 lg:py-32">
          <SectionHeading
            id="projetos-title"
            eyebrow="Projetos em destaque"
            title="Projetos com problema real e números conferidos"
            action={
              <Link href="/projetos" className={ghostLinkClass}>
                Ver todos os projetos
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            }
          />
          <ProjectGrid projects={projects} headingLevel="h3" className="mt-10" />
        </Container>
      </section>

      <Trajectory content={home.trajectory} />
      <ContactCta content={home.contact} profile={profile} />
    </>
  );
}
