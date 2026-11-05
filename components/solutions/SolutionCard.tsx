import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectLinks } from "@/components/project/ProjectLinks";
import { ghostLinkClass } from "@/components/project/styles";
import type { SolutionView } from "@/lib/content/solutions";
import { cn } from "@/lib/utils";

/** Solution card (design system §3.8): what it solves · how · proof project · CTA. */
export function SolutionCard({ solution }: { solution: SolutionView }) {
  return (
    <article
      id={solution.id}
      className="flex scroll-mt-24 flex-col gap-4 rounded-lg border border-border bg-surface p-6"
    >
      <h2 className="text-h3 font-semibold text-balance">{solution.title}</h2>
      <dl className="flex flex-col gap-3 text-small">
        <div>
          <dt className="font-mono text-mono-xs text-muted-foreground uppercase">Problema</dt>
          <dd className="mt-1 text-foreground">{solution.problem}</dd>
        </div>
        <div>
          <dt className="font-mono text-mono-xs text-muted-foreground uppercase">Como resolvi</dt>
          <dd className="mt-1 text-muted-foreground">{solution.approach}</dd>
        </div>
      </dl>
      <ProjectLinks projects={solution.projects} label="Prova:" />
      <Link href="/contato?assunto=solucao" className={cn(ghostLinkClass, "mt-auto")}>
        Conversar sobre isso
        <span className="sr-only">: {solution.title}</span>
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </article>
  );
}
