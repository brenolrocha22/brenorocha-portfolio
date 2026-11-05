import { ChevronDown } from "lucide-react";
import type { TocItem } from "@/lib/content/toc";

function TocLinks({ items }: { items: TocItem[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className="inline-flex min-h-9 items-center text-small text-muted-foreground transition-colors duration-(--duration-fast) hover:text-foreground"
          >
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Sticky sidebar on desktop; collapsible <details> on mobile (wireframes §3–4). */
export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <>
      <details className="group rounded-lg border border-border bg-surface lg:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 text-small font-medium">
          Nesta página
          <ChevronDown
            aria-hidden="true"
            className="size-4 transition-transform duration-(--duration-fast) group-open:rotate-180"
          />
        </summary>
        <nav aria-label="Nesta página" className="px-4 pb-3">
          <TocLinks items={items} />
        </nav>
      </details>

      <nav aria-label="Sumário" className="sticky top-[calc(var(--header-height)+2rem)] hidden lg:block">
        <p className="font-mono text-mono-xs text-muted-foreground uppercase">Sumário</p>
        <div className="mt-3">
          <TocLinks items={items} />
        </div>
      </nav>
    </>
  );
}
