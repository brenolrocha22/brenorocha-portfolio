import { ContactCta } from "@/components/home/ContactCta";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { navIndex } from "@/lib/site";
import { SolutionCard } from "@/components/solutions/SolutionCard";
import { getProfile } from "@/lib/content/profile";
import { getSolutions } from "@/lib/content/solutions";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Soluções",
  description:
    "Assistentes que respondem com dados do banco, dashboards, modelos de classificação e apps: problemas que já resolvi, com o projeto que comprova.",
  path: "/solucoes",
});

export default async function SolutionsPage() {
  const content = await getSolutions();
  const profile = getProfile();

  return (
    <>
      <Container className="pt-16 lg:pt-24">
        <PageHeader index={navIndex("/solucoes")} eyebrow={content.eyebrow} title={content.title} intro={content.intro} />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {content.solutions.map((solution) => (
            <SolutionCard key={solution.id} solution={solution} />
          ))}
        </div>
      </Container>
      <ContactCta content={content.cta} profile={profile} />
    </>
  );
}
