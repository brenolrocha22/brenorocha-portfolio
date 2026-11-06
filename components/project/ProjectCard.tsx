"use client";

import { useRef, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { m, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight, Container as ContainerIcon, FlaskConical, Radio } from "lucide-react";
import { badgeLabels, languageLabels, typeLabels } from "@/lib/content/project-filters";
import type { ProjectSummary } from "@/lib/content/projects";
import type { ProjectBadge, ProjectType } from "@/lib/content/schemas";
import { SPRING_SOFT } from "@/lib/motion";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/use-copy";
import { cn } from "@/lib/utils";

export type ProjectCardData = Pick<
  ProjectSummary,
  | "slug"
  | "title"
  | "cardTitle"
  | "problem"
  | "proof"
  | "types"
  | "languages"
  | "storage"
  | "badges"
  | "cover"
  | "caseStudy"
  | "repoUrl"
  | "demoUrl"
  | "status"
>;

const typeDot: Record<ProjectType, string> = {
  ia: "bg-type-ia",
  dados: "bg-type-dados",
  ml: "bg-type-ml",
  web: "bg-type-web",
  automacao: "bg-type-automacao",
  planilhas: "bg-type-planilhas",
};

const badgeIcons: Record<ProjectBadge, typeof Radio> = {
  demo: Radio,
  testes: FlaskConical,
  docker: ContainerIcon,
};

const TILT_MAX = 4;

const actionClass =
  "inline-flex min-h-10 items-center gap-1 rounded-sm border border-border-strong px-2.5 text-small text-foreground transition-colors duration-(--duration-fast) hover:border-accent hover:text-accent";

function Cover({ project, large }: { project: ProjectCardData; large: boolean }) {
  const cover = project.cover;
  if ("typographic" in cover) {
    return (
      <div aria-hidden="true" className="relative flex h-full flex-col justify-center gap-2 bg-surface-2 p-5">
        <div className="absolute inset-0 bg-tech-grid opacity-80 [--grid-size:24px]" />
        {cover.lines.map((line) => (
          <p key={line} className="relative font-mono text-mono-xs break-words text-data normal-case">
            {line}
          </p>
        ))}
      </div>
    );
  }
  return (
    <div className={cn("relative h-full", cover.mat === "paper" ? "bg-paper" : "bg-surface-2")}>
      <Image
        src={cover.src}
        alt={cover.alt}
        fill
        sizes={large ? "(min-width: 1024px) 560px, (min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 370px, (min-width: 640px) 50vw, 100vw"}
        className={cn(
          "transition-transform duration-[400ms] ease-out-expo group-hover:scale-[1.04] motion-reduce:group-hover:scale-100",
          cover.fit === "contain" ? "object-contain p-3" : "object-cover object-top",
        )}
      />
    </div>
  );
}

/**
 * Project card (spec §4.2.3): cover 16:10, main-type badge, problem, proof and actions.
 * Tilt and inner spotlight only with a fine pointer and without reduced motion.
 */
export function ProjectCard({ project, large = false }: { project: ProjectCardData; large?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = usePrefersReducedMotion();
  const tilt = fine && !reduced;
  const rotateX = useSpring(useMotionValue(0), SPRING_SOFT);
  const rotateY = useSpring(useMotionValue(0), SPRING_SOFT);

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    if (!tilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    ref.current.style.setProperty("--mx", `${x * 100}%`);
    ref.current.style.setProperty("--my", `${y * 100}%`);
    rotateY.set((x - 0.5) * 2 * TILT_MAX);
    rotateX.set((0.5 - y) * 2 * TILT_MAX);
  }

  function onPointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  const mainType = project.types[0];
  const title = project.cardTitle ?? project.title;
  const caseHref = project.caseStudy ? `/projetos/${project.slug}` : null;
  const extraLanguages = project.languages.length - 3;

  return (
    <m.article
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      whileTap={{ scale: 0.98 }}
      style={tilt ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-veil transition-[border-color,box-shadow,translate] duration-(--duration-base) hover:-translate-y-1 hover:border-accent-line hover:shadow-glow-md focus-within:border-accent-line motion-reduce:hover:translate-y-0"
    >
      <div className={cn("relative overflow-hidden border-b border-border", large ? "aspect-[16/10] lg:aspect-[16/9]" : "aspect-[16/10]")}>
        <Cover project={project} large={large} />
        {mainType ? (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-sm border border-border-strong bg-background/85 px-2 py-0.5 font-mono text-mono-xs text-foreground uppercase">
            <span aria-hidden="true" className={cn("size-2 rounded-full", typeDot[mainType])} />
            {typeLabels[mainType]}
          </span>
        ) : null}
        {project.status === "prototipo" ? (
          <span className="absolute top-3 right-3 rounded-sm bg-background/85 px-2 py-0.5 font-mono text-mono-xs text-muted-foreground uppercase">
            protótipo
          </span>
        ) : null}
      </div>

      {tilt ? (
        <span
          aria-hidden="true"
          className="card-spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-(--duration-base) group-hover:opacity-100"
        />
      ) : null}

      <div className="relative flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-h3 font-semibold text-foreground">
          {caseHref ? (
            <Link href={caseHref} className="underline-offset-4 hover:underline">
              {title}
            </Link>
          ) : project.repoUrl ? (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
              {title}
              <span className="sr-only"> (código no GitHub, abre em nova aba)</span>
            </a>
          ) : (
            title
          )}
        </h3>
        <p className="line-clamp-2 text-small text-muted-foreground">{project.problem}</p>
        <p className="font-mono text-mono-xs text-data">
          <span aria-hidden="true">▸ </span>
          {project.proof}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-2">
          <ul aria-label="Linguagens" className="flex flex-wrap gap-1.5">
            {project.languages.slice(0, 3).map((language) => (
              <li key={language} className="rounded-sm border border-border px-1.5 py-0.5 font-mono text-mono-xs text-muted-foreground">
                {languageLabels[language]}
              </li>
            ))}
            {extraLanguages > 0 ? (
              <li className="px-1 py-0.5 font-mono text-mono-xs text-muted-foreground">+{extraLanguages}</li>
            ) : null}
          </ul>
          {project.badges.length > 0 ? (
            <ul aria-label="Selos" className="flex flex-wrap gap-2">
              {project.badges.map((badge) => {
                const Icon = badgeIcons[badge];
                return (
                  <li key={badge} className="inline-flex items-center gap-1 text-mono-xs text-success">
                    <Icon aria-hidden="true" className="size-3.5" />
                    {badgeLabels[badge]}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border pt-3">
          {caseHref ? (
            <Link href={caseHref} className={actionClass}>
              Estudo de caso
            </Link>
          ) : null}
          {project.demoUrl ? (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={actionClass}>
              Abrir demo
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          ) : null}
          {project.repoUrl ? (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className={actionClass}>
              Código
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          ) : (
            <span className="inline-flex min-h-10 items-center px-1 text-small text-muted-foreground">Código em breve</span>
          )}
        </div>
      </div>
    </m.article>
  );
}
