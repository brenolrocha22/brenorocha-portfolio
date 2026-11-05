// Pure filter logic and labels (no fs): shared by the server page and the client explorer.
import type { ProjectBadge, ProjectLanguage, ProjectStorage, ProjectType } from "./schemas";

export const typeLabels: Record<ProjectType, string> = {
  dados: "Dados & Dashboards",
  ml: "Machine Learning",
  planilhas: "Planilhas (Excel)",
  ia: "Agentes de IA & RAG",
  web: "Web & Front-end",
  automacao: "Automação & Ferramentas",
};

/** Chip order with the default/data focus and with ?foco=dev. */
export const typeOrder: Record<"dados" | "dev", readonly ProjectType[]> = {
  dados: ["dados", "ml", "planilhas", "ia", "web", "automacao"],
  dev: ["web", "ia", "automacao", "dados", "ml", "planilhas"],
};

export const languageLabels: Record<ProjectLanguage, string> = {
  python: "Python",
  typescript: "TypeScript",
  javascript: "JavaScript",
  sql: "SQL",
  "excel-dax": "Excel/DAX",
};

export const storageLabels: Record<ProjectStorage, string> = {
  sqlite: "SQLite",
  chromadb: "ChromaDB (vetorial)",
  arquivos: "Arquivos (CSV/XLSX/JSON)",
};

export const badgeLabels: Record<ProjectBadge, string> = {
  demo: "Demo ao vivo",
  testes: "Com testes",
  docker: "Docker",
};

export type FilterState = {
  tipo: ProjectType | null;
  lang: ProjectLanguage[];
  banco: ProjectStorage[];
  selo: ProjectBadge[];
  /** Technology id from content/technologies.json (set by the #tecnologias chips). */
  tech: string | null;
};

export const emptyFilters: FilterState = { tipo: null, lang: [], banco: [], selo: [], tech: null };

export type FilterableProject = {
  slug: string;
  types: readonly ProjectType[];
  languages: readonly ProjectLanguage[];
  storage: readonly ProjectStorage[];
  badges: readonly ProjectBadge[];
};

function anyOf<T>(selected: readonly T[], values: readonly T[]): boolean {
  return selected.length === 0 || selected.some((value) => values.includes(value));
}

/** OR inside a group, AND between groups. `techSlugs` = projects proving the selected technology. */
export function matchesFilters(
  project: FilterableProject,
  state: FilterState,
  techSlugs: readonly string[] | null,
): boolean {
  return (
    (state.tipo === null || project.types.includes(state.tipo)) &&
    anyOf(state.lang, project.languages) &&
    anyOf(state.banco, project.storage) &&
    anyOf(state.selo, project.badges) &&
    (techSlugs === null || techSlugs.includes(project.slug))
  );
}

function pick<T extends string>(raw: string | string[] | undefined, allowed: readonly T[]): T[] {
  const value = Array.isArray(raw) ? raw.join(",") : (raw ?? "");
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item): item is T => (allowed as readonly string[]).includes(item));
}

export function parseFilters(
  params: Record<string, string | string[] | undefined>,
  allowed: {
    types: readonly ProjectType[];
    languages: readonly ProjectLanguage[];
    storages: readonly ProjectStorage[];
    badges: readonly ProjectBadge[];
    techIds: readonly string[];
  },
): FilterState {
  const tech = pick(params.tech, allowed.techIds)[0] ?? null;
  return {
    tipo: pick(params.tipo, allowed.types)[0] ?? null,
    lang: pick(params.lang, allowed.languages),
    banco: pick(params.banco, allowed.storages),
    selo: pick(params.selo, allowed.badges),
    tech,
  };
}

/** Writes the filter state into a query string, keeping unrelated params (e.g. ?foco). */
export function filtersToSearch(current: string, state: FilterState): string {
  const params = new URLSearchParams(current);
  const set = (key: string, value: string | null) => (value ? params.set(key, value) : params.delete(key));
  set("tipo", state.tipo);
  set("lang", state.lang.join(",") || null);
  set("banco", state.banco.join(",") || null);
  set("selo", state.selo.join(",") || null);
  set("tech", state.tech);
  const query = params.toString();
  return query ? `?${query}` : "";
}
