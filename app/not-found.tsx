import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Página não encontrada",
};

export default function NotFound() {
  return (
    <Container className="py-20 lg:py-32">
      <p className="font-mono text-mono-xs text-muted-foreground uppercase">Erro 404</p>
      <h1 className="mt-4 font-serif text-title font-normal">Página não encontrada</h1>
      <p className="mt-4 max-w-measure text-body-lg text-muted-foreground">
        O endereço pode ter mudado ou não existe.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-md bg-accent px-5 font-medium text-accent-ink transition-colors duration-(--duration-fast) hover:bg-accent-hover"
        >
          Ir para o início
        </Link>
        <Link
          href="/projetos"
          className="inline-flex h-11 items-center rounded-md border border-border-strong px-5 font-medium text-foreground transition-colors duration-(--duration-fast) hover:bg-surface-2"
        >
          Ver projetos
        </Link>
      </div>
    </Container>
  );
}
