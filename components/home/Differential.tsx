import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ghostLinkClass } from "@/components/project/styles";
import type { HomeContent } from "@/lib/content/home";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

export function Differential({ content, index }: { content: HomeContent["differential"]; index: string }) {
  return (
    <section aria-labelledby="diferencial-title">
      <Container className="py-20 lg:py-32">
        <SectionHeading id="diferencial-title" index={index} eyebrow={content.eyebrow} title={content.title} />
        <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          {content.steps.map((step, stepIndex) => (
            <li
              key={step.title}
              className="flex flex-col gap-3 border-t border-border pt-6"
            >
              <span aria-hidden="true" className="font-mono text-mono-xs text-accent">
                ({String(stepIndex + 1).padStart(2, "0")})
              </span>
              <h3 className="font-serif text-h1 leading-tight font-normal">{step.title}</h3>
              <p className="text-small text-muted-foreground">{step.text}</p>
              {step.href ? (
                <Link href={step.href} className={cn(ghostLinkClass, "mt-auto")}>
                  {step.linkLabel ?? "Saiba mais"}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              ) : null}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
