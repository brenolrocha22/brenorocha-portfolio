"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, m } from "motion/react";
import { ArrowUpRight, ChevronDown, Expand } from "lucide-react";
import { ImageLightbox, type LightboxImage } from "@/components/ui/ImageLightbox";
import type { DataStory } from "@/lib/content/data-stories";
import { EASE_OUT_EXPO, SPRING_SOFT } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type DataStoryView = DataStory & {
  links: { demoUrl?: string; caseStudyHref?: string; repoUrl?: string };
};

type StoryImage = DataStory["images"][number];

const actionClass =
  "inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-border-strong bg-veil px-3 text-small font-medium text-foreground transition-colors duration-(--duration-fast) hover:border-accent hover:text-accent";

function toLightbox(story: DataStory, image: StoryImage): LightboxImage {
  return { ...image, title: `${story.title} — ${image.label}` };
}

function Frame({ image, sizes, className }: { image: StoryImage; sizes: string; className?: string }) {
  return (
    <div className={cn("relative aspect-[16/10] overflow-hidden", image.mat === "paper" ? "bg-paper" : "bg-surface-2", className)}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        className={cn(image.mat === "paper" ? "object-contain p-3" : "object-cover object-top")}
      />
    </div>
  );
}

function ImageTabs({
  story,
  current,
  onSelect,
  layoutId,
}: {
  story: DataStory;
  current: number;
  onSelect: (index: number) => void;
  layoutId: string;
}) {
  if (story.images.length < 2) return null;
  return (
    <div role="group" aria-label={`Imagens: ${story.title}`} className="flex flex-wrap gap-1">
      {story.images.map((image, index) => (
        <button
          key={image.src}
          type="button"
          aria-pressed={index === current}
          onClick={() => onSelect(index)}
          className={cn(
            "relative inline-flex min-h-11 items-center px-3 font-mono text-mono-xs uppercase transition-colors duration-(--duration-fast)",
            index === current ? "text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {image.label}
          {index === current ? (
            <m.span
              layoutId={layoutId}
              transition={SPRING_SOFT}
              aria-hidden="true"
              className="absolute inset-x-2 bottom-1.5 h-0.5 rounded-full bg-accent"
            />
          ) : null}
        </button>
      ))}
    </div>
  );
}

function HowICalculated({ story }: { story: DataStory }) {
  if (story.code.length === 0) return null;
  return (
    <details className="group mt-5 rounded-md border border-border bg-surface">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 px-4 text-small font-medium">
        Como calculei
        <ChevronDown
          aria-hidden="true"
          className="size-4 transition-transform duration-(--duration-fast) group-open:rotate-180"
        />
      </summary>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 border-t border-border px-4 py-4">
        {story.code.map((block) => (
          <figure key={block.href} className="min-w-0">
            <figcaption className="flex flex-wrap items-center justify-between gap-2 font-mono text-mono-xs text-muted-foreground">
              {block.title}
              <a
                href={block.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center gap-1 text-accent underline-offset-4 hover:underline"
              >
                ver no repo
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </figcaption>
            <pre
              tabIndex={0}
              aria-label={`Código: ${block.title}`}
              className="mt-2 max-h-80 overflow-auto rounded-sm border border-border bg-background p-3 font-mono text-[0.75rem] leading-relaxed text-foreground"
            >
              <code>{block.code}</code>
            </pre>
          </figure>
        ))}
        {story.codeNote ? <p className="text-small text-muted-foreground">{story.codeNote}</p> : null}
      </div>
    </details>
  );
}

function StoryText({
  story,
  onOpen,
  headingLevel = "h3",
}: {
  story: DataStoryView;
  onOpen: () => void;
  headingLevel?: "h3";
}) {
  const Heading = headingLevel;
  return (
    <>
      <ul aria-label="Ferramentas" className="flex flex-wrap gap-1.5">
        {story.tools.map((tool) => (
          <li key={tool} className="rounded-sm border border-border-strong px-2 py-0.5 font-mono text-mono-xs text-data uppercase">
            {tool}
          </li>
        ))}
        {story.note ? (
          <li className="rounded-sm bg-surface-2 px-2 py-0.5 font-mono text-mono-xs text-muted-foreground uppercase">
            {story.note}
          </li>
        ) : null}
      </ul>
      <Heading className="mt-4 text-h3 font-semibold text-foreground">{story.title}</Heading>
      <dl className="mt-4 grid gap-4">
        <div>
          <dt className="font-mono text-mono-xs text-accent uppercase">Pergunta</dt>
          <dd className="mt-1 text-body-lg text-foreground">{story.question}</dd>
        </div>
        <div>
          <dt className="font-mono text-mono-xs text-accent uppercase">O dado mostrou</dt>
          <dd>
            <ul className="mt-1 grid gap-1.5 text-body text-muted-foreground">
              {story.shown.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="text-data">
                    ▸
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </dd>
        </div>
        {story.reading ? (
          <div>
            <dt className="font-mono text-mono-xs text-accent uppercase">Leitura</dt>
            <dd className="mt-1 text-body text-foreground">{story.reading}</dd>
          </div>
        ) : null}
      </dl>
      <HowICalculated story={story} />
      <div className="mt-5 flex flex-wrap gap-2">
        {story.links.demoUrl ? (
          <a href={story.links.demoUrl} target="_blank" rel="noopener noreferrer" className={actionClass}>
            Abrir dashboard
            <ArrowUpRight aria-hidden="true" className="size-4" />
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        ) : null}
        <button type="button" onClick={onOpen} className={actionClass}>
          <Expand aria-hidden="true" className="size-4" />
          Ver imagem inteira
        </button>
        {story.links.caseStudyHref ? (
          <Link href={story.links.caseStudyHref} className={actionClass}>
            Estudo de caso
          </Link>
        ) : null}
        {story.links.repoUrl ? (
          <a href={story.links.repoUrl} target="_blank" rel="noopener noreferrer" className={actionClass}>
            Código
            <ArrowUpRight aria-hidden="true" className="size-4" />
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        ) : null}
      </div>
    </>
  );
}

/** Mobile/tablet carousel (scroll-snap) above each story's text. */
function Carousel({ story, onOpen }: { story: DataStory; onOpen: (index: number) => void }) {
  return (
    <ul
      tabIndex={0}
      aria-label={`Imagens: ${story.title} (role para o lado)`}
      className={cn(
        "-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 lg:hidden",
        story.images.length > 1 && "scroll-fade-x",
      )}
    >
      {story.images.map((image, index) => (
        <li key={image.src} className={cn("shrink-0 snap-center", story.images.length > 1 ? "w-[88%]" : "w-full")}>
          <button
            type="button"
            onClick={() => onOpen(index)}
            className="block w-full overflow-hidden rounded-md border border-border text-left"
          >
            <Frame image={image} sizes="(max-width: 1024px) 90vw, 1px" />
            <span className="flex items-center justify-between border-t border-border bg-surface px-3 py-2 font-mono text-mono-xs text-muted-foreground uppercase">
              {image.label}
              <Expand aria-hidden="true" className="size-3.5" />
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/**
 * #dados storytelling (spec §4.2, correções 1, 2 e 7). Desktop: sticky "screen" with the
 * active step's image; inactive steps keep full opacity, only the active one gets the side
 * bar. Mobile: each story is a card with its own image carousel.
 */
export function DataStories({ stories }: { stories: DataStoryView[] }) {
  const main = stories.filter((story) => !story.compact);
  const compact = stories.filter((story) => story.compact);
  const [activeId, setActiveId] = useState(main[0]?.id ?? "");
  const [imageIndex, setImageIndex] = useState<Record<string, number>>({});
  const [lightbox, setLightbox] = useState<LightboxImage | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const stepRefs = useRef(new Map<string, HTMLElement>());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (hit) setActiveId((hit.target as HTMLElement).dataset.story ?? "");
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    stepRefs.current.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const active = main.find((story) => story.id === activeId) ?? main[0];
  const activeIndex = active ? (imageIndex[active.id] ?? 0) : 0;
  const activeImage = active?.images[activeIndex] ?? active?.images[0];

  function open(story: DataStory, index: number) {
    const image = story.images[index];
    if (!image) return;
    triggerRef.current = document.activeElement as HTMLElement | null;
    setLightbox(toLightbox(story, image));
  }

  return (
    <>
      <div className="lg:grid lg:grid-cols-12 lg:gap-10">
        <div className="hidden lg:col-span-7 lg:block">
          {active && activeImage ? (
            <div className="sticky top-[calc(var(--header-height)+24px)]">
              <div className="overflow-hidden rounded-lg border border-border-strong bg-surface shadow-card">
                <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
                  <p className="font-mono text-mono-xs text-muted-foreground uppercase">{active.title}</p>
                  <button
                    type="button"
                    onClick={() => open(active, activeIndex)}
                    className="inline-flex min-h-9 items-center gap-1.5 text-small text-accent hover:underline"
                  >
                    <Expand aria-hidden="true" className="size-4" />
                    Ver imagem inteira
                  </button>
                </div>
                <div className="relative aspect-[16/10]">
                  <AnimatePresence initial={false}>
                    <m.div
                      key={activeImage.src}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                      className="absolute inset-0"
                    >
                      <Frame image={activeImage} sizes="(min-width: 1280px) 680px, 58vw" className="h-full" />
                    </m.div>
                  </AnimatePresence>
                </div>
              </div>
              <div className="mt-2">
                <ImageTabs
                  story={active}
                  current={activeIndex}
                  layoutId="data-tab"
                  onSelect={(index) => setImageIndex((state) => ({ ...state, [active.id]: index }))}
                />
              </div>
            </div>
          ) : null}
        </div>

        <ol className="flex flex-col gap-14 lg:col-span-5 lg:gap-0">
          {main.map((story) => {
            const isActive = story.id === active?.id;
            return (
              <li
                key={story.id}
                data-story={story.id}
                ref={(element) => {
                  if (element) stepRefs.current.set(story.id, element);
                  else stepRefs.current.delete(story.id);
                }}
                className="lg:flex lg:min-h-[75svh] lg:items-center"
              >
                <article
                  id={`dados-${story.id}`}
                  aria-label={story.title}
                  className={cn(
                    "w-full scroll-mt-[calc(var(--header-height)+24px)] rounded-lg border border-border bg-veil p-5 transition-[border-color,box-shadow] duration-(--duration-base) lg:border-l-[3px]",
                    isActive ? "lg:border-l-accent lg:shadow-glow-sm" : "lg:border-l-transparent",
                  )}
                >
                  <Carousel story={story} onOpen={(index) => open(story, index)} />
                  <div className="mt-5 lg:mt-0">
                    <StoryText story={story} onOpen={() => open(story, imageIndex[story.id] ?? 0)} />
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>

      {compact.length > 0 ? (
        <ul className="mt-14 grid gap-6 md:grid-cols-2">
          {compact.map((story) => (
            <li key={story.id}>
              <article
                id={`dados-${story.id}`}
                aria-label={story.title}
                className="h-full scroll-mt-[calc(var(--header-height)+24px)] overflow-hidden rounded-lg border border-border bg-veil">
                <button type="button" onClick={() => open(story, 0)} className="block w-full">
                  {story.images[0] ? <Frame image={story.images[0]} sizes="(min-width: 768px) 50vw, 100vw" /> : null}
                  <span className="sr-only">Ver imagem inteira: {story.title}</span>
                </button>
                <div className="p-5">
                  <StoryText story={story} onOpen={() => open(story, 0)} />
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : null}

      <ImageLightbox
        image={lightbox}
        onClose={() => {
          setLightbox(null);
          triggerRef.current?.focus();
        }}
      />
    </>
  );
}
