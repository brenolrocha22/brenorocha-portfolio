import Link from "next/link";
import { AboutExperience } from "@/components/about/AboutExperience";
import { AboutNarrative } from "@/components/about/AboutNarrative";
import { AboutTimeline } from "@/components/about/AboutTimeline";
import { HowIWork } from "@/components/about/HowIWork";
import { Portrait } from "@/components/home/Portrait";
import { Container } from "@/components/layout/Container";
import { eyebrowClass, primaryButtonClass, secondaryButtonClass } from "@/components/project/styles";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAboutContent } from "@/lib/content/about";
import { getProfile } from "@/lib/content/profile";
import { pageMetadata } from "@/lib/seo/metadata";
import { personJsonLd } from "@/lib/seo/person";

export const metadata = pageMetadata({
  title: "Sobre",
  socialTitle: "Sobre Breno Rocha",
  description:
    "Breno Lins Rocha, de Recife/PE: Administração, vendas B2B e inside sales em inglês para empresa dos EUA, em transição para dados e IA. Disponível para início imediato.",
  path: "/sobre",
});

export default function AboutPage() {
  const about = getAboutContent();

  return (
    <Container className="py-16 lg:py-24">
      <JsonLd data={personJsonLd(getProfile())} />
      <header className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
        <Portrait />
        <div>
          <p className={eyebrowClass}>{about.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-h1 font-semibold text-balance">{about.title}</h1>
          <p className="mt-3 font-mono text-mono-xs text-muted-foreground uppercase">{about.subtitle}</p>
          <p className="mt-4 max-w-measure text-body-lg text-muted-foreground">{about.summary}</p>
        </div>
      </header>

      <div className="mt-16 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <AboutNarrative blocks={about.narrative} />
        </div>
        <div className="lg:col-span-4">
          <HowIWork content={about.howIWork} />
        </div>
      </div>

      <div className="mt-20">
        <AboutExperience content={about.experience} />
      </div>

      <div className="mt-20">
        <AboutTimeline content={about.timeline} />
      </div>

      <div className="mt-16 flex flex-col gap-3 sm:flex-row">
        <Link href="/contato" className={primaryButtonClass}>
          Falar comigo
        </Link>
        <Link href="/projetos" className={secondaryButtonClass}>
          Ver projetos
        </Link>
      </div>
    </Container>
  );
}
