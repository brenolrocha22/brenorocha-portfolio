"use client";

import { useSyncExternalStore } from "react";
import { ArrowLeft } from "lucide-react";
import { PROJECTS_QUERY_KEY } from "./ProjectExplorer";

function readQuery(): string {
  try {
    const query = sessionStorage.getItem(PROJECTS_QUERY_KEY) ?? "";
    return query.startsWith("?") ? query : "";
  } catch {
    return "";
  }
}

/** "← Todos os projetos": back to /#projetos restoring the last filter (sessionStorage). */
export function BackToProjects({ className }: { className?: string }) {
  const query = useSyncExternalStore(
    () => () => {},
    readQuery,
    () => "",
  );

  return (
    <a href={`/${query}#projetos`} className={className}>
      <ArrowLeft aria-hidden="true" className="size-4" />
      Todos os projetos
    </a>
  );
}
