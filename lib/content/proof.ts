import { firstStudyYear, validatedHours } from "./certifications";
import { getDataStories } from "./data-stories";
import { getProjectSummaries } from "./projects";

export type Focus = "dados" | "dev";

export type ProofTile = {
  id: string;
  /** Final value rendered by the server; the client may animate up to it (cosmetic). */
  value: number;
  prefix?: string;
  suffix?: string;
  /** false for values that make no sense counted up (years). */
  countUp: boolean;
  label: string;
  href: string;
};

/** Proof-bar tiles (4 per focus), always computed from the content, never typed in a component. */
export async function getProofTiles(focus: Focus): Promise<ProofTile[]> {
  const projects = await getProjectSummaries();
  const publicRepos = projects.filter((project) => project.repoUrl).length;
  const demos = projects.filter((project) => project.demoUrl && project.repoUrl).length;
  const tests = projects.reduce((total, project) => total + (project.repoUrl ? (project.testsCount ?? 0) : 0), 0);
  const dashboards = getDataStories().reduce((total, story) => total + story.dashboards, 0);
  const query = focus === "dev" ? "?foco=dev&" : "?";

  const tiles: Record<string, ProofTile> = {
    dashboards: { id: "dashboards", value: dashboards, countUp: true, label: "dashboards publicados", href: "#dados" },
    hours: {
      id: "hours",
      value: validatedHours(),
      suffix: " h",
      countUp: true,
      label: "em certificados validados por código",
      href: "#certificados",
    },
    since: {
      id: "since",
      value: firstStudyYear(),
      prefix: "desde ",
      countUp: false,
      label: "estudando dados e programação",
      href: "#trajetoria",
    },
    repos: { id: "repos", value: publicRepos, countUp: true, label: "projetos públicos no GitHub", href: "#projetos" },
    demos: { id: "demos", value: demos, countUp: true, label: "demos online", href: `/${query}selo=demo#projetos` },
    tests: {
      id: "tests",
      value: tests,
      countUp: true,
      label: "testes automatizados em repositórios públicos",
      href: `/${query}selo=testes#projetos`,
    },
  };

  const order = focus === "dev" ? ["demos", "tests", "hours", "repos"] : ["dashboards", "hours", "since", "repos"];
  return order.map((id) => tiles[id]!);
}

export async function getPublicRepoCount(): Promise<number> {
  return (await getProjectSummaries()).filter((project) => project.repoUrl).length;
}
