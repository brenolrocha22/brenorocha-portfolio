import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ghostLinkClass } from "@/components/project/styles";
import type { AboutContent } from "@/lib/content/about";

/** The 5-block narrative (design system §1.6). */
export function AboutNarrative({ blocks }: { blocks: AboutContent["narrative"] }) {
  return (
    <ol className="flex flex-col gap-8">
      {blocks.map((block, index) => (
        <li key={block.title} className="grid gap-2 sm:grid-cols-[3rem_1fr]">
          <span aria-hidden="true" className="font-mono text-mono-xs text-accent sm:pt-1.5">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h2 className="text-h3 font-semibold">{block.title}</h2>
            <p className="mt-2 max-w-measure text-body text-muted-foreground">{block.text}</p>
            {block.href ? (
              <Link href={block.href} className={ghostLinkClass}>
                {block.linkLabel ?? "Saiba mais"}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
