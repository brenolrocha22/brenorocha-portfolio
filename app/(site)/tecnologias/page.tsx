import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { primaryButtonClass, secondaryButtonClass } from "@/components/project/styles";
import { SkillGroup } from "@/components/skills/SkillGroup";
import { SkillLegend } from "@/components/skills/SkillLegend";
import { getTechnologies, usedSkillLevels } from "@/lib/content/technologies";
import { pageMetadata } from "@/lib/seo/metadata";

const title = "Tecnologias e competências";
const description =
  "Dados, programação, IA e atendimento: o que Breno Rocha declara no currículo, com nível transparente e link para o projeto que comprova.";

export const metadata = pageMetadata({ title, description, path: "/tecnologias" });

export default async function TechnologiesPage() {
  const technologies = await getTechnologies();

  return (
    <Container className="py-16 lg:py-24">
      <PageHeader eyebrow="Tecnologias" title={title} intro={technologies.intro} />

      <div className="mt-10">
        <SkillLegend levels={usedSkillLevels(technologies)} />
      </div>

      <div className="mt-12 flex flex-col gap-12">
        {technologies.groups.map((group) => (
          <SkillGroup key={group.id} group={group} />
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <Link href="/contato" className={primaryButtonClass}>
          Falar comigo
        </Link>
        <Link href="/projetos" className={secondaryButtonClass}>
          Ver projetos
        </Link>
        <Link href="/certificacoes" className={secondaryButtonClass}>
          Ver certificações
        </Link>
      </div>
    </Container>
  );
}
