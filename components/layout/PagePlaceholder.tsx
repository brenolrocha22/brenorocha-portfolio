import type { ReactNode } from "react";
import { Container } from "./Container";

type PagePlaceholderProps = {
  title: ReactNode;
  eyebrow?: string;
};

/** Minimal page shell used until each page is implemented (deliveries 2–5). */
export function PagePlaceholder({ title, eyebrow }: PagePlaceholderProps) {
  return (
    <Container className="py-20 lg:py-32">
      {eyebrow ? (
        <p className="font-mono text-mono-xs text-muted-foreground uppercase">{eyebrow}</p>
      ) : null}
      <h1 className="mt-3 max-w-4xl font-serif text-title font-normal text-balance">{title}</h1>
      <p className="mt-6 font-mono text-mono-xs text-muted-foreground uppercase">
        Página em construção
      </p>
    </Container>
  );
}
